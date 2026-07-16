---
title: Benefit application order for reservations and pre-purchase plans
description: Learn how discounts from reservations and pre-purchase plans apply to your resource usage in Azure.
author: pri-mittal
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: concept-article
ms.date: 06/18/2026
ms.author: primittal
---

# Benefit application order for reservations and pre-purchase plans

If you have both reservations and pre-purchase plans, discounts apply in a set order. The most specific discount always applies first. This article explains how that order works.

## Benefit types

Azure offers two ways to save by committing to usage in advance:

| Benefit type | What you get | How billing works |
|---|---|---|
| **Reservation** | A discounted rate for a specific SKU and region. The discount applies every hour to matching resources. | Fixed hourly benefit. If no matching resource runs that hour, the benefit is lost. |
| **Pre-purchase plan** | A pool of commit units at a discounted price. Your usage draws from this pool. | The balance decreases with eligible usage. When it reaches zero, you pay regular prices. |

## Application order

Discounts apply from most specific to least specific:

1. **Reservation** — Locked to one SKU and region.
2. **Pre-purchase plan** — Covers eligible usage across a service.
3. **Azure savings plan** — Covers compute across services.
4. **Pay-as-you-go** — Standard rates for any remaining usage.

```
Reservation  →  Pre-purchase plan  →  Azure savings plan  →  Pay-as-you-go
```

If you don't have a savings plan, that step is skipped.

## How reservations apply

Reservations are always evaluated first. If you have reservations at multiple scope levels, the narrowest scope is evaluated first:

1. **Resource group** — Reservations scoped to the resource group where the resource runs.
2. **Subscription** — If no match, reservations scoped to the subscription.
3. **Management group** — If no match, reservations scoped to the management group.
4. **Shared** — Reservations shared across the billing profile or enrollment.

When a match is found, that reservation applies and broader scopes aren't evaluated for that resource.

### Key behaviors

- **Hourly application** — The discount applies every hour. You don't need to take any action.
- **Instance size flexibility** — Within the same VM instance family group, a reservation for one size can cover other sizes. For example, a D4 VM reservation can cover two D2 VMs. For more information, see [Instance size flexibility](instance-size-flexibility.md).
- **Partial coverage** — If a reservation covers only part of the usage, the uncovered portion moves to the next step.
- **First-come, first-served** — If you have several reservations at the same scope, they apply based on which resources are running.

## How pre-purchase plans apply

Pre-purchase plans are evaluated only after all reservation scopes. They follow the same scope order from narrowest to broadest:

1. **Resource group**
2. **Subscription**
3. **Management group**
4. **Shared** (billing profile or enrollment)

### Key behaviors

- **Balance draws down** — Eligible usage reduces the balance. When it reaches zero, further usage is billed at pay-as-you-go rates.
- **Earliest expiry first** — If you have multiple plans of the same type at the same scope, the plan expiring soonest is used first. This helps avoid losing unused commit units.
- **Targeted plans first** — If multiple plan types could cover the same usage, the more specific plan applies first. For example, a [GitHub AI Credits pre-purchase plan](github-ai-credits-pre-purchase-plan.md) applies before a broader [Microsoft Agent pre-purchase plan](agent-pre-purchase.md).
- **Overflow** — When one plan runs out, remaining usage is evaluated against other eligible plans before pay-as-you-go.

## Priority order summary

| Priority | Benefit type | Scope |
|:---:|---|---|
| 1 | Reservation | Resource group |
| 2 | Reservation | Subscription |
| 3 | Reservation | Management group |
| 4 | Reservation | Shared (billing profile or enrollment) |
| 5 | Pre-purchase plan | Resource group |
| 6 | Pre-purchase plan | Subscription |
| 7 | Pre-purchase plan | Management group |
| 8 | Pre-purchase plan | Shared (billing profile or enrollment) |
| 9 | Pay-as-you-go | — |

## Examples

### Example 1: Reservation covers the VM

**Setup:** You have a D4s_v3 VM reservation scoped to Subscription A. You also have a Microsoft Agent pre-purchase plan on the same subscription. A D4s_v3 VM runs in Subscription A.

**Result:** The reservation covers the full VM cost. The pre-purchase plan balance stays intact for other eligible usage like Microsoft Copilot Studio or Microsoft Foundry.

### Example 2: Partial reservation coverage

**Setup:** You have a D4s_v3 reservation scoped to a resource group. You run a D8s_v3 VM in that resource group.

**Result:** With [instance size flexibility](instance-size-flexibility.md), the D4s_v3 reservation covers half of the D8s_v3 usage (ratio 4 out of 8). The remaining 50% is evaluated against Azure savings plans, then pay-as-you-go.

### Example 3: No reservation match

**Setup:** You have a Microsoft Agent pre-purchase plan. Your organization uses Microsoft Copilot Studio. No reservation exists for this service.

**Result:** No reservation matches. The pre-purchase plan covers the usage, and commit units are drawn from the balance.

### Example 4: Multiple pre-purchase plans

**Setup:** You have both a **GitHub AI Credits pre-purchase plan** and a broader **Microsoft Agent pre-purchase plan**. Your organization uses GitHub Copilot.

**Result:** The more targeted GitHub AI Credits plan is used first. When it runs out, remaining usage draws from the Microsoft Agent pre-purchase plan. After both run out, usage is billed at pay-as-you-go rates.

## Related content

- [How a reservation discount is applied](reservation-discount-application.md)
- [Instance size flexibility for reservations](instance-size-flexibility.md)
- [What are Azure Reservations?](save-compute-costs-reservations.md)
- [Microsoft Agent prepurchase plan](agent-pre-purchase.md)
- [GitHub pre-purchase plan](github-pre-purchase.md)
- [GitHub AI Credits pre-purchase plan](github-ai-credits-pre-purchase-plan.md)
