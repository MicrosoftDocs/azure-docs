---
title: How to provide secure remote access to on-premises apps
description: Covers how to use Azure AD Application Proxy to provide secure remote access to your on-premises apps.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman

ms.assetid: d5450da1-9e06-4d08-8146-011c84922ab5
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/31/2018
ms.author: markvi
ms.reviewer: harshja
ms.custom: it-pro

---

# Wildcard application publishing

Configuring a large number of applications can quickly become unmanageable and introduces unnecessary risks for configuration errors if many of them require the same settings. With [Azure AD Application Proxy](active-directory-application-proxy-get-started.md), you can address this issue by using wildcard application publishing to publish and manage many applications at once. This is a solution that allows you to:

-	Simplify your administrative overhead
-	Reduce the number of configuration errors
-	Enable your users to (securely?) access more resources (apps / applications?)

This article provides you with the information you need to configure wildcard application publishing in your environment.



## Prerequisites

To use wildcards, you need to ensure the following: 

- You have configured [custom domains](active-directory-application-proxy-custom-domains.md). Creating custom domains requires you to create a verified domain within Azure and to upload an SSL certificate in a PFX formation to Application Proxy.

    - You should consider using a wildcard certificate to match the application you plan to create. Alternatively, you can also use a certificate that only lists specific applications.

    - For security reasons, this is a hard requirement and we will not support wildcards for applications that cannot use a custom domain for the external URL.

- You have the correct CNAME entry in your DNS. When using custom domains, you need to create a DNS entry with a CNAME record pointing the external URL of the Application Proxy endpoint. For wildcard applications, the CNAME record needs to point the relevant external URLs to `<yourAADTenantId>.tenant.runtime.msappproxy.net`.

    - To confirm that this has been configured correctly, you can try using nslookup on one of the target endpoints, for example, `expenses.adventure-works.com` and you should see a response that includes the alias mentioned previously (`<Id.tenant>.runtime.msappproxy.net`).


## Publishing the Application 

Creating a wildcard application uses the same [application publishing flow](application-proxy-publish-azure-portal.md) that is available for all other applications. The only difference is in the URLs and potentially SSO configurations.

You can publish applications with wildcards if both the internal and external URLs are in the format *http(s)://*.domain*, for example, `http(s)://*.adventure-works.com`. The internal and external URLs must both have a wildcard, otherwise you see an error.

Please note that:

- All wildcard applications must have the same configurations – including users and the SSO method. Any exceptions must be published as separate applications to override the defaults set for the wildcard.

