---
title: Use a config file to deploy an Azure Stack Edge device | Microsoft Docs
description: Describes how to use PowerShell to provision and activate an Azure Stack Edge device.
services: databox
author: alkohli
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 09/08/2023
ms.author: alkohli
---
# Use a config file to deploy an Azure Stack Edge device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to use PowerShell to automate initial device configuration and activation of Azure Stack Edge devices. Use the steps in this article as alternatives to the local web user interface setup sequence.

You can run as many rounds of device configuration as necessary. You can also use the Azure portal or the device local user interface to modify device configuration.

## Usage considerations

- You can apply individual configuration changes to a device using PowerShell cmdlets, or you can apply bulk configuration changes using a JSON file.
- You can apply changes with a JSON file at any point in the appliance lifecycle. 
- To manage devices using the local web user interface, see [Connect to Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-deploy-connect.md?pivots=single-node).
- You can't change device authentication using this method. To change device authentication settings, see [Change device password](azure-stack-edge-gpu-manage-access-power-connectivity-mode.md#change-device-password).
- Cluster formation is not supported using PowerShell cmdlets. For more information about Azure Stack Edge clusters, see [Install a two-node cluster](azure-stack-edge-gpu-deploy-install.md?pivots=two-node).  

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
- Virtual IP configuration
- Proactive log consent
- Device activation

A device configuration operation doesn't have to include every declaration; you can include only the declarations that create a desired configuration for your device.

The following PowerShell cmdlets are supported to configure Azure Stack Edge devices:

|Cmdlet|Description|
|---------|---------|
|*Set-Login* |First-time sign in, set or change sign in credentials to access the device. |
|*Get-DeviceConfiguration* |Fetch the current device configuration. |
|*Set-DeviceConfiguration* |Change the device configuration. |
|*New-Package* |Prepare a device setup configuration package to apply to one or more devices. |
|*Get-DeviceConfigurationStatus* |Fetch the status of in-progress configuration changes being applied to the device to determine whether the operation succeeded, failed, or is still in progress. |
|*Get-DeviceDiagnostic* |Fetch diagnostic status of the device. |
|*Start-DeviceDiagnostic* |Start a new diagnostic run to verify status after a device setup configuration package has been applied. |
|*To-json* |A utility command that formats the cmdlet response in a JSON file. |
|*Get-DeviceLogConsent* |Fetch the proactive log consent setting for the device. |
|*Set-DeviceLogConsent* |Set the proactive log consent setting for the device. |
|*Get-DeviceVip* |Fetch virtual IP configuration for your Azure Stack Edge two-node cluster. |
|*Set-DeviceVip* |Set the virtual IP configuration for your Azure Stack Edge two-node cluster. |

## Prerequisites

Before you begin, make sure that you:

1. Have a client running Windows 10 or later, or Windows Server 2016 or later.
1. Are running PowerShell version 5.1 or later.
1. Are connected to the local web UI of an Azure Stack Edge device. For more information, see [Connect to Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-deploy-connect.md?pivots=single-node).
1. Have downloaded the [PowerShell module](https://aka.ms/aseztp-ps).

## Import the module and sign in to the device

Use the following steps to import the PowerShell module and sign in to the device.

1. Run PowerShell as an administrator.
1. Import the PowerShell module.

   ```azurepowershell
   Import-Module "<Local path to PowerShell module>"\PowerShellBasedConfiguration.psm1
   ```

1. Sign in to the device using the `Set-Login` cmdlet. First-time sign-in requires a password reset using `NewPassword`.

   ```azurepowershell
   Set-Login "https://<IP address>" "<Password1>" "<NewPassword>"
   ```

## Fetch the device configuration

Use the following cmdlet to fetch the device configuration:

   ```azurepowershell
   Get-DeviceConfiguration | To-json
   ```

## Apply initial configuration to a device

Use the following steps to create a device configuration package in PowerShell and then apply the configuration to one or more devices.

Run the following cmdlets in PowerShell:

1. Set the `time` object property.

   ```azurepowershell
   $time = New-Object PSObject -Property @{ TimeZone = "Hawaiian Standard Time" }
   ```

1. Set the `update` object property.

   ```azurepowershell
   $update = New-Object PSObject -Property @{ ServerType = "MicrosoftUpdate" }
   ```

1. Create a package with the new `time` and `update` settings.

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
   Here's sample output:

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

1. After saving device configuration settings to a JSON file, you can use steps in the following section to use the JSON file to apply those device configuration settings to one or more devices.

## Update a device using a JSON file, without device activation

Once a config.json file has been created, as shown in the previous example, with the desired configuration, use the JSON file to change configuration settings on one or more devices.

> [!NOTE]
> Use a config.json file that meets the needs of your organization. [Sample JSON files are available here](https://aka.ms/aseztp-ps).

### Configure a single-node device

This sequence of PowerShell cmdlets signs in to the device, applies device configuration settings from a JSON file, verifies completion of the operation, and then fetches the new device configuration.

Run the following cmdlets in PowerShell:

1. Before you run the device configuration operation, ensure that the JSON file uses the `nodeName` of the device to be changed. 

   > [!NOTE]
   > Each device has a unique `nodeName`. To change device configuration settings, the `nodeName` in the JSON file must match the `nodeName` of the device to be changed.

   Fetch the `nodeName` from the device with the following command in PowerShell:

   ```azurepowershell
   Get-DeviceConfiguration | To-json
   ```

   Here's sample output showing `nodeName` for the device:

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
        }
      }
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

### Configure a two-node device

This sequence of PowerShell cmdlets applies device configuration settings from a JSON file, verifies completion of the operation, and then fetches the new device configuration.

> [!NOTE]
> Two-node configurations are only supported on Azure Stack Edge Pro GPU and Azure Stack Edge Pro 2 devices. 

Run the following cmdlets in PowerShell:

