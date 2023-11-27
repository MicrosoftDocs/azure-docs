---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 11/21/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name |Description |Policies |Version |
|---|---|---|---|
|[\[Preview\]: Configure SQL VMs and Arc-enabled SQL Servers to install Microsoft Defender for SQL and AMA with a LA workspace](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/MDC_DfSQL_AMA_DefaultWorkspace.json) |Microsoft Defender for SQL collects events from the agents and uses them to provide security alerts and tailored hardening tasks (recommendations). Creates a resource group and a Data Collection Rule and Log Analytics workspace in the same region as the machine. |9 |1.2.0-preview |
|[\[Preview\]: Configure SQL VMs and Arc-enabled SQL Servers to install Microsoft Defender for SQL and AMA with a user-defined LA workspace](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/MDC_DfSQL_AMA_UserWorkspace.json) |Microsoft Defender for SQL collects events from the agents and uses them to provide security alerts and tailored hardening tasks (recommendations). Creates a resource group and a Data Collection Rule in the same region as the user-defined Log Analytics workspace. |8 |1.1.0-preview |
|[\[Preview\]: Deploy Microsoft Defender for Endpoint agent](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/ASC_MicrosoftDefenderForEndpointAgent.json) |Deploy Microsoft Defender for Endpoint agent on applicable images. |4 |1.0.0-preview |
|[Configure Advanced Threat Protection to be enabled on open-source relational databases](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/ASC_AtpForOssDatabases.json) |Enable Advanced Threat Protection on your non-Basic tier open-source relational databases to detect anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. See [https://aka.ms/AzDforOpenSourceDBsDocu](https://aka.ms/AzDforOpenSourceDBsDocu). |3 |1.0.1 |
|[Configure Azure Defender to be enabled on SQL Servers and SQL Managed Instances](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/ASC_AzureDefenderForSql.json) |Enable Azure Defender on your SQL Servers and SQL Managed Instances to detect anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. |3 |3.0.0 |
|[Configure Microsoft Defender for Databases to be enabled](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/MDC_DefenderForDatabases.json) |Configure Microsoft Defender for Databases to protect your Azure SQL Databases, Managed Instances, Open-source relational databases and Cosmos DB. |4 |1.0.0 |
|[Microsoft cloud security benchmark](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/AzureSecurityCenter.json) |The Microsoft cloud security benchmark initiative represents the policies and controls implementing security recommendations defined in Microsoft cloud security benchmark, see [https://aka.ms/azsecbm](https://aka.ms/azsecbm). This also serves as the Microsoft Defender for Cloud default policy initiative. You can directly assign this initiative, or manage its policies and compliance results within Microsoft Defender for Cloud. |235 |57.24.0 |
