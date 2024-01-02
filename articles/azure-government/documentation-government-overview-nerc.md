---
title: NERC CIP standards and cloud computing
description: This article discusses implications of NERC CIP standards on cloud computing. It explores compliance assurances that cloud service providers can furnish to registered entities subject to compliance with NERC CIP standards.
author: EliotSeattle
ms.author: eliotgra
ms.topic: article
ms.service: azure-government
recommendations: false
ms.date: 05/06/2023
---

# NERC CIP standards and cloud computing

This article is intended for electric power utilities and [registered entities](https://www.nerc.com/pa/comp/Pages/Registration.aspx) considering cloud adoption for data and workloads subject to compliance with the North American Electric Reliability Corporation (NERC) [Critical Infrastructure Protection (CIP) standards](https://www.nerc.com/pa/Stand/Pages/default.aspx).

Microsoft makes two different cloud environments available to electric utilities and other registered entities: Azure and Azure Government. Both provide a multi-tenant cloud services platform that registered entities can use to deploy various solutions. A multi-tenant cloud platform implies that multiple customer applications and data are stored on the same physical hardware. Azure and Azure Government use logical isolation to segregate applications and data belonging to different customers. This approach provides the scale and economic benefits of multi-tenant cloud services while rigorously preventing customers from accessing one another's data or applications. This article addresses common security and isolation concerns pertinent to the electric power industry. It also discusses compliance considerations for data and workloads deployed on Azure or Azure Government that are subject to NERC CIP standards. For in-depth technical description of isolation approaches, see [Azure guidance for secure isolation](./azure-secure-isolation-guidance.md).

Both Azure and Azure Government have the same comprehensive security controls in place. They also share the same Microsoft commitment on the safeguarding of customer data. Azure Government provides an extra layer of protection to registered entities through contractual commitments regarding storage of customer data in the United States and limiting potential access to systems processing customer data to screened US persons. Moreover, Azure Government is only available in the United States to US-based registered entities.

Both Azure and Azure Government are suitable for registered entities deploying certain workloads subject to compliance with NERC CIP standards.

## NERC overview

The [North American Electric Reliability Corporation (NERC)](https://www.nerc.com/AboutNERC/Pages/default.aspx) is a not-for-profit regulatory authority whose mission is to ensure the reliability of the North American bulk power system. NERC is subject to oversight by the US Federal Energy Regulatory Commission (FERC) and governmental authorities in Canada. In 2006, FERC granted the Electric Reliability Organization (ERO) designation to NERC in accordance with the Energy Policy Act of 2005, as stated in the US Public Law 109-58. NERC has jurisdiction over users, owners, and operators of the bulk power system that serves nearly 400 million people in North America. For more information about NERC ERO Enterprise and NERC regional entities, see [NERC key players](https://www.nerc.com/AboutNERC/keyplayers/Pages/default.aspx).

NERC develops and enforces reliability standards known as NERC [CIP standards](https://www.nerc.com/pa/Stand/Pages/default.aspx). In the United States, FERC approved the first set of CIP standards in 2007 and has continued to do so with every new revision. In Canada, the Federal, Provincial, and Territorial Monitoring and Enforcement Subgroup (MESG) develops provincial summaries for making CIP standards enforceable in Canadian jurisdictions.

## Azure and Azure Government

Azure provides core infrastructure and virtualization technologies and services such as compute, storage, and networking that are designed with stringent controls to meet tenant separation requirements. These services also help enable secure connection to your on-premises environment. Most Azure services enable you to specify the [region](../availability-zones/az-overview.md) where your [customer data](https://www.microsoft.com/trust-center/privacy/customer-data-definitions) will be stored. Microsoft may [replicate](https://azure.microsoft.com/global-infrastructure/data-residency/) your customer data to other regions within the same [geography](https://azure.microsoft.com/global-infrastructure/geographies/) for data resiliency. However, Microsoft won't replicate your customer data outside the chosen geography, for example, United States.

Microsoft provides two different cloud environments to registered entities to deploy their applications and data: Azure and Azure Government. Azure is generally available in more than 60 regions around the world; however, for registered entities subject to NERC CIP standards, the geographies of most interest are United States and Canada.

- Azure is available to NERC registered entities in both the United States and Canada.
- [Azure Government](./documentation-government-welcome.md) is only available in the United States to US-based NERC registered entities.

For Azure regions available in the United States and Canada, and for Azure Government regions in the United States, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/#geographies). For Azure service availability in a given region, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,usgov-arizona,usgov-texas,usgov-virginia,us-central,us-east,us-east-2,us-north-central,us-south-central,us-west-central,us-west,us-west-2,us-west-3,canada-central,canada-east).

Both Azure and Azure Government have the same strong security controls in place to provide you with robust assurances about the safeguarding of your customer data and applications. They offer various services in a multi-tenant cloud environment that uses virtualization technologies to provide scale and resource utilization. They also provide superior data separation and isolation in a shared environment. This design helps ensure that you can use Azure and Azure Government efficiently and keep your data and workloads isolated from other tenants. Both cloud environments provide the same data redundancy for Azure Storage by maintaining three copies of customer data across separate fault domains in the primary region. You can also enable [geo-redundant storage](../storage/common/storage-redundancy.md), which maintains three extra copies of customer data also across separate fault domains in the [paired region](../availability-zones/cross-region-replication-azure.md). At any given time, Azure Storage maintains six healthy replicas of your customer data kept in two paired regions that are located at least 400 miles apart.

[Azure Government](./documentation-government-welcome.md) is a US government community cloud that is physically separated from the Azure cloud. It provides extra assurances regarding US government specific background screening requirements. For example, Azure Government mandates US persons verification for operations personnel with potential access to customer data. Azure Government can also support customers subject to certain [export controls laws and regulations](./documentation-government-overview-itar.md). **Both Azure and Azure Government are suitable for registered entities deploying certain workloads subject to compliance with NERC CIP standards.**

Azure and Azure Government have the broadest [compliance coverage](../compliance/index.yml) in the industry, including key independent certifications and attestations. Azure Government adds extra [compliance coverage](./documentation-government-plan-compliance.md) that is specific to US government requirements.

Nuclear electric utility customers may also be subject to the Department of Energy (DoE) / National Nuclear Security Administration (NNSA) 10 CFR Part 810 export control requirements. Among other things, **DoE 10 CFR Part 810** controls the export of unclassified nuclear technology and assistance. Paragraph 810.7 (b) states that specific DoE authorization is required for providing or transferring sensitive nuclear technology to any foreign entity.

- Export is the transfer of protected technology or information to a foreign destination or foreign person irrespective of the destination.
- Deemed export represents the transmission of protected technology and information to a foreign person inside the United States.

Azure Government is designed to meet specific controls that restrict access to information and systems to US persons. This commitment isn't applied in Azure. Therefore, customers deploying on Azure should conduct proper risk assessment to determine if extra technical measures should be deployed to secure data that shouldn't be disclosed to foreign persons. For more information, see Azure [DoE 10 CFR Part 810 compliance offering](/azure/compliance/offerings/offering-doe-10-cfr-part-810).

**Nuclear utility customers are wholly responsible for ensuring their own compliance with all applicable laws and regulations. The forgoing isn't legal advice, and you should consult your legal advisors for any questions regarding regulatory compliance.**

## Categorizing NERC CIP data and workloads

> [!NOTE]
>
> Customers operating the Bulk Electric System (BES) are wholly responsible for ensuring their own compliance with NERC CIP standards. Neither Azure nor Azure Government constitutes a Bulk Electric System (BES) or BES Cyber Asset.  

As stated by NERC, CIP standards apply to the Bulk Electric System (BES):

- Generally, 100 kV and above, but with some exceptions, primarily for radial lines.
- 20MVA and above generating units, 75MVA and above generating plants, with some exceptions for wholly behind-the-meter generation.
- Includes Control Centers that monitor and control the BES.

As stated by NERC, CIP standards don't apply to distribution, that is, non-BES, with several exceptions, primarily Under Frequency Load Shedding (UFLS), Under Voltage Load Shedding (UVLS), Blackstart Resources (generation), and Cranking Paths.

**To assess the suitability of NERC CIP standards data and workloads for cloud deployment, registered entities should consult with their own compliance officers and NERC auditors.** What follows are some key BES-related definitions that are provided by NERC in the current set of [CIP standards](https://www.nerc.com/pa/Stand/Reliability%20Standards%20Complete%20Set/RSCompleteSet.pdf) and NERC’s [Glossary of Terms](https://www.nerc.com/pa/Stand/Glossary%20of%20Terms/Glossary_of_Terms.pdf):

- **Cyber Asset:** Programmable electronic devices, including the hardware, software, and data in those devices.
- **BES Cyber Asset (BCA):** A Cyber Asset that if rendered unavailable, degraded, or misused would, within 15 minutes of its required operation, mis-operation, or non-operation, adversely impact one or more facilities, systems, or equipment, which, if destroyed, degraded, or otherwise rendered unavailable when needed, would affect the reliable operation of the Bulk Electric System. Redundancy of affected facilities, systems, and equipment shall not be considered when determining adverse impact. Each BES Cyber Asset is included in one or more BES Cyber Systems.
- **BES Cyber System (BCS):** One or more BES Cyber Assets logically grouped by a responsible entity to perform one or more reliability tasks for a functional entity.
  - Components of the BCS also include “glue” infrastructure components (for example, networking infrastructure) necessary for the system to perform its reliability tasks, such as network switches).
  - Tremendous flexibility is built into the definition – BCS could be the entire control system, or a subset based on function (HMI, server, database, FEP, and so on).
- **Electronic Security Perimeter (ESP):** The logical border surrounding a network to which BES Cyber Systems are connected using a routable protocol.
- **Protected Cyber Asset (PCA):** One or more Cyber Assets connected using a routable protocol within or on an Electronic Security Perimeter that isn't part of the highest impact BES Cyber System within the same Electronic Security Perimeter. The impact rating of Protected Cyber Assets is equal to the highest rated BES Cyber System in the same ESP.
- **Electronic Access Point (EAP):** A Cyber Asset interface on an Electronic Security Perimeter that allows routable communication between Cyber Assets outside an Electronic Security Perimeter and Cyber Assets inside an Electronic Security Perimeter.
- **Electronic Access Control or Monitoring Systems (EACMS):** Cyber Assets that perform electronic access control or electronic access monitoring of the Electronic Security Perimeters or BES Cyber Systems, including intermediate systems.
- **Control Center:** One or more facilities hosting operating personnel that monitor and control the Bulk Electric System (BES) in real time to perform the reliability tasks, including their associated data centers, of: 1) a reliability coordinator, 2) a balancing authority, 3) a transmission operator for transmission facilities at two or more locations, or 4) a generator operator for generation facilities at two or more locations.
  - Includes rooms and equipment where power system operators sit and rooms and equipment containing the “back office” servers, databases, telecommunications equipment, and so on.
  -	They may all be in the same room or be in different buildings or in different cities.

