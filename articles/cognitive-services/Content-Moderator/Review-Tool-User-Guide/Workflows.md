---
title: Define and use workflows in Azure Content Moderator | Microsoft Docs
description: Learn how to create custom workflows based on your content policies.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 01/07/2018
ms.author: sajagtap
---

# Defining, testing, and using workflows

Content Moderator's workflow designer and APIs allow you to define custom workflows and thresholds based on your content policies.

Workflows “connect” to the Content Moderator API using **connectors**. In addition, you use other APIs, as long as a connector for that API is available. The example here uses the Content Moderator connector, that is included by default.

## Navigate to the Workflows section

Select Workflows from the Settings tab.

  ![Content Moderator - Workflow settings](images/2-workflows-0.png)

## Initiate a new workflow

Click the Add Workflows button.

  ![Content Moderator - add Workflow](images/2-workflows-1.png)

## Assign a name and description

Name your workflow, provide a description, and choose whether the workflow handles images or text.

  ![Content Moderator - Workflow name](images/ocr-workflow-step-1.PNG)

## Define the evaluation criteria (“condition”)

In the following screenshot, you see the fields and the If-Then-Else selections that you need to define for your workflows. Choose a connector (in this example, Content Moderator). The available options for Output change, depending on the connector you choose.

  ![Content Moderator - Workflow condition](images/ocr-workflow-step-2-condition.PNG)

After you choose the connector and its output you are interested in, select an Operator and the value for the condition.

## Define the action to be taken

Select the action to be taken along with the condition to be met. The following example creates an image review, assigns a tag **`a`**, and **highlights** it for the condition shown. You can also combine multiple conditions to get the results you want. Optionally, add an alternative (**Else**) path.

  ![Content Moderator - Workflow action](images/ocr-workflow-step-3-action.PNG)

## Save your workflow

Finally, save the workflow and note the **workflow name**. You need the name to start a moderation job using the Review API.

## Test the workflow

Now that you defined a custom workflow, test it with sample content. 

### Select the corresponding **Execute Workflow** button.

  ![Content Moderator - Workflow Test](images/ocr-workflow-step-6-list.PNG)

### Upload a file.

Save the [sample image](https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png) to your local drive. To test the workflow, select **Choose File(s)** and upload the image.

  ![Content Moderator - Workflow Test - Add File](images/ocr-workflow-step-7-upload.PNG)

### Track the workflow as it is executed.

  ![Content Moderator - Workflow Test - Result](images/ocr-workflow-step-4-test.PNG)

### Review any images flagged for human moderation

To see the image review, navigate to the **Image** tab under **Review**.

  ![Content Moderator - Workflow Test - Review](images/ocr-sample-image-workflow1.PNG)

## Next steps: Invoke the Workflow from code

Use custom workflows with the [`Job` API console quickstart](../try-review-api-job.md) and the [.NET SDK quickstart](../moderation-jobs-quickstart-dotnet.md).
