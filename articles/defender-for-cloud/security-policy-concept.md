---
title: Understanding security policies, initiatives, and recommendations in Microsoft Defender for Cloud
description: Learn about security policies, initiatives, and recommendations in Microsoft Defender for Cloud.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 01/24/2023
---

# What are security policies, initiatives, and recommendations?

Microsoft Defender for Cloud applies security initiatives to your subscriptions. These initiatives contain one or more security policies. Each of those policies results in a security recommendation for improving your security posture. This page explains each of these ideas in detail.

## What is a security policy?

An Azure Policy definition, created in Azure Policy, is a rule about specific security conditions that you want controlled. Built in definitions include things like controlling what type of resources can be deployed or enforcing the use of tags on all resources. You can also create your own custom policy definitions.

To implement these policy definitions (whether built-in or custom), you'll need to assign them. You can assign any of these policies through the Azure portal, PowerShell, or Azure CLI. Policies can be disabled or enabled from Azure Policy.

There are different types of policies in Azure Policy. Defender for Cloud mainly uses 'Audit' policies that check specific conditions and configurations then report on compliance. There are also "Enforce' policies that can be used to apply secure settings.

## What is a security initiative?

A security initiative is a collection of Azure Policy definitions, or rules, are grouped together towards a specific goal or purpose. Security initiatives simplify management of your policies by grouping a set of policies together, logically, as a single item.

A security initiative defines the desired configuration of your workloads and helps ensure you're complying with the security requirements of your company or regulators.

Like security policies, Defender for Cloud initiatives are also created in Azure Policy. You can use [Azure Policy](../governance/policy/overview.md) to manage your policies, build initiatives, and assign initiatives to multiple subscriptions or for entire management groups.

The default initiative automatically assigned to every subscription in Microsoft Defender for Cloud is Microsoft cloud security benchmark. This benchmark is the Microsoft-authored set of guidelines for security and compliance best practices based on common compliance frameworks. This widely respected benchmark builds on the controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/) and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on cloud-centric security. Learn more about [Microsoft cloud security benchmark](/security/benchmark/azure/introduction).

Defender for Cloud offers the following options for working with security initiatives and policies:

- **View and edit the built-in default initiative** - When you enable Defender for Cloud, the initiative named 'Microsoft cloud security benchmark' is automatically assigned to all Defender for Cloud registered subscriptions. To customize this initiative, you can enable or disable individual policies within it by editing a policy's parameters. See the list of [built-in security policies](./policy-reference.md) to understand the options available out-of-the-box.

- **Add your own custom initiatives** - If you want to customize the security initiatives applied to your subscription, you can do so within Defender for Cloud. You'll then receive recommendations if your machines don't follow the policies you create. For instructions on building and assigning custom policies, see [Using custom security initiatives and policies](custom-security-policies.md).

- **Add regulatory compliance standards as initiatives** - Defender for Cloud's regulatory compliance dashboard shows the status of all the assessments within your environment in the context of a particular standard or regulation (such as Azure CIS, NIST SP 800-53 R4, SWIFT CSP CSCF-v2020). For more information, see [Improve your regulatory compliance](regulatory-compliance-dashboard.md).

## What is a security recommendation?

Using the policies, Defender for Cloud periodically analyzes the compliance status of your resources to identify potential security misconfigurations and weaknesses. It then provides you with recommendations on how to remediate those issues. Recommendations are the result of assessing your resources against the relevant policies and identifying resources that aren't meeting your defined requirements.

Defender for Cloud makes its security recommendations based on your chosen initiatives. When a policy from your initiative is compared against your resources and finds one or more that aren't compliant, it's presented as a recommendation in Defender for Cloud.

Recommendations are actions for you to take to secure and harden your resources. Each recommendation provides you with the following information:

- A short description of the issue
- The remediation steps to carry out in order to implement the recommendation
- The affected resources

In practice, it works like this:

1. Microsoft cloud security benchmark is an ***initiative*** that contains requirements.

    For example, Azure Storage accounts must restrict network access to reduce their attack surface.

1. The initiative includes multiple ***policies***, each with a requirement of a specific resource type. These policies enforce the requirements in the initiative.

    To continue the example, the storage requirement is enforced with the policy "Storage accounts should restrict network access using virtual network rules".