As stated by NERC, BES Cyber Assets perform real-time functions of monitoring or controlling the BES. There's heavy emphasis in the current definition on physical assets within the Electronic Security Perimeter, for example, the specific term *“in those devices”* referring to BES Cyber Assets. There are no provisions for key cloud concepts such as virtualization and multi-tenancy. To accommodate properly BES Cyber Assets and Protected Cyber Assets in a cloud environment, existing definitions in NERC CIP standards would [need to be revised](https://www.nerc.com/pa/Stand/Pages/Project%202016-02%20Modifications%20to%20CIP%20Standards.aspx). However, there are many workloads that deal with CIP sensitive data and don't fall under the 15-minute rule. More detailed discussion was provided by NERC in November 2016 at the [Emerging Technology Roundtable on Cloud Computing](https://www.nerc.com/pa/CI/Documents/roundtable%20-%20cloud%20computing%20slides%20%20(20161116).pdf).

Depending on registered entity’s implementation, some of the following workloads may not be considered a BES Cyber System (BCS) or placed within the Electronic Security Perimeter (ESP):

- Transmission asset status, management, planning, predictive maintenance
- Transmission network planning, demand forecasting, contingency analysis
- Common Information Model (CIM) modeling and geo-spatial asset location information
- Operational equipment data and Supervisory Control and Data Acquisition (SCADA) historical information system
- Artificial intelligence and advanced analytics for forecasting, maintenance, outage management
- Internet of Things (IoT) scenarios for transmission line monitoring and maintenance
- NERC CIP audit evidence, reports, records

These workloads require careful assessment that takes into consideration individual registered entity facts and circumstances.

Another class of data not subject to the 15-minute rule is the BES Cyber System Information (BCSI) if proper security controls are in place to safeguard BCSI. The following [definition](https://www.nerc.com/pa/Stand/Glossary%20of%20Terms/Glossary_of_Terms.pdf) is provided by NERC:

**BES Cyber System Information (BCSI)** is information about the BES Cyber System that could be used to gain unauthorized access or pose a security threat to the BES Cyber System. BES Cyber System Information doesn't include individual pieces of information that by themselves don't pose a threat or couldn't be used to allow unauthorized access to BES Cyber Systems, such as, but not limited to, device names, individual IP addresses without context, ESP names, or policy statements. Examples of BES Cyber System Information may include, but aren't limited to:

- Security procedures or security information about BES Cyber Systems, Physical Access Control Systems, and Electronic Access Control or Monitoring Systems that aren't publicly available and could be used to allow unauthorized access or unauthorized distribution
- Collections of network addresses
- Network topology of the BES Cyber System

The NERC Electric Reliability Organization (ERO) Enterprise [released](https://www.nerc.com/pa/comp/guidance/Pages/default.aspx) a Compliance Monitoring and Enforcement Program (CMEP) [practice guide](https://www.nerc.com/pa/comp/guidance/CMEPPracticeGuidesDL/ERO%20Enterprise%20CMEP%20Practice%20Guide%20_%20BCSI%20-%20v0.2%20CLEAN.pdf) to provide guidance to ERO Enterprise CMEP staff when assessing a registered entity’s process to authorize access to designated BCSI storage locations and any access controls the registered entity implemented.

## Compliance considerations for NERC CIP standards

The National Institute of Standards and Technology (NIST) [Special Publication (SP) 800-145](https://csrc.nist.gov/publications/detail/sp/800-145/final) defines the following cloud service models:

- Infrastructure as a Service (IaaS)
- Platform as a Service (PaaS)
- Software as a Service (SaaS)

The [shared responsibility model](../security/fundamentals/shared-responsibility.md) in the cloud allocates responsibility differently based on the cloud service model. With on-premises deployment in your own datacenter, you assume responsibility for all layers in the stack. As workloads get migrated to the cloud, Microsoft assumes progressively more responsibility depending on the cloud service model. For example, with the IaaS model, Microsoft’s responsibility ends at the virtualization (Hypervisor) layer. You're responsible for all layers above the virtualization layer, including maintaining the base operating system in guest virtual machines. With finished cloud services in the SaaS model such as Microsoft Office 365 or Dynamics 365, Microsoft assumes responsibility for extra layers in the stack. However, you're still responsible for administering the service, including granting proper access rights to end users. Irrespective of the cloud service model, you're always responsible for your customer data.

The concept of shared responsibility extends also to certification dependencies and compliance obligations. If you're a registered entity deploying applications on Azure or Azure Government, you take certification dependencies on Microsoft. You're ultimately responsible for meeting your NERC CIP compliance obligations. However, you inherit security controls from the underlying cloud platform, and can count on Microsoft for compliance assurances that are applicable to cloud service providers (CSPs).

Both Azure and Azure Government are audited extensively by independent third-party auditors. You can use some of these audits when assessing your NERC CIP compliance obligations. In discussions with NERC regulators, the following independent third-party audits were identified as relevant and potentially useful to registered entities:

- Cloud Security Alliance (CSA) Security, Trust, Assurance, and Risk (STAR) certification and attestation
- American Institute of Certified Public Accountants (AICPA) System and Organization Controls (SOC) 2 Type 2 attestation
- United States Federal Risk and Authorization Management Program (FedRAMP) authorization

Microsoft maintains all three of these compliance audits for both Azure and Azure Government and makes the respective audit documents available to registered entities.

NERC CIP compliance requirements can be addressed during a NERC audit and in line with the [shared responsibility model](../security/fundamentals/shared-responsibility.md) for cloud computing. We believe that Azure and Azure Government cloud services can be used in a manner compliant with NERC CIP standards. Microsoft is prepared to assist you with NERC audits by furnishing Azure or Azure Government audit documentation and control implementation details in support of NERC audit requirements. Moreover, Microsoft has developed a **[Cloud implementation guide for NERC audits](https://aka.ms/AzureNERCGuide)**, which is a technical how-to guidance to help you address NERC CIP compliance requirements for your Azure assets. The document contains pre-filled [Reliability Standard Audit Worksheets](https://www.nerc.com/pa/comp/Pages/Reliability-Standard-Audit-Worksheets-(RSAWs).aspx) (RSAWs) narratives that help explain how Azure controls address NERC CIP requirements. It also contains guidance to help you use Azure services to implement controls that you own. The guide is available for download to existing Azure or Azure Government customers under a non-disclosure agreement (NDA) from the Service Trust Portal (STP). You must sign in to access this document on the STP. For more information, see [Get started with the Microsoft Service Trust Portal](/microsoft-365/compliance/get-started-with-service-trust-portal).

> [!NOTE]
>
> For more information regarding Azure support for NERC CIP standards, see **[Azure NERC compliance offering](/azure/compliance/offerings/offering-nerc)**.

### CSA STAR

The [Cloud Security Alliance (CSA)](https://cloudsecurityalliance.org/) is a nonprofit organization led by a broad coalition of industry practitioners, corporations, and other important stakeholders. It's dedicated to defining best practices to help ensure a more secure cloud computing environment. CSA helps potential cloud customers make informed decisions when transitioning their IT operations to the cloud. CSA maintains the [Security, Trust, Assurance, and Risk (STAR)](https://cloudsecurityalliance.org/star/) Registry, a free, publicly accessible registry in which cloud service providers (CSPs) can publish their CSA-related assessments.

The CSA [Cloud Controls Matrix (CCM)](https://cloudsecurityalliance.org/research/cloud-controls-matrix/) is a controls framework composed of 197 control objectives covering fundamental security principles across 17 domains to help cloud customers assess the overall security risk of a CSP. The CCM maps to industry-accepted security standards, regulations, and control frameworks such as ISO 27001, ISO 27017, ISO 27018, NIST SP 800-53, PCI DSS, AICPA Trust Services Criteria, and others.

CSA STAR provides [two levels of assurance](https://cloudsecurityalliance.org/star/#levels) based on the CCM. CSA STAR Self-Assessment is the introductory offering at Level 1, which is free and open to all CSPs. Going further up the assurance stack, Level 2 of the STAR program involves third-party assessment-based certifications (for example, CSA STAR Certification and CSA STAR Attestation). **Azure and Azure Government maintain CSA STAR Certification and CSA STAR Attestation submissions in the STAR Registry, in addition to CSA STAR Self-Assessment.** For more information, see:

- [CSA STAR Level 1 Self-Assessment](/azure/compliance/offerings/offering-csa-star-self-assessment)
- [CSA STAR Level 2 Certification](/azure/compliance/offerings/offering-csa-star-certification)
- [CSA STAR Level 2 Attestation](/azure/compliance/offerings/offering-csa-star-attestation)

To download the Azure and Azure Government CSA STAR Registry submissions, see the [CSA STAR Registry for Microsoft](https://cloudsecurityalliance.org/star/registry/microsoft/).

### SOC 2 Type 2

System and Organization Controls (SOC) for Service Organizations are internal control reports created by the American Institute of Certified Public Accountants (AICPA). They're intended to examine services provided by a service organization so that end users can assess and address the risk associated with an outsourced service.

A SOC 2 Type 2 attestation is performed under:

- SSAE No. 18, Attestation Standards: Clarification and Recodification, which includes AT-C section 105, *Concepts Common to All Attestation Engagements*, and AT-C section 205, *Examination Engagements* (AICPA, Professional Standards).
- SOC 2 Reporting on an Examination of Controls at a Service Organization Relevant to Security, Availability, Processing Integrity, Confidentiality, or Privacy (AICPA Guide).
- TSP section 100, 2017 Trust Services Criteria for Security, Availability, Processing Integrity, Confidentiality, and Privacy (AICPA, 2017 Trust Services Criteria).

At the conclusion of a SOC 2 Type 2 audit, the auditor renders an opinion in a SOC 2 Type 2 report. The attestation report describes the cloud service provider’s (CSP’s) system and assesses the fairness of the CSP’s description of its controls. It also evaluates whether the CSP’s controls are designed appropriately, were in operation on a specified date, and were operating effectively over a specified time period.

**Azure and Azure Government undergo rigorous independent third-party SOC 2 Type 2 audits conducted by a reputable Certified Public Accountant (CPA) firm.** The resulting SOC 2 Type 2 reports are relevant to system Security, Availability, Processing Integrity, Confidentiality, and Privacy. In addition, these reports address the requirements in the Cloud Security Alliance (CSA) Cloud Controls Matrix (CCM) and the German Federal Office for Information Security (BSI) Cloud Computing Compliance Criteria Catalogue (C5:2020). For more information, see [Azure SOC 2 Type 2 compliance offering](/azure/compliance/offerings/offering-soc-2).

### FedRAMP

The United States Federal Risk and Authorization Management Program (FedRAMP) was established in December 2011 to provide a standardized approach for assessing, monitoring, and authorizing cloud computing products and services. Cloud service providers (CSPs) desiring to sell services to a US federal agency can take three paths to demonstrate FedRAMP compliance:

- Earn a Provisional Authorization to Operate (P-ATO) from the FedRAMP Joint Authorization Board (JAB).
- Receive an Authorization to Operate (ATO) from a federal agency.
- Work independently to develop a CSP Supplied Package that meets program requirements.

Each of these paths requires an assessment by an independent third-party assessment organization (3PAO) that is accredited by the program and a stringent technical review by the FedRAMP Program Management Office (PMO).

FedRAMP is based on the National Institute of Standards and Technology (NIST) [Special Publication (SP) 800-53](https://csrc.nist.gov/Projects/risk-management/sp800-53-controls/release-search#!/800-53) standard, augmented by FedRAMP controls and control enhancements. FedRAMP authorizations are granted at three impact levels based on the NIST [FIPS 199](https://csrc.nist.gov/publications/detail/fips/199/final) guidelines: Low, Moderate, and High. These levels rank the impact that the loss of confidentiality, integrity, or availability could have on an organization: Low (limited effect), Moderate (serious adverse effect), and High (severe or catastrophic effect). The number of controls in the corresponding baseline increases with the impact level, as shown in the following table:

| FedRAMP control baseline | Low | Moderate | High |
|--------------------------|-----|----------|------|
| Total number of controls and control enhancements | 125 | 325 | 421 |

The FedRAMP High authorization represents the highest bar for FedRAMP compliance. FedRAMP isn't a point-in-time certification or accreditation but an assessment and authorization program. It comes with provisions for continuous monitoring to ensure that deployed security controls in a cloud service offering (CSO) remain effective in an evolving threat landscape and changes that occur in the system environment. A CSP is required to furnish various evidence to demonstrate continuous compliance, including system inventory reports, vulnerability scans, plan of actions and milestones, and so on.  FedRAMP is one of the most rigorous and demanding audits that a CSP can undergo.

**Both Azure and Azure Government maintain FedRAMP High P-ATOs issued by the JAB** in addition to more than 250 Moderate and High ATOs issued by individual federal agencies for the in-scope services. For more information, see [Azure FedRAMP compliance offering](/azure/compliance/offerings/offering-fedramp).

A comparison between the FedRAMP Moderate control baseline and NERC CIP standards requirements reveals that FedRAMP Moderate control baseline encompasses all NERC CIP requirements. Microsoft has developed a **[Cloud implementation guide for NERC audits](https://aka.ms/AzureNERCGuide)** that includes control mappings between the current set of NERC CIP standards requirements and FedRAMP Moderate control baseline as documented in [NIST SP 800-53 Rev 4](https://csrc.nist.gov/Projects/risk-management/sp800-53-controls/release-search#!/800-53). The Cloud implementation guide for NERC audits contains pre-filled [Reliability Standard Audit Worksheets](https://www.nerc.com/pa/comp/Pages/Reliability-Standard-Audit-Worksheets-(RSAWs).aspx) (RSAWs) narratives that help explain how Azure controls address NERC CIP requirements. It also contains guidance to help you use Azure services to implement controls that you own. You can download the Cloud implementation guide for NERC audits under a non-disclosure agreement (NDA) from the Service Trust Portal (STP). You must sign in to access this document on the STP. For more information, see [Get started with the Microsoft Service Trust Portal](/microsoft-365/compliance/get-started-with-service-trust-portal).

There are many valid reasons why a registered entity subject to NERC CIP compliance obligations might want to use an existing FedRAMP P-ATO or ATO when assessing the security posture of a cloud services offering:

- Reinventing the established NIST SP 800-53 standard and FedRAMP assessment and authorization program would be a significant undertaking.
- FedRAMP is already in place, and it's an adopted framework for US federal government agencies when assessing cloud services.
- In the United States, FERC approves NERC CIP standards. As a US federal agency, FERC relies on FedRAMP when assessing cloud services for their own cloud computing needs. The choice of FedRAMP as a compliance path for CSPs would be consistent with the approach adopted by FERC and other US government agencies. 
- In Canada, the Federal, Provincial, and Territorial Monitoring and Enforcement Subgroup develops provincial summaries for making CIP standards enforceable in Canadian jurisdictions. The Government of Canada has aligned their [security control profile for cloud-based services](https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/cloud-services/government-canada-security-control-profile-cloud-based-it-services.html) to the FedRAMP Moderate security control profile to maximize both the interoperability of cloud services and reusability of the authorization evidence produced by CSPs.
- FedRAMP relies on an in-depth audit with mandatory provisions for continuous monitoring. It provides strong assurances to registered entities that audited controls are operating effectively.
- NERC is interested in enabling registered entities to adopt new technologies, including cloud computing. Given the number of registered entities that are subject to NERC CIP compliance obligations, it would be infeasible for a CSP to accommodate audits initiated by individual entities. Instead, relying on an existing FedRAMP authorization provides a scalable and efficient approach for addressing NERC audit requirements for CSPs.

The preceding rationale pertains only to cloud services providers. It doesn't alter the relationship between NERC and [registered entities](https://www.nerc.com/pa/comp/pages/registration.aspx). Existing NERC CIP compliance obligations would remain unchanged, and they would still be the responsibility of registered entities.

The NERC ERO Enterprise [released](https://www.nerc.com/pa/comp/guidance/Pages/default.aspx) a Compliance Monitoring and Enforcement Program (CMEP) [practice guide](https://www.nerc.com/pa/comp/guidance/CMEPPracticeGuidesDL/ERO%20Enterprise%20CMEP%20Practice%20Guide%20_%20BCSI%20-%20v0.2%20CLEAN.pdf) to provide guidance to ERO Enterprise CMEP staff when assessing a registered entity’s process to authorize access to designated BCSI storage locations and any access controls the registered entity implemented. Moreover, NERC reviewed Azure control implementation details and FedRAMP audit evidence related to NERC CIP-004-6 and CIP-011-2 standards that are applicable to BCSI. Based on the ERO Enterprise issued CMEP practice guide and reviewed FedRAMP controls to ensure registered entities encrypt their data, no extra guidance or clarification is needed to deploy BCSI and associated workloads in the cloud. However, registered entities are ultimately responsible for compliance with NERC CIP standards according to their own facts and circumstances. Registered entities should review the [Cloud implementation guide for NERC audits](https://aka.ms/AzureNERCGuide) for help with documenting their processes and evidence used to authorize electronic access to BCSI storage locations, including encryption key management used for BCSI encryption in Azure and Azure Government.

## Restrictions on insider access

Microsoft takes strong measures to protect [customer data](https://www.microsoft.com/trust-center/privacy/customer-data-definitions) from inappropriate access or use by unauthorized persons. Access to customer data isn't needed to operate Azure and Azure Government, and Microsoft engineers don't have default access to customer data in the cloud. Instead, they're granted access, under management oversight, only when necessary. Customer data includes data subject to NERC CIP standards protection. For more information, see [Restrictions on insider access](./documentation-government-plan-security.md#restrictions-on-insider-access)

## Background screening

Background screening requirements are documented in NERC CIP-004-6 under:

- R2: formal training
- R3: personnel risk assessments
- R4: access authorization

Requirements are enforced on support and operations personnel with access to NERC CIP protected assets and data. Registered entities have written these requirements into their policies under the goals provided by NERC CIP standards.

Some registered entities may have written requirements for restriction on data access to US citizens into their policies as well. Nuclear electric utility companies may additionally be subject to export control requirements mandated by the Department of Energy (DoE) under [10 CFR Part 810](/azure/compliance/offerings/offering-doe-10-cfr-part-810) and administered by the National Nuclear Security Administration (NNSA). Among other things, these requirements are in place to prevent the export of unclassified nuclear technology and assistance to foreign persons. 

All Azure and Azure Government employees in the United States are subject to Microsoft background checks. Personnel with the ability to access customer data for troubleshooting purposes in Azure Government are additionally subject to the verification of US persons and extra screening requirements where appropriate. For more information, see [Screening](./documentation-government-plan-security.md#screening).

Information security training and awareness are provided to all Azure and Azure Government engineering personnel on an ongoing basis. The purpose of this training is to educate engineering personnel about applicable policies, standards, and information security practices. All engineering staff is required to complete a computer-based training module when they join the team. In addition, all staff participates in mandatory security, compliance, and privacy training administered annually. Training is also covered by controls in many compliance assurances applicable to Azure and Azure Government, including CSA STAR certification, SOC 2 Type 2 attestation, and FedRAMP authorization.

## Logical isolation considerations

A multi-tenant cloud platform implies that multiple customer applications and data are stored on the same physical hardware. Azure and Azure Government use logical isolation to segregate applications and data belonging to different customers. This approach provides the scale and economic benefits of multi-tenant cloud services while rigorously enforcing controls designed to keep customers from accessing one another's data or applications. For more information, see [Azure guidance for secure isolation](./azure-secure-isolation-guidance.md). If you're migrating from traditional on-premises physically isolated infrastructure to the cloud, see [Logical isolation considerations](./azure-secure-isolation-guidance.md#logical-isolation-considerations).

### Identity and access

Microsoft Entra ID is an identity repository and cloud service that provides authentication, authorization, and access control for an organization’s users, groups, and objects. Microsoft Entra ID can be used as a standalone cloud directory or as an integrated solution with existing on-premises Active Directory to enable key enterprise features such as directory synchronization and single sign-on. The separation of the accounts used to administer cloud applications is critical to achieving logical isolation. Account isolation in Azure is achieved using Microsoft Entra ID and its capabilities to support granular Azure role-based access control (RBAC). Microsoft Entra ID implements extensive data protection features, including tenant isolation and access control, data operational considerations for insider access, and more.

For more information, see [Identity-based isolation](./azure-secure-isolation-guidance.md#identity-based-isolation).

### Data encryption key management

Azure services rely on [FIPS 140](/azure/compliance/offerings/offering-fips-140-2) validated cryptographic modules in the underlying operating system. With Azure services, you have a [wide range of options for encrypting data](../security/fundamentals/encryption-overview.md) in transit and at rest. You can manage data encryption keys using [Azure Key Vault](../key-vault/general/overview.md), which can store encryption keys in FIPS 140 validated hardware security modules (HSMs). You can use [customer-managed keys](../security/fundamentals/encryption-models.md) (CMK) with Azure Key Vault to have sole control over encryption keys stored in HSMs. Keys generated inside the Azure Key Vault HSMs aren't exportable – there can be no clear-text version of the key outside the HSMs. This binding is enforced by the underlying HSM. Moreover, Azure Key Vault is designed, deployed, and operated such that Microsoft and its agents don't see or extract your cryptographic keys.

You're responsible for choosing the Azure regions for deploying your applications and data. Moreover, you're responsible for designing your applications to use end-to-end data encryption that meets NERC CIP standards requirements. Microsoft doesn't inspect or approve your Azure applications.

For more information, see [Data encryption key management](./azure-secure-isolation-guidance.md#data-encryption-key-management).

### Compute isolation

Microsoft Azure compute platform is based on machine virtualization. This approach means that your code – whether it’s deployed in a PaaS worker role or an IaaS virtual machine – executes in a virtual machine hosted by a Windows Server Hyper-V hypervisor. Azure provides extensive support for tenant separation using logical isolation. In addition to robust logical compute isolation available by design to all Azure tenants, you can also use Azure Dedicated Host or Isolated Virtual Machines to achieve physical compute isolation. With this approach, your virtual machines are deployed on physical hardware dedicated to you.

For more information, see [Compute isolation](./azure-secure-isolation-guidance.md#compute-isolation).

### Networking isolation

The logical isolation of tenant infrastructure in a public multi-tenant cloud is fundamental to maintaining security. The overarching principle for a virtualized solution is to allow only connections and communications that are necessary for that virtualized solution to operate, blocking all other ports and connections by default. Azure Virtual Network (VNet) helps ensure that your private network traffic is logically isolated from traffic belonging to other customers. Virtual Machines (VMs) in one VNet can't communicate directly with VMs in a different VNet even if both VNets are created by the same customer. Networking isolation ensures that communication between your VMs remains private within a VNet. You have multiple options to connect your VNets depending on your connectivity options, including bandwidth, latency, and encryption requirements.

Azure provides many options for encrypting data in transit. Data encryption in transit isolates your network traffic from other traffic and helps protect data from interception.

For more information, see [Networking isolation](./azure-secure-isolation-guidance.md#networking-isolation).

### Storage isolation

Microsoft Azure separates your VM-based computation resources from storage as part of its fundamental design. The separation allows computation and storage to scale independently, making it easier to provide multi-tenancy and isolation. Therefore, Azure Storage runs on separate hardware with no network connectivity to Azure Compute except logically.

Azure provides extensive options for data encryption at rest to help you safeguard your data and meet your NERC CIP standards compliance needs using both Microsoft-managed encryption keys and customer-managed encryption keys. This process relies on multiple encryption keys and services such as Azure Key Vault and Microsoft Entra ID to ensure secure key access and centralized key management.

For more information, see [Storage isolation](./azure-secure-isolation-guidance.md#storage-isolation).

## Summary

Microsoft Azure and Azure Government are multi-tenant cloud services platforms available to electric power utilities and other registered entities. A multi-tenant cloud platform implies that multiple customer applications and data are stored on the same physical hardware. Azure and Azure Government use logical isolation to segregate applications and data belonging to different customers. This approach provides the scale and economic benefits of multi-tenant cloud services while rigorously enforcing controls designed to keep customers from accessing one another's data or applications. The following table summarizes key considerations for cloud adoption. Both Azure and Azure Government are suitable for registered entities deploying certain workloads subject to compliance with NERC CIP standards.

| Requirement | Azure | Azure Government |
|-------------|-------|------------------|
| Data subject to compliance with NERC CIP standards | &#x2705; | &#x2705; |
| Data must reside in continental United States | &#x2705; | &#x2705; |
| CSA STAR Certification and CSA STAR Attestation | &#x2705; | &#x2705; |
| AICPA SOC 2 Type 2 Attestation | &#x2705; | &#x2705; |
| FedRAMP High authorization | &#x2705; | &#x2705; |
| Microsoft cloud background check | &#x2705; | &#x2705; |
| Require US persons for operations personnel | &#10060; | &#x2705; |

Current NERC CIP definitions place heavy emphasis on physical assets within the Electronic Security Perimeter (for example, the specific term *“in those devices”* referring to BES Cyber Assets), and make no provisions for key cloud concepts such as virtualization and multi-tenancy. To properly accommodate BES Cyber Assets and Protected Cyber Assets in cloud computing, existing definitions in NERC CIP standards would [need to be revised](https://www.nerc.com/pa/Stand/Pages/Project%202016-02%20Modifications%20to%20CIP%20Standards.aspx). However, there are many workloads that deal with CIP sensitive data and don't fall under the 15-minute rule pertaining to BES Cyber Asset impact on the Bulk Electric System reliable operation. One such broad category of data includes BES Cyber System Information (BCSI) if proper security controls are in place to safeguard BCSI.

The NERC ERO Enterprise [released](https://www.nerc.com/pa/comp/guidance/Pages/default.aspx) a Compliance Monitoring and Enforcement Program (CMEP) [practice guide](https://www.nerc.com/pa/comp/guidance/CMEPPracticeGuidesDL/ERO%20Enterprise%20CMEP%20Practice%20Guide%20_%20BCSI%20-%20v0.2%20CLEAN.pdf) to provide guidance to ERO Enterprise CMEP staff when assessing a registered entity’s process to authorize access to designated BCSI storage locations and any access controls the registered entity implemented. Moreover, NERC reviewed Azure control implementation details and FedRAMP audit evidence related to NERC CIP-004-6 and CIP-011-2 standards that are applicable to BCSI. Based on the ERO Enterprise issued CMEP practice guide and reviewed FedRAMP controls to ensure registered entities encrypt their data, no extra guidance or clarification is needed to deploy BCSI and associated workloads in the cloud. However, registered entities are ultimately responsible for compliance with NERC CIP standards according to their own facts and circumstances. Registered entities should review the [Cloud implementation guide for NERC audits](https://aka.ms/AzureNERCGuide) for help with documenting their processes and evidence used to authorize electronic access to BCSI storage locations, including encryption key management used for BCSI encryption in Azure and Azure Government.

Both Azure and Azure Government have comprehensive security controls and compliance coverage to provide you with robust assurances about the safeguarding of your customer data and applications. Azure Government is a US government community cloud that is physically separated from the Azure cloud. It provides an extra layer of protection to registered entities through contractual commitments regarding storage of customer data in the United States and limiting potential access to systems processing customer data to screened US persons. Moreover, Azure Government is only available in the United States to US-based registered entities. Registered entities in the US are eligible for Azure Government onboarding by stating “NERC Compliance Entity” in their submission.

Nuclear electric utilities may also be subject to the DoE 10 CFR Part 810 export control requirements on unclassified nuclear technology and assistance. Azure Government is designed to meet specific controls regarding access to information and systems by US persons. This commitment isn't applied in Azure so customers deploying on Azure should conduct proper risk assessment to determine if extra technical measures should be deployed to secure data that shouldn't be disclosed to foreign persons.

Registered entities subject to NERC CIP compliance obligations can use existing audits applicable to cloud services when assessing the security posture of a cloud services offering, including the Cloud Security Alliance STAR program, SOC 2 Type 2 attestation, and FedRAMP authorization. For example, FedRAMP relies on an in-depth audit with mandatory provisions for continuous monitoring. It provides strong assurances to registered entities that audited controls are operating effectively. A comparison between the FedRAMP Moderate control baseline and NERC CIP standards requirements reveals that FedRAMP Moderate control baseline encompasses all NERC CIP standards requirements. FedRAMP doesn't replace NERC CIP standards and it doesn't alter the responsibility that registered entities have for meeting their NERC CIP compliance obligations. Rather, a cloud service provider’s existing FedRAMP authorization can deliver assurances that NIST-based control evidence mapped to NERC CIP standards requirements for which cloud service provider is responsible has already been examined by an accredited FedRAMP auditor.

If you're a registered entity contemplating a NERC audit, you should review Microsoft’s **[Cloud implementation guide for NERC audits](https://aka.ms/AzureNERCGuide)**, which provides detailed technical how-to guidance to help you address NERC CIP compliance requirements for your Azure assets. It contains control mappings between the current set of NERC CIP standards and FedRAMP Moderate control baseline as documented in NIST SP 800-53 Rev 4. Moreover, a complete set of Reliability Standard Audit Worksheets (RSAWs) narratives with Azure control implementation details is provided to explain how Microsoft addresses NERC CIP standards requirements for controls that are part of cloud service provider’s responsibility. Also provided is guidance to help you use Azure services to implement controls that you own. The guide is available for download to existing Azure or Azure Government customers under a non-disclosure agreement (NDA) from the Service Trust Portal (STP). You must sign in to access this document on the STP. For more information, see [Get started with the Microsoft Service Trust Portal](/microsoft-365/compliance/get-started-with-service-trust-portal).

If you're a registered entities subject to compliance with NERC CIP standards, you can also engage Microsoft for audit assistance, including furnishing Azure or Azure Government audit documentation and control implementation details in support of NERC audit requirements. Contact your Microsoft account team for assistance. You're ultimately responsible for meeting your NERC CIP compliance obligations.

## Next steps

- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [Azure guidance for secure isolation](./azure-secure-isolation-guidance.md)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [Azure Government security](./documentation-government-plan-security.md)
- [Azure compliance](../compliance/index.yml)
- [Azure CSA STAR Certification](/azure/compliance/offerings/offering-csa-star-certification)
- [Azure CSA STAR Attestation](/azure/compliance/offerings/offering-csa-star-attestation)
- [Azure SOC 2 Type 2 compliance offering](/azure/compliance/offerings/offering-soc-2)
- [Azure FedRAMP compliance offering](/azure/compliance/offerings/offering-fedramp)
- [NIST SP 800-53](https://csrc.nist.gov/Projects/risk-management/sp800-53-controls/release-search#!/800-53) *Security and Privacy Controls for Information Systems and Organizations*
- [North American Electric Reliability Corporation](https://www.nerc.com/) (NERC)
- NERC [Critical Infrastructure Protection (CIP) standards](https://www.nerc.com/pa/Stand/Pages/default.aspx)
- NERC [compliance guidance](https://www.nerc.com/pa/comp/guidance/)
- NERC [Glossary of Terms](https://www.nerc.com/pa/Stand/Glossary%20of%20Terms/Glossary_of_Terms.pdf)
- NERC [registered entities](https://www.nerc.com/pa/comp/Pages/Registration.aspx)
