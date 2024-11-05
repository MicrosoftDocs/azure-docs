---
title: Review Azure VM assessment
description: Describes the properties of an Azure VM assessment in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 11/05/2024
---

# Review Azure VM assessment 

Once you have created the Azure VM assessment, the assessment will be ready for your review at Decide and plan > Assessments > Workloads.  

If it is a performance-based assessment with servers discovered using appliance you can review the confidence rating of the assessment before you look at the report. The confidence rating is an indicator of the quality of the data that was available for creating assessments. Please refer to confidence ratings.  

On the overview page you can review the overall readiness and estimated monthly cost of hosting the VMs on Azure after migration using lift and shift method. 
A screenshot of a computer

Description automatically generated  
To review the assessment report for each on-premises VM click on Servers to Azure VM (Lift and shift). You can search for the desired on-premises server and click on it to review the assessment result. For each on-premises server, you can review the readiness, source properties that were used to identify the desired targets and Target recommendations.  
 
Azure Readiness 
For each source server you can review the Azure readiness. Azure readiness is defined as the compatibility of the on-premises server with the Azure target. The readiness for Azure VM depends on the Operating system, Boot type, OS disk size, storage, compute and security requirements. Each on-premises server is divided in the following categories: 

Ready for Azure: The workloads can be migrated as-is to Azure without any changes. It will start in Azure with full Azure support. 

Conditionally ready for Azure: The workloads might start in Azure but might not have full Azure support. For example, Azure doesn't support a server that's running an old version of Windows Server. You must be careful before you migrate these servers to Azure. To fix any readiness problems, follow the remediation guidance the assessment suggests. 

Not ready for Azure: The server won't start in Azure. For example, if an on-premises server's disk stores more than 64 TB, Azure can't host the server. Follow the remediation guidance to fix the problem before migration. 

Readiness unknown: Azure Migrate can't determine the readiness of the server because of insufficient metadata. 

 
A screenshot of a computer

Description automatically generated 
 

Right-sized recommendations 

After the server is marked as ready for Azure, the assessment makes sizing recommendations in the assessment. These recommendations identify the target for the on-premises workloads being assessed. Sizing calculations depend on whether you're using as-is on-premises sizing or performance-based sizing. 

Assessment type 

Data 

Performance-based 

The compute recommendation is based on CPU and memory utilization data. 
 
The storage recommendation is based on the input/output operations per second (IOPS) and throughput of the on-premises disks. Disk types are Azure Standard HDD, Azure Standard SSD, Azure Premium disks, and Azure Ultra disks. 

As-is on-premises 

The compute recommendation is based on the on-premises server size. 
 
The recommended storage is based on the selected storage type for the assessment. 

 

You can review the source properties that were used for right-sizing the targets. For each on-premises workload the configuration properties and the aggregated performance data are available. Review the allocated cores , allocated memory and CPU utilization and memory utilization for compute right-sizing and disk size, read IO/s and throughput for storage recommendations.  
 

On the Target recommendations page, you can review the target configuration and the recommendation reasoning for each target component like compute, storage, network etc.  
A screenshot of a computer

Description automatically generated 

Calculate sizing (as-is on-premises) 

If you use as-is on-premises sizing, the assessment doesn't consider the performance history of the VMs and disks in the Azure VM assessment. 

Compute sizing: The assessment allocates an Azure VM SKU based on the size allocated on-premises. 

Storage and disk sizing: The assessment looks at the storage type specified in assessment properties and recommends the appropriate disk type. Possible storage types are Standard HDD, Standard SSD, Premium, and Ultra disk.  

Network sizing: The assessment considers the network adapter on the on-premises server. 

Calculate sizing (performance-based) 

If you use performance-based sizing in an Azure VM assessment, the assessment makes sizing recommendations as follows: 

The assessment considers the performance (resource utilization) history of the server along with the processor benchmark to identify the VM size and disk type in Azure. 

 Note 

If you import servers by using a CSV file, the performance values you specify (CPU utilization, Memory utilization, Disk IOPS and throughput) are used if you choose performance-based sizing. You will not be able to provide performance history and percentile information. 

This method is especially helpful if you've overallocated the on-premises server, utilization is low, and you want to right-size the Azure VM to save costs. 

If you don't want to use the performance data, reset the sizing criteria to as-is on-premises, as described in the previous section. 

Storage sizing calculations 

For storage sizing in an Azure VM assessment, Azure Migrate tries to map each disk that is attached to the server to an Azure disk. Sizing works as follows: 

