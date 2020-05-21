---
title: Quickstart - Create an Apache Spark pool (preview) using Synapse Studio
description: Create a new Apache Spark pool using Synapse Studio by following the steps in this guide.  
services: synapse-analytics 
author: julieMSFT  
ms.service: synapse-analytics 
ms.topic: quickstart  
ms.subservice:   
ms.date: 3/19/2020  
ms.author: jrasnick  
ms.reviewer: jrasnick
---

# Quickstart: Create an Apache Spark pool (preview) using Synapse Studio

Azure Synapse Analytics offers various analytics engines to help you ingest, transform, model, analyze,  and serve your data. Apache Spark pool offers open-source big data compute capabilities. After creating an Apache Spark pool in your Synapse workspace, data can be loaded, modeled, processed, and served to obtain insights.  

This quickstart describes the steps to create an Apache Spark pool in a Synapse workspace by using Synapse Studio.

> [!IMPORTANT]
> Billing for Spark instances is prorated per minute, whether you are using them or not. Be sure to shutdown your Spark instance after you have finished using it, or set a short timeout. For more information, see the **Clean up resources** section of this article.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Synapse workspace](./quickstart-create-workspace.md)

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/)

## Navigate to the Synapse workspace

1. Navigate to the Synapse workspace where the Apache Spark pool will be created by typing the service name (or resource name directly) into the search bar.
![Azure portal search bar with Synapse workspaces typed in.](media/quickstart-create-sql-pool/create-sql-pool-00a.png)
1. From the list of workspaces, type the name (or part of the name) of the workspace to open. For this example, we'll use a workspace named **contosoanalytics**.
![Listing of Synapse workspaces filtered to show those containing the name Contoso.](media/quickstart-create-sql-pool/create-sql-pool-00b.png)

## Launch Synapse Studio 

1. From the workspace overview, select **Launch Synapse Studio** to open the location where the Apache Spark pool will be created. Type the service name or resource name directly into the search bar.
![Azure portal Synapse workspace overview with Launch Synapse Studio highlighted.](media/quickstart-create-apache-spark-pool/create-spark-pool-studio-20.png)

## Create the Apache Spark pool in Synapse Studio

1. On the Synapse Studio home page, navigate to the **Management Hub** in the left navigation by selecting the **Manage** icon.
![Synapse Studio home page with Management Hub section highlighted.](media/quickstart-create-apache-spark-pool/create-spark-pool-studio-21.png)

1. Once in the Management Hub, navigate to the **Apache Spark pools** section to see the current list of Apache Spark pools that are available in the workspace.
![Synapse Studio management hub with Apache Spark pools navigation selected](media/quickstart-create-apache-spark-pool/create-spark-pool-studio-22.png)

1. Select **+ New** and the new Apache Spark pool create wizard will appear. 
![Synapse Studio Management Hub listing of Spark pools.](media/quickstart-create-apache-spark-pool/create-spark-pool-studio-23.png)

1. Enter the following details in the **Basics** tab:

    | Setting | Suggested value | Description |
    | :------ | :-------------- | :---------- |
    | **Apache Spark pool name** | contosospark | This is the name that the Apache Spark pool will have. |
    | **Node size** | Small (4 vCPU / 32 GB) | Set this to the smallest size to reduce costs for this quickstart |
    | **Autoscale** | Disabled | We won't need autoscale in this quickstart |
    | **Number of nodes** | 8 | Use a small size to limit costs in this quickstart|
    
    ![Synapse Studio new Apache Spark pool form.](media/quickstart-create-apache-spark-pool/create-spark-pool-studio-24.png)
    > [!IMPORTANT]
    > Note that there are specific limitations for the names that Apache Spark pools can use. Names must contain letters or numbers only, must be 15 or less characters, must start with a letter, not contain reserved words, and be unique in the workspace.

1. In the next tab (Additional settings), leave all defaults, and press **Review + create** (we won't add any tags).
 ![Synapse Studio new Apache Spark pool form.](media/quickstart-create-apache-spark-pool/create-spark-pool-studio-25.png)

1. We won't add any tags for now, so select **Review + create**.

1. In the **Review + create** tab, make sure that the details look correct based on what was previously entered, and press **create**. 
 ![Synapse Studio new Apache Spark pool form.](media/quickstart-create-apache-spark-pool/create-spark-pool-studio-26.png)

1. The Apache Spark pool will start the provisioning process.
![Synapse Studio new Apache Spark pool form.](media/quickstart-create-apache-spark-pool/create-spark-pool-studio-27.png)

1. Once the provisioning is complete, the new Apache Spark pool will appear in the list.
![Synapse Studio new Apache Spark pool form.](media/quickstart-create-apache-spark-pool/create-spark-pool-studio-28.png)

## Clean up Apache Spark pool resources using Synapse Studio

Follow the steps below to delete the Apache Spark pool from the workspace using Synapse Studio.
> [!WARNING]
> Deleting a Spark pool will remove the analytics engine from the workspace. It will no longer be possible to connect to the pool, and all queries, pipelines, and notebooks that use this Spark pool will no longer work.

If you want to delete the Apache Spark pool, do the following:

1. Navigate to the Apache Spark pools in the Management Hub in Synapse Studio.
1. Select the ellipsis next to the Apache pool to be deleted (in this case, **contosospark**) to show the commands for the Apache Spark pool.
![Listing of Apache Spark pools, with the recently created pool selected.](media/quickstart-create-apache-spark-pool/create-spark-pool-studio-29.png)
1. Press **delete**.
1. Confirm the deletion, and press **Delete** button.
 ![Confirmation dialog to delete the selected Apache Spark pool.](media/quickstart-create-apache-spark-pool/create-spark-pool-studio-30.png)
1. When the process completes successfully, the Apache Spark pool will no longer be listed in the workspace resources. 

## Next steps

- See [Quickstart: Create an Apache Spark pool in Synapse Studio using web tools](quickstart-apache-spark-notebook.md).
- See [Quickstart: Create an Apache Spark pool using the Azure portal](quickstart-create-apache-spark-pool-portal.md).