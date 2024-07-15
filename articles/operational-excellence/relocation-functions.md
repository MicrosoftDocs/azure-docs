---
title: Relocate Azure Functions app to another region
description: Learn how to relocate Azure Functions to another region.
ms.topic: how-to
ms.service: azure-functions
author: anaharris
ms.date: 07/15/2024
ms.custom: subject-relocation
#Customer intent: As an Azure service administrator, I want to move my Azure Functions resources to another Azure region.
---

# Relocate Azure Functions to another region

This article describes how to move Azure Functions to another Azure region.

[!INCLUDE [relocate-reasons](./includes/service-relocation-reason-include.md)]

Azure Functions resources are region-specific and can't be moved across regions. Instead, you must create a copy of your existing function app resources in the target region, and then redeploy your functions code over to the new app.

If minimal downtime is a requirement, consider running your function app in both regions to implement a disaster recovery architecture:

- [Reliability in Azure Functions](../reliability/reliability-functions.md#cross-region-disaster-recovery-and-business-continuity)


## Prerequisites

- Make sure that the target region supports Azure Functions and any related service whose resources you want to move
- Have access to the original source code for the functions you're migrating

## Prepare

Identify all the function app resources used on the source region, which may include the following:

- Function app
- [Hosting plan](../azure-functions/functions-scale.md#overview-of-plans)
- [Deployment slots](../azure-functions/functions-deployment-slots.md)
- [Custom domains purchased in Azure](../app-service/manage-custom-dns-buy-domain.md)
- [TLS/SSL certificates and settings](../app-service/configure-ssl-certificate.md)
- [Configured networking options](../azure-functions/functions-networking-options.md)
- [Managed identities](../app-service/overview-managed-identity.md)
- [Configured application settings](../azure-functions/functions-how-to-use-azure-function-app-settings.md) - users with the enough access can copy all the source application settings by using the Advanced Edit feature in the portal
- [Scaling configurations](../azure-functions/functions-scale.md#scale)

Your functions may connect to other resources by using triggers or bindings. For information on how to move those resources across regions, see the documentation for the respective services.

You should be able to also [export a template from existing resources](../azure-resource-manager/templates/export-template-portal.md).


## Plan

This section is a planning checklist in the following areas:

- State, Storage and downstream dependencies
- Certificates
- Configuration
- VNet Connectivity / Custom Names / DNS
- Identities
- Service Endpoints


### State, Storage and downstream dependencies

- **Determine whether your Functions App is stateful or stateless.**  Although its recommended that Functions (With the exception of Durable Functions) be stateless, and the files on the `%HOME%\site` drive should be only those required to run the deployed application and any temporary files, it's possible to store runtime application state on the `%HOME%\site` virtual drive. If your application writes state on the app shared storage path, make sure to plan how you are going to manage that state during a resource move.

    If the application uses Durable Functions, and particularly Durable Entities, the migration becomes much more application centric, and depends on the needs of the application itself. You must consider how to migrate entity state and how to reconcile the new entity state with the old service. This is particular the case, if you are doing anything more complex than a straight Active/Active + GRS Failover.

### Certificates

### Configuration

### VNet Connectivity / Custom Names / DNS

### Identities

## Relocate

If you have access to the deployment and automation resources that created the function app in the source region, re-run the same deployment steps in the target region to create and redeploy your app. 

If you only have access to the source code but not the deployment and automation resources you can deploy and configure the function app on the target region using any of the available [deployment technologies](functions-deployment-technologies.md) or using one of the [continuous deployment methods](functions-continuous-deployment.md).

### Review configured resources

Review and configure the resources identified in the [Prepare](#prepare) step above in the target region if they weren't configured during the deploy.

### Relocation  considerations
+ If your deployment resources and automation doesn't create a function app, [create an app of the same type in a new hosting plan](functions-scale.md#overview-of-plans) in the target region
+ Function app names are globally unique in Azure, so the app in the target region can't have the same name as the one in the source region
+ References and application settings that connect your function app to dependencies need to be reviewed and, when needed, updated. For example, when you move a database that your functions call, you must also update the application settings or configuration to connect to the database in the target region. Some application settings such as the Application Insights instrumentation key or the Azure storage account used by the function app can be already be configured on the target region and do not need to be updated
+ Remember to verify your configuration and test your functions in the target region
+ If you had custom domain configured, [remap the domain name](../app-service/manage-custom-dns-migrate-domain.md#4-remap-the-active-dns-name)
+ For Functions running on Dedicated plans also review the [App Service Migration Plan](../app-service/manage-move-across-regions.md) in case the plan is shared with web apps

## Clean up

After the move is complete, delete the function app and hosting plan from the source region. You pay for function apps in Premium or Dedicated plans, even when the app itself isn't running.

## Next steps

+ Review the [Azure Architecture Center](/azure/architecture/browse/?expanded=azure&products=azure-functions) for examples of Azure Functions running in multiple regions as part of more advanced solution architectures
