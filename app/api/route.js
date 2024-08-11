import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN;
const inference = new HfInference(HF_TOKEN);

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    const formData = await request.formData();

    if (type === "imgtt") {
      const imageFile = formData.get("file");

      if (!imageFile) {
        return new NextResponse("No image file found in the request", {
          status: 400,
        });
      }

      const out = await inference.imageToText({
        data: imageFile,
        model: "Salesforce/blip-image-captioning-base",
      });

      return NextResponse.json(out);
    } else if (type === "recipe") {
      const ingredients_list = formData.get("ingredient");
      const input_text = `Ingredients: ${ingredients_list}`;

      const out = await inference.textGeneration({
        model: "flax-community/t5-recipe-generation",
        inputs: input_text,
        parameters: { max_length: 400, num_return_sequences: 1 },
      });

      return NextResponse.json(out);
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Invalid type parameter" }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("There is an error: ", error);
    return new NextResponse(`Internal Server Error: ${error.message}`, {
      status: 500,
    });
  }
}
