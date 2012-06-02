<properties umbracoNaviHide="0" pageTitle="How to Scale a Cloud Service and Linked Resources" metaKeywords="Windows Azure cloud services, cloud service, scale cloud service, scale, scale linked resources" metaDescription="Learn how to scale a cloud service and linked resources." linkid="devnav-manage-services-cloud-services" urlDisplayName="Cloud Services" headerExpose="" footerExpose="" disqusComments="1" />
#How to Scale a Cloud Service and Linked Resources

On the **Scale** page of the Windows Azure (Preview) Management Portal, you can scale your cloud service by adding or removing role instances. If you link a SQL Database to your cloud service (using **Link** on **Linked Resources**), you can scale the database also.


1. In the [Windows Azure (Preview) Management Portal](http://manage.windowsazure.com/), click **Cloud Services**. Then click the name of the cloud service to open the dashboard.

2. Click **Scale**.

 Your display will look similar to the following one. Each service role has a slider for changing the number of role instances. Under **linked resources**, each SQL database that you have linked to the cloud service is displayed.

 ![Scale page] (../media/CloudServices_ScalePage.png)

3. To scale a role, drag the vertical bar on the slider. To add a role instance, drag the bar right. To delete an instance, drag the bar left.

 ![Scale role] (../media/CloudServices_Scale_RoleDetail.png)


 The horizontal bar represents the compute units (role instances and other virtual machines) available in your Windows Azure plan. When you scale a role, you see how it affects the compute instances that are available in your account.

 Often when you scale a role, it's beneficial to scale the database that the application is using also. If you link the database to the cloud service, you change the SQL Database edition and resize the database on the **Scale** page.

4. To scale a linked database (shown below):


- To change the SQL Database edition, click **Web** or **Business**. 


- To change the maximum size of the database, select **1GB** or **5GB**.

	![Scale link] (../media/CloudServices_Scale_LinkedDBDetail.png)


5. After you finish scaling the cloud service and its linked resources, click **Save** to update the cloud service configuration.