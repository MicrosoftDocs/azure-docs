---
title: How to connect a verified email domain with Azure Communication Service resource
titleSuffix: An Azure Communication Services quick start guide
description: Learn about how to connect verified email domains with Azure Communication Services Resource.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: quickstart
ms.service: azure-communication-services
---
# Quickstart: How to connect a verified email domain with Azure Communication Service resource

In this quick start, you'll learn about how to connect a verified domain in Azure Communication Services to send email.

## Connect an email domain to a Communication Service Resource

1. [Create a Communication Services Resources](../create-communication-resource.md) to connect to a verified domain.
2. In the Azure Communication Service Resource overview page, click **Domains** on the left navigation panel under Email.

    :::image type="content" source="./media/email-domains.png" alt-text="Screenshot that shows the left navigation panel for linking Email Domains." lightbox="media/email-domains-expanded.png":::

3. Select one of the options below
    - Click **Connect domain** in the upper navigation bar.
    - Click **Connect domain** in the splash screen.
     
        :::image type="content" source="./media/email-domains-connect.png" alt-text="Screenshot that shows how to connect one of your verified email domains." lightbox="media/email-domains-connect-expanded.png":::
4. Select a one of the verified domains by filtering 
    - Subscription
    - Resource Group
    - Email Service
    - Verified Domain
    
    :::image type="content" source="./media/email-domains-connect-select.png" alt-text="Screenshot that shows how to filter and select one of the verified email domains to connect." lightbox="media/email-domains-connect-select-expanded.png":::
> [!Note]
> We allow only connecting the domains in the same geography. Please ensure that Data location for Communication Resource and Email Communication Resource that was selected during resource creation are the same.

5. Click Connect
 
    :::image type="content" source="./media/email-domains-connected.png" alt-text="Screenshot that shows one of the verified email domains is now connected." lightbox="media/email-domains-connected-expanded.png":::

## Disconnect an email domain from the Communication Service Resource

1. In the Azure Communication Service Resource overview page, click **Domains** on the left navigation panel under Email.
2. Select the Connected Domains click the ... and click Disconnect.  

    :::image type="content" source="./media/email-domains-connect-disconnect.png" alt-text="Screenshot that shows how to disconnect the connected domain." lightbox="media/email-domains-connect-disconnect-expanded.png":::


## Next steps

* [How to send an Email](../../quickstarts/email/send-email.md)

* [What is Email Communication Resource for Azure Communication Service](../../concepts/email/prepare-email-communication-resource.md)


The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
