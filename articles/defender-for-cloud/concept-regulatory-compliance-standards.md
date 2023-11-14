---
title: Regulatory compliance standards in Microsoft Defender for Cloud
description: Learn about regulatory compliance standards in Microsoft Defender for Cloud
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 01/10/2023
---

# Regulatory compliance standards

Microsoft Defender for Cloud streamlines the regulatory compliance process by helping you to identify issues that are preventing you from meeting a particular compliance standard, or achieving compliance certification.

Industry standards, regulatory standards, and benchmarks are represented in Defender for Cloud as [security standards](security-policy-concept.md), and appear in the **Regulatory compliance** dashboard.


## Compliance controls

Each security standard consists of multiple compliance controls, which are logical groups of related security recommendations.

Defender for Cloud continually assesses the environment-in-scope against any compliance controls that can be automatically assessed. Based on assessments, it shows resources as being compliant or non-compliant with controls.

> [!Note]
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

- **Azure**: The [Microsoft Cloud Security Benchmark (MCSB)](concept-regulatory-compliance.md) is enabled for Azure subscriptions.
- **AWS**: AWS accounts get the [AWS Foundational Security Best Practices standard](https://docs.aws.amazon.com/securityhub/latest/userguide/fsbp-standard.html) assigned. This standard contains AWS-specific guidelines for security and compliance best practices based on common compliance frameworks. AWS accounts also have MCSB assigned by default.
- **GCP**: GCP projects get the GCP Default standard assigned.



## Next steps

- [Assign regulatory compliance standards](update-regulatory-compliance-packages.md)
- [Improve regulatory compliance](regulatory-compliance-dashboard.md)
