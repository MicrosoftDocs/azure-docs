---
title: Use a config file to deploy an Azure Stack Edge device | Microsoft Docs
description: Describes how to use PowerShell to provision and activate Azure Stack Edge devices.
services: databox
author: alkohli
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 10/26/2022
ms.author: alkohli
---
# Use a config file to deploy an Azure Stack Edge device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to automate initial device configuration and activation of Azure Stack Edge devices using PowerShell. You can automate and standardized device configuration of one or more devices before they're activated.

Use this method as an alternative to the local web user interface setup sequence. You can run as many rounds of device configuration as necessary, until the device is activated. After device activation, use the Azure portal user interface or the device local web user interface to modify device configuration.

## Usage considerations

- You can apply configuration changes to a device until it's activated. To change device configuration after activation or to manage devices using the local web user interface, see [Connect to Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-deploy-connect.md?pivots=single-node).
- You can't change device authentication using this method. To change device authentication settings, see [Change device password](azure-stack-edge-gpu-manage-access-power-connectivity-mode.md#change-device-password).
- You can only provision single-node devices using this method. Two-node cluster configuration isn't supported.
- You can apply individual configuration changes to a device using PowerShell cmdlets, or you can apply bulk configuration changes using a JSON file.

## About device setup and configuration

Device setup and configuration declarations define the configuration for that device using a root-level "Device" identifier. Declarations supported for Azure Stack Edge devices include:
- Device endpoint
- Password
- Certificates
- Encryption at rest
- Web proxy
- Network
- Time
- Update
- Activation

A device configuration operation doesn't have to include every declaration; you can include only the declarations that create a desired configuration for your device.

The following PowerShell cmdlets are supported to configure Azure Stack Edge devices:

|Cmdlet|Description|
|---------|---------|
|Set-Login|First-time sign in, set or change sign in credentials to access the device.|
|Get-DeviceConfiguration|Fetch the current device configuration.|
|Set-DeviceConfiguration|Change the device configuration.|
|New-Package|Prepare a device setup configuration package to apply to one or more devices.|
|Get-DeviceConfigurationStatus|Fetch the status of in-flight configuration changes being applied to the device to determine whether the operation succeeded, failed, or is still in progress.|
|Get-DeviceDiagnostic|Fetch diagnostic status of the device.|
|Start-DeviceDiagnostic|Start a new diagnostic run to verify status after a device setup configuration package is applied.|
|To-json|A utility command that formats the cmdlet response in a JSON file.|

## Prerequisites

Before you begin, make sure that you:

