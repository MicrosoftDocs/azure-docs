---
title: Troubleshooting Azure Application Gateway with App Service – Redirection to App Service’s URL
description: This article provides information on how to troubleshoot the redirection issue when Azure Application Gateway is used with Azure App Service
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 07/19/2019
ms.author: absha
---

# Troubleshoot App Service issues in Application Gateway

Learn how to diagnose and resolve issues encountered when App Server is used as backend target with Application Gateway

## Overview

In this article, you will learn how to troubleshoot the following issues:

> [!div class="checklist"]
> * App Service's URL getting exposed in the browser when there is a redirection
> * App Service's ARRAffinity Cookie domain set to App Service hostname (example.azurewebsites.net) instead of original host

When a back-end application sends a redirection response, you might want to redirect the client to a different URL than the one specified by the back-end application. For example, you might want to do this when an app service is hosted behind an application gateway and requires the client to do a redirection to its relative path. (For example, a redirect from contoso.azurewebsites.net/path1 to contoso.azurewebsites.net/path2.) When the app service sends a redirection response, it uses the same hostname in the location header of its response as the one in the request it receives from the application gateway. So the client will make the request directly to contoso.azurewebsites.net/path2 instead of going through the application gateway (contoso.com/path2). Bypassing the application gateway isn't desirable.

This issue may happen due to the following main reasons:

- You have redirection configured on your App Service. Redirection can be as simple as adding a trailing slash to the request.
- You have Azure AD authentication which causes the redirection.

Also, when you are using App Services behind Application Gateway , the domain name associated with the Application Gateway (example.com) will be different from the domain name of the App Service (say example.azurewebsites.net) because of which you will notice that the domain value for the ARRAffinity cookie set by the App Service will carry the "example.azurewebsites.net" domain name which is not desirable. The original hostname (example.com) should be the domain name value in the cookie.

## Sample configuration

- HTTP Listener: Basic or Multi-site
- Backend Address Pool: App Service
- HTTP Settings: “Pick Hostname from Backend Address” Enabled
- Probe: “Pick Hostname from HTTP Settings” Enabled

## Cause

Because App Service is a multitenant service, it uses the host header in the request to route the request to the correct endpoint. However, the default domain name of the App services, *.azurewebsites.net (say contoso.azurewebsites.net), is different from the application gateway's domain name (say contoso.com). Since the original request from the client has the application gateway's domain name (contoso.com) as the hostname, you need to configure the application gateway to change the host name in the original request to app services's hostname when it routes the request to the app service backend.  You achieve this by using the switch “Pick Hostname from Backend Address” in the Application Gateway's HTTP Setting configuration and the switch “Pick Hostname from Backend HTTP Settings” in the health probe configuration.



![appservice-1](./media/troubleshoot-app-service-redirection-app-service-url/appservice-1.png)

Due to this, when the App Service does a redirection, it uses the overriden hostname “contoso.azurewebsites.net” in the Location header, instead of the original hostname "contoso.com" unless configured otherwise. You can check the example request and response headers below.
```
## Request headers to Application Gateway:

Request URL: http://www.contoso.com/path

Request Method: GET

Host: www.contoso.com

## Response headers:

Status Code: 301 Moved Permanently

Location: http://contoso.azurewebsites.net/path/

Server: Microsoft-IIS/10.0

Set-Cookie: ARRAffinity=b5b1b14066f35b3e4533a1974cacfbbd969bf1960b6518aa2c2e2619700e4010;Path=/;HttpOnly;Domain=contoso.azurewebsites.net

X-Powered-By: ASP.NET
```
In the above example, you can notice that the response header has a status code of 301 for redirection and the location header has the App Service’s hostname instead of the original hostname “www.contoso.com”.

## Solution: Rewrite the Location header

