---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 01/25/2021
ms.author: dacoulte
ms.custom: generated
---

## CIS Microsoft Azure Foundations Benchmark

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - CIS Microsoft Azure Foundations Benchmark 1.1.0](../../../../articles/governance/policy/samples/cis-azure-1-1-0.md).
For more information about this compliance standard, see
[CIS Microsoft Azure Foundations Benchmark](https://www.cisecurity.org/benchmark/azure/).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Other Security Considerations |8.1 |Ensure that the expiration date is set on all keys |[Key Vault keys should have an expiration date](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F152b15f7-8e1f-4c1f-ab71-8c010ba5dbc0) |[1.0.1-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Keys_ExpirationSet.json) |
|Other Security Considerations |8.2 |Ensure that the expiration date is set on all Secrets |[Key Vault secrets should have an expiration date](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F98728c90-32c7-4049-8429-847dc0f4fe37) |[1.0.1-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Secrets_ExpirationSet.json) |

## CMMC Level 3

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - CMMC Level 3](../../../../articles/governance/policy/samples/cmmc-l3.md).
For more information about this compliance standard, see
[Cybersecurity Maturity Model Certification (CMMC)](https://www.acq.osd.mil/cmmc/docs/CMMC_Model_Main_20200203.pdf).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|System and Communications Protection |SC.3.177 |Employ FIPS-validated cryptography when used to protect the confidentiality of CUI. |[Certificates using RSA cryptography should have the specified minimum key size](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcee51871-e572-4576-855c-047c820360f0) |[2.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Certificates_RSA_MinimumKeySize.json) |
|System and Communications Protection |SC.3.177 |Employ FIPS-validated cryptography when used to protect the confidentiality of CUI. |[Keys should be the specified cryptographic type RSA or EC](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F75c4f823-d65c-4f29-a733-01d0077fdbcb) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Keys_AllowedKeyTypes.json) |
|System and Communications Protection |SC.3.177 |Employ FIPS-validated cryptography when used to protect the confidentiality of CUI. |[Keys using elliptic curve cryptography should have the specified curve names](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fff25f3c8-b739-4538-9d07-3d6d25cfb255) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Keys_EC_AllowedCurveNames.json) |
|System and Communications Protection |SC.3.177 |Employ FIPS-validated cryptography when used to protect the confidentiality of CUI. |[Keys using RSA cryptography should have a specified minimum key size](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F82067dbb-e53b-4e06-b631-546d197452d9) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Keys_RSA_MinimumKeySize.json) |
|System and Communications Protection |SC.3.187 |Establish and manage cryptographic keys for cryptography employed in organizational systems. |[Key Vault keys should have an expiration date](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F152b15f7-8e1f-4c1f-ab71-8c010ba5dbc0) |[1.0.1-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Keys_ExpirationSet.json) |
|System and Communications Protection |SC.3.187 |Establish and manage cryptographic keys for cryptography employed in organizational systems. |[Keys should be the specified cryptographic type RSA or EC](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F75c4f823-d65c-4f29-a733-01d0077fdbcb) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Keys_AllowedKeyTypes.json) |
|System and Communications Protection |SC.3.187 |Establish and manage cryptographic keys for cryptography employed in organizational systems. |[Keys using elliptic curve cryptography should have the specified curve names](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fff25f3c8-b739-4538-9d07-3d6d25cfb255) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Keys_EC_AllowedCurveNames.json) |
|System and Communications Protection |SC.3.187 |Establish and manage cryptographic keys for cryptography employed in organizational systems. |[Keys using RSA cryptography should have a specified minimum key size](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F82067dbb-e53b-4e06-b631-546d197452d9) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Keys_RSA_MinimumKeySize.json) |
|System and Communications Protection |SC.3.190 |Protect the authenticity of communications sessions. |[Certificates using RSA cryptography should have the specified minimum key size](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcee51871-e572-4576-855c-047c820360f0) |[2.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Certificates_RSA_MinimumKeySize.json) |

