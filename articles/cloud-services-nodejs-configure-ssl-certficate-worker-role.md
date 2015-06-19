<properties 
	pageTitle="Configure SSL for a cloud service (Node.js) worker role" 
	description="Configure SSL for a Node.js cloud service worker role in Azure" 
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
	ms.date="02/25/2015" 
	ms.author="mwasson"/>





# Configuring SSL for a Node.js Application in an Azure Worker Role

Secure Socket Layer (SSL) encryption is the most commonly used method of
securing data sent across the internet. This common task discusses how
to specify an HTTPS endpoint for a Node.js application hosted as an Azure Cloud Service in a worker role.

> [AZURE.NOTE] The steps in this article only apply to node applications hosted as an Azure Cloud Service in a worker role.

This task includes the following steps:

-   [Step 1: Create a Node.js service and publish the service to the cloud]
-   [Step 2: Get an SSL certificate]
-   [Step 3: Modify the Application to use the SSL certificate]
-   [Step 4: Modify the Service Definition File]
-   [Step 5: Connect to the Role Instance by Using HTTPS]

## <a name="step1"> </a>Step 1: Create a Node.js service and publish the service to the cloud

You can create a simple Node.js 'hello
world' service using the Azure PowerShell using these steps:

1. From the **Start Menu** or **Start Screen**, search for **Azure PowerShell**. Finally, right-click **Azure PowerShell** and select **Run As Administrator**.

	![Azure PowerShell icon][powershell-menu]

	

2.  Create a new service, using **New-AzureServiceProject** cmdlet.

	![][1]

3.  Add a worker role to your service using **Add-AzureNodeWorkerRole** cmdlet:

    ![][2]

