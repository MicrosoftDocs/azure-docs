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

This article lists common problems that you might encounter when you configure domain or SSL certificate for your Azure web apps. It also provides possible causes and resolutions for these problems.

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/) and click on **Get Support**.

## Unable to add bind SSL certificate to a Web App 

### Symptom

When you add an SSL binding, you see the following error message:

**Failed to add SSL binding. Cannot set certificate for existing VIP because another VIP already uses that certificates.**

### Cause

This problem can occur if you have multiple IP-based SSL bindings for the same IP across multiple web apps. For example, web app A has IP-based SSL with old certificate. Web app B with IP-based SSL with new certificate for the same IP. When you update web app SSL binding with the new certificate, it will fail with this error since same IP is being used for another app. 

### Solution 

To fix the problem, use one of the following methods:

- Delete the IP-based SSL binding on web app with the old certificate. 
- Create a new IP-based SSL binding with the new certificate.

## Unable to delete a certificate 

### Symptom

When you try to delete a certificate, you receive the following error message:

**Unable to delete the certificate because it is currently being used in an SSL binding. The SSL binding must be removed before you can delete the certificate.**

### Cause

This problem can occur if the certificate is using by another web app.

### Solution

Remove SSL binding for that certificate from the web apps. Then try to delete the certificate. If you still cannot delete the certificate, clear the Internet browser cache and reopen the Azure portal in a new browser window. Then try to delete the certificate.

## Unable to purchase an App Service certificate 

### Symptom
You fail to purchase an [App Service certificate](./web-sites-purchase-ssl-web-site.md) from Azure portal.

### Cause and Solution
This problem can be caused by one of the following reasons:

- The App Service plan is Free or Shared pricing plans. We do not support SSL for these pricing tiers. 

    **Solution**: Upgrade App Service plan to Standard for web app.

- The Subscription does not have a valid credit card.

    **Solution**: Add a valid credit card to your subscription. 

- The Subscription offer does not support purchase an App Service certificate such as Microsoft Student offer.  

    **Solution**: Upgrade your subscription. 

- The Subscription has hit the maximum limit of purchases allowed on a subscription.

    **Solution**: App Service Certificates has a limit of 10 certificate purchases for Pay-As-Go and EA subscriptions types. For other subscription types, the limit is 3. To increase the limit, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- The App Service certificate was marked as fraud. You will receive this error “Your certificate has been flagged for possible fraud. The request is currently under review. If the certificate does not become usable within 24 hours”.

    **Solution**: If the certificate is marked as Fraud and has not been resolved after 24 hours, then follow these steps:

    1. Go to App Service certificate in Azure portal.
    2. Click on Certificate Configuration > Step 2 : Verify > Domain Verification.
    3. Click on Email Instructions that will send an email to Azure certificate provider to resolve the issue.

## Purchased SSL certificate for wrong domain

### Symptom

You purchased an App Service certificate for the wrong domain and cannot update the certificate to use the correct domain.

### Solution

- Delete that certificate and buy a new certificate.
- If the current certificate with the wrong domain is in the “Issued” state, then you will be billed for it as well. App Service certificates are not refunded, but you can contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to see if there are other options. 

## App Service certificate was renewed but still shows the old certificate 

### Symptom

The App Service certificate was renewed but the web app that uses the App Service certificate is still using the old certificate. And you received a warning as HTTPS is required.

### Cause 
The Web app service runs a background job that periodically runs every eight hours that syncs if there are any changes. Hence when you rotate or update a certificate, sometimes the application is still retrieving the old certificate and not the newly updated certificate.  This  is because the job has not run to sync the certificate resource.  
 
### Solution

You can force a sync of the certificate:

