<properties
    pageTitle="Manage Azure Traffic Manager profiles | Microsoft Azure"
    description="This article helps you create, disable, enable, delete, and view the history of a Azure Traffic Manager profile."
    services="traffic-manager"
    documentationCenter=""
    authors="sdwheeler"
    manager="carmonm"
    editor=""
/>
<tags
    ms.service="traffic-manager"
    ms.devlang="na"
    ms.topic="hero-article"
    ms.tgt_pltfrm="na"
    ms.workload="infrastructure-services"
    ms.date="10/11/2016"
    ms.author="sewhee"
/>

# Manage an Azure Traffic Manager profile

Traffic Manager profiles use traffic-routing methods to control the distribution of traffic to your cloud services or website endpoints. This article explains how to create and manage these profiles.

## Create a Traffic Manager profile using Quick Create

You can quickly create a Traffic Manager profile by using Quick Create in the Azure classic portal. Quick Create allows you to create profiles with basic configuration settings. However, you cannot use Quick Create for settings such as the set of endpoints (cloud services and websites), the failover order for the failover traffic routing method, or monitoring settings. After creating your profile, you can configure these settings in the Azure classic portal. Traffic Manager supports up to 200 endpoints per profile. However, most usage scenarios require only a few of endpoints.

### To create a Traffic Manager profile

1. **Deploy your cloud services and websites to your production environment.** For more information about cloud services, see [Cloud Services](http://go.microsoft.com/fwlink/p/?LinkId=314074). For more information about websites, see [Websites](http://go.microsoft.com/fwlink/p/?LinkId=393327).

2. **Log in to the Azure classic portal.** Click **New** on the lower left of the portal, click **Network Services > Traffic Manager**, and then click **Quick Create** to begin configuring your profile.
3. **Configure the DNS prefix.** Give your traffic manager profile a unique DNS prefix name. You can specify only the prefix for a Traffic Manager domain name.
4. **Select the subscription.** Select the appropriate Azure subscription. Each profile is associated with a single subscription. If you only have one subscription, this option does not appear.
5. **Select the traffic routing method.** Select the traffic routing method in **traffic routing Policy**. For more information about traffic routing methods, see [About Traffic Manager traffic routing methods](traffic-manager-routing-methods.md).
6. **Click "Create" to create the profile**. When the profile configuration is completed, you can locate your profile in the Traffic Manager pane in the Azure classic portal.
7. **Configure endpoints, monitoring, and additional settings in the Azure classic portal.** Using Quick Create only configures basic settings. It is necessary to configure additional settings such as the list of endpoints and the endpoint failover order.


## Disable, enable, or delete a profile

You can disable an existing profile so that Traffic Manager does not refer user requests to the configured endpoints. When you disable a Traffic Manager profile, the profile and the information contained in the profile remain intact and can be edited in the Traffic Manager interface.  Referrals resume when you re-enable the profile. When you create a Traffic Manager profile in the Azure classic portal, it's automatically enabled. If you decide a profile is no longer necessary, you can delete it.

### To disable a profile

1. If you are using a custom domain name, change the CNAME record on your Internet DNS server so that it no longer points to your Traffic Manager profile.
2. Traffic stops being directed to the endpoints through the Traffic Manager profile settings.
3. Select the profile that you want to disable. On the Traffic Manager page, highlight the profile by clicking the column next to the profile name. Note, clicking the name of the profile or the arrow next to the name opens the settings page for the profile.
4. After selecting the profile, click **Disable** at the bottom of the page.

### To enable a profile

1. Select the profile that you want to disable. On the Traffic Manager page, highlight the profile by clicking the column next to the profile name. Note, clicking the name of the profile or the arrow next to the name opens the settings page for the profile.
2. After selecting the profile, click **Enable** at the bottom of the page.
3. If you are using a custom domain name, create a CNAME resource record on your Internet DNS server to point to the domain name of your Traffic Manager profile.
4. Traffic is directed to the endpoints again.

### To delete a profile

1. Ensure that the DNS resource record on your Internet DNS server no longer uses a CNAME resource record that points to the domain name of your Traffic Manager profile.
2. Select the profile that you want to disable. On the Traffic Manager page, highlight the profile by clicking the column next to the profile name. Note, clicking the name of the profile or the arrow next to the name opens the settings page for the profile.
3. After selecting the profile, click **Delete** at the bottom of the page.

## View Traffic Manager profile change history

You can view the change history for your Traffic Manager profile in the Azure classic portal in Management Services.

### To view your Traffic Manager change history

1. In the left pane of the Azure classic portal, click **Management Services**.
2. On the Management Services page, click **Operation Logs**.
3. On the Operation Logs page, you can filter to view the change history for your Traffic Manager profile. After selecting your filtering options, click the checkmark to view the results.

   - To view the changes for all your profiles, select your subscription and time range and then select **Traffic Manager** from the **Type** shortcut menu.
   - To filter by profile name, type the name of the profile in the **Service Name** field or select it from the shortcut menu.
   - To view details for each individual change, select the row with the change that you want to view, and then click **Details** at the bottom of the page. In the **Operation Details** window, you can view the XML representation of the API object that was created or updated as part of the operation.

## Next steps

- [Add an endpoint](traffic-manager-endpoints.md)
- [Configure failover routing method](traffic-manager-configure-failover-routing-method.md)
- [Configure round robin routing method](traffic-manager-configure-round-robin-routing-method.md)
- [Configure performance routing method](traffic-manager-configure-performance-routing-method.md)
- [Point a company Internet domain to a Traffic Manager domain name](traffic-manager-point-internet-domain.md)
- [Troubleshooting Traffic Manager degraded state](traffic-manager-troubleshooting-degraded.md)