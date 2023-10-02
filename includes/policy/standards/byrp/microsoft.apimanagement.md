---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 09/19/2023
ms.author: davidsmatlak
ms.custom: generated
---

## FedRAMP High

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - FedRAMP High](../../../../articles/governance/policy/samples/fedramp-high.md).
For more information about this compliance standard, see
[FedRAMP High](https://www.fedramp.gov/).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Access Control |AC-4 |Information Flow Enforcement |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|System And Communications Protection |SC-7 |Boundary Protection |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|System And Communications Protection |SC-7 (3) |Access Points |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |

## FedRAMP Moderate

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - FedRAMP Moderate](../../../../articles/governance/policy/samples/fedramp-moderate.md).
For more information about this compliance standard, see
[FedRAMP Moderate](https://www.fedramp.gov/).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Access Control |AC-4 |Information Flow Enforcement |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|System And Communications Protection |SC-7 |Boundary Protection |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|System And Communications Protection |SC-7 (3) |Access Points |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |

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
|Network Security |NS-2 |Secure cloud services with network controls |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|Network Security |NS-2 |Secure cloud services with network controls |[API Management should disable public network access to the service configuration endpoints](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdf73bd95-24da-4a4f-96b9-4e8b94b402bd) |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_PublicEndpoint_AuditIfNotExist.json) |
|Identity Management |IM-4 |Authenticate server and services |[[Preview]: API endpoints in Azure API Management should be authenticated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8ac833bd-f505-48d5-887e-c993a1d3eea0) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_APIMApiEndpointsShouldbeAuthenticated_AuditIfNotExists.json) |
|Identity Management |IM-4 |Authenticate server and services |[API Management calls to API backends should be authenticated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc15dcc82-b93c-4dcb-9332-fbf121685b54) |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_BackendAuth_AuditDeny.json) |
|Identity Management |IM-4 |Authenticate server and services |[API Management calls to API backends should not bypass certificate thumbprint or name validation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F92bb331d-ac71-416a-8c91-02f2cb734ce4) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_BackendCertificateChecks_AuditDeny.json) |
|Identity Management |IM-8 |Restrict the exposure of credential and secrets |[API Management minimum API version should be set to 2019-12-01 or higher](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F549814b6-3212-4203-bdc8-1548d342fb67) |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_MinimumApiVersion_AuditDeny.json) |
|Identity Management |IM-8 |Restrict the exposure of credential and secrets |[API Management secret named values should be stored in Azure Key Vault](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff1cc7827-022c-473e-836e-5a51cae0b249) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_NamedValueSecretsInKV_AuditDeny.json) |
|Privileged Access |PA-7 |Follow just enough administration (least privilege) principle |[API Management subscriptions should not be scoped to all APIs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3aa03346-d8c5-4994-a5bc-7652c2a2aef1) |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_AllApiSubscription_AuditDeny.json) |
|Data Protection |DP-3 |Encrypt sensitive data in transit |[API Management APIs should use only encrypted protocols](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fee7495e7-3ba7-40b6-bfee-c29e22cc75d4) |[2.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_HTTPEnabled_AuditDeny.json) |
|Data Protection |DP-6 |Use a secure key management process |[API Management secret named values should be stored in Azure Key Vault](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff1cc7827-022c-473e-836e-5a51cae0b249) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_NamedValueSecretsInKV_AuditDeny.json) |
|Asset Management |AM-3 |Ensure security of asset lifecycle management |[[Preview]: API endpoints that are unused should be disabled and removed from the Azure API Management service](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc8acafaf-3d23-44d1-9624-978ef0f8652c) |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_APIMUnusedApiEndpointsShouldbeRemoved_AuditIfNotExists.json) |
|Posture and Vulnerability Management |PV-2 |Audit and enforce secure configurations |[API Management direct management endpoint should not be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb741306c-968e-4b67-b916-5675e5c709f4) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_DirectManagementAPIEnabled_AuditDeny.json) |
|Posture and Vulnerability Management |PV-2 |Audit and enforce secure configurations |[API Management minimum API version should be set to 2019-12-01 or higher](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F549814b6-3212-4203-bdc8-1548d342fb67) |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_MinimumApiVersion_AuditDeny.json) |

