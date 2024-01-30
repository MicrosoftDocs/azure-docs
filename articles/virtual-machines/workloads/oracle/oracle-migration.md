---
title: Migrate Oracle workload to Azure VMs (IaaS)
description: Migrate Oracle workload to Azure VMs. 
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: virtual-machines
ms.subservice: oracle
ms.topic: article
ms.date: 06/03/2023
---
# Migrate Oracle workload to Azure VMs (IaaS) 

This article describes how to move your on-premises Oracle workload to the Azure VM infrastructure as a service (IaaS). It's based on several considerations and recommendations defined in the Azure [cloud adoption framework](/azure/cloud-adoption-framework/adopt/cloud-adoption).

First step in the migration journey starts with understanding the customer’s Oracle setup, identifying the right size of Azure VMs with optimized licensing & deployment of Oracle on Azure VMs. During migration of Oracle workloads to the Azure IaaS, the key thing is to know how well one can prepare their VM based architecture to deploy onto Azure following a clearly defined sequential process. Getting your complex Oracle setup onto Azure requires detailed understanding of each migration step and Azure Infrastructure as a Service offering. This article describes each of the nine migration steps.

## Migration steps

1. **Assess your Oracle workload using AWR Reports**: To move your Oracle workload onto Azure, carefully [analyze the actual database workloads of the customer by using AWR reports](https://github.com/Azure/Oracle-Workloads-for-Azure/tree/main/az-oracle-sizing) and determine the best VM size on Azure that meets the workload performance requirements.  The reader is cautioned not to take the hardware specifications of the existing, on-premises Oracle servers or appliances and map one-to-one to Azure VM specifications since most Oracle environments are heavily oversized both from a hardware and Oracle licensing perspective. 

   Take AWR reports from heavy usage time periods of the databases (such as peak hours, nightly backup and batch processing, or end of month processing, etc.). The AWR-based right sizing analysis takes all key performance indicators and provides a buffer for unexpected peaks during the calculation of required VM specifications.  

2. **Collect necessary AWR report data to calculate Azure VM Sizing:** From AWR report, fill in the key data required in ['Oracle_AWR_Erstimates.xltx'](https://techcommunity.microsoft.com/t5/data-architecture-blog/estimate-tool-for-sizing-oracle-workloads-to-azure-iaas-vms/ba-p/1427183) file as needed and determine suitable Azure VM and related workload (Memory).

3. **Arrive at best Azure VM size for migration:** The output of the [AWR based workload analysis](https://techcommunity.microsoft.com/t5/data-architecture-blog/using-oracle-awr-and-infra-info-to-give-customers-complete/ba-p/3361648) indicates the required amount of memory, number of virtual cores, number, size and type of disks, and number of network interfaces. However, it's still up to the user to decide on which Azure VM type to select among the [many that Azure offers](https://azure.microsoft.com/pricing/details/virtual-machines/series/) keeping future requirements also in consideration.

4. **Optimize Azure compute and choose deployment** **architecture:** Finalize the VM configuration that meets the requirements by optimizing compute and licenses, choose the right [deployment architecture](/azure/virtual-machines/workloads/oracle/oracle-reference-architecture) (HA, Backup, etc.).

5. **Tuning parameters of Oracle on Azure:** Ensure the VM selected, and deployment architecture meet the performance requirements. Two major factors are throughput & read/write IOPS– meet the requirements by choosing right [storage](oracle-storage.md) and [backup options](oracle-database-backup-strategies.md).

6. Move your **on-premises Oracle data to the Oracle on Azure VM:** Now that your required Oracle setup is done, pending task is to move data from on premise to cloud. There are many approaches. Best approaches are:

   - Azure databox: [Copy your on-premises](/training/modules/move-data-with-azure-data-box/3-how-azure-data-box-family-works) data and ship to Azure cloud securely. This suits high volume data scenarios. Data box [provides multiple options.](https://azure.microsoft.com/products/databox/data)
   - Data Factory [data pipeline to](../../../data-factory/connector-oracle.md?tabs=data-factory) move data from one premise to Oracle on Azure – heavily dependent on bandwidth.

   Depending on the size of your data, you can also select from the following available options. 

   - **Azure Data Box Disk**:

   Azure Data Box Disk is a powerful and flexible tool for businesses looking to transfer large amounts of data to Azure quickly and securely. 

   Learn more [Microsoft Azure Data Box Heavy overview | Microsoft Learn](/azure/databox/data-box-heavy-overview)

   - **Azure Data Box Heavy**: 

   Azure Data Box Heavy is a powerful and flexible tool for businesses looking to transfer massive amounts of data to Azure quickly and securely. 

   To learn more about data box, see [Microsoft Azure Data Box Heavy overview | Microsoft Learn](/azure/databox/data-box-heavy-overview)

7. **Load data received at cloud to Oracle on Azure VM:**

   Now that data is moved into data box, or data factory is pumping it to file system, in this step migrate this data to a newly set up Oracle on Azure VM using the following tools. 

   - RMAN - Recovery Manager
   - Oracle Data Guard 
   - Goldengate with Data Guard
   - Oracle Data Pump

8. **Measure performance of your Oracle on Azure VM:** Demonstrate the performance of the Oracle on Azure VM using:

   - IO Benchmarking – VM tooling (Monitoring – CPU cycles etc.)

   Use the following handy tools and approaches.

   - FIO – CPU Utilization/OS
   - SLOB – Oracle specific
   - Oracle Swingbench
   - AWR/statspack report (CPU, IO)

9. **Move your on-premises Oracle data to the Oracle on Azure VM**: Finally switch off your on-premises Oracle and switchover to Azure VM. Some checks to be in place are as follows:

   - If you have applications using the database, plan downtime. 

   - Use a change control management tool and consider checking in data changes, not just code changes, into the system. 

## Next steps

[Storage options for Oracle on Azure VMs](oracle-storage.md)
