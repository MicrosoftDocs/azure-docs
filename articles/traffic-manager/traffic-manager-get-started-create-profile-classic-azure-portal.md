<properties 
   pageTitle="Create a Traffic Manager profile using the preview portal in the classic deployment model | Microsoft Azure"
   description="Learn how to create an Traffic Manager profile using the preview portal in the classic deployment model"
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
   ms.date="12/14/2015"
   ms.author="joaoma" />

# Create a Traffic Manager profile (classic) using the Azure portal

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-classic-selectors-include.md](../../includes/traffic-manager-get-started-create-profile-classic-selectors-include.md)]

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-intro-include.md](../../includes/traffic-manager-get-started-create-profile-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)] [Resource Manager model](traffic-manager-get-started-create-profile-arm-preview-portal.md).

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-scenario-include.md](../../includes/traffic-manager-get-started-create-profile-scenario-include.md)]



## To create a new Traffic Manager profile

To create a traffic manager profile from the Azure portal, follow the steps below.

1. From a browser, navigate to http://portal.azure.com and, if necessary, sign in with your Azure account.

2. 1. **Log in to the Azure portal**. To create a new Traffic Manager profile, click New on the bottom left of the portal, click browse > Traffic Manager (classic) profile. It will redirect to the classic portal to continue the steps.

2. To create a new Traffic Manager profile, click **New** on the lower left of the portal, click **Network Services > Traffic Manager**, and then click **Quick Create** to begin configuring your profile.
3. **Configure the DNS prefix.** Give your traffic manager profile a unique DNS prefix name. You can specify only the prefix for a Traffic Manager domain name.
4. **Select the subscription.** Select the appropriate Azure subscription. Each profile is associated with a single subscription. If you only have one subscription, this option does not appear.
5. **Select the traffic routing method.** Select the traffic routing method in **traffic routing Policy**. For more information about traffic routing methods, see [About Traffic Manager traffic routing methods](traffic-manager-traffic-routing-methods.md).
6. **Click “Create” to create your new profile**. When the profile configuration is completed, you can locate your profile in the Traffic Manager pane in the Azure classic portal.
7. **Configure endpoints, monitoring, and additional settings in the Azure classic portal.** Because you can only configure basic settings by using Quick Create, it is necessary to configure additional settings, such as the list of endpoints and the endpoint failover order, in order to complete your desired configuration. 

## Next steps 

You need to [add endpoints](traffic-manager-get-started-create-endpoints-classic-portal.md) for the traffic manager profile. You can also [associate your company domain to a traffic manager profile](traffic-manager-point-internet-domain.md).