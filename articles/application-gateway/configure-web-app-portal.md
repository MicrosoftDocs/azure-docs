---
title: Manage traffic to multi-tenant apps using the portal
titleSuffix: Azure Application Gateway
description: This article provides guidance on how to configure Azure App service web apps as members in backend pool on an existing or new application gateway.
services: application-gateway
author: surajmb
ms.service: application-gateway
ms.topic: how-to
ms.date: 01/02/2021
ms.author: victorh
---

# Configure App Service with Application Gateway

Since app service is a multi-tenant service instead of a dedicated deployment, it uses host header in the incoming request to resolve the request to the correct app service endpoint. Usually, the DNS name of the application, which in turn is the DNS name associated with the application gateway fronting the app service, is different from the domain name of the backend app service. Therefore, the host header in the original request received by the application gateway is not the same as the host name of the backend service. Because of this, unless the host header in the request from the application gateway to the backend is changed to the host name of the backend service, the multi-tenant backends are not able to resolve the request to the correct endpoint.

Application Gateway provides a switch called `Pick host name from backend target` which overrides the  host header in the request with the host name of the back-end when the request is routed from the Application Gateway to the backend. This capability enables support for multi-tenant back ends such as Azure app service and API management. 

In this article, you learn how to:

- Edit a backend pool and add an App Service to it
- Edit HTTP Settings with 'Pick Hostname' switch enabled

## Prerequisites

- Application gateway: Create an application gateway without a backend pool target. For more information, see [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](quick-create-portal.md)

- App service: If you don't have an existing App service, see [App service documentation](../app-service/index.yml).

## Add App service as backend pool

1. In the Azure portal, select your application gateway.

2. Under **Backend pools**, select the backend pool.

4. Under **Target type**, select **App Services**.

5. Under **Target** select your App Service.

   :::image type="content" source="./media/configure-web-app-portal/backend-pool.png" alt-text="App service backend":::
   
   > [!NOTE]
   > The dropdown only populates those app services which are in the same subscription as your Application Gateway. If you want to use an app service which is in a different subscription than the one in which the Application Gateway is, then instead of choosing **App Services** in the **Targets** dropdown, choose **IP address or hostname** option and enter the hostname (example. azurewebsites.net) of the app service.
1. Select **Save**.

## Edit HTTP settings for App Service

1. Under **HTTP Settings**, select the existing HTTP setting.

2. Under **Override with new host name**, select **Yes**.
3. Under **Host name override**, select **Pick host name from backend target**.
4. Select **Save**.

   :::image type="content" source="./media/configure-web-app-portal/http-settings.png" alt-text="Pick host name from backend http settings":::

## Additional configuration in case of redirection to app service's relative path

When the app service sends a redirection response to the client to redirect to its relative path (For example, a redirect from `contoso.azurewebsites.net/path1` to `contoso.azurewebsites.net/path2`), it uses the same hostname in the location header of its response as the one in the request it received from the application gateway. So the client will make the request directly to `contoso.azurewebsites.net/path2` instead of going through the application gateway (`contoso.com/path2`). Bypassing the application gateway isn't desirable.

If in your use case, there are scenarios where the App service will need to send a redirection response to the client, perform the [additional steps to rewrite the location header](./troubleshoot-app-service-redirection-app-service-url.md#sample-configuration).

## Restrict access

The web apps deployed in these examples use public IP addresses that can be  accessed directly from the Internet. This helps with troubleshooting when you are learning about a new feature and trying new things. But if you intend to deploy a feature into production, you'll want to add more restrictions.

One way you can restrict access to your web apps is to use [Azure App Service static IP restrictions](../app-service/app-service-ip-restrictions.md). For example, you can restrict the web app so that it only receives traffic from the application gateway. Use the app service IP restriction feature to list the application gateway VIP as the only address with access.

## Next steps

To learn more about the App service and other multi-tenant support with application gateway, see [multi-tenant service support with application gateway](./application-gateway-web-app-overview.md).
