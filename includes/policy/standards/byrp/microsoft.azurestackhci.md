---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 03/18/2024
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
|Data Protection |DP-3 |Encrypt sensitive data in transit |[[Preview]: Host and VM networking should be protected on Azure Stack HCI systems](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F36f0d6bc-a253-4df8-b25b-c3a5023ff443) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/DataInTransitProtectedAtCluster_Audit.json) |
|Data Protection |DP-5 |Use customer-managed key option in data at rest encryption when required |[[Preview]: Azure Stack HCI systems should have encrypted volumes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fee8ca833-1583-4d24-837e-96c2af9488a4) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/DataAtRestEncryptedAtCluster_Audit.json) |
|Posture and Vulnerability Management |PV-4 |Audit and enforce secure configurations for compute resources |[[Preview]: Azure Stack HCI servers should have consistently enforced application control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdad3a6b9-4451-492f-a95c-69efc6f3fada) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/WdacComplianceAtCluster_Audit.json) |
|Posture and Vulnerability Management |PV-4 |Audit and enforce secure configurations for compute resources |[[Preview]: Azure Stack HCI servers should meet Secured-core requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5e6bf724-0154-49bc-985f-27b2e07e636b) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/SecuredCoreComplianceAtCluster_Audit.json) |

