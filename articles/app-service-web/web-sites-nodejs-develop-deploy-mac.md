<properties
	pageTitle="Create a Node.js web app in Azure App Service | Microsoft Azure"
	description="Learn how to build and deploy a Node.js web app in Azure."
	services="app-service\web"
	documentationCenter="nodejs"
	authors="MikeWasson"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="app-service-web"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="nodejs"
	ms.topic="hero-article"
	ms.date="08/18/2015"
	ms.author="mwasson"/>

# Build and deploy a Node.js web app in Azure App Service

> [AZURE.SELECTOR]
- [.Net](web-sites-dotnet-get-started.md)
- [Node.js](web-sites-nodejs-develop-deploy-mac.md)
- [Java](web-sites-java-get-started.md)
- [PHP - Git](web-sites-php-mysql-deploy-use-git.md)
- [PHP - FTP](web-sites-php-mysql-deploy-use-ftp.md)
- [Python](web-sites-python-ptvs-django-mysql.md)

This tutorial shows you how to create a [Node] [nodejs.org] application and deploy it to the [Web Apps feature in Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) by using [Git]. The instructions in this tutorial can be followed on any operating system that is capable of running Node.

A screenshot of the completed application is below:

![A browser displaying the 'Hello World' message.][helloworld-completed]

##Create a web app and enable Git publishing

Follow these steps to create a web app and enable Git publishing.

> [AZURE.NOTE]
> To complete this tutorial, you need a Microsoft Azure account. If you don't have an account, you can [activate your MSDN subscriber benefits](/en-us/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F) or [sign up for a free trial](/en-us/pricing/free-trial/?WT.mc_id=A261C142F).

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Click the **+ NEW** icon on the top left of the portal.

3. Click **Web + Mobile**, and then click **Web app**.

    ![][portal-quick-create]

4. Enter a value for **URL**.

5. Select an App Service plan or create a new one. If you create a new plan, select the pricing tier, location, and other options.

    ![][portal-quick-create2]

6. Click **Create**.

7. Once the status changes to **Running**, the portal automatically opens the blade for your web app. You can also reach the blade by clicking **Browse**.

	![][go-to-dashboard]

8. Click **Deployment**. You may need to scroll to see this part of the blade.

	![][deployment-part]

9. Click **Choose Source**, click **Local Git Repository**, and then click **OK**.

	![][setup-git-publishing]


10. Click the **deployment credentials** part (outlined in red below). Create a user name and password. Click **Save**. If you previously enabled publishing for a web app, you don't need to do this step.

	![][deployment-credentials]


11. To publish, you will push to a Git remote repository. Find the URL for the repository, click **All Settings**, and then click **Properties**. The URL is listed under **GIT URL**.

	![][git-url]

##Build and test your application locally

In this section, you will create a **server.js** file that contains the 'Hello World' example from [nodejs.org]. This example has been modified from the original example by adding process.env.PORT as the port to listen on when running in an Azure web app.

1. By using a text editor, create a new file named **server.js** in the **helloworld** directory. If the **helloworld** directory does not exist, create it.

2. Add the following as the contents of the **server.js** file, and then save it:

        var http = require('http')
        var port = process.env.PORT || 1337;
        http.createServer(function(req, res) {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Hello World\n');
        }).listen(port);

3. Open the command line, and use the following command to start the web app locally:

        node server.js

4. Open your web browser and navigate to http://localhost:1337. A webpage that displays "Hello World" will appear, as shown in the screenshot below:

    ![A browser displaying the 'Hello World' message.][helloworld-localhost]

##Publish your application

