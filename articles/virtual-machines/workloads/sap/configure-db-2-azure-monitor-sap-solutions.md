---
title: Create IBM Db2 provider for Azure Monitor for SAP solutions (preview)
description: This article provides details to configure an IBM DB2 provider for Azure Monitor for SAP solutions (AMS).
author: MightySuz
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: article
ms.date: 07/21/2022
ms.author: sujaj

---



# Create IBM Db2 provider for Azure Monitor for SAP solutions (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

This article explains how to create an IBM Db2 provider for Azure Monitor for SAP solutions (AMS) through the Azure portal. This content applies only to AMS, not the AMS (classic) version.


To create the IBM Db2 provider for AMS:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the AMS service. 
1. Open the AMS resource you want to modify.
1. On the resource's menu, under **Settings**, select **Providers**.
1. Select **Add** to add a new provider.
    1. For **Type**, select **IBM Db2**.
    1. Enter the IP address for the hostname.
    1. Enter the database name.
    1. Enter the database port.
    1. Save your changes.
1. Configure more providers for each instance of the database.
    
