---
title:  Performance vs As-is on-premises assessments
description: Describes how Azure Migrate provides sizing recommendations for the assessed workloads.
author: v-sreedevank
ms.author: v-sreedevank
ms.service: azure-migrate
ms.topic: how-to
ms.date: 10/21/2024
---

# Target right-sizing 

Azure Migrate assessments identify the readiness of the source workloads, right-sized targets, and cost of hosting the workload on Azure. After it identifies the readiness of the source workload, the assessment makes sizing recommendations for the assessed workloads. The sizing calculations depend on whether you're using as-is on-premises sizing or performance-based sizing. 

Azure Migrate supports two types of target sizing:  

| Sizing criteria    | Details   | Examples |
|--------------------|-----------|----------|
| **Performance-based**  | Assessments that make target size recommendations based on collected performance data.  | The compute recommendation is based on CPU and memory utilization data. <br> <br> The storage recommendation is based on the input/output operations per second (IOPS) and the throughput of the on-premises disks. Disk types are Azure Standard HDD, Azure Standard SSD, Azure Premium disks, and Azure Ultra disks.  |
| **As-is on-premises**  | Assessments that don't use performance data to make target size recommendations. The targets are sized based on the configuration data available.  | The compute recommendation is based on the on-premises source workload size. <br> The recommended storage is based on the storage type selected for the assessment.|