Assessment adds the read and write IOPS of a disk to get the total IOPS required. Similarly, it adds the read and write throughput values to get the total throughput of each disk. In the case of import-based assessments, you have the option to provide the total IOPS, total throughput and total no. of disks in the imported file without specifying individual disk settings. If you do this, individual disk sizing is skipped and the supplied data is used directly to compute sizing, and select an appropriate VM SKU. 

Disks are selected as follows: 

If assessment can't find a disk with the required IOPS and throughput, it marks the server as unsuitable for Azure. 

If assessment finds a set of suitable disks, it selects the disks that support the location specified in the assessment settings. 

If there are multiple eligible disks, assessment selects the disk with the lowest cost. 

If performance data for any disk is unavailable, the configuration disk size is used to find a Standard SSD disk in Azure. 

For Ultra disks, there is a range of IOPS and throughput that is allowed for a particular disk size, and thus the logic used in sizing is different from Standard and Premium disks: 

Three Ultra disk sizes are calculated: 

One disk (Disk 1) is found that can satisfy the disk size requirement 

One disk (Disk 2) is found that can satisfy total IOPS requirement. IOPS to be provisioned = (source disk throughput) *1024/256 

One disk (Disk 3) is found that can satisfy total throughput requirement 

Out of the three disks, one with the max disk size is found and is rounded up to the next available Ultra disk offering. This is the provisioned Ultra disk size. 

Provisioned IOPS is calculated using the following logic: 

If source throughput discovered is in the allowable range for the Ultra disk size, provisioned IOPS is equal to source disk IOPS 

Else, provisioned IOPS is calculated using IOPS to be provisioned = (source disk throughput) *1024/256 

Provisioned throughput range is dependent on provisioned IOPS 

Network sizing 

For an Azure VM assessment, assessment tries to find an Azure VM that supports the number and required performance of network adapters attached to the on-premises server. 

To get the effective network performance of the on-premises server, assessment aggregates the data transmission rate out of the server (network out) across all network adapters. It then applies the comfort factor. It uses the resulting value to find an Azure VM that can support the required network performance. 

Along with network performance, assessment also considers whether the Azure VM can support the required number of network adapters. 

If network performance data is unavailable, assessment considers only the network adapter count for VM sizing. 

Compute-sizing 

After it calculates storage and network requirements, the assessment considers CPU and RAM requirements to find a suitable VM size in Azure. 

Azure Migrate looks at the effective utilized cores (including processor benchmark) and RAM to find a suitable Azure VM size. 

If no suitable size is found, the server is marked as unsuitable for Azure. 

If a suitable size is found, Azure Migrate applies the storage and networking calculations. It then applies location and pricing-tier settings for the final VM size recommendation. 

If there are multiple eligible Azure VM sizes, the one with the lowest cost is recommended. 

After sizing recommendations are done, an Azure VM assessment in Azure Migrate calculates compute and storage costs for after migration. 

Compute cost 

Azure Migrate uses the recommended Azure VM size and the Azure Billing API to calculate the monthly cost for the server. 

The calculation takes into account the: 

Operating system 

Software assurance 

Reserved instances 

VM uptime 

Location 

Currency settings 

The assessment aggregates the cost across all servers to calculate the total monthly compute cost. 

Storage cost 

The monthly storage cost for a server is calculated by aggregating the monthly cost of all disks that are attached to the server. 

Standard and Premium disk 

The cost for Standard or Premium disks is calculated based on the selected/recommended disk size. 

Ultra disk 

The cost for Ultra disk is calculated based on the provisioned size, provisioned IOPS and provisioned throughput. Learn more 

Cost is calculated using the following logic: 

Cost of disk size is calculated by multiplying provisioned disk size by hourly price of disk capacity 

Cost of provisioned IOPS is calculated by multiplying provisioned IOPS by hourly provisioned IOPS price 

Cost of provisioned throughput is calculated by multiplying provisioned throughput by hourly provisioned throughput price 

The Ultra disk VM reservation fee is not added in the total cost. Learn More 

Assessment calculates the total monthly storage costs by aggregating the storage costs of all servers. Currently, the calculation doesn't consider offers specified in the assessment settings. 

Security cost 

For servers recommended for Azure VM, if they're ready to run Defender for Server, the Defender for Server cost (Plan 2) per server for that region is added. The assessment aggregates the cost across all servers to calculate the total monthly security cost. 

Costs are displayed in the currency specified in the assessment settings. 

For each on-premises server you can review if there are any data collection issues that might result in a low confidence score of the overall assessment.  