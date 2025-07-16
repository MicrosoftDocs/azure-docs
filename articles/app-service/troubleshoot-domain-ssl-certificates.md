---
title: Troubleshoot Domain and TLS/SSL Certificates
description: Find solutions to the common problems that you might encounter when you configure a domain or TLS/SSL certificate in Azure App Service.
author: genlin
manager: dcscontentpm
tags: top-support-issue
ms.topic: troubleshooting-general
ms.date: 03/01/2019
ms.author: genli
---

# Troubleshoot domain and TLS/SSL certificate problems in Azure App Service

When you set up a domain or TLS/SSL certificate for your web apps in Azure App Service, you might encounter the following common problems. This article explores the possible causes and solutions for these problems.

In addition to the information in this article, you can get more help by contacting Azure experts on the [Microsoft Q & A and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident on the [Azure Support site](https://azure.microsoft.com/support/options/). Select **Get Support**.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Certificate problems

### You can't add a TLS/SSL certificate binding to an app

#### Symptom

When you add a TLS binding, you receive the following error message:

"Failed to add SSL binding. Cannot set certificate for existing VIP because another VIP already uses that certificate."

#### Cause

This problem might happen if you have multiple IP-based TLS/SSL bindings for the same IP address across multiple apps. For example, app A has an IP-based TLS/SSL binding with an old certificate. App B has an IP-based TLS/SSL binding with a new certificate for the same IP address. When you update the app TLS binding with the new certificate, the update fails because the same IP address is used for another app, and you receive the error message.

#### Solution

To resolve this problem, try one of the following methods:

* Delete the IP-based TLS/SSL binding on the app that uses the old certificate.
* Create a new IP-based TLS/SSL binding that uses the new certificate.

### You can't delete a certificate

#### Symptom

When you try to delete a certificate, you receive the following error message:

"Unable to delete the certificate because it is currently being used in a TLS/SSL binding. The TLS binding must be removed before you can delete the certificate."

#### Cause

This problem might happen if another app uses the certificate.

#### Solution

1. Remove the TLS binding for that certificate from the apps.
1. Try to delete the certificate.
1. If you still can't delete the certificate, clear the internet browser cache, and reopen the Azure portal in a new browser window. Then try to delete the certificate.

### You can't purchase an App Service certificate

#### Symptom

In the Azure portal, you can't purchase an [Azure App Service certificate](configure-ssl-app-service-certificate.md).

#### Cause and solution

This problem can happen for any of the following reasons:

* The App Service plan is a Free or Shared pricing tier, which don't support TLS.

  **Solution**: Upgrade the App Service plan to Standard.

* The subscription doesn't have a valid credit card.

  **Solution**: Add a valid credit card to your subscription.

* The subscription offer doesn't support purchasing an App Service certificate. Example: Microsoft Student.  

  **Solution**: Upgrade your subscription.

* The subscription reached the allowed purchase limit.

  **Solution**: App Service certificates have a limit of 10 certificate purchases for the pay-as-you-go and Enterprise Agreement subscription types. For other subscription types, the limit is 3. To increase the limit, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

* The App Service certificate was marked as fraud. You received the following error message: "Your certificate has been flagged for possible fraud. The request is currently under review. If the certificate does not become usable within 24 hours, contact Azure Support."

  **Solution**: If the certificate is marked as fraud and isn't resolved after 24 hours, follow these steps:

  1. Sign in to the [Azure portal](https://portal.azure.com).

  1. Go to **App Service Certificates**, and select the certificate.

  1. Select **Certificate Configuration** > **Step 2: Verify** > **Domain Verification**. This step sends an email notice to the Azure certificate provider to resolve the problem.

### An App Service certificate was renewed, but the app shows the old certificate

#### Symptom 

The App Service certificate was renewed, but the app that uses the App Service certificate is still using the old certificate. You might also receive a warning that the HTTPS protocol is required.

#### Cause 1: Missing access policy permissions on the key vault

The key vault used to store the App Service certificate is missing access policy permissions on the key vault for `Microsoft.Azure.Websites` and `Microsoft.Azure.CertificateRegistration`. The service principals and their required permissions for key vault access are:
</br></br>

  |Service principal|Secret permissions|Certificate permissions|
  |------|------|-----|
  |Microsoft Azure App Service|Get|Get|
  |Microsoft.Azure.CertificateRegistration|Get, List, Delete|Get, List|

#### Solution 1: Modify the access policies for the key vault

To modify the access policies for the key vault, follow these steps:

1. Sign in to the Azure portal. Select the key vault used by your App Service certificate. Go to Access policies.</li>
2. If you don't see the two service principals listed, you need to add them. If they're available, verify that the permissions include the recommended secret and certificate permissions.</li>
3. Add a service principal by selecting **Create**. Then select the needed permissions for Secret and Certificate permissions.</li>
4. For the service principal, enter the values that you previously obtained from the search box. Then, select the service principal.</li>
  
#### Cause 2: The app service hasn't synced with the new certificate

The App Service automatically syncs your certificate within 48 hours. When you rotate or update a certificate, sometimes the application is still retrieving the old certificate and not the newly updated certificate. This happens because the job that syncs the certificate resource hasn't run. To resolve this problem, sync the certificate manually. Syncing manually updates the host name bindings for the certificate in App Service without causing any downtime to your apps.

#### Solution 2: Force a sync for the certificate

To force a sync for the certificate, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **App Service Certificates**, and then select the certificate.</li>
2. Select **Rekey and Sync**, and then select **Sync**. The sync takes some time to finish.</li>
3. When the sync finishes, the following notification appears: "Successfully updated all the resources with the latest certificate."</li>

### App Service is showing the wrong certificate

#### Symptom

When you're browsing App Service, it's presenting the wrong certificate.

#### Cause

This problem can manifest when both IP SSL and Server Name Indication (SNI) bindings are configured for App Service. When non-SNI clients hit the IP SSL endpoint, the IP SSL certificate gets cached. Even if SNI-enabled clients hit the site, they're presented with the IP SSL certificate, which causes an invalid certificate to be presented.

#### Solution

Ensure that you don't use SNI bindings along with IP SSL bindings and always browse to the website over custom domain URL if you have non-SNI clients. If you need to use SNI bindings, ensure that the certificate that is bound to the IP SSL binding is issued to protect all configured URLs for the site (including the SNI bindings). Configure the same certificate against all other bindings. This behavior is by design.

## Custom domain problems

### A custom domain returns a 404 error

#### Symptom

When you browse to the site by using the custom domain name, you receive the error message "Error 404 - Web app not found."

#### Cause and solution

**Cause 1**

Your configured custom domain is missing a `CNAME record` or an `A record`.

**Solution for cause 1**

* If you added an `A record`, make sure that a `TXT record` is also added. For more information, see [Create the DNS records](./app-service-web-tutorial-custom-domain.md#create-the-dns-records).
* If you don't have to use the root domain for your app, we recommend that you use a `CNAME record` rather than an `A record`.
* Don't use both a `CNAME record` and an `A record` for the same domain. This issue can cause a conflict and prevent domain resolution.

**Cause 2**

The internet browser might still be caching the old IP address for your domain.

**Solution for Cause 2**

Clear the browser. For Windows devices, you can run the command `ipconfig /flushdns`. To check that your domain points to the app's IP address, use [WhatsmyDNS.net](https://www.whatsmydns.net/).

### You can't add a subdomain

#### Symptom

You can't add a new host name to an app to assign a subdomain.

#### Solution

* Make sure that you have permissions to add a host name to an app by checking with the subscription administrator.
* If you need more subdomains, we recommend that you change the domain hosting to Azure DNS. By using Azure DNS, you can add 500 host names to your app. For more information, see [Add a subdomain](/archive/blogs/waws/mapping-a-custom-subdomain-to-an-azure-website).

### DNS can't be resolved

#### Symptom

You received the following error message: "The DNS record could not be located."

#### Cause

This problem happens for one of the following reasons:

* The time-to-live (TTL) period hasn't expired. To determine the TTL value, check your domain's DNS configuration and wait for the period to expire.
* The DNS configuration is incorrect.

#### Solution

* Wait 48 hours for this problem to resolve by itself.
* If you can change the TTL setting in your DNS configuration, try changing the value to 5 minutes, which might solve this problem.
* To verify that your domain points to the app's IP address, use [WhatsmyDNS.net](https://www.whatsmydns.net/). If the domain doesn't point to the IP address, configure the `A record` to the app's correct IP address.

### You need to restore a deleted domain

#### Symptom

Your domain is no longer visible in the Azure portal.

#### Cause

The subscription owner might have accidentally deleted the domain.

#### Solution

If your domain was deleted fewer than seven days ago, the domain hasn't started the deletion process. In this case, you can buy the same domain again on the Azure portal under the same subscription. (Be sure to type the exact domain name in the search box.) You won't be charged again for this domain. If the domain was deleted more than seven days ago, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) for help with restoring the domain.

## Domain problems

### You purchased a TLS/SSL certificate for the wrong domain

#### Symptom

You purchased an App Service certificate for the wrong domain. You can't update the certificate to use the correct domain.

#### Solution

Delete that certificate, and then buy a new certificate.

If the current certificate that uses the wrong domain is in the "Issued" state, you're also billed for that certificate. App Service certificates aren't refundable, but you can contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) for other possible options.

### Domain verification isn't working

#### Symptom 

The App Service certificate requires domain verification before the certificate is ready to use. When you select **Verify**, the process fails.

#### Solution

Manually verify your domain by adding a `TXT record`:

1. Go to the DNS provider that hosts your domain name.

1. Add a `TXT record` for your domain that uses the value of the domain token from the Azure portal.

1. Wait a few minutes for DNS propagation to run, and then select the **Refresh** button to trigger the verification.

As an alternative, you can use the HTML webpage method to manually verify your domain. This method allows the certificate authority (CA) to confirm the domain ownership of the domain for which the certificate is issued.

1. Create an HTML file named `{domain verification token}.html`. The file content should contain the value of domain verification token.

1. Upload this file at the root of the web server that's hosting your domain.

1. Select **Refresh** to check the certificate status. It might take few minutes for verification to finish.

For example, if you're buying a standard certificate for azure.com with the domain verification token `1234abcd`, a web request made to `https://azure.com/1234abcd.html` should return `1234abcd`.

> [!IMPORTANT]
> A certificate purchase has 15 days only to complete the domain verification operation. After 15 days, the CA denies the certificate, and you're not charged for the certificate. In this situation, delete this certificate and try again.

### You can't purchase a domain

#### Symptom

You can't buy an App Service domain in the Azure portal.

#### Cause and solution

This problem happens for one of the following reasons:

* There's no credit card on the Azure subscription, or the credit card is invalid.

  **Solution**: Add a valid credit card to your subscription.

* Your Azure subscription type does not support the purchase of an App Service domain.

  **Solution**: Upgrade your Azure subscription to another subscription type, such as a pay-as-you-go subscription.
  
* Depending on the subscription type, you might be required to have a sufficient payment history before you can purchase an App Service domain.

  **Solution**: Either purchase with a different subscription that has a payment history or wait until you have a payment history with your current subscription.
  
* You're not the subscription owner, so you don't have permission to purchase a domain.

  **Solution**: [Assign the Owner role](../role-based-access-control/role-assignments-portal.yml) to your account. Or, contact the subscription administrator to get permission to purchase a domain.

### You can't add a host name to an app

#### Symptom

When you add a host name, the process fails to validate and verify the domain.

#### Cause 

This problem happens for one of the following reasons:

* You don't have permission to add a host name.

  **Solution**: Ask the subscription administrator to give you permission to add a host name.

* Your domain ownership couldn't be verified.

  **Solution**: Verify that your `CNAME record` or `A record` is correctly set up. To map a custom domain to an app, create either a `CNAME record` or an `A record`. If you want to use a root domain, you must use an `A record` and a `TXT record`:

  |Record type|Host|Point to|
  |------|------|-----|
  |`A`|`@`|IP address for an app|
  |`TXT`|`@`|`<app-name>.azurewebsites.net`|
  |`CNAME`|`www`|`<app-name>.azurewebsites.net`|

## FAQ

**Do I have to configure my custom domain for my website when I buy it?**

When you purchase a domain from the Azure portal, the App Service app is automatically configured to use that custom domain. You don't have to take any further steps. For more information, watch Azure App Service Self Help: Add a Custom Domain Name on Channel9.

**Can I use a domain purchased in the Azure portal to point to an Azure virtual machine instead?**

Yes, you can point the domain to a virtual machine. For more information, see [Use Azure DNS to provide custom domain settings for an Azure service](../dns/dns-custom-domain.md).

**Is my domain hosted by GoDaddy or Azure DNS?**

App Service domains use GoDaddy for domain registration and Azure DNS to host the domains.

**I enabled autorenew but still received a renewal notice for my domain via email. What should I do?**

If you enabled autorenew, you don't need to take any action. The email informs you only that the domain is close to expiration and that you have to manually renew if autorenew isn't enabled.

**Will I be charged for Azure DNS hosting my domain?**

The initial cost of domain purchase applies to domain registration only. Along with the registration cost, Azure DNS incurs charges, based on your usage. For more information, see [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/).

**I previously purchased my domain from the Azure portal and want to move from GoDaddy hosting to Azure DNS hosting. How can I do this?**

You're not required to migrate to Azure DNS hosting. If you want to migrate to Azure DNS, the domain management experience in the Azure portal provides information about the steps necessary to move to Azure DNS. If you bought the domain through App Service, migration from GoDaddy hosting to Azure DNS is a relatively seamless procedure.

**I would like to purchase my domain from App Service, but can I host my domain on GoDaddy instead of Azure DNS?**

Starting on July 24, 2017, Azure hosts App Service domains purchased from the Azure portal on Azure DNS. If you prefer to use a different hosting provider, you must go to their website to obtain a domain-hosting solution.

**Do I have to pay for privacy protection for my domain?**

When you purchase a domain through the Azure portal, you can choose to add privacy at no extra cost. This benefit is included when you purchase your domain through Azure App Service.

**If I decide I no longer want my domain, can I get my money back?**

When you purchase a domain, you're not charged for five days (with one exception). During this time, you can decide whether to keep the domain. If you choose to not keep the domain within this duration, you're not charged. Domains that end with `.uk` are the exception. If you purchase a `.uk` domain, you're immediately charged, and you can't get a refund.

**Can I use the domain in another Azure App Service app in my subscription?**

Yes, when you access the **Custom domains** and **Certificates** pages in the Azure portal, you see the domains that you purchased. You can configure your app to use any of those domains.

**Can I transfer a domain from one subscription to another subscription?**

Yes, you can move a domain to another subscription or resource group by using the [`Move-AzResource`](/powershell/module/az.Resources/Move-azResource) PowerShell cmdlet.

**How can I manage my custom domain if I don't currently have an Azure App Service app?**

You can manage your domain even if you don't have an App Service web app. You can use the domain for Azure services such as Azure Virtual Machines, Azure Storage, and so on. If you plan to use the domain for App Service web apps, you must include a web app that's not on a free App Service tier so that you can bind the domain to your web app.

**Can I move a web app with a custom domain to another subscription or from App Service Environment v1 to V2?**

Yes, you can move your web app across subscriptions. Follow the guidance in [How to move resources in Azure](../azure-resource-manager/management/move-resource-group-and-subscription.md). Some limitations apply when you move a web app. For more information, see [Limitations for moving App Service resources](../azure-resource-manager/management/move-limitations/app-service-move-limitations.md).

After you move a web app, the host name bindings of the domains within the custom domains setting should stay the same. No extra steps are required to configure the host name bindings.

**What file formats are returned when I download my App Service certificate from its key vault?**

When you select **Download as a certificate** for the App Service certificate under its key vault/secrets, the certificate file format is .pfx. No password is applied to the file.

**What file format can I use to upload a certificate to App Service?**

The certificate file format must be a .pfx file with a password applied to the file. The certificate must also meet the [certificate requirements](../app-service/configure-ssl-certificate.md#private-certificate-requirements).

If you obtained your certificate from a third-party CA and the file format is a .pem/.key format, you can use a tool like OpenSSL to convert the files to a .pfx file format. The private key must be included during the conversion because the .pfx file format requires it.

Also, if your CA gives you multiple certificates in the certificate chain, you have to merge the certificates by following the same order. For more information, see [Merge intermediate certificates](../app-service/configure-ssl-certificate.md#merge-intermediate-certificates).

**How do I generate a certificate-signing request for an App Service certificate?**

For an App Service certificate, you purchase through the Azure portal or by using a Powershell/CLI command. A certificate-signing request isn't needed. However, Azure Key Vault supports storing digital certificates issued by any CA. It supports creating a certificate-signing request with a private/public key pair. The certificate-signing request can be signed by any CA (an internal enterprise CA or an external public CA). For more information, see [Create a certificate-signing request](/azure/key-vault/certificates/create-certificate-signing-request).
