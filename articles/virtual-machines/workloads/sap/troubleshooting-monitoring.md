---
title: Monitoring of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Monitor SAP HANA on an Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: jeconnoc
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/10/2018
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---

# How to monitor SAP HANA (large instances) on Azure

SAP HANA on Azure (Large Instances) is no different from any other IaaS deployment — you need to monitor what the OS and the application is doing and how the applications consume the following resources:

- CPU
- Memory
- Network bandwidth
- Disk space

With Azure Virtual Machines, you need to figure out whether the resource classes named above are sufficient or they get depleted. Here is more detail on each of the different classes:

**CPU resource consumption:** The ratio that SAP defined for certain workload against HANA is enforced to make sure that there should be enough CPU resources available to work through the data that is stored in memory. Nevertheless, there might be cases where HANA consumes many CPUs executing queries due to missing indexes or similar issues. This means you should monitor CPU resource consumption of the HANA large instance unit as well as CPU resources consumed by the specific HANA services.

**Memory consumption:** Is important to monitor from within HANA, as well as outside of HANA on the unit. Within HANA, monitor how the data is consuming HANA allocated memory in order to stay within the required sizing guidelines of SAP. You also want to monitor memory consumption on the Large Instance level to make sure that additional installed non-HANA software does not consume too much memory, and therefore compete with HANA for memory.

**Network bandwidth:** The Azure VNet gateway is limited in bandwidth of data moving into the Azure VNet, so it is helpful to monitor the data received by all the Azure VMs within a VNet to figure out how close you are to the limits of the Azure gateway SKU you selected. On the HANA Large Instance unit, it does make sense to monitor incoming and outgoing network traffic as well, and to keep track of the volumes that are handled over time.

**Disk space:** Disk space consumption usually increases over time. Most common causes are: data volume increases, execution of transaction log backups, storing trace files, and performing storage snapshots. Therefore, it is important to monitor disk space usage and manage the disk space associated with the HANA Large Instance unit.

For the **Type II SKUs** of the HANA Large Instances, the server comes with the preloaded system diagnostic tools. You can utilize these diagnostic tools to perform the system health check. 
Run the following command to generates the health check log file at /var/log/health_check.
```
/opt/sgi/health_check/microsoft_tdi.sh
```
When you work with the Microsoft Support team  to troubleshoot an issue, you may also be asked to provide the log files by using these diagnostic tools. You can zip the file using the following command.
```
tar  -czvf health_check_logs.tar.gz /var/log/health_check
```

**Next steps**

- Refer [How to monitor SAP HANA (large instances) on Azure](troubleshooting-monitoring.md).