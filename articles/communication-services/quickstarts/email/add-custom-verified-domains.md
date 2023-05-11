---
title: How to add custom verified domains to Email Communication Service
titleSuffix: An Azure Communication Services quick start guide
description: Learn about adding Custom domains for Email Communication Services.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: quickstart
ms.service: azure-communication-services
---
# Quickstart: How to add custom verified domains to Email Communication Service

In this quick start, you learn about how to add a custom domain and verify in Azure Communication Services to send email.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource created and ready to provision the domains [Get started with Creating Email Communication Resource](../../quickstarts/email/create-email-communication-resource.md)

## Azure Managed Domains vs. Custom Domains

Before provisioning a Custom Domain, review the following table to determine which domain type is most appropriate for your particular use case.

| | [Azure Managed Domains](./add-azure-managed-domains.md) | [Custom Domains](./add-custom-verified-domains.md) | 
|---|---|---|
|**Pros:** | - Setup is quick & easy<br/>- No domain verification required<br /> | - Emails are sent from your own domain |
|**Cons:** | - Sender domain is not personalized and cannot be changed | - Requires verification of domain records <br /> - Longer setup for verification |

## Provision custom domain
To provision a custom domain, you need to:
    
* Verify the custom domain ownership by adding TXT record in your DNS.
* Configure the sender authentication by adding SPF and DKIM records.

### Verify custom domain

1. Go the overview page of the Email Communications Service resource that you created earlier.
2. Setup Custom Domain.   
    - (Option 1) Click the **Setup** button under **Setup a custom domain**. Move to the next step.


      :::image type="content" source="./media/email-domains-custom.png" alt-text="Screenshot that shows how to set up a custom domain.":::

    - (Option 2) Click **Provision Domains** on the left navigation panel.
    
        :::image type="content" source="./media/email-domains-custom-navigation.png" alt-text="Screenshot that shows the navigation link to Provision Domains page.":::

    - Click **Add domain** on the upper navigation bar.
    - Select **Custom domain** from the dropdown.
3. Navigate to "Add a custom Domain". 
4. Enter  your "Domain Name" and re enter domain name.
5. Click **Confirm**   

    :::image type="content" source="./media/email-domains-custom-add.png" alt-text="Screenshot that shows where to enter the custom domain value.":::
6. Ensure that domain name isn't misspelled or click edit to correct the domain name and confirm.
7. Click **Add**

    :::image type="content" source="./media/email-domains-custom-add-confirm.png" alt-text="Screenshot that shows how to add a custom domain of your choice.":::

8. A custom domain configuration is created for your domain.

    :::image type="content" source="./media/email-domains-custom-add-progress.png" alt-text="Screenshot that shows the progress of custom domain Deployment.":::

9. You can verify the ownership of the domain by clicking **Verify Domain** 

    :::image type="content" source="./media/email-domains-custom-added.png" alt-text="Screenshot that shows custom domain is successfully added for verification.":::.

10. If you would like to resume the verification later, you can click **Close** and resume the verification from **Provision Domains** by clicking **Configure** .

    :::image type="content" source="./media/email-domains-custom-configure.png" alt-text="Screenshot that shows the added domain ready for verification in the list of provisioned domains." lightbox="media/email-domains-custom-configure-expanded.png":::
11. Clicking **Verify Domain** or **Configure** navigates to "Verify Domain via TXT record" to follow. 

    :::image type="content" source="./media/email-domains-custom-verify.png" alt-text="Screenshot that shows the Configure link that you need to click to verify domain ownership." lightbox="media/email-domains-custom-verify-expanded.png":::

12. You need add the above TXT record to your domain's registrar or DNS hosting provider. Click **Next** once you've completed this step. 

13. Verify that TXT record is created successfully in your DNS and Click **Done**
14. DNS changes take up to 15 to 30 minutes. Click **Close**

    :::image type="content" source="./media/email-domains-custom-verify-progress.png" alt-text="Screenshot that shows the domain verification is in progress.":::
15. Once your domain is verified, you can add your SPF and DKIM records to authenticate your domains. 

    :::image type="content" source="./media/email-domains-custom-verified.png" alt-text="Screenshot that shows the custom domain is verified." lightbox="media/email-domains-custom-verified-expanded.png":::


### Configure sender authentication for custom domain
1. Navigate to  **Provision Domains** and confirm that  **Domain Status** is in "Verified" state. 
2. You can add SPF and DKIM  by clicking **Configure**. You need add the following TXT record and CNAME records to your domain's registrar or DNS hosting provider. Click **Next** once you've completed this step. 

    :::image type="content" source="./media/email-domains-custom-spf.png" alt-text="Screenshot that shows the D N S records that you need to add for S P F validation for your verified domains.":::

    :::image type="content" source="./media/email-domains-custom-dkim-1.png" alt-text="Screenshot that shows the D N S records that you need to add for D K I M.":::

    :::image type="content" source="./media/email-domains-custom-dkim-2.png" alt-text="Screenshot that shows the D N S records that you need to add for additional D K I M records.":::

3. Verify that TXT and CNAME records are created successfully in your DNS and Click **Done**
 
    :::image type="content" source="./media/email-domains-custom-spf-dkim-verify.png" alt-text="Screenshot that shows the DNS records that you need to add for S P F and D K I M.":::

4. DNS changes take up to 15 to 30 minutes. Click **Close**

    :::image type="content" source="./media/email-domains-custom-spf-dkim-verify-progress.png" alt-text="Screenshot that shows that the sender authentication verification is in progress.":::
    
5. Wait for Verification to complete. You can check the verification status from **Provision Domains** page. 

    :::image type="content" source="./media/email-domains-custom-verification-status.png" alt-text="Screenshot that shows that the sender authentication verification is done." lightbox="media/email-domains-custom-verification-status-expanded.png":::
 
6. Once your sender authentication configurations are successfully verified, your email domain is ready to send emails using custom domain.

   :::image type="content" source="./media/email-domains-custom-ready.png" alt-text="Screenshot that shows that your verified custom domain is ready to send Email." lightbox="media/email-domains-custom-ready-expanded.png":::

## Changing MailFrom and FROM display name for custom domains

You can optionally configure your MailFrom address to be something other than the default DoNotReply, and also add more than one sender username to your domain. To understand how to configure your sender address, see how to [add multiple sender addresses](add-multiple-senders.md).

**Your email domain is now ready to send emails.**

## Next steps

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

* [How to send an email using Azure Communication Service](../../quickstarts/email/send-email.md)


The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
