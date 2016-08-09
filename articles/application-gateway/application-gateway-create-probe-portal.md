<properties
   pageTitle="Create a custom probe for an application gateway by using the portal | Microsoft Azure"
   description="Learn how to create a custom probe for Application Gateway by using the Azure Portal"
   services="application-gateway"
   documentationCenter="na"
   authors="georgewallace"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/03/2016"
   ms.author="gwallace" />

# Create a custom probe for Application Gateway by using the portal

> [AZURE.SELECTOR]
- [Azure Portal](application-gateway-create-probe-portal.md)
- [Azure Resource Manager PowerShell](application-gateway-create-probe-ps.md)
- [Azure Classic PowerShell](application-gateway-create-probe-classic-ps.md)

<BR>

[AZURE.INCLUDE [azure-probe-intro-include](../../includes/application-gateway-create-probe-intro-include.md)]

## Scenario

The following scenario will go through creating a custom health probe in an existing application gateway.
The scenario assumes that you have already followed the steps to [Create an Application Gateway](application-gateway-create-gateway-portal.md).

## <a name="createprobe"></a>Create the probe

Probes are configured in a two-step process through the portal. The first step is to create the probe, next you will add the probe to the backend http settings of the application gateway.

### Step 1

Navigate to http://portal.azure.com and select an existing application gateway.

![Application Gateway overview][1]

### Step 2

Click **Probes** and click the **Add** button to add a new probe.

![Add Probe blade with information filled out][2]

### Step 3

Fill out the required information for the probe and when complete click **OK**.

- **Name** - This is a friendly name to the probe that will be accessible in the portal.
- **Host** - This is the host name that will put used for the probe.
- **Path** - The remainder of the full url for the custom probe.
- **Interval (secs)** - How often the probe will be run to check for health.
- **Timeout (secs)** - The amount of time the probe will wait before timing out.
- **Unhealthy threshold** - Number of failed attempts to be considered unhealthy.

![probe configuration settings][3]

## Add probe to the gateway

Now that the probe has been created, it is time to add it to the gateway. Probe settings are set on the backend http settings of the application gateway.

### Step 1

Click on the **HTTP settings** of the application gateway, and then click on the current backend http settings in the window to bring up the configuration blade.

![https settings window][4]

### Step 2

On the **appGatewayBackEndHttp** settings blade, click **Use custom probe** and choose the probe created in the [Create the probe](#createprobe) section.
When complete, click **OK** and the settings will be applied.

![appgatewaybackend settings blade][5]

The default probe checks the default access to the web application. Now that a custom probe has been created, the application gateway will use the custom path defined to monitor health for the backend selected. Based on the criteria that was defined, the application gateway will check the file
specified in the probe. If this path is not accessible within the defined threshold the backend with the error will be taken out of the load balancing. The probe will continue to run and if the backend that returned an error is healthy it will be available for traffic while it stays healthy.

## Next steps

To learn how to configure SSL Offloading with Azure Application Gateway see [Configure SSL Offload](application-gateway-ssl-portal.md)

[1]: ./media/application-gateway-create-probe-portal/figure1.png
[2]: ./media/application-gateway-create-probe-portal/figure2.png
[3]: ./media/application-gateway-create-probe-portal/figure3.png
[4]: ./media/application-gateway-create-probe-portal/figure4.png
[5]: ./media/application-gateway-create-probe-portal/figure5.png