---
title: Troubleshoot domain and SSL certificate problems in Azure web apps | Microsoft Docs
description: Troubleshoot domain and SSL certificate problems in Azure web apps
services: app-service\web
documentationcenter: ''
author: genli
manager: willchen
editor: ''
tags: top-support-issue

ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/18/2018
ms.author: genlin
---
# Troubleshoot domain and SSL certificate problems in Azure web apps

This article lists common problems that you might encounter when you configure domain or SSL certificate for your Azure web apps. It also describes possible causes and resolutions for these problems.

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/) and click on **Get Support**.

## Unable to add bind SSL certificate to a Web App 

### Symptom

When you add an SSL binding, you receive the following error message:

**Failed to add SSL binding. Cannot set certificate for existing VIP because another VIP already uses that certificates.**

### Cause

This problem can occur if you have multiple IP-based SSL bindings for the same IP address across multiple web apps. For example, web app A has IP-based SSL with old certificate. Web app B with IP-based SSL with new certificate for the same IP address. When you update web app SSL binding with the new certificate, it will fail with this error since same IP address is being used for another app. 

### Solution 

To fix this problem, use one of the following methods:

- Delete the IP-based SSL binding on web app that uses the old certificate. 
- Create a new IP-based SSL binding that uses the new certificate.

## Unable to delete a certificate 

### Symptom

When you try to delete a certificate, you receive the following error message:

**Unable to delete the certificate because it is currently being used in an SSL binding. The SSL binding must be removed before you can delete the certificate.**

### Cause

This problem might occur if the certificate is used by another web app.

### Solution

Remove SSL binding for that certificate from the web apps. Then try to delete the certificate. If you still cannot delete the certificate, clear the Internet browser cache, reopen the Azure portal in a new browser window. And then try to delete the certificate.

## Unable to purchase an App Service certificate 

### Symptom
You cannot purchase an [App Service certificate](./web-sites-purchase-ssl-web-site.md) from Azure portal.

### Cause and Solution
This problem can occur for any of the following reasons:

- The App Service plan is "Free" or "Shared". We do not support SSL for these pricing tiers. 

    **Solution**: Upgrade the App Service plan for web app to "Standard".

- The Subscription does not have a valid credit card.

    **Solution**: Add a valid credit card to your subscription. 

- The Subscription offer does not support purchasing an App Service certificate such as Microsoft Student.  

    **Solution**: Upgrade your subscription. 

- The Subscription has reached the maximum limit of purchases that are allowed on a subscription.

    **Solution**: App Service certificates have a limit of 10 certificate purchases for Pay-As-Go and EA subscriptions types. For other subscription types, the limit is 3. To increase the limit, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- The App Service certificate was marked as fraud. You receive the following error message: "Your certificate has been flagged for possible fraud. The request is currently under review. If the certificate does not become usable within 24 hours".

    **Solution**: If the certificate is marked as Fraud and has not been resolved after 24 hours, then follow these steps:

    1. Go to App Service certificate in Azure portal.
    2. Select **Certificate Configuration** > **Step 2 : Verify** > **Domain Verification**. This sends an email notice to the Azure certificate provider to resolve the problem.

## Purchased SSL certificate for wrong domain

### Symptom

You purchased an App Service certificate for the wrong domain and you cannot update the certificate to use the correct domain.

### Solution

- Delete that certificate and then buy a new certificate.
- If the current certificate that uses the wrong domain is in the “Issued” state, then you will also be billed for that certificate. App Service certificates are not refundable, but you can contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to see whether there are other options. 

## App Service certificate was renewed but still shows the old certificate 

### Symptom

The App Service certificate was renewed but the web app that uses the App Service certificate is still using the old certificate. Also, you received a warning that the HTTPS protocol is required.

### Cause 
The Web app service runs a background job every eight hours and syncs the certificate resource if there are any changes. Therefore, when you rotate or update a certificate, sometimes the application is still retrieving the old certificate and not the newly updated certificate. This is because the job to sync the certificate resource has not run yet. 
 
### Solution

You can force a sync of the certificate:

