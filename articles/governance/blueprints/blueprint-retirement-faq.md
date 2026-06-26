---
title: Azure Blueprints retirement FAQ
description: Frequently asked questions about the Azure Blueprints retirement, including what changes at retirement, data retention, deny-assignment impact, and migration to Azure Deployment Stacks and template specs.
author: mumian
ms.author: jgao
ms.service: azure-blueprints
ms.topic: concept-article
ms.date: 06/26/2026
---

# Azure Blueprints retirement FAQ

Azure Blueprints (Preview) is retired on **January 31, 2027**, with a phased retirement beginning
July 31, 2026. For the phased timeline and migration recommendation, see
[Azure Blueprints retirement](./blueprint-retirement.md). This article answers common questions
about the retirement.

## Frequently asked questions

### What happens if I don't migrate?

After January 31, 2027, Blueprints can no longer be modified, all Blueprint Locks (Deny
Assignments) are removed, and Blueprint Definitions and Assignments are removed from the portal.
Resources previously deployed by Blueprints remain in place and inherit parent RBAC, but any
policy/permission enforcement that depended on Deny Assignments is gone. Customers without a
migration plan effectively lose the management and lock-enforcement layer Blueprints provided.

#### Will existing Blueprint definitions and assignments remain readable or manageable for some time?

They shouldn't be relied on past the retirement date. Definitions and Assignments are **removed at
retirement**. Before retirement, the service phases down to **read + delete only** (30 days before
retirement).

### Will resources previously deployed through Blueprints remain in place?

Yes. Resources deployed by Blueprints **remain in place** unless you delete them. The main impact
is on the **management surface** (Blueprint Definitions, Assignments, and Locks). The one exception
is **Blueprint Locks (Deny Assignments)**, which are removed at retirement — this can have a real
impact on the deployed resources' effective permissions.

### Does Microsoft still recommend a full migration for a tenant planned for retirement?

Yes. Microsoft recommends migration to **Deployment Stacks** (preferred) or template specs.
Starting January 31, 2027, Blueprint updates are no longer possible (effectively delete-only),
Locks (Deny Assignments) are removed, and Blueprints is retired. Any definitions, versions, and
assignments you haven't exported are permanently deleted at retirement and can't be recovered, so
export anything you want to keep before January 31, 2027.

### Which management options remain available in each phase?

| Phase | Portal | PowerShell / REST API | Read | Create | Update | Delete |
|-------|--------|-----------------------|------|--------|--------|--------|
| Phase 1 (on announce) | Yes | Yes | Yes | Definitions: No (net-new disabled). Assignments: Yes | Yes | Yes |
| Phase 2 (~T+90) | Yes | Yes | Yes | Assignments: No. Definitions: No | Definitions: No. Assignments: Yes | Yes |
| Phase 3 (~T-30) | Yes | Yes | Yes | No | No (PUT fully disabled) | Yes |
| Phase 4 (retired, Jan 31, 2027) | Removed | CLI/PS commands postponed (Apr/May 2027). REST: read/delete only until removed | Read goes away as the service is removed | No | No | Delete-only window until full service removal |

### Once retired, are Blueprint Locks / Deny Assignments removed automatically, even if I take no action?

Yes. At retirement, Microsoft removes all remaining Blueprint Locks (Deny Assignments)
automatically.

### Apart from the locks, do later phases affect my ability to view, export, or delete existing definitions and assignments?

Through Phase 3, **read and delete remain available**. At Phase 4 (retirement), Definitions and
Assignments are removed from the portal and ultimately deleted. Export anything you want to
preserve before the retirement date.

### For a tenant already planned for decommissioning, can I take a limited approach instead of full migration?

The recommended path is to start migration as soon as possible and complete it before the
retirement date. A limited "export + standard Azure resource locks" approach is acceptable when
the tenant itself is on a near-term decommissioning timeline, but Microsoft recommends Deployment
Stacks for any workload that outlives the retirement.

### Removing Deny Assignments effectively widens RBAC in my org. How do I retain that protection?

Manage the workload under a Deployment Stack. Deployment Stacks provide the equivalent
management-plane protection, including deny settings, in a supported, forward-going service.

### How can I identify where Azure Blueprints is being used in my environment?

You can identify Azure Blueprints usage in two ways:

- **Azure Advisor** surfaces a recommendation highlighting subscriptions and management groups
  where Blueprints is in use.
- You can review the **Azure Blueprints blade in the Azure portal** to see your existing blueprint
  definitions and assignments directly.

### What's the recommended replacement for Azure Blueprints?

**Azure Deployment Stacks** is the recommended replacement. It provides the core capabilities you
rely on in Blueprints, including:

- Grouping and managing a collection of resources as a single unit.
- Lifecycle management across create, update, and delete operations.
- Enforcing protection on managed resources through **deny assignments**.

Depending on your needs, you can also publish your definitions as **template specs** or store them
in a **Git repository** to take advantage of versioning.

### Will I lose the resource-lock (deny assignment) protection that Blueprints provides?

Before retirement, migrate your managed resources to a **Deployment Stack** and configure **deny
assignments** on the stack to preserve the same lock behavior you have today. Plan this migration
early — it's an important step to avoid any gap in protection.

## Next steps

- [Azure Blueprints retirement](./blueprint-retirement.md)
- [Migrate Azure Blueprints to template specs](./migrate-to-template-specs.md)
- [Migrate blueprints to deployment stacks](../../azure-resource-manager/bicep/migrate-blueprint.md)
