---
title: Configuration management in HDInsight on AKS Spark
description: Learn how to perform Configuration management in HDInsight on AKS Spark
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---
# Configuration management in HDInsight on AKS Spark

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Azure HDInsight on AKS is a managed cloud-based service for big data analytics that helps organizations process large amounts data. This tutorial shows how to use configuration management in Azure HDInsight on AKS Spark cluster.

Configuration management is used to add specific configurations into the spark cluster.

When user updates a configuration in the management portal the corresponding service is restarted in rolling manner.

## Steps to update Configurations

1. Click on the cluster name in the cluster pool and navigate to cluster overview page.

1. Click on the configuration management tab in the left pane.

    :::image type="content" source="./media/configuration-management/select-configuration-tab.png" alt-text="Screenshot showing how to select configuration tab." lightbox="./media/configuration-management/select-configuration-tab.png":::

1. This step takes you to the Spark configurations, which are provided.

    :::image type="content" source="./media/configuration-management/show-spark-configuration.png" alt-text="Screenshot showing spark configuration." lightbox="./media/configuration-management/show-spark-configuration.png":::

1. Click on the **configuration** tabs that need to be changed.
     
    :::image type="content" source="./media/configuration-management/change-spark-configuration-2.png" alt-text="Screenshot showing how to change spark configuration 2." lightbox="./media/configuration-management/change-spark-configuration-2.png":::
   
    :::image type="content" source="./media/configuration-management/change-spark-configuration-3.png" alt-text="Screenshot showing how to change spark configuration 3." lightbox="./media/configuration-management/change-spark-configuration-3.png":::

1. To change any configuration, replace the given values on the text box with the desired values, click on **OK**  and then click **Save**.

    :::image type="content" source="./media/configuration-management/change-spark-configuration-value-1.png" alt-text="Screenshot showing how to change spark configuration value-1." lightbox="./media/configuration-management/change-spark-configuration-value-1.png":::

    :::image type="content" source="./media/configuration-management/change-spark-configuration-value-2.png" alt-text="Screenshot showing how to change spark configuration value-2." lightbox="./media/configuration-management/change-spark-configuration-value-2.png":::

    :::image type="content" source="./media/configuration-management/change-spark-configuration-value-3.png" alt-text="Screenshot showing how to change spark configuration value-3." lightbox="./media/configuration-management/change-spark-configuration-value-3.png":::

1. To add a new parameter, which isn't provided by default click on “Add” in the bottom right.

    :::image type="content" source="./media/configuration-management/add-configuration.png" alt-text="Screenshot showing how to add configuration." lightbox="./media/configuration-management/add-configuration.png":::

1. Add the desired configuration and click on “Ok” and then click on "Save".

   :::image type="content" source="./media/configuration-management/delete-configuration.png" alt-text="Screenshot showing how to save configuration." lightbox="./media/configuration-management/delete-configuration.png":::

1. The configurations are updated and the cluster is restarted.
1. To delete the configurations, click on the delete icon next to the textbox.

    :::image type="content" source="./media/configuration-management/save-configuration.png" alt-text="Screenshot showing how to delete  configuration." lightbox="./media/configuration-management/save-configuration.png":::

1. Click on “Ok” and then click on “Save”.

     :::image type="content" source="./media/configuration-management/save-changes.png" alt-text="Screenshot showing how to save  configuration changes." lightbox="./media/configuration-management/save-changes.png":::
      
    > [!NOTE]
    > Selecting **Save** will restart the clusters.
    > It is advisable not to have any active jobs while making configuration changes, since restarting the cluster may impact the active jobs.

## Next steps
* [Library management in Spark](./library-management.md)
