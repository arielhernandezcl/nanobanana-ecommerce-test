import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userImage, productImage, productImageMimeType, accessories } =
      await req.json();

    if (!userImage || !productImage || !productImageMimeType) {
      return NextResponse.json(
        { error: "Faltan imágenes de entrada o el tipo MIME." },
        { status: 400 }
      );
    }

    const config = {
      responseModalities: ["IMAGE"],
    };

    const model = "gemini-2.5-flash-image-preview";
    const parts: any[] = [
      {
        text: `Replace the t-shirt the person in the first image is wearing with the t-shirt from the second image. Additionally, add the following accessory or accessories to the final image, ensuring a realistic and seamless integration.`,
      },
      { inlineData: { data: userImage, mimeType: "image/jpeg" } },
      {
        inlineData: { data: productImage, mimeType: productImageMimeType },
      },
    ];

    if (accessories && accessories.length > 0) {
      accessories.forEach((accessory: any) => {
        parts.push({
          inlineData: { data: accessory.data, mimeType: accessory.mimeType },
        });
      });
    }

    const contents = [
      {
        role: "user",
        parts: parts,
      },
    ];

    const responseStream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let generatedContentData: string | undefined;
    let generatedContentMimeType: string | undefined;

    for await (const chunk of responseStream) {
      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        generatedContentData =
          chunk.candidates[0].content.parts[0].inlineData.data;
        generatedContentMimeType =
          chunk.candidates[0].content.parts[0].inlineData.mimeType;
        break;
      }
    }

    if (!generatedContentData || !generatedContentMimeType) {
      return NextResponse.json(
        { error: "No se pudo generar la imagen de prueba virtual." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageUrl: `data:${generatedContentMimeType};base64,${generatedContentData}`,
    });
  } catch (error: any) {
    console.error("Error al generar la imagen:", error);
    return NextResponse.json(
      { error: `Error interno del servidor: ${error.message}` },
      { status: 500 }
    );
  }
}
