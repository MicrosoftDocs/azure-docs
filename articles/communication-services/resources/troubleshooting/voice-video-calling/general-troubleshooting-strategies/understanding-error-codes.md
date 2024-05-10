---
title: General troubleshooting strategies - Understanding error messages and codes
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn to understand error messages and codes.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 05/10/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
zone_pivot_groups: acs-errorcodes-client-server
---

# Understanding calling codes and subcodes errors

The Calling SDK and respective server infrastructure use a unified framework to represent errors. Through error codes, subcodes, and result categories, you can more easily handle errors and find corresponding explanations. The results, errors and exceptions that Azure Communication Services return are attributed with 3 properties:
 
**Code** Are modeled as 3 digit integers that indicate the response status of a client or server response, They're grouped into success (**200-299**), client error (**400-499**), and server error (**500-599**) <br>
**Subcode** - Defined as an integer, where each number indicates a unique reason, specific to a group of scenarios or specific scenario outcome.<br>
**Message** - Message that describes the outcome, and provides hints how to mitigate the issue problem if an outcome is a failure.<br>
**ResultCategory** - The resultCategories property indicates the type of the error. Depending on the context, the value can be `Success`, `ExpectedError`, `UnexpectedClientError`, or `UnexpectedServerError`

For client errors, if the resultCategories property is `ExpectedError`, the error is expected from the SDK's perspective. Such errors are commonly encountered in precondition failures, such as incorrect arguments passed by the app, or when the current system state doesn't allow the API call. The application should check the error reason and the logic for invoking API.

::: zone pivot="platform-javascript"
[!INCLUDE [Client generated codes](./includes/webjs-client-code-subcode.md)]
::: zone-end

::: zone pivot="platform-server"
[!INCLUDE [Server generated codes](./includes/server-code-subcode.md)]
::: zone-end