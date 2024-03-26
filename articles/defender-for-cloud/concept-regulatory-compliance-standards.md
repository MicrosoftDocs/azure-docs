---
title: Regulatory compliance in Defender for Cloud
description: Learn about regulatory compliance standards and certification in Microsoft Defender for Cloud
author: dcurwin
ms.author: dacurwin
ms.topic: concept-article
ms.date: 03/26/2024
#customer intent: As a cloud security professional, I want to understand how Defender for Cloud helps me meet regulatory compliance standards, so that I can ensure my organization is compliant with industry standards and regulations.
---

# Regulatory compliance standards in Microsoft Defender for Cloud

Microsoft Defender for Cloud streamlines the regulatory compliance process by helping you to identify issues that are preventing you from meeting a particular compliance standard, or achieving compliance certification.

Industry standards, regulatory standards, and benchmarks are represented in Defender for Cloud as [security standards](security-policy-concept.md), and appear in the **Regulatory compliance** dashboard.

## Compliance controls

Each security standard consists of multiple compliance controls, which are logical groups of related security recommendations.

Defender for Cloud continually assesses the environment-in-scope against any compliance controls that can be automatically assessed. Based on assessments, it shows resources as being compliant or non-compliant with controls.

> [!NOTE]
> It's important to note that if standards have compliance controls that can't be automatically assessed, Defender for Cloud isn't able to decide whether a resource complies with the control. In this case, the control will show as greyed out.

## Viewing compliance standards

The **Regulatory compliance** dashboard provides an interactive overview of compliance state.

:::image type="content" source="media/concepts-regulatory-compliance-standards/compliance-standards.png" alt-text="Screenshot showing the regulatory compliance dashboard." lightbox="media/concepts-regulatory-compliance-standards/compliance-standards.png":::

In the dashboard you can:

- Get a summary of standards controls that have been passed.
- Get of summary of standards that have the lowest pass rate for resources.
- Review standards that are applied within the selected scope.
- Review assessments for compliance controls within each applied standard.
- Get a summary report for a specific standard.
- Manage compliance policies to see the standards assigned to a specific scope.
- Run a query to create a custom compliance report
- [Create a "compliance over time workbook"](custom-dashboards-azure-workbooks.md) to track compliance status over time.
- Download audit reports.
- Review compliance offerings for Microsoft and third-party audits.

## Compliance standard details

For each compliance standard you can view:

- Scope for the standard.
- Each standard broken down into groups of controls and subcontrols.
- When you apply a standard to a scope, you can see a summary of compliance assessment for resources within the scope, for each standard control.
- The status of the assessments reflects compliance with the standard. There are three states:
  - A green circle indicates that resources in scope are compliant with the control.
  - A red circle indicates that resources are not compliant with the control.
  - Unavailable controls are those that can't be automatically assessed and thus Defender for Cloud is unable to access whether resources are compliant.

You can drill down into controls to get information about resources that have passed/failed assessments, and for remediation steps.

## Default compliance standards

By default, when you enable Defender for Cloud, the following standards are enabled:

- For **Azure**: [Microsoft Cloud Security Benchmark (MCSB)](concept-regulatory-compliance.md).
- For **AWS**: [Microsoft Cloud Security Benchmark (MCSB)](concept-regulatory-compliance.md) and [AWS Foundational Security Best Practices standard](https://docs.aws.amazon.com/securityhub/latest/userguide/fsbp-standard.html).
- For **GCP**: [Microsoft Cloud Security Benchmark (MCSB)](concept-regulatory-compliance.md) and **GCP Default**.

## Available regulatory standards

The following regulatory standards are available in Defender for Cloud:

| Standards for Azure subscriptions | Standards for AWS accounts | Standards for GCP projects |
|--|--|--|
| PCI DSS v4 | CIS AWS Foundations | CIS GCP Foundations |
| SOC 2 Type 2 | CIS AWS Foundations | PCI DSS |
| ISO 27001:2013 | PCI DSS | NIST 800-53 |
| CIS Azure Foundations | AWS Foundational Security Best Practices | ISO 27001 |
| NIST SP 800-53 R4 | AWS Well-Architected Framework | Brazilian General Personal Data Protection Law (LGPD) |
| NIST SP 800-53 R5 | Brazilian General Personal Data Protection Law (LGPD) | California Consumer Privacy Act (CCPA) |
| NIST SP 800 171 R2 | California Consumer Privacy Act (CCPA) | CIS Controls |
| CMMC Level 3 | CRI Profile | CIS Google Cloud Platform Foundation Benchmark |
| FedRAMP H | CSA Cloud Controls Matrix (CCM)  | CIS Google Kubernetes Engine (GKE) Benchmark |
| FedRAMP M | GDPR | CIS Google Kubernetes Engine (GKE) Benchmark |
| HIPAA/HITRUST | ISO/IEC 27001 | CRI Profile |
| SWIFT CSP CSCF | ISO/IEC 27002 | CSA Cloud Controls Matrix (CCM) |
| SWIFT CSP CSCF | NIST Cybersecurity Framework (CSF) | Cybersecurity Maturity Model Certification (CMMC) |
| UK OFFICIAL and UK NHS | NIST SP 800-172 | FFIEC Cybersecurity Assessment Tool (CAT) |
| Canada Federal PBMM | PCI-DSS | GDPR |
| New Zealand ISM Restricted |  | ISO/IEC 27001 |
| New Zealand ISM Restricted |  | ISO/IEC 27002 |
| Australian Government ISM Protected |  | ISO/IEC 27017 |
| RMIT Malaysia |  | NIST Cybersecurity Framework (CSF) |
| Brazilian General Personal Data Protection Law (LGPD) |  | NIST SP 800-171 |
| California Consumer Privacy Act (CCPA)  |  | NIST SP 800-172 |
| CIS Controls | | PCI-DSS |
| CIS Google Cloud Platform Foundation Benchmark | | Sarbanes Oxley Act (SOX)|
| CIS Google Kubernetes Engine (GKE) Benchmark | | SOC 2 |
| CIS Google Kubernetes Engine (GKE) Benchmark | | |
| CRI Profile | | |
| CSA Cloud Controls Matrix (CCM) | | |
| Cybersecurity Maturity Model Certification (CMMC) | | |
| FFIEC Cybersecurity Assessment Tool (CAT) | | |
| GDPR | | |
| ISO/IEC 27001 | | |
| ISO/IEC 27002 | | |
| ISO/IEC 27017 | | | 
| NIST Cybersecurity Framework (CSF) | | |
| NIST SP 800-171 | | |
| NIST SP 800-172 | | |
| PCI-DSS | | |
| Sarbanes Oxley Act (SOX) | | |
| SOC 2 | | |

## Next step

> [!div class="nextstepaction"]
> [Assign regulatory compliance standards](update-regulatory-compliance-packages.md)
