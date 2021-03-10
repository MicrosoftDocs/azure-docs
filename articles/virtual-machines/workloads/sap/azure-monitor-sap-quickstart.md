---
title: Deploy Azure Monitor for SAP solutions with the Azure portal
description: Deploy Azure Monitor for SAP solutions with the Azure portal
author: sameeksha91
ms.author: sakhare
ms.topic: how-to
ms.service: virtual-machines-sap
ms.date: 08/17/2020

---	

# Deploy Azure Monitor for SAP Solutions with Azure portal

Azure Monitor for SAP Solutions resources can be created through the [Azure portal](https://azure.microsoft.com/features/azure-portal). This method provides a browser-based user interface to deploy Azure Monitor for SAP Solutions and configure providers.

## Sign in to Azure portal

Sign in to the Azure portal at https://portal.azure.com

## Create monitoring resource

1. Select **Azure Monitor for SAP Solutions** from **Azure Marketplace**.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-1.png" alt-text="Image shows selecting the Azure Monitor for SAP solutions offer from Azure Marketplace." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-1.png":::

2. In the **Basics** tab, provide the required values. If applicable, you can use an existing Log Analytics workspace.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-2.png" alt-text="Display of the Azure portal configuration options." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-2.png":::

3. When selecting a virtual network, ensure that the systems you want to monitor are reachable from within that VNET. 

   > [!IMPORTANT]
   > Selecting **Share** for Data sharing with Microsoft enables our support teams to provide additional support.

## Configure providers

### SAP HANA provider 

1. Select the **Provider** tab to add the providers you want to configure. You can add multiple providers one after another or add them after deploying the monitoring resource. 

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-3.png" alt-text="Shows the provider tab to add additional providers to your Azure Monitor for SAP Solutions." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-3.png":::

2. Select **Add provider** and choose **SAP HANA** from the drop-down. 

   > [!IMPORTANT]
   > Ensure that SAP HANA provider is configured for SAP HANA 'master' node.

3. Input the Private IP for the HANA server.

4. Input the name of the Database tenant you want to use. You can choose any tenant however, we recommend using **SYSTEMDB** as it enables a wider array of monitoring  areas. 

5. Input the SQL port number associated with your HANA database. The port number should be in the format of **[3]** + **[instance#]** + **[13]**. For example, 30013. 

6. Input the Database username you want to use. Ensure that database user has the **monitoring** and **catalog read** roles assigned. 

7. When finished, select **Add provider**. Continue to add more providers as needed or select **Review + create** to complete the deployment.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-4.png" alt-text="Image of configuration options when adding provider information." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-4.png":::

### High-availability cluster (Pacemaker) provider

1. Select **High-availability cluster (Pacemaker)** from the drop-down. 

   > [!IMPORTANT]
   > To configure the High-availability cluster (Pacemaker) provider, ensure that ha_cluster_provider is installed in each node. For more information see [HA cluster exporter](https://github.com/ClusterLabs/ha_cluster_exporter#installation)

2. Input the Prometheus endpoint in the form of http://IP:9664/metrics. 
 
3. Input the System ID (SID), hostname and cluster name.

4. When finished, select **Add provider**. Continue to add more providers as needed or select **Review + create** to complete the deployment.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-5.png" alt-text="Image shows options related to the HA cluster Pacemaker provider." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-5.png":::


### OS (Linux) provider 

1. Select OS (Linux) from the drop-down 

> [!IMPORTANT]
> To configure OS (Linux) provider, ensure that Node_Exporter is installed in each BareMetal instance. For more information, see [Node_Exporter](https://github.com/prometheus/node_exporter)

2. Input a name, which will be the identifier for the BareMetal Instance.
3. Input the Node Exporter Endpoint in the form of http://IP:9100/metrics.
4. When finished, select **Add provider**. Continue to add more providers as needed or select **Review + create** to complete the deployment. 


### Microsoft SQL Server provider

1. Before adding the Microsoft SQL Server provider, you should run the following script in SQL Server Management Studio to create a user with the appropriate permissions needed to configure the provider.

   ```sql
   USE [<Database to monitor>]
   DROP USER [AMS]
   GO
   USE [master]
   DROP USER [AMS]
   DROP LOGIN [AMS]
   GO
   CREATE LOGIN [AMS] WITH PASSWORD=N'<password>', DEFAULT_DATABASE=[<Database to monitor>], DEFAULT_LANGUAGE=[us_english], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
   CREATE USER AMS FOR LOGIN AMS
   ALTER ROLE [db_datareader] ADD MEMBER [AMS]
   ALTER ROLE [db_denydatawriter] ADD MEMBER [AMS]
   GRANT CONNECT TO AMS
   GRANT VIEW SERVER STATE TO AMS
   GRANT VIEW SERVER STATE TO AMS
   GRANT VIEW ANY DEFINITION TO AMS
   GRANT EXEC ON xp_readerrorlog TO AMS
   GO
   USE [<Database to monitor>]
   CREATE USER [AMS] FOR LOGIN [AMS]
   ALTER ROLE [db_datareader] ADD MEMBER [AMS]
   ALTER ROLE [db_denydatawriter] ADD MEMBER [AMS]
   GO
   ``` 

2. Select **Add provider** and choose **Microsoft SQL Server** from the drop-down. 

3. Fill out the fields using information associated with your Microsoft SQL Server. 

4. When finished, select **Add provider**. Continue to add more providers as needed or select **Review + create** to complete the deployment.

     :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-6.png" alt-text="Image shows information related to adding the Microsoft SQL Server Provider." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-6.png":::

## Next steps

Learn more about [Azure Monitor for SAP Solutions](azure-monitor-overview.md)
