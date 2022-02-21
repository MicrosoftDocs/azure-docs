---
title: Manage traffic to App Service
titleSuffix: Azure Application Gateway
description: This article provides guidance on how to configure Application Gateway with Azure App Service
services: application-gateway
author: xstof
ms.service: application-gateway
ms.topic: how-to
ms.date: 02/17/2022
ms.author: christoc
---

# Configure App Service with Application Gateway

Application gateway allows you to have an App Service app or other multi-tenant service as a back-end pool member. In this article, you learn to configure an App Service app with Application Gateway.  The configuration for Application Gateway will differ depending on how App Service will be accessed:
- The first option makes use of a **custom domain** on both Application Gateway and the App Service in the backend.  
- The second option is to have Application Gateway access App Service using it's **default domain**, suffixed as ".azurewebsites.net".

## [Custom Domain (recommended)](#tab/customdomain)

This is the configuration which is commonly recommended for production-grade scenarios and meets the practice of not changing the host name in the request flow.  It does require that you have a custom domain (and associated certificate) available so to avoid having to rely on the default ".azurewebsites" domain.

By associating both Application Gateway and App Service in the backend pool to the same domain name, the request flow does not need to override host name and the backend web application will see the original host as was used by the client.


## [Default Domain](#tab/defaultdomain)

This configuration is the easiest as it does not require a custom domain.  As such it allows for a quick convenient setup.  Note however that this configuration comes with limitations. We recommend to review the implications of using different host names between the client and Application Gateway and between Application and App Service in the backend.  For more information, please review the article in Architecture Center: [Preserve the original HTTP host name between a reverse proxy and its backend web application](/azure/architecture/best-practices/host-name-preservation)

When App Service does not have a custom domain associated with it, the host header on the incoming request on the web application will need to be set to the default domain, suffixed with ".azurewebsites.net" or else the platform will not be able to properly route the request.

This means that the host header in the original request received by the Application Gateway will be different from the host name of the backend App Service.

---

In this article you'll learn how to:
- Configure DNS
- Add App Service as backend pool to the Application Gateway
- Configure the HTTP Settings for the connection to App Service

## Prerequisites

### [Custom Domain (recommended)](#tab/customdomain)

- Application Gateway: Create an application gateway without a backend pool target. For more information, see [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](quick-create-portal.md)

- App Service: If you don't have an existing App Service, see [App Service documentation](../app-service/index.yml).

- A custom domain name and associated certificate (signed by a well known authority), stored in Key Vault.  For more information on how to store certificates in Key Vault, see [Tutorial: Import a certificate in Azure Key Vault](../key-vault/certificates/tutorial-import-certificate.md)

### [Default Domain](#tab/defaultdomain)

- Application Gateway: Create an application gateway without a backend pool target. For more information, see [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](quick-create-portal.md)

- App Service: If you don't have an existing App Service, see [App Service documentation](../app-service/index.yml).

---

## Configuring DNS

In the context of this scenario, DNS is relevant in two places:
1. the DNS name which the user or client is using towards Application Gateway and what is shown in a browser
2. the DNS name which Application Gateway is internally using to access the App Service in the backend

### [Custom Domain (recommended)](#tab/customdomain)

For the user or client to get routed to Application Gateway using the custom domain, DNS needs to be set up with a CNAME alias pointing to the DNS address of the Application Gateway.  The Application Gateway DNS address can be found on the overview page of the associated Public IP address.  Alternatively, an A record can be created, pointing to the IP address directly.  (Note that for Application Gateway V1 the VIP can change if you stop and start the service which makes this option undesired.)

For Application Gateway to connect to App Service using the same custom domain, App Service should be configured so it accepts traffic using the custom domain name as the incoming host.  For more information on how to map a custom domain to the App Service, see [Tutorial: Map an existing custom DNS name to Azure App Service](../app-service-web-tutorial-custom-domain.md)  Note that to verify the domain, App Service only requires adding a TXT record and no change is required on CNAME or A-records.  The DNS configuration for the custom domain will remain directed towards Application Gateway.

To accept connections to App Service over HTTPS, configure its TLS binding.  For this, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](../app-service/configure-ssl-bindings.md)

### [Default Domain](#tab/defaultdomain)

When no custom domain is available, the user or client can access Application Gateway using either the IP address of the gateway or its DNS address.  The Application Gateway DNS address can be found on the overview page of the associated Public IP address.

To connect to App Service, Application Gateway can use the default domain as provided by App Service (suffixed "azurewebsites.net").

---

## Add App service as backend pool

### [Azure Portal](#tab/azure-portal)

1. In the Azure portal, select your Application Gateway.

2. Under **Backend pools**, select the backend pool.

3. Under **Target type**, select **App Services**.

4. Under **Target** select your App Service.

   :::image type="content" source="./media/configure-web-app/backend-pool.png" alt-text="App service backend":::
   
   > [!NOTE]
   > The dropdown only populates those app services which are in the same subscription as your Application Gateway. If you want to use an app service which is in a different subscription than the one in which the Application Gateway is, then instead of choosing **App Services** in the **Targets** dropdown, choose **IP address or hostname** option and enter the hostname (example.azurewebsites.net) of the app service.

5. Select **Save**.

### [Powershell](#tab/azure-powershell)

```powershell
# Fully qualified default domain name of the web app:
$webAppFQDN = "<nameofwebapp>.azurewebsite.net"

# For Application Gateway: both name, resource group and name for the backend pool to create:
$rgName = "<name of resource group for App Gateway>"
$appGwName = "<name of the App Gateway>"
$appGwBackendPoolNameForAppSvc = "<name for backend pool to be added>"

# Get existing Application Gateway:
$gw = Get-AzApplicationGateway -Name $appGwName -ResourceGroupName $rgName

# Add a new Backend Pool with App Service in there:
Add-AzApplicationGatewayBackendAddressPool -Name $appGwBackendPoolNameForAppSvc -ApplicationGateway $gw -BackendFqdns $webAppFQDN

# Update Application Gateway with the new added Backend Pool:
Set-AzApplicationGateway -ApplicationGateway $gw
```

---

## Edit HTTP settings for App Service

### [Azure Portal](#tab/azure-portal/customdomain)

