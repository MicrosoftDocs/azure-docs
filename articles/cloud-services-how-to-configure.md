<properties 
	pageTitle="How to configure a cloud service - Azure" 
	description="Learn how to configure cloud services in Azure. Learn to update the cloud service configuration and configure remote access to role instances." 
	services="cloud-services" 
	documentationCenter="" 
	authors="Thraka" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="cloud-services" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/02/2015" 
	ms.author="adegeo"/>




# How to Configure Cloud Services

You can configure the most commonly used settings for a cloud service in the Azure Management Portal. Or, if you like to update your configuration files directly, download a service configuration file to update, and then upload the updated file and update the cloud service with the configuration changes. Either way, the configuration updates are pushed out to all role instances.

You can also enable a Remote Desktop connection to one or all roles running in your cloud service.  Remote Desktop allows you to access the desktop of your application while it is running and troubleshoot and diagnose problems.  You can enable a Remote Desktop connection to your role even if you did not configure the service definition file (.csdef) for Remote Desktop during application development.  There is no need to redeploy your application in order to enable a Remote Desktop connection.

Azure can only ensure 99.95 percent service availability during the configuration updates if you have at least two role instances for every role. That enables one virtual machine to process client requests while the other is being updated. For more information, see [Service Level Agreements](https://www.windowsazure.com/support/legal/sla/).

## Update the cloud service configuration

1. In the [Azure Management Portal](http://manage.windowsazure.com/), click **Cloud Services**, click the name of the cloud service, and then click **Configure**.

	![Configuration Page](./media/cloud-services-how-to-configure/CloudServices_ConfigurePage1.png)
	
	On the **Configure** page, you can configure monitoring, update role settings, and choose the guest operating system and family for role instances. 

2. In **monitoring**, set the monitoring level to Verbose or Minimal, and configure the diagnostics connection strings that are required for verbose monitoring. For instructions, see [How to Monitor Cloud Services](how-to-monitor-a-cloud-service.md).


3. For service roles (grouped by role), you can update the following settings:

  >**Settings**<br/>
   Modify the values of miscellaneous configuration settings that are specified in the *ConfigurationSettings* elements of the service configuration (.cscfg) file.

  >**Certificates**<br/>
   Change the certificate thumbprint that's being used in SSL encryption for a role. To change a certificate, you must first upload the new certificate (on the **Certificates** page). Then update the thumbprint in the certificate string displayed in the role settings.

4. In **operating system**, you can change the operating system family or version for role instances, or choose **Automatic** to enable automatic updates of the current operating system version. The operating system settings apply to web roles and worker roles, but do not affect Virtual Machines.

  During deployment, the most recent operating system version is installed on all role instances, and the operating systems are updated automatically by default. 

  If you need for your cloud service to run on a different operating system version because of compatibility requirements in your code, you can choose an operating system family and version. When you choose a specific operating system version, automatic operating system updates for the cloud service are suspended. You will need to ensure the operating systems receive updates.

  If you resolve all compatibility issues that your apps have with the most recent operating system version, you can enable automatic operating system updates by setting the operating system version to **Automatic**. 

  ![OS Settings](./media/cloud-services-how-to-configure/CloudServices_ConfigurePage_OSSettings.png)

5. To save your configuration settings, and push them to the role instances, click **Save**. (Click **Discard** to cancel the changes.) **Save** and **Discard** are added to the command bar after you change a setting.

### To update a cloud service configuration file manually

1. Download a cloud service configuration file (.cscfg) with the current configuration. On the **Configure** page for the cloud service, click **Download**. Then click **Save**, or click **Save As** to save the file.

2. After you update the service configuration file, upload and apply the configuration updates:

	a. On the **Configure** page, click **Upload**.

	![Upload Configuration](./media/cloud-services-how-to-configure/CloudServices_UploadConfigFile.png)

	b. In **Configuration file**, use **Browse** to select the updated .cscfg file.

	c. If your cloud service contains any roles that have only one instance, select the **Apply configuration even if one or more roles contain a single instance** check box to enable the configuration updates for the roles to proceed.

	Unless you define at least two instances of every role, Azure cannot guarantee at least 99.95 percent availability of your cloud service during service configuration updates. For more information, see [Service Level Agreements](http://www.windowsazure.com/support/legal/sla/).

	d. Click **OK** (checkmark). 


## Configure remote access to role instances

Remote Desktop enables you to access the desktop of a role running in Azure. You can use a Remote Desktop connection to troubleshoot and diagnose problems with your application while it is running. You can enable a Remote Desktop connection in your role during application design or after you have deployed the application to Azure (while the role is running).  Enabling a Remote Desktop connection in a running role through the Management Portal does not require you to redeploy your application.  To authenticate the Remote Desktop connection you can use a previously uploaded certificate or you can create a new certificate.

On the **Configure** page for your cloud service, you can enable Remote Desktop or change the local Administrator account or password used to connect to the virtual machines, the certificate used in authentication, or the expiration date.

### To configure Remote Access in the service definition file

Add **Import** elements to the service definition file (.csdef) to import the RemoteAccess and RemoteForwarder modules into the service model. When those modules are present, Azure adds the configuration settings for Remote Desktop to the service configuration file. To complete the Remote Desktop configuration, you will need to import a certificate to Azure, and specify the certificate in the service configuration file. For more information, see [Set Up a Remote Desktop Connection for a Role in Azure][].

###To enable or modify Remote Access for role instances in the Management Portal###

1. Click **Cloud Services**, click the name of the cloud service, and then click **Configure**.

2. Click **Remote**.

  ![Cloud services remote](./media/cloud-services-how-to-configure/CloudServices_Remote.png)

  **Warning:** All role instances will be restarted when you first enable Remote Desktop and click OK (checkmark). To prevent a reboot, the certificate used to encrypt the password must be installed on the role.

  To prevent a restart, install a certificate and then return to this dialog (see [Using Remote Desktop with Azure Roles][] for more information). If you choose an existing certificate, then a configuration update will be sent to all the instances in the role.

3. In **Roles**, select the role you want to update or select **All** for all roles.

4. Make any of the following changes:

  - To enable Remote Desktop, select the **Enable Remote Desktop** check box. To disable Remote Desktop, clear the check box.

  - Create an account to use in Remote Desktop connections to the role instances.

  - Update the password for the existing account.

  - Select an uploaded certificate to use for authentication (upload the certificate using **Upload** on the **Certificates** page) or create a new certificate. 

  - Change the expiration date for the Remote Desktop configuration.

5. When you finish your configuration updates, click **OK** (checkmark).

6. To connect to a role instance:

  a. Click **Instances** to open the **Instances** page.

  b. Select a role instance that has Remote Desktop configured.

  c. Click **Connect**, and follow the instructions to open the desktop. 

  d. Click **Open** and then **Connect** to start the Remote Desktop connection.

### To disable Remote Access for role instances in the Management Portal

1. Click **Cloud Services**, click the name of the cloud service, and then click **Configure**.

2. Click **Remote**.

3. In **Roles**, select the role you want to update or select **All** for all roles.

4. Un-check, or clear, the **Enable Remote Desktop** check box.

5. Click **OK** (checkmark).

[Set Up a Remote Desktop Connection for a Role in Azure]: http://msdn.microsoft.com/library/windowsazure/hh124107.aspx

[Using Remote Desktop with Azure Roles]: http://msdn.microsoft.com/library/windowsazure/gg443832.aspx
			
