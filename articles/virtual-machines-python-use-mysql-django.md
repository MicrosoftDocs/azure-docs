<properties linkid="develop-python-web-app-with-django-and-mysql" urlDisplayName="Web with Django + MySQL" pageTitle="Python web app with Django and MySQL - Azure tutorial" metaKeywords="Azure django web app, Azure Django MySQL, Azure django Python" description="A tutorial that teaches you how to use MySQL in with Django on an Azure virtual machine. Code samples written in Python." metaCanonical="" services="virtual-machines" documentationCenter="Python" title="Django Hello World - MySQL Windows Edition" authors="" solutions="" manager="" editor="" />







# Django Hello World - MySQL Windows Edition #
  
This tutorial describes how to use MySQL in conjunction with Django on a single Azure virtual machine. This guide assumes that you have some prior experience using Azure and Django. For an introduction to Azure and Django, see [Django Hello World] [djangohelloworld]. The guide also assumes that you have some knowledge of MySQL. For an overview of MySQL, see the [MySQL web site][mysqldoc].

In this tutorial, you will learn how to:

* Setup an Azure virtual machine to host MySQL and Django. While this tutorial explains how to accomplish this under Windows Server 2008 R2, the same could also be done with a Linux VM hosted in Azure.
* Install a [MySQL driver] [mysqlpy] for Python.
* Configure an existing Django application to use a MySQL database.
* Use MySQL directly from Python.
* Host and run your MySQL Django application.

You will expand upon the [Django Hello World] [djangohelloworld] sample by utilizing a MySQL database, hosted in an Azure VM, to find an interesting replacement for *World*. The replacement will in turn be determined via a MySQL-backed Django *counter* app. As was the case for the Hello World sample, this Django application will again be hosted in an Azure virtual machine.

The project files for this tutorial will be stored in **C:\django\helloworld** and the completed application will look similar to:

![][0]

[WACOM.INCLUDE [create-account-and-vms-note](../includes/create-account-and-vms-note.md)]

## Setting up a virtual machine to host MySQL and Django
1. Follow the instructions given [here ][preview-portal-vm] to create an Azure virtual machine of the *Windows Server 2008 R2* distribution.

1. Open up a TCP port for MySQL transactions on the virtual machine:
 * Navigate to your newly created virtual machine in the Azure Portal and click the *ENDPOINTS* tab.
 * Click *ADD ENDPOINT* button at the bottom of the screen.
 * Add an endpoint with NAME = **mysql**, PROTOCOL = **TCP**, PUBLIC PORT = **3306**, PRIVATE PORT = **3306**..

1. Add another endpoint with NAME = **web**, PROTOCOL = **TCP**, PUBLIC PORT = **80**, PRIVATE PORT = **80**.  This redirects external Internet requests to the port Django runs on, namely *80*.

1. Use Windows *Remote Desktop* to remotely log into the newly created Azure virtual machine.

1. Open up TCP port **80** on the virtual machine:
 * From the **Start** menu, select **Administrator Tools** and then **Windows Firewall with Advanced Security**. 
 * In the left pane, select **Inbound Rules**.  In the **Actions** pane on the right, select **New Rule...**.
 * In the **New Inbound Rule Wizard**, select **Port** and then click **Next**.
 * Select **TCP** and then **Specific local ports**.  Specify a port of "80" (the port Django listens on) and click **Next**.
 * Select **Allow the connection** and click **Next**.
 * Click **Next** again.
 * Specify a name for the rule, such as "DjangoPort", and click Finish.

1. Install the latest version of [MySQL Community Server] [mysqlcommunity] for Windows on the virtual machine:  

	**Note**: we recommend installing your DB on a different data partition than the OS. 

 * Run the *Windows (x86, 64-bit), MSI Installer* link [here ] [mysqlcommunity] and download the appropriate MSI installer from the download mirror nearest you. Helpful hints are:
     * Select a *Complete* Setup Type.
     * Select a *Detailed Configuration* within the Configuration Wizard.
     * **Make sure you enable TCP/IP Networking on Port Number 3306 and add a firewall exception for the port.**
     * Set a root password and enable root access from remote machines.
 * Install a sample ["world" database] [mysqlworld] (MyISAM version):
     * Download [this] [mysqlworlddl] zip file on the Azure Virtual Machine.
     * **Unzip it to *C:\Users\Administrator\Desktop\world.sql*.**
