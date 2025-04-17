---
title: Attribute based virtual machine selection 
description: Learn about attribute based virtual machine (VM) selection to configure your VM requirements.
author: rrajeesh
ms.author: rajeeshr
ms.topic: concept-article
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/12/2024
ms.reviewer: jushiman
---

# Attribute based VM selection for Azure Compute Fleet (Preview)

> [!IMPORTANT]
> Attribute based VM selection is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

The attribute based virtual machine (VM) selection feature enables you to configure your instance requirements as a set of VM attributes, such as memory, vCPU, and storage. These requirements are matched with all suitable Azure VM sizes, simplifying the creation and maintenance of VM configurations. This feature also allows you to seamlessly utilize newer VM generations as they become available. You also gain access to a wider range of capacity through Azure Spot Virtual Machines. The Compute Fleet service selects and launches VMs that match the specified attributes, eliminating the need to manually choose VM sizes.

:::image type="content" source="./media/vm-attribute/attribute-based-vm-selection-diagram.png" lightbox="./media/vm-attribute/attribute-based-vm-selection-diagram.png" alt-text="Screenshot that shows the flow diagram for Attribute Based VM Selection.":::

Attribute based VM selection is ideal for scenarios such as stateless web services, large-scale batch processing, big data clusters, or continuous integration pipelines. Workloads like financial risk modeling, log processing, and image rendering can take advantage of the ability to run hundreds of thousands of concurrent cores or instances. When leveraging Spot Virtual Machines, instead of specifying numerous VM sizes and types individually, a simple attribute configuration can now encompass all relevant options, including new ones as they are released.

## Prerequisites
 
To use attribute based VM selection, you must [sign-up for Azure Compute Fleet preview features](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbRyYHv8J_khRKqQeYhVEgwSVUMFU1V0M0WU9ZNlA3UFA1SzdIUVY0TEVYSS4u&origin=lprLink&route=shorturl). After you complete the sign-up form and are approved, you will be contacted with next steps and onboarding details. 

## Benefits

- **Optimal flexibility for Spot VMs**: Compute Fleet offer optimal flexibility when deploying Spot Virtual Machines by selecting from a broad range of VM sizes. This process aligns with best practices for Spot usage by ensuring flexibility in VM size selection, which improves the likelihood of Azure Spot VMs meeting and allocating the required compute capacity.
- **Simplified VM type selection**: With the vast array of VM sizes available, finding the best match for your workload can be a complex task. By specifying VM attributes, Azure Virtual Machine Scale Sets can automatically select the VM sizes that fulfill your workload’s requirements. This automation simplifies the process and ensures the right resources are chosen.
- **Automatic adoption of new VM sizes**: Azure Virtual Machine Scale Sets can automatically incorporate newer generation VM sizes as they become available. When these new VM sizes meet your specified requirements and align with your chosen allocation strategies, they are seamlessly used by your scale set, ensuring your deployment benefits from the latest advancements without manual updates.

## Process

How does attribute based VM selection work? The process involves two main steps: *VM type determination*, followed by *allocation strategy application*. 

- **VM type determination**: Attribute based selection generates a list of VM types based on specified attributes, chosen Azure regions, and Availability Zones.
- **Allocation strategy application**: The Compute Fleet applies the selected allocation strategy to the generated list of VMs.

For Azure Spot VMs, attribute based selection supports both capacity-optimized and lowest-price allocation strategies. For Standard VMs, attribute based selection supports the lowest-price allocation strategy. The Compute Fleet resolves attribute configurations into a list of suitable VM types and initially launches the lowest-priced VM to meet the On-Demand portion of the capacity request, proceeding to the next lowest-priced VM if necessary.

The attribute based selection feature enables more flexible VM type configurations, eliminating the need for extensive instance-type lists. This way, you automatically leverage newer VM generations when they are introduced in your selected Azure region. Additionally, attribute based selection enhances the ability to access more capacity through Spot requests efficiently.

With attribute based selection, managing VM size configurations becomes easier and more scalable, ensuring that your workloads run smoothly with optimized cost and performance.

## Supported VM attributes

The following list of VM attributes are supported and provide examples of configurations. 

### vCpuCount

- Required
- Must be specified if `VMAttributes` are specified
- The range of `vCpuCount` specified from min to max
- Either `min(uint)` or `max(uint)` is required if specified

```JSON
"vCpuCount": {
	"value": {
		"min": 2, 
		"max": 24
	}
}
```

### memoryInGiB
  
- Required
- Must be specified if `VMAttributes` are specified
- The range of `memoryInGiB` specified from min to max
- Either `min(double)` or `max(double)` is required if specified

```JSON
"memoryInGiB": { 
	"value": {  
		"min": 0,
		"max": 1024
	}
}
```

### memoryInGiBPerVCpu

- Optional
- The range of `memoryInGiBPerVCpu` specified from min to max
- Either `min(double)` or `max(double)` is required if specified

```JSON
"memoryInGiBPerVCpu": { 
	"value": {  
		"min": 0,
		"max": 8 
	} 
}
```

### localStorageSupport

- Optional
- Specifies whether the VM size supporting local storage should be used to build a Compute Fleet or not
- Possible values:
	- *Excluded* - Don't include VM sizes that support local storage
 	- *Required* - Only include VM sizes that support local storage
  	- *Included* - Include VM sizes that support and don't support local storage, is the default if `localStorageSupport` isn't specified
	
```JSON
"localStorageSupport": "Included"
```

### localStorageInGiB

- Optional
- The range of `localStorageInGiB` specified from min to max
- Either `min(double)` or `max(double)` is required if specified
- `localStorageSupport` should be set to *Included* or *Required* to use this VM attribute
- If `localStorageSupport` is set to *Excluded*, this VM attribute can't be used

```JSON
"localStorageInGiB": { 
	"value": {  
		"min": 0,
		"max": 100 
	}
}
```

### localStorageDiskTypes

- Optional
- The `localStorageDiskTypes` is specified as a list
- Valid values are *SSD* and *HDD* 
- `localStorageSupport` should be set to *Included* or *Required* to use this VM attribute
- If `localStorageSupport` is set to *Excluded*, this VM attribute can't be used
- The default for `localStorageDiskTypes`, if not specified, is *ANY* of the valid values 

```JSON
"localStorageDiskTypes": { 
	"value": [ 
		"SSD", 
		"HDD" 
	] 
}
```
	
### dataDiskCount

- Optional
- The range of `dataDiskCount` specified from `min` to `max`
- Either `min(uint)` or `max(uint)` is required if specified

```JSON
"dataDiskCount": { 
	"value": {  
		"min": 0, 
		"max": 10 
	} 
}
``` 

### networkInterfaceCount

- Optional
- The range of `networkInterfaceCount` specified from `min` to `max` 
- Either `min(uint)` or `max(uint)` is required if specified

```JSON
"networkInterfaceCount": { 
	"value": {  
		"min": 0, 
		"max": 10 
	} 
}
```   

### networkBandwidthInMbps

- Optional
- The range of `networkBandwidthInMbps` specified from `min` to `max` 
- Either `min(double)` or `max(double)` is required if specified

```JSON
"networkBandwidthInMbps": { 
	"value": {  
		"min": 0, 
		"max": 500 
	} 
}
```   

### rdmaSupport

- Optional
- Specifies whether the VM size supporting Remote Direct Memory Access (RDMA) should be used to build the Compute Fleet or not
- Possible values:
	- *Excluded* - Don't include VM sizes that support RDMA, is the default if `rdmaSupport` isn't specified 
 	- *Required* - Only include VM sizes that support RDMA
  	- *Included* - Include VM sizes that support and don't support RDMA

```JSON
"rdmaSupport": "Included"
```

### rdmaNetworkInterfaceCount

- Optional
- The range of `rdmaNetworkInterfaceCount` specified from `min` to `max`
- Either `min(uint)` or `max(uint)` is required if specified
- `rdmaSupport` should be set to *Included* or *Required* to use this VM attribute
- If `rdmaSupport` is set to *Excluded*, this VM attribute can't be used

```JSON
"rdmaNetworkInterfaceCount": { 
	"value": {  
		"min": 0, 
		"max": 10 
	} 
}
```   

### acceleratorSupport

- Optional
- Specifies whether the VM size supporting accelerator should be used to build a Compute Fleet or not
- Possible values:
	- *Excluded* - Don't include VM sizes that support accelerator, is the default if `acceleratorSupport` isn't specified 
 	- *Required* - Only include VM sizes that support accelerator
  	- *Included* - Include VM sizes that support and don't support accelerator

```JSON
"acceleratorSupport": "Required"
```

### acceleratorManufacturers

- Optional
- The `acceleratorManufacturers` is specified as a list
- Valid values are *AMD*, *NVIDIA*, and *Xilinx*
- `acceleratorSupport` should be set to *Included* or *Required* to use this VM attribute
- If `acceleratorSupport` is set to *Excluded*, this VM attribute can't be used
- The default for `acceleratorManufacturers`, if not specified, is *ANY* of the valid values

```JSON
"acceleratorManufacturers": { 
	"value": { 
		"Nvidia", 
		"Xilinx" 
	} 
}
```   

### acceleratorCount

- Optional
- The range of `acceleratorCount` is specified from `min` to `max` 
- Either `min(uint)` or `max(uint)` is required if specified
- `acceleratorSupport` should be set to *Included* or *Required* to use this VM attribute
- If `acceleratorSupport` is set to *Excluded*, this VM attribute can't be used

```JSON
"acceleratorCount": { 
	"value": {  
		"min": 0, 
		"max": 10 
	} 
}
```  

### acceleratorTypes

- Optional
- The `acceleratorTypes` is specified as a list
- Valid values are *GPU* and *FPGA*
- `acceleratorSupport` should be set to *Included* or *Required* to use this VM attribute
- If `acceleratorSupport` is set to *Excluded*, this VM attribute can't be used
- The default for `acceleratorTypes`, if not specified, is *ANY* of the valid values

```JSON
"acceleratorTypes": { 
	"value": { 
		"GPU", 
		"FPGA" 
	} 
}
```

### vmCategories

- Optional
- `vmCategories` is specified as a list
- Valid values are: 
	- *GeneralPurpose*
 	- *ComputeOptimized*
	- *MemoryOptimized*
 	- *StorageOptimized*
 	- *GpuAccelerated*
 	- *FpgaAccelerated*
 	- *HighPerformanceCompute*
 - The default for `vmCategories`, if not specified, is *GeneralPurpose*

```JSON
"vmCategories": { 
	"value": { 
		"GeneralPurpose", 
		"ComputeOptimized" 
	}
}
```   

### architectureTypes

- Optional
- `architectureTypes` is specified as a list
- Valid values are *X64* and *Arm64* 
- The default for `architectureTypes`, if not specified, is "ANY" of the valid values

```JSON
"architectureTypes": { 
	"value": { 
		"Arm64", 
		"x64" 
	} 
}
```   

### cpuManufacturers

- Optional
- `cpuManufacturers` is specified as a list
- Valid values are *Intel*, *AMD*, *Microsoft*, and *Ampere* 
- The default for `cpuManufacturers`, if not specified, is "ANY" of the valid values

```JSON
"cpuManufacturers": { 
	"value": { 
		"Microsoft", 
		"Intel" 
	} 
}
```   

### burstableSupport

- Optional
- Specifies whether the VM size supporting burstable capability should be used to build a Compute Fleet or not
- Possible values:
	- *Excluded* - Don't include VM sizes that have burstable capability, is the default if `acceleratorSupport` isn't specified 
 	- *Required* - Only include VM sizes that have burstable capability
  	- *Included* - Include VM sizes that support and don't support burstable capability

```JSON
"burstableSupport": "Excluded"
```

### excludedVMSizes

- Optional
- Specifies which VM sizes should be excluded while building a Compute Fleet 
- All `excludedVMSizes` will be ignored, even if they match the VM attributes
- When `excludedVMSizes` VM attribute is specified, `VMSizesProfile` can't be specified and vice-versa 
- Limit is 100 VM sizes

```JSON
"excludedVMSizes": { 
	"value": { 
		"Standard_F1", 
		"Standard_F2" 
	} 
}
```

### VMSizesProfile

- Optional
- Specifies which VM sizes should be excluded while building a Compute Fleet
- All other VM sizes will be ignored, even if they match the VM attributes
- When `VMSizesProfile` is specified, `excludedVMSizes` can't be specified and vice-versa 
- Limit is 100 VM sizes

```JSON
"VMSizesProfile": { 
	"value": { 
		{"name": "Standard_F1"}, 
		{"name": "Standard_F2"} 
	} 
}
```   

## Next steps

> [!div class="nextstepaction"]
> [Find answers to frequently asked questions.](faq.yml)
