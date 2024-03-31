---
title: Secure score in Microsoft Defender for Cloud
description: Learn about the Microsoft Defender for Cloud secure score, which is part of the Microsoft cloud security benchmark.
ms.topic: conceptual
ms.date: 02/05/2024
---

# Secure score in Defender for Cloud

The secure score in Microsoft Defender for Cloud can help you to improve your cloud security posture. The secure score aggregates security findings into a single score so that you can assess, at a glance, your current security situation. The higher the score, the lower the identified risk level is.

When you turn on Defender for Cloud in a subscription, the [Microsoft cloud security benchmark (MCSB)](/security/benchmark/azure/introduction) standard is applied by default in the subscription. Assessment of resources in scope against the MCSB standard begins.

The MCSB issues recommendations based on assessment findings. Only built-in recommendations from the MCSB affect the secure score. Currently, [risk prioritization](how-to-manage-attack-path.md#features-of-the-attack-path-overview-page) doesn't affect the secure score.

> [!NOTE]
> Recommendations flagged as **Preview** aren't included in secure score calculations. You should still remediate these recommendations wherever possible, so that when the preview period ends, they'll contribute toward your score. Preview recommendations are marked with an icon: :::image type="icon" source="media/secure-score-security-controls/preview-icon.png" border="false":::.

## Viewing the secure score

When you view the Defender for Cloud **Overview** dashboard, you can view the secure score for all of your environments. The dashboard shows the secure score as a percentage value and includes the underlying values.

:::image type="content" source="./media/secure-score-security-controls/single-secure-score-via-ui.png" alt-text="Screenshot of the portal dashboard that shows an overall secure score and underlying values." lightbox="media/secure-score-security-controls/single-secure-score-via-ui.png":::

The Azure mobile app shows the secure score as a percentage value. Tap it to see details that explain the score.

:::image type="content" source="./media/secure-score-security-controls/single-secure-score-via-mobile.png" alt-text="Screenshot of the Azure mobile app that shows an overall secure score and details." lightbox="media/secure-score-security-controls/single-secure-score-via-mobile.png":::

## Exploring your security posture

The **Security posture** page in Defender for Cloud shows the secure score for your environments overall and for each environment separately.

:::image type="content" source="media/secure-score-security-controls/security-posture-page.png" alt-text="Screenshot of the Defender for Cloud page for security posture." lightbox="media/secure-score-security-controls/security-posture-page.png":::

On this page, you can see the subscriptions, accounts, and projects that affect your overall score, information about unhealthy resources, and relevant recommendations. You can filter by environment, such as Azure, Amazon Web Services (AWS), Google Cloud Platform (GCP), and Azure DevOps. You can then drill down into each Azure subscription, AWS account, and GCP project.

:::image type="content" source="media/secure-score-security-controls/bottom-half.png" alt-text="Screenshot of the bottom half of the security posture page." lightbox="media/secure-score-security-controls/bottom-half.png":::

## Calculation of the secure score

On the **Recommendations** page in Defender for Cloud, the **Secure score recommendations** tab shows how compliance controls within the MCSB contribute toward the overall security score.

:::image type="content" source="./media/secure-score-security-controls/security-controls.png" alt-text="Screenshot that shows security controls that affect a secure score." lightbox="./media/secure-score-security-controls/security-controls.png":::

Defender for Cloud calculates each control every eight hours for each Azure subscription or for each AWS or GCP cloud connector.

> [!IMPORTANT]
> Recommendations within a control are updated more often than the control itself. You might find discrepancies between the resource count on the recommendations and the resource count on the control.

### Example scores for a control

The following example focuses on secure score recommendations for enabling multifactor authentication (MFA).

:::image type="content" source="./media/secure-score-security-controls/remediate-vulnerabilities-control.png" alt-text="Screenshot that shows secure score recommendations for multifactor authentication." lightbox="./media/secure-score-security-controls/remediate-vulnerabilities-control.png":::

This example illustrates the following fields in the recommendations.

**Field** | **Details**
--- | ---
**Remediate vulnerabilities** | A grouping of recommendations for discovering and resolving known vulnerabilities.
**Max score** |  The maximum number of points that you can gain by completing all recommendations within a control.<br/><br/> The maximum score for a control indicates the relative significance of that control and is fixed for every environment.<br/><br/>Use the values in this column to determine which issues to work on first.
**Current score** | The current score for this control.<br/><br/> Current score = [Score per resource] * [Number of healthy resources]<br/><br/>Each control contributes to the total score. In this example, the control is contributing 2.00 points to current total score.
**Potential score increase** | The remaining points available to you within the control. If you remediate all the recommendations in this control, your score increases by 9%.<br/><br/> Potential score increase = [Score per resource] * [Number of unhealthy resources]
**Insights** | Extra details for each recommendation, such as:<br/><br/>  - :::image type="icon" source="media/secure-score-security-controls/preview-icon.png" border="false"::: **Preview recommendation**: This recommendation affects the secure score only when it's generally available.<br/><br/> - :::image type="icon" source="media/secure-score-security-controls/fix-icon.png" border="false"::: **Fix**: Resolve this issue.<br/><br/> - :::image type="icon" source="media/secure-score-security-controls/enforce-icon.png" border="false"::: **Enforce**: Automatically deploy a policy to fix this issue whenever someone creates a noncompliant resource.<br/><br/> - :::image type="icon" source="media/secure-score-security-controls/deny-icon.png" border="false"::: **Deny**: Prevent new resources from being created with this issue.

## Score calculation equations

Here's how scores are calculated.

### Security control

The equation for determining the score for a security control is:

:::image type="content" source="./media/secure-score-security-controls/secure-score-equation-single-control.png" alt-text="Screenshot that shows the equation for calculating a security control score."lightbox="media/secure-score-security-controls/secure-score-equation-single-control.png":::

The current score for each control is a measure of the status of the resources within the control. Each individual security control contributes toward the secure score. Each resource that's affected by a recommendation within the control contributes toward the control's current score. The secure score doesn't include resources found in preview recommendations.

In the following example, the maximum score of 6 is divided by 78 because that's the sum of the healthy and unhealthy resources. So, 6 / 78 = 0.0769. Multiplying that by the number of healthy resources (4) results in the current score: 0.0769 * 4 = 0.31.

:::image type="content" source="./media/secure-score-security-controls/security-control-scoring-tooltips.png" alt-text="Screenshot of tooltips that show the values used in calculating the security control's current score."lightbox="media/secure-score-security-controls/security-control-scoring-tooltips.png":::

### Single subscription or connector

The equation for determining the secure score for a single subscription or connector is:

:::image type="content" source="./media/secure-score-security-controls/secure-score-equation-single-sub.png" alt-text="Screenshot of the equation for calculating a subscription's secure score." lightbox="media/secure-score-security-controls/secure-score-equation-single-sub.png":::

In the following example, there's a single subscription or connector with all security controls available (a potential maximum score of 60 points).
The score shows 28 points out of a possible 60. The remaining 32 points are reflected in the **Potential score increase** figures of the security controls.

:::image type="content" source="./media/secure-score-security-controls/secure-score-example-single-sub.png" alt-text="Screenshot of a single-subscription secure score with all controls enabled." lightbox="media/secure-score-security-controls/secure-score-example-single-sub.png":::

:::image type="content" source="./media/secure-score-security-controls/secure-score-example-single-sub-recs.png" alt-text="Screenshot that shows a list of controls and the potential score increase."lightbox="media/secure-score-security-controls/secure-score-example-single-sub-recs.png":::

This equation is the same equation for a connector, with just the word *subscription* replaced by the word *connector*.

### Multiple subscriptions and connectors

The equation for determining the secure score for multiple subscriptions and connectors is:

:::image type="content" source="./media/secure-score-security-controls/secure-score-equation-multiple-subs.png" alt-text="Screenshot that shows the equation for calculating the secure score for multiple subscriptions."lightbox="media/secure-score-security-controls/secure-score-equation-multiple-subs.png":::

The combined score for multiple subscriptions and connectors includes a *weight* for each subscription and connector. Defender for Cloud determines the relative weights for your subscriptions and connectors based on factors such as the number of resources. The current score for each subscription and connector is calculated in the same way as for a single subscription or connector, but then the weight is applied as shown in the equation.

When you view multiple subscriptions and connectors, the secure score evaluates all resources within all enabled policies and groups them. Grouping them shows how, together, they affect each security control's maximum score.

:::image type="content" source="./media/secure-score-security-controls/secure-score-example-multiple-subs.png" alt-text="Screenshot that shows a secure score for multiple subscriptions with all controls enabled." lightbox="media/secure-score-security-controls/secure-score-example-multiple-subs.png":::

The combined score is *not* an average. Rather, it's the evaluated posture of the status of all resources across all subscriptions and connectors. If you go to the **Recommendations** page and add up the potential points available, you find that it's the difference between the current score (22) and the maximum score available (58).

## Improving a secure score

The MCSB consists of a series of compliance controls. Each control is a logical group of related security recommendations and reflects your vulnerable attack surfaces.

To see how well your organization is securing each individual attack surface, review the scores for each security control. Your score improves only when you remediate *all* of the recommendations.

To get all the possible points for a security control, all of your resources must comply with all of the security recommendations within the security control. For example, Defender for Cloud has multiple recommendations for how to secure your management ports. You need to remediate them all to make a difference in your secure score.

You can improve your secure score by using either of these methods:

- Remediate security recommendations from your recommendations list. You can remediate each recommendation manually for each resource, or use the **Fix** option (when available) to resolve an issue on multiple resources quickly.
- [Enforce or deny](prevent-misconfigurations.md) recommendations to improve your score, and to make sure that your users don't create resources that negatively affect your score.

## Secure score controls

The following table lists the security controls in Microsoft Defender for Cloud. For each control, you can see the maximum number of points that you can add to your secure score if you remediate *all* of the recommendations listed in the control, for *all* of your resources.

**Secure score** | **Security control**
--- | ---
10 | **Enable MFA**: Defender for Cloud places a high value on MFA. Use these recommendations to help secure the users of your subscriptions.<br/><br/> There are three ways to enable MFA and be compliant with the recommendations: security defaults, per-user assignment, and conditional access policy. [Learn more](multi-factor-authentication-enforcement.md).
8 | **Secure management ports**: Brute force attacks often target management ports. Use these recommendations to reduce your exposure with tools like [just-in-time VM access](just-in-time-access-overview.md) and [network security groups](../virtual-network/network-security-groups-overview.md).
6 | **Apply system updates**: Not applying updates leaves unpatched vulnerabilities and results in environments that are susceptible to attacks. Use these recommendations to maintain operational efficiency, reduce security vulnerabilities, and provide a more stable environment for your users. To deploy system updates, you can use the [Update Management solution](../automation/update-management/overview.md) to manage patches and updates for your machines.
6 | **Remediate vulnerabilities**: When your vulnerability assessment tool reports vulnerabilities to Defender for Cloud, Defender for Cloud presents the findings and related information as recommendations. Use these recommendations to remediate identified vulnerabilities.
4 | **Remediate security configurations**: Misconfigured IT assets have a higher risk of being attacked. Use these recommendations to harden the identified misconfigurations across your infrastructure.
4 | **Manage access and permissions**: A core part of a security program is ensuring that your users have just the necessary access to do their jobs: the least privilege access model. Use these recommendations to manage your identity and access requirements.
4 | **Enable encryption at rest**: Use these recommendations to ensure that you mitigate misconfigurations around the protection of your stored data.
4 | **Encrypt data in transit**: Use these recommendations to help secure data that's moving between components, locations, or programs. Such data is susceptible to man-in-the-middle attacks, eavesdropping, and session hijacking.
4 | **Restrict unauthorized network access**: Azure offers a suite of tools that help you provide high security standards for access across your network.<br/><br/> Use these recommendations to manage [adaptive network hardening](adaptive-network-hardening.md) in Defender for Cloud, ensure that you configured [Azure Private Link](../private-link/private-link-overview.md) for all relevant platform as a service (PaaS) services, enable [Azure Firewall](../firewall/overview.md) on virtual networks, and more.
3 | **Apply adaptive application control**: Adaptive application control is an intelligent, automated, end-to-end solution to control which applications can run on your machines. It also helps to harden your machines against malware.
2 | **Protect applications against DDoS attacks**: Advanced networking security solutions in Azure include Azure DDoS Protection, Azure Web Application Firewall, and the Azure Policy add-on for Kubernetes. Use these recommendations to help protect your applications with these tools and others.
2 | **Enable endpoint protection**: Defender for Cloud checks your organization's endpoints for active threat detection and response solutions, such as Microsoft Defender for Endpoint or any of the major solutions shown in this list.<br/><br/> If no endpoint detection and response (EDR) solution is enabled, use these recommendations to deploy Microsoft Defender for Endpoint. Defender for Endpoint is included in the [Defender for Servers plan](defender-for-servers-introduction.md).<br/><br/>Other recommendations in this control help you deploy agents and configure [file integrity monitoring](file-integrity-monitoring-overview.md).
1 | **Enable auditing and logging**: Detailed logs are a crucial part of incident investigations and many other troubleshooting operations. The recommendations in this control focus on ensuring that you enabled diagnostic logs wherever they're relevant.
0 | **Enable enhanced security features**: Use these recommendations to enable any Defender for Cloud plans.
0 | **Implement security best practices**: This collection of recommendations is important for your organizational security but doesn't affect your secure score.

## Next steps

[Track your secure score](secure-score-access-and-track.md)
