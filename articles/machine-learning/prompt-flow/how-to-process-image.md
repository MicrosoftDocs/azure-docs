---
title: Incorporate images into prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Learn how to incorporate images into prompt flow.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.topic: how-to
ms.author: jinzhong
author: zhongj
ms.reviewer: lagayhar
ms.date: 12/18/2023
---

# Incorporate images into prompt flow (preview)

Multimodal Large Language Models (LLMs), which can process and interpret diverse forms of data inputs, present a powerful tool that can elevate the capabilities of language-only systems to new heights. Among the various data types, images are important for many real-world applications. The incorporation of image data into AI systems provides an essential layer of visual understanding. 

In this article, you'll learn:
> [!div class="checklist"]
> - How to use image data in prompt flow
> - How to use built-in GPT-4V tool to analyze image inputs.
> - How to build a chatbot that can process image and text inputs.
> - How to create a batch run using image data.  
> - How to consume online endpoint with image data.

> [!IMPORTANT]
> Prompt flow image support is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Image type in prompt flow

Prompt flow input and output support Image as a new data type.

To use image data in prompt flow authoring page:

1. Add a flow input, select the data type as **Image**. You can upload, drag and drop an image file, paste an image from clipboard, or specify an image URL or the relative image path in the flow folder.
   :::image type="content" source="./media/how-to-process-image/add-image-type-input.png" alt-text="Screenshot of flow authoring page showing adding flow input as Image type." lightbox = "./media/how-to-process-image/add-image-type-input.png":::
2. Preview the image. If the image isn't displayed correctly, delete the image and add it again.
   :::image type="content" source="./media/how-to-process-image/flow-input-image-preview.png" alt-text="Screenshot of flow authoring page showing image preview flow input." lightbox = "./media/how-to-process-image/flow-input-image-preview.png":::
3. You might want to **preprocess the image using Python tool** before feeding it to LLM, for example, you can resize or crop the image to a smaller size.
   :::image type="content" source="./media/how-to-process-image/process-image-using-python.png" alt-text="Screenshot of using python tool to do image preprocessing." lightbox = "./media/how-to-process-image/process-image-using-python.png":::
    > [!IMPORTANT]
    > To process image using Python function, you need to use the `Image` class, import it from `promptflow.contracts.multimedia` package. The Image class is used to represent an Image type within prompt flow. It is designed to work with image data in byte format, which is convenient when you need to handle or manipulate the image data directly.
    >
    > To return the processed image data, you need to use the `Image` class to wrap the image data. Create an `Image` object by providing the image data in bytes and the [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types) `mime_type`. The MIME type lets the system understand the format of the image data, or it can be `*` for unknown type.

4. Run the Python node and check the output. In this example, the Python function returns the processed Image object. Select the image output to preview the image.
   :::image type="content" source="./media/how-to-process-image/python-node-image-output.png" alt-text="Screenshot of Python node's image output." lightbox = "./media/how-to-process-image/python-node-image-output.png"::: 
If the Image object from Python node is set as the flow output, you can preview the image in the flow output page as well.

## Use GPT-4V tool

OpenAI GPT-4V is a built-in tool in prompt flow that can use OpenAI GPT-4V model to answer questions based on input images.

Add the [OpenAI GPT-4V tool](./tools-reference/openai-gpt-4v-tool.md) to the flow. Make sure you have an OpenAI connection, with the availability of GPT-4V models.

:::image type="content" source="./media/how-to-process-image/gpt-4v-tool.png" alt-text="Screenshot of GPT-4V tool." lightbox = "./media/how-to-process-image/gpt-4v-tool.png":::

The Jinja template for composing prompts in the GPT-4V tool follows a similar structure to the chat API in the LLM tool. To represent an image input within your prompt, you can use the syntax `![image]({{INPUT NAME}})`. Image input can be passed in the `user`, `system` and `assistant` messages.

Once you've composed the prompt, select the **Validate and parse input** button to parse the input placeholders. The image input represented by `![image]({{INPUT NAME}})` will be parsed as image type with the input name as INPUT NAME.

You can assign a value to the image input through the following ways:

- Reference from the flow input of Image type.
- Reference from other node's output of Image type.
- Upload, drag, paste an image, or specify an image URL or the relative image path.

## Build a chatbot to process images

In this section, you'll learn how to build a chatbot that can process image and text inputs.

Assume you want to build a chatbot that can answer any questions about the image and text together. You can achieve this by following the steps below:

1. Create a **chat flow**.
1. Add a **chat input**, select the data type as **"list"**. In the chat box, user can input a mixed sequence of texts and images, and prompt flow service will transform that into a list.
   :::image type="content" source="./media/how-to-process-image/chat-input-definition.png" alt-text="Screenshot of chat input type configuration." lightbox = "./media/how-to-process-image/chat-input-definition.png":::  
1. Add **GPT-4V** tool to the flow.
    :::image type="content" source="./media/how-to-process-image/gpt-4v-tool-in-chatflow.png" alt-text=" Screenshot of GPT-4V tool in chat flow." lightbox = "./media/how-to-process-image/gpt-4v-tool-in-chatflow.png":::  

    In this example, `{{question}}` refers to the chat input, which is a list of texts and images.
