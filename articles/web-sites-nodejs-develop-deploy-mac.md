<properties urlDisplayName="Website" pageTitle="Create a Node.js website on Mac - Azure tutorials" metaKeywords="Azure create website Node, Azure deploy website Node, website Node.js, Node website" description="Learn how to build and deploy a Node.js website in Azure. Sample code is written in Java." metaCanonical="" services="web-sites" documentationCenter="nodejs" title="Build and deploy a Node.js website to Azure" authors="larryfr" solutions="" manager="wpickett" editor="" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="nodejs" ms.topic="article" ms.date="09/17/2014" ms.author="larryfr" />






# Build and deploy a Node.js website to Azure

This tutorial shows you how to create a [Node] [nodejs.org] application and deploy it to an Azure Website using [Git]. The instructions in this tutorial can be followed on any operating system that is capable of running Node.

If you prefer to watch this tutorial as a video, the following clip shows similiar steps:
[AZURE.VIDEO create-a-nodejs-site-deploy-from-github]
 
A screenshot of the completed application is below:

![A browser displaying the 'Hello World' message.][helloworld-completed]

##Create an Azure Website and enable Git publishing

Follow these steps to create an Azure Website, and then enable Git publishing for the website.

> [AZURE.NOTE]
> To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free trial account  in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A7171371E" target="_blank">Azure Free Trial</a>.
> 
> If you want to get started with Azure Websites before signing up for an account, go to <a href="https://trywebsites.azurewebsites.net/?language=nodejs">https://trywebsites.azurewebsites.net</a>, where you can immediately create a short-lived ASP.NET starter site in Azure Websites for free. No credit card required, no commitments.

1. Login to the [Azure Management Portal].

2. Click the **+ NEW** icon on the bottom left of the portal

    ![The Azure Portal with the +NEW link highlighted.][portal-new-website]

3. Click **WEBSITE**, then **QUICK CREATE**. Enter a value for **URL** and select the datacenter for your website in the **REGION** dropdown. Click the checkmark at the bottom of the dialog.

    ![The Quick Create dialog][portal-quick-create]

4. Once the website status changes to **Running**, click on the name of the website to access the **Dashboard**

	![Open web site dashboard][go-to-dashboard]

6. At the bottom right of the Quickstart page, select **Set up a deployment from source control**.

	![Set up Git publishing][setup-git-publishing]

6. When asked "Where is your source code?" select **Local Git repository**, and then click the arrow.

	![where is your source code][where-is-code]

7. To enable Git publishing, you must provide a user name and password. If you have previously enabled publishing for an Azure Website, you will not be prompted for the user name or password. Instead, a Git repository will be created using the user name and password you previously specified. Make a note of the user name and password, as they will be used for Git publishing to all Azure Websites you create.

	![The dialog prompting for user name and password.][portal-git-username-password]

8. Once the Git repository is ready, you will be presented with instructions on the Git commands to use in order to setup a local repository and then push the files to Azure.

	![Git deployment instructions returned after creating a repository for the website.][git-instructions]

##Build and test your application locally

In this section, you will create a **server.js** file containing the 'hello world' example from [nodejs.org]. This example has been modified from the original example by adding process.env.PORT as the port to listen on when running in an Azure Website.

1. Using a text editor, create a new file named **server.js** in the **helloworld** directory. If the **helloworld** directory does not exist, create it.
2. Add the following as the contents of the **server.js** file, and then save it:

        var http = require('http')
        var port = process.env.PORT || 1337;
        http.createServer(function(req, res) {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Hello World\n');
        }).listen(port);

3. Open the command-line, and use the following command to start the web page locally:

        node server.js

4. Open your web browser and navigate to http://localhost:1337. A web page displaying "Hello World" will appear as shown in the screenshot below:

    ![A browser displaying the 'Hello World' message.][helloworld-localhost]

##Publish your application

1. From the command-line, change directories to the **helloworld** directory and enter the following commands to initialize a local Git repository. 

		git init

	> [AZURE.NOTE] **Git command unavailable?**
	[Git](http://git-scm.com/%20target="_blank) is a distributed version control system that you can use to deploy your Azure Website. For installation instructions for your platform, see [the Git download page](http://git-scm.com/download%20target="_blank").

2. Use the following commands to add files to the repository:

		git add .
		git commit -m "initial commit"

3. Add a Git remote for pushing updates to the Azure Website you created previously, using the following command:

		git remote add azure [URL for remote repository]

    ![Git deployment instructions returned after creating a repository for the web site.][git-instructions]
 
4. Push your changes to Azure using the following command:

		git push azure master

	You will be prompted for the password you created earlier and will see the following output:

		Password for 'testsite.scm.azurewebsites.net':
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
    
	If you navigate to the deployments tab of your Azure Website within the management portal, you will see your first deployment in the deployment history:

	![Git deployment status on the portal][git-deployments-first] 

5. Browse to your site using the **Browse** button on your Azure Website page within the management portal.

##Publish changes to your application

1. Open the **server.js** file in a text editor, and change 'Hello World\n' to 'Hello Azure\n'. Save the file.
2. From the command-line, change directories to the **helloworld** directory and run the following commands:

		git add .
		git commit -m "changing to hello azure"
		git push azure master

	You will be prompted for the password you created earlier. If you navigate to the deployments tab of your Azure Website within the management portal, you will see your updated deployment history:
	
	![Git deployment status updated on the portal][git-deployments-second]

3. Browse to your site by using the **Browse** button and note that the updates have been applied.

	![A web page displaying 'Hello Azure'][helloworld-completed]

4. You can revert to the previous deployment by selecting it in the "Deployments" tab of your Azure Website within the management portal and using the **Redeploy** button.

##Next steps

While the steps in this article use the Azure Portal to create a website, you can also use the [Azure Command-Line Tools for Mac and Linux] to perform the same operations.

Node.js provides a rich ecosystem of modules that can be used by your applications. To learn how Azure Websites work with modules, see [Using Node.js Modules with Azure Applications](/en-us/documentation/articles/nodejs-use-node-modules-azure-apps/).

To learn more about the versions of Node.js that are provided with Azure and how to specify the version to be used with your application, see [Specifying a Node.js version in an Azure application](/en-us/documentation/articles/nodejs-specify-node-version-azure-apps/).

If you encounter problems with your application after it has been deployed to Azure, see [How to debug a Node.js application in Azure Web Sites](/en-us/documentation/articles/web-sites-nodejs-debug/) for information on diagnosing the problem.


##Additional Resources

* [Azure PowerShell]
* [Azure Command-Line Tools for Mac and Linux]

[Azure PowerShell]: /en-us/documentation/articles/install-configure-powershell/

[nodejs.org]: http://nodejs.org
[Git]: http://git-scm.com

[Azure Management Portal]: http://manage.windowsazure.com
[Azure Command-Line Tools for Mac and Linux]: /en-us/documentation/articles/xplat-cli/

[helloworld-completed]: ./media/web-sites-nodejs-develop-deploy-mac/helloazure.png
[helloworld-localhost]: ./media/web-sites-nodejs-develop-deploy-mac/helloworldlocal.png
[portal-new-website]: ./media/web-sites-nodejs-develop-deploy-mac/plus-new.png
[portal-quick-create]: ./media/web-sites-nodejs-develop-deploy-mac/create-quick-website.png

[portal-git-username-password]: ./media/web-sites-nodejs-develop-deploy-mac/git-deployment-credentials.png
[git-instructions]: ./media/web-sites-nodejs-develop-deploy-mac/git-instructions.png

[git-deployments-first]: ./media/web-sites-nodejs-develop-deploy-mac/git_deployments_first.png
[git-deployments-second]: ./media/web-sites-nodejs-develop-deploy-mac/git_deployments_second.png

[setup-git-publishing]: ./media/web-sites-nodejs-develop-deploy-mac/setup_git_publishing.png
[go-to-dashboard]: ./media/web-sites-nodejs-develop-deploy-mac/go_to_dashboard.png
[where-is-code]: ./media/web-sites-nodejs-develop-deploy-mac/where_is_code.png
