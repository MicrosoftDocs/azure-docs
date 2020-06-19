---
title: Reuse templates across clouds
description: Develop Azure Resource Manager templates that work consistently for different cloud environments. Create new or update existing templates for Azure Stack.
author: marcvaneijk
ms.topic: conceptual
ms.date: 12/09/2018
ms.author: mavane
ms.custom: seodec18
---

# Develop ARM templates for cloud consistency

[!INCLUDE [requires-azurerm](../../../includes/requires-azurerm.md)]

A key benefit of Azure is consistency. Development investments for one location are reusable in another. An Azure Resource Manager (ARM) template makes your deployments consistent and repeatable across environments, including the global Azure, Azure sovereign clouds, and Azure Stack. To reuse templates across clouds, however, you need to consider cloud-specific dependencies as this guide explains.

Microsoft offers intelligent, enterprise-ready cloud services in many locations, including:

* The global Azure platform supported by a growing network of Microsoft-managed datacenters in regions around the world.
* Isolated sovereign clouds like Azure Germany, Azure Government, and Azure China 21Vianet. Sovereign clouds provide a consistent platform with most of the same great features that global Azure customers have access to.
* Azure Stack, a hybrid cloud platform that lets you deliver Azure services from your organization's datacenter. Enterprises can set up Azure Stack in their own datacenters, or consume Azure Services from service providers, running Azure Stack in their facilities (sometimes known as hosted regions).

At the core of all these clouds, Azure Resource Manager provides an API that allows a wide variety of user interfaces to communicate with the Azure platform. This API gives you powerful infrastructure-as-code capabilities. Any type of resource that is available on the Azure cloud platform can be deployed and configured with Azure Resource Manager. With a single template, you can deploy and configure your complete application to an operational end state.

![Azure environments](./media/templates-cloud-consistency/environments.png)

The consistency of global Azure, the sovereign clouds, hosted clouds, and a cloud in your datacenter helps you benefit from Azure Resource Manager. You can reuse your development investments across these clouds when you set up template-based resource deployment and configuration.

However, even though the global, sovereign, hosted, and hybrid clouds provide consistent services, not all clouds are identical. As a result, you can create a template with dependencies on features available only in a specific cloud.

The rest of this guide describes the areas to consider when planning to develop new or updating existing ARM templates for Azure Stack. In general, your checklist should include the following items:

* Verify that the functions, endpoints, services, and other resources in your template are available in the target deployment locations.
* Store nested templates and configuration artifacts in accessible locations, ensuring access across clouds.
* Use dynamic references instead of hard-coding links and elements.
* Ensure the template parameters you use work in the target clouds.
* Verify that resource-specific properties are available the target clouds.

For an introduction to ARM templates, see [Template deployment](overview.md).

## Ensure template functions work

The basic syntax of an ARM template is JSON. Templates use a superset of JSON, extending the syntax with expressions and functions. The template language processor is frequently updated to support additional template functions. For a detailed explanation of the available template functions, see [ARM template functions](template-functions.md).

New template functions that are introduced to Azure Resource Manager aren't immediately available in the sovereign clouds or Azure Stack. To deploy a template successfully, all functions referenced in the template must be available in the target cloud.

Azure Resource Manager capabilities will always be introduced to global Azure first. You can use the following PowerShell script to verify whether newly introduced template functions are also available in Azure Stack:

