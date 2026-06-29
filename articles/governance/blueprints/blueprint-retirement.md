---
title: Azure Blueprints retirement
description: Learn when Azure Blueprints is retired, the phased retirement timeline, what changes in each phase, and how to migrate to Azure Deployment Stacks and template specs.
author: mumian
ms.author: jgao
ms.service: azure-blueprints
ms.topic: concept-article
ms.date: 06/26/2026
---

# Azure Blueprints retirement

Azure Blueprints (Preview) is being retired. The retirement was originally announced on
September 14, 2023 with a retirement date of July 11, 2026. That timeline has been extended to
**January 31, 2027**, with a **phased retirement beginning July 31, 2026**.

This article explains the phased timeline, what changes at each phase, and how to migrate. For
answers to common questions, see the [Azure Blueprints retirement FAQ](./blueprint-retirement-faq.md).

## Phased retirement timeline

| Date | What changes |
|------|--------------|
| **July 31, 2026** | New blueprint definitions and versions can no longer be created. |
| **October 31, 2026** | Existing blueprint definitions can no longer be modified. New blueprint assignments can no longer be created. |
| **December 31, 2026** | Existing blueprint assignments can no longer be modified. |
| **January 31, 2027** | Azure Blueprints is retired. The API no longer responds. Az CLI and Azure PowerShell commands stop functioning. Blueprints is removed from the Azure portal. Blueprint definitions, versions, and assignments that aren't exported are automatically deleted. Blueprint locks ("Do Not Delete" and "Read Only") stop functioning. Resources created through blueprints remain and aren't deleted. |

> [!IMPORTANT]
> Export any blueprint definitions, versions, and assignments you want to keep **before January
> 31, 2027**. Definitions, versions, and assignments that aren't exported are permanently deleted
> at retirement and can't be recovered.

## What remains available in each phase

| Phase | Portal | PowerShell / REST API | Read | Create | Update | Delete |
|-------|--------|-----------------------|------|--------|--------|--------|
| Phase 1 (on announce) | Yes | Yes | Yes | Definitions: No (net-new disabled). Assignments: Yes | Yes | Yes |
| Phase 2 (~T+90) | Yes | Yes | Yes | Assignments: No. Definitions: No | Definitions: No. Assignments: Yes | Yes |
| Phase 3 (~T-30) | Yes | Yes | Yes | No | No (PUT fully disabled) | Yes |
| Phase 4 (retired, Jan 31, 2027) | Removed | CLI/PS commands postponed (Apr/May 2027). REST: read/delete only until removed | Read goes away as the service is removed | No | No | Delete-only window until full service removal |

## Identify where Azure Blueprints is used

You can identify Azure Blueprints usage in two ways:

- **Azure Advisor** surfaces a recommendation highlighting subscriptions and management groups
  where Blueprints is in use.
- The **Azure Blueprints blade in the Azure portal** lists your existing blueprint definitions and
  assignments directly.

## Recommended migration

Migrate to **[Azure Deployment Stacks](../../azure-resource-manager/bicep/deployment-stacks.md)**
(recommended) for resource grouping, lifecycle management, and deny-assignment enforcement. Publish
your definitions as **[template specs](../../azure-resource-manager/bicep/template-specs.md)** or
store them in a template folder in Git to get the benefit of versioning. Export your blueprint data
before January 31, 2027.

## Choose a replacement

Azure Blueprints capabilities are replaced by two complementary features: **Azure Deployment
Stacks** and **template specs**. Azure Blueprints combined two distinct jobs that are now handled by
separate, purpose-built features:

- **Storing and versioning artifacts** (definitions) → **template specs** (or a Git repository).
- **Assigning, deploying, managing lifecycle, and locking resources** (assignments) → **Azure
  Deployment Stacks**.

You typically use deployment stacks and template specs *together*: store your template as a
template spec, then deploy and govern it with a deployment stack.

### Feature comparison

| Capability | Azure Blueprints (retiring) | Azure Deployment Stacks | Template specs |
|------------|-----------------------------|-------------------------|----------------|
| Primary role | Package + assign governance artifacts | Deploy and manage a resource collection as a unit | Store and version a template in Azure |
| Status | Preview, retiring Jan 31, 2027 | Generally available | Generally available |
| Group resources as a unit | Yes (assignment) | Yes (stack) | No (storage only) |
| Lifecycle management (create/update/delete) | Partial | Yes | No |
| Resource locking / deny enforcement | Yes (blueprint locks) | Yes (deny settings) | No |
| Versioning | Yes (definition versions) | Yes, via template specs or Git | Yes (template spec versions) |
| Policy + role assignments | Yes (artifacts) | Yes (defined in ARM / Bicep template) | Yes (defined in ARM / Bicep template) |
| Scope | Subscription, management group | Resource group, subscription, management group | Resource group |
| Authoring | Blueprint artifacts | ARM template / Bicep | ARM template / Bicep |

### Which one should I use?

- **Use Azure Deployment Stacks** when you need the management-plane behavior of blueprint
  assignments: grouping resources, lifecycle management, and **deny-assignment locking**. This is
  the recommended replacement for most customers.
- **Use template specs** when you need to store and version a template in Azure and share it across
  your organization — the role blueprint *definitions* played. Deploy the template spec with a
  deployment stack to also get lifecycle and locking.
- **Use a Git repository** instead of template specs when you prefer to manage templates as code
  with pull-request review, and deploy them with deployment stacks from a pipeline.

In most migrations, you'll combine **template specs (or Git) for storage/versioning** with
**deployment stacks for deployment, lifecycle, and locking** — together they cover everything
Azure Blueprints provided.

## Next steps

- [Azure Blueprints retirement FAQ](./blueprint-retirement-faq.md)
- [Migrate Azure Blueprints to template specs](./migrate-to-template-specs.md)
- [Migrate to deployment stacks](../../azure-resource-manager/bicep/migrate-blueprint.md)
