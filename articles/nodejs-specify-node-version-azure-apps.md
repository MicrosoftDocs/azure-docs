<properties pageTitle="Specifying a Node.js Version" description="Learn how to specify the version of Node.js used by Azure Web Sites and Cloud Services" services="" documentationCenter="nodejs" authors="MikeWasson" manager="wpickett" editor="mollybos"/>

<tags ms.service="multiple" ms.workload="na" ms.tgt_pltfrm="na" ms.devlang="nodejs" ms.topic="article" ms.date="02/19/2015" ms.author="mwasson"/>





# Specifying a Node.js version in an Azure application

When hosting a Node.js application, you may want to ensure that your application uses a specific version of Node.js. There are several ways to accomplish this for applications hosted on Azure.

##Default versions

The Node.js versions provided by Azure are constantly updated. Unless otherwise specified, the latest available version will be used. Currently included are the following versions:

- 0.12.x: 0.12.0
- 0.10.x: 0.10.32, 0.10.31, 0.10.29, 0.10.28, 10.26, 0.10.24, 0.10.21, 0.10.18, 0.10.5
- 0.8.x: 0.8.28, 0.8.27, 0.8.26, 0.8.19, 0.8.2
- 0.6.x: 0.6.20, 0.6.17

> [AZURE.NOTE] If you are hosting your application in an Azure Cloud Service (web or worker role,) and it is the first time you have deployed the application, Azure will attempt to use the same version of Node.js as you have installed on your development environment if it matches one of the default versions available on Azure.

##Versioning with package.json

You can specify the version of Node.js to be used by adding the following to your **package.json** file:

	"engines":{"node":version}

Where *version* is the specific version number to use. You can  can specify more complex conditions for version, such as:

	"engines":{"node": "0.6.22 || 0.8.x"}

Since 0.6.22 is not one of the versions available in the hosting environment, the highest version of the 0.8 series that is available will be used instead - 0.8.4.

##Versioning Websites with App Settings
If you are hosting the application in a Website, you can set the environment variable **WEBSITE_NODE_DEFAULT_VERSION** to the desired version. 

##Versioning Cloud Services with PowerShell

If you are hosting the application in a Cloud Service, and are deploying the application using Azure PowerShell, you can override the default Node.js version by using the **Set-AzureServiceProjectRole** PowerShell cmdlet. For example:

	Set-AzureServiceProjectRole WebRole1 node 0.8.4

You can also use the **Get-AzureServiceProjectRoleRuntime** to retrieve a list of Node.js versions available for applications hosted as a Cloud Service.

##Using a custom version with Azure Websites

While Azure provides several default versions of Node.js, you may want to use a version that is not provided by default. If your application is hosted as an Azure Website, you can accomplish this by using the **iisnode.yml** file. The following steps walk through the process of using a custom version of Node.Js with an Azure Website:

1. Create a new directory, and then create a **server.js** file within the directory. The **server.js** file should contain the following:

		var http = require('http');
		http.createServer(function(req,res) {
		  res.writeHead(200, {'Content-Type': 'text/html'});
		  res.end('Hello from Azure running node version: ' + process.version + '</br>');
		}).listen(process.env.PORT || 3000);

	This will display the Node.js version being used when you browse the website.

2. Create a new Website and note the name of the site. For example, the following uses the [Azure Command-line tools] to create a new Azure Website named **mywebsite**, and then enable a Git repository for the website.

		azure site create mywebsite --git

3. Create a new directory named **bin** as a child of the directory containing the **server.js** file.

4. Download the specific version of **node.exe** (the Windows version) that you wish to use with your application. For example, the following uses **curl** to download version 0.8.1:

		curl -O http://nodejs.org/dist/v0.8.1/node.exe

	Save the **node.exe** file into the **bin** folder created previously.

5. Create an **iisnode.yml** file in the same directory as the **server.js** file, and then add the following content to the **iisnode.yml** file:

		nodeProcessCommandLine: "D:\home\site\wwwroot\bin\node.exe"

	This path is where the **node.exe** file within your project will be located once you have published your application to the Azure Website.

6. Publish your application. For example, since I created a new website with the --git parameter earlier, the following commands will add the application files to my local Git repository, and then push them to the website repository:

		git add .
		git commit -m "testing node v0.8.1"
		git push azure master

	After the application has published, open the website in a browser. You should see a message stating "Hello from Azure running node version: v0.8.1".

##Next Steps

Now that you understand how to specify the version of Node.js used by your application, learn how to [work with modules], [build and deploy a Node.js Web Site], and [How to use the Azure Command-Line Tools for Mac and Linux].

[How to use the Azure Command-Line Tools for Mac and Linux]: xplat-cli.md
[Azure Command-line tools]: xplat-cli.md
[work with modules]: nodejs-use-node-modules-azure-apps.md
[build and deploy a Node.js Web Site]: web-sites-nodejs-develop-deploy-mac.md
