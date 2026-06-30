---
title: Invite an MCA-Online subscription owner to become an Enterprise Agreement (EA) Account Owner
description: Engineering review draft for MCA-Online to EA transfer guidance.
author: clodwig
ms.reviewer: sakulkar
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: concept-article
ms.date: 06/30/2026
ms.author: clodwig
---

# Invite an MCA-Online subscription owner to become an Enterprise Agreement (EA) Account Owner

> [!NOTE]
> Engineering review draft: this version includes proposed answers for open technical questions so review can focus on approval and edits.

This article explains how to invite an Online Microsoft Customer Agreement (MCA-Online, also called MCA-I or MCA-Individual) subscription owner to become an Account Owner of an existing Enterprise Agreement (EA). When the invitation is accepted, MCA-Online-owned Azure subscriptions are transferred under the destination EA enrollment and billed under EA.

If you need a different transfer path, use the [Azure billing product transfer hub](subscription-transfer.md).

## Important scope notes

- This flow is for **billing ownership transfer**, not Microsoft Entra directory transfer.
- Directory transfer is a different operation with different controls and user experience.
- For directory changes, see [Transfer an Azure subscription to a different Microsoft Entra directory](../../role-based-access-control/transfer-subscription.md).

## Prerequisites

Before you start:

1. Source side: requester is MCA-Online Billing Account owner (or tenant Global Admin with required elevated access).
2. Destination side: requester has Account Owner or Enterprise Admin permissions on the destination EA account.
3. Subscription is eligible for this transfer path.

## Transfer steps

Use the same enrollment-change process documented at [Transfer an Azure subscription to an Enterprise Agreement](mosp-ea-transfer.md).

## What transfers

Azure subscriptions hosted under the MCA-Online billing account move to EA billing when the transfer is completed.

### Reservations and Savings Plans

Reservations and Savings Plans should **not** be assumed to move automatically with the subscription transfer.

- Current operating guidance is to use billing support processes for transfer and eligibility handling.
- Transfer behavior can vary by product scope and policy.

If needed, open a [billing support ticket](https://azure.microsoft.com/support/create-ticket/) for benefit transfer handling.

## Role impact after transfer

After transfer:

- The MCA-Online owner becomes an EA Account Owner in the destination enrollment.
- This operation does not automatically remap all unrelated roles and users.
- Tenant-level subscription policy controls still apply.

## Source MCA-Online billing account state

The MCA-Online billing account remains active after transfer. Its subscription association changes as subscriptions move under EA billing.

## Engineering validation and approval items

| Topic | Proposed doc language | Confidence | Evidence |
|---|---|---|---|
| RI and Savings Plan handling | "Do not assume automatic transfer; behavior depends on product policy and scope; support ticket path remains required for transfer handling." | Medium | Teams evidence via Commerce IQ synthesis; known spec gap in transitions key-facts (`Transfer UX guidance when RIs present`). |
| Billing Account Owner selection rules | "Treat Billing Account Owner as high-privilege; enforce tenant policy constraints and destination EA permission prerequisites." | Medium | WorkIQ and Teams evidence of policy and privilege risk posture. |
| MCA account-type eligibility | "Document this article as MCA-Online/Individual flow unless engineering confirms broader MCA-Org/MCA-E support for this specific path." | Medium-Low | Transfer API path surfaces `InvalidTransferForNonIndividualMCASub` in SubscriptionRP resources and tests. |
| Rating Asset edge-path references | Keep out of customer-facing Learn content unless engineering asks to expose. | Medium | Prior review history and internal-only behavior notes. |
| Escalation-of-privilege guardrail | Add explicit caution that billing transfer authority must remain bounded by tenant policy and approved destination roles. | High | Security and policy thread evidence from Commerce IQ synthesis. |

### Code evidence snapshots used for this draft

1. `AD-CAB-provisioning\src\WebApps\SubscriptionRP\ResourceStrings.resx`
   - `InvalidTransferForNonIndividualMCASub` message key.
2. `AD-CAB-provisioning\src\WebApps\SubscriptionRP\SubscriptionRPTests\TransferController_V2019Tests.cs`
   - `TestCreateOrphanedSubTransfer_V2019_GsmNotAllowed_MapsToInvalidTransferForNonIndividualMCASub`.
3. `AD-CAB-provisioning\src\AcisBillingExtension\AcisBillingExtension.Extension\Operations\Provisioning\CreateAccountOwnerTransferOperation.cs`
   - Account owner transfer operation and identity parameters.

## Review checklist

1. Confirm or adjust eligibility statement for MCA account types in this article.
2. Confirm final language for RI and Savings Plan behavior and support-path guidance.
3. Confirm role and permission wording for source requester and destination EA owner and admin.
4. Confirm whether any security warning language needs to be stronger or weaker for customer-facing Learn.
5. Confirm any terms that should be normalized to internal service terminology before PR.

## Related content

1. [Azure billing product transfer hub](subscription-transfer.md)
2. [Transfer an Azure subscription to a different Microsoft Entra directory](../../role-based-access-control/transfer-subscription.md)
3. [Transfer an Azure subscription to an Enterprise Agreement](mosp-ea-transfer.md)
