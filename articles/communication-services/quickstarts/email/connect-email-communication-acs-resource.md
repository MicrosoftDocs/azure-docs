---
title: How to connect a verified email domain with Azure Communication Service resource
titleSuffix: An Azure Communication Services quick start guide
description: Learn about how to connect verified email domains with Azure Communication Services Resource.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 04/15/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: private_preview
---
# Quickstart: How to connect a verified email domain with Azure Communication Service resource

> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

## Connect an email domain to an Communication Service Resource

- [Create a Communication Services Resources](../create-communication-resource.md) to connect to a verified domain.
- In the Azure Communication Service Resource overview page, click **Domains** on the left navigation panel under Email.

    :::image type="content" source="./media/email-acs-domains.png" alt-text="Email Domains":::

- Select one of the options below
    - Click **Connect domain** in the upper navigation bar.
    - Click **Connect domain** in the splash screen.
     
        :::image type="content" source="./media/email-acs-domains-connect.png" alt-text="Connect your email domains":::
- Select a one of the verified domains by filtering 
    - Subscription
    - Resource Group
    - Email Service
    - Verified Domain
    
    :::image type="content" source="./media/email-acs-domains-connect-select.png" alt-text="Connect email domains":::
- Click Connect
 
    :::image type="content" source="./media/email-acs-domains-connected.png" alt-text="Domain Connected":::

## Disconnect an email domain from the Communication Service Resource

-  In the Azure Communication Service Resource overview page, click **Domains** on the left navigation panel under Email.
-  Select the Connected Domains click the ... and click Disconnect.  

    :::image type="content" source="./media/email-acs-domains-connect-disconnect.png" alt-text="Disconnect Domains":::


## Next steps

> [How to send an Email](../../quickstarts/email/send-email.md)

> [Best Practices for Sender Authentication Support in Azure Communication Services Email](../../concepts/email/email-authentication-bestpractice.md)


The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
