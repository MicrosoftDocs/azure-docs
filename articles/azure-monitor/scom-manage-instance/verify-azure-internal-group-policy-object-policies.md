---
ms.assetid: 
title: Verify Azure and internal GPO policies for Azure Monitor SCOM Managed Instance
description: This article describes how to verify Azure and internal GPO policies.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Verify Azure and internal GPO policies for Azure Monitor SCOM Managed Instance

This article describes how to verify Azure and internal Group Policy Object (GPO) policies.

> [!NOTE]
> To learn about the Azure Monitor SCOM Managed Instance architecture, see [Azure Monitor SCOM Managed Instance](overview.md).

## Verify Azure policies

If any Azure policies are aimed at constraining the creation of managed resource groups, virtual machine scale sets, load balancers, managed identities, and metric alerts, make an exception for the subscription that's associated with the instance of Azure Monitor SCOM Managed Instance. This exception is necessary because the SCOM managed instance creates all these resources within the managed resource group.

Follow these steps to view the policies that are applied on a subscription:

1. Go to the specific subscription, and on the left menu under **Subscription**, select the policies.
1. On the **Policies** page, select the policy assignments and find the policy that's causing the issue.
1. Open the specific assignment and select the exemption.

   :::image type="create exemption" source="media/verify-azure-and-internal-gpo-policies/create-exemption.png" alt-text="Screenshot that shows the Create exemption page.":::

## Verify internal GPO policies

As SCOM managed instances become part of the designated domain or organizational unit (OU), any GPO policies come into play at the OU or domain level and affect the local administrators group. Consider the exclusion of the SCOM managed instance from those GPO policies.

The following policies could potentially influence the local administrator groups. Customized policies might also be in effect.

   - Review any GPO policies that might alter the configuration of the local administrator group.
   - Examine whether there are any GPO policies intended to deactivate network authentication.
   - Assess whether any policies are obstructing remote logins to the local administrator group.

> [!IMPORTANT]
> To minimize the need for extensive communication with both your Active Directory admin and network admin, see [Self-verification](self-verification-steps.md). The article outlines the procedures that the Active Directory admin and network admin use to validate their configuration changes and ensure their successful implementation. This process reduces unnecessary back-and-forth interactions from the Operations Manager admin to the Active Directory admin and the network admin. This configuration saves time for the admins.

## Next step

- [SCOM Managed Instance self-verification of steps](self-verification-steps.md)