---
author: v-vprasannak
ms.service: azure-communication-services
ms.topic: include
ms.date: 04/26/2024
ms.author: v-vprasannak
---
## Prerequisites

- An Azure account with an active subscription. See [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Communication Services Email Resource created and ready to add the domains. See [Get started with Creating Email Communication Resource](../../../quickstarts/email/create-email-communication-resource.md).

## Provision a custom domain

To provision a custom domain, you need to:
    
* Verify the custom domain ownership by adding a TXT record in your Domain Name System (DNS).
* Configure the sender authentication by adding Sender Policy Framework (SPF) and DomainKeys Identified Mail (DKIM) records.

### Verify custom domain

In this section, you verify the custom domain ownership by adding a TXT record in your DNS.

1. Open the Overview page of the Email Communication Service resource that you created in [Get started with Creating Email Communication Resource](../../../quickstarts/email/create-email-communication-resource.md).
2. Create a custom domain using one of the following options.
    - (Option 1) Click the **Setup** button under **Setup a custom domain**. Continue to **step 3**.

      :::image type="content" source="../media/email-domains-custom.png" alt-text="Screenshot that shows how to set up a custom domain.":::

    - (Option 2) Click **Provision Domains** on the left navigation panel.
    
        :::image type="content" source="../media/email-domains-custom-navigation.png" alt-text="Screenshot that shows the navigation link to Provision Domains page.":::

    - Click **Add domain** on the upper navigation bar.
    - Select **Custom domain** from the dropdown.
3. Click **Add a custom Domain**.
4. Enter your domain name in the text box.
5. Re-enter your domain name in the next text box.
6. Click **Confirm**.

    :::image type="content" source="../media/email-domains-custom-add.png" alt-text="Screenshot that shows where to enter the custom domain value.":::

7. Make sure the domain name you entered is correct and both text boxes are the same. If needed, click **Edit** to correct the domain name before confirming.
8. Click **Add**.

    :::image type="content" source="../media/email-domains-custom-add-confirm.png" alt-text="Screenshot that shows how to add a custom domain of your choice.":::

9. Azure Communication Services creates a custom domain configuration for your domain.

    :::image type="content" source="../media/email-domains-custom-add-progress.png" alt-text="Screenshot that shows the progress of custom domain Deployment.":::

10. To verify domain ownership, click **Verify Domain**.

    :::image type="content" source="../media/email-domains-custom-added.png" alt-text="Screenshot that shows custom domain is successfully added for verification.":::.

11. To resume the verification later, click **Close** and resume. Then to continue verification from Provision Domains, click **Configure**.

    :::image type="content" source="../media/email-domains-custom-configure.png" alt-text="Screenshot that shows the added domain ready for verification in the list of provisioned domains." lightbox="../media/email-domains-custom-configure-expanded.png":::

12. When you select either **Verify Domain** or **Configure**, it opens the **Verify Domain via TXT record** dialog box.

    :::image type="content" source="../media/email-domains-custom-verify.png" alt-text="Screenshot that shows the Configure link that you need to click to verify domain ownership." lightbox="../media/email-domains-custom-verify-expanded.png":::

13. Add the preceding TXT record to your domain's registrar or DNS hosting provider. Refer to the [TXT records](#txt-records) section for information about adding a TXT record for your DNS provider.
   
    Once you complete this step, click **Next**.
   
14. Verify that the TXT record was successfully created in your DNS, then click **Done**.
15. DNS changes require 15 to 30 minutes to take effect. Click **Close**.

    :::image type="content" source="../media/email-domains-custom-verify-progress.png" alt-text="Screenshot that shows the domain verification is in progress.":::

16. Once you verify your domain, you can add your SPF and DKIM records to authenticate your domains. 

    :::image type="content" source="../media/email-domains-custom-verified.png" alt-text="Screenshot that shows the custom domain is verified." lightbox="../media/email-domains-custom-verified-expanded.png":::
    
### Configure sender authentication for custom domain

To configure sender authentication for your domains, you need to add more Domain Name Service (DNS) records. This section describes how Azure Communication Services offer records for you to add to your DNS. However, depending on whether the domain you're registering is a root domain or a subdomain, you need to add the records to the respective zone or make changes to the automatically generated records.

This section shows how to add SPF and DKIM records for the custom domain **sales.us.notification.azurecommtest.net**. The following examples describe four different methods for adding these records to the DNS, depending on the level of the zone where you're adding the records.

1. Zone: **sales.us.notification.azurecommtest.net**

  | Record | Type | Name | Value |
  | --- | --- | --- | --- |
  |SPF | TXT | sales.us.notification.azurecommtest.net | v=spf1 include:spf.protection.outlook.com -all |  
  | DKIM | CNAME | selector1-azurecomm-prod-net._domainkey | selector1-azurecomm-prod-net._domainkey.azurecomm.net  |  
  | DKIM2 | CNAME | selector2-azurecomm-prod-net._domainkey | selector2-azurecomm-prod-net._domainkey.azurecomm.net  |

The records generated by the portal assume that you are adding these records to the DNS in this zone **sales.us.notification.azurecommtest.net**.

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
  

### Add SPF and DKIM Records 

In this section, you configure the sender authentication by adding Sender Policy Framework (SPF) and DomainKeys Identified Mail (DKIM) records.

1. Open **Provision Domains** and confirm that  **Domain Status** is in the `Verified` state. 
2. To add SPF and DKIM information, click **Configure**.
3. Add the following TXT record and CNAME records to your domain's registrar or DNS hosting provider. Refer to the [adding DNS records in popular domain registrars table](#cname-records) for information about adding a TXT and CNAME record for your DNS provider.
 
    :::image type="content" source="../media/email-domains-custom-spf.png" alt-text="Screenshot that shows the D N S records that you need to add for S P F validation for your verified domains.":::
    :::image type="content" source="../media/email-domains-custom-dkim-1.png" alt-text="Screenshot that shows the D N S records that you need to add for D K I M.":::
    :::image type="content" source="../media/email-domains-custom-dkim-2.png" alt-text="Screenshot that shows the D N S records that you need to add for additional D K I M records.":::

4. When you're done adding TXT and CNAME information, click **Next** to continue.

4. Verify that TXT and CNAME records were successfully created in your DNS. Then click **Done**.
 
    :::image type="content" source="../media/email-domains-custom-spf-dkim-verify.png" alt-text="Screenshot that shows the DNS records that you need to add for S P F and D K I M.":::

5. DNS changes take effect in 15 to 30 minutes. Click **Close** and wait for verification to complete.

    :::image type="content" source="../media/email-domains-custom-spf-dkim-verify-progress.png" alt-text="Screenshot that shows that the sender authentication verification is in progress.":::
    
6. Check the verification status at the **Provision Domains** page.

    :::image type="content" source="../media/email-domains-custom-verification-status.png" alt-text="Screenshot that shows that the sender authentication verification is done." lightbox="../media/email-domains-custom-verification-status-expanded.png":::
 
7. Once you verify sender authentication configurations, your email domain is ready to send emails using the custom domain.

   :::image type="content" source="../media/email-domains-custom-ready.png" alt-text="Screenshot that shows that your verified custom domain is ready to send Email." lightbox="../media/email-domains-custom-ready-expanded.png":::
