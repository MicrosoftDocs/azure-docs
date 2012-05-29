<properties umbracoNaviHide="0" pageTitle="How to Manage Cloud Services" metaKeywords="Windows Azure cloud services, cloud service, manage cloud service, swap cloud service, link cloud service, delete cloud service, update cloud service" metaDescription="Learn how to manage Windows Azure cloud services." linkid="devnav-manage-services-cloud-services" urlDisplayName="Cloud Services" headerExpose="" footerExpose="" disqusComments="1" />


<h1 id="swap">How to Manage Cloud Services</h1>


##Table of Contents##

* [How to: Update a cloud service role or deployment](#updaterole)
* [How to: Swap deployments to promote a staged deployment to production](#swap)
* [How to: Link a resource to a cloud service](#linkresources)
* [How to: Delete deployments and a cloud service](#deletecloudservice)


<h2 id="updaterole">How to: Update a cloud service role or deployment</h2>

If you need to update your application code, use **Update** on the dashboard, **Cloud Services** page, or **Instances** page. You can update a single role or all roles. You'll need to upload a new service package and service configuration file.

- On the dashboard, **Cloud Services** page, or **Instances** page, click **Update**.

- **Update Deployment** opens.

	![UpdateDeployment] (../media/CloudServices_UpdateDeployment.png)


- In **Deployment label**, enter a subdomain to use in the URL for the cloud service in the production environment.

- In **Package file**, use **Browse** to upload the service package file (.cspkg).

- In **Configuration file**, use **Browse** to upload the service configuration file (.cscfg).

- In **Role**, select **All** if you want to upgrade all roles in the cloud service. To perform a role upgrade, select the role you want to upgrade. Even if you select a specific role to update, the updates in the service configuration file are applied to all roles.

- If the upgrade will change the number of roles or the size of any role, select the **Allow update if role sizes or number of roles changes** check box to enable the update to proceed. 

- Be aware that if you change the size of a role (that is, the size of a virtual machine that hosts a role instance) or the number of roles, each role instance (virtual machine) must be re-imaged, and any local data will be lost.

- If any service roles have only one role instance, select the **Update even if one or more role contain a single instance check box** to enable the upgrade to proceed. 

- Windows Azure can only guarantee 99.95 percent service availability during a cloud service update if each role has at least two role instances (virtual machines). That enables one virtual machine to process client requests while the other is being updated. For information about how Windows Azure maintains service during updates, see [Deploying and Updating Windows Azure Applications](https://www.windowsazure.com/en-us/develop/net/fundamentals/deploying-applications/).

- Click OK (checkmark) to begin updating the service.




<h2 id="swap">How to: Swap deployments to promote a staged deployment to production</h2>

Use **Swap** to promote a staging deployment to production. When you decide to deploy a new release of a cloud service, you can stage and test your new release in your cloud service staging environment while your customers are using the current release in production. When you're ready to promote the new release to production, you can use **Swap** to switch the URLs by which the two deployments are addressed. 

You can swap deployments from the **Cloud Services** page or the dashboard.

- In the Windows Azure Management Portal, click **Cloud Services**.

- In the list of cloud services, click the cloud service to select it.

- Click **Swap**.

- **VIP swap?** opens.

	![Cloud Services Swap] (../media/CloudServices_Swap.png)

- After you verify the deployment information, click **Yes** to swap the deployments.

The deployment swap happens quickly because the only thing that changes is the virtual IP addresses (VIPs) for the deployments. For more information, see [Deploying and Updating Windows Azure Cloud Applications](http://www.windowsazure.com/en-us/develop/net/fundamentals/deploying-applications/).

To save compute costs, you can delete the deployment in the staging environment when you're sure the new production deployment is performing as expected.

<h2 id="linkresources">How to: Link a resource to a cloud service</h2>

To show your cloud service's dependencies on other resources, such as a Microsoft SQL Database, you can link the resources to the cloud service. You can view all linked resources on **Linked Resources**, and you can monitor their usage on the cloud service dashboard.

Use **Link** to link a new or existing Microsoft SQL database to your cloud service. After you link a Microsoft SQL database to your cloud service, you can scale the database along with the cloud service role that is using it on the **Scale** page. You also will be able to monitor, manage, and scale the database in the **Databases** node of the portal. 

"Linking" a resource in this sense doesn't connect your app to the database. If you create a new database using **Link**, you'll need to add the connection strings to your application code and then upgrade the cloud service.

**Note**   Linked storage accounts are not supported in the Customer Technical Preview of the Windows Azure (Preview) Management Portal. 

The following procedure describes how to link a new SQL Database, deployed on a new SQL Database server, to the cloud service.

###To link a SQL Database to a cloud service###

- In the Management Portal, click **Cloud Services**. Then click the name of the cloud service to open the dashboard.

- Click **Linked Resources**.

- The **Linked Resources** page opens.

	![](..\Media\CloudServices_LinkedResourcesPage.png)

- Click either **Link a Resource** or **Link**.

- The **Link Resource** wizard starts.

	![](..\Media\CloudServices_LinkedResources_LinkPage1.png)

- Click **Create a new resource** or **Link an existing resource**.

- Choose the type of resource to link. In the Preview Management Portal, click **SQL Database**. (The Customer Technical Preview of the Management Portal does not support linking a storage account to a cloud service.)

- To complete the database configuration, follow instructions in help for the **SQL Databases** area of the Preview Management Portal.

You can follow the progress of the linking operation in the message area.

![](..\Media\CloudServices_LinkedResources_LinkProgress.png)

When linking is complete, you can monitor the status of the linked resource on the cloud service dashboard. For information about scaling a linked SQL Database, see [How to: Scale a cloud service and linked resources]().

###To unlink a linked resource###

- In the Management Portal, click **Cloud Services**. Then click the name of the cloud service to open the dashboard.

- Click **Linked Resources**, and then select the resource.

- Click **Unlink**. Then click **Yes** at the confirmation prompt.

Unlinking a SQL Database has no effect on the database or the application's connections to the database. You can still manage the database in the **SQL Databases** area of the Management Portal.



<h2 id="deletecloudservice">How to: Delete deployments and a cloud service</h2>

Before you can delete a cloud service, you must delete each existing deployment.

To save compute costs, you can delete your staging deployment after you verify that your production deployment is working as expected. You are billed compute costs for role instances even if a cloud service is not running.

Use the following procedure to delete a deployment or your cloud service. 

1. In the Windows Azure Management Portal, click **Cloud Services**.

2. Select the cloud service, and then click **Delete**. (To select a cloud service without opening the dashboard, click anywhere except the name in the cloud service entry.)

3. If you have a deployment in staging or production, you will see a menu of choices similar to the following one at the bottom of the window. Before you can delete the cloud service, you must delete any existing deployments.

	![Delete Menu] (../media/CloudServices_DeleteMenu.png)


4. To delete a deployment, click **Delete production deployment** or **Delete staging deployment**. Then, at the confirmation prompt, click **Yes**. 

5. If you plan to delete the cloud service, repeat step x, if needed, to delete your other deployment.

6. To delete the cloud service, click **Delete cloud service**. Then, at the confirmation prompt, click **Yes**.

**Note**   If verbose monitoring is configured for your cloud service, Windows Azure does not delete the monitoring data from your storage account when you delete the cloud service. You will need to delete the data manually. For more information, see [Access verbose monitoring data outside the Management Portal]().