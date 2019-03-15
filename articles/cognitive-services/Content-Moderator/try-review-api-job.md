---
title: Run content moderation jobs with the API console - Content Moderator
titlesuffix: Azure Cognitive Services
description: Use the Review API's job operations to initiate end-to-end content moderation jobs for image or text content in Azure Content Moderator. 
services: cognitive-services
author: sanjeev3
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: conceptual
ms.date: 01/10/2019
ms.author: sajagtap
#The Jobs how-to for REST/console
---

# Start a moderation job from the API console

Use the Review API's [job operations](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c5) to initiate end-to-end content moderation jobs for image or text content in Azure Content Moderator. 

The moderation job scans your content by using the Content Moderator Image Moderation API or Text Moderation API. Then, the moderation job uses workflows (defined in the review tool) to generate reviews in the Review tool. 

After a human moderator reviews the auto-assigned tags and prediction data and submits a final moderation decision, the Review API submits all information to your API endpoint.

## Prerequisites

Navigate to the [review tool](https://contentmoderator.cognitive.microsoft.com/). Sign up if you have not done so yet. Within the review tool, [define a custom workflow](Review-Tool-User-Guide/Workflows.md) to use in this `Job` operation.

## Use the API console
To test-drive the API by using the online console, you need a few values to enter into the console:
	
- `teamName`: Use the `Id` field from your review tool's credentials screen. 
- `ContentId`: This string is passed to the API and returned through the callback. **ContentId** is useful for associating internal identifiers or metadata with the results of a moderation job.- `Workflowname`: The name of the [workflow that you created](Review-Tool-User-Guide/Workflows.md) in the previous section.
- `Ocp-Apim-Subscription-Key`: Located on the **Settings** tab. For more information, see [Overview](overview.md).

Access the API console is from the **Credentials** window.

### Navigate to the API Reference
In the **Credentials** window, select [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c5).

  The `Job.Create` page opens.

### Select your region
For **Open API testing console**, select the region that most closely describes your location.
  ![Job - Create page region selection](images/test-drive-job-1.png)

  The `Job.Create` API console opens. 

### Enter parameters

Enter values for the required query parameters, and your subscription key. In the **Request body** box, specify the location of the information that you want to scan. For this example, let's use this [sample image](https://moderatorsampleimages.blob.core.windows.net/samples/sample6.png).

  ![Job - Create console query parameters, headers, and Request body box](images/job-api-console-inputs.PNG)

### Submit your request
Select **Send**. A job ID is created. Copy this to use in the next steps.

  `"JobId": "2018014caceddebfe9446fab29056fd8d31ffe"`

### Open the Get Job details page
Select **Get**, and then open the API by selecting the button that matches your region.

  ![Job - Create console Get results](images/test-drive-job-4.png)

### Review the response

Enter values for **teamName** and **JobID**. Enter your subscription key, and then select **Send**. The following response shows sample Job status and details.

```
	{
		"Id": "2018014caceddebfe9446fab29056fd8d31ffe",
		"TeamName": "some team name",
		"Status": "InProgress",
		"WorkflowId": "OCR",
		"Type": "Image",
		"CallBackEndpoint": "",
		"ReviewId": "",
		"ResultMetaData": [],
		"JobExecutionReport": 
		[
    		{
			"Ts": "2018-01-07T00:38:26.7714671",
      			"Msg": "Successfully got hasText response from Moderator"
    		},
    		{
      			"Ts": "2018-01-07T00:38:26.4181346",
      			"Msg": "Getting hasText from Moderator"
    		},
    		{
      			"Ts": "2018-01-07T00:38:25.5122828",
      			"Msg": "Starting Execution - Try 1"
    		}
		]
	}
```

## Navigate to the review tool
On the Content Moderator Dashboard, select **Review** > **Image**. The image that you scanned appears, ready for human review.

  ![Review tool image of three cyclists](images/ocr-sample-image.PNG)

## Next steps

Use the REST API in your code or start with the [Jobs .NET quickstart](moderation-jobs-quickstart-dotnet.md) to integrate with your application.

---

### Start a job
Use the `Job.Create` operation to start a moderation and human review creation job. Content Moderator scans the content and evaluates the designated workflow. Based on the workflow results, it either creates reviews or skips the step. It also submits the post-moderation and post-review tags to your callback endpoint.

The inputs include the following information:

- The review team ID.
- The content to be moderated.
- The workflow name. (The default is the "default" workflow.)
- Your API callback point for notifications.
 
The following response shows the identifier of the job that was started. You use the job identifier to get the job status and receive detailed information.

	{
		"JobId": "2018014caceddebfe9446fab29056fd8d31ffe"
	}

### Get job status

Use the `Job.Get` operation and the job identifier to get the details of a running or completed job. The operation returns immediately while the moderation job runs asynchronously. The results are returned through the callback endpoint.

Your inputs include the following information:

- The review team ID: The job identifier returned by the previous operation

The response includes the following information:

- The identifier of the review created. (Use this ID to get the final review results.)
- The status of the job (completed or in-progress): The assigned moderation tags (key-value pairs).
- The job execution report.
 
 
		{
			"Id": "2018014caceddebfe9446fab29056fd8d31ffe",
			"TeamName": "some team name",
			"Status": "Complete",
			"WorkflowId": "OCR",
			"Type": "Image",
			"CallBackEndpoint": "",
			"ReviewId": "201801i28fc0f7cbf424447846e509af853ea54",
			"ResultMetaData":[
			{
			"Key": "hasText",
			"Value": "True"
			},
			{
			"Key": "ocrText",
			"Value": "IF WE DID \r\nALL \r\nTHE THINGS \r\nWE ARE \r\nCAPABLE \r\nOF DOING, \r\nWE WOULD \r\nLITERALLY \r\nASTOUND \r\nOURSELVE \r\n"
			}
			],
			"JobExecutionReport": [
			{
      			"Ts": "2018-01-07T00:38:29.3238715",
      			"Msg": "Posted results to the Callbackendpoint: https://requestb.in/vxke1mvx"
    			},
    			{
      			"Ts": "2018-01-07T00:38:29.2928416",
      			"Msg": "Job marked completed and job content has been removed"
    			},
    			{
      			"Ts": "2018-01-07T00:38:29.0856472",
      			"Msg": "Execution Complete"
    			},
			{
      			"Ts": "2018-01-07T00:38:26.7714671",
      			"Msg": "Successfully got hasText response from Moderator"
    			},
    			{
      			"Ts": "2018-01-07T00:38:26.4181346",
      			"Msg": "Getting hasText from Moderator"
    			},
    			{
      			"Ts": "2018-01-07T00:38:25.5122828",
      			"Msg": "Starting Execution - Try 1"
    			}
			]
		}