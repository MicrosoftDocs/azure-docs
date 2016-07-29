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
	ms.topic="article" 
	ms.date="07/19/2016" 
	ms.author="tomfitz"/>

# Using Azure PowerShell with Azure Resource Manager

Azure Resource Manager introduces an entirely new way of thinking about your Azure resources. Instead of creating and managing individual resources, you begin by imagining an entire solution, such as a blog, a photo gallery, a SharePoint portal, or a wiki. You use a template -- a declarative representation of the solution --  to create a resource group that contains all of the resources you need to support the solution. Then, you manage and deploy that resource group as a logical unit. 

In this tutorial, you learn how to use Azure PowerShell with Azure Resource Manager. It walks you through the process of deploying a solution, and working with that solution. You will use Azure PowerShell and a Resource Manager template to deploy:

- SQL server - to host the database
- SQL database - to store the data
- Firewall rules - to allow the web app to connect to the database
- App Service plan - for defining the capabilities and cost of the web app
- Web site - for running the web app
- Web config - for storing the connection string to the database 
- Alert rules - for monitoring performance and errors
- App Insights - for auto-scale settings

## Prerequisites

To complete this tutorial, you need:

- An Azure account
  + You can [open an Azure account for free](/pricing/free-trial/?WT.mc_id=A261C142F): You get credits you can use to try out paid Azure services, and even after they're used up you can keep the account and use free Azure services, such as Websites. Your credit card will never be charged, unless you explicitly change your settings and ask to be charged.
  
  + You can [activate MSDN subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F): Your MSDN subscription gives you credits every month that you can use for paid Azure services.
- Azure PowerShell 1.0. For information about this release and how to install it, see [How to install and configure Azure PowerShell](powershell-install-configure.md).

This tutorial is designed for PowerShell beginners, but it assumes that you understand the basic concepts, such as modules, cmdlets, and sessions.

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

>[AZURE.NOTE] The Resource Manager modules requires Add-AzureRmAccount. A Publish Settings file is not sufficient.     

If you have more than one subscription, provide the subscription id you wish to use for deployment with the **Set-AzureRmContext** cmdlet.

    Set-AzureRmContext -SubscriptionID <YourSubscriptionId>

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

This topic does not show you how to create your template or discuss the structure of the template. For that information, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md) and [Resource Manager Template Walkthrough](resource-manager-template-walkthrough.md). You will deploy the pre-defined [Provision a Web App with a SQL Database](https://azure.microsoft.com/documentation/templates/201-web-app-sql-database/) template from [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/).

You have your resource group and you have your template, so you are now ready to deploy the infrastructure defined in your template to the resource group. You deploy resources with the **New-AzureRmResourceGroupDeployment** cmdlet. The template specifies many default values, which we will use so you do not need to provide values for those parameters. The basic syntax looks like:

    New-AzureRmResourceGroupDeployment -ResourceGroupName TestRG1 -administratorLogin exampleadmin -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-web-app-sql-database/azuredeploy.json 

You specify the resource group and the location of the template. If your template is a local file, you use the **-TemplateFile** parameter and specify the path to the template. You can set the 
**-Mode** parameter to either **Incremental** or **Complete**. By default, Resource Manager performs an incremental update during deployment; therefore, it is not essential to set **-Mode** when you want **Incremental**. 
To understand the differences between these deployment modes, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md). 

###Dynamic Template Parameters

If you are familiar with PowerShell, you know that you can cycle through the available parameters for a cmdlet by typing a minus sign (-) and then pressing the TAB key. This same functionality also works with parameters that you define in your template. As soon as you type the template name, the cmdlet fetches the template, parses it, and adds the template parameters to the command dynamically. This makes it very easy to specify the template parameter values.

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
                requestedServiceObjectiveName  String       Basic

    Outputs           :
                Name             Type                       Value
                ===============  =========================  ==========
                siteUri          String                     websites5wdai7p2k2g4.azurewebsites.net
                sqlSvrFqdn       String                     sqlservers5wdai7p2k2g4.database.windows.net
                    
    DeploymentDebugLogLevel :

In just a few steps, we created and deployed the resources required for a complex website. 

### Log debug information

