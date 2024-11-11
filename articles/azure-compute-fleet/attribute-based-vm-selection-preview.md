---
title: Attribute based VM selection 
description: Learn about  attribute based VM selection accelerate to configure your VM requirements.
author: rajeeshr
ms.author: rajeeshr
ms.topic: overview
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/10/2024
ms.reviewer: jushiman
---

# What is Attribute based VM selection(ABS)? (Preview)

> [!IMPORTANT]
> Attribute based VM selection is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Attribute based VM selection is a new feature enabling you to configure your instance requirements as a set of VM attributes (e.g., memory, vCPU, and storage). These requirements are matched with all suitable Azure VM sizes, simplifying the creation and maintenance of VM configurations. This feature also allows you to seamlessly utilize newer VM generations as they become available and gain access to a wider range of capacity through Azure Spot Virtual Machines. The Compute Fleet service selects and launches VMs that match the specified attributes, eliminating the need to manually choose VM sizes.

Attribute-Based VM Selection is ideal for scenarios such as stateless web services, large-scale batch processing, big data clusters, or continuous integration pipelines. Workloads like financial risk modeling, log processing, and image rendering can take advantage of the ability to run hundreds of thousands of concurrent cores/instances. When leveraging Spot Virtual Machines, instead of specifying numerous VM sizes and types individually, a simple attribute configuration can now encompass all relevant options, including new ones as they are released.

# Benefits of attribute-based VM selection:

**Optimal Flexibility for Spot Virtual Machines**:  Compute Fleet offer optimal flexibility when deploying Spot Virtual Machines by selecting from a broad range of VM sizes. This aligns with best practices for Spot usage by ensuring flexibility in VM size selection, which improves the likelihood of Azure Spot Virtual Machines meeting and allocating the required compute capacity.

**Simplified VM Type Selection**: With the vast array of VM sizes available, finding the best match for your workload can be a complex task. By specifying VM attributes, Azure VM Scale Sets can automatically select the VM sizes that fulfill your workload’s requirements, simplifying the process and ensuring the right resources are chosen.

**Automatic Adoption of New VM Sizes**: Azure VM Scale Sets can automatically incorporate newer generation VM sizes as they become available. When these new VM sizes meet your specified requirements and align with your chosen allocation strategies, they are seamlessly used by your Scale Set, ensuring your deployment benefits from the latest advancements without manual updates.

# How Attribute-Based VM Selection Works

The process involves two main steps:

**VM Type Determination**: Attribute-Based Selection generates a list of VM types based on specified attributes, chosen Azure Regions, and Availability Zones.

**Allocation Strategy Application**: The Compute Fleet applies the selected allocation strategy to the generated list.

For Azure Spot Virtual Machines, Attribute-Based Selection supports both capacity-optimized and lowest-price allocation strategies. For Standard VMs, ABS supports the lowest-price allocation strategy. The Compute Fleet resolves attribute configurations into a list of suitable VM types and initially launches the lowest-priced VM to meet the On-Demand portion of the capacity request, proceeding to the next lowest-priced VM if necessary.

This feature enables more flexible VM type configurations, eliminating the need for extensive instance-type lists. This way, you can automatically leverage newer VM generations when they are introduced in your selected Region. Additionally, Attribute-Based VM Selection enhances the ability to access more capacity through Spot requests efficiently.
With Attribute-Based VM Selection, managing VM size configurations becomes easier and more scalable, ensuring that your workloads run smoothly with optimized cost and performance.


