---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 02/10/2020
ms.author: dacoulte
---

|Name |Description |Policies |Version |
|---|---|---|---|
|[Enable Azure Monitor for VM Scale Sets (VMSS)](https://github.com/Azure/azure-policy/blob/masterbuilt-in-policies/policySetDefinitions/Monitoring/AzureMonitor_VMSS.json) |Enable Azure Monitor for the VM Scale Sets in the specified scope (Management group, Subscription or resource group). Takes Log Analytics workspace as parameter. Note: if your scale set upgradePolicy is set to Manual, you need to apply the extension to the all VMs in the set by calling upgrade on them. In CLI this would be az vmss update-instances. |6 |1.0.0-preview |
|[Enable Azure Monitor for VMs](https://github.com/Azure/azure-policy/blob/masterbuilt-in-policies/policySetDefinitions/Monitoring/AzureMonitor_VM.json) |Enable Azure Monitor for the Virtual Machines (VMs) in the specified scope (Management group, Subscription or resource group). Takes Log Analytics workspace as parameter. |6 |1.0.0-preview |
