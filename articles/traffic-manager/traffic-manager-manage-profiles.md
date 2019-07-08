---
title: Manage Azure Traffic Manager profiles | Microsoft Docs
description: This article helps you create, disable, enable, and delete an Azure Traffic Manager profile.
services: traffic-manager
documentationcenter: ''
author: asudbring
ms.service: traffic-manager
manager: twooley
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/10/2017
ms.author: allensu
---

# Manage an Azure Traffic Manager profile

Traffic Manager profiles use traffic-routing methods to control the distribution of traffic to your cloud services or website endpoints. This article explains how to create and manage these profiles.

## Create a Traffic Manager profile

You can create a Traffic Manager profile by using the Azure portal. After creating your profile, you can configure endpoints, monitoring, and other settings in the Azure portal. Traffic Manager supports up to 200 endpoints per profile. However, most usage scenarios require only a few of endpoints.

### To create a Traffic Manager profile

1. From a browser, sign in to the [Azure portal](https://portal.azure.com). If you don’t already have an account, you can sign up for a [free one-month trial](https://azure.microsoft.com/free/). 
2. Click **Create a resource** > **Networking** > **Traffic Manager profile** > **Create**.
4. In the **Create Traffic Manager profile**, complete as follows:
    1. In **Name**, provide a name for your profile. This name needs to be unique within the trafficmanager.net zone and results in the DNS name `<name>`, trafficmanager.net, that is used to access your Traffic Manager profile.
    2. In **Routing method**, select the **Priority** routing method.
    3. In **Subscription**, select the subscription you want to create this profile under
    4. In **Resource Group**, create a new resource group to place this profile under.
    5. In **Resource group location**, select the location of the resource group. This setting refers to the location of the resource group, and has no impact on the Traffic Manager profile that will be deployed globally.
    6. Click **Create**.
    7. When the global deployment of your Traffic Manager profile is complete, it is listed in respective resource group as one of the resources.

## Disable, enable, or delete a profile

You can disable an existing profile so that Traffic Manager does not refer user requests to the configured endpoints. When you disable a Traffic Manager profile, the profile and the information contained in the profile remain intact and can be edited in the Traffic Manager interface.  Referrals resume when you re-enable the profile. When you create a Traffic Manager profile in the Azure portal, it's automatically enabled. If you decide a profile is no longer necessary, you can delete it.

### To disable a profile

1. If you are using a custom domain name, change the CNAME record on your Internet DNS server so that it no longer points to your Traffic Manager profile.
2. Traffic stops being directed to the endpoints through the Traffic Manager profile settings.
3. From a browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the portal’s search bar, search for the **Traffic Manager profile** name that you want to modify, and then click the Traffic Manager profile in the results that the displayed.
3. Click **Overview** > **Disable**.
4. Confirm to disable the Traffic Manager profile.

### To enable a profile

1. From a browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the portal’s search bar, search for the **Traffic Manager profile** name that you want to modify, and then click the Traffic Manager profile in the results that the displayed.
3. Click **Overview** > **Enable**.
1. If you are using a custom domain name, create a CNAME resource record on your Internet DNS server to point to the domain name of your Traffic Manager profile.
2. Traffic is directed to the endpoints again.

### To delete a profile

1. Ensure that the DNS resource record on your Internet DNS server no longer uses a CNAME resource record that points to the domain name of your Traffic Manager profile.
2. In the portal’s search bar, search for the **Traffic Manager profile** name that you want to modify, and then click the Traffic Manager profile in the results that the displayed.
3. Click **Overview** > **Delete**.
4. Confirm to delete the Traffic Manager profile.

## Next steps

* [Add an endpoint](traffic-manager-endpoints.md)
* [Configure Priority routing method](traffic-manager-configure-priority-routing-method.md)
* [Configure Geographic routing method](traffic-manager-configure-geographic-routing-method.md) 
* [Configure Weighted routing method](traffic-manager-configure-weighted-routing-method.md)
* [Configure Performance routing method](traffic-manager-configure-performance-routing-method.md)
