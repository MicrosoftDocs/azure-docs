---
title: Moderation jobs and human-in-the-loop reviews - Content Moderator
titlesuffix: Azure Cognitive Services
description: Apply human oversight to machine-assisted moderation for best results.
services: cognitive-services
author: sanjeev3
manager: cgronlun
ms.service: cognitive-services
ms.component: content-moderator
ms.topic: conceptual
ms.date: 1/21/2018
ms.author: sajagtap
---

# Moderation jobs and reviews

Combine machine-assisted moderation with human-in-the-loop capabilities by using the Azure Content Moderator [Review API](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c5) to get the best results for your business.

The Review API offers the following ways to include human oversight in your content moderation process:

* `Job` operations are used to start machine-assisted moderation and human review creation as one step.
* `Review` operations are used for human review creation, outside of the moderation step.
* `Workflow` operations are used to manage workflows that automate scanning with thresholds for review creation.

The `Job` and `Review` operations accept your callback endpoints for receiving status and results.

This article covers the `Job` and `Review` operations. Read the [Workflows overview](workflow-api.md) for information on how to create, edit, and get workflow definitions.

## Job operations

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
 
![Image review for human moderators](images/ocr-sample-image.PNG)

## Review operations

### Create reviews

Use the `Review.Create` operation to create the human reviews. You either moderate them elsewhere or use custom logic to assign the moderation tags.

Your inputs to this operation include:

- The content to be reviewed.
- The assigned tags (key value pairs) for review by human moderators.

The following response shows the review identifier:

	[
		"201712i46950138c61a4740b118a43cac33f434",
	]


### Get review status
Use the `Review.Get` operation to get the results after a human review of the moderated image is completed. You get notified via your provided callback endpoint. 

The operation returns two sets of tags: 

* The tags assigned by the moderation service
* The tags after the human review was completed

Your inputs include at a minimum:

- The review team name
- The review identifier returned by the previous operation

The response includes the following information:

- The review status
- The tags (key-value pairs) confirmed by the human reviewer
- The tags (key-value pairs) assigned by the moderation service

You see both the reviewer-assigned tags (**reviewerResultTags**) and the initial tags (**metadata**) in the following sample response:

	{
		"reviewId": "201712i46950138c61a4740b118a43cac33f434",
		"subTeam": "public",
		"status": "Complete",
		"reviewerResultTags": [
    	{
      		"key": "a",
      		"value": "False"
    	},
    	{
      		"key": "r",
      		"value": "True"
    	},
    	{
      		"key": "sc",
      		"value": "True"
    	}
		],
		"createdBy": "{teamname}",
		"metadata": [
    	{
      		"key": "sc",
      		"value": "true"
    	}
		],
		"type": "Image",
		"content": "https://reviewcontentprod.blob.core.windows.net/{teamname}/IMG_201712i46950138c61a4740b118a43cac33f434",
		"contentId": "0",
		"callbackEndpoint": "{callbackUrl}"
	}

## Next steps

* Test drive the [Job API console](try-review-api-job.md), and use the REST API code samples. If you're familiar with Visual Studio and C#, also check out the [Jobs .NET quickstart](moderation-jobs-quickstart-dotnet.md). 
* For reviews, get started with the [Review API console](try-review-api-review.md), and use the REST API code samples. Then see the [Reviews .NET quickstart](moderation-reviews-quickstart-dotnet.md).
* For video reviews, use the [Video review quickstart](video-reviews-quickstart-dotnet.md), and learn how to [add transcripts to the video review](video-transcript-reviews-quickstart-dotnet.md).
