<properties
	pageTitle="The Azure CLI for Mac, Linux, and Windows"
	description="Install and configure the Azure CLI for Mac, Linux, and Windows to manage Azure Services"
	editor="tysonn"
	manager="timlt"
	documentationCenter=""
	authors="squillace"
	services=""/>

<tags
	ms.service="multiple"
	ms.workload="multiple"
	ms.tgt_pltfrm="command-line-interface"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/10/2015"
	ms.author="rasquill"/>

# Install and Configure the Azure CLI

> [AZURE.SELECTOR]
- [PowerShell](powershell-install-configure.md)
- [Azure CLI](xplat-cli.md)

The Azure CLI provides a set of open source, cross-platform commands for working with the Azure Platform. The Azure CLI provides much of the same functionality found in the Azure Management Portal, such as the ability to manage websites, virtual machines, mobile services, SQL Database and other services provided by the Azure platform.

The Azure CLI is written in JavaScript, and requires Node.js. It is implemented using the Azure SDK for Node.js, and released under an Apache 2.0 license. The project repository is located at [https://github.com/azure/azure-xplat-cli](https://github.com/azure/azure-xplat-cli).

This document describes how to install and configure the Azure CLI for Mac, Linux, and Windows, as well as how to use it to perform basic tasks with the Azure platform.

<a id="install"></a>
## How to install the Azure CLI

To learn the installation steps for the Azure CLI, read the [Install the Azure CLI](xplat-cli-install.md) page.


<a id="configure"></a>
## How to connect to your Azure subscription

While some commands provided by the Azure CLI will work without an Azure subscription, most commands require a subscription. To learn how to configure the Azure CLI to work with your subscription, visit [Connect to an Azure subscription from the Azure CLI](xplat-cli-connect.md).


<a id="use"></a>
## How to use the Azure CLI

The Azure CLI is accessed using the `azure` command. To see a list of commands available, use the `azure` command with no parameters. You should see help information similar to the following:

	info:             _    _____   _ ___ ___
	info:            /_\  |_  / | | | _ \ __|
	info:      _ ___/ _ \__/ /| |_| |   / _|___ _ _
	info:    (___  /_/ \_\/___|\___/|_|_\___| _____)
	info:       (_______ _ _)         _ ______ _)_ _
	info:              (______________ _ )   (___ _ _)
	info:
	info:    Microsoft Azure: Microsoft's Cloud Platform
	info:
	info:    Tool version 0.8.10
	help:
	help:    Display help for a given command
	help:      help [options] [command]
	help:
	help:    Opens the portal in a browser
	help:      portal [options]
	help:
	help:    Commands:
	help:      account        Commands to manage your account information and publish settings
	help:      config         Commands to manage your local settings
	help:      hdinsight      Commands to manage your HDInsight accounts
	help:      mobile         Commands to manage your Mobile Services
	help:      network        Commands to manage your Networks
	help:      sb             Commands to manage your Service Bus configuration
	help:      service        Commands to manage your Cloud Services
	help:      site           Commands to manage your Web Sites
	help:      sql            Commands to manage your SQL Server accounts
	help:      storage        Commands to manage your Storage objects
	help:      vm             Commands to manage your Virtual Machines
	help:
	help:    Options:
	help:      -h, --help     output usage information
	help:      -v, --version  output the application version

The top level commands listed above contain commands for working with a specific area of Azure. For example, the `azure account` command contains commands that relate to your Azure subscription, such as the `download` and `import` settings used previously. See [Using the Azure CLI for Mac, Linux, and Windows] for details on the available commands and options.

Most commands are formatted as `azure <command> <operation> [parameters]` and perform an operation on a service or object such as your account configuration. Other commands provide sub-commands and follow the format `azure <command> <subcommand> <operation> [parameters]`. The following are example commands that work with your account configuration:

* To view subscriptions that you have imported, use:

		azure account list

* If you have imported subscriptions, use the following to set one as default:

		azure account set <subscription>

The `--help` or `-h` parameter can be used to view help for specific commands. Alternately, the `azure help [command] [options]` format can also be used to return the same information. For example, the following commands all return the same information:

	azure account set --help

	azure account set -h

	azure help account set

When in doubt about the parameters needed by a command, refer to help using `--help`, `-h` or `azure help [command]`.

### Setting the configuration mode

The Azure CLI allows you to perform management operations on individual _resources_, which are user-managed entities such as a database server, database, or website. This is the default mode of operation for the Azure CLI, and is referred to as **Azure Service Management**. However, when you have a complex solution that consists of multiple resources, it is useful to be able to manage the entire solution as a single unit.

