---
title: Troubleshoot VM deployment failures
description: Learn how to troubleshoot virtual machine (VM) deployment failures in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# Troubleshoot virtual machine (VM) deployment failures in Azure DevTest Labs
This article guides you through possible causes and troubleshooting steps for deployment failures on Azure DevTest Labs virtual machines (VMs).

##  Why do I get a "Parent resource not found" error when I provision a VM from PowerShell?
When one resource is a parent to another resource, the parent resource must exist before you create the child resource. If the parent resource doesn't exist, you see a **ParentResourceNotFound** message. If you don't specify a dependency on the parent resource, the child resource might be deployed before the parent.
          
VMs are child resources under a lab in a resource group. When you use Resource Manager templates to deploy VMs by using PowerShell, the resource group name provided in the PowerShell script should be the resource group name of the lab. For more information, see [Troubleshoot common Azure deployment errors](../azure-resource-manager/templates/common-deployment-errors.md).
          
## Where can I find more error information if a VM deployment fails?
VM deployment errors are captured in activity logs. You can find lab VM activity logs under **Audit logs** or **Virtual machine diagnostics** on the resource menu on the lab's VM page (the page appears after you select the VM from the My virtual machines list).
          
Sometimes, the deployment error occurs before VM deployment begins. An example is when the subscription limit for a resource that was created with the VM is exceeded. In this case, the error details are captured in the lab-level activity logs. Activity logs are located at the bottom of the **Configuration and policies** settings. For more information about using activity logs in Azure, see [View activity logs to audit actions on resources](../azure-monitor/essentials/activity-log.md).
          
## Why do I get "location is not available for resource type" error when trying to create a lab?
You may see an error message similar to the following one when you try to create a lab:
          
```
The provided location 'australiacentral' is not available for resource type 'Microsoft.KeyVault/vaults'. List of available regions for the resource type is 'devx-track-azurepowershell,northcentralus,eastus,northeurope,westeurope,eastasia,southeastasia,eastus2,centralus,southcentralus,westus,japaneast,japanwest,australiaeast,australiasoutheast,brazilsouth,centralindia,southindia,westindia,canadacentral,canadaeast,uksouth,ukwest,westcentralus,westus2,koreacentral,koreasouth,francecentral,southafricanorth
```
          
You can resolve this error by taking one of the following steps:
          
**Option 1**
          
Check availability of the resource type in Azure regions on the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) page. If the resource type isn't available in a certain region, DevTest Labs doesn't support creation of a lab in that region. Select another region when creating your lab.
          
**Option 2**
          
If the resource type is available in your region, check if it's registered with your subscription. It can be done at the subscription owner level as shown in [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

## Why isn't my existing virtual network saving properly?
One possibility is that your virtual network name contains periods. If so, try removing the periods or replacing them with hyphens. Then, try again to save the virtual network.          

## Next steps

If you need more help, try one of the following support channels:
- [Troubleshooting artifact failures](devtest-lab-troubleshoot-artifact-failure.md)
- Contact the Azure DevTest Labs experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/).
- Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums).
- Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
