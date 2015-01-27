<properties 
	pageTitle="Install Python and the SDK - Azure" 
	description="Learn how to install Python and the SDK to use with Azure." 
	services="" 
	documentationCenter="python" 
	authors="huguesv" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="11/10/2014" 
	ms.author="huvalo"/>




# Installing Python and the SDK
Python is pretty easy to setup on Windows and comes pre-installed on Mac and Linux.  This guide walks you through installation and getting your machine ready for use with Azure.  This guide will help you with the following:

* What's in the Python Azure SDK?
* Which Python and which version to use
* Installation on Windows
* Installation on Mac and Linux

## What's in the Python Azure SDK?

The Azure SDK for Python includes components that allow you to develop, deploy, and manage Python applications for Azure. Specifically, the Azure SDK for Python includes the following:

* **The Python Client Libraries for Azure**. These class libraries provide an interface for accessing Azure features, such as Data Management Services and Cloud Services.  
* **The Azure Emulators (Windows Only)**. The compute and storage emulators are local emulators of Cloud Services and Data Management Services that allow you to test an application locally. The Azure Emulators run on Windows only.


The core scenarios for this release are:

* **Windows**: Cloud Service, Website -- for example a Django site using Web Roles
* **Mac/Linux**: IaaS -- Run what you like in a VM; Consume Azure Services through Python

## Which Python and which version to use

There are several flavors of Python interpreters available - examples include:

* CPython - the standard and most commonly used Python interpreter
* IronPython - Python interpreter that runs on .Net/CLR
* Jython - Python interpreter that runs on the JVM

For the purposes of this release, only **CPython** is tested and supported.  We recommend version 2.7 or 3.4.

## Where to get Python?

There are several ways to get CPython:

* Directly from www.python.org
* From a reputable distro such as www.enthought.com, www.ActiveState.com, www.continuum.io
* Build from source!

Unless you have a specific need, we recommend the first two options, as described below.

## Installation on Windows

For Windows, you can use the Web Platform Installer to streamline the installation. These include CPython from www.python.org.

* [Microsoft Azure SDK for Python 2.7][]
* [Microsoft Azure SDK for Python 3.4][]

**Note:** On Windows Server, in order to download the WebPI installer you may have to configure IE ESC settings (Start/Administrative Tools/Server Manager/Local Server, then click **IE Enhanced Security Configuration**, set to Off)


### Python 2.7

The WebPI installer provides everything you need to develop Python Azure apps.

![how-to-install-python-webpi-27-1](./media/python-how-to-install/how-to-install-python-webpi-27-1.png)

Once finished, you should see this screen confirming your install choices:

![how-to-install-python-webpi-27-2](./media/python-how-to-install/how-to-install-python-webpi-27-2.png)

After installation is complete, type python at the prompt to make sure things went smoothly.  Depending on how you installed, you may need to set your "path" variable to find (the right version of) Python:

![how-to-install-python-win-run-27](./media/python-how-to-install/how-to-install-python-win-run-27.png)

After the installation you should have Python and the Client Libraries available at the default location:

		C:\Python27\Lib\site-packages\azure


### Python 3.4

The WebPI installer provides everything you need to develop Python Azure apps.

![how-to-install-python-webpi-34-1](./media/python-how-to-install/how-to-install-python-webpi-34-1.png)
 
Once finished, you should see this screen confirming your install choices:

![how-to-install-python-webpi-34-2](./media/python-how-to-install/how-to-install-python-webpi-34-2.png)

After installation is complete, type python at the prompt to make sure things went smoothly.  Depending on how you installed, you may need to set your "path" variable to find (the right version of) Python:

![how-to-install-python-win-run-34](./media/python-how-to-install/how-to-install-python-win-run-34.png)

After the installation you should have Python and the Client Libraries available at the default location:

		C:\Python34\Lib\site-packages\azure


### Getting More Packages

While this release is focused primarily on Web Apps, feel free to browse the [Python Package Index (PyPI)][] for a rich selection of other software.  If you chose to install a Distro, you'll already have most of the interesting bits for a variety of scenarios from web development to Technical Computing.


### Python Tools for Visual Studio

Python Tools for Visual Studio (PTVS) is a free/OSS plugin from Microsoft which turns VS into a full-fledged Python IDE:

![how-to-install-python-ptvs](./media/python-how-to-install/how-to-install-python-ptvs.png)

Using PTVS is optional, but is recommended as it gives you Python and Django Project/Solution support, debugging, profiling, interactive window, Template editing and Intellisense.

PTVS also makes it easy to deploy to Microsoft Azure, with support for [deployment to Cloud Services and Web Sites][].

PTVS works with your existing Visual Studio 2010, 2012 or 2013 installation.  For more information and for downloads, see [Python Tools for Visual Studio on CodePlex][].  

## Windows Uninstall

The **Azure SDK for Python** WebPI products are not applications in the typical sense, but actually a collection of distinct products such as 32-bit Python 2.7/3.4, Azure client libraries for Python, etc. which are bundled together.  A consequence of this is it has no conventional uninstaller of its own, so you will need to remove the programs that it installs individually from the Windows Control Panel.  

If you ever wish to reinstall **Azure SDK for Python**, simply open a PowerShell command prompt as an administrator and run the following command:

	rm -force "HKLM:\SOFTWARE\Microsoft\Python Tools for Azure"

and then rerun WebPI.

## Installation on Linux and MacOS

Python is most likely already installed on your Dev machine.  You can check by entering:

![how-to-install-python-linux-run](./media/python-how-to-install/how-to-install-python-linux-run.png)

Here we see that this Ubuntu Server 14.04 LTS VM running on Azure has CPython 2.7.6 installed. If you need to upgrade, follow your OS's recommended package upgrade instructions.

To install the Python Azure Client Libraries, use **pip** to grab it from **PyPI**:

	curl https://bootstrap.pypa.io/get-pip.py | sudo python
	
The command above will silently prompt for the root password. Type it and press Enter.  Next:
	
	sudo pip install azure

You should now see the client libraries installed under **site-packages**.  On MacOS:

![how-to-install-python-mac-site](./media/python-how-to-install/how-to-install-python-mac-site.png)

When developing from mac/linux, there are two main scenarios supported:

1. Consuming Azure Services by using the client libraries for Python

2. Running your app in a Linux VM

The first scenario enables you to author rich web apps that take advantage of the Azure PaaS capabilities such as blob storage, queues, etc. via Pythonic wrappers for the Azure REST API's.  These work identically on Windows, Mac and Linux.  See the Tutorials and How To Guides for examples.  You can also use these client libraries from within a Linux VM.

For the VM scenario, you simply start a Linux VM of your choice (Ubuntu, CentOS, Suse) and run/manage what you like.  As an example, you can run [IPython](http://ipython.org) REPL/notebook on your Windows/Mac/Linux machine and point your browser to a Linux or Windows multi-proc VM running the IPython Engine on Azure. For more information on IPython installation please see its tutorial.

For information on how to setup a Linux VM, please see the [Linux Management section.](/en-us/manage/linux/)

## Additional Software and Resources:

* [Enthought Python Distribution][]
* [ActiveState Python Distribution][]
* [SciPy - A suite of Scientific Python libraries][]
* [NumPy - A numerics library for Python][]
* [Django Project - A mature web framework/CMS][]
* [IPython - an advanced REPL/Notebook for Python][]
* [IPython Notebook on Azure][]
* [Python Tools for Visual Studio on CodePlex][]
* [Virtualenv][]


[Enthought Python Distribution]: http://www.enthought.com 
[ActiveState Python Distribution]: http://www.activestate.com
[SciPy - A suite of Scientific Python libraries]: http://www.scipy.org
[NumPy - A numerics library for Python]: http://www.numpy.org
[Django Project - A mature web framework/CMS]: http://www.djangoproject.com 
[IPython - an advanced REPL/Notebook for Python]: http://ipython.org
[IPython Notebook on Azure]: /en-us/documentation/articles/virtual-machines-python-ipython-notebook
[deployment to Cloud Services and Web Sites]: /en-us/documentation/articles/cloud-services-web-sites-python-django-app-with-ptvs/
[Python Tools for Visual Studio on CodePlex]: http://pytools.codeplex.com 
[Python Package Index (PyPI)]: http://pypi.python.org/pypi
[Virtualenv]: http://pypi.python.org/pypi/virtualenv 
[Microsoft Azure SDK for Python 2.7]: http://go.microsoft.com/fwlink/?LinkId=254281&clcid=0x409
[Microsoft Azure SDK for Python 3.4]: http://go.microsoft.com/fwlink/?LinkID=516990&clcid=0x409
[Setting up a Linux VM via the Azure portal]: ../../../shared/chunks/create-and-configure-opensuse-vm-in-portal
[How to use the Azure Command-Line Tools for Mac and Linux]: ../../shared/chunks/crossplat-cmd-tools

