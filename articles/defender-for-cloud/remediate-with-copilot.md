---
title: Remediate recommendations with Copilot for Security
author: Elazark
ms.author: elkrieger
description: Learn how to remediate recommendations with Copilot in Microsoft Defender for Cloud and improve your security posture.
ms.topic: how-to
ms.date: 06/10/2024
#customer intent: As a security professional, I want to understand how to use Copilot to remediate recommendations in Defender for Cloud so that I can improve my security posture.
---

# Remediate recommendations with Copilot for Security

Microsoft Defender for Cloud's integration with Microsoft Copilot for Security allows you to remediate recommendations that are present on the recommendations page with natural language prompts. Remediating a recommendation with Copilot for Security allows you to improve your security posture by addressing the risks and vulnerabilities that are present in your environment.

Once a recommendation is summarized with Copilot for Security in Defender for Cloud, you can decide how best to handle it. By using prompts, you can have Copilot for Security assist you in the remediation process.

## Prerequisites

- [Enable Defender for Cloud on your environment](connect-azure-subscription.md).

- [Have access to Azure Copilot](../copilot/overview.md).

- [Have Security Compute Units assigned for Copilot for Security](/copilot/security/get-started-security-copilot).

## Remediate a recommendation

Copilot in Defender for Cloud can assist with the remediation process for recommendations.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Navigate to **Recommendations**.

1. Select a recommendation.

1. Select **Summarize with Copilot**.

1. Review the summary.

1. Select **Help me remediate this recommendation**.

    :::image type="content" source="media/remediate-with-copilot/help-remediate.png" alt-text="Screenshot that shows where the help remediate the recommendation button is located." lightbox="media/remediate-with-copilot/help-remediate.png":::

1. Review the suggested remediation information and follow the instructions to remediate the recommendation.

1. (Optional) If a script is presented, select **Run** to apply the remediation.

    :::image type="content" source="media/remediate-with-copilot/run-script.png" alt-text="Screenshot that shows where the run button is located in order to run the script.":::

If you're unable or unsure how to remediate a recommendation, you can ask Copilot for additional information to assist you using more prompts. You can also delegate the recommendation to an appropriate person if needed.

## Next step

> [!div class="nextstepaction"]
> [Delegate recommendations with Copilot for Security](delegate-with-copilot.md)
