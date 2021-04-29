---
author: alkohli
ms.service: databox  
ms.subservice: pod
ms.topic: include
ms.date: 04/29/2021
ms.author: alkohli
---

When the Data Box device is connected to the Azure datacenter network, the data upload to Azure starts automatically.


**Upload completed with errors**


When files fail to upload because of an un-retryable error, you're notified to review the errors before proceeding. 


The errors are listed in the data copy log. You should review the errors and make sure you have backup copies of the files that failed to upload.


You can't fix these errors. The upload will complete with errors, and the data will then be secure erased from the device. The notification lets you know about any configuration issues you need to fix before you try another upload via network transfer or a new import order.


After 14 days, the upload will be completed automatically. By acting on the notification, you can move things along more quickly.


To review non-retryable errors and proceed with an upload, do the following:

1. Open your order in the Azure portal.  

   If any non-retryable errors prevented files from uploading, you'll see the following notification. The order status will be **Copy errors**.

   ![Notification for copy errors during an upload in the Azure portal](media/data-box-verify-upload/upload-paused-01.png)

2. Select **Review** to open a panel for managing your review.

   ![Review and proceed panel for upload errors in the Azure portal](media/data-box-verify-upload/upload-paused-02.png)

3. Review the errors in the data copy log using the path in **DATA COPY DETAILS**.

   - Make sure you have backup copies of the files that failed to upload. After the upload completes, the data will be secure erased from the Data Box.

   - Be sure to fix any configuration issues before you try another upload via a network transfer or a new import order. For guidance, see [Troubleshoot data uploads from Azure Data Box and Azure Data Box Heavy devices](../articles/databox/data-box-troubleshoot-data-upload.md).

5. Select the check box to acknowledge that you've reviewed the errors, understand that the data will be erased from the Data Box after the upload, and are ready to proceed.

6. When you're ready to complete the upload, select **Proceed**.

   ![Confirm you've reviewed the errors and are ready to proceed](media/data-box-verify-upload/upload-paused-03.png)

   If you don't take any action, the upload will be completed automatically after 14 days.

**Verify completed data upload**

After the copy completes, the Azure Data Box service notifies you that the data copy is complete via the Azure portal.

1. Check the error logs for any failures, and take appropriate actions. For more information, see [Review copy log during upload to Azure](../articles/databox/data-box-logs.md#review-copy-log-during-upload-to-azure).

2. In the Azure portal, verify that your data is in the storage account(s) before you delete the data from the source.
