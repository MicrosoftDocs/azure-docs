---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 09/19/2023
ms.author: davidsmatlak
ms.custom: generated
---

## Azure Security Benchmark v1

The [Azure Security Benchmark](/security/benchmark/azure/introduction) provides recommendations on
how you can secure your cloud solutions on Azure. To see how this service completely maps to the
Azure Security Benchmark, see the
[Azure Security Benchmark mapping files](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - Azure Security Benchmark](../../../../articles/governance/policy/samples/azure-security-benchmark.md).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Data Protection |4.8 |Encrypt sensitive information at rest |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## CMMC Level 3

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - CMMC Level 3](../../../../articles/governance/policy/samples/cmmc-l3.md).
For more information about this compliance standard, see
[Cybersecurity Maturity Model Certification (CMMC)](https://www.acq.osd.mil/cmmc/documentation.html).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|System and Communications Protection |SC.3.177 |Employ FIPS-validated cryptography when used to protect the confidentiality of CUI. |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |
|System and Communications Protection |SC.3.191 |Protect the confidentiality of CUI at rest. |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## FedRAMP High

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - FedRAMP High](../../../../articles/governance/policy/samples/fedramp-high.md).
For more information about this compliance standard, see
[FedRAMP High](https://www.fedramp.gov/).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|System And Communications Protection |SC-12 |Cryptographic Key Establishment And Management |[Azure Automation accounts should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F56a5ee18-2ae6-4810-86f7-18e39ce5629b) |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/AutomationAccount_CMK_Audit.json) |
|System And Communications Protection |SC-28 |Protection Of Information At Rest |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |
|System And Communications Protection |SC-28 (1) |Cryptographic Protection |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## FedRAMP Moderate

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - FedRAMP Moderate](../../../../articles/governance/policy/samples/fedramp-moderate.md).
For more information about this compliance standard, see
[FedRAMP Moderate](https://www.fedramp.gov/).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|System And Communications Protection |SC-12 |Cryptographic Key Establishment And Management |[Azure Automation accounts should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F56a5ee18-2ae6-4810-86f7-18e39ce5629b) |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/AutomationAccount_CMK_Audit.json) |
|System And Communications Protection |SC-28 |Protection Of Information At Rest |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |
|System And Communications Protection |SC-28 (1) |Cryptographic Protection |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## ISO 27001:2013

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - ISO 27001:2013](../../../../articles/governance/policy/samples/iso-27001.md).
For more information about this compliance standard, see
[ISO 27001:2013](https://www.iso.org/isoiec-27001-information-security.html).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Cryptography |10.1.1 |Policy on the use of cryptographic controls |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

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
|Data Protection |DP-4 |Enable data at rest encryption by default |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## NIST SP 800-171 R2

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - NIST SP 800-171 R2](../../../../articles/governance/policy/samples/nist-sp-800-171-r2.md).
For more information about this compliance standard, see
[NIST SP 800-171 R2](https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|System and Communications Protection |3.13.10 |Establish and manage cryptographic keys for cryptography employed in organizational systems. |[Azure Automation accounts should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F56a5ee18-2ae6-4810-86f7-18e39ce5629b) |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/AutomationAccount_CMK_Audit.json) |
|System and Communications Protection |3.13.16 |Protect the confidentiality of CUI at rest. |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## NIST SP 800-53 Rev. 4

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - NIST SP 800-53 Rev. 4](../../../../articles/governance/policy/samples/nist-sp-800-53-r4.md).
For more information about this compliance standard, see
[NIST SP 800-53 Rev. 4](https://nvd.nist.gov/800-53).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|System And Communications Protection |SC-12 |Cryptographic Key Establishment And Management |[Azure Automation accounts should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F56a5ee18-2ae6-4810-86f7-18e39ce5629b) |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/AutomationAccount_CMK_Audit.json) |
|System And Communications Protection |SC-28 |Protection Of Information At Rest |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |
|System And Communications Protection |SC-28 (1) |Cryptographic Protection |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## NIST SP 800-53 Rev. 5

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - NIST SP 800-53 Rev. 5](../../../../articles/governance/policy/samples/nist-sp-800-53-r5.md).
For more information about this compliance standard, see
[NIST SP 800-53 Rev. 5](https://nvd.nist.gov/800-53).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|System and Communications Protection |SC-12 |Cryptographic Key Establishment and Management |[Azure Automation accounts should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F56a5ee18-2ae6-4810-86f7-18e39ce5629b) |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/AutomationAccount_CMK_Audit.json) |
|System and Communications Protection |SC-28 |Protection of Information at Rest |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |
|System and Communications Protection |SC-28 (1) |Cryptographic Protection |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## NZ ISM Restricted v3.5

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - NZ ISM Restricted v3.5](../../../../articles/governance/policy/samples/nz-ism-restricted-3-5.md).
For more information about this compliance standard, see
[NZ ISM Restricted v3.5](https://www.nzism.gcsb.govt.nz/ism-document).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Cryptography | CR-3 |17.1.53 Reducing storage and physical transfer requirements |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## PCI DSS 3.2.1

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[PCI DSS 3.2.1](../../../../articles/governance/policy/samples/pci-dss-3-2-1.md).
For more information about this compliance standard, see
[PCI DSS 3.2.1](https://www.pcisecuritystandards.org/documents/PCI_DSS-QRG-v3_2_1.pdf).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Requirement 3 | 3.4 |PCI DSS requirement 3.4 |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |
|Requirement 4 | 4.1 |PCI DSS requirement 4.1 |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |
|Requirement 6 | 6.5.3 |PCI DSS requirement 6.5.3 |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## PCI DSS v4.0

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance details for PCI DSS v4.0](../../../../articles/governance/policy/samples/pci-dss-4-0.md).
For more information about this compliance standard, see
[PCI DSS v4.0](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Requirement 03: Protect Stored Account Data | 3.5.1 |Primary account number (PAN) is secured wherever it is stored |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |
|Requirement 06: Develop and Maintain Secure Systems and Software | 6.2.4 |Bespoke and custom software are developed securely |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## Reserve Bank of India - IT Framework for NBFC

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - Reserve Bank of India - IT Framework for NBFC](../../../../articles/governance/policy/samples/rbi-itf-nbfc-2017.md).
For more information about this compliance standard, see
[Reserve Bank of India - IT Framework for NBFC](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=10999&Mode=0#C1).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Information and Cyber Security | 3.1.h |Public Key Infrastructure (PKI)-3.1 |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## Reserve Bank of India IT Framework for Banks v2016

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - RBI ITF Banks v2016](../../../../articles/governance/policy/samples/rbi-itf-banks-2016.md).
For more information about this compliance standard, see
[RBI ITF Banks v2016 (PDF)](https://rbidocs.rbi.org.in/rdocs/notification/PDFs/NT41893F697BC1D57443BB76AFC7AB56272EB.PDF).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Advanced Real-Timethreat Defenceand Management | |Advanced Real-Timethreat Defenceand Management-13.4 |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## SWIFT CSP-CSCF v2021

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance details for SWIFT CSP-CSCF v2021](../../../../articles/governance/policy/samples/swift-csp-cscf-2021.md).
For more information about this compliance standard, see
[SWIFT CSP CSCF v2021](https://www.swift.com/myswift/customer-security-programme-csp).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Reduce Attack Surface and Vulnerabilities | 2.1 |Internal Data Flow Security |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |
|Reduce Attack Surface and Vulnerabilities | 2.4A |Back-office Data Flow Security |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |
|Reduce Attack Surface and Vulnerabilities | 2.5A |External Transmission Data Protection |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

## UK OFFICIAL and UK NHS

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - UK OFFICIAL and UK NHS](../../../../articles/governance/policy/samples/ukofficial-uknhs.md).
For more information about this compliance standard, see
[UK OFFICIAL](https://www.gov.uk/government/publications/government-security-classifications).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Asset protection and resilience |2.3 |Data at rest protection |[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |

