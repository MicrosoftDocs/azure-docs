---
title: Elastic integrations overview
description: Learn about using the Elastic Cloud-Native Observability Platform in Azure Marketplace.
ms.topic: overview
ms.date: 07/01/2025
ai-usage: ai-assisted
---

# What is Elastic in Azure?

[!INCLUDE [what-is](../includes/what-is.md)]

Elastic on Azure is a set of managed services that deliver search, log analytics, and security monitoring functions for Azure environments.

## What is it used for?

Elastic in Azure is used to implement distributed search, log aggregation, application performance monitoring, and security event analysis for Azure-based workloads. The three main services are:

- **Elastic Cloud (Elasticsearch)** – A managed Elasticsearch service for storing, searching, and analyzing structured and unstructured data.
- **Elastic Observability** – Collects and analyzes telemetry data (logs, metrics, traces) to monitor the performance and health of applications and infrastructure.
- **Elastic Security** – Collects and analyzes security-related data to support threat detection, investigation, and response across Azure resources. 

Microsoft and [Elastic](https://www.elastic.co/) developed these services and manage them together.

You can provision the Elastic resources through a resource provider named **Microsoft.Elastic**. Data is stored in the Azure region where the service is deployed. Elastic owns and runs the SaaS application including the Elastic accounts created.

You can find Elastic offerings in the [Azure portal](https://portal.azure.com/) or get it on [Azure Marketplace](https://azuremarketplace.microsoft.com/).

## Key features

The Elastic integration with Azure includes the following technical capabilities:

- **Integrated onboarding** – Deploy Elastic resources directly from the Azure portal using the Microsoft.Elastic resource provider.
- **Azure billing integration** – Track Elastic resource consumption and charges through the Azure billing system.
- **Azure Active Directory authentication** – Access Elastic services using Azure AD credentials for single sign-on.
- **Log forwarding** – Route Azure subscription activity and resource logs to Elastic for indexing and analysis.
- **Centralized management** – Configure and monitor log shipping from Azure services to Elastic through a unified interface.
- **Flexible deployment options** – Choose between serverless projects for usage-based scaling and cloud-hosted projects for dedicated, managed clusters.
- **Elastic Agent deployment** – Deploy and manage Elastic agents on Azure virtual machines using integrated workflows.

## Subscribe to Elastic

[!INCLUDE [subscribe](../includes/subscribe.md)]

- ElasticCloud (Elasticsearch)
- Elastic Observability
- Elastic Security

[!INCLUDE [subscribe](../includes/subscribe-from-azure-portal.md)]

## Elastic links

For more help using the Elastic service, see the [Elastic documentation](https://www.elastic.co/guide/en/cloud/current/ec-azure-marketplace-native.html) for Azure integration.

## Next step

> [!div class="nextstepaction"]
> [QuickStart: Get started with Elastic](create.md)
