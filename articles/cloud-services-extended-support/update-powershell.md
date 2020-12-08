---
title: Update a Cloud Service (extended support) - PowerShell
description: Update a Cloud Service (extended support) using PowerShell
ms.topic: how-to
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---
# Update a Cloud Service (extended support) using PowerShell

Template and parameter files define the desired state of your Cloud Service (extended support) deployment. There are two methods to update a resource using a template.

1. Reuse and old template by making necessary changes. Azure Resource Manager will only incorporate the updates.

2. Define a new template containing desired state of all the resources. 

## Update method #1
1.	Update or create a template and parameters file for your Cloud Services (extended support) deployment. Incorporate changes for all resources. 

2.	Update the storage account or upload a new copy of the cscfg and cspkg, obtain SAS URLs and add SAS URLs to Cloud Services resource section of the template. 

3.	Update Cloud Services (extended support) deployment using PowerShell.

    ```PowerShell
    New-AzResourceGroupDeployment -ResourceGroupName “Resource group name” -TemplateParameterFile "file path to your parameters file" -TemplateFile "file path to your template file"
    ```

## Update method #2
 
The steps below mention the order to update resources. Depending on the scenario the steps can change. Updates can be done by PowerShell or using the Azure portal.

1.	Update the storage account.

2.	Update the cscfg file and upload it to the storage account. Obtain the SAS URL. 

3.	Update cspkg file and upload it to the storage account. Obtain the SAS URL.

4.	Update the public IP address.

5.	Update the Key Vault reference and upload new certificates.

6.	Get and update the role profile object.

7.	Get and update the extension profile object.

8.	Get and update the os profile object.

9.	Get and update the network profile object.

10.	Get and update Cloud Services deployment using the profile object and SAS URLs.

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

## Next steps
For more information, see [Cloud Services (extended support) Reference Documentation](https://docs.microsoft.com/rest/api/compute/cloudservices/).