1. Sign in to the [Azure portal](https://portal.azure.com). Select the **App service certificate**.
2. Click **Rekey and Sync** setting, and then click **Sync**. This does take some time. 
3. When it is completed, you see the notification that the certificate is synced successfully.  

## Domain verification is not working 

### Symptom 
The App Service certificate requires domain verification before the certificate is ready to use. When you click **Verify**, it fails.

Solution
We provide alternate solution to manually verify your domain by adding a TXT record:
 
1.	Go to the Domain Name Service (DNS) provider that hosts your domain name.
2.	Add a Txt record for your domain with value of the domain token showed in the Azure portal. 

Wait a few minutes for DNS propagation to take place and click on Refresh button to trigger the verification. 

Alternate method to manually verify is the HTML Web Page method that can be used to allow the certificate authority to confirm the domain ownership of the domain the certificate is issued for.

1.	Create an HTML file named {Domain Verification Token}.html. 
2.	Content of this file should be the value of Domain Verification Token.
3.	Upload this file at the root of the web server hosting your domain
4.	Click on Refresh button to check the Certificate status. It might take few minutes for verification to complete.

For example, if you are buying a standard certificate for azure.com with Domain Verification Token ‘1234abcd’ then a web request made to http://azure.com/1234abcd.html should return 1234abcd. 

> [!IMPORTANT]
> A certificate order has only 15 days to complete domain verification operation. after 15 days the certificate is denied by the certificate authority, you are not charged for the certificate.  Delete this certificate and try again.
>
> 

## Unable to purchase a domain

### Symptom
You cannot buy a domain from Web app or App Service Domain in the Azure portal.

### Cause and solution

This problem might be caused by one of the following reasons:

- No credit card on the Azure subscription or invalid credit card.

    **Solution**: Add a credit card to your subscription if you don’t have one.

- If you are not the subscription owner, you may not have permission to buy domain.

    **Solution**: [Add the Owner role](../billing/billing-add-change-azure-subscription-administrator.md) to your account or contact with the subscription administrator to get permissions to purchase a domain.
- You may have reached the limit to purchasing domains on your subscription. The current limit is 20.

    **Solution**: To request increase the limit, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- Your Azure subscription type does not support purchase of App Service domain.

    **Solution**: Upgrade your Azure subscription to other subscription types such as Pay-as-you-go subscription.

## Unable to add a hostname to Web app 

### Symptom

When you add a hostname, it fails with to validation and verify the domain.

### Cause 

This problem can be caused by one of the following reasons:

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

You receive the error message: "The DNS record could not be located".

### Cause
One of the reasons could be causing the issue:
- TTL live has not expired. Check you DNS configuration for your domain what TTL is and wait it out. 
- DNS configuration is not right.

### Solution
- Wait for 48 hours and this should automatically resolve.
- If you can modify the TTL setting in your DNS configuration, go ahead and make the change to 5 minutes or so to see if this resolves the issue.
- Verify your domain is pointing to the web app IP address using [WhatsmyDNS.net](https://www.whatsmydns.net/). If not, fix the A record to be configured to the right IP address of the web app.

## Restore a deleted domain 

### Symptom
Your domain is no longer visible in the Azure portal.

### Cause 
The domain may have been accidentally deleted by the owner of the subscription.

### Solution
If your domain was deleted less than 7 days ago, the domain has not yet started the deletion process.  So you can buy the same domain again on Azure portal under the same subscription (make sure to type the exact domain name in search text box).  You will not be charged again for this domain. 
If the domain was deleted more than 7 days ago, please contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) for assistance to restore the domain.

## Custom domain returns 404 or site inaccessible 

### Symptom

When you browse to the site with the new domain, you receive the following error message:

**Error 404-Web app not found.**


### Cause and solution

**Cause 1** 

The custom domain that you configured is missing a CNAME or A record. 

**Solution for cause 1**

- If you added an A record, make sure a TXT record is also added. For more details. For more information, see [Create-the-a-record](./app-service-web-tutorial-custom-domain.md#create-the-a-record).
- If you do not need to use root domain for your web app, it is recommended to use CNAME record instead of A record.
- Do not use both CNAME and A record for the same domain. This can cause conflict and prevent the domain from resolving. 

**Cause 2** 

The Internet browser might still be caching the old IP address for your domain. 

**Solution for cause 2**

Clear the cache in Internet browser. For Windows devices, you can run the command `ipconfig /flushdns`. Verify your domain is pointing to the web app IP address using [WhatsmyDNS.net](https://www.whatsmydns.net/).

## Unable to add subdomain 

### Symptom

You cannot add a new hostname to a web app to assign a sub-domain.

### Solution

- Check with subscription administrator to make sure you have permissions to add a hostname to the web app.
- If you need more sub-domains,  we recommend changing the domain hosting to Azure DNS.  With Azure DNS, you can add 500 hostnames to your web app. For more information, see [add a sub domain](https://blogs.msdn.microsoft.com/waws/2014/10/01/mapping-a-custom-subdomain-to-an-azure-website/).











 


















