---
title: Move a Function app to another region
description: Learn how to move Azure Functions resources from one region to another by creating a copy of your existing Azure Function resources in the target region.

ms.topic: how-to
author: nzthiago
ms.date: 05/11/2021
ms.custom: subject-moving-resources

#Customer intent: As an Azure service administrator, I want to move my Azure Functions resources to another Azure region.
---

# Move an Azure Function resource to another region

This article describes how to move Azure Functions resources to a different Azure region. You might move your resources to another region for a number of reasons. For example, to take advantage of a new Azure region, to deploy features or services available in specific regions only, to meet internal policy and governance requirements, or in response to capacity planning requirements.

Azure Functions resources are region-specific and can't be moved across regions. You must create a copy of your existing Azure Function resources in the target region, then redeploy your Function over to the new app. If your source app uses a custom domain, you can [migrate it to the new app in the target region](../app-service/manage-custom-dns-migrate-domain.md) when you're finished.

## Prerequisites

- Make sure that the target region supports Azure Functions and any related service whose resources you want to move.
- Have access to the original source code for the Azure Functions being migrated.

## Prepare

Identify all the Azure Functions resources used on the source region. For example:

- Azure Function apps
- [Function App plans](functions-scale.md#overview-of-plans)
- [Deployment slots](functions-deployment-slots.md)
- [Custom domains purchased in Azure](../app-service/manage-custom-dns-buy-domain.md)
- [TLS/SSL certificates and settings](../app-service/configure-ssl-certificate.md)
- [Configured networking options](functions-networking-options.md)
- [Managed identities](../app-service/overview-managed-identity.md)
- [Configured App Settings](functions-how-to-use-azure-function-app-settings.md) - users with the enough access can copy all the source App Settings by using the Advanced Edit feature in the portal
- [Application Insights connections](functions-monitoring.md)
- [Scaling configurations](functions-scale.md#scale)

Certain resources that Azure Functions trigger from or connect to with Bindings contain integration with other Azure services. For information on how to move those resources across regions, see the documentation for the respective services.

## Move

If you have access to the deployment and automation resources that created the Azure Functions in the source region, re-run the same deployment steps in the target region to create and redeploy your Azure Functions. 

If you only have access to the source code but not the deployment and automation resources, deploy and configure the Azure Functions on the target region using any of the available [deployment technologies](functions-deployment-technologies.md) or using one of the [continuous deployment methods](functions-continuous-deployment.md).

Review and configure the resources identified in the Prepare step above in the target region if they weren't configured during the deploy.

Note the following:
- If your deployment resources and automation does not create a Function App, [create an app of the same type in a new Azure Function plan](functions-scale.md#overview-of-plans) in the target region.
- Azure Function App names are globally unique. So the app in the target region can't have the same name as the one in the source region.
- References and app settings that connect your Azure Function to dependencies need to be reviewed and updated. For example, if you have moved a database that your Functions call, the App Settings or configuration to connect to the database in the target region need to be updated as well.
- After configuring everything else in your target app to be the same as the source app, verify your configuration and test the target Functions.
- If you had custom domain configured, [remap the domain name](../app-service/manage-custom-dns-migrate-domain.md#remap-the-active-dns-name).

## Clean up source resources

Delete the Azure Function app and App Service plan in the source region. An Azure Function app plan in the Premium or Dedicated tiers carry a charge even if no app is running in it.

Alternately, consider running your Azure Function in both regions with a disaster recovery architecture:
- [Azure Functions geo-disaster recovery](functions-geo-disaster-recovery.md)
- [Disaster recovery and geo-distribution in Azure Durable Functions](durable/durable-functions-disaster-recovery-geo-distribution.md)

## Next steps

- For Functions running on Dedicated App Service plans, also review the [App Service Migration Plan](../app-service/manage-move-across-regions.md)
- Review the [Azure Architecture Center](/azure/architecture/browse/?expanded=azure&products=azure-functions) for examples of Azure Functions running in multiple regions as part of more advanced solution architectures
