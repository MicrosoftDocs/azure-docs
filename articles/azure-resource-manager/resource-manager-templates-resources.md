---
title: Azure Resource Manager template resources | Microsoft Docs
description: Describes the resources section of Azure Resource Manager templates using declarative JSON syntax.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/11/2018
ms.author: tomfitz
---

# Resources section of Azure Resource Manager templates

In the resources section, you define the resources that are deployed or updated. This section can get complicated because you must understand the types you're deploying to provide the right values.

## Available properties

You define resources with the following structure:

```json
"resources": [
  {
      "condition": "<true-to-deploy-this-resource>",
      "apiVersion": "<api-version-of-resource>",
      "type": "<resource-provider-namespace/resource-type-name>",
      "name": "<name-of-the-resource>",
      "location": "<location-of-resource>",
      "tags": {
          "<tag-name1>": "<tag-value1>",
          "<tag-name2>": "<tag-value2>"
      },
      "comments": "<your-reference-notes>",
      "copy": {
          "name": "<name-of-copy-loop>",
          "count": <number-of-iterations>,
          "mode": "<serial-or-parallel>",
          "batchSize": <number-to-deploy-serially>
      },
      "dependsOn": [
          "<array-of-related-resource-names>"
      ],
      "properties": {
          "<settings-for-the-resource>",
          "copy": [
              {
                  "name": ,
                  "count": ,
                  "input": {}
              }
          ]
      },
      "sku": {
          "name": "<sku-name>",
          "tier": "<sku-tier>",
          "size": "<sku-size>",
          "family": "<sku-family>",
          "capacity": <sku-capacity>
      },
      "kind": "<type-of-resource>",
      "plan": {
          "name": "<plan-name>",
          "promotionCode": "<plan-promotion-code>",
          "publisher": "<plan-publisher>",
          "product": "<plan-product>",
          "version": "<plan-version>"
      },
      "resources": [
          "<array-of-child-resources>"
      ]
  }
]
```

| Element name | Required | Description |
|:--- |:--- |:--- |
| condition | No | Boolean value that indicates whether the resource will be provisioned during this deployment. When `true`, the resource is created during the deployment. When `false`, the resource is skipped for this deployment. |
| apiVersion |Yes |Version of the REST API to use for creating the resource. |
| type |Yes |Type of the resource. This value is a combination of the namespace of the resource provider and the resource type (such as **Microsoft.Storage/storageAccounts**). |
| name |Yes |Name of the resource. The name must follow URI component restrictions defined in RFC3986. In addition, Azure services that expose the resource name to outside parties validate the name to make sure it isn't an attempt to spoof another identity. |
| location |Varies |Supported geo-locations of the provided resource. You can select any of the available locations, but typically it makes sense to pick one that is close to your users. Usually, it also makes sense to place resources that interact with each other in the same region. Most resource types require a location, but some types (such as a role assignment) don't require a location. |
| tags |No |Tags that are associated with the resource. Apply tags to logically organize resources across your subscription. |
| comments |No |Your notes for documenting the resources in your template |
| copy |No |If more than one instance is needed, the number of resources to create. The default mode is parallel. Specify serial mode when you don't want all or the resources to deploy at the same time. For more information, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md). |
| dependsOn |No |Resources that must be deployed before this resource is deployed. Resource Manager evaluates the dependencies between resources and deploys them in the correct order. When resources aren't dependent on each other, they're deployed in parallel. The value can be a comma-separated list of a resource names or resource unique identifiers. Only list resources that are deployed in this template. Resources that aren't defined in this template must already exist. Avoid adding unnecessary dependencies as they can slow your deployment and create circular dependencies. For guidance on setting dependencies, see [Defining dependencies in Azure Resource Manager templates](resource-group-define-dependencies.md). |
| properties |No |Resource-specific configuration settings. The values for the properties are the same as the values you provide in the request body for the REST API operation (PUT method) to create the resource. You can also specify a copy array to create several instances of a property. |
| sku | No | Some resources allow values that define the SKU to deploy. For example, you can specify the type of redundancy for a storage account. |
| kind | No | Some resources allow a value that defines the type of resource you deploy. For example, you can specify the type of Cosmos DB to create. |
| plan | No | Some resources allow values that define the plan to deploy. For example, you can specify the marketplace image for a virtual machine. | 
| resources |No |Child resources that depend on the resource being defined. Only provide resource types that are permitted by the schema of the parent resource. The fully qualified type of the child resource includes the parent resource type, such as **Microsoft.Web/sites/extensions**. Dependency on the parent resource isn't implied. You must explicitly define that dependency. |

