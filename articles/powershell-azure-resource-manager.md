<properties 
	pageTitle="Azure PowerShell with Resource Manager | Microsoft Azure" 
	description="Introduction to using Azure PowerShell to deploy multiple resources as a resource group to Azure." 
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
	ms.topic="get-started-article" 
	ms.date="02/17/2016" 
	ms.author="tomfitz"/>

# Using Azure PowerShell with Azure Resource Manager

> [AZURE.SELECTOR]
- [Azure PowerShell](powershell-azure-resource-manager.md)
- [Azure CLI](xplat-cli-azure-resource-manager.md)

Azure Resource Manager introduces an entirely new way of thinking about your Azure resources. Instead of creating and managing individual resources, you begin by imagining an entire solution, such as a blog, a photo gallery, a SharePoint portal, or a wiki. You use a template -- a declarative representation of the solution --  to create a resource group that contains all of the resources you need to support the solution. Then, you manage and deploy that resource group as a logical unit. 

In this tutorial, you learn how to use Azure PowerShell with Azure Resource Manager. It walks you through the process of creating and deploying a resource group for an Azure-hosted web app with a SQL database, complete with all of the resources that you need to support it.

## Prerequisites

To complete this tutorial, you need:

- An Azure account
  + You can [open an Azure account for free](/pricing/free-trial/?WT.mc_id=A261C142F): You get credits you can use to try out paid Azure services, and even after they're used up you can keep the account and use free Azure services, such as Websites. Your credit card will never be charged, unless you explicitly change your settings and ask to be charged.
  
  + You can [activate MSDN subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F): Your MSDN subscription gives you credits every month that you can use for paid Azure services.
- Azure PowerShell 1.0. For information about this release and how to install it, see [How to install and configure Azure PowerShell](powershell-install-configure.md).

This tutorial is designed for PowerShell beginners, but it assumes that you understand the basic concepts, such as modules, cmdlets, and sessions.

## What you will deploy

In this tutorial, you will use Azure PowerShell to deploy a web app and a SQL database. However, this web app and SQL database solution is made up of several resource types that work together. The actual resources you will 
deploy are:

- SQL server - to host the database
- SQL database - to store the data
- Firewall rules - to allow the web app to connect to the database
- App Service plan - for defining the capabilities and cost of the web app
- Web site - for running the web app
- Web config - for storing the connection string to the database 

## Get help for cmdlets

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

Before working on your solution, you must login to your account.

To login to your Azure account, use the **Login-AzureRmAccount** cmdlet.

    PS C:\> Login-AzureRmAccount

The cmdlet prompts you for the login credentials for your Azure account. After logging in, it downloads your account settings so they are available to Azure PowerShell. 

The account settings expire, so you need to refresh them occasionally. To refresh the account settings, run **Login-AzureRmAccount** again. 

>[AZURE.NOTE] The Resource Manager modules requires Login-AzureRmAccount. A Publish Settings file is not sufficient.     

## Get resource type locations

When deploying a resource you must specify where you would like to host the resource.  Not every region supports 
every resource type. Before deploying your web app and SQL database, you must figure out which regions support those types. 
A resource group can contain resources that are located in different regions; however, whenever possible, you should create resources in the same location to optimize performance. In particular, you will want to make sure that 
your database is in the same location as the app accessing it. 

To get the locations that support each resource type, you will need to use the **Get-AzureRmResourceProvider** cmdlet. First, let's see what this command returns:

    PS C:\> Get-AzureRmResourceProvider -ListAvailable

    ProviderNamespace               RegistrationState ResourceTypes
    -----------------               ----------------- -------------
    Microsoft.ApiManagement         Unregistered      {service, validateServiceName, checkServiceNameAvailability}
    Microsoft.AppService            Registered        {apiapps, appIdentities, gateways, deploymenttemplates...}
    Microsoft.Batch                 Registered        {batchAccounts}
    ...

The ProviderNamespace represents a collection of related resource types. These namespaces usually match up well with the services you want to create in Azure. If you wish to use a resource provider that is listed as **Unregistered**, you can register that resource provider by running the **Register-AzureRmResourceProvider** cmdlet and specifying the provider namespace to register. Most likely, the resource provider you will use in this tutorial will already by registered for your subscription.  

