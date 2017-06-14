---
title: Deploy resources with REST API and template | Microsoft Docs
description: Use Azure Resource Manager and Resource Manager REST API to deploy a resources to Azure. The resources are defined in a Resource Manager template.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 1d8fbd4c-78b0-425b-ba76-f2b7fd260b45
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/10/2017
ms.author: tomfitz

---
# Deploy resources with Resource Manager templates and Resource Manager REST API
> [!div class="op_single_selector"]
> * [PowerShell](resource-group-template-deploy.md)
> * [Azure CLI](resource-group-template-deploy-cli.md)
> * [Portal](resource-group-template-deploy-portal.md)
> * [REST API](resource-group-template-deploy-rest.md)
> 
> 

This article explains how to use the Resource Manager REST API with Resource Manager templates to deploy your resources to Azure.  

> [!TIP]
> For help with debugging an error during deployment, see:
> 
> * [View deployment operations](resource-manager-deployment-operations.md) to learn about getting information that helps you troubleshoot your error
> * [Troubleshoot common errors when deploying resources to Azure with Azure Resource Manager](resource-manager-common-deployment-errors.md) to learn how to resolve common deployment errors
> 
> 

Your template can be either a local file or an external file that is available through a URI. When your template resides in a storage account, you can restrict access to the template and provide a shared access signature (SAS) token during deployment.

[!INCLUDE [resource-manager-deployments](../../includes/resource-manager-deployments.md)]

## Deploy with the REST API
1. Set [common parameters and headers](https://docs.microsoft.com/rest/api/index), including authentication tokens.
2. If you do not have an existing resource group, create a resource group. Provide your subscription ID, the name of the new resource group, and location that you need for your solution. For more information, see [Create a resource group](https://docs.microsoft.com/rest/api/resources/resourcegroups#ResourceGroups_CreateOrUpdate).
   
        PUT https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>?api-version=2015-01-01
          <common headers>
          {
            "location": "West US",
            "tags": {
               "tagname1": "tagvalue1"
            }
          }
3. Validate your deployment before executing it by running the [Validate a template deployment](https://docs.microsoft.com/rest/api/resources/deployments#Deployments_Validate) operation. When testing the deployment, provide parameters exactly as you would when executing the deployment (shown in the next step).
4. Create a deployment. Provide your subscription ID, the name of the resource group, the name of the deployment, and a link to your template. For information about the template file, see [Parameter file](#parameter-file). For more information about the REST API to create a resource group, see [Create a template deployment](https://docs.microsoft.com/rest/api/resources/deployments#Deployments_CreateOrUpdate). Notice the **mode** is set to **Incremental**. To run a complete deployment, set **mode** to **Complete**. Be careful when using the complete mode as you can inadvertently delete resources that are not in your template.
   
        PUT https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>/providers/Microsoft.Resources/deployments/<YourDeploymentName>?api-version=2015-01-01
          <common headers>
          {
            "properties": {
              "templateLink": {
                "uri": "http://mystorageaccount.blob.core.windows.net/templates/template.json",
                "contentVersion": "1.0.0.0"
              },
              "mode": "Incremental",
              "parametersLink": {
                "uri": "http://mystorageaccount.blob.core.windows.net/templates/parameters.json",
                "contentVersion": "1.0.0.0"
              }
            }
          }
   
      If you want to log response content, request content, or both, include **debugSetting** in the request.
   
        "debugSetting": {
          "detailLevel": "requestContent, responseContent"
        }
   
      You can set up your storage account to use a shared access signature (SAS) token. For more information, see [Delegating Access with a Shared Access Signature](https://docs.microsoft.com/rest/api/storageservices/delegating-access-with-a-shared-access-signature).
5. Get the status of the template deployment. For more information, see [Get information about a template deployment](https://docs.microsoft.com/rest/api/resources/deployments#Deployments_Get).
   
          GET https://management.azure.com/subscriptions/<YourSubscriptionId>/resourcegroups/<YourResourceGroupName>/providers/Microsoft.Resources/deployments/<YourDeploymentName>?api-version=2015-01-01
           <common headers>

## Parameter file

[!INCLUDE [resource-manager-parameter-file](../../includes/resource-manager-parameter-file.md)]

## Next steps
* To learn about handling asynchronous REST operations, see [Track asynchronous Azure operations](resource-manager-async-operations.md).
* For an example of deploying resources through the .NET client library, see [Deploy resources using .NET libraries and a template](../virtual-machines/windows/csharp-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
* To define parameters in template, see [Authoring templates](resource-group-authoring-templates.md#parameters).
* For guidance on deploying your solution to different environments, see [Development and test environments in Microsoft Azure](solution-dev-test-environments.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).
* For a four part series about automating deployment, see [Automating application deployments to Azure Virtual Machines](../virtual-machines/windows/dotnet-core-1-landing.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). This series covers application architecture, access and security, availability and scale, and application deployment.

