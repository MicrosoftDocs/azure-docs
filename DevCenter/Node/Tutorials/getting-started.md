<properties linkid="dev-nodejs-getting-started" urldisplayname="Node.js Web Application" headerexpose="" pagetitle="Node.js Getting Started Guide" metakeywords="Azure node.js getting started, Azure Node.js tutorial, Azure Node.js tutorial" footerexpose="" metadescription="An end-to-end tutorial that helps you develop a simple Node.js web application and deploy it to Windows Azure." umbraconavihide="0" disquscomments="1"></properties>

# Node.js Cloud Service

Developing for Windows Azure is easy when using the available tools.
This tutorial assumes you have no prior experience using Windows Azure.
On completing this guide, you will have an application that uses
multiple Windows Azure resources up and running in the cloud.

You will learn:

-   How to create a new Windows Azure Node.js application using the
    Windows PowerShell tools.
-   How to run your Node application locally using the Windows Azure
    compute emulator
-   How to publish and re-publish your application to a Cloud Service in Windows Azure.

By following this tutorial, you will build a simple Hello World web
application. The application will be hosted in an instance of a web role
that, when running in Windows Azure, is itself hosted in a dedicated
virtual machine (VM).

A screenshot of the completed application is below:

![A browser window displaying Hello World][]

## <a id="setup"> </a>Setting Up the Development Environment

Before you can begin developing your Windows Azure application, you need
to get the tools and set up your development environment.

1.  To install the Windows Azure SDK for Node.js, click the button
    below:

    [Get Tools and SDK][]

2.  Select **Install Now**, and when prompted to run or save
    azurenodesdk.exe, click Run:

    ![Internet Explorer promoting to run a downloaded file][]

3.  Click **Install** in the installer window and proceed with the
    installation:

    ![Web Platform Installer screen for the Windows Azure SDK. The install button is highlighted.][install-button]

Once the installation is complete, you have everything necessary to
start developing. The following components are installed:

-   Node.js
-   IISNode
-   NPM for Windows
-   Windows Azure Compute & Storage Emulators
-   Windows Azure PowerShell

## Creating a New Node Application

The Windows Azure SDK for Node.js includes a Windows PowerShell
environment that is configured for Windows Azure and Node development.
It includes tools that you can use to create and publish Node
applications.

1.  On the **Start** menu, click **All Programs, Windows Azure**, right-click **Windows Azure PowerShell**, and then select **Run As Administrator**. Opening
    your Windows PowerShell environment this way ensures that all of the
    Node command-line tools are available. Running with elevated
    privileges avoids extra prompts when working with the Windows Azure
    Emulator.

    ![The Windows Start menu with the Windows Azure SDK Node.js entry expanded][]

2.  Create a new **node** directory on your C drive, and change to the
    c:\\node directory:

    ![A command prompt displaying the commands 'mkdir c:\\node' and 'cd node'.][mkdir]

3.  Enter the following cmdlet to create a new solution:

        PS C:\node> New-AzureServiceProject tasklist

    You will see the following response:

    ![The result of the New-AzureService tasklist command][]

    The **New-AzureServiceProject** cmdlet generates a basic structure for
    creating a new Windows Azure Node application which will be published to a Cloud Service. It contains
    configuration files necessary for publishing to Windows Azure. The
    cmdlet also changes your working directory to the directory for the
    service.

    Enter the following command to see a listing of the files that were
    generated:

        PS C:\node\tasklist> ls

    ![A directory listing of the tasklist folder.][]

    -   ServiceConfiguration.Cloud.cscfg,
        ServiceConfiguration.Local.cscfg and ServiceDefinition.csdef are
        Windows Azure-specific files necessary for publishing your
        application. For more information about these files, see
        [Overview of Creating a Hosted Service for Windows Azure][].
    -   deploymentSettings.json stores local settings that are used by
        the Windows Azure PowerShell deployment cmdlets.

