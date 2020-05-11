---
title: Troubleshoot domain and TLS/SSL certificates
description: Find solutions to the common problems that you might encounter when you configure a domain or TLS/SSL certificate in Azure App Service.
author: genlin
manager: dcscontentpm
tags: top-support-issue

ms.topic: article
ms.date: 03/01/2019
ms.author: genli
ms.custom: seodec18

---
# Troubleshoot domain and TLS/SSL certificate problems in Azure App Service

This article lists common problems that you might encounter when you configure a domain or TLS/SSL certificate for your web apps in Azure App Service. It also describes possible causes and solutions for these problems.

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/) and select **Get Support**.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Certificate problems

### You can't add a TLS/SSL certificate binding to an app 

#### Symptom

When you add a TLS binding, you receive the following error message:

"Failed to add SSL binding. Cannot set certificate for existing VIP because another VIP already uses that certificate."

#### Cause

This problem can occur if you have multiple IP-based SSL bindings for the same IP address across multiple apps. For example, app A has an IP-based SSL with an old certificate. App B has an IP-based SSL with a new certificate for the same IP address. When you update the app TLS binding with the new certificate, it fails with this error because the same IP address is being used for another app. 

#### Solution 

To fix this problem, use one of the following methods:

- Delete the IP-based SSL binding on the app that uses the old certificate. 
- Create a new IP-based SSL binding that uses the new certificate.

### You can't delete a certificate 

#### Symptom

When you try to delete a certificate, you receive the following error message:

"Unable to delete the certificate because it is currently being used in a TLS/SSL binding. The TLS binding must be removed before you can delete the certificate."

#### Cause

This problem might occur if another app uses the certificate.

#### Solution

Remove the TLS binding for that certificate from the apps. Then try to delete the certificate. If you still can't delete the certificate, clear the internet browser cache and reopen the Azure portal in a new browser window. Then try to delete the certificate.

### You can't purchase an App Service certificate 

#### Symptom
You can't purchase an [Azure App Service certificate](./configure-ssl-certificate.md#import-an-app-service-certificate) from the Azure portal.

#### Cause and solution
This problem can occur for any of the following reasons:

- The App Service plan is Free or Shared. These pricing tiers don't support TLS. 

    **Solution**: Upgrade the App Service plan for app to Standard.

- The subscription doesn't have a valid credit card.

    **Solution**: Add a valid credit card to your subscription. 

- The subscription offer doesn't support purchasing an App Service certificate such as Microsoft Student.  

    **Solution**: Upgrade your subscription. 

