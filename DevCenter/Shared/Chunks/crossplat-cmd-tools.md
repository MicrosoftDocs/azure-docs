#How to Use the Cross-Platform Tools for Windows Azure

This guide describes how to use Cross-Platform Tools for Windows Azure to create and manage services in Windows Azure. The scenarios covered include **installing the tools**, **importing your publishing settings**, **creating and managing Windows Azure Websites**, and **creating and managing Windows Azure Virtual Machines**. For comprehensive reference documentation, see **TODO: link to the reference doc**. 

##Table of Contents
* [What are the Windows Azure Cross-Platform Command Line Tools](#Overview)
* [How to Install the Windows Azure Cross-Platform Command Line Tools](#Download)
* [How to Create a Windows Azure Account](#CreateAccount)
* [How to Download and Import Publish Settings](#Account)
* [How to Create and Manage a Windows Azure Web Site](#WebSites)
* [How to Create and Manage a Virtual Machine](#VMs)


<h2 id="Overview">What are the Cross-Platform Tools for Windows Azure</h2>

The Cross-Platform Tools for Windows Azure are a set of command-line tools for deploying and managing Windows Azure services. These tools work on any platform, including MacIntosh, Linux, and Windows.
 
The supported tasks include the following:

* Import publishing settings.
* Create and manage Windows Azure Websites.
* Create and manage Windows Azure Virtual Machines.

For a complete list of supported commands, type `azure -help` at the command line after installing the tools, or see the reference documentation: **TODO: link to reference doc**.

<h2 id="Download">How to Install the Windows Azure Cross-Platform Command Line Tools</h2>

**For Mac users**, download the Windows Azure SDK Installer here: **TODO: Get FWLink to download site for MacInstaller**. Open the downloaded .pkg file and complete the installation steps as your are prompted.

**For Linux users**, install the latest version of Node.js (see [Install Node.js via Package Manager][install-node-linux]), then run the following command:

	npm install azure -g

**For Windows users**, **TODO: Get info from Glenn about positioning vs. Powershell**

To test the installation, type `azure` at the command prompt. If the installation was successful, you will see a list of all the available `azure` commands.

<h2 id="CreateAccount">How to Create a Windows Azure Account</h2>

To use the Cross-Platform Tools for Windows Azure, you will need a Windows Azure account.

	**TODO: Reference content chunk: talk to Diane**

<h2 id="Account">How to Download and Import Publish Settings</h2>

Downloading and importing your publish settings will allow you to use the command-line tools to create and manage Azure Services. To download your publish settings, use the `account download` command:

	azure account download

This will open your default browser and prompt you to sign in with your Windows Azure credentials. After signing in, your `.publishsettings` file will be downloaded. Make note of where you save this file.

Next, import the `.publishsettings` file by running the following command, replacing `<path to .publishsettings file>` with the path to your .publishsettings file:

	azure account import <path to .publishsettings file>

You are now ready to being creating and managing Windows Azure Virtual Machines and Windows Azure Websites. However, if necessary, you can remove all of the information stored by the `import` command by using the `account clear` command:

	azure account clear

To see a list of options for `account` commands, use the `-help` option:

	azure account -help 

<h2 id="WebSites">How to Create and Manage a Windows Azure Web Site</h2>

To create a Windows Azure Website, you first need to change directories to your local application directory. This is necessary becasue the tools will write files and subdirectories that contain information for managing a site to the directory from which the `site create` command is executed. After you have changed directories, run the following command, run the following command to create a site called `MySite`:

	azure site create MySite

The output from this command will contain the default URL for the newly created website.

Note that you can execute the `azure site create` command with any of the following options:

* `--location [location name]`. This option allows you to specify the location of the data center in which your website is created. Possible values are **TODO: get list of location values and the default value**.
* `--hostname [custom host name]`. This option allows you to specify a custom hostname for your website.
* `--git`. This option allows you to use git to publish to your website by creating git repositories in both your local application directory and in your website's data center. If your local application direcotory is already a git repository, the `azure site create` command will create a git repository in your website's data center regardless of whether you use the `--git` option.

To list your websites, use the following command:

	azure site list

To get detailed information about a site, use the `site show` command. The following example shows details for `MySite`:

	azure site show MySite

You can stop or start a site with the `site stop` and `site start` commands (respectively):

	azure site stop MySite
	azure site start MySite

To see a complete list of `azure site` commands, use the `-help` option:

	azure site -help 

<h2 id="VMs">How to Create and Manage a Virtual Machine</h2>

A Windows Azure Virtual Machine is created from a virtual machine image (a .vhd file) that you provide or that is avalailable in the Image Gallery. To see images that are available, use the `vm image list` command:

	azure vm image list

You can provision and start a VM from one of the available images with the `vm create` command. The following example shows how to create a Linux virtual machine (called `myCentOSVM`) from an image in the Image Gallery (CentOS 6.2). The root user name and password for the VM are `myusername` and `Mypassw0rd` respectively. (Note that the `--location` parameter specifies the data center in which the VM is created.)

	azure vm create myCentOSVM OpenLogic__OpenLogic-CentOS-62-en-us-30GB myusername Mypassw0rd --location "Windows Azure Preview"

**TODO: Update location value**

If you would rather provision a VM from a custom image, you can create an image from a .vhd file with the `vm image create` command, then use the `vm create` command to provision the VM. The following example shows how to create a Linux image (called `myImage`) from a local .vhd file. (The `--location` parameter specifies the data in which the image is stored.)

	azure vm image create myImage /path/to/myImage.vhd --os linux --location "Windows Azure Preview"

**TODO: update location in previous command**

After creating an image, you can provision a VM from the image by using `vm create`. The command below creates a VM called `myVM` from the image created with the command above (`myImage`).

	azure vm create myVM myImage myusername Mypassw0rd --location "Windows Azure Preview"

After you have provisioned a VM, you may want to create endpoints to, for example, allow remote access to your VM. The following example uses the `vm create endpoint` command to open external port 22 and local port 22 on `myCentOSVM`:

	azure vm endpoint create myCentOSVM 22 22

You can get detailed information about a VM (including IP address, DNS name, and endpoint information) with the `vm show` command:

	azure vm show myCentOSVM

To shutdown, start, or restart, the VM, use one of the following commands (respectively):

	azure vm shutdown myCentOSVM
	azure vm start myCentOSVM
	azure vm restart myCentOSVM

And finally, to delete the VM, use the `vm delete` command:

	azure vm delete myCentOSVM

For a complete list of commands for creating and managing virtual machines, use the `-h` option:

	azure vm -h


[nodejs-org]: http://nodejs.org/
[install-node-linux]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager