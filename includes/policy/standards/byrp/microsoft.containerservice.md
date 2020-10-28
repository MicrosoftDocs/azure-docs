---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 10/20/2020
ms.author: dacoulte
ms.custom: generated
---

## Azure Security Benchmark

The [Azure Security Benchmark](../../../../articles/security/benchmarks/overview.md) provides
recommendations on how you can secure your cloud solutions on Azure. To see how this service
completely maps to the Azure Security Benchmark, see the
[Azure Security Benchmark mapping files](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - Azure Security Benchmark](../../../../articles/governance/policy/samples/azure-security-benchmark.md).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Network Security |1.1 |Protect resources using Network Security Groups or Azure Firewall on your Virtual Network |[Authorized IP ranges should be defined on Kubernetes Services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e246bcf-5f6f-4f87-bc6f-775d4712c7ea) |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableIpRanges_KubernetesService_Audit.json) |
|Data Protection |4.6 |Use Azure RBAC to control access to resources |[Role-Based Access Control (RBAC) should be used on Kubernetes Services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fac4a19c2-fa67-49b4-8ae5-0b2e78c49457) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableRBAC_KubernetesService_Audit.json) |
|Vulnerability Management |5.3 |Deploy automated third-party software patch management solution |[Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffb893a29-21bb-418c-a157-e99480ec364c) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UpgradeVersion_KubernetesService_Audit.json) |

## CIS Microsoft Azure Foundations Benchmark

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - CIS Microsoft Azure Foundations Benchmark 1.1.0](../../../../articles/governance/policy/samples/cis-azure-1-1-0.md).
For more information about this compliance standard, see
[CIS Microsoft Azure Foundations Benchmark](https://www.cisecurity.org/benchmark/azure/).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Other Security Considerations |8.5 |Enable role-based access control (RBAC) within Azure Kubernetes Services |[Role-Based Access Control (RBAC) should be used on Kubernetes Services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fac4a19c2-fa67-49b4-8ae5-0b2e78c49457) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableRBAC_KubernetesService_Audit.json) |

## HIPAA HITRUST 9.2

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - HIPAA HITRUST 9.2](../../../../articles/governance/policy/samples/hipaa-hitrust-9-2.md).
For more information about this compliance standard, see
[HIPAA HITRUST 9.2](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Privilege Management |1149.01c2System.9 - 01.c |The organization facilitates information sharing by enabling authorized users to determine a business partner's access when discretion is allowed as defined by the organization and by employing manual processes or automated mechanisms to assist users in making information sharing/collaboration decisions. |[Role-Based Access Control (RBAC) should be used on Kubernetes Services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fac4a19c2-fa67-49b4-8ae5-0b2e78c49457) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableRBAC_KubernetesService_Audit.json) |
|Privilege Management |1153.01c3System.35 - 01.c |All file system access not explicitly required is disabled, and only authorized users are permitted access to only that which is expressly required for the performance of the users' job duties. |[Role-Based Access Control (RBAC) should be used on Kubernetes Services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fac4a19c2-fa67-49b4-8ae5-0b2e78c49457) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableRBAC_KubernetesService_Audit.json) |
|Segregation of Duties |1229.09c1Organizational.1 - 09.c |Separation of duties is used to limit the risk of unauthorized or unintentional modification of information and systems. |[Role-Based Access Control (RBAC) should be used on Kubernetes Services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fac4a19c2-fa67-49b4-8ae5-0b2e78c49457) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableRBAC_KubernetesService_Audit.json) |

## NIST SP 800-171 R2

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - NIST SP 800-171 R2](../../../../articles/governance/policy/samples/nist-sp-800-171-r2.md).
For more information about this compliance standard, see
[NIST SP 800-171 R2](https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|System and Information Integrity |3.14.1 |Identify, report, and correct system flaws in a timely manner. |[Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffb893a29-21bb-418c-a157-e99480ec364c) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UpgradeVersion_KubernetesService_Audit.json) |

