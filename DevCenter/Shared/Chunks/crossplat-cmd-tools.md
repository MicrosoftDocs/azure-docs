#How to use the Windows Azure Command-Line Tools for Mac and Linux

This guide describes how to use the Windows Azure Command-Line Tools for Mac and Linux to create and manage services in Windows Azure. The scenarios covered include **installing the tools**, **importing your publishing settings**, **creating and managing Windows Azure Websites**, and **creating and managing Windows Azure Virtual Machines**. For comprehensive reference documentation, see [Windows Azure command-line tool for Mac and Linux Documentation][reference-docs]. 

##Table of contents
* [What are the Windows Azure Command-Line Tools for Mac and Linux](#Overview)
* [How to install the Windows Azure Command-Line Tools for Mac and Linux](#Download)
* [How to create a Windows Azure account](#CreateAccount)
* [How to download and import publish settings](#Account)
* [How to create and manage a Windows Azure Web Site](#WebSites)
* [How to create and manage a Windows Azure Virtual Machine](#VMs)


<h2 id="Overview">What are the Windows Azure Command-Line Tools for Mac and Linux</h2>

The Windows Azure Command-Line Tools for Mac and Linux are a set of command-line tools for deploying and managing Windows Azure services.
 
The supported tasks include the following:

* Import publishing settings.
* Create and manage Windows Azure Websites.
* Create and manage Windows Azure Virtual Machines.

For a complete list of supported commands, type `azure -help` at the command line after installing the tools, or see the [reference documentation][reference-docs].

<h2 id="Download">How to install the Windows Azure Command-Line Tools for Mac and Linux</h2>

The following list contains information for installing the command-line tools, depending on your operating system:

* **Mac**: Download the [Windows Azure SDK Installer][mac-installer]. Open the downloaded .pkg file and complete the installation steps as you are prompted.

* **Linux** and **Windows**: Install the latest version of [Node.js][nodejs-org] (see [Install Node.js via Package Manager][install-node-linux]), then run the following command:

		npm install azure -g

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>On Linux, you may need to run this command with elevated privileges:</p>

		sudo npm install azure -g

	On Windows, you may need to run the command from a prompt with elevated privileges.
	</div>

To test the installation, type `azure` at the command prompt. If the installation was successful, you will see a list of all the available `azure` commands.

<h2 id="CreateAccount">How to create a Windows Azure account</h2>

To use the Windows Azure Command-Line Tools for Mac and Linux, you will need a Windows Azure account.

1. Open a web browser and browse to [http://www.windowsazure.com][] and click **free trial** in the upper right corner.

	![Windows Azure Website][]

	Follow the instructions for creating an account.

2. After you have signed up for an account, click **preview features** to enable the Windows Azure Web Sites and Windows Azure Virtual Machines features on your account.
	
	![open preview features tab][]

2. Select a feature to try and click **try it now**.

	![select a preview feature][]

3. Select your subscription and click the checkmark.

	![select subscription][]

<h2 id="Account">How to download and import publish settings</h2>

To get started, you need to first download and import your publish settings. This will allow you to use the tools to create and manage Azure Services. To download your publish settings, use the `account download` command:

	azure account download

This will open your default browser and prompt you to sign in to the Preview Management Portal. After signing in, your `.publishsettings` file will be downloaded. Make note of where this file is saved.

Next, import the `.publishsettings` file by running the following command, replacing `<path to .publishsettings file>` with the path to your `.publishsettings` file:

	azure account import <path to .publishsettings file>

<div class="dev-callout"> 
<b>Note</b> 
<p>You can remove all of the information stored by the <code>import</code> command by using the <code>account clear</code> command:</p>

	azure account clear

</div>

To see a list of options for `account` commands, use the `-help` option:

	azure account -help

After downloading your publish settings, you should delete the `.publishsettings` file for security reasons.

You are now ready to being creating and managing Windows Azure Websites and Windows Azure Virtual Machines.  

<h2 id="WebSites">How to create and manage a Windows Azure Web Site</h2>

To create a Windows Azure Website, you first need to change directories to your local application directory. This is necessary because the tools will write files and subdirectories that contain information for managing a site to the directory from which the `site create` command is executed. After you have changed directories, run the following command to create a site called `MySite`:

	azure site create MySite

The output from this command will contain the default URL for the newly created website.

Note that you can execute the `azure site create` command with any of the following options:

* `--location [location name]`. This option allows you to specify the location of the data center in which your website is created (e.g. "West US"). If you omit this option, you will be promted to choose a location.
* `--hostname [custom host name]`. This option allows you to specify a custom hostname for your website.
* `--git`. This option allows you to use git to publish to your website by creating git repositories in both your local application directory and in your website's data center. If your local application directory is already a git repository, the `azure site create` command will create a git repository in your website's data center regardless of whether you use the `--git` option.

To list your websites, use the following command:

	azure site list

To get detailed information about a site, use the `site show` command. The following example shows details for `MySite`:

	azure site show MySite

You can stop or start a site with the `site stop` and `site start` commands:

	azure site stop MySite
	azure site start MySite

Finally, you can delete a site with the `site delete` command:

	azure site delete MySite

To see a complete list of `site` commands, use the `-help` option:

	azure site -help 

<h2 id="VMs">How to create and manage a Windows Azure Virtual Machine</h2>

A Windows Azure Virtual Machine is created from a virtual machine image (a .vhd file) that you provide or that is available in the Image Gallery. To see images that are available, use the `vm image list` command:

	azure vm image list

You can provision and start a virtual machine from one of the available images with the `vm create` command. The following example shows how to create a Linux virtual machine (called `myVM`) from an image in the Image Gallery (CentOS 6.2). The root user name and password for the virtual machine are `myusername` and `Mypassw0rd` respectively. (Note that the `--location` parameter specifies the data center in which the virtual machine is created. If you omit the `--location` parameter, you will be prompted to choose a location.)

	azure vm create myVM OpenLogic__OpenLogic-CentOS-62-en-us-30GB myusername Mypassw0rd --location "West US"

If you would rather provision a virtual machine from a custom image, you can create an image from a .vhd file with the `vm image create` command, then use the `vm create` command to provision the virtual machine. The following example shows how to create a Linux image (called `myImage`) from a local .vhd file. (The `--location` parameter specifies the data in which the image is stored.)

	azure vm image create myImage /path/to/myImage.vhd --os linux --location "West US"

Instead of creating an image from a local .vhd, you can create an image from a .vhd stored in Windows Azure Blob Storage. You can do this with the `blob-url` parameter:

	azure vm image create myImage --blob-url <url to .vhd in Blob Storage> --os linux

After creating an image, you can provision a virtual machine from the image by using `vm create`. The command below creates a virtual machine called `myVM` from the image created above (`myImage`).

	azure vm create myVM myImage myusername Mypassw0rd --location "West US"

After you have provisioned a virtual machine, you may want to create endpoints to allow remote access to your virtual machine (for example). The following example uses the `vm create endpoint` command to open external port 22 and local port 22 on `myVM`:

	azure vm endpoint create myVM 22 22

You can get detailed information about a virtual machine (including IP address, DNS name, and endpoint information) with the `vm show` command:

	azure vm show myVM

To shutdown, start, or restart the virtual machine, use one of the following commands:

	azure vm shutdown myVM
	azure vm start myVM
	azure vm restart myVM

And finally, to delete the VM, use the `vm delete` command:

	azure vm delete myVM

For a complete list of commands for creating and managing virtual machines, use the `-h` option:

	azure vm -h


[nodejs-org]: http://nodejs.org/
[install-node-linux]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
[download-wpi]: http://www.microsoft.com/web/downloads/platform.aspx
[mac-installer]: http://go.microsoft.com/fwlink/?LinkId=252249
[reference-docs]: http://go.microsoft.com/fwlink/?LinkId=252246
[http://www.windowsazure.com]: http://www.windowsazure.com
[Windows Azure Website]: ../media/create-account-01.png
[open preview features tab]: ../media/antares-iaas-preview-01.png
[select a preview feature]: ../media/antares-iaas-preview-02.png
[select subscription]: ../media/antares-iaas-preview-03.png
