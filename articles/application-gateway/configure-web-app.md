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
- Add App Service as backend pool to the Application Gateway
- Configure the HTTP Settings for the connection to App Service

## Prerequisites

## [Custom Domain (recommended)](#tab/customdomain)

- Application Gateway: Create an application gateway without a backend pool target. For more information, see [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](quick-create-portal.md)

- App Service: If you don't have an existing App service, see [App service documentation](../app-service/index.yml).

- A custom domain name and associated certificate, stored in Key Vault.  For more information on how to store certificates in Key Vault, see [Tutorial: Import a certificate in Azure Key Vault](../key-vault/certificates/tutorial-import-certificate.md)

## [Default Domain](#tab/defaultdomain)

- Application gateway: Create an application gateway without a backend pool target. For more information, see [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](quick-create-portal.md)

- App service: If you don't have an existing App service, see [App service documentation](../app-service/index.yml).

---

## Add App service as backend pool

### [Azure Portal](#tab/azure-portal)

1. In the Azure portal, select your Application Gateway.

2. Under **Backend pools**, select the backend pool.

3. Under **Target type**, select **App Services**.

4. Under **Target** select your App Service.

   :::image type="content" source="./media/configure-web-app-portal/backend-pool.png" alt-text="App service backend":::
   
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

TODO: azure portal instructions for custom domain

1. Under **HTTP Settings**, select the existing HTTP setting.
2. Under **Override with new host name**, select **Yes**.
3. Under **Host name override**, select **Pick host name from backend target**.
4. Select **Save**.

   :::image type="content" source="./media/configure-web-app-portal/http-settings.png" alt-text="Pick host name from backend http settings":::

### [Azure Portal](#tab/azure-portal/defaultdomain)

TODO: azure portal instructions for default domain

### [Powershell](#tab/azure-powershell/customdomain)

TODO: powershell for custom domain

1. Under **HTTP Settings**, select the existing HTTP setting.
2. Under **Override with new host name**, select **Yes**.
3. Under **Host name override**, select **Pick host name from backend target**.
4. Select **Save**.

   :::image type="content" source="./media/configure-web-app-portal/http-settings.png" alt-text="Pick host name from backend http settings":::

### [Powershell](#tab/azure-powershell/defaultdomain)

TODO: powershell for default domain

---

## Additional configuration in case of redirection to app service's relative path

When the app service sends a redirection response to the client to redirect to its relative path (For example, a redirect from `contoso.azurewebsites.net/path1` to `contoso.azurewebsites.net/path2`), it uses the same hostname in the location header of its response as the one in the request it received from the application gateway. So the client will make the request directly to `contoso.azurewebsites.net/path2` instead of going through the application gateway (`contoso.com/path2`). Bypassing the application gateway isn't desirable.

If in your use case, there are scenarios where the App service will need to send a redirection response to the client, perform the [additional steps to rewrite the location header](./troubleshoot-app-service-redirection-app-service-url.md#sample-configuration).

## Restrict access

The web apps deployed in these examples use public IP addresses that can be  accessed directly from the Internet. This helps with troubleshooting when you are learning about a new feature and trying new things. But if you intend to deploy a feature into production, you'll want to add more restrictions.

One way you can restrict access to your web apps is to use [Azure App Service static IP restrictions](../app-service/app-service-ip-restrictions.md). For example, you can restrict the web app so that it only receives traffic from the application gateway. Use the app service IP restriction feature to list the application gateway VIP as the only address with access.

## Next steps

To learn more about the App service and other multi-tenant support with application gateway, see [multi-tenant service support with application gateway](./application-gateway-web-app-overview.md).