To support managing a group of resources as a single logical unit, or _resource group_, we have introduced a preview of the **Resource Manager** as a new way of managing Azure resources.

>[AZURE.NOTE] The Resource Manager is currently in preview, and does not provide the same  level of management capabilities as Azure Service Management.

To support the new Resource Manager, the Azure CLI allows you to switch between these management 'modes' using the `azure config mode` command.

The Azure CLI defaults to Azure Service Management mode. To switch to Resource Manager mode, use the following to enable command:

	azure config mode arm

To change back to Azure service management mode, use the following command:

	azure config mode asm

>[AZURE.NOTE] The Resource Manager mode and Azure Service Management mode are mutually exclusive. That is, resources created in one mode cannot be managed from the other mode.

For more information on working with the Resource Manager using the Azure CLI, see [Using the Azure CLI with the Resource Manager][cliarm].

### Working with services in Azure service management mode

The Azure CLI allows you to easily manage Azure services. In this example, you will learn how to use the Azure CLI to manage an Azure Website.

1. Use the following command to create a new Azure Website. Replace **mywebsite** with a unique name.

		azure site create mywebsite

	You will be prompted to specify the region that the website will be created in. Select a region that is geographically near you. After this command completes, the website will be available at http://mywebsite.azurewebsites.net (replace **mywebsite** with the name you specified.)

	> [AZURE.NOTE] If you use Git for project source control, you can specify the `--git` parameter to create a Git repository on Azure for this website. This will also initialize a Git repository in the directory from which the command was ran if one does not already exist. It will also create a Git remote named __azure__, which can be used to push deployments to the Azure Website using the `git push azure master` command.

	> [AZURE.NOTE] If you receive an error that 'site' is not an azure command, the Azure CLI is most likely in resource group mode. To change back to resource mode, use the `azure config mode asm` command.

2. Use the following command to list websites for your subscription:

		azure site list

	The list should contain the site created in the previous step.

2. Use the following command to stop the website. Replace **mywebsite** with the site name.

		azure site stop mywebsite

	After the command completes, you can refresh the browser to verify that the site has been stopped.

3. Use the following command to start the website. Replace **mywebsite** with the site name.

		azure site start mywebsite

	After the command completes, you can refresh the browser to verify that the site has been started.

4. Use the following command to delete the website. Replace **mywebsite** with the site name.

		azure site delete mywebsite

	After the command completes, use the `azure site list` command to verify that the website no longer exists.

<a id="script"></a>
## How to script the Azure CLI for Mac, Linux, and Windows

While you can use the Azure CLI to manually issue commands, you can also create complex automation workflows by leveraging the capabilities of your command-line interpreter and other command-line utilities available on your system. For example, the following command will stop all running Azure Websites:

	azure site list | grep 'Running' | awk '{system("azure site stop "$2)}'

This example pipes a list of websites to the `grep` command, which inspects each line for the string 'Running'. Any lines that match are then piped to the `awk` command, which calls `azure site stop` and uses the second column passed to it (the running site name) as the site name to stop.

While this demonstrates how you can chain commands together, you can also create more elaborate scripts using the scripting features provided by your command-line interpreter. Different command-line interpreters have different scripting features and syntax. Bash is probably the most widely used command-line interpreter for UNIX-based systems, including Linux and OS X.

For information on scripting with Bash, see the [Advanced Bash-Scripting Guide][advanced-bash].

For more general information on scripting OS X or Linux-based systems, see [Shell script][script].

For information on scripting Windows-based systems using batch files, see [Command-line reference A-Z][batch].

### Understanding results

When creating scripts, you often need to capture the output of a command and either pass this to another command or perform an operation on the output such as checking for a specific value. The Azure CLI generates output to STDOUT and STDERR. Each line is prefixed by the strings `info:` for informational status messages, or `data:` for data returned about a service; however, you can instruct the Azure CLI to return more verbose information by using the `--verbose` or `-v` parameter. This will return additional information prefixed by the string `verbose:`.

For example, the following output is returned from the `azure site list` command:

	info:    Executing command site list
	+ Enumerating sites
	data:    Name           Status   Mode  Host names
	data:    -------------  -------  ----  -------------------------------
	data:    myawesomesite  Running  Free  myawesomesite.azurewebsites.net
	info:    site list command OK

