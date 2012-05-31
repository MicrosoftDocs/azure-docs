# Django Hello World Web Application (mac-linux)

This tutorial describes how to host a Django-based website on Windows 
Azure using a Linux virtual machine. This tutorial assumes you have no prior experience using Windows Azure. Upon completing this guide, you will have a Django-based application up and running in the cloud.

You will learn how to:

* Setup a Windows Azure virtual machine to host Django. While this tutorial explains how to accomplish this under **Linux**, the same could also be done with a Windows Server 2008 R2 VM hosted in Windows Azure. 
* Create a new Django application from Linux.

By following this tutorial, you will build a simple Hello World web
application. The application will be hosted in a Windows Azure Preview Portal virtual machine.

A screenshot of the completed application is below:

![A browser window displaying the hello world page on Windows Azure][]


## Creating and configuring a Windows Azure virtual machine to host Django

1. Follow the instructions given [here][preview-portal-vm] to create a Windows Azure Preview Portal virtual machine of the *Ubuntu Server 12.04* flavor.

  **Note:** you *only* need to create the virtual machine. Stop at the section titled *How to log on to the virtual machine after you create it*.

1. Instruct Windows Azure to direct port **80** traffic from the web to port **80** on the virtual machine:
 * Navigate to your newly created virtual machine in the Windows Azure Preview Portal and click the *ENDPOINTS* tab.
 * Click *ADD ENDPOINT* button at the bottom of the screen.
![][add endpoint]
 * Open up the *TCP* protocol's *PUBLIC PORT 80* as *PRIVATE PORT 80*.
![][port80]

## <a id="setup"> </a>Setting up the development environment

The Ubuntu Linux VM already comes with Python 2.7 pre-installed, but it doesn't have django installed.  Follow these steps to connect to your VM and install django.

1.  Launch a new **Terminal** window.
    
1.  Enter the following command to connect to the Windows Azure VM, with the user name and VM name that you specified during the creation of the VM:

		$ ssh *username*@*yourVmName*.cloudapp.net

1.  Enter the following commands to install django:

		$ sudo apt-get install python-dev python-setuptools
		$ curl https://raw.github.com/pypa/pip/master/contrib/get-pip.py | sudo python
		$ sudo easy_install django


## Creating a new Django application

1.  Open the **Terminal** window you used in the previous section to ssh into your VM.
    
1.  Enter the following commands to create a new Django project:

    ![The result of the django-admin command][]

    The **django-admin.py** script generates a basic structure for Django-based websites:
    -   **manage.py** helps you to start hosting and stop hosting your Django-based website
    -   **helloworld\settings.py** contains Django settings for your application.
    -   **helloworld\urls.py** contains the mapping code between each url and its view.

1.  Create a new file named **views.py** in the *helloworld* subdirectory of *django\helloworld*, as a sibling of **urls.py**. This will contain the view that renders the "hello world" page. Start your editor and enter the following:
		
		from django.http import HttpResponse
		def hello(request):
    		html = "<html><body>Hello World!</body></html>"
    		return HttpResponse(html)

1.  Now replace the contents of the **urls.py** file with the following:

		from django.conf.urls.defaults import patterns, include, url
		from helloworld.views import hello
		urlpatterns = patterns('',
			(r'^$',hello),
		)


## Deploying and running your Django website

1.  Enter the following command to find out the public ip address for your VM:

        $ ifconfig

	![The result of the ifconfig command][]

1.  Change to the django/helloworld directory and enter the following command to run your Django website, replacing the ip address with the one that was reported by **ifconfig** in the previous step:

        $ ./manage.py runserver 123.34.56.78:80

    The **runserver** parameter instructs Django to run our *helloworld* website on TCP port *80*. The results of this command should be similar to:

        $ ./manage.py runserver 123.34.56.78:80
        Validating models...
        
        0 errors found
        Django version 1.4, using settings 'helloworld.settings'
        Development server is running at http://123.34.56.78:80
        Quit the server with CTRL-C.

1.  From your local web browser, open http://yourVmName.cloudapp.net (where *yourVmName* is whatever name you used in the virtual machine creation step).  You should see "Hello World!":

	![A browser window displaying the hello world page on Windows Azure][]

1.  To suspend and resume the hosting process as a background task, press **CTRL-Z** and enter the following command:

        $ bg

	You will now be able to terminate your ssh connection and have your web site continue running.


## Shutting down your Windows Azure virtual machine

When you're done with this tutorial, shutdown and/or remove your newly created Windows Azure virtual machine to free up resources for other tutorials and avoid incurring Windows Azure usage charges.

[A browser window displaying the hello world page on Windows Azure]: ../Media/mac-linux-django-helloworld-browser.png
[The result of the django-admin command]: ../Media/mac-linux-django-helloworld-dir.png
[Overview of Creating a Hosted Service for Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg432976.aspx
[http://www.windowsazure.com]: http://www.windowsazure.com
[A browser window displaying http://www.windowsazure.com/ with the Free Trial link highlighted]: ../../../DevCenter/dotNet/Media/getting-started-12.png
[A browser window displaying the liveID sign in page]: ../../../DevCenter/Node/Media/getting-started-13.png
[add endpoint]: ../Media/mac-linux-django-helloworld-add-endpoint.png
[port80]: ../Media/mac-linux-django-helloworld-port80.png
[preview-portal]: https://manage.windowsazure.com
[preview-portal-vm]: /en-us/manage/linux/tutorials/virtual-machine-from-gallery/
[The result of the ifconfig command]: ../Media/mac-linux-django-helloworld-ifconfig.png