4.  Publish your service to the cloud using **Publish-AzureServiceProject** cmdlet:

    ![][3]

	> [AZURE.NOTE] If you have not previously imported publish settings for your Azure subscription, you will receive an error when trying to publish. For information on downloading and importing the publish settings for your subscription, see [How to Use the Azure PowerShell for Node.js](https://www.windowsazure.com/develop/nodejs/how-to-guides/powershell-cmdlets/#ImportPubSettings)

The **Created Website URL** value returned by the **Publish-AzureServiceProject** cmdlet contains the fully qualified domain name for your hosted application. You will need to obtain an SSL certificate for this specific fully qualified domain name and deploy it to Azure.

## <a name="step2"> </a>Step 2: Get an SSL Certificate

To configure SSL for an application, you first need to get an SSL
certificate that has been signed by a Certificate Authority (CA), a
trusted third-party who issues certificates for this purpose. If you do
not already have one, you will need to obtain one from a company that
sells SSL certificates.

The certificate must meet the following requirements for SSL
certificates in Azure:

-   The certificate must contain a private key.
-   The certificate must be created for key exchange (**.pfx** file).
-   The certificate's subject name must match the domain used to access
    the cloud service. You cannot acquire an SSL certificate for the
    cloudapp.net domain, so the certificate's subject name must match
    the custom domain name used to access your application. For example, __mysecuresite.cloudapp.net__.
-   The certificate must use a minimum of 2048-bit encryption.

The **.pfx** file containing the certificate will be added to your service project and deployed to Azure in the following steps.

## <a name="step3"> </a>Step 3: Modify the Application to use the SSL certificate

When a Node.js application is deployed to a worker role, the server certificate and SSL connection are managed by Node.exe. To handle SSL traffic, you must use the 'https' module instead of 'http'. Perform the following steps to add the SSL certificate to your project, and then modify the application to use the certificate.

1.   Save the **.pfx** file provided to you by your Certificate Authority (CA) to the directory containing your application. For example, **c:\\node\\securesite\\workerrole1** is the directory that contains the application used in this article.

2.   Open the **c:\\node\\securesite\\workerrole1\server.js** file using Notepad.exe, and replace the file contents with the following:

		var https = require('https');
		var fs = require('fs');

		var options = {
			pfx: fs.readFileSync('certificate.pfx'),
			passphrase: "password"
		};
		var port = process.env.PORT || 8000;
		https.createServer(options, function (req, res) {
 		    res.writeHead(200, { 'Content-Type': 'text/plain' });
		    res.end('Hello World\n');
		}).listen(port);

	> [AZURE.IMPORTANT] You must replace 'certificate.pfx' with the name of the certificate file and "password" with the password (if any) of the certificate file.

3.   Save the **server.js** file.

The modifications to the **server.js** file result in the application listening for communication on port 443 (the standard port for SSL communications) when it is deployed to Azure. The **.pfx** file will be used to implement SSL communications over this transport.

## <a name="step4"> </a>Step 4: Modify the Service Definition File

Since your application is now listening over port 443, you must also modify the service definition to allow communication over this port.

1.  In the service directory, open the service definition file
    (**ServiceDefinition.csdef**), update the http **InputEndpoint** element within the **Endpoints** section to enable communication over port 443:

        <WorkerRole name="WorkerRole1" vmsize="Small">
        ...
            <Endpoints>
                <InputEndpoint name="HttpIn" protocol="tcp" 
                    port="443" />
            </Endpoints>
        ...
        </WorkerRole>

	After making this change, save the **ServiceDefinition.csdef** file.

4.  Refresh your updated configuration in the cloud by publishing
    your service again. At the Azure PowerShell
    prompt, type **Publish-AzureServiceProject** from the service directory.

## <a name="step5"> </a>Step 5: Connect to the Role Instance by Using HTTPS

Now that your deployment is up and running in Azure, you can
connect to it using HTTPS.

1.  In the Management Portal, select your cloud service, then click **Dashboard**.

2. Scroll down and click the link displayed as the **Site URL**:

    ![the site url][site-url]

	> [AZURE.IMPORTANT] If the Site URL displayed in the portal does not specify HTTPS, then you must manually enter the URL in the browser using HTTPS instead of HTTP.

3.  A new browser will open and display your website.

    Your browser will display a lock icon to indicate that it is
    using an HTTPS connection. This also indicates that your application
    has been configured correctly for SSL.

    ![][8]

## Additional Resources

[How to Associate a Certificate with a Service]

[Configuring SSL for a Node.js Application in an Azure Web Role]

[How to Configure an SSL Certificate on an HTTPS Endpoint]

  [Step 1: Create a Node.js service and publish the service to the cloud]: #step1
  [Step 2: Get an SSL certificate]: #step2
  [Step 3: Modify the Application to use the SSL certificate]: #step3
  [Step 4: Modify the Service Definition File]: #step4
  [Step 5: Connect to the Role Instance by Using HTTPS]: #step5
  [**Azure PowerShell**]: http://go.microsoft.com/?linkid=9790229&clcid=0x409
  
  
  
  
  [1]: ./media/cloud-services-nodejs-configure-ssl-certficate-worker-role/enable-ssl-01.png
  [2]: ./media/cloud-services-nodejs-configure-ssl-certficate-worker-role/enable-ssl-02-worker.png
  [3]: ./media/cloud-services-nodejs-configure-ssl-certficate-worker-role/enable-ssl-03-worker.png
  [Azure Management Portal]: http://manage.windowsazure.com
  
  
  [How to Associate a Certificate with a Service]: http://msdn.microsoft.com/library/windowsazure/gg465718.aspx
  
  [site-url]: ./media/cloud-services-nodejs-configure-ssl-certficate-worker-role/site-url.png
  [8]: ./media/cloud-services-nodejs-configure-ssl-certficate-worker-role/enable-ssl-08.png
  [How to Configure an SSL Certificate on an HTTPS Endpoint]: http://msdn.microsoft.com/library/windowsazure/ff795779.aspx
  [powershell-menu]: ./media/cloud-services-nodejs-configure-ssl-certficate-worker-role/azure-powershell-start.png
  
  
  [Configuring SSL for a Node.js Application in an Azure Web Role]: /develop/nodejs/common-tasks/enable-ssl/
  
