<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-net-commons-tasks-remote-desktop" urlDisplayName="Remote Desktop" headerExpose="" pageTitle="Enable Remote Desktop - .NET - Develop" metaKeywords="Azure remote access, Azure remote connection, Azure VM access, Azure virtual machine access, Azure .NET remote access, Azure .NET remote connection, Azure .NET VM access, Azure .NET virtual machine access, Azure C# remote access, Azure C# remote connection, Azure C# VM access, Azure C# virtual machine access, Azure Visual Studio remote access, Azure Visual Studio remote connection" footerExpose="" metaDescription="Learn how to enable remote-desktop access for the virtual machines hosting your Windows Azure application. " umbracoNaviHide="0" disqusComments="1" />
  <h1>Enabling Remote Desktop in Windows Azure with Visual Studio</h1>
  <p>Remote Desktop enables you to access the desktop of a role instance running in Windows Azure. You can use a remote desktop connection to configure the virtual machine or troubleshoot problems with your application. Windows Azure Tools for Microsoft Visual Studio, which is included in Windows Azure SDK for .NET, lets you configure Remote Desktop Services from a Windows Azure project in Visual Studio.</p>
  <p>This task includes the following steps:</p>
  <ul>
    <li>
      <a href="#step1">Step 1: Configure Remote Desktop connections</a>
    </li>
    <li>
      <a href="#step2">Step 2: Publish the application</a>
    </li>
    <li>
      <a href="#step3">Step 3: Connect to the role instance</a>
    </li>
  </ul>
  <h2>Step 1: Configure Remote Desktop connections</h2>
  <p>When you are working on a Windows Azure project in Visual Studio, you have the option of configuring Remote Desktop for the application's role instances, which would allow you to remotely connect to the role instances after the application has been published.</p>
  <p>
    <strong>Note: </strong>To perform this step, you need an application that's ready to be published.</p>
  <ol>
    <li>
      <p>In a Windows Azure project in Visual Studio 2010, open Solution Explorer, right-click the name of your project, and then click <strong>Configure Remote Desktop</strong>.<br /><br /> The <strong>Remote Desktop Configuration</strong> dialog box appears.</p>
      <img src="../../../DevCenter/dotNet/Media/remote-desktop-01.png" />
    </li>
    <li>In the <strong>Remote Desktop Configuration</strong> dialog box, select the <strong>Enable connections for all roles</strong> check box.</li>
    <li>In the certificate drop-down list, leave it on <strong>Automatic</strong>, which means an appropriate certificate from your current certificate store will be automatically selected or a new one will be created if an appropriate one doesn't exist. Alternatively, you can pick a certificate to use or create a new one.</li>
    <li>In the <strong>User name</strong>, <strong>Password</strong>, and <strong> Confirm password</strong> fields, enter the user name and password you want to use to remotely log on to a role instance.</li>
    <li>(Optional) In the <strong>Account expiration date</strong> field, enter a date for the user account to expire on the role instances.</li>
    <li>Click <strong>OK</strong>.</li>
  </ol>
  <p>Visual Studio then inserts remote desktop settings and certificate details into the service configuration and service definition files for your application.</p>
  <h2>
    <a name="step2">
    </a>Step 2: Publish the application</h2>
  <p>To move the remote desktop settings in your service configuration and service definition files to Windows Azure and to upload the certificate required by Remote Desktop connections, you need to publish the application.</p>
  <ol>
    <li>
      <p>In Solution Explorer, right-click the name of your project, and click <strong>Publish</strong>.<br /> The <strong>Publish Windows Azure Application</strong> wizard appears.</p>
      <img src="../../../DevCenter/dotNet/Media/remote-desktop-02.png" />
    </li>
    <li>On the <strong>Windows Azure Publish Sign In</strong> page, select the named authentication credentials you want to use, and then click <strong>Next</strong>. For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ff683676.aspx">Setting Up Named Authentication Credentials</a>.</li>
    <li>On the <strong>Windows Azure Publish Settings</strong> page, select the hosted service in which to publish the application, production or staging environment, the build configuration, and the service configuration. Make sure <strong>Remote desktop connections for all roles</strong> is selected, and then click <strong>Next</strong>.</li>
    <li>On the <strong>Windows Azure Publish Summary</strong> page, review the settings, and then click <strong>Publish</strong>.</li>
  </ol>
  <p>Visual Studio starts the publishing process of packaging the application and then deploying it to Windows Azure. After several minutes, the deployment is completed.</p>
  <h2>
    <a name="step3">
    </a>Step 3: Connect to the role instance</h2>
  <p>After the application is deployed, you use the Windows Azure Management Portal to initiate the connection to one of the role instances.</p>
  <ol>
    <li>Open the <a href="http://windows.azure.com/">Windows Azure Management Portal</a>.</li>
    <li>In the lower navigation pane of the Management Portal, click <strong>Hosted Services, Storage Accounts, &amp; CDN</strong>.</li>
    <li>In the upper navigation pane, click <strong>Hosted Services</strong>. The hosted service in which your newly deployed application is running appears in the portal listed under your subscription.</li>
    <li>
      <p>Under the deployment, select a role instance, and then click <strong>Connect</strong>.</p>
      <img src="../../../DevCenter/dotNet/Media/remote-desktop-03.png" />
    </li>
    <li>
      <p>When prompted to open or save the .rdp file, click <strong>Open</strong>.</p>
      <img src="../../../DevCenter/dotNet/Media/remote-desktop-04.png" />
    </li>
    <li>
      <p>If you receive the Remote Desktop Connection security warning, click <strong>Connect</strong>.</p>
      <img src="../../../DevCenter/dotNet/Media/remote-desktop-05.png" />
    </li>
    <li>
      <p>In the <strong>Windows Security</strong> dialog box, enter the user name and password that you specified when you configured the Remote Desktop Connection settings in Visual Studio earlier, and then click <strong>OK</strong>.</p>
      <img src="../../../DevCenter/dotNet/Media/remote-desktop-06.png" />
    </li>
  </ol>
  <p>The Remote Desktop Connection session opens on the Windows Azure role instance.</p>
  <p>Congratulations! You have successfully enabled Remote Desktop Connection for your role instances and can log on to them whenever you need to manage your application on the instance itself.</p>
  <h2>Additional Resources</h2>
  <ul>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh124107.aspx">Remotely Accessing Role Instances in Windows Azure</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg443832.aspx">Using Remote Desktop with Windows Azure Roles</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh403987.aspx">Uploading Certificates and Encrypting Passwords for Remote Desktop Connections</a>
    </li>
  </ul>
</body>