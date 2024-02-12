---
title: Detect and configure endpoint detection and response solutions
description: Learn how to use Defender for Cloud recommendations to identify if an endpoint detection and response solution are installed on your virtual machine. You can also identify if there are any gaps in your security configuration and remediate the gaps if they exist.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 02/12/2024
---

# Detect and configure endpoint detection and response solutions

Microsoft Defender for Cloud provides recommendations to secure and configure your endpoint detection and response solutions. By remediating these recommendations, you can ensure that your endpoint detection and response solution are compliant and secure across all environments.

The recommendations allow you to: 

- Identify if endpoint detection and response solution are installed on your multicloud machines.  

- Identify gaps in the security configurations on any of the discovered endpoint detection and response solutions.

- Remediate detected gaps in your security configurations.

## Prerequisites

- [Defender for Cloud](connect-azure-subscription.md) enabled on your Azure account.

- You must have either of the following plans enabled on Defender for Cloud: 
    - [Defender for Servers plan 2](tutorial-enable-servers-plan.md)
    - [Defender CSPM](tutorial-enable-cspm-plan.md) 

- You must enable [agentless scanning for virtual machines](enable-agentless-scanning-vms.md#enabling-agentless-scanning-for-machines).
    
## Detect endpoint detection and response solution on your virtual machine

Defender for Cloud has the ability to detect several endpoint detection and response solutions on various supported platforms. The following table contains the supported solutions and platforms: 

| Endpoint detection and response solution | Supported platforms |
|--|--|
| Microsoft Defender for Endpoint for Windows | Windows |
| Microsoft Defender for Endpoint for Linux  | Linux |
| Microsoft Defender for Endpoint Unified Solution  | Windows Server 2012 R2 and Windows 2016 |
| CrowdStrike (Falcon) | Windows and Linux |
| Trellix | Windows and Linux |
| Symantec | Windows and Linux |
| Sophos |  Windows and Linux |

<br>

**To detect an endpoint recommendations and response solutions on virtual machines**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Search for and select one of the following recommendations:

    - `EDR solution should be installed on Virtual Machines`
    - `EDR solution should be installed on EC2s`
    - `EDR solution should be installed on Virtual Machines (GCP)`

    :::image type="content" source="media/endpoint-detection-response/identify-recommendations.png" alt-text="Screenshot of the recommendations page showing the identified endpoint solution recommendations." lightbox="media/endpoint-detection-response/identify-recommendations.png":::

1. Select the relevant recommendation.

1. The recommendation offers multiple recommended actions to resolve on each attached machine, select the relevant option to see the remediation steps:

    - [Enable MDE integration](#enable-mde-integration).
    - [Upgrade defender plan](#upgrade-defender-plan).
    - [Troubleshoot issues](#troubleshoot-issues).

> [!NOTE]
> This recommendation can also be remediated by installing any of the [supported endpoint detection and response solutions](#detect-endpoint-detection-and-response-solution-on-your-virtual-machine) on your virtual machine.

### Enable MDE integration

This recommended action is available when:

- One of the [supported endpoint detection and response solutions](#detect-endpoint-detection-and-response-solution-on-your-virtual-machine) wasn't detected on the VM.

- The VM can have Microsoft Defender for Endpoint installed on it as part of the offerings included with Defender for Servers.

**To enable the Defender for Endpoint integration on the affected VM**:

1. Select the affected machine.

1. (Optional) Select multiple affected machines that have the `Enable MDE integration` recommended action.

1. Select **Fix**.

    :::image type="content" source="media/endpoint-detection-response/enable-fix.png" alt-text="Screenshot that shows where the fix button is located." lightbox="media/endpoint-detection-response/enable-fix.png":::

1. Select **Plan 2** in the dropdown menu

    > [!NOTE]
    > Defender for Servers plan 2 comes with its own cost, learn more about the cost on the [Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

1. Select **Enable**.

    :::image type="content" source="media/endpoint-detection-response/enable-endpoint.png" alt-text="Screenshot that shows the pop-up window from which to enable the Defender for Endpoint integration on.":::

Defender for endpoint is applied to all Windows and Linux servers within your subscription. After the process is completed, it can take up to 24 hours until your machine appears in the Healthy resources tab.

### Upgrade defender plan

This recommended action is available when:

- One of the [supported endpoint detection and response solutions](#detect-endpoint-detection-and-response-solution-on-your-virtual-machine) wasn't detected on the VM.

- Defender for Servers plan 2 isn't enabled on the VM.

**To enable the Defender for Servers on the affected VM**:

1. Select the affected machine. 

1. (Optional) Select multiple affected machines that have the `Upgrade defender plan` recommended action.

1. Select **Fix**.

    :::image type="content" source="media/endpoint-detection-response/upgrade-fix.png" alt-text="Screenshot that shows where the fix button is located on the screen." lightbox="media/endpoint-detection-response/upgrade-fix.png":::

1. Select **Plan 2** in the dropdown menu.

    > [!NOTE]
    > Defender for Servers plan 2 comes with its own cost, learn more about the cost on the [Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

1. Select **Enable**.

    :::image type="content" source="media/endpoint-detection-response/enable-plan.png" alt-text="Screenshot that shows the pop-up window that allows you to select which Defender for Servers plan to enable on your subscription.":::

After the process is completed, it can take up to 24 hours until your machine appears in the Healthy resources tab.

### Troubleshoot issues

This recommended action is available when:

- Defender for Endpoint is detected on your machine, but the installation was unsuccessful.

**To troubleshoot issues on your VM**:

1. Select the affected resource.

1. Select **Remediation steps**.

    :::image type="content" source="media/endpoint-detection-response/remediation-steps.png" alt-text="Screenshot that shows where the remediation steps are located in the recommendation." lightbox="media/endpoint-detection-response/remediation-steps.png":::

1. Follow the instructions to [troubleshoot Microsoft Defender for Endpoint onboarding issues](/microsoft-365/security/defender-endpoint/troubleshoot-onboarding?view=o365-worldwide).

After the process is completed, it can take up to 24 hours until your machine appears in the Healthy resources tab.

## Detect misconfigurations in endpoint detection and response solution

When Defender for Cloud detects misconfigurations in your endpoint detection and response solution, recommendations appear on the recommendations page that correct misconfigurations on your Azure VM, AWS EC2 instances, and GCP VM instances. These recommendations check for the following security checks:

> [!NOTE]
> This recommendation is only applicable to virtual machines that have Defender for Endpoint enabled on them.

- `Scan are out of 7 days`
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

1. Expand the remediation steps and follow the instructions given.

After the process is completed, it can take up to 24 hours until your machine appears in the Healthy resources tab. 

## Identify which endpoint detection and response solution is enabled on a VM

To determine the enabled endpoint detection and response solution on your machine, check the healthy resources tab for the detected solution.

**To identify which solution is enabled on a VM**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Search for and select one of the following recommendations:

    - `EDR solution should be installed on Virtual Machines`
    - `EDR solution should be installed on EC2s`
    - `EDR solution should be installed on Virtual Machines (GCP)`

1. Select **Healthy resources**.

1. The Discovered EDRs column displays the solution that is detected.

    :::image type="content" source="media/endpoint-detection-response/discovered-solutions.png" alt-text="Screenshot of the Healthy resources tab, which shows where you can see which endpoint detection and response solution is enabled on your machine." lightbox="media/endpoint-detection-response/discovered-solutions.png":::

## Next steps

[Prepare for the retirement of the Log Analytics agent](prepare-deprecation-log-analytics-mma-agent.md#endpoint-protection-recommendations-experience)
