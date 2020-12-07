---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 12/01/2020
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
|Data Protection |4.8 |Encrypt sensitive information at rest |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

> [!NOTE]
> When you create an Automation account variable, you can specify its encryption and storage by Azure Automation as a secure asset. After you create the variable, you can't change its encryption status without re-creating the variable. If you have Automation account variables storing sensitive data that are not already encrypted, then you need to delete them and recreate them as encrypted variables. An Azure Security Center recommendation is to encrypt all Azure Automation variables as described in [Automation account variables should be encrypted](../../../../articles/security-center/recommendations-reference.md#recs-computeapp). If you have unencrypted variables that you want excluded from this security recommendation, see [Exempt a resource from recommendations and secure score](../../../../articles/security-center/exempt-resource.md) to create an exemption rule.