1. Make a clone of the GitHub repository: [https://github.com/marcvaneijk/arm-template-functions](https://github.com/marcvaneijk/arm-template-functions).

1. Once you have a local clone of the repository, connect to the destination's Azure Resource Manager with PowerShell.

1. Import the psm1 module and execute the Test-AzureRmTemplateFunctions cmdlet:

   ```powershell
   # Import the module
   Import-module <path to local clone>\AzTemplateFunctions.psm1

   # Execute the Test-AzureRmTemplateFunctions cmdlet
   Test-AzureRmTemplateFunctions -path <path to local clone>
   ```

The script deploys multiple, minimized templates, each containing only unique template functions. The output of the script reports the supported and unavailable template functions.

## Working with linked artifacts

A template can contain references to linked artifacts and contain a deployment resource that links to another template. The linked templates (also referred to as nested template) are retrieved by Resource Manager at runtime. A template can also contain references to artifacts for virtual machine (VM) extensions. These artifacts are retrieved by the VM extension running inside of the VM for configuration of the VM extension during the template deployment.

The following sections describe considerations for cloud consistency when developing templates that include artifacts that are external to the main deployment template.

### Use nested templates across regions

Templates can be decomposed into small, reusable templates, each of which has a specific purpose and can be reused across deployment scenarios. To execute a deployment, you specify a single template known as the main or master template. It specifies the resources to deploy, such as virtual networks, VMs, and web apps. The main template can also contain a link to another template, meaning you can nest templates. Likewise, a nested template can contain links to other templates. You can nest up to five levels deep.

The following code shows how the templateLink parameter refers to a nested template:

```json
"resources": [
  {
     "type": "Microsoft.Resources/deployments",
     "apiVersion": "2017-05-10",
     "name": "linkedTemplate",
     "properties": {
       "mode": "incremental",
       "templateLink": {
          "uri":"https://mystorageaccount.blob.core.windows.net/AzureTemplates/vNet.json",
          "contentVersion":"1.0.0.0"
       }
     }
  }
]
```

Azure Resource Manager evaluates the main template at runtime and retrieves and evaluates each nested template. After all nested templates are retrieved, the template is flattened, and further processing is initiated.

### Make linked templates accessible across clouds

Consider where and how to store any linked templates you use. At runtime, Azure Resource Manager fetches—and therefore requires direct access to—any linked templates. A common practice is to use GitHub to store the nested templates. A GitHub repository can contain files that are accessible publicly through a URL. Although this technique works well for the public cloud and the sovereign clouds, an Azure Stack environment might be located on a corporate network or on a disconnected remote location, without any outbound Internet access. In those cases, Azure Resource Manager would fail to retrieve the nested templates.

A better practice for cross-cloud deployments is to store your linked templates in a location that is accessible for the target cloud. Ideally all deployment artifacts are maintained in and deployed from a continuous integration/continuous development (CI/CD) pipeline. Alternatively, you can store nested templates in a blob storage container, from which Azure Resource Manager can retrieve them.

Since the blob storage on each cloud uses a different endpoint fully qualified domain name (FQDN), configure the template with the location of the linked templates with two parameters. Parameters can accept user input at deployment time. Templates are typically authored and shared by multiple people, so a best practice is to use a standard name for these parameters. Naming conventions help make templates more reusable across regions, clouds, and authors.

In the following code, `_artifactsLocation` is used to point to a single location, containing all deployment-related artifacts. Notice that a default value is provided. At deployment time, if no input value is specified for `_artifactsLocation`, the default value is used. The `_artifactsLocationSasToken` is used as input for the `sasToken`. The default value should be an empty string for scenarios where the `_artifactsLocation` isn't secured — for example, a public GitHub repository.

```json
"parameters": {
  "_artifactsLocation": {
    "type": "string",
    "metadata": {
      "description": "The base URI where artifacts required by this template are located."
    },
    "defaultValue": "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vm-custom-script-windows/"
  },
  "_artifactsLocationSasToken": {
    "type": "securestring",
    "metadata": {
      "description": "The sasToken required to access _artifactsLocation."
    },
    "defaultValue": ""
  }
}
```

Throughout the template, links are generated by combining the base URI (from the `_artifactsLocation` parameter) with an artifact-relative path and the `_artifactsLocationSasToken`. The following code shows how to specify the link to the nested template using the uri template function:

```json
"resources": [
  {
    "type": "Microsoft.Resources/deployments",
    "apiVersion": "2019-10-01",
    "name": "shared",
    "properties": {
      "mode": "Incremental",
      "templateLink": {
        "uri": "[uri(parameters('_artifactsLocation'), concat('nested/vnet.json', parameters('_artifactsLocationSasToken')))]",
        "contentVersion": "1.0.0.0"
      }
    }
  }
]
```

By using this approach, the default value for the `_artifactsLocation` parameter is used. If the linked templates need to be retrieved from a different location, the parameter input can be used at deployment time to override the default value—no change to the template itself is needed.

### Use _artifactsLocation instead of hardcoding links

Besides being used for nested templates, the URL in the `_artifactsLocation` parameter is used as a base for all related artifacts of a deployment template. Some VM extensions include a link to a script stored outside the template. For these extensions, you should not hardcode the links. For example, the Custom Script and PowerShell DSC extensions may link to an external script on GitHub as shown:

```json
"properties": {
  "publisher": "Microsoft.Compute",
  "type": "CustomScriptExtension",
  "typeHandlerVersion": "1.9",
  "autoUpgradeMinorVersion": true,
  "settings": {
    "fileUris": [
      "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1"
    ]
  }
}
```

Hardcoding the links to the script potentially prevents the template from deploying successfully to another location. During configuration of the VM resource, the VM agent running inside the VM initiates a download of all the scripts linked in the VM extension, and then stores the scripts on the VM's local disk. This approach functions like the nested template links explained earlier in the "Use nested templates across regions" section.

Resource Manager retrieves nested templates at runtime. For VM extensions, the retrieval of any external artifacts is performed by the VM agent. Besides the different initiator of the artifact retrieval, the solution in the template definition is the same. Use the _artifactsLocation parameter with a default value of the base path where all the artifacts are stored (including the VM extension scripts) and the `_artifactsLocationSasToken` parameter for the input for the sasToken.

```json
"parameters": {
  "_artifactsLocation": {
    "type": "string",
    "metadata": {
      "description": "The base URI where artifacts required by this template are located."
    },
    "defaultValue": "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/"
  },
  "_artifactsLocationSasToken": {
    "type": "securestring",
    "metadata": {
      "description": "The sasToken required to access _artifactsLocation."
    },
    "defaultValue": ""
  }
}
```

To construct the absolute URI of an artifact, the preferred method is to use the uri template function, instead of the concat template function. By replacing hardcoded links to the scripts in the VM extension with the uri template function, this functionality in the template is configured for cloud consistency.

```json
"properties": {
  "publisher": "Microsoft.Compute",
  "type": "CustomScriptExtension",
  "typeHandlerVersion": "1.9",
  "autoUpgradeMinorVersion": true,
  "settings": {
    "fileUris": [
      "[uri(parameters('_artifactsLocation'), concat('scripts/configure-music-app.ps1', parameters('_artifactsLocationSasToken')))]"
    ]
  }
}
```

With this approach, all deployment artifacts, including configuration scripts, can be stored in the same location with the template itself. To change the location of all the links, you only need to specify a different base URL for the _artifactsLocation parameters_.

## Factor in differing regional capabilities

With the agile development and continuous flow of updates and new services introduced to Azure, [regions can differ](https://azure.microsoft.com/regions/services/) in availability of services or updates. After rigorous internal testing, new services or updates to existing services are usually introduced to a small audience of customers participating in a validation program. After successful customer validation, the services or updates are made available within a subset of Azure regions, then introduced to more regions, rolled out to the sovereign clouds, and potentially made available for Azure Stack customers as well.

Knowing that Azure regions and clouds may differ in their available services, you can make some proactive decisions about your templates. A good place to start is by examining the available resource providers for a cloud. A resource provider tells you the set of resources and operations that are available for an Azure service.

A template deploys and configures resources. A resource type is provided by a resource provider. For example, the compute resource provider (Microsoft.Compute), provides multiple resource types such as virtualMachines and availabilitySets. Each resource provider provides an API to Azure Resource Manager defined by a common contract, enabling a consistent, unified authoring experience across all resource providers. However, a resource provider that is available in global Azure may not be available in a sovereign cloud or an Azure Stack region.

![Resource providers](./media/templates-cloud-consistency/resource-providers.png)

To verify the resource providers that are available in a given cloud, run the following script in the Azure command line interface ([CLI](/cli/azure/install-azure-cli)):

```azurecli-interactive
az provider list --query "[].{Provider:namespace, Status:registrationState}" --out table
```

You can also use the following PowerShell cmdlet to see available resource providers:

```azurepowershell-interactive
Get-AzureRmResourceProvider -ListAvailable | Select-Object ProviderNamespace, RegistrationState
```

### Verify the version of all resource types

A set of properties is common for all resource types, but each resource also has its own specific properties. New features and related properties are added to existing resource types at times through a new API version. A resource in a template has its own API version property - `apiVersion`. This versioning ensures that an existing resource configuration in a template is not affected by changes on the platform.

New API versions introduced to existing resource types in global Azure might not immediately be available in all regions, sovereign clouds, or Azure Stack. To view a list of the available resource providers, resource types, and API versions for a cloud, you can use Resource Explorer in Azure portal. Search for Resource Explorer in the All Services menu. Expand the Providers node in Resource Explorer to return all the available resource providers, their resource types, and API versions in that cloud.

To list the available API version for all resource types in a given cloud in Azure CLI, run the following script:

```azurecli-interactive
az provider list --query "[].{namespace:namespace, resourceType:resourceType[]}"
```

You can also use the following PowerShell cmdlet:

```azurepowershell-interactive
Get-AzureRmResourceProvider | select-object ProviderNamespace -ExpandProperty ResourceTypes | ft ProviderNamespace, ResourceTypeName, ApiVersions
```

### Refer to resource locations with a parameter

A template is always deployed into a resource group that resides in a region. Besides the deployment itself, each resource in a template also has a location property that you use to specify the region to deploy in. To develop your template for cloud consistency, you need a dynamic way to refer to resource locations, because each Azure Stack can contain unique location names. Usually resources are deployed in the same region as the resource group, but to support scenarios such as cross-region application availability, it can be useful to spread resources across regions.

Even though you could hardcode the region names when specifying the resource properties in a template, this approach doesn't guarantee that the template can be deployed to other Azure Stack environments, because the region name most likely doesn't exist there.

To accommodate different regions, add an input parameter location to the template with a default value. The default value will be used if no value is specified during deployment.

The template function `[resourceGroup()]` returns an object that contains the following key/value pairs:

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
  "name": "{resourceGroupName}",
  "location": "{resourceGroupLocation}",
  "tags": {
  },
  "properties": {
    "provisioningState": "{status}"
  }
}
```

By referencing the location key of the object in the defaultValue of the input parameter, Azure Resource Manager will, at runtime, replace the `[resourceGroup().location]` template function with the name of the location of the resource group the template is deployed to.

```json
"parameters": {
  "location": {
    "type": "string",
    "metadata": {
      "description": "Location the resources will be deployed to."
    },
    "defaultValue": "[resourceGroup().location]"
  }
},
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2015-06-15",
    "name": "storageaccount1",
    "location": "[parameters('location')]",
    ...
```

With this template function, you can deploy your template to any cloud without even knowing the region names in advance. In addition, a location for a specific resource in the template can differ from the resource group location. In this case, you can configure it by using additional input parameters for that specific resource, while the other resources in the same template still use the initial location input parameter.

### Track versions using API profiles

It can be very challenging to keep track of all the available resource providers and related API versions that are present in Azure Stack. For example, at the time of writing, the latest API version for **Microsoft.Compute/availabilitySets** in Azure is `2018-04-01`, while the available API version common to Azure and Azure Stack is `2016-03-30`. The common API version for **Microsoft.Storage/storageAccounts** shared among all Azure and Azure Stack locations is `2016-01-01`, while the latest API version in Azure is `2018-02-01`.

For this reason, Resource Manager introduced the concept of API profiles to templates. Without API profiles, each resource in a template is configured with an `apiVersion` element that describes the API version for that specific resource.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "metadata": {
          "description": "Location the resources will be deployed to."
      },
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2016-01-01",
      "name": "mystorageaccount",
      "location": "[parameters('location')]",
      "properties": {
        "accountType": "Standard_LRS"
      }
    },
    {
      "type": "Microsoft.Compute/availabilitySets",
      "apiVersion": "2016-03-30",
      "name": "myavailabilityset",
      "location": "[parameters('location')]",
      "properties": {
        "platformFaultDomainCount": 2,
        "platformUpdateDomainCount": 2
      }
    }
  ],
  "outputs": {}
}
```

An API profile version acts as an alias for a single API version per resource type common to Azure and Azure Stack. Instead of specifying an API version for each resource in a template, you specify only the API profile version in a new root element called `apiProfile` and omit the `apiVersion` element for the individual resources.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "apiProfile": "2018–03-01-hybrid",
    "parameters": {
        "location": {
            "type": "string",
            "metadata": {
                "description": "Location the resources will be deployed to."
            },
            "defaultValue": "[resourceGroup().location]"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Storage/storageAccounts",
            "name": "mystorageaccount",
            "location": "[parameters('location')]",
            "properties": {
                "accountType": "Standard_LRS"
            }
        },
        {
            "type": "Microsoft.Compute/availabilitySets",
            "name": "myavailabilityset",
            "location": "[parameters('location')]",
            "properties": {
                "platformFaultDomainCount": 2,
                "platformUpdateDomainCount": 2
            }
        }
    ],
    "outputs": {}
}
```

The API profile ensures that the API versions are available across locations, so you do not have to manually verify the apiVersions that are available in a specific location. To ensure the API versions referenced by your API profile are present in an Azure Stack environment, the Azure Stack operators must keep the solution up-to-date based on the policy for support. If a system is more than six months out of date, it is considered out of compliance, and the environment must be updated.

The API profile isn't a required element in a template. Even if you add the element, it will only be used for resources for which no `apiVersion` is specified. This element allows for gradual changes but doesn't require any changes to existing templates.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "apiProfile": "2018–03-01-hybrid",
    "parameters": {
        "location": {
            "type": "string",
            "metadata": {
                "description": "Location the resources will be deployed to."
            },
            "defaultValue": "[resourceGroup().location]"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2016-01-01",
            "name": "mystorageaccount",
            "location": "[parameters('location')]",
            "properties": {
                "accountType": "Standard_LRS"
            }
        },
        {
            "type": "Microsoft.Compute/availabilitySets",
            "name": "myavailabilityset",
            "location": "[parameters('location')]",
            "properties": {
                "platformFaultDomainCount": 2,
                "platformUpdateDomainCount": 2
            }
        }
    ],
    "outputs": {}
}
```

