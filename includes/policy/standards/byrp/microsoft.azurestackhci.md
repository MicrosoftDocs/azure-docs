---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 02/22/2024
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
|Data Protection |DP-3 |Encrypt sensitive data in transit |[[Preview]: Host and VM networking should be protected on Azure Stack HCI systems](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faee306e7-80b0-46f3-814c-d3d3083ed034) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/DataInTransitProtected_Audit.json) |
|Data Protection |DP-5 |Use customer-managed key option in data at rest encryption when required |[[Preview]: Azure Stack HCI systems should have encrypted volumes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fae95f12a-b6fd-42e0-805c-6b94b86c9830) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/DataAtRestEncrypted_Audit.json) |
|Posture and Vulnerability Management |PV-4 |Audit and enforce secure configurations for compute resources |[[Preview]: Azure Stack HCI servers should have consistently enforced application control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7384fde3-11b0-4047-acbd-b3cf3cc8ce07) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/WdacCompliance_Audit.json) |
|Posture and Vulnerability Management |PV-4 |Audit and enforce secure configurations for compute resources |[[Preview]: Azure Stack HCI servers should meet Secured-core requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F56c47221-b8b7-446e-9ab7-c7c9dc07f0ad) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/SecuredCoreCompliance_Audit.json) |

