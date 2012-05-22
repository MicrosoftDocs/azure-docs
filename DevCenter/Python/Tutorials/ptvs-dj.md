<properties linkid="dev-python-django-getting-started" urldisplayname="Python Django Web Application" headerexpose="" pagetitle="Python/Django Getting Started Guide" metakeywords="Azure Python Django getting started, Azure Python Django tutorial, Azure Python Django tutorial" footerexpose="" metadescription="An end-to-end tutorial that helps you develop a simple Python Django web application and deploy it to Windows Azure." umbraconavihide="0" disquscomments="1"></properties>

# Python Django Web Application using Visual Studio

Developing for Windows Azure is easy when using the available tools.
This tutorial assumes you have no prior experience using Windows Azure.
On completing this guide, you will have a Django application up and running in the cloud.

You will learn:

-   How to create a basic Django application
-   How to run and debug your Django application locally using the Django test server
-   How to run your Django application locally in the compute emulator
-   How to publish and re-publish your application to Windows Azure.

By following this tutorial, you will build a simple Hello World web
application. The application will be hosted in an instance of a web role
that, when running in Windows Azure, is itself hosted in a dedicated
virtual machine (VM).

A screenshot of the completed application is below:

![A browser window displaying Hello World][]


## <a id="setup"> </a>Setting Up the Development Environment

