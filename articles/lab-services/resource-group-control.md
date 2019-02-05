---
title: How to delete and export personal data from Azure DevTest Labs | Microsoft Docs
description: Learn how to delete and export personal data from the Azure DevLast Labs service to support your obligations under the General Data Protection Regulation (GDPR). 
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/13/2018
ms.author: spelluru

---

# Configure resource group control for your DevTest Labs
As a lab owner, you can configure your lab virtual machines to be created in a specific resource group. Use this feature so that you don't reach resource group limits on your Azure subscription. This feature also enables you to consolidate all your lab resources within a single resource group. It also simplifies tracking those resources and applying policies to manage them at the resource group level. This article talks on improving governance of your development and test environments by using [Azure polices](../governance/policy/overview.md) that you can apply at the resource group level. 

With this feature, you can use a script to specify a new/ an existing resource group within your Azure subscription for all your lab virtual machines. Currently, DevTest Labs supports this feature through an API. 

## API to coinfigure resource group for labs
Now let’s walk through the options you have as a lab owner while using this API: 

- You can choose the **lab’s resource group** for all virtual machines.
- You can choose an **existing resource group** other than the lab's resource group for all virtual machines.
- You can enter a **new resource group** name for all virtual machines.
- You can continue with the existing behavior, that is, a resource group is created for each VM in the lab.
 
This setting applies to new virtual machines created in the lab. This means older VMs in your lab that are created in their own resource groups continue to remain unaffected. However, you can migrate these virtual machines from their individual resource groups to the common resource group so that all your lab virtual machines are in one common resource group. For more information, see [Move resources to a new resource group](../azure-resource-manager/resource-group-move-resources.md). Environments created in your lab continue to remain in their own resource groups.

## How to use this API:
- Use the API version **2018_10_15_preview** while using this API. 
- If you specify a new resource group, ensure that you have write permissions on resource groups within your subscription. Without write permissions, creating new virtual machines in the specified resource group result in a failure. 
- While using the API, pass in the full resource group ID. For example: `/subscriptions/<subid>/resourceGroups/<rgName>`. Ensure that the resource group is in the same subscription as that of the lab. 

## Use PowerShell 
Following example describes how to create all lab virtual machines in a new resource group using a PowerShell script.

```PowerShell
[CmdletBinding()]
Param(
    $subId,
    $labRg,
    $labName,
    $vmRg
)

az login | out-null
az account set --subscription $subId | out-null
$rgId = "/subscriptions/"+$subId+"/resourceGroups/"+$vmRg
"Updating lab '$labName' with vm rg '$rgId'..."
az resource update -g $labRg -n $labName --resource-type "Microsoft.DevTestLab/labs" --api-version 2018-10-15-preview --set properties.vmCreationResourceGroupId=$rgId
"Done. New virtual machines will now be created in the resource group '$vmRg'."
```

Invoke the script using the following command (ResourceGroup.ps1 is the file that contains the preceding script): 

```PowerShell
.\ResourceGroup.ps1 -subId <subscriptionID> -labRg <labRGNAme> -labName <LanName> -vmRg <RGName> 
```

## Use Azure Resource Manager template
If you are using Azure Resource Manager template to create a lab, use the **vmCreationResourceGroupId** property with a desired value in the lab properties section of your ARM template.

```json
        {
            "type": "microsoft.devtestlab/labs",
            "name": "[parameters('lab_name')]",
            "apiVersion": "2018_10_15_preview",
            "location": "eastus",
            "tags": {},
            "scale": null,
            "properties": {
                "vmCreationResourceGroupId": "/subscriptions/<Subscription ID>/resourcegroups/<ResourceGroupName>"
                "labStorageType": "Premium",
                "premiumDataDisks": "Disabled",
                "provisioningState": "Succeeded",
                "uniqueIdentifier": "6e6f668f-992b-435c-bac3-d328b745cd25"
            },
            "dependsOn": []
        },
```


## Next steps
See the following articles: 

- [Set policies for a lab](devtest-lab-get-started-with-lab-policies.md)
- [Frequently asked questions](devtest-lab-faq.md)
