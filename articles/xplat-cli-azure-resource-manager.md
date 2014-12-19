<properties urlDisplayName="Microsoft Azure Cross-Platform Command-Line Interface" pageTitle="Using Microsoft Azure Cross-Platform Command-Line Interface with the Resource Manager" title="Using Microsoft Azure Cross-Platform Command-Line Interface with the Resource Manager" metaKeywords="windows azure cross-platform command-line interface Resource Manager, windows azure command-line resource manager, azure command-line resource manager, azure cli resource manager" description="Use the Microsoft Azure Cross-Platform Command-Line Interface with the Resource Manager" metaCanonical="http://www.windowsazure.com/en-us/script/xplat-cli-intro" umbracoNaviHide="0" disqusComments="1" editor="tysonn" manager="timlt" documentationCenter="" solutions="" authors="larryfr,rasquill" services="" />

<tags ms.service="multiple" ms.workload="multiple" ms.tgt_pltfrm="command-line-interface" ms.devlang="na" ms.topic="article" ms.date="09/17/2014" ms.author="rasquill" />

#Using the Azure Cross-Platform Command-Line Interface with the Resource Manager

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/powershell-azure-resource-manager.md" title="Windows PowerShell">Windows PowerShell</a><a href="/en-us/documentation/articles/xplat-cli-azure-resource-manager.md" title="Cross-Platform CLI" class="current">Cross-Platform CLI</a></div>

We recently introduced a preview of Resource Manager, which is a new way to manage Microsoft Azure. In this article, you will learn how to use the Azure Cross-Platform Command-Line Interface (xplat-cli) to work with the Resource Manager. 

>[WACOM.NOTE] The Resource Manager is currently in preview, and does not provide the same level of management capabilities as Azure Service Management.

>[WACOM.NOTE] If you have not already installed and configured the xplat-cli, see [Install and Configure the Microsoft Azure Cross-Platform Command-Line Interface][xplatsetup] for more steps on how to install, configure, and use the xplat-cli.

##Resource Manager

The Resource Manager allows you to manage a group of _resources_ (user-managed entities such as a database server, database, or website,) as a single logical unit, or _resource group_. For example, a resource group might contain a Website and SQL Database resources.

To support a more declarative way of describing changes to resources within a resource group, Resource Manager uses *templates*, which are JSON documents. The template language also allows you to describe parameters that can be filled in either inline when running a command, or stored in a separate JSON file. This allows you to easily create new resources using the same template by simply providing different parameters. For example, a template that creates a Website will have parameters for the site name, the the region the Website will be located in, and other common parameters.

>[WACOM.NOTE] The specifics of the template language are not documented at this time. Once documentation is available, this topic will be updated to provide a link to the reference documentation.
>
> However, you can use the `azure group template download` command to download and modify templates provided by Microsoft and partners from the template gallery.

When a template is used to modify or create a group, a _deployment_ is created, which is then applied to the group.

##Authentication

Currently, working with the Resource Manager through the xplat-cli requires that you authenticate to Microsoft Azure using an organizational account. Authenticating with a Microsoft Account or a certificate installed through a .publishsettings file will not work.

For more information on authenticating using an organizational account, see [Install and Configure the Microsoft Azure Cross-Platform Command-Line Interface][xplatsetup].

##Working with Groups and Templates

1. The Resource Manager is currently in preview, so the xplat-cli commands to work with it are not enabled by default. Use the following command to enable the commands.

		azure config mode arm

	>[WACOM.NOTE] The Resource Manager mode and Azure Service Management mode are mutually exclusive. That is, resources created in one mode cannot be managed from the other mode.

2. When working with templates, you can either create your own, or use one from the Template Gallery. To list available templates from the gallery, use the following command.

		azure group template list

	The response will list the publisher and template name, and will appear similar to the following.

		data:    Publisher               Name
		data:    ----------------------------------------------------------------------------
		data:    Microsoft               Microsoft.WebSite.0.1.0-preview1
		data:    Microsoft               Microsoft.PHPStarterKit.0.1.0-preview1
		data:    Microsoft               Microsoft.HTML5EmptySite.0.1.0-preview1
		data:    Microsoft               Microsoft.ASPNETEmptySite.0.1.0-preview1
		data:    Microsoft               Microsoft.WebSiteMySQLDatabase.0.1.0-preview1

3. To view details of a template that will create an Azure Website, use the following command.

		azure group template show Microsoft.WebSiteSQLDatabase.0.1.0-preview1

	This will return descriptive information about the template.

4. Once you have selected a template, you can download it with the following command.

		azure group template download Microsoft.WebSiteSQLDatabase.0.1.0-preview1

	Downloading a template allows you to customize it to better suite your requirements. For example, adding another resource to the template.

	>[WACOM.NOTE] If you do modify the template, use the `azure group template validate` command to validate the template before using it to create or modify an existing resource group.

