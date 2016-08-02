<properties
   pageTitle="Deploy resources with PowerShell and template | Microsoft Azure"
   description="Use Azure Resource Manager and Azure PowerShell to deploy a resources to Azure. The resources are defined in a Resource Manager template."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="timlt"
   editor="tysonn"/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/11/2016"
   ms.author="tomfitz"/>

# Deploy resources with Resource Manager templates and Azure PowerShell

> [AZURE.SELECTOR]
- [PowerShell](resource-group-template-deploy.md)
- [Azure CLI](resource-group-template-deploy-cli.md)
- [Portal](resource-group-template-deploy-portal.md)
- [REST API](resource-group-template-deploy-rest.md)
- [.NET](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-template-deployment/)
- [Java](https://azure.microsoft.com/documentation/samples/resources-java-deploy-using-arm-template/)
- [Python](https://azure.microsoft.com/documentation/samples/resource-manager-python-template-deployment/)
- [Node](https://azure.microsoft.com/documentation/samples/resource-manager-node-template-deployment/)
- [Ruby](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-template-deployment/)


This topic explains how to use Azure PowerShell with Resource Manager templates to deploy your resources to Azure.  

> [AZURE.TIP] For help with debugging an error during deployment, see:
>
> - [View deployment operations with Azure PowerShell](resource-manager-troubleshoot-deployments-powershell.md) to learn about getting information that will help you troubleshoot your error
> - [Troubleshoot common errors when deploying resources to Azure with Azure Resource Manager](resource-manager-common-deployment-errors.md) to learn how to resolve common deployment errors

Your template can be either a local file or an external file that is available through a URI. When your template resides in a storage account, you can restrict access to the template and provide a shared access signature (SAS) token during deployment.

## Quick steps to deployment

This article describes all of the different options available to you during deployment. However, very often you will only need two simple commands. To quickly get started with deployment, use the following commands:

    New-AzureRmResourceGroup -Name ExampleResourceGroup -Location "West US"
    New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile <PathToTemplate> -TemplateParameterFile <PathToParameterFile>

To learn more about options for deployment that might be better suited to your scenario, continue reading this article.

[AZURE.INCLUDE [resource-manager-deployments](../includes/resource-manager-deployments.md)]

## Deploy with PowerShell

1. Login to your Azure account.

        Add-AzureRmAccount

     A summary of your account is returned.

        Environment : AzureCloud
        Account     : someone@example.com
        ...

2. If you have multiple subscriptions, provide the subscription ID you wish to use for deployment with the **Set-AzureRmContext** command. 

        Set-AzureRmContext -SubscriptionID <YourSubscriptionId>

3. Typically, when deploying a new template, you will want to create a new resource group to contain the resources. If you have an existing resource group that you wish to deploy to, you can skip this step and simply use that resource group. 

     To create a new resource group, provide a name and location for your resource group. 

        New-AzureRmResourceGroup -Name ExampleResourceGroup -Location "West US"
   
     A summary of the new resource group is returned.
   
        ResourceGroupName : ExampleResourceGroup
        Location          : westus
        ProvisioningState : Succeeded
        Tags              :
        Permissions       :
             Actions  NotActions
             =======  ==========
             *
        ResourceId        : /subscriptions/######/resourceGroups/ExampleResourceGroup

4. Prior to executing your deployment, you can validate your deployment settings. The **Test-AzureRmResourceGroupDeployment** cmdlet enables you to find problems before creating actual resources. The following example shows how to validate a deployment.

        Test-AzureRmResourceGroupDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile <PathToTemplate>

5. To create a new deployment for your resource group, run the **New-AzureRmResourceGroupDeployment** command and provide the necessary parameters. The parameters will include a name for your deployment, the name of your resource group, the path or URL to the template you created, and any other parameters needed for your scenario. If the **Mode** parameter is not specified, the default value of **Incremental** is used. To run a complete deployment, set **Mode** to **Complete**. Be careful when using the complete mode as you can inadvertently delete resources that are not in your template.

     To deploy a local template, use the **TemplateFile** parameter:

        New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile <PathToTemplate>

     To deploy an external template, use **TemplateUri** parameter:

        New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateUri <LinkToTemplate>
   
     You have the following options for providing parameter values: 
   
     1. Use inline parameters.

            New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile <PathToTemplate> -myParameterName "parameterValue"

     2. Use a parameter object.

            $parameters = @{"<ParameterName>"="<Parameter Value>"}
            New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile <PathToTemplate> -TemplateParameterObject $parameters

     3. Use a local parameter file. For information about the template file, see [Parameter file](#parameter-file).

            New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile <PathToTemplate> -TemplateParameterFile <PathToParameterFile>

     4. Use an external parameter file. For information about the template file, see [Parameter file](#parameter-file).

            New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateUri <LinkToTemplate> -TemplateParameterUri <LinkToParameterFile>

     After the resources have been deployed, you will see a summary of the deployment.

        DeploymentName    : ExampleDeployment
        ResourceGroupName : ExampleResourceGroup
        ProvisioningState : Succeeded
        Timestamp         : 4/14/2015 7:00:27 PM
        Mode              : Incremental
        ...

     If the template includes a parameter with a name that matches one of the parameters in the command to deploy the template (such as including a parameter named **ResourceGroupName** in your template which is the same as the **ResourceGroupName** parameter in the [New-AzureRmResourceGroupDeployment](https://msdn.microsoft.com/library/azure/mt679003.aspx) cmdlet), you will be prompted to provide a value for a parameter with the postfix **FromTemplate** (such as **ResourceGroupNameFromTemplate**). In general, you should avoid this confusion by not naming parameters with the same name as parameters used for deployment operations.

6. If you want to log additional information about the deployment that may help you troubleshoot any deployment errors, use the **DeploymentDebugLogLevel** parameter. You can specify that request content, response content, or both be logged with the deployment operation.

        New-AzureRmResourceGroupDeployment -Name ExampleDeployment -DeploymentDebugLogLevel All -ResourceGroupName ExampleResourceGroup -TemplateFile <PathOrLinkToTemplate>
        
     For more information about using this debugging content to troubleshoot deployments, see [Troubleshooting resource group deployments with Azure PowerShell](resource-manager-troubleshoot-deployments-powershell.md).

## Deploy template from storage with SAS token

You can add your templates to a storage account and link to them during deployment with a SAS token.

> [AZURE.IMPORTANT] By following the steps below, the blob containing the template is accessible to only the account owner. However, when you create a SAS token for the blob, the blob is accessible to anyone with that URI. If another user intercepts the URI, that user is able to access the template. Using a SAS token is a good way of limiting access to your templates, but you should not include sensitive data like passwords directly in the template.

### Add private template to storage account

The following steps set up a storage account for templates:

1. Create a new resource group.

        New-AzureRmResourceGroup -Name ManageGroup -Location "West US"

2. Create a new storage account. The storage account name must be unique across Azure, so provide your own name for the account.

        New-AzureRmStorageAccount -ResourceGroupName ManageGroup -Name storagecontosotemplates -Type Standard_LRS -Location "West US"

3. Set the current storage account.

        Set-AzureRmCurrentStorageAccount -ResourceGroupName ManageGroup -Name storagecontosotemplates

4. Create a new container. The permission is set to **Off** which means the container is only accessible to the owner.

        New-AzureStorageContainer -Name templates -Permission Off
        
5. Add your template to the container.

        Set-AzureStorageBlobContent -Container templates -File c:\Azure\Templates\azuredeploy.json
        
### Provide SAS token during deployment

To deploy a private template in a storage account, retrieve a SAS token and include it in the URI for the template.

1. If you have changed the current storage account, set the current storage account to the one containing your templates.

        Set-AzureRmCurrentStorageAccount -ResourceGroupName ManageGroup -Name storagecontosotemplates

2. Create a SAS token with read permissions and an expiry time to limit access. Retrieve the full URI of the template including the SAS token.

        $templateuri = New-AzureStorageBlobSASToken -Container templates -Blob azuredeploy.json -Permission r -ExpiryTime (Get-Date).AddHours(2.0) -FullUri

3. Deploy the template by providing the URI that includes the SAS token.

        New-AzureRmResourceGroupDeployment -ResourceGroupName ExampleResourceGroup -TemplateUri $templateuri

For an example of using a SAS token with linked templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).

[AZURE.INCLUDE [resource-manager-parameter-file](../includes/resource-manager-parameter-file.md)]

## Next steps
- For an example of deploying resources through the .NET client library, see [Deploy resources using .NET libraries and a template](virtual-machines/virtual-machines-windows-csharp-template.md).
- To define parameters in template, see [Authoring templates](resource-group-authoring-templates.md#parameters).
- For guidance on deploying your solution to different environments, see [Development and test environments in Microsoft Azure](solution-dev-test-environments.md).
- For details about using a KeyVault reference to pass secure values, see [Pass secure values during deployment](resource-manager-keyvault-parameter.md).

