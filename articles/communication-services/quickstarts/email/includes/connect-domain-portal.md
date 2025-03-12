---
title: include file
description: include file
author: yogeshmo
manager: koagbakp
services: azure-communication-services
ms.author: yogeshmo
ms.date: 05/24/2023
ms.topic: include
ms.service: azure-communication-services
ms.custom: mode-other
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource ready to provision domains. [Get started creating an Email Communication Resource](../create-email-communication-resource.md).
- An [Azure Managed Domain](../add-azure-managed-domains.md) or [Custom Domain](../add-custom-verified-domains.md) provisioned and ready to send emails. This domain must be fully verified before attempting to link it to the Communication Service resource.
- An Azure Communication Services Resource. [Create a Communication Services Resources.](../../create-communication-resource.md)

## Connect an email domain to a Communication Service Resource

1. In the Azure Communication Service Resource overview page, in the left navigation panel under Email, click **Domains**.

    :::image type="content" source="../media/email-domains.png" alt-text="Screenshot that shows the left navigation panel for linking Email Domains." lightbox="../media/email-domains.png":::

2. Select one of the following options:

    - From the upper navigation bar, click **Connect domain**.
    - From the splash screen, click **Connect domain**.
     
        :::image type="content" source="../media/email-domains-connect.png" alt-text="Screenshot that shows how to connect one of your verified email domains." lightbox="../media/email-domains-connect.png":::

3. Select one of the verified domains by filtering:

    - **Subscription**
    - **Resource Group**
    - **Email Service**
    - **Verified Domain**
    
    :::image type="content" source="../media/email-domains-connect-select.png" alt-text="Screenshot that shows how to filter and select one of the verified email domains to connect." lightbox="../media/email-domains-connect-select.png":::

> [!Note]
> You can only connect domains in the same geography. Please ensure that the Data location for Communication Resource and Email Communication Resource you selected during resource creation are in the same geography.

4. Click **Connect**.
 
    :::image type="content" source="../media/email-domains-connected.png" alt-text="Screenshot that shows one of the verified email domains is now connected." lightbox="../media/email-domains-connected.png":::

> [!Note]
> We enable customers to link up to 100 custom domains to a single communication service resource. All Mail-From addresses configured under these custom domains are accessible for the communication service resource. You can only link verified custom domains.

## Disconnect an email domain from the Communication Service Resource

1. In the Azure Communication Services Resource overview page, from the left navigation panel under Email, click **Domains**.

1. Select the Connected Domains, then click **...** and select **Disconnect**.

    :::image type="content" source="../media/email-domains-connect-disconnect.png" alt-text="Screenshot that shows how to disconnect the connected domain." lightbox="../media/email-domains-connect-disconnect.png":::
