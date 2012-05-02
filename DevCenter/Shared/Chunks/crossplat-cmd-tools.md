#How to Use the Cross-Platform Tools for Windows Azure

This guide describes how to use Windows Azure Cross-Platform Command Line Tools to create and manage services in Windows Azure. The scenarios covered include **importing your publishing settings**, **creating and managing Windows Azure Websites**, and **creating and managing Windows Azure Virtual Machines**.

##Table of Contents
* [What are the Windows Azure Cross-Platform Command Line Tools](#Overview)
* [How to Install the Windows Azure Cross-Platform Command Line Tools](#Download)
* [How to Create a Windows Azure Account](#CreateAccount)
* [How to Download and Import Publish Settings](#Account)
* [How to Create and Manage a Windows Azure Web Site](#WebSites)
* [How to Create and Manage a Virtual Machine](#VMs)
* [How to Manage Disk Images](#DiskImages)
* [How to Manage VM Images](#VMImages)
* [How to Manage Certificates](#Certificates)
* [How to Manage Local Settings](#LocalSettings)

<h2 id="Overview">What are the Cross-Platform Tools for Windows Azure</h2>

The Cross-Platform Tools for Windows Azure are a set of command-line tools for deploying and managing Windows Azure applications. These tools work on any platform, including MacIntosh, Linux, and Windows.
 
The supported tasks include the following:

* Import publishing settings.
* Create and manage Windows Azure Websites.
* Create and manage Windows Azure Virtual Machines.
* **(TODO: FILL out this list)**

For a complete list of supported commands, type `azure -help` at the command line after installing the tools.

<h2 id="Download">How to Install the Windows Azure Cross-Platform Command Line Tools</h2>

**For Mac users**, download the Windows Azure SDK Installer here: **TODO: Get FWLink to download site for MacInstaller**. Open the downloaded .pkg file and complete the installation steps as your are prompted.

**For Linux users**, install the latest version of Node.js (see [Install Node.js via Package Manager][install-node-linux]), then run the following command:

	npm install azure -g

**For Windows users**, **TODO: Get info from Glenn about positioning vs. Powershell**

To test the installation, type the following at the command prompt:

	azure

This will list all of the available `azure` commands. For details about a particular command, run the following:

	azure [command name] -help

<h2 id="CreateAccount">How to Create a Windows Azure Account</h2>

	**TODO: Reference content chunk: talk to Diane**

<h2 id="Account">How to Download and Import Publish Settings</h2>

Downloading and importing your publish settings will allow you to use the command-line tools to create and manage Azure Services. To download your publish settings, run the following command:

	azure account download

This will open your default browser and prompt you to sign in with your Windows Azure credentials. After signing in, your `.publishsettings` file will be downloaded.

Next, import the `.publishsettings` file by running the following command, replacing `<path to .publishsettings file>` with the path to your .publishsettings file:

	azure account import <path to .publishsettings file>

You can remove all of the information stored by the `import` command by running the following command:

	azure account clear

To see a list of options for `account` commands, run the following:

	azure account -help 

<h2 id="WebSites">How to Create and Manage a Windows Azure Web Site</h2>

To create a Windows Azure Website, you first need to change directories to your local application directory. This is necessary becasue the tools will write files and subdirectories that contain information for managing a site to the directory from which the command below is executed. After you have changed directories, run the following command, replacing `[site name]` with the name of your website:

	azure site create [site name]

The output from this command will contain the default URL for your website.

Note that you can execute the `azure site create` command with any of the following options:

* `--location [location name]`. This option allows you to specify the location of the data center in which your website is created. Possible values are **TODO: get list of location values and the default value**.
* `--hostname [custom host name]`. This option allows you to specify a custom hostname for your website.
* `--git`. This option allows you to use git to publish to your website by creating git repositories in both your local application directory and in your website's data center. If your local application direcotory is already a git repository, the `azure site create` command will create a git repository in your website's data center regardless of whether you use the `--git` option.

To list your websites, use the following command:

	azure site list

To get detailed information about a site, run the following:

	azure site show [site name]

You can stop or start a site with one of the following commands (respectively):

	azure site stop [site name]
	azure site start [site name]

To see a complete list of `azure site` commands, run the following:

	azure site -help

To see a list of options for `vm` commands, run the following:

	azure vm -help 

<h2 id="VMs">How to Create and Manage a Virtual Machine</h2>

A Windows Azure Virtual Machine is created from a virtual machine image (a .vhd file) that you provide or that is avalailable in the Image Gallery. To see images that are available, run the following command:

	azure vm image list

You can provision and start a VM from one of the available images with the `vm create` command. The following example shows how to create a Linux virtual machine (called `myCentOSVM`) from an image in the Image Gallery (CentOS 6.2). The root user name and password for the VM are `myusername` and `Mypassw0rd` respectively. (Note that the `--location` parameter specifies the data center in which the VM is created.)

	azure vm create myCentOSVM OpenLogic__OpenLogic-CentOS-62-en-us-30GB myusername Mypassw0rd --location "Windows Azure Preview"

**TODO: Update location value**

If you would rather provision a VM from a custom image, you can create an image from a .vhd file with the `vm image create` command, then use the `vm create` command to provision the VM. The following example shows how to create a Linux image (called `myImage`) from a local .vhd file. (The `--location` parameter specifies the data in which the image is stored.)

	azure vm image create myImage /path/to/myImage.vhd --os linux --location "Windows Azure Preview"

**TODO: update location in previous command**

After creating `myImage`, you can provision a VM from the image by using `vm create`. Note that when provisioning a VM from a custom image, the `--os` parameter must be provided. Valid values are `linux` and `windows`.

	azure vm create myImage myusername Mypassw0rd --os linux --location "Windows Azure Preview"

**TODO: The above command doesn't seem right. How do I specify the image?**

Once 

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

<h2 id="DiskImages">How to Manage Disk Images</h2>

<h2 id="VMImages">How to Manage VM Images</h2>

<h2 id="Certificates">How to Manage Certificates</h2>

<h2 id="LocalSettings">How to Manage Local Settings</h2>

[nodejs-org]: http://nodejs.org/
[install-node-linux]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager