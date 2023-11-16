---
title: Secure score in Microsoft Defender for Cloud
description: Learn about the Microsoft Cloud Security Benchmark secure score in Microsoft Defender for Cloud
ms.topic: conceptual
ms.date: 06/19/2023
---

# Secure score


Secure score in Microsoft Defender for Cloud helps you to assess and improve your cloud security posture. Secure score aggregates security findings into a single score so that you can tell, at a glance, your current security situation. The higher the score, the lower the identified risk level.

When you turn on Defender for Cloud in a subscription, the [Microsoft cloud security benchmark (MCSB)](/security/benchmark/azure/introduction) standard is applied by default in the subscription.  Assessment of resources in scope against the MCSB standard begins.

Recommendations are issued based on assessment findings. Only built-in recommendations from the MSCB impact the secure score.


> [!Note]
> Recommendations flagged as **Preview** aren't included in secure score calculations. They should still be remediated wherever possible, so that when the preview period ends they'll contribute towards your score. Preview recommendations are marked with: :::image type="icon" source="media/secure-score-security-controls/preview-icon.png" border="false":::

> [!NOTE]
> Currently, [risk prioritization](how-to-manage-attack-path.md#features-of-the-attack-path-overview-page) doesn't affect the secure score.


## Viewing the secure score

When you view the Defender for Cloud **Overview** dashboard, you can see the secure score for all of your environments. The secure score is shown as a percentage value and the underlying values are also presented.

:::image type="content" source="./media/secure-score-security-controls/single-secure-score-via-ui.png" alt-text="Screenshot that shows the overall secure score as shown in the portal.":::

In the Azure mobile app, the secure score is shown as a percentage value. Tap it to see details that explain the score.

:::image type="content" source="./media/secure-score-security-controls/single-secure-score-via-mobile.png" alt-text="Screenshot that shows the overall secure score as shown in the Azure mobile app.":::

## Exploring your security posture

On the **Security posture** page in Defender for Cloud, you can see the secure score all-up for your environments, and for each environment separately.

:::image type="content" source="media/secure-score-security-controls/security-posture-page.png" alt-text="Screenshot of the security posture page." lightbox="media/secure-score-security-controls/security-posture-page.png":::

- You can see the subscriptions, accounts, and projects that affect your overall score, information about unhealthy resources, and relevant recommendations.
- You can  filter by environment (Azure, AWS, GCP, Azure DevOps), and drill down into each Azure subscription, AWS account, and GCP project.


:::image type="content" source="media/secure-score-security-controls/bottom-half.png" alt-text="Screenshot of the bottom half of the security posture page.":::

## How secure score is calculated

On the **Recommendations** page > **Secure score recommendations** tab in Defender for Cloud, you can see how compliance controls within the MCSB contribute towards the overall security score.

:::image type="content" source="./media/secure-score-security-controls/security-controls.png" alt-text="Screenshot that shows security controls that impact your secure score." lightbox="./media/secure-score-security-controls/security-controls.png":::

Each control is calculated every eight hours for each Azure subscription, or AWS/GCP cloud connector. 

> [!Important]
> Recommendations within a control are updated more frequently than the control, and so there might be discrepancies between the resources count on the recommendations versus the one found on the control.

### Example scores for a control

:::image type="content" source="./media/secure-score-security-controls/remediate-vulnerabilities-control.png" alt-text="Screenshot showing how to apply system updates security control." lightbox="./media/secure-score-security-controls/remediate-vulnerabilities-control.png":::

In this example.

**Field** | **Details**
--- | ---
**Remediate vulnerabilities** | This control groups multiple recommendations related to discovering and resolving known vulnerabilities.
**Max score** |  The maximum number of points you can gain by completing all recommendations within a control.<br/><br/> The maximum score for a control indicates the relative significance of that control and is fixed for every environment.<br/><br/>Use the max score values to triage the issues to work on first.
**Current score** | The current score for this control.<br/><br/> Current score = [Score per resource] * [Number of healthy resources]<br/><br/>Each control contributes towards the total score. In this example, the control is contributing 2.00 points to current total secure score.
**Potential score increase** | The remaining points available to you within the control. If you remediate all the recommendations in this control, your score increases by 9%.<br/><br/> Potential score increase = [Score per resource] * [Number of unhealthy resources]
**Insights** | Gives you extra details for each recommendation, such as:<br/><br/>  - :::image type="icon" source="media/secure-score-security-controls/preview-icon.png" border="false"::: Preview recommendation - This recommendation only affects the secure score when it's GA.<br/><br/> - :::image type="icon" source="media/secure-score-security-controls/fix-icon.png" border="false"::: Fix - From within the recommendation details page, you can use 'Fix' to resolve this issue.<br/><br/> - :::image type="icon" source="media/secure-score-security-controls/enforce-icon.png" border="false"::: Enforce - From within the recommendation details page, you can automatically deploy a policy to fix this issue whenever someone creates a noncompliant resource.<br/><br/> - :::image type="icon" source="media/secure-score-security-controls/deny-icon.png" border="false"::: Deny - From within the recommendation details page, you can prevent new resources from being created with this issue.

## Understanding score calculations

Here's how scores are calculated.

### Security control's current score


:::image type="content" source="./media/secure-score-security-controls/secure-score-equation-single-control.png" alt-text="Screenshot showing the equation for calculating a security control score." :::


- Each individual security control contributes towards the secure score.
- Each resource affected by a recommendation within the control, contributes towards the control's current score. Secure score doesn't include resources found in preview recommendations.
- The current score for each control is a measure of the status of the resources *within* the control.

    :::image type="content" source="./media/secure-score-security-controls/security-control-scoring-tooltips.png" alt-text="Screenshot of tooltips showing the values used when calculating the security control's current score." :::


    In this example, the max score of 6 would be divided by 78 because that's the sum of the healthy and unhealthy resources.So, 6 / 78 = 0.0769<br>Multiplying that by the number of healthy resources (4) results in the current score: 0.0769 * 4 = **0.31**<br><br>

### Secure score - single subscription, or connector

:::image type="content" source="./media/secure-score-security-controls/secure-score-equation-single-sub.png" alt-text="Screenshot of equation for calculating a subscription's secure score.":::

:::image type="content" source="./media/secure-score-security-controls/secure-score-example-single-sub.png" alt-text="Screenshot of single subscription secure score with all controls enabled.":::

In this example, there's a single subscription, or connector with all security controls available (a potential maximum score of 60 points).

The score shows 28 points out of a possible 60 and the remaining 32 points are reflected in the "Potential score increase" figures of the security controls.

:::image type="content" source="./media/secure-score-security-controls/secure-score-example-single-sub-recs.png" alt-text="Screenshot showing a list of controls and the potential score increase.":::

This equation is the same equation for a connector with just the word subscription replaced by the word connector. 


### Secure score - Multiple subscriptions, and connectors

:::image type="content" source="./media/secure-score-security-controls/secure-score-equation-multiple-subs.png" alt-text="Screenshot showing equation for calculating the secure score for multiple subscriptions.":::


- The combined score for multiple subscriptions and connectors includes a *weight* for each subscription, and connector.
- Defender for Cloud determines the relative weights for your subscriptions, and connectors based on factors such as the number of resources.
- The current score for each subscription, a dn connector is calculated in the same way as for a single subscription, or connector, but then the weight is applied as shown in the equation.
- When you view multiple subscriptions and connectors, the secure score evaluates all resources within all enabled policies and groups them to show how together they impact each security control's maximum score.

    :::image type="content" source="./media/secure-score-security-controls/secure-score-example-multiple-subs.png" alt-text="Screenshot showing secure score for multiple subscriptions with all controls enabled.":::

    The combined score is **not** an average; rather it's the evaluated posture of the status of all resources across all subscriptions, and connectors.<br><br>If you go to the **Recommendations** page and add up the potential points available, you find that it's the difference between the current score (22) and the maximum score available (58).


## Improving secure score


MCSB consists of a series of compliance controls, and each control is a logical group of related security recommendations, and reflects your vulnerable attack surfaces. 

To see how well your organization is securing each individual attack surface, review the scores for each security control. Note that:

- Your score only improves when you remediate *all* of the recommendations.
- To get all the possible points for a security control, all of your resources must comply with all of the security recommendations within the security control.
- For example, Defender for Cloud has multiple recommendations regarding how to secure your management ports. You need to remediate them all to make a difference to your secure score.

To improve your secure score:

- Remediate security recommendations from your recommendations list. You can remediate each recommendation manually for each resource, or use the **Fix** option (when available) to resolve an issue on multiple resources quickly. 
- You can also [enforce or deny](prevent-misconfigurations.md) recommendations to improve your score, and to make sure your users don't create resources that negatively affect your score.


## Secure score controls

The table below lists the security controls in Microsoft Defender for Cloud. For each control, you can see the maximum number of points you can add to your secure score if you remediate *all* of the recommendations listed in the control, for *all* of your resources.

**Secure score** | **Security control**
--- | ---
10 | **Enable MFA** - Defender for Cloud places a high value on multifactor authentication (MFA). Use these recommendations to secure the users of your subscriptions.<br/><br/> There are three ways to enable MFA and be compliant with the recommendations: security defaults, per-user assignment, conditional access policy. [Learn more](multi-factor-authentication-enforcement.md)
8 | **Secure management ports** - Brute force attacks often target management ports. Use these recommendations to reduce your exposure with tools like [just-in-time VM access](just-in-time-access-overview.md) and [network security groups](../virtual-network/network-security-groups-overview.md).
6 | **Apply system updates** - Not applying updates leaves unpatched vulnerabilities and results in environments that are susceptible to attacks. Use these recommendations to maintain operational efficiency, reduce security vulnerabilities, and provide a more stable environment for your end users. To deploy system updates, you can use the [Update Management solution](../automation/update-management/overview.md) to manage patches and updates for your machines.
4 | **Remediate security configurations** - Misconfigured IT assets have a higher risk of being attacked. Use these recommendations to harden the identified misconfigurations across your infrastructure.
4 | **Manage access and permissions** - A core part of a security program is ensuring your users have just the necessary access to do their jobs: the least privilege access model. Use these recommendations to manage your identity and access requirements.
4 | **Enable encryption at rest** - Use these recommendations to ensure you mitigate misconfigurations around the protection of your stored data.
4 | **Encrypt data in transit** - Use these recommendations to secure data that’s moving between components, locations, or programs. Such data is susceptible to man-in-the-middle attacks, eavesdropping, and session hijacking.
4 | **Restrict unauthorized network access** - Azure offers a suite of tools designed to ensure accesses across your network meet the highest security standards.<br/><br/> Use these recommendations to manage Defender for Cloud's [adaptive network hardening](adaptive-network-hardening.md), ensure you’ve configured [Azure Private Link](../private-link/private-link-overview.md) for all relevant PaaS services, enable [Azure Firewall](../firewall/overview.md) on virtual networks, and more.
3 | **Apply adaptive application control** - Adaptive application control is an intelligent, automated, end-to-end solution to control which applications can run on your machines. It also helps to harden your machines against malware.
2 | **Protect applications against DDoS attacks** - Azure’s advanced networking security solutions include Azure DDoS Protection, Azure Web Application Firewall, and the Azure Policy Add-on for Kubernetes. Use these recommendations to ensure your applications are protected with these tools and others.
2 | **Enable endpoint protection** - Defender for Cloud checks your organization’s endpoints for active threat detection and response solutions such as Microsoft Defender for Endpoint or any of the major solutions shown in this list.<br/><br/> If no Endpoint Detection and Response (EDR) solution is enabled, use these recommendations to deploy Microsoft Defender for Endpoint. Defender for Endpoint is included as part of the [Defender for Servers plan](defender-for-servers-introduction.md).<br/><br/>Other recommendations in this control help you deploy agents and configure [file integrity monitoring](file-integrity-monitoring-overview.md).
1 | **Enable auditing and logging** - Detailed logs are a crucial part of incident investigations and many other troubleshooting operations. The recommendations in this control focus on ensuring you’ve enabled diagnostic logs wherever relevant.
0 | **Enable enhanced security features** - Use these recommendations to enable any Defender for Cloud plans.
0 | **Implement security best practices** - This control doesn't affect your secure score. This collection of recommendations is important for your organizational security, but shouldn’t be used to assess your overall score.

## Next steps

[Track your secure score](secure-score-access-and-track.md)