- The subscription reached the limit of purchases that are allowed on a subscription.

    **Solution**: App Service certificates have a limit of 10 certificate purchases for the Pay-As-You-Go and EA subscription types. For other subscription types, the limit is 3. To increase the limit, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- The App Service certificate was marked as fraud. You received the following error message: "Your certificate has been flagged for possible fraud. The request is currently under review. If the certificate does not become usable within 24 hours, contact Azure Support."

    **Solution**: If the certificate is marked as fraud and isn't resolved after 24 hours, follow these steps:

    1. Sign in to the [Azure portal](https://portal.azure.com).
    2. Go to **App Service Certificates**, and select the certificate.
    3. Select **Certificate Configuration** > **Step 2: Verify** > **Domain Verification**. This step sends an email notice to the Azure certificate provider to resolve the problem.

## Custom domain problems

### A custom domain returns a 404 error 

#### Symptom

When you browse to the site by using the custom domain name, you receive the following error message:

"Error 404-Web app not found."

#### Cause and solution

**Cause 1** 

The custom domain that you configured is missing a CNAME or A record. 

**Solution for cause 1**

- If you added an A record, make sure that a TXT record is also added. For more information, see [Create the A record](./app-service-web-tutorial-custom-domain.md#create-the-a-record).
- If you don't have to use the root domain for your app, we recommend that you use a CNAME record instead of an A record.
- Don't use both a CNAME record and an A record for the same domain. This issue can cause a conflict and prevent the domain from being resolved. 

**Cause 2** 

The internet browser might still be caching the old IP address for your domain. 

**Solution for Cause 2**

Clear the browser. For Windows devices, you can run the command `ipconfig /flushdns`. Use [WhatsmyDNS.net](https://www.whatsmydns.net/) to verify that your domain points to the app's IP address. 

### You can't add a subdomain 

#### Symptom

You can't add a new host name to an app to assign a subdomain.

#### Solution

- Check with subscription administrator to make sure that you have permissions to add a host name to the app.
- If you need more subdomains, we recommend that you change the domain hosting to Azure Domain Name Service (DNS). By using Azure DNS, you can add 500 host names to your app. For more information, see [Add a subdomain](https://blogs.msdn.microsoft.com/waws/2014/10/01/mapping-a-custom-subdomain-to-an-azure-website/).

### DNS can't be resolved

#### Symptom

You received the following error message:

"The DNS record could not be located."

#### Cause
This problem occurs for one of the following reasons:

- The time to live (TTL) period has not expired. Check the DNS configuration for your domain to determine the TTL value, and then wait for the period to expire.
- The DNS configuration is incorrect.

#### Solution
- Wait for 48 hours for this problem to resolve itself.
- If you can change the TTL setting in your DNS configuration, change the value to 5 minutes to see whether this resolves the problem.
- Use [WhatsmyDNS.net](https://www.whatsmydns.net/) to verify that your domain points to the app's IP address. If it doesn't, configure the A record to the correct IP address of the app.

### You need to restore a deleted domain 

#### Symptom
Your domain is no longer visible in the Azure portal.

#### Cause 
The owner of the subscription might have accidentally deleted the domain.

#### Solution
If your domain was deleted fewer than seven days ago, the domain has not yet started the deletion process. In this case, you can buy the same domain again on the Azure portal under the same subscription. (Be sure to type the exact domain name in the search box.) You won't be charged again for this domain. If the domain was deleted more than seven days ago, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) for help with restoring the domain.

## Domain problems

### You purchased a TLS/SSL certificate for the wrong domain

#### Symptom

You purchased an App Service certificate for the wrong domain. You can't update the certificate to use the correct domain.

#### Solution

Delete that certificate and then buy a new certificate.

If the current certificate that uses the wrong domain is in the “Issued” state, you'll also be billed for that certificate. App Service certificates are not refundable, but you can contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to see whether there are other options. 

### An App Service certificate was renewed, but the app shows the old certificate 

#### Symptom

The App Service certificate was renewed, but the app that uses the App Service certificate is still using the old certificate. Also, you received a warning that the HTTPS protocol is required.

#### Cause 
App Service automatically syncs your certificate within 48 hours. When you rotate or update a certificate, sometimes the application is still retrieving the old certificate and not the newly updated certificate. The reason is that the job to sync the certificate resource hasn't run yet. Click Sync. The sync operation automatically updates the hostname bindings for the certificate in App Service without causing any downtime to your apps.
 
#### Solution

You can force a sync of the certificate:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **App Service Certificates**, and then select the certificate.
2. Select **Rekey and Sync**, and then select **Sync**. The sync takes some time to finish. 
3. When the sync is completed, you see the following notification: "Successfully updated all the resources with the latest certificate."

### Domain verification is not working 

#### Symptom 
The App Service certificate requires domain verification before the certificate is ready to use. When you select **Verify**, the process fails.

#### Solution
Manually verify your domain by adding a TXT record:
 
1.	Go to the Domain Name Service (DNS) provider that hosts your domain name.
2.	Add a TXT record for your domain that uses the value of the domain token that's shown in the Azure portal. 

Wait a few minutes for DNS propagation to run, and then select the **Refresh** button to trigger the verification. 

As an alternative, you can use the HTML webpage method to manually verify your domain. This method allows the certificate authority to confirm the domain ownership of the domain that the certificate is issued for.

1.	Create an HTML file that's named {domain verification token}.html. The content of this file should be the value of domain verification token.
3.	Upload this file at the root of the web server that's hosting your domain.
4.	Select **Refresh** to check the certificate status. It might take few minutes for verification to finish.

For example, if you're buying a standard certificate for azure.com with the domain verification token 1234abcd, a web request made to https://azure.com/1234abcd.html should return 1234abcd. 

> [!IMPORTANT]
> A certificate order has only 15 days to complete the domain verification operation. After 15 days, the certificate authority denies the certificate, and you are not charged for the certificate. In this situation, delete this certificate and try again.
>
> 

### You can't purchase a domain

#### Symptom
You can't buy an App Service domain in the Azure portal.

#### Cause and solution

This problem occurs for one of the following reasons:

- There's no credit card on the Azure subscription, or the credit card is invalid.

    **Solution**: Add a valid credit card to your subscription.

- You're not the subscription owner, so you don't have permission to purchase a domain.

    **Solution**: [Assign the Owner role](../role-based-access-control/role-assignments-portal.md) to your account. Or contact the subscription administrator to get permission to purchase a domain.
- You have reached the limit for purchasing domains on your subscription. The current limit is 20.

    **Solution**: To request an increase to the limit, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- Your Azure subscription type does not support the purchase of an App Service domain.

    **Solution**: Upgrade your Azure subscription to another subscription type, such as a Pay-As-You-Go subscription.

### You can't add a host name to an app 

#### Symptom

When you add a host name, the process fails to validate and verify the domain.

#### Cause 

This problem occurs for one of the following reasons:

- You don’t have permission to add a host name.

    **Solution**: Ask the subscription administrator to give you permission to add a host name.
- Your domain ownership could not be verified.

    **Solution**: Verify that your CNAME or A record is configured correctly. To map a custom domain to an app, create either a CNAME record or an A record. If you want to use a root domain, you must use A and TXT records:

    |Record type|Host|Point to|
    |------|------|-----|
    |A|@|IP address for an app|
    |TXT|@|`<app-name>.azurewebsites.net`|
    |CNAME|www|`<app-name>.azurewebsites.net`|

## FAQ

**Do I have to configure my custom domain for my website once I buy it?**

When you purchase a domain from the Azure portal, the App Service application is automatically configured to use that custom domain. You don’t have to take any additional steps. For more information, watch [Azure App Service Self Help: Add a Custom Domain Name](https://channel9.msdn.com/blogs/Azure-App-Service-Self-Help/Add-a-Custom-Domain-Name) on Channel9.

**Can I use a domain purchased in the Azure portal to point to an Azure VM instead?**

Yes, you can point the domain to a VM. For more information, see [Use Azure DNS to provide custom domain settings for an Azure service](../dns/dns-custom-domain.md).

**Is my domain hosted by GoDaddy or Azure DNS?**

App Service Domains use GoDaddy for domain registration and Azure DNS to host the domains. 

**I have auto-renew enabled but still received a renewal notice for my domain via email. What should I do?**

If you have auto-renew enabled, you do not need to take any action. The notice email is provided to inform you that the domain is close to expiring and to renew manually if auto-renew is not enabled.

**Will I be charged for Azure DNS hosting  my domain?**

The initial cost of domain purchase applies to domain registration only. In addition to the registration cost, there are incurring charges for Azure DNS based on your usage. For more information, see [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/) for more details.

**I purchased my domain earlier from the Azure portal and want to move from GoDaddy hosting to Azure DNS hosting. How can I do this？**

It is not mandatory to migrate to Azure DNS hosting. If you do want to migrate to Azure DNS, the domain management experience in the Azure portal about provides information on steps necessary to move to Azure DNS. If the domain was purchased through App Service, migration from GoDaddy hosting to Azure DNS is relatively seamless procedure.

**I would like to purchase my domain from App Service Domain but can I host my domain on GoDaddy instead of Azure DNS?**

Beginning July 24, 2017, App Service domains purchased in the portal are hosted on Azure DNS. If you prefer to use a different hosting provider, you must go to their website to obtain a domain hosting solution.

**Do I have to pay for privacy protection for my domain?**

When you purchase a domain through the Azure portal, you can choose to add privacy at no additional cost. This is one of the benefits of purchasing your domain through Azure App Service.

**If I decide I no longer want my domain, can I get my money back?**

When you purchase a domain, you are not charged for a period of five days, during which time you can decide that you do not want the domain. If you do decide you don’t want the domain within that five-day period, you are not charged. (.uk domains are an exception to this. If you purchase a .uk domain, you are charged immediately and you cannot be refunded.)

**Can I use the domain in another Azure App Service app in my subscription?**

Yes. When you access the Custom Domains and TLS blade in the Azure portal, you see the domains that you have purchased. You can configure your app to use any of those domains.

**Can I transfer a domain from one subscription to another subscription?**

You can move a domain to another subscription/resource group using the [Move-AzResource](https://docs.microsoft.com/powershell/module/az.Resources/Move-azResource) PowerShell cmdlet.

**How can I manage my custom domain if I don’t currently have an Azure App Service app?**

You can manage your domain even if you don’t have an App Service Web App. Domain can be used for Azure services like Virtual machine, Storage etc. If you intend to use the domain for App Service Web Apps, then you need to include a Web App that is not on the Free App Service plan in order to bind the domain to your web app.

**Can I move a web app with a custom domain to another subscription or from App Service Environment v1 to V2?**

Yes, you can move your web app across subscriptions. Follow the guidance in [How to move resources in Azure](../azure-resource-manager/management/move-resource-group-and-subscription.md). There are a few limitations when moving the web app. For more information, see [Limitations for moving App Service resources](../azure-resource-manager/management/move-limitations/app-service-move-limitations.md).

After moving the web app, the host name bindings of the domains within the custom domains setting should remain the same. No additional steps are required to configure the host name bindings.