## Condition

When you must decide during deployment whether or not to create a resource, use the `condition` element. The value for this element resolves to true or false. When the value is true, the resource will be created. When the value is false, the resource will not be created. Typically, you use this value when you want to create a new resource or use an existing one. For example, to specify whether a new storage account is deployed or an existing storage account is used, use:

```json
{
    "condition": "[equals(parameters('newOrExisting'),'new')]",
    "type": "Microsoft.Storage/storageAccounts",
    "name": "[variables('storageAccountName')]",
    "apiVersion": "2017-06-01",
    "location": "[resourceGroup().location]",
    "sku": {
        "name": "[variables('storageAccountType')]"
    },
    "kind": "Storage",
    "properties": {}
}
```

For a complete example template that uses the `condition` element, see [VM with a new or existing Virtual Network, Storage, and Public IP](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-new-or-existing-conditions).

## Resource-specific values

The **apiVersion**, **type**, and **properties** elements are different for each resource type. The **sku**, **kind**, and **plan** elements are available for some resource types, but not all. To determine values for these properties, see [template reference](/azure/templates/).

## Resource names

Generally, you work with three types of resource names in Resource Manager:

* Resource names that must be unique.
* Resource names that aren't required to be unique, but you choose to provide a name that can help you identify the resource.
* Resource names that can be generic.

### Unique resource names

Provide a unique resource name for any resource type that has a data access endpoint. Some common resource types that require a unique name include:

* Azure Storage<sup>1</sup> 
* Web Apps feature of Azure App Service
* SQL Server
* Azure Key Vault
* Azure Redis Cache
* Azure Batch
* Azure Traffic Manager
* Azure Search
* Azure HDInsight

<sup>1</sup> Storage account names also must be lowercase, 24 characters or less, and not have any hyphens.

When setting the name, you can either manually create a unique name or use the [uniqueString()](resource-group-template-functions-string.md#uniquestring) function to generate a name. You also might want to add a prefix or suffix to the **uniqueString** result. Modifying the unique name can help you more easily identify the resource type from the name. For example, you can generate a unique name for a storage account by using the following variable:

```json
"variables": {
    "storageAccountName": "[concat(uniqueString(resourceGroup().id),'storage')]"
}
```

### Resource names for identification
Some resource types you might want to name, but their names do not have to be unique. For these resource types, you can provide a name that identifies both the resource context and the resource type.

```json
"parameters": {
    "vmName": { 
        "type": "string",
        "defaultValue": "demoLinuxVM",
        "metadata": {
            "description": "The name of the VM to create."
        }
    }
}
```

### Generic resource names
For resource types that you mostly access through a different resource, you can use a generic name that is hard-coded in the template. For example, you can set a standard, generic name for firewall rules on a SQL server:

```json
{
    "type": "firewallrules",
    "name": "AllowAllWindowsAzureIps",
    ...
}
```

## Location
When deploying a template, you must provide a location for each resource. Different resource types are supported in different locations. To see a list of locations that are available to your subscription for a particular resource type, use Azure PowerShell or Azure CLI. 

The following example uses PowerShell to get the locations for the `Microsoft.Web\sites` resource type:

```powershell
((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).Locations
```

The following example uses Azure CLI to get the locations for the `Microsoft.Web\sites` resource type:

```azurecli
az provider show -n Microsoft.Web --query "resourceTypes[?resourceType=='sites'].locations"
```

After determining the supported locations for your resources, set that location in your template. The easiest way to set this value is to create a resource group in a location that supports the resource types, and set each location to `[resourceGroup().location]`. You can redeploy the template to resource groups in different locations, and not change any values in the template or parameters. 

The following example shows a storage account that is deployed to the same location as the resource group:

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"variables": {
      "storageName": "[concat('storage', uniqueString(resourceGroup().id))]"
    },
	"resources": [
    {
      "apiVersion": "2016-01-01",
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[variables('storageName')]",
      "location": "[resourceGroup().location]",
      "tags": {
        "Dept": "Finance",
        "Environment": "Production"
      },
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": { }
    }
	]
}
```

If you need to hardcode the location in your template, provide the name of one of the supported regions. The following example shows a storage account that is always deployed to North Central US:

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"resources": [
    {
      "apiVersion": "2016-01-01",
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[concat('storageloc', uniqueString(resourceGroup().id))]",
      "location": "North Central US",
      "tags": {
        "Dept": "Finance",
        "Environment": "Production"
      },
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": { }
    }
	]
}
```

