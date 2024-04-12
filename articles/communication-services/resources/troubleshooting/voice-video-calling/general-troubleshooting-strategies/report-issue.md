---
title: General troubleshooting strategies - Reporting an issue
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to report an issue.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# Reporting an issue

If the issue reported by the user can't be found in the troubleshooting guide, consider reporting the issue.

Sometimes the problem comes from the app itself.
In this case, you can test the issue against the calling sample
[https://github.com/Azure-Samples/communication-services-web-calling-tutorial](https://github.com/Azure-Samples/communication-services-web-calling-tutorial) 
to see if the problem can also be reproduced in the calling sample.

## Where to report the issue

When you want to report issues, there are several places to report them.
You can refer to [Azure Support](../../../../support.md).

You can choose to create an Azure support ticket.
Additionally, for the ACS Web Calling SDK, if you found an issue during development,
you can also report it at [https://github.com/Azure/azure-sdk-for-js/issues](https://github.com/Azure/azure-sdk-for-js/issues).

## What to include when you report the issue

When reporting an issue, you need to provide a clear description of the issue, including:

* context
* steps to reproduce the problem
* expected results
* actual results

In most cases, you also need to include details, such as

* environment
  * operation system and version
  * browser name and version
  * ACS SDK version
* call info
  * `Call Id` (when the issue happened during a call)
  * `Participant Id` (if there were multiple participants in the call, but only some of them experienced the issue)

If you can only reproduce the issue on a specific device platform (for example, iPhone X), also include the device model when you report the issue.

Depending on the type of issue, we may ask you to provide logs when we investigate the issue.
