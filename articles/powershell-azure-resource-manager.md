<properties pageTitle="Using Windows PowerShell with Resource Manager" metaKeywords="ResourceManager, PowerShell, Azure PowerShell" description="Use Windows PowerShell to create a resource group" metaCanonical="" services="" documentationCenter="" title="Using Windows PowerShell with Resource Manager" authors="stevenka; juneb" solutions="" manager="stevenka" editor="mollybos" />

<tags ms.service="multiple" ms.workload="multiple" ms.tgt_pltfrm="powershell" ms.devlang="na" ms.topic="article" ms.date="12/02/2014" ms.author="stevenka" />

# Using Windows PowerShell with Resource Manager #

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/powershell-azure-resource-manager.md" title="Windows PowerShell" class="current">Windows PowerShell</a><a href="/en-us/documentation/articles/xplat-cli-azure-resource-manager.md" title="Cross-Platform CLI">Cross-Platform CLI</a></div>

Resource Manager introduces an entirely new way of thinking about your Azure resources. Instead of creating and managing individual resources, you begin by imagining a complex service, such as a blog, a photo gallery, a SharePoint portal, or a wiki. You use a template -- a resource model of the service --  to create a resource group with the resources that you need to support the service. Then, you can manage and deploy that resource group as a logical unit. 

In this tutorial, you learn how to use Windows PowerShell with Resource Manager for Microsoft Azure. It walks you through the process of creating and deploying a resource group for an Azure-hosted website (or web application) with a SQL database, complete with all of the resources that you need to support it.

**Estimated time to complete:** 15 minutes


## Prerequisites ##

Before you can use Windows PowerShell with Resource Manager, you must have the following:

