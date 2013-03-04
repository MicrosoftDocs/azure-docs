<properties linkid="develop-python-web-app-with-django" urlDisplayName="Web with Django (Windows)" pageTitle="Python web app with Django - Windows Azure tutorial" metaKeywords="Azure Django web app, Azure Django virtual machine" metaDescription="A tutorial that teaches you how to host a Django-based web site on Windows Azure using a Windows Server 2008 R2 virtual machine." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

<div class="dev-center-os-selector"><a href="/en-us/develop/python/tutorials/web-app-with-django/" title="Windows Version" class="windows current">Windows</a><a href="/en-us/develop/python/tutorials/django-hello-world-(maclinux)/" title="Mac Version" class="mac">Mac</a><span>Tutorial</span></div>
# Django Hello World Web Application

This tutorial describes how to host a Django-based web site on Windows 
Azure using a Windows Server 2008 R2 virtual machine. This tutorial assumes you have no prior experience using Windows Azure. Upon completing this guide, you will have a Django-based application up and running in the cloud.

You will learn how to:

* Setup a Windows Azure virtual machine to host Django. While this tutorial explains how to accomplish this under **Windows Server 2008 R2**, the same could also be done with a Linux VM hosted in Windows Azure. 
* Create a new Django application from Windows.

By following this tutorial, you will build a simple Hello World web
application. The application will be hosted in a Windows Azure Preview Portal virtual machine.

A screenshot of the completed application is below:

![A browser window displaying the hello world page on Windows Azure][1]

<div chunk="../../Shared/Chunks/create-account-and-vms-note.md" />

## Creating and configuring a Windows Azure virtual machine to host Django

1. Follow the instructions given [here][preview-portal-vm] to create a Windows Azure Preview Portal virtual machine of the *Windows Server 2008 R2* flavor.

1. Instruct Windows Azure to direct port **80** traffic from the web to port **80** on the virtual machine:
 - Navigate to your newly created virtual machine in the Windows Azure Preview Portal and click the *ENDPOINTS* tab.
 - Click *ADD ENDPOINT* button at the bottom of the screen.
![][add endpoint]

 - Open up the *TCP* protocol's *PUBLIC PORT 80* as *PRIVATE PORT 80*.
![][port80]
1. Use Windows *Remote Desktop* to remotely log into the newly created Windows Azure virtual machine.  

**Important Note:** all instructions below assume you logged into the virtual machine correctly and are issuing commands there rather than your local machine! 

## <a id="setup"> </a>Setting up the development environment

To set up your Python and Django environments, please see the [Installation Guide][] for more information.  

**Note 1:** you *only* need to install the **Django** product from the Windows WebPI installer on the Windows Azure virtual machine to get *this* particular tutorial operational.

**Note 2:** In order to download the WebPI installer you may have to configure IE ESC settings (Start/Adminstrative Tools/Server Manager, then click **Configure IE ESC**, set to Off).

## Setting up IIS with FastCGI


1. Intall IIS with FastCGI support 

		start /wait %windir%\System32\\PkgMgr.exe /iu:IIS-WebServerRole;IIS-WebServer;IIS-CommonHttpFeatures;IIS-StaticContent;IIS-DefaultDocument;IIS-DirectoryBrowsing;IIS-HttpErrors;IIS-HealthAndDiagnostics;IIS-HttpLogging;IIS-LoggingLibraries;IIS-RequestMonitor;IIS-Security;IIS-RequestFiltering;IIS-HttpCompressionStatic;IIS-WebServerManagementTools;IIS-ManagementConsole;WAS-WindowsActivationService;WAS-ProcessModel;WAS-NetFxEnvironment;WAS-ConfigurationAPI;IIS-CGI


1. Setup the Python Fast CGI Handler

		%windir%\system32\inetsrv\appcmd set config /section:system.webServer/fastCGI "/+[fullPath='c:\Python27\python.exe', arguments='C:\inetpub\wwwroot\wfastcgi.py']"



1. Register the handler for this site

		%windir%\system32\inetsrv\appcmd set config /section:system.webServer/handlers "/+[name='Python_via_FastCGI',path='*',verb='*',modules='FastCgiModule',scriptProcessor='c:\Python27\python.exe|C:\inetpub\wwwroot\wfastcgi.py',resourceType='Unspecified']"


1. Configure the handler to run your Django application

		%windir%\system32\inetsrv\appcmd.exe set config -section:system.webServer/fastCgi /+"[fullPath='C:\Python27\python.exe', arguments='C:\inetpub\wwwroot\wfastcgi.py'].environmentVariables.[name='DJANGO_SETTINGS_MODULE',value='DjangoApplication.settings']" /commit:apphost

