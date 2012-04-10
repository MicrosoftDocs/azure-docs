<properties
umbracoNaviHide=0
pageTitle=Node.js Deploying with Cloud9
metaKeywords=
metaDescription=
linkid=dev-nodejs-cloud9
urlDisplayName=Deploying with Cloud9
headerExpose=
footerExpose=
disqusComments=1
/>
<h1 id="deployingnodefromcloud9idetowindowsazure">Deploying a Windows Azure App from Cloud9</h1>
<p>This tutorial describes how to use Cloud9 IDE to develop, build, and deploy a Node.js application to Windows Azure.</p>
<p>In this tutorial you will learn how to:</p>
<ul>
<li>Create a Cloud9 IDE project</li>
<li>Deploy the project to Windows Azure</li>
<li>Update an existing Windows Azure deployment</li>
<li>Move projects between staging and production deployments</li>
</ul>
<p><a href="http://cloud9ide.com/">Cloud9 IDE</a> provides a cross-platform, browser-based development environment. One of the features Cloud9 supports for Node.js projects is that you can directly deploy to Windows Azure from within the IDE. Cloud9 also integrates with the GitHub and BitBucket repository services, so it’s easy to share your project with others.</p>
<p>Using Cloud9, you can develop and deploy an application to Windows Azure from many modern browsers and operating systems, without having to install additional development tools or SDKs locally. The steps below are demonstrated using Google Chrome on a Mac.</p>
<h2 id="signup">Signup</h2>
<p>To use Cloud9, you first need to visit their website and <a href="http://cloud9ide.com/">register for a subscription</a>. You can sign in with either an existing GitHub or BitBucket account, or create a Cloud9 account. A free subscription offering is available, as well as a paid offering which provides more features. For more information, see <a href="http://cloud9ide.com/">Cloud 9 IDE</a>.</p>
<h2 id="createanode.jsproject">Create a Node.js Project</h2>
<ol>
<li>
<p>Sign in to Cloud9, click the <strong>+</strong> symbol beside <strong>My Projects</strong>, and then select <strong>Create a new project</strong>.</p>
<img src="/media/node/cloud9_create_project.png" alt="create new Cloud9 project"/></li>
<li>
<p>In the <strong>Create a new project</strong> dialog, enter a project name, access, and project type. Click <strong>Create</strong> to create the project.</p>
<img src="/media/node/cloud9_new_project.png" alt="create new project dialog -- Cloud9"/>
<p><strong>Note</strong>: Some options require a paid Cloud9 plan.<br /> <strong>Note</strong>: The project name of your Cloud9 project is not used when deploying to Windows Azure.</p>
</li>
<li>
<p>After the project has been created, click <strong>Start Editing</strong>. If this is the first time you have used the Cloud9 IDE, you will be offered the option to take a tour of the service. If you wish to skip the tour and view it at a later date, select <strong>Just the editor, please</strong>.</p>
<img src="/media/node/cloud9_startediting.png" alt="start editing the Cloud9 project"/></li>
<li>
<p>To create a new Node application, select <strong>File</strong> and then <strong>New File</strong>.</p>
<img src="/media/node/cloud9_filenew.png" alt="create new file in the Cloud9 project"/></li>
<li>
<p>A new tab titled <strong>*Untitled1</strong> will be displayed. Enter the following code on the <strong>*Untitled1</strong> tab to create the Node application:</p>
<pre class="prettyprint">var http = require('http');
var port = process.env.PORT;
http.createServer(function(req,res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hello azure\n');
}).listen(port);
</pre>
<p><strong>Note</strong>: Using process.env.PORT ensures that the application picks up the correct port whether ran in the Cloud9 debugger or when deployed to Windows Azure.</p>
</li>
<li>
<p>To save the code, select <strong>File</strong> and then <strong>Save as</strong>. In the <strong>Save As</strong> dialog, enter <strong>server.js</strong> as the file name, and then click <strong>Save</strong>.</p>
<p><strong>Note</strong>: You may notice a warning symbol indicating that the req variable is unused. You may safely ignore this warning.</p>
<img src="/media/node/cloud9_saveas.png" alt="save the server.js file"/></li>
</ol>
<h2 id="runtheapplication">Run the Application</h2>
<p><strong>Note</strong>: While the steps provided in this section are sufficient for a Hello World application, for applications that use external modules you may need to select a specific version of Node.js for the debug environment. To do this, select <strong>Configure...</strong> from the debug dropdown, and then select the specific version of Node.js. For example, you may receive authentication errors when using the 'azure' module if you do not have Node.js 0.6.x selected.</p>
<ol>
<li>
<p>Click <strong>Debug</strong> to run the application in the Cloud9 debugger.</p>
<img src="/media/node/cloud9_debug.png" alt="run in the debugger"/></li>
<li>
<p>An output window will be displayed. Click on the URL listed to access your application through a browser window.</p>
<img src="/media/node/cloud9_output.png" alt="output window"/>
<p>The resulting application will look as follows:</p>
<img src="/media/node/cloud9_debug_browser.png" alt="application running in browser"/></li>
<li>To stop debugging the application, click <strong>stop</strong>.</li>
</ol>
<h2>Create a Windows Azure Account</h2>
<p>To deploy your application to Windows Azure, you need an account. If you do not already have a Windows Azure account, you can sign up for a free trial account by visiting <a href="http://www.windowsazure.com">http://www.windowsazure.com</a> and then selecting <strong>Free Trial</strong> in the upper right corner.</p>
<h2 id="createadeployment">Create a Deployment</h2>
<ol><ol>
<li>
<p>To create a new deployment, select <strong>Deploy</strong>, and then click <strong>+</strong> to create a deploy server.</p>
<img src="/media/node/cloud9_createdeployment.png" alt="create a new deployment"/></li>
<li>
<p>In the <strong>Add a deploy target</strong> dialog, enter a deployment name and then select <strong>Windows Azure</strong> in the <strong>Choose type</strong> list. The deployment name you specify will be used to identify the deployment within Cloud9; it will not correspond to a deployment name within Windows Azure.</p>
</li>
<li>
<p>If this is the first time you have created a Cloud9 deployment that uses Windows Azure, you must configure your Windows Azure publish settings. Perform the following steps to download and install these settings into the Cloud9:</p>
<ol style="list-style-type: lower-alpha;">
<li>
<p>Click <strong>Download Windows Azure Settings</strong>.</p>
<img src="/media/node/cloud9_choosetypeandcert.png" alt="download publish settings"/>
<p>This will open the Windows Azure Management Portal and prompt you to download the Windows Azure publishing settings. You will be required to log in to your Windows Azure account before you can begin.</p>
</li>
<li>
<p>Save the publishing settings file to your local drive.</p>
</li>
<li>
<p>In the <strong>Add a deploy target</strong> dialog, select <strong>Choose File</strong>, and then select the file downloaded in the previous step.</p>
</li>
<li>
<p>After selecting the file, click <strong>Upload</strong>.</p>
</li>
</ol></li>
<li>
<p>Click <strong>+ Create new</strong> to create a new hosted service. A <em>hosted service</em> is the container in which your application is hosted when it is deployed to Windows Azure. For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg432976.aspx">Overview of Creating a Hosted Service for Windows Azure</a>.</p>
<img src="/media/node/cloud9_add_a_deploy_target.png" alt="create a new deployment"/></li>
<li>
<p>You will be prompted for the name of the new hosted service and configuration options such as the number of instances, host OS, and data center. The deployment name specified will be used as the hosted service name in Windows Azure. This name must be unique within the Windows Azure system.</p>
<img src="/media/node/cloud9_new_hosted_service_settings.png" alt="create a new hosted service"/>
<p><strong>Note:</strong> In the <strong>Add a deploy target</strong> dialog, any existing Windows Azure hosted services will be listed under the <strong>Choose existing deployment</strong> section; selecting an existing hosted service will result in this project being deployed to that service.</p>
<p><strong>Note:</strong> Selecting <strong>Enable RDP</strong> and providing a username and password will enable remote desktop for your deployment.</p>
</li>
</ol></ol>
<p> </p>
<h2 id="deploytowindowsazure">Deploy to the Windows Azure Production Environment</h2>
<ol>
<li>
<p>Select the deployment you created in the previous steps. A dialog will appear that provides information about this deployment, as well as the production URL that will be used after deployment to Windows Azure.</p>
<img src="/media/node/cloud9_select_deployment.png" alt="select a deployment"/></li>
<li>
<p>Select <strong>Deploy to Production environment</strong>.</p>
</li>
<li>
<p>Click <strong>Deploy</strong> to begin deployment.</p>
</li>
<li>
<p>If this is the first time you have deployed this project to Windows Azure, you will receive an error of <strong>‘No web.config found’</strong>. Select <strong>Yes</strong> to create the file. This will add a ‘Web.cloud.config’ file to your project.</p>
<img src="/media/node/cloud9_no_web_config.png" alt="no web.config file found message."/></li>
<li>
<p>If this is the first time you have deployed this project to Windows Azure, you will receive an error of <strong>‘No ‘csdef’ file present’</strong>. Select <strong>Yes</strong> to create the .csdef file. This will add a ‘ServiceDefinition.csdef’ file to your project. ServiceDefinition.csdef is a Windows Azure-specific files necessary for publishing your application. For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg432976.aspx">Overview of Creating a Hosted Service for Windows Azure</a>.</p>
</li>
<li>
<p>You will be prompted to select the instance size for this application. Select <strong>Small</strong>, and then click <strong>Create</strong>. For more details about Windows Azure VM sizes, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee814754.aspx">How to Configure Virtual Machine Sizes</a>.</p>
<img src="/media/node/cloud9_createcsdef.png" alt="specify csdef file values"/></li>
<li>
<p>The deployment entry will display the status of the deployment process. Once complete, the deployment will display as <strong>Active</strong>.</p>
<img src="/media/node/cloud9_deployment_status.png" alt="deployment status"/>
<p><strong>Note</strong>: Projects deployed through the Cloud 9 IDE are assigned a GUID as the deployment name in Windows Azure.</p>
</li>
<li>
<p>The deployment dialog includes a link to the production URL. When the deployment is complete, click the URL to browse to your application running in Windows Azure.</p>
<img src="/media/node/cloud9_production_url.png" alt="Windows Azure production URL link"/></li>
</ol>
<h2>Update the Application</h2>
<p>When you make changes to your application, you can use Cloud9 to deploy the updated application to the same Windows Azure hosted service.</p>
<ol>
<li>
<p>In the server.js file, update your code so that "hello azure v2" is printed to the screen. You can replace the existing code with the following updated code:</p>
<pre class="prettyprint">var http = require('http');
var port = process.env.PORT;
http.createServer(function(req,res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hello azure v2\n');
}).listen(port);
</pre>
</li>
<li>
<p>To save the code, select <strong>File</strong> and then <strong>Save</strong>.</p>
</li>
</ol>
<h2>Deploy the update to the Windows Azure Staging Environment</h2>
<ol>
<li>
<p>Select <strong>Deploy to Staging</strong>.</p>
</li>
<li>
<p>Click <strong>Deploy</strong> to begin deployment.</p>
<p>Each Windows Azure hosted service supports two environments, staging and production. The staging environment is exactly like the production environment, except that you can only access the staged application with an obfuscated, GUID-based URL that is generated by Windows Azure. You can use the staging environment to test your application, and after verifying changes you can move the staging version into production by performing a virtual IP (VIP) swap, as described later in this tutorial.</p>
</li>
<li>
<p>When your application is deployed to staging, the guid-based staging URL will be displayed in the Console output, as shown in the screenshot below. Click the URL to open your staged application in a browser.</p>
<img src="/media/node/cloud9_staging_console_output.png" alt="console output showing staging URL"/></li>
</ol>
<h2>Move the Update to Production using VIP Swap</h2>
<p>When a service is deployed to either the production or staging environments, a virtual IP address (VIP), is assigned to the service in that environment. When you want to move a service from the staging environment to the production environment, you can do so without redeploying by doing a VIP Swap, which swaps the staging and production deployments. A VIP swap puts your tested, staged application into production with no downtime in the production environment. For more details, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh386336.aspx">Overview of Managing Deployments in Windows Azure.</a></p>
<ol>
<li>
<p>In the deploy dialog, click on the <strong>Open portal</strong> link to open the Windows Azure Management Portal.</p>
<img src="/media/node/cloud9_portal_link.png" alt="Link from deploy dialog to Windows Azure Management Portal"/></li>
<li>
<p>Sign in to the portal with your credentials.</p>
</li>
<li>
<p>On the left of the web page, select <strong>Hosted Services, Storage Accounts &amp; CDN</strong>, and then click <strong>Hosted Services</strong>.</p>
<img src="/media/node/cloud9_hosted_service_and_ribbon.png" alt="Windows Azure Management Portal"/>
<p>The results pane shows the hosted service with the name you specified in Cloud9, and two deployments, one with the <strong>Environment</strong> value <strong>Staging</strong>, the second <strong>Production</strong>.</p>
</li>
<li>
<p>To perform the VIP Swap, select the hosted service, and then click <strong>Swap VIP</strong> in the ribbon.</p>
<img src="/media/node/cloud9_portal_vipswap.png" alt="VIP SWAP"/></li>
<li>
<p>Click <strong>OK</strong> in the Swap VIPs dialog that appears.</p>
</li>
<li>
<p>Browse to your production application. You will see that the version of the application previously deployed to stage is now in production.</p>
<img src="/media/node/cloud9_production_on_azure.png" alt="Production application running on Windows Azure"/></li>
</ol>
<h2>Using Remote Desktop</h2>
<p>If you enabled RDP and specified a username and password when creating your deployment, you can use Remote Desktop to connect to your Hosted Service by selecting a specific instance, and then selecting Connect on the ribbon.</p>
<p><img src="/media/node/connect.png" alt="Connect to an instance"/></p>
<p>When you click Connect, you will be prompted to open or download a .RDP file. This file contains the information required to connect to your remote desktop session. Running this file on a Windows system will prompt you for the username and password you entered when creating your deployment, and will then connect you to the desktop of the selected instance.</p>
<p><strong>Note</strong>: The .RDP file to connect to the hosted instance of your application will only work with the Remote Desktop application on WIndows.</p>
<h2 id="stopanddeletetheapplication">Stop and Delete the Application</h2>
<p>Windows Azure bills role instances per hour of server time consumed, and server time is consumed while your application is deployed, even if the instances are not running and are in the stopped state. In addition, server time is consumed by both production and stage deployments.</p>
<p>Cloud9 focuses on providing an IDE and does not provide a direct method of stopping or deleting an application once it has been deployed to Windows Azure. In order to delete an application hosted in Windows Azure, perform the following steps:</p>
<ol>
<li>
<p>In the deploy dialog, click on the <strong>Open portal</strong> link to open the Windows Azure Management Portal.</p>
<img src="/media/node/cloud9_portal_link.png" alt="Link from deploy dialog to Windows Azure Management Portal"/></li>
<li>
<p>Sign in to the portal with your credentials.</p>
</li>
<li>
<p>On the left of the web page, select <strong>Hosted Services, Storage Accounts &amp; CDN</strong>, and then click <strong>Hosted Services</strong>.</p>
</li>
<li>
<p>Select the staging deployment (indicated by the <strong>Environment</strong> value). Click <strong>Delete</strong> in the ribbon to delete the application.</p>
<img src="/media/node/cloud9_deletedeployment.png" alt="delete the deployment"/></li>
<li>
<p>Select the production deployment, and click <strong>Delete</strong> to delete that application as well.</p>
</li>
</ol>
<h2>Additional Resources</h2>
<ul>
<li><a href="http://go.microsoft.com/fwlink/?LinkId=241421&amp;clcid=0x409">Cloud9 documentation</a></li>
</ul>