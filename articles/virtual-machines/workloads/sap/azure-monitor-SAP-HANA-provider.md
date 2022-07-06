---
title: Azure Monitor for SAP Solutions providers - SAP HANA Provider | Microsoft Docs
description: This article provides details to configure SAP HANA Provider for Azure monitor for SAP solutions.
author: sujaj
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: article
ms.date: 07/06/2022
ms.author: sujaj

---


# SAP HANA Provider

>![Note]
> This content would apply to both new and classic version of Azure Monitor for SAP solutions.

### For Azure Monitor for SAP solutions
#### Add SAP HANA Provider Steps (Using Portal UI):

1. Click on the **Providers** Tab in the AMS creation blade, then click on &quot; Add Provider&quot; button to go to the &quot; Add Provider&quot; Page

![image](https://user-images.githubusercontent.com/74435183/162337421-67c50f88-c5e8-4c5a-b9bc-ea0096b2827e.png)

2. Select Type as SAP HANA

![image](https://user-images.githubusercontent.com/98498799/171365559-80de91c9-601b-41e6-a91a-4ec9b28e0958.png)

3. IP address - Provide the IP address or hostname of the server running the SAP HANA instance to be monitored; when using a hostname, please ensure connectivity from within the Vnet.
4. Database tenant - Provide the HANA database to connect against (we strongly recommend using SYSTEMDB, since tenant databases don&#39;t have all monitoring views). Leave this field blank for legacy single-container HANA 1.0 instances.
5. Instance number - Provide the Instance number of the database [00-99], SQL port is automatically determined based on the instance number."
6. Database username - Provide the dedicated SAP HANA database user with the MONITORING role or BACKUP CATALOG READ role assigned (alternatively, use SYSTEM for non-production SAP HANA instances).
7. Database password - Provide the password corresponding to the database username, where you have two options on how to provide it:     
      a. Provide the password in the plain text.   
      b. Provide the password by selecting an existing or creating a new secret inside an Azure KeyVault.

### For Azure Monitor for SAP solutions (classic)

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