---
title: Manage change tracking and inventory in Azure Automation using Azure Monitoring Agent (Preview)
description: This article tells how to use change tracking and inventory to track software and Microsoft service changes in your environment using Azure Monitoring Agent (Preview)
services: automation
ms.subservice: change-inventory-management
ms.date: 12/14/2022
ms.topic: conceptual
---

# Manage change tracking and inventory using Azure Monitoring Agent (Preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software

This article describes how to manage change tracking, and includes the procedure on how you can change a workspace and configure data collection rule.

>[!NOTE]
>Before using the procedures in this article, ensure that you've enabled Change Tracking and Inventory on your VMs. For detailed information on how you can enable, see [Enable change tracking and inventory from portal](enable-vms-monitoring-agent.md)


## Configure Windows, Linux files, and Windows Registry using Data Collection Rules

To manage tracking and inventory, ensure that you enable Change tracking with AMA on your VM. 

1. In the Azure portal, select the virtual machine.
1. Select a specific VM for which you would like to configure the Change tracking settings. 
1. Under **Operations**, select **Change tracking**
1. Select **Settings** to view the **Data Collection Rule Configuration** (DCR) page. Here, you can do the following actions:
   1. Configure changes on a VM at a granular level.  
   1. Select the filter to configure the workspace.
   1. Use the filter to view all the DCRs that are configured to the specific LA workspace level.

   >[!NOTE]
   >The settings that you configure are applicable to all the VMs that are attached to a specific DCR. For more information about DCR, see [Data collection rules in Azure Monitor](../../azure-monitor/essentials/data-collection-rule-overview.md).

1. Select **Add** to configure new file settings
   
   #### [Windows Files](#tab/windows)

    In the **Add Windows File setting** pane, enter the information for the file or folder to track and 
    click **Save**. The following table defines the properties that you can use for the information.

    |**Property**|**Description**|
    |---|---|
    |Enabled | True if the setting is applied, and false otherwise.|
    |Item Name | Friendly name of the file to be tracked. | 
    |Group | A group name to group files logically| 
    |Path | The path to check for the file, for example, **c:\temp\*.txt.** You can also use environment variables, such as %winDir%\System32\\\*.*. 
    |Path Type | The type of path. Possible values are File and Folder.|
    |Recursion | True if recursion is used when looking for the item to be tracked, and False otherwise. |

   #### [Linux Files](#tab/linux)

    In the **Add Linux File for Change Tracking** page, enter the information for the file or directory to 
    track and then select **Save**. The following table defines the properties that you can use for the information. 
    
    |**Property**|**Description**|
    |---|---|
    |Enabled | True if the setting is applied, and false otherwise.|
    |Item Name | Friendly name of the file to be tracked. | 
    |Group | A group name to group files logically| 
    |Path | The path to check for the file, for example, /etc/*.conf.  
    |Path Type | The type of path. Possible values are File and Folder.|
    |Recursion | True if recursion is used when looking for the item to be tracked, and False otherwise. |
   
---

You can now view the virtual machines configured to the DCR.

### Configure using wildcards
 
To configure the monitoring of files and folders using wildcards, do the following: 

- Wildcards are required for tracking multiple files. 
- Wildcards can only be used in the last segment of a path, such as C:\folder\file or /etc/.conf* 
- If an environment variable includes a path that is not valid, validation will succeed but the path will fail when inventory runs. 
- When setting the path avoid general paths such as c:.** which will result in too many folders being traversed. 


## Next steps

* To learn about alerts, see [Configuring alerts](../change-tracking/configure-alerts.md)
