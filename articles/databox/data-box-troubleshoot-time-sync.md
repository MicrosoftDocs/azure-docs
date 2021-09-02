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

This article describes how to diagnose that your Data Box is out of sync and then change the time on your Data Box device. The information in this article applies to both Data Box and Data Box Heavy devices.

> [!NOTE]
> The information in this article applies to import orders only. <!-- verify this is actually the case-->


## About synchronizing device time

Data Box automatically synchronizes time when it is connected to the internet using the default Windows time server `time.windows.com`. However, if Data Box is not connected to the internet, the device time may be out of sync. This situation may affect the data copy from the source data to Data Box specifically if the copy is via the REST API or certain tools that have time constraints. 

If you see any time difference between the time on Data Box and other local devices on your site, you can sync the time on your Data Box by accessing its PowerShell interface. 


## Connect to the PowerShell interface

To troubleshoot time sync issues, you'll first need to connect to the PowerShell interface of your device.

!INCLUDE[data-box-connect-powershell-interface](../../includes/data-box-connect-powershell-interface.md)


### Change device time

To change the device time, follow these steps.

1. Use the Get-Date cmdlet to view the date and time on your Data Box.

    `Get-Date`

1. Use the Set-Date cmdlet to change the time on your Data Box.

    ```powershell
    Set-Date -Adjust <time change in hours:mins:secs format> -DisplayHint Time
    ```

    Here is an example output:
    
    ```powershell
    PS C:\WINDOWS\system32> Get-Date
    Wednesday, August 18, 2021 4:32:42 PM
    PS C:\WINDOWS\system32> Set-Date -Adjust 0:2:0 -DisplayHint Time
    4:35:09 PM
    PS C:\WINDOWS\system32>
    ```


## Next steps

- [Review common REST API errors](/rest/api/storageservices/common-rest-api-error-codes).
- [Verify a data upload to Azure](data-box-deploy-picked-up.md?tabs=in-us-canada-europe#verify-data-upload-to-azure-8)