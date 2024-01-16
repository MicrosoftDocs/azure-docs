---
title: Create a Standby Pool for Virtual Machine Scale Sets
description: Learn how to create a Standby Pool to reduce scale out latency with Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 01/16/2024
ms.reviewer: ju-shim
---


# Create a Standby Pool


## Prerequisites

> [!IMPORTANT]
> Standby Pools for Virtual Machine Scale Sets are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 


### Feature Registration 
Register the Standby Pool Resource Provider and the Standby Pool Preview Feature with your 
subscription using PowerShell in Azure Cloud Shell. Registration can take about 30 mins to take effect. 
You can rerun the below commands to determine when the feature has been successfully registered. 

```azurepowershell-interactice
Register-AzResourceProvider -ProviderNamespace Microsoft.StandbyPool

Register-AzProviderFeature -FeatureName StandbyVMPoolPreview -ProviderNamespace Microsoft.StandbyPool
```

### RBAC Permissions
Assign the appropriate RBAC roles for creating virtual machines to the Standby Pool Resource Provider 
Service Principal. 
1) In the Azure Portal, navigate to your subscriptions. 
2) Select the subscription you want to adjust RBAC permissions. 
3) Select **Access Control (IAM)**.
4) Select Add -> **Add Role Assignment**.
5) Search for **Virtual Machine Contributor** and highlight it. Select **Next**. 
6) Click on **+ Select Members**.
7) Search for **Standby Pool Resource Provider** 
8) Select the Standby Pool Resource Provider and select R**eview + Assign**.
9) Repeat the above steps and with **Network Contributor** instead of “Virtual Machine 
Contributor” 

If you are leveraging a customized image in Compute Gallery, ensure to assign Standby Pool Resource 
Provider the **Compute Gallery Sharing Admin** permissions as well.

For more information on assigning roles, see [Assign Azure roles using the Azure portal](../azure/role-based-access-control/role-assignments-portal.md)

## Create a Standby Pool

### [Portal](#tab/portal1)


### [CLI](#tab/cli1)


### [PowerShell](#tab/powershell1)


### [ARM Template](#tab/template1)


### [REST API](#tab/rest1)


### [Terraform](#tab/terraform1)

---


## Next steps
