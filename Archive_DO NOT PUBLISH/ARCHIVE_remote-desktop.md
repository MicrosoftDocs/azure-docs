<properties linkid="dev-net-commons-tasks-remote-desktop" urlDisplayName="Remote Desktop" pageTitle="Enable remote desktop for cloud services - Windows Azure" metaKeywords="Azure remote access, Azure remote connection, Azure VM access, Azure virtual machinesAzure .NET remote access,  Azure C# remote access, Azure Visual Studio remote access" metaDescription="Learn how to enable remote-desktop access for the virtual machines hosting your Windows Azure application. " metaCanonical="" disqusComments="1" umbracoNaviHide="0" />



# Enabling Remote Desktop in Windows Azure with Visual Studio

Remote Desktop enables you to access the desktop of your Windows Azure Virtual Machines and your Windows Azure Cloud Services. You can use a remote desktop connection to configure the virtual machine or troubleshoot problems with your application.

<div class="dev-callout-new">
    <strong>Note <span>Click to collapse</span></strong>
    <div class="dev-callout-content">
        <p>This article applies to Windows Azure Cloud Services.</p>
        <p>For details about connecting to a Windows Azure Virtual Machine using Remote Desktop, see <a href="/en-us/manage/windows/how-to-guides/log-on-a-windows-vm/">How to long on to a virtual machine</a>.</p>
        <p>Accessing the hosting virtual machine for Windows Azure Web Sites is not supported.</p>
    </div>
</div>  

**Note:** Changes made to Windows Azure Cloud Services such as operating system configurations and installing software are not persistent. These changes will be lost if the cloud service is restarted.  

The Windows Azure Tools for Visual Studio let you configure Remote
Desktop Services for connection to a Cloud Service virtual machine from a Windows Azure project in Visual Studio.

This task includes the following steps:

-   [Step 1: Configure Remote Desktop connections][]
-   [Step 2: Publish the application][]
-   [Step 3: Connect to the role instance][]

<a id="step1"></a><h2><span class="short-header">Configure connections in VS</span>Step 1: Configure Remote Desktop connections</h2>

When you are working on a Windows Azure Cloud Service project in Visual Studio, you
have the option of configuring Remote Desktop for the application's role
instances, which would allow you to remotely connect to the role
instances after the application has been published.


1.  In Visual Studio, open Solution
    Explorer, right-click the name of your project, and then click
    **Configure Remote Desktop**.  
      
     The **Remote Desktop Configuration** dialog box appears.

    ![][0]

2.  In the **Remote Desktop Configuration** dialog box, select the
    **Enable connections for all roles** check box.
3.  Leave the certificate drop-down list value set to **Automatic**, which
    means an appropriate certificate from your current certificate store
    will be automatically selected or a new one will be created if an
    appropriate one doesn't exist. Alternatively, you can pick a
    certificate to use or create a new one.
4.  In the **User name**, **Password**, and **Confirm password** fields,
    enter the user name and password you want to use to remotely log on
    to a role instance.
5.  (Optional) In the **Account expiration date** field, enter a date
    for the user account to expire on the role instances.
6.  Click **OK**.

Visual Studio then inserts remote desktop settings and certificate
details into the service configuration and service definition files for
your application.

<a id="step2"></a><h2><span class="short-header">Publish the application</span>Step 2: Publish the application</h2>

To move the remote desktop settings in your service configuration and
service definition files to Windows Azure and to upload the certificate
required by Remote Desktop connections, you need to publish the
application.

1.  In Solution Explorer, right-click the name of your project, and
    click **Publish**.  
     The **Publish Windows Azure Application** wizard appears.

    ![][1]

