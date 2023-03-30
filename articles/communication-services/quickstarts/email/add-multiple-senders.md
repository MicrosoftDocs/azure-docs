---
title: How to add and remove Multiple Sender Addresses to Email Communication Service
titleSuffix: An Azure Communication Services quick start guide
description: Learn about how to add mutiple sender address to Email Communication Services.
author: bashan-git
manager: sundraman
services: azure-communication-services
ms.author: bashan
ms.date: 03/29/2023
ms.topic: quickstart
ms.service: azure-communication-services
---
# Quickstart:  How to add and remove Multiple Sender Addresses to Email Communication Service

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

In this quick start, you'll learn about how to provision the Azure Managed domain in Azure Communication Services to send email.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource created and ready to provision the domains [Get started with Creating Email Communication Resource](../../quickstarts/email/create-email-communication-resource.md)
- An [Azure Managed Domain](../../quickstarts/email/add-azure-managed-domains.md) or [Custom Domain](../../quickstarts/email/add-custom-verified-domains.md) provisioned and ready.

## Creating multiple sender usernames   
When Email Domain is provisioned to send mail, it has default Mail From address as donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net or 
if you have configured custom domain such as "notification.azuremails.net" the default Mail from address as "donotreply@notification.azurecommtest.net" added to mailfrom address. You'll able to configure and add addtional Mail from address and FROM display name to more user friendly value.

1. Go the overview page of the Email Communications Service resource that you created earlier.
2. Click **Provision Domains** on the left navigation panel. You'll see list of provisioned domains.
3. Click on the one of the provisioned domains.
     :::image type="content" source="./media/email-provisioned-domains.png" alt-text="Screenshot that shows Azure Managed Domain link in list of provisioned email domains." lightbox="media/email-provisioned-domains-expanded.png":::
4. The navigation lands in Domain Overview page.  Click on **MailFrom addresses** link in left navigation. 
 
   :::image type="content" source="./media/email-provisioned-domains-overview.png" alt-text="Screenshot that shows the overview page of provisioned email domain."  lightbox="media/email-provisioned-domains-overview-expanded.png":::

5. You'll able to see the default donotreply MailFrom address in list. 

    :::image type="content" source="./media/email-domains-mailfrom.png" alt-text="Screenshot that explains how to change Mail From address and display name for an email address.":::

6.Click on **Add** You'll able to enter the Display Name and MailFrom address.

7. Click **Save**. You'll see the updated list with newly added  MailFrom address in the overview page.
    :::image type="content" source="./media/email-domains-overview-updated.png" alt-text="Screenshot that shows Azure Managed Domain overview page with updated values." lightbox="media/email-provisioned-domains-overview-expanded.png":::

**Your email domain is now ready to send emails with the Mailfrom address added.**

## Removing multiple sender usernames


## Next steps

* [Get started with create and manage Email Communication Service in Azure Communication Service](../../quickstarts/email/create-email-communication-resource.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