## New Zealand ISM Restricted

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - New Zealand ISM Restricted](../../../../articles/governance/policy/samples/new-zealand-ism.md).
For more information about this compliance standard, see
[New Zealand ISM Restricted](https://www.nzism.gcsb.govt.nz/ism-document).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Infrastructure |INF-9 |10.8.35 Security Architecture |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |

## NIST SP 800-171 R2

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - NIST SP 800-171 R2](../../../../articles/governance/policy/samples/nist-sp-800-171-r2.md).
For more information about this compliance standard, see
[NIST SP 800-171 R2](https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Access Control |3.1.3 |Control the flow of CUI in accordance with approved authorizations. |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|System and Communications Protection |3.13.1 |Monitor, control, and protect communications (i.e., information transmitted or received by organizational systems) at the external boundaries and key internal boundaries of organizational systems. |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|System and Communications Protection |3.13.2 |Employ architectural designs, software development techniques, and systems engineering principles that promote effective information security within organizational systems. |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|System and Communications Protection |3.13.5 |Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks. |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |

## NIST SP 800-53 Rev. 4

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - NIST SP 800-53 Rev. 4](../../../../articles/governance/policy/samples/nist-sp-800-53-r4.md).
For more information about this compliance standard, see
[NIST SP 800-53 Rev. 4](https://nvd.nist.gov/800-53).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Access Control |AC-4 |Information Flow Enforcement |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|System And Communications Protection |SC-7 |Boundary Protection |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|System And Communications Protection |SC-7 (3) |Access Points |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |

## NIST SP 800-53 Rev. 5

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - NIST SP 800-53 Rev. 5](../../../../articles/governance/policy/samples/nist-sp-800-53-r5.md).
For more information about this compliance standard, see
[NIST SP 800-53 Rev. 5](https://nvd.nist.gov/800-53).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Access Control |AC-4 |Information Flow Enforcement |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|System and Communications Protection |SC-7 |Boundary Protection |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|System and Communications Protection |SC-7 (3) |Access Points |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |

## NZ ISM Restricted v3.5

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - NZ ISM Restricted v3.5](../../../../articles/governance/policy/samples/nz-ism-restricted-3-5.md).
For more information about this compliance standard, see
[NZ ISM Restricted v3.5](https://www.nzism.gcsb.govt.nz/ism-document).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Infrastructure | INF-9 |10.8.35 Security Architecture |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |

## Reserve Bank of India IT Framework for Banks v2016

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - RBI ITF Banks v2016](../../../../articles/governance/policy/samples/rbi-itf-banks-2016.md).
For more information about this compliance standard, see
[RBI ITF Banks v2016 (PDF)](https://rbidocs.rbi.org.in/rdocs/notification/PDFs/NT41893F697BC1D57443BB76AFC7AB56272EB.PDF).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Patch/Vulnerability & Change Management | |Patch/Vulnerability & Change Management-7.7 |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|Patch/Vulnerability & Change Management | |Patch/Vulnerability & Change Management-7.7 |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
|Anti-Phishing | |Anti-Phishing-14.1 |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |

## RMIT Malaysia

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - RMIT Malaysia](../../../../articles/governance/policy/samples/rmit-malaysia.md).
For more information about this compliance standard, see
[RMIT Malaysia](https://www.bnm.gov.my/documents/20124/963937/Risk+Management+in+Technology+(RMiT).pdf/810b088e-6f4f-aa35-b603-1208ace33619?t=1592866162078).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|Network Resilience | 10.33 |Network Resilience - 10.33 |[API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef619a2c-cc4d-4d03-b2ba-8c94a834d85b) |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_VNETEnabled_Audit.json) |