## Check endpoint references

Resources can have references to other services on the platform. For example, a public IP can have a public DNS name assigned to it. The public cloud, the sovereign clouds, and Azure Stack solutions have their own distinct endpoint namespaces. In most cases, a resource requires only a prefix as input in the template. During runtime, Azure Resource Manager appends the endpoint value to it. Some endpoint values need to be explicitly specified in the template.

> [!NOTE]
> To develop templates for cloud consistency, don't hardcode endpoint namespaces.

The following two examples are common endpoint namespaces that need to be explicitly specified when creating a resource:

* Storage accounts (blob, queue, table and file)
* Connection strings for databases and Azure Cache for Redis

Endpoint namespaces can also be used in the output of a template as information for the user when the deployment completes. The following are common examples:

* Storage accounts (blob, queue, table and file)
* Connection strings (MySql, SQLServer, SQLAzure, Custom, NotificationHub, ServiceBus, EventHub, ApiHub, DocDb, RedisCache, PostgreSQL)
* Traffic Manager
* domainNameLabel of a public IP address
* Cloud services

In general, avoid hardcoded endpoints in a template. The best practice is to use the reference template function to retrieve the endpoints dynamically. For example, the endpoint most commonly hardcoded is the endpoint namespace for storage accounts. Each storage account has a unique FQDN that is constructed by concatenating the name of the storage account with the endpoint namespace. A blob storage account named mystorageaccount1 results in different FQDNs depending on the cloud:

