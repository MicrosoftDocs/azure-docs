<properties 
	pageTitle="Python web app with Django on Mac - Azure tutorial" 
	description="A tutorial that shows how to host a Django-based website on Azure using a Linux virtual machine." 
	services="virtual-machines" 
	documentationCenter="python" 
	authors="huguesv" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="web" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="02/05/2015" 
	ms.author="huvalo"/>





# Django Hello World Web Application (mac-linux)

<div class="dev-center-tutorial-selector sublanding"><a href="/develop/python/tutorials/web-app-with-django/" title="Windows">Windows</a><a href="/develop/python/tutorials/django-hello-world-(maclinux)/" title="Mac/Linux" class="current">Mac/Linux</a></div>

This tutorial describes how to host a Django-based website on Windows 
Azure using a Linux virtual machine. This tutorial assumes you have no prior experience using Azure. Upon completing this guide, you will have a Django-based application up and running in the cloud.

You will learn how to:

* Setup an Azure virtual machine to host Django. While this tutorial explains how to accomplish this under **Linux**, the same could also be done with a Windows Server VM hosted in Azure. 
* Create a new Django application from Linux.

By following this tutorial, you will build a simple Hello World web
application. The application will be hosted in an Azure virtual machine.

A screenshot of the completed application is below:

![A browser window displaying the hello world page on Azure](./media/virtual-machines-python-django-web-app-linux/mac-linux-django-helloworld-browser.png)

[AZURE.INCLUDE [create-account-and-vms-note](../includes/create-account-and-vms-note.md)]

## Creating and configuring an Azure virtual machine to host Django

1. Follow the instructions given [here][portal-vm] to create an Azure virtual machine of the *Ubuntu Server 14.04 LTS* distribution.

  **Note:** you *only* need to create the virtual machine. Stop at the section titled *How to log on to the virtual machine after you create it*.

1. Instruct Azure to direct port **80** traffic from the web to port **80** on the virtual machine:
	* Navigate to your newly created virtual machine in the Azure Portal and click the *ENDPOINTS* tab.
	* Click the *ADD* button at the bottom of the screen.
	![add endpoint](./media/virtual-machines-python-django-web-app-linux/mac-linux-django-helloworld-add-endpoint.png)
	* Open up the *TCP* protocol's *PUBLIC PORT 80* as *PRIVATE PORT 80*.
	![port80](./media/virtual-machines-python-django-web-app-linux/mac-linux-django-helloworld-port80.png)

## <a id="setup"> </a>Setting up the development environment

**Note:** If you need to install Python or would like to use the Client Libraries, please see the [Python Installation Guide](python-how-to-install.md).

The Ubuntu Linux VM already comes with Python 2.7 pre-installed, but it doesn't have Apache or django installed.  Follow these steps to connect to your VM and install Apache and django.

1.  Launch a new **Terminal** window.
    
1.  Enter the following command to connect to the Azure VM.

		$ ssh yourusername@yourVmUrl

1.  Enter the following commands to install django:

		$ sudo apt-get install python-setuptools
		$ sudo easy_install django

1.  Enter the following command to install Apache with mod-wsgi:

		$ sudo apt-get install apache2 libapache2-mod-wsgi


## Creating a new Django application

1.  Open the **Terminal** window you used in the previous section to ssh into your VM.
    
1.  Enter the following commands to create a new Django project:

		$ cd /var/www
		$ sudo django-admin.py startproject helloworld

    The **django-admin.py** script generates a basic structure for Django-based websites:
    -   **helloworld/manage.py** helps you to start hosting and stop hosting your Django-based website
    -   **helloworld/helloworld/settings.py** contains Django settings for your application.
    -   **helloworld/helloworld/urls.py** contains the mapping code between each url and its view.

1.  Create a new file named **views.py** in the **/var/www/helloworld/helloworld** directory. This will contain the view that renders the "hello world" page. Start your editor and enter the following:
		
		from django.http import HttpResponse
		def home(request):
    		html = "<html><body>Hello World!</body></html>"
    		return HttpResponse(html)

1.  Now replace the contents of the **urls.py** file with the following:

		from django.conf.urls import patterns, url
		urlpatterns = patterns('',
			url(r'^$', 'helloworld.views.home', name='home'),
		)


## Setting up Apache

1.  Create an Apache virtual host configuration file **/etc/apache2/sites-available/helloworld.conf**. Set the contents to the following, and make sure to replace *yourVmUrl* with the actual URL of the machine you are using (for example *pyubuntu.cloudapp.net*).

		<VirtualHost *:80>
		ServerName yourVmUrl
		</VirtualHost>
		WSGIScriptAlias / /var/www/helloworld/helloworld/wsgi.py
		WSGIPythonPath /var/www/helloworld

1.  Enable the site with the following command:

        $ sudo a2ensite helloworld

1.  Restart Apache with the following command:

        $ sudo service apache2 reload

1.  Finally, load the web page in your browser:

	![A browser window displaying the hello world page on Azure](./media/virtual-machines-python-django-web-app-linux/mac-linux-django-helloworld-browser.png)


## Shutting down your Azure virtual machine

When you're done with this tutorial, shutdown and/or remove your newly created Azure virtual machine to free up resources for other tutorials and avoid incurring Azure usage charges.


[portal-vm]: /manage/linux/tutorials/virtual-machine-from-gallery/
