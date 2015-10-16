<properties 
	pageTitle="Using Azure PowerShell with Azure Resource Manager" 
	description="Use Azure PowerShell to deploy multiple resources as a resource group to Azure." 
	services="azure-resource-manager" 
	documentationCenter="" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="azure-resource-manager" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="powershell" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/15/2015" 
	ms.author="tomfitz"/>

# Using Azure PowerShell with Azure Resource Manager

> [AZURE.SELECTOR]
- [Azure PowerShell](powershell-azure-resource-manager.md)
- [Azure CLI](xplat-cli-azure-resource-manager.md)

Azure Resource Manager introduces an entirely new way of thinking about your Azure resources. Instead of creating and managing individual resources, you begin by imagining an entire solution, such as a blog, a photo gallery, a SharePoint portal, or a wiki. You use a template -- a declarative representation of the solution --  to create the resources that you need to support the service. Then, you can manage and deploy that resource group as a logical unit. 

In this tutorial, you learn how to use Azure PowerShell with Azure Resource Manager for Microsoft Azure. It walks you through the process of creating and deploying a resource group for an Azure-hosted web app with a SQL database, complete with all of the resources that you need to support it.

## Prerequisites

[AZURE.INCLUDE [powershell-preview-inline-include](../includes/powershell-preview-inline-include.md)]

This tutorial is designed for PowerShell beginners, but it assumes that you understand the basic concepts, such as modules, cmdlets, and sessions. For more information about Windows PowerShell, see [Getting Started with Windows PowerShell](http://technet.microsoft.com/library/hh857337.aspx).

## What you will deploy

In this tutorial, you will use Azure PowerShell to deploy a web app and a SQL database. However, this web app and SQL database solution is made up of several resource types that work together. The actual resources you will 
deploy are:

- SQL server - to host the database
- SQL database - to store the data
- Firewall rules - to allow the web app to connect to the database
- App Service plan - for defining the capabilities of the web
- Web site - for running the app code
- Web config - for storing the connection string to the database 

## Get help

To get detailed help for any cmdlet that you see in this tutorial, use the Get-Help cmdlet. 

	Get-Help <cmdlet-name> -Detailed

For example, to get help for the Get-AzureRmResource cmdlet, type:

	Get-Help Get-AzureRmResource -Detailed

To get a list of cmdlets in the Resources module with a help synopsis, type: 

    PS C:\> Get-Command -Module AzureRM.Resources | Get-Help | Format-Table Name, Synopsis

The output will look similar to the following excerpt:

	Name                                   Synopsis
	----                                   --------
	Find-AzureRmResource                   Searches for resources using the specified parameters.
	Find-AzureRmResourceGroup              Searches for resource group using the specified parameters.
	Get-AzureRmADGroup                     Filters active directory groups.
	Get-AzureRmADGroupMember               Get a group members.
	...

To get full help for a cmdlet, type a command with the format:

	Get-Help <cmdlet-name> -Full
  
## Login to your Azure account

Before deploying resources, you must first login to your account.

To login to your Azure account, use the **Login-AzureRmAccount** cmdlet. In versions of Azure PowerShell prior to 1.0 Preview, use the **Add-AzureAccount** command.

    PS C:\> Login-AzureRmAccount

The cmdlet prompts you for the login credentials for your Azure account. After logging in, it downloads your account settings so they are available to Azure PowerShell. 

The account settings expire, so you need to refresh them occasionally. To refresh the account settings, run **Login-AzureRmAccount** again. 

>[AZURE.NOTE] The Resource Manager modules requires Login-AzureRmAccount. A Publish Settings file is not sufficient.     

## Get resource type locations

When deploying a resource you must specify where you would like to host the resource.  However, you cannot 
make that assumption about every type of resource becasue some regions do not support particular types. Before deploying your web app and SQL database, you must figure out which regions support them. All of the resources 
in your resource group do not need to reside in the same location; however, whenever possible, you should create resources in the same location to optimize performance. In particular, you will want to make sure that 
your database is in the same location as the app accessing it. 

To get the locations that support each resource type, you will need to use the **Get-AzureRmResourceProvider** cmdlet. First, let's see what this command returns:

    PS C:\> Get-AzureRmResourceProvider -ListAvailable

    ProviderNamespace               RegistrationState ResourceTypes
    -----------------               ----------------- -------------
    Microsoft.ApiManagement         Unregistered      {service, validateServiceName, checkServiceNameAvailability}
    Microsoft.AppService            Registered        {apiapps, appIdentities, gateways, deploymenttemplates...}
    Microsoft.Batch                 Registered        {batchAccounts}
    ...

There a few interesting things to notice. The ProviderNamespace represents a collection of related resource types. These namespaces usually match up well with the services you use to create your solution in Azure. Usually, the services you are working with will be registered to your account, but if you notice the service you want to use is marked as **Unregistered** you can register that resource provider with the 

To limit your output to a specific type of of resource, such as web sites, use:

    PS C:\> ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).Locations
    Brazil South
    East Asia
    East US
    Japan East
    Japan West
    North Central US
    North Europe
    South Central US
    West Europe
    West US
    Southeast Asia
    Central US
    East US 2

