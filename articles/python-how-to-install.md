---
title: Install Python and the SDK - Azure
description: Learn how to install Python and the SDK to use with Azure.
services: ''
documentationcenter: python
author: lmazuel
manager: wpickett
editor: ''

ms.assetid: f36294be-daeb-4caf-9129-fce18130f552
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: article
ms.date: 09/06/2016
ms.author: lmazuel

---
# Installing Python and the SDK
Python is easy to setup on Windows and comes pre-installed on Mac, Linux, and [Bash for Windows](https://msdn.microsoft.com/commandline/wsl/about). This guide walks you through installation and getting your machine ready for use with Azure.

## What's in the Python Azure SDK?
The Azure SDK for Python includes components that allow you to develop, deploy, and manage Python applications for Azure. Specifically, the Azure SDK for Python includes the following:

* **Management libraries**. These class libraries provide an interface managing Azure resources, such as storage accounts, virtual machines.
* **Runtime libraries**. These class libraries provide an interface for accessing Azure features, such as storage and service bus.

## Which Python and which version to use
There are several flavors of Python interpreters available - examples include:

* CPython - the standard and most commonly used Python interpreter
* PyPy - fast, compliant alternative implementation to CPython
* IronPython - Python interpreter that runs on .Net/CLR
* Jython - Python interpreter that runs on the Java Virtual Machine

**CPython** v2.7 or v3.3+ and PyPy 5.4.0 are tested and supported for the Python Azure SDK.

## Where to get Python?
There are several ways to get CPython:

* Directly from [www.python.org][www.python.org]
* From a reputable distro such as [www.continuum.io][www.continuum.io], [www.enthought.com][www.enthought.com] or [www.activestate.com][www.activestate.com]
* Build from source!

Unless you have a specific need, we recommend the first two options.

## SDK Installation on Windows, Linux, and MacOS (client libraries only)
If you already have Python installed, you can use pip to install a bundle of all the client libraries in your existing Python 2.7 or Python 3.3+ environment. This will download the packages from the [Python Package Index][Python Package Index] (PyPI).

You may need administrator rights:

* Linux and MacOS, use the `sudo` command: `sudo pip install azure-mgmt-compute`.
* Windows: open your PowerShell/Command prompt as an administrator

You can install individually each library for each Azure service:

```console
   $ pip install azure-batch          # Install the latest Batch runtime library
   $ pip install azure-mgmt-scheduler # Install the latest Storage management library
```

Preview packages can be installed using the `--pre` flag:

```console
   $ pip install --pre azure-mgmt-compute # will install only the latest Compute Management library
```

You can also install a set of Azure libraries in a single line using the `azure` meta-package. Since not all packages in this meta-package are published as stable yet, the `azure` meta-package is still in preview.
However, the core packages, from code quality/completeness perspectives can be considered "stable" at this time

* it will be officially labeled as such in sync with other languages as soon as possible.
  We are not planning on any further major changes until then.

Since it's a preview release, you need to use the `--pre` flag:

```console
   $ pip install --pre azure
```

or directly

```console
   $ pip install azure==2.0.0rc6
```

## Getting More Packages
The [Python Package Index][Python Package Index] (PyPI) has a rich selection of Python libraries.  If you chose to install a Distro, you'll already have most of the interesting bits for various scenarios from web development to Technical Computing.

## Python Tools for Visual Studio
[Python Tools for Visual Studio][Python Tools for Visual Studio] (PTVS) is a free/OSS plugin from Microsoft, which turns VS into a full-fledged Python IDE:

![how-to-install-python-ptvs](./media/python-how-to-install/how-to-install-python-ptvs.png)

Using PTVS is optional, but is recommended as it gives you Python and Web Project/Solution support, debugging, profiling, interactive window, Template editing, and Intellisense.

PTVS also makes it easy to deploy to Microsoft Azure, with support for deployment to [Cloud Services](cloud-services/cloud-services-python-ptvs.md) and [Websites](app-service-web/web-sites-python-ptvs-django-mysql.md).

PTVS works with your existing Visual Studio 2013 or 2015 installation.  For documentation, downloads and discussions, see [Python Tools for Visual Studio].  

## Python Azure Scenarios for Linux and MacOS
For Linux or MacOS, main Azure scenarios that are supported:

1. Consuming Azure Services by using the client libraries for Python
2. Running your app in a Linux VM
3. Developing and publishing to Azure Websites using Git

The first scenario enables you to author rich web apps that take advantage of the Azure PaaS capabilities such as [blob storage](virtual-machines/linux/quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), [queue storage](storage/storage-python-how-to-use-queue-storage.md), [table storage](storage/storage-python-how-to-use-table-storage.md) etc. via Pythonic wrappers for the Azure REST APIs. These works identically on Windows, Mac, and Linux.  You can also use these client libraries from your local development machine or a Linux VM running on Azure.

For the VM scenario, you simply start a Linux VM of your choice (Ubuntu, CentOS, Suse) and run/manage what you like.  As an example, you can run [IPython][IPython] REPL/notebook on your Windows/Mac/Linux machine and point your browser to a Linux or Windows multi-proc VM running the IPython Engine on Azure. See the [IPython Notebook on Azure](virtual-machines/linux/jupyter-notebook.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) tutorial for more information.

For information on how to setup a Linux VM, please see the [Create a Virtual Machine Running Linux](virtual-machines/linux/quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) tutorial.

Using Git deployment, you can develop a Python web application and publish it to an Azure Website from any operating system.  When you push your repository to Azure, it will automatically create a virtual environment and pip install your required packages.

For more information on developing and publishing Azure Websites, see the tutorials for [Creating Websites with Django](app-service-web/web-sites-python-create-deploy-django-app.md), [Creating Websites with Bottle](app-service-web/web-sites-python-create-deploy-bottle-app.md), and [Creating Websites with Flask](app-service-web/web-sites-python-create-deploy-flask-app.md). For more general information on using any WSGI-compliant framework, see [Configuring Python with Azure Websites](app-service-web/web-sites-python-configure.md).

## Additional Software and Resources:
* [Azure SDK for Python ReadTheDocs](http://azure-sdk-for-python.readthedocs.io/en/latest/)
* [Azure SDK for Python GitHub](https://github.com/Azure/azure-sdk-for-python)
* [Official Azure samples for Python](https://azure.microsoft.com/documentation/samples/?platform=python)
* [Continuum Analytics Python Distribution][Continuum Analytics Python Distribution]
* [Enthought Python Distribution][Enthought Python Distribution]
* [ActiveState Python Distribution][ActiveState Python Distribution]
* [SciPy - A suite of Scientific Python libraries][SciPy - A suite of Scientific Python libraries]
* [NumPy - A numerics library for Python][NumPy - A numerics library for Python]
* [Django Project - A mature web framework/CMS][Django Project - A mature web framework/CMS]
* [IPython - an advanced REPL/Notebook for Python][IPython - an advanced REPL/Notebook for Python]
* [IPython Notebook on Azure](virtual-machines/linux/jupyter-notebook.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Python Tools for Visual Studio on GitHub][Python Tools for Visual Studio on GitHub]
* [Python Developer Center](/develop/python/)

[Continuum Analytics Python Distribution]: http://continuum.io
[Enthought Python Distribution]: http://www.enthought.com
[ActiveState Python Distribution]: http://www.activestate.com
[www.python.org]: http://www.python.org
[www.continuum.io]: http://continuum.io
[www.enthought.com]: http://www.enthought.com
[www.activestate.com]: http://www.activestate.com
[SciPy - A suite of Scientific Python libraries]: http://www.scipy.org
[NumPy - A numerics library for Python]: http://www.numpy.org
[Django Project - A mature web framework/CMS]: http://www.djangoproject.com
[IPython - an advanced REPL/Notebook for Python]: http://ipython.org
[IPython]: http://ipython.org
[IPython Notebook on Azure]: virtual-machines-linux-jupyter-notebook.md
[Cloud Services]: cloud-services-python-ptvs.md
[Websites]: web-sites-python-ptvs-django-mysql.md
[Python Tools for Visual Studio]: http://aka.ms/ptvs
[Python Tools for Visual Studio on GitHub]: https://github.com/microsoft/ptvs
[Python Package Index]: http://pypi.python.org/pypi
[Microsoft Azure SDK for Python 2.7]: http://go.microsoft.com/fwlink/?LinkId=254281
[Microsoft Azure SDK for Python 3.4]: http://go.microsoft.com/fwlink/?LinkID=516990
[Setting up a Linux VM via the Azure portal]: create-and-configure-opensuse-vm-in-portal.md
[How to use the Azure Command-Line Interface]: crossplat-cmd-tools.md
[Create a Virtual Machine Running Linux]: virtual-machines-linux-quick-create-cli.md
[Creating Websites with Django]: web-sites-python-create-deploy-django-app.md
[Creating Websites with Bottle]: web-sites-python-create-deploy-bottle-app.md
[Creating Websites with Flask]: web-sites-python-create-deploy-flask-app.md
[Configuring Python with Azure Websites]: web-sites-python-configure.md
[table storage]: storage-python-how-to-use-table-storage.md
[queue storage]: storage-python-how-to-use-queue-storage.md
[blob storage]: storage-python-how-to-use-blob-storage.md
