<properties
   pageTitle="Deploy resources with Azure CLI and template | Microsoft Azure"
   description="Use Azure Resource Manager and Azure CLI to deploy a resources to Azure. The resources are defined in a Resource Manager template."
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

# Deploy resources with Resource Manager templates and Azure CLI

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

This topic explains how to use Azure CLI with Resource Manager templates to deploy your resources to Azure.  

> [AZURE.TIP] For help with debugging an error during deployment, see:
>
> - [View deployment operations with Azure CLI](resource-manager-troubleshoot-deployments-cli.md) to learn about getting information that will help you troubleshoot your error
> - [Troubleshoot common errors when deploying resources to Azure with Azure Resource Manager](resource-manager-common-deployment-errors.md) to learn how to resolve common deployment errors

Your template can be either a local file or an external file that is available through a URI. When your template resides in a storage account, you can restrict access to the template and provide a shared access signature (SAS) token during deployment.

## Quick steps to deployment

This article describes all of the different options available to you during deployment. However, very often you will only need two simple commands. To quickly get started with deployment, use the following commands:

    azure group create -n ExampleResourceGroup -l "West US"
    azure group deployment create -f <PathToTemplate> -e <PathToParameterFile> -g ExampleResourceGroup -n ExampleDeployment

To learn more about options for deployment that might be better suited to your scenario, continue reading this article.

[AZURE.INCLUDE [resource-manager-deployments](../includes/resource-manager-deployments.md)]

## Deploy with Azure CLI

If you have not previously used Azure CLI with Resource Manager, see [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](xplat-cli-azure-resource-manager.md).

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

5. Validate your deployment prior to executing it by running the **azure group template validate** command. When testing the deployment, provide parameters exactly as you would when executing the deployment (shown in the next step).

        azure group template validate -f <PathToTemplate> -p "{\"ParameterName\":{\"value\":\"ParameterValue\"}}" -g ExampleResourceGroup

5. To create a new deployment for your resource group, run the following command and provide the necessary parameters. The parameters will include a name for your deployment, the name of your resource group, the path or URL to the template you created, and any other parameters needed for your scenario. 
   
     You have the following three options for providing parameter values: 

     1. Use inline parameters and a local template. Each parameter is in the format: `"ParameterName": { "value": "ParameterValue" }`. The example below shows the parameters with escape characters.

            azure group deployment create -f <PathToTemplate> -p "{\"ParameterName\":{\"value\":\"ParameterValue\"}}" -g ExampleResourceGroup -n ExampleDeployment

     2. Use inline parameters and a link to a template.

            azure group deployment create --template-uri <LinkToTemplate> -p "{\"ParameterName\":{\"value\":\"ParameterValue\"}}" -g ExampleResourceGroup -n ExampleDeployment

     3. Use a parameter file. For information about the template file, see [Parameter file](./#parameter-file).
    
            azure group deployment create -f <PathToTemplate> -e <PathToParameterFile> -g ExampleResourceGroup -n ExampleDeployment

     After the resources have been deployed through one of the 3 methods above, you will see a summary of the deployment.
  
        info:    Executing command group deployment create
        + Initializing template configurations and parameters
        + Creating a deployment
        ...
        info:    group deployment create command OK

     To run a complete deployment, set **mode** to **Complete**. Be careful when using this mode as you can inadvertently delete resources that are not in your template.

        azure group deployment create --mode Complete -f <PathToTemplate> -e <PathToParameterFile> -g ExampleResourceGroup -n ExampleDeployment

6. If you want to log additional information about the deployment that may help you troubleshoot any deployment errors, use the **debug-setting** parameter. You can specify that request content, response content, or both be logged with the deployment operation.

        azure group deployment create --debug-setting All -f <PathToTemplate> -e <PathToParameterFile> -g ExampleResourceGroup -n ExampleDeployment

## Deploy template from storage with SAS token

You can add your templates to a storage account and link to them during deployment with a SAS token.

> [AZURE.IMPORTANT] By following the steps below, the blob containing the template is accessible to only the account owner. However, when you create a SAS token for the blob, the blob is accessible to anyone with that URI. If another user intercepts the URI, that user is able to access the template. Using a SAS token is a good way of limiting access to your templates, but you should not include sensitive data like passwords directly in the template.

### Add private template to storage account

The following steps set up a storage account for templates:

1. Create a new resource group.

        azure group create -n "ManageGroup" -l "westus"

2. Create a new storage account. The storage account name must be unique across Azure, so provide your own name for the account.

        azure storage account create -g ManageGroup -l "westus" --sku-name LRS --kind Storage storagecontosotemplates

3. Set variables for the storage account and key.

        export AZURE_STORAGE_ACCOUNT=storagecontosotemplates
        export AZURE_STORAGE_ACCESS_KEY={storage_account_key}

4. Create a new container. The permission is set to **Off** which means the container is only accessible to the owner.

        azure storage container create --container templates -p Off 
        
4. Add your template to the container.

        azure storage blob upload --container templates -f c:\Azure\Templates\azuredeploy.json
        
### Provide SAS token during deployment

To deploy a private template in a storage account, retrieve a SAS token and include it in the URI for the template.

1. Create a SAS token with read permissions and an expiry time to limit access. Set the expiry time to allow enough time to complete the deployment. Retrieve the full URI of the template including the SAS token.

        expiretime=$(date -I'minutes' --date "+30 minutes")
        fullurl=$(azure storage blob sas create --container templates --blob azuredeploy.json --permissions r --expiry $expiretimetime --json  | jq ".url")

2. Deploy the template by providing the URI that includes the SAS token.

        azure group deployment create --template-uri $fullurl -g ExampleResourceGroup

For an example of using a SAS token with linked templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).

[AZURE.INCLUDE [resource-manager-parameter-file](../includes/resource-manager-parameter-file.md)]

## Next steps
- For an example of deploying resources through the .NET client library, see [Deploy resources using .NET libraries and a template](virtual-machines/virtual-machines-windows-csharp-template.md).
- To define parameters in template, see [Authoring templates](resource-group-authoring-templates.md#parameters).
- For guidance on deploying your solution to different environments, see [Development and test environments in Microsoft Azure](solution-dev-test-environments.md).
- For details about using a KeyVault reference to pass secure values, see [Pass secure values during deployment](resource-manager-keyvault-parameter.md).

