<properties
linkid=dev-nodejs-getting-started
urlDisplayName=Node.js Web Application
headerExpose=
pageTitle=Node.js Getting Started Guide
metaKeywords=Azure node.js getting started, Azure Node.js tutorial, Azure Node.js tutorial
footerExpose=
metaDescription=An end-to-end tutorial that helps you develop a simple Node.js web application and deploy it to Windows Azure.
umbracoNaviHide=0
disqusComments=1
/>
<h1 id="node.jswebapplication">Node.js Web Application</h1>
<p>Developing for Windows Azure is easy when using the available tools. This tutorial assumes you have no prior experience using Windows Azure. On completing this guide, you will have an application that uses multiple Windows Azure resources up and running in the cloud.</p>
<p>You will learn:</p>
<ul>
<li>How to create a new Windows Azure Node.js application using the Windows PowerShell tools.</li>
<li>How to run your Node application locally using the Windows Azure compute emulator</li>
<li>How to publish and re-publish your application to Windows Azure.</li>
</ul>
<p>By following this tutorial, you will build a simple Hello World web application. The application will be hosted in an instance of a web role that, when running in Windows Azure, is itself hosted in a dedicated virtual machine (VM).</p>
<p>A screenshot of the completed application is below:</p>
<img src="/media/node/node21.png" alt="A browser window displaying Hello World"/>
<h2 id="settingupthedevelopmentenvironment"><a id="setup"></a>Setting Up the Development Environment</h2>
<p>Before you can begin developing your Windows Azure application, you need to get the tools and set up your development environment.</p>
<ol>
<li>
<p>To install the Windows Azure SDK for Node.js, click the button below:</p>
<p><a href="http://go.microsoft.com/?linkid=9790229" class="site-arrowboxcta download-cta">Get Tools and SDK</a></p>
</li>
<li>
<p>Select <strong>Install Now</strong>, and when prompted to run or save azurenodepowershell.exe, click Run:</p>
<img src="/media/nodejs/dev-nodejs-getting-started-3.png" alt="Internet Explorer promoting to run a downloaded file"/></li>
<li>
<p>Click <strong>Install</strong> in the installer window and proceed with the installation:</p>
<img src="/media/nodejs/dev-nodejs-getting-started-4.png" alt="Web Platform Installer screen for the Windows Azure SDK for Node.js. The install button is highlighted."/></li>
</ol>
<p>Once the installation is complete, you have everything necessary to start developing. The following components are installed:</p>
<ul>
<li>Node.js</li>
<li>IISNode</li>
<li>NPM for Windows</li>
<li>Windows Azure Emulators - November 2011</li>
<li>Windows Azure Authoring Components - November 2011</li>
<li>Windows Azure PowerShell for Node.js</li>
</ul>
<h2 id="creatinganewnodeapplication">Creating a New Node Application</h2>
<p>The Windows Azure SDK for Node.js includes a Windows PowerShell environment that is configured for Windows Azure and Node development. It includes tools that you can use to create and publish Node applications.</p>
<ol>
<li>
<p>On the <strong>Start </strong>menu, click <strong>All Programs, Windows Azure SDK Node.js - November 2011</strong>, right-click <strong>Windows Azure PowerShell for Node.js</strong>, and then select <strong>Run As Administrator</strong>. Opening your Windows PowerShell environment this way ensures that all of the Node command-line tools are available. Running with elevated privileges avoids extra prompts when working with the Windows Azure Emulator.</p>
<img src="/media/node/node7.png" alt="The Windows Start menu with the Windows Azure SDK Node.js entry expanded"/></li>
<li>
<p>Create a new <strong>node </strong>directory on your C drive, and change to the c:\node directory:</p>
<img src="/media/nodejs/dev-nodejs-getting-started-6.png" alt="A command prompt displaying the commands 'mkdir c:\node' and 'cd node'."/></li>
<li>
<p>Enter the following cmdlet to create a new solution:</p>
<pre class="prettyprint">PS C:\node&gt; New-AzureService tasklist
</pre>
<p>You will see the following response:</p>
<img src="/media/node/node9.png" alt="The result of the New-AzureService tasklist command"/>
<p>The <strong>New-AzureService</strong> cmdlet generates a basic structure for creating a new Windows Azure Node application. It contains configuration files necessary for publishing to Windows Azure. The cmdlet also changes your working directory to the directory for the service.</p>
<p>Enter the following command to see a listing of the files that were generated:</p>
<pre class="prettyprint">PS C:\node\tasklist&gt; ls
</pre>
<img src="/media/nodejs/dev-nodejs-getting-started-7.png" alt="A directory listing of the tasklist folder."/>
<ul>
<li>ServiceConfiguration.Cloud.cscfg, ServiceConfiguration.Local.cscfg and ServiceDefinition.csdef are Windows Azure-specific files necessary for publishing your application. For more information about these files, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg432976.aspx">Overview of Creating a Hosted Service for Windows Azure</a>.</li>
<li>deploymentSettings.json stores local settings that are used by the Windows Azure PowerShell deployment cmdlets.</li>
</ul>
</li>
<li>
<p>Enter the following command to add a new web role using the <strong>Add-AzureNodeWebRole cmdlet</strong>:</p>
<pre class="prettyprint">PS C:\node\tasklist&gt; Add-AzureNodeWebRole
</pre>
<p>You will see the following response:</p>
<img src="/media/node/node11.png" alt="The output of the Add-AzureNodeWebRole command."/>
<p>The <strong>Add-AzureNodeWebRole </strong>cmdlet creates a new directory for your application and generates additional files that will be needed when your application is published. In Windows Azure, <em>roles</em>define components that can run in the Windows Azure execution environment. A <em>web role</em>is customized for web application programming.</p>
<p>By default if you do not provide a role name, one will be created for you i.e. WebRole1. You can provide a name as the first parameter to <strong>Add-AzureNodeWebRole</strong> to override i.e. <strong>Add-AzureNodeWebRole MyRole</strong></p>
<p>Enter the following commands to change to the newly generated directory and view its contents:</p>
<pre class="prettyprint">PS C:\node\tasklist&gt; cd WebRole1
PS C:\node\tasklist\WebRole1&gt; ls
</pre>
<img src="/media/nodejs/dev-nodejs-getting-started-8.png" alt="A directory listing of the WebRole1 folder"/>
<ul>
<li>server.js contains the starter code for your application.</li>
</ul>
</li>
<li>
<p>Open the server.js file in Notepad. Alternatively, you can open the server.js file in your favorite text editor.</p>
<pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; notepad server.js
</pre>
<p>This file contains the following starter code that the tools have generated. This code is almost identical to the “Hello World” sample on the nodejs.org website, except:</p>
<ul>
<li>The port has been changed to allow IIS to handle HTTP traffic on behalf of the application. IIS Node.js integration provides Node.js applications with a number of benefits when running on-premise or in Windows Azure, including: process management, scalability on multi-core servers, auto-update, side-by-side with other languages, etc.</li>
<li>Console logging has been removed.</li>
</ul>
<img src="/media/node/node13.png" alt="Notepad displaying the contents of server.js"/></li>
</ol>
<h2 id="runningyourapplicationlocallyintheemulator">Running Your Application Locally in the Emulator</h2>
<p>One of the tools installed by the Windows Azure SDK is the Windows Azure compute emulator, which allows you to test your application locally. The compute emulator simulates the environment your application will run in when it is deployed to the cloud, including providing access to services like Windows Azure Table Storage. This means you can test your application without having to actually deploy it.</p>
<ol>
<li>
<p>Close Notepad and switch back to the Windows PowerShell window. Enter the following cmdlet to run your service in the emulator and launch a browser window:</p>
<pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; Start-AzureEmulator -launch
</pre>
<p>The <strong>–launch</strong> parameter specifies that the tools should automatically open a browser window and display the application once it is running in the emulator. A browser opens and displays “Hello World,” as shown in the screenshot below. This indicates that the service is running in the compute emulator and is working correctly.</p>
<img src="/media/node/node14.png" alt="A web browser displaying the Hello World web page"/></li>
<li>
<p>To stop the compute emulator, you can access it (as well as the storage emulator, which you will leverage later in this tutorial) from the Windows taskbar as shown in the screenshot below:</p>
<img src="/media/nodejs/dev-nodejs-getting-started-11.png" alt="The menu displayed when right-clicking the Windows Azure emulator from the task bar."/></li>
</ol>
<h2 id="deployingtheapplicationtowindowsazure">Deploying the Application to Windows Azure</h2>
<p>In order to deploy your application to Windows Azure, you need an account. If you do not have one you can create a free trial account. Once you are logged in with your account, you can download a Windows Azure publishing profile. The publishing profile authorizes your computer to publish deployment packages to Windows Azure using the Windows PowerShell cmdlets.</p>
<h3 id="creatingawindowsazureaccount">Creating a Windows Azure Account</h3>
<ol>
<li>
<p>Open a web browser, and browse to <a href="http://www.windowsazure.com">http://www.windowsazure.com</a>.</p>
<p>To get started with a free account, click on <strong>Free Trial</strong> in the upper right corner and follow the steps.</p>
<img src="/media/net/dev-net-getting-started-12.png" alt="A browser window displaying http://www.windowsazure.com/ with the Free Trial link highlighted"/></li>
<li>
<p>Your account is now created. You are ready to deploy your application to Windows Azure!</p>
</li>
</ol>
<h3 id="downloadingthewindowsazurepublishingsettings"><a id="download_publishing_settings"></a>Downloading the Windows Azure Publishing Settings</h3>
<ol>
<li>
<p>From the Windows PowerShell window, launch the download page by running the following cmdlet:</p>
<pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; Get-AzurePublishSettings
</pre>
<p>This launches the browser for you to log into the Windows Azure Management Portal with your Windows Live ID credentials.</p>
<img src="/media/nodejs/dev-nodejs-getting-started-13.png" alt="A browser window displaying the liveID sign in page"/></li>
<li>
<p>Log into the Management Portal. This takes you to the page to download your Windows Azure publishing settings.</p>
</li>
<li>
<p>Save the profile to a file at <strong>c:\node\elvis.publishSettings</strong>:</p>
<img src="/media/nodejs/dev-nodejs-getting-started-14.png" alt="Internet Explorer displaying the save as dialog for the publishSettings file."/></li>
<li>
<p>In the Windows PowerShell window, use the following cmdlet to configure the Windows PowerShell for Node.js cmdlets to use the Windows Azure publishing profile you downloaded:</p>
<pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; Import-AzurePublishSettings c:\node\elvis.publishSettings
</pre>
<p>After importing the publish settings, consider deleting the downloaded .publishSettings as the file contains information that can be used by others to access your account.</p>
</li>
</ol>
<h3 id="publishingtheapplication">Publishing the Application</h3>
<ol>
<li>
<p>Publish the application using the <strong>Publish-AzureService</strong> cmdlet, as shown below.</p>
<ul>
<li><strong>name </strong>specifies the name for the service. The name must be unique across all other services in Windows Azure. For example, below, “TaskList” is suffixed with “Contoso,” the company name, to make the service name unique.</li>
<li><strong>location </strong>specifies the country/region for which the application should be optimized. You can expect faster loading times for users accessing it from this region. Examples of the\ available regions include: North Central US, Anywhere US, Anywhere Asia, Anywhere Europe, North Europe, South Central US, and Southeast Asia.</li>
<li><strong>launch </strong>specifies to open the browser at the location of the hosted service after publishing has completed.</li>
</ul>
<pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; Publish-AzureService –name TaskListContoso –location "North Central US” -launch</pre>
<p>Be sure to use a <strong>unique name</strong>, otherwise the publish process will fail. After publishing succeeds, you will see the following response:</p>
<img src="/media/node/node19.png" alt="The output of the Publish-AzureService command"/>
<p>The <strong>Publish-AzureService</strong> cmdlet performs the following steps:</p>
<ol>
<li>Creates a package that will be deployed to Windows Azure. The package contains all the files in your node.js application folder.</li>
<li>Creates a new storage account if one does not exist. The Windows Azure storage account is used in the next section of the tutorial for storing and accessing data.</li>
<li>Creates a new hosted service if one does not already exist. A <em>hosted service</em>is the container in which your application is hosted when it is deployed to Windows Azure. For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg432976.aspx">Overview of Creating a Hosted Service for Windows Azure</a>.</li>
<li>Publishes the deployment package to Windows Azure.</li>
</ol>
<p>It can take 5–7 minutes for the application to deploy. Since this is the first time you are publishing, Windows Azure provisions a virtual machine (VM), performs security hardening, creates a web role on the VM to host your application, deploys your code to that web role, and finally configures the load balancer and networking so you application is available to the public.</p>
<p>After the deployment is complete, the following response appears.</p>
<img src="/media/node/node20.png" alt="The full status output of the Publish-AzureService command"/>
<p>The browser also opens to the URL for your service and display a web page that calls your service.</p>
<img src="/media/node/node21.png" alt="A browser window displaying the hello world page. The URL indicates the page is hosted on Windows Azure."/>
<p>Your application is now running on Windows Azure! The hosted service contains the web role you created earlier. You can easily scale your application by changing the number of instances allocated to each role in the ServiceConfiguration.Cloud.cscfg file. You may want to use only one instance when deploying for development and test purposes, but multiple instances when deploying a production application.</p>
</li>
</ol>
<h2 id="stoppinganddeletingyourapplication">Stopping and Deleting Your Application</h2>
<p>After deploying your application, you may want to disable it so you can avoid costs or build and deploy other applications within the free trial time period.</p>
<p>Windows Azure bills web role instances per hour of server time consumed. Server time is consumed once your application is deployed, even if the instances are not running and are in the stopped state.</p>
<p>The following steps show you how to stop and delete your application.</p>
<ol>
<li>
<p>In the Windows PowerShell window, stop the service deployment created in the previous section with the following cmdlet:</p>
<pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; Stop-AzureService</pre>
<p>Stopping the service may take several minutes. When the service is stopped, you receive a message indicating that it has stopped.</p>
<img src="/media/node/node48.png" alt="The status of the Stop-AzureService command"/></li>
<li>
<p>To delete the service, call the following cmdlet:</p>
<pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; Remove-AzureService</pre>
</li>
<li>
<p>When prompted, enter <strong>Y</strong> to delete the service.</p>
<p>Deleting the service may take several minutes. After the service has been deleted you receive a message indicating that the service was deleted.</p>
<img src="/media/node/node49.png" alt="The status of the Remove-AzureService command"/></li>
</ol>
<p><strong>Note</strong>: Deleting the service does not delete the storage account that was created when the service was initially published, and you will continue to be billed for storage used. Since storage accounts can be used by multiple deployments, be sure that no other deployed service is using the storage account before you delete it. For more information on deleting a storage account, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh531562.aspx">How to Delete a Storage Account from a Windows Azure Subscription</a>.</p>