An HTTP Setting is required that instructs Application Gateway to access the App Service backend using the **custom domain name**.  The HTTP Setting will by default use the [default health probe](./application-gateway-probe-overview.md#default-health-probe) which relies on the hostname as is configured in the Backend Pool (suffixed "azurewebsites.net").  For this reason, it is good to first configure a [custom health probe](./application-gateway-probe-overview.md#custom-health-probe) that is configured with the correct custom domain name as its host name.

We will connect to the backend using HTTPS.

1. Under **HTTP Settings**, select an existing HTTP setting or add a new one.
2. In case of a new HTTP Setting, give it a name
3. Select HTTPS as the desired backend protocol using port 443
4. If the certificate is signed by a well known authority, select "Yes" for "User well known CA certificate".  Alternatively [Add authentication/trusted root certificates of back-end servers](./end-to-end-ssl-portal.md#add-authenticationtrusted-root-certificates-of-back-end-servers)
5. Make sure to set "Override with new host name" to "No"
6. Select the custom HTTPS health probe in the dropdown for "Custom probe".  (Note: it will work with the default probe but for correctness we recommend using a custom probe with the correct domain name.)

:::image type="content" source="./media/configure-web-app/http-settings-custom-domain.png" alt-text="Configure HTTP Settings to use custom domain towards App Service backend using No Override":::

### [Azure Portal](#tab/azure-portal/defaultdomain)

An HTTP Setting is required that instructs Application Gateway to access the App Service backend using the **default ("azurewebsites.net") domain name**.  To do so, the HTTP Setting will explicitly override the host name.

1. Under **HTTP Settings**, select an existing HTTP setting or add a new one.
2. In case of a new HTTP Setting, give it a name
3. Select HTTPS as the desired backend protocol using port 443
4. If the certificate is signed by a well known authority, select "Yes" for "User well known CA certificate".  Alternatively [Add authentication/trusted root certificates of back-end servers](./end-to-end-ssl-portal.md#add-authenticationtrusted-root-certificates-of-back-end-servers)
5. Make sure to set "Override with new host name" to "Yes"
6. Under "Host name override", select "Pick host name from backend target". This will cause the request towards App Service to use the "azurewebsites.net" host name, as is configured in the Backend Pool.

:::image type="content" source="media/configure-web-app/http-settings-default-domain.png" alt-text="Configure HTTP Settings to use default domain towards App Service backend by setting Pick host name from backend target":::

### [Powershell](#tab/azure-powershell/customdomain)

```powershell
# Configure Application Gateway to connect to App Service using the incoming hostname
$rgName = "<name of resource group for App Gateway>"
$appGwName = "<name of the App Gateway>"
$customProbeName = "<name for custom health probe>"
$customDomainName = "<FQDN for custom domain associated with App Service>"
$httpSettingsName = "<name for http settings to be created>"

# Get existing Application Gateway:
$gw = Get-AzApplicationGateway -Name $appGwName -ResourceGroupName $rgName

# Add custom health probe using custom domain name:
Add-AzApplicationGatewayProbeConfig -Name $customProbeName -ApplicationGateway $gw -Protocol Https -HostName $customDomainName -Path "/" -Interval 30 -Timeout 120 -UnhealthyThreshold 3
$probe = Get-AzApplicationGatewayProbeConfig -Name $customProbeName -ApplicationGateway $gw

# Add HTTP Settings to use towards App Service:
Add-AzApplicationGatewayBackendHttpSettings -Name $httpSettingsName -ApplicationGateway $gw -Protocol Https -Port 443 -Probe $probe -CookieBasedAffinity Disabled -RequestTimeout 30

# Update Application Gateway with the new added HTTP settings and probe:
Set-AzApplicationGateway -ApplicationGateway $gw
```

### [Powershell](#tab/azure-powershell/defaultdomain)

```powershell
# Configure Application Gateway to connect to backend using default App Service hostname
$rgName = "<name of resource group for App Gateway>"
$appGwName = "<name of the App Gateway>"
$httpSettingsName = "<name for http settings to be created>"

# Get existing Application Gateway:
$gw = Get-AzApplicationGateway -Name $appGwName -ResourceGroupName $rgName

# Add HTTP Settings to use towards App Service:
Add-AzApplicationGatewayBackendHttpSettings -Name $httpSettingsName -ApplicationGateway $gw -Protocol Https -Port 443 -PickHostNameFromBackendAddress -CookieBasedAffinity Disabled -RequestTimeout 30

# Update Application Gateway with the new added HTTP settings and probe:
Set-AzApplicationGateway -ApplicationGateway $gw
```

---

## Configure Request Routing Rule

Provided with the earlier configured Backend Pool and the HTTP Settings, the request routing rule can be set up to take traffic from a listener and route it to the Backend Pool using the HTTP Settings.  For this, make sure you have a HTTP or HTTPS listener available that is not already bound to an existing routing rule.

### [Azure Portal](#tab/azure-portal)

1. Under "Rules" click to add a new "Request routing rule"
1. Provide the rule with a name
1. Select an HTTP or HTTPS listener that is not bound yet to an existing routing rule
1. Under "Backend targets" choose the Backend Pool in which App Service has been configured
1. Configure the HTTP settings with which Application Gateway should connect to the App Service backend
1. Select "Add" to save this configuration

:::image type="content" source="media/configure-web-app/add-routing-rule.png" alt-text="Add a new Routing rule from the listener to the App Service Backend Pool using the configured HTTP Settings":::

### [Powershell](#tab/azure-powershell)

```powershell
$rgName = "<name of resource group for App Gateway>"
$appGwName = "<name of the App Gateway>"
$httpListenerName = "<name for existing http listener (without rule) to route traffic from>"
$httpSettingsName = "<name for http settings to use>"
$appGwBackendPoolNameForAppSvc = "<name for backend pool to route to>"
$reqRoutingRuleName = "<name for request routing rule to be added>"

# Get existing Application Gateway:
$gw = Get-AzApplicationGateway -Name $appGwName -ResourceGroupName $rgName

# Get HTTP Settings:
$httpListener = Get-AzApplicationGatewayHttpListener -Name $httpListenerName -ApplicationGateway $gw
$httpSettings = Get-AzApplicationGatewayBackendHttpSettings -Name $httpSettingsName -ApplicationGateway $gw
$backendPool = Get-AzApplicationGatewayBackendAddressPool -Name $appGwBackendPoolNameForAppSvc -ApplicationGateway $gw

# Add routing rule:
Add-AzApplicationGatewayRequestRoutingRule -Name $reqRoutingRuleName -ApplicationGateway $gw -RuleType Basic -BackendHttpSettings $httpSettings -HttpListener $httpListener -BackendAddressPool $backendPool

# Update Application Gateway with the new routing rule:
Set-AzApplicationGateway -ApplicationGateway $gw
```

---

## Additional configuration in case of redirection to app service's relative path

When the app service sends a redirection response to the client to redirect to its relative path (For example, a redirect from `contoso.azurewebsites.net/path1` to `contoso.azurewebsites.net/path2`), it uses the same hostname in the location header of its response as the one in the request it received from the application gateway. So the client will make the request directly to `contoso.azurewebsites.net/path2` instead of going through the application gateway (`contoso.com/path2`). Bypassing the application gateway isn't desirable.

If in your use case, there are scenarios where the App service will need to send a redirection response to the client, perform the [additional steps to rewrite the location header](./troubleshoot-app-service-redirection-app-service-url.md#sample-configuration).

## Restrict access

The web apps deployed in these examples use public IP addresses that can be  accessed directly from the Internet. This helps with troubleshooting when you are learning about a new feature and trying new things. But if you intend to deploy a feature into production, you'll want to add more restrictions.

One way you can restrict access to your web apps is to use [Azure App Service static IP restrictions](../app-service/app-service-ip-restrictions.md). For example, you can restrict the web app so that it only receives traffic from the application gateway. Use the app service IP restriction feature to list the application gateway VIP as the only address with access.

## Next steps

To learn more about the App service and other multi-tenant support with application gateway, see [multi-tenant service support with application gateway](./application-gateway-web-app-overview.md).