1. Configure PYTHONPATH so your Django app can be found by the Python interpreter

		%windir%\system32\inetsrv\appcmd.exe set config -section:system.webServer/fastCgi /+"[fullPath='C:\Python27\python.exe', arguments='C:\inetpub\wwwroot\wfastcgi.py'].environmentVariables.[name='PYTHONPATH',value='C:\inetpub\wwwroot\DjangoApplication']" /commit:apphost

	You should see the following:

	![IIS config1](../media/django-helloworld-iis1.png) 

1. Tell the FastCGI to WSGI gateway which WSGI handler to use:
%windir%\system32\inetsrv\appcmd.exe set config -section:system.webServer/fastCgi /+"[fullPath='C:\Python27\python.exe', arguments='C:\inetpub\wwwroot\wfastcgi.py'].environmentVariables.[name='WSGI_HANDLER',value='django.core.handlers.wsgi.WSGIHandler()']" /commit:apphost


1. Download wfastcgi.py from [http://pytools.codeplex.com/releases/view/88766](http://pytools.codeplex.com/releases/view/88766) and save it to C:\inetpub\wwwroot.  This is the location the previous commands used for registering the FastCGI handler.


## Creating a new Django application


1.  Start cmd.exe
    
1.  cd to C:\inetpub\wwwroot

1.  Enter the following command to create a new Django project:


	C:\Python27\python.exe -m django.bin.django-admin startproject DjangoApplication
    
	![The result of the New-AzureService command][]

 The **django-admin.py** script generates a basic structure for Django-based web sites:
    
-   **manage.py** helps you to start hosting and stop hosting your Django-based web site
-   **DjangoApplication\settings.py** contains Django settings for your application.
-   **DjangoApplication\urls.py** contains the mapping code between each url and its view.



1.  Create a new file named **views.py** in the *DjangoApplication* subdirectory of *C:\inetpub\wwwroot\DjangoApplication*, as a sibling of **urls.py**. This will contain the view that renders the "hello world" page. Start your editor and enter the following:
		
		from django.http import HttpResponse
		def hello(request):
    		html = "<html><body>Hello World!</body></html>"
    		return HttpResponse(html)

1.  Now replace the contents of the **urls.py** file with the following:

		from django.conf.urls.defaults import patterns, include, url
		from DjangoApplication.views import hello
		urlpatterns = patterns('',
			(r'^$',hello),
		)

1. Finally, load the web page in your browser.

![A browser window displaying the hello world page on Windows Azure][]

## Shutting down your Windows Azure virtual machine

When you're done with this tutorial, shutdown and/or remove your newly created Windows Azure virtual machine to free up resources for other tutorials and avoid incurring Windows Azure usage charges.

[1]: ../Media/django-helloworld-browser-azure.png
[A command prompt displaying the django directory creation]: ../Media/django-helloworld-ps-create-dir.png
[The result of the New-AzureService command]: ../Media/django-helloworld-cmd-new-azure-service.png
[A directory listing of the service folder]: ../Media/django-helloworld-ps-service-dir.png
[The output of the Add-AzureDjangoWebRole command]: ../Media/django-helloworld-ps-add-webrole.png
[A directory listing of the webrole folder]: ../Media/django-helloworld-ps-webrole-dir.png
[A directory listing of the django folder]: ../Media/django-helloworld-ps-django-dir.png
[A web browser displaying the Hello World web page on emulator]: ../Media/django-helloworld-browser-emulator.png
[The menu displayed when right-clicking the Windows Azure emulator from the task bar]: ../../../DevCenter/nodejs/Media/getting-started-11.png
[http://www.windowsazure.com]: http://www.windowsazure.com
[A browser window displaying http://www.windowsazure.com/ with the Free Trial link highlighted]: ../../../DevCenter/dotNet/Media/getting-started-12.png
[A browser window displaying the liveID sign in page]: ../../../DevCenter/nodejs/Media/getting-started-13.png
[Internet Explorer displaying the save as dialog for the publishSettings file.]: ../../../DevCenter/nodejs/Media/getting-started-14.png
[The output of the Publish-AzureService command]: ../Media/django-helloworld-ps-publish.png
[The status of the Stop-AzureService command]: ../Media/django-helloworld-ps-stop.png
[The status of the Remove-AzureService command]: ../Media/django-helloworld-ps-remove.png
[add endpoint]: ../Media/django-helloworld-addendpoint.png
[port80]: ../Media/django-helloworld-port80.png
[preview-portal]: https://manage.windowsazure.com
[preview-portal-vm]: /en-us/manage/windows/tutorials/virtual-machine-from-gallery/


[Installation Guide]: ../commontasks/how-to-install-python.md