If the `--verbose` or `-v` parameter is specified, information similar to the following is returned:

	info:    Executing command site list
	verbose: Subscription ####################################
	verbose: Enumerating sites
	verbose: [
	verbose:     {
	verbose:         ComputeMode: 'Shared',
	verbose:         HostNameSslStates: {
	verbose:             HostNameSslState: [
	verbose:                 {
	verbose:                     IpBasedSslResult: {
	verbose:                         $: { i:nil: 'true' }
	verbose:                     },
	verbose:                     SslState: 'Disabled',
	verbose:                     ToUpdateIpBasedSsl: {
	verbose:                         $: { i:nil: 'true' }
	verbose:                     },
	verbose:                     VirtualIP: {
	verbose:                         $: { i:nil: 'true' }
	verbose:                     },
	verbose:                     Thumbprint: {
	verbose:                         $: { i:nil: 'true' }
	verbose:                     },
	verbose:                     ToUpdate: {
	verbose:                         $: { i:nil: 'true' }
	verbose:                     },
	verbose:                     Name: 'myawesomesite.azurewebsites.net'
	verbose:                 },
	...
	verbose:     }
	verbose: ]
	data:    Name           Status   Mode  Host names
	data:    -------------  -------  ----  -------------------------------
	data:    myawesomesite  Running  Free  myawesomesite.azurewebsites.net
	info:    site list command OK

Note that the `verbose:` information appears to be JSON formatted data. You can use the `--json` parameter to return the information in JSON format if you are working with utilities that natively understand JSON, such as [jsawk](https://github.com/micha/jsawk) or [jq](http://stedolan.github.io/jq/). For example:

	azure site list --json | jsawk -n 'out(this.Name)' | xargs -L 1 azure site delete -q

The command above retrieves a list of websites as JSON, then uses jsawk to retrieve the site names, and finally uses xargs to run a site delete command for each site, passing the site name as a parameter.

>[AZURE.NOTE] The `--json` parameter blocks the generation of status or data information (strings prefixed by `info:` and `data:`). For example, if the `--json` parameter is used with the `azure site create`, no output is returned as this command does not return any data other than `info:`.

### Working with errors

While the Azure CLI does log error information to STDERR, additional information on errors may also be logged to an **azure.err** file in the directory that the script was ran from. If information is logged to this file, the following will be written to STDOUT:

	info:    Error information has been recorded to azure.err

### Exit status

Some of the Azure CLI commands do not return a non-zero exit status if required parameters are missing. Instead, they will prompt for user input. For example, when using the `azure site create` command to create a new website, if no site name or `--location` parameter are specified you will be prompted to supply these values.

If you are writing a script that relies on the exit status, please verify that the Azure CLI commands you are using do not prompt for user input.

<a id="additional-resources"></a>

## Additional resources

* [List of detailed Service Management commands][Using the Azure CLI]

* [Using the Azure CLI for Mac, Linux, and Windows](cli-cli-azure-resource-manager)

* [Using the Azure CLI with the Resource Manager][cliarm]

* For more information on the Azure CLI, to download source code, report problems, or contribute to the project, visit the [GitHub repository for the Azure CLI](https://github.com/azure/azure-xplat-cli).

* If you encounter problems using the Azure CLI, or Azure, visit the [Azure Forums](http://social.msdn.microsoft.com/Forums/windowsazure/home).

* For more information on Azure, see [http://azure.microsoft.com/](http://azure.microsoft.com).




[mac-installer]: http://go.microsoft.com/fwlink/?LinkId=252249
[windows-installer]: http://go.microsoft.com/?linkid=9828653&clcid=0x409
[authandsub]: http://msdn.microsoft.com/library/windowsazure/hh531793.aspx#BKMK_AccountVCert

[Azure Web Site]: ../media/freetrial.png
[select a preview feature]: ../media/antares-iaas-preview-02.png
[select subscription]: ../media/antares-iaas-preview-03.png
[free-trial]: http://www.windowsazure.com/pricing/free-trial/?WT.mc_id=A7171371E
[advanced-bash]: http://tldp.org/LDP/abs/html/
[script]: http://en.wikipedia.org/wiki/Shell_script
[batch]: http://technet.microsoft.com/library/bb490890.aspx
[cliarm]: xplat-cli-azure-resource-manager.md
[portal]: https://manage.windowsazure.com
[signuporg]: http://www.windowsazure.com/documentation/articles/sign-up-organization/
[Using the Azure CLI]: virtual-machines-command-line-tools.md
