---
title: Security policies, standards, and recommendations in Microsoft Defender for Cloud 
description: Learn about security policies, standards, and recommendations in Microsoft Defender for Cloud.
ms.topic: conceptual
ms.date: 11/27/2023
---

# Security policies in Defender for Cloud

Security policies in Microsoft Defender for Cloud consist of security standards and recommendations that help to improve your cloud security posture.

- **Security standards**: Security standards define rules, compliance conditions for those rules, and actions (effects) to be taken if conditions aren't met.
- **Security recommendations**: Resources and workloads are assessed against the security standards enabled in your Azure subscriptions, AWS accounts, and GCP projects. Based on those assessments, security recommendations provide practical steps to remediate security issues, and improve security posture.


## Security standards

Security standards in Defender for Cloud come from a couple of sources:

- **Microsoft cloud security benchmark (MCSB)**. The MCSB standard is applied by default when you onboard Defender for Cloud to a management group or subscription. Your [secure score](secure-score-security-controls.md) is based on assessment against some MCSB recommendations. [Learn more](concept-regulatory-compliance.md).
- **Regulatory compliance standards**. In addition to MCSB, when you enable one or more [Defender for Cloud plans](defender-for-cloud-introduction.md) you can add standards from a wide range of predefined regulatory compliance programs. [Learn more](regulatory-compliance-dashboard.md).
- **Custom standards**. You can create custom security standards in Defender for Cloud, and add built-in and custom recommendations to those custom standards as needed.

Security standards in Defender for Cloud are based on [Azure Policy](../governance/policy/overview.md) [initiatives](../governance/policy/concepts/initiative-definition-structure.md) or on the Defender for Cloud native platform. At the time of writing (November 2023) AWS and GCP standards are Defender for Cloud platform-based, and Azure standards are currently based on Azure Policy.

Security standards in Defender for Cloud simplify the complexity of Azure Policy. In most cases, you can work directly with security standards and recommendations in the Defender for Cloud portal, without needing to directly configure Azure Policy.

## Working with security standards

Here's what you can do with security standards in Defender for Cloud:


- **Modify the built-in MCSB for the subscription** - When you enable Defender for Cloud, the MCSB is automatically assigned to all Defender for Cloud registered subscriptions.

- **Add regulatory compliance standards** - If you have one or more paid plans enabled, you can assign built-in compliance standards against which to assess your Azure, AWS, and GCP resources. [Learn more about assigning regulatory standards](update-regulatory-compliance-packages.md)

- **Add custom standards** - If you have at least one paid Defender plan enabled, you can define new [Azure](custom-security-policies.md), [AWS and GCP](create-custom-recommendations.md) standards in the Defender for Cloud portal, and add recommendations to them.


## Custom standards

You can create custom standards for Azure, AWS, and GCP resources.

- Custom standards are displayed alongside built-in standards in the **Regulatory compliance** dashboard. 
- Recommendations derived from assessments against custom standards appear together with recommendations from built-in standards.
- Custom standards can contain built-in and custom recommendations.


## Security recommendations

Defender for Cloud periodically and continuously analyzes and assesses the security state of protected resources against  defined security standards, to identify potential security misconfigurations and weaknesses. Based on assessment findings, recommendations provide information about issues, and suggest remediation actions.

Each recommendation provides you with the following information:

- A short description of the issue
- The remediation steps to carry out in order to implement the recommendation
- The affected resources
- The risk level
- Risk factors
- Attack paths

Every recommendation in Defender for Cloud has an associated risk-level that represents how exploitable and impactful the security issue is in your environment. The risk assessment engine takes into account factors such as internet exposure, sensitivity of data, lateral movement possibilities, attack paths remediation, and more. Recommendations can be prioritized, based on their risk levels.

> [!NOTE]
> Currently, [risk prioritization](how-to-manage-attack-path.md#features-of-the-attack-path-overview-page) is in public preview and therefore doesn't affect the secure score.


### Example

- The MCSB standard is an Azure Policy initiative that includes multiple compliance controls. One of these controls is "Storage accounts should restrict network access using virtual network rules."
- As Defender for Cloud continually assesses and finds resources that don't satisfy this control, it marks the resources as non-compliant and triggers a recommendation. In this case, guidance is to harden Azure Storage accounts that aren't protected with virtual network rules.


## Custom recommendation (Azure)

To create custom recommendations for Azure subscriptions, you currently need to use Azure Policy. 

You create a policy definition, assign it to a policy initiative, and merge that initiative and policy into Defender for Cloud. [Learn more](custom-security-policies.md).

## Custom recommendations (AWS/GCP)

- To create custom recommendations for AWS/GCP resources, you must have the [Defender CSPM plan](concept-cloud-security-posture-management.md) enabled.
- Custom standards act as a logical grouping for custom recommendations. Custom recommendations can be assigned to one or more custom standards.
- In custom recommendations, you specify a unique name, a description, steps for remediation, severity, and which standards the recommendation should be assigned to.
- You add recommendation logic with KQL. A simple query editor provides a built-in query template that you can tweak as needed, or you can write your KQL query from scratch.

Learn more:

- Watch this episode of [Defender for Cloud in the field](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/creating-custom-recommendations-amp-standards-for-aws-gcp/ba-p/3810248) to learn more, and to dig into creating KQL queries.
- [Create custom recommendations for AWS/GCP resources](create-custom-recommendations.md).


## Next steps

- Learn more about [regulatory compliance standards](concept-regulatory-compliance-standards.md), [MCSB](concept-regulatory-compliance.md), and [secure score](secure-score-security-controls.md).
- [Learn more](review-security-recommendations.md) about security recommendations.

