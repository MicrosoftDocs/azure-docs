---
title: Advanced Data Security for IaaS in Azure Security Center | Microsoft Docs
description: " Learn how to enable advanced data security for IaaS in Azure Security Center. "
services: security-center
documentationcenter: na
author: monhaber
manager: barbkess
editor: monhaber

ms.assetid: ba46c460-6ba7-48b2-a6a7-ec802dd4eec2
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/02/2019
ms.author: monhaber

---

# Enabling Advanced Data Security for IaaS


## Setting up the 
1. You need a Log Analytics workspace to store the security logs being analyzed. If you do not have one, then create one. For intstructions, see [Create a Log Analyitcs workspace in the Azure portal](https://docs.microsoft.com/en-us/azure/azure-monitor/learn/quick-create-workspace).
1. Connect the VM hosting the SQL server to the Log Analytics workspace. For instructions, see [Connect Windows computers to Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/agent-windows).
1. Go to **Marketplace** > **Get Started**.
1. Search for SQL Advanced Data Security. 
    ![Advanced Data Security for IaaS](.\media\security-center-iaas-data\sql-advanced-data-security.png)
1. Click **SQL Advanced Data Security**. The **SQL Advanced Data Security** page open.
   ![Advanced Data Security Create](.\media\security-center-iaas-data\sql-advanced-data-create.png)
1. Click **Create**.
1. Select the workspace to use and click **Create**.
   ![Select workspace](.\media\security-center-iaas-data\sql-workspace.png)

1. Restart the [VM's SQL server](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/start-stop-pause-resume-restart-sql-server-services?view=sql-server-2017).

