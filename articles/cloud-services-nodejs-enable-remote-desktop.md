<properties 
	pageTitle="Enable remote desktop for cloud services (Node.js)" 
	description="Learn how to enable remote-desktop access for the virtual machines hosting your Azure Node.js application." 
	services="cloud-services" 
	documentationCenter="nodejs" 
	authors="MikeWasson" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="cloud-services" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs" 
	ms.topic="article" 
	ms.date="02/24/2015" 
	ms.author="mwasson"/>






# Enabling Remote Desktop in Azure

Remote Desktop enables you to access the desktop of a role instance
running in Azure. You can use a remote desktop connection to
configure the virtual machine or troubleshoot problems with your
application.

> [AZURE.NOTE] This article applies to node applications hosted as an Azure Cloud Service.


## Step 1: Use Azure PowerShell to configure the service for Remote Desktop access

To use Remote Desktop, you need to configure your service definition and
service configuration with a username, password, and certificate to
authenticate with role instances in the cloud. [Azure PowerShell] includes the **Enable-AzureServiceProjectRemoteDesktop** cmdlet, which
does this configuration for you.

Perform the following steps from the computer where the service
definition was created.

1.  From the **Start** menu, select **Azure PowerShell**.

	![Azure PowerShell start menu entry][powershell-menu]

2.  Change directory to the service directory, type
    **Enable-AzureServiceProjectRemoteDesktop**, and then enter a user name and
    password to use when authenticating with role instances in the
    cloud.

	![enable-azureserviceprojectremotedesktop][enable-rdp]

3.  Publish the service configuration changes to the cloud. At the
    **Azure PowerShell** prompt, type
    **Publish-AzureServiceProject**.

	![publish-azureserviceproject][publish-project]

When these steps have been completed, the role instances of the service
in the cloud are configured for Remote Desktop access.

## Step 2: Connect to the role instance

With your deployment up and running in Azure, you can connect to
the role instance.

1.  In the [Azure Management Portal], select **Cloud Services** and then the service deployed in Step 1 above

	![azure management portal][cloud-services]

2.  Click **Instances**, and then click **Production** or **Staging** to see the instances for your service. Select an instance and then click **Connect** at the bottom of the page.

    ![The instances page][3]

2.  When you click **Connect**, the web browser prompts you to save an
    .rdp file. If you're using Internet Explorer, click **Open**.

    ![prompt to open or save the .rdp file][4]

3.  When the file is opened, the following security prompt appears:

    ![Windows security prompt][5]

4.  Click **Connect**, and a security prompt will appear for entering
    credentials to access the instance. Enter the password you created
    in [Step 1][Step 1: Configure the service for Remote Desktop access using Azure PowerShell], and then click **OK**.

    ![username/password prompt][6]

When the connection is made, Remote Desktop Connection displays the
desktop of the instance in Azure. You have successfully gained
remote access to your instance and can perform any necessary tasks to
manage your application.

![Remote desktop session][7]

## Step 3: Configure the service to disable Remote Desktop access 

When you no longer require remote desktop connections to the role
instances in the cloud, disable remote desktop access using the [Azure PowerShell]

1.  From the **Start** menu, select **Azure PowerShell**.

2.  Change directory to the service directory, and type
    **Disable-AzureServiceProjectRemoteDesktop**:

3.  Publish the service configuration changes to the cloud. At the
    **Azure PowerShell** prompt, type
    **Publish-AzureServiceProject**:

## Additional Resources

- [Remotely Accessing Role Instances in Azure] 
- [Using Remote Desktop with Azure Roles]


  [Azure PowerShell]: http://go.microsoft.com/?linkid=9790229&clcid=0x409

[Azure Management Portal]: http://manage.windowsazure.com
[powershell-menu]: ./media/cloud-services-nodejs-enable-remote-desktop/azure-powershell-menu.png
[publish-project]: ./media/cloud-services-nodejs-enable-remote-desktop/publish-rdp.png
[enable-rdp]: ./media/cloud-services-nodejs-enable-remote-desktop/enable-rdp.png
[cloud-services]: ./media/cloud-services-nodejs-enable-remote-desktop/cloud-services-remote.png
  [3]: ./media/cloud-services-nodejs-enable-remote-desktop/cloud-service-instance.png
  [4]: ./media/cloud-services-nodejs-enable-remote-desktop/rdp-open.png
  [5]: ./media/cloud-services-nodejs-enable-remote-desktop/remote-desktop-12.png
  [6]: ./media/cloud-services-nodejs-enable-remote-desktop/remote-desktop-13.png
  [7]: ./media/cloud-services-nodejs-enable-remote-desktop/remote-desktop-14.png
  
  [Remotely Accessing Role Instances in Azure]: http://msdn.microsoft.com/library/windowsazure/hh124107.aspx
  [Using Remote Desktop with Azure Roles]: http://msdn.microsoft.com/library/windowsazure/gg443832.aspx