1. Microsoft Defender for Cloud continually assesses your connected subscriptions. If it finds a resource that doesn't satisfy a policy, it displays a ***recommendation*** to fix that situation and harden the security of resources that aren't meeting your security requirements.

    So, for example, if an Azure Storage account on any of your protected subscriptions isn't protected with virtual network rules, you'll see the recommendation to harden those resources.

So, (1) an initiative includes (2) policies that generate (3) environment-specific recommendations.

### Security recommendation details

Security recommendations contain details that help you understand its significance and how to handle it.

:::image type="content" source="./media/security-policy-concept/recommendation-details-page.png" alt-text="Screenshot of the recommendation details page with labels for each element." lightbox="./media/security-policy-concept/recommendation-details-page.png":::

The recommendation details shown are:

1. For supported recommendations, the top toolbar shows any or all of the following buttons:
    - **Enforce** and **Deny** (see [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md)).
    - **View policy definition** to go directly to the Azure Policy entry for the underlying policy.
    - **Open query** - You can view the detailed information about the affected resources using Azure Resource Graph Explorer.
1. **Severity indicator**
1. **Freshness interval**
1. **Count of exempted resources** if exemptions exist for a recommendation, this shows the number of resources that have been exempted with a link to view the specific resources.
1. **Mapping to MITRE ATT&CK ® tactics and techniques** if a recommendation has defined tactics and techniques, select the icon for links to the relevant pages on MITRE's site. This applies only to Azure scored recommendations.

    :::image type="content" source="media/review-security-recommendations/tactics-window.png" alt-text="Screenshot of the MITRE tactics mapping for a recommendation.":::

1. **Description** - A short description of the security issue.
1. When relevant, the details page also includes a table of **related recommendations**:

    The relationship types are:

    - **Prerequisite** - A recommendation that must be completed before the selected recommendation
    - **Alternative** - A different recommendation, which provides another way of achieving the goals of the selected recommendation
    - **Dependent** - A recommendation for which the selected recommendation is a prerequisite

    For each related recommendation, the number of unhealthy resources is shown in the "Affected resources" column.

    > [!TIP]
    > If a related recommendation is grayed out, its dependency isn't yet completed and so isn't available.

1. **Remediation steps** - A description of the manual steps required to remediate the security issue on the affected resources. For recommendations with the **Fix** option, you can select**View remediation logic** before applying the suggested fix to your resources.

1. **Affected resources** - Your resources are grouped into tabs:
    - **Healthy resources** – Relevant resources, which either aren't impacted or on which you've already  remediated the issue.
    - **Unhealthy resources** – Resources that are still impacted by the identified issue.
    - **Not applicable resources** – Resources for which the recommendation can't give a definitive answer. The not applicable tab also includes reasons for each resource.

    :::image type="content" source="./media/review-security-recommendations/recommendations-not-applicable-reasons.png" alt-text="Screenshot of resources for which the recommendation can't give a definitive answer.":::

1. Action buttons to remediate the recommendation or trigger a logic app.

## Viewing the relationship between a recommendation and a policy

As mentioned above, Defender for Cloud's built in recommendations are based on the Microsoft cloud security benchmark. Almost every recommendation has an underlying policy that is derived from a requirement in the benchmark.

When you're reviewing the details of a recommendation, it's often helpful to be able to see the underlying policy. For every recommendation supported by a policy, use the **View policy definition** link from the recommendation details page to go directly to the Azure Policy entry for the relevant policy:

:::image type="content" source="media/release-notes/view-policy-definition.png" alt-text="Link to Azure Policy page for the specific policy supporting a recommendation.":::

Use this link to view the policy definition and review the evaluation logic.

If you're reviewing the list of recommendations on our [Security recommendations reference guide](recommendations-reference.md), you'll also see links to the policy definition pages:

:::image type="content" source="media/release-notes/view-policy-definition-from-documentation.png" alt-text="Accessing the Azure Policy page for a specific policy directly from the Microsoft Defender for Cloud recommendations reference page.":::

## Next steps

This page explained, at a high level, the basic concepts and relationships between policies, initiatives, and recommendations. For related information, see:

- [Create custom initiatives](custom-security-policies.md)
- [Disable security recommendations](tutorial-security-policy.md#disable-a-security-recommendation)
- [Learn how to edit a security policy in Azure Policy](../governance/policy/tutorials/create-and-manage.md)