The locations you see might be slightly different than the previous results. The results could be different because an administrator in your organization has created a policy that limits which regions can be used or there may be restriction related to tax policies in your home country.

Let's run the same command for the database:

    PS C:\> ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Sql).ResourceTypes | Where-Object ResourceTypeName -eq servers).Locations
    East US 2
    South Central US
    Central US
    North Central US
    West US
    East US
    East Asia
    Southeast Asia
    Japan West
    Japan East
    North Europe
    West Europe
    Brazil South

It looks like for these resources we can select from many available regions. For this topic, we will use **West US** but you can specify any of the supported regions.

Specifying a location for the resource group was easy because every location supports resource groups.

## Create a resource group

This section of the tutorial guides you through the process of creating a resource group. The resource group will serve as a container for all of the resources in your solution that share the same lifecycle. 
Later in the tutorial, you will deploy the web app and SQL database to this resource group.

To create a resource group, use the **New-AzureRmResourceGroup** cmdlet.

The command uses the **Name** parameter to specify a name for the resource group and the **Location** parameter to specify its location. Based on what we discovered in the previous section, we will use "West US" for 
the location.

    PS C:\> New-AzureRmResourceGroup -Name TestRG1 -Location "West US"
    
    ResourceGroupName : TestRG1
    Location          : westus
    ProvisioningState : Succeeded
    Tags              :
    Permissions       :
                    Actions  NotActions
                    =======  ==========
                    *

    ResourceId        : /subscriptions/{guid}/resourceGroups/TestRG1

Your resource group has been successfully created.
        

## Get available API versions for the resources

When you deploy a template, you must specify an API version to use for creating the resource. The available API versions correspond to versions of REST API operations that are released by the resource provider. 
As resource providers enable new features, they will release new versions of the REST API. Therefore, the version of the API you specify in your template affects which properties are avaiable to you as you create the 
template. In general, you will want to select the most recent API version when creating new templates. For existing templates, you can decide whether you want to continue using an API version that you know won't change your 
deployment, or whether you want to update your template for the latest version to take advantage of new features.

This step may seem confusing, but discovering the API versions available for you resource is not difficult. You will again use the **Get-AzureRmResourceProvider** command.

    PS C:\> ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions
    2015-08-01
    2015-07-01
    2015-06-01
    2015-05-01
    2015-04-01
    2015-02-01
    2014-11-01
    2014-06-01
    2014-04-01-preview
    2014-04-01

As you can see this API has been updated often. Typically, the same API version numbers will be available for all resources in a resource provider. The only exception would be if a resource was added or removed at some 
point. We will assume the same API versions are available for the serverFarms resource; however, you can double-check for any resource that you think may have a different list of available API versions.

For the database, you will see:

    PS C:\> ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Sql).ResourceTypes | Where-Object ResourceTypeName -eq servers/databases).ApiVersions
    2014-04-01-preview
    2014-04-01 

## Create your template

This topic does not show you how to create your template or discuss the structure of the template. For that information, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md). The template 
you will deploy is shown below. Notice that the template uses the API versions you retrieved in the previous section. To ensure that all of the resources reside in the same region, we use the template expression 
**resourceGroup().location** to use the location of the resource group.

