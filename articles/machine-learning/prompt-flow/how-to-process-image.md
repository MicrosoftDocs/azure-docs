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

## Build a chatbot to process images

In this section, you'll learn how to build a chatbot that can process image and text inputs. 

Assume you want to build a chatbot that can answer any questions about the image and text together. You can achieve this by following the steps below:
1. Create a **chat flow**.
1. Add a **chat input**, select the data type as **"list"**. In the chat box, user can input a mixed sequence of texts and images, and prompt flow service will transform that into a list.
   :::image type="content" source="./media/how-to-use-image-in-promptflow/chat-input-definition.png" alt-text="GPT-4V tool in chat flow." lightbox = "./media/how-to-use-image-in-promptflow/chat-input-definition.png":::  
1. Add **GPT-4V** tool to the flow.
    :::image type="content" source="./media/how-to-use-image-in-promptflow/gpt-4v-tool-in-chatflow.png" alt-text="GPT-4V tool in chat flow." lightbox = "./media/how-to-use-image-in-promptflow/gpt-4v-tool-in-chatflow.png":::  

    In this example,  `{{question}}` refers to the chat input, which is a list of texts and images. 
1. (Optional) You can add any custom logic to the flow to process the GPT-4V output. For example, you can add content safety tool to detect if the answer contains any inappropriate content, and return a final answer to the user. 
    :::image type="content" source="./media/how-to-use-image-in-promptflow/chat-flow-postprocess.png" alt-text="Content safety tool." lightbox = "./media/how-to-use-image-in-promptflow/chat-flow-postprocess.png":::
1. Now you can **test the chatbot**.  Open the chat window, and input any questions with images. The chatbot will answer the questions based on the image and text inputs. 
    :::image type="content" source="./media/how-to-use-image-in-promptflow/chatbot-test.png" alt-text="Chatbot test with images." lightbox = "./media/how-to-use-image-in-promptflow/chatbot-test.png":::
   The chat input value is automatically backfilled from the input in the chat window. You can find the texts with images in the chatbox is translated into a list of texts and images. 
    :::image type="content" source="./media/how-to-use-image-in-promptflow/chat-input-value.png" alt-text="Chat input value is automatically backfilled from the input in chat window." lightbox = "./media/how-to-use-image-in-promptflow/chat-input-value.png":::

## Create a batch run using image data
By creating a batch run, you can test the flow with more data. The image data can be represented in the following ways:
- **Image file**. To use image files, you should prepare a **data folder** with an batch run entry file in `jsonl` format in the root folder, and all the images in the same folder or subfolders.
   :::image type="content" source="./media/how-to-use-image-in-promptflow/batch-run-sample-data.png" alt-text="Batch run sample data with images." lightbox = "./media/how-to-use-image-in-promptflow/batch-run-sample-data.png":::
   In the entry file, use this format `{"data:image/[image extension];path":"[image file]"}` to refer to the image file. For example, `{"data:image/png;path":"./images/1.png"}`.
- **Public image URL**. In this case, you can directly use the image URL in the entry file. For example, `{"data:image/png;url":"[image url]"}`.
  