* **mystorageaccount1.blob.core.windows.net** when created on the global Azure cloud.
* **mystorageaccount1.blob.core.chinacloudapi.cn** when created in the Azure China 21Vianet cloud.

The following reference template function retrieves the endpoint namespace from the storage resource provider:

```json
"diskUri":"[concat(reference(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))).primaryEndpoints.blob, 'container/myosdisk.vhd')]"
```

By replacing the hardcoded value of the storage account endpoint with the `reference` template function, you can use the same template to deploy to different environments successfully without making any changes to the endpoint reference.

### Refer to existing resources by unique ID

You can also refer to an existing resource from the same or another resource group, and within the same subscription or another subscription, within the same tenant in the same cloud. To retrieve the resource properties, you must use the unique identifier for the resource itself. The `resourceId` template function retrieves the unique ID of a resource such as SQL Server as the following code shows:

```json
"outputs": {
  "resourceId":{
    "type": "string",
    "value": "[resourceId('otherResourceGroup', 'Microsoft.Sql/servers', parameters('serverName'))]"
  }
}
```

You can then use the `resourceId` function inside the `reference` template function to retrieve the properties of a database. The return object contains the `fullyQualifiedDomainName` property that holds the full endpoint value. This value is retrieved at runtime and provides the cloud environment-specific endpoint namespace. To define the connection string without hardcoding the endpoint namespace, you can refer to the property of the return object directly in the connection string as shown:

