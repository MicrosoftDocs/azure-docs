<properties linkid="dev-nodejs-website" urldisplayname="Node.js Website" headerexpose="" pagetitle="Node.js Application using a Windows Azure Website" metakeywords="Azure Node.js tutorial, Azure Node.js, Azure Node.js tutorial" footerexpose="" metadescription="A tutorial that demonstrates deploying a Node.js application to a Windows Azure Website" umbraconavihide="0" disquscomments="1"></properties>

#Create and deploy a Node.js application to a Windows Azure Web Site

This tutorial shows you how to create a [node] application and deploy it to a Windows Azure Web Site using [Git]. The instructions in this tutorial can be followed on any operating system that is capable of running node.

You will learn:

* How to create a Windows Azure Web Site using the Windows Azure Developer Portal
* How to publish and re-publish your application to Windows Azure using Git

By following this tutorial, you will build a simple Hello World web application in Node.js. The application will be hosted in a Windows Azure Web Site when deployed.
 
A screenshot of the completed application is below:

![A browser displaying the 'Hello World' message.][helloworld-completed]


##Set up the Windows Azure environment

First, set up the Windows Azure environment. You'll create a Windows Azure account and enable this account to use the Windows Azure Web Sites preview feature.

### Create a Windows Azure account

<div chunk="../../Shared/Chunks/create-azure-account.md" />

###Enable Windows Azure Web Sites

After signing up, follow these steps to enable the Windows Azure Web Site feature.

<div chunk="../../Shared/Chunks/antares-iaas-signup.md"></div>

##Create a Windows Azure Web Site and enable Git publishing

Follow these steps to create a Windows Azure Web Site, and then enable Git publishing for the web site.

1. Login to the [Windows Azure Portal].

2. Click the **+ NEW** icon on the bottom left of the portal

    ![The Windows Azure Portal with the +NEW link highlighted.][portal-new-website]

3. Click **WEB SITE**, then **QUICK CREATE**. Enter a value for **URL** and select the datacenter for your web site in the **REGION** dropdown. Click the checkmark at the bottom of the dialog.

    ![The Quick Create dialog][portal-quick-create]

4. Once the web site status changes to **Running**, click on the name of the web site to access the **Dashboard**

	![Open website dashboard][go-to-dashboard]

6. At the bottom right of the Dashboard, select **Set up Git Publishing**.

	![Set up Git publishing][setup-git-publishing]

7. To enable Git publishing, you must provide a user name and password. If you have previously enabled publishing for a Windows Azure Web Site, you will not be prompted for the user name or password. Instead, a Git repository will be created using the user name and password you previously specified. Make a note of the user name and password, as they will be used for Git publishing to all Windows Azure Web Sites you create.

	![The dialog prompting for user name and password.][portal-git-username-password]

8. Once the Git repository is ready, you will be presented with instructions on the Git commands to use in order to setup a local repository and then push the files to Windows Azure.

	![Git deployment instructions returned after creating a repository for the website.][portal-git-instructions]

	**Note**: Save the instructions returned by the **Push my local files to Windows Azure** link, as they will be used in the following sections.

##Install developer tools

To successfully complete the steps in this tutorial, you must have a working installation of Node.js and Git. Installation package for Node.js is available from the [nodejs.org download page] while installation package for Git is available from the [git-scm.com download page].

<div class="dev-callout">
<b>Note</b>
<p>If you are performing this tutorial on Windows, you can set up your machine with <a href="http://go.microsoft.com/fwlink/?LinkId=254279">Windows Azure SDK for Node.js</a> that includes Node.js.</p>
</div>

##Build and test your application locally

In this section, you will create a **server.js** file containing the 'hello world' example from [nodejs.org]. This example has been modified from the original example by adding process.env.port as the port to listen on when running in a Windows Azure Web Site.

<div class="dev-callout">
<b>Note</b>
<p>This tutorial makes reference to the **helloworld** folder. The full path to this folder is omitted, as path semantics differ between operating systems. You should create this folder in a location that is easy for you to access on your local file system, such as **~/node/helloworld** or **c:\node\helloworld**</p>
</div>

<div class="dev-callout">
<b>Note</b>
<p>Many of the steps below mention using the command-line. For these steps, use the command-line for your operating system, such as **Windows PowerShell**, **cmd.exe**, **GitBash** (Windows,) or **Bash** (Unix Shell). On OS X systems you can access the command-line through the Terminal application.</p>
</div>

