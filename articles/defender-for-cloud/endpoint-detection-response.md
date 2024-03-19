---
title: Review and remediate endpoint detection and response recommendations (agentless)
description: Identify and remediate security gaps in endpoint detection and response solutions on your virtual machine with Defender for Cloud recommendations.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 03/18/2024
ai-usage: ai-assisted
#customer intent: As a user, I want to learn how to review and remediate endpoint detection and response recommendations in order to ensure the security of my virtual machine.
---

# Review and remediate endpoint detection and response recommendations (agentless)

Microsoft Defender for Cloud provides recommendations to secure and configure your endpoint detection and response solutions. By remediating these recommendations, you can ensure that your endpoint detection and response solution are compliant and secure across all environments.

The endpoint detection and response recommendations allow you to: 

- Identify if an endpoint detection and response solution is installed on your multicloud machines

- Identify gaps in the security configurations on any of the discovered endpoint detection and response solutions

- Remediate detected gaps in your security configurations

## Prerequisites

The recommendations mentioned in this article are only available if you have the following prerequisites in place:

- [Defender for Cloud](connect-azure-subscription.md) enabled on your Azure account.

- You must have either of the following plans enabled on Defender for Cloud enabled on your subscription: 
    - [Defender for Servers plan 2](tutorial-enable-servers-plan.md)
    - [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) 

