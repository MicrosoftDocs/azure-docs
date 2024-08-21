---
title: Troubleshoot VM deployment failures
titleSuffix: Azure DevTest Labs
description: Learn how to troubleshoot virtual machine (VM) deployment failures in Azure DevTest Labs, including error messages and support information.
ms.topic: troubleshooting-general
ms.author: rosemalcolm
author: RoseHJM
ms.date: 05/30/2024
ms.custom: UpdateFrequency2

#customer intent: As a developer, I want to review possible deployment failures for virtual machines in Azure DevTest Labs so I can troubleshoot and resolve issues.
---

# Troubleshoot virtual machine deployment failures in Azure DevTest Labs

This article guides you through possible causes and troubleshooting steps for deployment failures on Azure DevTest Labs virtual machines (VMs).

## Find information about deployment failures

VM deployment errors are captured in activity logs. In the Azure portal, you can find lab VM activity logs under **Audit logs** or **Virtual machine diagnostics** on the resource menu on the lab's VM page. (This page appears after you select the VM from the **My virtual machines** list).
          
Sometimes, the deployment error occurs before VM deployment begins. An example is when the subscription limit for a resource that was created with the VM is exceeded. In this case, the error details are captured in the lab-level activity logs. In the Azure portal, activity logs are located at the bottom of the **Configuration and policies** settings section. For more information about activity logs in Azure, see [View activity logs to audit actions on resources](../azure-monitor/essentials/activity-log.md).

## Resolve "Parent resource not found"

When one resource is a parent to another resource, the parent resource must exist before you create the child resource. If you attempt to create a child resource, but a specified parent resource doesn't exist, you see the **ParentResourceNotFound** message. If you don't specify a dependency on the parent resource, the child resource might be deployed before the parent.
          
VMs are child resources under a lab in a resource group. When you use Azure Resource Manager (ARM) templates to deploy VMs by using PowerShell, the resource group name provided in the PowerShell script should be the resource group name of the lab. For more information, see [Troubleshoot common Azure deployment errors](../azure-resource-manager/templates/common-deployment-errors.md).
          
## Resolve "Location not available for resource type"

You might see an error message similar to the following example when you try to create a lab:
          
```console
The provided location 'australiacentral' is not available for resource type 'Microsoft.KeyVault/vaults'. List of available regions for the resource type is 'devx-track-azurepowershell,northcentralus,eastus,northeurope,westeurope,eastasia,southeastasia,eastus2,centralus,southcentralus,westus,japaneast,japanwest,australiaeast,australiasoutheast,brazilsouth,centralindia,southindia,westindia,canadacentral,canadaeast,uksouth,ukwest,westcentralus,westus2,koreacentral,koreasouth,francecentral,southafricanorth
```
          
There are two approaches to address this issue:
          
- In the Azure portal, check the availability for the resource type in Azure regions on the [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/) page. If the resource type isn't available in a certain region, DevTest Labs doesn't support creation of a lab in that region. To address the issue, select a different region when you create your lab.
          
- If the resource type is available in your region, confirm the registration with your subscription. You can check the registration at the subscription owner level as shown in [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

## Fix save process for virtual network

If DevTest Labs isn't properly saving your existing virtual network, one possibility is that the virtual network name contains periods (`.`). If the name uses periods, remove the periods or replace them with hyphens (`-`). After you update the virtual network name, try saving the network again.          

## Get support

If you need more help, try one of the following support channels:

- Search the [Microsoft Community](https://azure.microsoft.com/support/forums/) website resources for information about Azure DevTest Labs and access posts on Stack Overflow.

- Connect with [@AzureSupport](https://x.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.

## Related content

- [Troubleshoot artifact failures](devtest-lab-troubleshoot-artifact-failure.md)
