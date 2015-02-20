<tags 
   pageTitle="Add or delete endpoints"
   description="Add and delete endpoints in Traffic Manager"
   services="traffic-manager"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="traffic-manager"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.date="02/20/2015"
   ms.author="cherylmc" />

# Add or Delete Endpoints

## To add a cloud service or website endpoint


1-On the Traffic Manager pane in the Management Portal, locate the Traffic Manager profile that contains the endpoint settings that you want to modify, and then click the arrow to the right of the profile name. This will open the settings page for the profile.

2-At the top of the page, click **Endpoints** to view the endpoints that are already part of your configuration.

3-At the bottom of the page, click **Add** to access the **Add Service Endpoints** page. By default, the page lists the cloud services under **Service Endpoints**.

4-For cloud services, select the cloud services in the list to enable them as endpoints for this profile. Clearing the cloud service name removes it from the list of endpoints.

5-For websites, click the **Service Type** dropdown, and then select **Website**.

6-Select the websites in the list to add them as endpoints for this profile. Clearing the website name removes it from the list of endpoints. Note that you can only select a single website per Azure datacenter (also known as a region). If you select a website in a datacenter that hosts multiple websites, when you select the first website, the others in the same datacenter become unavailable for selection. Also note that only Standard websites are listed.

7-After you select the endpoints for this profile, click the checkmark on the lower right to save your changes.

[AZURE.NOTE]**You cannot add external locations or Traffic Manager profiles as endpoints using the Management Portal. You must use the REST API (see [Create Definition](http://go.microsoft.com/fwlink/p/?LinkId=400772)) or Windows PowerShell ([Add-AzureTrafficManagerEndpoint](http://go.microsoft.com/fwlink/p/?LinkId=400774)).**

Note that Azure Websites already provides failover and round-robin load balancing functionality for websites within a datacenter, regardless of the website mode. Traffic Manager allows you to specify failover and round-robin load balancing for websites in different datacenters.

[AZURE.WARNING] **If you are using the Failover load balancing method, after you add or remove an endpoint, be sure to adjust the Failover Priority List on the Configuration page to reflect the failover order you want for your configuration. For more information, see Configure Failover Load Balancing.**

## To delete a cloud service or website endpoint

1-On the Traffic Manager pane in the Management Portal, locate the Traffic Manager profile that contains the endpoint settings that you want to modify, and then click the arrow to the right of the profile name. This will open the settings page for the profile.

2-At the top of the page, click **Endpoints** to view the endpoints that are already part of your configuration.

3-On the Endpoints page, click the name of the endpoint that you want to delete from the profile.

4-At the bottom of the page, click **Delete**. 

[AZURE.NOTE]**You cannot delete external locations or Traffic Manager profiles as endpoints using the Management Portal. You must use Windows PowerShell. For more information, see [Remove-AzureTrafficManagerEndpoint](https://msdn.microsoft.com/en-us/library/dn690251.aspx)).**

## See Also

[Traffic Manager Overview](../traffic-manager)

[About Traffic Manager Monitoring](../about-traffic-manager-monitoring)

[Traffic Manager Configuration Tasks](https://msdn.microsoft.com/en-us/library/azure/hh744830.aspx)

[Operations on Traffic Manager (REST API Reference)](http://go.microsoft.com/fwlink/p/?LinkID=313584)