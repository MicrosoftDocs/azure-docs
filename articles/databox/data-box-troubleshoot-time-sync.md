---
title: Troubleshoot time sync issues for Azure Data Box, Azure Data Box Heavy devices
description: Describes how to troubleshoot time sync issues for Azure Data Box or Azure Data Box Heavy device via the PowerShell interface.
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.custom:
ms.topic: troubleshooting
ms.date: 11/15/2021
ms.author: alkohli
---

# Sync device time for Azure Data Box and Azure Data Box Heavy

This article describes how to diagnose that your Data Box is out of sync and then change the time on your Data Box device. The information in this article applies to import and export orders on both Data Box and Data Box Heavy devices.


## About device time sync

Data Box automatically synchronizes time when it is connected to the internet using the default Windows time server `time.windows.com`. However, if Data Box is not connected to the internet, the device time may be out of sync. This situation may affect the data copy from the source data to Data Box specifically if the copy is via the REST API or certain tools that have time constraints.

If you see any time difference between the time on Data Box and other local devices on your site, you can sync the time on your Data Box by accessing its PowerShell interface. The `Set-Date API` is used to modify the device time. For more information, see [Set-Date cmdlet](/powershell/module/microsoft.powershell.utility/set-date).


## Connect to PowerShell interface

To troubleshoot time sync issues, you'll first need to connect to the PowerShell interface of your device.

[!INCLUDE [Connect to Data Box PowerShell interface](../../includes/data-box-connect-powershell-interface.md)]


## Change device time

To change the device time, follow these steps.

1. To diagnose if the device time is out of sync, get the device time first. Use the `Get-Date` cmdlet to view the date and time on your Data Box.

    `Get-Date`

1. If the device time is out of sync, use the `Set-Date` cmdlet to change the time on your Data Box.

    - Set the time forward by 2 minutes.

        ```powershell
        Set-Date -Adjust <time change in hours:mins:secs format> -DisplayHint Time
        ```
    - Set the time back by 2 minutes.

        ```powershell
        Set-Date -Adjust -<time change in hours:mins:secs format> -DisplayHint Time
        ```

        Here is an example output:

        ```powershell
        [by506b4b5d0790.microsoftdatabox.com]: PS>Get-date
        Friday, September 3, 2021 2:22:50 PM
        [by506b4b5d0790.microsoftdatabox.com]: PS>Set-Date -Adjust 00:02:00 -DisplayHint Time
        2:25:18 PM
        [by506b4b5d0790.microsoftdatabox.com]: PS>Set-Date -Adjust -00:02:00 -DisplayHint Time
        2:23:28 PM
        [by506b4b5d0790.microsoftdatabox.com]: PS>Get-date
        Friday, September 3, 2021 2:23:42 PM
        [by506b4b5d0790.microsoftdatabox.com]: PS>
        ```
        For more information, see [Set-Date cmdlet](/powershell/module/microsoft.powershell.utility/set-date).

## Next steps

To troubleshoot other Data Box issues, see one of the following articles:

- [Troubleshoot Data Box Blob storage errors](data-box-troubleshoot-rest.md).
- [Troubleshoot Data Box data copy errors](data-box-troubleshoot.md).
- [Troubleshoot Data Box data upload errors](data-box-troubleshoot-data-upload.md).
