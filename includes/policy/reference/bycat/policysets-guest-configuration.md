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
|[Audit machines with insecure password security settings](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Guest%20Configuration/GuestConfiguration_WindowsPasswordSettingsAINE.json) |This initiative deploys the policy requirements and audits machines with insecure password security settings. For more information on Guest Configuration policies, please visit [https://aka.ms/gcpol](https://aka.ms/gcpol) |9 |1.0.0 |
|[\[Preview\]: Deploy prerequisites to enable Guest Configuration policies on virtual machines](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Guest%20Configuration/GuestConfiguration_Prerequisites.json) |This initiative adds a system-assigned managed identity and deploys the platform-appropriate Guest Configuration extension to virtual machines that are eligible to be monitored by Guest Configuration policies. This is a prerequisite for all Guest Configuration policies and must be assigned to the policy assignment scope before using any Guest Configuration policy. For more information on Guest Configuration, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). |4 |1.0.0-preview |
|[\[Preview\]: Windows machines should meet requirements for the Azure security baseline](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Guest%20Configuration/GuestConfiguration_AzureBaseline.json) |This initiative audits Windows machines with settings that do not meet the Azure security baseline. For details, please visit [https://aka.ms/gcpol](https://aka.ms/gcpol) |29 |2.0.0-preview |
