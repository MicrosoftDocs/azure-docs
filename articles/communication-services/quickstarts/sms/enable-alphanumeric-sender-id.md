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

- An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [An active Communication Services resource.](../create-communication-resource.md)
- [An eligible subscription address.](../../concepts/numbers/sub-eligibility-number-capability.md)

## Alphanumeric sender ID
Alphanumeric Sender IDs are displayed as a custom alphanumeric phrase like the company’s name (CONTOSO, MyCompany) on the recipient handset. Alphanumeric sender IDs can be used for various use cases like one-time passcodes, marketing alerts, and flight status notifications.

There are two types of alphanumeric sender IDs:
- Dynamic alphanumeric sender ID: Supported in countries that don't require registration for use. Dynamic alphanumeric sender IDs can be instantly provisioned.
- Preregistered alphanumeric sender ID: Supported in countries that require registration for use. Preregistered alphanumeric sender IDs are typically provisioned in 4-5 weeks.

Refer to [SMS overview page](../../concepts/sms/concepts.md) for list of countries that are supported.

## Enable dynamic alphanumeric sender ID
To enable dynamic alphanumeric sender ID, go to your Communication Services resource on the [Azure portal](https://portal.azure.com).

:::image type="content" source="./media/enable-alphanumeric-sender-id/manage-phone-azure-portal-start-1.png"alt-text="Screenshot showing a Communication Services resource's main page.":::

Navigate to the Alphanumeric Sender ID blade in the resource menu, select dynamic tab and click on "Enable Alphanumeric Sender ID" button to enable alphanumeric sender ID service. If the enable button isn't available for your subscription and your [subscription address](../../concepts/numbers/sub-eligibility-number-capability.md) is supported for alphanumeric sender ID, [create a support ticket](https://aka.ms/ACS-Support).

:::image type="content" source="./media/enable-alphanumeric-sender-id/enable-alphanumeric-sender-id.png"alt-text="Screenshot showing an Alphanumeric senderID blade.":::

## Enable preregistered alphanumeric sender ID
To enable preregistered alphanumeric sender ID, go to your Communication Services resource on the [Azure portal](https://portal.azure.com).

:::image type="content" source="./media/enable-alphanumeric-sender-id/manage-phone-azure-portal-start-1.png"alt-text="Screenshot showing a Communication Services resource's main page.":::

Navigate to the Alphanumeric Sender ID blade in the resource menu, select preregistered tab and click on "Submit an application" button to submit the registration form.

:::image type="content" source="./media/enable-alphanumeric-sender-id/enable-pre-reg-alphanumeric-sender-id.png"alt-text="Screenshot showing the preregistered tab in Alphanumeric senderID blade.":::

## Next steps

> [!div class="nextstepaction"]
> [Send an SMS](../sms/send.md)

The following documents may be interesting to you:

- Familiarize yourself with the [SMS SDK](../../concepts/sms/sdk-features.md)
