---
title: Monitor your enclaves in Azure Enclave
description: Monitor your enclaves in Azure Enclave.
author: jadean-msft
ms.author: jadean
ms.topic: tutorial
ms.date: 9/30/2025
---

# Tutorial 1-6: Monitor your enclaves in Azure Enclave

Many Azure services offer comprehensive monitoring solutions for collecting, analyzing, and responding to monitoring data. With Azure Enclave, you can use the monitoring capabilities of each underlying Azure service that gets deployed with each Azure Enclave resource. 

Many of these services are linked to the overall [Azure Monitor](https://aka.ms/azuremonitor) service, which can be used to maximize the availability and performance of your workloads. It helps you understand how your applications are performing and allows you to manually and programmatically respond to system events.

In this tutorial, part eight of eight, you learn how to monitor the state of your enclave. You learn how to:

  - Use built in Azure Monitoring and logging tools and services
  - View your Azure Enclave resources in Azure portal
  - Monitor your workloads in Azure portal

## Before you begin
Throughout this tutorial series, you created several resources using Azure Enclave using the Azure portal. You also created several Azure resources representing your system workloads.

## Monitoring your network in Azure Enclave

Review network activity through the enclave or community Log Analytics Workspace.

### Community firewall monitoring

1. In the Azure portal, navigate to your community managed resource group.
1. Locate and open the **Log Analytics Workspace** associated with your enclave.
1. Select **Logs** from the left navigation menu.
1. Run queries to monitor network traffic, such as:
   - Azure Firewall logs to review allowed and denied traffic
   - VPN Gateway diagnostics to monitor connectivity
1. Review the query results and set up alerts for anomalous network activity.
1. Optionally, create dashboards in Azure Monitor to visualize network metrics over time.

### Enclave network monitoring

1. In the Azure portal, navigate to your enclave managed resource group.
1. Locate and open the **Log Analytics Workspace** associated with your enclave.
1. Select **Logs** from the left navigation menu.
1. Run queries to monitor network traffic, such as:
   - Network Security Group (NSG) flow logs to analyze traffic patterns
1. Review the query results and set up alerts for anomalous network activity.
1. Optionally, create dashboards in Azure Monitor to visualize network metrics over time.

## Monitoring your workloads in Azure Enclave

Review workload activity through the enclave Log Analytics Workspace. The enclave logs are configured so they're only accessible from the enclave network to protect the log data.

1. Sign in to an [Admin VM](./deploy-admin-vm-service-catalog.md) or another VM with network access to the enclave network. 
1. In the Azure portal from an Admin VM, navigate to your enclave managed resource group.
1. Open the **Log Analytics Workspace** linked to your enclave.
1. Select **Logs** from the left navigation menu.
1. Query workload-specific logs, such as:
   - Virtual Machine performance metrics (CPU, memory, disk usage)
   - Application logs from Azure App Service or Container instances
   - Security events and system logs
1. Set up metric alerts for critical thresholds (for example, high CPU usage, disk space warnings).
1. Use Azure Monitor Application Insights if your applications are instrumented for deeper application performance monitoring.
1. Verify logs are flowing to the workspace by reviewing and configuring diagnostic settings on individual workload resources.

## Closing
In this tutorial series, you prepared a monitored and secure network cloud environment in the Azure portal using Azure Enclave.
