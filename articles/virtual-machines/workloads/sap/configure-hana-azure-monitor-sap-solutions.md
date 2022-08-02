---
title: Configure SAP HANA provider for Azure Monitor for SAP solutions (preview)
description: Learn how to configure the SAP HANA provider for Azure Monitor for SAP solutions (AMS) through the Azure portal.
author: MightySuz
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: article
ms.date: 07/21/2022
ms.author: sujaj

---


# Configure SAP HANA provider for Azure Monitor for SAP solutions (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

This article explains how to configure the SAP HANA provider for Azure Monitor for SAP solutions (AMS) through the Azure portal. There are instructions to set up the [current version](#configure-ams) and the [classic version](#configure-ams-classic) of AMS.


## Configure AMS

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure Monitors for SAP solutions** in the search bar.
1. On the AMS service page, select **Create**.
1. On the AMS creation page, enter your basic resource information on the **Basics** tab.
1. On the **Providers** tab:
    * Select **Add provider**.
    * On the creation pane, for **Type**, select **SAP HANA**.

   ![Diagram shows the provider details that need to be filled.](./media/azure-monitor-sap/azure-monitor-providers-hana-setup.png)


    * For **IP address**, enter the IP address or hostname of the server that runs the SAP HANA instance that you want to monitor. If you're using a hostname, make sure there is connectivity within the virtual network.
    * For **Database tenant**, enter the HANA database that you want to connect to. It's recommended to use **SYSTEMDB**, because tenant databases don't have all monitoring views. For legacy single-container HANA 1.0 instances, leave this field blank.
    * For **Instance number**, enter the instance number of the database (0-99). The SQL port is automatically determined based on the instance number.
    * For **Database username**, enter the dedicated SAP HANA database user. This user needs the **MONITORING** or **BACKUP CATALOG READ** role assignment. For non-production SAP HANA instances, use **SYSTEM** instead.
    * For **Database password**, enter the password for the database username.  You can either enter the password directly or use a secret inside Azure Key Vault.
1. Save your changes to the AMS resource.

## Configure AMS (classic)


To configure the SAP HANA provider for AMS (classic):

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select the **Azure Monitors for SAP Solutions (classic)** service in the search bar.
1. On the AMS (classic) service page, select **Create**.
1. On the creation page's **Basics** tab, enter the basic information for your AMS instance.
1. On the **Providers** tab, add the providers that you want to configure. You can add multiple providers during creation. You can also add more providers after you deploy the AMS resource. For each provider:
    * Select **Add provider**.
    * For **Type**, select **SAP HANA**. Make sure that you configure an SAP HANA provider for the main node.
    * For **IP address**, enter the private IP address for the HANA server.
    * For **Database tenant**, enter the name of the tenant that you want to use. You can choose any tenant. However, it's recommended to use **SYSTEMDB**, because this tenant has more monitoring areas.
    * For **SQL port**, enter the port number for your HANA database. The format begins with 3, includes the instance number, and ends in 13. For example, 30013 is the SQL port for the instance 001.
    * For **Database username**, enter the username that you want to use. Make sure the database user has **monitoring** and **catalog read** role assignments.
    * Select **Add provider** to finish adding the provider.

1. Select **Review + create** to review and validate your configuration.
1. Select **Create** to finish creating the AMS resource.