There are a couple of different ways to install the modules: the PowerShell Gallery and the Web Platform Installer. The end result is pretty much the same, although the way you select to do your install will determine where the modules are installed by default on your computer. 

When you install from the PowerShell Gallery, your files will be located by default in *%ProgramFiles%\WindowsPowerShell\Modules*. When you install from the Web Platform Installer, your files will be located by default in *%ProgramFiles%\Microsoft SDKs\Azure\PowerShell\*. Because of this, you'll want to stick with one or the other in order to avoid errors when you update your cmdlets in the future. The Web Platform Installer will receive updated cmdlets monthly. The Gallery receives updated versions of the cmdlets at the time they are released. For that reason, some people prefer to use the Gallery. 

For additional information about installing Azure PowerShell, see [How to install and configure Azure PowerShell](../articles/powershell-install-configure.md). 

**To install modules from the PowerShell Gallery**

1. To install the Resource Manager module directly from the Gallery, open Windows PowerShell as administrator and type the following:

		Install-Module AzureRM
		Install-AzureRM

2. Once you have installed the modules, you'll need to import them in order to use them:

		Import-AzureRM

**To install modules using the Web Platform Installer**

- You can install modules using the [Web Platform Installer](http://aka.ms/webpi-azps). When you click the link, it will launch the installer.

- If you get errors when using the Web Platform Installer, it may be because you have already installed a previous version of the cmdlets using the Gallery. See this [Blog Post](https://azure.microsoft.com/blog/azps-1-0/), which can help you remove older versions of the modules and get you back up and running. Typically errors result when you have used the Web Platform Installer and are switching to the Gallery, or the other way around. Removing the modules that were installed earlier clears this issue, and you can then install from the new location.




