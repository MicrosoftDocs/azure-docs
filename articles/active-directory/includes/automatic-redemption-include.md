---
title: include file
description: include file
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: include
ms.date: 01/23/2023
ms.author: rolyon
ms.custom: include file
---

The automatic redemption setting is an inbound and outbound organizational trust setting to automatically redeem invitations so users don't have to accept the consent prompt the first time they access the resource/target tenant. This setting is a check box with the following name:

- **Automatically redeem invitations with the tenant** &lt;tenant&gt;

:::image type="content" source="../media/external-identities/inbound-consent-prompt-setting.png" alt-text="Screenshot that shows the inbound Automatic redemption check box." lightbox="../media/external-identities/inbound-consent-prompt-setting.png":::

#### Compare setting for different scenarios

The automatic redemption setting applies to cross-tenant synchronization, B2B collaboration, and B2B direct connect in the following situations:

- When users are created in a target tenant using cross-tenant synchronization.
- When users are added to a resource tenant using B2B collaboration.
- When users access resources in a resource tenant using B2B direct connect.

The following table shows how this setting compares when enabled for these scenarios:

| Item | Cross-tenant synchronization | B2B collaboration | B2B direct connect |
| --- | :---: | :---: | :---: |
| Automatic redemption setting | Required | Optional | Optional |
| Users receive a [B2B collaboration invitation email](../external-identities/invitation-email-elements.md) | No | No | N/A |
| Users must accept a [consent prompt](../external-identities/redemption-experience.md#consent-experience-for-the-guest) | No | No | No |
| Users receive a [B2B collaboration notification email](../external-identities/redemption-experience.md#automatic-redemption-process-setting) | No | Yes | N/A |

This setting doesn't impact application consent experiences. For more information, see [Consent experience for applications in Azure Active Directory](../develop/application-consent-experience.md). This setting isn't supported for organizations across different Microsoft cloud environments, such as Azure commercial and Azure Government.

#### When is consent prompt suppressed?

The automatic redemption setting will only suppress the consent prompt and invitation email if both the home/source tenant (outbound) and resource/target tenant (inbound) checks this setting.

:::image type="content" source="../media/automatic-redemption-include/automatic-redemption-setting.png" alt-text="Diagram that shows automatic redemption setting for both outbound and inbound.":::

The following table shows the consent prompt behavior for source tenant users when the automatic redemption setting is checked for different cross-tenant access setting combinations.

| Home/source tenant | Resource/target tenant | Consent prompt behavior<br/>for source tenant users |
| :---: | :---: | :---: |
| **Outbound** | **Inbound** |  |
| ![Icon for check mark.](../media/automatic-redemption-include/icon-check-mark.png) | ![Icon for check mark.](../media/automatic-redemption-include/icon-check-mark.png) | Suppressed |
| ![Icon for check mark.](../media/automatic-redemption-include/icon-check-mark.png) | ![Icon for clear check mark.](../media/automatic-redemption-include/icon-check-mark-clear.png) | Not suppressed |
| ![Icon for clear check mark.](../media/automatic-redemption-include/icon-check-mark-clear.png) | ![Icon for check mark.](../media/automatic-redemption-include/icon-check-mark.png) | Not suppressed |
| ![Icon for clear check mark.](../media/automatic-redemption-include/icon-check-mark-clear.png) | ![Icon for clear check mark.](../media/automatic-redemption-include/icon-check-mark-clear.png) | Not suppressed |
| **Inbound** | **Outbound** |  |
| ![Icon for check mark.](../media/automatic-redemption-include/icon-check-mark.png) | ![Icon for check mark.](../media/automatic-redemption-include/icon-check-mark.png) | Not suppressed |
| ![Icon for check mark.](../media/automatic-redemption-include/icon-check-mark.png) | ![Icon for clear check mark.](../media/automatic-redemption-include/icon-check-mark-clear.png) | Not suppressed |
| ![Icon for clear check mark.](../media/automatic-redemption-include/icon-check-mark-clear.png) | ![Icon for check mark.](../media/automatic-redemption-include/icon-check-mark.png) | Not suppressed |
| ![Icon for clear check mark.](../media/automatic-redemption-include/icon-check-mark-clear.png) | ![Icon for clear check mark.](../media/automatic-redemption-include/icon-check-mark-clear.png) | Not suppressed |
