---
title: Binary drift detection (preview)
description: Learn how binary drift detection can help you detect unauthorized external processes within containers.
ms.topic: how-to
author: dcurwin
ms.author: dacurwin
ms.date: 06/17/2024
#customer intent: As a user, I want to understand how binary drift detection can help me detect unauthorized external processes within containers.
---

# Binary drift detection (preview)

A binary drift happens when a container is running an executable that didn’t come from the original image. This can either be intentional and legitimate, or it can indicate an attack. Since container images should be immutable, any processes launched from binaries not included in the original image should be evaluated as suspicious activity.

The binary drift detection feature alerts you when there's a difference between the workload that came from the image, and the workload running in the container. It alerts you about potential security threats by detecting unauthorized external processes within containers. You can define drift policies to specify conditions under which alerts should be generated, helping you distinguish between legitimate activities and potential threats.

Binary drift detection is integrated into the Defender for Containers plan and is available in public preview. It's available for the Azure (AKS), Amazon (EKS), and Google (GKE) clouds.

## Prerequisites

- To use binary drift detection, you need to run the Defender for Container sensor, which is available in AWS, GCP, and AKS in [versions](/azure/aks/supported-kubernetes-versions) 1.29 or higher.
- The Defender for Container sensor must be enabled on the subscriptions and connectors.
- To create and modify drift policies, you need global admin permissions on the tenant.

## Components

The following components are part of binary drift detection:

- an enhanced sensor capable of detecting binary drift
- policy configuration options
- a new binary drift alert

## Configure drift policies

Create drift policies to define when alerts should be generated. Each policy is made up of rules that define the conditions under which alerts should be generated. This allows you to tailor the feature to your specific needs, reducing false positives. You can create exclusions by setting higher priority rules for specific scopes or clusters, images, pods, Kubernetes labels, or namespaces.

To create and configure policies, follow these steps:

1. In Microsoft Defender for Cloud, go to **Environment settings**. Select **Containers drift policy**.

    :::image type="content" source="media/binary-drift-detection/select-containers-drift-policy.png" alt-text="Screenshot of Select Containers drift policy in Environment settings." lightbox="media/binary-drift-detection/select-containers-drift-policy.png":::

1. You receive two rules out of the box: the **Alert on Kube-System namespace** rule and the **Default binary drift** rule. The default rule is a special rule that applies to everything if no other rule before it is matched. You can only modify its action, either to **Drift detection alert** or return it to the default **Ignore drift detection**. The **Alert on Kube-System namespace** rule is an out-of-the-box suggestion and can be modified like any other rule.

    :::image type="content" source="media/binary-drift-detection/default-rule.png" alt-text="Screenshot of Default rule appears at the bottom of the list of rules." lightbox="media/binary-drift-detection/default-rule.png":::

1. To add a new rule, select **Add rule**. A side panel appears where you can configure the rule.

    :::image type="content" source="media/binary-drift-detection/add-rule.png" alt-text="Screenshot of Select Add rule to create and configure a new rule." lightbox="media/binary-drift-detection/add-rule.png":::

1. To configure the rule, define the following fields:

    - **Rule name**: A descriptive name for the rule.
    - **Action**: Select **Drift detection alert** if the rule should generate an alert or **Ignore drift detection** to exclude it from alert generation.
    - **Scope description**: A description of the scope to which the rule applies.
    - **Cloud scope**: The cloud provider to which the rule applies. You can choose any combination of Azure, AWS, or GCP. If you expand a cloud provider, you can select specific subscription. If you don't select the entire cloud provider, new subscriptions added to the cloud provider won't be included in the rule.
    - **Resource scope**: Here you can add conditions based on the following categories: **Container name**, **Image name**, **Namespace**, **Pod labels**, **Pod name**, or **Cluster name**. Then choose an operator: **Starts with**, **Ends with**, **Equals**, or **Contains**. Finally, enter the value to match. You can add as many conditions as needed by selecting **+Add condition**.
    - **Allow list for processes**: A list of processes that are allowed to run in the container. If a process not on this list is detected, an alert is generated.

    Here's an example of a rule that allows the `dev1.exe` process to run in containers in the Azure cloud scope, whose image names start with either *Test123* or *env123*:

    :::image type="content" source="media/binary-drift-detection/rule-configuration.png" alt-text="Example of a rule configuration with all the fields defined." lightbox="media/binary-drift-detection/rule-configuration.png":::

1. Select **Apply** to save the rule.

1. Once you configure your rule, select and drag the rule up or down on the list to change its priority. The rule with the highest priority is evaluated first. If there's a match, it either generates an alert or ignores it (based on what was chosen for that rule) and the evaluation stops. If no match is found, the next rule is evaluated. If there's no match for any rule, the default rule is applied.

1. To edit an existing rule, choose the rule and select **Edit**. This opens the side panel where you can make changes to the rule.

1. You can select **Duplicate rule** to create a copy of a rule. This can be useful if you want to create a similar rule with only minor changes.

1. To delete a rule, select **Delete rule**.

1. After you configured your rules, select **Save** to apply the changes and create the policy.
1. Within 30 minutes, the sensors on the protected clusters are updated with the new policy.

## Monitor and manage alerts

The alert system is designed to notify you of any binary drifts, helping you maintain the integrity of your container images. If an unauthorized external process is detected that matches your defined policy conditions, an alert with high severity is generated for you to review.

## Adjust policies as needed

Based on the alerts you receive and your review of them, you might find it necessary to adjust your rules in the binary drift policy. This could involve refining conditions, adding new rules, or removing ones that generate too many false positives. The goal is to ensure that the defined binary drift policies with their rules effectively balance security needs with operational efficiency.

The effectiveness of binary drift detection relies on your active engagement in configuring, monitoring, and adjusting policies to suit your environment's unique requirements.

## Related content

- [Overview of Container security in Microsoft Defender for Containers](defender-for-containers-introduction.md)
