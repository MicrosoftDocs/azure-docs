#How to Use the Windows Azure Cross-Platform Command Line Tools

	**TODO: Intro**

##Table of Contents
* [What are the Windows Azure Cross-Platform Command Line Tools](#Overview)
* [How to Install the Windows Azure Cross-Platform Command Line Tools](#Download)
* [How to Create a Windows Azure Account](#CreateAccount)
* [How to Manage Account and Publish Settings](#Account)
* [How to Manage Certificates](#Certificates)
* [How to Manage Cloud Services](#CloudServices)
* [How to Manage Local Settings](#LocalSettings)
* [How to Manage Disk Images](#DiskImages)
* [How to Manage VM Images](#VMImages)
* [How to Manage Windows Azure Web Sites](#WebSites)
* [How to Manage Virtual Machines](#VMs)
* [How to Manage VM Endpoints](#VMEndpoints)
* [How to Manage VM Data Disks](#VMDataDisks)

<h2 id="Overview">What are the Windows Azure Cross-Platform Command Line Tools</h2>

The Windows Azure Cross-Platform Command Line Tools are a set of command-line tools for developing and deploying Windows Azure applications. These tools work on any platform, including MacIntosh, Linux, and Windows.
 
The supported tasks include the following:

* Import publishing settings to enable you to deploy services in Windows Azure.
* **(TODO: FILL out this list)**

For a complete list of supported commands, type `azure -help` at the command line after installing the tools.

<h2 id="Download">How to Install the Windows Azure Cross-Platform Command Line Tools</h2>

**For Mac users**, download the Windows Azure SDK Installer here: **TODO: Get FWLink to download site for MacInstaller**. Open the downloaded .pkg file and complete the installation steps as your are prompted.

**For Linux users**, install the latest version of Node.js (see [Install Node.js via Package Manager][install-node-linux]), then run the following command:

	npm install azure -g

**For Windows users**, **TODO: Get info from Glenn about positioning vs. Powershell**

<h2 id="CreateAccount">How to Create a Windows Azure Account</h2>

	**TODO: Reference content chunk?**

<h2 id="Account">How to Download and Import Publish Settings</h2>
Downloading and importing your publish settings will allow you to use the command-line tools to create and manage Azure Services. To download your publish settings, run the following command:

	azure account download

This will open your default browser and prompt you to sign in with your Windows Azure credentials. After signing in, your `.publishsettings` file will be downloaded.

The next step, importing the `.publishsettings` file, allows the command-line tools to create and manage Windows Azure Services. To import your `.publishsettings` file, run the following command, replacing `<path to .publishsettings file>` with the path to your .publishsettings file:

	azure account import <path to .publishsettings file>

You can remove all of the information stored by the `import` command by running the following command:

	azure account clear

	**TODO: Provide summary of other 'account' commands (if they exist)**  

<h2 id="Certificates">How to Manage Certificates</h2>

<h2 id="CloudServices">How to Manage Cloud Services</h2>

<h2 id="LocalSettings">How to Manage Local Settings</h2>

<h2 id="DiskImages">How to Manage Disk Images</h2>

<h2 id="VMImages">How to Manage VM Images</h2>

<h2 id="WebSites">How to Manage Windows Azure Web Sites</h2>

<h2 id="VMs">How to Manage Virtual Machines</h2>

<h2 id="VMEndpoints">How to Manage VM Endpoints</h2>

<h2 id="VMDataDisks">How to Manage VM Endpoints</h2>

[nodejs-org]: http://nodejs.org/
[install-node-linux]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager