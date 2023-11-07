---
title: Azure Batch pool create event
description: Reference for the Batch pool create event, which is emitted once a pool has been created. The content of the log will expose general information about the pool.
ms.topic: reference
ms.date: 12/13/2020
---

# Pool create event

 This event is emitted once a pool has been created. The content of the log will expose general information about the pool. Note that if the target size of the pool is greater than 0 compute nodes, a pool resize start event will follow immediately after this event.

 The following example shows the body of a pool create event.

```json
{
    "id": "myPool1",
    "displayName": "Production Pool",
    "vmSize": "Standard_F1s",
    "imageType": "VirtualMachineConfiguration",
    "cloudServiceConfiguration": {
        "osFamily": "3",
        "targetOsVersion": "*"
    },
    "networkConfiguration": {
        "subnetId": " "
    },
    "virtualMachineConfiguration": {
          "imageReference": {
            "publisher": " ",
            "offer": " ",
            "sku": " ",
            "version": " "
          },
          "nodeAgentId": " "
    },
    "resizeTimeout": "300000",
    "targetDedicatedNodes": 2,
    "targetLowPriorityNodes": 2,
    "taskSlotsPerNode": 1,
    "vmFillType": "Spread",
    "enableAutoScale": false,
    "enableInterNodeCommunication": false,
    "isAutoPool": false
}
```

|Element|Type|Notes|
|-------------|----------|-----------|
|`id`|String|The ID of the pool.|
|`displayName`|String|The display name of the pool.|
|`vmSize`|String|The size of the virtual machines in the pool. All virtual machines in a pool are the same size. <br/><br/> For information about available sizes of virtual machines for Cloud Services pools (pools created with cloudServiceConfiguration), see [Sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md). Batch supports all Cloud Services VM sizes except `ExtraSmall`.<br/><br/> For information about available VM sizes for pools using images from the Virtual Machines Marketplace (pools created with virtualMachineConfiguration) see [Sizes for Virtual Machines](../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) (Linux) or [Sizes for Virtual Machines](../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) (Windows). Batch supports all Azure VM sizes except `STANDARD_A0` and those with premium storage (`STANDARD_GS`, `STANDARD_DS`, and `STANDARD_DSV2` series).|
|`imageType`|String|The deployment method for the image. Supported values are `virtualMachineConfiguration` or `cloudServiceConfiguration`|
|[`cloudServiceConfiguration`](#bk_csconf)|Complex Type|The cloud services configuration for the pool.|
|[`virtualMachineConfiguration`](#bk_vmconf)|Complex Type|The virtual machine configuration for the pool.|
|[`networkConfiguration`](#bk_netconf)|Complex Type|The network configuration for the pool.|
|`resizeTimeout`|Time|The timeout for allocation of compute nodes to the pool specified for the last resize operation on the pool.  (The initial sizing when the pool is created counts as a resize.)|
|`targetDedicatedNodes`|Int32|The number of dedicated compute nodes that are requested for the pool.|
|`targetLowPriorityNodes`|Int32|The number of [Azure Spot compute nodes](batch-spot-vms.md) that are requested for the pool.|
|`enableAutoScale`|Bool|Specifies whether the pool size automatically adjusts over time.|
|`enableInterNodeCommunication`|Bool|Specifies whether the pool is set up for direct communication between nodes.|
|`isAutoPool`|Bool|Specifies whether the pool was created via a job's AutoPool mechanism.|
|`taskSlotsPerNode`|Int32|The maximum number of tasks that can run concurrently on a single compute node in the pool.|
|`vmFillType`|String|Defines how the Batch service distributes tasks between compute nodes in the pool. Valid values are Spread or Pack.|

###  <a name="bk_csconf"></a> cloudServiceConfiguration

> [!WARNING]
> Cloud Services Configuration pools are [deprecated](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/). Please use Virtual Machine Configuration pools instead.

|Element name|Type|Notes|
|------------------|----------|-----------|
|`osFamily`|String|The Azure Guest OS family to be installed on the virtual machines in the pool.<br /><br /> Possible values are:<br /><br /> **2** – OS Family 2, equivalent to Windows Server 2008 R2 SP1.<br /><br /> **3** – OS Family 3, equivalent to Windows Server 2012.<br /><br /> **4** – OS Family 4, equivalent to Windows Server 2012 R2.<br /><br /> For more information, see [Azure Guest OS Releases](../cloud-services/cloud-services-guestos-update-matrix.md#releases).|
|`targetOSVersion`|String|The Azure Guest OS version to be installed on the virtual machines in the pool.<br /><br /> The default value is **\*** which specifies the latest operating system version for the specified family.<br /><br /> For other permitted values, see [Azure Guest OS Releases](../cloud-services/cloud-services-guestos-update-matrix.md#releases).|

###  <a name="bk_vmconf"></a> virtualMachineConfiguration

|Element name|Type|Notes|
|------------------|----------|-----------|
|[`imageReference`](#bk_imgref)|Complex Type|Specifies information about the platform or Marketplace image to use.|
|`nodeAgentId`|String|The SKU of the Batch node agent provisioned on the compute node.|
|[`windowsConfiguration`](#bk_winconf)|Complex Type|Specifies Windows operating system settings on the virtual machine. This property must not be specified if the imageReference is referencing a Linux OS image.|

###  <a name="bk_imgref"></a> imageReference

|Element name|Type|Notes|
|------------------|----------|-----------|
|`publisher`|String|The publisher of the image.|
|`offer`|String|The offer of the image.|
|`sku`|String|The SKU of the image.|
|`version`|String|The version of the image.|

###  <a name="bk_winconf"></a> windowsConfiguration

|Element name|Type|Notes|
|------------------|----------|-----------|
|`enableAutomaticUpdates`|Boolean|Indicates whether the virtual machine is enabled for automatic updates. If this property is not specified, the default value is true.|

###  <a name="bk_netconf"></a> networkConfiguration

|Element name|Type|Notes|
|------------------|--------------|----------|
|`subnetId`|String|Specifies the resource identifier of the subnet in which the pool's compute nodes are created.|