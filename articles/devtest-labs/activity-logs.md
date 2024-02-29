---
title: Activity logs
description: This article provides steps to view activity logs for Azure DevTest Labs. 
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 07/10/2020
ms.custom: UpdateFrequency2
---

# View activity logs for labs in Azure DevTest Labs 
After you create one or more labs, you'll likely want to monitor how and when your labs are accessed, modified, and managed, and by whom. Azure DevTest Labs uses Azure Monitor, specifically **activity logs**, to provide information these operations against labs. 

This article explains how to view  activity logs for a lab in Azure DevTest Labs.

## View activity log for a lab

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All Services**, and then select **DevTest Labs** in the **DEVOPS** section. If you select * (star) next to **DevTest Labs** in the **DEVOPS** section. This action adds **DevTest Labs** to the left navigational menu so that you can access it easily the next time. Then, you can select **DevTest Labs** on the left navigational menu.

    ![All services - select DevTest Labs](./media/devtest-lab-create-lab/all-services-select.png)
1. From the list of labs, select your lab.
1. On the home page for the lab, select **Configurations and policies** on the left menu. 

    :::image type="content" source="./media/activity-logs/configuration-policies-link.png" alt-text="Select Configuration and policies on the left menu":::
1. On the **Configuration and policies** page, select **Activity log** on the left menu under **Manage**. You should see entries for operations done on the lab. 

    :::image type="content" source="./media/activity-logs/activity-log.png" alt-text="Activity log":::    
1. Select an event to see details about it. On the **Summary** page, you see information such as operation name, time stamp, and who did the operation. 
    
    :::image type="content" source="./media/activity-logs/stop-vm-event.png" alt-text="Stop VM event - summary":::        
1. Switch to the **JSON** tab to see more details. In the following example, you can see the name of the VM and the operation done on the VM (stopped).

    :::image type="content" source="./media/activity-logs/stop-vm-event-json.png" alt-text="Stop VM event - JSON":::           
1. Switch to the **Change history (Preview)** tab to see the history of changes. In the following example, you see the change that was made on the VM. 

    :::image type="content" source="./media/activity-logs/change-history.png" alt-text="Stop VM event - Change history":::             
1. Select the change in the change history list to see more details about the change. 

    :::image type="content" source="./media/activity-logs/change-details.png" alt-text="Stop VM event - Change details":::             

For more information about activity logs, see [Azure Activity Log](../azure-monitor/essentials/activity-log.md).

## Next steps

- To learn about setting **alerts** on activity logs, see [Create alerts](create-alerts.md).
- To learn more about activity logs, see  [Azure Activity Log](../azure-monitor/essentials/activity-log.md).
