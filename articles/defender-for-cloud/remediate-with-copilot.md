---
title: Remediate recommendations with Copilot for Security
author: Elazark
ms.author: elkrieger
description: Learn how to remediate recommendations with Copilot in Microsoft Defender for Cloud and improve your security posture.
ms.topic: how-to
ms.date: 05/29/2024
#customer intent: As a security professional, I want to understand how to use Copilot to remediate recommendations in Defender for Cloud so that I can improve my security posture.
---

# Remediate recommendations with Copilot for Security

Microsoft Defender for Cloud's integration with Microsoft Copilot for Security allows you to remediate recommendations that are present on the recommendations page with natural language prompts. This allows you to improve your security posture by addressing the risks and vulnerabilities that are present in your environment.

Once you have summarized a recommendation with Copilot for Security in Defender for Cloud, you can decide how best to handle it. By using prompts, you can have Copilot for Security assist you in the remediation process.

## Prerequisites

- [Enable Defender for Cloud on your environment](connect-azure-subscription.md).

- [Access to Azure Copilot](../copilot/overview.md).

- [A Microsoft Copilot for Security subscription](/copilot/security/get-started-security-copilot).

## Remediate a recommendation

Copilot for Security in Defender for Cloud allows you to remediate your recommendations.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Navigate to **Recommendations**.

1. Select a recommendation.

1. Select **Summarize with Copilot**.

1. Review the summary.

1. Select **Help me remediate this recommendation**.

1. Review the suggested remediation information.

1. Select **Run** to apply the remediation.

1. Allow the Cloud shell to run.

If you are unable or unsure how to remediate a recommendation, you can ask Copilot for additional information to assist you using natural language prompts. You can also delegate the recommendation to an appropriate person if needed.

## Next step

> [!div class="nextstepaction"]
> [Delegate recommendations with Copilot for Security](delegate-with-copilot.md)
