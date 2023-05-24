---
title: Quickstart - Look up operator information for a phone number using Azure Communication Services
description: Learn how to look up operator information for any phone number using Azure Communication Services
services: azure-communication-services
author: ericasp
manager: danav
ms.service: azure-communication-services
ms.subservice: pstn
ms.date: 05/30/2023
ms.topic: quickstart
ms.custom: mode-other
ms.author: ericasp
zone_pivot_groups: csharp
---

# Quickstart: Look up operator information for a phone number

Get started with the Phone Numbers client library for C# to look up operator information for phone numbers, which can be used to determine whether and how to communicate with that phone number.  Follow these steps to install the package and look up operator information about a phone number.

::: zone pivot="programming-language-csharp"
[!INCLUDE [C#](./includes/number-lookup-net.md)]
::: zone-end

## Troubleshooting

Common Questions and Issues:

- The data returned by this endpoint is subject to various international laws and regulations, therefore the accuracy of the results depends on several factors.  These factors include whether the number has been ported, the country code, and the approval status of the caller.  Based on these factors, operator information may not be available for some phone numbers or may reflect the original operator of the phone number, not the current operator.

## Next steps

In this quickstart you learned how to:
> [!div class="checklist"]
> * Look up operator information for a phone number

[!div class="nextstepaction"]
[Send an SMS](../sms/send.md)
