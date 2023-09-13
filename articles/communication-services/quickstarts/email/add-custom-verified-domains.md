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
3. Navigate to "Add a custom Domain."
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

12. Add the above TXT record to your domain's registrar or DNS hosting provider. Refer to the [adding DNS records in popular domain registrars table](#txt-records) for information on how to add a TXT record for your DNS provider. 

Click **Next** once you've completed this step. 

13. Verify that TXT record is created successfully in your DNS and Click **Done**
14. DNS changes take up to 15 to 30 minutes. Click **Close**

    :::image type="content" source="./media/email-domains-custom-verify-progress.png" alt-text="Screenshot that shows the domain verification is in progress.":::
15. Once your domain is verified, you can add your SPF and DKIM records to authenticate your domains. 

    :::image type="content" source="./media/email-domains-custom-verified.png" alt-text="Screenshot that shows the custom domain is verified." lightbox="media/email-domains-custom-verified-expanded.png":::


### Configure sender authentication for custom domain
To configure sender authentication for your domains, additional DNS records need to be added to your domain. Below, we provide steps where Azure Communication Services will offer records that should be added to your DNS. However, depending on whether the domain you are registering is a root domain or a subdomain, you will need to add the records to the respective zone or make appropriate alterations to the records that we generate.

As an example, let's consider adding SPF and DKIM records for the custom domain "sales.us.notification.azurecommtest.net." The following are different methods for adding these records to the DNS, depending on the level of the Zone where the records are being added.

1. Zone: **sales.us.notification.azurecommtest.net**

  | Record | Type | Name | Value |
  | --- | --- | --- | --- |
  |SPF | TXT | sales.us.notification.azurecommtest.net | v=spf1 include:spf.protection.outlook.com -all |  
  | DKIM | CNAME | selector1-azurecomm-prod-net._domainkey | selector1-azurecomm-prod-net._domainkey.azurecomm.net  |  
  | DKIM2 | CNAME | selector2-azurecomm-prod-net._domainkey | selector2-azurecomm-prod-net._domainkey.azurecomm.net  |

The records that get generated in our portal assumes that you will be adding these records in DNS in this Zone **sales.us.notification.azurecommtest.net**.

2. Zone: **us.notification.azurecommtest.net**

  | Record | Type | Name | Value |
  | --- | --- | --- | --- |
  |SPF | TXT | sales | v=spf1 include:spf.protection.outlook.com -all |  
  | DKIM | CNAME | selector1-azurecomm-prod-net._domainkey.**sales** | selector1-azurecomm-prod-net._domainkey.azurecomm.net  |  
  | DKIM2 | CNAME | selector2-azurecomm-prod-net._domainkey.**sales** | selector2-azurecomm-prod-net._domainkey.azurecomm.net  |
          
3. Zone: **notification.azurecommtest.net**

  | Record | Type | Name | Value |
  | --- | --- | --- | --- |
  |SPF | TXT | sales.us | v=spf1 include:spf.protection.outlook.com -all |  
  | DKIM | CNAME | selector1-azurecomm-prod-net._domainkey.**sales.us** | selector1-azurecomm-prod-net._domainkey.azurecomm.net  |  
  | DKIM2 | CNAME | selector2-azurecomm-prod-net._domainkey.**sales.us** | selector2-azurecomm-prod-net._domainkey.azurecomm.net  |
  

          
4. Zone: **azurecommtest.net**

  | Record | Type | Name | Value |
  | --- | --- | --- | --- |
  |SPF | TXT | sales.us.notification | v=spf1 include:spf.protection.outlook.com -all |  
  | DKIM | CNAME | selector1-azurecomm-prod-net._domainkey.**sales.us.notification** | selector1-azurecomm-prod-net._domainkey.azurecomm.net  |  
  | DKIM2 | CNAME | selector2-azurecomm-prod-net._domainkey.**sales.us.notification** | selector2-azurecomm-prod-net._domainkey.azurecomm.net  |
  


#### Adding SPF and DKIM Records 


1. Navigate to  **Provision Domains** and confirm that  **Domain Status** is in "Verified" state. 
2. You can add SPF and DKIM  by clicking **Configure**. Add the following TXT record and CNAME records to your domain's registrar or DNS hosting provider. Refer to the [adding DNS records in popular domain registrars table](#cname-records) for information on how to add a TXT & CNAME record for your DNS provider.

    Click **Next** once you've completed this step. 
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

## Adding DNS records in popular domain registrars

### TXT records

The following links provide additional information on how to add a TXT record using many of the popular domain registrars.

