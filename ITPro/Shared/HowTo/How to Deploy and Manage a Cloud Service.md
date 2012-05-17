# How to deploy and manage a cloud service in Windows Azure #
This guide demonstrates how to perform common scenarios for creating and managing cloud services in the Windows Azure Preview Management Portal. Covered scenarios include: **create**, **deploy**, **update**, **scale**, **and delete a cloud service, promote a staged deployment to production (swap deployments)**, **configure monitoring and Remote Desktop**, and **link resources**. 

**Note**   The Preview Management Portal also lets you publish a cloud service directly a your Microsoft Team Foundation Services (TFS) team project. For more information, see [[How to publish a Windows Azure cloud service from TFS[FWLINK REQUESTED]]]().

## Table of contents ##
[What is a cloud service?]()
[Concepts]()
[How to: Prepare your application for deployment as a cloud service]()
[How to: Create and deploy a cloud service]()
[How to: Open the cloud service dashboard]()
[How to: Update the cloud service configuration]()
[How to: Update a cloud service role or deployment]()
[How to: Swap deployments to promote a staged deployment to production]()
[How to: Configure monitoring]()
[How to: Configure remote access to role instances]()
[How to: Link a resource to a cloud service]()
[How to: Scale a cloud service and linked resources]()
[How to: Delete deployments and a cloud service]()

## What is a cloud service? ##

When you create an application and run it in Windows Azure, the code and configuration together are called a Windows Azure cloud service (known as a *hosted service* in earlier Windows Azure releases).

