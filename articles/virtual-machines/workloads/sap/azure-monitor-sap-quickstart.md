---
title: Deploy Azure Monitor for SAP Solutions with the Azure portal
description: Learn how to use a browser method for deploying Azure Monitor for SAP Solutions.
author: sameeksha91
ms.author: sakhare
ms.topic: how-to
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.date: 07/08/2021

---	

# Deploy Azure Monitor for SAP Solutions by using the Azure portal

In this article, we'll walk through deploying Azure Monitor for SAP Solutions from the [Azure portal](https://azure.microsoft.com/features/azure-portal). Using the portal's browser-based interface, we'll both deploy Azure Monitor for SAP Solutions and configure providers.

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

To fetch specific metrics, you need to unprotect some methods for the current release. Follow these steps for each SAP system:

1. Open an SAP GUI connection to the SAP server.
2. Sign in by using an administrative account.
3. Execute transaction RZ10.
4. Select the appropriate profile (*DEFAULT.PFL*).
5. Select **Extended Maintenance** > **Change**. 
6. Select the profile parameter "service/protectedwebmethods” and modify to have the following value, then click Copy:  
 
SDEFAULT -GetQueueStatistic -ABAPGetWPTable -EnqGetStatistic -GetProcessList 

7. Go back and select **Profile** > **Save**.
8. After saving the changes for this parameter, please restart the SAPStartSRV service on each of the instances in the SAP system. (Restarting the services will not restart the SAP system; it will only restart the SAPStartSRV service (in Windows) or daemon process (in Unix/Linux))
   8a. On Windows systems, this can be done in a single window using the SAP Microsoft Management Console (MMC) / SAP Management Console(MC).  Right-click on each instance and choose All Tasks -> Restart Service.
