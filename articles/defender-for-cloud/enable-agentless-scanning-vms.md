---
title: Enable agentless scanning for VMs
description: Find installed software and software vulnerabilities on your Azure machines and AWS machines without installing an agent.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 08/15/2023
---

# Enable agentless scanning for VMs

Agentless scanning provides visibility into installed software and software vulnerabilities on your workloads to extend vulnerability assessment coverage to server workloads without a vulnerability assessment agent installed.

Learn more about [agentless scanning](concept-agentless-data-collection.md).

Agentless vulnerability assessment uses the Microsoft Defender Vulnerability Management engine to assess vulnerabilities in the software installed on your VMs, without requiring Defender for Endpoint to be installed. Vulnerability assessment shows software inventory and vulnerability results in the same format as the agent-based assessments.

## Compatibility with agent-based vulnerability assessment solutions

Defender for Cloud already supports different agent-based vulnerability scans, including [Microsoft Defender Vulnerability Management](deploy-vulnerability-assessment-defender-vulnerability-management.md) (MDVM), [BYOL](deploy-vulnerability-assessment-byol-vm.md) and [Qualys](deploy-vulnerability-assessment-vm.md). Agentless scanning extends the visibility of Defender for Cloud to reach more devices.

When you enable agentless vulnerability assessment:

- If you have **no existing integrated vulnerability** assessment solutions enabled on any of your VMs on your subscription, Defender for Cloud automatically enables MDVM by default.

- If you select **Microsoft Defender Vulnerability Management** as part of an [integration with Microsoft Defender for Endpoint](integration-defender-for-endpoint.md), Defender for Cloud shows a unified and consolidated view that optimizes coverage and freshness.

  - Machines covered by just one of the sources (Defender Vulnerability Management or agentless) show the results from that source.
  - Machines covered by both sources show the agent-based results only for increased freshness.

