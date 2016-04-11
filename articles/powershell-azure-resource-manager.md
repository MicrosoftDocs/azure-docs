<properties 
	pageTitle="Azure PowerShell with Resource Manager | Microsoft Azure" 
	description="Introduction to using Azure PowerShell to deploy multiple resources as a resource group to Azure." 
	services="azure-resource-manager" 
	documentationCenter="" 
	authors="tfitzmac" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="azure-resource-manager" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="powershell" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="04/11/2016" 
	ms.author="tomfitz"/>

# Using Azure PowerShell with Azure Resource Manager

> [AZURE.SELECTOR]
- [Azure PowerShell](powershell-azure-resource-manager.md)
- [Azure CLI](xplat-cli-azure-resource-manager.md)

Azure Resource Manager introduces an entirely new way of thinking about your Azure resources. Instead of creating and managing individual resources, you begin by imagining an entire solution, such as a blog, a photo gallery, a SharePoint portal, or a wiki. You use a template -- a declarative representation of the solution --  to create a resource group that contains all of the resources you need to support the solution. Then, you manage and deploy that resource group as a logical unit. 

In this tutorial, you learn how to use Azure PowerShell with Azure Resource Manager. It walks you through the process of deploying a solution, and working with that solution.

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
- Alert rules - for monitoring performance and errors
- App Insights - for auto-scale settings

## Get help for cmdlets

To get detailed help for any cmdlet that you see in this tutorial, use the Get-Help cmdlet. 

    Get-Help <cmdlet-name> -Detailed

For example, to get help for the Get-AzureRmResource cmdlet, type:

    Get-Help Get-AzureRmResource -Detailed

To get a list of cmdlets in the Resources module with a help synopsis, type: 

    Get-Command -Module AzureRM.Resources | Get-Help | Format-Table Name, Synopsis

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

To login to your Azure account, use the **Add-AzureRmAccount** cmdlet.

    Add-AzureRmAccount

The cmdlet prompts you for the login credentials for your Azure account. After logging in, it downloads your account settings so they are available to Azure PowerShell. 

The account settings expire, so you need to refresh them occasionally. To refresh the account settings, run **Add-AzureRmAccount** again. 

>[AZURE.NOTE] The Resource Manager modules requires Login-AzureRmAccount. A Publish Settings file is not sufficient.     

## Create a resource group

Before deploying any resources to your subscription, you must create a resource group that will contain the resources. 

To create a resource group, use the **New-AzureRmResourceGroup** cmdlet.

The command uses the **Name** parameter to specify a name for the resource group and the **Location** parameter to specify its location. Based on what we discovered in the previous section, we will use "West US" for 
the location.

    New-AzureRmResourceGroup -Name TestRG1 -Location "West US"
    
The output will be similar to:

    ResourceGroupName : TestRG1
    Location          : westus
    ProvisioningState : Succeeded
    Tags              :
    ResourceId        : /subscriptions/{guid}/resourceGroups/TestRG1

Your resource group has been successfully created.

## Deploy your solution

This topic does not show you how to create your template or discuss the structure of the template. For that information, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md) and [Resource Manager Template Walkthrough](resource-manager-template-walkthrough.md). You will deploy a pre-defined template from [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/). You will deploy the [Provision a Web App with a SQL Database](https://azure.microsoft.com/documentation/templates/201-web-app-sql-database/) template.

You have your resource group and you have your template, so you are now ready to deploy the infrastructure defined in your template to the resource group. You deploy resources with the **New-AzureRmResourceGroupDeployment** cmdlet. The template specifies many default values, which we will use so you do not need to provide values for those parameters. The basic syntax looks like:

    New-AzureRmResourceGroupDeployment -ResourceGroupName TestRG1 -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-web-app-sql-database/azuredeploy.json

You specify the resource group and the location of the template. If your template is a local file, you use the **-TemplateFile** parameter and specify the path to the template. You can set the 
**-Mode** parameter to either **Incremental** or **Complete**. By default, Resource Manager performs an incremental update during deployment; therefore, it is not essential to set **-Mode** when you want **Incremental**. 
To understand the differences between these deployment modes, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md). 

###Dynamic Template Parameters

If you are familiar with PowerShell, you know that you can cycle through the available parameters for a cmdlet by typing a minus sign (-) and then pressing the TAB key. This same functionality also works with parameters that you define in your template. As soon as you type the template name, the cmdlet fetches the template, parses it, and adds the template parameters to the command dynamically. This makes it very easy to specify the template parameter values. And, if you forget a required parameter value, PowerShell prompts you for the value.

Below is the full command with parameters included. You can provide your own values for the names of the resources.

    New-AzureRmResourceGroupDeployment -ResourceGroupName TestRG1 -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-web-app-sql-database/azuredeploy.json  -administratorLogin exampleadmin

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
    Timestamp         : 4/11/2016 7:26:11 PM
    Mode              : Incremental
    TemplateLink      :
                        Uri            : https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-web-app-sql-database/azuredeploy.json
                        ContentVersion : 1.0.0.0
    Parameters        :
                    Name             Type                       Value
                    ===============  =========================  ==========
                    skuName          String                     F1
                    skuCapacity      Int                        1
                    administratorLogin  String                  exampleadmin
                    administratorLoginPassword  SecureString
                    databaseName     String                     sampledb
                    collation        String                     SQL_Latin1_General_CP1_CI_AS
                    edition          String                     Basic
                    maxSizeBytes     String                     1073741824
                    requestedServiceObjectiveName  String                     Basic

    Outputs           :
                    Name             Type                       Value
                    ===============  =========================  ==========
                    siteUri          String                     websites5wdai7p2k2g4.azurewebsites.net
                    sqlSvrFqdn       String                     sqlservers5wdai7p2k2g4.database.windows.net
                    
    DeploymentDebugLogLevel :

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

## Delete resources or resource group

- To delete a resource from the resource group, use the **Remove-AzureRmResource** cmdlet. This cmdlet deletes the resource, but does not delete the resource group.

	This command removes the TestSite website from the TestRG1 resource group.

		Remove-AzureRmResource -Name TestSite -ResourceGroupName TestRG1 -ResourceType "Microsoft.Web/sites" -ApiVersion 2015-08-01

- To delete a resource group, use the **Remove-AzureRmResourceGroup** cmdlet. This cmdlet deletes the resource group and its resources.

		Remove-AzureRmResourceGroup -Name TestRG1
		
	You are asked to confirm the deletion.
		
		Confirm
		Are you sure you want to remove resource group 'TestRG1'
		[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y



## Next Steps

- To learn about creating Resource Manager templates, see [Authoring Azure Resource Manager Templates](./resource-group-authoring-templates.md).
- To learn about deploying templates, see [Deploy an application with Azure Resource Manager Template](./resource-group-template-deploy.md).
- For a detailed example of deploying a project, see [Deploy microservices predictably in Azure](app-service-web/app-service-deploy-complex-application-predictably.md).
- To learn about troubleshooting a deployment that failed, see [Troubleshooting resource group deployments in Azure](./resource-manager-troubleshoot-deployments-powershell.md).

