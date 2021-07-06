---
title: Deploy Azure Monitor for SAP solutions with the Azure portal
description: Learn how to use a browser method for deploying Azure Monitor for SAP Solutions.
author: sameeksha91
ms.author: sakhare
ms.topic: how-to
ms.service: virtual-machines-sap
ms.date: 08/17/2020

---	

# Deploy Azure Monitor for SAP Solutions by using the Azure portal

You can create Azure Monitor for SAP Solutions resources through the [Azure portal](https://azure.microsoft.com/features/azure-portal). This method provides a browser-based user interface to deploy Azure Monitor for SAP Solutions and configure providers.

## Sign in to the portal

Sign in to the [Azure portal](https://portal.azure.com).

## Create a monitoring resource

1. Under **Marketplace**, select **Azure Monitor for SAP Solutions**.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-1.png" alt-text="Screenshot that shows selecting the Azure Monitor for SAP solutions offer from Azure Marketplace." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-1.png":::

2. On the **Basics** tab, provide the required values. If applicable, you can use an existing Log Analytics workspace.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-2.png" alt-text="Screenshot that shows configuration options on the Basics tab." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-2.png":::

   When you're selecting a virtual network, ensure that the systems you want to monitor are reachable from within that virtual network. 

   > [!IMPORTANT]
   > Selecting **Share** for **Share data with Microsoft support** enables our support teams to help you with troubleshooting.

## Configure providers

### SAP NetWeaver provider

The SAP start service provides a host of services, including monitoring the SAP system. We're using SAPControl, which is a SOAP web service interface that exposes these capabilities. The SAPControl web service interface differentiates between [protected and unprotected](https://wiki.scn.sap.com/wiki/display/SI/Protected+web+methods+of+sapstartsrv) web service methods. 

To be able to fetch specific metrics, you need to unprotect some methods for the current release. Follow these steps for each SAP system:

1. Open an SAP GUI connection to the SAP server.
2. Log in by using an administrative account.
3. Execute transaction RZ10.
4. Select the appropriate profile (*DEFAULT.PFL*).
5. Select **Extended Maintenance** > **Change**. 
6. Modify the value of the affected parameter `service/protectedwebmethods` to `SDEFAULT -GetQueueStatistic –ABAPGetWPTable –EnqGetStatistic –GetProcessList` to the recommended setting, and then select **Copy**.
7. Go back and select **Profile** > **Save**.
8. Restart the system for the parameter to take effect.

>[!Tip]
> Use an access control list (ACL) to filter the access to a server port. For more information, see [this SAP note](https://launchpad.support.sap.com/#/notes/1495075).

To install the NetWeaver provider on the Azure portal:

1. Make sure that you've completed the earlier prerequisite steps and that the server has been restarted.
1. On the Azure portal, under **Azure Monitor for SAP Solutions**, select **Add provider**, and then:

   1. For **Type**, select **SAP NetWeaver**.

   1. For **Hostname**, enter the host name of the SAP system.

   1. For **Subdomain**, enter a subdomain if one applies.

   1. For **Instance No**, enter the instance number that corresponds to the host name that you entered. 

   1. For **SID**, enter the system ID.
   
   ![Screenshot that shows the configuration options for adding a SAP NetWeaver provider.](https://user-images.githubusercontent.com/75772258/114583569-5c777d80-9c9f-11eb-99a2-8c60987700c2.png)

1.	When you're finished, select **Add provider**. Continue to add providers as needed, or select **Review + create** to complete the deployment.

### SAP HANA provider 

1. Select the **Providers** tab to add the providers that you want to configure. You can add multiple providers one after another, or add them after you deploy the monitoring resource. 

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-3.png" alt-text="Screenshot that shows the tab where you add providers." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-3.png":::

1. Select **Add provider**, and then:

   1. For **Type**, select **SAP HANA**. 

      > [!IMPORTANT]
      > Ensure that a SAP HANA provider is configured for the SAP HANA `master` node.

   1. For **IP address**, enter the private IP address for the HANA server.

   1. For **Database tenant**, enter the name of the tenant that you want to use. You can choose any tenant, but we recommend using **SYSTEMDB** because it enables a wider array of monitoring areas. 

   1. For **SQL port**, enter the port number that's associated with your HANA database. It should be in the format of *[3]* + *[instance#]* + *[13]*. An example is **30013**. 

   1. For **Database username**, enter the username that you want to use. Ensure that the database user has the *monitoring* and *catalog read* roles assigned.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-4.png" alt-text="Screenshot that shows configuration options for adding a SAP HANA provider." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-4.png":::

1. When you're finished, select **Add provider**. Continue to add providers as needed, or select **Review + create** to complete the deployment.

   
### Microsoft SQL Server provider

1. Before you add the Microsoft SQL Server provider, run the following script in SQL Server Management Studio to create a user with the appropriate permissions for configuring the provider.

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

1. Select **Add provider**, and then:

   1. For **Type**, select **Microsoft SQL Server**. 

   1. Fill out the remaining fields by using information associated with your SQL Server instance. 

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-6.png" alt-text="Screenshot that shows configuration options for adding a Microsoft SQL Server provider." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-6.png":::

1. When you're finished, select **Add provider**. Continue to add providers as needed, or select **Review + create** to complete the deployment.

### High-availability cluster (Pacemaker) provider

1. Select **Add provider**, and then:

   1. For **Type**, select **High-availability cluster (Pacemaker)**. 

      > [!IMPORTANT]
      > To configure the high-availability cluster (Pacemaker) provider, ensure that ha_cluster_provider is installed in each node. For more information, see [HA cluster exporter](https://github.com/ClusterLabs/ha_cluster_exporter#installation).

   1. For **Prometheus Endpoint**, enter **http://IP:9664/metrics**. 
 
   1. Enter the system ID, host name, and cluster name in the respective boxes.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-5.png" alt-text="Screenshot that shows options for adding a high-availability cluster Pacemaker provider." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-5.png":::

1. When you're finished, select **Add provider**. Continue to add providers as needed, or select **Review + create** to complete the deployment.

### OS (Linux) provider 

1. Select **Add provider**, and then:

   1. For **Type**, select **OS (Linux)**. 

      >[!IMPORTANT]
      > To configure an OS (Linux) provider, ensure that [latest version of node_exporter](https://prometheus.io/download/#node_exporter) is installed in each host (bare metal or VM) that you want to monitor. [Learn more](https://github.com/prometheus/node_exporter).

   1. For **Name**, enter a name that will be the identifier for the bare-metal instance.

   1. For **Node Exporter Endpoint**, enter **http://IP:9100/metrics**.

      >[!IMPORTANT]
      >Use the private IP address of the Linux host. Ensure that host and Azure Monitor for SAP resource are in the same virtual network. 
      >
      >Firewall port 9100 should be opened on the Linux host. If you're using `firewall-cmd`, use the following commands: 
      >
      >`firewall-cmd --permanent --add-port=9100/tcp`
      >
      >`firewall-cmd --reload`
      >
      >If you're using `ufw`, use the following commands:
      >
      >`ufw allow 9100/tcp`
      >
      >`ufw reload`
      >
      > If the Linux host is an Azure VM, ensure that all applicable network security groups allow inbound traffic at port 9100 from `VirtualNetwork` as the source.
 
1. When you're finished, select **Add provider**. Continue to add providers as needed, or select **Review + create** to complete the deployment. 


## Next steps

Learn more about [Azure Monitor for SAP Solutions](azure-monitor-overview.md).
