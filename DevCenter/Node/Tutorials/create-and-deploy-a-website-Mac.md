<properties linkid="develop-node-create-a-website-mac" urlDisplayName="Web site" pageTitle="Create a Node.js web site on Mac - Windows Azure tutorials" metaKeywords="Azure create web site Node, Azure deploy web site Node, web site Node.js, Node web site" metaDescription="Learn how to build and deploy a Node.js web site in Windows Azure. Sample code is written in Java." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />


<div chunk="../chunks/article-left-menu.md" />

# Build and deploy a Node.js web site to Windows Azure

This tutorial shows you how to create a [Node] application and deploy it to a Windows Azure Web Site using [Git]. The instructions in this tutorial can be followed on any operating system that is capable of running Node.

If you prefer to watch a video, the clip in the right follows the same steps as this tutorial.
 
A screenshot of the completed application is below:

![A browser displaying the 'Hello World' message.][helloworld-completed]

##Create a Windows Azure Web Site and enable Git publishing

Follow these steps to create a Windows Azure Web Site, and then enable Git publishing for the web site.

<div class="dev-callout"><strong>Note</strong>
<p>To complete this tutorial, you need a Windows Azure account that has the Windows Azure Web Sites feature enabled.</p>
<ul>
<li>If you don't have an account, you can create a free trial account  in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A7171371E" target="_blank">Windows Azure Free Trial</a>.</li>
<li>If you have an existing account but need to enable the Windows Azure Web Sites preview, see <a href="../create-a-windows-azure-account/#enable" target="_blank">Enable Windows Azure preview features</a>.</li>
</ul>
</div>

1. Login to the [Windows Azure Management Portal].

2. Click the **+ NEW** icon on the bottom left of the portal

    ![The Windows Azure Portal with the +NEW link highlighted.][portal-new-website]

3. Click **WEB SITE**, then **QUICK CREATE**. Enter a value for **URL** and select the datacenter for your web site in the **REGION** dropdown. Click the checkmark at the bottom of the dialog.

    ![The Quick Create dialog][portal-quick-create]

4. Once the web site status changes to **Running**, click on the name of the web site to access the **Dashboard**

	![Open web site dashboard][go-to-dashboard]

6. At the bottom right of the Dashboard, select **Set up Git Publishing**.

	![Set up Git publishing][setup-git-publishing]

7. To enable Git publishing, you must provide a user name and password. If you have previously enabled publishing for a Windows Azure Web Site, you will not be prompted for the user name or password. Instead, a Git repository will be created using the user name and password you previously specified. Make a note of the user name and password, as they will be used for Git publishing to all Windows Azure Web Sites you create.

	![The dialog prompting for user name and password.][portal-git-username-password]

8. Once the Git repository is ready, you will be presented with instructions on the Git commands to use in order to setup a local repository and then push the files to Windows Azure.

	![Git deployment instructions returned after creating a repository for the web site.][git-instructions]

##Build and test your application locally

In this section, you will create a **server.js** file containing the 'hello world' example from [nodejs.org]. This example has been modified from the original example by adding process.env.PORT as the port to listen on when running in a Windows Azure Web Site.

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
    <div chunk="../Chunks/install-dev-tools.md" />

4. Open your web browser and navigate to http://localhost:1337. A web page displaying "Hello World" will appear as shown in the screenshot below:

    ![A browser displaying the 'Hello World' message.][helloworld-localhost]

##Publish your application

1. From the command-line, change directories to the **helloworld** directory and enter the following commands to initialize a local Git repository. 

		git init

	<div class="dev-callout"><strong>Git command unavailable?</strong>
	<p><a href="http://git-scm.com/" target="_blank">Git</a> is a distributed version control system that you can use to deploy your Windows Azure Web Site. For installation instructions for your platform, see <a href="http://git-scm.com/download" target="_blank">the Git download page</a>.</p>
	</div>

2. Use the following commands to add files to the repository:

		git add .
		git commit -m "initial commit"

3. Add a Git remote for pushing updates to the Windows Azure Web Site you created previously, using the following command:

		git remote add azure [URL for remote repository]

    ![Git deployment instructions returned after creating a repository for the web site.][git-instructions]
 
4. Push your changes to Windows Azure using the following command:

		git push azure master

	You will be prompted for the password you created earlier and will see the following output:
	
	![Git command line output][git-push-azure]
    
	If you navigate to the deployments tab of your Windows Azure Web Site within the management portal, you will see your first deployment in the deployment history:

	![Git deployment status on the portal][git-deployments-first] 

5. Browse to your site using the **Browse** button on your Windows Azure Web Site page within the management portal.

##Publish changes to your application

1. Open the **server.js** file in a text editor, and change 'Hello World\n' to 'Hello Azure\n'. Save the file.
2. From the command-line, change directories to the **helloworld** directory and run the following commands:

		git add .
		git commit -m "changing to hello azure"
		git push azure master

	You will be prompted for the password you created earlier. If you navigate to the deployments tab of your Windows Azure Web Site within the management portal, you will see your updated deployment history:
	
	![Git deployment status updated on the portal][git-deployments-second]

3. Browse to your site by using the **Browse** button and note that the updates have been applied.

	![A web page displaying 'Hello Azure'][helloworld-completed]

4. You can revert to the previous deployment by selecting it in the "Deployments" tab of your Windows Azure Web Site within the management portal and using the **Redeploy** button.

##Next steps

While the steps in this article use the Windows Azure Portal to create a web site, you can also use the [Windows Azure Command-Line Tools for Mac and Linux] to perform the same operations.

##Additional Resources

* [Windows Azure PowerShell]
* [Windows Azure Command-Line Tools for Mac and Linux]

[Windows Azure PowerShell]: /en-us/develop/nodejs/how-to-guides/powershell-cmdlets/
[Node]: http://nodejs.org/
[nodejs.org]: http://nodejs.org/
[Git]: http://git-scm.com/
[Windows Azure Management Portal]: http://manage.windowsazure.com
[Windows Azure Command-Line Tools for Mac and Linux]: /en-us/develop/nodejs/how-to-guides/command-line-tools/

[helloworld-completed]: ../Media/helloazure.png
[helloworld-localhost]: ../Media/helloworldlocal.png
[portal-new-website]: ../../Shared/Media/plus-new.png
[portal-quick-create]: ../../Shared/Media/create-quick-website.png
[portal-website-list]: ../Media/list-of-websites.png
[portal-git-username-password]: ../../Shared/Media/git-deployment-credentials.png
[git-instructions]: ../../Shared/Media/git_instructions.png
[git-push-azure]: ../Media/git_push_azure.png
[git-deployments-first]: ../Media/git_deployments_first.png
[git-deployments-second]: ../Media/git_deployments_second.png
[portal-website-stop-delete]: ../../Shared/Media/stop-delete-icons.png
[setup-git-publishing]: ../../Shared/Media/setup_git_publishing.png
[go-to-dashboard]: ../../Shared/Media/go_to_dashboard.png