By creating a cloud service, you can deploy a multi-tier application in Windows Azure, defining multiple roles to distribute processing and allow flexible scaling of your application. A cloud service consists of one or more web roles and/or worker roles, each with its own application files and configuration. For more information, see [The Windows Azure Application Model](http://www.windowsazure.com/en-us/develop/net/fundamentals/application-model/).

For a cloud service, Windows Azure maintains the infrastructure for you, performing routine maintenance, patching the operating systems, and attempting to recover from service and hardware failures. If you define at least two instances of every role, most maintenance, as well as your own service upgrades, can be performed without any interruption in service. A cloud service must have at least two instances of every role to qualify for the Windows Azure Service Level Agreement, which guarantees external connectivity to your Internet-facing roles at least 99.95 of the time. For more information, see [Service Level Agreements](http://www.windowsazure.com/en-us/support/legal/sla/).

Each cloud service has two environments to which you can deploy your service package and configuration. You can deploy a cloud service to the staging environment to test it before you promote it to production. Promoting a staged cloud service to production is a simple matter of swapping the virtual IP addresses (VIPs) that are associated with the two environments. For more information, see [Deploying and Updating Windows Azure Applications](http://www.windowsazure.com/en-us/develop/net/fundamentals/deploying-applications/).

## Concepts ##


- **cloud service role**   A cloud service role is comprised of application files and a configuration. A cloud service can have two types of role:
 
>- **web role**   A web role provides a dedicated Internet Information Services (IIS) web-server used for hosting front-end web applications.

>- **worker role**   Applications hosted within worker roles can run asynchronous, long-running or perpetual tasks independent of user interaction or input.

- **role instance**   A role instance is a virtual machine on which the application code and role configuration run. 

- **guest operating system**   The guest operating system for a cloud service is the operating system installed on the role instances (virtual machines) on which your application code runs.

- **cloud service components**   Three components are required in order to deploy an application as a cloud service in Windows Azure:

>- **service definition file**   The cloud service definition file (.csdef) defines the service model, including the number of roles.

>- **service configuration file**   The cloud service configuration file (.cscfg) provides configuration settings for the cloud service and individual roles, including the number of role instances.

>- **service package**   The service package (.cspkg) contains the application code and the service definition file.

- To deploy a cloud service, you must upload a service configuration file and the cloud service package. For more information, see [The Windows Azure Application Model](http://www.windowsazure.com/en-us/develop/net/fundamentals/application-model/).

- **cloud service deployment**   A cloud service deployment is an instance of a cloud service deployed to the Windows Azure staging or production environment. You can maintain deployments in both staging and production.

- **deployment environments:**   Windows Azure offers two deployment environments for cloud services: a *staging environment* in which you can test your deployment before you promote it to the *production environment*. The two environments are distinguished only by the virtual IP addresses (VIPs) by which the cloud service is accessed. In the staging environment, the cloud service's globally unique identifier (GUID) identifies it in URLs (*GUID*.cloudapp.net). In the production environment, the URL is based on the friendlier DNS prefix assigned to the cloud service (for example, *myservice*.cloudapp.net).

- **swap deployments**   To promote a deployment in the Windows Azure staging environment to the production environment, you can "swap" the deployments by switching the VIPs by which the two deployments are accessed. After the deployment, the DNS name for the cloud service points to the deployment that had been in the staging environment. For more information, see [Deploying and Updating Windows Azure Cloud Applications](http://www.windowsazure.com/en-us/develop/net/fundamentals/deploying-applications/).

- **minimal vs. verbose monitoring**   *Minimal monitoring*, which is configured by default for a cloud service, uses performance counters gathered from the host operating systems for role instances (virtual machines). *Verbose monitoring* gathers additional metrics based on performance data within the role instances to enable closer analysis of issues that occur during application processing. For more information, see [How to: Configure monitoring]().

- **Windows Azure Diagnostics**   Windows Azure Diagnostics is the API that enables you to collect diagnostic data from applications running in Windows Azure. Windows Azure diagnostics must be enabled for cloud service roles in order for verbose monitoring to be turned on. For more information, see [Overview of Windows Azure Diagnostics](http://msdn.microsoft.com/en-us/library/hh411552.aspx) and [Overview of Creating and Using Performance Counters in a Windows Azure Application](http://msdn.microsoft.com/en-us/library/hh411520.aspx).

- **link a resource**   To show your cloud service's dependencies on other resources, such as a Microsoft SQL Database, you can "link" the resource to the cloud service. In the Preview Management Portal, you can view linked resources on the **Linked Resources** page, view their status on the dashboard, and scale a linked SQL Database along with the service roles on the **Scale** page. Linking a resource in this sense does not connect the resource to the application; you must configure the connections in the application code.

- **scale a cloud service**   A cloud service is scaled out by increasing the number of role instances (virtual machines) deployed for a role. A cloud service is scaled in by decreasing role instances. In the Preview Management Portal, you can also scale a linked SQL Database, by changing the SQL Database edition and the maximum database size, when you scale your service roles.

- **Windows Azure Service Level Agreement (SLA)**   The Windows Azure Compute SLA guarantees that, when you deploy two or more role instances for every role, access to your cloud service will be maintained at least 99.95 percent of the time. Also, detection and corrective action will be initiated 99.9 percent of the time when a role instance’s process is not running. [Download Compute SLA](http://www.microsoft.com/en-us/download/details.aspx?id=24434)

## How to: Prepare your application for deployment as a cloud service ##

Before you can deploy a cloud service, you must create a cloud service package (.cspkg) from your application code and a cloud service configuration file (.cscfg). Each cloud service package contains application files and configurations. The service configuration file provides the configuration settings.

The Windows Azure SDK provides tools for preparing these required deployment files. You can install the SDK from the [Windows Azure Downloads](http://www.windowsazure.com/en-us/develop/downloads/) page, in the language in which you prefer to develop your application code.

If you're new to cloud services, you can download a sample cloud service package (.cspkg) and service configuration file (.cscfg) to work with from the [Windows Azure Code Samples](http://code.msdn.microsoft.com/windowsazure/). 

Three exercises in this guide require special configurations before you export a service package:

- If you want to deploy a cloud service that uses Secure Sockets Layer (SSL) for data encryption, configure your application for SSL. For more information, see [How to Configure an SSL Certificate on an HTTPS Endpoint](http://msdn.microsoft.com/en-us/library/windowsazure/ff795779.aspx).

- If you want to configure Remote Desktop connections to role instances, configure the roles for Remote Desktop. For more information, see . For more information about preparing the service definition file for remote access, see [Overview of Setting Up a Remote Desktop Connection for a Role](http://msdn.microsoft.com/en-us/library/windowsazure/gg433010.aspx).

- If you want to configure verbose monitoring for your cloud service, enable Windows Azure Diagnostics for the cloud service. For more information, see [Enabling Diagnostics in Windows Azure](http://www.windowsazure.com/en-us/develop/net/common-tasks/diagnostics/).

## How to: Create and deploy a cloud service ##

These procedures use the Quick Create method to create a new cloud service and then use **Upload** to upload and deploy a cloud service package in Windows Azure. When you use this method, the Management Portal makes available convenient links for completing all requirements as you go. If you're ready to deploy your cloud service when you create it, you can do both at the same time using **Custom Create**. 

**Note**   If you plan to publish your cloud service from Windows Team Foundation Services (TFS), use Quick Create, and then set up TFS publishing from **Quick Start** or the dashboard. For more information, see help for the **Quick Start** page, or see [[How to publish a Windows Azure cloud service from TFS[FWLINK REQUESTED]]]().

### Before you begin ###


- If you haven’t installed the Windows Azure SDK, click **Install Azure SDK** to open the [Windows Azure Downloads page](http://www.windowsazure.com/en-us/develop/downloads/), and then download the SDK for the language in which you prefer to develop your code. (You'll have an opportunity to do this later.)

- If any role instances require a certificate, create the certificates. Cloud services require a .pfx file with a private key. You can upload the certificates to Windows Azure as you create and deploy the cloud service. For information about creating certificates, see [How to Configure an SSL Certificate on an HTTPS Endpoint](http://msdn.microsoft.com/en-us/library/windowsazure/ff795779.aspx).

- If you plan to deploy the cloud service to an affinity group, create the affinity group. You can create the affinity group in the **Networks** area of the Management Portal, on the **Affinity Groups** page. For more information, see help for the **Affinity Groups** page.

### To create a cloud service using Quick Create ###

- In the Windows Azure Preview Management Portal, click **New**, click **Cloud Service**, and then click **Quick Create**.

![](Media\CloudServices_QuickCreate)

- File = Media\CloudServices_QuickCreate

- In **URL**, enter a subdomain name to use in the public URL for accessing your cloud service in production deployments. The URL format for production deployments is: [http://*myURL*.cloudapp.net](http://myURL.cloudapp.net).

- In **Region/Affinity Group**, select the geographic region or affinity group to deploy the cloud service to. Select an affinity group if you want to deploy your cloud service to the same location as other Windows Azure services within a region.

**Note**   To create an affinity group, open the **Networks** area of the Management Portal, click **Affinity Groups**, and then click either **Create a new affinity group** or **Create**. You can use affinity groups that you created in the earlier Windows Azure Management Portal. And you can create and manage affinity groups using the Windows Azure Service Management API. For more information, see [Operations on Affinity Groups](http://msdn.microsoft.com/en-us/library/windowsazure/ee460798.aspx).

- Click **Create Cloud Service**.

You can monitor the status of the process in the message area at the bottom of the window.

The **Cloud Services** area opens, with the new cloud service displayed. When the status changes to Created, cloud service creation has completed successfully.
![](Media\CloudServices_CloudServicesPage)

- File = Media\CloudServices_CloudServicesPage (graphic #1)

If any roles in the cloud service require a certificate for Secure Sockets Layer (SSL) data encryption, and the certificate has not been uploaded to Windows Azure, you must upload the certificate before you deploy the cloud service. After you upload a certificate, any Windows applications that are running in the role instances can access the certificate.
###To upload a certificate for a cloud service###

- In the Preview Management Portal, click **Cloud Services**. Then click the name of the cloud service to open the dashboard.
![](Media\CloudServices_EmptyDashboard)
- File = Media\CloudServices_EmptyDashboard (graphic #2)

- Click **Certificates** to open the **Certificates** page, shown below.
![](Media\CloudServices_CertificatesPage)
- File = Media\CloudServices_CertificatesPage (graphic #3)

- Click either **Add new certificate** or **Upload**.

- **Add a Certificate** opens.

![](Media\CloudServices_AddaCertificate)

- File = Media\CloudServices_AddaCertificate (graphic #4)

- In **Certificate file**, use **Browse** to select the certificate (.pfx file) to use.

- In **Password**, enter the private key for the certificate.

- Click OK (checkmark).

You can watch the progress of the upload in the message area, shown below. When the upload completes, the certificate is added to the table. In the message area, click the down arrow to close the message, or click X to remove the message.

![](Media\CloudServices_CertificateProgress)

- File = Media\CloudServices_CertificateProgress (graphic #5)

You can deploy your cloud service from the dashboard or from **Quick Start**.
###To deploy a cloud service###
- In the Preview Management Portal, click **Cloud Services**. Then click the name of the cloud service to open the dashboard.

- Click **Quick Start** to open the **Quick Start** page, shown below. (You can also deploy your cloud service by using **Upload** on the dashboard.)

![](Media\CloudServices_QuickStartPage)

- File = Media\CloudServices_QuickStartPage (graphic #6)

- If you haven’t installed the Windows Azure SDK, click **Install Azure SD**K to open the [Windows Azure Downloads page](http://www.windowsazure.com/en-us/develop/downloads/), and then download the SDK for the language in which you prefer to develop your code.

- On the downloads page, you can also install client libraries and source code for developing web apps in Node.js, Java, PHP, and other languages, which you can deploy as scalable Windows Azure cloud services.

- **Note**   For cloud services created earlier (known earlier as *hosted services*), you'll need to make sure the guest operating systems on the virtual machines (role instances) are compatible with the Windows Azure SDK version you install. For more information, see the [Windows Azure SDK release notes](http://msdn.microsoft.com/en-us/library/windowsazure/hh552718.aspx).

- Click either **New Production Deployment** or **New Staging Deployment**. 

- If you'd like to test your cloud service in Windows Azure before deploying it to production, you can deploy to staging. In the staging environment, the cloud service's globally unique identifier (GUID) identifies the cloud service in URLs (*GUID*.cloudapp.net). In the production environment, the friendlier DNS prefix that you assign is used (for example, *myservice*.cloudapp.net). When you're ready to promote your staged cloud service to production, use **Swap** to redirect client requests to that deployment.

- **Upload a Package** opens.

![](Media\CloudServices_UploadaPackage)

- File = Media\CloudServices_UploadaPackage (graphic #7)

- In **Deployment name**, enter a name for the new deployment - for example, MyCloudServicev1.

- In **Package**, use **Browse** to select the service package file (.cspkg) to use.

- In **Configuration**, use **Browse** to select the service configure file (.cscfg) to use.

- If the cloud service will include any roles with only one instance, select the **Deploy even if one or more roles contain a single instance** check box to enable the deployment to proceed.

- Windows Azure can only guarantee 99.95 percent access to the cloud service during maintenance and service updates if every role has at least two instances. If needed, you can add additional role instances on the **Scale** page after you deploy the cloud service. For more information, see [Service Level Agreements](http://www.windowsazure.com/en-us/support/legal/sla/).

- Click OK (checkmark) to begin the cloud service deployment.

- You can monitor the status of the deployment in the message area. Click the down arrow to hide the message.

![](Media\CloudServices_UploadProgress)

- File = Media\CloudServices_UploadProgress (graphic #8)
###To verify that your deployment completed successfully###
- Click **Dashboard**.

- Under **quick glance**, click the site URL to open your cloud service in a web browser.

![](Media\CloudServices_QuickGlance.png)

- File = Media\CloudServices_QuickGlance.png (graphic #9)

Now that you  have deployed your cloud service, let's take a look at it on the dashboard. 
##How to: Open the cloud service dashboard##
The dashboard provides a high-level view of cloud service performance and status information and a central location for managing your cloud service. You can stop and start your cloud service, update the service, promote a staged deployment to production (using **Swap**), or delete individual deployments or the cloud service.

Click **Staging** or **Production** to switch your view between your staging and production deployments.

In **quick glance**, you'll see useful info about your cloud service: the service status, a listing of roles and endpoints, and the virtual IP address (VIP) associated with service's publicly addressable URL.

The metrics chart displays metrics for gauging the performance of your cloud service over the past hour, day, or week. The monitoring configuration for the cloud service determines which metrics can be plotted. By default, you see average CPU usage for each role, aggregated across all the role instances. If you enable verbose monitoring, Memory\Available Mbytes also is displayed.

**Note**   If you're viewing the dashboard for a cloud service that was created by connecting two or more virtual machines, be aware that the actions you can perform in the **Cloud Services** section of the Management Portal are limited. We recommend managing virtual machines in the **Virtual Machines** section. While you can view the virtual machines as a cloud service, the functionality in the **Cloud Services** section for virtual machines is limited.

These restrictions do not apply to legacy stateless virtual machines (known as *VM roles*) for cloud services (known earlier as *hosted services*) created in the earlier Windows Azure Platform Management Portal.
###To open the cloud service dashboard###
- In the Preview Management Portal, click **Cloud Services**.

- In the cloud services list, click the name of the cloud service to open the dashboard.

The dashboard will look similar to the one shown below. Use the browser scrollbar or the Down arrow key to scroll down in the window.

![](Media\CloudServices_DashboardPage)

- File = Media\CloudServices_DashboardPage (graphic #10)

- Click **Production** or **Staging** to view the production or staging deployment.

- To open your cloud service in a web browser, click the URL under **Site URL**.

- Use the commands on the dashboard to perform the following tasks:
#Insert table here#

- Click the labels across the top of the dashboard to open pages for performing additional tasks:
#Insert table here#

##How to: Update the cloud service configuration##
You can configure the most commonly used settings for a cloud service in the portal. Or, if you like to update your configuration files directly, download a service configuration file to update, and then upload the updated file and update the cloud service with the configuration changes. Either way, the configuration updates are pushed out to all role instances.

Windows Azure can only ensure 99.95 percent service availability during the configuration updates if you have at least two role instances (virtual machines) for every role. That enables one virtual machine to process client requests while the other is being updated.
###To update a cloud service configuration on the Configure page###
- In the Preview Management Portal, click **Cloud Services**. Then click the name of the cloud service to open the dashboard.

- Click **Configure**.

- On the **Configure** page, you can configure monitoring, update role settings, and choose the guest operating system and family for role instances (virtual machines). 

![](Media\CloudServices_ConfigurePage1)

![](Media\CloudServices_ConfigurePage)

- File = Media\CloudServices_ConfigurePage (graphic #11)

- In monitoring settings, set the monitoring level to Verbose or Minimal, and configure the diagnostics connection strings that are required for verbose monitoring. For instructions, see [How to: Configure monitoring]().

- For service roles (grouped by role), you can update the following settings:
>- **Settings**   Modify the values of miscellaneous configuration settings that are specified in the <ConfigurationSettings> elements of the service configuration (.cscfg) file.

>- **Certificates**   Change the certificate thumbprint that's being used in SSL encryption for a role. To change a certificate, you must first [upload the new certificate]() (on the **Certificates** page). Then update the thumbprint in the certificate string displayed in the role settings.

- In **operating system settings**, you can change the operating system family or version for role instances (virtual machines), or choose **Auto** to resume automatic updates of the current OS version. 

- When you deploy a new cloud service, you can choose either the Windows Server 2008 R2 or Windows Server 2008 with Service Pack 2 (SP2) operating system. During deployment, the most recent OS version is installed on all role instances, and the operating systems are updated automatically by default. 

- If you need for your cloud service to run on a different operating system version because of compatibility requirements in your code, you can choose an OS family and version. When you choose a specific OS version, automatic OS updates for the cloud service are suspended. You will need to ensure the operating systems receive updates.

- If you resolve all compatibility issues that your apps have with the most recent OS version, you can resume automatic OS updates by setting the OS version to **Automatic**. 


![](Media\CloudServices_ConfigurePage_OSSettings)

- File = Media\CloudServices_ConfigurePage_OSSettings (graphic #12)

- To save your configuration settings, and push them to the role instances, click **Save**. (Click **Discard** to cancel the changes.) After you change a setting, **Save** and **Discard** are added to the command bar.
###To update a cloud service configuration file manually###
- Download a cloud service configuration file (.cscfg) with the current configuration. On the **Configure** page for the cloud service, click **Download**. Then click **Save**, or click **Save As** to save the file.

- After you update the service configuration file, upload and apply the configuration updates:

>- On the **Configure** page, click **Upload**.

>- **Upload a New Configuration File** opens.

![](Media\CloudServices_UploadConfigFile)

>- File = Media\CloudServices_UploadConfigFile (graphic #13)

>- In **Configuration file**, use **Browse** to select the updated .cscfg file.

>- If your cloud service contains any roles that have only one instance, select the **Apply configuration even if one or more roles contain a single instance** check box to enable the configuration updates for the roles to proceed.

>- Unless you define at least two instances of every role, Windows Azure cannot guarantee at least 99.95 percent availability of your cloud service during service configuration updates. For more information, see [Service Level Agreements](http://www.windowsazure.com/en-us/support/legal/sla/).

>- Click OK (checkmark). 
##How to: Update a cloud service role or deployment##
If you need to update your application code, use **Update** on the dashboard, **Cloud Services** page, or **Instances** page. You can update a single role or all roles. You'll need to upload a new service package and service configuration file.
###To update a role or a cloud service deployment###

- On the dashboard, **Cloud Services** page, or **Instances** page, click **Update**.

- **Update Deployment** opens.

![](Media\CloudServices_UpdateDeployment)

- File = Media\CloudServices_UpdateDeployment (graphic #14)

- In **Deployment label**, enter a subdomain to use in the URL for the cloud service in the production environment.

- In **Package file**, use **Browse** to upload the service package file (.cspkg).

- In **Configuration file**, use **Browse** to upload the service configuration file (.cscfg).

- In **Role**, select **All** if you want to upgrade all roles in the cloud service. To perform a role upgrade, select the role you want to upgrade. Even if you select a specific role to update, the updates in the service configuration file are applied to all roles.

- If the upgrade will change the number of roles or the size of any role, select the **Allow update if role sizes or number of roles changes** check box to enable the update to proceed. 

- Be aware that if you change the size of a role (that is, the size of a virtual machine that hosts a role instance) or the number of roles, each role instance (virtual machine) must be re-imaged, and any local data will be lost.

- If any service roles have only one role instance, select the **Update even if one or more role contain a single instance check box** to enable the upgrade to proceed. 

- Window s Azure can only guarantee 99.95 percent service availability during a cloud service update if each role has at least two role instances (virtual machines). That enables one virtual machine to process client requests while the other is being updated. For information about how Windows Azure maintains service during updates, see [Deploying and Updating Windows Azure Applications](https://www.windowsazure.com/en-us/develop/net/fundamentals/deploying-applications/).

- Click OK (checkmark) to begin updating the service.
##How to: Swap deployments to promote a staged deployment to production##
Use **Swap** to promote a staging deployment to production. When you decide to deploy a new release of a cloud service, you can stage and test your new release in your cloud service staging environment while your customers are using the current release in production. When you're ready to promote the new release to production, you can use **Swap** to switch the URLs by which the two deployments are addressed. 
You can swap deployments from the **Cloud Services** page or the dashboard.
###To swap VIPs for cloud service deployments###
- In the Preview Management Portal, click **Cloud Services**.

- In the list of cloud services, click the cloud service to select it.

- Click **Swap**.

- **VIP swap?** opens.

![](Media\CloudServices_Swap)

- File = Media\CloudServices_Swap (graphic #15)

- After you verify the deployment information, click **Yes** to swap the deployments.

The deployment swap happens quickly because the only thing that changes is the virtual IP addresses (VIPs) for the deployments. For more information, see [Deploying and Updating Windows Azure Cloud Applications](http://www.windowsazure.com/en-us/develop/net/fundamentals/deploying-applications/).

To save compute costs, you can delete the deployment in the staging environment when you're sure the new production deployment is performing as expected.
##How to: Configure monitoring##
You can monitor key performance metrics for your cloud services in the portal, and can customize what you monitor in the portal to meet your needs.
 
By default, minimal monitoring is provided for a new cloud service using performance counters gathered from the host operating system for the roles instances (virtual machines). The minimal metrics are limited to CPU Percentage, Data In, Data Out, Disk Read Throughput, and Disk Write Throughput. By configuring verbose monitoring, you can receive additional metrics based on performance data within the virtual machines (role instances). The verbose metrics enable closer analysis of issues that occur during application operations.

**Note**   If you use verbose monitoring, you can add more performance counters at role instance startup, through a diagnostics configuration file, or remotely using the Windows Azure Diagnostics API. To be able to monitor these metrics in the portal, you must add the performance counters before you configure verbose monitoring. For more information, see [Overview of Windows Azure Diagnostics](http://msdn.microsoft.com/en-us/library/hh411552.aspx) and [Overview of Creating and Using Performance Counters in a Windows Azure Application](http://msdn.microsoft.com/en-us/library/hh411520.aspx).

By default performance counter data from role instances is sampled and transferred from the role instance at 3-minute intervals. When you enable verbose monitoring, the raw performance counter data is aggregated for each role instance and across role instances for each role at intervals of 5 minutes, 1 hour, and 12 hours. The aggregated data is  purged after 10 days.

After you enable verbose monitoring, the aggregated monitoring data is stored in tables in your storage account. To enable verbose monitoring for a role, you must configure a diagnostics connection string that links to the storage account. You can use different storage accounts for different roles.
 
**Important**   Note that enabling verbose monitoring will increase your storage costs related to data storage, data transfer, and storage transactions.

Minimal monitoring does not require a storage account. The data for the metrics that are exposed at the minimal monitoring level are not stored in your storage account, even if you set the monitoring level to verbose.
###Configure verbose or minimal monitoring###
Use the following procedures to configure verbose or minimal monitoring in the Preview Management Portal. You cannot turn on verbose monitoring until you enable Windows Azure Diagnostics and configure diagnostics connection strings to enable Windows Azure Diagnostics to access storage accounts to store the verbose monitoring data.
###Before you begin###

- Create a storage account to store the monitoring data. You can use different storage accounts for different roles. For more information, see help for **Storage Accounts**, or see [Creating and Managing Storage Accounts in Windows Azure]().

- Enable Windows Azure Diagnostics for your cloud service roles. 

- You must update the cloud service definition file (.csdef) and the cloud service configuration file (.cscfg). For more information, see [Enabling Diagnostics in Windows Azure](http://www.windowsazure.com/en-us/develop/net/common-tasks/diagnostics/).

In the Preview Management Portal, you can add or modify the diagnostics connection strings that Windows Azure Diagnostics uses to access the storage accounts that store verbose monitoring data, and you can set the level of monitoring to verbose or minimal. Because verbose monitoring stores data in a storage account, you must configure the diagnostics connection strings before you set the monitoring level to verbose.
###To configure diagnostics connections strings for verbose monitoring###
- Copy a storage account key for the storage account that you'll use to store the verbose monitoring data. Use **Manage Keys** on the **Storage Accounts** page. For more information, see help for the **Storage Accounts** page. 

- Open **Cloud Services**. Then, to open the dashboard, click the name of the cloud service you want to configure.

- Click **Production** or **Staging** to open the deployment you want to configure.

- Click **Configure**.

- You will edit the **monitoring** settings at the top of the page. 

![](Media\CloudServices_MonitoringOptions)

- File = Media\CloudServices_MonitoringOptions (graphic #16)

- **Note**   If you have not enabled Windows Azure Diagnostics for the cloud service, the Level and Retention (Days) options are not available.

- In **Diagnostics Connection Strings**, complete the diagnostics connection string for each role 

- for which you want verbose monitoring. Then click **Save**.

- The connection strings have the following format. To update a connection string, enter the storage account name and a storage account key.

         DefaultEndpointsProtocol=https;AccountName=StorageAccountName;AccountKey=StorageAccountKey
- **Note**   Monitoring data for a cloud service is stored for 10 days. You can't change the data retention policy.

- Click **Save**.

If you're turning on verbose monitoring, perform the next procedure after you configure diagnostics connection strings for service roles. For instructions, see [To configure diagnostics strings for verbose monitoring]().
###To change the monitoring level to verbose or minimal###
- Open the **Configure** page for the cloud service deployment.

- In **Level**, click **Verbose** or **Minimal**. 

- Click **Save**.

After you turn on verbose monitoring, you should start seeing the monitoring data in the Preview Management Portal within the hour.

The raw performance counter data and aggregated monitoring data are stored in the storage account in tables qualified by the deployment ID for the roles. For more information, see [Access verbose monitoring data outside the Management Portal]().
###Customize metrics displays on the dashboard and Monitor page###
Monitoring displays in the Preview Management Portal are highly configurable. You can choose the metrics you want to monitor in the metrics list on the **Monitor** page, and you can choose which metrics to plot in metrics charts on the **Monitor** page and the dashboard.

The example screens in the following procedure illustrate the metrics configuration for verbose monitoring.
###To choose metrics to display in the metrics table (Monitor page)###
- Open the **Monitor** page for the cloud service.

- By default, the metrics table displays a subset of the available metrics. The illustration shows the default verbose metrics for a cloud service, which is limited to the Memory\Available MBytes performance counter, with data aggregated at the role level. Use **Add Metrics** to select additional aggregate and role-level metrics to monitor in the portal.

![](Media\CloudServices_DefaultVerboseDisplay)

- File = Media\CloudServices_DefaultVerboseDisplay (graphic #17)

- To add metrics to the metrics table:

- Click **Add Metrics** to open **Choose Metrics**, shows below.

- The first available metric is expanded to show options that are available. For each metric, the top option displays aggregated monitoring data for all roles. In addition, you can choose individual roles to display data for.

![](Media\CloudServices_AddMetrics)

- File = Media\CloudServices_AddMetrics (graphic #18)

- To select metrics to display:

>- Click the down arrow by the metric to expand the monitoring options.

>- Select the check box for each monitoring option you want to display.

- You can display up to 50 metrics in the metrics table.

- **Hint**   In verbose monitoring, the metrics list can contain dozens of metrics. To display a scrollbar, hover over the right side of the dialog box. To filter the list, click the search icon, and enter text in the search box, as shown below.

![](Media\CloudServices_AddMetrics_Search)

- File = Media\CloudServices_AddMetrics_Search (graphic #19)

- After you finish selecting metrics, click OK (checkmark).

- The selected metrics are added to the metrics table.

![](Media\CloudServices_Monitor_UpdatedMetrics)

- File = Media\CloudServices_Monitor_UpdatedMetrics (graphic #20)

- To delete a metric from the metrics table, click the metric to select it, and click **Delete Metric**.

###To customize the metrics chart on the Monitor page###

- In the metrics table, shown below, select up to 6 metrics to plot on the metrics chart. To select a metric, click the check box on its left side.
- As you select metrics in the metrics table, the metrics are added to the headers of the metrics chart. On a narrow display, an **n more** drop-down list, as shown below, contains metric headers that won't fit the display.

>- To plot a metric on the metrics chart, select the check box by the header. On a narrow display, click the down arrow by ***n* metrics** to plot a metric the chart header area can't display.

>- To remove a metric from the metrics chart, clear the check box by the chart header.

![](Media\CloudServices_ChartMetricSelection)
- File = Media\CloudServices_ ChartMetricSelection (graphic #21)

- To change the time range the metrics chart displays, select 1 hour, 24 hours, or 7 days at the top of the chart.

![](Media\CloudServices_Monitor_DisplayPeriod)

- File = Media\CloudServices_Monitor_DisplayPeriod (graphic #22)

On the dashboard, the process is the same for plotting metrics on the metrics table. However, a standard set of metrics is available. You can't change them.

###To customize the metrics chart on the dashboard###

- Open the dashboard for the cloud service.

- Add or remove metrics from the chart:

>- To plot a new metric, select the check box for the metric in the chart headers. On a narrow display, click the down arrow by ***n* metrics** to plot a metric the chart header area can't display.

>- To delete a metric that is plotted on the chart, clear the check box by its header.

- Choose 1 hour, 24 hours, or 7 days of data to display.

###Access verbose monitoring data outside the Management Portal###

Verbose monitoring data is stored in tables in the storage accounts that you specify for each role. For each cloud service deployment, six tables are created for the role. Two tables are created for each aggregation interval (5 minutes, 1 hour, and 12 hours). One of these tables stores role-level aggregations; the other table stores aggregations for role instances. 

The table names have the following format:

       WAD<deploymentID>PT<aggregation_interval>[R|RI]>Table

where:

- *deploymentID* is the GUID assigned to the cloud service deployment

- *aggregation_interval* = 5M, 1H, or 12H

- role-level aggregations = R

- aggregations for role instances = RI

For example, the following tables would store verbose monitoring data aggregated at 1-hour intervals:

WAD8b7c4233802442b494d0cc9eb9d8dd9fPT1HRTable (hourly aggregations for the role)

WAD8b7c4233802442b494d0cc9eb9d8dd9fPT1HRTable (hourly aggregations for role instances)

##How to: Configure remote access to role instances##

Remote Desktop enables you to access the desktop of a role instance running in Windows Azure. You can use a Remote Desktop connection to troubleshoot problems with your application. If you configure the service definition file (.csdef) for Remote Desktop during application development, you can complete or modify the Remote Desktop configuration in the portal. First, you’ll need to upload a certificate to use for authentication during Remote Desktop Protocol (RDP) password encryption.

On the **Configure** page, you can complete the Remote Desktop configuration or change the local Administrator account or password used to connect to the virtual machines, the certificate used in authentication, or the expiration date.

**Note**   If your cloud service consists of two or more connected Windows Server-based virtual machines, you don’t have to configure remote access, as these virtual machines are configured automatically for Remote Desktop.

###Before you begin###

- Before you deploy your cloud service, configure your application for Remote Desktop.

- You must add <Import> elements to the service definition file (.csdef) to import the RemoteAccess and RemoteForwarder modules into the service model. When those modules are present, Windows Azure adds the configuration settings for Remote Desktop to the service configuration file. To complete the Remote Desktop configuration, you will need to import a certificate to Windows Azure, and specify the certificate in the service configuration file. For more information, see [Overview of Setting Up a Remote Desktop Connection for a Role](http://msdn.microsoft.com/en-us/library/windowsazure/gg433010.aspx).

###To configure or modify Remote Access for role instances###

- In the Preview Management Portal, click Cloud Services. Then click the name of the cloud service to open the dashboard.

- Open the **Configure** page for the cloud service, and click **Remote**.

- **Configure Remote Desktop Settings** displays the settings that were added to the service configuration file when the cloud service was deployed, as shown below.

![](Media\CloudServices_Remote)

- File = Media\CloudServices_Remote (graphic #23)

- In **Roles**, select the service role you want to update.

- Make any of the following changes:

>- To enable Remote Desktop, select the **Enable remote desktop** check box. To disable Remote Desktop, clear the check box.

>- Create an account to use in Remote Desktop connections to the role instances.

>- Update the password for the existing account.

>- Change the certificate used in authentication. First, upload the certificate using **Upload** on the **Certificates** page. (For instructions, see [To upload a certificate]().) Then enter the new certificate thumbprint.

>- Change the expiration date for the Remote Desktop configuration.

- When you finish your configuration updates, click OK (checkmark).

- To test the Remote Desktop configuration, connect to a role instance:

>- Click **Instances** to open the **Instances** page.

>- Click a role instance that has Remote Desktop configured to select the instance.

>- Click **Connect**, and follow the instructions to open the desktop of the virtual machine. 

##How to: Link a resource to a cloud service##

To show your cloud service's dependencies on other resources, such as a Microsoft SQL Database, you can link the resources to the cloud service. You can view all linked resources on **Linked Resources**, and you can monitor their usage on the cloud service dashboard.

Use **Link** to link a new or existing Microsoft SQL database to your cloud service. After you link a Microsoft SQL database to your cloud service, you can scale the database along with the cloud service role that is using it on the **Scale** page. You also will be able to monitor, manage, and scale the database in the **Databases** node of the portal. 

"Linking" a resource in this sense doesn't connect your app to the database. If you create a new database using **Link**, you'll need to add the connection strings to your application code and then upgrade the cloud service.

**Note**   Linked storage accounts are not supported in the Customer Technical Preview of the Windows Azure Preview Management Portal. 

The following procedure describes how to link a new SQL Database, deployed on a new SQL Database server, to the cloud service.

###To link a SQL Database to a cloud service###

- In the Preview Management Portal, click **Cloud Services**. Then click the name of the cloud service to open the dashboard.

- Click **Linked Resources**.

- The **Linked Resources** page opens.

![](Media\CloudServices_LinkedResourcesPage)

- File = Media\CloudServices_LinkedResourcesPage (graphic #24)

- Click either **Link a Resource** or **Link**.

- The **Link Resource** wizard starts.

![](Media\CloudServices_LinkedResources_LinkPage1)

File = Media\CloudServices_LinkedResources_LinkPage1 (graphic #25)

- Click **Create a new resource** or **Link an existing resource**.

- Choose the type of resource to link. In the Preview Management Portal, click **SQL Database**. (The Customer Technical Preview of the Preview Management Portal does not support linking a storage account to a cloud service.)

- To complete the database configuration, follow instructions in help for the **SQL Databases** area of the Preview Management Portal.

You can follow the progress of the linking operation in the message area.

![](Media\CloudServices_LinkedResources_LinkProgress)

File = Media\CloudServices_LinkedResources_LinkProgress (graphic #26)

When linking is complete, you can monitor the status of the linked resource on the cloud service dashboard. For information about scaling a linked SQL Database, see [How to: Scale a cloud service and linked resources]().

###To unlink a linked resource###

- In the Preview Management Portal, click **Cloud Services**. Then click the name of the cloud service to open the dashboard.

- Click **Linked Resources**, and then select the resource.

- Click **Unlink**. Then click **Yes** at the confirmation prompt.

Unlinking a SQL Database has no effect on the database or the application's connections to the database. You can still manage the database in the **SQL Databases** area of the Preview Management Portal.

##How to: Scale a cloud service and linked resources##

On the **Scale** page, you can scale your cloud service by adding or removing role instances. If you link a SQL Database to your cloud service (using **Link** on **Linked Resources**), you can scale the database also.

###To scale a cloud service role###

- In the Preview Management Portal, click **Cloud Services**. Then click the name of the cloud service to open the dashboard.

- Click **Scale**.

- Your display will look similar to the following one. Each service role has a slider for changing the number of role instances. Under **linked resources**, each SQL database that you have linked to the cloud service is displayed.

![](Media\CloudServices_ScalePage)

- File = Media\CloudServices_ScalePage (graphic #27)

- To scale a role, drag the vertical bar on the slider. To add a role instance, drag the bar right. To delete an instance, drag the bar left.

![](Media\CloudServices_Scale_RoleDetail)

- File = Media\CloudServices_Scale_RoleDetail (graphic #28)

- The horizontal bar represents the compute units (role instances and other virtual machines) available in your Windows Azure plan. When you scale a role, you see how it affects the compute instances that are available in your account.

- Often when you scale a role, it's beneficial to scale the database that the application is using also. If you link the database to the cloud service, you change the SQL Database edition and resize the database on the **Scale** page.

- To scale a linked database (shown below):

>- To change the SQL Database edition, click **Web** or **Business**. 

>- To change the maximum size of the database, select **1GB** or **5GB**.

![](Media\CloudServices_Scale_LinkedDBDetail)

- File = Media\CloudServices_Scale_LinkedDBDetail (graphic #29)

- After you finish scaling the cloud service and its linked resources, click **Save** to update the cloud service configuration.

##How to: Delete deployments and a cloud service##

Use the following procedure to delete a deployment or your cloud service. Before you can delete a cloud service, you must delete each existing deployment.

To save compute costs, you can delete your staging deployment after you verify that your production deployment is working as expected. You are billed compute costs for role instances even if a cloud service is not running.

###To delete a deployment or a cloud service###

- In the Management Portal, click **Cloud Services**.

- Select the cloud service, and then click **Delete**. (To select a cloud service without opening the dashboard, click anywhere except the name in the cloud service entry.)

- If you have a deployment in staging or production, you will see a menu of choices similar to the following one at the bottom of the window. Before you can delete the cloud service, you must delete any existing deployments.

![](Media\CloudServices_DeleteMenu)

- File = Media\CloudServices_DeleteMenu (graphic #30)

- To delete a deployment, click **Delete production deployment** or **Delete staging deployment**. Then, at the confirmation prompt, click **Yes**. 

- If you plan to delete the cloud service, repeat step x, if needed, to delete your other deployment.

- To delete the cloud service, click **Delete cloud service**. Then, at the confirmation prompt, click **Yes**.

**Note**   If verbose monitoring is configured for your cloud service, Windows Azure does not delete the monitoring data from your storage account when you delete the cloud service. You will need to delete the data manually. For more information, see [Access verbose monitoring data outside the Management Portal]().

[0]:  ..\media\ CloudServices_QuickCreate.png
[1]:  ..\media\ CloudServices_CloudServicesPage.png
[2]:  ..\media\ CloudServices_EmptyDashboard.png
[3]:  ..\media\ CloudServices_CertificatesPage.png
[4]:  ..\media\ CloudServices_AddaCertificate.png
[5]:  ..\media\ CloudServices_CertificateProgress.png
[6]:  ..\media\ CloudServices_QuickStartPage.png
[7]:  ..\media\ CloudServices_UploadaPackage.png
[8]:  ..\media\ CloudServices_UploadProgress.png
[9]:  ..\media\ CloudServices_QuickGlance.png
[10]:  ..\media\ CloudServices_Dashboard.png
[11]:  ..\media\ CloudServices_ConfigurePage.png
[12]:  ..\media\ CloudServices_ConfigurePage_OSSettings.png
[13]:  ..\media\ CloudServices_UploadConfigFile.png
[14]:  ..\media\ CloudServices_UpdateDeployment.png
[15]:  ..\media\ CloudServices_Swap.png
[16]:  ..\media\ CloudServices_MonitoringOptions.png
[17]:  ..\media\ CloudServices_DefaultVerboseDisplay.png
[18]:  ..\media\ CloudServices_AddMetrics.png
[19]:  ..\media\ CloudServices_AddMetrics_Search.png
[20]:  ..\media\ CloudServices_Monitor_UpdatedMetrics.png
[21]:  ..\media\ CloudServices_ChartMetricSelection.png
[22]:  ..\media\ CloudServices_Monitor_DisplayPeriod.png
[23]:  ..\media\ CloudServices_Remote.png
[24]:  ..\media\ CloudServices_LinkedResourcesPage.png
[25]:  ..\media\ CloudServices_LinkedResources_LinkPage1.png
[26]:  ..\media\ CloudServices_LinkedResources_LinkProgress.png
[27]:  ..\media\ CloudServices_ScalePage.png
[28]:  ..\media\ CloudServices_Scale_RoleDetail.png
[29]:  ..\media\ CloudServices_Scale_LinkedDBDetail.png
[30]:  ..\media\ CloudServices_DeleteMenu.png

