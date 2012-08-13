<properties linkid="dev-node-remotedesktop" urldisplayname="Enable Remote Desktop" headerexpose="" pagetitle="Enable Remote Desktop - Node.js - Develop" metakeywords="Azure Node.js remote access, Azure Node.js remote connection, Azure Node.js VM access, Azure Node.js virtual machine access" footerexpose="" metadescription="Learn how to enable remote-desktop access for the virtual machines hosting your Windows Azure Node.js application. " umbraconavihide="0" disquscomments="1"></properties>

# Enabling Remote Desktop in Windows Azure

Remote Desktop enables you to access the desktop of a role instance
running in Windows Azure. You can use a remote desktop connection to
configure the virtual machine or troubleshoot problems with your
application.

<div class="dev-callout">
	<b>Note</b>
	<p>The steps in this article only apply to node applications hosted in a Windows Azure Cloud Service.</p>
	</div>

This task includes the following steps:

-   [Step 1: Configure the service for Remote Desktop access using Windows Azure PowerShell]
-   [Step 2: Connect to the role instance]
-   [Step 3: Configure the service to disable Remote Desktop access
    using Windows Azure PowerShell]

## <a name="step1"> </a>Step 1: Configure the service for Remote Desktop access using Windows Azure PowerShell

To use Remote Desktop, you need to configure your service definition and
service configuration with a username, password, and certificate to
authenticate with role instances in the cloud. [Windows Azure PowerShell] includes the **Enable-AzureServiceProjectRemoteDesktop** cmdlet, which
does this configuration for you.

Perform the following steps from the computer where the service
definition was created.

1.  From the **Start** menu, select **Windows Azure PowerShell**.

	![Windows Azure PowerShell start menu entry][powershell-menu]

2.  Change directory to the service directory, type
    **Enable-AzureServiceProjectRemoteDesktop**, and then enter a user name and
    password to use when authenticating with role instances in the
    cloud.

	![enable-azureserviceprojectremotedesktop][enable-rdp]

3.  Publish the service configuration changes to the cloud. At the
    **Windows Azure PowerShell** prompt, type
    **Publish-AzureServiceProject**.

	![publish-azureserviceproject][publish-project]

When these steps have been completed, the role instances of the service
in the cloud are configured for Remote Desktop access.

## <a name="step2"> </a>Step 2: Connect to the role instance

With your deployment up and running in Windows Azure, you can connect to
the role instance.

1.  In the [Windows Azure Management Portal], select **Cloud Services** and then the service deployed in Step 1 above

	![azure management portal][cloud-services]

2.  Click **Instances**, and then click **Production** or **Staging** to see the instances for your service. Select an instance and then click **Connect** at the bottom of the page.

    ![The instances page][3]

2.  When you click **Connect**, the web browser prompts you to save an
    .rdp file. If you’re using Internet Explorer, click **Open**.

    ![prompt to open or save the .rdp file][4]

3.  When the file is opened, the following security prompt appears:

    ![Windows security prompt][5]

4.  Click **Connect**, and a security prompt will appear for entering
    credentials to access the instance. Enter the password you created
    in [Step 1][Step 1: Configure the service for Remote Desktop access using Windows Azure PowerShell], and then click **OK**.

    ![username/password prompt][6]

When the connection is made, Remote Desktop Connection displays the
desktop of the instance in Windows Azure. You have successfully gained
remote access to your instance and can perform any necessary tasks to
manage your application.

![Remote desktop session][7]

## <a name="step3"> </a>Step 3: Configure the service to disable Remote Desktop access using Windows Azure PowerShell

When you no longer require remote desktop connections to the role
instances in the cloud, disable remote desktop access using the [Windows Azure PowerShell]

1.  From the **Start** menu, select **Windows Azure PowerShell**.

2.  Change directory to the service directory, and type
    **Disable-AzureServiceProjectRemoteDesktop**:

3.  Publish the service configuration changes to the cloud. At the
    **Windows Azure PowerShell** prompt, type
    **Publish-AzureServiceProject**:

## Additional Resources

- [Remotely Accessing Role Instances in Windows Azure] 
- [Using Remote Desktop with Windows Azure Roles]

  [Step 1: Configure the service for Remote Desktop access using Windows Azure PowerShell]: #step1
  [Step 2: Connect to the role instance]: #step2
  [Step 3: Configure the service to disable Remote Desktop access using Windows Azure PowerShell]: #step3
  [Windows Azure PowerShell]: http://go.microsoft.com/?linkid=9790229&clcid=0x409

[Windows Azure Management Portal]: http://manage.windowsazure.com
[powershell-menu]: ../../Shared/Media/azure-powershell-menu.png
[publish-project]: ../Media/publish-rdp.png
[enable-rdp]: ../Media/enable-rdp.png
[cloud-services]: ../../Shared/Media/cloud-services-remote.png
  [3]: ../../Shared/Media/cloud-service-instance.png
  [4]: ../../Shared/Media/rdp-open.png
  [5]: ../Media/remote-desktop-12.png
  [6]: ../Media/remote-desktop-13.png
  [7]: ../Media/remote-desktop-14.png
  [8]: ../Media/remote-desktop-04.png
  [Remotely Accessing Role Instances in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh124107.aspx
  [Using Remote Desktop with Windows Azure Roles]: http://msdn.microsoft.com/en-us/library/windowsazure/gg443832.aspx