2.  On the **Windows Azure Publish Sign In** page, select the named
    authentication credentials you want to use, and then click **Next**.
    
    <div class="dev-callout-new-collapsed">
    <strong>Need to set up publishing credentials? <span>Click to expand</span></strong>
    <div class="dev-callout-content">
        <p><ol>
           <li>On the <strong>Windows Azure Publish Sign In</strong> page, click the <strong>Sign in to download credentials</strong> link. You will be prompted to sign in to the Windows Azure Management Portal, and then to download a .publishsettings file.</li>
           <li>Save the .publishsettings file locally.</li>
           <li>Click the <strong>Import</strong> button and select the .publishsettings file you just downloaded.</li>
           <li>Back on the <strong>Windows Azure Publish Sign In</strong> page, the subscription associated with the .publishsettings file you just imported will be selected. Click <strong>Next</strong> to continue.</li>
           </ol></p>
    </div>
    </div>  

3.  On the **Windows Azure Publish Settings** page, select the cloud service to which you want to deploy, the production or staging
    environment, the build configuration, and the service configuration.
    Make sure **Enable Remote Desktop for all roles** is selected,
    and then click **Next**.
4.  On the **Windows Azure Publish Summary** page, review the settings,
    and then click **Publish**.

Visual Studio starts the publishing process of packaging the application
and then deploying it to Windows Azure. After several minutes, the
deployment is completed.

<a id="step3"></a><h2><span class="short-header">Connect to the instance</span>Step 3: Connect to the role instance</h2>

After the application is deployed, you use the Windows Azure Management
Portal to initiate the connection to one of the role instances.

1.  Open the [Windows Azure Management Portal][].
2.  In the lower navigation pane of the Management Portal, click
    **Hosted Services, Storage Accounts, & CDN**.
3.  In the upper navigation pane, click **Hosted Services**. The hosted
    service in which your newly deployed application is running appears
    in the portal listed under your subscription.
4.  Under the deployment, select a role instance, and then click
    **Connect**.

    ![][2]

5.  When prompted to open or save the .rdp file, click **Open**.

    ![][3]

6.  If you receive the Remote Desktop Connection security warning, click
    **Connect**.

    ![][4]

7.  In the **Windows Security** dialog box, enter the user name and
    password that you specified when you configured the Remote Desktop
    Connection settings in Visual Studio earlier, and then click **OK**.

    ![][5]

The Remote Desktop Connection session opens on the Windows Azure role
instance.

Congratulations! You have successfully enabled Remote Desktop Connection
for your role instances and can log on to them whenever you need to
manage your application on the instance itself.

<h2><span class="short-header">Next steps</span>Next steps</h2>

* [Remotely Accessing Role Instances in Windows Azure][]
* [Using Remote Desktop with Windows Azure Roles][]
* [Uploading Certificates and Encrypting Passwords for Remote Desktop Connections][]

  [Step 1: Configure Remote Desktop connections]: #step1
  [Step 2: Publish the application]: #step2
  [Step 3: Connect to the role instance]: #step3
  [0]: ../../../DevCenter/dotNet/Media/remote-desktop-01.png
  [1]: ../../../DevCenter/dotNet/Media/remote-desktop-02.png
  [Setting Up Named Authentication Credentials]: http://msdn.microsoft.com/en-us/library/windowsazure/ff683676.aspx
  [Windows Azure Management Portal]: http://manage.windowsazure.com/
  [2]: ../../../DevCenter/dotNet/Media/remote-desktop-03.png
  [3]: ../../../DevCenter/dotNet/Media/remote-desktop-04.png
  [4]: ../../../DevCenter/dotNet/Media/remote-desktop-05.png
  [5]: ../../../DevCenter/dotNet/Media/remote-desktop-06.png
  [Remotely Accessing Role Instances in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh124107.aspx
  [Using Remote Desktop with Windows Azure Roles]: http://msdn.microsoft.com/en-us/library/windowsazure/gg443832.aspx
  [Uploading Certificates and Encrypting Passwords for Remote Desktop Connections]: http://msdn.microsoft.com/en-us/library/windowsazure/hh403987.aspx
  [How to Log on to a Virtual Machine Running Windows Server 2008 R2]: https://www.windowsazure.com/en-us/manage/windows/how-to-guides/log-on-a-windows-vm/
