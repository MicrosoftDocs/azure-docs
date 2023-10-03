---
title: Suspended domains in Microsoft Entra Domain Services | Microsoft Docs
description: Learn about the different health states for a Microsoft Entra Domain Services managed domain and how to restore a suspended domain.
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: 95e1d8da-60c7-4fc1-987d-f48fde56a8cb
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 09/15/2023
ms.author: justinha

---
# Understand the health states and resolve suspended domains in Microsoft Entra Domain Services

When Microsoft Entra Domain Services is unable to service a managed domain for a long period of time, it puts the managed domain into a suspended state. If a managed domain remains in a suspended state, it's automatically deleted. To keep your Domain Services managed domain healthy and avoid suspension, resolve any alerts as quickly as you can.

This article explains why managed domains are suspended, and how to recover a suspended domain.

## Overview of managed domain states

Through the lifecycle of a managed domain, there are different states that indicate its health. If the managed domain reports an issue, quickly resolve the underlying cause to stop the state from continuing to degrade.

![The progression of states that a managed domain takes towards suspension](media/active-directory-domain-services-suspension/suspension-timeline.PNG)

A managed domain can be in one of the following states:

* [Running](#running-state)
* [Needs attention](#needs-attention-state)
* [Suspended](#suspended-state)
* [Deleted](#deleted-state)

## Running state

A managed domain that's configured correctly and without problems is in the *Running* state. This is the desired state for a managed domain.

### What to expect

* The Azure platform can regularly monitor the health of the managed domain.
* Domain controllers for the managed domain are patched and updated regularly.
* Changes from Microsoft Entra ID are regularly synchronized to the managed domain.
* Regular backups are taken for the managed domain.

## Needs Attention state

A managed domain with one or more issues that need to be fixed is in the *Needs attention* state. The health page for the managed domain lists the alerts, and indicate where there's a problem.

Some alerts are transient and are automatically resolved by the Azure platform. For other alerts, you can fix the issue by following the resolution steps provided. It there's a critical alert, [open an Azure support request][azure-support] for additional troubleshooting assistance.

One example of an alert is when there's a restrictive network security group. In this configuration, the Azure platform may not be able to update and monitor the managed domain. An alert is generated, and the state changes to *Needs attention*.

For more information, see [How to troubleshoot alerts for a managed domain][resolve-alerts].

### What to expect

When a managed domain is in the *Needs Attention* state, the Azure platform may not be able to monitor, patch, update, or back-up data on a regular basis. In some cases, like an invalid network configuration, the domain controllers for the managed domain may be unreachable.

* The managed domain is in an unhealthy state and ongoing health monitoring may stop until the alert is resolved.
* Domain controllers for the managed domain can't be patched or updated.
* Changes from Microsoft Entra ID may not be synchronized to the managed domain.
* Backups for the managed domain may not be taken.
* If you resolve non-critical alerts that are impacting the managed domain, the health should return to the *Running* state.
* Critical alerts are triggered for configuration issues where the Azure platform can't reach the domain controllers. If these critical alerts aren't resolved within 15 days, the managed domain enters the *Suspended* state.

## Suspended state

A managed domain enters the **Suspended** state for one of the following reasons:

* One or more critical alerts haven't been resolved in 15 days.
    * Critical alerts can be caused by a misconfiguration that blocks access to resources that are needed by Domain Services. For example, the alert [AADDS104: Network Error][alert-nsg] has been unresolved for more than 15 days in the managed domain.
* There's a billing issue with the Azure subscription or the Azure subscription has expired.

Managed domains are suspended when the Azure platform can't manage, monitor, patch, or back up the domain. A managed domain stays in a *Suspended* state for 15 days. To maintain access to the managed domain, resolve critical alerts immediately.

### What to expect

The following behavior is experienced when a managed domain is in the *Suspended* state:

* Domain controllers for the managed domain are de-provisioned and aren't reachable within the virtual network.
* Secure LDAP access to the managed domain over the internet, if enabled, stops working.
* There are failures in authenticating to the managed domain, logging on to domain-joined VMs, or connecting over LDAP/LDAPS.
* Backups for the managed domain are no longer taken.
* Synchronization with Microsoft Entra ID stops.

### How do you know if your managed domain is suspended?

You see an [alert][resolve-alerts] on the Domain Services Health page in the Microsoft Entra admin center that notes the domain is suspended. The state of the domain also shows *Suspended*.

### Restore a suspended domain

To restore the health of a managed domain that's in the *Suspended* state, complete the following steps:

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), search for and select **Domain services**.
1. Choose your managed domain from the list, such as *aaddscontoso.com*, then select **Health**.
1. Select the alert, such as *AADDS503* or *AADDS504*, depending on the cause of suspension.
1. Choose the resolution link that's provided in the alert and follow the steps to resolve it.

A managed domain can only be restored to the date of the last backup. The date of your last backup is displayed on the **Health** page of the managed domain. Any changes that occurred after the last backup won't be restored. Backups for a managed domain are stored for up to 30 days. Backups that are older than 30 days are deleted.

After you resolve alerts when the managed domain is in the *Suspended* state, [open an Azure support request][azure-support] to return to a healthy state. If there's a backup less than 30 days old, Azure support can restore the managed domain.

## Deleted state

If a managed domain stays in the *Suspended* state for 15 days, it's deleted. This process is unrecoverable.

### What to expect

When a managed domain enters the *Deleted* state, the following behavior is seen:

* All resources and backups for the managed domain are deleted.
* You can't restore the managed domain. You must create a replacement managed domain to reuse Domain Services.
* After it's deleted, you aren't billed for the managed domain.

## Next steps

To keep your managed domain healthy and minimize the risk of it becoming suspended, learn how to [resolve alerts for your managed domain][resolve-alerts].

<!-- INTERNAL LINKS -->
[alert-nsg]: alert-nsg.md
[azure-support]: /azure/active-directory/fundamentals/how-to-get-support
[resolve-alerts]: troubleshoot-alerts.md
