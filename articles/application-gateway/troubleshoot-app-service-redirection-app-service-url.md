---
title: Troubleshoot redirection to App Service URL
titleSuffix: Azure Application Gateway
description: This article provides information on how to troubleshoot the redirection issue when Azure Application Gateway is used with Azure App Service
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: troubleshooting
ms.date: 04/15/2021
ms.author: greglin 
---

# Troubleshoot App Service issues in Application Gateway

Learn how to diagnose and resolve issues you might encounter when Azure App Service is used as a backend target with Azure Application Gateway.

## Overview

In this article, you'll learn how to troubleshoot the following issues, as described in more detail in Architecture Center: [Preserve the original HTTP host name between a reverse proxy and its backend web application](/azure/architecture/best-practices/host-name-preservation#potential-issues)

* [Incorrect absolute URLs](/azure/architecture/best-practices/host-name-preservation#incorrect-absolute-urls) 
* [Incorrect redirect URLs](/azure/architecture/best-practices/host-name-preservation#incorrect-redirect-urls)  
  * the app service URL is exposed in the browser when there's a redirection
  * an example of this: an OIDC authentication flow is broken because of a redirect with wrong hostname; this includes the use of [App Service Authentication and Authorization](../app-service/overview-authentication-authorization.md)
* [Broken cookies](/azure/architecture/best-practices/host-name-preservation#broken-cookies)
  * cookies are not propagated between the browser and the App Service
  * an example of this: the app service ARRAffinity cookie domain is set to the app service host name and is tied to "example.azurewebsites.net", instead of the original host.  As a result, session affinity is broken.

The root-cause for the above symptoms is a setup that overrides the hostname as used by Application Gateway towards App Service into a different hostname as is seen by the browser.  Often the hostname is overridden to the default App Service "azurewebsites.net" domain.

:::image type="content" source="media/troubleshoot-app-service-redirection-app-service-url/root-cause-application-gateway-to-azure-app-service-default-domain.png" alt-text="Root cause - Application Gateway overwrites hostname to azurewebsites.net":::

## Sample configuration

In case your configuration matches one of below two situations, your setup is subject to the instructions in this article:
- **Pick Hostname from Backend Address** is enabled in HTTP Settings
- **Override with specific domain name** is set to a value different from what the browser request has

## Cause

App Service is a multitenant service, so it uses the host header in the request to route the request to the correct endpoint. The default domain name of App Services, *.azurewebsites.net (say, contoso.azurewebsites.net), is different from the application gateway's domain name (say, contoso.com). The backend App Service is missing the required context to generate redirect url's or cookies that align with the domain as seen by the browser.

## Solution

The production-recommended solution is to configure Application Gateway and App Service to not override the hostname.  Follow the instructions for **"Custom Domain (recommended)"** in [Configure App Service with Application Gateway](./configure-web-app.md)

Only consider applying another workaround (like a rewrite of the Location header as described below) after assessing the implications as described in the article: [Preserve the original HTTP host name between a reverse proxy and its backend web application](/azure/architecture/best-practices/host-name-preservation).  These implications include the potential for domain-bound cookies and for absolute URL's outside of the location header, to remain broken.

## Workaround: rewrite the Location header

> [!WARNING]
> This configuration comes with limitations. We recommend to review the implications of using different host names between the client and Application Gateway and between Application and App Service in the backend.  For more information, please review the article in Architecture Center: [Preserve the original HTTP host name between a reverse proxy and its backend web application](/azure/architecture/best-practices/host-name-preservation)

Set the host name in the location header to the application gateway's domain name. To do this, create a [rewrite rule](./rewrite-http-headers-url.md) with a condition that evaluates if the location header in the response contains azurewebsites.net. It must also perform an action to rewrite the location header to have the application gateway's host name. For more information, see instructions on [how to rewrite the location header](./rewrite-http-headers-url.md#modify-a-redirection-url).

> [!NOTE]
> The HTTP header rewrite support is only available for the [Standard_v2 and WAF_v2 SKU](./application-gateway-autoscaling-zone-redundant.md) of Application Gateway. We recommend [migrating to v2](./migrate-v1-v2.md) for Header Rewrite and other [advanced capabilities](./overview-v2.md#feature-comparison-between-v1-sku-and-v2-sku) that are available with v2 SKU.


## Next steps

If the preceding steps didn't resolve the issue, open a [support ticket](https://azure.microsoft.com/support/options/).
