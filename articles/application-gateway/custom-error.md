---
title: Create Azure Application Gateway custom error pages
description: This article shows you how to create Application Gateway custom error pages. You can use your own branding and layout using a custom error page.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 04/12/2022
ms.author: greglin 
ms.custom: devx-track-azurepowershell
---

# Create Application Gateway custom error pages

Application Gateway allows you to create custom error pages instead of displaying default error pages. You can use your own branding and layout using a custom error page.

For example, you can define your own maintenance page if your web application isn't reachable. Or, you can create an unauthorized access page if a malicious request is sent to a web application.

Custom error pages are supported for the following two scenarios:

- **Maintenance page** - This custom error page is sent instead of a 502 bad gateway page. It's shown when Application Gateway has no backend to route traffic to. For example, when there's scheduled maintenance or when an unforeseen issue effects backend pool access.
- **Unauthorized access page** - This custom error page is sent instead of a 403 unauthorized access page. It's shown when the Application Gateway WAF detects malicious traffic and blocks it.

If an error originates from the backend servers, then it's passed along unmodified back to the caller. A custom error page isn't displayed. Application gateway can display a custom error page when a request can't reach the backend.

Custom error pages can be defined at the global level and the listener level:

- **Global level** - the error page applies to traffic for all the web applications deployed on that application gateway.
- **Listener level** - the error page is applied to traffic received on that listener.
- **Both** - the custom error page defined at the listener level overrides the one set at global level.

To create a custom error page, you must have:

- an HTTP response status code.
- corresponding location for the error page. 
- error page should be internet accessible and return 200 response.
- error page should be in \*.htm or \*.html extension type.
- error page size must be less than 1 MB.

You may reference either internal or external images/CSS for this HTML file. For externally referenced resources, use absolute URLs that are publicly accessible. Be aware of the HTML file size when using internal images (Base64-encoded inline image) or CSS. Relative links with files in the same location are currently not supported.

After you specify an error page, the application gateway downloads it from the defined location and saves it to the local application gateway cache. Then, that HTML page is served by the application gateway, whereas the externally referenced resources are fetched directly by the client. To modify an existing custom error page, you must point to a different blob location in the application gateway configuration. The application gateway doesn't periodically check the blob location to fetch new versions.

## Portal configuration

1. Navigate to Application Gateway in the portal and choose an application gateway.

2. Select **Listeners** and navigate to a particular listener where you want to specify an error page.

3. Configure a custom error page for a 403 WAF error or a 502 maintenance page at the listener level.

    > [!NOTE]
    > Creating global level custom error pages from the Azure portal is currently not supported.

4. Under **Error page url**, select **Yes**, and then configure a publicly accessible blob URL for a given error status code. Select **Save**. The Application Gateway is now configured with the custom error page.

   ![Screenshot of Application Gateway custom error page.](media/custom-error/ag-error-codes.png)

## Azure PowerShell configuration

You can use Azure PowerShell to configure a custom error page. For example, a global custom error page:

```powershell
$appgw   = Get-AzApplicationGateway -Name <app-gateway-name> -ResourceGroupName <resource-group-name>

$updatedgateway = Add-AzApplicationGatewayCustomError -ApplicationGateway $appgw -StatusCode HttpStatus502 -CustomErrorPageUrl "http://<website-url>"
```

Or a listener level error page:

```powershell
$appgw   = Get-AzApplicationGateway -Name <app-gateway-name> -ResourceGroupName <resource-group-name>

$listener01 = Get-AzApplicationGatewayHttpListener -Name <listener-name> -ApplicationGateway $appgw

$updatedlistener = Add-AzApplicationGatewayHttpListenerCustomError -HttpListener $listener01 -StatusCode HttpStatus502 -CustomErrorPageUrl "http://<website-url>"
```

For more information, see [Add-AzApplicationGatewayCustomError](/powershell/module/az.network/add-azapplicationgatewaycustomerror) and [Add-AzApplicationGatewayHttpListenerCustomError](/powershell/module/az.network/add-azapplicationgatewayhttplistenercustomerror).

## Next steps

For information about Application Gateway diagnostics, see [Backend health, diagnostic logs, and metrics for Application Gateway](application-gateway-diagnostics.md).
