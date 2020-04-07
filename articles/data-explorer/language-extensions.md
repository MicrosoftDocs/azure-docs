---
title: Manage language extensions in your Azure Data Explorer cluster. 
description: Use language extension to integrate other languages within your Azure Data Explorer KQL queries. 
author: orspod
ms.author: orspodek
ms.reviewer: orhasban 
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/01/2020
---

# Manage language extensions in your Azure Data Explorer cluster (Preview)

The language extensions feature allows you to use language extension plugins to integrate other languages into your Azure Data Explorer KQL queries. When you run a user-defined-function (UDF) using a relevant script, the script gets tabular data as its input and is expected to produce tabular output. The plugin's runtime is hosted in a [sandbox](/azure/kusto/concepts/sandboxes), an isolated and secure environment, running on the cluster's nodes. In this article, you manage the language extensions plugin in your Azure Data Explorer cluster within the Azure portal.

> [!NOTE]
> Azure Data Explorer language extensions that are currently supported are Python and R.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [an Azure Data Explorer cluster and database](create-cluster-database-portal.md).

## Enable language extensions on your cluster

> [!WARNING]
> Please review the [limitations](#limitations) prior to enabling a language extension.

Do the following steps to enable language extensions on your cluster:

1. In the Azure portal, go to your Azure Data Explorer cluster. 
1. In **Settings**, select **Configurations**. 
1. In the **Configurations** pane, select **On** to enable a language extension.
1. Select **Save**.
 
    ![language extension on](media/language-extensions/configurations-enable-extension.png)

> [!NOTE]
> Enabling the language extension process can take a few minutes. During that time, your cluster will be suspended.
 
## Run language extension-integrated queries

* Learn how to [run Python integrated KQL queries](/azure/kusto/query/pythonplugin).
* Learn how to [run R integrated KQL queries](/azure/kusto/query/rplugin). 

## Disable language extensions on your cluster

> [!NOTE]
> Disabling language extensions could take a few minutes.

Do the following steps to disable language extensions on your cluster:

1. In the Azure portal, go to your Azure Data Explorer cluster. 
1. In **Settings**, select **Configurations**. 
1. In the **Configurations** pane, select **Off** to disable a language extension.
1. Select **Save**.

    ![Language extension off](media/language-extensions/configurations-disable-extension.png)

## Limitations

* The language extensions feature doesn't support [Disk encryption](manage-cluster-security.md). 
* The language extensions runtime sandbox allocates disk space even if no query runs in the scope of the relevant language.

