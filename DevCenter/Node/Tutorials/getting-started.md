<properties linkid="dev-nodejs-getting-started" urlDisplayName="Cloud Service" pageTitle="Node.js Getting Started Guide - Windows Azure Tutorial" metaKeywords="Azure node.js getting started, Azure Node.js tutorial, Azure Node.js tutorial" metaDescription="An end-to-end tutorial that helps you develop a simple Node.js web application and deploy it to Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />


<div chunk="../chunks/article-left-menu.md" />

# Build and deploy a Node.js application to a Windows Azure Cloud Service

On completing this guide, you will have a simple Node.js application running 
in a Windows Azure Cloud Service. Cloud Services are the building blocks of 
scalable cloud applications in Windows Azure. They allow the separation and independent
management and scale-out of front-end and back-end components of your application. These
components are referred to as "web roles" and "worker roles" respectively. Cloud Services 
provide a robust dedicated virtual machine for hosting each role reliably.

<div class="dev-callout"><strong>Looking to build a simple web site?</strong>
<p>If your scenario involves just a simple web site front-end, consider <a href="../create-a-website-(mac)">using a 
    lightweight Windows Azure Web Site.</a> You can easily upgrade to a Cloud Service as 
    your web site grows and your requirements change.</p>
</div>
<br />

By following this tutorial, you will build a simple web application hosted inside a web role. You
will use the compute emulator to test your application locally and then you will deploy it
using PowerShell command-line tools.

A screenshot of the completed application is below:

![A browser window displaying Hello World][]

## Creating a New Node Application

Perform the following tasks to create a new Windows Azure Cloud Service project, along with basic Node.js scaffolding:

1. From the **Start Menu** or **Start Screen**, search for **Windows Azure PowerShell**. Finally, right-click **Windows Azure PowerShell** and select **Run As Administrator**.

	![Windows Azure PowerShell icon][powershell-menu]

	<div chunk="../Chunks/install-dev-tools.md" />


2.  Create a new **node** directory on your C drive, and change to the
    c:\\node directory:

    ![A command prompt displaying the commands 'mkdir c:\\node' and 'cd node'.][mkdir]

3.  Enter the following cmdlet to create a new solution:

        PS C:\node> New-AzureServiceProject helloworld

    You will see the following response:

    ![The result of the New-AzureService helloworld command][]

    The **New-AzureServiceProject** cmdlet generates a basic structure for
    creating a new Windows Azure Node application which will be published to a Cloud Service. It contains
    configuration files necessary for publishing to Windows Azure. The
    cmdlet also changes your working directory to the directory for the
    service.

    The files created by the **New-AzureServiceProject** cmdlet are:

    -   **ServiceConfiguration.Cloud.cscfg**,
        **ServiceConfiguration.Local.cscfg** and **ServiceDefinition.csdef** are
        Windows Azure-specific files necessary for publishing your
        application.
		
		For more information about these files, see
        [Overview of Creating a Hosted Service for Windows Azure][].

    -   **deploymentSettings.json** stores local settings that are used by
        the Windows Azure PowerShell deployment cmdlets.

4.  Enter the following command to add a new web role using the
    **Add-AzureNodeWebRole cmdlet**:

        PS C:\node\helloworld> Add-AzureNodeWebRole

    You will see the following response:

    ![The output of the Add-AzureNodeWebRole command.][]

    The **Add-AzureNodeWebRole** cmdlet creates a new directory for your
    application and generates scaffolding for a basic Node.js application. It also modifies the **ServiceConfiguration.Cloud.csfg**, **ServiceConfiguration.Local.csfg**, and **ServiceDefinition.csdef** files created in the previous step to add configuration entries for the new role.

	<div class="dev-callout">
	<b>Note</b>
	<p>By default if you do not provide a role name, one will be created
    for you. You can provide a name as the first parameter
    to <b>Add-AzureNodeWebRole</b>. For example, <code>Add-AzureNodeWebRole
    MyRole</code></p>
	</div>

5.  Use the following commands to navigate to the **WebRole1** directory, and then open the the **server.js** file in notepad. 

		PS C:\\node\\helloworld> cd WebRole1
        PS C:\node\helloworld\WebRole1> notepad server.js

    The **server.js** file was created by the **Add-AzureNodeWebRole** cmdlet, and contains the following starter code. This code is similar to the “Hello World” sample
    on the [nodejs.org] web site, except:

    -   The port has been changed to allow the application to find the 
        correct port assigned to it by the cloud environment.
    -   Console logging has been removed.

    ![Notepad displaying the contents of server.js][]

## Running Your Application Locally in the Emulator

One of the tools installed by the Windows Azure SDK is the Windows Azure
compute emulator, which allows you to test your application locally. The
compute emulator simulates the environment your application will run in
when it is deployed to the cloud. Perform the following steps to test the application in the emulator.

1.  Close Notepad and switch back to the Windows PowerShell window.
    Enter the following cmdlet to run your service in the emulator:

        PS C:\node\helloworld\WebRole1> Start-AzureEmulator -Launch

    The **–Launch** parameter specifies that the tools should
    automatically open a browser window and display the application once
    it is running in the emulator. A browser opens and displays “Hello
    World,” as shown in the screenshot below. This indicates that the
    service is running in the compute emulator and is working correctly.

    ![A web browser displaying the Hello World web page][]

2.  To stop the compute emulator, use the **Stop-AzureEmulator** command:

		PS C:\node\helloworld\WebRole1> Stop-AzureEmulator

## Deploying the Application to Windows Azure

<div chunk="../../Shared/Chunks/create-account-note.md" />

### <a id="download_publishing_settings"> </a>Downloading the Windows Azure Publishing Settings

