<properties
   pageTitle="Deploy resources with REST API and template | Microsoft Azure"
   description="Use Azure Resource Manager and Resource Manager REST API to deploy a resources to Azure. The resources are defined in a Resource Manager template."
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

# Deploy resources with Resource Manager templates and Resource Manager REST API

> [AZURE.SELECTOR]
- [PowerShell](resource-group-template-deploy.md)
- [Azure CLI](resource-group-template-deploy-cli.md)
- [Portal](resource-group-template-deploy-portal.md)
- [REST API](resource-group-template-deploy-rest.md)
- [.NET](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-template-deployment/)
- [Java](https://azure.microsoft.com/documentation/samples/resources-java-deploy-using-arm-template/)
- [Node](https://azure.microsoft.com/documentation/samples/resource-manager-node-template-deployment/)
- [Python](https://azure.microsoft.com/documentation/samples/resource-manager-python-template-deployment/)
- [Ruby](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-template-deployment/)

This article explains how to use the Resource Manager REST API with Resource Manager templates to deploy your resources to Azure.  

> [AZURE.TIP] For help with debugging an error during deployment, see:
>
> - [View deployment operations with REST API](resource-manager-troubleshoot-deployments-rest.md) to learn about getting information that will help you troubleshoot your error
> - [Troubleshoot common errors when deploying resources to Azure with Azure Resource Manager](resource-manager-common-deployment-errors.md) to learn how to resolve common deployment errors

Your template can be either a local file or an external file that is available through a URI. When your template resides in a storage account, you can restrict access to the template and provide a shared access signature (SAS) token during deployment.

[AZURE.INCLUDE [resource-manager-deployments](../includes/resource-manager-deployments.md)]

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
   
3. Validate your deployment prior to executing it by running the [Validate a template deployment](https://msdn.microsoft.com/library/azure/dn790547.aspx) operation. When testing the deployment, provide parameters exactly as you would when executing the deployment (shown in the next step).

3. Create a new deployment. Provide your subscription id, the name of the resource group to deploy, the name of the deployment, and a link to your template. For information about the template file, see [Parameter file](./#parameter-file). For more information about the REST API to create a resource group, see [Create a template deployment](https://msdn.microsoft.com/library/azure/dn790564.aspx). Notice the **mode** is set to **Incremental**. To run a complete deployment, set **mode** to **Complete**. Be careful when using the complete mode as you can inadvertently delete resources that are not in your template.
    
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
   
      If you want to log response content, request content, or both, include **debugSetting** in the request.

        "debugSetting": {
          "detailLevel": "requestContent, responseContent"
        }

      You can set up your storage account to use a shared access signature (SAS) token. For more information, see [Delegating Access with a Shared Access Signature](https://msdn.microsoft.com/library/ee395415.aspx).

4. Get the status of the template deployment. For more information, see [Get information about a template deployment](https://msdn.microsoft.com/library/azure/dn790565.aspx).

          GET https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>/providers/Microsoft.Resources/deployments/<YourDeploymentName>?api-version=2015-01-01
           <common headers>

[AZURE.INCLUDE [resource-manager-parameter-file](../includes/resource-manager-parameter-file.md)]

## Next steps
- For an example of deploying resources through the .NET client library, see [Deploy resources using .NET libraries and a template](virtual-machines/virtual-machines-windows-csharp-template.md).
- To define parameters in template, see [Authoring templates](resource-group-authoring-templates.md#parameters).
- For guidance on deploying your solution to different environments, see [Development and test environments in Microsoft Azure](solution-dev-test-environments.md).
- For details about using a KeyVault reference to pass secure values, see [Pass secure values during deployment](resource-manager-keyvault-parameter.md).
