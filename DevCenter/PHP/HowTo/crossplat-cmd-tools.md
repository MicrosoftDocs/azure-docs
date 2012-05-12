#How to Use the Windows Azure Cross-Platform Command Line Tools

This guide describes how to use Windows Azure Cross-Platform Command Line Tools to create and manage services in Windows Azure. The scenarios covered include **importing your publishing settings**, **creating and managing Windows Azure Websites**, and **creating and managing Windows Azure Virtual Machines**.

##Table of Contents
* [What are the Windows Azure Cross-Platform Command Line Tools](#Overview)
* [How to Install the Windows Azure Cross-Platform Command Line Tools](#Install)
* [How to Create a Windows Azure Accoun](#CreateAccount)
* [How to Download and Import Publish Settings](#ImportPubSettings)
* [How to Create and Manage a Windows Azure Web Site](#CreateWebsite)
* [How to Create and Manage a Virtual Machine](#CreateVM)
* [How to Manage Disk Images]
* [How to Manage VM Images]
* [How to Manage Certificates]
* [How to Manage Local Settings]

<h2 id="Overview">What are the Windows Azure Cross-Platform Command Line Tools</h2>

The Windows Azure Cross-Platform Command Line Tools are a set of command-line tools for developing and deploying Windows Azure applications. These tools work on any platform, including MacIntosh, Linux, and Windows.

The supported tasks include the following:

* Import publishing settings.
* Create and manage Windows Azure Websites.
* Create and manage Windows Azure Virtual Machines.
* **(TODO: FILL out this list)**

For a complete list of supported commands, type `azure -help` at the command line after installing the tools.

<h2 id="Install">How to Install the Windows Azure Cross-Platform Command Line Tools</h2>

For **Mac users**, download the Windows Azure SDK Installer here: **TODO: Get FWLink to download site for MacInstaller**. Open the downloaded .pkg file and complete the installation steps as your are prompted.

For **Linux users**, install the latest version of Node.js (see [Install Node.js via Package Manager][install-node]), then run the following command:

	npm install azure -g

For Windows users, **TODO: Get info from Glenn about positioning vs. Powershell**

To test the installation, type the following at the command prompt:
	
	azure

This will list all of the available azure commands. For details about a particular command, run the following:

	azure [command name] -help

<h2 id="CreateAccount">How to Create a Windows Azure Account</h2>

	**TODO: Reference content chunk: talk to Diane**

<h2 id="ImportPubSettings">How to Download and Import Publish Settings</h2>

Downloading and importing your publish settings will allow you to use the command-line tools to create and manage Azure Services. To download your publish settings, run the following command:

	azure account download

This will open your default browser and prompt you to sign in with your Windows Azure credentials. After signing in, your `.publishsettings` file will be downloaded.

Next, import the `.publishsettings` file by running the following command, replacing `<path to .publishsettings file>` with the path to your `.publishsettings` file:

	azure account import <path to .publishsettings file>

You can remove all of the information stored by the import command by running the following command:

	azure account clear

To see a list of options for account commands, run the following:

	azure account -help 

<h2 id="CreateWebsite">How to Create and Manage a Windows Azure Web Site</h2>

To create a Windows Azure Website, you first need to change directories to your local application directory. This is necessary becasue the tools will write files and subdirectories that contain information for managing a site to the directory from which the command below is executed. After you have changed directories, run the following command, replacing `[site name]` with the name of your website:

	azure site create [site name]

The output from this command will contain the default URL for your website.

Note that you can execute the azure site create command with any of the following options:

* `--location [location name]`. This option allows you to specify the location of the data center in which your website is created. Possible values are TODO: get list of location values and the default value.
* `--hostname [custom host name]`. This option allows you to specify a custom hostname for your website.
* `--git`. This option allows you to use git to publish to your website by creating git repositories in both your local application directory and in your website's data center. However, the first time you create a git repository for a website, you must do so via the Windows Azure portal (see **TODO: Link to appropriate doc**). Also note that if your local application direcotory is already a git repository, the `azure site create` command will create a git repository in your website's data center regardless of whether you use the `--git` option.

To list your websites, use the following command:
	
	azure site list

To get detailed information about a site, run the following:

	azure site show [site name]

You can stop or start a site (respectively) with one of the following commands:
	
	azure site stop [site name]
	azure stie start [site name]

To see a complete list of azure site commands, run the following:

	azure site -help

To see a list of options for vm commands, run the following:
	
	azure vm -help 

<h2 id="CreateVM">How to Create and Manage a Virtual Machine</h2>

A Windows Azure Virtual Machine allows you to run the operating system of your choice, inlcuding Linux. You can create a VM from images that are available in the Image Gallery, or you can provide your own image.

To see images that are available, run the following command:

	**TODO: figure out what this command is, and what images are shown...Gallery + custom?**

To create a new VM from one of the available images, run this command:

	azure vm create <dns-prefix> <image> <userName> [password]

The parameters in the command above are as follows:
* `<dns-prefix>`: The DNS prefix for VM URL. This will also be the VM name.
* `<image>`: The image name (from the list of available images).
* `<userName>`: The administrator user name.
* `[password]`: The administrator's password.

To see a list of provisioned VMs, run the following:

	azure vm list

To get detailed information about a VM, run the following:

	azure vm show <vm name>

**TODO: Add info about endpoint and disk management?**

You can shutdown, start, or restart a VM (respectively), with one of the following commands:
	
	azure vm shutdown <vm name>
	azure vm start <vm name>
	azure vm restart <vm name>

To delete a VM, run the following:

	azure vm delete <vm name>

##How to Manage Disk Images
##How to Manage VM Images
##How to Manage Certificates
##How to Manage Local Settings

[install-node]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