- Windows PowerShell, Version 3.0 or 4.0. To find the version of Windows PowerShell, type:`$PSVersionTable` and verify that the value of `PSVersion` is 3.0 or 4.0. To install a compatible version, see [Windows Management Framework 3.0 ](http://www.microsoft.com/en-us/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/en-us/download/details.aspx?id=40855).
	
- Azure PowerShell version 0.8.0 or later. To install the latest version and associate it with your Azure subscription, see [How to install and configure Windows Azure PowerShell](http://www.windowsazure.com/en-us/documentation/articles/install-configure-powershell/).

This tutorial is designed for Windows PowerShell beginners, but it assumes that you understand the basic concepts, such as modules, cmdlets, and sessions. For more information about Windows PowerShell, see [Getting Started with Windows PowerShell](http://technet.microsoft.com/en-us/library/hh857337.aspx).

To get detailed help for any cmdlet that you see in this tutorial, use the Get-Help cmdlet. 

	Get-Help <cmdlet-name> -Detailed

For example, to get help for the Add-AzureAccount cmdlet, type:

	Get-Help Add-AzureAccount -Detailed

## In this tutorial ##
* [About the Azure Powershell Modules](#about)
* [Create a resource group](#create)
* [Manage a resource group](#manage)
* [Troubleshoot a resource group](#troubleshoot)
* [Next steps](#next)



##<a id="about"></a>About the Azure PowerShell Modules ##
Beginning in version 0.8.0, the Azure PowerShell installation includes three Windows PowerShell modules:

- **Azure**: Includes the traditional cmdlets for managing individual resources, such as storage accounts, websites, databases, virtual machines, and media services. For more information, see [Azure Service Management Cmdlets](http://msdn.microsoft.com/en-us/library/jj152841.aspx).

- **AzureResourceManager**: Includes cmdlets for creating, managing, and deploying the Azure resources for a resource group. For more information, see [Azure Resource Manager Cmdlets](http://go.microsoft.com/fwlink/?LinkID=394765).

- **AzureProfile**: Includes cmdlets common to both modules, such as Add-AzureAccount, Get-AzureSubscription, and Switch-AzureMode. For more information, see [Azure Profile Cmdlets](http://go.microsoft.com/fwlink/?LinkID=394766).

>[AZURE.NOTE] The Azure Resource Manager module is currently in preview. It might not provide the same management capabilities as the Azure module. 

The Azure and Azure Resource Manager modules are not designed to be used in the same Windows PowerShell session. To make it easy to switch between them, we have added a new cmdlet, **Switch-AzureMode**, to the Azure Profile module.

When you use Azure PowerShell, the cmdlets in the Azure module are imported by default. To switch to the Azure Resource Manager module, use the Switch-AzureMode cmdlet. It removes the Azure module from your session and imports the Azure Resource Manager and Azure Profile modules.

To switch to the AzureResoureManager module, type:

    PS C:\> Switch-AzureMode -Name AzureResourceManager

To switch back to the Azure module, type:

    PS C:\> Switch-AzureMode -Name AzureServiceManagement

By default, Switch-AzureMode affects only the current session. To make the switch effective in all Windows PowerShell sessions, use the **Global** parameter of Switch-AzureMode.

For help with the Switch-AzureMode cmdlet, type: `Get-Help Switch-AzureMode` or see [Switch-AzureMode](http://go.microsoft.com/fwlink/?LinkID=394398).
  
To get a list of cmdlets in the AzureResourceManager module with a help synopsis, type: 

	PS C:\> Get-Command -Module AzureResourceManager | Get-Help | Format-Table Name, Synopsis

	Name                                   Synopsis
	----                                   --------
	Get-AzureLocation                      Gets the Azure data center locations and the resource types that they support
	Get-AzureResource                      Gets Azure resources
	Get-AzureResourceGroup                 Gets Azure resource groups
	Get-AzureResourceGroupDeployment       Gets the deployments in a resource group.
	Get-AzureResourceGroupGalleryTemplate  Gets resource group templates in the gallery
	Get-AzureResourceGroupLog              Gets the deployment log for a resource group
	New-AzureResource                      Creates a new resource in a resource group
	New-AzureResourceGroup                 Creates an Azure resource group and its resources
	New-AzureResourceGroupDeployment       Add an Azure deployment to a resource group.
	Remove-AzureResource                   Deletes a resource
	Remove-AzureResourceGroup              Deletes a resource group.
	Save-AzureResourceGroupGalleryTemplate Saves a gallery template to a JSON file
	Set-AzureResource                      Changes the properties of an Azure resource.
	Stop-AzureResourceGroupDeployment      Cancels a resource group deployment
	Test-AzureResourceGroupTemplate        Detects errors in a resource group template or template parameters


To get full help for a cmdlet, type a command with the format:

	Get-Help <cmdlet-name> -Full

For example, 

	Get-Help Get-AzureLocation -Full

  
#<a id="create"></a> Create a resource group#

This section of the tutorial guides you through the process of creating and deploying a resource group for a website with a SQL database. 

You don't need to be an expert in Azure, SQL, websites, or resource management to do this task. The templates provide a model of the resource group with all of the resources that you're likely to need. And because we're using Windows PowerShell to automate the tasks, you can use these process as a model for scripting large-scale tasks.

## Step 1: Switch to Azure Resource Manager 
1. Start Windows PowerShell. You can use any host program that you like, such as the Windows PowerShell console or Windows PowerShell ISE.

2. Use the **Switch-AzureMode** cmdlet to import the cmdlets in the AzureResourceManager and AzureProfile modules. 

	`PS C:\>Switch-AzureMode AzureResourceManager`

3. To add your Azure account to the Windows PowerShell session, use the **Add-AzureAccount** cmdlet. 

    `PS C:\> Add-AzureAccount`

The cmdlet prompts you for an email address and password. Then it downloads your account settings so they are available to Windows PowerShell. 

The account settings expire, so you need to refresh them occasionally. To refresh the account settings, run **Add-AzureAccount** again. 

>[AZURE.NOTE] The AzureResourceManager module requires Add-AzureAccount. A Publish Settings file is not sufficient.     



## Step 2: Select a gallery template ##

There are several ways to create a resource group and its resources, but the easiest way  is to use a resource group template. A *resource group template* is JSON string that defines the resources in a resource group. The string includes placeholders called "parameters" for user-defined values, like names and sizes.

Azure hosts a gallery of resource group templates and you can create your own templates, either from scratch or by editing a gallery template. In this tutorial, we'll use a gallery template. 

To search for a template in the Azure resource group template gallery, use the **Get-AzureResourceGroupGalleryTemplate** cmdlet.  

At the Windows Powershell prompt, type:
    
    PS C:\> Get-AzureResourceGroupGalleryTemplate

The cmdlet returns a list of gallery templates with Publisher and Identity properties. You use the **Identity** property to identify the template in the commands.

    Publisher       Identity
    ---------       --------
    Ghost           Ghost.Ghost.0.1.0-preview1
	Joomla          Joomla.Joomla.0.1.0-preview1
	Microsoft       Microsoft.ASPNETEmptySite.0.1.0-preview1
    Microsoft       Microsoft.ASPNETstarterSite.0.1.0-preview1
    Microsoft       Microsoft.Bakery.0.1.0-preview1
    Microsoft       Microsoft.Boilerplate.0.1.0-preview1
	...

TIP: To recall the last command, press the up-arrow key.

The Microsoft.WebSiteSQLDatabase.0.2.2-preview template looks interesting. To get more information about a gallery template, use the **Identity** parameter. The value of the Identity parameter is Identity of the template.

    PS C:\> Get-AzureResourceGroupGalleryTemplate -Identity Microsoft.WebSiteSQLDatabase.0.2.2-preview

The cmdlet returns an object with much more information about the template, including a description.

	<p>Windows Azure Websites offers secure and flexible development, 
	deployment and scaling options for any sized web application. Leverage 
	your existing tools to create and deploy applications without the hassle 
	of managing infrastructure.</p>

This template looks like it will meet our needs. Let's save it to disk and look at it more closely.

>[AZURE.NOTE] There can be new versions of the template. If the specific template identity doesn't exist, please find one with a valid version.

## Step 3: Examine the Template

Let's save the template to a JSON file on disk. This step is not required, but it makes it easier to view the template. To save the template, use the **Save-AzureResourceGroupGalleryTemplate** cmdlet. Use its **Identity** parameter to specify the template and the **Path** parameter to specify a path on disk.

Save-AzureResourceGroupGalleryTemplate saves the template and returns the path a file name of the JSON template file. 

	PS C:\> Save-AzureResourceGroupGalleryTemplate -Identity Microsoft.WebSiteSQLDatabase.0.2.2-preview -Path D:\Azure\Templates

	Path
	----
	D:\Azure\Templates\Microsoft.WebSite.0.1.0-preview1.json


You can view the template file in a text editor, such as Notepad. Each template has a **resources** section and a **parameters** section.

The **resources** section of the template lists the resources that the template creates. This template creates a SQL database server and SQL database, a server farm and website, and several management settings.
  
The definition of each resource includes its properties, such as name, type and location, and parameters for user-defined values. For example, this section of the template defines the SQL database. It includes parameters for the database name ([parameters('databaseName')]), the database server location [parameters('serverLocation')], and the collation property [parameters('collation')].

		{
          "name": "[parameters('databaseName')]",
          "type": "databases",
          "location": "[parameters('serverLocation')]",
          "apiVersion": "2.0",
          "dependsOn": [
            "[concat('Microsoft.Sql/servers/', parameters('serverName'))]"
          ],
          "properties": {
            "edition": "Web",
            "collation": "[parameters('collation')]",
            "maxSizeBytes": "1073741824"
          }
        },

The **parameters** section of the template is a collection of the parameters that are defined in all of the resources. It includes the databaseName, serverLocation, and collation properties.

	"parameters": {
	...    

    "serverLocation": {
      "type": "string"
    }, 
	...

    "databaseName": {
      "type": "string"
    },
    "collation": {
      "type": "string",
      "defaultValue": "SQL_Latin1_General_CP1_CI_AS"
    }

Some parameters have a default value. When you use the template, you are not required to supply values for these parameters. If you do not specify a value, the default value is used. 

	"collation": {
	      "type": "string",
	      "defaultValue": "SQL_Latin1_General_CP1_CI_AS"
	    }

When parameters that have enumerated values, the valid values are listed with the parameter. For example, the **sku** parameter can take values of Free, Shared, Basic, or Standard. If you don't specify a value for the **sku** parameter, it uses the default value, Free.

    "sku": {
      "type": "string",
      "allowedValues": [
        "Free",
        "Shared",
        "Basic",
        "Standard"
      ],
      "defaultValue": "Free"
    },


Note that the **administratorLoginPassword** parameter uses a secure string, not plain text. When you provide a value for a secure string, the value is obscured. 

	"administratorLoginPassword": {
      "type": "securestring"
    },


We're almost ready to use the template, but before we do, we need to find locations for each of the resources.

## Step 4: Get resource type locations

Most templates ask you to specify a location for each of the resources in a resource group. Every resource is located in an Azure data center, but not every Azure data center supports every resource type. 

Select any location that supports the resource type. The resources in a resource group do not need to be in the same location, and they do not need to be in the same location as the resource group or the subscription.

To get the locations that support each resource type, use the **Get-AzureLocation** cmdlet. Here is a excerpt from the output. (This output might be different from yours. The details are likely to change over time.)

	Name                                 Locations
	----                                 ---------
	ResourceGroup                        East Asia, South East Asia, East US, West US, North Central US,
										 South Central US, Central US, North Europe, West Europe

	Microsoft.Sql/servers/databases      Brazil South, Central US, East Asia, East US, East US 2, Japan
	                                     East, Japan West, North Central US, North Europe, South Central US,
	                                     Southeast Asia, West Europe, West US

	Microsoft.Web/serverFarms            Brazil South, East Asia, East US, Japan East, Japan West, North
	                                     Central US, North Europe, West Europe, West US

	Microsoft.Web/sites                  Brazil South, East Asia, East US, Japan East, Japan West, North
	                                     Central US, North Europe, West Europe, West US

Now, we have the information that we need to create the resource group.

## Step 5: Create a resource group
 
In this step, we'll use the resource group template to create the resource group. For reference, open the Microsoft.WebSiteSQLDatabase.0.2.2-preview JSON file on disk and follow along. 

To create a resource group, use the **New-AzureResourceGroup** cmdlet.

The command uses the **Name** parameter to specify a name for the resource group and the **Location** parameter to specify its location. Use the output of **Get-AzureLocation** to select a location for the resource group. It uses the **GalleryTemplateIdentity** parameter to specify the gallery template.

	PS C:\> New-AzureResourceGroup ` 
			-Name TestRG1 `
			-Location "East Asia" `
			-GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.2-preview `
            ....

As soon as you type the template name, New-AzureResourceGroup fetches the template, parses it, and adds the template parameters to the command dynamically. This makes it very easy to specify the template parameter values. And, if you forget a required parameter value, Windows PowerShell prompts you for the value.

**Dynamic Template Parameters**

To get the parameters, type a minus sign (-) to indicate a parameter name and then press the TAB key. Or, type the first few letters of a parameter name, such as siteName and then press the TAB key. 

		PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.2-preview 
		-si<TAB>

Windows PowerShell completes the parameter name. To cycle through the parameter names, press TAB repeatedly.

		PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.2-preview 
		-siteName 

Enter a name for the website and repeat the TAB process for each of the parameters. The parameters with a default value are optional. To accept the default value, omit the parameter from the command. 

When a template parameter has enumerated values, such as the sku parameter in this template, to cycle through the parameter values, press the TAB key.

		PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.2-preview 
		-siteName TestSite -sku <TAB>

		PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.2-preview 
		-siteName TestSite -sku Free<TAB>

		PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.2-preview 
		-siteName TestSite -sku Basic<TAB>

Here is an example of a New-AzureResourceGroup command that specifies only the required template parameters and the **Verbose** common parameter. Note that the **administratorLoginPassword** is omitted. (The backtick (`) is the Windows PowerShell line continuation character.)

	PS C:\> New-AzureResourceGroup 
	-Name TestRG `
	-Location "East Asia" `
	-GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.2-preview `
	-siteName TestSite `
	-hostingPlanName TestPlan `
	-siteLocation "North Europe" `
	-serverName testserver `
	-serverLocation "West US" `
	-administratorLogin Admin01 `
	-databaseName TestDB `
	-Verbose

When you enter the command, you are prompted for the missing mandatory parameter, **administratorLoginPassword**. And, when you type the password, the secure string value is obscured. This strategy eliminates the risk of providing a password in plain text.

	cmdlet New-AzureResourceGroup at command pipeline position 1
	Supply values for the following parameters:
	(Type !? for Help.)
	administratorLoginPassword: **********

**New-AzureResourcGroup** returns the resource group that it created and deployed. Here is the output of the command, including the verbose output.

	VERBOSE: 3:47:30 PM - Create resource group 'TestRG' in location 'East Asia'
	VERBOSE: 3:47:30 PM - Template is valid.
	VERBOSE: 3:47:31 PM - Create template deployment 'Microsoft.WebSiteSQLDatabase.0.2.2-preview'
	using template https://gallerystoreprodch.blob.core.windows.net/prod-microsoft-windowsazure-gallery/8D6B920B-10F4-4B5A-B3DA-9D398FBCF3EE.PUBLICGALLERYITEMS.Microsoft.WebSiteSQLDatabase.0.2.2-preview/DeploymentTemplates/Website_NewHostingPlan_SQL_NewDB-Default.json.
	VERBOSE: 3:47:43 PM - Resource Microsoft.Sql/servers 'testserver' provisioning status is succeeded
	VERBOSE: 3:47:43 PM - Resource Microsoft.Web/serverFarms 'TestPlan' provisioning status is
	succeeded
	VERBOSE: 3:47:47 PM - Resource Microsoft.Sql/servers/databases 'testserver/TestDB' provisioning status is succeeded
	VERBOSE: 3:47:47 PM - Resource microsoft.insights/autoscalesettings 'TestPlan-TestRG'
	provisioning status is succeeded
	VERBOSE: 3:47:47 PM - Resource Microsoft.Sql/servers/firewallrules
	'testserver/AllowAllWindowsAzureIps' provisioning status is succeeded
	VERBOSE: 3:47:50 PM - Resource Microsoft.Web/Sites 'TestSite' provisioning status is succeeded
	VERBOSE: 3:47:54 PM - Resource Microsoft.Web/Sites/config 'TestSite/web' provisioning status is succeeded
	VERBOSE: 3:47:54 PM - Resource microsoft.insights/alertrules 'ServerErrors-TestSite' provisioning
	status is succeeded
	VERBOSE: 3:47:57 PM - Resource microsoft.insights/components 'TestSite' provisioning status is succeeded
	
	
	ResourceGroupName : TestRG
	Location          : eastasia
	ProvisioningState : Succeeded
	Resources         :
                    Name                   Type                                  Location
                    =====================  ====================================  =========
                    ServerErrors-TestSite  microsoft.insights/alertrules         eastus
                    TestPlan-TestRG        microsoft.insights/autoscalesettings  eastus
                    TestSite               microsoft.insights/components         centralus
                    testserver             Microsoft.Sql/servers                 westus
                    TestDB                 Microsoft.Sql/servers/databases       westus
                    TestPlan               Microsoft.Web/serverFarms             westus
                    TestSite               Microsoft.Web/sites                   westus


In just a few steps, we created and deployed the resources required for a complex website. 
The gallery template provided almost all of the information that we needed to do this task.
And, the task is easily automated. 

#<a id="manage"></a> Manage a Resource Group

After creating a resource group, you can use the cmdlets in the AzureResourceManager module to manage the resource group, change it, add resources to it, remove it.

- To get the resource groups in your subscription, use the **Get-AzureResourceGroup** cmdlet:

		PS C:>Get-AzureResourceGroup

		ResourceGroupName : TestRG
		Location          : eastasia
		ProvisioningState : Succeeded
		Resources         :
	                    Name                   Type                                  Location
	                    =====================  ====================================  =========
	                    ServerErrors-TestSite  microsoft.insights/alertrules         eastus
	                    TestPlan-TestRG        microsoft.insights/autoscalesettings  eastus
	                    TestSite               microsoft.insights/components         centralus
	                    testserver             Microsoft.Sql/servers                 westus
	                    TestDB                 Microsoft.Sql/servers/databases       westus
	                    TestPlan               Microsoft.Web/serverFarms             westus
	                    TestSite               Microsoft.Web/sites                   westus

- To get the resources in the resource group, use the **GetAzureResource** cmdlet and its ResourceGroupName parameter. Without parameters, Get-AzureResource gets all resources in your Azure subscription.

		PS C:\> Get-AzureResource -ResourceGroupName TestRG
		
		Name                   ResourceType                          Location
		----                   ------------                          --------
		ServerErrors-TestSite  microsoft.insights/alertrules         eastus
	    TestPlan-TestRG        microsoft.insights/autoscalesettings  eastus
	    TestSite               microsoft.insights/components         centralus
	    testserver             Microsoft.Sql/servers                 westus
	    TestDB                 Microsoft.Sql/servers/databases       westus
	    TestPlan               Microsoft.Web/serverFarms             westus
	    TestSite               Microsoft.Web/sites                   westus



- To add a resource to the resource group, use the **New-AzureResource** cmdlet. This command adds a new website to the TestRG resource group. This command is a bit more complex, because it does not use a template. 

		PS C:\>New-AzureResource -Name TestSite2 `
		-Location "North Europe" `
		-ResourceGroupName TestRG `
		-ResourceType "Microsoft.Web/sites" `
		-ApiVersion 2004-04-01 `
		-PropertyObject @{"name" = "TestSite2"; "siteMode"= "Limited"; "computeMode" = "Shared"}

- To add a new template-based deployment to the resource group, use the **New-AzureResourceGroupDeployment** command. 

		PS C:\>New-AzureResourceGroupDeployment ` 
		-ResourceGroupName TestRG `
		-GalleryTemplateIdentity Microsoft.WebSite.0.1.0-preview1 `
		-siteName TestWeb2 `
		-hostingPlanName TestDeploy2 `
		-siteMode Limited `
		-computeMode Dedicated `
		-siteLocation "North Europe" `
		-subscriptionID "9b14a38b-4b93-4554-8bb0-3cefb47abcde" `
		-resourceGroup TestRG


- To delete a resource from the resource group, use the **Remove-AzureResource** cmdlet. This cmdlet deletes the resource, but does not delete the resource group.

	This command removes the TestSite2 website from the TestRG resource group.

		Remove-AzureResource -Name TestSite2 `
			-Location "North Europe" `
			-ResourceGroupName TestRG `
			-ResourceType "Microsoft.Web/sites" `
			-ApiVersion 2004-04-01

- To delete a resource group, use the **Remove-AzureResourceGroup** cmdlet. This cmdlet deletes the resource group and its resources.

		PS C:\ps-test> Remove-AzureResourceGroup -Name TestRG
		
		Confirm
		Are you sure you want to remove resource group 'TestRG'
		[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y


#<a id="troubleshoot"></a> Troubleshoot a Resource Group
As you experiment with the cmdlets in the AzureResourceManager modules, you are likely to encounter errors. Use the tips in this section to resolve them.

## Preventing errors

The AzureResourceManager module includes cmdlets that help you to prevent errors.


- **Get-AzureLocation**: This cmdlet gets the locations that support each type of resource. Before you enter a location for a resource, use this cmdlet to verify that the location supports the resource type.


- **Test-AzureResourceGroupTemplate**: Test your template and template parameter before you use them. Enter a custom or gallery template and the template parameter values you plan to use. This cmdlet tests whether the template is internally consistent and whether your parameter value set matches the template. 



## Fixing errors

- **Get-AzureResourceGroupLog**: This cmdlet gets the entries in the log for each  deployment of the resource group. If something goes wrong, begin by examining the deployment logs. 

- **Verbose and Debug**:  The cmdlets in the AzureResourceManager module call REST APIs that do the actual work. To see the messages that the APIs return, set the $DebugPreference variable to "Continue" and use the Verbose common parameter in your commands. The messages often provide vital clues about the cause of any failures.

- **Your Azure credentials have not been set up or have expired**:  To refresh the credentials in your Windows PowerShell session, use the Add-AzureAccount cmdlet. The credentials in a publish settings file are not sufficient for the cmdlets in the AzureResourceManager module.


#<a id="next"></a> Next Steps
To learn more about using Windows PowerShell with Resource Manager:
 
- [Azure Resource Manager Cmdlets](http://go.microsoft.com/fwlink/?LinkID=394765&clcid=0x409): Learn to use the cmdlets in the AzureResourceManager module.
- [Using Resource groups to manage your Azure resources](http://azure.microsoft.com/en-us/documentation/articles/azure-preview-portal-using-resource-groups): Learn how to create and manage resource groups in the Azure Management Portal.
- [Using the Azure Cross-Platform Command-Line Interface with the Resource Manager](http://www.windowsazure.com/en-us/documentation/articles/xplat-cli-azure-resource-manager/): Learn how to create and manage resource groups with command-line tools that work on many operating system platforms. 
- [Azure blog](http://blogs.msdn.com/windowsazure): Learn about new features in Azure.
- [Windows PowerShell blog](http://blogs.msdn.com/powershell): Learn about new features in Windows PowerShell.
- ["Hey, Scripting Guy!" Blog](http://blogs.technet.com/b/heyscriptingguy/): Get real-world tips and tricks from the Windows PowerShell community.