5. Open the template file in a text editor. Note the **parameters** collection near the top. This contains a list of the parameters that this template expects in order to create the resources described by the template. Some parameters, such as **sku** have default values, while others simply specify the type of the value, such as **siteName**. When using a template, you can supply parameters either as part of the command-line parameters, or by specifying a file containing the parameter values. Either way, the parameters must be in JSON format.

	To create a file that contains parameters for the Microsoft.WebSiteSQLDatabase.0.1.0-preview1 template, use the following data and create a file named **params.json**. Replace values beginning with **My** such as **MyWebSite** with your own values. The **siteLocation** should specify an Azure region near you, such as **North Europe** or **South Central US**.

		{
		  "siteName": {
		    "value": "MyWebSite"
		  },
		  "hostingPlanName": {
		    "value": "MyHostingPlan"
		  },
		  "siteLocation": {
		    "value": "North Europe"
		  },
		  "serverName": {
		    "value": "MySQLServer"
		  },
		  "serverLocation": {
		    "value": "North Europe"
		  },
		  "administratorLogin": {
		    "value": "MySQLAdmin"
		  },
		  "administratorLoginPassword": {
		    "value": "MySQLAdminPassword"
		  },
		  "databaseName": {
		    "value": "MySQLDB"
		  }
		}

1. After saving the **params.json** file, use the following command to create a new resource group based on the template. The `-e` parameter specifies the **params.json** file created in the previous step.

		azure group create MyGroupName "MyDataCenter" -y Microsoft.WebSiteSQLDatabase.0.1.0-preview1 -d MyDeployment -e params.json

	Replace the **MyGroupName** with the group name you wish to use, and **MyDataCenter** with the **siteLocation** value specified in the template.

	>[WACOM.NOTE] This command will return OK once the deployment has been uploaded, but before the deployment have been applied to resources in the group. To check the status of the deployment, use the following command.
	>
	> `azure group deployment show MyGroupName MyDeployment`
	> 
	> The **ProvisioningState** shows the status of the deployment.
	> 
	> If you realize that your configuration isn't correct, and need to stop a long running deployment, use the following command.
	> 
	> `azure group deployment stop MyGroupName MyDeployment`
	> 
	> If you do not provide a deployment name, one will be created automatically based on the name of the template file. It will be returned as part of the output of the `azure group create` command.

3. To view the group, use the following command.

		azure group show MyGroupName

	This command returns information about the resources in the group. If you have multiple groups, you can use the `azure group list` command to retrieve a list of group names, and then use `azure group show` to view details of a specific group.

##Working with resources

While templates allow you to declare group-wide changes in configuration, sometimes you need to work with just a specific resource. You can do this using the `azure resource` commands.

> [WACOM.NOTE] When using the `azure resource` commands other than the `list` command, you must specify the API version of the resource you are working with using the `-o` parameter. If you are unsure about the API version to use, consult the template file and find the **apiVersion** field for the resource.

1. To list all resources in a group, use the following command.

		azure resource list MyGroupName

1. To view individual resources, such as the Website, within the group, use the following command.

		azure resource show MyGroupName MyWebSiteName Microsoft.Web/sites -o "2014-04-01"

	Notice the **Microsoft.Web/sites** parameter. This indicates the type of the resource you are requesting information on. If you look at the template file downloaded earlier, you will notice that this same value is used to define the type of the Website resource described in the template.

	This command returns information related to the website. For example, the **hostNames** field should contain the URL for the website. Use this with your browser to verify that the website is running.

2. When viewing details on a resource, it is often useful to use the `--json` parameter, as this makes the output more readable as some values are nested structures, or collections. The following demonstrates returning the results of the show command as a JSON document.

		azure resource show MyGroupName MyWebSite Microsoft.Web/sites -o "2014-04-01" --json

	>[WACOM.NOTE] You can save the JSON data to file by using the &gt; character to pipe the output to file. For example:
	>
	> `azure resource show MyGroupName MyWebSite Micrsoft.Web/sites --json > myfile.json`

3. To delete an existing resource, use the following command.

		azure resource delete MyGroupName MyWebSite Microsoft.Web/sites -o "2014-04-01"

##Logging

To view logged information on operations performed on a group, use the `azure group log show` command. By default, this will list last operation performed on the group. To view all operations, use the optional `--all` parameter. For the last deployment, use `--last-deployment`. For a specific deployment, use `--deployment` and specify the deployment name. The following example returns a log of all operations performed against the group 'MyGroup'.

	azure group log show mygroup --all

##Next steps

* For more information on using the Azure Cross-Platform Command-Line Interface, see [Install and Configure the Microsoft Azure Cross-Platform Command-Line Interface][xplatsetup].
* For information on working with Resource Manager using Windows Azure PowerShell, see [Getting Started using Windows PowerShell with Resource Manager][psrm]

[signuporg]: http://www.windowsazure.com/en-us/documentation/articles/sign-up-organization/
[adtenant]: http://technet.microsoft.com/en-us/library/jj573650#createAzureTenant
[portal]: https://manage.windowsazure.com/
[xplatsetup]: /en-us/documentation/articles/xplat-cli/
[psrm]: http://go.microsoft.com/fwlink/?LinkId=394760
