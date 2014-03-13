<properties linkid="script-xplat-intro" urlDisplayName="Windows Azure Cross-Platform Command-Line Interface" pageTitle="The Windows Azure Cross-Platform Command-Line Interface" title="The Windows Azure Cross-Platform Command-Line Interface" metaKeywords="windows azure cross-platform command-line interface, windows azure command-line, azure command-line, azure cli" description="Install and configure the Windows Azure Cross-Platform Command-Line Interface to manage Windows Azure Services" metaCanonical="http://www.windowsazure.com/en-us/script/xplat-cli-intro" umbracoNaviHide="0" disqusComments="1" editor="mollybos" manager="paulettm" documentationCenter="" solutions="" authors="larryfr" services="" />

#Install and Configure the Windows Azure Cross-Platform Command-Line Interface

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/manage/install-and-configure-windows-powershell/" title="PowerShell">PowerShell</a><a href="/en-us/manage/install-and-configure-cli/" title="Cross-Platform CLI" class="current">Cross-Platform CLI</a></div>

The Windows Azure Cross-Platform Command-Line Interface (xplat-cli) provides a set of open source, cross-platform commands for working with the Windows Azure Platform. The xplat-cli provides much of the same functionality found in the Windows Azure Management Portal, such as the ability to manage web sites, virtual machines, mobile services, SQL Database and other services provided by the Windows Azure platform.

The xplat-cli is written in JavaScript, and requires Node.js. It is implemented using the Windows Azure SDK for Node.js, and released under an Apache 2.0 license. The project repository is located at [https://github.com/WindowsAzure/azure-sdk-tools-xplat](https://github.com/WindowsAzure/azure-sdk-tools-xplat).

This document describes how to install and configure the Windows Azure Cross-Platform Command-Line Interface, as well as how to use it to perform basic tasks with the Windows Azure platform.

##In this document

* [How to install the Windows Azure Cross-Platform Command-Line Interface](#install)
* [How to connect to your Windows Azure subscription](#configure)
* [How to use the Windows Azure Cross-Platform Command-Line Interface](#use)
* [How to script the Windows Azure Cross-Platform Command-Line Interface](#script)
* [Additional resources](#additional-resources)

<h2><a id="install"></a>How to install the Windows Azure Cross-Platform Command-Line Interface</h2>

There are two ways to install the xplat-cli; using installer packages for Windows and OS X, or if Node.js is installed on your system, the **npm** command.

For Linux systems, you must have Node.js installed and either use **npm** to install the xplat-cli as described below, or build it from source. The source is available at [http://go.microsoft.com/fwlink/?linkid=253472&clcid=0x409](http://go.microsoft.com/fwlink/?linkid=253472&clcid=0x409). For more information on on building from source, see the INSTALL file included in the archive.

Once the xplat-cli has been installed, you will be able to use the **azure** command from your command-line interface (Bash, Terminal, Command prompt) to access the xplat-cli commands.

###Using an installer

The following installer packages are available:

* [Windows installer][windows-installer]

* [OS X installer][mac-installer]

<div class="dev-callout">
<b>Note</b>
<p>The installer packages also contain Node.js. This version of Node.js will be used by the xplat-cli if no other version of Node.js is available on the system. The version of Node.js installed by these packages should not conflict with any other version of Node.js installed on your system.</p>
</div>

###Using npm

If Node.js is installed on your system, use the following command to install the xplat-cli:

	npm install azure-cli

<div class="dev-callout">
<b>Note</b>
<p>You may need to use <b>sudo</b> to successfully run the <b>npm</b> command.</p>
</div>

This will install the xplat-cli and required dependencies. At the end of the installation, you should see something similar to the following:

	azure-cli@0.7.0 ..\node_modules\azure-cli
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

<div class="dev-callout">
<b>Note</b>
<p>Node.js can be installed from <a href="http://nodejs.org/">http://nodejs.org/</a>.</p>
</div>

<h2><a id="Configure"></a>How to connect to your Windows Azure subscription</h2>

While some commands provided by the xplat-cli will work without a Windows Azure subscription, most commands require a subscription. To configure the xplat-cli to work with your Windows Azure subscription you must download and import a publish settings file. This file contains your subscription ID, as well as a management certificate used to authenticate management requests to your Windows Azure subscription.

If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Windows Azure Free Trial][free-trial].

To download the publish settings for your account, use the following command:

	azure account download

This will open your default browser and prompt you to sign in to the Windows Azure Management Portal. After signing in, a `.publishsettings` file will be downloaded. Make note of where this file is saved.

<div class="dev-callout">
<b>Note</b>
<p>If your account is associated with multiple Windows Azure Active Directory (AD) tenants, you may be prompted to select which AD you wish to download a publish settings file for.</p>
<p>Once selected using the download page, or by visiting the Windows Azure Management portal, the selected AD becomes the default used by the portal and download page. Once a default has been established, you will see the text '<b>click here to return to the selection page</b>' at the top of the download page. Use the provided link to return to the selection page.</p>
</div>

Next, import the `.publishsettings` file by running the following command, replacing `{path to .publishsettings file}` with the path to your `.publishsettings` file:

	azure account import {path to .publishsettings file}

<div class="dev-callout">
<b>Note</b>
<p>When you import publish settings, the information for accessing your Windows Azure subscription is stored in a <code>.azure</code> directory located in your <code>user</code> directory. Your <code>user</code> directory is protected by your operating system; however, it is recommended that you take additional steps to encrypt your <code>user</code> directory. You can do so in the following ways:</p>

<ul>
<li>On Windows, modify the directory properties or use BitLocker.</li>
<li>On Mac, turn on FileVault for the directory.</li>
<li>On Ubuntu, use the Encrypted Home directory feature. Other Linux distributions offer equivalent features.</li>
</ul>

</div>

After importing your publish settings, you should delete the `.publishsettings` file, as it is no longer required by the Command-Line Tools and presents a security risk as it can be used to gain access to your subscription.

###Multiple subscriptions

If you have multiple Windows Azure subscriptions, the `.publishsettings` file will contain information for all subscriptions. When the file is imported using the `azure account import` command, one subscription will be selected as the default subscription used by the xplat-cli when performing operations. You can view the subscriptions, as well as which one is the default, but using the `azure account list` command. This command will return information similar to the following:

	info:    Executing command account list
	data:    Name              Id                                    Current
	data:    ----------------  ------------------------------------  -------
	data:    Azure-sub-1       ####################################  true
	data:    Azure-sub-2       ####################################  false

In the above list, the **Current** column indicates the current default subscription as Azure-sub-1. To change the default subscription, use the `azure account set` command, and specify the subscription that you wish to be the default. For example:

	azure account set Azure-sub-2

This will change the default subscription to Azure-sub-2. 

<div class="dev-callout">
<b>Note</b>
<p>Changing the default subscription takes effect immediately, and is a global change; new xplat-commands, whether ran from the same command-line instance or a different instance, will use the new default subscription.</p>
</div>

If you wish to use a non-default subscription with the xplat-cli, but don't want to change the current default, you can use the `--subscription` option and provide the name of the subscription you wish to use for the operation.

<h2><a id="use"></a>How use the Windows Azure Cross-Platform Command-Line Interface</h2>

The xplat-cli is accessed using the `azure` command. To see a list of commands available, use the `azure` command with no parameters. You should see help information similar to the following:

	info:             _    _____   _ ___ ___
	info:            /_\  |_  / | | | _ \ __|
	info:      _ ___/ _ \__/ /| |_| |   / _|___ _ _
	info:    (___  /_/ \_\/___|\___/|_|_\___| _____)
	info:       (_______ _ _)         _ ______ _)_ _
	info:              (______________ _ )   (___ _ _)
	info:
	info:    Windows Azure: Microsoft's Cloud Platform
	info:
	info:    Tool version 0.7.0
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

The top level commands listed above contain commands for working with a specific area of Windows Azure. For example, the `azure account` command contains commands that relate to your Windows Azure subscription, such as the `download` and `import` settings used previously.

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

###Working with services

The xplat-cli allows you to easily manage Windows Azure services. In this example, you will learn how to use the xplat-cli to manage a Windows Azure Web Site.

1. Use the following command to create a new Windows Azure Web Site. Replace **mywebsite** with a unique name.

		azure site create mywebsite

	You will be prompted to specify the region that the web site will be created in. Select a region that is geographically near you. After this command completes, the web site will be available at http://mywebsite.azurewebsites.net (replace **mywebsite** with the name you specified.)

	<div class="dev-callout">
	<b>Note</b>
	<p>If you use Git for project source control, you can specify the <code>--git</code> parameter to create a Git repository on Windows Azure for this web site. This will also initialize a Git repository in the directory from which the command was ran if one does not already exist. It will also create a Git remote named <b>azure</b>, which can be used to push deployments to the Windows Azure Web Site using the <code>git push azure master</code> command.</p>
	</div>

2. Use the following command to list web sites for your subscription:

		azure site list

	The list should contain the site created in the previous step.

2. Use the following command to stop the web site. Replace **mywebsite** with the site name.

		azure site stop mywebsite

	After the command completes, you can refresh the browser to verify that the site has been stopped.

3. Use the following command to start the web site. Replace **mywebsite** with the site name.

		azure site start mywebsite

	After the command completes, you can refresh the browser to verify that the site has been started.

4. Use the following command to delete the web site. Replace **mywebsite** with the site name.

		azure site delete mywebsite

	After the command completes, use the `azure site list` command to verify that the web site no longer exists.

<h2><a id="script"></a>How to script the Windows Azure Cross-Platform Command-Line Interface</h2>

While you can use the xplat-cli to manually issue commands, you can also create complex automation workflows by leveraging the capabilities of your command-line interpreter and other command-line utilities available on your system. For example, the following command will stop all running Windows Azure Web Sites:

	azure site list | grep 'Running' | awk '{system("azure site stop "$2)}'

This example pipes a list of web sites to the `grep` command, which inspects each line for the string 'Running'. Any lines that match are then piped to the `awk` command, which calls `azure site stop` and uses the second column passed to it (the running site name) as the site name to stop.

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

The command above retrieves a list of web sites as JSON, then uses jsawk to retrieve the site names, and finally uses xargs to run a site delete command for each site, passing the site name as a parameter.

<div class="dev-callout">
<b>Note</b>
<p>The <code>--json</code> parameter blocks the generation of status or data information (strings prefixed by <code>info:</code> and <code>data:</code>). For example, if the <code>--json</code> parameter is used with the <code>azure site create</code>, no output is returned as this command does not return any data other than <code>info:</code>.</p>
</div>

###Working with errors

While the xplat-cli does log error information to STDERR, additional information on errors may also be logged to an **azure.err** file in the directory that the script was ran from. If information is logged to this file, the following will be written to STDOUT:

	info:    Error information has been recorded to azure.err

### Exit status

Some of the xplat-cli commands do not return a non-zero exit status if required parameters are missing. Instead, they will prompt for user input. For example, when using the `azure site create` command to create a new web site, if no site name or `--location` parameter are specified you will be prompted to supply these values.

If you are writing a script that relies on the exit status, please verify that the xplat-cli commands you are using do not prompt for user input.

<h2><a id="additional-resources"></a>Additional resources</h2>

* For more information on the xplat-cli, to download source code, report problems, or contribute to the project, visit the [GitHub repository for the Windows Azure Cross-Platform Command-Line Interface](https://github.com/WindowsAzure/azure-sdk-tools-xplat).

* If you encounter problems using the xplat-cli, or Windows Azure, visit the [Windows Azure Forums](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home).

* For more information on Windows Azure, see [http://www.windowsazure.com/](http://www.windowsazure.com).




[mac-installer]: http://go.microsoft.com/fwlink/?LinkId=252249
[windows-installer]: http://go.microsoft.com/fwlink/?LinkID=275464&clcid=0x409


[Windows Azure Web Site]: ../media/freetrial.png
[select a preview feature]: ../media/antares-iaas-preview-02.png
[select subscription]: ../media/antares-iaas-preview-03.png
[free-trial]: http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A7171371E
[advanced-bash]: http://tldp.org/LDP/abs/html/
[script]: http://en.wikipedia.org/wiki/Shell_script
[batch]: http://technet.microsoft.com/en-us/library/bb490890.aspx