- For applications using a KCD as the SSO method, the SPN listed for the SSO method may also need a wildcard. For example, the SPN could be: HTTP/*.adventure-works.com. You will still need to have the individual SPNs configured on your backend servers (ex: HTTP/expenses.adventure-works.com and HTTP/travel.adventure-works.com)

## Other Considerations

### Accepted formats

The only acceptable external URL format is to have a wildcard (*) in the empty text box, and a custom domain. The internal URL must similarly be formatted as `http(s)://*.domain`. Other positions for the wildcard, multiple wildcards, or other regexs are not supported and are causing errors.

### Setting the homepage URL for the MyApps panel

The wildcard application is represented with just one tile in the [MyApps panel](https://myapps.microsoft.com). By default this tile is hidden. To show the tile and have users land on a specific page:

1. Follow the guidelines for [setting a homepage URL](application-proxy-office365-app-launcher.md).
2. Set **Show Application** to true in the application properties page.

### Excluding applications from the wildcard

You can exclude applications from the wildcard application is to publish them as a separate application, as explained in phase #2 above. It is best practice to publish the exceptions before the wildcard application, to ensure that your exceptions are enforced from the beginning.

You can also limit the wildcard to only work for specific applications through your DNS management. We recommend creating a CNAME entry that includes a wildcard and matches the format of the external URL you have configured. However, you can instead point specific application URLs to the wildcards. For example, instead of *.adventure-works.com, point hr.adventure-works.com, expenses.adventure-works.com and travel.adventure-works.com individually to 000aa000-11b1-2ccc-d333-4444eee4444e.tenant.runtime.msappproxy.net. 

If you use this option, you also need another CNAME entry for the value AppId.domain, for example, 00000000-1a11-22b2-c333-444d4d4dd444.adventure-works.com, also pointing to the same location. You can find the AppId on the application properties page:

![AppId](./media/active-directory-application-proxy-wildcard\01.png)

## Deployment scenario

Below is a walkthrough of a sample deployment that uses a wildcard application and several others to help explain the flow and how to create exceptions.

### Phase 1: General wildcard application

Imagine, you have three different applications you want to publish. All three applications are used by all your users, and use *Integrated Windows Authentication*. The properties of the applications are the same. , so I will publish a wildcard application for these three – expenses.adventure-works.com, hr.adventure-works.com and travel.adventure-works.com. I have already configured the adventure-works.com verified domain on my tenant.

I will now create the CNAME entry in my DNS to point *.adventure-works.com to 000aa000-11b1-2ccc-d333-4444eee4444e.tenant.runtime.msappproxy.net, where 000aa000-11b1-2ccc-d333-4444eee4444e is my tenantId.

Next, I will create a new Application Proxy application in my tenant, following the same steps outlined in the documentation. Note the wildcards in the Internal URL, External URL, and Internal Application SPN fields.

![AppId](./media/active-directory-application-proxy-wildcard\02.png)

![AppId](./media/active-directory-application-proxy-wildcard\03.png)

![AppId](./media/active-directory-application-proxy-wildcard\04.png)


By publishing this one wildcard application, I can now access any of my three applications by going to the URLs I’m used to (ex: travel.adventure-works.com).

My application structure now looks like the following, where blue boxes are the applications explicitly published and visible in the Azure Portal, and gray applications are accessible through the parent application.

![AppId](./media/active-directory-application-proxy-wildcard\05.png)





### Phase 2

I have another application, finance.adventure-works.com, which should only be accessible by my Finance division. With the current application structure, my finance application would be accessible through the wildcard application, and thus by all employees. To prevent this, I will publish Finance as a separate application with more restrictive permissions.

![AppId](./media/active-directory-application-proxy-wildcard\06.png)

![AppId](./media/active-directory-application-proxy-wildcard\07.png)

![AppId](./media/active-directory-application-proxy-wildcard\08.png)



I also need to make sure my DNS is pointing finance.adventure-works.com to the application specific endpoint, specified in the Application Proxy blade of the application. In this case, I will be pointing finance.adventure-works.com to https://finance-awcycles.msappproxy.net/.

Now my application structure looks like the following:

![AppId](./media/active-directory-application-proxy-wildcard\09.png)


Because finance.adventure-works.com is a more specific URL than *.adventure-works.com, it will take precedence. Any user reaching finance.adventure-works.com will thus have the experience specified in the Finance Resources application. In this case, only finance employees will be able to access finance.adventure-works.com.

If I had multiple applications published for finance and also had finance.adventure-works.com as a verified domain, I could also publish another wildcard application *.finance.adventure-works.com. Because this is still more specific than the generic *.adventure-works.com and it will also still take precedence if a user accesses an application in the finance domain.

### Phase #3

In addition to these applications, I have several that don’t follow the *.adventure-works.com format, have different SSO methods, and/or don’t match a verified domain on my tenant. These can still be published separately using the same flow. In this case, I want to publish my website awcycleshome.com.

![AppId](./media/active-directory-application-proxy-wildcard\10.png)

![AppId](./media/active-directory-application-proxy-wildcard\11.png)

![AppId](./media/active-directory-application-proxy-wildcard\12.png)


Now my application structure is the following:


![AppId](./media/active-directory-application-proxy-wildcard\13.png)

## Other Considerations

### Accepted formats

The only acceptable external URL format is to have a wildcard (*) in the empty text box, and a custom domain. The internal URL must similarly be formatted as http(s)://*.domain . Other positions for the wildcard, multiple wildcards, or other regexs are not supported and will cause errors.

### Setting the homepage URL for the MyApps panel

The wildcard application will be represented with just one tile in the MyApps panel (myapps.microsoft.com). By default this tile will be hidden. To show the tile and have users land on a specific page, please first following the guidelines for setting a homepage URL, and then set the “Show Application” toggle to true in the application properties page.

### Excluding applications from the wildcard

You can exclude applications from the wildcard application is to publish them as a separate application, as explained in phase #2 above. It is best practice to publish the exceptions before the wildcard application, to ensure that your exceptions are enforced from the beginning.

You can also limit the wildcard to only work for specific applications through your DNS management. We recommend creating a CNAME entry that includes a wildcard and matches the format of the external URL you configured. However, you can instead point specific application URLs to the wildcards (ex: Instead of *.adventure-works.com, point hr.adventure-works.com, expenses.adventure-works.com and travel.adventure-works.com individually to 000aa000-11b1-2ccc-d333-4444eee4444e.tenant.runtime.msappproxy.net). If you use this option, you will also need another CNAME entry for the value AppId.domain (ex: 00000000-1a11-22b2-c333-444d4d4dd444.adventure-works.com ) also pointing to the same location. The AppId can be found in the application properties page: