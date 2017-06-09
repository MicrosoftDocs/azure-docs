---
title: Manage resources with the Azure CLI | Microsoft Docs
description: Use the Azure Command-Line Interface (CLI) to manage Azure resources and groups
editor: ''
manager: timlt
documentationcenter: ''
author: tfitzmac
services: azure-resource-manager

ms.assetid: bb0af466-4f65-4559-ac3a-43985fa096ff
ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: vm-multiple
ms.devlang: na
ms.topic: article
ms.date: 08/22/2016
ms.author: tomfitz

---
# Use the Azure CLI to manage Azure resources and resource groups
> [!div class="op_single_selector"]
> * [Portal](resource-group-portal.md) 
> * [Azure CLI](xplat-cli-azure-resource-manager.md)
> * [Azure PowerShell](powershell-azure-resource-manager.md)
> * [REST API](resource-manager-rest-api.md)
> 
> 

The Azure Command-Line Interface (Azure CLI) is one of several tools you can use to deploy and manage resources with Resource Manager. This article introduces common ways to manage Azure resources and resource groups by using the Azure CLI in Resource Manager mode. For information about using the CLI to deploy resources, see [Deploy resources with Resource Manager templates and Azure CLI](resource-group-template-deploy-cli.md). For background about Azure resources and Resource Manager, visit the [Azure Resource Manager Overview](resource-group-overview.md).

> [!NOTE]
> To manage Azure resources with the Azure CLI, you need to [install the Azure CLI](../cli-install-nodejs.md), and [log in to Azure](../xplat-cli-connect.md) by using the `azure login` command. Make sure the CLI is in Resource Manager mode (run `azure config mode arm`). If you've done these things, you're ready to go.
> 
> 

## Get resource groups and resources
### Resource groups
To get a list of all resource groups in your subscription and their locations, run this command.

    azure group list


### Resources
 To list all resources in a group, such as one with name *testRG*, use the following command:

    azure resource list testRG

To view an individual resource within the group, such as a VM named *MyUbuntuVM*, use a command like the following:

    azure resource show testRG MyUbuntuVM Microsoft.Compute/virtualMachines -o "2015-06-15"

Notice the **Microsoft.Compute/virtualMachines** parameter. This parameter indicates the type of the resource you are requesting information on.

> [!NOTE]
> When using the **azure resource** commands other than the **list** command, you must specify the API version of the resource with the **-o** parameter. If you're unsure about the API version, consult the template file and find the apiVersion field for the resource. For more about API versions in Resource Manager, see [Resource providers and types](resource-manager-supported-services.md).
> 
> 

When viewing details on a resource, it is often useful to use the `--json` parameter. This parameter makes the output more readable, because some values are nested structures, or collections. The following example demonstrates returning the results of the **show** command as a JSON document.

    azure resource show testRG MyUbuntuVM Microsoft.Compute/virtualMachines -o "2015-06-15" --json

> [!NOTE]
> If you want, save the JSON data to file by using the &gt; character to direct the output to a file. For example:
> 
> `azure resource show testRG MyUbuntuVM Microsoft.Compute/virtualMachines -o "2015-06-15" --json > myfile.json`
> 
> 

### Tags
[!INCLUDE [resource-manager-tag-resources-cli](../../includes/resource-manager-tag-resources-cli.md)]

## Manage resources
To add a resource such as a storage account to a resource group, run a command similar to:

    azure resource create testRG MyStorageAccount "Microsoft.Storage/storageAccounts" "westus" -o "2015-06-15" -p "{\"accountType\": \"Standard_LRS\"}"

In addition to specifying the API version of the resource with the **-o** parameter, use the **-p** parameter to pass a JSON-formatted string with any required or additional properties.

To delete an existing resource such as a virtual machine resource, use a command like the following:

    azure resource delete testRG MyUbuntuVM Microsoft.Compute/virtualMachines -o "2015-06-15"