1. Before you run the device configuration operation, ensure that the JSON file uses the `nodeName` of the device to be changed. 

   > [!NOTE]
   > Each device has a unique `nodeName`. To change device configuration settings, the `nodeName` in the JSON file must match the `nodeName` of the device to be changed.

   Fetch the `nodeName` from the device with the following command in PowerShell:

   ```azurepowershell
   Get-DeviceConfiguration | To-json
   ```

   Here's sample output showing `nodeName` for the device:

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
        }
      }
   ```

1. Create a package that uses a local JSON file for device configuration settings.

   ```azurepowershell
   $p = Get-Content -Path "<Local path>\<ConfigFileName-two-node-device.json>" | ConvertFrom-json
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

   Here's sample output:

   ```output
      PS C:\> Get-DeviceConfiguration | To-json
      {
      "device":  {
                   "deviceInfo":  {
                                            "model":  "Azure Stack Edge",
                                            "softwareVersion":  "3.2.2380.1548",
                                            "serialNumber":  "1HXG613",
                                            "isActivated":  true,
                                            "nodes":  [
                                                    {
                                                        "id":  "9b1817b9-67f5-4631-8466-447b89b829f3",
                                                        "name":  "HW6C1T2"
                                                    },
                                                    {
                                                        "id":  "b4eeebad-9395-4aa8-b6b4-2f2d66eccf58",
                                                        "name":  "1HXG613"
                                                    }
                                                ]
                                  },
                   "deviceEndpoint":  {
                                          "name":  "DBE-1HXG613",
                                          "dnsDomain":  "microsoftdatabox.com"
                                      },
                   "encryptionAtRestKeys":  null,
                   "network":  {
                                   "dhcpPolicy":  "AttemptRenew",
                                   "interfaces":  [
                                                      {
                                                          "name":  "Port1",
                                                          "nodeName":  "1HXG613",
                                                          "nodeId":  "b4eeebad-9395-4aa8-b6b4-2f2d66eccf58",
                                                          "isDhcpEnabled":  false,
                                                          "iPv4":  {
                                                                       "address":  "192.0.2.0/24",
                                                                       "subnetMask":  "255.255.255.0",
                                                                       "gateway":  null
                                                                   },
                                                          "iPv6":  null,
                                                          "dnsServerAddresses":  null,
                                                          "dnsSuffix":  null,
                                                          "routes":  null,
                                                          "ipConfigType":  "IP"
                                                      },
                                                      {
                                                          "name":  "Port1",
                                                          "nodeName":  "HW6C1T2",
                                                          "nodeId":  "9b1817b9-67f5-4631-8466-447b89b829f3",
                                                          "isDhcpEnabled":  false,
                                                          "iPv4":  {
                                                                       "address":  "192.0.2.0/24",
                                                                       "subnetMask":  "255.255.255.0",
                                                                       "gateway":  null
                                                                   },
                                                          "iPv6":  null,
                                                          "dnsServerAddresses":  null,
                                                          "dnsSuffix":  null,
                                                          "routes":  null,
                                                          "ipConfigType":  "IP"
                                                      },
                                                      {
                                                          "name":  "Port2",
                                                          "nodeName":  "1HXG613",
                                                          "nodeId":  "b4eeebad-9395-4aa8-b6b4-2f2d66eccf58",
                                                          "isDhcpEnabled":  true,
                                                          "iPv4":  {
                                                                       "address":  "192.0.2.0/24",
                                                                       "subnetMask":  "255.255.248.0",
                                                                       "gateway":  "10.126.72.1"
                                                                   },
                                                          "iPv6":  null,
                                                          "dnsServerAddresses":  [
                                                                                     "10.50.50.50",
                                                                                     "10.50.10.50"
                                                                                 ],
                                                          "dnsSuffix":  "corp.microsoft.com",
                                                          "routes":  null,
                                                          "ipConfigType":  "IP"
                                                      },
                                                      {
                                                          "name":  "Port2",
                                                          "nodeName":  "HW6C1T2",
                                                          "nodeId":  "9b1817b9-67f5-4631-8466-447b89b829f3",
                                                          "isDhcpEnabled":  true,
                                                          "iPv4":  {
                                                                       "address":  "192.0.2.0/24",
                                                                       "subnetMask":  "255.255.248.0",
                                                                       "gateway":  "10.126.72.1"
                                                                   },
                                                          "iPv6":  null,
                                                          "dnsServerAddresses":  [
                                                                                     "10.50.50.50",
                                                                                     "10.50.10.50"
                                                                                 ],
                                                          "dnsSuffix":  "corp.microsoft.com",
                                                          "routes":  null,
                                                          "ipConfigType":  "IP"
                                                      },
                                                      {
                                                          "name":  "Port3",
                                                          "nodeName":  "1HXG613",
                                                          "nodeId":  "b4eeebad-9395-4aa8-b6b4-2f2d66eccf58",
                                                          "isDhcpEnabled":  true,
                                                          "iPv4":  {
                                                                       "address":  "192.0.2.0/24",
                                                                       "subnetMask":  "255.255.0.0",
                                                                       "gateway":  null
                                                                   },
                                                          "iPv6":  null,
                                                          "dnsServerAddresses":  [
                                                                                     "192.168.0.1"
                                                                                 ],
                                                          "dnsSuffix":  "wdshcsso.com",
                                                          "routes":  null,
                                                          "ipConfigType":  "IP"
                                                      },
                                                      {
                                                          "name":  "Port3",
                                                          "nodeName":  "HW6C1T2",
                                                          "nodeId":  "9b1817b9-67f5-4631-8466-447b89b829f3",
                                                          "isDhcpEnabled":  true,
                                                          "iPv4":  {
                                                                       "address":  "192.0.2.0/24",
                                                                       "subnetMask":  "255.255.0.0",
                                                                       "gateway":  null
                                                                   },
                                                          "iPv6":  null,
                                                          "dnsServerAddresses":  [
                                                                                     "192.168.0.1"
                                                                                 ],
                                                          "dnsSuffix":  "wdshcsso.com",
                                                          "routes":  null,
                                                          "ipConfigType":  "IP"
                                                      },
                                                      {
                                                          "name":  "Port4",
                                                          "nodeName":  "1HXG613",
                                                          "nodeId":  "b4eeebad-9395-4aa8-b6b4-2f2d66eccf58",
                                                          "isDhcpEnabled":  true,
                                                          "iPv4":  {
                                                                       "address":  "192.0.2.0/24",
                                                                       "subnetMask":  "255.255.0.0",
                                                                       "gateway":  null
                                                                   },
                                                          "iPv6":  null,
                                                          "dnsServerAddresses":  [
                                                                                     "192.168.0.1"
                                                                                 ],
                                                          "dnsSuffix":  "wdshcsso.com",
                                                          "routes":  null,
                                                          "ipConfigType":  "IP"
                                                      },
                                                      {
                                                          "name":  "Port4",
                                                          "nodeName":  "HW6C1T2",
                                                          "nodeId":  "9b1817b9-67f5-4631-8466-447b89b829f3",
                                                          "isDhcpEnabled":  true,
                                                          "iPv4":  {
                                                                       "address":  "192.168.6.99",
                                                                       "subnetMask":  "255.255.0.0",
                                                                       "gateway":  null
                                                                   },
                                                          "iPv6":  null,
                                                          "dnsServerAddresses":  [
                                                                                     "192.168.0.1"
                                                                                 ],
                                                          "dnsSuffix":  "wdshcsso.com",
                                                          "routes":  null,
                                                          "ipConfigType":  "IP"
                                                      },
                                                      {
                                                          "name":  "Port5",
                                                          "nodeName":  "1HXG613",
                                                          "nodeId":  "b4eeebad-9395-4aa8-b6b4-2f2d66eccf58",
                                                          "isDhcpEnabled":  true,
                                                          "iPv4":  {
                                                                       "address":  "192.0.2.0/24",
                                                                       "subnetMask":  "255.255.0.0",
                                                                       "gateway":  null
                                                                   },
                                                          "iPv6":  null,
                                                          "dnsServerAddresses":  [
                                                                                     "192.168.0.1"
                                                                                 ],
                                                          "dnsSuffix":  "wdshcsso.com",
                                                          "routes":  null,
                                                          "ipConfigType":  "IP"
                                                      },
                                                      {
                                                          "name":  "Port5",
                                                          "nodeName":  "HW6C1T2",
                                                          "nodeId":  "9b1817b9-67f5-4631-8466-447b89b829f3",
                                                          "isDhcpEnabled":  true,
                                                          "iPv4":  {
                                                                       "address":  "192.0.2.0/24",
                                                                       "subnetMask":  "255.255.0.0",
                                                                       "gateway":  null
                                                                   },
                                                          "iPv6":  null,
                                                          "dnsServerAddresses":  [
                                                                                     "192.168.0.1"
                                                                                 ],
                                                          "dnsSuffix":  "wdshcsso.com",
                                                          "routes":  null,
                                                          "ipConfigType":  "IP"
                                                      },
                                                      {
                                                          "name":  "Port6",
                                                          "nodeName":  "1HXG613",
                                                          "nodeId":  "b4eeebad-9395-4aa8-b6b4-2f2d66eccf58",
                                                          "isDhcpEnabled":  true,
                                                          "iPv4":  {
                                                                       "address":  "192.0.2.0/24",
                                                                       "subnetMask":  "255.255.0.0",
                                                                       "gateway":  null
                                                                   },
                                                          "iPv6":  null,
                                                          "dnsServerAddresses":  [
                                                                                     "192.168.0.1"
                                                                                 ],
                                                          "dnsSuffix":  "wdshcsso.com",
                                                          "routes":  null,
                                                          "ipConfigType":  "IP"
                                                      },
                                                      {
                                                          "name":  "Port6",
                                                          "nodeName":  "HW6C1T2",
                                                          "nodeId":  "9b1817b9-67f5-4631-8466-447b89b829f3",
                                                          "isDhcpEnabled":  true,
                                                          "iPv4":  {
                                                                       "address":  "192.0.2.0/24",
                                                                       "subnetMask":  "255.255.0.0",
                                                                       "gateway":  null
                                                                   },
                                                          "iPv6":  null,
                                                          "dnsServerAddresses":  [
                                                                                     "192.168.0.1"
                                                                                 ],
                                                          "dnsSuffix":  "wdshcsso.com",
                                                          "routes":  null,
                                                          "ipConfigType":  "IP"
                                                      }
                                                  ],
                                   "vSwitches":  [
                                                     {
                                                         "name":  "vSwitch1",
                                                         "interfaceName":  "Port2",
                                                         "enabledForCompute":  true,
                                                         "enabledForStorage":  false,
                                                         "enabledForMgmt":  true,
                                                         "supportsAcceleratedNetworking":  false,
                                                         "enableEmbeddedTeaming":  true,
                                                         "ipAddressPools":  [
                                                                                {
                                                                                    "name":  "KubernetesNodeIPs",
                                                                                    "ipAddressRange":  "10.126.75.200-10.126.75.202"
                                                                                },
                                                                                {
                                                                                    "name":  "KubernetesServiceIPs",
                                                                                    "ipAddressRange":  "10.126.75.206-10.126.75.208"
                                                                                }
                                                                            ],
                                                         "mtu":  1500
                                                     },
                                                     {
                                                         "name":  "vSwitch2",
                                                         "interfaceName":  "Port3",
                                                         "enabledForCompute":  false,
                                                         "enabledForStorage":  true,
                                                         "enabledForMgmt":  false,
                                                         "supportsAcceleratedNetworking":  false,
                                                         "enableEmbeddedTeaming":  true,
                                                         "ipAddressPools":  [

                                                                            ],
                                                         "mtu":  1500
                                                     },
                                                     {
                                                         "name":  "TestvSwitch",
                                                         "interfaceName":  "Port5",
                                                         "enabledForCompute":  false,
                                                         "enabledForStorage":  false,
                                                         "enabledForMgmt":  false,
                                                         "supportsAcceleratedNetworking":  true,
                                                         "enableEmbeddedTeaming":  false,
                                                         "ipAddressPools":  [

                                                                            ],
                                                         "mtu":  9000
                                                     }
                                                 ],
                                   "virtualNetworks":  [
                                                           {
                                                               "name":  "TestvSwitch-internal",
                                                               "vSwitchName":  "TestvSwitch",
                                                               "vlanId":  0,
                                                               "subnetMask":  "255.255.255.0",
                                                               "gateway":  "192.0.2.0/24",
                                                               "network":  "192.0.2.0/24",
                                                               "enabledForKubernetes":  false,
                                                               "ipAddressPools":  [
                                                                                      {
                                                                                          "name":  "VirtualMachineIPs",
                                                                                          "ipAddressRange":  "192.0.2.0/24"
                                                                                      }
                                                                                  ]
                                                           }
                                                       ]
                               },
                   "time":  {
                                "timeZone":  "Pacific Standard Time",
                                "primaryTimeServer":  "time.windows.com",
                                "secondaryTimeServer":  null
                            },
                   "update":  {
                                  "serverType":  "None",
                                  "wsusServerURI":  null
                              },
                   "webProxy":  {
                                    "isEnabled":  false,
                                    "connectionURI":  null,
                                    "authentication":  "None",
                                    "username":  null,
                                    "password":  null
                                }
               }
      }
      PS C:\> 
      ```

