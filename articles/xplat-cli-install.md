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
	ms.date="03/09/2016"
	ms.author="danlep"/>

# Install the Azure CLI

Quickly install the Azure Command-Line Interface (Azure CLI) to use a set of open-source shell-based commands for creating and managing resources in Microsoft Azure. You have several choices: use one of the provided installer packages to install the Azure CLI on your operating system, install the CLI using Node.js and **npm**, or install the Azure CLI as a container in a Docker host. For more options and background, see the project repository on [GitHub](https://github.com/azure/azure-xplat-cli).


Once the Azure CLI has been installed, you will be able to [connect it with your Azure subscription](xplat-cli-connect.md) and run the **azure** commands from your command-line interface (Bash, Terminal, Command prompt, and so on) to work with your Azure resources.




## Use an installer

The following installer packages are available:

* [Windows installer][windows-installer]

* [OS X installer](http://go.microsoft.com/fwlink/?LinkId=252249)

* [Linux installer][linux-installer]


## Install and use Node.js and npm

Alternatively, if Node.js is already installed on your system, use the following command to install the Azure CLI:

	npm install azure-cli -g

> [AZURE.NOTE] On Linux distributions, you may need to use `sudo` to successfully run the __npm__ command.

### Install Node.js and npm on Linux distributions that use [dpkg](http://en.wikipedia.org/wiki/Dpkg) package management

The most common of these distributions use either the [advanced packaging tool (apt)](http://en.wikipedia.org/wiki/Advanced_Packaging_Tool) or other tools based on the `.deb` package format. Some examples are Ubuntu and Debian.

Most of the more recent of these distributions require installing **nodejs-legacy** in order to get a properly configured **npm** tool to install the Azure CLI. The following code shows the commands that install **npm** properly on Ubuntu 14.04.

	sudo apt-get install nodejs-legacy
	sudo apt-get install npm
	sudo npm install -g azure-cli

Some of the older distributions, such as Ubuntu 12.04, require installing the current binary distribution of Node.js. The following code shows how to do that by installing and using **curl**.

>[AZURE.NOTE] The commands are taken from the installation instructions found [here](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager). However, when using **sudo** as a pipe target, you should always check the scripts that you are installing and validate that they do exactly what you expect before running them through **sudo**. With great power comes great responsibility.

	sudo apt-get install curl
	curl -sL https://deb.nodesource.com/setup | sudo bash -
	sudo apt-get install -y nodejs
	sudo npm install -g azure-cli

### Install Node.js and npm on Linux distributions that use [rpm](http://en.wikipedia.org/wiki/RPM_Package_Manager) package management

Installing Node.js on RPM-based distributions requires enabling the EPEL repository. The following code shows the best practices for installation on CentOS 7. (Note that in the first line below, the '-' (hyphen) is important!)

	su -
	yum update [enter]
	yum upgrade –y [enter]
	yum install epel-release [enter]
	yum install nodejs [enter]
	yum install npm [enter]
	npm install -g azure-cli  [enter]

### Install Node.js and npm on Windows and Mac OS X

You can install Node.js and npm on Windows and OS X using the installers from [Nodejs.org](https://nodejs.org/en/download/). You might need to restart the computer to complete the installation. Check if node and npm were installed properly by opening a Command or Terminal window and typing

	npm -v

If it shows the version of the npm installed, you can go ahead and install the Azure CLI with

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

## Use a Docker container

In a Docker host, run:

```
docker run -it microsoft/azure-cli
```

## Run Azure CLI commands
Once the Azure CLI has been installed, you will be able to run the **azure** command from your command-line user interface (Bash, Terminal, Command prompt, and so on). For example, to run the help command, type the following:

```
azure help
```

To see the version of the Azure CLI you installed, type the following:

```
azure --version
```

Now you are ready! For access to all of the CLI commands to work with your own resources, [connect to your Azure subscription from the Azure CLI](xplat-cli-connect.md).

## Update the CLI

Microsoft frequently releases updated versions of the Azure CLI. Reinstall the CLI using the installer for your operating system or, if Node.js and npm are installed, update by typing the following (on Linux distributions you might need to use **sudo**).

```
npm update -g azure-cli
```

## Additional resources

* [Azure CLI commands in Azure Resource Manager (arm) mode][cliarm]

* [Azure CLI commands with Azure Service Management (asm) mode][cliasm]

* To learn more about the Azure CLI, download source code, report problems, or contribute to the project, visit the [GitHub repository for the Azure CLI](https://github.com/azure/azure-xplat-cli).

* If you have questions about using the Azure CLI, or Azure, visit the [Azure Forums](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurescripting).



[mac-installer]: http://go.microsoft.com/fwlink/?LinkId=252249
[windows-installer]: http://go.microsoft.com/?linkid=9828653&clcid=0x409
[linux-installer]: http://go.microsoft.com/fwlink/?linkid=253472
[cliasm]: virtual-machines-command-line-tools.md
[cliarm]: virtual-machines/azure-cli-arm-commands.md
