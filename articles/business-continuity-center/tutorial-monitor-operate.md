---
title: Tutorial - Monitor and operate jobs
description: In this tutorial, learn how to monitor jobs across your business continuity estate using Azure Business Continuity center.
ms.topic: tutorial
ms.date: 10/19/2023
ms.service: backup
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorials: Monitor jobs across your business continuity estate (preview)


Azure Business Continuity center (preview) allows you to view jobs across Azure Backup and Azure Site Recovery, with ability to filter, view details of individual jobs and take appropriate action. 

## Monitor jobs

Follow these steps to monitor jobs:

1. In Azure Business Continuity center, select the **Jobs** to view all your jobs. 
1. The **Status** column displays a summarized view by job status – *completed*, *failed*, *canceled*, *in progress*, *completed with warning*, and *completed with information*. Select each status to filter the view. 

    Alternatively, you can select the more icon (`...`) beside any job to open the action menu. You can also select any value under the **Operation** column to view details of the Job.  
   
    :::image type="content" source="./media/tutorial-monitor-operate/job-homepage.png" alt-text="Screenshot showing the Jobs homepage." lightbox="./media/tutorial-monitor-operate/job-homepage.png":::

1. To change the scope for **Jobs** view from the scope-picker, select the required options: 
       :::image type="content" source="./media/tutorial-monitor-operate/scope-picker.png" alt-text="Screenshot showing the scope picker option." lightbox="./media/tutorial-monitor-operate/scope-picker.png":::
    1. **Resource managed by**:
        1. **Azure resource:** Resources that are under the direct management and control of Azure. Azure resources are provisioned, configured, and monitored through Azure's services and tools. They are fully integrated into the Azure ecosystem, allowing for seamless management and optimization. 
        1. **Non-Azure resources**: Resources that exist outside the scope of Azure's management. They are not under the direct control of Azure services. Non-Azure resources might include on-premises servers, third-party cloud services, or any infrastructure not governed by Azure's management framework. Managing non-Azure resources might require separate tools and processes. 
    1. **Job source:**
        1. **Protected items**: Use this option to view jobs that are associated with a protected item. For example, backup jobs, restore jobs, test failover jobs, etc. 
        1. **Other**: Use this option to view jobs that are associated with a different entity For example, Azure Site Recovery jobs like the network, replication policy etc. 
        
## Next steps

- [Configure datasources](./tutorial-configure-protection-datasource.md)

 
