# Node.js Web Application

This tutorial assumes you have no prior experience using Windows Azure. On completing this guide, you will have a Node.js application running on Windows Azure.

You will learn:

* How to create a Windows Azure Web Site

* How to publish your application to Windows Azure using Git

* How to stop and delete a Windows Azure Web Site

By following this tutorial, you will build a simple Hello World web application. The application will be hosted in a Windows Azure Web Site when deployed. A Web Site is a lightweight web hosting feature of the Windows Azure platform.
 
A screenshot of the completed application is below:

**(TODO: provide a description of the final application, followed by a screenshot of the completed application.)**

##Setting Up the Development Environment

Before you can begin developing your Windows Azure application, you need to get the tools and set up your development environment.

###Windows Azure SDK

**TODO Revisit once we have the updated installer bits to verify steps**

The Windows Azure SDK installs the 'azure' command line interface, which you will use later to deploy your application to Windows Azure.

1. To install the Windows Azure SDK for Node.js, click the button below:

    **(TODO add image/button)**

2. Select **Install Now**, and when prompted to run or save azurenodepowershell.exe, click Run:

    **(TODO screenshot)**

3. Click **Install** in the installer window and proceed with the installation:

    **(TODO screenshot)**

Once the installation is complete, you have everything necessary to start developing. The following components are installed:

* Node.js

* IISNode

* NPM for Windows

* Windows Azure Emulators

* Windows Azure Authoring Components

* Windows Azure PowerShell for Node.js

##Creating a New Node Application

The Windows Azure SDK for Node.js includes a Windows PowerShell environment that is configured for Windows Azure and Node development. It includes tools that you can use to create and publish Node applications.

**TODO: Determine whether we want the universal tools approach or PowerShell. For now, this is the PowerShell approach, but the commands are borrowed from the existing web application process.**

1. On the **Start** menu, click **All Programs**, **Windows Azure SDK Node.js - November 2011**, right-click **Windows Azure PowerShell for Node.js**, and then select **Run As Administrator**. Opening your Windows PowerShell environment this way ensures that all of the Node command-line tools are available. Running with elevated privileges avoids extra prompts when working with the Windows Azure Emulator.

    (TODO Screenshot)

2. Create a new **node** directory on your C drive, and change to the c:\node directory:

    (TODO Screenshot)

3. Enter the following cmdlet to create a new solution:

        PS C:\node> New-AzureService tasklist 

    You will see the following response:

    (TODO Screenshot)

    The **New-AzureService** cmdlet generates a basic structure for creating a new Windows Azure Node application. It contains configuration files necessary for publishing to Windows Azure. The cmdlet also changes your working directory to the directory for the service.
 
    Enter the following command to see a listing of the files that were generated:

        PS C:\node\tasklist> ls

    (TODO Screenshot)
 
4. Open the server.js file in Notepad. Alternatively, you can open the server.js file in your favorite text editor.

        PS C:\node\tasklist\WebRole1> notepad server.js 

    This file contains the following starter code that the tools have generated. This code is almost identical to the “Hello World” sample on the nodejs.org website, except:

    * The port has been changed to allow IIS to handle HTTP traffic on behalf of the application.

    * Console logging has been removed.

    (TODO Screenshot)

##Running Your Application Locally in the Emulator

**TODO Verify that the emulator is still a valid approach for Web Sites**

One of the tools installed by the Windows Azure SDK is the Windows Azure compute emulator, which allows you to test your application locally. The compute emulator simulates the environment your application will run in when it is deployed to the cloud, including providing access to services like Windows Azure Table Storage. This means you can test your application without having to actually deploy it.

1. Close Notepad and switch back to the Windows PowerShell window. Enter the following cmdlet to run your service in the emulator and launch a browser window:

        PS C:\node\tasklist\WebRole1> Start-AzureEmulator -launch 

    The **–launch** parameter specifies that the tools should automatically open a browser window and display the application once it is running in the emulator. A browser opens and displays “Hello World,” as shown in the screenshot below. This indicates that the service is running in the compute emulator and is working correctly.

    (TODO Screenshot)

2. To stop the compute emulator, you can access it from the Windows taskbar as shown in the screenshot below:

    (TODO Screenshot)

##Deploying the Application to Windows Azure

In order to deploy your application to Windows Azure, you need an account. If you do not have one you can create a free account. Once you are logged in with your account, you can download a Windows Azure publishing profile. The publishing profile authorizes your computer to publish deployment packages to Windows Azure using the Windows PowerShell cmdlets.

###Creating a Windows Azure Account

In this section, you will create a Windows Azure subscription. This subscription will be used by the Windows Azure SDK tools in subsequent steps.

**(TODO: Steps on creating a free account)**

###Downloading the Windows Azure Publishing Settings

In this section, you will download the publishing settings for your Windows Azure subscription. Unless you change your subscription or clear your subscription settings, you will only need to perform these steps once as the publishing settings are cached on your local computer.

1. From the Windows PowerShell window, launch the download page by running the following cmdlet:

        PS C:\node\tasklist\WebRole1> Get-AzurePublishSettings 

    This launches the browser for you to log into the Windows Azure Management Portal with your Windows Live ID credentials.

    (TODO Screenshot)

2. Log into the Management Portal. This takes you to the page to download your Windows Azure publishing settings.
 
3. Save the profile to a file at c:\node\AzureSubscription.publishSettings:

    (TODO Screenshot)

4. In the Windows PowerShell window, use the following cmdlet to configure the Windows PowerShell for Node.js cmdlets to use the Windows Azure publishing profile you downloaded:

	PS C:\node\tasklist\WebRole1> Import-AzurePublishSettings c:\node\AuzreSubscription.publishSettings

	After importing the publish settings, consider deleting the downloaded .publishSettings as the file contains information that can be used by others to access your account.


###Publishing the Application

**TODO Verify the cmdlet/process here, or whether we should be using git. Also whether we have to create our site on the portal first or whether it can be handled via powershell.***

If this is the first application you have published as a Windows Azure Web Site, you must use the web portal to create the site.

1. Open the Terminal application if it is not already running, and enter the following command:

        azure site portal

    This will open your browser and navigate to the Windows Azure portal:

    **(TODO Screenshot)**

2. On the portal, select **+ NEW**, and then select **Web Site*.

    **(TODO Screenshot)**

3. Select **Quick Create**, and then enter the site name in the URL field and select the region to create the site in. Finally, select **Create Web Site**.

    **(TODO Screenshot)**

**TBD based on dialog with PMs**

## Stopping and Deleting Your Application

The following steps show you how to stop and delete your application.

1. In the Windows PowerShell window, stop the service deployment created in the previous section with the following cmdlet:

		PS C:\node\tasklist\WebRole1> Stop-AzureService 

	Stopping the service may take several minutes. When the service is stopped, you receive a message indicating that it has stopped.

    **(TODO Screenshot)**

2. To delete the web site, call the following cmdlet:

        PS C:\node\tasklist\WebRole1> Remove-AzureService

3. When prompted, enter **Y** to delete the service. After the service has been deleted, you will receive a message similar to the following:

	**(TODO Screenshot)**

[Overview of Creating a Hosted Service for Windows Azure]: http://windowsazure.com/