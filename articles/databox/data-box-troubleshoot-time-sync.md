---
title: Troubleshoot time sync issues for Azure Data Box, Azure Data Box Heavy devices
description: Describes how to troubleshoot time sync issues for Azure Data Box or Azure Data Box Heavy device via the PowerShell interface.
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: troubleshooting
ms.date: 08/16/2021
ms.author: alkohli
---

# Troubleshoot time sync issues for Azure Data Box and Azure Data Box Heavy devices

This article describes how to troubleshoot time sync issues of Azure Data Box or Azure Data Box Heavy devices.

> [!NOTE]
> The information in this article applies to import orders only. <!-- verify this is actually the case-->

## Connect to the PowerShell interface

When data is uploaded to Azure from your device, some file uploads might occasionally fail because of configuration errors that can't be resolved through a retry. In that case, you receive a notification to give you a chance to review and fix the errors for a later upload.

You'll see the following notification in the Azure portal. The errors are listed in the data copy log, which you can open using the **DATA COPY PATH**. For guidance on resolving the errors, see [Summary of non-retryable upload errors](#summary-of-non-retryable-upload-errors).

![Notification of errors during upload](media/data-box-troubleshoot-data-upload/copy-completed-with-errors-notification-01.png)


## Connect to the PowerShell interface

To troubleshoot time sync issues, you'll first need to connect to the PowerShell interface of your device.

[!INCLUDE [data-box-connect-powershell-interface](../../includes/data-box-review-nonretryable-errors.md)]


## Summary of non-retryable upload errors

The following non-retryable errors result in a notification:

|Error category                    |Error code |Error message                                                                             |
|----------------------------------|-----------|------------------------------------------------------------------------------------------|


> [!NOTE]
> The **Follow-up** sections in the error descriptions describe how to update your data configuration before you place a new import order or perform a network transfer. You can't fix these errors in the current upload.




## Next steps

- [Review common REST API errors](/rest/api/storageservices/common-rest-api-error-codes).
- [Verify a data upload to Azure](data-box-deploy-picked-up.md?tabs=in-us-canada-europe#verify-data-upload-to-azure-8)