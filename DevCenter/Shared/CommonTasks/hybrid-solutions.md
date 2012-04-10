<properties
linkid=dev-node-remotedesktop
urlDisplayName=Enable Remote Desktop
headerExpose=
pageTitle=Enable Remote Desktop - PHP - Develop
metaKeywords=Azure PHP remote access, Azure PHP remote connection, Azure PHP VM access, Azure PHP virtual machine access
footerExpose=
metaDescription=Learn how to enable remote-desktop access for the virtual machines hosting your Windows Azure PHP application.
umbracoNaviHide=0
disqusComments=1
/>
<h1>Enabling Remote Desktop in Windows Azure</h1>
<p>Remote Desktop enables you to access the desktop of a role instance running in Windows Azure. You can use a remote desktop connection to configure the virtual machine or troubleshoot problems with your application.</p>
<p>This task includes the following steps:</p>
<ul>
<li><a href="#step1">Step 1: Create a self-signed PFX certificate</a></li>
<li><a href="#step2">Step 2: Modify the service definition and configuration files</a></li>
<li><a href="#step3">Step 3: Upload the deployment package and certificate</a></li>
<li><a href="#step4">Step 4: Connect to the role instance</a></li>
</ul>
<h2><a name="step1"></a>Step 1: Create a self-signed PFX certificate</h2>
<p>To use Remote Desktop, you need to create a self-signed Personal Information Exchange (PFX) certificate that is used to authenticate you to the role instance. This certificate is uploaded to Windows Azure with your deployment, and any computer that you use to access the deployment remotely must have the certificate installed.</p>
<p>Perform the following steps on the computer you want to use to access the role instance remotely, such as your development computer with the Windows Azure SDK installed.</p>
<ol>
<li>
<p>From the <strong>Start</strong> menu, type <strong>inetmgr</strong> and press <strong>Enter</strong>. The Internet Information Services (IIS) Manager snap-in appears.</p>
</li>
<li>
<p>In the <strong>IIS</strong> section, click <strong>Server Certificates</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-01.png"/></p>
</li>
<li>
<p>On the <strong>Actions</strong> menu on the right, click <strong>Create Self-Signed Certificate</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-02.png"/></p>
</li>
<li>
<p>In the <strong>Create Self-Signed Certificate</strong> dialog box, enter a name for your certificate, and then click <strong>OK</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-03.png"/></p>
</li>
<li>
<p>The new certificate appears in the list of certificates. Click the new certificate, and then click <strong>Export</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-04.png"/></p>
</li>
<li>
<p>In the <strong>Export Certificate</strong> dialog box, choose an export location, a password for the certificate, and then click <strong>OK</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-05.png"/></p>
</li>
</ol>
<p>When these steps have been completed, the resulting PFX certificate can be uploaded to Windows Azure.</p>
<h2><a name="step2"></a>Step 2: Modify the service definition and configuration files</h2>
<p>Now that your certificate has been created, you need to configure the service definition and service configuration files to use it. The service definition file must be updated to import the <strong>Remote Access</strong> and <strong>Remote Forwarder</strong> modules, and the service configuration file must be updated to include the thumbprint of the certificate.</p>
<ol>
<li>
<p>If your service definition file does not already include the <strong>Imports</strong> section, add it within the <strong>WebRole</strong> element. Then, add the following modules to the <strong>Imports</strong> section:</p>
<pre class="brush: csharp;">&lt;Imports&gt;
	&lt;Import moduleName="RemoteAccess"/&gt;
	&lt;Import moduleName="RemoteForwarder"/&gt;
&lt;/Imports&gt;
</pre>
</li>
<li>
<p>In your service configuration file, add the following two settings within the <strong>ConfigurationSettings</strong> section:</p>
<pre class="brush: csharp;">&lt;Role name=�Deployment&gt;
&lt;ConfigurationSettings&gt;
     		&lt;Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.Enabled" value="" /&gt;
      		&lt;Setting name="Microsoft.WindowsAzure.Plugins.RemoteForwarder.Enabled" value="" /&gt;
&lt;/ConfigurationSettings&gt;
...
	&lt;/Role&gt;