4.  Enter the following command to add a new web role using the
    **Add-AzureNodeWebRole cmdlet**:

        PS C:\node\tasklist> Add-AzureNodeWebRole

    You will see the following response:

    ![The output of the Add-AzureNodeWebRole command.][]

    The **Add-AzureNodeWebRole**cmdlet creates a new directory for your
    application and generates additional files that will be needed when
    your application is published. In Windows Azure, *roles* define
    components that can run in the Windows Azure execution environment.
    A *web role* is customized for web application programming.

    By default if you do not provide a role name, one will be created
    for you i.e. WebRole1. You can provide a name as the first parameter
    to **Add-AzureNodeWebRole** to override i.e. **Add-AzureNodeWebRole
    MyRole**

    Enter the following commands to change to the newly generated
    directory and view its contents:

        PS C:\node\tasklist> cd WebRole1
        PS C:\node\tasklist\WebRole1> ls

    ![A directory listing of the WebRole1 folder][]

    -   server.js contains the starter code for your application.

5.  Open the server.js file in Notepad. Alternatively, you can open the
    server.js file in your favorite text editor.

        PS C:\node\tasklist\WebRole1> notepad server.js

    This file contains the following starter code that the tools have
    generated. This code is almost identical to the “Hello World” sample
    on the nodejs.org website, except:

    -   The port has been changed to allow IIS to handle HTTP traffic on
        behalf of the application. IIS Node.js integration provides
        Node.js applications with a number of benefits when running
        on-premise or in Windows Azure, including: process management,
        scalability on multi-core servers, auto-update, side-by-side
        with other languages, etc.
    -   Console logging has been removed.

    ![Notepad displaying the contents of server.js][]

## Running Your Application Locally in the Emulator

One of the tools installed by the Windows Azure SDK is the Windows Azure
compute emulator, which allows you to test your application locally. The
compute emulator simulates the environment your application will run in
when it is deployed to the cloud, including providing access to services
like Windows Azure Table Storage. This means you can test your
application without having to actually deploy it.

1.  Close Notepad and switch back to the Windows PowerShell window.
    Enter the following cmdlet to run your service in the emulator and
    launch a browser window:

        PS C:\node\tasklist\WebRole1> Start-AzureEmulator -Launch

    The **–launch** parameter specifies that the tools should
    automatically open a browser window and display the application once
    it is running in the emulator. A browser opens and displays “Hello
    World,” as shown in the screenshot below. This indicates that the
    service is running in the compute emulator and is working correctly.

    ![A web browser displaying the Hello World web page][]

2.  To stop the compute emulator, use the **Stop-AzureEmulator** command:

		PS C:\node\tasklist\WebRole1> Stop-AzureEmulator

## Deploying the Application to Windows Azure

In order to deploy your application to Windows Azure, you need an
account. If you do not have one you can create a free trial account.
Once you are logged in with your account, you can download a Windows
Azure publishing profile. The publishing profile authorizes your
computer to publish deployment packages to Windows Azure using the
Windows PowerShell cmdlets.

### Creating a Windows Azure Account

<div chunk="../../Shared/Chunks/create-azure-account.md" />

### <a id="download_publishing_settings"> </a>Downloading the Windows Azure Publishing Settings

1.  From the Windows PowerShell window, launch the download page by
    running the following cmdlet:

        PS C:\node\tasklist\WebRole1> Get-AzurePublishSettingsFile

    This launches the browser for you to log into the Windows Azure
    Management Portal with your Windows Live ID credentials.

    ![A browser window displaying the liveID sign in page][]

2.  Log into the Management Portal. This takes you to the page to
    download your Windows Azure publishing settings.

3.  Save the profile to a file location you can easily access:

    ![Internet Explorer displaying the save as dialog for the publishSettings file.][]

4.  In the Windows Azure PowerShell window, use the following cmdlet to
    configure the Windows PowerShell for Node.js cmdlets to use the
    Windows Azure publishing profile you downloaded:

        PS C:\node\tasklist\WebRole1> Import-AzurePublishSettingsFile [path to file]

    After importing the publish settings, consider deleting the
    downloaded .publishSettings as the file contains information that
    can be used by others to access your account.

### Publishing the Application