1. Have a client running Windows 10 or later, or Windows Server 2016 or later.
1. Are running PowerShell version 5.1 or later.
1. Are connected to the local web UI of an Azure Stack Edge device. For more information, see [Connect to Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-deploy-connect.md?pivots=single-node).
1. Have downloaded the [PowerShell module](https://aka.ms/aseztp-ps).

## Import the module and sign into the device

Use the following steps to import the PowerShell module and sign into the device.

1. Run PowerShell as an administrator.
1. Import the PowerShell module.

   ```azurepowershell
   Import-Module "<Local path to PowerShell module>"\ZtpRestHelpers.ps1
   ```

1. Sign into the device using the ```Set-Login``` cmdlet. First-time sign into the device requires password reset.

   ```azurepowershell
   Set-Login "https://<IP address>" "<Password1>" "<NewPassword>"
   ```

## Change password and fetch the device configuration

Use the following steps to sign into a device, change the password, and fetch the device configuration:

1. Sign into the device and change the device password.

   ```azurepowershell
   Set-Login "https://<IP address>" "<CurrentPassword>" "<NewPassword>"
   ```

1. Fetch the device configuration.

   ```azurepowershell
   Get-DeviceConfiguration | To-json
   ```

## Apply initial configuration to a device

Use the following steps to create a device configuration package in PowerShell and then apply the configuration to one or more devices.

Run the following cmdlets in PowerShell:

1. Sign into the device.

    ```azurepowershell
    Set-Login "https://<IP address>" "<Password>"
    ```

1. Set the time object properties.

   ```azurepowershell
   $time = New-Object PSObject -Property @{ TimeZone = "Hawaiian Standard Time" }
   ```

1. Set the update object properties.

   ```azurepowershell
   $update = New-Object PSObject -Property @{ ServerType = "MicrosoftUpdate" }
   ```

1. Create a package with the new time and update settings.

   ```azurepowershell
   $pkg = New-Package -Time $time -Update $update
   ```

1. Run the package.

   ```azurepowershell
   $newCfg = Set-DeviceConfiguration -DesiredDeviceConfig $pkg
   ```

1. Verify that the operation is complete.

   ```azurepowershell
   Get-DeviceConfigurationStatus | To-json
   ```
   Here's an example output:

   ```output
   PS C:\> Get-DeviceConfigurationStatus | To-json
      {
       "deviceConfiguration":  {
                                "status":  "Complete",
                                "results":  [
                                                {
                                                    "declarationName":  "Time",
                                                    "resultCode":  "Success",
                                                    "errorCode":  "None",
                                                    "message":  null
                                                },
                                                {
                                                    "declarationName":  "Update",
                                                    "resultCode":  "Success",
                                                    "errorCode":  "None",
                                                    "message":  null
                                                }
                                            ]
                            }
       }
    PS C:\>
   
   ```

1. After the operation is complete, fetch the new device configuration.

   ```azurepowershell
   Get-DeviceConfiguration | To-json
   ```

1. Save the device configuration as a JSON file.

   ```azurepowershell
   Get-DeviceConfiguration | To-json | Out-File "<Local path>\TestConfig2.json"
   ```

1. After saving device configuration settings to a JSON file, you can use steps in the following section to apply those device configuration settings to one or more devices that aren't yet activated. 

## Apply a configuration to a device using a JSON file, without device activation

Once a config.json file has been created, as in the previous example, with the desired configuration, use the JSON file to change configuration settings on one or more devices that aren't activated.

> [!NOTE]
> Use a config.json file that meets the needs of your organization. A [sample config.json file is available here](https://github.com/Azure-Samples/azure-stack-edge-deploy-vms/tree/master/ZTP/).

This sequence of PowerShell cmdlets signs into the device, applies device configuration settings from a JSON file, verifies completion of the operation, and then fetches the new device configuration.

Run the following cmdlets in PowerShell:

1. Sign into the device.

   ```azurepowershell
   Set-Login "https://<IP address>" "<Password>"
   ```

1. Before you run the device configuration operation, ensure that the JSON file uses the node.id of the device to be changed. 

   > [!NOTE]
   > Each device has a unique node.id. To change device configuration settings, the node.id in the JSON file must match the node.id of the device to be changed.

   Fetch the node.id from the device with the following command in PowerShell:

   ```azurepowershell
   Get-DeviceConfiguration | To-json
   ```

   Here's an example of output showing node.id for the device:

   ```output

      PS C:\> Get-DeviceConfiguration | To-json
      {
        "device":  {
                         "deviceInfo":  {
                                            "model":  "Azure Stack Edge",
                                            "softwareVersion":  "2.2.2075.5523",
                                            "serialNumber":  "1HXQG13",
                                            "isActivated":  false,
                                            "nodes":  [
                                                    {
                                                        "id":  "d0d8cb16-60d4-4970-bb65-b9d254d1a289",
                                                        "name":  "1HXQG13"
                                                    }
                                                ]
                                  },
   ```

1. Create a package that uses a local JSON file for device configuration settings.

   ```azurepowershell
   $p = Get-Content -Path "<Local path>\<ConfigFileName.json>" | ConvertFrom-json
   ```

1. Run the package.

   ```azurepowershell
   $newCfg = Set-DeviceConfiguration -DesiredDeviceConfig $p
   ```

1. Monitor status of the operation. It may take 10 minutes or more for the changes to complete.

   ```azurepowershell
   Get-DeviceConfigurationStatus | To-json
   ```

1. After the operation is complete, fetch the new device configuration.

   ```azurepowershell
   Get-DeviceConfiguration | To-json
   ```

## Activate a device

Use the following steps to activate an Azure Stack Edge device. Note that activation can't be undone, and a device activation key can't be reused or applied to a different device.

1. Retrieve the activation key for your device. For detailed steps, see [Create a management resource, and Get the activation key](azure-stack-edge-gpu-deploy-prep.md#create-a-management-resource-for-each-device) sections.

1. Sign into the device.

   ```azurepowershell
   Set-Login "https://<IP address>" "Password"
   ```

1. Set the ActivationKey property.

   ```azurepowershell
   $ActivationKey = "<Activation key>"
   ```
1. Create an activation object and set the activationKey property.

   ```azurepowershell
   $activation = New-Object PsObject -Property @{ActivationKey=$ActivationKey; ServiceEncryptionKey=""}
   ```

1. Create a package with the activation object and activation key.

   ```azurepowershell
   $p = New-Package -Activation $activation
   ```

1. Run the package.

   ```azurepowershell
   $newCfg = Set-DeviceConfiguration -DesiredDeviceConfig $p
   ```

1. Monitor status of the operation. It may take 10 minutes or more for the changes to complete.

   ```azurepowershell
   Get-DeviceConfigurationStatus | To-json
   ```

1. After the operation is complete, fetch the new device configuration.

   ```azurepowershell
   Get-DeviceConfiguration | To-json
   ```

   Here's an example of output showing device activation status:

   ```output
   PS C:\> Get-DeviceConfiguration | To-json
   {
    "device":  {
                   "deviceInfo":  {
                                      "model":  "Azure Stack Edge",
                                      "softwareVersion":  "2.2.2075.5523",
                                      "serialNumber":  "1HXQJ23",
                                      "isActivated":  true,
                                      "nodes":  [
                                                    {
                                                        "id":  "d0d8ca16-60d4-4970-bb65-b9d254d1a289",
                                                        "name":  "1HXQG13"
                                                    }
                                                ]
                                  },

   ```

## Quickly fetch or change device configuration settings

Use the following steps to sign into the device, fetch the status of the webProxy properties, set the webProxy property to “isEnabled = true” and set the webProxy URI, and then fetch the status of the changed webProxy properties. After running the package, verify the new device configuration.

1. Sign into the device.

   ```azurepowershell
   Set-Login "https://<IP address>" "Password"
   ```

1. Load the device configuration cmdlet.
 
   ```azurepowershell
   $p = Get-DeviceConfiguration
   ```

1. Fetch the status of the webProxy properties.

   ```azurepowershell
   $p.device.webproxy
   ```

   Here's a sample output:

   ```output
   PS C:\> $p.device.webproxy

   isEnabled      : False 
   connectionURI  : null
   authentication : None
   username       :
   password       :
   ```

1. Set the webProxy property to “isEnabled = true” and set the webProxy URI.

   ```azurepowershell
   $p.device.webproxy.isEnabled = $true
   $p.device.webproxy.connectionURI = "<specify a URI depending on the geographic location of the device>"
   ```

1. Fetch the status of the updated webProxy properties.

   ```azurepowershell
   $p.device.webproxy
   ```
   
   Here's a sample output showing the updated properties:

   ```output
   PS C:\> $p.device.webproxy

   isEnabled      : True 
   connectionURI  : http://10.57.48.82:8080
   authentication : None
   username       :
   password       :
   ```

1. Run the package with updated webProxy properties.

   ```azurepowershell
   $newCfg = Set-DeviceConfiguration -DesiredDeviceConfig $p
   ```

1. Monitor status of the operation. It may take 10 minutes or more for the changes to complete.

   ```azurepowershell
   Get-DeviceConfigurationStatus | To-json
   ```

1. After the operation is complete, fetch the new device configuration.

   ```azurepowershell
   Get-DeviceConfiguration | To-json
   ```

   Here's an example of output showing the updated webProxy properties:

   ```output
     "webProxy":  {
                      "isEnabled":  true,
                      "connectionURI":  "http://10.57.48.82:8080",
                      "authentication":  "None",
                      "username":  null,
                      "password":  null
                  }
   ```

## Run device diagnostics

Use the following steps to sign into the device and run device diagnostics to verify status after you apply a device configuration package.

1. Sign into the device.

   ```azurepowershell
   Set-Login "https://<IP address>" "Password"
   ```

1. Run device diagnostics.

   ```azurepowershell
   Start-DeviceDiagnostic
   ```
1. Fetch the status of the device diagnostics operation.

   ```azurepowershell
   Get-DeviceDiagnostic | To-json
   ```
   Here's an example of output showing device diagnostics:

   ```output
          PS C:\> Get-DeviceDiagnostic | To-json
      {
         "lastRefreshTime":  "2022-09-27T20:12:10.643768Z",
         "status":  "Complete",
         "diagnostics":  [
                        {
                            "test":  "System software",
                            "category":  "Software",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Disks",
                            "category":  "Hardware, Disk",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Power Supply Units",
                            "category":  "Hardware",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Network interfaces",
                            "category":  "Hardware",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "CPUs",
                            "category":  "Hardware",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Network settings ",
                            "category":  "Logical, Network",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Internet connectivity",
                            "category":  "Logical, Network",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Web proxy",
                            "category":  "Logical, Network",
                            "status":  "NotApplicable",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Time sync ",
                            "category":  "Logical, Time",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Azure portal connectivity",
                            "category":  "Logical, Network, AzureConnectivity",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Azure storage account credentials",
                            "category":  "Logical, AzureConnectivity",
                            "status":  "NotApplicable",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Software update readiness",
                            "category":  "Logical, Update",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "User passwords",
                            "category":  "Logical, PasswordExpiry",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Azure consistent services health check",
                            "category":  "ACS",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Certificates",
                            "category":  "Certificates",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Azure container read/write",
                            "category":  "Logical, Network, AzureConnectivity",
                            "status":  "NotApplicable",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Azure Edge compute runtime",
                            "category":  "Logical, AzureEdgeCompute",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        },
                        {
                            "test":  "Compute acceleration",
                            "category":  "Hardware, Logical",
                            "status":  "Succeeded",
                            "recommendedActions":  ""
                        }
                    ]
       }

   ```

## Troubleshooting

- [Run diagnostics or collect logs to troubleshoot Azure Stack Edge device issues](azure-stack-edge-gpu-troubleshoot.md).

## Next steps

- [Troubleshoot device activation issues](azure-stack-edge-gpu-troubleshoot-activation.md).
- [Troubleshoot Azure Resource Manager issues](azure-stack-edge-gpu-troubleshoot-azure-resource-manager.md).
- [Troubleshoot Blob storage issues](azure-stack-edge-gpu-troubleshoot-blob-storage.md).
