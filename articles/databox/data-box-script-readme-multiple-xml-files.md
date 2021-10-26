---
title: Generate XML files to export blobs to multiple Azure Data Box or Azure Data Box Heavy devices
description: Batch-create XML files for large exports from Azure Blob storage to multiple Azure Data Box or Azure Data Box Heavy devices.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: heavy
ms.topic: sample
ms.date: 10/26/2021
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

1. Install PowerShell v5.1 or later. For guidance, see [Install Azure PowerShell](/powershell/azure/install-az-ps?view=azps-4.7.0).

2. [Install Az PowerShell 6.4.0](/powershell/azure/install-az-ps?view=azps-6.4.0&preserve-view=true).
  
### Download the script

1. Go to the [repo in Azure Samples where Data Box sample files are stored](https://github.com/Azure-Samples/data-box-samples).<!--Get ZIP file for script and README. They will be in a Data Box subfolder?-->

1. Download or clone the zip file for the script.

   ![Download zip file](./data-box-order-clone-download-script-zip-file.png)>

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

   When the script completes, all of the export XML files will be in the folder `\exportxmlfiles`.

6. Make the export orders. Follow the instructions in [Export order using XML file](/azure/databox/data-box-deploy-export-ordered?tabs=sample-xml-file#export-order-using-xml-file) to create an export order for each XML file.

### multipleDataBoxExport.ps1

Use the `multipleDataBoxExport.ps1` script to generate XML files to export containers in Azure Blob storage to multiple Data Box or Data Box Heavy devices. 


### Usage notes

You'll need to provide the Azure subscription name, resource group, the region where the new Azure Stack Edge resources will be created and other order details. If you are copying an existing order, you will provide the device name and order information from that order.

## Syntax

Usually, you'll split the containers into XML files that fit onto a Data Box or Data Box Heavy device. However, in some testing environments, you might want to specify the maximum data size for an XML file instead of the Data Box SKU.

#### Split by device: Data Box or Data Box Heavy

```powershell
.\generateXMLFilesForExport.ps1
        [-SubscriptionName] <String>
        [-ResourceGroupName] <String>
        [-StorageAccountName] <String>
        [-Device] <String>
        [-ContainerNames] <String[]> (Optional)
        [-StorageAccountKey] <String> (Optional)
```

#### Split by data size

```powershell
.\generateXMLFilesForExport.ps1
        [-SubscriptionName] <String>
        [-ResourceGroupName] <String>
        [-StorageAccountName] <String>
        [-DataSize] <Long>
        [-ContainerNames] <String[]> (Optional)
        [-StorageAccountKey] <String> (Optional)
```

## Parameters

| Parameter | Description |
|-----------|-------------|
|`SubscriptionName <string>`|Identifies the Azure subscription to use for the export orders.|
|`ResourceGroupName <string>`|The resource group to use for the orders.|
|`StorageAccountName <string>`|The name of the Azure Storage account to use for the orders.|
|`Device <string>`|Indicates whether you're exporting to Data Box (`"DataBox"`) or Data Box Heavy (`"DataBoxHeavy"`) devices. This parameter determines the maximum blob size when the containers are split among XML files.<br>Do not use the `Device` parameter with `DataSize`.|
|`ContainerNames <string>` (Optional)|Selects containers to export. This parameter can contain:<ul><li>a single container</li><li>a list of containers separated by commas</li><li>wildcard characters to select multiple containers or blobs within a container. For wildcard examples, see [Prefix examples](https://docs.microsoft.com/azure/databox/data-box-deploy-export-ordered?tabs=prefix-examples#create-xml-file) in **Create XML file**.</li></ul>If this parameter is not specified, all containers in the storage account are processed.|
|`StorageAccountKey <string>` (Optional) |The access key for the storage account. [Find out the account access key](/storage/common/storage-account-keys-manage?tabs=azure-portal). <!--When is this optional?-->|
|`DataSize> <long>` (Optional)|Can be used instead of the `Device` parameter to specify the size of the device you're exporting to. Used mainly in testing. Enter the data size as a long integer.<br>Do not use the `DataSize` parameter with `Device`.<!--What's a testing user scenario?-->|

## Usage notes

XXX

### Splitting blobs into XML files

You can split the contents of containers into blobs based on the device type - either Data Box or Data Box Heavy - or set a maximum data size for the blobs.
- To size the blobs for either Data Box or Data Box Heavy devices, use the `-Device` parameter with either the `DataBox` or `DataBoxHeavy` value. 
- To specify the maximum data size for the blobs, use the `-DataSize` parameter.

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

### Creating export orders

See [Export order using XML file](/azure/databox/data-box-deploy-export-ordered?tabs=sample-xml-file#export-order-using-xml-file) for steps to create export orders using the XML files that the script generates.

## Sample output

### Sample 1: XML file for a single Data Box

This run of `multipleDataBoxExport.ps1` generates an export XML for all blobs and files in the TBD storage account. Since all of the data will fit on a single Data Box, the script creates a single XML file.<!--1) This output was produced at a DOS command prompt rather than in Azure PowerShell? (No "&" beginning the command.) Procedures run the script from PowerShell. Adjust sample output? 2) To simplify output, run script from \Scripts instead of the user account path. 3) First sample should be a first run of the script, including storage account authentication.-->

Sample 1 command:

```azurepowershell
.\generateXMLFilesForExport.ps1 -Subscription 'DataBox Test' -ResourceGroupName AlpatestRG -StorageAccountName kylemtest -Device DataBox
```

Sample 1 output:<!--Replace without output from a first-run test.-->

```azurepowershell
PS C: cd scripts\data-box-samples\multipleDataBoxExportScript
PS C:\scripts\data-box-samples\multipleDataBoxExportScript> .\generateXMLFilesForExport.ps1 -Subscription 'DataBox Test' -ResourceGroupName AlpatestRG -StorageAccountName kylemtest -Device DataBox

Transcript started, output file is C:\Scripts\data-box-samples\multipleDataBoxExportScript/log.txt

storage account context loaded from previous run, skipping authentication

Would you like to load from checkpoint for previous job ran at 10/22/2021 14:17:51? (Y)/N: n

[10/22/21 14:18:46] Processing containers: 'containerl contained containers databoxcopylog vhds xml1, storage account: 'kylemtest', resource group: 'AlpatestRG'

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

Transcript stopped, output file is C:\Scripts\data-box-samples\multipleDataBoxExportScript\log.txt
```

ADD SCREENSHOT OF FOLDER W. XML file?

### Sample 2: Export to multiple XML files

This test run exports to multiple XML files using a `Container` list. The maximum data size for an XML file is set explicitly using the `-DataSize`.

Sample 2 command:

```azurepowershell
.\generateXMLFilesForExport.ps1 -Subscription 'DataBox Test' -ResourceGroupName AlpatestRG -StorageAccountName kylemtest -Container  container1,container2,container3 -DataSize 250MB
```

Sample 2 output:

```azurepowershell
Transcript started, output file is C:\Users\kylemoore\data-box-samples\multipleDataBoxExportScript/log.txt
storage account context loaded from previous run, skipping authentication
[10/22/21 15:29:01] Processing containers: 'container1 container2 container3', storage account: 'kylemtest', resource group: 'AlpatestRG'

[10/22/21 15:29:01] processing container: 'container1'...

[10/22/21 15:29:02] blobs processed: 3

[10/22/21 15:29:02] processing container: 'container2'... 

[10/22/21 15:29:03] C:\Users\kylemoore\data-box-samples\multipleDataBoxExportScript/exportxmlfiles/export_kylemtest_2021-10-22_152859548.xml ready for an export order!

[10/22/21 15:29:03]

[10/22/21 15:29:03] blobs processed: 7

[10/22/21 15:29:03] processing container: 'containers'...

[10/22/21 15:29:03] blobs processed: 10

[10/22/21 15:29:03] processing complete, export xml files generated successfully in exportxmlfiles/

Transcript stopped, output file is C:\Users\kylemoore\data-box-samples\multipleDataBoxExportScript\log.txt
```

### Sample 3: Split very large file to multiple Data Boxes

Sample 3 splits a very large file in a single container into multiple XML files for export to multiple Data Boxes.

Sample 3 command:

```azurepowershell
.\generateXMLFilesForExport.ps1 -Subscription 'DataBox Test' -ResourceGroupName suryaexprg -StorageAccountName 500gbfilesworth5tb -DataSize 1099511627776 -ContainerNames 500gbfilesof5tb
```

Sample 3 output:

```azurepowershell
Transcript started, output file is C:\Users\kylemoore\data-box-samples\multipleDataBoxExportScript/log.txt
storage account context loaded from previous run, skipping authentication
[10/22/21 15:43:57] Processing containers: '500gbfilesof5tb', storage account: '500gbfilesworth5tb', resource group: 'suryaexprg'

[10/22/21 15:43:57] processing container: '500gbfilesof5tb'...

[10/22/21 15:43:58] C:\Users\kylemoore\data-box-samples\multipleDataBoxExportScript/exportxmlfiles/export_500gbfilesworth5tb_2021-10-22_154356392.xml is ready for an export order!

[10/22/21 15:43:58]

[10/22/21 15:43:58] C:\Users\kylemoore\data-box-samples\multipleDataBoxExportScript/exportxmlfiles/export_500gbfilesworth5tb_2021-10-22_154358396.xml is ready for an export order!

[10/22/21 15:43:58]

[10/22/21 15:43:58] C:\Users\kylemoore\data-box-samples\multipleDataBoxExportScript/exportxmlfiles/export_500gbfilesworth5tb_2021-10-22_154358412.xml is ready for an export order!

[10/22/21 15:43:58]
[10/22/21 15:43:58] C:\Users\kylemoore\data-box-samples\multipleDataBoxExportScript/exportxmlfiles/export_500gbfilesworth5tb_2021-10-22_154358423.xml is ready for an export order!

[10/22/21 15:43:58]

[10/22/21 15:43:58] blobs processed: 10

[10/22/21 15:43:58] processing complete, export xml files generated successfully in exportxmlfiles/
Transcript stopped, output file is C:\Users\kylemoore\data-box-samples\multipleDataBoxExportScript\log.txt
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