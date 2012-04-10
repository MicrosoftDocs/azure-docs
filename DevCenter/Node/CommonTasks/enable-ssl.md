<properties
linkid=dev-nodejs-enablessl
urlDisplayName=Enable SSL
headerExpose=
pageTitle=Enable SSL - Node.js - Develop
metaKeywords=Node.js Azure SSL, Node.js Azure HTTPS
footerExpose=
metaDescription=Learn how to specify an HTTPS endpoint for a Node.js web role and how to upload an SSL certificate to secure your application.
umbracoNaviHide=0
disqusComments=1
/>
<h1>Configuring SSL for a Node.js Application in Windows Azure</h1>
<p>Secure Socket Layer (SSL) encryption is the most commonly used method of securing data sent across the internet. This common task discusses how to specify an HTTPS endpoint for a Node.js web role and how to upload an SSL certificate to secure your application.</p>
<p>This task includes the following steps:</p>
<ul>
<li><a href="#step1">Step 1: Create a Node.js service and publish the service to the cloud</a></li>
<li><a href="#step2">Step 2: Get an SSL Certificate</a></li>
<li><a href="#step3">Step 3: Upload the SSL Certificate to the cloud</a></li>
<li><a href="#step4">Step 4: Modify the Service Definition and Configuration Files</a></li>
<li><a href="#step5">Step 5: Connect to the Role Instance by Using HTTPS</a></li>
</ul>
<h2><a name="step1"></a>Step 1: Create a Node.js service and publish the service to the cloud</h2>
<p>When a Node.js service is deployed to a Windows Azure web role, the server certificate and SSL connection are managed by Internet Information Services (IIS), so that the Node.js service can be written as if it were an http service. You can create a simple Node.js 'hello world' service using the Windows Azure PowerShell for Node.js using these steps:</p>
<ol>
<li>
<p>From the <strong>Start</strong> menu, select <a href="http://go.microsoft.com/?linkid=9790229&amp;clcid=0x409"><strong>Windows Azure PowerShell for Node.js</strong></a>.</p>
<p><img src="/media/net/common-task-enable-ssl-node-00.png"/></p>
</li>
<li>
<p>Create a new service, using <strong>New-AzureService</strong> cmdlet provided with a unique service name. This service name will determine the URL of your service in Windows Azure:</p>
<p><img src="/media/net/common-task-enable-ssl-node-01.png"/></p>
</li>
<li>
<p>Add a web role to your service using <strong>Add-AzureNodeWebRole</strong> cmdlet:</p>
<p><img src="/media/net/common-task-enable-ssl-node-02.png"/></p>
</li>
<li>
<p>Publish your service to the cloud using <strong>Publish-AzureService</strong> cmdlet:</p>
<p><img src="/media/net/common-task-enable-ssl-node-03.png"/></p>
</li>
</ol>
<p>Now that you have an http service published to Windows Azure, you will need to obtain an SSL certificate and configure your service to use it</p>
<h2><a name="step2"></a>Step 2: Get an SSL Certificate</h2>
<p>To configure SSL for an application, you first need to get an SSL certificate that has been signed by a Certificate Authority (CA), a trusted third-party who issues certificates for this purpose. If you do not already have one, you will need to obtain one from a company that sells SSL certificates.</p>
<p>The certificate must meet the following requirements for SSL certificates in Windows Azure:</p>
<ul>
<li>The certificate must contain a private key.</li>
<li>The certificate must be created for key exchange (.pfx file).</li>
<li>The certificate's subject name must match the domain used to access the hosted service. You cannot acquire an SSL certificate for the cloudapp.net domain, so the certificate's subject name must match the custom domain name used to access your application.</li>
<li>The certificate must use a minimum of 2048-bit encryption.</li>
</ul>
<h2><a name="step3"></a>Step 3: Upload the SSL Certificate to the cloud</h2>
<p>Now that you have an SSL certificate, you must upload the certificate to your hosted service in Windows Azure, following these steps:</p>
<ul>
<li>
<p>Log on to the <a href="http://windows.azure.com">Windows Azure Management Portal</a>, go to the <strong>Hosted Services</strong> section, and locate the service you created in step 1.</p>
</li>
<li>
<p>Right click on the <strong>Certificates</strong> entry for the hosted service and select <strong>Add Certificate...</strong> from the drop down menu.</p>
<p><img src="/media/net/common-task-enable-ssl-node-04.png"/></p>
</li>
<li>
<p>In the <strong>Upload an X.509 Certificate</strong> dialog, enter the location of the SSL certificate .pfx file, the password for the certificate, and click <strong>OK</strong>.</p>
<p><img src="/media/net/common-task-enable-ssl-node-05.png"/></p>
</li>
</ul>
<p>Now you must modify your service definition to use the certificate you have uploaded.</p>
<h2><a name="step4"></a>Step 4: Modify the Service Definition and Configuration Files</h2>
<p>Your application must be configured to use the certificate, and an HTTPS endpoint must be added. As a result, the service definition and service configuration files need to be updated.</p>
<ol>
<li>
<p>In the service directory, open the service definition file (ServiceDefinition.csdef), add a <strong>Certificates</strong> section within the <strong>WebRole</strong> section, and include the following information about the certificate:</p>
<pre class="prettyprint">&lt;WebRole name="WebRole1" vmsize="ExtraSmall"&gt;
...
    &lt;Certificates&gt;
        &lt;Certificate name="SampleCertificate" 
            storeLocation="LocalMachine" storeName="CA" /&gt;
    &lt;/Certificates&gt;
