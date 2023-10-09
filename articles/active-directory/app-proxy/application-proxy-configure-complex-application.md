---
title: Complex applications for Microsoft Entra application proxy
description: Provides an understanding of complex application in Microsoft Entra application proxy, and how to configure one. 
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: how-to
ms.date: 09/15/2023
ms.author: dhruvinshah
ms.reviewer: dhruvinshah
---

# Understanding Microsoft Entra application proxy Complex application scenario (Preview)

When applications are made up of multiple individual web application using different domain suffixes or different ports or paths in the URL, the individual web application instances must be published in separate Microsoft Entra application proxy apps and the following problems might arise:
1. Pre-authentication- The client must separately acquire an access token or cookie for each Microsoft Entra application proxy app. This might lead to additional redirects to login.microsoftonline.com and CORS issues.
2. CORS issues- Cross-origin resource sharing calls (OPTIONS request) might be triggered to validate if the caller web app is allowed to access the URL of the targeted web app. These will be blocked by the Microsoft Entra application proxy Cloud service, since these requests cannot contain authentication information.
3. Poor app management- Multiple enterprise apps are created to enable access to a private app adding friction to the app management experience.

The following figure shows an example for complex application domain structure.

:::image type="content" source="./media/application-proxy-configure-complex-application/complex-app-structure-1.png" alt-text="Diagram of domain structure for a complex application showing resource sharing between primary and secondary application.":::

With [Microsoft Entra application proxy](application-proxy.md), you can address this issue by using complex application publishing that is made up of multiple URLs across various domains. 

:::image type="content" source="./media/application-proxy-configure-complex-application/complex-app-flow-1.png" alt-text="Diagram of a Complex application with multiple application segments definition.":::

A complex app has multiple app segments, with each app segment being a pair of an internal & external URL.
There is one Conditional Access policy associated with the app and access to any of the external URLs work with pre-authentication with the same set of policies that are enforced for all.

This solution that allows user to:

- by successfully authenticating 
- not being blocked by CORS errors
- including those that uses different domain suffixes or different ports or paths in the URL internally

This article provides you with the information you need to configure wildcard application publishing in your environment.

## Characteristics of application segment(s) for complex application. 
1. Application segments can be configured only for a wildcard application.
2. External and alternate URL should match the wildcard external and alternate URL domain of the application respectively.
3. Application segment URLs (internal and external) need to maintain uniqueness across complex applications.
4. CORS Rules (optional) can be configured per application segment.
5. Access will only be granted to defined application segments for a complex application.
    - Note - If all application segments are deleted, a complex application will behave as a wildcard application opening access to all valid URL by specified domain. 
6. You can have an internal URL defined both as an application segment and a regular application.
    - Note - Regular application will always take precedence over a complex app (wildcard application).

## Pre-requisites
Before you get started with Application Proxy Complex application scenario apps, make sure your environment is ready with the following settings and configurations:
- You need to enable Application Proxy and install a connector that has line of sight to your applications. See the tutorial [Add an on-premises application for remote access through Application Proxy](application-proxy-add-on-premises-application.md#add-an-on-premises-app-to-azure-ad) to learn how to prepare your on-premises environment, install and register a connector, and test the connector.


## Configure application segment(s) for complex application. 

> [!NOTE]
> Two application segment per complex distributed application are supported for [Microsoft Entra ID P1 or P2 subscription](https://azure.microsoft.com/pricing/details/active-directory). License requirement for more than two application segments per complex application to be announced soon.

To publish complex distributed app through Application Proxy with application segments:

1. [Create a wildcard application.](application-proxy-wildcard.md#create-a-wildcard-application)

1. On the Application Proxy Basic settings page, select "Add application segments".

    :::image type="content" source="./media/application-proxy-configure-complex-application/add-application-segments.png" alt-text="Screenshot of link to add an application segment.":::

3. On the Manage and configure application segments page, select "+ Add app segment"

    :::image type="content" source="./media/application-proxy-configure-complex-application/add-application-segment-1.png" alt-text="Screenshot of Manage and configure application segment blade.":::

4. In the Internal Url field, enter the internal URL for your app.

5. In the External Url field, drop down the list and select the custom domain you want to use.

6. Add CORS Rules (optional).  For more information see [Configuring CORS Rule](/graph/api/resources/corsconfiguration_v2?view=graph-rest-beta&preserve-view=true).

7. Select Create.

    :::image type="content" source="./media/application-proxy-configure-complex-application/create-app-segment.png" alt-text="Screenshot of add or edit application segment context plane.":::

Your application is now set up to use the configured application segments. Be sure to assign users to your application before you test or release it.

To edit/update an application segment, select respective application segment from the list in Manage and configure application segments page. Upload a certificate for the updated domain, if necessary, and update the DNS record. 

## DNS updates

When using custom domains, you need to create a DNS entry with a CNAME record for the external URL (for example,  `*.adventure-works.com`) pointing to the external URL of the application proxy endpoint. For wildcard applications, the CNAME record needs to point to the relevant external URL:

> `<yourAADTenantId>.tenant.runtime.msappproxy.net`

Alternatively, a DNS entry with a CNAME record for every individual application segment can be created as follows:

> `'External URL of application segment'` > `'<External URL without domain>-<tenantname>.msapproxy.net'` <br>
for example in above instance  >`'home.contoso.ashcorp.us'` points to > `home-ashcorp1.msappproxy.net`


For more detailed instructions for Application Proxy, see [Tutorial: Add an on-premises application for remote access through Application Proxy in Microsoft Entra ID](../app-proxy/application-proxy-add-on-premises-application.md).

## See also
- [Tutorial: Add an on-premises application for remote access through Application Proxy in Microsoft Entra ID](../app-proxy/application-proxy-add-on-premises-application.md) 
- [Plan a Microsoft Entra application proxy deployment](application-proxy-deployment-plan.md) 
- [Remote access to on-premises applications through Microsoft Entra application proxy](application-proxy.md)
- [Understand and solve Microsoft Entra application proxy CORS issues](application-proxy-understand-cors-issues.md)
