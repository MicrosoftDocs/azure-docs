---
title: include
ms.date: 08/15/2024
ms.topic: include
---

<!-- docutune:disable -->

| Role | Description  |
|------|--------------|
| **Owner** | Lets you grant access to playbooks in the resource group. |
| **Microsoft Sentinel Contributor** |Lets you attach a playbook to an analytics or automation rule.      |
| **Microsoft Sentinel Responder** | Lets you access an incident in order to run a playbook manually, but doesn't allow you to run the playbook. |
| **Microsoft Sentinel Playbook Operator** | Lets you run a playbook manually. |
| **Microsoft Sentinel Automation Contributor** | Allows automation rules to run playbooks. This role isn't used for any other purpose. |

The following table describes required roles based on whether you select a *Consumption* or *Standard* logic app to create your playbook:

| Logic app | Azure roles | Description |
|-----------|-------------|-------------|
| Consumption | **Logic App Contributor** | Edit and manage logic apps. Run playbooks. Doesn't allow you to grant access to playbooks. |
| Consumption | **Logic App Operator** | Read, enable, and disable logic apps. Doesn't allow you to edit or update logic apps. |
| Standard | **Logic Apps Standard Operator** | Enable, resubmit, and disable workflows in a logic app. |
| Standard | **Logic Apps Standard Developer** | Create and edit logic apps. |
| Standard | **Logic Apps Standard Contributor** | Manage all aspects of a logic app. |

The **Active playbooks** tab on the **Automation** page displays all active playbooks available across any selected subscriptions. By default, a playbook can be used only within the subscription to which it belongs, unless you specifically grant Microsoft Sentinel permissions to the playbook's resource group.