1. Sign in to the [Azure portal](https://portal.azure.com). Select the **App service certificate**.
2. Click **Rekey and Sync**, and then click **Sync**. This takes some time to finish. 
3. When the sync is completed, you see a notification that states that the certificate is synced successfully.  

## Domain verification is not working 

### Symptom 
The App Service certificate requires domain verification before the certificate is ready to use. When you click **Verify**, the process fails.

### Solution
Manually verify your domain by adding a TXT record:
 
1.	Go to the Domain Name Service (DNS) provider that hosts your domain name.
2.	Add a TXT record for your domain that uses the value of the domain token that is shown in the Azure portal. 

Wait a few minutes for DNS propagation to run, and click then **Refresh** button to trigger the verification. 

Alternate method to manually verify is the "HTML Web Page method" that can be used to allow the certificate authority to confirm the domain ownership of the domain the certificate is issued for.

1.	Create an HTML file that is named {Domain Verification Token}.html. 
2.	Content of this file should be the value of Domain Verification Token.
3.	Upload this file at the root of the web server that is hosting your domain
4.	Click **Refresh** to check the Certificate status. It might take few minutes for verification to finish.

For example, if you are buying a standard certificate for azure.com with Domain Verification Token ‘1234abcd’ then a web request made to http://azure.com/1234abcd.html should return 1234abcd. 

> [!IMPORTANT]
> A certificate order has only 15 days to complete the domain verification operation. After 15 days the certificate is denied by the certificate authority, and you are not charged for the certificate. In this situation, delete this certificate and try again.
>
> 

## Unable to purchase a domain

### Symptom
You cannot buy a domain from Web app or App Service Domain in the Azure portal.

### Cause and solution

This problem occurs for one of the following reasons:

- No credit card on the Azure subscription or invalid credit card.

    **Solution**: Add a valid credit card to your subscription if you don’t have one.

- If you are not the subscription owner, you may not have permission to buy domain.

    **Solution**: [Add the Owner role](../billing/billing-add-change-azure-subscription-administrator.md) to your account or contact with the subscription administrator to get permissions to purchase a domain.
- You have reached the limit for purchasing domains on your subscription. The current limit is 20.

    **Solution**: To request increase the limit, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- Your Azure subscription type does not support the purchase of App Service domain.

    **Solution**: Upgrade your Azure subscription to other subscription types such as a Pay-as-you-go subscription.

## Unable to add a hostname to Web app 

### Symptom

When you add a hostname, the process fails to validate and verify the domain.

### Cause 

This problem occurs for one of the following reasons:

- You don’t have permission to add a hostname.

    **Solution**: Check with subscription administrator to make sure that you have a permission to add a hostname.
- Your domain ownership could not be verified.

    **Solution**: Verify if your CNAME or A record are configured correctly. To map custom domain to web app, create either a CNAME or A Record. If you want to use root domain, you must use A and TXT records:

    |Record type|Host|Point to|
    |------|------|-----|
    |A|@|IP address for web app|
    |TXT|@|<app-name>.azurewebsites.net|
    |CNAME|www|<app-name>.azurewebsites.net|

## DNS cannot be resolved

### Symptom

You receive a "The DNS record could not be located" error message.

### Cause
This problem occurs for one of the following reasons:

- The Time to Live (TTL) period has not expired. Check the DNS configuration for your domain to determine the TTL value, and then wait for the period to expire.
- The DNS configuration is incorrect.

### Solution
- Wait for 48 hours for this problem to resolve itself.
- If you can change the TTL setting in your DNS configuration, change the value to 5 minutes to see whether this resolves the problem.
- Use [WhatsmyDNS.net](https://www.whatsmydns.net/) to verify that your domain points to the web app IP address. If it does not, configure the A record to the correct IP address of the web app.

## Restore a deleted domain 

### Symptom
Your domain is no longer visible in the Azure portal.

### Cause 
The domain may have been accidentally deleted by the owner of the subscription.

### Solution
If your domain was deleted less than seven days ago, the domain has not yet started the deletion process. In this case, you can buy the same domain again on the Azure portal under the same subscription (make sure to type the exact domain name in search box). You will not be charged again for this domain. If the domain was deleted more than seven days ago, please contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) for help to restore the domain.

## Custom domain returns 404 or site inaccessible 

### Symptom

When you browse to the site by using the custom domain name, you receive the following error message:

**Error 404-Web app not found.**


### Cause and solution

**Cause 1** 

The custom domain that you configured is missing a CNAME or A record. 

**Solution for cause 1**

- If you added an A record, make sure a TXT record is also added. For more information, see [Create-the-a-record](./app-service-web-tutorial-custom-domain.md#create-the-a-record).
- If you do not have to use root domain for your web app, it is recommended to use a CNAME record instead of A record.
- Do not use both a CNAME and A record for the same domain. This can cause conflict and prevent the domain from resolving. 

**Cause 2** 

The Internet browser might still be caching the old IP address for your domain. 

**Solution for Cause 2**

Clear the browser. For Windows devices, you can run the command `ipconfig /flushdns`. Use [WhatsmyDNS.net](https://www.whatsmydns.net/) to verify that your domain points to the web app IP address. 

## Unable to add subdomain 

### Symptom

You cannot add a new hostname to a web app to assign a sub-domain.

### Solution

- Check with subscription administrator to make sure you have permissions to add a hostname to the web app.
- If you need more sub-domains,  we recommend that you change the domain hosting to Azure DNS. By using Azure DNS, you can add 500 hostnames to your web app. For more information, see [add a sub domain](https://blogs.msdn.microsoft.com/waws/2014/10/01/mapping-a-custom-subdomain-to-an-azure-website/).











 


















