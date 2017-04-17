---
title: Review API for Content Moderator | Microsoft Docs
description: The Review API integrates content with the review tool to handle automated moderation and human reviews.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 11/21/2016
ms.author: sajagtap
---

# The Review API

Use Content Moderators's review API [(See API reference)](api-reference.md "Content Moderator API Reference") to integrate your content with the review tool to get both automated moderation and human reviews.

The Review API has a small set of operations that use the underlying moderation APIs to moderate your content and make the tagged images available within the review tool for human review.

Here is a sample sequence of steps you might follow:

1. Submit an image to start a moderation job.
1. Get details for a moderation job that is either in-progress or completed.
1. Once the human reviews are completed, get the detailed results.

## Submitting an image to start a moderation job ##
Use the **Job-Create** operation to start a moderation job for an image. The Moderator will scan the image and generate reviews by evaluating the default or custom workflow configured within the review tool.

Your inputs will include:

- The image to be moderated (file or URL)
- The default workflow identifier (“default”)
- Your API callback point for notification

The response will return the identifier of the job that was started.

Once the job is completed, the operation will use your API callback information to notify you. You can then use the job identifier to get the detailed information back and take further action.

## Getting details for an in-progress or completed job

Use the **Job-Get** operation to get the details of a moderation job for the identifier returned by the previous operation. Note that while the method returns immediately with the job settings information, the moderation job itself is run asynchronously. The results are returned through the callback point, and can also be queried by using the operation that we discuss in the next section.

Your inputs will include at a minimum:

- The human review team name
- The job identifier returned by the previous operation

The response will include the following information:

- The identifier of the review created (use this to get the final review results)
- The status of the review (completed or in-progress)
- The assigned moderation tags (key-value pairs)

## Getting results after a human review

Use the **Review-Get** operation to get the results after a human review of the moderated image is completed. You will get notified when your defined callback point is called by the review API. The operation will return two sets of tag data - the tags assigned by the moderation service, and the tags after the human review was completed.

Your inputs will include at a minimum:

- The human review team name
- The review identifier returned by the previous operation

The response will include the following information:

- The tags (key-value pairs) confirmed by the human reviewer
- The tags (key-value pairs) assigned by the moderation service

## Directly creating reviews within the review tool

If you want to use the review tool just for the human review capability because you are either already using the moderation APIs, or you want to separate them for other reasons, you can do that using the **Review-Create** operation.

Your inputs to this operation will include:

- The content (image) to be reviewed
- The tags (key value pairs)

## Creating or updating custom workflow

While the review tool uses a default workflow, you can also define your custom workflow based on your business rules and content policies.

You would do that using the **Workflow-Create or Update** operation.

Your inputs to this operation will include:

- The review team name
- The name of your workflow

Your request will contain the expression for describing the workflow. When creating Jobs, the Expression in the specified workflow is evaluated against the moderator API results.

For example:

Expression with one condition as in: Create review if **adult score > 0.4**.

	{
		"ConnectorName": "imagemoderator",
		"OutputName": "adultscore",
		"Operator": "ge",  //- where ge = greater than or equal to
		"Value": "0.4",
		"Type": "Condition"
	}

Expression with two conditions combined as in: Create review if **(adult score > 0.5 AND racy score > 0.5)**.

	{
		"Left": {
			"ConnectorName": "imagemoderator",
			"OutputName": "adultscore",
			"Operator": "ge",
			"Value": "0.4",
			"Type": "Condition"
		},
		"Right": {
			"ConnectorName": "imagemoderator",
			"OutputName": "racyscore",
			"Operator": "ge",
			"Value": "0.5",
			"Type": "Condition"
		},
		"Combine": "AND",
		"Type": "Combine"
	}

Please refer to the API Reference for more information and examples.
