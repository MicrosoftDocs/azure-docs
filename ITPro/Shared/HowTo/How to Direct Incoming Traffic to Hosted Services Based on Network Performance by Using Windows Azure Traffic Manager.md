# How to Direct Incoming Traffic to Hosted Services Based on Network Performance by Using Windows Azure Traffic Manager #
[This topic contains preliminary content for the CTP release of [Windows Azure Traffic Manager](http://www.windowsazure.com/en-us/home/features/virtual-network/). To begin using the feature, go to the Virtual Network tab located in the [Windows Azure Management Portal](https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=11&ct=1337245802&rver=6.1.6195.0&wp=MBI_SSL&wreply=https:%2F%2Fwindows.azure.com%2Flanding%3Ftarget%3D%252fdefault.aspx&lc=1033&id=267163).]

The Windows Azure Traffic Manager (WATM) allows you to control the distribution of user traffic to Windows Azure hosted services. For more information see [Overview of Windows Azure Traffic Manager]().

In order to load balance hosted service that are located in different datacenters across the globe, you can direct incoming traffic to the closest hosted service. Although “closest” may directly correspond to geographic distance, it can also correspond to the location with the lowest latency to service the request. The Performance load balancing method will allow you to distribute based on location and latency, but cannot take into account real-time changes in network configuration or load. For more information on the different load balancing methods that Windows Azure Traffic Manager provides, see [Load balancing methods in Windows Azure Traffic Manager]().

The following steps will walk you through the process:

1. **Deploy your hosted services** into your production environment. See [Creating a Hosted Service for Windows Azure](http://msdn.microsoft.com/en-us/library/windowsazure/gg432967.aspx). Also refer to [Best practices for hosted services and policies when using Windows Azure Traffic Manager]() which discusses important information on hosted services included in a Traffic Manager policy.

2. **Log into the Traffic Manager area in the Management Portal.** The Windows Azure Platform Management Portal is at [http://windows.azure.com](http://windows.azure.com). Traffic Manager can be accessed by clicking on **Virtual Network** in the lower left of the portal pages and then choosing **Traffic Manager** from the options in the left pane.

3. **Choose Policies and click "Create".** Choose the folder **Policies** from the left navigation tree to enable **Create** in the top toolbar. Choose **Create**. The **Create Traffic Manager policy** dialog will appear. 
![Create button for policies](Media\Create_button_for_policies)
**Figure 1** – Create button for policies

4. **Choose a subscription.** Policies and domains are associated with single subscription. 

5. **Pick the Performance load balance method.** For more information about the load balancing methods that are available in Traffic Manager, see [Load balancing methods in Windows Azure Traffic Manager]().

6. **Find hosted services and add them to the policy.** Use the filter box to find hosted services that contain the string you type into the box. Clear the box to display all hosted services in production for the subscription you selected in step 4. Use the arrow buttons to add them to the policy. The order in the **Selected DNS names** does not matter for this load balancing method.

7. **Set up monitoring.** Monitoring insures that hosted services that are offline are not sent traffic. You must have a specific path and filename set up. 
See [Monitoring hosted services in Windows Azure Traffic Manager]() for more information on the monitoring process.

8. **Name your Traffic Manager domain.** Give your domain a unique name. You can only specify the prefix for your domain. Leave the **DNS time to live (TTL)** at its default time. 
For more information about the effect of this setting, see [Best practices for hosted services and policies when using Windows Azure Traffic Manager](). 
The **Create Traffic Manager policy** dialog box should look something like the example below. 
![Dialog box for Performance load balancing method](Media\Dialog_box_for_Performance_load_balancing_method)
**Figure 2** – Dialog box for Performance load balancing method

9. **Test the Traffic Manager domain and policy.** For more information about testing, see [How to Test a Windows Azure Traffic Manager Policy]().

10. **Point your DNS Server to the Traffic Manager domain.** Once your Traffic Manager Domain is setup and working, edit the DNS record on your authoritative DNS server to point your company domain to the Traffic Manager domain. 
For example, the following command routes all traffic going to **www.contoso.com** to the Traffic Manager domain **contoso.trafficmanager.net**. 
``www.contoso.com IN CNAME contoso.trafficmanager.net``
For more information, see [How to Point a Company Internet Domain to a Windows Azure Traffic Manager Domain]().

[0]: ..\Media\Create_button_for_policies.png

[1]: ..\Media\Dialog_box_for_Performance_load_balancing_method.png