```json
"[concat('Server=tcp:', reference(resourceId('sql', 'Microsoft.Sql/servers', parameters('test')), '2015-05-01-preview').fullyQualifiedDomainName, ',1433;Initial Catalog=', parameters('database'),';User ID=', parameters('username'), ';Password=', parameters('pass'), ';Encrypt=True;')]"
```

## Consider resource properties

Specific resources within Azure Stack environments have unique properties you must consider in your template.

### Ensure VM images are available

Azure provides a rich selection of VM images. These images are created and prepared for deployment by Microsoft and partners. The images form the foundation for VMs on the platform. However, a cloud-consistent template should refer to available parameters only — in particular, the publisher, offer, and SKU of the VM images available to the global Azure, Azure sovereign clouds, or an Azure Stack solution.

To retrieve a list of the available VM images in a location, run the following Azure CLI command:

```azurecli-interactive
az vm image list -all
```

You can retrieve the same list with the Azure PowerShell cmdlet [Get-AzureRmVMImagePublisher](/powershell/module/az.compute/get-azvmimagepublisher) and specify the location you want with the `-Location` parameter. For example:

```azurepowershell-interactive
Get-AzureRmVMImagePublisher -Location "West Europe" | Get-AzureRmVMImageOffer | Get-AzureRmVMImageSku | Get-AzureRmVMImage
```

