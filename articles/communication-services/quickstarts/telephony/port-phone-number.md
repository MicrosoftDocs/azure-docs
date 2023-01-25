---
title: Quickstart - Port a phone number into Azure Communication Services
description: Learn how to port a phone number into your Communication Services resource
author: tophpalmer
manager: mikben
services: azure-communication-services
ms.author: chpalm
ms.date: 06/30/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: pstn
ms.custom: references_regions, mode-other
---
# Quickstart: Port a phone number

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

Get started with Azure Communication Services by porting your phone number into your Azure Communication Services resource. Toll-free and geographic numbers based in the United States are eligible for porting. For more information about phone number types, visit the [phone number conceptual documentation](../../concepts/telephony/plan-solution.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [An active Communication Services resource.](../create-communication-resource.md)

## Gather your Azure resource details

Before initiating a port request, navigate to the Azure portal and select your Communication Services resource. With the `Overview` pane selected, click on the `JSON View` link in the upper right-hand corner:

:::image type="content" source="./media/number-port/json-view.png" alt-text="Screenshot showing selecting the JSON View.":::

Record your resource's **Azure ID** and **Immutable Resource ID**:

:::image type="content" source="./media/number-port/json-properties.png" alt-text="Screenshot showing selecting the JSON properties.":::

## Initiate the port request

Toll-free and geographic numbers are eligible for porting. Follow the ["New Port In Request" instructions](https://github.com/Azure/Communication/blob/master/special-order-numbers.md) to submit your port request

## Next steps

In this quickstart you learned how to:

> [!div class="checklist"]
> * Acquire your Communication Services resource metadata
> * Submit a request to port your phone number

> [!div class="nextstepaction"]
> [Send an SMS](../sms/send.md)
> [Get started with calling](../voice-video-calling/getting-started-with-calling.md)