![MMC](https://user-images.githubusercontent.com/75772258/126453939-daf1cf6b-a940-41f6-98b5-3abb69883520.png)
   8b. On Linux systems, use the command:  sapcontrol -nr <NN> -function RestartService, where NN is the SAP instance number to restart the host which is logged into.
9. Once the SAP service is restarted, please check to ensure the updated web method protection exclusion rules have been applied for each instance by running the following command: 
sapcontrol -nr <NN> -function ParameterValue service/protectedwebmethods -user “<adminUser>” “<adminPassword>”
The output should look like :-
![SS](https://user-images.githubusercontent.com/75772258/126454265-d73858c3-c32d-4afe-980c-8aba96a0b2a4.png)
10. To conclude and validate, a test query can be done against web methods to validate the connection by logging into each instance and running the following commands:
For all instances : sapcontrol -nr <NN> -function GetProcessList
For the ENQUE instance : sapcontrol -nr <NN> -function EnqGetStatistic
For ABAP instances : sapcontrol -nr <NN> -function ABAPGetWPTable
For ABAP/J2EE/JEE instances : sapcontrol -nr <NN> -function GetQueueStatistic

>[!Important] 
>It is critical that the sapstartsrv service is restarted on each instance of the SAP system for the SAPControl web methods to be unprotected.  These read-only SOAP API are required for the NetWeaver provider to fetch metric data from the SAP System and failure to unprotect these methods will lead to empty or missing visualizations on the NetWeaver metric workbook.
   
>[!Tip]
> Use an access control list (ACL) to filter the access to a server port. For more information, see [this SAP note](https://launchpad.support.sap.com/#/notes/1495075).

To install the NetWeaver provider on the Azure portal:

1. Make sure you've completed the earlier prerequisite steps and that the server has been restarted.
1. On the Azure portal, under **Azure Monitor for SAP Solutions**, select **Add provider**, and then:

   1. For **Type**, select **SAP NetWeaver**.

   1. For **Hostname**, enter the host name of the SAP system.

   1. For **Subdomain**, enter a subdomain if one applies.

   1. For **Instance No**, enter the instance number that corresponds to the host name you entered. 

   1. For **SID**, enter the system ID.
   
   ![Screenshot showing the configuration options for adding a SAP NetWeaver provider.](https://user-images.githubusercontent.com/75772258/114583569-5c777d80-9c9f-11eb-99a2-8c60987700c2.png)

1.	When you're finished, select **Add provider**. Continue to add providers as needed, or select **Review + create** to complete the deployment.

>[!Important]
>If the SAP application servers (ie. virtual machines) are part of a network domain, such as one managed by Azure Active Directory, then it is critical that the corresponding subdomain is provided in the Subdomain text box.  The Azure Monitor for SAP collector VM that exists inside the Virtual Network is not joined to the domain and as such will not be able to resolve the hostname of instances inside the SAP system unless the hostname is a fully qualified domain name.  Failure to provide this will result in missing / incomplete visualizations in the NetWeaver workbook.
 
>For example, if the hostname of the SAP system has a fully qualified domain name of “myhost.mycompany.global.corp” then please enter a Hostname of “myhost” and provide a Subdomain of “mycompany.global.corp”.  When the NetWeaver provider invokes the GetSystemInstanceList API on the SAP system, SAP returns the hostnames of all instances in the system.  The collector VM will use this list to make additional API calls to fetch metrics specific to each instance’s features (e.g.  ABAP, J2EE, MESSAGESERVER, ENQUE, ENQREP, etc…). If specified, the collector VM will then use the subdomain  “mycompany.global.corp” to build the fully qualified domain name of each instance in the SAP system.  
 
>Please DO NOT specify an IP Address for the hostname field if the SAP system is a part of network domain.

   
### SAP HANA provider 

1. Select the **Providers** tab to add the providers you want to configure. You can add multiple providers one after another, or add them after you deploy the monitoring resource. 

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-3.png" alt-text="Screenshot showing the tab where you add providers." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-3.png":::

1. Select **Add provider**, and then:

   1. For **Type**, select **SAP HANA**. 

      > [!IMPORTANT]
      > Ensure that a SAP HANA provider is configured for the SAP HANA `master` node.

   1. For **IP address**, enter the private IP address for the HANA server.

   1. For **Database tenant**, enter the name of the tenant you want to use. You can choose any tenant, but we recommend using **SYSTEMDB** because it enables a wider array of monitoring areas. 

   1. For **SQL port**, enter the port number associated with your HANA database. It should be in the format of *[3]* + *[instance#]* + *[13]*. An example is **30013**. 

   1. For **Database username**, enter the username you want to use. Ensure the database user has the *monitoring* and *catalog read* roles assigned.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-4.png" alt-text="Screenshot showing configuration options for adding an SAP HANA provider." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-4.png":::

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

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-6.png" alt-text="Screenshot showing configuration options for adding a Microsoft SQL Server provider." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-6.png":::

1. When you're finished, select **Add provider**. Continue to add providers as needed, or select **Review + create** to complete the deployment.

### High-availability cluster (Pacemaker) provider

Before adding providers for high-availability (pacemaker) clusters, please install appropriate agent for your environment.

For **SUSE** based clusters, ensure ha_cluster_provider is installed in each node. See how to install [HA cluster exporter](https://github.com/ClusterLabs/ha_cluster_exporter#installation). Supported SUSE versions: SLES for SAP 12 SP3 and above.  
   
For **RHEL** based clusters, ensure performance co-pilot (PCP) and pcp-pmda-hacluster sub package is installed in each node. See how to install [PCP HACLUSTER agent] (https://access.redhat.com/articles/6139852). Supported RHEL versions: 8.2, 8.4 and above.
 
After completing above pre-requisite installation, create a provider for each cluster node.

1. Select **Add provider**, and then:

1. For **Type**, select **High-availability cluster (Pacemaker)**. 
   
1. Configure providers for each node of cluster by entering endpoint URL in **HA Cluster Exporter Endpoint**. For **SUSE** based clusters enter **http://<IP  address>:9664/metrics**. For **RHEL** based cluster, enter **http://<IP address>:44322/metrics?names=ha_cluster**
 
1. Enter the system ID, host name, and cluster name in the respective boxes.
   
   > [!IMPORTANT]
   > Host name refers to actual host name in the VM. Please use "hostname -s" command for both SUSE and RHEL based clusters.  

1. When you're finished, select **Add provider**. Continue to add providers as needed, or select **Review + create** to complete the deployment.

### OS (Linux) provider 

1. Select **Add provider**, and then:

   1. For **Type**, select **OS (Linux)**. 

      >[!IMPORTANT]
      > To configure an OS (Linux) provider, ensure the [latest version of node_exporter](https://prometheus.io/download/#node_exporter) is installed in each host (BareMetal or virtual machine) you want to monitor. [Learn more](https://github.com/prometheus/node_exporter).

   1. For **Name**, enter a name that will be the identifier for the BareMetal instance.

   1. For **Node Exporter Endpoint**, enter **http://IP:9100/metrics**.

      >[!IMPORTANT]
      >Use the private IP address of the Linux host. Ensure that the host and Azure Monitor for SAP resource are in the same virtual network. 
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
      > If the Linux host is an Azure virtual machine (VM), ensure that all applicable network security groups allow inbound traffic at port 9100 from `VirtualNetwork` as the source.
 
1. When you're finished, select **Add provider**. Continue to add providers as needed, or select **Review + create** to complete the deployment. 


## Next steps

Learn more about Azure Monitor for SAP Solutions.

> [!div class="nextstepaction"]
> [Monitor SAP on Azure](monitor-sap-on-azure.md)
