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

# Customer intent: As an IT admin, I need to be able to easily find out how many Data Boxes I need for large Blob storage exports and quickly  generate XML files for the exports.
---

# Generate XML files for blob exports to multiple Data Box or Data Box Heavy devices

The `generateXMLFilesForExport.ps1` generates XML files for exporting from Azure Blob storage containers to multiple Azure Data Box or Azure Data Box Heavy devices. You then [create an export order using the XML files](/azure/databox/data-box-deploy-export-ordered?tabs=sample-xml-file#export-order-using-xml-file).

## Prerequisites

Before you begin, make sure you have:

- Windows client
- Azure subscription to use for your Azure Data Box or Azure Data Box Heavy resources
- Resource group to use to manage the resources
- PowerShell 5.1 or later
- Az PowerShell 6.4.0
- `multipleDataBoxExport` script, stored in a convenient location

### Install Azure PowerShell

1. Install PowerShell v5.1 or later. For guidance, see [Install Azure PowerShell](https://docs.microsoft.com/powershell/scripting/install/installing-powershell?view=powershell-7.1).

2. [Install Az PowerShell 6.4.0](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-6.4.0&preserve-view=true).
  
### Download the script

1. Go to the [repo in Azure Samples where Data Box sample files are stored](https://github.com/Azure-Samples/data-box-samples).

2. Download or clone the zip file for the repo.

   ![Download zip file](media/data-box-script-readme-multiple-xml-files/data-box-order-clone-download-script-zip-file.png)

   Extract the files from the zip, and save the script to a convenient location. Note where you saved it.

   You can also clone the samples:

   ```json
   git clone https://github.com/Azure-Samples/data-box-samples.git
   ```

## Run the script and create export orders

1. Open Azure PowerShell as Administrator.
2. Set your execution policy to **Unrestricted**. This is needed because the script is an unsigned script.

   ```azurepowershell
   Set-ExecutionPolicy Unrestricted
   ```

3. Change directories to the directory where you stored the script. For example:

   ```azurepowershell
   cd \scripts
   ```

4. Run the script. For example:

   ```azurepowershell
   .\generateXMLFilesForExport.ps1 -SubscriptionName exampleSubscription -ResourceGroupName exampleRG -StorageAccountName exampleStorageAccount -ContainerNames container1,container2 -Device DataBox
   ```

5. With an **Unrestricted** execution policy, you'll see the following text. Type `R` to run the script.

   ```azurepowershell
   Security warning
   Run only scripts that you trust. While scripts from the internet can be useful, this script can potentially harm your computer.
   If you trust this script, use the Unblock-File cmdlet to allow the script to run without this warning message. Do you want to
   run C:\scripts\New-AzStackEdgeMultiOrder.ps1?
   [D] Do not run  [R] Run once  [S] Suspend  [?] Help (default is "D"): R
   ```

   When the script completes, all of the export XML files will be in the folder `\exportxmlfiles`. The folder's contents are overwritten on each run of the script.

6. Make the export orders. Follow the instructions in [Export order using XML file](http://docs.microsoft.com/azure/databox/data-box-deploy-export-ordered?tabs=sample-xml-file#export-order-using-xml-file) to create an export order for each XML file.


## Syntax

You can split the split the blobs into XML files based on the device that you're ordering (Data Box or Data Box Heavy), or you can specify a data size.

### Split by device: Data Box or Data Box Heavy

```powershell
.\generateXMLFilesForExport.ps1
        [-SubscriptionName] <String>
        [-ResourceGroupName] <String>
        [-StorageAccountName] <String>
        [-Device] <String>
        [-ContainerNames] <String[]>
        [-StorageAccountKey] <String>
```

### Split by data size

```powershell
.\generateXMLFilesForExport.ps1
        [-SubscriptionName] <String>
        [-ResourceGroupName] <String>
        [-StorageAccountName] <String>
        [-DataSize] <Long>
        [-Container] <String[]>
        [-StorageAccountKey] <String>
```

## Parameters

| Parameter | Description |
|-----------|-------------|
|`SubscriptionName <String>`|The Azure subscription to use for the export orders.|
|`ResourceGroupName <String>`|The resource group to use for the orders.|
|`StorageAccountName <String>`|The name of the Azure Storage account to use for the orders.|
|`StorageAccountKey <String>` (Optional) |The access key for the storage account. By default, PowerShell uses the user's credentials to authenticate the storage account. Use the access key if you don't otherwise have access to the storage account. [Find out the account access key](https://docs.microsoft.com/storage/common/storage-account-keys-manage?tabs=azure-portal).|
|`Device <String>`|Indicates whether you're exporting to Data Box (`"DataBox"`) devices or Data Box Heavy (`"DataBoxHeavy"`) devices. This parameter determines the maximum blob size for the XML files.<br>Do not use the `Device` parameter with `DataSize`.|
|`DataSize> <Long>` (Optional)|Indicates the size of the device you're exporting to.<br>Do not use the `DataSize` parameter with `Device`.|
|`Container <String[]>` (Optional)|Selects containers to export. This parameter can contain:<ul><li>a single container</li><li>a list of containers separated by commas</li><li>wildcard characters to select multiple containers or blobs within a container. For wildcard examples, see [Prefix examples](https://docs.microsoft.com/azure/databox/data-box-deploy-export-ordered?tabs=prefix-examples#create-xml-file).</li></ul>If you don't include this parameter, all containers in the storage account are processed.|


## Usage notes

### Exporting a container with churning data

To minimize risk, avoid running this script on containers with churning data. If that is not possible, here is some important information about this script's behavior on churning data.

- If there are no deletions, all blobs present in the storage account when the script is run are included in the export XML files.
- Blobs added to the storage account after the script is run may or may not be included in the export XML files.
- Deletions after the script is run may result in script failures or export order failures.

### Script performance

This script's performance is bottlenecked by the number of blobs you want to export. If you are exporting containers with >100 million blobs, consider running this script on an Azure virtual machine located in the same datacenter as the containers.

- When run on an Azure virtual machine, this script processes 1 million blobs in ~2.5 mins.
- When run on a local machine, this script can take >5 mins per 1 million blobs depending on network speed.
 
[Overview of Azure Virtual Machines](/azure/virtual-machines/windows/overview)

## Sample output

### Sample 1: XML file for single Data Box

This sample run generates an export XML for all blobs in the DBTestStorageAccount storage account. Since all of the data will fit on a single Data Box, the script creates a single XML file.

Sample 1 command:

```azurepowershell
.\generateXMLFilesForExport.ps1 -Subscription 'DataBox Test' -ResourceGroupName DBtestRG -StorageAccountName DBTestStorageAccount -Device DataBox
```

Sample 1 output:

```azurepowershell
PS C\Users\azureuser:> cd scripts\data-box-samples\multipleDataBoxExportScript
PS C:\Users\azureuser\scripts\data-box-samples\multipleDataBoxExportScript> .\generateXMLFilesForExport.ps1 -Subscription 'DataBox Test' -ResourceGroupName DBtestRG -StorageAccountName DBTestAccount -Device DataBox

Transcript started, output file is C:\Users\azureuser\Scripts\data-box-samples\multipleDataBoxExportScript/log.txt

authenticating storage account..
storage account authenticated

[10/22/21 14:18:46] Processing containers: 'containerl contained containers databoxcopylog vhds xml1, storage account: 'DBTestAccount', resource group: 'DBtestRG'

[10/22/21 14:18:46] processing container: 'containerl1...

[10/22/21 14:18:46] blobs processed: 3

[10/22/21 14:18:46] processing container: 'contained1...

[10/22/21 14:18:49] blobs processed: 7

[10/22/21 14:18:49] processing container: 'containers'...

[10/22/21 14:18:49] blobs processed: 10

[10/22/21 14:18:49] processing container: 'databoxcopylog'...

[10/22/21 14:18:50] blobs processed: 12 [10/22/21 14:18:50] processing container: 'vhds'...

[10/22/21 14:18:51] blobs processed: 14 [10/22/21 14:18:51] processing container: 'xml'.,.

[10/22/21 14:18:51] blobs processed: 15

[10/22/21 14:18:51] processing complete, export xml files generated successfully in exportxmlfiles/

Transcript stopped, output file is C:\Users\azureuser\Scripts\data-box-samples\multipleDataBoxExportScript\log.txt
```

### Sample 2: Export to multiple XML files

This test run exports to multiple XML files using a `Container` list. The maximum data size for an XML file is set explicitly using the `-DataSize`.

Sample 2 command:

```azurepowershell
.\generateXMLFilesForExport.ps1 -Subscription 'DataBox Test' -ResourceGroupName DBtestRG -StorageAccountName DBTestAccount -Container container1,container2,container3 -DataSize 250MB
```

Sample 2 output:

```azurepowershell
Transcript started, output file is C:\Users\azureuser\Scripts\data-box-samples\multipleDataBoxExportScript/log.txt

storage account context loaded from previous run, skipping authentication

[10/22/21 15:29:01] Processing containers: 'container1 container2 container3', storage account: 'DBTestAccount', resource group: 'DBtestRG'

[10/22/21 15:29:01] processing container: 'container1'...

[10/22/21 15:29:02] blobs processed: 3

[10/22/21 15:29:02] processing container: 'container2'... 

[10/22/21 15:29:03] C:\Users\azureuser\data-box-samples\multipleDataBoxExportScript\exportxmlfiles\export_DBTestAccount_2021-10-22_152859548.xml ready for an export order!

[10/22/21 15:29:03]

[10/22/21 15:29:03] blobs processed: 7

[10/22/21 15:29:03] processing container: 'containers'...

[10/22/21 15:29:03] blobs processed: 10

[10/22/21 15:29:03] processing complete, export xml files generated successfully in exportxmlfiles/

Transcript stopped, output file is C:\Users\azureuser\Scripts\data-box-samples\multipleDataBoxExportScript\log.txt
```

### Sample 3: Split very large file to multiple Data Boxes

Sample 3 splits a very large file in a single container into multiple XML files for export to multiple Data Boxes.

Sample 3 command:

```azurepowershell
.\generateXMLFilesForExport.ps1 -Subscription DataBoxTest -ResourceGroupName DBexportsRG -StorageAccountName DBTEstAccount -DataSize 1099511627776 -ContainerNames 500gbfilesof5tb
```

Sample 3 output:

```azurepowershell
Transcript started, output file is C:\Users\azureuser\Scripts\data-box-samples\multipleDataBoxExportScript\log.txt

storage account context loaded from previous run, skipping authentication

[10/22/21 15:43:57] Processing containers: '500gbfilesof5tb', storage account: 
'DBTEstAccount', resource group: 'DBexportsRG'

[10/22/21 15:43:57] processing container: '500gbfilesof5tb'...

[10/22/21 15:43:58] C:\Users\azureuser\Scripts\data-box-samples\multipleDataBoxExportScript/exportxmlfiles/export_DBTestAccount_2021-10-22_154356392.xml is ready for an export order!

[10/22/21 15:43:58]

[10/22/21 15:43:58] C:\Users\azureuser\Scripts\data-box-samples\multipleDataBoxExportScript/exportxmlfiles/export_DBTestAccount_2021-10-22_154358396.xml is ready for an export order!

[10/22/21 15:43:58]

[10/22/21 15:43:58] C:\Users\azureuser\Scripts\data-box-samples\multipleDataBoxExportScript/exportxmlfiles/export_DBTestAccount_2021-10-22_154358412.xml is ready for an export order!

[10/22/21 15:43:58]
[10/22/21 15:43:58] C:\Users\azureuser\Scripts\data-box-samples\multipleDataBoxExportScript/exportxmlfiles/export_DBTestAccount_2021-10-22_154358423.xml is ready for an export order!

[10/22/21 15:43:58]

[10/22/21 15:43:58] blobs processed: 10

[10/22/21 15:43:58] processing complete, export xml files generated successfully in exportxmlfiles/
Transcript stopped, output file is C:\Users\azureuser\Scripts\data-box-samples\multipleDataBoxExportScript\log.txt
```



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
