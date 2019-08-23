---
title: Create a custom probe - Azure Application Gateway - Azure Portal | Microsoft Docs
description: Learn how to create a custom probe for Application Gateway by using the portal
services: application-gateway
documentationcenter: na
author: vhorne
manager: jpconnock
editor: ''
tags: azure-resource-manager

ms.assetid: 33fd5564-43a7-4c54-a9ec-b1235f661f97
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/26/2017
ms.author: victorh

---
# Create a custom probe for Application Gateway by using the portal

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-probe-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-probe-ps.md)
> * [Azure Classic PowerShell](application-gateway-create-probe-classic-ps.md)

In this article, you add a custom probe to an existing application gateway through the Azure portal. Custom probes are useful for applications that have a specific health check page or for applications that do not provide a successful response on the default web application.

## Before you begin

If you do not already have an application gateway, visit [Create an Application Gateway](application-gateway-create-gateway-portal.md) to create an application gateway to work with.

## <a name="createprobe"></a>Create the probe

Probes are configured in a two-step process through the portal. The first step is to create the probe. In the second step, you add the probe to the backend http settings of the application gateway.

1. Log in to the [Azure portal](https://portal.azure.com). If you don't already have an account, you can sign up for a [free one-month trial](https://azure.microsoft.com/free)

1. In the Azure portal Favorites pane, click All resources. Click the application gateway in the All resources blade. If the subscription you selected already has several resources in it, you can enter partners.contoso.net in the Filter by name… box to easily access the application gateway.

1. Click **Probes** and click the **Add** button to add a probe.

   ![Add Probe blade with information filled out][1]

1. On the **Add health probe** blade, fill out the required information for the probe, and when complete click **OK**.

   |**Setting** | **Value** | **Details**|
   |---|---|---|
   |**Name**|customProbe|This value is a friendly name to the probe that is accessible in the portal.|
   |**Protocol**|HTTP or HTTPS | The protocol that the health probe uses.|
   |**Host**|i.e contoso.com|This value is the host name that is used for the probe. Applicable only when multi-site is configured on Application Gateway, otherwise use '127.0.0.1'. This value is different from the VM host name.|
   |**Path**|/ or another path|The remainder of the full url for the custom probe. A valid path starts with '/'. For the default path of http:\//contoso.com just use '/' |
   |**Interval (secs)**|30|How often the probe is run to check for health. It is not recommended to set the lower than 30 seconds.|
   |**Timeout (secs)**|30|The amount of time the probe waits before timing out. The timeout interval needs to be high enough that an http call can be made to ensure the backend health page is available.|
   |**Unhealthy threshold**|3|Number of failed attempts to be considered unhealthy. A threshold of 0 means that if a health check fails the back-end is determined unhealthy immediately.|

   > [!IMPORTANT]
   > The host name is not the same as server name. This value is the name of the virtual host running on the application server. The probe is sent to http://(host name):(port from httpsetting)/urlPath

## Add probe to the gateway

Now that the probe has been created, it is time to add it to the gateway. Probe settings are set on the backend http settings of the application gateway.

1. Click **HTTP settings** on the application gateway, to bring up the configuration blade click the current backend http settings listed in the window.

   ![https settings window][2]

1. On the **appGatewayBackEndHttpSettings** settings blade, check the **Use custom probe** checkbox and choose the probe created in the [Create the probe](#createprobe) section on the **Custom probe** drop-down..
   When complete, click **Save** and the settings are applied.

The default probe checks the default access to the web application. Now that a custom probe has been created, the application gateway uses the custom path defined to monitor health for the backend servers. Based on the criteria that was defined, the application gateway checks the path specified in the probe. If the call to host:Port/path does not return an HTTP 200-399 status response, the server is taken out of rotation after the unhealthy threshold is reached. Probing continues on the unhealthy instance to determine when it becomes healthy again. Once the instance is added back to healthy server pool, traffic begins flowing to it again and probing to the instance continues at user specified interval as normal.

## Next steps

To learn how to configure SSL Offloading with Azure Application Gateway, see [Configure SSL Offload](application-gateway-ssl-portal.md)

[1]: ./media/application-gateway-create-probe-portal/figure1.png
[2]: ./media/application-gateway-create-probe-portal/figure2.png

