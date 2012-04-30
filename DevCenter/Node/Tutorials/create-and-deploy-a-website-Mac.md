# Node.js Web Application

This tutorial shows you how to create a [node] application and deploy it to [Windows Azure] using [Git]. The instructions in this tutorial can be followed on any development platform that is capable of running node.

You will learn:

* How to create a Windows Azure Web Site using the Windows Azure Developer Portal

* How to publish and re-publish your application to Windows Azure using Git

* How to stop and delete a Windows Azure Web Site

By following this tutorial, you will build a simple Hello World web application in node. The application will be hosted in a Windows Azure Website when deployed.
 
A screenshot of the completed application is below:

![A browser displaying the 'Hello World' message.][helloworld-completed]

The instructions in this article have been tested on the following platforms:

* Windows 7
* OS X **version???**

**Note**: This tutorial makes reference to the **~/node/helloworld** folder. This path indicates that the **node** directory is within the current user's home directory. If you wish to locate the application in a different location, or the path structure is different on the operating system you are using, you can substitute a different path. For example, **c:\node\helloworld** or **/home/username/node/helloworld**.

**Note**: The steps below reference the Terminal application, which is the command-line interface for OS X systems. If you are using an operating system other than OS X, substitue references to the Terminal application with the command-line interface available on your operating system.

##Build and Test Your Application Locally

1. Using a text editor, create a new file named **server.js** in the **~/node/helloworld** directory. If the **~/node/helloworld** directory does not exist, create it.

2. Add the following as the contents of the **server.js** file, and then save it:

        var http = require('http')
        var port = process.env.port || 1337;
        http.createServer(function(req, res) {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Hello World\n');
        }).listen(port);

3. Open the Terminal application if it is not currently running, and enter the following command:

        node server.js

4. Open your web browser and navigate to http://localhost:1337. A web page displaying "Hello World" will appear as shown in the screenshot below:

    ![A browser displaying the 'Hello World' message.][helloworld-localhost]

5. To stop the application, switch to the Terminal window and hold down the **CTRL** and **C** keys on your keyboard.

##Create a Windows Azure Website and Set up Git Publishing

Follow these steps to create a Windows Azure Website, and then enable Git publishing for the website. If you do not already have a Windows Azure subscription, you can sign up [for free].

1. Login to the [Windows Azure Portal].

2. Click the **+ NEW** icon on the bottom left of the portal

    ![The Windows Azure Portal with the +NEW link highlighted.][portal-new-website]

3. Click **Web Site**, then **Quick Create**. Enter a value for **URL** and select the datacenter for your website in the **REGION** dropdown. Click the checkmark at the bottom of the dialog.

    ![The Quick Create dialog][portal-quick-create]

4. When the website has been created, you will see the text **Creation of Web Site '[SITENAME]' completed successfully**. 

	![The site created successfully message.][portal-website-created]

5. Click on the name of the website in the list at the top of the page.

	![The list of websites.][portal-website-list]

	This will display the Dashboard for the selected website.

	![The website dashboard.][portal-website-dashboard]

6. At the bottom of the Dashboard, select **Set up Git Publishing**.

	![The dashboard, with Set up Git Publishing highlighted.][portal-website-dashboard-setup-git]

7. To enable Git publishing, you must provide a user name and password. Make a note of the user name and password you create, as they will be used for Git publishing to all Windows Azure Websites you create.

	![The dialog prompting for user name and password.][portal-git-username-password]

	**Note**: If you have previously setup a Windows Azure Website, you will not be prompted for the user name or password. Instead, a Git repository will be created using the existing user name and password.

8. Once the Git repository is ready, you will be presented with instructions on initialize a repository for your local application. These instructions also include the commands to create a remote for your Windows Azure Website, and to push the files to the website.

	![Git deployment instructions returned after creating a repository for the website.][portal-git-instructions]

##Publish Your Application

**Note**: The steps below are based on the instructions returned at the end of the **Create a Windows Azure Website and Set up Git Publishing** section.

1. In the Terminal window, change directories to your application directory and enter the following commands to initialize a local Git repository. If you have already initialized a local repository for this application, skip this step.

		git init

2. Use the following commands to add files to the repository:

		git add .
		git commit -m "initial commit"

3. A Git remote is a link to a remote repository, either for fetching updates from the remote repository or pushing updates to it. To create a remote for the Windows Azure Website you created previously, use the following command:

		git add remote azure [URL for remote repository]

	This will create a remote named **azure**.

	**Note**: the URL used should be the one returned at the end of the **Create a Windows Azure Website and Set up Git Publishing** section.

4. Push the local repository to the **master** branch of the remote repository **azure** repository by using the following command:

		git push azure master

	You will be prompted for the password you created earlier.

5. Browse to **http://[your website url]/** to begin using the application.

###Modify and Re-Publish Your Application

1. Open the **server.js** file in a text editor, and change 'Hello World\n' to 'Hello Azure\n'. Save the file.

2. In the Terminal window, change directories to your application directory and enter the following commands to add the changes to the local repository:

		git add .
		git commit -m "changing to hello azure"

3. Use the following command to push updates to the **azure** remote:

		git push azure master

4. Browse to **http://[your website url]/** and note that the updates have been applied.

	![A web page displaying 'Hello Azure'][hello-azure]

## Stopping and Deleting Your Application

The following steps show you how to stop and delete your application.

1. If it is not already open, navigate to the [Windows Azure Portal] and login using your web browser.

2. Click on **WEB SITES** in the navigation bar on the left, and then select your website from the list.

	![The website list.][portal-website-list]

3. At the bottom of the page, click **Stop** to stop your web application; click **Delete** to delete it.

	![The portal, with the stop and delete links for a website highlighted.][portal-website-stop-delete]

##Next Steps

While the steps in this article use the Windows Azure Portal to create, stop, and delete a website, you can also use the [command-line tools] to perform [these and other operations].


[node]: http://nodejs.org/
[Git]: http://git-scm.com/
[Windows Azure]: http://windowsazure.com
[Windows Azure Portal]: http://windowsazure.com
[for free]: http://windowsazure.com

[helloworld-completed]: ./Media/node_helloworld_completed.png
[helloworld-localhost]: ./Media/node_helloworld_localhost.png
[hello-azure]: ./Media/node_helloazure.png
[portal-new-website]: ./Media/portal_new_website.png
[portal-quick-create]: ./Media/portal_quick_create.png
[portal-website-created]: ./Media/portal_quick_create.png
[portal-website-list]: ./Media/portal_website_list.png
[portal-website-dashboard]: ./Media/portal_website_dashboard.png
[portal-website-dashboard-setup-git]: ./Media/portal-website-dashboard-setup-git.png
[portal-git-username-password]: ./Media/portal_git_username_password.png
[portal-git-instructions]: ./Media/portal_git_instructions.png
[portal-website-stop-delete]: ./Media/portal_website_stop_delete.png