You can copy the template and save it locally. During deployment you will specify the path to the template, so save it somewhere convenient.

    {
      "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "hostingPlanName": {
            "type": "string"
        },
        "serverName": {
            "type": "string"
        },
        "databaseName": {
            "type": "string"
        },
        "administratorLogin": {
            "type": "string"
        },
        "administratorLoginPassword": {
            "type": "securestring"
        }
      },
      "variables": {
        "siteName": "[concat('ExampleSite', uniqueString(resourceGroup().id))]"
      },
      "resources": [
        {
          "name": "[parameters('serverName')]",
          "type": "Microsoft.Sql/servers",
          "location": "[resourceGroup().location]",
          "apiVersion": "2014-04-01",
          "properties": {
            "administratorLogin": "[parameters('administratorLogin')]",
            "administratorLoginPassword": "[parameters('administratorLoginPassword')]",
            "version": "12.0"
          },
          "resources": [
            {
              "name": "[parameters('databaseName')]",
              "type": "databases",
              "location": "[resourceGroup().location]",
              "apiVersion": "2014-04-01",
              "dependsOn": [
                "[concat('Microsoft.Sql/servers/', parameters('serverName'))]"
              ],
              "properties": {
                "edition": "Basic",
                "collation": "SQL_Latin1_General_CP1_CI_AS",
                "maxSizeBytes": "1073741824",
                "requestedServiceObjectiveName": "Basic"
              }
            },
            {
              "name": "AllowAllWindowsAzureIps",
              "type": "firewallrules",
              "location": "[resourceGroup().location]",
              "apiVersion": "2014-04-01",
              "dependsOn": [
                "[concat('Microsoft.Sql/servers/', parameters('serverName'))]"
              ],
              "properties": {
                "endIpAddress": "0.0.0.0",
                "startIpAddress": "0.0.0.0"
              }
            }
          ]
        },
        {
          "apiVersion": "2015-08-01",
          "type": "Microsoft.Web/serverfarms",
          "name": "[parameters('hostingPlanName')]",
          "location": "[resourceGroup().location]",
          "sku": {
            "tier": "Free",
            "name": "f1",
            "capacity": 0
          },
          "properties": {
            "numberOfWorkers": 1
          }
        },
        {
          "apiVersion": "2015-08-01",
          "name": "[variables('siteName')]",
          "type": "Microsoft.Web/sites",
          "location": "[resourceGroup().location]",
          "dependsOn": [
            "[concat('Microsoft.Web/serverFarms/', parameters('hostingPlanName'))]"
          ],
          "properties": {
            "serverFarmId": "[parameters('hostingPlanName')]"
          },
          "resources": [
            {
              "name": "web",
              "type": "config",
              "apiVersion": "2015-08-01",
              "dependsOn": [
                "[concat('Microsoft.Web/Sites/', variables('siteName'))]"
              ],
              "properties": {
                "connectionStrings": [
                  {
                    "ConnectionString": "[concat('Data Source=tcp:', reference(concat('Microsoft.Sql/servers/', parameters('serverName'))).fullyQualifiedDomainName, ',1433;Initial Catalog=', parameters('databaseName'), ';User Id=', parameters('administratorLogin'), '@', parameters('serverName'), ';Password=', parameters('administratorLoginPassword'), ';')]",
                    "Name": "DefaultConnection",
                    "Type": 2
                  }
                ]
              }
            }
          ]
        }
      ]
    }


## Deploy the template

As soon as you type the template name, New-AzureResourceGroup fetches the template, parses it, and adds the template parameters to the command dynamically. This makes it very easy to specify the template parameter values. And, if you forget a required parameter value, Windows PowerShell prompts you for the value.

**Dynamic Template Parameters**

To get the parameters, type a minus sign (-) to indicate a parameter name and then press the TAB key. Or, type the first few letters of a parameter name, such as siteName and then press the TAB key. 

    PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.6-preview -si<TAB>

PowerShell completes the parameter name. To cycle through the parameter names, press TAB repeatedly.

    PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.6-preview -siteName 

Enter a name for the website and repeat the TAB process for each of the parameters. The parameters with a default value are optional. To accept the default value, omit the parameter from the command. 

When a template parameter has enumerated values, such as the sku parameter in this template, to cycle through the parameter values, press the TAB key.

    PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.6-preview -siteName TestSite -sku <TAB>

    PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.6-preview -siteName TestSite -sku Basic<TAB>

    PS C:\> New-AzureResourceGroup -Name TestRG1 -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.6-preview -siteName TestSite -sku Free<TAB>

Here is an example of a New-AzureResourceGroup command that specifies only the required template parameters and the **Verbose** common parameter. Note that the **administratorLoginPassword** is omitted.

	PS C:\> New-AzureResourceGroup -Name TestRG -Location "East Asia" -GalleryTemplateIdentity Microsoft.WebSiteSQLDatabase.0.2.6-preview -siteName TestSite -hostingPlanName TestPlan -siteLocation "East Asia" -serverName testserver -serverLocation "East Asia" -administratorLogin Admin01 -databaseName TestDB -Verbose

