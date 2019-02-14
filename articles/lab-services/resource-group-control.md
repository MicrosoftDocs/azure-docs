---
title: Specify resource group for VMs in Azure DevTest Labs | Microsoft Docs
description: Learn how to specify a resource group for VMs in a lab in Azure DevTest Labs. 
services: devtest-lab, lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/05/2019
ms.author: spelluru

---

# Specify a resource group for lab virtual machines in Azure DevTest Labs
As a lab owner, you can configure your lab virtual machines to be created in a specific resource group. Use this feature to stay within resource group limits on your Azure subscription. This feature also enables you to consolidate all your lab resources within a single resource group. It also simplifies tracking of resources and applying [policies](../governance/policy/overview.md) to manage resources at the resource group level.

With this feature, you can use a script to specify a new or existing resource group within your Azure subscription for all your lab VMs. Currently, Azure DevTest Labs supports this feature through an API.

## API to configure a resource group for lab VMs
You have the following options as a lab owner when using this API:

- Choose the **lab’s resource group** for all virtual machines.
- Choose an **existing resource group** other than the lab's resource group for all virtual machines.
- Enter a **new resource group** name for all virtual machines.
- Continue using the existing behavior, in which a resource group is created for each VM in the lab.
 
This setting applies to new virtual machines that are created in the lab. Older VMs in your lab that were created in their own resource groups are unaffected. However, you can migrate those virtual machines from their individual resource groups to the common resource group so that all your lab virtual machines are in one place. For more information, see [Move resources to a new resource group](../azure-resource-manager/resource-group-move-resources.md). Environments that are created in your lab continue to stay in their own resource groups.

How to use this API:
- Use API version **2018_10_15_preview**.
- If you specify a new resource group, ensure that you have **write permissions on resource groups** in your subscription. If you lack write permissions, creating new virtual machines in the specified resource group will fail.
- While using the API, pass in the **full resource group ID**. For example: `/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>`. Ensure that the resource group is in the same subscription as the lab. 

## Use PowerShell 
The following example shows how to use a PowerShell script to create all lab virtual machines in a new resource group.

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

Invoke the script by using the following command. ResourceGroup.ps1 is the file that contains the preceding script:

```PowerShell
.\ResourceGroup.ps1 -subId <subscriptionID> -labRg <labRGNAme> -labName <LanName> -vmRg <RGName> 
```

## Use an Azure Resource Manager template
If you're using an Azure Resource Manager template to create a lab, use the **vmCreationResourceGroupId** property in the lab properties section of your template, as shown in the following example:

```json
        {
            "type": "microsoft.devtestlab/labs",
            "name": "[parameters('lab_name')]",
            "apiVersion": "2018_10_15_preview",
            "location": "eastus",
            "tags": {},
            "scale": null,
            "properties": {
                "vmCreationResourceGroupId": "/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>",
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