1.  Publish the application using the **Publish-AzureServiceProject** cmdlet,
    as shown below.

    -   **ServiceName** specifies the name for the service. The name must be
        unique across all other services in Windows Azure. For example,
        below, “TaskList” is suffixed with “Contoso,” the company name,
        to make the service name unique. By default if ServiceName is not provided, 
        the project folder name will be used.
    -   **Location** specifies the country/region for which the
        application should be optimized. You can expect faster loading
        times for users accessing it from this region. Examples of the\\
        available regions include: North Central US, Anywhere US,
        Anywhere Asia, Anywhere Europe, North Europe, South Central US,
        and Southeast Asia.
    -   **Launch** specifies to open the browser at the location of the
        hosted service after publishing has completed.

    <!-- -->

        PS C:\node\tasklist\WebRole1> Publish-AzureServiceProject –ServiceName TaskListContoso –Location "North Central US” -Launch

    Be sure to use a **unique name**, otherwise the publish process will
    fail. After publishing succeeds, you will see the following
    response:

    ![The output of the Publish-AzureService command][]

    The **Publish-AzureServiceProject** cmdlet performs the following steps:

    1.  Creates a package that will be deployed to Windows Azure. The
        package contains all the files in your node.js application
        folder.
    2.  Creates a new storage account if one does not exist. The Windows
        Azure storage account is used in the next section of the
        tutorial for storing and accessing data.
    3.  Creates a new hosted service if one does not already exist. A
        *hosted service*is the container in which your application is
        hosted when it is deployed to Windows Azure. For more
        information, see [Overview of Creating a Hosted Service for Windows Azure][].
    4.  Publishes the deployment package to Windows Azure.

    It can take 5–7 minutes for the application to deploy. Since this is
    the first time you are publishing, Windows Azure provisions a
    virtual machine (VM), performs security hardening, creates a web
    role on the VM to host your application, deploys your code to that
    web role, and finally configures the load balancer and networking so
    you application is available to the public.

    After the deployment is complete, the following response appears.

    ![The full status output of the Publish-AzureService command][]

    The browser also opens to the URL for your service and display a web
    page that calls your service.

    ![A browser window displaying the hello world page. The URL indicates the page is hosted on Windows Azure.][A browser window displaying Hello World]

    Your application is now running on Windows Azure! The hosted service
    contains the web role you created earlier. You can easily scale your
    application by changing the number of instances allocated to each
    role in the ServiceConfiguration.Cloud.cscfg file. You may want to
    use only one instance when deploying for development and test
    purposes, but multiple instances when deploying a production
    application.

## Stopping and Deleting Your Application

After deploying your application, you may want to disable it so you can
avoid costs or build and deploy other applications within the free trial
time period.

Windows Azure bills web role instances per hour of server time consumed.
Server time is consumed once your application is deployed, even if the
instances are not running and are in the stopped state.

The following steps show you how to stop and delete your application.

1.  In the Windows PowerShell window, stop the service deployment
    created in the previous section with the following cmdlet:

        PS C:\node\tasklist\WebRole1> Stop-AzureService

    Stopping the service may take several minutes. When the service is
    stopped, you receive a message indicating that it has stopped.

    ![The status of the Stop-AzureService command][]

2.  To delete the service, call the following cmdlet:

        PS C:\node\tasklist\WebRole1> Remove-AzureService

	When prompted, enter **Y** to delete the service.

    Deleting the service may take several minutes. After the service has
    been deleted you receive a message indicating that the service was
    deleted.

    ![The status of the Remove-AzureService command][]

<div class="dev-callout">
<strong>Note</strong>
<p>Deleting the service does not delete the storage account that
was created when the service was initially published, and you will
continue to be billed for storage used. Since storage accounts can be
used by multiple deployments, be sure that no other deployed service is
using the storage account before you delete it. For more information on
deleting a storage account, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh531562.aspx">How to Delete a Storage Account from a Windows Azure Subscription</a>.</p>
</div>

  [A browser window displaying Hello World]: ../Media/node21.png
  [Get Tools and SDK]: http://go.microsoft.com/?linkid=9790229
  [Internet Explorer promoting to run a downloaded file]: ../Media/getting-started-3.png
  [install-button]: ../Media/getting-started-4.png
  [The Windows Start menu with the Windows Azure SDK Node.js entry expanded]: ../../Shared/Media/azure-powershell-menu.png
  [mkdir]: ../Media/getting-started-6.png
  [The result of the New-AzureService tasklist command]: ../Media/node9.png
  [A directory listing of the tasklist folder.]: ../Media/getting-started-7.png
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
