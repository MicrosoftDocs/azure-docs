---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 04/21/2021
ms.author: dacoulte
ms.custom: generated
---

|Name |Description |Policies |Version |
|---|---|---|---|
|[\[Preview\]: Deploy - Configure prerequisites to enable Azure Monitor and Azure Security agents on virtual machines](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Monitoring/AzureMonitoring_Prerequisites.json) |Configure machines to automatically install the Azure Monitor and Azure Security agents. Security Center collects events from the agents and uses them to provide security alerts and tailored hardening tasks (recommendations). Create a resource group and Log Analytics workspace in the same region as the machine to store audit records. This policy only applies to VMs in a few regions. |5 |1.0.0-preview |
|[Enable Azure Monitor for Virtual Machine Scale Sets](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Monitoring/AzureMonitor_VMSS.json) |Enable Azure Monitor for the Virtual Machine Scale Sets in the specified scope (Management group, Subscription or resource group). Takes Log Analytics workspace as parameter. Note: if your scale set upgradePolicy is set to Manual, you need to apply the extension to the all VMs in the set by calling upgrade on them. In CLI this would be az vmss update-instances. |6 |1.0.1 |
|[Enable Azure Monitor for VMs](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Monitoring/AzureMonitor_VM.json) |Enable Azure Monitor for the virtual machines (VMs) in the specified scope (management group, subscription or resource group). Takes Log Analytics workspace as parameter. |10 |2.0.0 |
