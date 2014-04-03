<properties linkid="develop-python-web-app-with-django" urlDisplayName="Web with Django (Windows)" pageTitle="Python web app with Django - Azure tutorial" metaKeywords="Azure Django web app, Azure Django virtual machine" description="A tutorial that teaches you how to host a Django-based website on Azure using a Windows Server 2008 R2 virtual machine." metaCanonical="" services="virtual-machines" documentationCenter="Python" title="Django Hello World Web Application" authors="" solutions="" manager="" editor="" />




# Django Hello World Web Application

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/develop/python/tutorials/web-app-with-django/" title="Windows" class="current">Windows</a><a href="/en-us/develop/python/tutorials/django-hello-world-(maclinux)/" title="MacLinux">Mac/Linux</a></div>

This tutorial describes how to host a Django-based web site on Windows 
Azure using a Windows Server virtual machine. This tutorial assumes you have no prior experience using Azure. Upon completing this guide, you will have a Django-based application up and running in the cloud.

You will learn how to:

* Setup an Azure virtual machine to host Django. While this tutorial explains how to accomplish this under **Windows Server**, the same could also be done with a Linux VM hosted in Azure. 
* Create a new Django application from Windows.

By following this tutorial, you will build a simple Hello World web
application. The application will be hosted in an Azure virtual machine.

A screenshot of the completed application is below:

![A browser window displaying the hello world page on Azure][1]

[WACOM.INCLUDE [create-account-and-vms-note](../includes/create-account-and-vms-note.md)]

## Creating and configuring an Azure virtual machine to host Django

1. Follow the instructions given [here][portal-vm] to create an Azure virtual machine of the *Windows Server 2012 Datacenter* distribution.

1. Instruct Azure to direct port **80** traffic from the web to port **80** on the virtual machine:
 - Navigate to your newly created virtual machine in the Azure Portal and click the *ENDPOINTS* tab.
 - Click *ADD ENDPOINT* button at the bottom of the screen.
	![add endpoint](./media/virtual-machines-python-django-web-app-windows-server/django-helloworld-addendpoint.png)

 - Open up the *TCP* protocol's *PUBLIC PORT 80* as *PRIVATE PORT 80*.
![][port80]
1. Use Windows *Remote Desktop* to remotely log into the newly created Azure virtual machine.  

**Important Note:** all instructions below assume you logged into the virtual machine correctly and are issuing commands there rather than your local machine! 

## <a id="setup"> </a>Setting up the development environment

To set up your Python and Django environments, please see the [Installation Guide][] for more information.  

**Note 1:** you *only* need to install the **Django** product from the Windows WebPI installer on the Azure virtual machine to get *this* particular tutorial operational.

**Note 2:** In order to download the WebPI installer you may have to configure IE ESC settings (Start/Adminstrative Tools/Server Manager, then click **Configure IE ESC**, set to Off).

## Setting up IIS with FastCGI


1. Intall IIS with FastCGI support 

		start /wait %windir%\System32\\PkgMgr.exe /iu:IIS-WebServerRole;IIS-WebServer;IIS-CommonHttpFeatures;IIS-StaticContent;IIS-DefaultDocument;IIS-DirectoryBrowsing;IIS-HttpErrors;IIS-HealthAndDiagnostics;IIS-HttpLogging;IIS-LoggingLibraries;IIS-RequestMonitor;IIS-Security;IIS-RequestFiltering;IIS-HttpCompressionStatic;IIS-WebServerManagementTools;IIS-ManagementConsole;WAS-WindowsActivationService;WAS-ProcessModel;WAS-NetFxEnvironment;WAS-ConfigurationAPI;IIS-CGI


1. Setup the Python Fast CGI Handler

		%windir%\system32\inetsrv\appcmd set config /section:system.webServer/fastCGI "/+[fullPath='c:\Python27\python.exe', arguments='C:\Python27\Scripts\wfastcgi.py']"



1. Register the handler for this site

		%windir%\system32\inetsrv\appcmd set config /section:system.webServer/handlers "/+[name='Python_via_FastCGI',path='*',verb='*',modules='FastCgiModule',scriptProcessor='c:\Python27\python.exe|C:\Python27\Scripts\wfastcgi.py',resourceType='Unspecified']"


1. Configure the handler to run your Django application

		%windir%\system32\inetsrv\appcmd.exe set config -section:system.webServer/fastCgi /+"[fullPath='C:\Python27\python.exe', arguments='C:\Python27\Scripts\wfastcgi.py'].environmentVariables.[name='DJANGO_SETTINGS_MODULE',value='DjangoApplication.settings']" /commit:apphost

1. Configure PYTHONPATH so your Django app can be found by the Python interpreter

		%windir%\system32\inetsrv\appcmd.exe set config -section:system.webServer/fastCgi /+"[fullPath='C:\Python27\python.exe', arguments='C:\Python27\Scripts\wfastcgi.py'].environmentVariables.[name='PYTHONPATH',value='C:\inetpub\wwwroot\DjangoApplication']" /commit:apphost

	You should see the following:

	![IIS config1](./media/virtual-machines-python-django-web-app-windows-server/django-helloworld-iis1.png) 

1. Tell the FastCGI to WSGI gateway which WSGI handler to use:

		%windir%\system32\inetsrv\appcmd.exe set config -section:system.webServer/fastCgi /+"[fullPath='C:\Python27\python.exe', arguments='C:\Python27\Scripts\wfastcgi.py'].environmentVariables.[name='WSGI_HANDLER',value='django.core.handlers.wsgi.WSGIHandler()']" /commit:apphost


1. Download wfastcgi.py from [codeplex](http://go.microsoft.com/fwlink/?LinkID=316392&clcid=0x409) and save it to C:\Python27\Scripts.  This is the location the previous commands used for registering the FastCGI handler. Alternatively, you can install it using Web Platform Installer.  Search for 'WFastCGI'.


## Creating a new Django application


1.  Start cmd.exe
    
1.  cd to C:\inetpub\wwwroot

1.  Enter the following command to create a new Django project:


	C:\Python27\python.exe -m django.bin.django-admin startproject DjangoApplication
    
	![The result of the New-AzureService command](./media/virtual-machines-python-django-web-app-windows-server/django-helloworld-cmd-new-azure-service.png)

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

![A browser window displaying the hello world page on Azure][1]

## Shutting down your Azure virtual machine

When you're done with this tutorial, shutdown and/or remove your newly created Azure virtual machine to free up resources for other tutorials and avoid incurring Azure usage charges.

[1]: ./media/virtual-machines-python-django-web-app-windows-server/django-helloworld-browser-azure.png

[port80]: ./media/virtual-machines-python-django-web-app-windows-server/django-helloworld-port80.png

[portal-vm]: /en-us/manage/windows/tutorials/virtual-machine-from-gallery/

[Installation Guide]: ../python-how-to-install/