This command takes a couple of minutes to return all the available images in the West Europe region of the global Azure cloud.

If you made these VM images available to Azure Stack, all the available storage would be consumed. To accommodate even the smallest scale unit, Azure Stack allows you to select the images you want to add to an environment.

The following code sample shows a consistent approach to refer to the publisher, offer, and SKU parameters in your ARM templates:

```json
"storageProfile": {
    "imageReference": {
    "publisher": "MicrosoftWindowsServer",
    "offer": "WindowsServer",
    "sku": "2016-Datacenter",
    "version": "latest"
    }
}
```

### Check local VM sizes

To develop your template for cloud consistency, you need to make sure the VM size you want is available in all target environments. VM sizes are a grouping of performance characteristics and capabilities. Some VM sizes depend on the hardware that the VM runs on. For example, if you want to deploy a GPU-optimized VM, the hardware that runs the hypervisor needs to have the hardware GPUs.

When Microsoft introduces a new size of VM that has certain hardware dependencies, the VM size is usually made available first in a small subset of regions in the Azure cloud. Later, it is made available to other regions and clouds. To make sure the VM size exists in each cloud you deploy to, you can retrieve the available sizes with the following Azure CLI command:

```azurecli-interactive
az vm list-sizes --location "West Europe"
```

For Azure PowerShell, use:

```azurepowershell-interactive
Get-AzureRmVMSize -Location "West Europe"
```

For a full list of available services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?cdn=disable).

### Check use of Azure Managed Disks in Azure Stack

