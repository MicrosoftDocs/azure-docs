<properties
   pageTitle="Deploy an application with Azure Resource Manager Template"
   services="azure-portal"
   description="Use Azure Resource Manager to deploy an application to Azure. A template is a JSON file and can be used from the Portal, PowerShell, the Azure Command-Line Interface for Mac, Linux, and Windows, or REST."
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-portal"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/29/2015"
   ms.author="tomfitz;ryjones"/>

# Deploy an application with Azure Resource Manager template

This topic explains how to use Azure Resource Manager templates to deploy your application to Azure. It shows how deploy your application by using either Azure PowerShell, Azure CLI, REST API, or the Microsoft Azure preview portal.

Azure Resource Manager templates enable you to quickly and easily provision your applications in Azure via declarative JSON. In a single JSON template, you can deploy multiple services, such as Virtual Machines, Virtual Networks, Storage, App Services, and databases. You use the same template to repeatedly and consistently deploy your application during every stage of the application lifecycle.

To simplify management of your application, you can organize all of the resources that share a common lifecycle into a single resource group. Resource groups make it easy to deploy, update, and delete all of the related resources together. In most cases, a resource group maps to either a single application or an application tier (for large applications). The resource deployed through a template will reside within a single resource groups, but they can include dependencies in other resource groups.   

Within a resource group, you can track the execution of a deployment, and see the status of the deployment and any output from template execution.

When deploying an application with a template, you can provide parameter values to customize how the resources are created.  You specify values for these parameters either inline or in a parameter file.

## Concepts

- Resource Group - collection of entities that share a common lifecycle
- Resource Manager Template - declarative JSON file that defines the goal state of a deployment
- Deployment - operation which tracks execution of a Resource Manager template
- Parameters - values provided by the user executing the deployment to customize deployed resources
- Parameter file - JSON file that stores parameter names and values 

## Scenarios

With Resource Manager templates, you can:

- Deploy complex multitier applications, such as Microsoft SharePoint.
- Consistently and repeatedly deploy your applications.
- Support dev, test, and production environments.
- View the status of deployments.
- Troubleshoot deployment failures using deployment audit logs.

## Deploy with the preview portal

Guess what?  Every application in the Gallery is backed by an Azure Resource Manager template!  By simply creating a Virtual Machine, Virtual Network, Storage Account, App Service, or database through the portal, you're already reaping the benefits of Azure Resource Manager without additional effort.

To troubleshoot deployments through the preview portal, click **Browse** -> **Resource Groups** -> *YourResourceGroupName*.  From here, click on the **Events** tile under the **Monitoring** lens.  Finally, you can select an individual **operation** and **event** to view details.

## Deploy with PowerShell

If you have not previously used Azure PowerShell with Resource Manager, see [Using Azure PowerShell with Azure Resource Manager](./powershell-azure-resource-manager.md).

1. Login to your Azure account. After providing your credentials, the command returns information about your account.

        PS C:\> Add-AzureAccount

        Id                             Type       ...
        --                             ----    
        someone@example.com            User       ...   

2. If you have multiple subscriptions, provide the subscription id you wish to use for deployment. 

        PS C:\> Select-AzureSubscription -SubscriptionID <YourSubscriptionId>

3. Switch to the Azure Resource Manager module.

        PS C:\> Switch-AzureMode AzureResourceManager

4. If you do not have an existing resource group, create a new resource group. Provide the name of the resource group and location that you need for your solution. A summary of the new resource group is returned.

        PS C:\> New-AzureResourceGroup -Name ExampleResourceGroup -Location "West US"
   
        ResourceGroupName : ExampleResourceGroup
        Location          : westus
        ProvisioningState : Succeeded
        Tags              :
        Permissions       :
                    Actions  NotActions
                    =======  ==========
                    *
        ResourceId        : /subscriptions/######/resourceGroups/ExampleResourceGroup

