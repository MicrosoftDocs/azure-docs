---
title: How to add and remove multiple sender addresses in Azure Communication Services to send email.
titleSuffix: An Azure Communication Services quick start guide.
description: Learn about how to add multiple sender address to Email Communication Services.
author: bashan-git
manager: sundraman
services: azure-communication-services
ms.author: bashan
ms.date: 03/29/2023
ms.topic: quickstart
ms.service: azure-communication-services
---
# Quickstart:  How to add and remove Multiple Sender Addresses to Email Communication Service

In this quick start, you learn about how to add and remove multiple sender addresses in Azure Communication Services to send email.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource created and ready to provision the domains [Get started with Creating Email Communication Resource](../../quickstarts/email/create-email-communication-resource.md)
- An [Azure Managed Domain](../../quickstarts/email/add-azure-managed-domains.md) or [Custom Domain](../../quickstarts/email/add-custom-verified-domains.md) provisioned and ready.

## Creating multiple sender usernames   
When Email Domain is provisioned to send mail, it has default MailFrom address as donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net or 
if you have configured custom domain such as "notification.azuremails.net" then the default MailFrom address as "donotreply@notification.azurecommtest.net" added. You can configure and add additional MailFrom addresses and FROM display name to more user friendly value.

1. Go the overview page of the Email Communications Service resource that you created earlier.
2. Click **Provision Domains** on the left navigation panel. You see list of provisioned domains.
3. Click on the one of the provisioned domains.

     :::image type="content" source="../../quickstarts/email/media/email-provisioned-domains.png" alt-text="Screenshot that shows Domain link in list of provisioned email domains." lightbox="../../quickstarts/email/media/email-provisioned-domains-expanded.png":::
     
4. The navigation lands in Domain Overview page. Click on **MailFrom Addresses** link in left navigation. You see the default donotreply in MailFrom addresses list.
 
    :::image type="content" source="../../quickstarts/email/media/email-mailfrom-overview.png" alt-text="Screenshot that explains how to list of MailFrom addresses.":::

5. Click on **Add**.
     :::image type="content" source="../../quickstarts/email/media/email-domains-mailfrom-add.png" alt-text="Screenshot that explains how to change MailFrom address and display name.":::
    
6.  Enter the Display Name and MailFrom address. Click **Save**.  

    :::image type="content" source="../../quickstarts/email/media/email-domains-mailfrom-add-save.png" alt-text="Screenshot that explains how to save MailFrom address and display name.":::
   
7. Click **Save**. You see the updated list with newly added MailFrom address in the overview page.

    :::image type="content" source="../../quickstarts/email/media/email-mailfrom-overview-updated.png" alt-text="Screenshot that shows Mailfrom addresses list with updated values." lightbox="../../quickstarts/email/media/email-mailfrom-overview-updated-expanded.png":::

**Your email domain is now ready to send emails with the MailFrom address added.**

## Removing multiple sender usernames

1. Go the Domains overview page Click on **MailFrom addresses** link in left navigation. You'll able to see the MailFrom addresses in list. 

:::image type="content" source="../../quickstarts/email/media/email-mailfrom-overview-updated.png" alt-text="Screenshot that shows MailFrom addresses." lightbox="../../quickstarts/email/media/email-mailfrom-overview-updated-expanded.png":::

2. Select the MailFrom address that needs to be removed and Click on **Delete** button.

:::image type="content" source="../../quickstarts/email/media/email-domains-mailfrom-delete.png" alt-text="Screenshot that shows MailFrom addresses list with deletion.":::

3. You see the updated list with newly added  MailFrom address in the overview page.

    :::image type="content" source="../../quickstarts/email/media/email-mailfrom-overview.png" alt-text="Screenshot that shows MailFrom addresses list after deletion." lightbox="../../quickstarts/email/media/email-mailfrom-overview-expanded.png":::


## Next steps

* [Get started with create and manage Email Communication Service in Azure Communication Service](../../quickstarts/email/create-email-communication-resource.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
