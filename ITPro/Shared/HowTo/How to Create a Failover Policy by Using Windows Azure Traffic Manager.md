# How to Create a Failover Policy by Using Windows Azure Traffic Manager #
[This topic contains preliminary content for the CTP release of [Windows Azure Traffic Manager](http://www.windowsazure.com/en-us/home/features/virtual-network/). To begin using the feature, go to the Virtual Network tab located in the [Windows Azure Management Portal](https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=11&ct=1337239257&rver=6.1.6195.0&wp=MBI_SSL&wreply=https:%2F%2Fwindows.azure.com%2Flanding%3Ftarget%3D%252fdefault.aspx&lc=1033&id=267163).]

The Windows Azure Traffic Manager allows you to control the distribution of user traffic to Windows Azure hosted services. For more information, see [Overview of Windows Azure Traffic Manager]().

Often an organization wants to provide reliability for its services. It does this by providing backup services in case their primary service goes down. A common pattern for service failover is to provide a set of identical hosted services and send traffic to a primary service, with a list of 1 or more backups. This article outlines the steps to set up a Traffic Manager policy to perform this type of failover backup.

For more information on the different load balancing methods that Windows Azure Traffic Manager provides, see [Load balancing methods in Windows Azure Traffic Manager]().

1. **Deploy your hosted services** into your production environment. See the Windows Azure MSDN documentation for information on developing and deploying [Windows Azure hosted services](http://msdn.microsoft.com/library/gg432967.aspx). Also refer to [Best practices for hosted services and policies when using Windows Azure Traffic Manager]() which discusses important information on hosted services included in a Traffic Manager policy. 

2. **Log into the Traffic Manager area in the Management Portal.** The Windows Azure Management Portal is at [http://windows.azure.com](http://windows.azure.com). Traffic Manager can be accessed by clicking on **Virtual Network** in the lower left of the portal pages and then choosing **Traffic Manager** from the options in the left pane.

3. **Choose Policies and click "Create".** Choose the folder **Policies** from the left navigation tree to enable **Create** in the top toolbar. Choose **Create**. The **Create Traffic Manager policy** dialog will appear.
![Create button for policies](Media\Create_button_for_policies)
**Figure 1** – Create button for policies

4. **Choose a subscription.** Policies and domains are associated with single subscription.

5. **Select the Failover Policy load balance method.** For more information about the load balancing methods that are available in Traffic Manager, see [Load balancing methods in Windows Azure Traffic Manager]().

6. **Find hosted services and add them to the policy.** Use the filter box to find hosted services that contain the string you type into the box. Clear the box to display all hosted services in production for the subscription you selected in step 4. Use the arrow buttons to add them to the policy. When you select the **Failover** load balancing method, the order of the selected services matters. The primary hosted service is on top. Use the up and down arrows change the order as needed.

7. Monitoring ensures that hosted services that are offline are not sent traffic. Using a failover policy without setting up monitoring is useless because traffic will be sent to the primary hosted service even if that hosted service is shown as offline. In order to monitor hosted services, you must specify a specific path and filename.
See [Monitoring hosted services in Windows Azure Traffic Manager]() for more information about the monitoring process.

8. **Name your Traffic Manager domain.** Give your domain a unique name. You can only specify the prefix for your domain. Leave the **DNS time to live (TTL)** at its default time.
See [Best practices for hosted services and policies when using Windows Azure Traffic Manager]() for more information about the effect of this setting. 
The **Create Traffic Manager policy** dialog box should look similar to the example below. 
![Dialog box for Failover load balancing method](Media\Dialog_box_for_Failover_load_balancing_method)
**Figure 2** – Dialog box for Failover load balancing method

9. **Test the Traffic Manager domain and policy.** See [How to Test a Windows Azure Traffic Manager Policy]() for more information. 

10. **Point your DNS Server to the Traffic Manager domain.** Once your Traffic Manager Domain is setup and working, edit the DNS record on your authoritative DNS server to point your company domain to the Traffic Manager domain. 
See [How to Point a Company Internet Domain to a Windows Azure Traffic Manager Domain]() for more information. 
For example, the following command routes all traffic going to **www.contoso.com** to the Traffic Manager domain **contoso.trafficmanager.net**
``www.contoso.com IN CNAME contoso.trafficmanager.net``

[0]: ..\Media\Create_button_for_policies.png

[1]: ..\Media\Dialog_box_for_Failover_load_balancing_method.png








