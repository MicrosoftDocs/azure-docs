<properties linkid="manage-services-traffic-manager" urlDisplayName="Traffic Manager" pageTitle="How to configure traffic manager settings - Windows Azure" metaKeywords="" metaDescription="Learn how to configure Windows Azure Traffic Manager settings to control the distribution of user traffic to hosted services." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />



#How to Configure Traffic Manager Settings#
Windows Azure Traffic Manager enables you to control the distribution of user traffic to Windows Azure hosted services. 

Traffic Manager works by applying an intelligent policy engine to the DNS queries on your main company domain name. Update the DNS resource records that your company owns to point to Traffic Manager domains. Traffic Manager policies that are attached to those domains then resolve DNS queries on your main company domain name to the IP addresses of specific Windows Azure hosted services contained in the Traffic Manager policies. For more information, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/hh744833.aspx).

##Table of Contents

* [How to: Point a Company Internet Domain to a Traffic Manager Domain](#howto_point_company) 
* [How to: Test a Policy](#howto_test)
* [How to: Temporarily Disable Policies and Hosted Services](#howto_temp_disable)
* [How to: Edit a Policy](#howto_edit_policy)
* [How to: Load Balance Traffic Equally Across a Set of Hosted Services](#howto_load_balance)
* [How to: Create a Failover Policy](#howto_create_failover)
* [How to: Direct Incoming Traffic to Hosted Services Based on Network Performance](#howto_direct)


<h2 id="howto_point_company">How to: Point a Company Internet Domain to a Traffic Manager Domain</h2>

To point your company domain name to a Traffic Manager domain, edit the DNS resource record on your DNS server using a CNAME. 

For example, to point the main company domain **www.contoso.com** to a Traffic Manager domain named **contoso.trafficmanager.net**, update the DNS resource record as shown below:
``www.contoso.com IN CNAME contoso.trafficmanager.net``

All traffic going to *www.contoso.com* will now redirect to *contoso.trafficmanager.net*. Be sure that you are using a domain where you want all traffic redirected to Traffic Manager. 

<h2 id="howto_test">How to: Test a Policy</h2>

The best way to test your policy is to set up a number of clients and then bring the services in your policy down one at a time. The following tips will help you test your Traffic Manager policy:

- **Set the DNS TTL very low** so that changes will propagate quickly - 30 seconds, for example.

- **Know the IP addresses of the Windows Azure hosted services** in the policy you are testing. You can obtain this information from the Windows Azure Management Portal. Click on the Production Deployment of your service. In the properties pane on the right, the last entry will be the VIP, which is the virtual IP address of that hosted service.

![hosted service IP location][0]

**Figure 1** -  hosted service IP location

- **Use tools that let you resolve a DNS name to an IP address** and display that address. You are checking to see that your company domain name resolves to IP addresses of the hosted services in your policy. They should resolve in a manner consistent with the load balancing method of your Traffic Manager policy. If you are on a Windows system, you can use nslookup from a CMD window (explained below). Other publicly available tools that allow you to "dig" an IP address are also readily available on the Internet.

- **Check the Traffic Manager policy** by using *nslookup*. 

> **To check an Traffic Manager policy by using nslookup** 

>1. Start a CMD window by clicking **Start-Run** and typing **CMD**.

>2. In order to flush the DNS resolver cache, type ``ipconfig /flushdns``.

>3. Type the command ``nslookup <your traffic manager domain>``.
 For example, the following command checks the domain with the prefix *myapp.contoso* ``nslookup myapp.contoso.trafficmanager.net``

>>A typical result will show the following:

>> - The DNS name and IP address of the DNS server being accessed to resolve this Traffic Manager domain.

>> - The Traffic Manager domain name you typed on the command line after "nslookup" and the IP address that Traffic Manager domain resolves to. 
The second IP address is the important one to check. It should match a VIP for one of the hosted services in the Traffic Manager policy you are testing.

>>![nslookup command example][1]

>>**Figure 2** – nslookup command example

- **Use one of the additional testing methods listed below.** Select the appropriate method for the type of load balancing you are testing.

###Performance policies###

You will need clients in different parts of the world to effectively test your domain. You could create clients in Windows Azure which will attempt to call your services via your company domain name. Alternatively, if your corporation is global you can remotely log into clients in other parts of the country and test from those clients.

There are free web based nslookup and dig services available. Some of these give you the ability to check DNS name resolution from various locations. Do a search on nslookup for examples. Another option is to use a 3rd party solution like Gomez or Keynote to confirm that your policies are distributing traffic as expected.

###Failover policies###

1. Leave all services up.

2. Use a single client.

3. Request DNS resolution for your company domain using ping or a similar utility.

4. Ensure that the IP address your obtain is for your primary hosted service. 

5. Bring your primary service down or remove the monitoring file so that Traffic Manager thinks it is down.

6. Wait at least 2 minutes. 

7. Request DNS resolution.

8. Ensure that the IP address you obtain is for your secondary hosted service as shown by the order of the services in the Edit Traffic Manager Policy dialog box.

9. Repeat the process, bringing down the secondary service and then the tertiary and so on. Each time, be sure that the DNS resolution returns the IP address of the next service in the list. When all services are down, you should obtain the IP address of the primary hosted service again.

###Round Robin policies###

1. Leave all services up.

2. Use a single client.

3. Request DNS resolution for your top level domain.

4. Ensure that the IP address you obtain is one of those in your list.

5. Repeat the process letting the DNS TTL expire so that you will receive a new IP address. You should see IP addresses returned for each of your hosted services. Then the process will repeat.


<h2 id="howto_temp_disable">How to: Temporarily Disable Policies and Hosted Services</h2>

You can disable previously created Traffic Manager policies so they will not route traffic. When you disable a Traffic Manager policy, the information of the policy will remain intact and editable in the Traffic Manager interface. You can easily enable the policy again and routing will resume. 

You can also disable individual hosted services that are part of a Traffic Manager policy. This action effectively leaves the hosted service as part of the policy, but the policy acts as if the hosted service is not included in it. This action is very useful for temporarily removing a hosted service that is in maintenance mode or being redeployed and so unstable. After the hosted service is up and running again, it can be re-enabled. 

**Note**  
Disabling a hosted service has nothing to do with its deployment state in Windows Azure. A healthy service will remain up and able to receive traffic even when disabled in Traffic Manager. Also, disabling a hosted service in one policy does not affect its status in another policy. 

###To disable a policy###

1. Select an enabled policy in the Traffic Manager interface tree. 

2. Click **Disable Policy** on the top toolbar. Note that the button will be greyed out if you highlight a policy that is already disabled.

###To enable a policy###

1. Select a disabled policy in the Traffic Manager interface tree. 

2. Click **Enable Policy** on the top toolbar. Note that the button will be greyed out if you highlight a policy that is already disabled.

###To disable a hosted service###

1. Select an enabled hosted service in a policy in the Traffic Manager interface. You will have to expand a policy in order to see the hosted services contained within it. 

2. Click **Disable Service Policy** on the top toolbar. Note that the button will be greyed out if you highlight a hosted service that is already disabled.

3. Traffic will stop flowing to the hosted service based on the DNS TTL time set for the Traffic Manager domain that is part of the policy. For more information, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/5229dd1c-5a91-4869-8522-bed8597d9cf5#BKMK_Monitoring) and scroll to the section "Monitoring hosted services in Windows Azure Traffic Manager." 

###To enable a hosted service###

1. Select a disabled hosted service in a policy in the Traffic Manager interface. You will have to expand a policy in order to see the hosted services contained within it. 

2. Click **Enable Service Policy** on the top toolbar. Note that the button will be greyed out if you highlight a hosted service that is already enabled.

3. Traffic will start flowing to the hosted service again as dictated by the policy.  

<h2 id="howto_edit_policy">How to: Edit a Policy</h2>

If you just need to temporarily turn off a policy or particular hosted services in the policy, you can temporarily disable them without changing the policy.  

To change a policy to a different type, use the following steps:

1. **Log into the Traffic Manager area in the Management Portal** at [http://windows.azure.com](http://windows.azure.com). Click **Virtual Network** in the lower left of the portal pages and then choose **Traffic Manager** from the options in the left pane.

2. **Select the policy** you want to change in the Traffic Manager screen in the Management Portal.

3. **Click “Configure”** on the top menu bar.

4. **Make the desired changes to the policy.** Note that if you change the load balancing method, depending on the selected option, the order of the hosted services in the **Selected hosted services** list may or may not be important.  

5. Click **Save**.

<h2 id="howto_load_balance">How to: Load Balance Traffic Equally Across a Set of Hosted Services</h2>

A common load balancing pattern is to provide a set of identical hosted services and send traffic to each in a round-robin fashion. This article outlines the steps to set up a Traffic Manager domain and policy to perform this type of load balancing.

For more information on the different load balancing methods that Traffic Manager provides, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/hh744833.aspx) and scroll to the section "Load balancing methods in Windows Azure Traffic Manager."

1. **Deploy your hosted services** into your production environment. For information on developing and deploying [Windows Azure hosted services](http://msdn.microsoft.com/library/gg432967.aspx).

2. **Log into the Traffic Manager area in the Management Portal** at [http://windows.azure.com](http://windows.azure.com). Click **Virtual Network** in the lower left of the portal pages and then choose **Traffic Manager** from the options in the left pane.

3. **Choose Policies and click "Create".** Choose the folder **Policies** from the left navigation tree to enable **Create** in the top toolbar. Choose **Create**. The **Create Traffic Manager policy** dialog will appear.

	![Create button for policies][2]

	**Figure 1** - Create button for policies

4. **Choose a subscription.** Policies and domains are associated with single subscription.

5. **Select the Round Robin load balance method.** For more information on the different load balancing methods that Traffic Manager provides, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/hh744833.aspx) and scroll to the section "Load balancing methods in Windows Azure Traffic Manager."

6. **Find hosted services and add them to the policy.** Use the filter box to find hosted services that contain the string you type into the box. Clear the box to display all hosted services in production for the subscription you selected in step 4. Use the arrow buttons to add them to the policy. The order in the **Selected DNS names** box does not matter for this load balancing method.

7. **Set up monitoring.** Monitoring insures that hosted services that are offline are not sent traffic. You must have a specific path and filename set up.
For more information, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/5229dd1c-5a91-4869-8522-bed8597d9cf5#BKMK_Monitoring) and scroll to the section "Monitoring hosted services in Windows Azure Traffic Manager."

8. **Name your Traffic Manager domain.** Give your domain a unique name. You can only specify the prefix for your domain. Leave the DNS time to live at its default time. 
For more information about the effect of this setting, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/5229dd1c-5a91-4869-8522-bed8597d9cf5#BKMK_Monitoring) and scroll to "Best practices for hosted services and policies when using Windows Azure Traffic Manager."


The **Create Traffic Manager policy** dialog box should be similar to the example below.

![Dialog box for Round Robin load balancing method][3] 

**Figure 2** – Dialog box for Round Robin load balancing method

9. **Test the Traffic Manager domain and policy.** For instructions, see  [How to: Test a Windows Azure Traffic Manager Policy](#howto_test). 

10. **Point your DNS Server to the Traffic Manager domain.** Once your Traffic Manager Domain is setup and working, edit the DNS record on your authoritative DNS server to point your company domain to the Traffic Manager domain. 
For example, the following command routes all traffic going to **www.contoso.com** to the Traffic Manager domain **contoso.trafficmanager.net**: 
`` www.contoso.com IN CNAME contoso.trafficmanager.net``
For more information, see [How to: Point to a Company Internet Domain to a Windows Azure Traffic Manager domain](#howto_point_company).

<h2 id="howto_create_failover">How to: Create a Failover Policy</h2>

Often an organization wants to provide reliability for its services. It does this by providing backup services in case their primary service goes down. A common pattern for service failover is to provide a set of identical hosted services and send traffic to a primary service, with a list of 1 or more backups. This article outlines the steps to set up a Traffic Manager policy to perform this type of failover backup.

For more information on the different load balancing methods that Traffic Manager provides, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/hh744833.aspx) and scroll to the section "Load balancing methods in Windows Azure Traffic Manager."

1. **Deploy your hosted services** into your production environment. For information on developing and deploying hosted services, see [Windows Azure hosted services](http://msdn.microsoft.com/library/gg432967.aspx).  

2. **Log into the Traffic Manager area in the Management Portal** at [http://windows.azure.com](http://windows.azure.com). Click **Virtual Network** in the lower left of the portal pages and then choose **Traffic Manager** from the options in the left pane.

3. **Choose Policies and click "Create".** Choose the folder **Policies** from the left navigation tree to enable **Create** in the top toolbar. Choose **Create**. The **Create Traffic Manager policy** dialog will appear.

	![Create button for policies][4]

	**Figure 1** – Create button for policies

4. **Choose a subscription.** Policies and domains are associated with single subscription.

5. **Select the Failover Policy load balance method.** For more information on the different load balancing methods that Traffic Manager provides, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/hh744833.aspx) and scroll to the section "Load balancing methods in Windows Azure Traffic Manager."

6. **Find hosted services and add them to the policy.** Use the filter box to find hosted services that contain the string you type into the box. Clear the box to display all hosted services in production for the subscription you selected in step 4. Use the arrow buttons to add them to the policy. When you select the **Failover** load balancing method, the order of the selected services matters. The primary hosted service is on top. Use the up and down arrows change the order as needed.

7. Monitoring ensures that hosted services that are offline are not sent traffic. Using a failover policy without setting up monitoring is useless because traffic will be sent to the primary hosted service even if that hosted service is shown as offline. In order to monitor hosted services, you must specify a specific path and filename.
For more information, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/5229dd1c-5a91-4869-8522-bed8597d9cf5#BKMK_Monitoring) and scroll to the section "Monitoring hosted services in Windows Azure Traffic Manager."

8. **Name your Traffic Manager domain.** Give your domain a unique name. You can only specify the prefix for your domain. Leave the **DNS time to live (TTL)** at its default time.
For more information about the effect of this setting, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/5229dd1c-5a91-4869-8522-bed8597d9cf5#BKMK_Monitoring) and scroll to "Best practices for hosted services and policies when using Windows Azure Traffic Manager."
 
The **Create Traffic Manager policy** dialog box should look similar to the example below. 

![Dialog box for Failover load balancing method][5]

**Figure 2** – Dialog box for Failover load balancing method

9. **Test the Traffic Manager domain and policy.** For more information, see [How to: Test a Windows Azure Traffic Manager Policy](#howto_test). 

10. **Point your DNS Server to the Traffic Manager domain.** After your Traffic Manager Domain is setup and working, edit the DNS record on your authoritative DNS server to point your company domain to the Traffic Manager domain. 
For more information, see [How to Point a Company Internet Domain to a Traffic Manager Domain](#howto_point_company). 
For example, the following command routes all traffic going to **www.contoso.com** to the Traffic Manager domain **contoso.trafficmanager.net**
``www.contoso.com IN CNAME contoso.trafficmanager.net``

<h2 id="howto_direct">How to: Direct Incoming Traffic to Hosted Services Based on Network Performance</h2>

In order to load balance hosted service that are located in different datacenters across the globe, you can direct incoming traffic to the closest hosted service. Although “closest” may directly correspond to geographic distance, it can also correspond to the location with the lowest latency to service the request. The Performance load balancing method will allow you to distribute based on location and latency, but cannot take into account real-time changes in network configuration or load. For more information on the different load balancing methods that Traffic Manager provides, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/hh744833.aspx) and scroll to the section "Load balancing methods in Windows Azure Traffic Manager."

The following steps will walk you through the process:

1. **Deploy your hosted services** into your production environment. For more information, see [Creating a Hosted Service for Windows Azure](http://msdn.microsoft.com/en-us/library/windowsazure/gg432967.aspx). 
Also refer to "Best practices for hosted services and policies" in the [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/5229dd1c-5a91-4869-8522-bed8597d9cf5#BKMK_Monitoring).

2. **Log into the Traffic Manager area in the Management Portal** at [http://windows.azure.com](http://windows.azure.com). Click **Virtual Network** in the lower left of the portal pages and then choose **Traffic Manager** from the options in the left pane.

3. **Choose Policies and click "Create".** Choose the folder **Policies** from the left navigation tree to enable **Create** in the top toolbar. Choose **Create**. The **Create Traffic Manager policy** dialog will appear. 
![Create button for policies][6]
**Figure 1** – Create button for policies

4. **Choose a subscription.** Policies and domains are associated with single subscription. 

5. **Pick the Performance load balance method.** For more information on the different load balancing methods that Traffic Manager provides, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/hh744833.aspx) and scroll to the section "Load balancing methods in Windows Azure Traffic Manager."

6. **Find hosted services and add them to the policy.** Use the filter box to find hosted services that contain the string you type into the box. Clear the box to display all hosted services in production for the subscription you selected in step 4. Use the arrow buttons to add them to the policy. The order in the **Selected DNS names** does not matter for this load balancing method.

7. **Set up monitoring.** Monitoring insures that hosted services that are offline are not sent traffic. You must have a specific path and filename set up. 
For more information, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/5229dd1c-5a91-4869-8522-bed8597d9cf5#BKMK_Monitoring) and scroll to the section "Monitoring hosted services in Windows Azure Traffic Manager."

8. **Name your Traffic Manager domain.** Give your domain a unique name. You can only specify the prefix for your domain. Leave the **DNS time to live (TTL)** at its default time. 
For more information about the effect of this setting, see [Overview of Windows Azure Traffic Manager](http://msdn.microsoft.com/en-us/library/windowsazure/5229dd1c-5a91-4869-8522-bed8597d9cf5#BKMK_Monitoring) and scroll to "Best practices for hosted services and policies when using Windows Azure Traffic Manager."
 
The **Create Traffic Manager policy** dialog box should look something like the example below. 
![Dialog box for Performance load balancing method][7]
**Figure 2** – Dialog box for Performance load balancing method

9. **Test the Traffic Manager domain and policy.** For more information about testing, see [How to: Test a Windows Azure Traffic Manager Policy](#howto_test).

10. **Point your DNS Server to the Traffic Manager domain.** Once your Traffic Manager Domain is setup and working, edit the DNS record on your authoritative DNS server to point your company domain to the Traffic Manager domain. 
For example, the following command routes all traffic going to **www.contoso.com** to the Traffic Manager domain **contoso.trafficmanager.net**. 
``www.contoso.com IN CNAME contoso.trafficmanager.net``
For more information, see [How to: Point a Company Internet Domain to a Windows Azure Traffic Manager Domain](#howto_point_company).

[0]: ../Media/hosted_service_IP_location.png
[1]: ../Media/nslookup_command_example.png
[2]: ../Media/Create_button_for_policies.png
[3]: ../Media/Dialog_box_for_Round_Robin_load_balancing_method.png
[4]: ../Media/Create_button_for_policies.png
[5]: ../Media/Dialog_box_for_Failover_load_balancing_method.png
[6]: ../Media/Create_button_for_policies.png
[7]: ../Media/Dialog_box_for_Performance_load_balancing_method.png