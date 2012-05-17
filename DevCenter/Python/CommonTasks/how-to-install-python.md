# Installing Python

Python is pretty easy to setup on Windows and comes pre-installed on Mac and Linux.  This guide walks you through installation and getting your machine ready for use with Azure.


* Which Python & which version? (#which)
* Installation on Windows] (#win)
* Installation on Mac and Linux (#mac)

### Which Python and which version?

There are several flavors of Python - examples include:

* CPython - the standard and most commonly used Python interpreter
* IronPython - Python interpreter that runs on .Net/CLR
* Jython - Python interpreter that runs on the JVM

For the purposes of this release, only CPython is tested and supported.  We also recommend at least version 2.7.

### Where to get Python?

There are several ways to get CPython:

* Directly from www.python.org
* From a reputable distro such as www.enthought.com or www.ActivteState.com
* Build from source!

Unless you have a specific need, we recommend the first two options, as described below.

## Installation on Windows

For Windows you can use the provided WebPI installer to streamline the installation.  This will grab the Azure/Python SDK's, latest recommended versions of CPython, Django, various required dependencies and Python Tools for Visual Studio (optional):

     // TODO: screenshot //

Once installation is finished, you have everything you need to try the Tutorials and How To Guides.  Using Python Tools for Visual Studio is optional, but is recommended as it gives you Project/Solution support, debugging, profiling, Template editing and Intellisense.  For more information, see [Python Tools for Visual Studio on CodePlex (free/OSS)][].

After installation is complete, type python at the prompt to make sure you're set:


	// TODO: pic of install //

While this release is focused primarily on Web Apps with Django, feel free to browse the Python Package Index //TODO link// for a rich selection of other software.  If you chose to install a Distro, you'll already have most of the interesting bits for a variety of scenarios from web development to Technical Computing.

To see what Python packages are installed, enter the following:

	// TODO find site pkgs //



## Installation on Linux and MacOS

Python is most likely already installed on your Dev machine.  You can check by:

	// which python //

you should run it to make sure you have at least version 2.7:

	// pic //

To see what Python packages are installed, enter the following:

	// TODO find site pkgs //

If you need to upgrade, follow your machine recommended package upgrade instructions, for example:

	// blah blah //

There are two main scenarios supported for this Azure release:

1. Authoring Cloud apps by using the Python Azure Client Libraries
2. Running your app in a Linux VM

The Cloud App scenario enables you to author rich web apps that take advantage of the Azure PaaS capabilities such as blob storage, queues, etc. via Pythonic wrappers for the Azure REST API's.  These work identically on Windows, Mac and Linux.

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

[Django Project - A mature web framework/CMD][]

[IPython - an advanced REPL/Notebook for Python][]

[Python Tools for Visual Studio on CodePlex (free/OSS)][]


[Enthought Python Distribution]: http://www.enthought.com 

[ActiveState Python Distribution]: http://www.activestate.com

[SciPy - A suite of Scientific Python libraries]: http://www.scipy.org

[NumPy - A numerics library for Python]: http://www.numpy.org

[Django Project - A mature web framework/CMS]: http://www.djangoproject.com 

[IPython - an advanced REPL/Notebook for Python]: http://ipython.org

[Python Tools for Visual Studio on CodePlex (free/OSS)]: http://pytools.codeplex.com 