1. From the command line, change directories to the **helloworld** directory and enter the following command to initialize a local Git repository.

		git init

	> [AZURE.NOTE] Is the Git command unavailable?
	[Git](http://git-scm.com/%20target="_blank) is a distributed version-control system that you can use to deploy your Azure website. For installation instructions for your platform, see the [Git download page](http://git-scm.com/download%20target="_blank").

2. Use the following commands to add files to the repository:

		git add .
		git commit -m "initial commit"

3. Add a Git remote for pushing updates to the web app that you created previously, by using the following command:

		git remote add azure [URL for remote repository]


4. Push your changes to Azure by using the following command:

		git push azure master

	You will be prompted for the password that you created earlier. The output should be similar to the following:

		Counting objects: 3, done.
		Delta compression using up to 8 threads.
		Compressing objects: 100% (2/2), done.
		Writing objects: 100% (3/3), 374 bytes, done.
		Total 3 (delta 0), reused 0 (delta 0)
		remote: New deployment received.
		remote: Updating branch 'master'.
		remote: Preparing deployment for commit id '5ebbe250c9'.
		remote: Preparing files for deployment.
		remote: Deploying Web.config to enable Node.js activation.
		remote: Deployment successful.
		To https://user@testsite.scm.azurewebsites.net/testsite.git
		 * [new branch]      master -> master


5. To view your app, click the **Browse** button on the **Web App** part within the Azure portal.

##Publish changes to your application

1. Open the **server.js** file in a text editor, and change 'Hello World\n' to 'Hello Azure\n'. Save the file.
2. From the command line, change directories to the **helloworld** directory and run the following commands:

		git add .
		git commit -m "changing to hello azure"
		git push azure master

	You will be prompted for the password that you created earlier.

3. Browse to your app by clicking **Browse**, and note that the updates have been applied.

	![A web page displaying 'Hello Azure'][helloworld-completed]

4. You can revert to the previous deployment by selecting it in **Deployments**.

>[AZURE.NOTE] If you want to get started with Azure App Service before you sign up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751). There, you can immediately create a short-lived starter web app in App Service—no credit card required, and no commitments.

##Next steps

While the steps in this article use the Azure portal to create a web app, you can also use the [Azure Command-Line Interface](../xplat-cli.md) to perform the same operations.

Node.js provides a rich ecosystem of modules that can be used by your applications. To learn how Web Apps works with modules, see [Using Node.js modules with Azure applications](../nodejs-use-node-modules-azure-apps.md).

To learn more about the versions of Node.js that are provided with Azure and how to specify the version to be used with your application, see [Specifying a Node.js version in an Azure application](../nodejs-specify-node-version-azure-apps.md).

If you encounter problems with your application after it has been deployed to Azure, see [How to debug a Node.js application in Azure App Service](web-sites-nodejs-debug.md) for information on diagnosing the problem.


##Additional resources

* [Azure PowerShell](../install-configure-powershell.md)
* [Azure Command-Line Interface](../xplat-cli.md)
* [Node.js Developer Center](/develop/nodejs/)

## What's changed
* For a guide to the change from Websites to App Service, see [Azure App Service and existing Azure services](http://go.microsoft.com/fwlink/?LinkId=529714).
* For a guide to the change from the old portal to the new portal, see [Reference for navigating the Azure portal](http://go.microsoft.com/fwlink/?LinkId=529715).


[nodejs.org]: http://nodejs.org
[Git]: http://git-scm.com


[helloworld-completed]: ./media/web-sites-nodejs-develop-deploy-mac/helloazure.png
[helloworld-localhost]: ./media/web-sites-nodejs-develop-deploy-mac/helloworldlocal.png

[portal-quick-create]: ./media/web-sites-nodejs-develop-deploy-mac/create-quick-website.png

[portal-quick-create2]: ./media/web-sites-nodejs-develop-deploy-mac/create-quick-website2.png


[setup-git-publishing]: ./media/web-sites-nodejs-develop-deploy-mac/setup_git_publishing.png

[go-to-dashboard]: ./media/web-sites-nodejs-develop-deploy-mac/go_to_dashboard.png

[deployment-part]: ./media/web-sites-nodejs-develop-deploy-mac/deployment-part.png

[deployment-credentials]: ./media/web-sites-nodejs-develop-deploy-mac/deployment-credentials.png


[git-url]: ./media/web-sites-nodejs-develop-deploy-mac/git-url.png