## Tags
[!INCLUDE [resource-manager-governance-tags](../../includes/resource-manager-governance-tags.md)]

### Add tags to your template

[!INCLUDE [resource-manager-tags-in-templates](../../includes/resource-manager-tags-in-templates.md)]

## Child resources

Within some resource types, you can also define an array of child resources. Child resources are resources that only exist within the context of another resource. For example, a SQL database can't exist without a SQL server so the database is a child of the server. You can define the database within the definition for the server.

```json
{
  "name": "exampleserver",
  "type": "Microsoft.Sql/servers",
  "apiVersion": "2014-04-01",
  ...
  "resources": [
    {
      "name": "exampledatabase",
      "type": "databases",
      "apiVersion": "2014-04-01",
      ...
    }
  ]
}
```

When nested, the type is set to `databases` but its full resource type is `Microsoft.Sql/servers/databases`. You don't provide `Microsoft.Sql/servers/` because it's assumed from the parent resource type. The child resource name is set to `exampledatabase` but the full name includes the parent name. You don't provide `exampleserver` because it's assumed from the parent resource.

The format of the child resource type is: `{resource-provider-namespace}/{parent-resource-type}/{child-resource-type}`

The format of the child resource name is: `{parent-resource-name}/{child-resource-name}`

But, you don't have to define the database within the server. You can define the child resource at the top level. You might use this approach if the parent resource isn't deployed in the same template, or if want to use `copy` to create multiple child resources. With this approach, you must provide the full resource type, and include the parent resource name in the child resource name.

```json
{
  "name": "exampleserver",
  "type": "Microsoft.Sql/servers",
  "apiVersion": "2014-04-01",
  "resources": [ 
  ],
  ...
},
{
  "name": "exampleserver/exampledatabase",
  "type": "Microsoft.Sql/servers/databases",
  "apiVersion": "2014-04-01",
  ...
}
```

When constructing a fully qualified reference to a resource, the order to combine segments from the type and name isn't simply a concatenation of the two. Instead, after the namespace, use a sequence of *type/name* pairs from least specific to most specific:

```json
{resource-provider-namespace}/{parent-resource-type}/{parent-resource-name}[/{child-resource-type}/{child-resource-name}]*
```

For example:

`Microsoft.Compute/virtualMachines/myVM/extensions/myExt` is correct
`Microsoft.Compute/virtualMachines/extensions/myVM/myExt` is not correct

## Recommendations
The following information can be helpful when you work with resources:

* To help other contributors understand the purpose of the resource, specify **comments** for each resource in the template:
   
   ```json
   "resources": [
     {
         "name": "[variables('storageAccountName')]",
         "type": "Microsoft.Storage/storageAccounts",
         "apiVersion": "2016-01-01",
         "location": "[resourceGroup().location]",
         "comments": "This storage account is used to store the VM disks.",
         ...
     }
   ]
   ```