In order to deploy your application to Windows Azure, you must first download the publishing settings for your Windows Azure subscription. The following steps guide you through this process:

1.  From the Windows PowerShell window, launch the download page by
    running the following cmdlet:

        PS C:\node\helloworld\WebRole1> Get-AzurePublishSettingsFile

    This will use your browser to navigate to the publish settings download page. You may be prompted to log in with a Microsoft Account. If so, use the account associated with your Windows Azure subscription.

	Save the downloaded profile to a file location you can easily access.

3.  In the Windows Azure PowerShell window, use the following cmdlet to
    configure the Windows PowerShell for Node.js cmdlets to use the
    Windows Azure publishing profile you downloaded:

        PS C:\node\helloworld\WebRole1> Import-AzurePublishSettingsFile [path to file]


	<div class="dev-callout">
	<b>Note</b>
	<p>After importing the publish settings, consider deleting the
    downloaded .publishSettings file as it contains information that
    can be used by others to access your account.</p>
	</div>
    

### Publishing the Application

1.  Publish the application using the **Publish-AzureServiceProject** cmdlet,
    as shown below.

        PS C:\node\helloworld\WebRole1> Publish-AzureServiceProject –ServiceName NodeHelloWorld –Location "East US” -Launch

	- The **servicename** parameter specifies the name used for this deployment. This must be a unique name otherwise the publish process will fail.

	- The **location** parameter specifies the datacenter that the application will be hosted in. To see a list of available datacenters, use the **Get-AzureLocation** cmdlet.

	- The **launch** parameter will launch your browser and navigate to the hosted service after deployment has completed.

    After publishing succeeds, you will see a response similar to the following:

    ![The output of the Publish-AzureService command][]

    The **Publish-AzureServiceProject** cmdlet performs the following steps:

    1.  Creates a package that will be deployed to Windows Azure. The
        package contains all the files in your node.js application
        folder.
    2.  Creates a new **storage account** if one does not exist. The Windows
        Azure storage account is used to store the application package
        during deployment. You can safely delete the storage account after
        deployment is done.
    3.  Creates a new **cloud service** if one does not already exist. A
        **cloud service** is the container in which your application is
        hosted when it is deployed to Windows Azure. For more
        information, see [Overview of Creating a Hosted Service for Windows Azure][].
    4.  Publishes the deployment package to Windows Azure.

    <div class="dev-callout">
	<b>Note</b>
	<p>It can take 5–7 minutes for the application to deploy and become available when first published.</p>
	</div>

    Once the deployment has completed, a browser window will open and navigate to the cloud service.

    ![A browser window displaying the hello world page. The URL indicates the page is hosted on Windows Azure.][A browser window displaying Hello World]

    Your application is now running on Windows Azure!

## Stopping and Deleting Your Application

After deploying your application, you may want to disable it so you can
avoid extra costs. Windows Azure bills web role instances per hour of server 
time consumed. Server time is consumed once your application is deployed, even if the
instances are not running and are in the stopped state.

1.  In the Windows PowerShell window, stop the service deployment
    created in the previous section with the following cmdlet:

        PS C:\node\helloworld\WebRole1> Stop-AzureService

    Stopping the service may take several minutes. When the service is
    stopped, you receive a message indicating that it has stopped.

    ![The status of the Stop-AzureService command][]

2.  To delete the service, call the following cmdlet:

        PS C:\node\helloworld\WebRole1> Remove-AzureService

	When prompted, enter **Y** to delete the service.

    Deleting the service may take several minutes. After the service has
    been deleted you receive a message indicating that the service was
    deleted.

    ![The status of the Remove-AzureService command][]

<div class="dev-callout">
<strong>Note</strong>
<p>Deleting the service does not delete the storage account that
was created when the service was initially published, and you will
continue to be billed for storage used. For more information on
deleting a storage account, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh531562.aspx">How to Delete a Storage Account from a Windows Azure Subscription</a>.</p>
</div>

  [A browser window displaying Hello World]: ../Media/node21.png
  [The Windows Start menu with the Windows Azure SDK Node.js entry expanded]: ../../Shared/Media/azure-powershell-menu.png
  [mkdir]: ../Media/getting-started-6.png
  [nodejs.org]: http://nodejs.org/
  [The result of the New-AzureService helloworld command]: ../Media/node9.png
  [A directory listing of the helloworld folder.]: ../Media/getting-started-7.png
  [Overview of Creating a Hosted Service for Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg432976.aspx
  [The output of the Add-AzureNodeWebRole command.]: ../Media/node11.png
  [A directory listing of the WebRole1 folder]: ../Media/getting-started-8.png
  [Notepad displaying the contents of server.js]: ../Media/node13.png
  [A web browser displaying the Hello World web page]: ../Media/node14.png
  [The menu displayed when right-clicking the Windows Azure emulator from the task bar.]: ../Media/getting-started-11.png
  [http://www.windowsazure.com]: http://www.windowsazure.com
  [A browser window displaying http://www.windowsazure.com/ with the Free Trial link highlighted]: ../Media/getting-started-12.png
  [A browser window displaying the liveID sign in page]: ../Media/getting-started-13.png
  [Internet Explorer displaying the save as dialog for the publishSettings file.]: ../Media/getting-started-14.png
  [The output of the Publish-AzureService command]: ../Media/node19.png
  [The full status output of the Publish-AzureService command]: ../Media/node20.png
  [The status of the Stop-AzureService command]: ../Media/node48.png
  [The status of the Remove-AzureService command]: ../Media/node49.png
  [How to Delete a Storage Account from a Windows Azure Subscription]: http://msdn.microsoft.com/en-us/library/windowsazure/hh531562.aspx
  [powershell-menu]: ../../Shared/Media/azure-powershell-start.png