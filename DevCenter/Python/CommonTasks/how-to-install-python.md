# Installing Python

Python is pretty easy to setup on Windows and comes pre-installed on Mac and Linux.  This guide walks you through installation and getting your machine ready for use with Azure.


* Which Python & which version?
* Installation on Windows
* Installation on Mac and Linux

### Which Python and which version?

There are several flavors of Python - examples include:

* CPython - the standard and most commonly used Python interpreter
* IronPython - Python interpreter that runs on .Net/CLR
* Jython - Python interpreter that runs on the JVM

For the purposes of this release, only CPython is tested and supported.  We also recommend at least version 2.7.  IronPython support will be added in the near future as well.

### Where to get Python?

There are several ways to get CPython:

* Directly from www.python.org
* From a reputable distro such as www.enthought.com or www.ActivteState.com
* Build from source!

Unless you have a specific need, we recommend the first two options, as described below.

## Installation on Windows

For Windows you can use the provided WebPI installer to streamline the installation:

![how-to-install-python-webpi-1.png][] 

The WebPI installer provides everything you need to Python Azure apps as well specific support for Django apps:



![how-to-install-Python-webpi-2.png][]


Once finished, you should see this screen confirming your install choices:

![how-to-install-python-webpi-3.png][]


After installation is complete, type python at the prompt to make sure things went smoothly.  Depending on how you installed, you may need to set your "path" variable to find (the right version of) Python:

![how-to-install-python-win-run.png][]

While this release is focused primarily on Web Apps with Django, feel free to browse the [Python Package Index (PyPI)][] for a rich selection of other software.  If you chose to install a Distro, you'll already have most of the interesting bits for a variety of scenarios from web development to Technical Computing.

To see what Python packages are installed, enter the following:

![how-to-install-python-win-site.png][]

This will give a list what's been installed on your system.

### Python Tools for Visual Studio

Python Tools for Visual Studio is a free/OSS plugin from Microsoft which turn VS into a full-fledged Python IDE:

![how-to-install-python-ptvs.png][]

Using Python Tools for Visual Studio is optional, but is recommended as it gives you Python and Django Project/Solution support, debugging, profiling, Template editing and Intellisense, deployment to cloud, etc.  This add-in  works with your existing VS2010 install.  If you don't have VS2010, WebPI will install the free Integrated Shell + PTVS which essentially give you a "VS Python Express" IDE.  For more information, see [Python Tools for Visual Studio on CodePlex (free/OSS)][].  Also note that while PTVS is small, the Integrated Shell will increases your download times.


## Installation on Linux and MacOS

Python is most likely already installed on your Dev machine.  You can check by entering:

![how-to-install-python-linux-run.png][]

Here we see that Susue has 2.7.2 installed which is fine for running the Azure tutorials and Django samples. If you need to upgrade, follow your OS's recommended package upgrade instructions.  Note however, that in general it's better to leave the system Python alone (others may depend on that version) and install the newer version via [Virutalenv][].

There are two main scenarios supported for this Azure release:

1. Authoring Cloud apps by using the Python Azure Client Libraries
2. Running your app in a Linux VM

The Cloud App scenario enables you to author rich web apps that take advantage of the Azure PaaS capabilities such as blob storage, queues, etc. via Pythonic wrappers for the Azure REST API's.  These work identically on Windows, Mac and Linux.  See the Tutorials and How To Guides for examples.

For the VM scenario, you simply start a Linux VM of your choice (Ubuntu, CentOS, Suse) and run/manage what you like.

To install the SDK's for Mac/Linux enter:

	// TODO //

Verify the installation:

	// TODO //

To find out more about using VM's, please see: 

	// TODO //

 
### Additional Software and Resources:

[Enthought Python Distribution][]

[ActiveState Python Distribution][]

[SciPy - A suite of Scientific Python libraries][]

[NumPy - A numerics library for Python][]

[Django Project - A mature web framework/CMS][]

[IPython - an advanced REPL/Notebook for Python][]

[Python Tools for Visual Studio on CodePlex (free/OSS)][]


[Enthought Python Distribution]: http://www.enthought.com 

[ActiveState Python Distribution]: http://www.activestate.com

[SciPy - A suite of Scientific Python libraries]: http://www.scipy.org

[NumPy - A numerics library for Python]: http://www.numpy.org

[Django Project - A mature web framework/CMS]: http://www.djangoproject.com 

[IPython - an advanced REPL/Notebook for Python]: http://ipython.org

[Python Tools for Visual Studio on CodePlex (free/OSS)]: http://pytools.codeplex.com 

[Python Package Index (PyPI)]: http://pypi.python.org/pypi

[Virutalenv]: http://pypi.python.org/pypi/virtualenv 



[how-to-install-python-webpi-1.png]: ../Media/how-to-install-python-webpi-1.png 
[how-to-install-Python-webpi-2.png]: ../Media/how-to-install-Python-webpi-2.png
[how-to-install-Python-webpi-3.png]: ../Media/how-to-install-Python-webpi-3.png
[how-to-install-Python-ptvs.png]: ../Media/how-to-install-Python-ptvs.png
[how-to-install-python-win-site.png]: ../Media/how-to-install-python-win-site.png 
[how-to-install-python-win-run.png]: ../Media/how-to-install-python-win-run.png 
[how-to-install-python-linux-run.png]: ../Media/how-to-install-python-linux-run.png