When deploying a template, you can log additional information about the request and response by specifying the **-DeploymentDebugLogLevel** parameter when running **New-AzureRmResourceGroupDeployment**. This information may help you troubleshoot deployment errors. The default value is **None** which means no request or response content is logged. You can specify logging the content from request, response, or both.  For more information about troubleshooting deployments and logging debug information, see [Troubleshooting resource group deployments with Azure PowerShell](resource-manager-troubleshoot-deployments-powershell.md). The following example logs the request content and response content for the deployment.

    New-AzureRmResourceGroupDeployment -ResourceGroupName TestRG1 -DeploymentDebugLogLevel All -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-web-app-sql-database/azuredeploy.json 

> [AZURE.NOTE] When setting the DeploymentDebugLogLevel parameter, carefully consider the type of information you are passing in during deployment. By logging information about the request or response, you could potentially expose sensitive data that is retrieved through the deployment operations. 


## Get information about your resource groups

After creating a resource group, you can use the cmdlets in the Resource Manager module to manage your resource groups.

- To get a resource group in your subscription, use the **Get-AzureRmResourceGroup** cmdlet:

		Get-AzureRmResourceGroup -ResourceGroupName TestRG1
	
	Which returns the following information:

		ResourceGroupName : TestRG1
		Location          : westus
		ProvisioningState : Succeeded
		Tags              :
		ResourceId        : /subscriptions/{guid}/resourceGroups/TestRG
		
		...

	If you do not specify a resource group name, the cmdlet returns all of the resource groups in your subscription.

- To get the resources in the resource group, use the **Find-AzureRmResource** cmdlet and its **ResourceGroupNameContains** parameter. Without parameters, Find-AzureRmResource gets all resources in your Azure subscription.

        Find-AzureRmResource -ResourceGroupNameContains TestRG1
	
     Which returns a list of resources formated like:
		
        Name              : sqlservers5wdai7p2k2g4
        ResourceId        : /subscriptions/{guid}/resourceGroups/TestRG1/providers/Microsoft.Sql/servers/sqlservers5wdai7p2k2g4
        ResourceName      : sqlservers5wdai7p2k2g4
        ResourceType      : Microsoft.Sql/servers
        Kind              : v2.0
        ResourceGroupName : TestRG1
        Location          : westus
        SubscriptionId    : {guid}
        Tags              : {System.Collections.Hashtable}
        ...
	        
- You can use tags to logically organize the resources in your subscription, and retrieve resources with the **Find-AzureRmResource** and **Find-AzureRmResourceGroup** cmdlets.

        Find-AzureRmResource -TagName displayName -TagValue Website

        Name              : webSites5wdai7p2k2g4
        ResourceId        : /subscriptions/{guid}/resourceGroups/TestRG1/providers/Microsoft.Web/sites/webSites5wdai7p2k2g4
        ResourceName      : webSites5wdai7p2k2g4
        ResourceType      : Microsoft.Web/sites
        ResourceGroupName : TestRG1
        Location          : westus
        SubscriptionId    : {guid}
                
      There is much more you can do with tags. For more information, see [Using tags to organize your Azure resources](resource-group-using-tags.md).

## Add to a resource group

To add a resource to the resource group, you can use the **New-AzureRmResource** cmdlet. However, adding a resource this way might cause future confusion because the new resource does not exist in your template. If you re-deployed the old template, you would deploy an incomplete solution. If you are deploying often, you will find it easier and more reliable to add the new resource to your template and re-deploy it.

## Move a resource

You can move existing resources to a new resource group. For examples, see [Move Resources to New Resource Group or Subscription](resource-group-move-resources.md).

## Export template

For an existing resource group (deployed through PowerShell or one of the other methods like the portal), you can view the Resource Manager template for the resource group. Exporting the template offers two benefits:

1. You can easily automate future deployments of the solution because all of the infrastructure is defined in the template.

2. You can become familiar with template syntax by looking at the JavaScript Object Notation (JSON) that represents your solution.

Through the PowerShell, you can either generate a template that represents the current state of your resource group, or retrieve the template that was used for a particular deployment.

Exporting the template for a resource group is helpful when you have made changes to a resource group, and need to retrieve the JSON representation of its current state. However, the generated template contains only a minimal number of parameters and no variables. Most of the values in the template are hard-coded. Before deploying the generated template, you may wish to convert more of the values into parameters so you can customize the deployment for different environments.

