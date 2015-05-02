<properties 
	pageTitle="The Azure Cross-Platform Command-Line Interface" 
	description="Install and configure the Azure Cross-Platform Command-Line Interface to manage Azure Services" 
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

# Install and Configure the Azure Cross-Platform Command-Line Interface

<div class="dev-center-tutorial-selector sublanding"><a href="/manage/install-and-configure-windows-powershell/" title="PowerShell">PowerShell</a><a href="/manage/install-and-configure-cli/" title="Cross-Platform CLI" class="current">Cross-Platform CLI</a></div>

The Azure Cross-Platform Command-Line Interface (xplat-cli) provides a set of open source, cross-platform commands for working with the Azure Platform. The xplat-cli provides much of the same functionality found in the Azure Management Portal, such as the ability to manage websites, virtual machines, mobile services, SQL Database and other services provided by the Azure platform.

The xplat-cli is written in JavaScript, and requires Node.js. It is implemented using the Azure SDK for Node.js, and released under an Apache 2.0 license. The project repository is located at [https://github.com/WindowsAzure/azure-sdk-tools-xplat](https://github.com/WindowsAzure/azure-sdk-tools-xplat).

This document describes how to install and configure the Azure Cross-Platform Command-Line Interface, as well as how to use it to perform basic tasks with the Azure platform.


## <a id="install">How to install the Azure Cross-Platform Command-Line Interface</a>

There are two ways to install the xplat-cli; using installer packages for Windows and OS X, or if Node.js is installed on your system, the **npm** command. Once the xplat-cli has been installed, you will be able to use the **azure** command from your command-line interface (Bash, Terminal, Command prompt) to access the xplat-cli commands.

###Using an installer

The following installer packages are available:

* [Windows installer][windows-installer]

* [OS X installer][mac-installer]

###Using npm

If Node.js is already installed on your system, use the following command to install the xplat-cli:

	npm install azure-cli -g

>[AZURE.NOTE] You may need to use `sudo` to successfully run the __npm__ command.

If node.js is not installed, you're going to have to install it first. For Linux systems, you must have Node.js installed and either use **npm** to install the xplat-cli as described below, or build it from source. The source is available at [http://go.microsoft.com/fwlink/?linkid=253472&clcid=0x409](http://go.microsoft.com/fwlink/?linkid=253472&clcid=0x409). For more information on on building from source, see the INSTALL file included in the archive.

####Installing node.js and npm on Distributions that use [dpkg](http://en.wikipedia.org/wiki/Dpkg) Package Management 
The most common of these distributions use either the [advanced packaging tool (apt)](http://en.wikipedia.org/wiki/Advanced_Packaging_Tool) or other tools based on the `.deb` package format. Examples are Ubuntu and Debian, but there are many others. 

Most of the more recent of these distributions require installing **nodejs-legacy** in order to get a properly configued **npm** tool to install the azure-cli. The following code shows the commands that install **npm** properly on Ubuntu 14.04.
	
	sudo apt-get install nodejs-legacy
	sudo apt-get install npm
	sudo npm install -g azure-cli

Some of the older distributions, such as Ubuntu 12.04, require installing the current binary distribution of node.js. The following code shows how to do that by installing and using **curl**. 

>[AZURE.NOTE] The commands here are taken from the Joyent installation instructions found [here](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager). However, when using **sudo** as a pipe target you should always take care to check the scripts that you are installing and validate that they do exactly what you are expecting before running them through **sudo**.
	
	sudo apt-get install curl
	curl -sL https://deb.nodesource.com/setup | sudo bash -
	sudo apt-get install -y nodejs
	sudo npm install -g azure-cli

####Installing node.js and npm on Distributions that use [rpm](http://en.wikipedia.org/wiki/RPM_Package_Manager) Package Management

Installing node.js on RPM-based distributions requires enabling the EPEL repository. The following code shows the best practices for installation on CentOS 7. (Note that in the first line, below, the '-' (hyphen character) is important!)

	su -     
	yum update [enter]
	yum upgrade –y [enter] 
	yum install epel-release [enter]
	yum install nodejs [enter] 
	yum install npm [enter] 
	npm install -g azure-cli  [enter]


Once the xplat-cli has been installed, you will be able to use the **azure** command from your command-line interface (Bash, Terminal, Command prompt) to access the xplat-cli commands. At the end of the installation, you should see something similar to the following:

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

> [AZURE.NOTE] Node.js and npm can also be installed on Windows from <a href="http://nodejs.org/">http://nodejs.org/</a>.

## <a id="configure">How to connect to your Azure subscription</a>

While some commands provided by the xplat-cli will work without an Azure subscription, most commands require a subscription. To configure the xplat-cli to work with your subscription you can either:

* Download and use a publish settings file.

OR

* Log in to Azure using an organizational account. When you log in, Azure Active Directory is used to authenticate the credentials.

To help you choose the authentication method that's appropriate for your needs, consider the following:

*  The log in method can make it easier to manage access to subscription, but may disrupt automation, as the credentials may time out and require you to log in again.

	> [AZURE.NOTE] The login method only works with organizational account.  An organizational account is a user that is managed by your organization, and defined in your organization's Azure Active Directory tenant. If you do not currently have an organizational account, and are using a Microsoft account to log in to your Azure subscription, you can easily create one using the following steps.
	> 
	> 1. Login to the [Azure Management Portal][portal], and click on **Active Directory**.
	> 
	> 2. If no directory exists, select **Create your directory** and provide the requested information.
	> 
	> 3. Select your directory and add a new user. This new user is an organizational account.
	> 
	>     During the creation of the user, you will be supplied with both an e-mail address for the user and a temporary password. Save this  information as it is used in another step.
	> 
	> 4. From the management portal, select **Settings** and then select **Administrators**. Select **Add**, and add the new user as a co-administrator. This allows the organizational account to manage your Azure subscription.
	> 
	> 5. Finally, log out of the Azure portal and then log back in using the new organizational account. If this is the first time logging in with this account, you will be prompted to change the password.
	>
	>For more information on organizational account with Microsoft Azure, see [Sign up for Microsoft Azure as an Organization][signuporg].

*  The publish settings file method installs a certificate that allows you to perform management tasks for as long as the subscription and the certificate are valid. This method makes it easier to use automation for long-running tasks. After you download and import the information, you don't need to provide it again. However, this method makes it harder to manage access to a subscription as anyone with access to the certificate can manage the subscription.

For more information about authentication and subscription management, see ["What's the difference between account-based authentication and certificate-based authentication"][authandsub].

If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][free-trial].

###Use the log in method

To log in using an organizational account, use the following command:

	azure login -u username -p password

If you want to log in by typing interactively (for example, if you want your password masked on the screen), use the following command:

	azure login

and you will be prompted for your credentials and your password characters will be masked.

> [AZURE.NOTE] If this is the first time you have logged in with these credentials, you will receive a prompt asking you to verify that you wish to cache an authentication token. This prompt will also occur if you have previously used the `azure logout` command described below. To bypass this prompt for automation scenarios, use the `-q` parameter with the `azure login` command.
>
> When you authenticate with an organizational account, the information for accessing your Azure subscription is stored in a `.azure` directory located in your `user` directory. Your `user` directory is protected by your operating system; however, it is recommended that you take additional steps to encrypt your `user` directory. You can do so in the following ways:

To log out, use the following command:

	azure logout -u <username>

> [AZURE.NOTE] If the subscriptions associated with the account were only authenticated with Active Directory, logging out will delete the subscription information from the local profile. However, if the a publish settings file has also been imported for the subscriptions, logging out will only delete the Active Directory related information from the local profile.

> [AZURE.NOTE] The following commands will not function correctly when authenticating using an account:
> 
> * `azure vm`
> * `azure network`
> * `azure mobile`
> 
> If you need to work with these commands, use a publish settings file to authenticate to Azure as described in the following section.

### Use the publish settings file method

To download the publish settings for your account, use the following command:

	azure account download

This will open your default browser and prompt you to sign in to the Azure Management Portal. After signing in, a `.publishsettings` file will be downloaded. Make note of where this file is saved.

> [AZURE.NOTE] If your account is associated with multiple Azure Active Directory tenants, you may be prompted to select which Active Directory you wish to download a publish settings file for.
> 
> Once selected using the download page, or by visiting the Azure Management portal, the selected Active Directory becomes the default used by the portal and download page. Once a default has been established, you will see the text '__click here to return to the selection page__' at the top of the download page. Use the provided link to return to the selection page.

Next, import the `.publishsettings` file by running the following command, replacing `[path to .publishsettings file]` with the path to your `.publishsettings` file:

	azure account import [path to .publishsettings file]

> [AZURE.NOTE] When you import publish settings, the information for accessing your Azure subscription is stored in a `.azure` directory located in your `user` directory. Your `user` directory is protected by your operating system; however, it is recommended that you take additional steps to encrypt your `user` directory. You can do so in the following ways:
>
> * On Windows, modify the directory properties or use BitLocker.
> * On Mac, turn on FileVault for the directory.
> * On Ubuntu, use the Encrypted Home directory feature. Other Linux distributions offer equivalent features.

After importing your publish settings, you should delete the `.publishsettings` file, as it is no longer required by the Command-Line Tools and presents a security risk as it can be used to gain access to your subscription.

###Multiple subscriptions

If you have multiple Azure subscriptions, logging in will grant access to all subscriptions associated with your credentials. If using a publish settings file, the `.publishsettings` file will contain information for all subscriptions. With either method, one subscription will be selected as the default subscription used by the xplat-cli when performing operations. You can view the subscriptions, as well as which one is the default, but using the `azure account list` command. This command will return information similar to the following:

	info:    Executing command account list
	data:    Name              Id                                    Current
	data:    ----------------  ------------------------------------  -------
	data:    Azure-sub-1       ####################################  true
	data:    Azure-sub-2       ####################################  false

In the above list, the **Current** column indicates the current default subscription as Azure-sub-1. To change the default subscription, use the `azure account set` command, and specify the subscription that you wish to be the default. For example:

	azure account set Azure-sub-2

This will change the default subscription to Azure-sub-2. 

> [AZURE.NOTE] Changing the default subscription takes effect immediately, and is a global change; new xplat-commands, whether ran from the same command-line instance or a different instance, will use the new default subscription.

If you wish to use a non-default subscription with the xplat-cli, but don't want to change the current default, you can use the `--subscription` option and provide the name of the subscription you wish to use for the operation.

<h2><a id="use"></a>How to use the Azure Cross-Platform Command-Line Interface</h2>

The xplat-cli is accessed using the `azure` command. To see a list of commands available, use the `azure` command with no parameters. You should see help information similar to the following:

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

The top level commands listed above contain commands for working with a specific area of Azure. For example, the `azure account` command contains commands that relate to your Azure subscription, such as the `download` and `import` settings used previously. See [Using the Azure Cross-Platform Command Line Interface] for details on the available commands and options.

Most commands are formatted as `azure <command> <operation> [parameters]` and perform an operation on a service or object such as your account configuration. Other commands provide sub-commands and follow the format `azure <command> <subcommand> <operation> [parameters]`. The following are example commands that work with your account configuration:

* To view subscriptions that you have imported, use:

		azure account list

* If you have imported subscriptions, use the following to set one as default:

		azure account set <subscription>

The `--help` or `-h` parameter can be used to view help for specific commands. Alternately, The `azure help [command] [options]` format can also be used to return the same information. For example, the following commands all return the same information:

	azure account set --help

	azure account set -h

	azure help account set

When in doubt about the parameters needed by a command, refer to help using `--help`, `-h` or `azure help [command]`.

###Setting the configuration mode

The xplat-cli allows you to perform management operations on individual _resources_, which are user-managed entities such as a database server, database, or website. This is the default mode of operation for the xplat-cli, and is referred to as **Azure Service Management**. However, when you have a complex solution that consists of multiple resources, it is useful to be able to manage the entire solution as a single unit.

To support managing a group of resources as a single logical unit, or _resource group_, we have introduced a preview of the **Resource Manager** as a new way of managing Azure resources. 

>[AZURE.NOTE] The Resource Manager is currently in preview, and does not provide the same  level of management capabilities as Azure Service Management.

To support the new Resource Manager, the xplat-cli allows you to switch between these management 'modes' using the `azure config mode` command.

The xplat-cli defaults to Azure Service Management mode. To switch to Resource Manager mode, use the following to enable command:

	azure config mode arm

To change back to Azure service management mode, use the following command:

	azure config mode asm 

>[AZURE.NOTE] The Resource Manager mode and Azure Service Management mode are mutually exclusive. That is, resources created in one mode cannot be managed from the other mode.

For more information on working with the Resource Manager using the xplat-cli, see [Using the Azure Cross-Platform Command-Line Interface with the Resource Manager][xplatarm].

###Working with services in Azure service management mode

The xplat-cli allows you to easily manage Azure services. In this example, you will learn how to use the xplat-cli to manage an Azure Website.

1. Use the following command to create a new Azure Website. Replace **mywebsite** with a unique name.

		azure site create mywebsite

	You will be prompted to specify the region that the website will be created in. Select a region that is geographically near you. After this command completes, the website will be available at http://mywebsite.azurewebsites.net (replace **mywebsite** with the name you specified.)

	> [AZURE.NOTE] If you use Git for project source control, you can specify the `--git` parameter to create a Git repository on Azure for this website. This will also initialize a Git repository in the directory from which the command was ran if one does not already exist. It will also create a Git remote named __azure__, which can be used to push deployments to the Azure Website using the `git push azure master` command.

	> [AZURE.NOTE] If you receive an error that 'site' is not an azure command, the xplat-cli is most likely in resource group mode. To change back to resource mode, use the `azure config mode asm` command.

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

<h2><a id="script"></a>How to script the Azure Cross-Platform Command-Line Interface</h2>

While you can use the xplat-cli to manually issue commands, you can also create complex automation workflows by leveraging the capabilities of your command-line interpreter and other command-line utilities available on your system. For example, the following command will stop all running Azure Websites:

	azure site list | grep 'Running' | awk '{system("azure site stop "$2)}'

This example pipes a list of websites to the `grep` command, which inspects each line for the string 'Running'. Any lines that match are then piped to the `awk` command, which calls `azure site stop` and uses the second column passed to it (the running site name) as the site name to stop.

While this demonstrates how you can chain commands together, you can also create more elaborate scripts using the scripting features provided by your command-line interpreter. Different command-line interpreters have different scripting features and syntax. Bash is probably the most widely used command-line interpreter for UNIX-based systems, including Linux and OS X.

For information on scripting with Bash, see the [Advanced Bash-Scripting Guide][advanced-bash].

For more general information on scripting OS X or Linux-based systems, see [Shell script][script].

For information on scripting Windows-based systems using batch files, see [Command-line reference A-Z][batch].

### Understanding results

When creating scripts, you often need to capture the output of a command and either pass this to another command or perform an operation on the output such as checking for a specific value. The xplat-cli generates output to STDOUT and STDERR. Each line is prefixed by the strings `info:` for informational status messages, or `data:` for data returned about a service; however, you can instruct the xplat-cli to return more verbose information by using the `--verbose` or `-v` parameter. This will return additional information prefixed by the string `verbose:`.

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

###Working with errors

While the xplat-cli does log error information to STDERR, additional information on errors may also be logged to an **azure.err** file in the directory that the script was ran from. If information is logged to this file, the following will be written to STDOUT:

	info:    Error information has been recorded to azure.err

###Exit status

Some of the xplat-cli commands do not return a non-zero exit status if required parameters are missing. Instead, they will prompt for user input. For example, when using the `azure site create` command to create a new website, if no site name or `--location` parameter are specified you will be prompted to supply these values.

If you are writing a script that relies on the exit status, please verify that the xplat-cli commands you are using do not prompt for user input.

<h2><a id="additional-resources"></a>Additional resources</h2>

* [List of detailed Service Management commands][Using the Azure Cross-Platform Command Line Interface]

* [Using the Azure Cross-platform command line interface with the Resource Manager][xplatarm]

* For more information on the xplat-cli, to download source code, report problems, or contribute to the project, visit the [GitHub repository for the Azure Cross-Platform Command-Line Interface](https://github.com/WindowsAzure/azure-sdk-tools-xplat).

* If you encounter problems using the xplat-cli, or Azure, visit the [Azure Forums](http://social.msdn.microsoft.com/Forums/windowsazure/home).

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
[xplatarm]: xplat-cli-azure-resource-manager.md
[portal]: https://manage.windowsazure.com
[signuporg]: http://www.windowsazure.com/documentation/articles/sign-up-organization/
[Using the Azure Cross-Platform Command Line Interface]: virtual-machines-command-line-tools.md
