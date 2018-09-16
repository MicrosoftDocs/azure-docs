---
title: Troubleshoot domain and SSL certificate problems in Azure web apps | Microsoft Docs
description: Troubleshoot domain and SSL certificate problems in Azure web apps
services: app-service\web
documentationcenter: ''
author: genlin
manager: cshepard
editor: ''
tags: top-support-issue

ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/18/2018
ms.author: genli
---
# Troubleshoot domain and SSL certificate problems in Azure web apps

This article lists common problems that you might encounter when you configure a domain or SSL certificate for your Azure web apps. It also describes possible causes and solutions for these problems.

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/) and select **Get Support**.

## Certificate problems

### You can't add an SSL certificate binding to a web app 

#### Symptom

When you add an SSL binding, you receive the following error message:

"Failed to add SSL binding. Cannot set certificate for existing VIP because another VIP already uses that certificate."

#### Cause

This problem can occur if you have multiple IP-based SSL bindings for the same IP address across multiple web apps. For example, web app A has an IP-based SSL with an old certificate. Web app B has an IP-based SSL with a new certificate for the same IP address. When you update the web app SSL binding with the new certificate, it fails with this error because the same IP address is being used for another app. 

#### Solution 

To fix this problem, use one of the following methods:

- Delete the IP-based SSL binding on the web app that uses the old certificate. 
- Create a new IP-based SSL binding that uses the new certificate.

### You can't delete a certificate 

#### Symptom

When you try to delete a certificate, you receive the following error message:

"Unable to delete the certificate because it is currently being used in an SSL binding. The SSL binding must be removed before you can delete the certificate."

#### Cause

This problem might occur if another web app uses the certificate.

#### Solution

Remove the SSL binding for that certificate from the web apps. Then try to delete the certificate. If you still can't delete the certificate, clear the internet browser cache and reopen the Azure portal in a new browser window. Then try to delete the certificate.

### You can't purchase an App Service certificate 

#### Symptom
You can't purchase an [Azure App Service certificate](./web-sites-purchase-ssl-web-site.md) from the Azure portal.

#### Cause and solution
This problem can occur for any of the following reasons:

- The App Service plan is Free or Shared. These pricing tiers don't support SSL. 

    **Solution**: Upgrade the App Service plan for web app to Standard.

- The subscription doesn't have a valid credit card.

    **Solution**: Add a valid credit card to your subscription. 

- The subscription offer doesn't support purchasing an App Service certificate such as Microsoft Student.  

    **Solution**: Upgrade your subscription. 

- The subscription reached the limit of purchases that are allowed on a subscription.

    **Solution**: App Service certificates have a limit of 10 certificate purchases for the Pay-As-You-Go and EA subscription types. For other subscription types, the limit is 3. To increase the limit, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- The App Service certificate was marked as fraud. You received the following error message: "Your certificate has been flagged for possible fraud. The request is currently under review. If the certificate does not become usable within 24 hours, please contact Azure Support."

    **Solution**: If the certificate is marked as fraud and isn't resolved after 24 hours, follow these steps:

    1. Sign in to the [Azure portal](https://portal.azure.com).
    2. Go to **App Service Certificates**, and select the certificate.
    3. Select **Certificate Configuration** > **Step 2: Verify** > **Domain Verification**. This step sends an email notice to the Azure certificate provider to resolve the problem.

## Domain problems

### You purchased an SSL certificate for the wrong domain

#### Symptom

You purchased an App Service certificate for the wrong domain. You can't update the certificate to use the correct domain.

#### Solution

Delete that certificate and then buy a new certificate.

If the current certificate that uses the wrong domain is in the “Issued” state, you'll also be billed for that certificate. App Service certificates are not refundable, but you can contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to see whether there are other options. 

### An App Service certificate was renewed, but the web app shows the old certificate 

#### Symptom

The App Service certificate was renewed, but the web app that uses the App Service certificate is still using the old certificate. Also, you received a warning that the HTTPS protocol is required.

#### Cause 
The Web Apps feature of Azure App Service runs a background job every eight hours and syncs the certificate resource if there are any changes. When you rotate or update a certificate, sometimes the application is still retrieving the old certificate and not the newly updated certificate. The reason is that the job to sync the certificate resource hasn't run yet. 
 
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

For example, if you're buying a standard certificate for azure.com with the domain verification token 1234abcd, a web request made to http://azure.com/1234abcd.html should return 1234abcd. 

> [!IMPORTANT]
> A certificate order has only 15 days to complete the domain verification operation. After 15 days, the certificate authority denies the certificate, and you are not charged for the certificate. In this situation, delete this certificate and try again.
>
> 

### You can't purchase a domain

#### Symptom
You can't buy a domain from the Web Apps or App Service domain in the Azure portal.

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

### You can't add a host name to a web app 

#### Symptom

When you add a host name, the process fails to validate and verify the domain.

#### Cause 

This problem occurs for one of the following reasons:

- You don’t have permission to add a host name.

    **Solution**: Ask the subscription administrator to give you permission to add a host name.
- Your domain ownership could not be verified.

    **Solution**: Verify that your CNAME or A record is configured correctly. To map a custom domain to web app, create either a CNAME record or an A record. If you want to use a root domain, you must use A and TXT records:

    |Record type|Host|Point to|
    |------|------|-----|
    |A|@|IP address for a web app|
    |TXT|@|<app-name>.azurewebsites.net|
    |CNAME|www|<app-name>.azurewebsites.net|

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
- Use [WhatsmyDNS.net](https://www.whatsmydns.net/) to verify that your domain points to the web app's IP address. If it doesn't, configure the A record to the correct IP address of the web app.

### You need to restore a deleted domain 

#### Symptom
Your domain is no longer visible in the Azure portal.

#### Cause 
The owner of the subscription might have accidentally deleted the domain.

#### Solution
If your domain was deleted fewer than seven days ago, the domain has not yet started the deletion process. In this case, you can buy the same domain again on the Azure portal under the same subscription. (Be sure to type the exact domain name in the search box.) You won't be charged again for this domain. If the domain was deleted more than seven days ago, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) for help to restore the domain.

### A custom domain returns a 404 error 

#### Symptom

When you browse to the site by using the custom domain name, you receive the following error message:

"Error 404-Web app not found."


#### Cause and solution

**Cause 1** 

The custom domain that you configured is missing a CNAME or A record. 

**Solution for cause 1**

- If you added an A record, make sure that a TXT record is also added. For more information, see [Create the A record](./app-service-web-tutorial-custom-domain.md#create-the-a-record).
- If you don't have to use the root domain for your web app, we recommend that you use a CNAME record instead of an A record.
- Don't use both a CNAME record and an A record for the same domain. This can cause a conflict and prevent the domain from being resolved. 

**Cause 2** 

The internet browser might still be caching the old IP address for your domain. 

**Solution for Cause 2**

Clear the browser. For Windows devices, you can run the command `ipconfig /flushdns`. Use [WhatsmyDNS.net](https://www.whatsmydns.net/) to verify that your domain points to the web app's IP address. 

### You can't add a subdomain 

#### Symptom

You can't add a new host name to a web app to assign a subdomain.

#### Solution

- Check with subscription administrator to make sure that you have permissions to add a host name to the web app.
- If you need more subdomains, we recommend that you change the domain hosting to Azure DNS. By using Azure DNS, you can add 500 host names to your web app. For more information, see [Add a subdomain](https://blogs.msdn.microsoft.com/waws/2014/10/01/mapping-a-custom-subdomain-to-an-azure-website/).











 


