- If you select **Vulnerability assessment with Qualys or BYOL integrations** - Defender for Cloud shows the agent-based results by default. Results from the agentless scan are shown for machines that don't have an agent installed or from machines that aren't reporting findings correctly.

    If you want to change the default behavior so that Defender for Cloud always displays results from MDVM (regardless of a third-party agent solution), select the [Microsoft Defender Vulnerability Management](auto-deploy-vulnerability-assessment.md#automatically-enable-a-vulnerability-assessment-solution) setting in the vulnerability assessment solution.

## Enabling agentless scanning for machines

When you enable [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) or [Defender for Servers P2](defender-for-servers-introduction.md), agentless scanning is enabled on by default.

If you have Defender for Servers P2 already enabled and agentless scanning is turned off, you need to turn on agentless scanning manually.

### Agentless vulnerability assessment on Azure

**To enable agentless vulnerability assessment on Azure**:  

1. From Defender for Cloud's menu, open **Environment settings**.
1. Select the relevant subscription.
1. For either the [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) or Defender for Servers P2 plan, select **Settings**.

    :::image type="content" source="media/enable-vulnerability-assessment-agentless/defender-plan-settings-azure.png" alt-text="Screenshot of link for the settings of the Defender plans for Azure accounts." lightbox="media/enable-vulnerability-assessment-agentless/defender-plan-settings-azure.png":::

    The agentless scanning settings are shared by both Defender Cloud Security Posture Management (CSPM) or Defender for Servers P2. When you enable agentless scanning on either plan, the setting is enabled for both plans.

1. In the settings pane, turn on **Agentless scanning for machines**.

   :::image type="content" source="media/enable-vulnerability-assessment-agentless/turn-on-agentles-scanning-azure.png" alt-text="Screenshot of settings and monitoring screen to turn on agentless scanning." lightbox="media/enable-vulnerability-assessment-agentless/turn-on-agentles-scanning-azure.png":::

1. Select **Save**.

### Agentless vulnerability assessment on AWS

1. From Defender for Cloud's menu, open **Environment settings**.
1. Select the relevant account.
1. For either the Defender Cloud Security Posture Management (CSPM) or Defender for Servers P2 plan, select **Settings**.

    :::image type="content" source="media/enable-vulnerability-assessment-agentless/defender-plan-settings-aws.png" alt-text="Screenshot of link for the settings of the Defender plans for AWS accounts." lightbox="media/enable-vulnerability-assessment-agentless/defender-plan-settings-aws.png":::

    When you enable agentless scanning on either plan, the setting applies to both plans.

1. In the settings pane, turn on **Agentless scanning for machines**.

    :::image type="content" source="media/enable-vulnerability-assessment-agentless/agentless-scan-on-aws.png" alt-text="Screenshot of the agentless scanning status for AWS accounts." lightbox="media/enable-vulnerability-assessment-agentless/agentless-scan-on-aws.png":::

1. Select **Save and Next: Configure Access**.

1. Download the CloudFormation template.

1. Using the downloaded CloudFormation template, create the stack in AWS as instructed on screen. If you're onboarding a management account, you need to run the CloudFormation template both as Stack and as StackSet. Connectors will be created for the member accounts up to 24 hours after the onboarding.

1. Select **Next: Review and generate**.

1. Select **Update**.

After you enable agentless scanning, software inventory and vulnerability information are updated automatically in Defender for Cloud.

## Enable agentless scanning in GCP

1. From Defender for Cloud's menu, select **Environment settings**. 
1. Select the relevant project or organization. 
1. For either the Defender Cloud Security Posture Management (CSPM) or Defender for Servers P2 plan, select  **Settings**. 

    :::image type="content" source="media/enable-agentless-scanning-vms/gcp-select-plan.png" alt-text="Screenshot that shows where to select the plan for GCP projects." lightbox="media/enable-agentless-scanning-vms/gcp-select-plan.png":::

1. In the settings pane, turn on  **Agentless scanning**.

    :::image type="content" source="media/enable-agentless-scanning-vms/gcp-select-agentless.png" alt-text="Screenshot that shows where to select agentless scanning." lightbox="media/enable-agentless-scanning-vms/gcp-select-agentless.png":::

1. Select **Save and Next: Configure Access**. 
1. Copy the onboarding script.
1. Run the onboarding script in the GCP organization/project scope (GCP portal or gcloud CLI).
1. Select  **Next: Review and generate**. 
1. Select  **Update**. 

## Exclude machines from scanning

Agentless scanning applies to all of the eligible machines in the subscription. To prevent specific machines from being scanned, you can exclude machines from agentless scanning based on your pre-existing environment tags. When Defender for Cloud performs the continuous discovery for machines, excluded machines are skipped.

To configure machines for exclusion:

1. From Defender for Cloud's menu, open **Environment settings**.
1. Select the relevant subscription or multicloud connector.
1. For either the Defender Cloud Security Posture Management (CSPM) or Defender for Servers P2 plan, select **Settings**.
1. For agentless scanning, select **Edit configuration**.

    :::image type="content" source="media/enable-vulnerability-assessment-agentless/agentless-scanning-edit-configuration.png" alt-text="Screenshot of the link to edit the agentless scanning configuration." lightbox="media/enable-vulnerability-assessment-agentless/agentless-scanning-edit-configuration.png":::

1. Enter the tag name and value that applies to the machines that you want to exempt. You can enter `multiple tag:value` pairs.

    :::image type="content" source="media/enable-vulnerability-assessment-agentless/agentless-scanning-exclude-tags.png" alt-text="Screenshot of the tag and value fields for excluding machines from agentless scanning.":::

1. Select **Save** to apply the changes.

## Next steps

In this article, you learned about how to scan your machines for software vulnerabilities without installing an agent.

Learn more about:

- [Vulnerability assessment with Microsoft Defender for Endpoint](deploy-vulnerability-assessment-defender-vulnerability-management.md)
- [Vulnerability assessment with Qualys](deploy-vulnerability-assessment-vm.md)
- [Vulnerability assessment with BYOL solutions](deploy-vulnerability-assessment-byol-vm.md)