Exporting the template for a particular deployment is helpful when you need to view the actual template that was used to deploy resources. The template will include all of the parameters and variables defined for the original deployment. However, if someone in your organization has made changes to the resource group outside of what is defined in the template, this template will not represent the current state of the resource group.

> [AZURE.NOTE] The export template feature is in preview, and not all resource types currently support exporting a template. When attempting to export a template, you may see an error that states some resources were not exported. If needed, you can manually define these resources in your template after downloading it.

###Export template from resource group

To view the template for a resource group, run the **Export-AzureRmResourceGroup** cmdlet.

    Export-AzureRmResourceGroup -ResourceGroupName TestRG1 -Path c:\Azure\Templates\Downloads\TestRG1.json
    
###Download template from deployment

To download the template used for a particular deployment, run the **Save-AzureRmResourceGroupDeploymentTemplate** cmdlet.

    Save-AzureRmResourceGroupDeploymentTemplate -DeploymentName azuredeploy -ResourceGroupName TestRG1 -Path c:\Azure\Templates\Downloads\azuredeploy.json

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

## Deployment script

The earlier deployment examples in this topic showed only the individual cmdlets needed to deploy resources to Azure. The following example shows a deployment script that creates the resource group, and deploys the resources.

    <#
      .SYNOPSIS
      Deploys a template to Azure
      
      .DESCRIPTION
      Deploys an Azure Resource Manager template

      .PARAMETER subscriptionId
      The subscription id where the template will be deployed.

      .PARAMETER resourceGroupName
      The resource group where the template will be deployed. Can be the name of an existing or a new resource group.

      .PARAMETER resourceGroupLocation
      Optional, a resource group location. If specified, will try to create a new resource group in this location. If not specified, assumes resource group is existing.

      .PARAMETER deploymentName
      The deployment name.

      .PARAMETER templateFilePath
      Optional, path to the template file. Defaults to template.json.

      .PARAMETER parametersFilePath
      Optional, path to the parameters file. Defaults to parameters.json. If file is not found, will prompt for parameter values based on template.
    #>

    param(
      [Parameter(Mandatory=$True)]
      [string]
      $subscriptionId,

      [Parameter(Mandatory=$True)]
      [string]
      $resourceGroupName,

      [string]
      $resourceGroupLocation,

      [Parameter(Mandatory=$True)]
      [string]
      $deploymentName,

      [string]
      $templateFilePath = "template.json",

      [string]
      $parametersFilePath = "parameters.json"
    )

    #******************************************************************************
    # Script body
    # Execution begins here 
    #******************************************************************************
    $ErrorActionPreference = "Stop"

    # sign in
    Write-Host "Logging in...";
    Add-AzureRmAccount;

    # select subscription
    Write-Host "Selecting subscription '$subscriptionId'";
    Set-AzureRmContext -SubscriptionID $subscriptionId;

    #Create or check for existing resource group
    $resourceGroup = Get-AzureRmResourceGroup -Name $resourceGroupName -ErrorAction SilentlyContinue
    if(!$resourceGroup)
    {
      Write-Host "Resource group '$resourceGroupName' does not exist. To create a new resource group, please enter a location.";
      if(!$resourceGroupLocation) {
        $resourceGroupLocation = Read-Host "resourceGroupLocation";
      }
      Write-Host "Creating resource group '$resourceGroupName' in location '$resourceGroupLocation'";
      New-AzureRmResourceGroup -Name $resourceGroupName -Location $resourceGroupLocation
    }
    else{
      Write-Host "Using existing resource group '$resourceGroupName'";
    }

    # Start the deployment
    Write-Host "Starting deployment...";
    if(Test-Path $parametersFilePath) {
      New-AzureRmResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile $templateFilePath -TemplateParameterFile $parametersFilePath;
    } else {
      New-AzureRmResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile $templateFilePath;
    }

## Next Steps

- To learn about creating Resource Manager templates, see [Authoring Azure Resource Manager Templates](./resource-group-authoring-templates.md).
- To learn about deploying templates, see [Deploy an application with Azure Resource Manager Template](./resource-group-template-deploy.md).
- For a detailed example of deploying a project, see [Deploy microservices predictably in Azure](app-service-web/app-service-deploy-complex-application-predictably.md).
- To learn about troubleshooting a deployment that failed, see [Troubleshooting resource group deployments in Azure](./resource-manager-troubleshoot-deployments-powershell.md).

