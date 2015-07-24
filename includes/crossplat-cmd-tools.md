#How to use the Azure Command-Line Tools for Mac and Linux

This guide describes how to use the Azure Command-Line Tools for Mac and Linux to create and manage services in Azure. The scenarios covered include **installing the tools**, **importing your publishing settings**, **creating and managing Azure Websites**, and **creating and managing Azure Virtual Machines**. For comprehensive reference documentation, see [Azure command-line tool for Mac and Linux Documentation][reference-docs]. 

##Table of contents
* [What are the Azure Command-Line Tools for Mac and Linux](#Overview)
* [How to install the Azure Command-Line Tools for Mac and Linux](#Download)
* [How to create an Azure account](#CreateAccount)
* [How to download and import publish settings](#Account)
* [How to create and manage an Azure Web Site](#WebSites)
* [How to create and manage an Azure Virtual Machine](#VMs)


<h2><a id="Overview"></a>What are the Azure Command-Line Tools for Mac and Linux</h2>

The Azure Command-Line Tools for Mac and Linux are a set of command-line tools for deploying and managing Azure services.
 
The supported tasks include the following:

* Import publishing settings.
* Create and manage Azure Websites.
* Create and manage Azure Virtual Machines.

For a complete list of supported commands, type `azure -help` at the command line after installing the tools, or see the [reference documentation][reference-docs].

<h2><a id="Download">How to install the Azure Command-Line Tools for Mac and Linux</a></h2>

The following list contains information for installing the command-line tools, depending on your operating system:

* **Mac**: Download the [Azure SDK Installer][mac-installer]. Open the downloaded .pkg file and complete the installation steps as you are prompted.

* **Linux**: Install the latest version of [Node.js][nodejs-org] (see [Install Node.js via Package Manager][install-node-linux]), then run the following command:

		npm install azure-cli -g

	**Note**: You may need to run this command with elevated privileges:

		sudo npm install azure-cli -g

* **Windows**: Run the Winows installer (.msi file), which is available here: [Azure Command Line Tools][windows-installer].


To test the installation, type `azure` at the command prompt. If the installation was successful, you will see a list of all the available `azure` commands.

<h2><a id="CreateAccount"></a>How to create an Azure account</h2>

To use the Azure Command-Line Tools for Mac and Linux, you will need an Azure account.

Open a web browser and browse to [http://www.windowsazure.com][windowsazuredotcom] and click **free trial** in the upper right corner.

![Azure Web Site][Azure Web Site]

Follow the instructions for creating an account.

<h2><a id="Account"></a>How to download and import publish settings</h2>

To get started, you need to first download and import your publish settings. This will allow you to use the tools to create and manage Azure Services. To download your publish settings, use the `account download` command:

	azure account download

This will open your default browser and prompt you to sign in to the Management Portal. After signing in, your `.publishsettings` file will be downloaded. Make note of where this file is saved.

Next, import the `.publishsettings` file by running the following command, replacing `{path to .publishsettings file}` with the path to your `.publishsettings` file:

	azure account import {path to .publishsettings file}

You can remove all of the information stored by the <code>import</code> command by using the <code>account clear</code> command:

	azure account clear

To see a list of options for `account` commands, use the `-help` option:

	azure account -help

After importing your publish settings, you should delete the `.publishsettings` file for security reasons.

> [AZURE.NOTE] When you import publish settings, credentials for accessing your Azure subscription are stored inside your `user` folder. Your `user` folder is protected by your operating system. However, it is recommended that you take additional steps to encrypt your `user` folder. You can do so in the following ways:    
> 
> - On Windows, modify the folder properties or use BitLocker.
> - On Mac, turn on FileVault for the folder.
> - On Ubuntu, use the Encrypted Home directory feature. Other Linux distributions offer equivalent features.

You are now ready to being creating and managing Azure Websites and Azure Virtual Machines.  

<h2><a id="WebSites"></a>How to create and manage an Azure Website</h2>

###Create a Website

To create an Azure website, first create an empty directory called `MySite` and browse into that directory.

Then, run the following command:

	azure site create MySite --git

The output from this command will contain the default URL for the newly created website. The `--git` option allows you to use git to publish to your website by creating git repositories in both your local application directory and in your website's data center. Note that if your local folder is already a git repository, the command will add a new remote to the existing repository, pointing to the repository in your website's data center.

Note that you can execute the `azure site create` command with any of the following options:

* `--location [location name]`. This option allows you to specify the location of the data center in which your website is created (e.g. "West US"). If you omit this option, you will be promted to choose a location.
* `--hostname [custom host name]`. This option allows you to specify a custom hostname for your website.

You can then add content to your website directory. Use the regular git flow (`git add`, `git commit`) to commit your content. Use the following git command to push your website content to Azure: 

	git push azure master

###Set up publishing from GitHub

To set up continuous publishing from a GitHub repository, use the `--GitHub` option when creating a site:

	auzre site create MySite --github --githubusername username --githubpassword password --githubrepository githubuser/reponame

If you have a local clone of a GitHub repository or if you have a repository with a single remote reference to a GitHub repository, this command will automatically publish code in the GitHub repository to your site. From then on, any changes pushed to the GitHub repository will automatically be published to your site.

When you set up publishing from GitHub, the default branch used is the master branch. To specify a different branch, execute the following command from your local repository:

	azure site repository <branch name>

###Configure app settings

App settings are key-value pairs that are available to your application at runtime. When set for an Azure Website, app setting values will override settings with the same key that are defined in your site's Web.config file. For Node.js and PHP applications, app settings are available as environment variables. The following example shows you how to set a key-value pair:

	azure site config add <key>=<value> 

To see a list of all key/value pairs, use the following:

	azure site config list 

Or if you know the key and want to see the value, you can use:

	azure site config get <key> 

If you want to change the value of an existing key you must first clear the existing key and then re-add it. The clear command is:

	azure site config clear <key> 

###List and show sites

To list your websites, use the following command:

	azure site list

To get detailed information about a site, use the `site show` command. The following example shows details for `MySite`:

	azure site show MySite

###Stop, start, or restart a site

You can stop, start, or restart a site with the `site stop`, `site start`, or `site restart` commands:

	azure site stop MySite
	azure site start MySite
	azure site restart MySite

###Delete a site

Finally, you can delete a site with the `site delete` command:

	azure site delete MySite

Note that if you are running any of above commands from inside the folder where you ran `site create`, you do not need to specify the site name `MySite` as the last parameter.

To see a complete list of `site` commands, use the `-help` option:

	azure site -help 

<h2><a id="VMs"></a>How to create and manage an Azure Virtual Machine</h2>

an Azure Virtual Machine is created from a virtual machine image (a .vhd file) that you provide or that is available in the Image Gallery. To see images that are available, use the `vm image list` command:

	azure vm image list

You can provision and start a virtual machine from one of the available images with the `vm create` command. The following example shows how to create a Linux virtual machine (called `myVM`) from an image in the Image Gallery (CentOS 6.2). The root user name and password for the virtual machine are `myusername` and `Mypassw0rd` respectively. (Note that the `--location` parameter specifies the data center in which the virtual machine is created. If you omit the `--location` parameter, you will be prompted to choose a location.)

	azure vm create myVM OpenLogic__OpenLogic-CentOS-62-20120509-en-us-30GB.vhd myusername --location "West US"

You may consider passing the `--ssh` flag (Linux) or `--rdp` flag (Windows) to `vm create` to enable remote connections to the newly-created virtual machine.

If you would rather provision a virtual machine from a custom image, you can create an image from a .vhd file with the `vm image create` command, then use the `vm create` command to provision the virtual machine. The following example shows how to create a Linux image (called `myImage`) from a local .vhd file. (The `--location` parameter specifies the data in which the image is stored.)

	azure vm image create myImage /path/to/myImage.vhd --os linux --location "West US"

Instead of creating an image from a local .vhd, you can create an image from a .vhd stored in Azure Blob Storage. You can do this with the `blob-url` parameter:

	azure vm image create myImage --blob-url <url to .vhd in Blob Storage> --os linux

After creating an image, you can provision a virtual machine from the image by using `vm create`. The command below creates a virtual machine called `myVM` from the image created above (`myImage`).

	azure vm create myVM myImage myusername --location "West US"

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

<!-- IMAGES -->
[Azure Web Site]: ./media/crossplat-cmd-tools/freetrial.png

<!-- LINKS -->
[nodejs-org]: http://nodejs.org/
[install-node-linux]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
[mac-installer]: http://go.microsoft.com/fwlink/?LinkId=252249
[windows-installer]: http://go.microsoft.com/fwlink/?LinkID=275464
[reference-docs]: http://go.microsoft.com/fwlink/?LinkId=252246
[windowsazuredotcom]: http://www.windowsazure.com

