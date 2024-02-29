---
title: Trino with DBeaver
description: Using Trino in DBeaver.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/19/2023
---

# Connect and query with DBeaver

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

It's possible to use JDBC driver with many available database tools. This article demonstrates how to configure one of the most popular tool **DBeaver** to connect to Trino cluster with HDInsight on AKS in few simple steps.

## Prerequisites

* [Download and install DBeaver](https://dbeaver.io/download/).
* [Install Trino CLI with JDBC driver for HDInsight on AKS](./trino-ui-command-line-interface.md#install-on-windows).

## Configure DBeaver to use Trino JDBC driver for HDInsight on AKS

Open DBeaver and from the main menu, select Database -> Driver Manager. 

   > [!NOTE]
   > DBeaver comes with existing open-source Trino driver, create a copy of it and register as Trino JDBC driver for HDInsight on AKS.
   
   1. Select **Trino** driver from list and click **Copy**.
      
      * Update **Driver Name**, for example, "Azure Trino" or "Trino for HDInsight on AKS" or any other name.
      * Make sure **Default Port** is 443.
        
      :::image type="content" source="./media/trino-ui-dbeaver/dbeaver-new-driver.png" alt-text="Screenshot showing Create new Trino driver for HDInsight on AKS."
        
   1. Select **Libraries** tab.
      
   1. Delete all libraries currently registered.
      
   1. Click **Add File** and select [installed](./trino-ui-command-line-interface.md#install-on-windows) Trino JDBC jar file for HDInsight on AKS from your local disk.

      > [!NOTE]
      > Trino CLI for HDInsight on AKS comes with Trino JDBC jar. You can find it in your local disk.
      > <br> Reference location example: `C:\Program Files (x86)\Microsoft SDKs\Azure\TrinoCli-0.410.0\lib`. Location may defer if the installation directory or CLI version is different.
       
   1. Click **Find Class** and select ```io.trino.jdbc.TrinoDriver```.
       
       :::image type="content" source="./media/trino-ui-dbeaver/dbeaver-new-driver-library.png" alt-text="Screenshot showing Select Trino JDBC driver file."
       
   1. Click **OK** and close Driver Manager, the driver is configured to use.

## Query and browse Trino cluster with DBeaver

1. Connect to your Trino cluster by clicking **New Database Connection** in the toolbar.
   
1. Select newly registered driver. In this example, "Azure Trino."
  
   :::image type="content" source="./media/trino-ui-dbeaver/dbeaver-new-connection.png" alt-text="Screenshot showing Create new connection."
  
1. Click "Next." On the **Main** tab update **Host** with Trino cluster endpoint, which you can find in portal on cluster overview page.
  
   :::image type="content" source="./media/trino-ui-dbeaver/dbeaver-new-connection-main.png" alt-text="Screenshot showing Create new connection main."
   
1. Optionally, select **Driver properties** tab and set ```azureUseTokenCache=true```. This parameter would reduce number of authentication actions user needs to perform if interactive browser authentication is required. DBeaver initializes several connections for different tool windows in UI, each requiring authentication, and possibly user action.
   
   :::image type="content" source="./media/trino-ui-dbeaver/dbeaver-new-driver.png" alt-text="Screenshot showing Create new connection - properties."
   
1. Click OK, connection is ready. You can click **Test Connection** or close the window.
   
1. Expand connection in **Database Navigator** on the left to browse catalogs. Browser may open with authentication prompt.
    
1. In main menu, click **SQL Editor** -> **New SQL Script** and type any Trino query to get started.
   
   :::image type="content" source="./media/trino-ui-dbeaver/dbeaver-query.png" alt-text="Screenshot showing Query Trino in DBeaver."