You can get more details about a provider by specifying that namespace:

    PS C:\> Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Sql

    ProviderNamespace RegistrationState ResourceTypes                                 Locations
    ----------------- ----------------- -------------                                 ---------
    Microsoft.Sql     Registered        {operations}                                  {East US 2, South Central US, Cent...
    Microsoft.Sql     Registered        {locations}                                   {East US 2, South Central US, Cent...
    Microsoft.Sql     Registered        {locations/capabilities}                      {East US 2, South Central US, Cent...
    ...

To limit your output to the supported locations for a specific type of of resource, such as web sites, use:

    PS C:\> ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).Locations
    
The output will be similar to:

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

The locations you see might be slightly different than the previous results. The results could be different because an administrator in your organization has created a policy that limits which regions can be used in your subscription or there may be restrictions related to tax policies in your home country.

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

It looks like these resources are available in many regions. For this topic, we will use **West US**, but you can specify any of the supported regions.

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
As resource providers enable new features, they will release new versions of the REST API. Therefore, the version of the API you specify in your template affects which properties are available to you as you create the 
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

Notice, too, the section for parameters. This section defines values you can provide when deploying the resources. You will use these values later in this tutorial.

You can copy the template and save it locally as a .json file. In this tutorial, we will assume it has been saved to c:\Azure\Templates\azuredeploy.json, but you can save it to any convenient location and with the name that makes sense for your requirements.

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
                "tags": {
                    "team": "webdev"
                },
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

You have your resource group and you have your template, so you are now ready to deploy the infrastructure defined in your template to the resource group. You deploy resources with the **New-AzureRmResourceGroupDeployment** cmdlet. The basic syntax looks like:

    PS C:\> New-AzureRmResourceGroupDeployment -ResourceGroupName TestRG1 -TemplateFile c:\Azure\Templates\azuredeploy.json

You specify the resource group and the location of the template. If your template is not local, you could use the **-TemplateUri** parameter and specify a URI for the template. You can set the 
**-Mode** parameter to either **Incremental** or **Complete**. By default, Resource Manager performs an incremental update during deployment; therefore, it is not essential to set **-Mode** when you want **Incremental**. 
To understand the differences between these deployment modes, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md). 

###Dynamic Template Parameters

If you are familiar with PowerShell, you know that you can cycle through the available parameters for a cmdlet by typing a minus sign (-) and then pressing the TAB key. This same functionality also works with parameters that you define in your template. As soon as you type the template name, the cmdlet fetches the template, parses it, and adds the template parameters to the command dynamically. This makes it very easy to specify the template parameter values. And, if you forget a required parameter value, PowerShell prompts you for the value.

Below is the full command with parameters included. You can provide your own values for the names of the resources.

    PS C:\> New-AzureRmResourceGroupDeployment -ResourceGroupName TestRG1 -TemplateFile c:\Azure\Templates\azuredeploy.json -hostingPlanName freeplanwest -serverName exampleserver -databaseName exampledata -administratorLogin exampleadmin

When you enter the command, you are prompted for the missing mandatory parameter, **administratorLoginPassword**. And, when you type the password, the secure string value is obscured. This strategy eliminates the risk of providing a password in plain text.

    cmdlet New-AzureRmResourceGroupDeployment at command pipeline position 1
    Supply values for the following parameters:
    (Type !? for Help.)
    administratorLoginPassword: ********

If the template includes a parameter with a name that matches one of the parameters in the command to deploy the template (such as including a parameter named **ResourceGroupName** in your template which is the same as the **ResourceGroupName** parameter in the [New-AzureRmResourceGroupDeployment](https://msdn.microsoft.com/library/azure/mt679003.aspx) cmdlet), you will be prompted to provide a value for a parameter with the postfix **FromTemplate** (such as **ResourceGroupNameFromTemplate**). In general, you should avoid this confusion by not naming parameters with the same name as parameters used for deployment operations.

The command runs and returns messages as the resources are created. Ultimately, you see the result of your deployment.

    DeploymentName    : azuredeploy
    ResourceGroupName : TestRG1
    ProvisioningState : Succeeded
    Timestamp         : 10/16/2015 12:55:50 AM
    Mode              : Incremental
    TemplateLink      :
    Parameters        :
                    Name             Type                       Value
                    ===============  =========================  ==========
                    hostingPlanName  String                     freeplanwest
                    serverName       String                     exampleserver
                    databaseName     String                     exampledata
                    administratorLogin  String                  exampleadmin
                    administratorLoginPassword  SecureString

    Outputs           :

In just a few steps, we created and deployed the resources required for a complex website. 

## Get information about your resource groups

After creating a resource group, you can use the cmdlets in the Resource Manager module to manage your resource groups.

- To get all of the resource groups in your subscription, use the **Get-AzureRmResourceGroup** cmdlet:

		PS C:> Get-AzureRmResourceGroup

		ResourceGroupName : TestRG1
		Location          : westus
		ProvisioningState : Succeeded
		Tags              :
		ResourceId        : /subscriptions/{guid}/resourceGroups/TestRG
		
		...

      If you just want to get a particular resource group, provide the **Name** parameter.
      
          PS C:> Get-AzureRmResourceGroup -Name TestRG1

- To get the resources in the resource group, use the **Find-AzureRmResource** cmdlet and its **ResourceGroupNameContains** parameter. Without parameters, Find-AzureRmResource gets all resources in your Azure subscription.

        PS C:\> Find-AzureRmResource -ResourceGroupNameContains TestRG1
		
        Name              : exampleserver
        ResourceId        : /subscriptions/{guid}/resourceGroups/TestRG1/providers/Microsoft.Sql/servers/tfserver10
        ResourceName      : exampleserver
        ResourceType      : Microsoft.Sql/servers
        Kind              : v12.0
        ResourceGroupName : TestRG1
        Location          : westus
        SubscriptionId    : {guid}
                
        ...
	        
- The template above includes a tag on one resource. You can use tags to logically organize the resources in your subscription. You use the **Find-AzureRmResource** and **Find-AzureRmResourceGroup** commands to query your resources by tags.

        PS C:\> Find-AzureRmResource -TagName team

        Name              : ExampleSiteuxq53xiz5etmq
        ResourceId        : /subscriptions/{guid}/resourceGroups/TestRG1/providers/Microsoft.Web/sites/ExampleSiteuxq53xiz5etmq
        ResourceName      : ExampleSiteuxq53xiz5etmq
        ResourceType      : Microsoft.Web/sites
        ResourceGroupName : TestRG1
        Location          : westus
        SubscriptionId    : {guid}
                
      There is much more you can do with tags. For more information, see [Using tags to organize your Azure resources](resource-group-using-tags.md).

## Add to a resource group

To add a resource to the resource group, you can use the **New-AzureRmResource** cmdlet. However, adding a resource this way might cause future confusion because the new resource does not exist in your template. If you re-deployed the old template, you would deploy an incomplete solution. If you are deploying often, you will find it easier and more reliable to add the new resource to your template and re-deploy it.

## Move a resource

You can move existing resources to a new resource group. For examples, see [Move Resources to New Resource Group or Subscription](resource-group-move-resources.md).

## Delete a resource group

- To delete a resource from the resource group, use the **Remove-AzureRmResource** cmdlet. This cmdlet deletes the resource, but does not delete the resource group.

	This command removes the TestSite website from the TestRG1 resource group.

		Remove-AzureRmResource -Name TestSite -ResourceGroupName TestRG1 -ResourceType "Microsoft.Web/sites" -ApiVersion 2015-08-01

- To delete a resource group, use the **Remove-AzureRmResourceGroup** cmdlet. This cmdlet deletes the resource group and its resources.

		PS C:\> Remove-AzureRmResourceGroup -Name TestRG1
		
		Confirm
		Are you sure you want to remove resource group 'TestRG1'
		[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y



## Next Steps

- To learn about creating Resource Manager templates, see [Authoring Azure Resource Manager Templates](./resource-group-authoring-templates.md).
- To learn about deploying templates, see [Deploy an application with Azure Resource Manager Template](./resource-group-template-deploy.md).
- For a detailed example of deploying a project, see [Deploy microservices predictably in Azure](app-service-web/app-service-deploy-complex-application-predictably.md).
- To learn about troubleshooting a deployment that failed, see [Troubleshooting resource group deployments in Azure](./resource-manager-troubleshoot-deployments-powershell.md).

