<properties
linkid=dev-node-remotedesktop
urlDisplayName=Enable Remote Desktop
headerExpose=
pageTitle=Enable Remote Desktop - Node.js - Develop
metaKeywords=Azure Node.js remote access, Azure Node.js remote connection, Azure Node.js VM access, Azure Node.js virtual machine access
footerExpose=
metaDescription=Learn how to enable remote-desktop access for the virtual machines hosting your Windows Azure Node.js application. 
umbracoNaviHide=0
disqusComments=1
/>
<h1>Enabling Remote Desktop in Windows Azure</h1>
<p>Remote Desktop enables you to access the desktop of a role instance running in Windows Azure. You can use a remote desktop connection to configure the virtual machine or troubleshoot problems with your application.</p>
<p>This task includes the following steps:</p>
<ul>
<li><a href="#step1">Step 1: Configure the service for Remote Desktop access using Windows Azure PowerShell for Node.js</a></li>
<li><a href="#step2">Step 2: Connect to the role instance</a></li>
<li><a href="#step3">Step 3: Configure the service to disable Remote Desktop access using Windows Azure PowerShell for Node.js</a></li>
</ul>
<h2><a name="step1"></a>Step 1: Configure the service for Remote Desktop access using Windows Azure PowerShell for Node.js</h2>
<p>To use Remote Desktop, you need to configure your service definition and service configuration with a username, password, and certificate to authenticate with role instances in the cloud. <a href="http://go.microsoft.com/?linkid=9790229&amp;clcid=0x409">Windows Azure PowerShell for Node.js</a> includes the <strong>Enable-AzureRemoteDesktop</strong> cmdlet, which does this configuration for you.</p>
<p>Perform the following steps from the computer where the service definition was created.</p>
<ol>
<li>
<p>From the <strong>Start</strong> menu, select <strong>Windows Azure PowerShell for Node.js</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-node-01.png"/></p>
</li>
<li>
<p>Change directory to the service directory, type <strong>Enable-AzureRemoteDesktop</strong>, and then enter a user name and password to use when authenticating with role instances in the cloud:</p>
<p><img src="/media/net/common-task-remote-desktop1-node-02.png"/></p>
</li>
<li>
<p>Publish the service configuration changes to the cloud. At the <strong>Windows Azure PowerShell for Node.js</strong> prompt, type <strong>Publish-AzureService</strong>:</p>
<p><img src="/media/net/common-task-remote-desktop1-node-03.png"/></p>
</li>
</ol>
<p>When these steps have been completed, the role instances of the service in the cloud are configured for Remote Desktop access.</p>
<h2><a name="step2"></a>Step 2: Connect to the role instance</h2>
<p>With your deployment up and running in Windows Azure, you can connect to the role instance.</p>
<ol>
<li>
<p>When the deployment status in the Windows Azure Management Portal is <strong>Ready</strong>, select an instance of the deployment, and click <strong>Connect</strong> in the <strong>Remote Access</strong> area of the portal ribbon.</p>
<p><img src="/media/net/common-task-remote-desktop1-node-10.png"/></p>
</li>
<li>
<p>When you click <strong>Connect</strong>, the web browser prompts you to save an .rdp file. If you’re using Internet Explorer, click <strong>Open</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-node-11.png"/></p>
</li>
<li>
<p>When the file is opened, the following security prompt appears:</p>
<p><img src="/media/net/common-task-remote-desktop1-node-12.png"/></p>
</li>
<li>
<p>Click <strong>Connect</strong>, and a security prompt will appear for entering credentials to access the instance. Enter the password you created in <a href="#step1">Step 1</a>, and then click <strong>OK</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-node-13.png"/></p>
</li>
</ol>
<p>When the connection is made, Remote Desktop Connection displays the desktop of the instance in Windows Azure. You have successfully gained remote access to your instance and can perform any necessary tasks to manage your application.</p>
<p><img src="/media/net/common-task-remote-desktop1-node-14.png"/></p>
<h2><a name="step3"></a>Step 3: Configure the service to disable Remote Desktop access using Windows Azure PowerShell for Node.js</h2>
<p>When you no longer require remote desktop connections to the role instances in the cloud, disable remote desktop access using the <a href="http://go.microsoft.com/?linkid=9790229&amp;clcid=0x409">Windows Azure PowerShell for Node.js</a></p>
<ol>
<li>
<p>From the <strong>Start</strong> menu, select <strong>Windows Azure PowerShell for Node.js</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-node-01.png"/></p>
</li>
<li>
<p>Change directory to the service directory, and type <strong>Disable-AzureRemoteDesktop</strong>:</p>
<p><img src="/media/net/common-task-remote-desktop1-node-04.png"/></p>
</li>
<li>
<p>Publish the service configuration changes to the cloud. At the <strong>Windows Azure PowerShell for Node.js</strong> prompt, type <strong>Publish-AzureService</strong>:</p>
<p><img src="/media/net/common-task-remote-desktop1-node-03.png"/></p>
</li>
</ol>
<h2>Additional Resources</h2>
<p><a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh124107.aspx">Remotely Accessing Role Instances in Windows Azure</a> <br /> <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg443832.aspx">Using Remote Desktop with Windows Azure Roles</a></p>