---
author: alkohli
ms.service: databox  
ms.subservice: pod
ms.topic: include
ms.date: 04/21/2021
ms.author: alkohli
---

When the Data Box device is connected to the Azure datacenter network, the data upload to Azure starts automatically.

#### Upload completed with errors

When files fail to upload because of data configuration errors, the data copy is placed in a XXX state, and you're notified to review the errors and choose whether to proceed with the upload or cancel the order.

You can't fix these errors during this phase of the order process, but you need to review the log and decide whether it's better to proceed with this order or start a new order. 

The order will be automatically completed after 14 days if you don't respond to the notification.

To review data copy errors during an upload, do the following:

1. Open the Data Box import order in the Azure portal.

1. If you see the following notification, carefully review these errors in the copy log, and decide how to proceed. 

   ![Copy completed with errors notification in local web UI](media/data-box-verify-upload/copy-completed-with-errors-01.png)

   You can't fix these errors during this phase of order processing, but you need to review the log and decide whether it's better to proceed with this order or start a new order.

   For example, if two or three files failed to upload, you could proceed with the order and later transfer the missing files over the network.

   On the other hand, if a large set of files failed to upload for unknown reasons, you'll need to cancel the upload, investigate, and start a new import order after resolving the issues.

   For detailed troubleshooting for this type of errors, see [Troubleshoot paused data uploads from Azure Data Box and Azure Data Box Heavy devices](../articles/databox/data-box-troubleshoot-data-upload.md).

   For more information about the copy log, see [Review copy log during upload to Azure](../articles/databox/data-box-logs.md#review-copy-log-during-upload-to-azure).

1. Select the check box to confirm that you've reviewed the errors in the copy log.

1. Choose what to do with the order:

   - Select **Proceed** to complete data copy and complete the order.

     The data will be secure erased from the Data Box after the upload is completed.
   
   - Select **Cancel** to cancel the data copy. Then [start a new import order](../articles/databox/data-box-deploy-ordered.md?tabs=portal). after resolving the issues. 

#### Verify completed data upload

After the copy completes, the Azure Data Box service notifies you that the data copy is complete via the Azure portal.

ADD ART: Import order in Completed state

1. Check the error logs for any failures, and take appropriate actions.<!--Log name and location. Can they get there from the portal?-->

2. In the Azure portal, verify that your data is in the storage account(s) before you delete the data from the source.
