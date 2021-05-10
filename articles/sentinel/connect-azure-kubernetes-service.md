---
title: Connect Azure Kubernetes Service (AKS) diagnostics logs to Azure Sentinel
description: Learn how to use Azure Policy to connect Azure Kubernetes Service diagnostics logs to Azure Sentinel.
author: yelevin
manager: rkarlin
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 04/22/2021
ms.author: yelevin
---
# Connect Azure Kubernetes Service diagnostics logs

Azure Kubernetes Service (AKS) is an open-source, fully-managed container orchestration service that allows you to deploy, scale, and manage Docker containers and container-based applications in a cluster environment.

This connector lets you stream your Azure Kubernetes Service (AKS) diagnostics logs into Azure Sentinel, allowing you to continuously monitor activity in all your instances. 

Learn more about [monitoring Azure Kubernetes Service](../azure-monitor/containers/container-insights-overview.md) and about [AKS diagnostic telemetry](../aks/view-control-plane-logs.md).

## Prerequisites

To ingest AKS logs into Azure Sentinel:

- You must have read and write permissions on the Azure Sentinel workspace.

- To use Azure Policy to apply a log streaming policy to AKS resources, you must have the Owner role for the policy assignment scope.

## Connect to Azure Kubernetes Service

This connector uses Azure Policy to apply a single Azure Kubernetes Service log streaming configuration to a collection of resources, defined as a scope. You can see the log types ingested from Azure Kubernetes Service on the left side of connector page, under **Data types**.

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select **Azure Kubernetes Service (AKS)** from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. In the **Configuration** section of the connector page, expand **Stream diagnostics logs from your Azure Kubernetes Service (AKS) at scale**.

1. Select the **Launch Azure Policy Assignment wizard** button.

    The policy assignment wizard opens, ready to create a new policy called **Deploy - Configure diagnostic settings for Azure Kubernetes Service to Log Analytics workspace**.

    1. In the **Basics** tab, click the button with the three dots under **Scope** to select your subscription (and, optionally, a resource group). You can also add a description.

    1. In the **Parameters** tab, leave the **Effect** and **Setting name** fields as is. Choose your Azure Sentinel workspace from the **Log Analytics workspace** drop-down list. The remaining drop-down fields represent the available diagnostic log types. Leave marked as “True” all the log types you want to ingest.

    1. The policy will be applied to resources added in the future. To apply the policy on your existing resources as well, select the **Remediation** tab and mark the **Create a remediation task** check box.

    1. In the **Review + create** tab, click **Create**. Your policy is now assigned to the scope you chose.

> [!NOTE]
>
> With this particular data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past 14 days. Once 14 days have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

## Next steps

In this document, you learned how to use Azure Policy to connect Azure Kubernetes Service to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
