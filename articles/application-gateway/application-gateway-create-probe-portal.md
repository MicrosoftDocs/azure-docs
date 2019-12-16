---
title: Create a custom probe using the portal
titleSuffix: Azure Application Gateway
description: Learn how to create a custom probe for Application Gateway by using the portal
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.date: 11/14/2019
ms.author: victorh
---

# Create a custom probe for Application Gateway by using the portal

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-probe-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-probe-ps.md)
> * [Azure Classic PowerShell](application-gateway-create-probe-classic-ps.md)

In this article, you add a custom health probe to an existing application gateway through the Azure portal. Using the health probes, Azure Application Gateway monitors the health of the resources in the back-end pool.

## Before you begin

If you do not already have an application gateway, visit [Create an Application Gateway](application-gateway-create-gateway-portal.md) to create an application gateway to work with.

## Create probe for Application Gateway v2 SKU

Probes are configured in a two-step process through the portal. The first step is to enter the values required for the probe configuration. In the second step, you test the backend health using this probe configuration and save the probe. 

### <a name="createprobe"></a>Enter probe properties

1. Sign in to the [Azure portal](https://portal.azure.com). If you don't already have an account, you can sign up for a [free one-month trial](https://azure.microsoft.com/free)

2. In the Azure portal Favorites pane, click All resources. Click the application gateway in the All resources blade. If the subscription you selected already has several resources in it, you can enter partners.contoso.net in the Filter by name… box to easily access the application gateway.

3. Select **Health probes** and then select **Add** to add a new health probe.

   ![Add new probe][4]

4. On the **Add health probe** page, fill out the required information for the probe, and when complete select **OK**.

   |**Setting** | **Value** | **Details**|
   |---|---|---|
   |**Name**|customProbe|This value is a friendly name given to the probe that is accessible in the portal.|
   |**Protocol**|HTTP or HTTPS | The protocol that the health probe uses. |
   |**Host**|i.e contoso.com|This value is the name of the virtual host (different from the VM host name) running on the application server. The probe is sent to (protocol)://(host name):(port from httpsetting)/urlPath.  This is applicable when multi-site is configured on Application Gateway. If the Application Gateway is configured for a single site, then enter '127.0.0.1'.|
   |**Pick host name from backend HTTP settings**|Yes or No|Sets the *host* header in the probe to the host name of the back-end resource in the back-end pool associated with the HTTP Setting to which this probe is associated to. Specially required in case of multi-tenant backends such as Azure app service. [Learn more](https://docs.microsoft.com/azure/application-gateway/configuration-overview#pick-host-name-from-back-end-address)|
   |**Path**|/ or another path|The remainder of the full url for the custom probe. A valid path starts with '/'. For the default path of http:\//contoso.com just use '/' |
   |**Interval (secs)**|30|How often the probe is run to check for health. It is not recommended to set the lower than 30 seconds.|
   |**Timeout (secs)**|30|The amount of time the probe waits before timing out. If a valid response is not received within this time-out period, the probe is marked as failed. The timeout interval needs to be high enough that an http call can be made to ensure the backend health page is available. Note that the time-out value should not be more than the ‘Interval’ value used in this probe setting or the ‘Request timeout’ value in the HTTP setting which will be associated with this probe.|
|**Unhealthy threshold**|3|Number of consecutive failed attempts to be considered unhealthy. The threshold can be set to 1 or more.|
   |**Use probe matching conditions**|Yes or No|By default, an HTTP(S) response with status code between 200 and 399 is considered healthy. You can change the acceptable range of backend response code or backend response body. [Learn more](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview#probe-matching)|
   |**HTTP Settings**|selection from dropdown|Probe will get associated with the HTTP setting(s) selected here and therefore, will monitor the health of that backend pool which is associated with the selected HTTP setting. It will use the same port for the probe request as the one being used in the selected HTTP setting. You can only choose those HTTP setting(s) which are not associated with any other custom probe. <br>Note that only those HTTP setting(s) are available for association which have the same protocol as the protocol chosen in this probe configuration and have the same state for the *Pick Host Name From Backend HTTP setting* switch.|
   
   > [!IMPORTANT]
   > The probe will monitor health of the backend only when it is associated with one or more HTTP Setting(s). It will monitor back-end resources of those back-end pools which are associated to the HTTP setting(s) to which this probe is associated with. The probe request will be sent to http://(host name):(port from httpsetting)/urlPath.

### Test backend health with the probe

After entering the probe properties, you can test the health of the back-end resources to verify that the probe configuration is correct and that the back-end resources are working as expected.

1. Select **Test** and note the result of the probe. The Application gateway tests the health of all the backend resources in the backend pools associated with the HTTP Setting(s) used for this probe. 

   ![Test backend health][5]

2. If there are any unhealthy backend resources, then check the **Details** column to understand the reason for unhealthy state of the resource. If the resource has been marked unhealthy due to an incorrect probe configuration, then select the **Go back to probe** link and edit the probe configuration. Otherwise, if the resource has been marked unhealthy due to an issue with the backend, then resolve the issues with the backend resource and then test the backend again by selecting the **Go back to probe** link and select **Test**.

   > [!NOTE]
   > You can choose to save the probe even with unhealthy backend resources, but it is not recommended. This is because the Application Gateway removes those backend resources from the backend pool which are determined to be unhealthy by the probe. In case there are no healthy resources in a backend pool, you will not be able to access your application and will get a 502 error.

   ![View probe result][6]

3. Select **Add** to save the probe. 

## Create probe for Application Gateway v1 SKU

Probes are configured in a two-step process through the portal. The first step is to create the probe. In the second step, you add the probe to the backend http settings of the application gateway.

### <a name="createprobe"></a>Create the probe

1. Sign in to the [Azure portal](https://portal.azure.com). If you don't already have an account, you can sign up for a [free one-month trial](https://azure.microsoft.com/free)

2. In the Azure portal Favorites pane, select **All resources**. Select the application gateway in the **All resources** page. If the subscription you selected already has several resources in it, you can enter partners.contoso.net in the Filter by name… box to easily access the application gateway.

3. Select **Probes** and then select **Add** to add a probe.

   ![Add Probe blade with information filled out][1]

4. On the **Add health probe** blade, fill out the required information for the probe, and when complete select **OK**.

   |**Setting** | **Value** | **Details**|
   |---|---|---|
   |**Name**|customProbe|This value is a friendly name given to the probe that is accessible in the portal.|
   |**Protocol**|HTTP or HTTPS | The protocol that the health probe uses. |
   |**Host**|i.e contoso.com|This value is the name of the virtual host (different from the VM host name) running on the application server. The probe is sent to (protocol)://(host name):(port from httpsetting)/urlPath.  This is applicable when multi-site is configured on Application Gateway. If the Application Gateway is configured for a single site, then enter '127.0.0.1'.|
   |**Pick host name from backend HTTP settings**|Yes or No|Sets the *host* header in the probe to the host name of the back-end resource in the back-end pool associated with the HTTP Setting to which this probe is associated to. Specially required in case of multi-tenant backends such as Azure app service. [Learn more](https://docs.microsoft.com/azure/application-gateway/configuration-overview#pick-host-name-from-back-end-address)|
   |**Path**|/ or another path|The remainder of the full url for the custom probe. A valid path starts with '/'. For the default path of http:\//contoso.com just use '/' |
   |**Interval (secs)**|30|How often the probe is run to check for health. It is not recommended to set the lower than 30 seconds.|
   |**Timeout (secs)**|30|The amount of time the probe waits before timing out. If a valid response is not received within this time-out period, the probe is marked as failed. The timeout interval needs to be high enough that an http call can be made to ensure the backend health page is available. Note that the time-out value should not be more than the ‘Interval’ value used in this probe setting or the ‘Request timeout’ value in the HTTP setting which will be associated with this probe.|
|**Unhealthy threshold**|3|Number of consecutive failed attempts to be considered unhealthy. The threshold can be set to 1 or more.|
   |**Use probe matching conditions**|Yes or No|By default, an HTTP(S) response with status code between 200 and 399 is considered healthy. You can change the acceptable range of backend response code or backend response body. [Learn more](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview#probe-matching)|

   > [!IMPORTANT]
   > The host name is not the same as server name. This value is the name of the virtual host running on the application server. The probe is sent to http://(host name):(port from httpsetting)/urlPath

### Add probe to the gateway

Now that the probe has been created, it is time to add it to the gateway. Probe settings are set on the backend http settings of the application gateway.

1. Click **HTTP settings** on the application gateway, to bring up the configuration blade click the current backend http settings listed in the window.

   ![https settings window][2]

2. On the **appGatewayBackEndHttpSettings** settings page, check the **Use custom probe** checkbox and choose the probe created in the [Create the probe](#createprobe) section on the **Custom probe** drop-down.
   When complete, click **Save** and the settings are applied.

## Next steps

View the health of the backend resources as determined by the probe using the [backend health view](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics#back-end-health).

[1]: ./media/application-gateway-create-probe-portal/figure1.png
[2]: ./media/application-gateway-create-probe-portal/figure2.png
[4]: ./media/application-gateway-create-probe-portal/figure4.png
[5]: ./media/application-gateway-create-probe-portal/figure5.png
[6]: ./media/application-gateway-create-probe-portal/figure6.png
