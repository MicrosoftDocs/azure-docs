<properties
	pageTitle="Install the Azure Command-Line Interface | Microsoft Azure"
	description="Install the Azure Command-Line Interface (CLI) for Mac, Linux, and Windows to start using Azure services"
	editor=""
	manager="timlt"
	documentationCenter=""
	authors="dlepow"
	services="virtual-machines-linux,virtual-network,storage,azure-resource-manager"
	tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="multiple"
	ms.workload="multiple"
	ms.tgt_pltfrm="command-line-interface"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/17/2016"
	ms.author="danlep"/>
    
# Install the Azure CLI

> [AZURE.SELECTOR]
- [PowerShell](powershell-install-configure.md)
- [Azure CLI](xplat-cli-install.md)

Quickly install the Azure Command-Line Interface (Azure CLI) to use a set of open-source shell-based commands for creating and managing resources in Microsoft Azure. You have several choices to install the latest version: 

* Install from an npm package (requires Node.js and npm)
* Use one of the provided installer packages for different operating systems
* Install the Azure CLI as a container in a Docker host
    
For more options and background, see the project repository on [GitHub](https://github.com/azure/azure-xplat-cli).

Once the Azure CLI is installed, [connect it with your Azure subscription](xplat-cli-connect.md) and run the **azure** commands from your command-line interface (Bash, Terminal, Command prompt, and so on) to work with your Azure resources.



## Option 1. Install an npm package

To install the CLI from an npm package, you need the latest Node.js and npm installed on your system. Then, run the following command to install the Azure CLI package. (On Linux distributions, you might need to use **sudo** to successfully run the __npm__ command.)

	npm install azure-cli -g

> [AZURE.NOTE]If you need to install or update Node.js and npm for your operating system, see the documentation at [Nodejs.org](https://nodejs.org/en/download/package-manager/). We recommend that you install the most recent Node.js LTS version (4.x). If you use an older version, you might get installation errors. More information about npm is at [npmjs.com](https://www.npmjs.com/).

## Option 2. Use an installer

The following CLI installer packages are also available for download:


* [Mac OS X installer][mac-installer]

* [Windows installer][windows-installer]

* [Linux tar file][linux-installer] (requires Node.js and npm) - install by running `sudo npm install -g <path to downloaded tar file>`


## Option 3. Use a Docker container

If you have set up a Docker host, you can run the Azure CLI in a Docker container. Run:

```
docker run -it microsoft/azure-cli
```

More information about Docker is at [docker.com](https://docs.docker.com/engine/understanding-docker/).

## Run Azure CLI commands
After the Azure CLI is installed, run the **azure** command from your command-line user interface (Bash, Terminal, Command prompt, and so on). For example, to run the help command, type the following:

```
azure help
```
> [AZURE.NOTE]On some Linux distributions, you may receive an error similar to `/usr/bin/env: ‘node’: No such file or directory`. This error comes from recent installations of nodejs being installed at /usr/bin/nodejs. To fix it, create a symbolic link to /usr/bin/node by running this command:

```
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

To see the version of the Azure CLI you installed, type the following:

```
azure --version
```

Now you are ready! To access all the CLI commands to work with your own resources, [connect to your Azure subscription from the Azure CLI](xplat-cli-connect.md).

>[AZURE.NOTE] When you first use Azure CLI, you see a message asking if you want to allow Microsoft to collect information about how you use the CLI. Participation is voluntary. If you choose to participate, you can stop at any time by running `azure telemetry --disable`. To enable participation at any time, run `azure telemetry --enable`.


## Update the CLI

Microsoft frequently releases updated versions of the Azure CLI. Reinstall the CLI using the installer for your operating system, or run the latest Docker container. Or, if you have the latest Node.js and npm installed, update by typing the following (on Linux distributions you might need to use **sudo**).

```
npm update -g azure-cli
```

## Enable tab completion

Tab completion of CLI commands is supported for Mac and Linux.

To enable it in zsh, run:

```
echo '. <(azure --completion)' >> .zshrc
```

To enable it in bash, run:

```
azure --completion >> ~/azure.completion.sh
echo 'source ~/azure.completion.sh' >> ~/.bash_profile
```


## Next steps 

* [Connect from the CLI to your Azure subscription](xplat-cli-connect.md) to create and manage Azure resources.

* To learn more about the Azure CLI, download source code, report problems, or contribute to the project, visit the [GitHub repository for the Azure CLI](https://github.com/azure/azure-xplat-cli).

* If you have questions about using the Azure CLI, or Azure, visit the [Azure Forums](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurescripting).

* For Linux systems, you can also install the Azure CLI by building it from the [source](http://aka.ms/linux-azure-cli). For more information on building from source, see the INSTALL file included in the source archive.

[mac-installer]: http://aka.ms/mac-azure-cli
[windows-installer]: http://aka.ms/webpi-azure-cli
[linux-installer]: http://aka.ms/linux-azure-cli
[cliasm]: virtual-machines-command-line-tools.md
[cliarm]: ./virtual-machines/azure-cli-arm-commands.md
