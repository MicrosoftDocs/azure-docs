<properties 
   pageTitle="Create a Traffic Manager profile using the preview portal in Resource Manager | Microsoft Azure"
   description="Learn how to create an Traffic Manager profile using the preview portal in Resource Manager"
   services="traffic-manager"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="12/14/2015"
   ms.author="joaoma" />

# Create a Traffic Manager profile using the preview portal

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-arm-selectors-include.md](../../includes/traffic-manager-get-started-create-profile-arm-selectors-include.md)]
<BR>
[AZURE.INCLUDE [traffic-manager-get-started-create-profile-intro-include.md](../../includes/traffic-manager-get-started-create-profile-intro-include.md)]
<BR>
[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](traffic-manager-get-started-create-profile-classic-azure-portal.md).
<BR>
[AZURE.INCLUDE [traffic-manager-get-started-create-profile-scenario-include.md](../../includes/traffic-manager-get-started-create-profile-scenario-include.md)]

## Create a Traffic Manager profile using Azure portal

Deploy your cloud services and websites to your production environment. For more information about cloud services, see Cloud Services. For information about cloud services, see Best practices. For more information about websites, see Websites.


1. **Log in to the Azure portal**. To create a new Traffic Manager profile, click New on the top left of the portal, click Networking > Traffic Manager profile. It will open a blade to create a Traffic Manager profile.

2. **Configure name and DNS prefix**. Give your traffic manager profile a unique DNS prefix name. You can specify only the prefix for a Traffic Manager domain name.
Select the subscription. Select the appropriate Azure subscription. Each profile is associated with a single subscription.

3. **Select the traffic routing method**. Select the traffic routing method in traffic routing Policy. 
4. **Choose a resource group**. Select or create a new resource group for the Traffic Manager profile.
 
5. **Pick a location**. Select a region where the resource will be created. Keep in mind that traffic manager is a global resource.
6. **Click “Create” to create your new profile**. When the profile configuration is completed, you can locate your profile in the Traffic Manager pane in the Azure portal.

4. **Configure endpoints, monitoring, and additional settings in the Azure portal**. Locate your new traffic manager profile and click in all settings. You will have to complete other steps such as adding endpoints and monitoring for your traffic manager profile.

## Next steps
 
You need to [add endpoints](traffic-manager-get-started-create-endpoint-arm-portal.md) for the traffic manager profile. You can also [associate your company domain to a traffic manager profile](traffic-manager-point-internet-domain.md).
