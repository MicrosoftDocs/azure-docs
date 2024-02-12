---
title: Quickstart - Look up operator information for a phone number using Azure Communication Services
description: Learn how to look up operator information for any phone number using Azure Communication Services
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

# Quickstart: Look up operator information for a phone number using Azure Communication Services

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

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

- The data returned by this endpoint is subject to various international laws and regulations, therefore the accuracy of the results depends on several factors.  These factors include whether the number has been ported, the country code, and the approval status of the caller.  Based on these factors, operator information may not be available for some phone numbers or may reflect the original operator of the phone number, not the current operator.

## Next steps

In this quickstart you learned how to:
> [!div class="checklist"]
> * Look up operator information for a phone number

> [!div class="nextstepaction"]
> [Number Lookup Concept](../../concepts/numbers/number-lookup-concept.md)

> [!div class="nextstepaction"]
> [Number Lookup SDK](../../concepts/numbers/number-lookup-sdk.md)
