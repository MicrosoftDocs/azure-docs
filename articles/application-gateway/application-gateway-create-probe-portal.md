---
title: Create a custom probe for an application gateway by using the portal | Microsoft Docs
description: Learn how to create a custom probe for Application Gateway by using the portal
services: application-gateway
documentationcenter: na
author: georgewallace
manager: carmonm
editor: ''
tags: azure-resource-manager

ms.assetid: 33fd5564-43a7-4c54-a9ec-b1235f661f97
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/25/2016
ms.author: gwallace

---
# Create a custom probe for Application Gateway by using the portal
> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-probe-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-probe-ps.md)
> * [Azure Classic PowerShell](application-gateway-create-probe-classic-ps.md)
> 
> 

[!INCLUDE [azure-probe-intro-include](../../includes/application-gateway-create-probe-intro-include.md)]

## Scenario
The following scenario goes through creating a custom health probe in an existing application gateway.
The scenario assumes that you have already followed the steps to [Create an Application Gateway](application-gateway-create-gateway-portal.md).

## <a name="createprobe"></a>Create the probe
Probes are configured in a two-step process through the portal. The first step is to create the probe, next you add the probe to the backend http settings of the application gateway.

### Step 1
Navigate to http://portal.azure.com and select an existing application gateway.

![Application Gateway overview][1]

### Step 2
Click **Probes** and click the **Add** button to add a new probe.

![Add Probe blade with information filled out][2]

### Step 3
Fill out the required information for the probe and when complete click **OK**.

* **Name** - This is a friendly name to the probe that is accessible in the portal.
* **Host** - This is the host name that is used for the probe. Applicable only when multi-site is configured on Application Gateway, otherwise use '127.0.0.1'. This is different from VM host name.
* **Path** - The remainder of the full url for the custom probe. A valid path starts with '/'
* **Interval (secs)** - How often the probe is run to check for health. It is not recommended to set the lower than 30 seconds.
* **Timeout (secs)** - The amount of time the probe waits before timing out. The timeout interval needs to be high enough that an http call can be made to ensure the backend health page is available.
* **Unhealthy threshold** - Number of failed attempts to be considered unhealthy. A threshold of 0 means that if a health check fails the back-end will be determined unhealthy immediately.

> [!IMPORTANT]
> the host name is not the server name. This is the name of the virtual host running on the application server. The probe is sent to http://(host name):(port from httpsetting)/urlPath
> 
> 

![probe configuration settings][3]

## Add probe to the gateway
Now that the probe has been created, it is time to add it to the gateway. Probe settings are set on the backend http settings of the application gateway.

### Step 1
Click the **HTTP settings** of the application gateway, and then click the current backend http settings in the window to bring up the configuration blade.

![https settings window][4]

### Step 2
On the **appGatewayBackEndHttp** settings blade, click **Use custom probe** and choose the probe created in the [Create the probe](#createprobe) section.
When complete, click **OK** and the settings are applied.

![appgatewaybackend settings blade][5]

The default probe checks the default access to the web application. Now that a custom probe has been created, the application gateway uses the custom path defined to monitor health for the backend selected. Based on the criteria that was defined, the application gateway checks the file
specified in the probe. If the call to host:Port/path does not return an Http 200 OK status response, the server is taken out of rotation, after the unhealthy threshold is reached. Probing continues on the unhealthy instance to determine when it becomes healthy again. Once the instance is added back to healthy server pool traffic begins flowing to it again and probing to the instance continues at user specified interval as normal.

## Next steps
To learn how to configure SSL Offloading with Azure Application Gateway see [Configure SSL Offload](application-gateway-ssl-portal.md)

[1]: ./media/application-gateway-create-probe-portal/figure1.png
[2]: ./media/application-gateway-create-probe-portal/figure2.png
[3]: ./media/application-gateway-create-probe-portal/figure3.png
[4]: ./media/application-gateway-create-probe-portal/figure4.png
[5]: ./media/application-gateway-create-probe-portal/figure5.png
