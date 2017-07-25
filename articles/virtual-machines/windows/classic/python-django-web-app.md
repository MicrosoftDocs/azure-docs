---
title: Django web app on a Windows Server Azure VM | Microsoft Docs
description: Learn how to host a Django-based website in Azure using a Windows Server 2012 R2 Datacenter VM with the classic deployment model.
services: virtual-machines-windows
documentationcenter: python
author: huguesv
manager: wpickett
editor: ''
tags: azure-service-management

ms.assetid: e36484d1-afbf-47f5-b755-5e65397dc1c3
ms.service: virtual-machines-windows
ms.workload: web
ms.tgt_pltfrm: vm-windows
ms.devlang: python
ms.topic: article
ms.date: 05/31/2017
ms.author: huvalo

---
# Django Hello World web app on a Windows Server VM
> [!div class="op_single_selector"]
> * [Windows](python-django-web-app.md)
> * [Mac/Linux](../../linux/python-django-web-app.md)
> 
> 

<br>

> [!IMPORTANT] 
> Azure has two different deployment models for creating and working with resources: [Azure Resource Manager and the classic deployment model](../../../resource-manager-deployment-model.md). This article describes the classic deployment model. We recommend that most new deployments use the Resource Manager model. For a Resource Manager template that you can use to deploy Django, see [Deploy a Django app](https://azure.microsoft.com/documentation/templates/django-app/).

This tutorial shows you how to host a Django-based website in Windows Server in Azure Virtual Machines. In the tutorial, we assume no prior experience with Azure. When you finish the tutorial, you can have a Django-based application up and running in the cloud.

Learn how to:

* Set up an Azure virtual machine to host Django. Although this tutorial explains how to do this for **Windows Server**, you can do the same for a Linux VM hosted in Azure.
* Create a new Django application in Windows.

The tutorial shows you how to build a basic Hello World web
application. The application is hosted in an Azure virtual machine.

The following screenshot shows the completed application:

![A browser window displays the hello world page in Azure][1]

[!INCLUDE [create-account-and-vms-note](../../../../includes/create-account-and-vms-note.md)]

## Create and set up an Azure virtual machine to host Django

1. To create an Azure virtual machine with the Windows Server 2012 R2 Datacenter distribution, see [Create a virtual machine running Windows in the Azure portal](tutorial.md).
2. Set Azure to direct port 80 traffic from the web to port 80 on the virtual machine:
   
   1. In the Azure portal, go to the dashboard and select your newly created virtual machine.
   2. Click **Endpoints**, and then click **Add**.

     ![Add an endpoint](./media/python-django-web-app/django-helloworld-add-endpoint-new-portal.png)

   3. On the **Add endpoint** page, for **Name**, enter **HTTP**. Set the public and private TCP ports to **80**.

     ![Enter name and set public and private ports](./media/python-django-web-app/django-helloworld-add-endpoint-set-ports-new-portal.png)

   4. Click **OK**.
     
3. In the dashboard, select your VM. To use Remote Desktop Protocol (RDP) to remotely sign in to the newly created Azure virtual machine, click **Connect**.  

> [!IMPORTANT] 
> The following instructions assume that you signed in to the virtual machine correctly. They also assume that you are issuing commands in the virtual machine and not on your local computer.

## <a id="setup"> </a>Install Python, Django, and WFastCGI
> [!NOTE]
> To download by using Internet Explorer, you might have to configure Internet Explorer **Enhanced Security Configuration** settings. To do this, click **Start** > **Administrative Tools** > **Server Manager** > **Local Server**. Click **IE Enhanced Security Configuration**, and then select **Off**.

1. Install the latest versions of Python 2.7 or Python 3.4 from [python.org][python.org].
2. Install the wfastcgi and django packages using pip.
   
    For Python 2.7, use the following command:
   
        c:\python27\scripts\pip install wfastcgi
        c:\python27\scripts\pip install django
   
    For Python 3.4, use the following command:
   
        c:\python34\scripts\pip install wfastcgi
        c:\python34\scripts\pip install django

## Install IIS with FastCGI
* Install Internet Information Services (IIS) with FastCGI support. This might take several minutes to execute.
   
        start /wait %windir%\System32\PkgMgr.exe /iu:IIS-WebServerRole;IIS-WebServer;IIS-CommonHttpFeatures;IIS-StaticContent;IIS-DefaultDocument;IIS-DirectoryBrowsing;IIS-HttpErrors;IIS-HealthAndDiagnostics;IIS-HttpLogging;IIS-LoggingLibraries;IIS-RequestMonitor;IIS-Security;IIS-RequestFiltering;IIS-HttpCompressionStatic;IIS-WebServerManagementTools;IIS-ManagementConsole;WAS-WindowsActivationService;WAS-ProcessModel;WAS-NetFxEnvironment;WAS-ConfigurationAPI;IIS-CGI

## Create a new Django application
1. In C:\inetpub\wwwroot, to create a new Django project, enter the following command:
   
   For Python 2.7, use the following command:
   
       C:\Python27\Scripts\django-admin.exe startproject helloworld
   
   For Python 3.4, use the following command:
   
       C:\Python34\Scripts\django-admin.exe startproject helloworld
   
   ![The result of the New-AzureService command](./media/python-django-web-app/django-helloworld-cmd-new-azure-service.png)
2. The `django-admin` command generates a basic structure for Django-based websites:
   
   * `helloworld\manage.py` helps you start hosting and stop hosting your Django-based website.
   * `helloworld\helloworld\settings.py` has Django settings for your application.
   * `helloworld\helloworld\urls.py` has the mapping code between each URL and its view.
3. In the C:\inetpub\wwwroot\helloworld\helloworld directory, create a new file named views.py. This file has the view that renders the "hello world" page. In your code editor, enter the following commands:
   
       from django.http import HttpResponse
       def home(request):
           html = "<html><body>Hello World!</body></html>"
           return HttpResponse(html)
4. Replace the contents of the urls.py file with the following commands:
   
       from django.conf.urls import patterns, url
       urlpatterns = patterns('',
           url(r'^$', 'helloworld.views.home', name='home'),
       )

## Set up IIS
1. In the global applicationhost.config file, unlock the handlers section.  This allows your web.config file to use the Python handler. Add this command:
   
        %windir%\system32\inetsrv\appcmd unlock config -section:system.webServer/handlers
2. Activate WFastCGI. This adds an application to the global applicationhost.config file, which refers to your Python interpreter executable and the wfastcgi.py script.
   
    In Python 2.7:
   
        C:\python27\scripts\wfastcgi-enable
   
    In Python 3.4:
   
        C:\python34\scripts\wfastcgi-enable
3. In C:\inetpub\wwwroot\helloworld, create a web.config file. The value of the `scriptProcessor` attribute should match the output from the preceding step. For more information about the wfastcgi setting, see [pypi wfastcgi][wfastcgi].
   
   In  Python 2.7:
   
        <configuration>
          <appSettings>
            <add key="WSGI_HANDLER" value="django.core.handlers.wsgi.WSGIHandler()" />
            <add key="PYTHONPATH" value="C:\inetpub\wwwroot\helloworld" />
            <add key="DJANGO_SETTINGS_MODULE" value="helloworld.settings" />
          </appSettings>
          <system.webServer>
            <handlers>
                <add name="Python FastCGI" path="*" verb="*" modules="FastCgiModule" scriptProcessor="C:\Python27\python.exe|C:\Python27\Lib\site-packages\wfastcgi.pyc" resourceType="Unspecified" />
            </handlers>
          </system.webServer>
        </configuration>
   
   In  Python 3.4:
   
        <configuration>
          <appSettings>
            <add key="WSGI_HANDLER" value="django.core.handlers.wsgi.WSGIHandler()" />
            <add key="PYTHONPATH" value="C:\inetpub\wwwroot\helloworld" />
            <add key="DJANGO_SETTINGS_MODULE" value="helloworld.settings" />
          </appSettings>
          <system.webServer>
            <handlers>
                <add name="Python FastCGI" path="*" verb="*" modules="FastCgiModule" scriptProcessor="C:\Python34\python.exe|C:\Python34\Lib\site-packages\wfastcgi.py" resourceType="Unspecified" />
            </handlers>
          </system.webServer>
        </configuration>
4. Update the location of the IIS default website to point to the Django project folder:
   
        %windir%\system32\inetsrv\appcmd set vdir "Default Web Site/" -physicalPath:"C:\inetpub\wwwroot\helloworld"
5. Load the webpage in your browser.

![A browser window displays the hello world page on Azure][1]

## Shut down your Azure virtual machine
When you're done with this tutorial, we recommend that you shut down or remove the Azure VM you created for the tutorial. This frees up resources for other tutorials, and you can avoid incurring Azure usage charges.

[1]: ./media/python-django-web-app/django-helloworld-browser-azure.png

[port80]: ./media/python-django-web-app/django-helloworld-port80.png

[Web Platform Installer]: http://www.microsoft.com/web/downloads/platform.aspx
[python.org]: https://www.python.org/downloads/
[wfastcgi]: https://pypi.python.org/pypi/wfastcgi
