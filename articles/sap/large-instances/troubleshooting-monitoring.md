---
title: Monitoring SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Learn about monitoring SAP HANA on an Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: lauradolan
manager: bburns
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 10/19/2022
ms.author: ladolan
ms.custom: H1Hack27Feb2017, contperf-fy21q4
---

# Monitor SAP HANA (Large instances) on Azure

In this article, we'll look at monitoring SAP HANA Large Instances on Azure (otherwise known as BareMetal Infrastructure).

SAP HANA on Azure (Large Instances) is no different from any other IaaS deployment. Monitoring the operating system and application is important. You'll want to know how the applications consume the following resources:

- CPU
- Memory
- Network bandwidth
- Disk space

Monitor your SAP HANA Large Instances to see whether the above resources are sufficient or whether they're being depleted. The following sections give more detail on each of these resources.

## CPU resource consumption

SAP defines a maximum threshold of CPU use for the SAP HANA workload. Staying within this threshold ensures you have enough CPU resources to work through the data stored in memory. High CPU consumption can happen when SAP HANA services execute queries because of missing indexes or similar issues. So monitoring CPU consumption of the HANA Large Instance and CPU consumption of specific HANA services is critical.

## Memory consumption 

It's important to monitor memory consumption both within HANA and outside of HANA on the SAP HANA Large Instance. Monitor how the data is consuming HANA-allocated memory so you can stay within the sizing guidelines of SAP. Monitor memory consumption on the Large Instance to make sure non-HANA software doesn't consume too much memory. You don't want non-HANA software competing with HANA for memory.

## Network bandwidth 

The bandwidth of the Azure Virtual Network (VNet) gateway is limited. Only so much data can move into the Azure VNet. Monitor the data received by all Azure VMs within a VNet. This way you'll know when you're nearing the limits of the Azure gateway SKU you selected. It also makes sense to monitor incoming and outgoing network traffic on the HANA Large Instance to track the volumes handled over time.

## Disk space

Disk space consumption usually increases over time. Common causes include:
- Data volume increases over time
- Execution of transaction log backups
- Storing trace files
- Taking storage snapshots 

So it's important to monitor disk space usage and manage the disk space associated with the HANA Large Instance.

## Preloaded system diagnostic tools

For the **Type II SKUs** of the HANA Large Instances, the server comes with the preloaded system diagnostic tools. You can use these diagnostic tools to do the system health check.
 
Run the following command to generate the health check log file at /var/log/health_check.

```
/opt/sgi/health_check/microsoft_tdi.sh
```
When you work with the Microsoft Support team to troubleshoot an issue, you may be asked to provide the log files by using these diagnostic tools. You can zip the file using this command:

```
tar  -czvf health_check_logs.tar.gz /var/log/health_check
```

## Azure Monitor for SAP solutions

You can use Azure Monitor for SAP solutions to monitor all of the resources listed above and more. Azure Monitor for SAP solutions is native to Azure. It allows you to collect data from Azure infrastructure and databases into a single location and visually correlate the data for faster troubleshooting. For more information, see [Monitor SAP on Azure](../monitor/about-azure-monitor-sap-solutions.md).

## Next steps

Learn about how to monitor and troubleshoot from within SAP HANA.

> [!div class="nextstepaction"]
> [Monitoring and troubleshooting from HANA side](hana-monitor-troubleshoot.md)
