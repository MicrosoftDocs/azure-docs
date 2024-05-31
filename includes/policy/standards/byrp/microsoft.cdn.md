---
ms.service: azure-policy
ms.topic: include
ms.date: 05/30/2024
ms.author: davidsmatlak
author: davidsmatlak
ms.custom: generated
---

## NL BIO Cloud Theme

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance details for NL BIO Cloud Theme](../../../../articles/governance/policy/samples/nl-bio-cloud-theme.md).
For more information about this compliance standard, see
[Baseline Information Security Government Cybersecurity - Digital Government (digitaleoverheid.nl)](https://www.digitaleoverheid.nl/overzicht-van-alle-onderwerpen/cybersecurity/kaders-voor-cybersecurity/baseline-informatiebeveiliging-overheid/).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|U.05.1 Data protection  - Cryptographic measures | U.05.1 |Data transport is secured with cryptography where key management is carried out by the CSC itself if possible. |[Azure Front Door Standard and Premium should be running minimum TLS version of 1.2](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F679da822-78a7-4eff-8fff-a899454a9970) |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/CDN/AFD_Standard_Premium_MinimumTls_Audit.json) |
|U.07.1 Data separation  - Isolated | U.07.1 |Permanent isolation of data is a multi-tenant architecture. Patches are realized in a controlled manner. |[Azure Front Door profiles should use Premium tier that supports managed WAF rules and private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdfc212af-17ea-423a-9dcb-91e2cb2caa6b) |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/CDN/AFD_Premium_Sku_Audit.json) |
|U.15.1 Logging and monitoring  - Events logged | U.15.1 |The violation of the policy rules is recorded by the CSP and the CSC. |[Azure Front Door Standard or Premium (Plus WAF) should have resource logs enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcd906338-3453-47ba-9334-2d654bf845af) |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/AFDStandardOrPremiumShouldHaveResourceLogsEnabledPolicy.json) |

## Spain ENS

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance details for Spain ENS](../../../../articles/governance/policy/samples/spain-ens.md).
For more information about this compliance standard, see
[CCN-STIC 884](https://www.ccn-cert.cni.es/es/comunicacion-eventos/comunicados-ccn-cert/9519-disponible-la-guia-ccn-stic-884-perfil-de-cumplimiento-especifico-para-azure-servicio-de-cloud-corporativo).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Protective Measures | mp.s.3 |Protection of services |[Azure Front Door Standard or Premium (Plus WAF) should have resource logs enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcd906338-3453-47ba-9334-2d654bf845af) |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/AFDStandardOrPremiumShouldHaveResourceLogsEnabledPolicy.json) |

