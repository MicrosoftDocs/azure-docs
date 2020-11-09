---
title: Update a Cloud Service (extended support) - PowerShell
description: Update a Cloud Service (extended support) using PowerShell
ms.topic: quickstart
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---
# Update a Cloud Service (extended support) using PowerShell

Template & parameters file define the desired state of your Cloud Service (extended support) deployment. There are two methods to update a resource using Template

1. Reuse old template by making necessary changes and leaving rest of the template untouched. Azure Resource Manager is smart enough to understand the changes and only incorporate those changes.

2. Define a new template containing desired state of all the resources that needs changes. 

## Update Method #1
1.	Update/Create new template & parameters file for your Cloud Services (extended support) deployment. Incorporate changes for all resources. 

2.	Update Storage Account or upload newer copy of Cscfg/Cspkg, obtain SAS URLs & add SAS URLs to Cloud Services resource section of Template. 

3.	Update Cloud Services (extended support) resource using Azure Resource Manager’s PowerShell command to update using Template. (Azure Resource Manager automatically converts the call from create to update)

    ```PowerShell
    New-AzResourceGroupDeployment -ResourceGroupName “Resource group name” -TemplateParameterFile "file path to your parameters file" -TemplateFile "file path to your template file"
    ```

## Update Method #2
 
The steps below mention the order to update resources. Depending on the update scenarios, the steps will change. Updates can be done by PowerShell command or Portal

1.	Update Storage Account.

2.	Update `.cscfg`, upload `.cscfg` to storage account & obtain SAS URL. 

3.	Update `.cspkg` file, upload `.cspkg` to storage account and obtain SAS URL.

4.	Update public IP.

5.	Update key vault and upload updated certificates.

6.	Get and update role profile object.

7.	Get and update extension profile object.

8.	Get and update os profile object.

9.	Get and update network profile object.

10.	Get & update Cloud Services deployment using profile objects & SAS URLs.

    ```PowerShell
    $cloudService = Get-AzCloudService -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName
    ```

    ```PowerShell
    $cloudService = Update-AzCloudService `
    -Name $cloudServiceName `
    -ResourceGroupName $resourceGroupName `
    -PackageUrl $cspkgUrl `
    -Configuration $cscfgUrl #Use $cscfgBase64 for base64encoded string `
    -UpgradeMode $upgradeMode `
    -RoleProfileRole $roles `
    -NetworkProfileLoadBalancerConfiguration $networkProfile `
    -ExtensionProfileExtension $extension
    ```



