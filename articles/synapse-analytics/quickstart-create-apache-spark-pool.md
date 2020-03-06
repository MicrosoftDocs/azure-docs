---
title: Quickstart create an Apache Spark pool 
description: Create a new Apache Spark pool for an Azure Synapse Analytics workspace by following the steps in this guide. 
services: synapse-analytics 
author: malvenko 
ms.service: synapse-analytics 
ms.topic: quickstart 
ms.subservice:  
ms.date: 1/10/2019 
ms.author: josels 
ms.reviewer: jrasnick
---

# Quickstart: Create a new Apache Spark pool 

Synapse Analytics offers various analytics engines to help you ingest, transform, model, analyze,  and serve your data. An Apache Spark pool offers open-source big data compute capabilities. After creating an Apache Spark pool in your Synapse workspace, data can be loaded, modeled, processed, and served to obtain insights.  

This quickstart describes the steps to create an Apache Spark pool in a Synapse workspace by using the Azure portal.

If you don't have an Azure subscription, [create a free account before you begin](https:/azure.microsoft.com/free/).

## Prerequisites

- Azure subscription - [create one for free](https:/azure.microsoft.com/free/)
- [Synapse Analytics workspace](quickstart-create-workspace.md)

## Sign in to the Azure portal

Sign in to the [Azure portal](https:/portal.azure.com/)

## Navigate to the Synapse Analytics workspace

1. Navigate to the Synapse workspace where the Apache Spark pool will be created by typing the service name (or resource name directly) into the search bar:
![Azure portal search bar with Synapse workspaces typed in.](media/quickstart-create-sql-pool/quickstart-create-sql-pool-00a.png).
1. From the list of workspaces, type the name (or part of the name) of the workspace to open -- in this case, we will use a workspace named **contosoanalytics**
![Listing of Synapse workspaces filtered to show those containing the name Contoso.](media/quickstart-create-sql-pool/quickstart-create-sql-pool-00b.png)
1. Click on the **New Apache Spark pool** command in the top bar.
![Overview of Synapse workspace with a red box around the command to create a new Apache Spark pool.](media/quickstart-create-apache-spark-pool/quickstart-create-spark-pool-01.png)
1. Enter the following details in the **Basics** tab:

    |Setting | Suggested value | Description |
    | :------ | :-------------- | :---------- |
    | **Apache Spark pool name** | contosospark | This is the name that the Apache Spark pool will have. |
    | **Node size** | Small (4 vCPU / 32 GB) | Set this to the smallest size to reduce costs for this quickstart |
    | **Autoscale** | Disabled | We will not need autoscale in this quickstart |
    | **Number of nodes** | 8 | Use a small size to limit costs in this quickstart|
    ||||

    ![SQL Analytics pool create flow - basics tab.](media/quickstart-create-apache-spark-pool/quickstart-create-spark-pool-02.png)
    > [!IMPORTANT]
    > Note that there are specific limitations for the names that Apache Spark pools can use. Names must contain letters or numbers only, must be 15 or less characters, must start with a letter, not contain reserved words, and be unique in the workspace.

4. In the next tab (Additional settings), leave all defaults, and press **Next: tags**.
![Apache Spark pool create flow - additional settings tab.](media/quickstart-create-apache-spark-pool/quickstart-create-spark-pool-03.png)

1. We will not add any tags for now, so click on **Next: Review + create**.

1. In the **Review + create** tab, make sure that the details look correct based on what was previously entered, and press **create**.
![Apache Spark pool create flow - review settings tab.](media/quickstart-create-apache-spark-pool/quickstart-create-spark-pool-05.png)

1. At this point, the resource provisioning flow will start, indicating once it's complete
 ![Apache Spark pool create flow - resource provisioning.](media/quickstart-create-apache-spark-pool/quickstart-create-spark-pool-06.png)

1. After the provisioning completes, navigating back to the workspace will show a new entry for the newly created Spark pool.
 ![Apache Spark pool create flow - resource provisioning.](media/quickstart-create-apache-spark-pool/quickstart-create-spark-pool-07.png)

1. At this point, there are no resources running, no charges for Spark, you have created metadata about the Spark instances you want to create.

## Clean up resources

Follow the steps below to delete the Apache Spark pool from the workspace.
> [!WARNING]
> Deleting a Spark pool will remove the analytics engine from the workspace. It will no longer be possible to connect to the pool, and all queries, pipelines, and notebooks that use this Spark pool will no longer work.

If you want to delete the Apache Spark pool, do the following:

1. Navigate to the Apache Spark pools blade in the workspace.
1. Select the Apache pool to be deleted (in this case, **contosospark**)
1. Press **delete**.
 ![Listing of Apache Spark pools, with the recently created pool selected.](media/quickstart-create-apache-spark-pool/quickstart-create-spark-pool-08.png)
1. Confirm the deletion, and press **Delete** button.
 ![Confirmation dialog to delete the selected Apache Spark pool.](media/quickstart-create-apache-spark-pool/quickstart-create-spark-pool-10.png)
1. When the process completes successfully, the Apache Spark pool will no longer be listed in the workspace resources.

## Next steps

Once the SQL pool is created, it will be available in the workspace for loading data, processing streams, reading from the lake, etc.

See the other Synapse quickstarts to get started using the Apache Spark pool.
