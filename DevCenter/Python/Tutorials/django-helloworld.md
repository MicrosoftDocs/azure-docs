# Django Hello World Web Application

Developing for Windows Azure is easy when using the available tools.
This tutorial assumes you have no prior experience using Windows Azure.
On completing this guide, you will have an application that uses
multiple Windows Azure resources up and running in the cloud.

You will learn:

* How to create a new Windows Azure Django application using the Windows PowerShell tools.
* How to run your Django application locally using the Windows Azure compute emulator.
* How to publish and re-publish your application to Windows Azure.

By following this tutorial, you will build a simple Hello World web
application. The application will be hosted in an instance of a web role
that, when running in Windows Azure, is itself hosted in a dedicated
virtual machine (VM).

A screenshot of the completed application is below:

![A browser window displaying the hello world page on Windows Azure][]

## <a id="setup"> </a>Setting Up the Development Environment

To set up your Python and Django environments, please see the [Installation Guide][] for more information.

*Note for Windows*: if you used the Windows WebPI installer, you already have Django and the Client Libs installed.

## Creating a New Django Application

The Windows Azure SDK includes a Windows PowerShell environment that is configured for Windows Azure and Python development. It includes tools that you can use to create and publish Django applications.

1.  On the **Start** menu, click **All Programs, Windows Azure**, right-click **Windows Azure PowerShell**, and then select **Run As Administrator**. Opening
    your Windows PowerShell environment this way ensures that all of the
    Python command-line tools are available. Running with elevated
    privileges avoids extra prompts when working with the Windows Azure
    Emulator.
    
2.  Create a new **django** directory on your C drive, and change to the
    c:\\django directory:

    ![A command prompt displaying the django directory creation][]

3.  Enter the following cmdlet to create a new solution:


    ![The result of the New-AzureService command][]

    The **New-AzureServiceProject** cmdlet generates a basic structure for
    creating a new Windows Azure Python application. It contains
    configuration files necessary for publishing to Windows Azure. The
    cmdlet also changes your working directory to the directory for the
    service.

    Enter the following command to see a listing of the files that were
    generated:


    ![A directory listing of the service folder][]

    -   ServiceConfiguration.Cloud.cscfg,
        ServiceConfiguration.Local.cscfg and ServiceDefinition.csdef are
        Windows Azure-specific files necessary for publishing your
        application. For more information about these files, see
        [Overview of Creating a Hosted Service for Windows Azure][].
    -   deploymentSettings.json stores local settings that are used by
        the Windows Azure PowerShell deployment cmdlets.

4.  Enter the following command to add a new web role using the
    **Add-AzureDjangoWebRole** cmdlet:

        PS C:\django\helloworld> Add-AzureDjangoWebRole hello_dj

    You will see the following response:

    ![The output of the Add-AzureDjangoWebRole command][]

    The **Add-AzureDjangoWebRole** cmdlet creates a new directory for your
    application and generates additional files that will be needed when
    your application is published. In Windows Azure, *roles* define
    components that can run in the Windows Azure execution environment.
    A *web role* is customized for web application programming.

    By default if you do not provide a role name, one will be created
    for you i.e. WebRole1. You can provide a name as the first parameter
    to **Add-AzureDjangoWebRole** to override i.e. **Add-AzureDjangoWebRole
    hello_dj**

    Change to the **hello_dj** directory and list its files:

    ![A directory listing of the webrole folder][]

    Again change to the **hello_dj** directory and list its files:
	
    ![A directory listing of the django folder][]

    -   settings.py contains Django settings for your application.
    -   urls.py contains the mapping code between each url and its view.

<p></p>

5.  Create a new file named **views.py** in the hello_dj subdirectory, as a sibling of **urls.py**. This will contain the view that renders the "hello world" page. Start your editor and enter the following:
		
		from django.http import HttpResponse
		def hello(request):
    		html = "<html><body>Hello World!</body></html>"
    		return HttpResponse(html)


8.  Now enter the following into the **urls.py** file:

		from django.conf.urls.defaults import patterns, include, url
		from hello_dj.views import hello
		urlpatterns = patterns('',
			(r'^$',hello),
		)


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

        PS C:\django\helloworld\hello_dj\hello_dj> Start-AzureEmulator -launch

    The **–launch** parameter specifies that the tools should
    automatically open a browser window and display the application once
    it is running in the emulator. A browser opens and displays “Hello
    World!” as shown in the screenshot below. This indicates that the
    service is running in the compute emulator and is working correctly.

    ![A web browser displaying the Hello World web page on emulator][]

2.  To stop the compute emulator, you can access it (as well as the
    storage emulator, which you will leverage later in this tutorial)
    from the Windows taskbar as shown in the screenshot below:

    ![The menu displayed when right-clicking the Windows Azure emulator from the task bar][]

## Deploying the Application to Windows Azure

In order to deploy your application to Windows Azure, you need an
account. If you do not have one you can create a free trial account.
Once you are logged in with your account, you can download a Windows
Azure publishing profile. The publishing profile authorizes your
computer to publish deployment packages to Windows Azure using the
Windows PowerShell cmdlets.

### Creating a Windows Azure Account