Before you can begin developing your Windows Azure application, you need to get the tools and set up your development environment. For details about getting and installing the Windows Azure SDK for Python, see [Setup the Development Environment](http://www.windowsazure.com/en-us/develop/python/tutorials/getting-started/#setup) in the Python "Hello World" Application tutorial.

NOTE
This tutorial requires Python 2.7 and Django 1.4. These versions are included in the current Windows Azure SDK for Python; however if you have installed a previous version you will need to [upgrade to the latest version](http://www.windowsazure.com/en-us/develop/python/tutorials/getting-started/#setup).

## Creating a New Django Application

To create a new Django application first launch Visual Studio and then create a new project using **File->New Project**.  Find the Python tab (either available at the top-level, or in the Other Languages area) and select the Django Application template:

![New Python Project Templates](../Media/ptvs-dj-NewProject.png)



**Click OK** and you'll have created your first Django app.


![Visual Studio opened to your first Django project](../Media/ptvs-dj-FirstProject.png)

Next you'll want to start developing the first Django app.  You can right click on the project node and select **Add New Django app**... to setup a new app within your project:

![Add New App menu item](../Media/ptvs-dj-AddNewApp.png)

After which you can enter the new name for your application:

![Add New App name prompt](../Media/ptvs-dj-AddNewAppPrompt.png)

After entering a name for the application and clicking **OK** a new app is added to your project:

![Solution Explorer with new app added](../Media/ptvs-dj-MyFirstApp.png)

Now **update settings.py** so that your application is registered.  This will cause Django to automatically discover template files which are added to your apps Templates directory.

![Add app to settings.py in INSTALLED_APPS](../Media/ptvs-dj-InstallApp.png)

Next lets add some code to the app's view.py so that we can return a simple template file:

![Add app to settings.py in INSTALLED_APPS](../Media/ptvs-dj-FirstView.png)

And then lets add a simple template file that will be rendered when you visit this view.  To do this we can right click on the Templates folder and select **"Add new Item"**:

![Add new item to Templates foder](../Media/ptvs-dj-AddFirstTemplate.png)

You can now select "Django HTML Template" from the template list and enter "index.html" in as the filename:

![Add new item to Templates foder](../Media/ptvs-dj-NewDjangoTemplate.png)

After which the template is added to the project and is open.  Here you can see the start of some syntax highlighting for the template tags:

![Template Added to Solution Explorer](../Media/ptvs-dj-TemplateAdded.png)

You could go ahead and start updating the template at this point to change the rendered HTML and you'll get nice intellisense while doing so:

![Template Intellisense for Django Filters](../Media/ptvs-dj-TemplateIntellisense.png)

You can leave the capitilization in or out, it won't change the results of this tutorial much one way or the either.  Finally you just need to register your view with the url patterns in urls.py.  

![Register URL](../Media/ptvs-dj-RegisterUrl.png)

## Running your Application Locally in the Test Server

At this point you've created your very first Django application.  Now you can run it locally by just **pressing F5**.  

![Django Hello World in a Browser and the Test Server](../Media/ptvs-dj-DjangoHelloWorldTestServer.png)

This will start your Python interpreter running Django's manage.py to run the test server.  Once the test server is successfully launched it will also launch a web browser to view the web site.  Because you launched with F5 this is launched under the debugger so we can also set breakpoints either in any of the Python code such as the view code or in the template files themselves:

![Debugger stopped at a template breakpoint](../Media/ptvs-dj-TemplateBreakpoint.png)

You can now **click the stop button** and move onto running in the Azure compute emulator.

## Running Your Application Locally in the Emulator	

To run inside of the compute emulator you simply need to add a Windows Azure deployment project to your solution for the Django project.  This can be done by right clicking on the Django project node in Solution Explorer and selecting **"Add Windows Azure Deployment Project"**:

![Add Deployment Project](../Media/ptvs-dj-AddDeploymentProject.png)

After executing this command you'll see a newly added project in solution explorer:

![After Add Deployment Project](../Media/ptvs-dj-AfterDeployProjAdded.png)

This new project is now also marked as the startup project in the solution.  At this point you'll need to **restart Visual Studio as an Administrator** to be able to run in the compute emulator, but after doing so we can simply **hit F5** and the app will run and deploy in the compute emulator:

![After Add Deployment Project](../Media/ptvs-dj-ComputeEmulator.png)

Now you can see that we are now looking at the same web page but at a slighltly different URL.  You can also see that there's no python.exe running the Django test server.  Instead we are running Django through IIS using a FastCGI gateway which is automatically included and setup when working from within Visual Studio.  

When running in the compute emulator you can rapidly iterate on your application - just switch back to Visual Studio, update your files, and refresh the web browser.  You'll see the results immediately!

## Deploying the Application to Windows Azure

Now you're ready to deploy the project to Windows Azure.  The first step is to create the package to be deployed.  This is achieved by right clicking the Azure deployment project in Solution Explorer and **selecting Package**:

![Package App Menu](../Media/ptvs-dj-PackageApp.png)

After selecting Package you will get some options which can be configured:

![Package Settings](../Media/ptvs-dj-PackageSettings.png)

You can simply select Package to continue and create the package using the default options.  This step will take your Django application as well as your Python interpreter
and package them up with the necessary files to deploy to the cloud.  Once this completes
a folder will be opened containing the resulting package file:

![New Hosted Service](../Media/ptvs-dj-PackageCreated.png)

From here you can sign into the [Windows Azure Portal](https://windows.azure.com/default.aspx)
with your Windows Azure account and deplopy the package.  First **click on the New Hosted Service** button:


![New Hosted Service](../Media/ptvs-dj-NewHostedService.png)

Then fill out the information in the New Hosted Service dialog.  You'll need to select
what subscription the service is associated with, provide a name, choose a region, and
specify a deployment name.  Then you'll need to select the Package location and the
Configuration file.  Select the Browse Locally button on both of them and navigate to
the folder which was opened after creating the deployment package:

![Select Package](../Media/ptvs-dj-PackageLocation.png)

Repeat again for the configuration file and you'll be ready to press OK to setup
the new hosted service:

![Select Package](../Media/ptvs-dj-NewHostedServiceDone.png)

You'll now need to wait for the application be setup and deployed. Once it's all setup
you can click on the link below DNS Name to view your web site running in the cloud:


![Your Django app in the cloud](../Media/ptvs-dj-FirstAppInCloud.png)
