---
title: Azure Native Dynatrace Service overview
description: Learn about using the Dynatrace Cloud-Native Observability Platform in Azure Marketplace.
ms.topic: overview
ms.date: 03/13/2025
---

# What is Azure Native Dynatrace Service?

## Overview

[!INCLUDE [what-is](../includes/what-is.md)]

Microsoft and [Dynatrace](https://www.dynatrace.com/) developed this service and manage it together.

You can find Azure Native Dynatrace Service in the [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Dynatrace.Observability%2Fmonitors) or get it on [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/dynatrace.dynatrace_portal_integration?tab=Overview).

Dynatrace is a monitoring solution that provides deep cloud observability, advanced AIOps, and continuous runtime application security capabilities in Azure.

The Azure Native Dynatrace Service offering in Azure Marketplace enables you to create and manage Dynatrace environments using the Azure portal with a seamlessly integrated experience. This integration enables you to use Dynatrace as a monitoring solution for your Azure workloads through a streamlined workflow, starting from procurement, all the way to configuration and management.

You can create and manage the Dynatrace resources using the Azure portal through a resource provider named `Dynatrace.Observability`. Dynatrace owns and runs the software as a service (SaaS) application including the Dynatrace environments created through this experience.

> [!NOTE]
> Azure Native Dynatrace Service stores and processes customer data only in the region where the service was deployed. No data is stored outside of that region.

## Capabilities

Azure Native Dynatrace Service provides the following capabilities:

- **Seamless onboarding** - Easily onboard and use Dynatrace as natively integrated service on Azure.
- **Unified billing** - Get a single bill for all the resources you consume on Azure, including Dynatrace.
- **Single-Sign on to Dynatrace** - You need not sign-up or sign in separately to Dynatrace. Sign in once in the Azure portal and seamlessly transition to Dynatrace portal when needed.
- **Log monitoring** - Enables automated monitoring of subscription activity and resource logs to Dynatrace
- **Manage Dynatrace OneAgent on VMs and App Services** - Provides a single experience to install and uninstall Dynatrace OneAgent on virtual machines and App Services.

### Billing

When you use the integrated Dynatrace experience in Azure portal, the following entities are created and mapped for monitoring and billing purposes.

- **Dynatrace resource in Azure** - Using the Dynatrace resource, you can manage the Dynatrace environment in Azure. The resource is created in the Azure subscription and resource group that you select during the create process or linking process.
- **Dynatrace environment** - The Dynatrace environment on Dynatrace _Software as a Service_ (SaaS). When you create a new environment, the environment on Dynatrace SaaS is automatically created, in addition to the Dynatrace resource in Azure.
- **Marketplace SaaS resource** - The SaaS resource is created automatically, based on the plan you select from the Dynatrace Marketplace offer. This resource is used for billing purposes.

## Subscribe to Dynatrace

[!INCLUDE [subscribe](../includes/subscribe.md)] *Dynatrace*.

[!INCLUDE [subscribe](../includes/subscribe-from-azure-portal.md)]

## Dynatrace links

For more help using Azure Native Dynatrace Service, go to the [Dynatrace](https://dt-url.net/azurenativedynatraceservice) documentation.

## Next step

> [!div class="nextstepaction"]
> [Configure pre-deployment](configure-prerequisites.md)
