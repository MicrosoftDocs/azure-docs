---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 09/19/2023
ms.author: davidsmatlak
ms.custom: generated
---

## Microsoft cloud security benchmark

The [Microsoft cloud security benchmark](/security/benchmark/azure/introduction) provides recommendations on
how you can secure your cloud solutions on Azure. To see how this service completely maps to the
Microsoft cloud security benchmark, see the
[Azure Security Benchmark mapping files](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - Microsoft cloud security benchmark](../../../../articles/governance/policy/samples/azure-security-benchmark.md).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Network Security |NS-2 |Secure cloud services with network controls |[Azure Databricks Clusters should disable public IP](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F51c1490f-3319-459c-bbbc-7f391bbed753) |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Databricks/Databricks_DisablePublicIP_Audit.json) |
|Network Security |NS-2 |Secure cloud services with network controls |[Azure Databricks Workspaces should be in a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c25c9e4-ee12-4882-afd2-11fb9d87893f) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Databricks/Databricks_VNETEnabled_Audit.json) |
|Network Security |NS-2 |Secure cloud services with network controls |[Azure Databricks Workspaces should disable public network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e7849de-b939-4c50-ab48-fc6b0f5eeba2) |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Databricks/Databricks_AuditPublicNetworkAccess.json) |
|Network Security |NS-2 |Secure cloud services with network controls |[Azure Databricks Workspaces should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F258823f2-4595-4b52-b333-cc96192710d8) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Databricks/Databricks_PrivateEndpoint_Audit.json) |
|Logging and Threat Detection |LT-3 |Enable logging for security investigation |[Resource logs in Azure Databricks Workspaces should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F138ff14d-b687-4faa-a81c-898c91a87fa2) |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Databricks/Databricks_AuditDiagnosticLog_Audit.json) |

