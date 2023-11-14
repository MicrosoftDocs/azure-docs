---
title: How to incorporate images into prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Learn how to incorporate images into prompt flow.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.topic: how-to
---

# How to incorporate images into prompt flow (preview)
Multimodal Large Language Models(LLMs), which can process and interpret diverse forms of data inputs, present a powerful tool that can elevate the capabilities of language-only systems to new heights. Among the various data types, images are particularly important for many real-world applications. The incorporation of image data into AI systems provides an essential layer of visual understanding. 

In this article, you'll learn:
> [!div class="checklist"]
> * How to use image data in prompt flow
> * How to use built-in GPT-4V tool to analyze image inputs.
> * How to build a chatbot that can process image and text inputs.
> * How to create a batch run using image data.  

> [!IMPORTANT]
> Prompt flow image support is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Image type in prompt flow

Prompt flow input and output supports Image as a new data type. 

To use image data in prompt flow authoring page:
1. Add a flow input, select the data type as **Image**. You can upload, or drag and drop an image file, paste an image from clipboard, or specify an image URL or the relative image path in the flow folder.
   :::image type="content" source="./media/how-to-use-image-in-promptflow/add_image_type_input.png" alt-text="Screenshot of flow authoring page showing adding flow input as Image type" lightbox = "./media/how-to-use-image-in-promptflow/add_image_type_input.png":::
1. Preview the image. If the image is not displayed correctly, delete the image and add it again. 
      :::image type="content" source="./media/how-to-use-image-in-promptflow/flow-input-image-preview.png" alt-text="Screenshot of flow authoring page showing image preview flow input." lightbox = "./media/how-to-use-image-in-promptflow/flow-input-image-preview.png":::
2. You might want to **preprocess the image using Python tool** before feeding it to LLM, for example, you can resize or crop the image to a smaller size. 
   :::image type="content" source="./media/how-to-use-image-in-promptflow/process-image-using-python.png" alt-text="Using python tool to do image preprocessing." lightbox = "./media/how-to-use-image-in-promptflow/process-image-using-python.png":::
> [!IMPORTANT]
> To process image using Python function, you need to use the `Image` class, import it from `promptflow.contracts.multimedia` package. The Image class is used to represent an Image type within prompt flow. It is designed to work with image data in byte format, which is convenient when you need to handle or manipulate the image data directly.
>
> To return the processed image data, you need to use the `Image` class to wrap the image data. Create an `Image` object by providing the image data in bytes and the MIME type `mime_type`. The MIME type lets the system understand the format of the image data. Without it, the system cannot correctly interpret the image data.
4. Run the Python node and check the output. In this example, the Python function returns the processed Image object. Click the image output to preview the image.
   :::image type="content" source="./media/how-to-use-image-in-promptflow/python-node-image-output.png" alt-text="Python node image output." lightbox = "./media/how-to-use-image-in-promptflow/python-node-image-output.png"::: 
If the Image object from Python node is set as the flow output, you can preview the image in the flow output page as well.

## Use GPT-4V tool
GPT-4V is a built-in tool in prompt flow that can use OpenAI GPT-4V model to answer questions based on input images.

Add the GPT-4V tool to the flow. Make sure you have an AOAI connection, with the availability of GPT-4V deployments.
   :::image type="content" source="./media/how-to-use-image-in-promptflow/gpt-4v-tool.png" alt-text="GPT-4V tool." lightbox = "./media/how-to-use-image-in-promptflow/gpt-4v-tool.png":::

The Jinja template for composing prompts in the GPT-4V tool follows a similar structure to the chat API in the LLM tool. To represent an image input within your prompt, you can use the syntax `![image]({{INPUT NAME}})`. Image input can be passed in the `user`, `system` and `assistant` messages.

Once you've composed the prompt, click the **Validate and parse input** button to parse the input placeholders. The image input represented by `![image]({{INPUT NAME}})` will be parsed as image type with the input name as INPUT NAME. 

You can assign a value to the image input through the following ways:
- Reference from the flow input of Image type.
- Reference from other node's output of Image type.
- Upload, drag, paste an image, or specify an image URL or the relative image path.

## Image as chat input in chat flow

## Create a batch run using image data

 