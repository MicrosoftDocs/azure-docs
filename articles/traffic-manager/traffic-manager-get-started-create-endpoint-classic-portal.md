<properties 
   pageTitle="Create an endpoint for Traffic Manager using the Azure portal in the classic deployment model | Microsoft Azure"
   description="Learn how to create an endpoint for Traffic Manager using the Azure portal in the classic deployment model"
   services="traffic-manager"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-service-management"
/>
<tags  
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="01/20/2016"
   ms.author="joaoma" />

# Create an endpoint for Traffic Manager (classic) using the Azure classic portal

[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-classic-selectors-include.md](../../includes/traffic-manager-get-started-create-endpoint-classic-selectors-include.md)]
<BR>
[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-intro-include.md](../../includes/traffic-manager-get-started-create-endpoint-intro-include.md)]
<BR>
[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)] [Resource Manager model](traffic-manager-get-started-create-endpoint-portal.md).
<BR>
[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-scenario-include.md](../../includes/traffic-manager-get-started-create-endpoint-scenario-include.md)]

## To add endpoints using the azure classic portal

1. On the Traffic Manager pane in the Azure classic portal, locate the Traffic Manager profile that contains the endpoint settings that you want to modify, and then click the arrow to the right of the profile name. This will open the settings page for the profile.
2. At the top of the page, click **Endpoints** to view the endpoints that are already part of your configuration.
3. At the bottom of the page, click **Add** to access the **Add Service Endpoints** page. By default, the page lists the cloud services under **Service Endpoints**.
4. For cloud services, select the cloud services in the list to enable them as endpoints for this profile. Clearing the cloud service name removes it from the list of endpoints.
5. For websites, click the **Service Type** drop-down list, and then select **Web app**.
6. Select the websites in the list to add them as endpoints for this profile. Clearing the website name removes it from the list of endpoints. Note that you can only select a single website per Azure datacenter (also known as a region). If you select a website in a datacenter that hosts multiple websites, when you select the first website, the others in the same datacenter become unavailable for selection. Also note that only Standard websites are listed.
7. After you select the endpoints for this profile, click the checkmark on the lower right to save your changes.

>[AZURE.NOTE] If you are using the *Failover* traffic routing method, after you add or remove an endpoint, be sure to adjust the Failover Priority List on the Configuration page to reflect the failover order you want for your configuration. For more information, see [Configure Failover traffic routing](traffic-manager-configure-failover-load-balancing.md).


## Next steps

After configuring endpoints for your traffic manager profile, you have to [create a CNAME record to point your Internet domain to Traffic Manager](traffic-manager-point-internet-domain.md). This step will resolve your DNS record to your traffic manager resource. 