1.  Open a web browser, and browse to [http://www.windowsazure.com][].

    To get started with a free account, click on **Free Trial** in the
    upper right corner and follow the steps.

    ![A browser window displaying http://www.windowsazure.com/ with the Free Trial link highlighted][]

2.  Your account is now created. You are ready to deploy your
    application to Windows Azure!

### <a id="download_publishing_settings"> </a>Downloading the Windows Azure Publishing Settings

1.  From the Windows PowerShell window, launch the download page by
    running the following cmdlet:

        PS C:\django\helloworld\hello_dj\hello_dj> Get-AzurePublishSettingsFile

    This launches the browser for you to log into the Windows Azure
    Management Portal with your Windows Live ID credentials.

    ![A browser window displaying the liveID sign in page][]

2.  Log into the Management Portal. This takes you to the page to
    download your Windows Azure publishing settings.

3.  Save the profile to a file at **c:\\django\\elvis.publishSettings**:

    ![Internet Explorer displaying the save as dialog for the publishSettings file.][]

4.  In the Windows PowerShell window, use the following cmdlet to
    configure the Windows PowerShell for Django cmdlets to use the
    Windows Azure publishing profile you downloaded:

        PS C:\django\helloworld\hello_dj\hello_dj> Import-AzurePublishSettingsFile c:\django\elvis.publishSettings

    After importing the publish settings, consider deleting the
    downloaded .publishSettings as the file contains information that
    can be used by others to access your account.

### Publishing the Application

1.  Publish the application using the **Publish-AzureServiceProject** cmdlet,
    as shown below.

    -   **name** specifies the name for the service. The name must be
        unique across all other services in Windows Azure. For example,
        below, “HelloDJ” is suffixed with “Contoso,” the company name,
        to make the service name unique.
    -   **location** specifies the country/region for which the
        application should be optimized. You can expect faster loading
        times for users accessing it from this region. Examples of the\\
        available regions include: North Central US, Anywhere US,
        Anywhere Asia, Anywhere Europe, North Europe, South Central US,
        and Southeast Asia.
    -   **launch** specifies to open the browser at the location of the
        hosted service after publishing has completed.

    <!-- -->

        PS C:\django\helloworld\hello_dj\hello_dj> Publish-AzureServiceProject –name HelloDJContoso –location "North Central US” -launch

    Be sure to use a **unique name**, otherwise the publish process will
    fail. After publishing succeeds, you will see the following
    response:

    ![The output of the Publish-AzureService command][]

    The **Publish-AzureServiceProject** cmdlet performs the following steps:

    1.  Creates a package that will be deployed to Windows Azure. The
        package contains all the files in your Django application
        folder.
    2.  Creates a new storage account if one does not exist. The Windows
        Azure storage account is used in the next section of the
        tutorial for storing and accessing data.
    3.  Creates a new hosted service if one does not already exist. A
        *hosted service* is the container in which your application is
        hosted when it is deployed to Windows Azure. For more
        information, see [Overview of Creating a Hosted Service for Windows Azure][].
    4.  Publishes the deployment package to Windows Azure.

    It can take 5–7 minutes for the application to deploy. Since this is
    the first time you are publishing, Windows Azure provisions a
    virtual machine (VM), performs security hardening, creates a web
    role on the VM to host your application, deploys your code to that
    web role, and finally configures the load balancer and networking so
    you application is available to the public.

    The browser also opens to the URL for your service and display a web
    page that calls your service.

    ![A browser window displaying the hello world page on Windows Azure][]

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

        PS C:\django\helloworld\hello_dj\hello_dj> Stop-AzureService

    Stopping the service may take several minutes. When the service is
    stopped, you receive a message indicating that it has stopped.

    ![The status of the Stop-AzureService command][]

2.  To delete the service, call the following cmdlet:

        PS C:\django\helloworld\hello_dj\hello_dj> Remove-AzureServiceProject

3.  When prompted, enter **Y** to delete the service.

    Deleting the service may take several minutes. After the service has
    been deleted you receive a message indicating that the service was
    deleted.

    ![The status of the Remove-AzureService command][]

**Note**: Deleting the service does not delete the storage account that
was created when the service was initially published, and you will
continue to be billed for storage used. Since storage accounts can be
used by multiple deployments, be sure that no other deployed service is
using the storage account before you delete it. For more information on
deleting a storage account, see [How to Delete a Storage Account from a Windows Azure Subscription][].

[A browser window displaying the hello world page on Windows Azure]: ../Media/django-helloworld-browser-azure.png
[A command prompt displaying the django directory creation]: ../Media/django-helloworld-ps-create-dir.png
[The result of the New-AzureService command]: ../Media/django-helloworld-ps-new-azure-service.png
[A directory listing of the service folder]: ../Media/django-helloworld-ps-service-dir.png
[Overview of Creating a Hosted Service for Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg432976.aspx
[The output of the Add-AzureDjangoWebRole command]: ../Media/django-helloworld-ps-add-webrole.png
[A directory listing of the webrole folder]: ../Media/django-helloworld-ps-webrole-dir.png
[A directory listing of the django folder]: ../Media/django-helloworld-ps-django-dir.png
[A web browser displaying the Hello World web page on emulator]: ../Media/django-helloworld-browser-emulator.png
[The menu displayed when right-clicking the Windows Azure emulator from the task bar]: ../../../DevCenter/Node/Media/getting-started-11.png
[http://www.windowsazure.com]: http://www.windowsazure.com
[A browser window displaying http://www.windowsazure.com/ with the Free Trial link highlighted]: ../../../DevCenter/dotNet/Media/getting-started-12.png
[A browser window displaying the liveID sign in page]: ../../../DevCenter/Node/Media/getting-started-13.png
[Internet Explorer displaying the save as dialog for the publishSettings file.]: ../../../DevCenter/Node/Media/getting-started-14.png
[The output of the Publish-AzureService command]: ../Media/django-helloworld-ps-publish.png
[The status of the Stop-AzureService command]: ../Media/django-helloworld-ps-stop.png
[The status of the Remove-AzureService command]: ../Media/django-helloworld-ps-remove.png
[How to Delete a Storage Account from a Windows Azure Subscription]: http://msdn.microsoft.com/en-us/library/windowsazure/hh531562.aspx

[Installation Guide]: http://www.windowsazure.com/en-us/develop/python/commontasks/how-to-install-python