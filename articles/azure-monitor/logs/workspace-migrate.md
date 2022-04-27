---
title: Workspace consolidation migration strategy
description: This article describes the considerations and recommendations for customers preparing to deploy a workspace in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/20/2019

---

# Workspace consolidation migration strategy

For customers who have already deployed multiple workspaces and are interested in consolidating to the resource-context access model, we recommend you take an incremental approach to migrate to the recommended access model, and you don't attempt to achieve this quickly or aggressively. Following a phased approach to plan,  migrate, validate, and retire following a reasonable timeline will help avoid any unplanned incidents or unexpected impact to your cloud operations. If you do not have a data retention policy for compliance or business reasons, you need to assess the appropriate length of time to retain data in the workspace you are migrating from during the process. While you are reconfiguring resources to report to the shared workspace, you can still analyze the data in the original workspace as necessary. Once the migration is complete, if you're governed to retain data in the original workspace before the end of the retention period, don't delete it.

While planning your migration to this model, consider the following:

* Understand what industry regulations and internal policies regarding data retention you must comply with.
* Make sure that your application teams can work within the existing resource-context functionality.
* Identify the access granted to resources for your application teams and test in a development environment before implementing in production.
* Configure the workspace to enable **Use resource or workspace permissions**.
* Remove application teams permission to read and query the workspace.
* Enable and configure any monitoring solutions, Insights such as Container insights and/or Azure Monitor for VMs, your Automation account(s), and management solutions such as Update Management, Start/Stop VMs, etc., that were deployed in the original workspace.

## Next steps

To implement the security permissions and controls recommended in this guide, review [manage access to logs](./manage-access.md).
