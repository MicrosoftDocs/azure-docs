# Using Windows PowerShell with Resource Manager #

Resource Manager introduces an entirely new way of thinking about your Azure resources. Instead of creating and managing individual resources, you begin by imagining a complex service, such as a blog, a photo gallery, a SharePoint portal, or a wiki. You use a template -- a resource model of the service --  to create a resource group with the resources that you need to support the service. Then, you can manage and deploy that resource group as a logical unit. For information about Resource Manager concepts, see [Resource Manager](http://go.microsoft.com/fwlink/?LinkId=394760).

In this tutorial, you learn how to use Windows PowerShell with Resource Manager for Microsoft Azure. It walks you through the process of creating and deploying a resource group for a Azure-hosted web site (or web application) with a SQL database, complete with all of the resources that you need to support it.

**Estimated time to complete:** 30 minutes


## Prerequisites ##

Before you can use Windows PowerShell with Resource Manager, you must have the following:

- Windows PowerShell, Version 3.0 or later. To find the version of Windows PowerShell, type:`$PSVersionTable` and verify that the value of `PSVersion` is 3.0 or greater. To install a newer version, see [Windows Management Framework 3.0 ](http://www.microsoft.com/en-us/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/en-us/download/details.aspx?id=40855).
	
- Azure PowerShell version 0.8.0 or later (Spring 2014 setup). To install the latest version and associate it with your Azure subscription, see [How to install and configure Windows Azure PowerShell](http://www.windowsazure.com/en-us/documentation/articles/install-configure-powershell/).

This tutorial is designed for Windows PowerShell beginners, but it assumes that you understand the basic concepts, such as modules, cmdlets, and sessions. For more information about Windows PowerShell, see [Getting Started with Windows PowerShell](http://technet.microsoft.com/en-us/library/hh857337.aspx).

To get detailed help for any cmdlet that you see in this tutorial, use the Get-Help cmdlet. 

	Get-Help <cmdlet-name> -Detailed

For example, to get help for the Add-AzureAccount cmdlet, type:

	Get-Help Add-Azure-Account -Detailed

## In this tutorial ##
* [About the Azure Powershell Modules](#about)
* [Create a resource group](#create)
* [Manage a resource group](#manage)
* [Troubleshoot a resource group](#troubleshoot)
* [Next steps](#next)



##<a id="about"></a>About the Azure PowerShell Modules ##
Beginning in version 0.8.0, the Azure PowerShell installation includes three Windows PowerShell modules:

- **AzureServiceManagement**: Includes the traditional cmdlets for managing individual resources, such as storage accounts, web sites, databases, virtual machines, and media services. For more information, see [Azure Service Management Cmdlets](http://msdn.microsoft.com/en-us/library/jj152841.aspx).

- **AzureResourceManager**: Includes cmdlets for creating, managing, and deploying the Azure resources for a complex service as a logical unit. Use this module to create resource groups that support web portals, photo galleries, blogs, wikis and more. For more information, see [Azure Resource Manager Cmdlets](http://go.microsoft.com/fwlink/?LinkID=394765).

- **AzureProfile**: Includes cmdlets common to both modules, such as Add-AzureAccount, Get-AzureSubscription, and Switch-AzureMode. For more information, see [Azure Profile Cmdlets](http://go.microsoft.com/fwlink/?LinkID=394766).

> [ WACOM.NOTE] The Azure Resource Manager module is currently in preview. It might not provide the same management capabilities as the Azure Service Management module. 

The Azure Service Management and Azure Resource Manager modules are not designed to be used in the same Windows PowerShell session. To make it easy to switch between them, we have added a new cmdlet, **Switch-AzureMode**, to the Azure Profile module.

When you use Azure PowerShell, the cmdlets in the Azure Service Management and Azure Profile modules are imported by default. To switch to the Azure Resource Manager module, use the Switch-AzureMode cmdlet. It removes the Azure Service Management module from your session and imports the Azure Resource Manager (and Azure Profile) modules.

To switch to the AzureResoureManager module, type:

    PS C:\> Switch-AzureMode -Name AzureResourceManager

To switch back to the AzureServiceManagement module, type:

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

  
#<a id="create"></a> Create a resource group for a web site and database#

This section of the tutorial guides you through the process of creating and deploying a resource group for a web site (or web application) with a SQL database. 

You don't need to be an expert in Azure, SQL, web sites, or resource management to do this task. The templates provide a model of the resource group with all of the resources that you're likely to need. And because we're using Windows PowerShell to automate the tasks, you can use these process as a model for scripting large-scale tasks.

## Step 1: Switch to Azure Resource Manager 
1. Start Windows PowerShell. You can use any host program that you like, such as the Windows PowerShell console or Windows PowerShell ISE.

2. Use the **Switch-AzureMode** cmdlet to import the cmdlets in the AzureResourceManager and AzureProfile modules. 

	`PS C:\>Switch-AzureMode AzureResourceManager`

3. To add your Azure account to the Windows PowerShell session, use the **Add-AzureAccount** cmdlet. 

    `PS C:\> Add-AzureAccount`

The cmdlet prompts you for an email address and password. Then it downloads your account settings so they are available to Windows PowerShell.

The account settings expire every 12 hours. To refresh the account settings, just run **Add-AzureAccount** again. 

> [ WACOM.NOTE] The AzureResourceManager module requires Add-AzureAccount. A Publish Settings file is not sufficient.     



## Step 2: Select a gallery template ##

There are many ways to create a resource group and its resources, but the easiest way to create a resource group for a complex service, like a web site, is to use a template. We'll start by searching the Azure resource group template gallery for a template that meets our needs.

A *resource group template* is JavaScriptObjectNotation (JSON) string that defines the resources in a resource group. The string includes placeholders called "parameters" for user-defined values, like names and sizes.

Azure hosts a gallery of resource group templates that you can use. To search for a template in the Azure resource group template gallery, use the **Get-AzureResourceGroupGalleryTemplate** cmdlet.  

At the Windows Powershell prompt, type:
    
    PS C:\> Get-AzureResourceGroupGalleryTemplate

The cmdlet returns a list of gallery templates with Publisher and Identity properties. You use the **Identity** property to identify the template in the commands.

    Publisher       Identity
    ---------       --------
    Acquiacom       Acquiacom.AcquiaDrupal7MySQL.0.1.0-preview1
    Acquiacom       Acquiacom.AcquiaDrupal7SQL.0.1.0-preview1
    Avensoft        Avensoft.nService.0.1.0-preview1
    BlogEngineNET   BlogEngineNET.BlogEngineNET.0.1.0-preview1
	...

TIP: To recall the last command, press the up-arrow key.

The Microsoft.WebSiteSQLDatabase.0.1.0-preview1.json template looks interesting. To get more information about a gallery template, use the **Identity** parameter. The value of the Identity parameter is Identity of the template.

    PS C:\> Get-AzureResourceGroupGalleryTemplate -Identity Microsoft.WebSiteSQLDatabase.0.1.0-preview1.json

The cmdlet returns an object with much more information about the template, including a description.

	<p>Windows Azure Web Sites offers secure and flexible development, 
	deployment and scaling options for any sized web application. Leverage 
	your existing tools to create and deploy applications without the hassle 
	of managing infrastructure.</p>
 
This template looks like it will meet our needs. Let's save it to disk and look at it more closely.
 
## Step 3: Examine the Template

Let's save the template to a JSON file on disk. This step is not required, but it makes it easier to view the template. To save the template, use the **Save-AzureResourceGroupGalleryTemplate** cmdlet. Use the Identity parameter to specify the template and the Path parameter to specify a path on disk.

Save-AzureResourceGroupGalleryTemplate saves the template and returns the path a file name of the JSON template file. 

	PS C:\> Save-AzureResourceGroupGalleryTemplate -Identity Microsoft.WebSiteSQLDatabase.0.1.0-preview1.json -Path D:\Azure\Templates

	Path
	----
	D:\Azure\Templates\Microsoft.WebSite.0.1.0-preview1.json


You can view the template file in a text editor, such as Notepad. Or, use the **Get-Content** cmdlet to view the file content in Windows PowerShell.

The following command uses the **Get-Content** cmdlet to get the content of the JSON file. It pipes the JSON string to the **ConvertFrom-Json** cmdlet, which converts the JSON string to a custom object that's easy to view and manage in Windows PowerShell. Then, it saves the custom object in the $template parameter

	PS C:\>$template = Get-Content -Raw -Path D:\Azure\Templates\Microsoft.WebSiteSQLDatabase.0.1.0-preview1.json | ConvertFrom-Json 

The template has schema, contentVersion, parameters, and resources properties. The resources are the resources that the template creates. The parameters are the user-defined values that you provide when you use the template.

	$schema             contentVersion   parameters                    resources
	-------             --------------   ----------                    ---------
	http://schema.ma... 1.0.0.0          @{siteName=; hostingPlanNa... {@{name=[parameters('serve...



**Template Resources**

To get the resources that the template creates, use the **Resources** property of the template and its **Type** property. The output shows that the template creates a SQL database server and server farm, a web site, and several management settings.

	PS C:\>$template.Resources.type

	Microsoft.Sql/servers
	Microsoft.Web/serverFarms
	Microsoft.Web/Sites
	microsoft.insights/autoscalesettings
	microsoft.insights/alertrules
	microsoft.insights/components


If you get at the **Resources** property, you can see the properties of each resource that supports the web site. You can also see the parameters that the template declares for each resource, such as the serverName ([parameters('serverName')]) and serverLocation [parameters('serverLocation')]. 


	PS C:\>$template.Resources

	name       : [parameters('serverName')]
	type       : Microsoft.Sql/servers
	location   : [parameters('serverLocation')]
	apiVersion : 2.0
	properties : @{administratorLogin=[parameters('administratorLogin')];
	             administratorLoginPassword=[parameters('administratorLoginPassword')]}
	resources  : {@{name=[parameters('databaseName')]; type=databases; location=[parameters('serverLocation')];
	             apiVersion=2.0; dependsOn=System.Object[]; properties=}, @{apiVersion=2.0; dependsOn=System.Object[];
	             location=[parameters('serverLocation')]; name=AllowAllWindowsAzureIps; properties=; type=firewallrules}}
	
	apiVersion : 2014-04-01
	name       : [parameters('hostingPlanName')]
	type       : Microsoft.Web/serverFarms
	location   : [parameters('siteLocation')]
	properties : @{name=[parameters('hostingPlanName')]; sku=[parameters('sku')]; workerSize=[parameters('workerSize')];
	             numberOfWorkers=1}
	
	apiVersion : 2014-04-01
	name       : [parameters('siteName')]
	type       : Microsoft.Web/Sites
	location   : [parameters('siteLocation')]
	dependsOn  : {[concat('Microsoft.Web/serverFarms/', parameters('hostingPlanName'))]}
	tags       : @{[concat('hidden-related:', resourceGroup().id, '/providers/Microsoft.Web/serverfarms/',
	             parameters('hostingPlanName'))]=empty}
	properties : @{name=[parameters('siteName')]; serverFarm=[parameters('hostingPlanName')]}
	resources  : {@{apiVersion=2014-04-01; type=config; name=web; dependsOn=System.Object[]; properties=}}
	
	apiVersion : 2014-04
	name       : [concat(parameters('hostingPlanName'), '-', resourceGroup().name)]
	type       : microsoft.insights/autoscalesettings
	location   : East US
	tags       : @{[concat('Link:', resourceGroup().id, '/providers/Microsoft.Web/serverfarms/',
	             parameters('hostingPlanName'))]=Resource}
	dependsOn  : {[concat('Microsoft.Web/serverfarms/', parameters('hostingPlanName'))]}
	properties : @{profiles=System.Object[]; enabled=False; name=[concat(parameters('hostingPlanName'), '-',
	             resourceGroup().name)]; targetResourceUri=[concat(resourceGroup().id,
	             '/providers/Microsoft.Web/serverfarms/', parameters('hostingPlanName'))]}
	
	apiVersion : 2014-04
	name       : [concat('ServerErrors-', parameters('siteName'))]
	type       : microsoft.insights/alertrules
	location   : East US
	dependsOn  : {[concat('Microsoft.Web/sites/', parameters('siteName'))]}
	tags       : @{[concat('Link:', resourceGroup().id, '/providers/Microsoft.Web/sites/',
	             parameters('siteName'))]=Resource}
	properties : @{name=[concat('ServerErrors-', parameters('siteName'))]; description=[concat(parameters('siteName'), '
	             has some server errors, status code 5xx.')]; isEnabled=False; condition=; action=}
	
	apiVersion : 2014-04
	name       : [parameters('siteName')]
	type       : microsoft.insights/components
	location   : Central US
	dependsOn  : {[concat('Microsoft.Web/sites/', parameters('siteName'))]}
	tags       : @{[concat('Link:', resourceGroup().id, '/providers/Microsoft.Web/sites/',
	             parameters('siteName'))]=Resource}
	properties : @{ApplicationId=[parameters('siteName')]}

	
**Template Parameters** 

Parameters are the user-defined values in the template. You supply values for the parameters when you create the resource group. 

To get the parameters in the template, use the **Parameters** property of the template. Several of the parameters such as sku, workerSize, and collation, have default values, so you are not required to provide values for them. 

	PS C:\>$template.Parameters

	siteName                   : @{type=string}
	hostingPlanName            : @{type=string}
	siteLocation               : @{type=string}
	sku                        : @{type=string; allowedValues=System.Object[];defaultValue=Free}
	workerSize                 : @{type=string; allowedValues=System.Object[];defaultValue=0}
	serverName                 : @{type=string}
	serverLocation             : @{type=string}
	administratorLogin         : @{type=string}
	administratorLoginPassword : @{type=securestring}
	databaseName               : @{type=string}
	collation                  : @{type=string; defaultValue=SQL_Latin1_General_CP1_CI_AS}

The sku and workerSize parameters include a list of allowed values. To see them, use the sku and workerSize properties.

	PS C:\> $t.parameters.sku
	
	type            allowedValues                           defaultValue
	----            -------------                           ------------
	string          {Free, Shared, Basic, Standard}         Free
	
	
	PS C:\> $t.parameters.workerSize
	
	type            allowedValues                           defaultValue
	----            -------------                           ------------
	string          {0, 1, 2}                               0

Note that the **administratorLoginPassword** parameter uses a secure string, not plain text.

	PS C:\> $t.parameters.administratorLoginPassword
	
	type
	----
	securestring


## Step 4: Get resource type locations

Most templates ask you to specify a location for each of the resources in a resource group. Every resource is located in an Azure data center, but not every Azure data center supports every resource type. 

Select any location that supports the resource type. The resources in a resource group do not need to be in the same location, and they do not need to be in the same location as the resource group or the subscription.

This command gets the resources in the gallery template and formats them in a table by type and location value. The output shows that the Microsoft.WebSiteSQLDatabase.0.1.0-preview1 requires (no default value) a location for the SQL server, the server farm, and the web site.    

	PS C:\> $template.resources | Format-Table -Property Type, Location
	
	type                                        location
	----                                        --------
	Microsoft.Sql/servers                       [parameters('serverLocation')]
	Microsoft.Web/serverFarms                   [parameters('siteLocation')]
	Microsoft.Web/Sites                         [parameters('siteLocation')]
	microsoft.insights/autoscalesettings        East US
	microsoft.insights/alertrules               East US
	microsoft.insights/components               Central US


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

At this point, we have the information that we need to create the resource group.

## Step 5: Create a resource group
 
In this step, we'll use the resource group template to create the resource group. For reference, display the template parameters in the $template variable (`$template.Parameters`) or open the Microsoft.WebSiteSQLDatabase.0.1.0-preview1 JSON file on disk and follow along. 

To create a resource group, use the **New-AzureResourceGroup** cmdlet.

The command uses the **Name** parameter to specify a name for the resource group and the **Location** parameter to specify its location. Use the output of **Get-AzureLocation** to select a location for the resource group. It uses the **GalleryTemplateIdentity** parameter to specify the gallery template.

	PS C:\> New-AzureResourceGroup ` 
			-Name TestRG1 `
			-Location "East Asia" `
			-GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.1.0-preview1 `
            ....

As soon as you type the template name, New-AzureResourceGroup fetches the template, parses it, and adds the template parameters to the command dynamically. This makes it very easy to specify the template parameter values. And, if you forget a required parameter value, Windows PowerShell prompts you for the value.

**Dynamic Template Parameters**

To get the parameters, type a minus sign (-) to indicate a parameter name and then press the TAB key. Or, type the first few letters of a parameter name, such as siteName and then press the TAB key. 

		PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.1.0-preview1 
		-si<TAB>

Windows PowerShell completes the parameter name. To cycle through the parameter names, press TAB repeatedly.

		PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.1.0-preview1 
		-siteName 

Enter a name for the web site and repeat the TAB process for each of the parameters. The parameters with a default value are optional. To accept the default value, omit the parameter from the command. 

When a template parameter has enumerated values, such as the sku parameter in this template, to cycle through the parameter values, press the TAB key.

		PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.1.0-preview1 
		-siteName TestSite -sku <TAB>

		PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.1.0-preview1 
		-siteName TestSite -sku Free<TAB>

		PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.1.0-preview1 
		-siteName TestSite -sku Basic<TAB>

Here is an example of a New-AzureResourceGroup command that specifies only the required template parameters and the **Verbose** common parameter. Note that the **administratorLoginPassword** is omitted. (The backtick (`) is the Windows PowerShell line continuation character.)

	PS C:\> New-AzureResourceGroup 
	-Name TestRG `
	-Location "East Asia" `
	-GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.1.0-preview1 `
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
	VERBOSE: 3:47:31 PM - Create template deployment 'Microsoft.WebSiteSQLDatabase.0.1.0-preview1'
	using template https://gallerystoreprodch.blob.core.windows.net/prod-microsoft-windowsazure-gallery/8D6B920B-10F4-4B5A-B3DA-9D398FBCF3EE.PUBLICGALLERYITEMS.MICROSOFT.WEBSITESQLDATABASE.0.1.0-PREVIEW1/DeploymentTemplates/Website_NewHostingPlan_SQL_NewDB-Default.json.
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


In just a few steps, we created and deployed the resources required for a complex web site. 
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



- To add a resource to the resource group, use the **New-AzureResource** cmdlet. This command adds a new web site to the TestRG resource group. This command is a bit more complex, because it does not use a template. 

		PS C:\>New-AzureResource -Name TestSite2 `
		-Location "North Europe" `
		-ResourceGroupName TestRG `
		-ResourceType "Microsoft.Web/sites" `
		-ApiVersion 2004-04-01 `
		-PropertyObject @{"name" = "TestSite2"; "siteMode"= "Limited"; "computeMode" = "Shared"}

- To add a new deployment to the resource group, use the **New-AzureResourceGroupDeployment** command. You can use a template to make the task easier.

		PS C:\>New-AzureResourceGroupDeployment ` 
		-ResourceGroupName TestRG `
		-GalleryTemplateIdentity Microsoft.WebSite.0.1.0-preview1 `
		-siteName TestWeb2 `
		-hostingPlanName TestDeploy2 `
		-siteMode Limited `
		-computeMode Dedicated `
		-siteLocation "North Europe" 
		-subscriptionID "9b14a38b-4b93-4554-8bb0-3cefb47abcde" `
		-resourceGroup TestRG

- To change the properties of a resource, use the **Set-AzureResource** cmdlet. 

	This series of commands gets the properties of the TestPlan server farm and saves them in $props variable. Then, it changes the value of the workerSize to 0 in $props. Finally, it uses the Set-AzureResource cmdlet to submit the properties in the $props variable as the value of the PropertyObject parameter.

		PS C:\>$props = (Get-AzureResource -Name TestSite -ResourceGroupName TestRG -ResourceType
		"Microsoft.Web/serverFarms" -ApiVersion 2004-04-01).Properties
		
		PS C:>$props.workerSize = "0"
		
		PS C:\>$props = Set-AzureResource -Name TestSite -ResourceGroupName TestRG -ResourceType
		"Microsoft.Web/serverFarms" -ApiVersion 2004-04-01 -PropertyObject $props


- To delete a resource from the resource group, use the **Remove-AzureResource** cmdlet. This cmdlet deletes the resource, but does not delete the resource group.

	This command removes the TestSite2 web site from the TestRG resource group.

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


- **Test-AzureLocation**: This cmdlet displays the locations that support each type of resource. Before you enter a location for a resource, use this cmdlet to verify that the location supports the resource type.


- **Test-AzureResourceGroupTemplate**: Test your template and template parameter before you use them. Enter a custom or gallery template and the template parameter values you plan to use. This cmdlet tests whether the template is internally consistent and whether your parameter value set matches the template. 



## Fixing errors

- **Verbose and Debug**:  The cmdlets in the AzureResourceManager module call REST APIs that do the actual work. To see the messages that the APIs return, set the $DebugPreference variable to "Continue" and use the Verbose common parameter in your commands. The messages often provide vital clues about the cause of any failures.

- **Your Azure credentials have not been set up or have expired**:  To refresh the credentials in your Windows PowerShell session, use the Add-AzureAccount cmdlet. The credentials in a publish settings file are not sufficient for the cmdlets in the AzureResourceManager module.

- **Server is busy**: Wait a few minutes and retry the command. In scripts, wait for a random time before trying the command again. (Start-Sleep (Get-Random -Minimum 0 -Maximum 60) / 60).


#<a id="next"></a> Next Steps
To learn more about using Resource Manager and using Windows PowerShell with Resource Manager:
 
- [Resource Manager](http://go.microsoft.com/fwlink/?LinkID=394760): Learn about the concepts in Resource Manager.
- [Azure Resource Manager Cmdlets](http://go.microsoft.com/fwlink/?LinkID=394765&clcid=0x409): Learn to use the cmdlets in the AzureResourceManager modules.
- [Azure blog](http://blogs.msdn.com/windowsazure): Learn about new features in Azure.
- [Windows PowerShell blog](http://blogs.msdn.com/powershell): Learn about new features in Windows PowerShell.
- ["Hey, Scripting Guy!" Blog](http://blogs.technet.com/b/heyscriptingguy/): Get real-world tips and tricks from the community.
- [Using the Azure Cross-Platform Command-Line Interface with the Resource Manager](http://www.windowsazure.com/en-us/documentation/articles/xplat-cli-azure-resource-manager/): Learn alternate ways to automate Resource Manager operations.