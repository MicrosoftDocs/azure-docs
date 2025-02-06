---
title: Understand Azure NetApp Files application volume group for Oracle 
description: Describes the use cases and key features of Azure NetApp Files application volume group for Oracle.  
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 01/29/2025
ms.author: anfdocs
---
# Understand Azure NetApp Files application volume group for Oracle 

Application volume group for Oracle enables you to deploy all volumes required to install and operate Oracle databases at enterprise scale, with optimal performance and according to best practices in a single one-step and optimized workflow. The application volume group feature uses the Azure NetApp Files ability to place all volumes in the same availability zone as the VMs to achieve automated, latency-optimized deployments. 

Application volume group for Oracle has implemented many technical improvements that simplify and standardize the entire process to help you streamline volume deployments for Oracle. All required volumes, such as up to eight data volumes, online redo log and archive redo log, backup and binary, are created in a single "atomic" operation (through the Azure portal, RP, or API).

Azure NetApp Files application volume group shortens Oracle database deployment time and increases overall application performance and stability, including the use of multiple storage endpoints. The application volume group feature supports a wide range of Oracle database layouts from small databases with a single volume up to multi 100-TiB sized databases. It supports up to eight data volumes with latency-optimized performance and is only limited by the database VM's network capabilities. 

Using multiple volumes connected via multiple storage endpoints, as deployed by application volume group for Oracle, brings performance improvements as outlined in the [Oracle database on multiple volumes article](performance-oracle-multiple-volumes.md).

Application volume group for Oracle is supported in all Azure NetApp Files enabled regions.

## Key capabilities 

Application volume group for Oracle provides the following capabilities:

* Supporting a large variation of Oracle configurations starting with 2 volumes for smaller databases up to 12 volumes for huge databases up to several hundred TiB.
* Creating the following volume layout:   
    * Data: One to eight data volumes 
    * Log: An online redo log volume (`log`) and optionally a second log volume (`log-mirror`) if required
    * Binary: A volume for Oracle binaries (optional)
    * Backup: A log volume to archive the log-backup (optional)
* Creating volumes in a [manual QoS capacity pool](manage-manual-qos-capacity-pool.md)     
    The volume size and the required performance (in MiB/s) are proposed based on user input for the database size and throughput requirements of the database.
* The application volume group GUI and Azure Resource Manager (ARM) template provide best practices to simplify sizing management and volume creation. For example:   
    * Proposing volume naming convention based on a System ID (SID) and volume type
    * Calculating the size and performance based on user input

Application volume group for Oracle helps you simplify the deployment process and increase the storage performance for Oracle workloads. Some of the new features are as follows:   

* Use of availability zone placement to ensure that volumes are placed into the same zone as compute VMs.   
    On request, a PPG based volume placement is available for regions without availability zones, which requires a manual process.
* Creation of separate storage endpoints (with different IP addresses) for data and log volumes.   
    This deployment method provides better performance and throughput for the Oracle database.
* Customer-managed keys support increased security and compliance. 

## Application volume group layout

Application volume group for Oracle deploys multiple volumes based on your input and on resource availability in the selected region and zone, subject to the following rules:

[!INCLUDE [AVG bullet points](includes/application-volume-group-layout.md)]

High availability deployments will include volumes in 2 availability zones for which you can deploy volumes using application volume group for Oracle in both zones. You can use application-based data replication such as Data Guard. Example dual-zone volume layout:

High availability deployments include volumes in two availability zones, for which you can deploy volumes using application volume group for Oracle in both zones. You can use application-based data replication such as Data Guard. Example dual-zone volume layout:

:::image type="content" source="./media/application-volume-group-oracle-introduction/oracle-dual-zone-layout.png" alt-text="Diagram of dual-zone volume layout." lightbox="./media/application-volume-group-oracle-introduction/oracle-dual-zone-layout.png":::

A fully built deployment with eight data volumes and all optional volumes in a zone with ample resource availability can resemble:

:::image type="content" source="./media/application-volume-group-oracle-introduction/oracle-built-environment.png" alt-text="Diagram of Oracle deployment." lightbox="./media/application-volume-group-oracle-introduction/oracle-built-environment.png":::

In resource-constrained zones, volumes might be deployed on shared storage endpoints due to the aforementioned anti-affinity and no-grouping algorithms. This diagram depicts an example volume layout in a resource-constrained zone: 

:::image type="content" source="./media/application-volume-group-oracle-introduction/eight-volume-deployment.png" alt-text="Diagram of eight data volume layout." lightbox="./media/application-volume-group-oracle-introduction/eight-volume-deployment.png":::

In resource-constrained zones, the volumes are deployed on shared storage endpoints while maintaining the anti-affinity and no-grouping rules. The resulting layout shows the log and log-mirror volumes on private storage endpoints while the data volumes share storage-endpoints. The log and log-mirror volumes do not share storage-endpoints.

## Next steps

* [Requirements and considerations for application volume group for Oracle](application-volume-group-oracle-considerations.md)
* [Deploy application volume group for Oracle](application-volume-group-oracle-deploy-volumes.md)
* [Manage volumes in an application volume group for Oracle](application-volume-group-manage-volumes-oracle.md)
* [Configure application volume group for Oracle using REST API](configure-application-volume-oracle-api.md) 
* [Deploy application volume group for Oracle using Azure Resource Manager](configure-application-volume-oracle-azure-resource-manager.md) 
* [Troubleshoot application volume group errors](troubleshoot-application-volume-groups.md)
* [Delete an application volume group](application-volume-group-delete.md)
* [Application volume group FAQs](faq-application-volume-group.md)