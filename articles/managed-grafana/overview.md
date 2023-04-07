---
title: What is Azure Managed Grafana? 
description: Read an overview of Azure Managed Grafana. Understand why and how to use Managed Grafana. 
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: overview 
ms.date: 3/23/2023
--- 

# What is Azure Managed Grafana?

Azure Managed Grafana is a data visualization platform built on top of the Grafana software by Grafana Labs. It's built as a fully managed Azure service operated and supported by Microsoft. Grafana helps you bring together metrics, logs and traces into a single user interface. With its extensive support for data sources and graphing capabilities, you can view and analyze your application and infrastructure telemetry data in real-time.

Azure Managed Grafana is optimized for the Azure environment. It works seamlessly with many Azure services and provides the following integration features:

* Built-in support for [Azure Monitor](../azure-monitor/index.yml) and [Azure Data Explorer](/azure/data-explorer/)
* User authentication and access control using Azure Active Directory identities
* Direct import of existing charts from the Azure portal

To learn more about how Grafana works, visit the [Getting Started documentation](https://grafana.com/docs/grafana/latest/getting-started/) on the Grafana Labs website.  

## Why use Azure Managed Grafana?

Azure Managed Grafana lets you bring together all your telemetry data into one place. It can access a wide variety of data sources supported, including your data stores in Azure and elsewhere. By combining charts, logs and alerts into one view, you can get a holistic view of your application and infrastructure, and correlate information across multiple datasets.

As a fully managed service, Azure Managed Grafana lets you deploy Grafana without having to deal with setup. The service provides high availability, SLA guarantees and automatic software updates.

You can share Grafana dashboards with people inside and outside of your organization and allow others to join in for monitoring or troubleshooting.

Managed Grafana uses Azure Active Directory (Azure AD)’s centralized identity management, which allows you to control which users can use a Grafana instance, and you can use managed identities to access Azure data stores, such as Azure Monitor.

You can create dashboards instantaneously by importing existing charts directly from the Azure portal or by using prebuilt dashboards.

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure Managed Grafana instance using the Azure portal](./quickstart-managed-grafana-portal.md)