Managed disks handle the storage for an Azure tenant. Instead of explicitly creating a storage account and specifying the URI for a virtual hard disk (VHD), you can use managed disks to implicitly perform these actions when you deploy a VM. Managed disks enhance availability by placing all the disks from VMs in the same availability set into different storage units. Additionally, existing VHDs can be converted from Standard to Premium storage with significantly less downtime.

Although managed disks are on the roadmap for Azure Stack, they are currently not supported. Until they are, you can develop cloud-consistent templates for Azure Stack by explicitly specifying VHDs using the `vhd` element in the template for the VM resource as shown:

```json
"storageProfile": {
  "imageReference": {
    "publisher": "MicrosoftWindowsServer",
    "offer": "WindowsServer",
    "sku": "[parameters('windowsOSVersion')]",
    "version": "latest"
  },
  "osDisk": {
    "name": "osdisk",
    "vhd": {
      "uri": "[concat(reference(resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName')), '2015-06-15').primaryEndpoints.blob, 'vhds/osdisk.vhd')]"
    },
    "caching": "ReadWrite",
    "createOption": "FromImage"
  }
}
```

In contrast, to specify a managed disk configuration in a template, remove the `vhd` element from the disk configuration.

```json
"storageProfile": {
  "imageReference": {
    "publisher": "MicrosoftWindowsServer",
    "offer": "WindowsServer",
    "sku": "[parameters('windowsOSVersion')]",
    "version": "latest"
  },
  "osDisk": {
    "caching": "ReadWrite",
    "createOption": "FromImage"
  }
}
```

The same changes also apply [data disks](../../virtual-machines/windows/using-managed-disks-template-deployments.md).

### Verify that VM extensions are available in Azure Stack

Another consideration for cloud consistency is the use of [virtual machine extensions](../../virtual-machines/windows/extensions-features.md) to configure the resources inside a VM. Not all VM extensions are available in Azure Stack. A template can specify the resources dedicated to the VM extension, creating dependencies and conditions within the template.

For example, if you want to configure a VM running Microsoft SQL Server, the VM extension can configure SQL Server as part the template deployment. Consider what happens if the deployment template also contains an application server configured to create a database on the VM running SQL Server. Besides also using a VM extension for the application servers, you can configure the dependency of the application server on the successful return of the SQL Server VM extension resource. This approach ensures the VM running SQL Server is configured and available when the application server is instructed to create the database.

The declarative approach of the template allows you to define the end state of the resources and their inter-dependencies, while the platform takes care of the logic required for the dependencies.

#### Check that VM extensions are available

Many types of VM extensions exist. When developing template for cloud consistency, make sure to use only the extensions that are available in all the regions the template targets.

To retrieve a list of the VM extensions that are available for a specific region (in this example, `myLocation`), run the following Azure CLI command:

```azurecli-interactive
az vm extension image list --location myLocation
```

You can also execute the Azure PowerShell [Get-AzureRmVmImagePublisher](/powershell/module/az.compute/get-azvmimagepublisher) cmdlet and use `-Location` to specify the location of the virtual machine image. For example:

```azurepowershell-interactive
Get-AzureRmVmImagePublisher -Location myLocation | Get-AzureRmVMExtensionImageType | Get-AzureRmVMExtensionImage | Select Type, Version
```

#### Ensure that versions are available

Since VM extensions are first-party Resource Manager resources, they have their own API versions. As the following code shows, the VM extension type is a nested resource in the Microsoft.Compute resource provider.

```json
{
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "apiVersion": "2015-06-15",
    "name": "myExtension",
    "location": "[parameters('location')]",
    ...
```

The API version of the VM extension resource must be present in all the locations you plan to target with your template. The location dependency works like the resource provider API version availability discussed earlier in the "Verify the version of all resource types" section.

To retrieve a list of the available API versions for the VM extension resource, use the [Get-AzureRmResourceProvider](/powershell/module/az.resources/get-azresourceprovider) cmdlet with the **Microsoft.Compute** resource provider as shown:

```azurepowershell-interactive
Get-AzureRmResourceProvider -ProviderNamespace "Microsoft.Compute" | Select-Object -ExpandProperty ResourceTypes | Select ResourceTypeName, Locations, ApiVersions | where {$_.ResourceTypeName -eq "virtualMachines/extensions"}
```

