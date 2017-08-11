---
title: Consume an Azure managed application | Microsoft Docs
description: Describes how a customer creates an Azure managed application from published files.
services: azure-resource-manager
author: ravbhatnagar
manager: rjmax


ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 05/17/2017
ms.author: gauravbh; tomfitz

---
# Consume a Service Catalog managed application

There are two scenarios in the Azure managed application end-to-end experience. One is the publisher or ISV who wants to create a managed application for use by customers. The second is the customer or the consumer who wants to use the managed application. This article covers the second scenario and explains how a customer can consume a managed application provided by an ISV. For more information, see [Managed application overview](managed-application-overview.md).

Currently, you can use either Azure CLI or the Azure portal to consume a managed application. 

## Create the managed application by using Azure CLI 

You must obtain the appliance definition ID for the appliance you want to consume.

There are two ways to create a managed application by using Azure CLI:

* Use the regular template deployment command. 
* Use the new create command provided for this purpose.

### Use the template deployment command

Deploy the applianceMainTemplate.json file that the vendor created.

Then create two resource groups. The first resource group is where the appliance resource is created: Microsoft.Solutions/appliances. The second resource group contains all the resources defined in mainTemplate.json. This resource group is managed by the ISV.

```azurecli
az group create --name mainResourceGroup --location westcentralus    
az group create --name managedResourceGroup --location westcentralus
```

> [!NOTE]
> Use `westcentralus` as the location of the resource group.
>


To deploy applianceMainTemplate.json in mainResourceGroup, use the following command:

```azurecli
az group deployment create --name managedAppDeployment --resourceGroup mainResourceGroup --templateUri  
```

After the preceding template runs, it prompts you for the values of the parameters that are defined in the template. In addition to the parameters that are needed to provision resources in a template, you need two key parameter values:

- **managedResourceGroupId**: The ID of the resource group where the resources defined in applianceMainTemplate.json are created. The ID is of the form `/subscriptions/{subscriptionId}/resourceGroups/{resoureGroupName}`. In the preceding example, it's the ID of `managedResourceGroup`.
- **applianceDefinitionId**: The ID of the managed application definition resource. This value is provided by the ISV. 

> [!NOTE] 
> The ISV must grant access to the resource group where the appliance definition resource is created. The appliance definition resource is created in the ISV subscription. Therefore, a user, user group, or application in the customer tenant needs read access to this resource. 

After the deployment finishes successfully, you see the appliance resource created in mainResourceGroup. The storageAccount resource is created in managedResourceGroup.

### Use the create command

You can use the `az managedapp create` command to create a managed application from the managed application definition. 

```azurecli
az managedapp create --name ravtestappliance401 --location "westcentralus" 
	--kind "Servicecatalog" --resource-group "ravApplianceCustRG401" 
   	--managedapp-definition-id "/subscriptions/{guid}/resourceGroups/ravApplianceDefRG401/providers/Microsoft.Solutions/applianceDefinitions/ravtestAppDef401" 
   	--managed-rg-id "/subscriptions/{guid}/resourceGroups/ravApplianceCustManagedRG401" 
   	--parameters "{\"storageAccountName\": {\"value\": \"ravappliancedemostore1\"}}" 
   	--debug
```

* **appliance-definition-Id**: The resource ID of the appliance definition created in the preceding step. To obtain this ID, run the following command:

  ```azurecli
  az appliance definition show -n ravtestAppDef1 -g ravApplianceRG2
  ```

  This command returns the appliance definition. You need the value of the ID property.

* **managed-rg-id**: The name of the resource group where all the resources defined in applianceMainTemplate.json are created. This resource group is the managed resource group. It's managed by the publisher. If it doesn't exist, it's created for you.
* **resource-group**: The resource group where the appliance resource is created. The Microsoft.Solutions/appliance resource lives in this resource group. 
* **parameters**: The parameters that are needed for the resources defined in applianceMainTemplate.json.

## Create the managed application by using the portal

Support to consume managed applications published by ISVs is also available in the portal. Follow these steps:

1. Go to the Azure portal. On the **Create** blade, select **Service Catalog Managed Application**.  

	![Service Catalog Managed Application](./media/managed-application-consumption/create-service-catalog-managed-application.png)

2. Select the managed application you want to create from the list of offers from various ISVs/partners. Select **Create**.

	![Managed application selection](./media/managed-application-consumption/select-offer.png)

3. In the blade that opens, enter the parameters that are required to provision the resources. 

	![Managed application parameters](./media/managed-application-consumption/input-parameters.png)

4. After you provide the values, select **OK**. The template validates against the inputs you provided. If validation succeeds, the template deployment starts. After the deployment finishes, the appropriate resources defined in the template are provisioned in the managed resource group you provided.

## Known issues

This preview release includes the following issues:

* A 500 internal server error appears during the creation of the appliance. If you run into this issue, it's likely to be intermittent. Retry the operation.
* A new resource group is needed for the managed resource group. If you use an existing resource group, the deployment fails.
* The resource group that contains the Microsoft.Solutions/appliances resource must be created in the **westcentralus** location.

## Next steps

* For an introduction to managed applications, see [Managed application overview](managed-application-overview.md).
* For information about publishing a Service Catalog managed application, see [Create and publish a Service Catalog managed application](managed-application-publishing.md).
* For information about publishing managed applications to the Azure Marketplace, see [Azure managed applications in the Marketplace](managed-application-author-marketplace.md).
* For information about consuming a managed application from the Marketplace, see [Consume Azure managed applications in the Marketplace](managed-application-consume-marketplace.md).
