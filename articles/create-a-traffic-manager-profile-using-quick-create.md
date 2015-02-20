<tags 
   pageTitle="Create a Traffic Manager profile using quick create"
   description="How to create a Traffic Manager profile"
   services="traffic-manager"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="traffic-manager"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.date="02/20/2015"
   ms.author="cherylmc" />

# Create a Traffic Manager Profile Using Quick Create

You can quickly create a Traffic Manager profile by using **Quick Create** in the Management Portal. Quick Create allows you to create profiles with basic configuration settings. However, you cannot use Quick Create for settings such as the set of endpoints (cloud services and websites), the failover order for the failover load balancing method, or monitoring settings. After creating your profile, you can configure these settings in the Management Portal. See 
[Traffic Manager Configuration Tasks](https://msdn.microsoft.com/en-us/library/azure/hh744830.aspx) for a list of configuration procedures.


## To create a new Traffic Manager profile:

1-**Deploy your cloud services and websites to your production environment.** For more information about cloud services, see 
[Cloud Services](http://go.microsoft.com/fwlink/p/?LinkId=314074). For information about cloud services, see 
[Best practices](https://msdn.microsoft.com/en-us/library/azure/5229dd1c-5a91-4869-8522-bed8597d9cf5#bkmk_TrafficManagerBestPracticesProfile). For more information about websites, see 
[Websites](http://go.microsoft.com/fwlink/p/?LinkId=393327).

2-**Log into the Management Portal.** To create a new Traffic Manager profile, click **New** on the lower left of the portal, click **Network Services**, click **Traffic Manager**, then click **Quick Create** to begin configuring your profile.

3-**Configure the DNS prefix.** Give your traffic manager profile a unique DNS prefix name. You can specify only the prefix for a Traffic Manager domain name.

4-**Select the subscription.** Select the appropriate Azure subscription. Each profile is associated with a single subscription. If you only have one subscription, this option does not appear.

5-**Select the load balancing method.** Select the load balancing method in **Load Balancing Policy**. For more information about load balancing methods, see [About Traffic Manager Load Balancing Methods](../about-traffic-manager-load-balancing-methods)
.

6-**Click “Create” to create your new profile**. When the profile configuration has completed, you can locate your profile in the Traffic Manager pane in the Management Portal.

7-**Configure endpoints, monitoring, and additional settings in the Management Portal.** Because you can only configure basic settings by using Quick Create, it is necessary to configure additional settings, such as the list of endpoints and the endpoint failover order, in order to complete your desired configuration. See [Traffic Manager Configuration Tasks](https://msdn.microsoft.com/en-us/library/azure/hh744830.aspx)
 for a list of procedures to help you complete the configuration.

## See Also

[Add or Delete Endpoints](../add-or-delete-endpoint)

[About Traffic Manager Load Balancing Methods](../about-traffic-manager-load-balancing-methods)