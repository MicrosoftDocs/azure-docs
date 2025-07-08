---
title: Radiology Insight inference information (communication inference)
titleSuffix: Azure AI Health Insights
description: This article provides Radiology Insights inference information (communication inference).
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 12/12/2023
ms.author: JanSchietse
---

# FollowupCommunicationInference


[Back to overview of RI Inferences](inferences.md)


This inference is created when the text indicates that findings or test results were communicated to a medical professional.
The `kind` is `followupCommunication`. The `wasAcknowledged` field is set to `true` or `false`, depending on whether the communication was verbal. Nonverbal communication might not have reached the recipient yet and, therefore, can't be considered acknowledged. The `dateTime` field is set if the date and time of the communication are known. The `recipient` field is set if the recipient(s) are known. See the OpenAPI spec for its possible values.  

Example without token extensions:  
```json
{
	"kind": "followupCommunication",
	"wasAcknowledged": true,
	"dateTime": [
		"2020-09-05T16:00:00Z"
	],
	"recipient": [
		"doctor"
	]
}
```
The possible values for `recipient` are: `doctor`, `nurse`, `midwife`, `physician_assistant`, and `unknown`.


Examples Request/Response JSON:

[!INCLUDE [Example input json](../includes/example-inference-follow-up-communication-json-request.md)]

[!INCLUDE [Example output json](../includes/example-inference-follow-up-communication-json-response.md)]



