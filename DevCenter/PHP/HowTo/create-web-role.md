#How to create PHP Web or Worker Roles

<h2 id="WhatIs">What are PHP Web and Worker roles?</h2>

<h2 id="DownloadSdk">Download the Windows Azure SDK for PHP</h2>

<h2 id="CreateProject">How to: Create a Cloud Services project</h2>

The first step in creating a PHP Web or Worker role is to create a Windows Azure Service project. A Windows Azure Service project serves as a logical container for Web and Worker roles, and contains the project's [service definition (.csdef)] and [service configuration (.cscfg)] files. 

To create a new Windows Azure Servcie project, execute the following command:

	PS C:\>New-AzureServiceProject projectName

This command will create a new directory (`projectName`) to which you can add Web and Worker roles.

<h2 id="AddRole">How to: Add PHP Web or Worker roles</h2>

To add a PHP Web role to a project, use the following command:

	Add-AzurePHPWebRole roleName

For a Worker role, use this command:

	Add-AzurePHPWorkerRole roleName

<div class="dev-callout"> 
<b>Note</b> 
<p>The <code>roleName</code> parameter is optional. If it is omitted, the role name will be automatically generated. The first Web role created will be <code>WebRole1</code>, the second <code>WebRole2</code>, and so on. The first Worker role created will be <code>WorkerRole1</code>, the second <code>WorkerRole2</code>, and so on.</p> 
</div>

<h2 id="SpecifyPHPVerison">How to: Specify the built-in PHP Version</h2>
When you add a PHP Web or Worker role to a project, the project's configuration files are modified so that PHP will be installed on each Web or Worker instance of your application when it is deployed. To see the version of PHP that will be installed by default, run the following command:

	Get-AzureServiceProjectRoleRuntime

The output from the command above will look similar to the output below. In this example, the `IsDefault` flag is set to `true` for PHP 5.3.17, indicating that it will be the default PHP version installed. 

	Runtime Version		PackageUri						IsDefault
	------- ------- 	----------  					---------
   	Node 0.6.17      	http://nodertncu.blob.core...   False
   	Node 0.6.20         http://nodertncu.blob.core...   True
   	Node 0.8.4          http://nodertncu.blob.core...   False
	IISNode 0.1.21      http://nodertncu.blob.core...   True
  	Cache 1.8.0         http://nodertncu.blob.core...   True
    PHP 5.3.17          http://nodertncu.blob.core...   True
    PHP 5.4.0           http://nodertncu.blob.core...   False

You can set the PHP runtime version to any of the PHP versions listed in the output above. For example, to set the PHP version (for a role with name `roleName`) to 5.4.0, use the following command:

	Set-AzureServiceProjectRole roleName php 5.4.0

<div class="dev-callout"> 
<b>Note</b> 
<p>More PHP versions may be available in the future, and the available versions may change.</p> 
</div>

<h2 id="CustomizePHP">How to: Customize the built-in PHP runtime</h2>
You have complete control over the configuration of the PHP runtime that is installed when you follow the steps above, including modification of `php.ini` settings and enabling of extensions.

To to customize the built-in PHP runtime, follow these steps:

1. Add a new folder, named `php`, to the `bin` directory of your Web role. For a Worker role, add it to the role's root directory.
2. In the `php` folder, create another folder called `ext`. Put any `.dll` extension files (e.g. `php_mongo.dll`) you want to enable in this folder.
3. Add a `php.ini` file to the `php` folder. Enable any custom extensions and set any PHP directives in this file. For example, if you wanted to turn `display_errors` on and enable the `php_mongo.dll` extension, the contents of your `php.ini` file would be as follows:

		display_errors=On
		extension=php_mongo.dll

<div class="dev-callout"> 
<b>Note</b> 
<p>Any settings that you don't explicity set in the <code>php.ini</code> file that you provide will automatically be set to their default values. However, keep in mind that you can add a complete <code>php.ini</code> file. </p> 
</div>

<h2 id="OwnPHP">How to: Use your own PHP runtime</h2>

[service definition (.csdef)]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758711.aspx
[service configuration (.cscfg)]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758710.aspx