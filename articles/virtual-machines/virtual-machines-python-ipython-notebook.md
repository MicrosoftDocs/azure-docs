<properties
	pageTitle="Create an IPython Notebook | Microsoft Azure"
	description="Learn how to deploy the IPython Notebook on a Linux or Windows virtual machine created with the classic deployment model in Azure."
	services="virtua-lmachines"
	documentationCenter="python"
	authors="huguesv"
	manager="wpickett"
	editor=""
	tags=“azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-multiple"
	ms.devlang="python"
	ms.topic="article"
	ms.date="05/20/2015"
	ms.author="huvalo"/>

# IPython Notebook on Azure

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article covers deploying a notebook on a virtual machine created with the classic deployment model.

The [IPython project](http://ipython.org) provides a collection of tools for scientific computing that include powerful interactive shells, high-performance and easy to use parallel libraries and a web-based environment called the IPython Notebook. The Notebook provides a working environment for interactive computing that combines code execution with the creation of a live computational document. These notebook files can contain arbitrary text, mathematical formulas, input code, results, graphics, videos and any other kind of media that a modern web browser is capable of displaying.

Whether you're absolutely new to Python and want to learn it in a fun, interactive environment or do some serious parallel/technical computing, the IPython Notebook is a great choice. As an illustration of its capabilities, the
following screenshot shows the IPython Notebook being used, in combination with the SciPy and Matplotlib packages, to analyze the structure of a sound recording.

![Screenshot](./media/virtual-machines-python-ipython-notebook/ipy-notebook-spectral.png)

This article will show you how to deploy the IPython Notebook on Microsoft
Azure, using Linux or Windows virtual machines (VMs).  By using the IPython
Notebook on Azure, you can easily provide a web-accessible interface to
scalable computational resources with all the power of Python and its many
libraries.  Since all installation is done in the cloud, users can access these
resources without the need for any local configuration beyond a modern web
browser.

[AZURE.INCLUDE [create-account-and-vms-note](../../includes/create-account-and-vms-note.md)]

## Create and configure a VM on Azure

The first step is to create a virtual machine (VM)  running on Azure.
This VM is a complete operating system in the cloud and will be used to
run the IPython Notebook. Azure is capable of running both Linux and Windows
virtual machines, and we will cover the setup of IPython on both types of virtual machines.

### Linux VM

Follow the instructions given [here][portal-vm-linux] to create a virtual machine of the *OpenSUSE* or *Ubuntu* distribution. This tutorial uses OpenSUSE 13.2 and Ubuntu Server 14.04 LTS. We'll assume the default user name *azureuser*.

### Windows VM

Follow the instructions given [here][portal-vm-windows] to create a virtual machine of the *Windows Server 2012 R2 Datacenter* distribution. In this tutorial, we'll assume that the user name is *azureuser*.

## Create an endpoint for the IPython Notebook

This step applies to both the Linux and Windows VM. Later on we will configure
IPython to run its notebook server on port 9999. To make this port publicly
available, we must create an endpoint in the Azure Management Portal. This
endpoint opens up a port in the Azure firewall and maps the public port (HTTPS,
443) to the private port on the VM (9999).

To create an endpoint, go to the VM dashboard, click **Endpoints**, then click **Add
Endpoint** and create a new endpoint (called `ipython_nb` in this example). Pick
**TCP** for the protocol, **443** for the public port and **9999** for the private port.

![Screenshot](./media/virtual-machines-python-ipython-notebook/ipy-azure-linux-005.png)

After this step, the **Endpoints** Dashboard tab will look like the next screenshot.

![Screenshot](./media/virtual-machines-python-ipython-notebook/ipy-azure-linux-006.png)

## Install required software on the VM

To run the IPython Notebook on our VM, we must first install IPython and
its dependencies.

### Linux (OpenSUSE)

To install IPython and its dependencies, SSH into the Linux VM, complete
the following steps.

Install [NumPy][NumPy], [Matplotlib][Matplotlib], [Tornado][Tornado] and other IPython's dependencies with the following commands.

    sudo zypper install python-matplotlib
    sudo zypper install python-tornado
    sudo zypper install python-jinja2
    sudo zypper install ipython

### Linux (Ubuntu)

To install IPython and its dependencies, SSH into the Linux VM and carry out
the following steps.

First, retrieve new lists of packages with the following command.

    sudo apt-get update

Install [NumPy][NumPy], [Matplotlib][Matplotlib], [Tornado][Tornado] and other IPython's dependencies with the following commands.

    sudo apt-get install python-matplotlib
    sudo apt-get install python-tornado
    sudo apt-get install ipython
    sudo apt-get install ipython-notebook

### Windows

To install IPython and its dependencies on the Windows VM, use Remote Desktop to connect to the VM. Then carry out the following steps,
using the Windows PowerShell to run all command-line actions.

**Note**: To download anything using Internet Explorer, you'll need to change some security settings.  From **Server Manager**, click **Local Server**, then on **IE Enhanced Security Configuration**, turn it off for administrators.  You can enable it again after you install IPython.

1.  Download and install the latest 32-bit version of [Python 2.7][].  You will need to add `C:\Python27` and `C:\Python27\Scripts` to your `PATH` environment variable.

1.  Install [Tornado][Tornado] and [PyZMQ][PyZMQ] and other IPython's dependencies with the following commands.

        easy_install tornado
        easy_install pyzmq
        easy_install jinja2
        easy_install six
        easy_install python-dateutil
        easy_install pyparsing

1.  Download and install [NumPy][NumPy] using the `.exe` binary installer available on their website.  As of this writing, the latest version is numpy-1.9.1-win32-superpack-python2.7.exe.

1.  Install [Matplotlib][Matplotlib] with the following command.

        pip install matplotlib==1.4.2

1.  Download and install [OpenSSL][].

	* You'll find the required Visual C++ 2008 Redistributable on the same download page.

	* You will need to add `C:\OpenSSL-Win32\bin` to your `PATH` environment variable.

	> [AZURE.NOTE] When installing OpenSSL, use version 1.0.1g or later as these include a fix for the Heartbleed security vulnerability.

1.  Install IPython using the following command.

        pip install ipython==2.4

1.  Open a port in Windows Firewall.  On Windows Server 2012, the firewall will block incoming connections by default.  To open port 9999, follow these steps:

    - Start **Windows Firewall with Advanced Security** from the Start screen.

    - Click **Inbound Rules** in the left panel.

	- Click **New Rule** in the Actions panel.

	- In the New Inbound Rule Wizard, select **Port**.

	- In the next screen, select **TCP** and enter **9999** in **Specific local ports**.

	- Accept defaults, give the rule a name and then click **Finish**.

### Configure the IPython Notebook

Next, we configure the IPython Notebook. The first step is to create a custom
IPython configuration profile to encapsulate the configuration information with the following command.

    ipython profile create nbserver

Next we `cd` to the profile directory to create our SSL certificate and edit
the profiles configuration file.

On Linux use the following command.

    cd ~/.ipython/profile_nbserver/

On Windows use the following command.

    cd \users\azureuser\.ipython\profile_nbserver

Use the following command to create the SSL certificate(Linux and Windows).

    openssl req -x509 -nodes -days 365 -newkey rsa:1024 -keyout mycert.pem -out mycert.pem

Note that since we are creating a self-signed SSL certificate, when connecting
to the notebook your browser will give you a security warning.  For long-term
production use, you will want to use a properly signed certificate associated
with your organization.  Since certificate management is beyond the scope of
this demo, we will stick to a self-signed certificate for now.

In addition to using a certificate, you must also provide a password to protect
your notebook from unauthorized use.  For security reasons IPython uses
encrypted passwords in its configuration file, so you'll need to encrypt your
password first.  IPython provides a utility to do so; at a command prompt run the following command.

    python -c "import IPython;print IPython.lib.passwd()"

This will prompt you for a password and confirmation, and will then print the
password as follows.

    Enter password:
    Verify password:
    sha1:b86e933199ad:a02e9592e59723da722.. (elided the rest for security)

Next, we will edit the profile's configuration file, which is the
`ipython_notebook_config.py` file in the profile directory you are in.  Note that this file may not exist -- just create it.  This
file has a number of fields and by default all are commented out.  You can open
this file with any text editor of your liking, and you should ensure that it
has at least the following content.

    c = get_config()

    # This starts plotting support always with matplotlib
    c.IPKernelApp.pylab = 'inline'

    # You must give the path to the certificate file.

    # If using a Linux VM:
    c.NotebookApp.certfile = u'/home/azureuser/.ipython/profile_nbserver/mycert.pem'

    # And if using a Windows VM:
    c.NotebookApp.certfile = r'C:\Users\azureuser\.ipython\profile_nbserver\mycert.pem'

    # Create your own password as indicated above
    c.NotebookApp.password = u'sha1:b86e933199ad:a02e9592e5 etc... '

    # Network and browser details. We use a fixed port (9999) so it matches
    # our Azure setup, where we've allowed traffic on that port

    c.NotebookApp.ip = '*'
    c.NotebookApp.port = 9999
    c.NotebookApp.open_browser = False

### Run the IPython Notebook

At this point we are ready to start the IPython Notebook. To do this,
navigate to the directory you want to store notebooks in and start
the IPython Notebook server with the following command.

    ipython notebook --profile=nbserver

You should now be able to access your IPython Notebook at the address
`https://[Your Chosen Name Here].cloudapp.net`.

When you first access your notebook, the login page asks for your password.

![Screenshot](./media/virtual-machines-python-ipython-notebook/ipy-notebook-001.png)

And once you log in, you will see the "IPython Notebook Dashboard", which is
the control center for all notebook operations.  From this page you can create
new notebooks and open existing ones.

![Screenshot](./media/virtual-machines-python-ipython-notebook/ipy-notebook-002.png)

If you click the **New Notebook** button, you will see the following opening page.

![Screenshot](./media/virtual-machines-python-ipython-notebook/ipy-notebook-003.png)

The area marked with an `In []:` prompt is the input area, and here you can
type any valid Python code and it will execute when you hit `Shift-Enter` or
click on the "Play" icon (the right-pointing triangle in the toolbar).

Since we have configured the notebook to start with NumPy and Matplotlib support
automatically, you can even produce figures as shown in the next screenshot.

![Screenshot](./media/virtual-machines-python-ipython-notebook/ipy-notebook-004.png)

## A powerful paradigm: live computational documents with rich media

The notebook itself should feel very natural to anyone who has used Python and
a word processor, because it is in some ways a mix of both: you can execute
blocks of Python code, but you can also keep notes and other text by changing
the style of a cell from "Code" to "Markdown" using the drop-down menu in the
toolbar.

![Screenshot](./media/virtual-machines-python-ipython-notebook/ipy-notebook-005.png)


But this is much more than a word processor, as the IPython notebook allows the
mixing of computation and rich media (text, graphics, video and virtually
anything a modern web browser can display). For example, you can mix
explanatory videos with computation for educational purposes.

![Screenshot](./media/virtual-machines-python-ipython-notebook/ipy-notebook-006.png)

or, as shown in the next screenshot, embed external websites that remain live and usable, inside of a notebook
file.

![Screenshot](./media/virtual-machines-python-ipython-notebook/ipy-notebook-007.png)

And with the power of Python's many excellent libraries for scientific and
technical computing, in the following screenshot, a simple calculation can be performed with the same ease
as a complex network analysis, all in one environment.

![Screenshot](./media/virtual-machines-python-ipython-notebook/ipy-notebook-008.png)

This paradigm of mixing the power of the modern web with live computation
offers many possibilities, and is ideally suited for the cloud; the Notebook
can be used:

* As a computational scratchpad to record exploratory work on a problem.

* To share results with colleagues, either in 'live' computational form or in
  hardcopy formats (HTML, PDF).

* To distribute and present live teaching materials that involve computation,
  so students can immediately experiment with the real code, modify it and
  re-execute it interactively.

* To provide "executable papers" that present the results of research in a way
  that can be immediately reproduced, validated and extended by others.

* As a platform for collaborative computing: multiple users can log in to the
  same notebook server to share a live computational session.



If you go to the IPython source code [repository][], you will find an entire
directory with notebook examples which you can download and then experiment with on your own Azure IPython VM.  Simply download the `.ipynb` files from the site and upload them onto the dashboard of your notebook Azure VM (or download them directly into the VM).

## Conclusion

The IPython Notebook provides a powerful interface for accessing interactively
the power of the Python ecosystem on Azure.  It covers a wide range of
usage cases including simple exploration and learning Python, data analysis and
visualization, simulation and parallel computing. The resulting Notebook
documents contain a complete record of the computations that are performed and
can be shared with other IPython users.  The IPython Notebook can be used as a
local application, but it is ideally suited for cloud deployments on Azure

The core features of IPython are also available inside Visual Studio via the
[Python Tools for Visual Studio][] (PTVS). PTVS is a free and open-source plug-in
from Microsoft that turns Visual Studio into an advanced Python development
environment that includes an advanced editor with IntelliSense, debugging,
profiling and parallel computing integration.

## Next steps

For more information, see the [Python Developer Center](/develop/python/).

[Tornado]:      http://www.tornadoweb.org/          "Tornado"
[PyZMQ]:        https://github.com/zeromq/pyzmq     "PyZMQ"
[NumPy]:        http://www.numpy.org/               "NumPy"
[Matplotlib]:   http://matplotlib.sourceforge.net/  "Matplotlib"
[portal-vm-windows]: /manage/windows/tutorials/virtual-machine-from-gallery/
[portal-vm-linux]: /manage/linux/tutorials/virtual-machine-from-gallery/
[repository]: https://github.com/ipython/ipython
[python Tools for visual studio]: http://aka.ms/ptvs
[Python 2.7]: http://www.python.org/download
[OpenSSL]: http://slproweb.com/products/Win32OpenSSL.html
