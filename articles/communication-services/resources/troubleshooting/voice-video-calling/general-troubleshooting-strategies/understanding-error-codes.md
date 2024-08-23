---
title: General troubleshooting strategies - Understanding error messages and codes
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn to understand error messages and codes.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 05/13/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
zone_pivot_groups: acs-calling-codes
---

# Understanding calling codes and subcodes errors

The Calling SDK and respective server infrastructure use a unified framework to represent errors. Using  error codes, subcodes, and their corresponding result categories, as a developer you can more easily understand these errors and find explanations as to why they happened and how to mitigate in the future. The details about the error results can be viewed as:
 
**Code** Are modeled as 3 digit integers that indicate the response status of a client or server response. They're grouped into:<br>
- Successful responses (**200-299**)<br>
- Client error (**400-499**) <br>
- Server error (**500-599**) <br>

**Subcode** Are defined as an integer, where each number indicates a unique reason, specific to a group of scenarios or specific scenario outcome.<br>
**Message** Describes the outcome, and provides hints how to mitigate the issue problem if an outcome is a failure.<br>
**ResultCategory** - Indicates the type of the error. Depending on the context, the value can be `Success`, `ExpectedError`, `UnexpectedClientError`, or `UnexpectedServerError`

[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

::: zone pivot="calling"
[!INCLUDE [Calling SDK](../includes/codes/calling-sdk.md)]
::: zone-end

::: zone pivot="callend"
[!INCLUDE [Call end](../includes/codes/call-end.md)]
::: zone-end
