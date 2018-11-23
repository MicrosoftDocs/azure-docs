---
title: Migrate from Azure Germany to global Azure
description: Introduction to migrating from Azure Germany to global Azure
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Overview of migration guidance for Azure Germany

These articles in this section provide guidance for migrating your workloads from Azure Germany to global Azure. Although Azure provides tools in the [Azure Migration Center](https://azure.microsoft.com/migration/) to migrate resources, some of the tools in the Azure Migration Center are designed only for migrations that occur inside the same tenant or in the same region.

The two regions in Germany are entirely separate from global Azure. The clouds in global Azure and in Germany have their own, separate Azure Active Directory (Azure AD) instances. Because of this, Azure tenants are always different between global Azure and Azure Germany. Some of the standard migration tools are based on moving resources inside the *same* tenant. When migrating between *different* tenants, below is a list of tools available.

## Migration process

The process of migrating a workload from Azure Germany to global Azure typically follows processes that are similar to the processes that are used to migrate applications to the cloud. The steps in the migration process are:
- Assess
- Plan
- Migrate
- Validate

![Image that shows the four steps in the migration process: Assess, Plan, Migrate, Validate](./media/germany-migration-main/migration-steps.png)

### Assess

It's important to understand your organization's Azure Germany footprint by bringing together Azure account owners, subscription admins, tenant admins, and finance and accounting teams. Together, the people who work in these roles will provide a complete picture of Azure usage for a large organization.

In the assessment stage, compile an inventory of resources:
  - Each subscription admin and tenant admin should execute a series of scripts to list resource groups, the resources within each of the resource groups, and resource group deployment settings.
  - Document dependencies across applications in Azure and with external systems.
  - Document the count of each Azure resource and the amount of data associated with each instance that needs to be migrated.
  - Ensure that application architecture documents are consistent with the Azure resources list.

At the end of the Assess stage, you'll have:

- A complete list of Azure resources that are in use.
- Dependencies across those resources.
- The complexity of the migration effort.

### Plan

In the planning stage, complete the following tasks:

- Use the output of the dependency analysis from the assessment stage to define related components. Consider migrating related components together in a *migration package*.
- (Optional) Use the migration as an opportunity to apply [Gartner 5-R criteria](https://www.gartner.com/newsroom/id/1684114) and optimize your workload.
- Determine the target environment in global Azure:
  - Identify the target global Azure tenant (if your organization doesn't already have a presence, create one).
  - Create subscriptions.
  - Choose which global Azure location you want to migrate.
  - Execute test migration scenarios that match your architecture, from Azure Germany to Azure global.
- Determine the appropriate timeline and schedule for migration. Create a user acceptance test plan for each migration package.

### Migrate

In the migration phase, use the tools, techniques, and recommendations in this article to create new resources in Azure global. Then, configure applications.

### Validate

In the validation stage, complete the following tasks:

- Perform user acceptance testing.
- Ensure that applications are working as expected.
- Sync the latest data to the target environment, if applicable.
- Cut over to a new application instance in Azure global.
- Confirm that the production environment is working as expected.
- Decommission resources in Azure Germany.

## Terms

These terms are used in the Azure Germany migration articles:

**Source** describes where you come from (for example, Azure Germany):

- **Source tenant name**: The name of the tenant in Azure Germany (everything after **@** in the account name). Tenant names in Azure Germany all end in **microsoftazure.de**.
- **Source tenant ID**: The ID of the tenant in Azure Germany. The tenant ID shows up in the Azure portal when you move the mouse over the account name at the upper right corner.
- **Source subscription ID**: You can have more than one subscription in the same tenant. Always make sure that you're using the correct subscription.
- **Source region**: Either Germany Central (**germanycentral**) or Germany Northeast (**germanynortheast**), depending on where the resource you want to migrate is located.

**Target** or **destination** describes where you migrate to:

- **Target tenant name**: Like the source tenant name, but in Azure public.
- **Target tenant ID**: Like the source tenant ID.
- **Target subscription ID**: Like the source subscription ID
- **Target region**: You can use almost any region in global Azure. But it's likely that you want to migrate to West Europe (**westeurope**) or North Europe (**northeurope**).

> [!NOTE]
> Verify that the service you're migrating is offered in the target region. All Azure services that are available in Azure Germany are available in West Europe. All Azure services that are available in Azure Germany are also available in North Europe except for the G/GS VM series in Azure Virtual Machines and Azure Machine Learning Studio.

It's a good idea to bookmark the global Azure portal in your browser.
- The Azure Germany portal is at [https://portal.microsoftazure.de/](https://portal.microsoftazure.de/).
- The global Azure portal is at [https://portal.azure.com/](https://portal.azure.com/).

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Web](./germany-migration-web.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [Internet of Things (IoT)](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Management Tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)