# List of VM attributes supported with examples 

	    /// <summary> 
        /// Required. 
        /// Must be specified if VMAttributes are specified. 
        /// The range of vCpuCount specified from min to max. 
        /// Either min(uint) or max(uint) is required if specified. 
        /// </summary> 
	
       ** vCpuCount** 

        Example: 
        "vCpuCount": { 
            "value": {  
		"min": 2, 
		"max": 24 
	    } 
        }    

        /// <summary> 
        /// Required. 
        /// Must be specified if VMAttributes are specified. 
        /// The range of memory in GiB specified from min to max. 
        /// Either min(double) or max(double) is required if specified. 
        /// </summary> 

     **   memoryInGiB **

        Example: 
        "memoryInGiB": { 
            "value": {  
		"min": 0, 
		"max": 1024 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// The range of memory in GiB per vCPU specified from min to max. 
        /// Either min(double) or max(double) is required if specified. 
        /// </summary> 

      **  memoryInGiBPerVCpu **
	
 	Example: 
        "memoryInGiBPerVCpu": { 
            "value": {  
		"min": 0, 
		"max": 8 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// Specifies whether the VMSize supporting local storage should be used to bui ld Fleet or not. 
        /// Possible values: 
        /// Excluded - Do not include VMSizes that support local storage. 
        /// Required - Only include VMSizes that support local storage. 
	/// Included - Default if not specified as most Azure VMs support local storage. 
        /// Includes VMSizes that support and do not support local storage. 
        /// </summary>
	
        **localStorageSupport** 
	
        Example: 
        "localStorageSupport": "Included" 

        /// <summary> 
        /// Optional. 
        /// The range of local storage in GiB specified from min to max. 
        /// Either min(double) or max(double) is required if specified. 
        /// localStorageSupport should be set to "Included" or "Required" to use this VMAttribute. 
        /// If localStorageSupport is "Excluded", this VMAttribute can not be used.
        /// </summary> 

        **localStorageInGiB** 

        Example: 
        "localStorageInGiB": { 
            "value": {  
		"min": 0, 
		"max": 100 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// The local storage disk types specified as a list. 
        /// Valid values are "SSD" and "HDD". 
        /// localStorageSupport should be set to "Included" or "Required" to use this VMAttribute. 
        /// If localStorageSupport is "Excluded", this VMAttribute can not be used. 
        /// Default local storage disk types if not specified are "ANY" of the valid values. 
        /// </summary> 

        **localStorageDiskTypes** 

        Example: 
        "localStorageDiskTypes": { 
            "value": [ 
		"SSD", 
		"HDD" 
	    ] 
        }   

        /// <summary> 
        /// Optional. 
        /// The range of data disk count specified from min to max. 
        /// Either min(uint) or max(uint) is required if specified. 
        /// </summary> 

        **dataDiskCount** 

        Example: 
        "dataDiskCount": { 
            "value": {  
		"min": 0, 
		"max": 10 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// The range of network interface count specified from min to max. 
        /// Either min(uint) or max(uint) is required if specified. 
        /// </summary> 

        **networkInterfaceCount** 

        Example: 
        "networkInterfaceCount": { 
            "value": {  
		"min": 0, 
		"max": 10 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// The range of network bandwidth in Mbps specified from min to max. 
        /// Either min(double) or max(double) is required if specified. 
        /// </summary> 

        **networkBandwidthInMbps** 

        Example: 
        "networkBandwidthInMbps": { 
            "value": {  
		"min": 0, 
		"max": 500 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// Specifies whether the VMSize supporting RDMA (Remote Direct Memory Access) should be used to build Fleet or not. 
        /// Possible values: 
        /// Excluded - Default if not specified. Do not include VMSizes that support RDMA. 
        /// Required - Only include VMSizes that support RDMA. 
        /// Included - Include VMSizes that support and do not support RDMA. 
        /// </summary> 

        **rdmaSupport** 
	
        Example: 
        "rdmaSupport": "Included" 

        /// <summary> 
        /// Optional. 
        /// The range of RDMA (Remote Direct Memory Access) network interface count specified from min to max. 
        /// Either min(uint) or max(uint) is required if specified. 
        /// rdmaSupport should be set to "Included" or "Required" to use this VMAttribute. 
        /// If rdmaSupport is "Excluded", this VMAttribute can not be used. 
        /// </summary> 

        **rdmaNetworkInterfaceCount** 

        Example: 
        "rdmaNetworkInterfaceCount": { 
            "value": {  
		"min": 0, 
		"max": 10 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// Specifies whether the VMSize supporting accelerator should be used to build Fleet or not. 
        /// Possible values: 
        /// Excluded - Default if not specified. Do not include VMSizes that support accelerator. 
        /// Required - Only include VMSizes that support accelerator. 
        /// Included - Include VMSizes that support and do not support accelerator. 
        /// </summary> 

        **acceleratorSupport** 

        Example: 
        "acceleratorSupport": "Required" 

        /// <summary> 
        /// Optional. 
        /// The accelerator manufacturers specified as a list. 
        /// Valid values are "AMD", "Nvidia", "Xilinx". 
        /// acceleratorSupport should be set to "Included" or "Required" to use this VMAttribute. 
        /// If acceleratorSupport is "Excluded", this VMAttribute can not be used. 
        /// Default acceleratorManufacturers if not specified are "ANY" of the valid values. 
        /// </summary> 

        **acceleratorManufacturers** 

        Example: 
        "acceleratorManufacturers": { 
            "value": { 
		"Nvidia", 
		"Xilinx" 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// The range of accelerator count specified from min to max. 
        /// Either min(uint) or max(uint) is required if specified. 
        /// acceleratorSupport should be set to "Included" or "Required" to use this VMAttribute. 
        /// If acceleratorSupport is "Excluded", this VMAttribute can not be used. 
        /// </summary> 

        **acceleratorCount** 

        Example: 
        "acceleratorCount": { 
            "value": {  
		"min": 0, 
		"max": 10 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// The accelerator types specified as a list. 
        /// Valid values are "GPU", "FPGA". 
        /// acceleratorSupport should be set to "Included" or "Required" to use this VMAttribute. 
        /// If acceleratorSupport is "Excluded", this VMAttribute can not be used. 
        /// Default accelelerator types if not specified are "ANY" of the valid values. 
        /// </summary> 
	
        **acceleratorTypes** 

        Example: 
        "acceleratorTypes": { 
            "value": { 
		"GPU", 
		"FPGA" 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// The VM categories specified as a list. 
        /// Valid values are: 
        /// "GeneralPurpose", "ComputeOptimized", "MemoryOptimized", "StorageOptimized", "GpuAccelerated", "FpgaAccelerated", "HighPerformanceCompute" 
        /// GeneralPurpose is the default VM category if not specified. 
        /// </summary> 

        **vmCategories** 

        Example: 
        "vmCategories": { 
            "value": { 
		"GeneralPurpose", 
		"ComputeOptimized" 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// The VM architecture types specified as a list. 
        /// Valid values are "X64", "ARM64". 
        /// Default architecture types if not specified are "ANY" of the valid values.
        /// </summary> 

       ** architectureTypes** 

        Example: 
        "architectureTypes": { 
            "value": { 
		"ARM64", 
		"x64" 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// The VM CPU manufacturers specified as a list. 
        /// Valid values are "Intel", "AMD", "Microsoft", "Ampere". 
        /// Default CPU manufacturers if not specified are "ANY" of the valid values. 
        /// </summary> 

        **cpuManufacturers** 

        Example: 
        "cpuManufacturers": { 
            "value": [ 
		"Microsoft", 
		"Intel" 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// Specifies whether the VMSize supporting burstable capability should be used to build Fleet or not. 
        /// Possible values: 
        /// Excluded - Default if not specified. Do not include VMSizes that have burstable capability. 
        /// Required - Only include VMSizes that have burstable capability. 
        /// Included - Include VMSizes that support and do not support burstable capability. 
        /// </summary> 

        **burstableSupport** 
	
        Example: 
        "burstableSupport": "Excluded" 

        /// <summary> 
        /// Optional. 
        /// Specifies which VMSizes should be excluded while building Fleet. 
        /// All excludedVMSizes will be ignored even if they match the VM attributes. 
        /// When excludedVMSizes VMAttribute is specified, VMSizesProfile can not be specified and vice-versa. 
        /// Limit is 100 VMSizes. 
        /// </summary> 

        **excludedVMSizes** 

        Example: 
        "excludedVMSizes": { 
            "value": { 
		"Standard_F1", 
		"Standard_F2" 
	    } 
        }   

        /// <summary> 
        /// Optional. 
        /// Specifies which VMSizes should be included while building Fleet. 
        /// All other VMSizes will be ignored even if they match the VM attributes. 
        /// When VMSizesProfile is specified with attributes, excludedVMSizes VMAttribute can not be specified and vice-versa. 
        /// Limit is 100 VMSizes. 
        /// </summary> 
	
        **VMSizesProfile** 

        Example: 
        "VMSizesProfile": { 
            "value": { 
		{"name": "Standard_F1"}, 
		{"name": "Standard_F2"} 
	    } 
        }   

# Learn more and get started
 
Sign up here: [Compute Fleet - Preview features Sign up](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbRyYHv8J_khRKqQeYhVEgwSVUMFU1V0M0WU9ZNlA3UFA1SzdIUVY0TEVYSS4u&origin=lprLink&route=shorturl)

After we receive your completed sign-up form, we will contact you with the next steps and onboarding details.

## Next steps
> [!div class="nextstepaction"]

