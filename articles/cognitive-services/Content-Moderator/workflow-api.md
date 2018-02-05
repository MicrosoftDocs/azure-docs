---
title: Azure Content Moderator - Moderation workflows | Microsoft Docs
description: Use workflows with content moderation.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 02/04/2018
ms.author: sajagtap
---

# Moderation workflows

Content Moderator includes tools and APIs to manage workflows. You use workflows with the [Review API's Job operations](review-api.md) to automate human-in-the-loop review creation based on your content policies and thresholds.

The Review API offers the following ways to include human oversight in your content moderation process:

1. The `Job` operations for starting machine-assisted moderation and human review creation as one step.
1. The `Review` operations for human review creation, outside of the moderation step.
1. The `Workflow` operations for managing workflows that automate scanning with thresholds for review creation.

In this article, we cover the `Workflow` operations. Read the [Jobs and Reviews](review-api.md) overview to learn about content moderation jobs and reviews.

Checking out the **default* workflow is the best way to get started on understanding workflows in Content Moderator.

## Your first workflow

Your first workflow comes bundled with your [review tool team](https://contentmoderator.cognitive.microsoft.com/). Sign up if you have not done so already.

Navigate to the [review tool's Workflows](Review-Tool-User-Guide/Workflows.md) screen under the Settings tab. You will see a `default` workflow as shown in the following image.

![Content Moderator workflows](images/2-workflows-1.png)

### Open the default workflow

Use the **edit* option shown in the following image to open the workflow editing page.
![Content Moderator default workflow](images/default-workflow-listed.PNG)

### The designer view

You see the **Designer** tab for the workflow. The designer view shows the following steps:

1. The **condition** for the workflow to be evaluated. In this case, the workflow calls the Content Moderator's image API and checks whether the `isAdult` output equals `true`.
1. The **action** to be performed if the condition is met. In this case, the workflow creates a review in the review tool if the `isAdult` output is `true`.

![Content Moderator default workflow - designer](images/default-workflow-designer.PNG)

### The JSON view

Select the **JSON** tab to see the JSON definition of the workflow.

	{
		"Type": "Logic",
		If": {
    		"ConnectorName": "moderator",
    		"OutputName": "isAdult",
    		"Operator": "eq",
    		"Value": "true",
    		"Type": "Condition"
		},
		"Then": {
		"Perform": [
		{
        	"Name": "createreview",
        	"CallbackEndpoint": null,
        	"Tags": []
      	}
		],
		"Type": "Actions"
		}
	}

### Key learning

The workflows in Content Moderator are easy to configure and flexible. If the built-in designer does not meet your requirements, write the workflow definition in the **JSON** format. Then use the JSON definition with the [Workflow API](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/5813b46b3f9b0711b43c4c59) to create and manage the workflow from your application.

## Define a custom workflow

Content Moderator's workflow capabilities allow defining and using custom workflows. Use the [review tool workflows how-to](Review-Tool-User-Guide/Workflows.md) article to define a custom workflow. This workflow uses Content Moderator's OCR capability to extract text from a sample image. It then creates a review in the review tool.

### The sample image

Save the [sample image](https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png) to your local drive. You need this image for your exercise.

### The designer view

Select the **Designer** tab and the [workflow creation tutorial](Review-Tool-User-Guide/Workflows.md) to define a custom workflow. The following image shows the designer's **Condition** view. Refer to the tutorial to see the rest of the steps.

![Content Moderator - Workflow condition](images/ocr-workflow-step-2-condition.PNG)

### The JSON view

Select the **JSON** tab to see the following JSON definition of your custom workflow. Notice how the **If-Then** statements in the JSON definition correspond to the steps you defined using the designer view.

	{
		"Type": "Logic",
		"If": {
    		"ConnectorName": "moderator",
    		"OutputName": "hasText",
    		"Operator": "eq",
    		"Value": "true",
    		"Type": "Condition"
		},
		"Then": {
    	"Perform": [
      	{
        	"Name": "createreview",
        	"CallbackEndpoint": null,
        	"Tags": [
          	{
            	"Tag": "a",
            	"IfCondition": {
              		"ConnectorName": "moderator",
              		"OutputName": "hasText",
              		"Operator": "eq",
              		"Value": "true",
              		"Type": "Condition"
            	}
          	}
        	]
      	}
    	],
    	"Type": "Actions"
		}
	}

### Workflow result

After you test the workflow from the workflows screen, the following review is created. Navigate to the **Image** tab under **Review** to see your review.
The workflow created the review because the primary condition tested positive for the presence of text. This resulted in the creation of the review and highlighting of the **`a`** tag in the image review.

![Content Moderator - simple workflow output](images/ocr-sample-image-workflow1.PNG)


## Advanced workflow with combination

### The sample image

Now let's use the same [sample image](https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png) that we used in the preceding section for this example.

However, this time around, you change your primary condition into a combination of two checks. Instead of only checking for the presence of text, you also check whether the text has any profanity in it. The workflow only creates a review if it finds any text within the image **and** detects profanity in it.

### The designer view

Modify the workflow you created in the preceding step to change the **Condition** to a **Combination**. The following image shows the new view you see in the designer.

![Content Moderator - Modified workflow condition](images/ocr-workflow-2-designer.PNG)

### The JSON view

Select the **JSON** tab to see the following JSON definition of your modified custom workflow. Notice how the **If-Then** statements in the JSON definition correspond to the new steps you added to the workflow.

	{
		"Type": "Logic",
		"If": {
    	"Left": {
      		"ConnectorName": "moderator",
      		"OutputName": "hasText",
      		"Operator": "eq",
      		"Value": "true",
      		"Type": "Condition"
    		},
    	"Right": {
      		"ConnectorName": "moderator",
      		"OutputName": "text.HasProfanity",
      		"Operator": "eq",
      		"Value": "true",
      		"Type": "Condition",
      		"AlternateInput": "moderator.ocrText"
    		},
    	"Combine": "AND",
    	"Type": "Combine"
		},
		"Then": {
    	"Perform": [
      	{
        	"Name": "createreview",
        	"CallbackEndpoint": null,
        	"Tags": [
          	{
            	"Tag": "a",
            	"IfCondition": {
              		"ConnectorName": "moderator",
              		"OutputName": "hasText",
              		"Operator": "eq",
              		"Value": "true",
              		"Type": "Condition"
            	}
          	}
        	]
      	}
    	],
    	"Type": "Actions"
		}
	}

	
### Workflow result

After you test the workflow again, you find that no review is created. Navigate to the **Image** tab under **Review** to confirm the absence of any review.
The workflow did not create the review because the primary condition combination failed to detect any profanity in the extracted text.

![Content Moderator - modified workflow output](images/ocr-workflow-2-result.PNG)

