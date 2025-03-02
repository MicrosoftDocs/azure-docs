---
title: Look up operator information for a phone number using Azure Communication Services
description: This article describes how to look up operator information for any phone number using Azure Communication Services.
services: azure-communication-services
author: ericasp
manager: danielav
ms.service: azure-communication-services
ms.subservice: pstn
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 08/10/2023
ms.topic: quickstart
ms.author: ericasp
zone_pivot_groups: acs-js-csharp-java-python
---

# Look up operator information for a phone number using Azure Communication Services

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript](./includes/number-lookup-js.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [C#](./includes/number-lookup-net.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java](./includes/number-lookup-java.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python](./includes/number-lookup-python.md)]
::: zone-end

## Troubleshooting

Common questions and issues:

- Changes to environment variables might not take effect in programs that are already running. If you notice your environment variables aren't working as expected, try closing and reopening any programs you're using to run and edit code.
- The data returned by this endpoint is subject to various international laws and regulations, therefore the accuracy of the results depends on several factors. These factors include whether the number was ported, the country code, and the approval status of the caller. Based on these factors, operator information might not be available for some phone numbers or could reflect the original operator of the phone number, not the current operator.

## Next steps

This article described how to:
> [!div class="checklist"]
> * Look up number formatting
> * Look up operator information for a phone number

> [!div class="nextstepaction"]
> [Number Lookup Concept](../../concepts/numbers/number-lookup-concept.md)

> [!div class="nextstepaction"]
> [Number Lookup SDK](../../concepts/numbers/number-lookup-sdk.md)
