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

### SAP NetWeaver provider

#### Prerequisites for adding NetWeaver provider

The “SAP start service” provides a host of services including monitoring the SAP system. We are leveraging the “SAPControl” which is a SOAP web service interface that exposes these capabilities. This SAPControl webservice Interface differentiates between [protected and unprotected](https://wiki.scn.sap.com/wiki/display/SI/Protected+web+methods+of+sapstartsrv) webservice methods. To be able to fetch specific metrics, you will need to unprotect some methods. To unprotect the required methods for the current release, please follow the steps below for each SAP system:

1. Open an SAP GUI connection to the SAP server
2. Login using an administrative account
3. Execute transaction RZ10
4. Select the appropriate Profile (DEFAULT.PFL)
5. Select 'Extended Maintenance' and click Change 
6. Modify the value of the affected parameter “service/protectedwebmethods” to "SDEFAULT -GetQueueStatistic –ABAPGetWPTable –EnqGetStatistic –GetProcessList" to the recommended setting and click Copy
7. Go back and select Profile->Save
8. Restart system for parameter to take effect

>[!Tip]
> Use an Access Control List (ACL) to filter the access to a server port. Refer to his [SAP note](https://launchpad.support.sap.com/#/notes/1495075)

#### Installing NetWeaver provider on the Azure portal
1.	Make sure that the pre-requisite steps have been completed and server has been restarted
2.	On the Azure portal, under AMS, select Add provider and choose SAP NetWeaver from the drop down
3.	Input the hostname of the SAP system and Subdomain (if applicable)
4.	Enter the Instance number corresponding to the hostname entered 
5.	Enter the System ID (SID)
6.	When finished, select Add provider
7.	Continue to add additional providers as needed or select Review + create to complete the deployment

![image](https://user-images.githubusercontent.com/75772258/114583569-5c777d80-9c9f-11eb-99a2-8c60987700c2.png)

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

   >[!IMPORTANT]
   > To configure OS (Linux) provider, ensure that latest version of Node_Exporter is installed in each host (BareMetal or VM) that you wish to monitor. Use this [link](https://prometheus.io/download/#node_exporter) to find latest version. For more information, see [Node_Exporter](https://github.com/prometheus/node_exporter)

2. Input a name, which will be the identifier for the BareMetal Instance.
3. Input the Node Exporter Endpoint in the form of http://IP:9100/metrics.

   >[!IMPORTANT]
   >Please use private IP address of linux host. Please ensure that host and AMS resource are in the same VNET. 

   >[!Note]
   > Firewall port “9100” should be opened on the linux host.
   >If using firewall-cmd: 
    >firewall-cmd --permanent --add-port=9100/tcp
    >firewall-cmd --reload
   >If using ufw:
     >ufw allow 9100/tcp
     >ufw reload

    >[!Tip]
    > If linux host is an Azure VM, please ensure that all applicable NSGs allow inbound traffic at port 9100 from "VirtualNetwork" as the source.
 
5. When finished, select **Add provider**. Continue to add more providers as needed or select **Review + create** to complete the deployment. 


## Next steps

Learn more about [Azure Monitor for SAP Solutions](azure-monitor-overview.md)
