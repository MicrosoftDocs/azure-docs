<properties linkid="develop-python-web-site-with-django" urlDisplayName="Web Sites with Django" pageTitle="Python Web Sites with Django - Windows Azure tutorial" metaKeywords="Windows Azure django   django website" metaDescription="A tutorial that introduces you to running a Python web site on Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />


# Creating Web Sites with Django

In this tutorial we’ll describe how to get started running Python on Windows Azure Web Sites.  Windows Azure Web Sites feature provide limited free hosting and rapid deployment – and now you can use Python!  As your app grows you can switch to paid hosting, and you can also integrate with all of the other Windows Azure services.  

In this blog we’ll be showing you how to deploy an application built using the Django web framework. We’ll walk through the steps of packaging up the Python runtime, any required libraries including Django, as well as your application.  We’ll put this all into a Git repository which makes it quick and simple to push updates to your web site.  And finally we’ll configure the newly created site via Windows Azure so that it runs your Python application.  

Before we get started you’ll need to have a copy of Python installed locally.  We’ll be showing how to do this with Python 2.7 and Django 1.4 but because you deploy these with your application you can actually pick any version you’d like.  You can either get these on your own or you can quickly and easily install these by using the Windows Installer link on [http://www.windowsazure.com/en-us/develop/python/](http://www.windowsazure.com/en-us/develop/python/).  

You’ll also need to install Git for pushing the site to Azure – we recommend [msysgit](http://code.google.com/p/msysgit/).  There are also other deployment options available including TFS and WebMatrix but this blog will cover using Git.  Once you have Python, Django, and Git installed you’ll have everything you need to get going.

## Web Site Creation on Portal

The first step in creating your app is to create the web site via the Windows Azure Portal.  To do this you’ll need to login to the Windows Azure portal and then select the WEB SITES from the left hand side:

![](../Media/python_website_01_image001.png)

Then click on the NEW button in the bottom left corner:

![](../Media/python_website_02_image002.png)

And then click Quick Create, enter an URL, and select Create Web Site:

![](../Media/python_website_03_image003.png)

The site will be quickly setup:

![](../Media/python_website_04_image004.png)

And then you can click on the site name to go to the dashboard.  

![](../Media/python_website_05_image005.png)

Next, we want to add support for publishing via Git.  This can quickly be done by clicking on the “Set up Git publishing” button along the right hand side.  As you can see there’s a couple of other options to how you can setup publishing as well.  After setting up Git publishing you’ll momentarily see a page informing you the repo is being created and then you’ll be taken to the deployments tab after the repo has been created which includes instructions on how to connect.  

![](../Media/python_website_06_image006.png)


## Web Site Development

Now that we’ve created our Git repo in Windows Azure we’ll start filling it in with the web site from our local machine.  The first step we’ll do is clone the existing empty site using the url provided:

![](../Media/python_website_07_image007.png)

From here we’re ready to setup the enlistment with the web site.  We’ll need to do a few things:

1.  Include the Python distro with Django that we’ll be using to run the web site.
2.  Include the Django application code.
3.  Include the wfastcgi.py script which will handle the requests.

First, we’ll include the Python distribution.  To do this we’ll create a new directory called Python and copy our installed version of Python there.  First we need to make a new Python directory and running “xcopy /s C:\Python27\* .” to copy the Python runtime.

![](../Media/python_website_08_image008.png)

Then we need to copy python27.dll to be included as well.  If you’re on a 64-bit operating system and deploying a 32-bit Python you’ll need to copy this from %WINDIR%\SysWow64.  Otherwise you’ll find it in %WINDIR%\System32.  If it’s not in either then you have a per-user install of Python and it’ll already be copied over.

![](../Media/python_website_09_image009.png)
 
Next we’ll go ahead and create our initial Django application.  You can do this just as you’d create any other Django application from the command line or you can use [Python Tools for Visual Studio](http://pytools.codeplex.com/) to create the project.  We’ll show you both of the options here.

**Option 1:** 
To create the new project from the command line you just need to run the command: “Python\python.exe -m django.bin.django-admin startproject DjangoApplication” which will create the Django application into the DjangoApplication folder.  This option is using the same Python interpreter and libraries that we’ll be deploying to the web site which is also a good test that everything is setup correctly.

![](../Media/python_website_10_image010.png)

**Option 2:**  
You can also create your new site using Python Tools for Visual Studio.  Simply start Visual Studio with Python Tools for Visual Studio installed and select File->New Project.  Drill into the Python projects under Other Languages and select “Django Application”.  Enter “DjangoApplication” for the name of the project, and make sure that “Create directory for solution” is unchecked to get the exact same directory structure as creating a Django application from the command line.  This option will get you setup with a Visual Studio solution and project file giving you a great local development experience including template debugging and intellisense.

![](../Media/python_website_11_image011.png)

Now we’re getting close to have our app setup, and there’s one last step.  We need to add the wfastcgi.py script which will be handling our requests.  This can be downloaded from [http://pytools.codeplex.com/releases](http://pytools.codeplex.com/releases) - you can always get the latest version from the latest release.  We’ll download that and save it in our C:\PythonWebSite directory:

![](../Media/python_website_12_image012.png)

Now we just need to add all of the files we’ve just added and push the site to Git.  To do this we need to run a few commands:

	git add DjangoApplication Python wfastcgi.py
	git commit -m "Initial site"
	git remote add azure https://dinov@pythonwebsite.scm.azurewebsites.net/PythonWebSite.git
	git push azure master

The first command will save the files will add our untracked files to be tracked.  The second command will commit the files we just added into the repo.  The third command adds a remote with the name “azure” for our repo.  And finally we take the changes and push them to the remote repo which will also kick off the deployment.  After doing this we should see a result like:

![](../Media/python_website_13_image013.png)

After doing the push we’ll see the web browser opened to the Windows Azure portal refresh and display the active deployment:

![](../Media/python_website_14_image014.png)

## Web Site Configuration

Finally we just need to configure the web site to know about our Django project and to use our handler.  To do this we can click on the Configure tab along the top of the screen where we’ll want to scroll down to the bottom half of the page which contains app settings and handler mappings.  

First let’s add our app settings.  All of the settings that are set here will turn into environment variables during the actual request.  This means that we can use this to configure the DJANGO\_SETTINGS\_MODULE environment variable as well as PYTHONPATH and WSGI\_HANDLER.  If your application has other configuration values you could assign these here and pick them up out of the environment.  Sometimes you’ll want to set something which is a path to a file in your web site, for example we’ll want to do this for PYTHONPATH.  When running as a Windows Azure web site your web site will live in “D:\home\site\wwwroot\” so you can use that in any location where you need a full path to a file on disk.

For setting up a Django application we need to set three environment variables.  The first is DJANGO\_SETTINGS\_MODULE which provides the module name of the Django application which will be used to configure everything.  The second is the PYTHONPATH environment variable so that we can find the package which the settings module lives in.  The third is WSGI\_HANDLER.  It's a module/package name, followed by the attribute in the module to be used; for example mypackage.mymodule.handler.  Add parentheses to indicate that the attribute should be called.  So for these variables we will set them up as:
                
	DJANGO_SETTINGS_MODULE    DjangoApplication.settings
	PYTHONPATH                D:\home\site\wwwroot\DjangoApplication
	WSGI_HANDLER              django.core.handlers.wsgi.WSGIHandler()

Finally we need to configure our handler mapping.  For this we register the handler for all extensions (*), we set the script processor path to the Python interpreter path (D:\home\site\wwwroot\Python\python.exe), and for additional arguments we provide the path to the wfastcgi.py script (D:\home\site\wwwroot\wfastcgi.py).

At this point we’re ready to click on the Save button at the bottom, and these two sections should look like:

![](../Media/python_website_15_image015.png)

![](../Media/python_website_16_image016.png)

Finally we can go back to the Dashboard, and go down to the SITE URL on the left hand side and click on the link and we’ll open our new Django site:

![](../Media/python_website_17_image017.png)

## Next Steps

From here you can continue the development of your Django application using the tools you’re already using.  If you’re using [Python Tools for Visual Studio](http://pytools.codeplex.com/) for development you will likely want to install [VisualGit](http://code.google.com/p/visualgit/) to get source control integration within Visual Studio.  

Likely your app will have additional dependencies beyond Python and Django.  If you installed using the installer from [http://www.windowsazure.com/en-us/develop/python/](http://www.windowsazure.com/en-us/develop/python/) you’ll already have PIP installed and can use this to quickly add new dependencies.  To get them to correctly install into the local Python copy you’ll need to skip using pip.exe and instead execute the PIP using the following syntax:

	python.exe -m pip install nltk

This would install the Natural Language Toolkit and all of its dependencies.  You can then do “git status” to see the newly added files, and “git add” followed by “git commit” to commit the to the repo.  Finally you can do a “git push” which will deploy the updated web site to Windows Azure.

Likewise you can go into the DjangoApplication directory and use manage.py as you would typically to start adding new applications to your Django project.  