| Registrar Name | Documentation Link |
| --- | --- |
| IONOS by 1 & 1 | [Steps 1-7](/microsoft-365/admin/dns/create-dns-records-at-1-1-internet?view=o365-worldwide#:~:text=Add%20a%20TXT%20record%20for%20verification,created%20can%20update%20across%20the%20Internet.&preserve-view=true) 
| 123-reg.co.uk | [Steps 1-6](/microsoft-365/admin/dns/create-dns-records-at-123-reg-co-uk?view=o365-worldwide#:~:text=DNS%20records.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet.,-Now%20that%20you%27ve&preserve-view=true)
| Amazon Web Services (AWS) | [Steps 1-8](/microsoft-365/admin/dns/create-dns-records-at-aws?view=o365-worldwide#:~:text=DNS%20records.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet.,-Now%20that%20you%27ve&preserve-view=true)
| Cloudflare | [Steps 1-6](/microsoft-365/admin/dns/create-dns-records-at-cloudflare?view=o365-worldwide#:~:text=Add%20a%20TXT,across%20the%20Internet.&preserve-view=true)
| GoDaddy | [Steps 1-6](/microsoft-365/admin/dns/create-dns-records-at-godaddy?view=o365-worldwide#:~:text=Add%20a%20TXT,across%20the%20Internet.&preserve-view=true)
| Namecheap | [Steps 1-9](/microsoft-365/admin/dns/create-dns-records-at-namecheap?view=o365-worldwide#:~:text=DNS%20records.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet.,-Now%20that%20you%27ve&preserve-view=true)
| Network Solutions | [Steps 1-9](/microsoft-365/admin/dns/create-dns-records-at-network-solutions?view=o365-worldwide#:~:text=DNS%20records.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet,-.&preserve-view=true)
| OVH | [Steps 1-9](/microsoft-365/admin/dns/create-dns-records-at-ovh?view=o365-worldwide#:~:text=DNS%20records.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet.,-Now%20that%20you%27ve&preserve-view=true)
| web.com | [Steps 1-8](/microsoft-365/admin/dns/create-dns-records-at-web-com?view=o365-worldwide#:~:text=with%20your%20domain.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet,-.&preserve-view=true)
| Wix | [Steps 1-5](/microsoft-365/admin/dns/create-dns-records-at-wix?view=o365-worldwide#:~:text=DNS%20records.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet,-.&preserve-view=true)
| Other (General) | [Steps 1-4](/microsoft-365/admin/get-help-with-domains/create-dns-records-at-any-dns-hosting-provider?view=o365-worldwide#:~:text=Recommended%3A%20Verify%20with,domain%20is%20verified.&preserve-view=true)

### CNAME records

The following links provide additional information on how to add a CNAME record using many of the popular domain registrars (Make sure to use the values from the configuration window rather than the ones in the documentation link.)

| Registrar Name | Documentation Link |
| --- | --- |
| IONOS by 1 & 1 | [Steps 1-10](/microsoft-365/admin/dns/create-dns-records-at-1-1-internet?view=o365-worldwide#:~:text=Add%20the%20CNAME,Select%20Save.&preserve-view=true) 
| 123-reg.co.uk | [Steps 1-6](/microsoft-365/admin/dns/create-dns-records-at-123-reg-co-uk?view=o365-worldwide#:~:text=for%20that%20record.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft,Select%20Add.,-Add%20a%20TXT&preserve-view=true)
| Amazon Web Services (AWS) | [Steps 1-8](/microsoft-365/admin/dns/create-dns-records-at-aws?view=o365-worldwide#:~:text=selecting%20Delete.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft%20365,Select%20Create%20records.,-Add%20a%20TXT&preserve-view=true)
| Cloudflare | [Steps 1-6](/microsoft-365/admin/dns/create-dns-records-at-cloudflare?view=o365-worldwide#:~:text=Add%20the%20CNAME,Select%20Save.&preserve-view=true)
| GoDaddy | [Steps 1-6](/microsoft-365/admin/dns/create-dns-records-at-godaddy?view=o365-worldwide#:~:text=Add%20the%20CNAME,Select%20Save.&preserve-view=true)
| Namecheap | [Steps 1-8](/microsoft-365/admin/dns/create-dns-records-at-namecheap?view=o365-worldwide#:~:text=in%20this%20procedure.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft,Select%20the%20Save%20Changes%20(check%20mark)%20control.,-Add%20a%20TXT&preserve-view=true)
| Network Solutions | [Steps 1-9](/microsoft-365/admin/dns/create-dns-records-at-network-solutions?view=o365-worldwide#:~:text=for%20each%20record.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft,View%20in%20the%20upper%20right%20to%20view%20the%20record%20you%20created.,-Add%20a%20TXT&preserve-view=true)
| OVH | [Steps 1-8](/microsoft-365/admin/dns/create-dns-records-at-ovh?view=o365-worldwide#add-the-cname-record-required-for-microsoft:~:text=Select%20Confirm.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft,Select%20Confirm.,-Add%20a%20TXT&preserve-view=true)
| web.com | [Steps 1-8](/microsoft-365/admin/dns/create-dns-records-at-web-com?view=o365-worldwide#add-the-cname-record-required-for-microsoft:~:text=for%20each%20record.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft,Select%20ADD.,-Add%20a%20TXT&preserve-view=true)
| Wix | [Steps 1-5](/microsoft-365/admin/dns/create-dns-records-at-wix?view=o365-worldwide#add-the-cname-record-required-for-microsoft:~:text=Select%20Save.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet.,-Add%20a%20TXT&preserve-view=true)
| Other (General) | [Guide](/microsoft-365/admin/dns/create-dns-records-using-windows-based-dns?view=o365-worldwide#add-cname-records:~:text=%3E%20OK.-,Add%20CNAME%20records,Select%20OK.,-Add%20the%20SIP&preserve-view=true)

## Next steps

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

* [How to send an email using Azure Communication Service](../../quickstarts/email/send-email.md)


The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
