---
title: Manage Azure Traffic Manager profiles | Microsoft Docs
description: This article helps you create, disable, enable, delete, and view the history of a Azure Traffic Manager profile.
services: traffic-manager
documentationcenter: ''
author: kumudd
manager: timlt
editor: ''

ms.assetid: f06e0365-0a20-4d08-b7e1-e56025e64f66
ms.service: traffic-manager
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/09/2017
ms.author: kumud
---

# Manage an Azure Traffic Manager profile

Traffic Manager profiles use traffic-routing methods to control the distribution of traffic to your cloud services or website endpoints. This article explains how to create and manage these profiles.

## Create a Traffic Manager profile using Quick Create

You can quickly create a Traffic Manager profile by using Quick Create in the Azure portal. Quick Create allows you to create profiles with basic configuration settings. However, you cannot use Quick Create for settings such as the set of endpoints (cloud services and websites), the failover order for the failover traffic routing method, or monitoring settings. After creating your profile, you can configure these settings in the Azure portal. Traffic Manager supports up to 200 endpoints per profile. However, most usage scenarios require only a few of endpoints.

### To create a Traffic Manager profile

1. **Deploy your cloud services and websites to your production environment.** For more information about cloud services, see [Cloud Services](http://go.microsoft.com/fwlink/p/?LinkId=314074). For more information about websites, see [Websites](http://go.microsoft.com/fwlink/p/?LinkId=393327).
2. **Log in to the Azure portal.** Click **New** on the top left of the portal, click **Network Services >See all> Traffic Manager profile**, and then click **Create** to begin configuring your profile.
3. **Configure the DNS prefix.** Give your traffic manager profile a unique DNS prefix name. You can specify only the prefix for a Traffic Manager domain name.
4. **Select the subscription.** Select the appropriate Azure subscription. Each profile is associated with a single subscription. If you only have one subscription, this option does not appear.
5. **Select the traffic routing method.** Select the traffic routing method in **Routing method**. For more information about traffic routing methods, see [About Traffic Manager traffic routing methods](traffic-manager-routing-methods.md).
6. **Create a Resource group** Create a resource group for your Traffic Manager profile.
7. **Select Resource group location** Specify the location of the resource group for the Traffic Manager profile.
8. **Click "Create" to create the profile**. When the profile configuration is completed, you can locate your profile in the Traffic Manager pane in the Azure portal.
9. **Configure endpoints, monitoring, and additional settings in the Azure portal.** Using Quick Create only configures basic settings. It is necessary to configure additional settings such as the list of endpoints and the endpoint failover order.

## Disable, enable, or delete a profile

You can disable an existing profile so that Traffic Manager does not refer user requests to the configured endpoints. When you disable a Traffic Manager profile, the profile and the information contained in the profile remain intact and can be edited in the Traffic Manager interface.  Referrals resume when you re-enable the profile. When you create a Traffic Manager profile in the Azure classic portal, it's automatically enabled. If you decide a profile is no longer necessary, you can delete it.

### To disable a profile

1. If you are using a custom domain name, change the CNAME record on your Internet DNS server so that it no longer points to your Traffic Manager profile.
2. Traffic stops being directed to the endpoints through the Traffic Manager profile settings.
3. From a browser, sign in to the [Azure portal](http://portal.azure.com).
2. In the portal’s search bar, search for the **Traffic Manager profile** name that you want to modify, and then click the Traffic Manager profile in the results that the displayed.
3. In the **Traffic Manager profile** blade, click **Overview**, in the Overview blade click **Disable**, and then confirm to disable the Traffic Manager profile.

### To enable a profile

1. From a browser, sign in to the [Azure portal](http://portal.azure.com).
2. In the portal’s search bar, search for the **Traffic Manager profile** name that you want to modify, and then click the Traffic Manager profile in the results that the displayed.
3. In the **Traffic Manager profile** blade, click **Overview**, and then in the Overview blade click **Enable**.
5. If you are using a custom domain name, create a CNAME resource record on your Internet DNS server to point to the domain name of your Traffic Manager profile.
6. Traffic is directed to the endpoints again.

### To delete a profile

1. Ensure that the DNS resource record on your Internet DNS server no longer uses a CNAME resource record that points to the domain name of your Traffic Manager profile.
2. In the portal’s search bar, search for the **Traffic Manager profile** name that you want to modify, and then click the Traffic Manager profile in the results that the displayed.
3. In the **Traffic Manager profile** blade, click **Overview**, in the Overview blade click **Delete**, and then confirm to delete the Traffic Manager profile.

## Next steps

* [Add an endpoint](traffic-manager-endpoints.md)
* [Configure Priority routing method](traffic-manager-configure-priority-routing-method.md)
* [Configure Geographic routing method](traffic-manager-configure-geographic-routing-method.md) 
* [Configure Weighted routing method](traffic-manager-configure-weighted-routing-method.md)
* [Configure Performance routing method](traffic-manager-configure-performance-routing-method.md)
