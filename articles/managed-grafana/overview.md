---
title: What is Azure Managed Grafana Preview? 
description: Read an overview of Azure Managed Grafana. Understand why and how to use Managed Grafana. 
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: overview 
ms.date: 3/31/2022 
--- 

# What is Azure Managed Grafana Preview?

Azure Managed Grafana is a data visualization platform built on top of the Grafana software by Grafana Labs. It's built as a fully managed Azure service operated and supported by Microsoft. Grafana helps you bring together metrics, logs and traces into a single user interface. With its extensive support for data sources and graphing capabilities, you can view and analyze your application and infrastructure telemetry data in real-time.

Azure Managed Grafana is optimized for the Azure environment. It works seamlessly with many Azure services. Specifically, for the current preview, it provides with the following integration features:

* Built-in support for [Azure Monitor](/azure/azure-monitor/) and [Azure Data Explorer](/azure/data-explorer/)
* User authentication and access control using Azure Active Directory identities
* Direct import of existing charts from Azure portal

To learn more about how Grafana works, visit the [Getting Started documentation](https://grafana.com/docs/grafana/latest/getting-started/) on the Grafana Labs website.  

## Why use Azure Managed Grafana Preview?

Managed Grafana lets you bring together all your telemetry data into one place. It can access a wide variety of data sources supported, including your data stores in Azure and elsewhere. By combining charts, logs and alerts into one view, you can get a holistic view of your application and infrastructure, and correlate information across multiple datasets.

As a fully managed service, Azure Managed Grafana lets you deploy Grafana without having to deal with setup. The service provides high availability, SLA guarantees and automatic software updates.

You can share Grafana dashboards with people inside and outside of your organization and allow others to join in for monitoring or troubleshooting.

Managed Grafana uses Azure Active Directory (Azure AD)’s centralized identity management, which allows you to control which users can use a Grafana instance, and you can use managed identities to access Azure data stores, such as Azure Monitor.

You can create dashboards instantaneously by importing existing charts directly from the Azure portal or by using prebuilt dashboards.

## What features of Grafana are supported?

In this documentation, you will find multiple features from Grafana. If you don't see a feature mentioned in this documentation, it means that this feature is not supported.

## Next steps

> [!div class="nextstepaction"]
> [Create a workspace in Azure Managed Grafana Preview using the Azure portal](./quickstart-managed-grafana-portal.md).