When you enter the command, you are prompted for the missing mandatory parameter, **administratorLoginPassword**. And, when you type the password, the secure string value is obscured. This strategy eliminates the risk of providing a password in plain text.

	cmdlet New-AzureResourceGroup at command pipeline position 1
	Supply values for the following parameters:
	(Type !? for Help.)
	administratorLoginPassword: **********

**New-AzureResourceGroup** returns the resource group that it created and deployed. 

In just a few steps, we created and deployed the resources required for a complex website. 
The gallery template provided almost all of the information that we needed to do this task.
And, the task is easily automated. 

## Get information about your resource groups

After creating a resource group, you can use the cmdlets in the AzureResourceManager module to manage your resource groups.

- To get all of the resource groups in your subscription, use the **Get-AzureResourceGroup** cmdlet:

		PS C:>Get-AzureResourceGroup

		ResourceGroupName : TestRG
		Location          : eastasia
		ProvisioningState : Succeeded
		Tags              :
		ResourceId        : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG
		
		...

- To get the resources in the resource group, use the **Get-AzureResource** cmdlet and its ResourceGroupName parameter. Without parameters, Get-AzureResource gets all resources in your Azure subscription.

		PS C:\> Get-AzureResource -ResourceGroupName TestRG
		
		ResourceGroupName : TestRG
		Location          : eastasia
		ProvisioningState : Succeeded
		Tags              :
		
		Resources         :
				Name                   Type                          Location
				----                   ------------                  --------
				ServerErrors-TestSite  microsoft.insights/alertrules         eastasia
	        	TestPlan-TestRG        microsoft.insights/autoscalesettings  eastus
	        	TestSite               microsoft.insights/components         centralus
	         	testserver             Microsoft.Sql/servers                 eastasia
	        	TestDB                 Microsoft.Sql/servers/databases       eastasia
	        	TestPlan               Microsoft.Web/serverFarms             eastasia
	        	TestSite               Microsoft.Web/sites                   eastasia
		ResourceId        : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG

## Add to a resource group

- To add a resource to the resource group, use the **New-AzureResource** cmdlet. This command adds a new website to the TestRG resource group. This command is a bit more complex, because it does not use a template. 

        PS C:\>New-AzureResource -Name TestSite2 -Location "North Europe" -ResourceGroupName TestRG -ResourceType "Microsoft.Web/sites" -ApiVersion 2014-06-01 -PropertyObject @{"name" = "TestSite2"; "siteMode"= "Limited"; "computeMode" = "Shared"}

- To add a new template-based deployment to the resource group, use the **New-AzureResourceGroupDeployment** command. 

		PS C:\>New-AzureResourceGroupDeployment ` 
		-ResourceGroupName TestRG `
		-GalleryTemplateIdentity Microsoft.WebSite.0.2.6-preview `
		-siteName TestWeb2 `
		-hostingPlanName TestDeploy2 `
		-siteLocation "North Europe" 

## Move a resource

You can move existing resources to a new resource group. For examples, see [Move Resources to New Resource Group or Subscription](resource-group-move-resources.md).

## Delete a resource group

- To delete a resource from the resource group, use the **Remove-AzureResource** cmdlet. This cmdlet deletes the resource, but does not delete the resource group.

	This command removes the TestSite2 website from the TestRG resource group.

		Remove-AzureResource -Name TestSite2 -ResourceGroupName TestRG -ResourceType "Microsoft.Web/sites" -ApiVersion 2014-06-01

- To delete a resource group, use the **Remove-AzureResourceGroup** cmdlet. This cmdlet deletes the resource group and its resources.

		PS C:\ps-test> Remove-AzureResourceGroup -Name TestRG
		
		Confirm
		Are you sure you want to remove resource group 'TestRG'
		[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y



## Next Steps

- To learn about creating Resource Manager templates, see [Authoring Azure Resource Manager Templates](./resource-group-authoring-templates.md).
- To learn about deploying templates, see [Deploy an application with Azure Resource Manager Template](./resource-group-template-deploy.md).
- For a detailed example of deploying a project, see [Deploy microservices predictably in Azure](app-service-web/app-service-deploy-complex-application-predictably.md).
- To learn about troubleshooting a deployment that failed, see [Troubleshooting resource group deployments in Azure](./virtual-machines/resource-group-deploy-debug.md).

