---
title: Use a config file to deploy an Azure Stack Edge device | Microsoft Docs
description: Describes how to use PowerShell to provision and activate Azure Stack Edge devices.
services: databox
author: alkohli
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 10/17/2022
ms.author: alkohli
---
# Use a config file to deploy an Azure Stack Edge device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to automate initial device configuration and activation of Azure Stack Edge devices using PowerShell. This method enables automated, standardized device configuration of one or more devices before they're activated.

Use this method as an alternative to the local web user interface setup sequence. You can run as many rounds of device configuration as necessary, until the device is activated. After device activation, use the Azure portal user interface or the device local web user interface to modify device configuration.

## Usage considerations

- You can apply configuration changes to a device until it's activated. To change device configuration after activation or to manage devices using the local web user interface, see [Connect to Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-deploy-connect.md?pivots=single-node).
- You can't change device authentication using this method. To change device authentication settings, see [Change device password](azure-stack-edge-gpu-manage-access-power-connectivity-mode.md#change-device-password).
- You can only provision single-node devices using this method. Two-node cluster configuration isn't supported.
- You can apply individual configuration changes to a device using PowerShell cmdlets, or you can apply bulk configuration changes using a JSON file.

## About device setup and configuration

Device setup and configuration include declarations that define the configuration for that device using a root-level "Device" identifier. Declarations supported for Azure Stack Edge devices include:
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
|Set-login|First-time sign in, set or change sign in credentials to access the device.|
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
1. Your client is running PowerShell version 5.1 or later.
1. Are connected to the local web UI of an Azure Stack Edge device. For more information, see [Connect to Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-deploy-connect.md?pivots=single-node).
1. Download the [PowerShell module](https://aka.ms/aseztp-ps).

## Import the module and sign into the device

Use the following steps to import the PowerShell module and sign into the device.

1. Run PowerShell as an administrator.
1. Import the PowerShell module.

   ```azurepowershell
   Import-Module Drive:\<Local path>\ZtpRestHelpers.ps1
   ```

1. Sign into the device using the ```Set-Login``` cmdlet. First-time sign into the device requires password reset.

   ```azurepowershell
   Set-Login "https://<IP address>" "<Password1>" “<NewPassword>”
   ```

## Change password and fetch the device configuration

Use the following steps to sign into a device, change the password, and fetch the device configuration:

1. Sign into the device and change the device password.

   ```azurepowershell
   Set-Login “https://<IP address>” “<CurrentPassword>” “<NewPassword>”
   ```

1. Fetch the device configuration.

   ```azurepowershell
   Get-DeviceConfiguration | to-json
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
   $time = New-Object PSObject -Property @{ timezone = "Hawaiian Standard Time" }
   ```

1. Set the update object properties.

   ```azurepowershell
   $update = New-Object PSObject -Property @{ ServerType = "MicrosoftUpdate" }
   ```

1. Create a package with the new time and update settings.

   ```azurepowershell
   $pkg = New-Package -time $time -update $update
   ```

1. Run the package.

   ```azurepowershell
   $newCfg = Set-DeviceConfiguration -desiredDeviceConfig $pkg
   ```

1. Verify that the operation is complete.

   ```azurepowershell
   Get-DeviceConfigurationStatus | to-json
   ```
   Here is an example output:

   ```output
   PS C:\> Get-DeviceConfigurationStatus | to-json
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
   Get-DeviceConfiguration | to-json
   ```

1. Save the device configuration to the local system as a JSON file.

   ```azurepowershell
   Get-DeviceConfiguration | to-json | Out-File "C:\<Local path>\testconfig2.json"
   ```

1. After saving device configuration settings to a JSON file, you can use steps in the following section to apply those device configuration settings to one or more devices that aren't yet activated. 

## Apply a configuration to a device using a JSON file, without device activation

Once a config.json file has been created, as in the previous example, with the desired configuration, use the JSON file to change configuration settings on one or more devices that aren't activated.

> [!NOTE]
> Use a config.json file that meets the needs of your organization. A [sample config.json file is available here](https://github.com/Azure-Samples/azure-stack-edge-deploy-vms/tree/master/ZTP/).

This sequence of PowerShell cmdlets signs into the device, applies the device configuration settings from a JSON file, verifies completion of the operation, and then fetches the new device configuration.

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
   Get-DeviceConfiguration | to-json
   ```

   Here's an example of output showing node.id for the device:

   ```output

      PS C:\> Get-DeviceConfiguration | to-json
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
   $p = Get-Content -Path "Drive:\Temp\<ConfigFileName.json>" | ConvertFrom-json
   ```

1. Run the package.

   ```azurepowershell
   $newCfg = Set-DeviceConfiguration -desiredDeviceConfig $p
   ```

1. Monitor status as the operation runs. It may take 10 minutes or more for the changes to complete.

   ```azurepowershell
   Get-DeviceConfigurationStatus | to-json
   ```

1. After the operation is complete, fetch the new device configuration.

   ```azurepowershell
   Get-DeviceConfiguration | to-json
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
   $ActivationKey = "<activation key>"
   ```
1. Create an activation object and set the activationKey property.

   ```azurepowershell
   $activation = New-Object PsObject -Property @{activationkey=$ActivationKey; ServiceEncryptionKey=""}
   ```

1. Create a package with the activation object and activation key.

   ```azurepowershell
   $p = New-Package -activation $activation
   ```

1. Run the package.

   ```azurepowershell
   $newCfg = Set-DeviceConfiguration -desiredDeviceConfig $p
   ```

1. Monitor status as the operation runs. It may take 10 minutes or more for the changes to complete.

   ```azurepowershell
   Get-DeviceConfigurationStatus | to-json
   ```

1. After the operation is complete, fetch the new device configuration.

   ```azurepowershell
   Get-DeviceConfiguration | to-json
   ```

   Here's an example of output showing device activation status:

   ```output
   PS C:\> Get-DeviceConfiguration | to-json
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

Use the following steps to sign into the device, fetch the status of the webProxy property, set the webProxy property to “isEnabled = true,” and then fetch the status of the changed webProxy property.

1. Sign into the device.

   ```azurepowershell
   Set-Login "https://<IP address>" "Password"
   ```

1. Load the device configuration cmdlet.
 
   ```azurepowershell
   $p = Get-DeviceConfiguration
   ```

1. Fetch the status of the webProxy property.

   ```azurepowershell
   $p.device.webproxy
   ```

   Here is a sample output:

   ```output
   PS C:\> $p.device.webproxy

   isEnabled      : False 
   connectionURI  : null,
   authentication : None
   username       :
   password       :
   ```

1. Set the webProxy property to “isEnabled = true.”

   ```azurepowershell
   $p.device.webproxy.isEnabled = $true
   ```

1. Fetch the status of the updated webProxy property.

   ```azurepowershell
   $p.device.webproxy
   ```
   
   Here is a sample output showing the updated property:

   ```output
   PS C:\> $p.device.webproxy

   isEnabled      : True 
   connectionURI  : null,
   authentication : None
   username       :
   password       :
   ```

1. Run the package with the updated webProxy property.

   ```azurepowershell
   $newCfg = Set-DeviceConfiguration -desiredDeviceConfig $p
   ```

1. Monitor status as the operation runs. It may take 10 minutes or more for the changes to complete.

   ```azurepowershell
   Get-DeviceConfigurationStatus | to-json
   ```

1. After the operation is complete, fetch the new device configuration.

   ```azurepowershell
   Get-DeviceConfiguration | to-json
   ```

   Here's an example of output showing the updated webProxy property:

   ```output
     "webProxy":  {
                      "isEnabled":  true,
                      "connectionURI":  null,
                      "authentication":  "None",
                      "username":  null,
                      "password":  null
                  }
   ```

## Run device diagnostics

Use the following steps to sign into the device and run device diagnostics to verify status after you apply a device setup configuration package.

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
   Get-DeviceDiagnostic | to-json
   ```
   Here's an example of output showing device diagnostics:

   ```output
          PS C:\> Get-DeviceDiagnostic | to-json
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