You can also use VM extensions in virtual machine scale sets. The same location conditions apply. To develop your template for cloud consistency, make sure the API versions are available in all the locations you plan on deploying to. To retrieve the API versions of the VM extension resource for scale sets, use the same cmdlet as before, but specify the virtual machine scale sets resource type as shown:

```azurepowershell-interactive
Get-AzureRmResourceProvider -ProviderNamespace "Microsoft.Compute" | Select-Object -ExpandProperty ResourceTypes | Select ResourceTypeName, Locations, ApiVersions | where {$_.ResourceTypeName -eq "virtualMachineScaleSets/extensions"}
```

Each specific extension is also versioned. This version is shown in the `typeHandlerVersion` property of the VM extension. Make sure that the version specified in the `typeHandlerVersion` element of your template's VM extensions are available in the locations where you plan to deploy the template. For example, the following code specifies version 1.7:

```json
{
    "type": "extensions",
    "apiVersion": "2016-03-30",
    "name": "MyCustomScriptExtension",
    "location": "[parameters('location')]",
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/myVM', copyindex())]"
    ],
    "properties": {
        "publisher": "Microsoft.Compute",
        "type": "CustomScriptExtension",
        "typeHandlerVersion": "1.7",
        ...
```

To retrieve a list of the available versions for a specific VM extension, use the [Get-AzureRmVMExtensionImage](/powershell/module/az.compute/get-azvmextensionimage) cmdlet. The following example retrieves the available versions for the PowerShell DSC (Desired State Configuration) VM extension from **myLocation**:

```azurepowershell-interactive
Get-AzureRmVMExtensionImage -Location myLocation -PublisherName Microsoft.PowerShell -Type DSC | FT
```

To get a list of publishers, use the [Get-AzureRmVmImagePublisher](/powershell/module/az.compute/get-azvmimagepublisher) command. To request type, use the [Get-AzureRmVMExtensionImageType](/powershell/module/az.compute/get-azvmextensionimagetype) commend.

## Tips for testing and automation

It's a challenge to keep track of all related settings, capabilities, and limitations while authoring a template. The common approach is to develop and test templates against a single cloud before other locations are targeted. However, the earlier that tests are performed in the authoring process, the less troubleshooting and code rewriting your development team will have to do. Deployments that fail because of location dependencies can be time-consuming to troubleshoot. That's why we recommend automated testing as early as possible in the authoring cycle. Ultimately, you'll need less development time and fewer resources, and your cloud-consistent artifacts will become even more valuable.

The following image shows a typical example of a development process for a team using an integrated development environment (IDE). At different stages in the timeline, different test types are executed. Here, two developers are working on the same solution, but this scenario applies equally to a single developer or a large team. Each developer typically creates a local copy of a central repository, enabling each one to work on the local copy without impacting the others who may be working on the same files.

![Workflow](./media/templates-cloud-consistency/workflow.png)

Consider the following tips for testing and automation:

* Do make use of testing tools. For example, Visual Studio Code and Visual Studio include IntelliSense and other features that can help you validate your templates.
* To improve the code quality during development on the local IDE, perform static code analysis with unit tests and integration tests.
* For an even better experience during initial development, unit tests and integration tests should only warn when an issue is found and proceed with the tests. That way, you can identify the issues to addressed and prioritize the order of the changes, also referred to as test-driven deployment (TDD).
* Be aware that some tests can be performed without being connected to Azure Resource Manager. Others, like testing template deployment, require Resource Manager to perform certain actions that cannot be performed offline.
* Testing a deployment template against the validation API isn't equal to an actual deployment. Also, even if you deploy a template from a local file, any references to nested templates in the template are retrieved by Resource Manager directly, and artifacts referenced by VM extensions are retrieved by the VM agent running inside the deployed VM.

## Next steps

* [Azure Resource Manager template considerations](/azure-stack/user/azure-stack-develop-templates)
* [Best practices for ARM templates](template-syntax.md)