5. To create a new deployment for your resource group, run the **New-AzureResourceGroupDeployment** command and provide the necessary parameters. The parameters will include a name for your deployment, the name of your resource group, the path or URL to the template you created, and any other parameters needed for your scenario.
   
     You have the following options for providing parameter values: 
   
     - Use inline parameters.

            PS C:\> New-AzureResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile <PathOrLinkToTemplate> -myParameterName "parameterValue"

     - Use a parameter object.

            PS C:\> $parameters = @{"<ParameterName>"="<Parameter Value>"}
            PS C:\> New-AzureResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile <PathOrLinkToTemplate> -TemplateParameterObject $parameters

     - Using a parameter file. For information about the template file, see [Parameter file](./#parameter-file).

            PS C:\> New-AzureResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile <PathOrLinkToTemplate> -TemplateParameterFile <PathOrLinkToParameterFile>

     When the resource group has been deployed, you will see a summary of the deployment.

          DeploymentName    : ExampleDeployment
          ResourceGroupName : ExampleResourceGroup
          ProvisioningState : Succeeded
          Timestamp         : 4/14/2015 7:00:27 PM
          Mode              : Incremental
          ...

6. To get information about deployment failures.

        PS C:\> Get-AzureResourceGroupLog -ResourceGroup ExampleResourceGroup -Status Failed

7. To get detailed information about deployment failures.

        PS C:\> Get-AzureResourceGroupLog -ResourceGroup ExampleResourceGroup -Status Failed -DetailedOutput

## Deploy with Azure CLI for Mac, Linux and Windows

If you have not previously used Azure CLI with Resource Manager, see [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](./xplat-cli-azure-resource-manager.md).

1. Login to your Azure account. After providing your credentials, the command returns the result of your login.

        azure login
  
        ...
        info:    login command OK

2. If you have multiple subscriptions, provide the subscription id you wish to use for deployment.

        azure account set <YourSubscriptionNameOrId>

3. Switch to Azure Resource Manager module. You will receive confirmation of the new mode.

        azure config mode arm
   
        info:     New mode is arm

4. If you do not have an existing resource group, create a new resource group. Provide the name of the resource group and location that you need for your solution. A summary of the new resource group is returned.

        azure group create -n ExampleResourceGroup -l "West US"
   
        info:    Executing command group create
        + Getting resource group ExampleResourceGroup
        + Creating resource group ExampleResourceGroup
        info:    Created resource group ExampleResourceGroup
        data:    Id:                  /subscriptions/####/resourceGroups/ExampleResourceGroup
        data:    Name:                ExampleResourceGroup
        data:    Location:            westus
        data:    Provisioning State:  Succeeded
        data:    Tags:
        data:
        info:    group create command OK

5. To create a new deployment for your resource group, run the following command and provide the necessary parameters. The parameters will include a name for your deployment, the name of your resource group, the path or URL to the template you created, and any other parameters needed for your scenario. 
   
     You have the following options for providing parameter values: 

     - Use inline parameters and a local template.

             azure group deployment create -f <PathToTemplate> {"ParameterName":"ParameterValue"} -g ExampleResourceGroup -n ExampleDeployment

     - Use inline parameters and a link to a template.

             azure group deployment create --template-uri <LinkToTemplate> {"ParameterName":"ParameterValue"} -g ExampleResourceGroup -n ExampleDeployment

     - Use a parameter file. For information about the template file, see [Parameter file](./#parameter-file).
    
             azure group deployment create -f <PathToTemplate> -e <PathToParameterFile> -g ExampleResourceGroup -n ExampleDeployment

     When the resource group has been deployed, you will see a summary of the deployment.
  
           info:    Executing command group deployment create
           + Initializing template configurations and parameters
           + Creating a deployment
           ...
           info:    group deployment create command OK


6. To get information about your latest deployment.

         azure group log show -l ExampleResourceGroup

7. To get detailed information about deployment failures.
      
         azure group log show -l -v ExampleResourceGroup

## Deploy with the REST API
1. Set [common parameters and headers](https://msdn.microsoft.com/library/azure/8d088ecc-26eb-42e9-8acc-fe929ed33563#bk_common), including authentication tokens.
2. If you do not have an existing resource group, create a new resource group. Provide your subscription id, the name of the new resource group, and location that you need for your solution. For more information, see [Create a resource group](https://msdn.microsoft.com/library/azure/dn790525.aspx).

         PUT https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>?api-version=2015-01-01
           <common headers>
           {
             "location": "West US",
             "tags": {
               "tagname1": "tagvalue1"
             }
           }
   
3. Create a new resource group deployment. Provide your subscription id, the name of the resource group to deploy, the name of the deployment, and the location of your template. For information about the template file, see [Parameter file](./#parameter-file). For more information about the REST API to create a resource group, see [Create a template deployment](https://msdn.microsoft.com/library/azure/dn790564.aspx).
    
         PUT https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>/providers/Microsoft.Resources/deployments/<YourDeploymentName>?api-version=2015-01-01
            <common headers>
            {
              "properties": {
                "templateLink": {
                  "uri": "http://mystorageaccount.blob.core.windows.net/templates/template.json",
                  "contentVersion": "1.0.0.0",
                },
                "mode": "Incremental",
                "parametersLink": {
                  "uri": "http://mystorageaccount.blob.core.windows.net/templates/parameters.json",
                  "contentVersion": "1.0.0.0",
                }
              }
            }
   
4. Get the status of the template deployment. For more information, see [Get information about a template deployment](https://msdn.microsoft.com/library/azure/dn790565.aspx).

         GET https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>/providers/Microsoft.Resources/deployments/<YourDeploymentName>?api-version=2015-01-01
           <common headers>

## Parameter file

If you use a parameter file to pass the parameter values to your template during deployment, you'll need to create a JSON file with a format similar to the following example.

    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "webSiteName": {
                "value": "ExampleSite"
            },
            "webSiteHostingPlanName": {
                "value": "DefaultPlan"
            },
            "webSiteLocation": {
                "value": "West US"
            }
       }
    }

## Next steps
- [Azure Resource Manager Overview](./resource-group-overview.md)
- [Deploy resources using .NET libraries and a template](./arm-template-deployment.md)
- [Authoring templates](./resource-group-authoring-templates.md)
- [Template functions](./resource-group-template-functions.md)
- [Advanced template operations](./resource-group-advanced-template.md)  

