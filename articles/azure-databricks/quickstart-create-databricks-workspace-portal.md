---
title: 'Azure Databricks: Create a workspace using Portal | Microsoft Docs'
description: Use the Azure Portal to create an Azure Databricks workspace.
services: azure-databricks
documentationcenter: ''
author: nitinme
manager: cgronlun
editor: cgronlun

ms.service: azure-databricks
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/15/2017
ms.author: nitinme

---

# Get started with Azure Databricks using portal

In this article, you learn how to create an Azure Databricks workspace and then an Apache Spark cluster within that workspace. You will also learn how to run your first Spark job on the cluster. For more information on Azure Databricks, see [Azure Databricks Overview](databricks-overview.md).

## Prerequisites

* **An Azure subscription**. Before you begin this tutorial, you must have an Azure subscription. See [Create your free Azure account today](https://azure.microsoft.com/free).
* **A modern web browser**. The Azure  portal uses HTML5 and Javascript, and may not function correctly in older web browsers.


## Create an Azure Databricks workspace

1. Sign in to the [Azure  portal](https://portal.azure.com).

2. Click **+**, click **Data + Analytics**, and then click **Azure Databricks (Preview)**. Under **Azure Databricks**, click **Create**.

3. Under **Azure Databricks Service**, provide the following values:

    ![Create an Azure Databricks workspace](./media/quickstart-create-databricks-workspace-portal/create-databricks-workspace.png "Create an Azure Databricks workspace")

    * For **Workspace name**, provide a name for your Databricks workspace.
    * For **Subscription**, from the drop-down, select your Azure subscription.
    * For **Resource group**, specify whether you want to create a new resource group or use an existing one. Resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](../azure-resource-manager/resource-group-overview.md).
    * For **Location**, select **East US 2**.

4. Click **Create**.

## Create an Apache Spark cluster in Databricks

1. In the Azure Portal, go to the Databricks workspace that you created, and then click **Initialize Workspace**.

    ![Initialize an Azure Databricks workspace](./media/quickstart-create-databricks-workspace-portal/initialize-databricks-workspace.png "Initialize an Azure Databricks workspace")

2. You will be redirected to the Azure Databricks portal. From the portal, click **Cluster**.

    ![Databricks on Azure](./media/quickstart-create-databricks-workspace-portal/databricks-on-azure.png "Databricks on Azure")

3. In the **New cluster** page, enter a name for the cluster, accept all other default values, and then click **Create cluster**.

    ![Create Databricks Spark cluster on Azure](./media/quickstart-create-databricks-workspace-portal/create-databricks-spark-cluster.png "Create Databricks Spark cluster on Azure")

    For more information on creating clusters, see [Create a Spark cluster in Azure Databricks](https://docs.azuredatabricks.net/user-guide/clusters/create.html).

4. Once the cluster is running, you can attach notebooks to the cluster and run Spark jobs.

## Run a Spark job on the cluster



## Next step 