1. After installing MySQL, click the Windows *Start* menu and run the freshly installed *MySQL 5.5 Command Line Client*.  Issue the following commands:

		CREATE DATABASE world;
		USE world;
		SOURCE C:\Users\Administrator\Desktop\world.sql
		CREATE USER 'testazureuser'@'%' IDENTIFIED BY 'testazure';
		CREATE DATABASE djangoazure;
		GRANT ALL ON djangoazure.* TO 'testazureuser'@'%';
		GRANT ALL ON world.* TO 'testazureuser'@'%';
		SELECT name from country LIMIT 1;

  You should now see a response similar to the following: 

  ![][2]

1. Before you can begin developing your Django application, you of course need to install Python+Django on the virtual machine. You can do so by using the [Web Platform Installer](http://www.microsoft.com/web/downloads/platform.aspx). After installing Web PI, use it to search for "Django" and install the Django (Python) product.    

  **Note:** you merely need to install the *Django* product from WebPI to get this tutorial working.  You do **not** need *Python Tools for Visual Studio* or even the Azure Python SDK installed for our purposes.

1. Install the MySQL Python client package. You can install it directly [from this link] [mysqlpydl]. Once completed, run the following command to verify your installation:

  ![][1]


## Extend the Django Hello World application
1. Follow the instructions given in the [Django Hello World] [djangohelloworld] tutorial to create a trivial "Hello World" web application in Django.

1. Open **C:\django\helloworld\helloworld\settings.py** in your favorite text editor.  Modify the **DATABASES** global dictionary to read:

		DATABASES = {
		    'default': {
			    'ENGINE': 'django.db.backends.mysql',
			    'NAME': 'djangoazure',               
			    'USER': 'testazureuser',  
			    'PASSWORD': 'testazure',
			    'HOST': '127.0.0.1', 
			    'PORT': '3306',
			    },
		    'world': {
			    'ENGINE': 'django.db.backends.mysql',
			    'NAME': 'world',               
			    'USER': 'testazureuser',  
			    'PASSWORD': 'testazure',
			    'HOST': '127.0.0.1', 
			    'PORT': '3306',
			    }
			}

  As you can see, we've just given Django instructions on where to find our MySQL database.
 
  **Note:** you **must** change the *HOST* key to match your Azure (MySQL) VM's **permanent** IP address. At this point, *HOST* should be set to whatever the *ipconfig* Windows command reports it as being. 

  After you've modified *HOST* to match the MySQL VM's IP address, please save this file and close it.

1. Now that we've referenced our *djangoazure* database, let's do something useful with it! To this end, we'll create a model for a trivial *counter* app.  To instruct Django to create this, run the following commands:

		cd C:\django\helloworld
		C:\Python27\python.exe manage.py startapp counter

  If Django doesn't report any output from the final command above, it succeeded.

1. Append the following text to **C:\django\helloworld\counter\models.py**:

		class Counter(models.Model):
		    count = models.IntegerField()
		    def __unicode__(self):
		        return u'%s' % (self.count)

  All we've done here is defined a subclass of Django's *Model* class named *Counter* with a single integer field, *count*. This trivial counter model will end up recording the number of hits to our Django application. 

1. Next we make Django aware of *Counter*'s existence:
 * Edit **C:\django\helloworld\helloworld\settings.py** again. Add *'counter'* to the *INSTALLED_APPS* tuple.
 * From a command prompt, please run:

			cd C:\django\helloworld
			C:\Python27\python manage.py sql counter
			C:\Python27\python manage.py syncdb

    These commands store the *Counter* model in the live Django database, and result in output similar to the following:

		C:\django\helloworld> C:\Python27\python manage.py sql counter
		BEGIN;
		CREATE TABLE `counter_counter` (
    		`id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
		    `count` integer NOT NULL
		)
		;
		COMMIT;
		
		C:\django\helloworld> C:\Python27\python manage.py syncdb
		Creating tables ...
		Creating table auth_permission
		Creating table auth_group_permissions
		Creating table auth_group
		Creating table auth_user_user_permissions
		Creating table auth_user_groups
		Creating table auth_user
		Creating table django_content_type
		Creating table django_session
		Creating table django_site
		Creating table counter_counter
		
		You just installed Django's auth system, which means you don't have any superusers defined.
		Would you like to create one now? (yes/no): no
		Installing custom SQL ...
		Installing indexes ...
		Installed 0 object(s) from 0 fixture(s)

1. Replace the contents of **C:\django\helloworld\helloworld\views.py**. The new implementation of the *hello* function below uses our *Counter* model in conjunction with a separate sample database we previously installed, *world*, to generate a suitable replacement for the "*World*" string:

		from django.http import HttpResponse
		import django.db
		from counter.models import Counter
		
		def getCountry(intId):
		    #Connect to the MySQL sample database 'world'
		    cur = django.db.connections['world'].cursor()
		    #Execute a trivial SQL query which returns the name of 
		    #all countries contained in 'world'
		    cur.execute("SELECT name from country")
		    tmp = cur.fetchall()
		    #Clean-up after ourselves
		    cur.close()
		    if intId >= len(tmp):
		        return "countries exhausted"
		    return tmp[intId][0]
		
		def hello(request):
		    if len(Counter.objects.all())==0:
		        #when the database corresponding to 'helloworld.counter' is 
		        #initially empty...
		        c = Counter(count=0)
		    else:
		        c = Counter.objects.all()[0]
		        c.count += 1
		    c.save()	   
		    world = getCountry(int(c.count))
		    return HttpResponse("<html><body>Hello <em>" + world + "</em></body></html>")


## Deploying and running your Django web site

Note: The following shows how to run Django in a test environment. To run it in production, follow the "Setting up IIS with FastCGI" section in the "Django Hello World tutorial". Using the Windows Firewall Client to open port 80 to Internet traffic on the Windows Server 2K8 R2 virtual machine is not necessary with FastCGI.



1.  Switch back to a Windows PowerShell window, and type the following commands to deploy your Django web site publically:

		PS C:\django\helloworld> $ipPort = 
		PS C:\django\helloworld> $ipPort = [string]$ipPort.AddressList[1]
		PS C:\django\helloworld> $ipPort += ":80"
		PS C:\django\helloworld> C:\Python27\python.exe .\manage.py runserver $ipPort

    The **runserver** parameter instructs Django to run our *helloworld* web site on TCP port *80*. The results of this command should be similar to:

		PS C:\django\helloworld> C:\Python27\python.exe .\manage.py runserver $ipPort
		Validating models...
		
		0 errors found
		Django version 1.4, using settings 'helloworld.settings'
		Development server is running at http://123.34.56.78:80
		Quit the server with CTRL-BREAK.
 
1. From your local web browser, open **http://*yourVmName*.cloudapp.net** (where *yourVmName* is whatever name you used in the virtual machine creation step). You should see "Hello ... !" displayed as shown in the screenshot below. This indicates that Django is running in the virtual machine and is working correctly.

    ![][5]

  Refresh the web browser a few times and you should see the message change from *"Hello **&lt;country abc&gt;**"* to *"Hello **&lt;some other country&gt;**"*.

1.  To stop Django from hosting the web site, simply switch to the PowerShell window and press **CTRL-C**.


## Shutting down your Azure virtual machine

When you're done with this tutorial, shutdown and/or remove your newly created Azure virtual machine to free up resources for other tutorials and avoid incurring Azure usage charges.

[0]: ./media/virtual-machines-python-use-mysql-django/mysql_tutorial01.png
[1]: ./media/virtual-machines-python-use-mysql-django/mysql_tutorial01-1.png
[2]: ./media/virtual-machines-python-use-mysql-django/mysql_tutorial01-2.png
[5]: ./media/virtual-machines-python-use-mysql-django/mysql_tutorial01.png

[djangohelloworld]: http://windowsazure.com/en-us/documentation/articles/virtual-machines-python-django-web-app-windows-server

[mysqldoc]: http://dev.mysql.com/doc/
[mysqlpy]: http://pypi.python.org/pypi/MySQL-python/1.2.3

[mysqlpydl]: http://code.google.com/p/soemin/downloads/detail?name=MySQL-python-1.2.3.win32-py2.7.exe&can=2&q=
[mysqlcommunity]:http://dev.mysql.com/downloads/mysql/

[mysqlworld]:http://dev.mysql.com/doc/index-other.html
[mysqlworlddl]:http://downloads.mysql.com/docs/world.sql.zip


[preview-portal-vm]: /en-us/manage/windows/tutorials/virtual-machine-from-gallery/

[The status of the Stop-AzureService command]: ../Media/django-helloworld-ps-stop.png
[The status of the Remove-AzureService command]: ../Media/django-helloworld-ps-remove.png

[Installation Guide]: http://windowsazure.com/en-us/documentation/articles/python-how-to-install
 
