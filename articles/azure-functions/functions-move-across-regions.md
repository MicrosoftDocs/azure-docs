---
title: Move your function app between regions in Azure Functions
description: Learn how to move Azure Functions resources from one region to another by creating a copy of your existing Azure Function resources in the target region.

ms.topic: how-to
ms.service: azure-functions
author: nzthiago
ms.date: 11/09/2021
ms.custom: subject-moving-resources

#Customer intent: As an Azure service administrator, I want to move my Azure Functions resources to another Azure region.
---

# Move your function app between regions in Azure Functions

This article describes how to move Azure Functions resources to a different Azure region. You might move your resources to another region for one of the following reasons:
 + Take advantage of a new Azure region
 + Deploy features or services that are available only in specific regions
 + Meet internal policy and governance requirements
 + Respond to capacity planning requirements

Azure Functions resources are region-specific and can't be moved across regions. You must create a copy of your existing function app resources in the target region, then redeploy your functions code over to the new app.

If minimal downtime is a requirement, consider running your function app in both regions to implement a disaster recovery architecture:
+ [Azure Functions geo-disaster recovery](functions-geo-disaster-recovery.md)
+ [Disaster recovery and geo-distribution in Azure Durable Functions](durable/durable-functions-disaster-recovery-geo-distribution.md)

## Prerequisites

+ Make sure that the target region supports Azure Functions and any related service whose resources you want to move
+ Have access to the original source code for the functions you're migrating

## Prepare

Identify all the function app resources used on the source region, which may include the following:

+ Function app
+ [Hosting plan](functions-scale.md#overview-of-plans)
+ [Deployment slots](functions-deployment-slots.md)
+ [Custom domains purchased in Azure](../app-service/manage-custom-dns-buy-domain.md)
+ [TLS/SSL certificates and settings](../app-service/configure-ssl-certificate.md)
+ [Configured networking options](functions-networking-options.md)
+ [Managed identities](../app-service/overview-managed-identity.md)
+ [Configured application settings](functions-how-to-use-azure-function-app-settings.md) - users with the enough access can copy all the source application settings by using the Advanced Edit feature in the portal
+ [Scaling configurations](functions-scale.md#scale)

Your functions may connect to other resources by using triggers or bindings. For information on how to move those resources across regions, see the documentation for the respective services.

You should be able to also [export a template from existing resources](../azure-resource-manager/templates/export-template-portal.md).

## Move

Deploy the function app to the target region and review the configured resources. 

### Redeploy function app

If you have access to the deployment and automation resources that created the function app in the source region, re-run the same deployment steps in the target region to create and redeploy your app. 

If you only have access to the source code but not the deployment and automation resources you can deploy and configure the function app on the target region using any of the available [deployment technologies](functions-deployment-technologies.md) or using one of the [continuous deployment methods](functions-continuous-deployment.md).

### Review configured resources

Review and configure the resources identified in the [Prepare](#prepare) step above in the target region if they weren't configured during the deploy.

### Move considerations
+ If your deployment resources and automation doesn't create a function app, [create an app of the same type in a new hosting plan](functions-scale.md#overview-of-plans) in the target region
+ Function app names are globally unique in Azure, so the app in the target region can't have the same name as the one in the source region
+ References and application settings that connect your function app to dependencies need to be reviewed and, when needed, updated. For example, when you move a database that your functions call, you must also update the application settings or configuration to connect to the database in the target region. Some application settings such as the Application Insights instrumentation key or the Azure storage account used by the function app can be already be configured on the target region and do not need to be updated
+ Remember to verify your configuration and test your functions in the target region
+ If you had custom domain configured, [remap the domain name](../app-service/manage-custom-dns-migrate-domain.md#4-remap-the-active-dns-name)
+ For Functions running on Dedicated plans also review the [App Service Migration Plan](../app-service/manage-move-across-regions.md) in case the plan is shared with web apps

## Clean up source resources

After the move is complete, delete the function app and hosting plan from the source region. You pay for function apps in Premium or Dedicated plans, even when the app itself isn't running.

## Next steps

+ Review the [Azure Architecture Center](/azure/architecture/browse/?expanded=azure&products=azure-functions) for examples of Azure Functions running in multiple regions as part of more advanced solution architectures
