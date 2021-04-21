---
title: Connect Azure Key Vault diagnostics logs to Azure Sentinel
description: Learn how to use Azure Policy to connect Azure Key Vault diagnostics logs to Azure Sentinel.
author: yelevin
manager: rkarlin
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 04/22/2021
ms.author: yelevin
---
# Connect Azure Key Vault diagnostics logs

Azure Key Vault is a cloud service for securely storing and accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, certificates, or cryptographic keys.

This connector lets you stream your Azure Key Vault diagnostics logs into Azure Sentinel, allowing you to continuously monitor activity in all your instances.

Learn more about [monitoring Azure Key Vault](../azure-monitor/insights/key-vault-insights-overview.md) and about [Azure Key Vault diagnostics telemetry](../key-vault/general/logging.md).

## Prerequisites

To ingest Azure Key Vault logs into Azure Sentinel:

- You must have read and write permissions on the Azure Sentinel workspace.

- To use Azure Policy to apply a log streaming policy to Azure Key Vault resources, you must have the Owner role for the policy assignment scope.

## Connect to Azure Key Vault

This connector uses Azure Policy to apply a single Azure Key Vault log streaming configuration to a collection of instances, defined as a scope. You can see the log types ingested from Azure Key Vault on the left side of connector page, under **Data types**.

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select **Azure Key Vault** from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. In the **Configuration** section of the connector page, expand **Stream diagnostics logs from your Azure Key Vault at scale**.

1. Select the **Launch Azure Policy Assignment wizard** button.

    The policy assignment wizard opens, ready to create a new policy called **Deploy - Configure diagnostic settings for Azure Key Vault to Log Analytics workspace**.

    1. In the **Basics** tab, click the button with the three dots under **Scope** to select your subscription (and, optionally, a resource group). You can also add a description.

    1. In the **Parameters** tab, leave the **Effect** and **Setting name** fields as is. Choose your Azure Sentinel workspace from the **Log Analytics workspace** drop-down list. The remaining drop-down fields represent the available diagnostic log types. Leave marked as “True” all the log types you want to ingest.

    1. The policy will be applied to resources added in the future. To apply the policy on your existing resources as well, select the **Remediation** tab and mark the **Create a remediation task** check box.

    1. In the **Review + create** tab, click **Create**. Your policy is now assigned to the scope you chose.

> [!NOTE]
>
> With this particular data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past 14 days. Once 14 days have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

## Next steps

In this document, you learned how to use Azure Policy to connect Azure Key Vault to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
