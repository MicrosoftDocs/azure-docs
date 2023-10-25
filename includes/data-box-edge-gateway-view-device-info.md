---
author: stevenmatthew
ms.service: databox  
ms.topic: include
ms.date: 03/04/2019
ms.author: shaas
---

1. [Connect to the PowerShell interface](#connect-to-the-powershell-interface).
2. Use the `Get-HcsApplianceInfo` to get the information for your device.

    The following example shows the usage of this cmdlet:

    ```
    [10.100.10.10]: PS>Get-HcsApplianceInfo
    
    Id                            : b2044bdb-56fd-4561-a90b-407b2a67bdfc
    FriendlyName                  : DBE-NBSVFQR94S6
    Name                          : DBE-NBSVFQR94S6
    SerialNumber                  : HCS-NBSVFQR94S6
    DeviceId                      : 40d7288d-cd28-481d-a1ea-87ba9e71ca6b
    Model                         : Virtual
    FriendlySoftwareVersion       : Data Box Gateway 1902
    HcsVersion                    : 1.4.771.324
    IsClustered                   : False
    IsVirtual                     : True
    LocalCapacityInMb             : 1964992
    SystemState                   : Initialized
    SystemStatus                  : Normal
    Type                          : DataBoxGateway
    CloudReadRateBytesPerSec      : 0
    CloudWriteRateBytesPerSec     : 0
    IsInitialPasswordSet          : True
    FriendlySoftwareVersionNumber : 1902
    UploadPolicy                  : All
    DataDiskResiliencySettingName : Simple
    ApplianceTypeFriendlyName     : Data Box Gateway
    IsRegistered                  : False
    ```

    Here is a table summarizing some of the important device information:

    | Parameter | Description |
    |-----------|-------------|
    | FriendlyName                   | The friendly name of the device as configured through the local web UI during device deployment. The default friendly name is the device serial number.  |
    | SerialNumber                   | The device serial number is a unique number assigned at the factory.                                                                             |
    | Model                          | The model for your Azure Stack Edge or Data Box Gateway device. The model is physical for Azure Stack Edge and virtual for Data Box Gateway.                   |
    | FriendlySoftwareVersion        | The friendly string that corresponds to the device software version. For a system running preview, the friendly software version would be Data Box Edge 1902. |
    | HcsVersion                     | The HCS software version running on your device. For instance, the HCS software version corresponding to Data Box Edge 1902 is 1.4.771.324.            |
    | LocalCapacityInMb              | The total local capacity of the device in Megabits.                                                                                                        |
    | IsRegistered                   | This value indicates if your device is activated with the service.                                                                                         |



