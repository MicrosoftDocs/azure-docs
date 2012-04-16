# Node.js Web Application

Developing for Windows Azure is easy when using the available tools. This tutorial assumes you have no prior experience using Windows Azure. On completing this guide, you will have an application that uses multiple Windows Azure resources up and running in the cloud.

You will learn:

* How to create a new Windows Azure Node.js application using the Windows PowerShell tools.

* How to run your Node application locally

* How to publish and re-publish your application to Windows Azure.

following this tutorial, you will build a simple Hello World web application. The application will be hosted in an instance of a web role that, when running in Windows Azure, is itself hosted in a dedicated virtual machine (VM).
 
A screenshot of the completed application is below:

(TODO: provide a description of the final application, followed by a screenshot of the completed application.)

##Setting Up the Development Environment

###Download and Install the SDK

In this section, you will download and install the Windows Azure SDK for Node.js.

**(TODO: Figure out our steps for obtaining the SDK & tools. Same as it is now? Confirm with Mike and Molly.)**

###Creating a Windows Azure Account

In this section, you will create a Windows Azure subscription. This subscription will be used by the Windows Azure SDK tools in subsequent steps.

(TODO: Steps on creating a free account)

###Downloading the Windows Azure Publishing Settings

In this section, you will download the publishing settings for your Windows Azure subscription. Unless you change your subscription or clear your subscription settings, you will only need to perform these steps once as the publishing settings are cached on your computer.

1. Open the Finder and navigate to the Applications folder, then Utilities. Finally, double click on Terminal to launch the Terminal application.

    (TODO Screenshot)

2. From the Terminal window, launch the download page by running the following command:

        azure account download

    This launches the browser for you to log into the Windows Azure Management Portal with your Windows Live ID credentials.

    (TODO Screenshot)

3. Log into the Management Portal. This takes you to the page to download your Windows Azure publishing settings.

4. Save the profile to the Downloads folder, using the filename AzureSubscription.publishsettings:

    (TODO Screenshot)

3. To import the subscription information, enter the following command in the Terminal window:

        azure account import ~\Downloads\AzureSubscription.publishsettings

    This command will parse the .publishsettings file and store the information contained in it to the ~\.azure directory. You can clear this information by using the `azure account clear` command if you wish to remove this information from your computer.

    **Note**: After importing the publish settings, you should delete the .publishsettings file as it is no longer required and contains information that could be used to manage your Windows Azure subscription.

##Creating a New Node Application

In this section you will use these tools to create a new application.

1. Open the Terminal application if it is not currently running, and enter the following command:

        azure create site tasklist --git

    This command creates a folder named *tasklist* on your computer, as well as create a new Windows Azure Web Site with the same name on your subscription. The `--git` parameter will automatically create a git repository for this folder, and setup the Windows Azure Web Site as a remote.

2. **(TODO more steps)**

3. 

##Next Steps

(TODO: Optional section that points the user to related topics and additional information.  Start with a short  summary and then transition to a list of related articles.)

* (TODO: Short sentence of link1): [(TODO: Enter link1 text)] [NextStepsLink1]
* (TODO: Short sentence of link2): [(TODO: Enter link2 text)] [NextStepsLink2]

[NextStepsLink1]: (TODO: enter Next Steps 1 URL)
[NextStepsLink2]: (TODO: enter Next Steps 2 URL)

[Image1]: (TODO: if used an image1, enter the url here, otherwise delete this)
[Image2]: (TODO: if used an image2, enter the url here, otherwise delete this)