- You must enable [agentless scanning for virtual machines](enable-agentless-scanning-vms.md#enabling-agentless-scanning-for-machines).

> [!NOTE]
> The feature described on this page is the replacement feature for the [MMA based feature](endpoint-protection-recommendations-technical.md), which is set to be retired along with the MMA retirement in August 2024.
>
> Learn more about the migration and the [deprecation process of the endpoint protection related recommendations](prepare-deprecation-log-analytics-mma-agent.md#endpoint-protection-recommendations-experience). 

## Review and remediate endpoint detection and response discovery recommendations

When Defender for Cloud discovers a supported endpoint detection and response solution on your VM, the agentless machine scanner performs the following checks to see:

- If a supported endpoint detection and response solution is enabled
- If Defender for Servers plan 2 is enabled on your subscription and the associated VMs
- If the supported solution is installed successfully

If these checks present issues, the recommendation offers different remediation steps to ensure that your VMs are protected by a supported endpoint detection and response solution and address any security gaps.

### Supported solutions and platforms

The following endpoint detection and response solutions are supported in Defender for Cloud:

| Endpoint detection and response solution | Supported platforms |
|--|--|
| Microsoft Defender for Endpoint for Windows | Windows |
| Microsoft Defender for Endpoint for Linux  | Linux |
| Microsoft Defender for Endpoint Unified Solution  | Windows Server 2012 R2 and Windows 2016 |
| CrowdStrike (Falcon) | Windows and Linux |
| Trellix | Windows and Linux |
| Symantec | Windows and Linux |
| Sophos |  Windows and Linux |

### Identify which endpoint detection and response solution is enabled on a VM

Defender for Cloud has the ability to tell you if you have a [supported endpoint detection and response solution](#supported-solutions-and-platforms) enabled on your virtual machines (VM) and which one it is.

**To identify which solution is enabled on a VM**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Search for and select one of the following recommendations:

    - `EDR solution should be installed on Virtual Machines`
    - `EDR solution should be installed on EC2s`
    - `EDR solution should be installed on Virtual Machines (GCP)`

1. Select the **Healthy resources** tab.

1. The discovered endpoint detection and response column displays the solution that is detected.

    :::image type="content" source="media/endpoint-detection-response/discovered-solutions.png" alt-text="Screenshot of the Healthy resources tab, which shows where you can see which endpoint detection and response solution is enabled on your machine." lightbox="media/endpoint-detection-response/discovered-solutions.png":::

### Review and remediate the discovery recommendations

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Search for and select one of the following recommendations:

    - `EDR solution should be installed on Virtual Machines`
    - `EDR solution should be installed on EC2s`
    - `EDR solution should be installed on Virtual Machines (GCP)`

    :::image type="content" source="media/endpoint-detection-response/identify-recommendations.png" alt-text="Screenshot of the recommendations page showing the identified endpoint solution recommendations." lightbox="media/endpoint-detection-response/identify-recommendations.png":::

1. Select the relevant recommendation.

1. The recommendation offers multiple recommended actions to resolve on each attached machine, select the relevant action to see the remediation steps:

    - [Enable Microsoft Defender for Endpoint integration](#enable-the-microsoft-defender-for-endpoint-integration). Alternatively, you can remediate this recommendation by installing any of the [supported endpoint detection and response solution](#supported-solutions-and-platforms) on your virtual machine
    - [Upgrade Defender plan](#upgrade-defender-plan)
    - [Troubleshoot issues](#troubleshoot-unsuccessful-installation)

#### Enable the Microsoft Defender for Endpoint integration

This recommended action is available when:

- One of the [supported endpoint detection and response solution](#supported-solutions-and-platforms) wasn't detected on the VM.

- The VM can have Microsoft Defender for Endpoint installed on it as part of the offerings included with Defender for Servers.

**To enable the Defender for Endpoint integration on the affected VM**:

1. Select the affected machine.

1. (Optional) Select multiple affected machines that have the `Enable Microsoft Defender for Endpoint integration` recommended action.

1. Select **Fix**.

    :::image type="content" source="media/endpoint-detection-response/enable-fix.png" alt-text="Screenshot that shows where the fix button is located." lightbox="media/endpoint-detection-response/enable-fix.png":::

1. Select **Enable**.

    :::image type="content" source="media/endpoint-detection-response/enable-endpoint.png" alt-text="Screenshot that shows the pop-up window from which to enable the Defender for Endpoint integration on.":::

Defender for endpoint is applied to all Windows and Linux servers within your subscription. After the process is completed, it can take up to 24 hours until your machine appears in the Healthy resources tab.

#### Upgrade Defender plan

This recommended action is available when:

- One of the [supported endpoint detection and response solution](#supported-solutions-and-platforms) wasn't detected on the VM.

- Defender for Servers plan 2 isn't enabled on the VM.

**To enable the Defender for Endpoint integration on your Defender for Servers plan on the affected VM**:

1. Select the affected machine. 

1. (Optional) Select multiple affected machines that have the `Upgrade Defender plan` recommended action.

1. Select **Fix**.

    :::image type="content" source="media/endpoint-detection-response/upgrade-fix.png" alt-text="Screenshot that shows where the fix button is located on the screen." lightbox="media/endpoint-detection-response/upgrade-fix.png":::

1. Select a plan in the dropdown menu. Each plan comes with a cost, learn more about the cost on the [Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

1. Select **Enable**.

    :::image type="content" source="media/endpoint-detection-response/enable-plan.png" alt-text="Screenshot that shows the pop-up window that allows you to select which Defender for Servers plan to enable on your subscription.":::

After the process is completed, it can take up to 24 hours until your machine appears in the Healthy resources tab.

#### Troubleshoot unsuccessful installation

This recommended action is available when:

- Defender for Endpoint is detected on your machine, but the installation was unsuccessful.

**To troubleshoot issues on your VM**:

1. Select the affected resource.

1. Select **Remediation steps**.

    :::image type="content" source="media/endpoint-detection-response/remediation-steps.png" alt-text="Screenshot that shows where the remediation steps are located in the recommendation." lightbox="media/endpoint-detection-response/remediation-steps.png":::

1. Follow the instructions to troubleshoot Microsoft Defender for Endpoint onboarding issues for [Windows](/microsoft-365/security/defender-endpoint/troubleshoot-onboarding?view=o365-worldwide&WT.mc_id=Portal-Microsoft_Azure_Security) or [Linux](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint-linux?view=o365-worldwide&WT.mc_id=Portal-Microsoft_Azure_Security).

After the process is completed, it can take up to 24 hours until your machine appears in the Healthy resources tab.

## Review and remediate endpoint detection and response misconfiguration recommendations

When Defender for Cloud finds misconfigurations in your endpoint detection and response solution, recommendations appear on the recommendations page. This recommendation is only applicable to VMs that have Defender for Endpoint enabled on them. These recommendations check for the following security checks:

- `Both full and quick scans are out of 7 days`
- `Signature out of date`
- `Anti-virus is off or partially configured`

**To detect misconfigurations in endpoint detection and response solution**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Search for and select one of the following recommendations:

    - `EDR configuration issues should be resolved on virtual machines`
    - `EDR configuration issues should be resolved on EC2s`
    - `EDR configuration issues should be resolved on GCP virtual machines`

    :::image type="content" source="media/endpoint-detection-response/configurable-solutions.png" alt-text="Screenshot that shows the recommendations that configure your endpoint detection and solution and remediate misconfigurations." lightbox="media/endpoint-detection-response/configurable-solutions.png":::

1. Select the relevant recommendation.

1. Select a security check to review the affected resources.

    :::image type="content" source="media/endpoint-detection-response/affected-resources.png" alt-text="Screenshot that shows a selected security check and the affected resources." lightbox="media/endpoint-detection-response/affected-resources.png":::

1. Select each security check to review all affected resources.

1. Expand the affected resources section.

    :::image type="content" source="media/endpoint-detection-response/affected-resources-section.png" alt-text="Screenshot that shows you where you need to select on screen to expand the affected resources section.":::

1. Select an unhealthy resource to review its findings.

    :::image type="content" source="media/endpoint-detection-response/resources-findings.png" alt-text="Screenshot that shows the findings of an affected unhealthy resource." lightbox="media/endpoint-detection-response/resources-findings.png":::

1. Select the security check to see additional information and the remediation steps.

    :::image type="content" source="media/endpoint-detection-response/security-check-remediation.png" alt-text="Screenshot that shows the additional details section.":::

1. Follow the remediation steps.

After the process is completed, it can take up to 24 hours until your machine appears in the Healthy resources tab. 

## Next step

> [!div class="nextstepaction"]
> [Learn about the differences between the MMA experience and the agentless experience](prepare-deprecation-log-analytics-mma-agent.md#endpoint-protection-recommendations-experience).
