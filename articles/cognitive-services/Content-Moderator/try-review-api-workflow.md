---
title: Azure Content Moderator - Content moderation workflows from the API console | Microsoft Docs
description: Learn how to use content moderation workflows from the API console.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 02/05/2018
ms.author: sajagtap
---

# Create a workflow from the API console

Use the Review API's [workflow operations](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/5813b46b3f9b0711b43c4c59) in Azure Content Moderator to create or update or get workflow details by using the Review API. You can define simple, complex, and even nested expressions for your workflows by using this API. The workflows appear in the Review tool for your team to use. The workflows are also used by the Review API's job operations.

## Prerequisites

Navigate to the [review tool](https://contentmoderator.cognitive.microsoft.com/). Sign up if you have not done so yet. Within the review tool, Navigate to the **Workflows** tab under **Settings** as shown in the review tool's [workflow tutorial](Review-Tool-User-Guide/Workflows.md).

### Navigate to the workflows screen

On the Content Moderator Dashboard, select **Review** > **Settings** > **Workflows**. You see a **default** workflow.

  ![Review tool list of workflows](images/default-workflow-listed.PNG)

### Get the JSON definition of the default workflow

Click the **Edit** option for your workflow, and then select the **JSON** tab. You see the following JSON **expression**.

	{
		"Type": "Logic",
		"If": {
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

## Use the API console

To test-drive the API by using the online console, you need a few values to enter into the console:

- **team**: The team name that you created when you set up your [review tool account](https://contentmoderator.cognitive.microsoft.com/). 
- **workflowname**: The name of your new workflow.
- **Ocp-Apim-Subscription-Key**: Located on the **Settings** tab. For more information, see [Overview](overview.md).

The simplest way to access a testing console is from the **Credentials** window.

### Navigate to the API Reference

In the **Credentials** window, select [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/5813b46b3f9b0711b43c4c59).

  The **Workflow - Create Or Update** page opens.

### Select your region

For **Open API testing console**, select the region that most closely describes your location.

  ![Workflow - Create Or Update page region selection](images/test-drive-region.png)

  The **Workflow - Create Or Update** API console opens.

### Enter parameters

Enter values for **team**, **workflowname**, and **Ocp-Apim-Subscription-Key** (your subscription key).

  ![Workflow - Create Or Update console query parameters and headers](images/workflow-console-parameters.PNG)

### Enter the workflow definition

Edit the **Request body** box to enter the JSON request with details for 'Description` and `Type` (Image or Text).
For the 'Expression`. copy the default workflow expressions from the preceding section as shown here.

	{
		"Description": "Default workflow from API console",
		"Type": "Image",
		"Expression": 
			// Copy the default workflow expression from the preceding section
	}

Your request body looks like the following JSON request:

	{
		"Description": "Default workflow from API console",
		"Type": "Image",
		"Expression": {
		    "Type": "Logic",
    		"If": {
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
          		"Tags": [ ]
        	}
      		],
      		"Type": "Actions"
			}
		}
	}
 
### Submit your request
  
Select **Send**. If the operation succeeds, the **Response status** is `200 OK` and the **Response content** box displays `true`.

### Check out the new workflow

In the review tool, select **Review** > **Settings** > **Workflows**. Your new workflow appears, and is ready to use.

  ![Review tool list of workflows](images/workflow-console-new-workflow.PNG)
  
### Review your new workflow details

Select the **Edit** option for your workflow, and then select the **Designer** and **JSON** tabS.

  ![Review tool Designer tab for a selected workflow](images/workflow-console-new-workflow-designer.PNG)

To see the JSON view of the workflow, select the **JSON** tab. You notice that it's identical to the `Expression` you had submitted and to the one from the `default` workflow.

## Next steps

* Learn how to use workflows with [content moderation jobs](try-review-api-job.md).
