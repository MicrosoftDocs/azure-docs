---
title: Remediate security baseline recommendations powered by MDVM
description: Learn how to secure your servers with security baselines in Microsoft Defender for Cloud powered by Microsoft Defender Vulnerability Management.
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
ms.date: 05/26/2024
# customer intent: As a user, I want to learn how to secure my servers with security baselines in Microsoft Defender for Cloud powered by Microsoft Defender Vulnerability Management.
---

# Remediate security baseline recommendations powered by MDVM

Microsoft Defender for Cloud enhances the Center for Internet Security (CIS) benchmarks by providing security baselines that are powered by Microsoft Defender Vulnerability Management (MDVM). These security baselines help you secure your servers by providing recommendations that improve your security posture.

MDVM's security baselines features extensive coverage of benchmarks, which are continuously updated, along with comprehensive rule coverage. Each rule is accompanied with information that details the effect of the issue, a description of the problem, and detailed recommendation steps. These checks are integrated into the Microsoft Defender for Endpoint (MDE) agent, which allows Defender for Cloud to provide extra security checks within the same agent.

## Prerequisites

- [Enable Defender for Servers Plan 2](tutorial-enable-servers-plan.md).

- [Enable the Microsoft Defender for Endpoint agent on your servers](enable-defender-for-endpoint.md).

**Supported benchmark operating systems**: 
- windows_server_2008_r2
- windows_server_2016
- windows_server_2019
- windows_server_2022

## Remediate security baseline recommendation

To ensure your servers are protected and secure, you should remediate all security baselines recommendation in Defender for Cloud.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Search for and select **Machine should be configured securely (powered by MDVM)**.

1. Select **View recommendation for all resources**.

    :::image type="content" source="media/remediate-security-baseline/view-all-resources.png" alt-text="Screenshot that shows where the view recommendation for all resources is located in the recommendation." lightbox="media/remediate-security-baseline/view-all-resources.png":::

1. Select one of the affected unhealthy resources.

1. Select a security check.

1. Follow the remediation step.

    :::image type="content" source="media/remediate-security-baseline/remediation-steps.png" alt-text="Screenshot that shows where the remediation steps are located." lightbox="media/remediate-security-baseline/remediation-steps.png"::: 

1. Repeat the process for all affected resources.

## Next step

> [!div class="nextstepaction"]
> [View and remediate findings from vulnerability assessment solutions on your VMs](remediate-vulnerability-findings-vm.md)
