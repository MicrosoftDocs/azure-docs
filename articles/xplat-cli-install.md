<properties
	pageTitle="Install the Azure Command-Line Interface | Microsoft Azure"
	description="Install the Azure CLI for Mac, Linux, and Windows to start using Azure services"
	editor=""
	manager="timlt"
	documentationCenter=""
	authors="dlepow"
	services=""
	tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="multiple"
	ms.workload="multiple"
	ms.tgt_pltfrm="command-line-interface"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/18/2015"
	ms.author="danlep"/>

# Install the Azure CLI

This article describes how to install the Azure Command-Line Interface (Azure CLI). The Azure CLI provides a set of open-source shell-based commands for creating and managing resources in Microsoft Azure.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]


The Azure CLI is written in JavaScript, and requires [Node.js](https://nodejs.org). It is implemented using the [Azure SDK for Node](https://github.com/azure/azure-sdk-for-node), and released under an Apache 2.0 license. The project repository is located at [https://github.com/azure/azure-xplat-cli](https://github.com/azure/azure-xplat-cli).

> [AZURE.NOTE] If you've already installed the Azure CLI, connect it with your Azure resources. For more, see [How to connect to your Azure Subscription](xplat-cli-connect.md#configure).

<a id="install"></a>
## How to install the Azure CLI

There are a few ways to install the Azure CLI.

1. Use an installer
2. Install Node.js and npm and then use the **npm install** command
3. Run Azure CLI as a Docker container

Once the Azure CLI has been installed, you will be able to use the **azure** command from your command-line interface (Bash, Terminal, Command prompt, and so on) to access the Azure CLI commands.

## Use an installer

The following installer packages are available:

* [Windows installer][windows-installer]

* [OS X installer](http://go.microsoft.com/fwlink/?LinkId=252249)

* [Linux installer][linux-installer]


## Install and use Node.js and npm

If Node.js is already installed on your system, use the following command to install the Azure CLI:

	npm install azure-cli -g

> [AZURE.NOTE] On Linux distributions, you may need to use `sudo` to successfully run the __npm__ command.

### Install node.js and npm on Linux distributions that use [dpkg](http://en.wikipedia.org/wiki/Dpkg) package management
The most common of these distributions use either the [advanced packaging tool (apt)](http://en.wikipedia.org/wiki/Advanced_Packaging_Tool) or other tools based on the `.deb` package format. Some examples are Ubuntu and Debian.

Most of the more recent of these distributions require installing **nodejs-legacy** in order to get a properly configured **npm** tool to install the Azure CLI. The following code shows the commands that install **npm** properly on Ubuntu 14.04.

	sudo apt-get install nodejs-legacy
	sudo apt-get install npm
	sudo npm install -g azure-cli

Some of the older distributions, such as Ubuntu 12.04, require installing the current binary distribution of node.js. The following code shows how to do that by installing and using **curl**.

>[AZURE.NOTE] The commands here are taken from the Joyent installation instructions found [here](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager). However, when using **sudo** as a pipe target, you should always check the scripts that you are installing and validate that they do exactly what you expect before running them through **sudo**. With great power comes great responsibility.

	sudo apt-get install curl
	curl -sL https://deb.nodesource.com/setup | sudo bash -
	sudo apt-get install -y nodejs
	sudo npm install -g azure-cli

### Install node.js and npm on Linux distributions that use [rpm](http://en.wikipedia.org/wiki/RPM_Package_Manager) package management

Installing node.js on RPM-based distributions requires enabling the EPEL repository. The following code shows the best practices for installation on CentOS 7. (Note that in the first line below, the '-' (hyphen) is important!)

	su -
	yum update [enter]
	yum upgrade –y [enter]
	yum install epel-release [enter]
	yum install nodejs [enter]
	yum install npm [enter]
	npm install -g azure-cli  [enter]

### Install node.js and npm on Windows and Mac OS X

You can install node.js and npm on Windows and OS X using the installers from [Nodejs.org](https://nodejs.org/download/). You might need to restart the computer to complete the installation. Check if node and npm were installed properly by opening a Command window and typing

	npm -v

If it shows the version of the npm installed, you can go ahead and install Azure CLI with

	npm install -g azure-cli

At the end of the installation, you should see something similar to the following:

	azure-cli@0.8.0 ..\node_modules\azure-cli
	|-- easy-table@0.0.1
	|-- eyes@0.1.8
	|-- xmlbuilder@0.4.2
	|-- colors@0.6.1
	|-- node-uuid@1.2.0
	|-- async@0.2.7
	|-- underscore@1.4.4
	|-- tunnel@0.0.2
	|-- omelette@0.1.0
	|-- github@0.1.6
	|-- commander@1.0.4 (keypress@0.1.0)
	|-- xml2js@0.1.14 (sax@0.5.4)
	|-- streamline@0.4.5
	|-- winston@0.6.2 (cycle@1.0.2, stack-trace@0.0.7, async@0.1.22, pkginfo@0.2.3, request@2.9.203)
	|-- kuduscript@0.1.2 (commander@1.1.1, streamline@0.4.11)
	|-- azure@0.7.13 (dateformat@1.0.2-1.2.3, envconf@0.0.4, mpns@2.0.1, mime@1.2.10, validator@1.4.0, xml2js@0.2.8, wns@0.5.3, request@2.25.0)

>[AZURE.NOTE] For Linux systems, you can also install the Azure CLI by building it from the [source](http://go.microsoft.com/fwlink/?linkid=253472). For more information on building from source, see the INSTALL file included in the archive.

## Using a Docker container

In a Docker host, run:
```
	docker run -it microsoft/azure-cli
```

## Executing Azure CLI commands

Once the Azure CLI has been installed, you will be able to use the **azure** command from your command-line user interface (Bash, Terminal, Command prompt, and so on) to access the Azure CLI commands. For example, to execute the help command in Windows launch a Command window and type the following:

```
	c:\> azure help
```

Now you are ready! Next you can [connect to your Azure subscription from the Azure CLI](xplat-cli-connect.md) and start using the **azure** commands.


<a id="additional-resources"></a>
## Additional resources

* [Using the Azure CLI with the Resource Management commands][cliarm]

* [Using the Azure CLI with the Service Management (classic) commands][cliasm]

* To learn more about the Azure CLI, download source code, report problems, or contribute to the project, visit the [GitHub repository for the Azure CLI](https://github.com/azure/azure-xplat-cli).

* If you encounter problems using the Azure CLI, or Azure, visit the [Azure Forums](http://social.msdn.microsoft.com/Forums/windowsazure/home).



[mac-installer]: http://go.microsoft.com/fwlink/?LinkId=252249
[windows-installer]: http://go.microsoft.com/?linkid=9828653&clcid=0x409
[linux-installer]: http://go.microsoft.com/fwlink/?linkid=253472
[cliasm]: virtual-machines/virtual-machines-command-line-tools.md
[cliarm]: virtual-machines/xplat-cli-azure-resource-manager.md

