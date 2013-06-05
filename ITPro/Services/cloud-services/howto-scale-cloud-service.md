<properties linkid="manage-services-how-to-scale-a-cloud-service" urlDisplayName="How to scale" pageTitle="How to scale a cloud service - Windows Azure" metaKeywords="Azure link resource, scaling cloud service" metaDescription="Learn how to scale a cloud service and linked resources in Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="ryanwi" />

<div chunk="../chunks/cloud-services-left-nav.md" />

#How to Scale a Cloud Service and Linked Resources

<div chunk="../../Shared/Chunks/disclaimer.md" />


On the **Scale** page of the Windows Azure Preview Management Portal, you can scale your cloud service by adding or removing role instances. If you link a Windows Azure SQL Database instance to your cloud service (using **Link** on **Linked Resources**), you can scale the database also.


1. In the [Management Portal](https://manage.windowsazure.com/), click **Cloud Services**. Then click the name of the cloud service to open the dashboard.

2. Click **Scale**.

 Your display will look similar to the following one. Each service role has a slider for changing the number of role instances. Under **linked resources**, each SQL Database instance that you have linked to the cloud service is displayed.

 ![Scale page] (../media/CloudServices_ScalePage.png)

3. To scale a role, drag the vertical bar on the slider. To add a role instance, drag the bar right. To delete an instance, drag the bar left.

 ![Scale role] (../media/CloudServices_Scale_RoleDetail.png)


 The horizontal bar represents the cores (role instances and other virtual machines) available in your Windows Azure plan. When you scale a role, you see how it affects the cores that are available in your account.

 Often when you scale a role, it's beneficial to scale the database that the application is using also. If you link the database to the cloud service, you change the SQL Database edition and resize the database on the **Scale** page.

4. To scale a linked database (shown below):


- To change the SQL Database edition, click **Web** or **Business**. 


- To change the maximum size of the database, select a size.

	![Scale link] (../media/CloudServices_Scale_LinkedDBDetail.png)


5. After you finish scaling the cloud service and its linked resources, click **Save** to update the cloud service configuration.