1. Using a text editor, create a new file named **server.js** in the **helloworld** directory. If the **helloworld** directory does not exist, create it.
2. Add the following as the contents of the **server.js** file, and then save it:

        var http = require('http')
        var port = process.env.port || 1337;
        http.createServer(function(req, res) {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Hello World\n');
        }).listen(port);

3. Open the command-line, and use the following command to start the web page locally:

        node server.js

4. Open your web browser and navigate to http://localhost:1337. A web page displaying "Hello World" will appear as shown in the screenshot below:

    ![A browser displaying the 'Hello World' message.][helloworld-localhost]

5. To stop the application, switch to the Terminal window and hold down the **CTRL** and **C** keys on your keyboard.


##Publish your application

1. From the command-line, change directories to the **helloworld** directory and enter the following commands to initialize a local Git repository. 

		git init

2. Use the following commands to add files to the repository:

		git add .
		git commit -m "initial commit"

3. Add a Git remote for pushing updates to the Windows Azure Web Site you created previously, using the following command:

		git remote add azure [URL for remote repository]

	**Note**: the URL used should be the one returned at the end of the **Create a Windows Azure Web Site and Set up Git Publishing** section. If you forgot to save the URL earlier you can retrieve it now by clicking the “Deployment” tab of your Windows Azure Web Site within the management portal

    ![Git deployment instructions returned after creating a repository for the website.][portal-git-remote-url]

4. Push your changes to Windows Azure using the following command:

		git push azure master

	You will be prompted for the password you created earlier and will see the following output:
	
	![Git command line output][git-push-azure]
    
	If you navigate to the deployments tab of your Windows Azure Web Site within the management portal, you will see your first deployment in the deployment history:

	![Git deployment status on the portal][git-deployments-first] 

5. Browse to **http://[your web site url]/** to begin using the application. You can find your web site url on the "Dashboard" tab of your Windows Azure Web Site within the management portal.

##Publish changes to your application

1. Open the **server.js** file in a text editor, and change 'Hello World\n' to 'Hello Azure\n'. Save the file.
2. From the command-line, change directories to the **helloworld** directory and run the following commands:

		git add .
		git commit -m "changing to hello azure"
		git push azure master

	You will be prompted for the password you created earlier. If you navigate to the deployments tab of your Windows Azure Web Site within the management portal, you will see your updated deployment history:
	
	![Git deployment status updated on the portal][git-deployments-second]

3. Browse to **http://[your web site url]/** and note that the updates have been applied.

	![A web page displaying 'Hello Azure'][helloworld-completed]

##Next steps

While the steps in this article use the Windows Azure Portal to create a web site, you can also use the [Windows Azure Command-Line Tools for Mac and Linux] to perform the same operations.

##Additional Resources

* [Windows Azure PowerShell]
* [Windows Azure Command-Line Tools for Mac and Linux]

[Windows Azure PowerShell]: http://windowsazure.com
[node]: http://nodejs.org/
[nodejs.org]: http://nodejs.org/
[Git]: http://git-scm.com/
[Windows Azure]: http://windowsazure.com
[Windows Azure Portal]: http://manage.windowsazure.com
[for free]: /en-us/pricing/free-trial
[git-scm.com download page]: http://git-scm.com/download
[nodejs.org download page]: http://nodejs.org/#download
[package management system]: http://en.wikipedia.org/wiki/List_of_software_package_management_systems
[Windows Azure Command-Line Tools for Mac and Linux]: /en-us/develop/nodejs/how-to-guides/command-line-tools/
[Publishing with Git]: /en-us/develop/nodejs/common-tasks/publishing-with-git/

[helloworld-completed]: ../Media/helloazure.png
[helloworld-localhost]: ../Media/helloworldlocal.png
[portal-new-website]: ../../Shared/Media/plus-new.png
[portal-quick-create]: ../../Shared/Media/create-quick-website.png
[portal-website-list]: ../Media/list-of-websites.png
[portal-website-dashboard-setup-git]: ../../Shared/Media/setup-git-publishing.png
[portal-git-username-password]: ../../Shared/Media/git-deployment-credentials.png
[portal-git-instructions]: ../Media/git_instructions.jpg
[portal-git-remote-url]: ../Media/git_remote_url.jpg
[git-push-azure]: ../Media/git_push_azure.png
[git-deployments-first]: ../Media/git_deployments_first.jpg
[git-deployments-second]: ../Media/git_deployments_second.jpg
[portal-website-stop-delete]: ../../Shared/Media/stop-delete-icons.png
[setup-git-publishing]: ../Media/setup_git_publishing.jpg
[go-to-dashboard]: ../../Shared/Media/go_to_dashboard.jpg