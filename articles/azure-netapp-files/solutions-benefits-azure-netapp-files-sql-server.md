---
title: enefits of using Azure NetApp Files with SQL Server Deployment | Microsoft Docs
description: Explains the solution Azure NetApp Files provides for SQL Server deployment. 
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/08/20201
ms.author: b-juche
---
# Benefits of using Azure NetApp Files with SQL Server Deployment

Azure NetApp Files reduces SQL Server total cost of ownership up to 3X as compared to block storage solutions.  Whereas with block storage, virtual machines have imposed limits on I/O and bandwidth for disk operations, network bandwidth limits alone are applied against Azure NetApp Files, and on egress only at that.  In other words, no VM level I/O limits are applied to Azure NetApp Files. Without these I/O limits, SQL Server running on smaller virtual machines connected to ANF can perform as well as SQL Server running on much larger virtual machines. Sizing instances down as such reduces the compute cost to ¼ of the former price tag.  Drive down compute costs as much as 4X with Azure NetApp Files.  

Compute costs however are small compared to SQL Server license costs.  Being tied to physical core count as Microsoft SQL Server licensing is, decreasing instance size introduces an even larger monetary saving in terms of software licensing.  Drive down software license costs as much as 4X with Azure NetApp Files.  

The cost of the storage itself is variable depending on the actual size of the database – and this is true regardless of the storage selected, capacity has cost, be it managed disk or file share.  As database sizes increase and the storage increases in cost, the overall part storage contributes to the TCO increases affecting overall cost.  As such, the assertion is adjusted to – Drive down SQL Server deployment costs 3X with Azure NetApp Files. 

Read on to get a detailed cost analysis and then continue onward to see performance, performance, and more performance.  See the evidence for yourself that not only do smaller instances have sufficient CPU to do the database work only possible with block on larger instances – AND in many cases the smaller instances are EVEN MORE performant than their larger – disk-based – counterparts all in thanks to Azure NetApp Files.  

## A Detailed Cost Analysis  

By way of TCO example the two sets of graphics are shown below.  The number of and type of managed disks as well as the Azure NetApp Files service level and capacity shown for each scenario below have been selected based on achieving the best price-capacity-performance.  Each graphic is made up of grouped machines (D16 with Azure NetApp Files compared to D64 with managed disk by example) and prices are broken down for each machine type.  
The first graphic shows the overall cost of the solution using a 1TiB database size, comparing the D16s_v3 to the D64, the D8 to the D32, and the D4 to the D16. The projected IOPs for each configuration are indicated by a green or yellow line and corresponds to the right-hand side Y axis.
 
This second graphic shows the overall cost using a 50TiB database, otherwise the comparisons are the same – D16 compared with Azure NetApp Files versus D64 with block by example. 

 
## Performance, and Lots of It

To deliver on the 3X cost reduction assertion requires performance, and lots of it - the largest instances in the general Azure inventory support 80,000 disk IOPS by way of example.   The bar is set, and the gauntlet thrown down – prove a single Azure NetApp Files volume capable of achieving 80,000 database IOPS and instances such as the D16 able consume the same. Why the D16 instance size by the way?  Because the D16, normally capable of 25,600 disk IOPS, is ¼ the size of the D64.  Why the D64?  Because the D64s_v3 is capable of 80,000 disk IOPS and as such presents an excellent upper level comparison point.
Can the D16s_v3 drive an Azure NetApp Files volume to 80,000 database IOPS?  A resounding yes, and then some.  As proven by the SQL Storage Benchmark 3SB (SSB) benchmarking tool (scan to the end of this blog for information on the testing tool), the D16 instance achieved a workload 125% greater than that achievable to disk from the D64 instance. 
Using a 1TiB working set size and an 80% read 20% update SQL Server workload, performance capabilities of most the instances in the D instance class were measured; most, not all as the D2 and D64 instances themselves were excluded from testing. The former left out as it does not support accelerated networking and the latter because it is the comparison point itself.   See the graph below to understand the limits of  D4s_v3, D8s_v3, D16s_v3 and the D32s_v3 respectively.  Managed disk storage tests are not shown below, comparison values are drawn directly from the Azure Virtual Machine limits table for the D class instance type.
The results as shown below, prove that with Azure NetApp Files each of the instances in the D class can meet or exceed the disk performance capabilities of instances two times larger.  Drive down software license costs as much as 4X with Azure NetApp Files.  

* The D4 at 75% CPU utilization matched the disk capabilities of the D16.  
    * The D16 is rate limited at 25,600 disk IOPS.  
* The D8 at 75% CPU utilization matched the disk capabilities of the D32.  
    * The D32 is rate limited at 51,200 disk IOPS.  
* The D16 at 55% CPU utilization matched the disk capabilities of the D64.  
    * The D64 is rate limited at 80,000 disk IOPS.  
* The D32 at 15% CPU utilization matched the disk capabilities of the D64 as well.  
    * The D64 as stated above is rate limited at 80,000 disk IOPS.  
S3B CPU Limits Test – Performance Versus Processing Power
 
Scalability is only part of the story, the other being latency.  It’s one thing for smaller virtual machines to have the ability to drive much higher I/O rates, it’s another thing altogether to do so with low single digit latencies as shown below.  
* The D4 drove 26,000 IOPS against Azure NetApp Files at 2.3ms latency  
* The D8 drove 51,000 IOPS against Azure NetApp Files at 2.0 ms latency  
* The D16 drove 88,000 IOPS against Azure NetApp Files at 2.8ms latency
    * The D32 drove 80,000 IOPS against Azure NetApp Files at 2.4ms latency.  
S3B Per Instance Type Latency Results
 
Introducing SSB – a detailed testing tool description
Having found over the years that the TPC-E benchmarking tool, by design, stresses compute rather than storage, the test results shown below are based on a not yet released to community stress testing tool named SQL Storage Benchmark (SSB).  The SQL Server Storage Benchmark can drive massive-scale SQL execution against a SQL Server database to simulate an OLTP workload – similar in fashion to the SLOB2 Oracle benchmarking tool.   
The SSB tool generates a SELECT and UPDATE driven workload issuing said statements directly to the SQL Server database running within the Azure virtual machine.  For this project, the 3SSB workloads ramped from 1 to 100 SQL Server users, with 10 or 12 intermediate points at 15 minutes per user count.  All performance metrics from these runs were from the point of view of perfmon, for the purpose of repeatability SSB ran three times per scenario. 

The tests themselves were run configured as 80% SELECT and 20% UPDATE statement, thus 90% random read.  The database itself – which SSB created – was 1000GB in size, comprised of 15 user tables and 9,000,000 rows per user table and 8192 bytes per row. 
The SSB benchmark is an open-source tool and as such is freely available at the following github link, 

## In Summary  

Increase SQL server performance while Reducing your Total Cost of Ownership up to 3X with Azure NetApp Files.   

