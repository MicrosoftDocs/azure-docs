<properties
linkid=dev-nodejs-how-to-powershell
urlDisplayName=PowerShell Cmdlets
headerExpose=
pageTitle=How to Use the Windows Azure PowerShell for Node.js
metaKeywords=Azure PowerShell Node.js, Azure PowerShell Node.js cmdlet
footerExpose=
metaDescription=Learn Windows PowerShell fundamentals and details about how to use the Windows Azure PowerShell for Node.js cmdlets.
umbracoNaviHide=0
disqusComments=1
/>
<h1>How to Use Windows Azure PowerShell for Node.js</h1>
<p>This guide describes how to use Windows PowerShell cmdlets to create, test, deploy, and manage Node.js services in Windows Azure. The scenarios covered include <strong>importing your publishing settings</strong>, <strong>creating Windows Azure services to host Node.js applications</strong>, <strong>running a service in the Windows Azure compute emulator</strong>, <strong>deploying and updating hosted services</strong>, <strong>setting deployment options for a service</strong>, and <strong>stopping, starting, and removing a service</strong>.</p>
<p><strong>Note</strong> For a detailed description of each Node.js cmdlet, see the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh689725(vs.103).aspx">Windows Azure PowerShell for Node.js Cmdlet Reference</a>.</p>
<h2>Table of Contents</h2>
<p><a href="#_What_Is_Windows">What is Windows Azure PowerShell for Node.js</a><br /> <a href="#_Get_Started_Using">Get Started Using Windows Azure PowerShell for Node.js</a><br /> <a href="#_How_to_Import">How to: Import Publishing Settings</a><br /> <a href="#_How_to_Create">How to: Create a Windows Azure Service</a><br /> <a href="#_How_to_Test">How to: Test a Service Locally in the Windows Azure Emulators</a><br /> <a href="#_How_to_Set">How to: Set Default Deployment Options for a Service</a><br /> <a href="#_How_to_Use">How to: Use a Storage Account with More than One Service</a><br /> <a href="#_How_to_Deploy">How to: Deploy a Hosted Service to Windows Azure</a><br /> <a href="#_How_To:_Update">How to: Update a Deployed Service</a><br /> <a href="#_How_to:_Scale">How to: Scale Out a Service</a><br /> <a href="#_How_to:_Stop,">How to: Stop, Start, and Remove a Service</a></p>
<h2><a id="_What_Is_Windows" name="_What_Is_Windows"></a>What Is Windows Azure PowerShell for Node.js</h2>
<p>Windows Azure PowerShell for Node.js provides a command-line environment for developing and deploying Node applications for Windows Azure through a few Windows PowerShell cmdlets.</p>
<p>The following tasks are supported:</p>
<ul>
<li>Import publishing settings to enable you to deploy services in Windows Azure.</li>
<li>Generate configuration files and a sample application for a Node hosted service. Create a Windows Azure service that contains web roles and worker roles.</li>
<li>Test your service locally using the Windows Azure compute emulator.</li>
<li>Deploy your service to the Windows Azure staging or production environment.</li>
<li>Scale and update services in Windows Azure.</li>
<li>Enable and disable remote access to service role instances.</li>
<li>Start, stop, and remove services.</li>
</ul>
<h2><a id="_Get_Started_Using" name="_Get_Started_Using"></a>Get Started Using Windows Azure PowerShell for Node.js</h2>
<p>For requirements and installation instructions for Windows Azure PowerShell for Node.js, see the <a href="http://www.windowsazure.com/en-us/develop/nodejs/tutorials/web-app-with-express/">Node.js Web Application</a> tutorial.</p>
<h3>Getting Started Using Windows PowerShell</h3>
<p>If you have not used Windows PowerShell before, the following resources can help you get started:</p>
<ul>
<li>
<p>For basic instructions, see <a href="http://msdn.microsoft.com/en-us/library/ms714409.aspx">Using Windows PowerShell</a> in the <a href="http://msdn.microsoft.com/en-us/library/aa973757.aspx">Windows PowerShell Getting Started Guide</a>.</p>
</li>
<li>
<p>While you are working in Windows PowerShell, your best source of help is the <strong>Get-Help</strong> cmdlet. The following table summarizes some common help requests. For more information, see <a href="http://msdn.microsoft.com/en-us/library/bb648604.aspx">Getting Help: Get-Help</a>, or, in Windows PowerShell, type: <strong>get-help</strong>.</p>
<table border="1" cellspacing="4" cellpadding="4">
<tbody>
<tr align="left" valign="top">
<td>
<p><strong>Cmdlet Format</strong></p>
</td>
<td>
<p><strong>Information Returned</strong></p>
</td>
</tr>
<tr align="left" valign="top">
<td>
<p>get-help</p>
</td>
<td>
<p>Displays a help topic about using the <strong>Get-Help</strong> cmdlet</p>
</td>
</tr>
<tr align="left" valign="top">
<td>
<p>get-help azure</p>
</td>
<td>
<p>Lists all cmdlets in the Windows Azure Node.js snap-in</p>
</td>
</tr>
<tr align="left" valign="top">
<td>
<p>get-help &lt;<em>cmdlet</em>&gt;</p>
</td>
<td>
<p>Displays help about a Windows PowerShell cmdlet</p>
</td>
</tr>
<tr align="left" valign="top">
<td>
<p>get-help &lt;<em>cmdlet</em>&gt; -parameter *</p>
</td>
<td>
<p>Displays parameter definitions for a cmdlet</p>
</td>
</tr>
<tr align="left" valign="top">
<td>
<p>get-help &lt;<em>cmdlet</em>&gt; -examples</p>
</td>
<td>
<p>Displays example syntax lines for a cmdlet</p>
</td>
</tr>
<tr align="left" valign="top">
<td>
<p>get-help &lt;cmdlet&gt; -full</p>
</td>
<td>
<p>Displays technical requirements for a cmdlet</p>
</td>
</tr>
</tbody>
</table>
</li>
</ul>
<h3>Getting Started Using Windows Azure PowerShell for Node.js</h3>
<p>The Node.js cmdlets have a few special requirements that are not common to all Windows PowerShell components:</p>
<ul>
<li>
<p>To deploy your Node applications in Windows Azure, you must have a Windows Azure subscription. Before you can deploy Node applications by using a Node.js cmdlet, you must download your subscription information (by using <strong>Get-AzurePublishSettings</strong>) and then import those settings (by using <strong>Import-AzurePublishSettings</strong>).</p>
</li>
<li>
<p>You must run cmdlets that act on a hosted service from within the service directory.</p>
<p>When you create a new hosted service, a service directory is created in the current directory, and the focus of the Windows PowerShell command prompt moves to the service directory. From the service directory, you can add web roles and worker roles to the service. All other cmdlets for the service can be run from any child directory of the service directory.</p>
</li>
<li>
<p>After you create and configure a new hosted service, or after you run any cmdlet that updates the configuration of a deployed service, you must run the <strong>Publish-AzureService</strong> cmdlet to publish the updates to the cloud service deployment. For example, after you run <strong>Set-AzureInstances</strong> to add additional web role instance to a service configuration, run <a id="_GoBack" name="_GoBack"></a><strong>Publish-AzureService</strong> to scale out the hosted service.</p>
<p>If you are running the deployment locally in the Windows Azure compute emulator, you must run <strong>Start-AzureEmulator</strong> again after you update the service definition file (.csdef) or the [service configuration] file (.cscfg). However, the compute emulator renders updates to the server.js and web.config files instantly.</p>
</li>
<li>
<p>Although Windows Azure PowerShell cmdlets and parameters are not case-sensitive, the following values that are entered for Node.js cmdlets are case-sensitive: service names, subscription names, storage account names, and deployment locations.</p>
</li>
</ul>
<h3>To open Windows Azure PowerShell for Node.js</h3>
<ul>
<li>
<p>On the <strong>Start</strong> menu, click <strong>All Programs</strong>, click <strong>Windows Azure SDK for Node.js</strong>, and then click <strong>Windows PowerShell for Node.js</strong>. Opening your Windows PowerShell environment this way ensures that all of the Node command-line tools are available.</p>
</li>
</ul>
<h3>Example Syntax Lines</h3>
<p>In the example syntax lines in this guide, all Node.js services are created from a C:\node folder. A C:\node folder is not required; you can create your Windows Azure services from any location. Most example syntax lines use a service named MyService, and cmdlets performed on the service are entered at the following command prompt:</p>
<pre class="prettyprint">C:\node\MyService&gt; █
</pre>
<h2><a id="_How_to_Import" name="_How_to_Import"></a>How to: Import Publishing Settings</h2>
<p>To deploy your Node applications in Windows Azure, you must have a Windows Azure subscription. If you do not have a Windows Azure subscription, see <a href="http://www.windowsazure.com/en-us/pricing/purchase-options/">purchase options</a> for Windows Azure for information.</p>
<p>Before you can deploy Node applications by using a Node.js cmdlet, you must download your subscription information (by using <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757270(vs.103).aspx">Get-AzurePublishSettings</a>) and then import those settings (by using <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757264(vs.103).aspx">Import-AzurePublishSettings</a>).</p>
<p>The <strong>Get-AzurePublishSettings</strong> cmdlet opens a web page on the <a href="https://mocp.microsoftonline.com/site/default.aspx">Microsoft Online Services Customer Portal</a> from which you can download the publishing profile. You will need to log on to the Customer Portal using the credentials for your Windows Azure account.</p>
<p><strong>Note</strong> For information about the contents of the publishing profile, see the <strong>Get-AzurePublishingSettings</strong> cmdlet in the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh689725(vs.103).aspx">Windows Azure PowerShell for Node.js Cmdlet Reference</a>.</p>
<p>When you download the publishing profile, note the path and the name of your settings file. You must provide this information when you use <strong>Import-AzurePublishSettings</strong> to import the settings. The default location and file name format is:</p>
<p>C:\Users\&lt;MyAccount&gt;\Downloads\[<em>MySubscription</em>-…]-<em>downloadDate</em>-credentials.publishsettings</p>
<p>The following example shows how to download publishing settings for your Windows Azure account.</p>
<pre class="prettyprint">Get-AzurePublishSettings
</pre>
<p>In the following example, publishing settings that were downloaded to the default path on 11-11-2011 are imported. In this case, the user is a co-administrator for the Project1 subscription in addition to his own subscription.</p>
<pre class="prettyprint">Import-AzurePublishSettings C:\Users\MyAccount\Downloads\MySubscription-Project1-11-11-2011-credentials.publishsettings
</pre>
<p>If, after you import your publish settings, you are added to other subscriptions as a co-administrator, you will need to repeat this process to download a new .publishsettings file, and then import those settings. For information about adding co-administrators to help manage services for a subscription, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg456328.aspx">How to Add and Remove Co-Administrators for Your Windows Azure Subscription</a>.</p>
<p><strong>Important</strong> You should delete the publishing profile that you downloaded using <strong>Get-AzurePublishSettings</strong> after you import those settings. The downloaded profile contains a management certificate that should not be accessed by unauthorized users. If you need information about your subscriptions, you can get it from the <a href="http://windows.azure.com/">Windows Azure Platform Management Portal</a> or the <a href="https://mocp.microsoftonline.com/site/default.aspx">Microsoft Online Services Customer Portal</a>.</p>
<h2><a id="_How_to_Create" name="_How_to_Create"></a>How to: Create a Windows Azure Service</h2>
<p>Use the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757269(vs.103).aspx">New-AzureService</a> cmdlet to create the scaffolding for a hosted service for your Node.js application.</p>
<p>The following example shows how to create a new hosted service named MyService.</p>
<pre class="prettyprint">PS C:\node&gt; New-AzureService MyService
</pre>
<p>The cmdlet creates a service subdirectory on your local computer, adds service configuration files to the service directory, and changes the focus of the Windows PowerShell command prompt to the new service directory.</p>
<p>After you create the service, you can run <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757267(vs.103).aspx">Add-AzureNodeWebRole</a> or <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757254(vs.103).aspx">Add-AzureNodeWorkerRole</a> from the service directory to configure a web role or worker role for the service.</p>
<p>When your application is deployed as a hosted service in Windows Azure, it runs as one or more <em>roles.</em> A <em>role</em> simply refers to the application files and configuration. You can define one or more roles for your application, each with its own set of application files and its own configuration. A web role is customized for web application programming, while a worker role is intended to support general development and periodic or long-running processes. For more information about service roles, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg432976.aspx">Overview of Creating a Hosted Service for Windows Azure</a>.</p>
<p>You can run either of these cmdlets with no parameters to create a single role instance with the name WebRole1 or WorkerRole1. Use the <strong>-Name</strong> parameter to use a different role name.</p>
<p>For each role in your application, you can specify the number of virtual machines, or <em>role instances</em>, to deploy using the <strong>-Instances</strong> option.</p>
<p>The following example shows how to use the <strong>Add-AzureNodeWebRole</strong> cmdlet to create a new web role named <strong>MyWebRole</strong> that has two instances.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Add-AzureNodeWebRole MyWorkerRole -I 2
</pre>
<h2><a id="_How_to_Test" name="_How_to_Test"></a>How to: Test a Service Locally in the Windows Azure Emulators</h2>
<p>The <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757255(vs.103).aspx">Start-AzureEmulator</a> cmdlet starts the service in the Windows Azure compute emulator and also starts the Windows Azure storage emulator. You can use the compute emulator to test the service locally before you deploy the service to Windows Azure. You can use the storage emulator to test storage locally before your application consumes Windows Azure storage services.</p>
<p>If your application includes a web role, you can use the <strong>–Launch</strong> parameter to open the web role in a browser.</p>
<p>The following example runs the MyService application in the compute emulator and opens the web role in a browser.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Start-AzureEmulator -Launch
</pre>
<p>After you finish testing an application locally, run the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757258(vs.103).aspx">Stop-AzureEmulator</a> cmdlet to stop the Windows Azure compute emulator, as shown below.</p>
<p>The following example shows how to use <strong>Stop-AzureEmulator</strong> to stop the emulator.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Stop-AzureEmulator
</pre>
<h2><a id="_How_to_Set" name="_How_to_Set"></a>How to: Set Default Deployment Options for a Service</h2>
<p>You can use the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757261(vs.103).aspx">Set-AzureDeploymentLocation</a>, <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757252(vs.103).aspx">Set-AzureDeploymentSlot</a>, <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757253(vs.103).aspx">Set-AzureDeploymentSubscription</a>, and <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757268(vs.103).aspx">Set-AzureDeploymentStorage</a> cmdlets to set the default deployment location, slot (Staging or Production), Windows Azure subscription, and storage account to use when you deploy a service. The default options apply to an individual service. You can run the cmdlets from anywhere in the service directory.</p>
<p>These options take effect when you next deploy the service (using <strong>Publish-AzureService</strong>). If you want to override a default deployment option during a service deployment, you can use a parameter for the <strong>Publish-AzureService</strong> cmdlet.</p>
<p>If you have not set a default deployment option and you do not specify a deployment option to use when you publish the service, the service is deployed using the following settings:</p>
<table border="1" cellspacing="4" cellpadding="4">
<tbody>
<tr align="left" valign="top">
<td valign="bottom">
<p><strong>Setting</strong></p>
</td>
<td valign="bottom">
<p><strong>Default Value</strong></p>
</td>
</tr>
<tr align="left" valign="top">
<td>
<p>Location</p>
</td>
<td>
<p>Randomly assigns the service to either South Central US or North Central US.</p>
</td>
</tr>
<tr align="left" valign="top">
<td>
<p>Slot</p>
</td>
<td>
<p>Deploys the service to a production slot.</p>
</td>
</tr>
<tr align="left" valign="top">
<td>
<p>Subscription</p>
</td>
<td>
<p>Uses the first subscription in your publishing profile. If you are an administrator for more than one subscription, you should specify a subscription to ensure that the intended subscription is used.</p>
</td>
</tr>
<tr align="left" valign="top">
<td>
<p>Storage account</p>
</td>
<td>
<p>Creates a new storage account that has the same name as the service, If the name has been used for a storage account for any other subscription, the deployment fails. In that case, you must specify a storage account to use for the service.</p>
</td>
</tr>
</tbody>
</table>
<p>In the following example, the default deployment location for the MyService service is set to Southeast Asia:</p>
<pre class="prettyprint"> PS C:\node\MyService&gt; Set-AzureDeploymentLocation "Southeast Asia"
</pre>
<p>By default a service is published to a production slot, where it is assigned a friendly URL based on the service name (http://<em>MyService</em>.cloudapp.net). If you prefer to deploy the service to a staging slot for testing before you deploy to production, you can set the default deployment slot to Staging.</p>
<p>The following example sets the default deployment slot for the MyService service to Staging.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Set-AzureDeploymentSlot -Slot Staging
</pre>
<p>You only need to set a deployment subscription for a service if you are an administrator for more than one Windows Azure subscription. If you have been assigned as a co-administrator for subscriptions other than your own subscription, use the <strong>Set-AzureDeploymentSubscription</strong> cmdlet to specify which subscription to use for a service.</p>
<p>The following example sets the ContosoFinanace subscription as the default subscription to use for the MyService service.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Set-AzureDeploymentSubscription Contoso_Finance</pre>
<h2><a id="_How_to_Use" name="_How_to_Use"></a>How to: Use a Storage Account with More Than One Service</h2>
<p>When you deploy a new service, by default, a new storage account is created in the deployment location, and the application package and configuration files are copied to the Windows Azure Blob service using that storage account. The new storage account has the same name and location as the service, and it is associated with the subscription that was used to deploy the service.</p>
<p>If you want to use an existing storage account with a service, you can use the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757268(vs.103).aspx">Set-AzureDeploymentStorage</a> cmdlet to specify that storage account as the default storage account for service deployments, or you can use the <strong>-Storage</strong> parameter for <strong>Publish-AzureService</strong> to specify the storage account for the current service deployment.</p>
<p>To find out which storage accounts are available for your Windows Azure subscription, run the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757259(vs.103).aspx">Get-AzureStorageAccounts</a> cmdlet. If you are a co-administrator for more than one subscription, use the <strong>-Subscription</strong> parameter to specify which subscription to retrieve the storage information for. The cmdlet retrieves the storage account name and access keys for each storage account.</p>
<p><strong>Note</strong> For information about creating, managing, and deleting storage accounts, <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh531567.aspx">How to: Manage Storage Accounts for a Windows Azure Subscription</a>.</p>
<p>In the following example, a service co-administrator retrieves storage account information for the ContosoFinance subscription.</p>
<pre class="prettyprint"> PS C:\ &gt; Get-AzureStorageAccounts -Subscription ContosoFinance

Account Name: ContosoUS
Primary Key: YSAwVSjixHpcsK/IX7cRcqzVVa19YCUEhzndhZMZL9aMmNT2Du1DPiufPDBiJUO7FW4Dcb7tkzw14VoK0EppnA==
Secondary Key: OBlsaR6A4untNNwuhHDkWkcI7pKwTEPA9JYO/Jv2m/zERqrtMjUGVpz8xRZ2mTPp5qksu9K2JawAo5rEKDaL+w==
Account Name: ContosoAsia
Primary Key: OzAqwcrrtHa4/5qUyekSRK1F257PrzQHE+i4TJc38MHDBDNjZesbbftfm5tta2rsNH0SM7DEnlqt9PW70AB1VA==
Secondary Key: xjCQHNwgedo/RXMOk1PKqRHiEpox001/H+qgl/OphoKzOoQTzR/FAGGobsf5HgjE35lfPAD0KeApGFv4ga0hhw==
</pre>
<p>The co-administrator then sets ContosoUS as the default storage account to use for the MyService service, running the cmdlet from the MyService service directory.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Set-AzureDeploymentStorage -StorageAccountName ContosoUS
</pre>
<h2><a id="_How_to_Deploy" name="_How_to_Deploy"></a>How to: Deploy a Hosted Service to Windows Azure</h2>
<p>When you are ready to deploy your service to Windows Azure, use the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757266(vs.103).aspx">Publish-AzureService</a> cmdlet. When you deploy a new hosted service, Windows Azure performs the following tasks:</p>
<ol>
<li>
<p>Packages the source and configuration files into a service package (.cspkg file).</p>
</li>
<li>
<p>Creates a new hosted service.</p>
</li>
<li>
<p>If no storage account is specified, creates a new storage account if needed.</p>
</li>
<li>
<p>Copies the service package and configuration files to the Windows Azure blob store for the storage account.</p>
</li>
<li>
<p>Creates the hosted service and deployment using the uploaded service package.</p>
</li>
</ol>
<p>Use the following parameters to specify deployment options for the current deployment.</p>
<h3>Changing the service name</h3>
<p>The service name must be unique within Windows Azure. If the name you gave the service when you created it is not unique, you can use the <strong>-Name</strong> parameter to assign a new name.</p>
<p>In the following example, the service name is changed to MyService01 when the service is deployed. The name of the service directory does not change, but the service will be known in Windows Azure as MyService01.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Publish-AzureService -Name MyService01
</pre>
<p><strong>Note</strong> If you specify a service name that is not unique in Windows Azure, the service deployment fails, and you will see the following error: "Publish-AzureService : The remote server returned an unexpected response: (409) Conflict."</p>
<h3>Setting a subscription for this deployment</h3>
<p>You only need to use the <strong>-Subscription</strong> parameter if you are an administrator for more than one Windows Azure subscription. In that case, it is recommended that you include this parameter to ensure that you use the intended subscription with the service.</p>
<p>In the following example, the Contoso_Finance subscription is used to deploy the MyService service.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Publish-AzureService -Subscription Contoso_Finance
  </pre>
<h3>Specifying the location for this deployment</h3>
<p>Use the <strong>-Location</strong> parameter to specify a geographic region for the service deployment. If you have not set a default deployment location for the service, and you do not specify a location using this parameter, the service is assigned randomly to either to North Central US or South Central US.</p>
<p>To get a list of available locations, run the following cmdlet.</p>
<pre class="prettyprint">Get-Help Publish-AzureService -Parameter location 

  -Location &lt;String&gt;
  The region in which the application will be hosted. Possible values are: An
  ywhere Asia, Anywhere Europe, Anywhere US, East Asia, North Central US, Nor
  th Europe, South Central US, Southeast Asia, West Europe. If no Location i
  s specified, the location specified in the last call to Set-AzureDeployment
  Location will be used. If no Location was ever specified, the Location wil
  l be randomly chosen from ou include this parameter to ensure that you use the intended subscription with the service.</pre>
<p> </p>
<p>In the following example, the Contoso_Finance subscription is used to deploy the MyService service.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Publish-AzureService -Subscription Contoso_Finance
  </pre>
<h3>Specifying the location for this deployment</h3>
<p>Use the <strong>-Location</strong> parameter to specify a geographic region for the service deployment. If you have not set a default deployment location for the service, and you do not specify a location using this parameter, the service is assigned randomly to either to North Central US or South Central US.</p>
<p>To get a list of available locations, run the following cmdlet.</p>
<pre class="prettyprint"> Get-Help Publish-AzureService -Parameter location 

  -Location &lt;String&gt;
  The region in which the application will be hosted. Possible values are: An
  ywhere Asia, Anywhere Europe, Anywhere US, East Asia, North Central US, Nor
  th Europe, South Central US, Southeast Asia, West Europe. If no Location i
  s specified, the location specified in the last call to Set-AzureDeployment
  Location will be used. If no Location was ever specified, the Location wil
  l be randomly chosen from 'North Central US' and 'South Central US' locatio
  ns.
  </pre>
<p>The <strong>-Location</strong> value is case-sensitive, and, because the location values have multiple words, you must enclose the location in quotation marks.</p>
<p>In the following example, the MyService service is deployed to the Anywhere US location.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Publish-AzureService -Location "Anywhere US"
</pre>
<h3>Using an existing storage account</h3>
<p>If you manage multiple services in the same location, you can include the <strong>-StorageAccountName</strong> parameter to assign an existing storage account in that location instead of creating a new storage account for the service. If you have not specified a default storage account for the service, and you do not specify a service account when you deploy the service, a new storage account is created, even if an existing storage account is available in that location. For information about creating and managing storage accounts, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh531567.aspx">How to: Manage Storage Accounts for a Windows Azure Subscription</a>.</p>
<p>In the following example, the MyService service is deployed using the StorageUS storage account for the ContosoFinance subscription.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Publish-AzureService -Subscription ContosoFinance -StorageAccountName StorageUS
</pre>
<h3>Deploying a service to staging or production</h3>
<p>Use the <strong>-Slot</strong> parameter to specify whether to deploy the service to the staging environment or the production environment in Windows Azure. By default, services are deployed to production. In Windows Azure, the staging and production environments are distinguished by the address that is used to access the service. Use the staging environment to test a service before deploying it to production, where a friendlier URL is assigned:</p>
<ul>
<li>
<p>Staging URL format: &lt;ServiceID&gt;.cloudapp.net<br /> Example: http://b8f3dd0c084a4add81e1c3345eb0af87.cloudapp.net/</p>
</li>
<li>
<p>Production URL format: &lt;ServiceName&gt;.cloudapp.net<br /> Example: http://MyService.cloudapp.net</p>
</li>
</ul>
<p>In the following example, the MyService service is deployed to the Windows Azure staging environment.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Publish-AzureService -Slot Staging
</pre>
<p><strong>Note</strong> For more information about managing staging and production deployments, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh386336.aspx">Overview of Managing Deployments in Windows Azure</a>.</p>
<h3>Opening the web role in a browser</h3>
<p>If the service contains a web role, you can include the <strong>-Launch</strong> parameter to open the web role in a browser. All services are started automatically after they are deployed, but the web role is not opened unless the <strong>-Launch</strong> parameter is included.</p>
<h3>Examples</h3>
<p>In the following example, the MyService service is deployed using values that have been set previously. A new storage account is created. The service is deployed to the production environment.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Publish-AzureService

Publishing to Windows Azure. This may take several minutes...
6:15:58 PM - Preparing deployment for MyService with Subscription ID: 0807028c-e0a5-4773-82e3-8cae71dd5702...
6:16:04 PM - Connecting...
6:16:07 PM - Creating...
6:16:09 PM - Created hosted service 'MyService'.
6:16:09 PM - Verifying storage account 'myservice'...
6:18:14 PM - Uploading Package...
6:20:41 PM - Created Deployment ID: 7ce799c2023a4ae9b346b970045cd14c.
6:20:41 PM - Starting...
6:20:41 PM - Initializing...
6:20:55 PM - Instance WebRole1_IN_0 of role WebRole1 is creating the virtual machine.
6:24:26 PM - Instance WebRole1_IN_0 of role WebRole1 is busy.
6:25:42 PM - Instance WebRole1_IN_0 of role WebRole1 is ready.
6:25:43 PM - Created Website URL: http://MyService.cloudapp.net.
6:25:43 PM - Complete.
</pre>
<p>In the following example, parameters are used to set the subscription (ContosoFinance), slot (Staging), and location (North Central US) for the current service deployment.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Publish-AzureService -Subscription ContosoFinance -Sl staging -L "North Central US"
</pre>
<h2><a id="_How_To:_Update" name="_How_To:_Update"></a>How To: Update a Deployed Service</h2>
<p>When you use</p>
<p><a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757266(vs.103).aspx">Publish-AzureService</a> on a deployed service, the service is either updated in place or a new deployment is created. The update method depends on the types of changes that you make.</p>
<p>The following types of update are performed in place, without redeploying the service:</p>
<ul>
<li>
<p>Adding a new web role or worker role to the service, or changing the number of instances of an existing role.</p>
</li>
<li>
<p>Updating the application or the service configuration file.</p>
</li>
<li>
<p>Enabling or disabling remote access to service role instances.</p>
</li>
</ul>
<p>The following types of update initiate a new service deployment:</p>
<ul>
<li>
<p>If you change the subscription, storage account, or deployment location, a new service deployment occurs, and the previous deployment is deleted.</p>
</li>
<li>
<p>If you change the deployment slot - for example, you deploy a service that is in the staging environment to the production environment - a second deployment is performed without deleting the first deployment.</p>
</li>
</ul>
<p>In the following example, the MyService service is updated in place after a second service role instance is added to the WebRole1 service role.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Update-AzureInstances MyWebRole 2
PS C:\node\MyService&gt; Publish-AzureService
</pre>
<p>The following example shows how you would publish a new service deployment to production. If a service deployment exists in staging, both deployments are retained.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Publish-AzureService -Slot Production
</pre>
<p>In the following example, a service that has been deployed to the Anywhere Europe location is redeployed to North Europe. Because the location is changing, the service is redeployed and the existing deployment is removed. An existing storage account for the North Europe location is used.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Publish-AzureService -Location "North Europe" -StorageAccountName NorthEuropeStore
</pre>
<h2><a id="_How_to:_Scale" name="_How_to:_Scale"></a>How to: Scale Out a Service</h2>
<p>After you deploy your service, you can run the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757263(vs.103).aspx">Set-AzureInstances</a> cmdlet to scale the service out or in by adding or removing instances to a web role or a worker role.</p>
<p>The following example shows how to update the MyService service configuration to deploy two instances of the existing web role named MyWebRole when you next publish the service.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Update-AzureInstances MyWebRole 2
</pre>
<p>To deploy the change to the role instances, you must run the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757266(vs.103).aspx">Publish-AzureService</a> cmdlet. Note that a change to the number of role instances causes the virtual machines to be rebuilt, and you will lose any data that is stored locally on the role instances.</p>
<h2><a id="_How_to:_Stop," name="_How_to:_Stop,"></a>How to: Stop, Start, and Remove a Service</h2>
<p>A deployed application, even if it is not running, continues to accrue billable time for your subscription. Therefore, it is important that you remove unwanted deployments from your Windows Azure subscription. You also have the option to stop your service but not remove it. However, if you do not remove the service, you will still accrue charges for the compute units (virtual machines), even if the service is stopped.</p>
<p>Use the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757256(vs.103).aspx">Stop-AzureService</a> cmdlet to stop a running, deployed service. If you have deployments in both staging and production, you can use the -<strong>Slot</strong> parameter to specify which deployment to stop. If you do not specify a slot, both deployments are stopped.</p>
<p>The following example shows how to stop the MyService service.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Stop AzureService
</pre>
<p>Use the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757265(vs.103).aspx">Start-AzureService</a> cmdlet to restart a service that is stopped. For a service with both staging and production deployments, the <strong>-Slot</strong> parameter specifies which deployment to start. If the <strong>-Slot</strong> parameter is not included, both deployments are started.</p>
<p>The following example shows how to start the production deployment of the MyService service.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Start-AzureService -Slot production
</pre>
<p>Use the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh757257(VS.103).aspx">Remove-AzureService</a> cmdlet to remove a service. If the service is running, the service is stopped and then removed. If you have service deployments in both staging and production, this cmdlet removes both deployments.</p>
<p>The following example removes the MyService service.</p>
<pre class="prettyprint">PS C:\node\MyService&gt; Remove-AzureService
</pre>
<h2>Additional Resources</h2>
<p><a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh689725(vs.103).aspx">Windows Azure PowerShell for Node.js Cmdlet Reference</a><br /> <a href="http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/">Node.js Web Application</a> <br /> <a href="http://www.windowsazure.com/en-us/develop/nodejs/tutorials/web-app-with-storage/">Node.js Web Application with Table Storage</a> <br /> <a href="http://www.windowsazure.com/en-us/develop/nodejs/common-tasks/enable-remote-desktop/">Enabling Remote Desktop in Windows Azure</a> <br /> <a href="http://www.windowsazure.com/en-us/develop/nodejs/common-tasks/enable-ssl/">Configuring SSL for a Node.js Application in Windows Azure</a></p>