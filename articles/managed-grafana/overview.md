---
title: What is Azure Managed Grafana? 
description: Read an overview of Azure Managed Grafana. This article explains what Azure Managed Grafana is, its benefits and presents its service tiers.
#customer intent: As a developer, devops or data professional, I want to learn about Grafana so that I understand how to use Azure Managed Grafana.
author: maud-lv 
ms.author: malev 
ms.service: azure-managed-grafana
ms.topic: overview 
ms.date: 06/22/2025

--- 

# What is Azure Managed Grafana?

Azure Managed Grafana is a data visualization platform built on top of the Grafana software by Grafana Labs. It's built as a fully managed Azure service operated and supported by Microsoft. Grafana helps you bring together metrics, logs and traces into a single user interface. With its extensive support for data sources and graphing capabilities, you can view and analyze your application and infrastructure telemetry data in real-time.

Azure Managed Grafana is optimized for the Azure environment. It works seamlessly with many Azure services and provides the following integration features:

* Built-in support for [Azure Monitor](/azure/azure-monitor/) and [Azure Data Explorer](/azure/data-explorer/)
* User authentication and access control using Microsoft Entra identities
* Direct import of existing charts from the Azure portal

Grafana is also available within Azure Monitor. For more information, see [Difference between Azure Managed Grafana and Grafana in Azure Monitor](./faq.md#whats-the-difference-between-azure-managed-grafana-and-grafana-in-azure-monitor).

To learn more about how Grafana works, visit the [Getting Started documentation](https://grafana.com/docs/grafana/latest/getting-started/) on the Grafana Labs website.  

## Why use Azure Managed Grafana?

Azure Managed Grafana lets you bring together all your telemetry data into one place. It can access a wide variety of data sources supported, including your data stores in Azure and elsewhere. By combining charts, logs and alerts into one view, you can get a holistic view of your application and infrastructure, and correlate information across multiple datasets.

As a fully managed service, Azure Managed Grafana lets you deploy Grafana without having to deal with setup. The service provides high availability, SLA guarantees and automatic software updates.

You can share Grafana dashboards with people inside and outside of your organization and allow others to join in for monitoring or troubleshooting.

Azure Managed Grafana uses Microsoft Entra ID’s centralized identity management, which allows you to control which users can use a Grafana workspace, and you can use managed identities to access Azure data stores, such as Azure Monitor.

You can create dashboards instantaneously by importing existing charts directly from the Azure portal or by using prebuilt dashboards.

## Service tiers

Azure Managed Grafana is available in the two service tiers presented below.

| Tier      | Description                                                                                                                                                                               |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Essential (preview) | Provides the core Grafana functionalities in use with Azure data sources. Since it doesn't provide an SLA guarantee, this tier should only be used for non-production environments.   |
| Standard            | The default tier, offering better performance, more features and an SLA. It's recommended for most situations. Two instance sizes are available within the Standard tier: **X1** (default) and **X2**. The X2 size offers more memory and supports 1,000 alert rules per organization, compared to 500 for the X1 size. See [Limits and quotas](known-limitations.md#throttling-limits-and-quotas) for more details. The X2 size comes at an additional cost. |

Refer to the [Azure Managed Grafana pricing page](https://azure.microsoft.com/pricing/details/managed-grafana/) for details about the costs of each tier and instance size.

The following table lists the main features supported in each tier:

| Feature                                                                  | Essential (preview)                 | Standard                                                                                                        |
|--------------------------------------------------------------------------|-------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| [Zone redundancy](how-to-enable-zone-redundancy.md)                      | -                                   | ✔                                                                                                              |
| [Deterministic outbound IPs](how-to-deterministic-ip.md)                 | -                                   | ✔                                                                                                              |
| [Private endpoints](how-to-set-up-private-access.md)                     | -                                   | ✔                                                                                                              |
| [Alerting](https://grafana.com/docs/grafana/latest/alerting/)            | -                                   | ✔                                                                                                              |
| [Emails, via SMTP](how-to-smtp-settings.md)                              | -                                   | ✔                                                                                                              |
| [Reporting/image rendering](how-to-use-reporting-and-image-rendering.md) | -                                   | ✔                                                                                                              |
| [API keys and service accounts](how-to-service-accounts.md)              | ✔                                  | ✔                                                                                                              |
| [Data source plugins](how-to-data-source-plugins-managed-identity.md)    | Azure Monitor, Prometheus, TestData | All core plugins, including Azure Monitor and Prometheus, as well as Azure Data Explorer, GitHub, and JSON API. |
| [Grafana Enterprise](how-to-grafana-enterprise.md)                       | -                                   | Optional, with licensing costs                                                                                  |

> [!NOTE]
> You can upgrade your workspace from Essential (preview) to Standard, or increase your Standard instance size by going to **Settings** > **Configuration** > **Pricing Plans**. However, downgrading from Standard to Essential (preview) or from a larger to a smaller instance size, is not supported.

> [!NOTE]
> Grafana Enterprise is an option within the Standard plan, not a separate plan within Azure.

## Quotas

Different quotas apply to Azure Managed Grafana service instances depending on their service tiers and instance sizes. For a list of the quotas that apply to the Essential (preview) and Standard pricing plans, see [quotas](known-limitations.md#throttling-limits-and-quotas).

## Related content

- [Create an Azure Managed Grafana workspace using the Azure portal](quickstart-managed-grafana-portal.md)
- [Create an Azure Managed Grafana workspace using the Azure CLI](quickstart-managed-grafana-cli.md)
- [Frequently asked questions](faq.md)