## Activate a device

Use the following steps to activate an Azure Stack Edge device. Note that activation can't be undone, and a device activation key can't be reused or applied to a different device.

1. Retrieve the `ActivationKey` for your device. For detailed steps, see [Create a management resource, and Get the activation key](azure-stack-edge-gpu-deploy-prep.md#create-a-management-resource-for-each-device).

1. Set the `ActivationKey` property.

   ```azurepowershell
   $ActivationKey = "<Activation key>"
   ```
1. Create an activation object and set the `ActivationKey` property.

   ```azurepowershell
   $activation = New-Object PsObject -Property @{ActivationKey=$ActivationKey; ServiceEncryptionKey=""}
   ```

1. Create a package with the activation object and `ActivationKey`.

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

   Here's sample output:

   ```output
   
   PS C:\> Get-DeviceConfigurationStatus | to-json
   {
    "deviceConfiguration":  {
                                "status":  "Complete",
                                "results":  [
                                                {
                                                    "declarationName":  "Network",
                                                    "resultCode":  "Success",
                                                    "errorCode":  "None",
                                                    "message":  null
                                                },
                                                {
                                                    "declarationName":  "Activation",
                                                    "resultCode":  "Success",
                                                    "errorCode":  "None",
                                                    "message":  null
                                                },
                                                {
                                                    "declarationName":  "DeviceEndpoint",
                                                    "resultCode":  "Success",
                                                    "errorCode":  "None",
                                                    "message":  null
                                                },
                                                {
                                                    "declarationName":  "WebProxy",
                                                    "resultCode":  "Success",
                                                    "errorCode":  "None",
                                                    "message":  null
                                                },
                                                {
                                                    "declarationName":  "Time",
                                                    "resultCode":  "NotExecuted",
                                                    "errorCode":  "None",
                                                    "message":  ""
                                                },
                                                {
                                                    "declarationName":  "Update",
                                                    "resultCode":  "NotExecuted",
                                                    "errorCode":  "None",
                                                    "message":  ""
                                                }
                                            ]
                            }
   }
   ```

1. After the operation is complete, fetch the new device configuration.

   ```azurepowershell
   Get-DeviceConfiguration | To-json
   ```

   Here's sample output showing that the device is activated:

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
               }
   }
   ```

## Quickly fetch or change device configuration settings

Use the following steps to fetch the status of the `WebProxy` properties, set the `WebProxy` property to “isEnabled = true” and set the `WebProxy` URI, and then fetch the status of the changed `WebProxy` properties. After running the package, verify the new device configuration.

1. Load the device configuration cmdlet.
 
   ```azurepowershell
   $p = Get-DeviceConfiguration
   ```

1. Fetch the status of the `WebProxy` properties.

   ```azurepowershell
   $p.device.webproxy
   ```

   Here's sample output:

   ```output
   PS C:\> $p.device.webproxy

   isEnabled      : False 
   connectionURI  : null
   authentication : None
   username       :
   password       :
   ```

1. Set the `WebProxy` property to “isEnabled = true” and set the `WebProxy` URI.

   ```azurepowershell
   $p.device.webproxy.isEnabled = $true
   $p.device.webproxy.connectionURI = "<specify a URI depending on the geographic location of the device>"
   ```

1. Fetch the status of the updated `WebProxy` properties.

   ```azurepowershell
   $p.device.webproxy
   ```
   
   Here's sample output:

   ```output
   PS C:\> $p.device.webproxy

   isEnabled      : True 
   connectionURI  : http://10.57.48.82:8080
   authentication : None
   username       :
   password       :
   ```

1. Run the package with updated `WebProxy` properties.

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

   Here's sample output:

   ```output
     "webProxy":  {
                      "isEnabled":  true,
                      "connectionURI":  "http://10.57.48.82:8080",
                      "authentication":  "None",
                      "username":  null,
                      "password":  null
                  }
   ```

## Enable proactive log collection

Proactive log collection gathers system health indicators on your Azure Stack Edge device to help you efficiently troubleshoot any device issues. Proactive log collection is enabled by default. For more information, see [Proactive log collection](azure-stack-edge-gpu-proactive-log-collection.md).

Use the following steps to fetch the current setting and then enable or disable proactive logging for your device.

1.	Fetch the device configuration.

    ```azurepowershell
    Get-DeviceConfiguration | To-json
    ```

1.	Enable device log consent.
	
    ```azurepowershell
    Set-DeviceLogConsent -logConsent $true
    ```

    Here's sample output:

    ```output
    PS C:\> Get-DeviceLogConsent
    False
    PS C:\> Set-DeviceLogConsent -logConsent $true
    True
    PS C:\> Get-DeviceLogConsent
    True
    PS C:\>
    ```

1.	Fetch the device log consent configuration.
	
    ```azurepowershell
    Get-DeviceLogConsent
    ```

## Run device diagnostics

To diagnose and troubleshoot device errors, run diagnostic tests. For more information, see [Run diagnostics](azure-stack-edge-gpu-troubleshoot.md#run-diagnostics).

Use the following steps to verify device status after you apply a configuration package.

1. Run device diagnostics.

   ```azurepowershell
   Start-DeviceDiagnostic
   ```

1. Fetch status of the device diagnostics operation.

   ```azurepowershell
   Get-DeviceDiagnostic | To-json
   ```
   
   Here's sample output:

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

## Set the virtual IP configuration on a two-node device

> [!NOTE]
> Two-node configurations are only supported on Azure Stack Edge Pro GPU and Azure Stack Edge Pro 2 devices.

A virtual IP is an available IP in the cluster network. Set a virtual IP to connect to a clustered device instead of an individual node. Any client connecting to the cluster network on the two-node device must be able to access the virtual IP.

You can set either an Azure Consistent Services or a Network File System configuration. Additional options include static or DHCP network settings. For more information about setting virtual IPs, see [Configure virtual IPs](azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy.md#configure-virtual-ips).

### [Azure Consistent Services](#tab/azure-consistent-services)

### Set a static Azure Consistent Services configuration

1. Fetch the `DeviceVIP` configuration.

    ```azurepowershell
    Get-DeviceVip | to-json
    ```

1. Set the `DeviceVIP` property with a static Azure Consistent Services configuration. 

    ```azurepowershell
    $acsVip = New-Object PSObject  -Property @{ Type = "ACS"; VipAddress = "10.57.51.32"; ClusterNetworkAddress = "10.57.48.0"; IsDhcpEnabled = $false }
    ```

1. Update the device with the `DeviceVIP` property.

    ```azurepowershell
    Set-DeviceVip -vip $acsVip
    ```

1. Fetch the updated `DeviceVIP` configuration.

    ```azurepowershell
    Get-DeviceVip | to-json
    ```

    Here's sample output:

   ```output
   {
   "acsVIP":  {
                   "type":  "ACS",
                   "name":  "Azure Consistent Services",
                   "address":  "10.57.51.32",
                   "network":  {
                                   "name":  "Cluster Network 3",
                                   "address":  "10.57.48.0",
                                   "subnet":  "255.255.248.0",
                                   "dhcpEnabled":  false
                               },
                   "isDhcpEnabled":  false
    }
    }
    PS C:\> 
    ```

### Set a DHCP Azure Consistent Services configuration

1.	Fetch the `DeviceVIP` configuration.

    ```azurepowershell
    Get-DeviceVip | to-json
    ```

1. Set the `DeviceVIP` property to enable DHCP.

    ```azurepowershell
    $acsVip = New-Object PSObject  -Property @{ Type = "ACS"; VipAddress = $null; ClusterNetworkAddress = "10.57.48.0"; IsDhcpEnabled = $true }
    ```

1. Update the device with the `DeviceVIP` property.

    ```azurepowershell
    Set-DeviceVip -vip $acsVip
    ```	

1.	Fetch the updated `DeviceVIP` configuration.

    ```azurepowershell
    Get-DeviceVip | to-json
    ```

    Here's sample output:

    ```output
    {
    "acsVIP":  {
                   "type":  "ACS",
                   "name":  "Azure Consistent Services",
                   "address":  "10.57.53.225",
                   "network":  {
                                   "name":  "Cluster Network 3",
                                   "address":  "10.57.48.0",
                                   "subnet":  "255.255.248.0",
                                   "dhcpEnabled":  true
                               },
                   "isDhcpEnabled":  true
               },
    }
    PS C:\>
    ```

### [Network File System](#tab/network-file-system)

### Set a static Network File System configuration

1.	Fetch the `DeviceVIP` configuration.
    ```azurepowershell
    Get-DeviceVip | to-json
    ```

1. Set the `DeviceVIP` property to enable DHCP.

    ```azurepowershell
    $nfsVip = New-Object PSObject  -Property @{ Type = "NFS"; VipAddress = "10.57.53.215"; ClusterNetworkAddress = "10.57.48.0"; IsDhcpEnabled = $false }
    ```

1. Update the device with the `DeviceVIP` property.

    ```azurepowershell
    Set-DeviceVip -vip $nfsVip
    ```	

1.	Fetch the updated `DeviceVIP` configuration.

    ```azurepowershell
    Get-DeviceVip | to-json
    ```
    Here's sample output:

    ```Output
    {
        "nfsVIP":  {
                   "type":  "NFS",
                   "name":  "Network File System",
                   "address":  "10.57.53.215",
                   "network":  {
                                   "name":  "Cluster Network 3",
                                   "address":  "10.57.48.0",
                                   "subnet":  "255.255.248.0",
                                   "dhcpEnabled":  false
                               },
                   "isDhcpEnabled":  false
               }
    }
    PS C:\>
    ```

### Set a DHCP Network File System configuration

1.	Fetch the `DeviceVIP` configuration.
    ```azurepowershell
    Get-DeviceVip | to-json
    ```

1. Set the `DeviceVIP` property to enable DHCP.

    ```azurepowershell
    $nfsVip = New-Object PSObject  -Property @{ Type = "NFS"; VipAddress = $null; ClusterNetworkAddress = "10.57.48.0"; IsDhcpEnabled = $true }
    ```

1. Update the device with the `DeviceVIP` property.

    ```azurepowershell
    Set-DeviceVip -vip $nfsVip
    ```	

1.	Fetch the updated `DeviceVIP` configuration.

    ```azurepowershell
    Get-DeviceVip | to-json
    ```

    Here's sample output:

    ```output
    {
    "nfsVIP":  {
                "type":  "NFS",
                "name":  "Network File System",
                "address":  "10.57.53.228",
                "network":  {
                                "name":  "Cluster Network 3",
                                "address":  "10.57.48.0",
                                "subnet":  "255.255.248.0",
                                "dhcpEnabled":  true
                            },
                "isDhcpEnabled":  true
                }
    }
    PS C:\>
    ```

---

## Troubleshooting

- [Run diagnostics or collect logs to troubleshoot Azure Stack Edge device issues](azure-stack-edge-gpu-troubleshoot.md).

## Next steps

- [Troubleshoot device activation issues](azure-stack-edge-gpu-troubleshoot-activation.md).
- [Troubleshoot Azure Resource Manager issues](azure-stack-edge-gpu-troubleshoot-azure-resource-manager.md).
- [Troubleshoot Blob storage issues](azure-stack-edge-gpu-troubleshoot-blob-storage.md).
