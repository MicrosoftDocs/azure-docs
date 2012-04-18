# Node.js Web Application

This tutorial assumes you have no prior experience using Windows Azure. On completing this guide, you will have a Node.js application running on Windows Azure.

You will learn:

* How to create a Windows Azure Web Site

* How to publish your application to Windows Azure using Git

* How to stop and delete a Windows Azure Web Site

following this tutorial, you will build a simple Hello World web application. The application will be hosted in a Windows Azure Web Site when deployed. A Web Site is a lightweight web hosting feature of the Windows Azure platform.
 
A screenshot of the completed application is below:

**(TODO: provide a description of the final application, followed by a screenshot of the completed application.)**

##Setting Up the Development Environment

Before you can begin developing your Windows Azure application, you need to get the tools and set up your development environment.

###Windows Azure SDK

The Windows Azure SDK installs the 'azure' command line interface, which you will use later to deploy your application to Windows Azure.

1. To install the Windows Azure SDK for Node.js, click the button below:

    **(TODO add image/button)**

2. **TODO: Determine final name/process for Mac**

###Node.js

If it is not already installed, you can download the latest version of Node.js from [Node.js website].

###Git

If it is not already installed, you can download the latest version of Git from [Git website].

###Other Tools
In addition to the Windows Azure SDK, Node.js and Git, you will also need access to a text editor or integrated development environment (IDE).

##Creating a New Node Application

**TODO: Refactor once we have scaffolding command**

1. Open the Finder and navigate to the Applications folder, then Utilities. Finally, double click on Terminal to launch the Terminal application.

    **(TODO Screenshot)**

2. Using the Terminal window, create a new **node** directory in your home folder. Create a new **helloworld** directory in the **node** directory, and then change directories to the ~/node/helloworld directory. The commands to perform these tasks are:

        mkdir -p ~/node/helloworld
        cd ~/node/helloworld

3. Using a text editor, create a new *server.js* file in the ~/node/helloworld directory. Add the following as the contents of the *server.js* file, and then save it:

        var http = require('http')
        var port = process.env.port || 1337;
        http.createServer(function(req, res) {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Hello World\n');
        }).listen(port);

## Testing Your Application Locally

To test your application locally, perform the following steps to launch the application using Node:

1. Open the Terminal application if it is not currently running, and enter the following command:

        node server.js

2. Open your web browser and navigate to http://localhost:1337. A web page displaying "Hello World" will appear as shown in the screenshot below:

    **(TODO Screenshot)**

3. To stop the application, switch to the Terminal window and hold down the ctrl and c keys on your keyboard.

##Deploying the Application to Windows Azure

In order to deploy your application to Windows Azure, you need an account. If you do not have one you can create a free trial account. Once you are logged in with your account, you can download a Windows Azure publishing profile. The publishing profile authorizes your computer to publish deployment packages to Windows Azure using the SDK tools.

###Creating a Windows Azure Account

In this section, you will create a Windows Azure subscription. This subscription will be used by the Windows Azure SDK tools in subsequent steps.

**(TODO: Steps on creating a free account)**

###Downloading the Windows Azure Publishing Settings

In this section, you will download the publishing settings for your Windows Azure subscription. Unless you change your subscription or clear your subscription settings, you will only need to perform these steps once as the publishing settings are cached on your computer.

1. From the Terminal window, launch the download page by running the following command:

        azure account download

    This launches the browser for you to log into the Windows Azure Management Portal with your Windows Live ID credentials.

    **(TODO Screenshot)**

2. Log into the Management Portal. This takes you to the page to download your Windows Azure publishing settings.

3. Save the profile to the Downloads folder, the filename will vary depending on your service name. For the purpose of this article we will use AzureSubscription.publishsettings:

    **(TODO Screenshot)**

4. To import the subscription information, enter the following command in the Terminal window. Substitute your .publishsettings filename in the path:

        azure account import ~\Downloads\AzureSubscription.publishsettings

    This command will parse the .publishsettings file and cache the information contained in it to the ~\.azure directory. You can clear this information by using the `azure account clear` command if you wish to remove this information from your computer.

    **Note**: After importing the publish settings, you should delete the .publishsettings file as it is no longer required and contains information that could be used to manage your Windows Azure subscription.

###Publishing the Application

If this is the first application you have published as a Windows Azure Web Site, you must use the web portal to create the site.

1. Open the Terminal application if it is not already running, and enter the following command:

        azure site portal

    This will open your browser and navigate to the Windows Azure portal:

    **(TODO Screenshot)**

2. On the portal, select **+ NEW**, and then select **Web Site*.

    **(TODO Screenshot)**

3. Select **Quick Create**, and then enter the site name in the URL field and select the region to create the site in. Finally, select **Create Web Site**.

    **(TODO Screenshot)**

1. Open the Terminal application if it is not currently running, and enter the following command:

        azure create site helloworld --git --location "South Central US"


    This command creates a new Windows Azure Web Site named 'helloworld'. The --git parameter creates a git repository on Windows Azure, which you will use to deploy this application. The --location parameter specifies the data center that this web site will be hosted in. The output of this command should be similar to the following:

    **(TODO Screenshot)**

2. Using the Terminal, enter the git commands returned by the previous step. These commands will initialize a local git repository for your application, add the existing files to the local repository, create a remote named 'azure' for the web site repository on Windows Azure, and finally push the local files to the 'azure' remote. The result should appear similar to the following:

    **(TODO Screenshot)**

3. Start your web browser and navigate to the URL of your web site. A page should appear that displays "Hello World".

    **(TODO Screenshot)**

    Your application is now running on Windows Azure!

## Stopping and Deleting Your Application

The following steps show you how to stop and delete your application.

1. Using the Terminal, stop the web site deployed in the previous section by entering the following command:

        azure site stop helloworld

    When the service has stopped, you will receive a message similar to the following:

    **(TODO Screenshot)**

2. To delete the web site, enter the following command:

        azure site delete helloworld

    The output of this command will be similar to the following:

    **(TODO Screenshot)**

[Node.js website]: http://nodejs.org/
[Git website]: http://git-scm.com/