---
title: Generate XML files to export blobs to multiple Azure Data Box or Azure Data Box Heavy devices
description: Batch-create XML files for large exports from Azure Blob storage to multiple Azure Data Box or Azure Data Box Heavy devices.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: heavy
ms.topic: sample
ms.date: 10/27/2021
ms.author: alkohli

# Customer intent: As an IT admin, I need to be able to efficiently create XML files for large Blob storage exports that require multiple Data Box or Data Box Heavy devices.
---

# Generate XML files for an Azure Blob storage export to multiple Azure Data Box devices

The `generateXMLFilesForExport.ps1` generates XML files for exporting from Azure Blob storage containers to multiple Azure Data Box or or Azure Data Box Heavy devices. For more information about making an export order using XML files, see [Export order using XML file](https://docs.microsoft.com/en-us/azure/databox/data-box-deploy-export-ordered?tabs=sample-xml-file#export-order-using-xml-file).

## Prerequisites

Before you begin, make sure you have:

- Windows client
- Azure subscription to use for your Azure Data Box or Azure Data Box Heavy resources
- Resource group to use to manage the resources
- PowerShell 5.1 or later
- Az PowerShell 6.4.0
- Script - `multipleDataBoxExport` - stored in a convenient location

### Install Azure PowerShell

1. Install PowerShell v5.1 or later. For guidance, see [Install Azure PowerShell](/powershell/azure/install-az-ps?view=azps-4.7.0).

2. [Install Az PowerShell 6.4.0](/powershell/azure/install-az-ps?view=azps-6.4.0).
  
### Download the script

1. Go to the [repo in Azure Samples where Data Box samples are stored](https://github.com/Azure-Samples/data-box-samples).<!--Script and README will move to a subfolder?-->

1. Download or clone the zip file for the script.

   ![Download zip file](./azure-stack-edge-order-download-clone-scripts.png)

    Extract the files from the zip, and note where you saved the scripts.

    You can also clone the samples:

     ```json
     git clone https://github.com/Azure-Samples/azure-stack-edge-order.git
     ```

## Run the script

1. Open Azure PowerShell as Administrator.
2. Set your execution policy to **Unrestricted**. This is needed because the script is an unsigned script.

   ```azurepowershell
   Set-ExecutionPolicy Unrestricted
   ```

3. Change directories to the directory where you stored the script. For example:

   ```azurepowershell
   cd scripts
   ```

4. Run the script. To run `New-AzStackEdgeMultiOrder.ps1`, you would type the following:

   ```azurepowershell
   & '.\New-AzStackEdgeMultiOrder.ps1'
   ```
5. With an **Unrestricted** execution policy, you'll see the following text. Type `R` to run the script.

   ```azurepowershell
   Security warning
   Run only scripts that you trust. While scripts from the internet can be useful, this script can potentially harm your computer.
   If you trust this script, use the Unblock-File cmdlet to allow the script to run without this warning message. Do you want to
   run C:\scripts\New-AzStackEdgeMultiOrder.ps1?
   [D] Do not run  [R] Run once  [S] Suspend  [?] Help (default is "D"): R
   ```

### New-AzStackEdgeMultiOrder.ps1

Use the `generateXMLFilesForExport.ps1` script to generate XML files for exporting containers in Azure Blob storage to multiple Data Box or Data Box Heavy devices. You can split the blobs by device or by data size.

#### Usage notes

You'll need to provide an Azure subscription ID, resource group, the region where the new Azure Stack Edge resources will be created and other order details. If you are copying an existing order, you will provide the device name and order information from that order.

#### Syntax info

**Split by device:**

```powershell
.\generateXMLFilesForExport.ps1
        [-SubscriptionName] <String>
        [-ResourceGroupName] <String>
        [-StorageAccountName] <String>
        [-Device] <String>
        [-ContainerNames] <String[]> (Optional)
        [-StorageAccountKey] <String> (Optional)
```

**Split by data size:**

```powershell
.\generateXMLFilesForExport.ps1
        [-SubscriptionName] <String>
        [-ResourceGroupName] <String>
        [-StorageAccountName] <String>
        [-DataSize] <Long>
        [-ContainerNames] <String[]> (Optional)
        [-StorageAccountKey] <String> (Optional)
```

#### Parameter info

- `SubscriptionName` identifies the Azure subscription to use for the orders.
- `ResourceGroupName` is the resource group to use for the orders.
- `StorageAccountName` is the name of the storage account to use for the orders.
- `Device` is the type of device you're exporting to: Data Box, with a XX limit, or Data Box Heavy, with a XX limit. This determines the amount of 
- `DeviceName` becomes the name for the new Azure Stack Edge orders. For example, **mydevice** becomes mydevice-0, mydevice-1, and so forth. If you are copying an existing order, use that order name.

- `OrderCount` is the total number of orders that you want to create. If you are copying an existing order, enter the total number of orders to create. For example, if you have two copies of an existing order (say, uswest-0 and uswest-1), and you want to add three new orders, enter 5 as the `OrderCount`. The three new orders (uswest-3, uswest-4, and uswest-5) will be added to the existing orders.
- `SKU` indicates the configuration of Azure Stack Edge device to order:
  | Azure Stack Edge SKU | Value |
  | -------------------- | ---------------- |
  | Azure Stack Edge Pro - 1GPU | `EdgeP_Base` |
  | Azure Stack Edge Pro - 2GPU | `EdgeP_High` |
  | Azure Stack Edge Pro - single node | `EdgePR-Base` |
  | Azure Stack Edge Pro - single node with UPS | `EdgePR_Base_UPS` |
  | Azure Stack Edge Mini R | `EdgeMR_Mini` |
  
   > [!NOTE]
   > Azure Stack Edge Pro with FPGA is now deprecated and new orders can't be created.
   
- `ResoureGroupName` - Enter a resource group to use with the order.

#### Sample output 1: Create new orders

The following is sample output from running `New-AzStackEdgeMultiOrder.ps1` to create two orders at the same time. This order is created from scratch. There are no existing orders with the device name.

```azurepowershell
PS C:> Set-ExecutionPolicy Unrestricted
PS C:> cd scripts
PS C:\scripts> & '.\New-AzStackEdgeMultiOrder.ps1'

Security warning
Run only scripts that you trust. While scripts from the internet can be useful, this script can potentially harm your computer.
If you trust this script, use the Unblock-File cmdlet to allow the script to run without this warning message. Do you want to
run C:\scripts\New-AzStackEdgeMultiOrder.ps1?
[D] Do not run  [R] Run once  [S] Suspend  [?] Help (default is "D"): R

cmdlet New-AzStackEdgeMultiOrder.ps1 at command pipeline position 1
Supply values for the following parameters:
(Type !? for Help.)
SubscriptionId: ab1c2def-3g45-6h7i-j8kl-901234567890
ResourceGroupName: myaseresourcegroup
Location: West Europe
OrderCount: 2
DeviceName: myasegpu1
ContactPerson: Gus Poland
CompanyName: Contoso LTD
Phone: 4085555555
Email: gusp@contoso.com
AddressLine1: 1020 Enterprise Way
PostalCode: 94089
City: Sunnyvale
State: CA
Country: USA
Sku:EdgeP_Base
Setting context

Name                                     Account             SubscriptionName    Environment         TenantId
----                                     -------             ----------------    -----------         --------
ContosoWE (ab1c2def-3g45-6h7i... gusp@con... Edge Gatewa... AzureCloud     12a345bc-6...

ResourceGroupName : myaseresourcegroup
EdgeDevice        : Microsoft.Azure.Management.DataBoxEdge.Models.DataBoxEdgeDevice
Name              : myasegpu1-0
Id                : /subscriptions/ab1c2def-3g45-6h7i-j8kl-901234567890/resourceGroups/myaseresourcegroup/providers/Microsoft.DataBoxEdge/dataBoxEdgeDevices/myasegpu1-0
ExtendedInfo      :
UpdateSummary     :
Alert             :
NetworkSetting    :


ResourceGroupName : myaseresourcegroup
EdgeDevice        : Microsoft.Azure.Management.DataBoxEdge.Models.DataBoxEdgeDevice
Name              : myasegpu1-1
Id                : /subscriptions/ab1c2def-3g45-6h7i-j8kl-901234567890/resourceGroups/myaseresourcegroup/providers/Microsoft.DataBoxEdge/dataBoxEdgeDevices/myasegpu1-1
ExtendedInfo      :
UpdateSummary     :
Alert             :
NetworkSetting    :

Script execution successful.
----------------------------
myasegpu1-0 resource created and order placed successfully
myasegpu1-1 resource created and order placed successfully
```

### Sample output 2: Copy an existing order

The following sample output is from running `New-AzStackEdgeMultiOrder.ps1` a second time, when two orders already exist and a total of five orders are needed. `OrderCount` was set to the total number of orders needed. The script found the existing two orders and added three more.

```azurepowershell
PS C:> cd scripts
PS C:\scripts> & '.\New-AzStackEdgeMultiOrder.ps1'

Security warning
Run only scripts that you trust. While scripts from the internet can be useful, this script can potentially harm your computer. If you trust this script, use the Unblock-File cmdlet to allow the script
 to run without this warning message. Do you want to run C:\scripts\New-AzStackEdgeMultiOrder.ps1?
[D] Do not run  [R] Run once  [S] Suspend  [?] Help (default is "D"): R

cmdlet New-AzStackEdgeMultiOrder.ps1 at command pipeline position 1
Supply values for the following parameters:
(Type !? for Help.)
SubscriptionId: ab1c2def-3g45-6h7i-j8kl-901234567890
ResourceGroupName: myaseresourcegroup
Location: West Europe
OrderCount: 5
DeviceName: myasegpu1
ContactPerson: Gus Poland
CompanyName: Contoso LTD
Phone: 4085555555
Email: gusp@contoso.com
AddressLine1: 1020 Enterprise Way
PostalCode: 94089
City: Sunnyvale
State: CA
Country: United States
Sku: EdgeP_Base

Setting context

-----CUT-----CUT-----CUT-----CUT-----CUT-----

Script execution successful.
----------------------------
myasegpu1-0 resource already exists
myasegpu1-1 resource already exists
myasegpu1-2 resource created and order placed successfully
myasegpu1-3 resource created and order placed successfully
myasegpu1-4 resource created and order placed successfully
```

### New-AzStackEdge-Clone-MultiOrder.ps1

This script creates one or more new orders for Azure Stack Edge devices by cloning an existing order or resource.

#### Usage notes

To identify the order that you want to clone, you'll need to provide the subscription ID, resource group, and device name.

You'll be able to give the new orders a different name and specify the Azure Stack Edge configuration to use.

The new orders will be created in the same region as the original order. Contact and address info from that order also will be used.

#### Parameter info

- `DeviceNameToClone` - Enter the friendly name of the device you want to clone.

- `OrderCount` - Specify the number of orders to create.

- `NewDeviceName` - Give a name for the new devices. Order names will be numbered. For example, **mynewdevice** becomes mynewdevice-0, mynewdevice-1, and so forth.

- `SKU` indicates the configuration of Azure Stack Edge device to order:
  | Azure Stack Edge SKU | Value |
  | -------------------- | ---------------- |
  | Azure Stack Edge Pro - 1GPU | `EdgeP_Base` |
  | Azure Stack Edge Pro - 2GPU | `EdgeP_High` |
  | Azure Stack Edge Pro - single node | `EdgePR-Base` |
  | Azure Stack Edge Pro - single node with UPS | `EdgePR_Base_UPS` |
  | Azure Stack Edge Mini R | `EdgeMR_Mini` |

### Sample output

The following is sample output for three orders named myasegpu1useast-0, myasegpu1useast-1, and myasegpu1useast-3, which were cloned from an existing order named myasegputest. The `New-AzStackEdge-Clone-MultiOrder.ps1` script was used.

```azurepowershell
PS C: > Set-ExecutionPolicy Unrestricted
PS C: > cd scripts
PS C:\Windows> cd scripts
PS C:\scripts> & '.\New-AzStackEdge-Clone-MultiOrder.ps1'

Security warning
Run only scripts that you trust. While scripts from the internet can be useful, this script can potentially harm your
computer. If you trust this script, use the Unblock-File cmdlet to allow the script to run without this warning
message. Do you want to run C:\Users\v-dalc\Scripts\New-AzStackEdge-Clone-MultiOrder.ps1?
[D] Do not run  [R] Run once  [S] Suspend  [?] Help (default is "D"): R

cmdlet New-AzStackEdge-Clone-MultiOrder.ps1 at command pipeline position 1
Supply values for the following parameters:
(Type !? for Help.)
SubscriptionId: ab1c2def-3g45-6h7i-j8kl-901234567890
ResourceGroupName: myaseresourcegroup
DeviceNameToClone: myasegputest
OrderCount: 3
NewDeviceName: myasegpu1useast
Sku: EdgeP_Base
Setting context

Name                                     Account             SubscriptionName    Environment         TenantId
----                                     -------             ----------------    -----------         --------
ContosoWE (ab1c2def-3g45-6h7i... gusp@con... Edge Gatewa... AzureCloud     12a345bc-6...
Getting Device Details
Getting Order Details

ResourceGroupName : myaseresourcegroup
EdgeDevice        : Microsoft.Azure.Management.DataBoxEdge.Models.DataBoxEdgeDevice
Name              : myasegpu1useast-0
Id                : /subscriptions/ab1c2def-3g45-6h7i-j8kl-901234567890/resourceGroups/myaseresourcegroup/providers/Microsoft.
                    DataBoxEdge/dataBoxEdgeDevices/myasegpu1useast-0
ExtendedInfo      :
UpdateSummary     :
Alert             :
NetworkSetting    :


ResourceGroupName   : myaseresourcegroup
StackEdgeOrder      : Microsoft.Azure.Management.DataBoxEdge.Models.Order
DeviceName          : myasegpu1useast-0
Id                  : /subscriptions/ab1c2def-3g45-6h7i-j8kl-901234567890/resourceGroups/myaseresourcegroup/providers/Microsoft.DataBoxEdge/dataBoxEdgeDevices/myasegpu1useast-0/orders/default
OrderHistory        : {}
ForwardTrackingInfo : {}
ReturnTrackingInfo  : {}
ShippingAddress     : Microsoft.Azure.Management.DataBoxEdge.Models.Address

Getting Device Details
Getting Order Details

ResourceGroupName : myaseresourcegroup
EdgeDevice        : Microsoft.Azure.Management.DataBoxEdge.Models.DataBoxEdgeDevice
Name              : myasegpu1useast-1
Id                : /subscriptions/ab1c2def-3g45-6h7i-j8kl-901234567890/resourceGroups/myaseresourcegroup/providers/Microsoft.DataBoxEdge/dataBoxEdgeDevices/myasegpu1useast-1
ExtendedInfo      :
UpdateSummary     :
Alert             :
NetworkSetting    :


ResourceGroupName   : myaseresourcegroup
StackEdgeOrder      : Microsoft.Azure.Management.DataBoxEdge.Models.Order
DeviceName          : myasegpu1useast-1
Id                  : /subscriptions/ab1c2def-3g45-6h7i-j8kl-901234567890/resourceGroups/myaseresourcegroup/providers/Microsoft.DataBoxEdge/dataBoxEdgeDevices/myasegpu1useast-1/orders/default
OrderHistory        : {}
ForwardTrackingInfo : {}
ReturnTrackingInfo  : {}
ShippingAddress     : Microsoft.Azure.Management.DataBoxEdge.Models.Address

Getting Device Details
Getting Order Details

ResourceGroupName : myaseresourcegroup
EdgeDevice        : Microsoft.Azure.Management.DataBoxEdge.Models.DataBoxEdgeDevice
Name              : myasegpu1useast-2
Id                : /subscriptions/ab1c2def-3g45-6h7i-j8kl-901234567890/resourceGroups/myaseresourcegroup/providers/Microsoft.DataBoxEdge/dataBoxEdgeDevices/myasegpu1useast-2
ExtendedInfo      :
UpdateSummary     :
Alert             :
NetworkSetting    :


ResourceGroupName   : myaseresourcegroup
StackEdgeOrder      : Microsoft.Azure.Management.DataBoxEdge.Models.Order
DeviceName          : myasegpu1useast-2
Id                  : /subscriptions/ab1c2def-3g45-6h7i-j8kl-901234567890/resourceGroups/myaseresourcegroup/providers/Microsoft.DataBoxEdge/dataBoxEdgeDevices/myasegpu1useast-2/orders/default
OrderHistory        : {}
ForwardTrackingInfo : {}
ReturnTrackingInfo  : {}
ShippingAddress     : Microsoft.Azure.Management.DataBoxEdge.Models.Address

Script execution successful.
----------------------------
myasegpu1useast-0 resource created and order placed successfully
myasegpu1useast-1 resource created and order placed successfully
myasegpu1useast-2 resource created and order placed successfully
```