<properties 
	pageTitle="Python web app with Django on Linux | Microsoft Azure" 
	description="Learn how to host a Django-based web application on Azure using a Linux virtual machine." 
	services="virtual-machines-linux" 
	documentationCenter="python" 
	authors="huguesv" 
	manager="wpickett" 
	editor=""
	tags="azure-resource-manager"/>

<tags 
	ms.service="virtual-machines-linux" 
	ms.workload="web" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="11/17/2015" 
	ms.author="huvalo"/>
	
# Django Hello World web application on a Linux VM

> [AZURE.SELECTOR]
- [Windows](virtual-machines-windows-classic-python-django-web-app.md)
- [Mac/Linux](virtual-machines-linux-python-django-web-app.md)

<br>

This tutorial describes how to host a Django-based website on Microsoft Azure using a Linux virtual machine. This tutorial assumes you have no prior experience using Azure. Upon completing this guide, you will have a Django-based application up and running in the cloud.

You will learn how to:

* Setup an Azure virtual machine to host Django. While this tutorial explains how to accomplish this under **Linux**, the same could also be done with a Windows Server VM hosted in Azure. 
* Create a new Django application from Linux.

By following this tutorial, you will build a simple Hello World web application. The application will be hosted in an Azure virtual machine.

A screenshot of the completed application is below:

![A browser window displaying the hello world page on Azure](./media/virtual-machines-linux-python-django-web-app/mac-linux-django-helloworld-browser.png)

[AZURE.INCLUDE [create-account-and-vms-note](../../includes/create-account-and-vms-note.md)]

## Creating and configuring an Azure virtual machine to host Django

1. Follow the instructions given [here](virtual-machines-linux-quick-create-portal.md) to create an Azure virtual machine of the *Ubuntu Server 14.04 LTS* distribution.  If you prefer, you can choose password authentication instead of SSH public key.

1. Edit the network security group to allow incoming http traffic to port 80 using the instructions [here](../virtual-network/virtual-networks-create-nsg-arm-pportal.md).

1. By default, your new virtual machine doesn't have a fully qualified domain name (FQDN).  You can create one by following the instructions [here](virtual-machines-linux-portal-create-fqdn.md).  This step is optional to complete this tutorial.

## <a id="setup"> </a>Setting up the development environment

**Note:** If you need to install Python or would like to use the Client Libraries, please see the [Python Installation Guide](../python-how-to-install.md).

The Ubuntu Linux VM already comes with Python 2.7 pre-installed, but it doesn't have Apache or django installed.  Follow these steps to connect to your VM and install Apache and django.

1.  Launch a new **Terminal** window.
    
1.  Enter the following command to connect to the Azure VM.  If you didn't create a FQDN, you can connect using the public IP address displayed in the virtual machine summary in the Azure classic portal.

		$ ssh yourusername@yourVmUrl

1.  Enter the following commands to install django:

		$ sudo apt-get install python-setuptools python-pip
		$ sudo pip install django

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

1.  Create an Apache virtual host configuration file **/etc/apache2/sites-available/helloworld.conf**. Set the contents to the following, and replace *yourVmName* with the actual name of the machine you are using (for example *pyubuntu*).

		<VirtualHost *:80>
		ServerName yourVmName
		</VirtualHost>
		WSGIScriptAlias / /var/www/helloworld/helloworld/wsgi.py
		WSGIPythonPath /var/www/helloworld

1.  Enable the site with the following command:

        $ sudo a2ensite helloworld

1.  Restart Apache with the following command:

        $ sudo service apache2 reload

1.  Finally, load the web page in your browser:

	![A browser window displaying the hello world page on Azure](./media/virtual-machines-linux-python-django-web-app/mac-linux-django-helloworld-browser.png)


## Shutting down your Azure virtual machine

When you're done with this tutorial, shutdown and/or remove your newly created Azure virtual machine to free up resources for other tutorials and avoid incurring Azure usage charges.
