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
	ms.date="10/04/2016"
	ms.author="danlep"/>
    
# Install the Azure CLI

> [AZURE.SELECTOR]
- [PowerShell](powershell-install-configure.md)
- [Azure CLI](xplat-cli-install.md)

Quickly install the Azure Command-Line Interface (Azure CLI) to use a set of open-source shell-based commands for creating and managing resources in Microsoft Azure. You have several options to install these cross-platform tools on your computer: 

* **npm package** - Run npm (the package manager for JavaScript) to install the latest Azure CLI package on your Linux distribution or OS. Requires node.js and npm on your computer.
* **Installer** - Download an installer for easy installation on Mac or Windows.
* **Docker container** - Start using the latest CLI in a ready-to-run Docker container. Requires Docker host on your computer.
    
For more options and background, see the project repository on [GitHub](https://github.com/azure/azure-xplat-cli). 

Once the Azure CLI is installed, [connect it with your Azure subscription](xplat-cli-connect.md) and run the **azure** commands from your command-line interface (Bash, Terminal, Command prompt, and so on) to work with your Azure resources.



## Option 1: Install an npm package

To install the CLI from an npm package, make sure you have downloaded and installed the [latest Node.js and npm](https://nodejs.org/en/download/package-manager/). Then, run **npm install** to install the azure-cli package: 

    npm install -g azure-cli

On Linux distributions, you might need to use **sudo** to successfully run the __npm__ command, as follows:

	sudo npm install -g azure-cli

> [AZURE.NOTE]If you need to install or update Node.js and npm on your Linux distribution or OS, we recommend that you install the most recent Node.js LTS version (4.x). If you use an older version, you might get installation errors. 

If you prefer, download the latest Linux [tar file][linux-installer] for the npm package locally. Then, install the downloaded npm package as follows (on Linux distributions you might need to use **sudo**):

    npm install -g <path to downloaded tar file>

## Option 2: Use an installer

If you use a Mac or Windows computer, the following CLI installers are available for download:

* [Mac OS X installer][mac-installer]

* [Windows MSI][windows-installer] 

>[AZURE.TIP]On Windows, you can also download the [Web Platform Installer](https://go.microsoft.com/?linkid=9828653) to install the CLI. This installer gives you the option to install additional Azure SDK and command-line tools after installing the CLI. 


## Option 3: Use a Docker container

If you have set up your computer as a [Docker](https://docs.docker.com/engine/understanding-docker/) host, you can run the latest Azure CLI in a Docker container. Run the following command (on Linux distributions you might need to use **sudo**):

```
docker run -it microsoft/azure-cli
```


## Run Azure CLI commands
After the Azure CLI is installed, run the **azure** command from your command-line user interface (Bash, Terminal, Command prompt, and so on). For example, to run the help command, type the following:

```
azure help
```
> [AZURE.NOTE]On some Linux distributions, you may receive an error similar to `/usr/bin/env: ‘node’: No such file or directory`. This error comes from recent installations of Node.js being installed at /usr/bin/nodejs. To fix it, create a symbolic link to /usr/bin/node by running this command:

```
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

To see the version of the Azure CLI you installed, type the following:

```
azure --version
```

Now you are ready! To access all the CLI commands to work with your own resources, [connect to your Azure subscription from the Azure CLI](xplat-cli-connect.md).

>[AZURE.NOTE] When you first use Azure CLI, you see a message asking if you want to allow Microsoft to collect usage information. Participation is voluntary. If you choose to participate, you can stop at any time by running `azure telemetry --disable`. To enable participation at any time, run `azure telemetry --enable`.


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

* If you want, you can also try the Python-based [Azure CLI 2.0 Preview](https://github.com/azure/azure-cli).

[mac-installer]: http://aka.ms/mac-azure-cli
[windows-installer]: http://aka.ms/webpi-azure-cli
[linux-installer]: http://aka.ms/linux-azure-cli
[cliasm]: virtual-machines-command-line-tools.md
[cliarm]: ./virtual-machines/azure-cli-arm-commands.md