* If you use a *public endpoint* in your template (such as an Azure Blob storage public endpoint), *do not hard-code* the namespace. Use the **reference** function to dynamically retrieve the namespace. You can use this approach to deploy the template to different public namespace environments without manually changing the endpoint in the template. Set the API version to the same version that you're using for the storage account in your template:
   
   ```json
   "osDisk": {
       "name": "osdisk",
       "vhd": {
           "uri": "[concat(reference(concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName')), '2016-01-01').primaryEndpoints.blob, variables('vmStorageAccountContainerName'), '/',variables('OSDiskName'),'.vhd')]"
       }
   }
   ```
   
   If the storage account is deployed in the same template that you're creating, you don't need to specify the provider namespace when you reference the resource. The following example shows the simplified syntax:
   
   ```json
   "osDisk": {
       "name": "osdisk",
       "vhd": {
           "uri": "[concat(reference(variables('storageAccountName'), '2016-01-01').primaryEndpoints.blob, variables('vmStorageAccountContainerName'), '/',variables('OSDiskName'),'.vhd')]"
       }
   }
   ```
   
   If you have other values in your template that are configured to use a public namespace, change these values to reflect the same **reference** function. For example, you can set the **storageUri** property of the virtual machine diagnostics profile:
   
   ```json
   "diagnosticsProfile": {
       "bootDiagnostics": {
           "enabled": "true",
           "storageUri": "[reference(concat('Microsoft.Storage/storageAccounts/', variables('storageAccountName')), '2016-01-01').primaryEndpoints.blob]"
       }
   }
   ```
   
   You also can reference an existing storage account that is in a different resource group:

   ```json
   "osDisk": {
       "name": "osdisk", 
       "vhd": {
           "uri":"[concat(reference(resourceId(parameters('existingResourceGroup'), 'Microsoft.Storage/storageAccounts/', parameters('existingStorageAccountName')), '2016-01-01').primaryEndpoints.blob,  variables('vmStorageAccountContainerName'), '/', variables('OSDiskName'),'.vhd')]"
       }
   }
   ```

* Assign public IP addresses to a virtual machine only when an application requires it. To connect to a virtual machine (VM) for debugging, or for management or administrative purposes, use inbound NAT rules, a virtual network gateway, or a jumpbox.
   
     For more information about connecting to virtual machines, see:
   
   * [Run VMs for an N-tier architecture in Azure](../guidance/guidance-compute-n-tier-vm.md)
   * [Set up WinRM access for VMs in Azure Resource Manager](../virtual-machines/windows/winrm.md)
   * [Allow external access to your VM by using the Azure portal](../virtual-machines/windows/nsg-quickstart-portal.md)
   * [Allow external access to your VM by using PowerShell](../virtual-machines/windows/nsg-quickstart-powershell.md)
   * [Allow external access to your Linux VM by using Azure CLI](../virtual-machines/virtual-machines-linux-nsg-quickstart.md)
* The **domainNameLabel** property for public IP addresses must be unique. The **domainNameLabel** value must be between 3 and 63 characters long, and follow the rules specified by this regular expression: `^[a-z][a-z0-9-]{1,61}[a-z0-9]$`. Because the **uniqueString** function generates a string that is 13 characters long, the **dnsPrefixString** parameter is limited to 50 characters:

   ```json
   "parameters": {
       "dnsPrefixString": {
           "type": "string",
           "maxLength": 50,
           "metadata": {
               "description": "The DNS label for the public IP address. It must be lowercase. It should match the following regular expression, or it will raise an error: ^[a-z][a-z0-9-]{1,61}[a-z0-9]$"
           }
       }
   },
   "variables": {
       "dnsPrefix": "[concat(parameters('dnsPrefixString'),uniquestring(resourceGroup().id))]"
   }
   ```

* When you add a password to a custom script extension, use the **commandToExecute** property in the **protectedSettings** property:
   
   ```json
   "properties": {
       "publisher": "Microsoft.Azure.Extensions",
       "type": "CustomScript",
       "typeHandlerVersion": "2.0",
       "autoUpgradeMinorVersion": true,
       "settings": {
           "fileUris": [
               "[concat(variables('template').assets, '/lamp-app/install_lamp.sh')]"
           ]
       },
       "protectedSettings": {
           "commandToExecute": "[concat('sh install_lamp.sh ', parameters('mySqlPassword'))]"
       }
   }
   ```
   
   > [!NOTE]
   > To ensure that secrets are encrypted when they are passed as parameters to VMs and extensions, use the **protectedSettings** property of the relevant extensions.
   > 
   > 


## Next steps
* To view complete templates for many different types of solutions, see the [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/).
* For details about the functions you can use from within a template, see [Azure Resource Manager Template Functions](resource-group-template-functions.md).
* To use more than one template during deployment, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).
* You may need to use resources that exist within a different resource group. This scenario is common when working with storage accounts or virtual networks that are shared across several resource groups. For more information, see the [resourceId function](resource-group-template-functions-resource.md#resourceid).
* For information about resource name restrictions, see [Recommended naming conventions for Azure resources](../guidance/guidance-naming-conventions.md).