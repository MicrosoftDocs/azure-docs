---
title: Enable alphanumeric sender ID
titleSuffix: An Azure Communication Services quickstart 
description: Learn about how to enable alphanumeric sender ID
author: prakulka
manager: sundraman
services: azure-communication-services

ms.author: prakulka
ms.date: 03/28/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: mode-other
---
# Quickstart: Enable alphanumeric sender ID


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [An active Communication Services resource.](../create-communication-resource.md)

## Alphanumeric sender ID
To enable alphanumeric sender ID, go to your Communication Services resource on the [Azure portal](https://portal.azure.com).

:::image type="content" source="./media/enable-alphanumeric-sender-id/manage-phone-azure-portal-start-1.png"alt-text="Screenshot showing a Communication Services resource's main page.":::

## Enable alphanumeric sender ID
Navigate to the Alphanumeric Sender ID blade in the resource menu and click on "Enable Alphanumeric Sender ID" button to enable alphanumeric sender ID service. If the enable button is not available for your subscription and your [subscription address](../../concepts/numbers/sub-eligibility-number-capability.md) is supported for alphanumeric sender ID, [create a support ticket](https://aka.ms/ACS-Support).

:::image type="content" source="./media/enable-alphanumeric-sender-id/enable-alphanumeric-sender-id.png"alt-text="Screenshot showing an Alphanumeric senderID blade.":::

## Next steps

> [!div class="nextstepaction"]
> [Send an SMS](../sms/send.md)

The following documents may be interesting to you:

- Familiarize yourself with the [SMS SDK](../../concepts/sms/sdk-features.md)