To move existing resources to another resource group or subscription, use the **azure resource move** command. The following example shows how to move a Redis Cache to a new resource group. In the **-i** parameter, provide a comma-separated list of the resource id's to move.

    azure resource move -i "/subscriptions/{guid}/resourceGroups/OldRG/providers/Microsoft.Cache/Redis/examplecache" -d "NewRG"

## Control access to resources
You can use the Azure CLI to create and manage policies to control access to Azure resources. For background about policy definitions and assigning policies to resources, see [Use policy to manage resources and control access](resource-manager-policy.md).

For example, define the following policy to deny all requests where location is not West US or North Central US, and save it to the policy definition file policy.json:

    {
    "if" : {
        "not" : {
        "field" : "location",
        "in" : ["westus" ,  "northcentralus"]
        }
    },
    "then" : {
        "effect" : "deny"
    }
    }

Then run the **policy definition create** command:

    azure policy definition create MyPolicy -p c:\temp\policy.json

This command shows output similar to the following:

    + Creating policy definition MyPolicy
    data:    PolicyName:             MyPolicy
    data:    PolicyDefinitionId:     /subscriptions/########-####-####-####-############/providers/Microsoft.Authorization/policyDefinitions/MyPolicy

    data:    PolicyType:             Custom
    data:    DisplayName:            undefined
    data:    Description:            undefined
    data:    PolicyRule:             field=location, in=[westus, northcentralus], effect=deny

 To assign a policy at the scope you want, use the **PolicyDefinitionId** returned from the previous command. In the following example, this scope is the subscription, but you can scope to resource groups or individual resources:

    azure policy assignment create MyPolicyAssignment -p /subscriptions/########-####-####-####-############/providers/Microsoft.Authorization/policyDefinitions/MyPolicy -s /subscriptions/########-####-####-####-############/

You can get, change, or remove policy definitions by using the **policy definition show**, **policy definition set**, and **policy definition delete** commands.

Similarly, you can get, change, or remove policy assignments by using the **policy assignment show**, **policy assignment set**, and **policy assignment delete** commands.

## Export a resource group as a template
For an existing resource group, you can view the Resource Manager template for the resource group. Exporting the template offers two benefits:

1. You can easily automate future deployments of the solution because all the infrastructure is defined in the template.
2. You can become familiar with template syntax by looking at the JSON that represents your solution.

Using the Azure CLI, you can either export a template that represents the current state of your resource group, or download the template that was used for a particular deployment.

* **Export the template for a resource group** - This is helpful when you made changes to a resource group, and need to retrieve the JSON representation of its current state. However, the generated template contains only a minimal number of parameters and no variables. Most of the values in the template are hard-coded. Before deploying the generated template, you may wish to convert more of the values into parameters so you can customize the deployment for different environments.
  
    To export the template for a resource group to a local directory, run the `azure group export` command as shown in the following example. (Substitute a local directory appropriate for your operating system environment.)
  
        azure group export testRG ~/azure/templates/
* **Download the template for a particular deployment** -- This is helpful when you need to view the actual template that was used to deploy resources. The template includes all parameters and variables defined for the original deployment. However, if someone in your organization made changes to the resource group outside of the definition in the template, this template doesn't represent the current state of the resource group.
  
    To download the template used for a particular deployment to a local directory, run the `azure group deployment template download` command. For example:
  
        azure group deployment template download TestRG testRGDeploy ~/azure/templates/downloads/

> [!NOTE]
> Template export is in preview, and not all resource types currently support exporting a template. When attempting to export a template, you may see an error that states some resources were not exported. If needed, manually define these resources in your template after downloading it.
> 
> 

## Next steps
* To get details of deployment operations and troubleshoot deployment errors with the Azure CLI, see [View deployment operations](resource-manager-deployment-operations.md).
* If you want to use the CLI to set up an application or script to access resources, see [Use Azure CLI to create a service principal to access resources](resource-group-authenticate-service-principal-cli.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

