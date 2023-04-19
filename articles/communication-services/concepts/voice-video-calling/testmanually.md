---
title: Azure Communication Services End of Call Survey overview
titleSuffix: An Azure Communication Services concept document
description: Learn about the End of Call Survey.
author: amagginetti
ms.author: amagginetti
manager: mvivion

services: azure-communication-services
ms.date: 4/03/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---
table 1

| API Rating Categories | Question Goal |
| ----------- | ----------- |
|  Overall Call  |   Responses indicate how a call participant perceived their overall call quality.    |

table 2

| API Rating Categories | Cutoff Value* | Input Range | Comments |
| ----------- | ----------- | -------- | -------- | 
| Overall Call | 2 | 1 - 5 | Surveys a calling participant’s overall quality experience on a scale of 1-5 where 1 indicates an imperfect call experience and 5 indicates a perfect call. The cutoff value of 2 means that a customer response of 1 or 2 indicates a less than perfect call experience.  |


table 3

| Rating Categories | Optional Tags |
| ----------- | ----------- |
|  Overall Call  |    `CallCannotJoin` `CallCannotInvite` `HadToRejoin` `CallEndedUnexpectedly`  `OtherIssues`    |