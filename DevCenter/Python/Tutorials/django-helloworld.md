# Django Hello World Web Application

This tutorial describes how to host a Django-based website in Windows 
Azure using a Windows Server 2008 R2 virtual machine. This tutorial assumes you have no prior experience using Windows Azure. Upon completing this guide, you will have a Django-based application up and running in the cloud.

You will learn how to:

* Setup a Windows Azure virtual machine to host Django. While this tutorial explains how to accomplish this under **Windows Server 2008 R2**, the same could also be done with a Linux VM hosted in Windows Azure. 
* Create a new Django application from Windows.

By following this tutorial, you will build a simple Hello World web
application. The application will be hosted in a Windows Azure Preview Portal virtual machine.

A screenshot of the completed application is below:

![A browser window displaying the hello world page on Windows Azure][]


## Creating and configuring a Windows Azure virtual machine to host Django

* Follow the instructions given [here][preview-portal-vm] to create a Windows Azure Preview Portal virtual machine of the *Windows Server 2008 R2* flavor.
* Open up TCP port **8000** on the virtual machine:
 1. From the **Start** menu, select **Administrator Tools** and then **Windows Firewall with Advanced Security**. 
 1. In the left pane, select **Inbound Rules**.  In the **Actions** pane on the right, select **New Rule...**.
 1. In the **New Inbound Rule Wizard**, select **Port** and then click **Next**.
 1. Select **TCP** and then **Specific local ports**.  Specify a port of "8000" (the port Django listens on) and click **Next**.
 1. Select **Allow the connection** and click **Next**.
 1. Click **Next** again.
 1. Specify a name for the rule, such as "DjangoPort", and click Finish.
* Instruct Windows Azure to redirect port **80** traffic from the web to port **8000** on the virtual machine:
 1. Navigate to your newly created virtual machine in the Windows Azure Preview Portal and click the *ENDPOINTS* tab.
 1. Click *ADD ENDPOINT* button at the bottom of the screen.
![][add endpoint]

 1. Open up the *TCP* protocol's *PUBLIC PORT* **80** as *PRIVATE PORT* **8000**.
![][port80]
* Use Windows *Remote Desktop* to remotely log into the newly created Windows Azure virtual machine.  

**Important Note:** all instructions below assume you logged into the virtual machine correctly and are issuing commands there rather than your local machine! 

## <a id="setup"> </a>Setting up the development environment

To set up your Python and Django environments, please see the [Installation Guide][] for more information.

*Note for Windows*: if you used the Windows WebPI installer, you already have Django and the Client Libs installed.

## Creating a new Django application

We recommend using Windows PowerShell for developing your Windows Azure applications:

1.  On the **Start** menu, click **Accessories** => **Windows PowerShell** => and then right-click on **Windows PowerShell** and select **Run As Administrator**. Opening
    your Windows PowerShell environment this way avoids extra prompts later on.
    
1.  Create a new **django** directory on your C drive, and change to the
    c:\\django directory:

    ![A command prompt displaying the django directory creation][]

1.  Enter the following command to create a new Django project:

    ![The result of the New-AzureService command][]

    The **django-admin.py** script generates a basic structure for Django-based websites:
    -   manage.py helps you to start hosting and stop hosting your Django-based website
    -   helloworld\settings.py contains Django settings for your application.
    -   helloworld\urls.py contains the mapping code between each url and its view.

1.  Create a new file named **views.py** in the *helloworld* subdirectory of *C:\django\helloworld*, as a sibling of **urls.py**. This will contain the view that renders the "hello world" page. Start your editor and enter the following:
		
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


## Running your Django website locally in the virtual machine

1.  Close Notepad and switch back to the Windows PowerShell window.
    Enter the following command to run your Django website:

        PS C:\django\helloworld> C:\Python27\python.exe .\manage.py runserver 8000

    The **runserver** parameter instructs Django to run our *helloworld* website on TCP port *8000*. The results of this command should be similar to:

        PS C:\django\helloworld> C:\Python27\python.exe .\manage.py runserver 8000
        Validating models...
        
        0 errors found
        Django version 1.4, using settings 'helloworld.settings'
        Development server is running at http://127.0.0.1:8000
        Quit the server with CTRL-BREAK.
 
    Now simply open *Internet Explorer* in the virtual machine and navigate to **http://127.0.0.1:8000**. You should see “Hello World!” displayed as shown in the screenshot below. This indicates that Django is running in the virtual machine and is working correctly.

    ![A web browser displaying the Hello World web page on emulator][]

1.  To stop Django from hosting the website, simply switch to the PowerShell window and press **CTRL-C**.

## Deploying the Django website publically

Simply repeat step *1* from **Running your Django website locally in the virtual machine** without ever pressing CTRL-C.  Yes, it's really that easy! You could also make step *1* automated each time the virtual machine starts by using the [Windows Task Scheduler].

Now from your local web browser, open http://yourVmName.cloudapp.net (where *yourVmName* is whatever name you used in the virtual machine creation step).  You should again see "Hello World!":

![A web browser displaying the Hello World web page on emulator][]

## Shutting down your Windows Azure virtual machine

When you're done with this tutorial, shutdown and/or remove your newly created Windows Azure virtual machine to free up resources for other tutorials and avoid incurring Windows Azure usage charges.

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
[windows task scheduler]:http://msdn.microsoft.com/en-us/library/windows/desktop/aa383614(v=vs.85).aspx
[add endpoint]: ../Media/mysql_tutorial02-1.png
[port80]: ../Media/django-helloworld-port80.png
[preview-portal]: https://manage.windowsazure.com
[preview-portal-vm]: /manage/windows/tutorials/virtual-machine-from-gallery/

[Installation Guide]: ../commontasks/how-to-install-python.md