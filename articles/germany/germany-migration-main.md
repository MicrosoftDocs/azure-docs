---
title: Migrate from Azure Germany to global Azure
description: An introduction to migrating your Azure resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 08/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Overview of migration guidance for Azure Germany

The articles in this section were created to help you migrate your workloads from Azure Germany to global Azure. Although the [Azure migration center](https://azure.microsoft.com/migration/) provides tools that help you migrate resources, some of the tools in the Azure migration center are useful only for migrations that occur in the same tenant or in the same region.

The two regions in Germany are entirely separate from global Azure. The clouds in global Azure and in Germany have their own, separate Azure Active Directory (Azure AD) instances. Because of this, Azure Germany tenants are separate from global Azure tenants. This article describes the migration tools that are available when you migrate between *different* tenants.

The guidance on identity / tenants is intended for Azure-only customers. If you use common Azure Active Directory (Azure AD) tenants for Azure and O365 (or other Microsoft products), there are complexities in identity migration and you should first contact your Account Manager prior to using this migration guidance.

## Migration process

The process that you use to migrate a workload from Azure Germany to global Azure typically is similar to the process that's used to migrate applications to the cloud. The steps in the migration process are:

![Image that shows the four steps in the migration process: Assess, Plan, Migrate, Validate](./media/germany-migration-main/migration-steps.png)

### Assess

It's important to understand your organization's Azure Germany footprint by bringing together Azure account owners, subscription admins, tenant admins, and finance and accounting teams. The people who work in these roles can provide a complete picture of Azure usage for a large organization.

In the assessment stage, compile an inventory of resources:
  - Each subscription admin and tenant admin should run a series of scripts to list resource groups, the resources in each resource group, and resource group deployment settings.
  - Document dependencies across applications in Azure and with external systems.
  - Document the count of each Azure resource and the amount of data that's associated with each instance you want to migrate.
  - Ensure that application architecture documents are consistent with the Azure resources list.

At the end of this stage, you have:

- A complete list of Azure resources that are in use.
- A list of dependencies between resources.
- Information about the complexity of the migration effort.

### Plan

In the planning stage, complete the following tasks:

- Use the output of the dependency analysis completed in the assessment stage to define related components. Consider migrating related components together in a *migration package*.
- (Optional) Use the migration as an opportunity to apply [Gartner 5-R criteria](https://www.gartner.com/newsroom/id/1684114) and to optimize your workload.
- Determine the target environment in global Azure:
  1. Identify the target global Azure tenant (create one, if necessary).
  1. Create subscriptions.
  1. Choose which global Azure location you want to migrate.
  1. Execute test migration scenarios that match your architecture in Azure Germany with the architecture in global Azure.
- Determine the appropriate timeline and schedule for migration. Create a user acceptance test plan for each migration package.

### Migrate

In the migration phase, use the tools, techniques, and recommendations that are discussed in the Azure Germany migration articles to create new resources in global Azure. Then, configure applications.

### Validate

In the validation stage, complete the following tasks:

1. Perform user acceptance testing.
1. Ensure that applications are working as expected.
1. Sync the latest data to the target environment, if applicable.
1. Switch to a new application instance in global Azure.
1. Verify that the production environment is working as expected.
1. Decommission resources in Azure Germany.

## Terms

These terms are used in the Azure Germany migration articles:

**Source** describes where you are migrating resources from (for example, Azure Germany):

- **Source tenant name**: The name of the tenant in Azure Germany (everything after **\@** in the account name). Tenant names in Azure Germany all end in **microsoftazure.de**.
- **Source tenant ID**: The ID of the tenant in Azure Germany. The tenant ID appears in the Azure portal when you move the mouse over the account name in the upper-right corner.
- **Source subscription ID**: The ID of the resource subscription in Azure Germany. You can have more than one subscription in the same tenant. Always make sure that you're using the correct subscription.
- **Source region**: Either Germany Central (**germanycentral**) or Germany Northeast (**germanynortheast**), depending on where the resource you want to migrate is located.

**Target** or **destination** describes where you are migrating resources to:

- **Target tenant name**: The name of the tenant in global Azure.
- **Target tenant ID**: The ID of the tenant in global Azure.
- **Target subscription ID**: The subscription ID for the resource in global Azure.
- **Target region**: You can use almost any region in global Azure. It's likely that you'll want to migrate your resources to West Europe (**westeurope**) or North Europe (**northeurope**).

> [!NOTE]
> Verify that the Azure service you're migrating is offered in the target region. All Azure services that are available in Azure Germany are available in West Europe. All Azure services that are available in Azure Germany are available in North Europe, except for Azure Machine Learning Studio and the G/GS VM series in Azure Virtual Machines.

It's a good idea to bookmark the source and target portals in your browser:

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
- [IoT](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Management tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)
