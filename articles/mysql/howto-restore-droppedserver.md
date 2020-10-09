---
title: Restore a dropped Azure Database for MySQL server
description: This article describes how to restore a dropped server in Azure Database for MySQL using the Azure portal.
author: savjani
ms.author: pariks
ms.service: mysql
ms.topic: how-to
ms.date: 10/09/2020
---

# Restore a dropped Azure Database for MySQL server

[!INCLUDEapplies-to-single-server]

When a server is dropped, the database server backup can be retained up to 5 days in the service. The database backup can be accessed and restored only from the Azure subscription where the server originally resided. The following recommended steps can be followed to recover a dropped MySQL server resource within 5 days from the time of server deletion. The recommended steps will work only if the backup for the server is still available and not deleted from the system. 

## Pre-requisites
In order to restore a dropped Azure Database for MySQL server, you need to be aware of following:
- Azure Subscription hosting the original server
- Location where the server was created

## Steps to Restore

1. Go to the [Activity Log](https://ms.portal.azure.com/#blade/Microsoft_Azure_ActivityLog/ActivityLogBlade) from Monitor blade in Azure portal. 

2. In Activity Log, click on **Add filter** as shown and set following filters for the 

    - **Subscription** = Your Subscription hosting the deleted server
    - **Resource Type** = Azure Database for MySQL servers (Microsoft.DBforMySQL/servers) 
    - **Operation** = Delete MySQL Server (Microsoft.DBforMySQL/servers/delete)


    >[!div class="mx-imgBorder"]
    > :::image type="content" source="./media/howto-restore-droppedserver/Activitylog.png" alt-text="Activity log filtered for Dropped MySQL server event":::
    
 3. Double Click on the Delete MySQL Server event and click on the JSON tab and note down the "resourceId" and "submissionTimestamp" attributes in JSON output. The resourceId is in the following format: /subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/TargetResourceGroup/providers/Microsoft.DBforMySQL/servers/deletedserver.
 
 4. Go to [Create Server REST API Page](https://docs.microsoft.com/rest/api/mysql/servers/create) and click on "Try It" tab highlighted in green and login in with your Azure account.
 
 5. Provide the resourceGroupName, serverName (deleted server name), subscriptionId, derived from resourceId attribute captured in Step 3, while api-version is pre-populated as shown below
 
    >[!div class="mx-imgBorder"]
    > :::image type="content" source="./media/howto-restore-droppedserver/CreateServerRestAPI.png" alt-text="Create Server from backup using REST API":::
 
 6. Scroll below on Request Body section and paste the following substituting the Dropped Server Location, submissionTimestamp, and resourceId. For restorePointInTime, specify a value of submissionTimestamp minus **15 minutes** to ensure the command doesnt error out.
 
    ```json
        {
          "location": "Dropped Server Location",  
          "properties": 
	          {
    		      "restorePointInTime": "submissionTimestamp - 15 minutes",
    		      "createMode": "PointInTimeRestore",
    		      "sourceServerId": "resourceId"
  	        }
        }
    ```

7. If you see Response Code 201 or 202, the restore request is successfully submitted. 

8. The server creation can take time depending on the database size and compute resources provisioned on the original server. The restore status can be monitored from Activity log by filtering for 
   - **Subscription** = Your Subscription
   - **Resource Type** = Azure Database for MySQL servers (Microsoft.DBforMySQL/servers) 
   - **Operation** =  Update MySQL Server Create
   
If you are trying to restore a dropped server after 5 days, an error is expected since the backup file cannot be found. Please do not open a support ticket in this case as the support team cannot provide any assistance if the backup is deleted from the system. If you are trying to restore a server within 5 days and still receive an error after accurately following the steps above, you can open a support incident for assistance. 

To prevent accidential deletion of servers, we highly recommend leveraging [Resource Locks](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/preventing-the-disaster-of-accidental-deletion-for-your-mysql/ba-p/825222).
