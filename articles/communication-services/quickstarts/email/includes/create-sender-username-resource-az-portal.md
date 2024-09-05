---
author: v-vprasannak
ms.service: azure-communication-services
ms.topic: include
ms.date: 04/29/2024
ms.author: v-vprasannak
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Communication Services Email Resource created and ready to add the domains. See [Get started with Creating Email Communication Resource](../../../quickstarts/email/create-email-communication-resource.md).
- A custom domain with higher than default sending limits provisioned and ready. See [Quickstart: How to add custom verified email domains](../../../quickstarts/email/add-custom-verified-domains.md).


## Create multiple sender usernames

An email domain that is provisioned to send email has a default MailFrom address, formatted as `donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net`. If you configure a custom domain such as `notification.azuremails.net`, then the default MailFrom address has `donotreply@notification.azurecommtest.net` added. You can configure and add more MailFrom addresses and FROM display names to use values that are easier to read.

> [!NOTE]
> Sender usernames cannot be enabled for Azure Managed Domains or custom domains with default sending limits. For more information, see [Service limits for Azure Communication Services](../../../concepts/service-limits.md#rate-limits).

1. Open the Overview page of the Email Communication Service resource that you created in [Get started with Creating Email Communication Resource](../../../quickstarts/email/create-email-communication-resource.md).
2. Click **Provision Domains** on the left navigation panel to see list of provisioned domains.
3. Click on the one of the provisioned domains to open the Domain Overview page.

     :::image type="content" source="../../../quickstarts/email/media/email-provisioned-domains.png" alt-text="Screenshot that shows Domain link in list of provisioned email domains." lightbox="../../../quickstarts/email/media/email-provisioned-domains-expanded.png":::
     
4. Click the **MailFrom Addresses** link in left navigation to see the default `donotreply` in MailFrom addresses list.
 
    :::image type="content" source="../../../quickstarts/email/media/email-mailfrom-overview.png" alt-text="Screenshot that explains how to list of MailFrom addresses.":::

5. Click **Add**.
    
     :::image type="content" source="../../../quickstarts/email/media/email-domains-mailfrom-add.png" alt-text="Screenshot that explains how to change MailFrom address and display name.":::
    
6.  Enter the Display Name and MailFrom address. Click **Save**.  

    :::image type="content" source="../../../quickstarts/email/media/email-domains-mailfrom-add-save.png" alt-text="Screenshot that explains how to save MailFrom address and display name.":::
   
7. Click **Save** to see the updated list with newly added MailFrom address in the overview page.

    :::image type="content" source="../../../quickstarts/email/media/email-mailfrom-overview-updated.png" alt-text="Screenshot that shows Mailfrom addresses list with updated values." lightbox="../../../quickstarts/email/media/email-mailfrom-overview-updated-expanded.png":::

**Your email domain is now ready to send emails with the MailFrom address added.**

## Removing multiple sender usernames

1. Open the Domains overview page.
2. Click on **MailFrom addresses** link in left navigation to see the MailFrom addresses list. 

    :::image type="content" source="../../../quickstarts/email/media/email-mailfrom-overview-updated.png" alt-text="Screenshot that shows MailFrom addresses." lightbox="../../../quickstarts/email/media/email-mailfrom-overview-updated-expanded.png":::

3. Select the MailFrom address that needs to be removed and click **Delete**.

    :::image type="content" source="../../../quickstarts/email/media/email-domains-mailfrom-delete.png" alt-text="Screenshot that shows MailFrom addresses list with deletion.":::

4. Review the updated list of MailFrom addresses in the overview page.

    :::image type="content" source="../../../quickstarts/email/media/email-mailfrom-overview.png" alt-text="Screenshot that shows MailFrom addresses list after deletion." lightbox="../../../quickstarts/email/media/email-mailfrom-overview-expanded.png":::
