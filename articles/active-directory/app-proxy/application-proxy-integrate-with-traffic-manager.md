---
title: Add your own Traffic Manager to Application Proxy
description: Learn how to combine the Application Proxy service with a Traffic Manager solution.
author: kenwith
ms.author: kenwith
ms.reviewer: ashishj
ms.service: active-directory
ms.subservice: app-proxy
ms.topic: how-to
ms.date: 09/14/2023
ms.custom: template-how-to
---

# Add your own Traffic Manager to Application Proxy

This article explains how to configure Microsoft Entra application proxy to work with Traffic Manager. With the Application Proxy geo-routing feature, you can optimize which region of the Application Proxy service your connector groups use. You can now combine this functionality with a Traffic Manager solution of your choice. This combination enables a fully dynamic geo-aware solution based on your user location. It unlocks the rich rule set of your preferred Traffic Manager to prioritize how traffic is routed to your apps protected by Application Proxy. With this combination, users can use a single URL to access the instance of the app closest to them.

:::image type="content" source="./media/application-proxy-integrate-with-traffic-manager/application-proxy-integrate-with-traffic-manager-diagram.png" alt-text="Diagram showing how Traffic Manager is integrated with Application Proxy.":::

## Prerequisites

- A Traffic Manager solution.
- Apps that exist in different regions. Geo-routing is enabled per connector group co-located with the app.
- A custom domain to use for each app.

## Application Proxy configuration

To use Traffic Manager, you must configure Application Proxy. The configuration steps that follow refer to the following URL definitions:

- Regional URL: The Application Proxy endpoints for each app. For example, nam.contoso.com and india.contoso.com.
- Alternate URL: The URL configured for the Traffic Manager. For example, contoso.com.

Follow these steps to configure Application Proxy for Traffic Manager:

1. Install connectors for each location your app instances will be in. For each connector group, use the geo-routing feature to assign the connectors to their respective regions.

1. Set up your app instances with Application Proxy as follows:
   1. For each app, upload a custom domain. Include the alternate URL to use for the apps as a SAN URL to the uploaded certificate.
   1. Assign each app to its respective connector group.
   1. If you prefer the alternate URL to be maintained throughout the user session, register each app and add the URL as a reply URL. This step is optional.

1. In the Traffic Manager solution, add the Application Proxy regional URLs that were created for each app as an endpoint.

1. Configure the Traffic Manager's load balancing rules with a standard SKU.

1. To give your Traffic Manager a user-friendly URL, create a CNAME record that points the alternate URL to the Traffic Manager's endpoint.

1. With the `alternateUrl` property, configure the alternate URL on the [onPremisesPublishing resource type](/graph/api/resources/onpremisespublishing) of the app.

1. If you want the alternate URL to be maintained throughout the user session, call `onPremisesPublishing` and set the  `useAlternateUrlForTranslationAndRedirect` flag to `true`.

## Sample Application Proxy configuration

The following table shows a sample Application Proxy configuration. This sample uses the sample app domain www\.contoso.com as the alternate URL.

|     | North America-based app | India-based app | Additional Information |
|---- | ----------------------- | --------------- | ---------------------- |
| **Internal URL** | contoso.com | contoso.com | If the apps are hosted in different regions, you can use the same internal URL for each app. |
| **External URL** | nam.contoso.com | india.contoso.com | Configure a custom domain for each app.|
| **Custom domain certificate** | DNS: nam.contoso.com SAN: www\.contoso.com | DNS: nam.contoso.com SAN: www\.contoso.com | In the certificate you upload for each app, set the SAN value to the alternate URL. The alternate URL is the URL all users use to reach the app.|
| **Connector group** | NAM Geo Group | India Geo Group | Ensure you assign each app to the correct connector group by using the geo-routing functionality. |
| **Redirects** | (Optional) To maintain redirects for the alternate URL, add the application registration for the app.  | (Optional) To maintain redirects for the alternate URL, add the application registration for the app.  | This step is required if the alternate URL (www\.contoso.com) is to be maintained for all redirections. |
| **Reply URL** | www\.contoso.com.| www\.contoso.com. |

## Traffic manager configuration

Follow these steps to configure the Traffic Manager:

1. Create a Traffic Manager profile with your preferred routing rules.

1. In the Traffic Manager, add the NAM endpoint: nam.contoso.com.

1. Add the India endpoint: india.contoso.com.

1. Add the app proxy endpoints.

1. Add a CNAME record to point www\.contoso.com to the Traffic Manager's URL. For example, contoso.trafficmanager.net.

    The alternate URL now points to the Traffic Manager.

## Next steps

[Publish applications on separate networks and locations using connector groups](application-proxy-connector-groups.md)
