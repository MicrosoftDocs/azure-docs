---
title: include
ms.date: 02/18/2024
ms.topic: include
---

<!-- docutune:disable -->

Microsoft Sentinel uses a service account to run playbooks on incidents, to add security and enable the automation rules API to support CI/CD use cases. This service account is used for incident-triggered playbooks, or when you run a playbook manually on a specific incident.

In addition to your own roles and permissions, this Microsoft Sentinel service account must have its own set of permissions on the resource group where the playbook resides, in the form of the **Microsoft Sentinel Automation Contributor** role. Once Microsoft Sentinel has this role, it can run any playbook in the relevant resource group, manually or from an automation rule.

To grant Microsoft Sentinel with the required permissions, you must have an **Owner** or **User access administrator** role. To run the playbooks, you'll also need the **Logic App Contributor** role on the resource group that contains the playbooks you want to run.