1. (Optional) You can add any custom logic to the flow to process the GPT-4V output. For example, you can add content safety tool to detect if the answer contains any inappropriate content, and return a final answer to the user.
    :::image type="content" source="./media/how-to-process-image/chat-flow-postprocess.png" alt-text="Screenshot of processing gpt-4v output with content safety tool." lightbox = "./media/how-to-process-image/chat-flow-postprocess.png":::
1. Now you can **test the chatbot**.  Open the chat window, and input any questions with images. The chatbot will answer the questions based on the image and text inputs.
    :::image type="content" source="./media/how-to-process-image/chatbot-test.png" alt-text="Screenshot of chatbot interaction with images." lightbox = "./media/how-to-process-image/chatbot-test.png":::
   The chat input value is automatically backfilled from the input in the chat window. You can find the texts with images in the chat box which is translated into a list of texts and images.
    :::image type="content" source="./media/how-to-process-image/chat-input-value.png" alt-text="Screenshot of chat input value backfilled from the input in chat window." lightbox = "./media/how-to-process-image/chat-input-value.png":::
> [!NOTE]
> To enable your chatbot to respond with rich text and images, make the chat output `list` type. The list should consist of strings (for text) and prompt flow Image objects (for images) in custom order. 
>   :::image type="content" source="./media/how-to-process-image/chatbot-image-output.png" alt-text="Screenshot of chatbot responding with rich text and images." lightbox = "./media/how-to-process-image/chatbot-image-output.png":::

## Create a batch run using image data

A batch run allows you to test the flow with an extensive dataset. There are three methods to represent image data: through an image file, a public image URL, or a Base64 string.

- **Image file:** To test with image files in batch run, you need to prepare a **data folder**. This folder should contain a batch run entry file in `jsonl` format located in the root directory, along with all image files stored in the same folder or subfolders.
   :::image type="content" source="./media/how-to-process-image/batch-run-sample-data.png" alt-text="Screenshot of batch run sample data with images." lightbox = "./media/how-to-process-image/batch-run-sample-data.png":::
   In the entry file, you should use the format: `{"data:<mime type>;path": "<image relative path>"}` to reference each image file. For example, `{"data:image/png;path": "./images/1.png"}`.
- **Public image URL:** You can also reference the image URL in the entry file using this format: `{"data:<mime type>;url": "<image URL>"}`. For example, `{"data:image/png;url": "https://www.example.com/images/1.png"}`.
- **Base64 string:** A Base64 string can be referenced in the entry file using this format: `{"data:<mime type>;base64": "<base64 string>"}`. For example, `{"data:image/png;base64": "iVBORw0KGgoAAAANSUhEUgAAAGQAAABLAQMAAAC81rD0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABlBMVEUAAP7////DYP5JAAAAAWJLR0QB/wIt3gAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB+QIGBcKN7/nP/UAAAASSURBVDjLY2AYBaNgFIwCdAAABBoAAaNglfsAAAAZdEVYdGNvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVDnr0DLAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA4LTI0VDIzOjEwOjU1KzAzOjAwkHdeuQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wOC0yNFQyMzoxMDo1NSswMzowMOEq5gUAAAAASUVORK5CYII="}`.

In summary, prompt flow uses a unique dictionary format to represent an image, which is `{"data:<mime type>;<representation>": "<value>"}`. Here, `<mime type>` refers to HTML standard [MIME](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types) image types, and `<representation>` refers to the supported image representations: `path`,`url` and `base64`.

### Create a batch run

In flow authoring page, select the **Evaluate** button to initiate a batch run. In Batch run settings, select a dataset, which can be either a folder (containing the entry file and image files) or a file (containing only the entry file). You can preview the entry file and perform input mapping to align the columns in the entry file with the flow inputs.
   :::image type="content" source="./media/how-to-process-image/batch-run-data-selection.png" alt-text="Screenshot of batch run data selection." lightbox = "./media/how-to-process-image/batch-run-data-selection.png":::

### View batch run results

You can check the batch run outputs in the run detail page. Select the image object in the output table to easily preview the image.

:::image type="content" source="./media/how-to-process-image/batch-run-output.png" alt-text="Screenshot of batch run output." lightbox = "./media/how-to-process-image/batch-run-output.png":::

If the batch run outputs contain images, you can check the **flow_outputs dataset** with the output jsonl file and the output images.

:::image type="content" source="./media/how-to-process-image/explore-run-outputs.png" alt-text="Screenshot of batch run flow output." lightbox = "./media/how-to-process-image/explore-run-outputs.png":::

## Consume online endpoint with image data

You can [deploy a flow to an online endpoint for real-time inference](./how-to-deploy-for-real-time-inference.md).

To consume the online endpoint with image input, you should represent the image by using the format `{"data:<mime type>;<representation>": "<value>"}`. In this case, `<representation>` can either be `url` or `base64`.

If the flow generates image output, it will be returned with `base64` format, for example, `{"data:<mime type>;base64": "<base64 string>"}`.

## Next steps

- [Iterate and optimize your flow by tuning prompts using variants](./how-to-tune-prompts-using-variants.md)
- [Deploy a flow](./how-to-deploy-for-real-time-inference.md)