You will need to set the hostname in the location header to the application gateway's domain name. To do this, create a [rewrite rule](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers) with a condition that evaluates if the location header in the response contains azurewebsites.net and performs an action to rewrite the location header to have application gateway's hostname.  See instructions on [how to rewrite the location header](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers#modify-a-redirection-url).

> [!NOTE]
> The HTTP header rewrite support is only available for the [Standard_V2 and WAF_v2 SKU](https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant) of the Application Gateway. In case, you are using V1 SKU, we strongly recommend you [migrate from V1 to V2](https://docs.microsoft.com/azure/application-gateway/migrate-v1-v2) to be able to use rewrite and other [advanced capabilities](https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant#feature-comparison-between-v1-sku-and-v2-sku) available with V2 SKU.

## Alternate solution: Use App service's custom domain instead of default domain name

If you are using V1 SKU, you will not be able to rewrite the location header since this capability is only available for V2 SKU. Therefore, to resolve the redirection issue, you will need to pass the same host name that Application Gateway receives to the App Service as well instead of doing a host override.

Once you do that, App Service will do the redirection (if any) on the same original host header which points to Application Gateway and not its own.

To achieve this, you must own a custom domain and follow the process mentioned below.

- Register the domain to the custom domain list of the App Service. For this, you must have a CNAME in your custom domain pointing to App Service’s FQDN. For more information, see [Map an existing custom DNS name to Azure App Service](https://docs.microsoft.com//azure/app-service/app-service-web-tutorial-custom-domain).

![appservice-2](./media/troubleshoot-app-service-redirection-app-service-url/appservice-2.png)

- Once that is done, your App Service is ready to accept the hostname “www.contoso.com”. Now change your CNAME entry in DNS to point it back to Application Gateway’s FQDN. For example, “appgw.eastus.cloudapp.azure.com”.

- Make sure that your domain “www.contoso.com” resolves to Application Gateway’s FQDN when you do a DNS query.

- Set your custom probe to disable “Pick Hostname from Backend HTTP Settings”. This can be done from the portal by unchecking the checkbox in the probe settings and in PowerShell by not using the -PickHostNameFromBackendHttpSettings switch in the Set-AzApplicationGatewayProbeConfig command. In the hostname field of the probe, enter your App Service's FQDN "example.azurewebsites.net" as the probe requests sent from Application Gateway will carry this in the host header.

  > [!NOTE]
  > While doing the next step, please make sure that your custom probe is not associated to your backend HTTP settings because your HTTP settings still has the "Pick Hostname from Backend Address" switch enabled at this point.

- Set your Application Gateway’s HTTP settings to disable “Pick Hostname from Backend Address”. This can be done from the portal by unchecking the checkbox and in PowerShell by not using the -PickHostNameFromBackendAddress switch in the Set-AzApplicationGatewayBackendHttpSettings command.

- Associate the custom probe back to the backend HTTP settings and verify the backend health if it is healthy.

- Once this is done, Application Gateway should now forward the same hostname “www.contoso.com” to the App Service and the redirection will happen on the same hostname. You can check the example request and response headers below.

To implement the steps mentioned above using PowerShell for an existing setup, follow the sample PowerShell script below. Note how we have not used the -PickHostname switches in the Probe and HTTP Settings configuration.

```azurepowershell-interactive
$gw=Get-AzApplicationGateway -Name AppGw1 -ResourceGroupName AppGwRG
Set-AzApplicationGatewayProbeConfig -ApplicationGateway $gw -Name AppServiceProbe -Protocol Http -HostName "example.azurewebsites.net" -Path "/" -Interval 30 -Timeout 30 -UnhealthyThreshold 3
$probe=Get-AzApplicationGatewayProbeConfig -Name AppServiceProbe -ApplicationGateway $gw
Set-AzApplicationGatewayBackendHttpSettings -Name appgwhttpsettings -ApplicationGateway $gw -Port 80 -Protocol Http -CookieBasedAffinity Disabled -Probe $probe -RequestTimeout 30
Set-AzApplicationGateway -ApplicationGateway $gw
```
  ```
  ## Request headers to Application Gateway:

  Request URL: http://www.contoso.com/path

  Request Method: GET

  Host: www.contoso.com

  ## Response headers:

  Status Code: 301 Moved Permanently

  Location: http://www.contoso.com/path/

  Server: Microsoft-IIS/10.0

  Set-Cookie: ARRAffinity=b5b1b14066f35b3e4533a1974cacfbbd969bf1960b6518aa2c2e2619700e4010;Path=/;HttpOnly;Domain=www.contoso.com

  X-Powered-By: ASP.NET
  ```
  ## Next steps

If the preceding steps do not resolve the issue, open a [support ticket](https://azure.microsoft.com/support/options/).
