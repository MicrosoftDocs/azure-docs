---
title: Azure Deployment Environments retirement guide
titleSuffix: Azure Deployment Environments
description: Plan for Azure Deployment Environments retirement by inventorying resources, selecting replacement workflows, migrating users, and cleaning up resources.
ms.service: azure-deployment-environments
ms.topic: upgrade-and-migration-article
ms.custom: doc-kit-assisted
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/04/2026
# customer intent: As a platform engineer or business decision maker, I want to plan for Azure Deployment Environments retirement so that I can transition workflows and clean up resources before retirement.
---

# Azure Deployment Environments retirement guide

Azure Deployment Environments retires on February 22, 2027. Start developing your retirement plan now so that you can inventory existing environments, validate replacement workflows, and complete migration and cleanup before retirement.

[!INCLUDE [note-deployment-environments-retirement](includes/note-deployment-environments-retirement.md)]

## Call to action

- Start establishing a retirement plan now. Inventory ADE environments, definitions, catalogs, environment types, projects, dev centers, deployment subscriptions, identities, and role assignments.
- Select and validate a replacement approach for each ADE scenario, including governance, access control, infrastructure-as-code, networking, cost management, lifecycle, and developer self-service requirements.
- Move users and automation to the replacement workflow before February 22, 2027.
- Delete unused environments and customer-owned Azure resources to reduce costs and formally offboard from ADE.

> [!IMPORTANT]
> Microsoft Dev Box has a separate retirement date of September 18, 2028. Don't delete shared Dev Center resources until you confirm that they have no remaining Microsoft Dev Box dependency.

## Transition guidance overview

Review Microsoft, Azure, and partner solutions that can support your development-environment scenarios. ADE doesn't have a single one-to-one replacement for every workload, so evaluate each option against your technical and organizational requirements.

### Microsoft solutions

Consider these Microsoft and Azure approaches as replacements for Azure Deployment Environments.

#### Azure Resource Manager and Bicep

Consider direct infrastructure-as-code deployment with Azure Resource Manager templates or Bicep when your teams can manage subscriptions, resource groups, identities, policy, deployment orchestration, and lifecycle controls through existing platform-engineering processes.

#### Azure verified modules

Consider reusable Azure verified modules when teams need standardized, governed building blocks for Azure resources. Validate module coverage, versioning, policy integration, and ownership before migration.

#### Azure DevOps and GitHub workflows

Consider CI/CD workflows when environment provisioning can be integrated into repositories and pipelines. Rebuild ADE-specific commands, SDK integrations, and **azd** configuration that targets the Dev Center platform.

### Azure partner solutions

None of the third-party solutions we identified directly support a Bicep or ARM lifecycle.  Use Bicep or ARM directly in Azure for deployment.

Before selecting a solution, test representative create, update, delete, policy, identity, logging, failure-recovery, and cost-management scenarios.

## Common questions about Azure Deployment Environments retirement

### When will Azure Deployment Environments retire?

Azure Deployment Environments retires on February 22, 2027. Complete production migration before this date.

### What happens on the retirement date?

ADE create, deploy, redeploy, and other write operations are expected to be blocked. Inventory, read, log, and delete operations are planned to remain available for a time-bound cleanup period.

### Does ADE retirement also retire Microsoft Dev Box?

No. Microsoft Dev Box has a separate retirement date of 18 September 2028. Dev Box definitions, images, pools, schedules, network connections, and user operations continue on the ADE retirement date.

### Can I delete shared dev centers and projects?

Only after you confirm they have no remaining Dev Box dependency. Map projects to their linked dev center and check for Dev Box pools or other Dev Box resources before deleting shared parent resources.

### How do I identify affected resources?

Use the [Service Retirement workbook](/azure/advisor/advisor-workbook-service-retirement) and [Azure Resource Graph](../governance/resource-graph/overview.md) to identify ADE host and control-plane resources in subscriptions you can access. ADE environment instances don't have Azure Resource Manager resource IDs, so inventory deployed environments separately through the developer portal, Azure CLI, ADE data-plane APIs, or existing operational telemetry.

### How do I migrate my environments?

Preserve templates, catalog source references, parameters, and configuration. Choose a target platform. Rebuild provisioning automation. Validate governance and lifecycle controls. Test representative deployments and recovery procedures. Move users and automation before retirement.

### How do I delete ADE environments?

- Open each environment in the developer portal and review its details and deployment resource group.
- Delete the environment and confirm the deletion scope.
- Open the deployment resource group in the Azure portal and verify which resources were removed.
- Delete customer-owned resources that remain and are no longer required.
- Remove ADE-only environment types, definitions, catalogs, identities, role assignments, and elevated deployment permissions after dependencies are gone.

### Does deleting an environment stop all charges?

Not necessarily. Deleting ADE metadata might not delete every Azure resource that the environment deployed. Resources outside the managed deployment resource group can continue running and incurring charges until you delete them. Review Azure Cost Management data to confirm that intended billing has stopped.

### Where can I get help?

Use Microsoft Q&A for community guidance. If you have an Azure support plan and need technical assistance, create an Azure support request.

## Related content

- [Azure Deployment Environments documentation | Microsoft Learn](index.yml)