</pre>
</li>
<li>
<p>The service configuration file also requires the thumbprint of the .pfx certificate you created earlier. Add a certificate entry to the &lt;Certificates&gt; section as shown, replacing the sample thumbprint value below with your own:</p>
<pre class="brush: csharp;">&lt;Role name="Deployment&gt;
	...
&lt;Certificates&gt;
      		&lt;Certificate name="Microsoft.WindowsAzure.Plugins.RemoteAccess.PasswordEncryption" thumbprint="?9427befa18ec6865a9ebdc79d4c38de50e6316ff" thumbprintAlgorithm="sha1" /&gt;
    	&lt;/Certificates&gt;
&lt;/Role&gt;
</pre>
</li>
<li>
<p>Now that the service definition and service configuration files have been updated, package your deployment for uploading to Windows Azure. If you are using <strong>cspack</strong>, ensure that you don't use the <strong>/generateConfigurationFile</strong> flag, as that will overwrite the certificate information you just inserted.</p>
</li>
</ol>
<p>Now that you've updated your package with information about the certificate, the next step is to upload the package and certificate to Windows Azure.</p>
<h2><a name="step3"></a>Step 3: Upload the deployment package and certificate</h2>
<p>Your certificate has been created and your package has been updated to use the certificate. Now you must upload the package and certificate to Windows Azure with the Management Portal.</p>
<ol>
<li>
<p>Log on to the <a href="http://windows.azure.com/" target="_blank">Windows Azure Management Portal</a>.</p>
</li>
<li>
<p>Click <strong>New Hosted Service</strong>, add the required information about your hosted service, and then click <strong>Add Certificate</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-06.png"/></p>
</li>
<li>
<p>In the <strong>Upload Certificates</strong> dialog box, enter the location for the PFX certificate you created earlier, the password for the certificate, and then click <strong>OK</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-07.png"/></p>
</li>
<li>
<p>Click <strong>OK</strong> to create your hosted service. When the deployment has reached the <strong>Ready</strong> status, you can proceed to the next steps.</p>
</li>
</ol>
<p>You have now deployed the application in a hosted service and uploaded the certificate that Windows Azure will use to authorize remote connections.</p>
<h2><a name="step4"></a>Step 4: Connect to the role instance</h2>
<p>With your deployment up and running in Windows Azure, you need to enable remote access, then connect to the role instance.</p>
<ol>
<li>
<p>In the Management Portal, select the role in the deployment that you configured for remote access, and then click the <strong>Enable</strong> check box in the <strong>Remote Access</strong> area of the portal ribbon.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-08.png"/></p>
</li>
<li>
<p>In the Set Remote Desktop Credentials dialog box, enter the username and password for the Remote Desktop Connection when accessing a deployment instance. Select the certificate you uploaded when you created the hosted service earlier, set the desired expiration time, and then click <strong>OK</strong>.</p>
<p>It may take a few seconds to enable Remote Desktop for the deployment; during this time its status is <strong>Updating</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-09.png"/></p>
</li>
<li>
<p>When the deployment status is <strong>Ready</strong>, select an instance of the deployment, and then click <strong>Connect</strong> in the <strong>Remote Access</strong> area of the portal ribbon.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-10.png"/></p>
</li>
<li>
<p>When you click <strong>Connect</strong>, the web browser prompts you to save an .rdp file. If you're using Internet Explorer, click <strong>Open</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-11.png"/></p>
</li>
<li>
<p>When the file is opened, a security prompt appears. Click <strong>Connect</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-12.png"/></p>
</li>
<li>
<p>Click <strong>Connect</strong>, and a security prompt will appear for entering credentials to access the instance. Enter the password for the account you created, and then click <strong>OK</strong>.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-13.png"/></p>
</li>
</ol>
<p>When the connection is made, Remote Desktop Connection displays the desktop of the instance in Windows Azure. You have successfully gained remote access to your instance and can perform any necessary tasks to manage your application.</p>
<p><img src="/media/net/common-task-remote-desktop1-nondotnet-14.png"/></p>
<h2>Additional Resources</h2>
<ul>
<li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh124107.aspx">Remotely Accessing Role Instances in Windows Azure</a></li>
<li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg443832.aspx">Using Remote Desktop with Windows Azure Roles</a></li>
</ul>