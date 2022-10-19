---
title: Design and implement an Oracle database on Azure | Microsoft Docs
description: Design and implement an Oracle database in your Azure environment.
author: dbakevlar
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 10/15/2021
ms.author: kegorman
ms.reviewer: tigorman

---

# Design and implement an Oracle database in Azure

**Applies to:** :heavy_check_mark: Linux VMs 

Azure is home for all Oracle workloads, including those which need to continue to run optimally in Azure with Oracle. If you have the [Diagnostic Pack](https://www.oracle.com/technetwork/database/enterprise-edition/overview/diagnostic-pack-11g-datasheet-1-129197.pdf) or the [Automatic Workload Repository](https://docs.oracle.com/en-us/iaas/operations-insights/doc/analyze-automatic-workload-repository-awr-performance-data.html) you can use this data to assess the Oracle workload, size the resource needs, and migrate it to Azure. The various metrics provided by Oracle in these reports can provide a baseline understanding of application performance and platform utilization.

This article will help you to understand how to size out an Oracle workload to run in Azure and explore the best architecture solutions to provide the most optimal cloud performance. The data provided by Oracle in the Statspack and even more so in its descendent, the AWR, will assist you in developing clear expectations about the limits of physical tuning through architecture, the advantages of logical tuning of database code, and the overall database design.

## Differences between the two environments 

When you're migrating on-premises applications to Azure, keep in mind a few important differences between the two environments. 

One important difference is that in an Azure implementation, resources such as VMs, disks, and virtual networks are shared among other clients. In addition, resources can be throttled based on the requirements. Instead of focusing on avoiding failing (sometimes referred to as *mean time between failures*, or MTBF), Azure is more focused on surviving the failure (sometimes referred to as *mean time to recovery*, or MTTR).

The following table lists some of the differences between an on-premises implementation and an Azure implementation of an Oracle database.

|  | On-premises implementation | Azure implementation |
| --- | --- | --- |
| **Networking** |LAN/WAN  |SDN (software-defined networking)|
| **Security group** |IP/port restriction tools |[Network security group (NSG)](https://azure.microsoft.com/blog/network-security-groups) |
| **Resilience** |MTBF |MTTR |
| **Planned maintenance** |Patching/upgrades|[Availability sets](/previous-versions/azure/virtual-machines/windows/infrastructure-example) (patching/upgrades managed by Azure) |
| **Resource** |Dedicated  |Shared with other clients|
| **Regions** |Datacenters |[Region pairs](../../regions.md#region-pairs)|
| **Storage** |SAN/physical disks |[Azure-managed storage](https://azure.microsoft.com/pricing/details/managed-disks/?v=17.23h)|
| **Scale** |Vertical scale |Horizontal scale|

### Requirements

It's a good idea to consider the following requirements before you start your migration:

- Determine the real CPU usage. Oracle is licensed by core, which means that sizing the vCPU needs can be an essential exercise to help you reduce costs. 
- Determine the database size, backup storage, and growth rate.
- Determine the I/O requirements, which you can estimate based on Oracle Statspack and Automatic Workload Repository (AWR) reports. You can also estimate the requirements from storage monitoring tools available from the operating system.

## Configuration options

It's a good idea to generate an AWR report and obtain some metrics from it that help you make decisions about configuration. Then, there are four potential areas that you can tune to improve performance in an Azure environment:

- Virtual machine size
- Network throughput
- Disk types and configurations
- Disk cache settings

### Generate an AWR report

If you have an existing an Oracle Enterprise Edition database and are planning to migrate to Azure, you have several options. If you have the [Diagnostics Pack](https://www.oracle.com/technetwork/oem/pdf/511880.pdf) for your Oracle instances, you can run the Oracle AWR report to get the metrics (such as IOPS, Mbps, and GiBs). For those databases without the Diagnostics Pack license, or for an Oracle Standard Edition database, you can collect the same important metrics with a Statspack report after manual snapshots have been collected. The main differences between these two reporting methods are that AWR is automatically collected, and that it provides more information about the database than does Statspack.

You might consider running your AWR report during both regular and peak workloads, so you can compare. To collect the more accurate workload, consider an extended window report of one week, as opposed to one day. AWR does provide averages as part of its calculations in the report.

For a datacenter migration, it's a good idea to gather reports for sizing on the production systems. Estimate remaining database copies used for user testing, test, and development by percentages (for example, 50 percent of production sizing).

By default, the AWR repository retains 8 days of data and takes snapshots at hourly intervals. To run an AWR report from the command line, use the following command:

```bash
$ sqlplus / as sysdba
SQL> @$ORACLE_HOME/rdbms/admin/awrrpt.sql;
```

### Key metrics

The report prompts you for the following information:

- Report type: HTML or TEXT. The HTML type provides more information.
- The number of days of snapshots to display. For example, for one-hour intervals, a one-week report produces 168 snapshot IDs.
- The beginning `SnapshotID` for the report window.
- The ending `SnapshotID` for the report window.
- The name of the report to be created by the AWR script.

If you're running the AWR report on a Real Application Cluster (RAC), the command-line report is the *awrgrpt.sql* file, instead of *awrrpt.sql*. The `g` report creates a report for all nodes in the RAC database, in a single report. This report eliminates the need to run one report on each RAC node.

You can obtain the following metrics from the AWR report:

- Database name, instance name, and host name
- Database version (supportability by Oracle)
- CPU/Cores
- SGA/PGA (and advisors to let you know if undersized)
- Total memory in GB
- CPU percentage busy
- DB CPUs
- IOPs (read/write)
- MBPs (read/write)
- Network throughput
- Network latency rate (low/high)
- Top wait events 
- Parameter settings for database
- Is the database RAC, Exadata, or using advanced features or configurations

### Virtual machine size

Here are some steps you can take to configure virtual machine size for optimal performance.

#### Estimate VM size based on CPU, memory, and I/O usage from the AWR report

Look at the top five timed foreground events that indicate where the system bottlenecks are. For example, in the following diagram, the log file sync is at the top. It indicates the number of waits that are required before the log writer writes the log buffer to the redo log file. These results indicate that better performing storage or disks are required. In addition, the diagram also shows the number of CPU (cores) and the amount of memory.

![Screenshot that shows the log file sync at the top of the table.](./media/oracle-design/cpu_memory_info.png)

The following diagram shows the total I/O of read and write. There were 59 GB read and 247.3 GB written during the time of the report.

![Screenshot that shows the total I/O of read and write.](./media/oracle-design/io_info.png)

#### Choose a VM

Based on the information that you collected from the AWR report, the next step is to choose a VM of a similar size that meets your requirements. You can find a list of available VMs in [Memory optimized](../../sizes-memory.md).

#### Fine-tune the VM sizing with a similar VM series based on the ACU

After you've chosen the VM, pay attention to the Azure compute unit (ACU) for the VM. You might choose a different VM based on the ACU value that better suits your requirements. For more information, see [Azure compute unit](../../acu.md).

![Screenshot of the ACU units page.](./media/oracle-design/acu_units.png)

### Network throughput

The following diagram shows the relation between throughput and IOPS:

![Diagram that shows the relationship between throughput and IOPS.](./media/oracle-design/throughput.png)

The total network throughput is estimated based on the following information:

- SQL*Net traffic
- MBps x the number of servers (outbound stream, such as Oracle Data Guard)
- Other factors, such as application replication

![Screenshot of the SQL*Net throughput.](./media/oracle-design/sqlnet_info.png)

Based on your network bandwidth requirements, there are various gateway types for you to choose from. These include basic, VpnGw, and Azure ExpressRoute. For more information, see the [VPN gateway pricing page](https://azure.microsoft.com/pricing/details/vpn-gateway/?v=17.23h).

#### Recommendations

- Network latency is higher compared to an on-premises deployment. Reducing network round trips can greatly improve performance.
- To reduce round-trips, consolidate applications that have high transactions or “chatty” apps on the same virtual machine.
- Use virtual machines with [accelerated networking](../../../virtual-network/create-vm-accelerated-networking-cli.md) for better network performance.
- For certain Linux distributions, consider enabling [TRIM/UNMAP support](/previous-versions/azure/virtual-machines/linux/configure-lvm#trimunmap-support).
- Install [Oracle Enterprise Manager](https://www.oracle.com/technetwork/oem/enterprise-manager/overview/index.html) on a separate virtual machine.
- Huge pages are not enabled on Linux by default. Consider enabling huge pages, and set `use_large_pages = ONLY` on the Oracle DB. This might help increase performance. For more information, see [USE_LARGE_PAGES](https://docs.oracle.com/en/database/oracle/oracle-database/12.2/refrn/USE_LARGE_PAGES.html#GUID-1B0F4D27-8222-439E-A01D-E50758C88390).

### Disk types and configurations

Here are some tips for you as you consider disks.

- **Default OS disks:** These disk types offer persistent data and caching. They're optimized for operating system access at startup, and aren't designed for either transactional or data warehouse (analytical) workloads.

- **Managed disks:** Azure manages the storage accounts that you use for your VM disks. You specify the disk type (most often, this is premium SSD for Oracle workloads), and the size of the disk that you need. Azure creates and manages the disk for you. A premium SSD-managed disk is only available for memory-optimized and specifically designed VM series. After you choose a particular VM size, the menu shows only the available premium storage SKUs that are based on that VM size.

  ![Screenshot of the managed disk page.](./media/oracle-design/premium_disk01.png)

After you configure your storage on a VM, you might want to load test the disks before creating a database. Knowing the I/O rate in terms of both latency and throughput can help you determine if the VMs support the expected throughput with latency targets. There are a number of tools for application load testing, such as Oracle Orion, Sysbench, SLOB, and Fio.

Run the load test again after you've deployed an Oracle database. Start your regular and peak workloads, and the results show you the baseline of your environment. Be realistic in the workload test. It doesn't make sense to run a workload that is nothing like what you will run on the VM in reality.

Because Oracle can be an I/O intensive database, it's quite important to size the storage based on the IOPS rate rather than the storage size. For example, if the required IOPS is 5,000, but you only need 200 GB, you might still get the P30 class premium disk even though it comes with more than 200 GB of storage.

You can get the IOPS rate from the AWR report. It's determined by the redo log, physical reads, and writes rate. Always verify that the VM series you choose has the ability to handle the I/O demand of the workload, too. If the VM has a lower I/O limit than the storage, the limit maximum will be set by the VM.

![Screenshot of the AWR report page.](./media/oracle-design/awr_report.png)

For example, the redo size is 12,200,000 bytes per second, which is equal to 11.63 MBPs.
The IOPS is 12,200,000 / 2,358 = 5,174.

After you have a clear picture of the I/O requirements, you can choose a combination of drives that are best suited to meet those requirements.

#### Recommendations

- For data tablespace, spread the I/O workload across a number of disks by using managed storage or Oracle ASM.
- Use Oracle advanced compression to reduce I/O (for both data and indexes).
- Separate redo logs, temp, and undo tablespaces on separate data disks.
- Don't put any application files on default operating system disks. These disks aren't optimized for fast VM boot times, and they might not provide good performance for your application.
- When you're using M-Series VMs on premium storage, enable [write accelerator](../../how-to-enable-write-accelerator.md) on the redo logs disk.
- Consider moving redo logs with high latency to the ultra disk.

### Disk cache settings

Although you have three options for host caching, only read-only caching is recommended for a database workload on an Oracle database. Read/write can introduce significant vulnerabilities to a data file, because the goal of a database write is to record it to the data file, not to cache the information. With read-only, all requests are cached for future reads. All writes continue to be written to disk.

#### Recommendations

To maximize throughput, start with read-only for host caching whenever possible. For premium storage, keep in mind that you must disable the barriers when you mount the file system with the read-only options. Update the */etc/fstab* file with the universally unique identifier to the disks.

![Screenshot of the managed disk page that shows the read-only option.](./media/oracle-design/premium_disk02.png)

- For operating system disks, use premium SSD with read-write host caching.
- For data disks that contain the following, use premium SSD with read-only host caching: Oracle data files, temp files, control files, block change tracking files, BFILEs, files for external tables, and flashback logs.
- For data disks that contain Oracle online redo log files, use premium SSD or UltraDisk with no host caching (the **None** option). Oracle redo log files that are archived, and Oracle Recovery Manager backup sets, can also reside with the online redo log files. Note that host caching is limited to 4095 GiB, so don't allocate a premium SSD larger than P50 with host caching. If you need more than 4 TiB of storage, stripe several premium SSDs with RAID-0, using Linux LVM2 or by using Oracle Automatic Storage Management.

If workloads vary greatly between the day and evening, and the I/O workload can support it, P1-P20 premium SSD with bursting might provide the performance required during night-time batch loads or limited I/O demands.  

## Security

After you have set up and configured your Azure environment, you need to secure your network. Here are some recommendations:

- **NSG policy:** You can define your NSG by a subnet or a network interface card. It's simpler to control access at the subnet level, both for security and for force-routing application firewalls.

- **Jumpbox:** For more secure access, administrators shouldn't directly connect to the application service or database. Use a jumpbox between the administrator machine and Azure resources.
![Diagram that shows the jumpbox topology.](./media/oracle-design/jumpbox.png)

    The administrator machine should only offer IP-restricted access to the jumpbox. The jumpbox should have access to the application and database.

- **Private network (subnets):** It's a good idea to have the application service and database on separate subnets, so that NSG policy can set better control.


## Additional reading

- [Configure Oracle ASM](configure-oracle-asm.md)
- [Configure Oracle Data Guard](configure-oracle-dataguard.md)
- [Configure Oracle Golden Gate](configure-oracle-golden-gate.md)
- [Oracle backup and recovery](./oracle-overview.md)

## Next steps

- [Tutorial: Create highly available VMs](../../linux/create-cli-complete.md)
- [Explore VM deployment Azure CLI samples](https://github.com/Azure-Samples/azure-cli-samples/tree/master/virtual-machine)
