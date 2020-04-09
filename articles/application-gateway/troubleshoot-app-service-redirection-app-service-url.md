---
title: Troubleshoot redirection to App Service URL
titleSuffix: Azure Application Gateway
description: This article provides information on how to troubleshoot the redirection issue when Azure Application Gateway is used with Azure App Service
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 11/14/2019
ms.author: absha
---

# Troubleshoot App Service issues in Application Gateway

Learn how to diagnose and resolve issues you might encounter when Azure App Service is used as a back-end target with Azure Application Gateway.

## Overview

In this article, you'll learn how to troubleshoot the following issues:

> [!div class="checklist"]
> * The app service URL is exposed in the browser when there's a redirection.
> * The app service ARRAffinity cookie domain is set to the app service host name, example.azurewebsites.net, instead of the original host.

When a back-end application sends a redirection response, you might want to redirect the client to a different URL than the one specified by the back-end application. You might want to do this when an app service is hosted behind an application gateway and requires the client to do a redirection to its relative path. An example is a redirect from contoso.azurewebsites.net/path1 to contoso.azurewebsites.net/path2. 

When the app service sends a redirection response, it uses the same host name in the location header of its response as the one in the request it receives from the application gateway. For example, the client makes the request directly to contoso.azurewebsites.net/path2 instead of going through the application gateway contoso.com/path2. You don't want to bypass the application gateway.

This issue might happen for the following main reasons:

- You have redirection configured on your app service. Redirection can be as simple as adding a trailing slash to the request.
- You have Azure Active Directory authentication, which causes the redirection.

Also, when you use app services behind an application gateway, the domain name associated with the application gateway (example.com) is different from the domain name of the app service (say, example.azurewebsites.net). The domain value for the ARRAffinity cookie set by the app service carries the example.azurewebsites.net domain name, which isn't desirable. The original host name, example.com, should be the domain name value in the cookie.

## Sample configuration

- HTTP listener: Basic or multi-site
- Back-end address pool: App Service
- HTTP settings: **Pick Hostname from Backend Address** enabled
- Probe: **Pick Hostname from HTTP Settings** enabled

## Cause

App Service is a multitenant service, so it uses the host header in the request to route the request to the correct endpoint. The default domain name of App Services, *.azurewebsites.net (say, contoso.azurewebsites.net), is different from the application gateway's domain name (say, contoso.com). 

The original request from the client has the application gateway's domain name, contoso.com, as the host name. You need to configure the application gateway to change the host name in the original request to the app service's host name when it routes the request to the app service back end. Use the switch **Pick Hostname from Backend Address** in the application gateway's HTTP setting configuration. Use the switch **Pick Hostname from Backend HTTP Settings** in the health probe configuration.



![Application gateway changes host name](./media/troubleshoot-app-service-redirection-app-service-url/appservice-1.png)

When the app service does a redirection, it uses the overridden host name contoso.azurewebsites.net in the location header instead of the original host name contoso.com, unless configured otherwise. Check the following example request and response headers.
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
In the previous example, notice that the response header has a status code of 301 for redirection. The location header has the app service's host name instead of the original host name `www.contoso.com`.

## Solution: Rewrite the location header

Set the host name in the location header to the application gateway's domain name. To do this, create a [rewrite rule](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers) with a condition that evaluates if the location header in the response contains azurewebsites.net. It must also perform an action to rewrite the location header to have the application gateway's host name. For more information, see instructions on [how to rewrite the location header](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers#modify-a-redirection-url).

> [!NOTE]
> The HTTP header rewrite support is only available for the [Standard_v2 and WAF_v2 SKU](https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant) of Application Gateway. If you use v1 SKU, we recommend that you [migrate from v1 to v2](https://docs.microsoft.com/azure/application-gateway/migrate-v1-v2). You want to use rewrite and other [advanced capabilities](https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant#feature-comparison-between-v1-sku-and-v2-sku) that are available with v2 SKU.

## Alternate solution: Use a custom domain name

If you use v1 SKU, you can't rewrite the location header. This capability is only available for v2 SKU. To resolve the redirection issue, pass the same host name that the application gateway receives to the app service as well, instead of doing a host override.

The app service now does the redirection (if any) on the same original host header that points to the application gateway and not its own.

You must own a custom domain and follow this process:

- Register the domain to the custom domain list of the app service. You must have a CNAME in your custom domain that points to the app service's FQDN. For more information, see [Map an existing custom DNS name to Azure App Service](https://docs.microsoft.com//azure/app-service/app-service-web-tutorial-custom-domain).

    ![App service custom domain list](./media/troubleshoot-app-service-redirection-app-service-url/appservice-2.png)

- Your app service is ready to accept the host name `www.contoso.com`. Change your CNAME entry in DNS to point it back to the application gateway's FQDN, for example, `appgw.eastus.cloudapp.azure.com`.

- Make sure that your domain `www.contoso.com` resolves to the application gateway's FQDN when you do a DNS query.

- Set your custom probe to disable **Pick Hostname from Backend HTTP Settings**. In the Azure portal, clear the check box in the probe settings. In PowerShell, don't use the **-PickHostNameFromBackendHttpSettings** switch in the **Set-AzApplicationGatewayProbeConfig** command. In the host name field of the probe, enter your app service's FQDN, example.azurewebsites.net. The probe requests sent from the application gateway carry this FQDN in the host header.

  > [!NOTE]
  > For the next step, make sure that your custom probe isn't associated to your back-end HTTP settings. Your HTTP settings still have the **Pick Hostname from Backend Address** switch enabled at this point.

- Set your application gateway's HTTP settings to disable **Pick Hostname from Backend Address**. In the Azure portal, clear the check box. In PowerShell, don't use the **-PickHostNameFromBackendAddress** switch in the **Set-AzApplicationGatewayBackendHttpSettings** command.

- Associate the custom probe back to the back-end HTTP settings, and verify that the back end is healthy.

- The application gateway should now forward the same host name, `www.contoso.com`, to the app service. The redirection happens on the same host name. Check the following example request and response headers.

To implement the previous steps using PowerShell for an existing setup, use the sample PowerShell script that follows. Note how we haven't used the **-PickHostname** switches in the probe and HTTP settings configuration.

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

If the preceding steps didn't resolve the issue, open a [support ticket](https://azure.microsoft.com/support/options/).