...
&lt;/WebRole&gt;
</pre>
<p>The <strong>Certificates</strong> section defines the name of the certificate, its location, and the name of the store where it is located. We have chosen to store the certificate in the CA (Certificate Authority) store, but you can choose other options as well. See <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg465718.aspx">How to Associate a Certificate with a Service</a> for more information.</p>
</li>
<li>
<p>In your service definition file, update the http <strong>InputEndpoint</strong> element within the <strong>Endpoints</strong> section to enable HTTPS:</p>
<pre class="prettyprint">&lt;WebRole name="WebRole1" vmsize="Small"&gt;
...
    &lt;Endpoints&gt;
        &lt;InputEndpoint name="Endpoint1" protocol="https" 
            port="443" certificate="SampleCertificate" /&gt;
    &lt;/Endpoints&gt;
...
&lt;/WebRole&gt;
</pre>
<p>All of the required changes to the service definition file have been completed, but you still need to add the certificate information to the service configuration file.</p>
</li>
<li>
<p>In your service configuration files (<strong>ServiceConfiguration.Cloud.cscfg</strong> and <strong>ServiceConfiguration.Local.cscfg</strong>), add the certifcate to the empty <strong>Certificates</strong> section within the <strong>Role</strong> section, replacing the sample thumbprint value below with that of your certificate:</p>
<pre class="prettyprint">&lt;Role name="WebRole1"&gt;
...
    &lt;Certificates&gt;
        &lt;Certificate name="SampleCertificate" 
            thumbprint="9427befa18ec6865a9ebdc79d4c38de50e6316ff" 
            thumbprintAlgorithm="sha1" /&gt;
    &lt;/Certificates&gt;
...
&lt;/Role&gt;
</pre>
</li>
<li>To refresh your service configuration in the cloud, you must publish your service again. At the Windows Azure PowerShell for Node.js prompt, type <strong>Publish-AzureService</strong> from the service directory. <img src="/media/net/common-task-enable-ssl-node-06.png"/></li>
</ol>
<h2><a name="step5"></a>Step 5: Connect to the Role Instance by Using HTTPS</h2>
<p>Now that your deployment is up and running in Windows Azure, you can connect to it using HTTPS.</p>
<ol>
<li>
<p>In the Management Portal, select your deployment, then right-click on the DNS name link in the <strong>Properties</strong> pane and choose <strong>Copy</strong>.</p>
<p><img src="/media/net/common-task-enable-ssl-node-07.png"/></p>
</li>
<li>
<p>Paste the address in a web browser, but make sure that it starts with <strong>https</strong> instead of <strong>http</strong>, and then visit the page.</p>
<p>Your browser displays the address in green to indicate that it is using an HTTPS connection. This also indicates that your application has been configured correctly for SSL.</p>
<p><img src="/media/net/common-task-enable-ssl-node-08.png"/></p>
</li>
</ol>
<h2>Additional Resources</h2>
<p><a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg465718.aspx">How to Associate a Certificate with a Service</a></p>
<p><a href="http://msdn.microsoft.com/en-us/library/windowsazure/ff795779.aspx">How to Configure an SSL Certificate on an HTTPS Endpoint</a></p>