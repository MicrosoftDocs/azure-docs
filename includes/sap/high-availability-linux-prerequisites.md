---
title: HA Cluster Prereqs
description: Include File for HA Cluster Prereqs
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 06/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---
- SAP documentation for SAP on Azure
   - SAP Note [1928533][sapnote-1928533-AzureVMInfo], which has:
     - A list of Azure Virtual Machine sizes that are supported for the deployment of SAP software
     - Important capacity information for Azure Virtual Machine sizes
     - Supported SAP software, operating systems (OSs), and combinations
     - The required SAP kernel version for Windows and Linux on Microsoft Azure
   - SAP Note [2015553][sapnote-2015553-AzurePrereqs], which lists prerequisites for SAP-supported SAP software deployments in Azure.
   - SAP Note [2178632][sapnote-2178632-AzureMonitoringMetrics], which has detailed information about all monitoring metrics reported for SAP in Azure
   - SAP Note [2191498][sapnote-2191498-AzureHostAgentLinux], which has the required SAP Host Agent version for Linux in Azure
   - SAP Note [2243692][sapnote-2243692-LicensingInAzure], which has information about SAP licensing on Linux in Azure
   - SAP Note [1999351][sapnote-1999351-AzureEnhancedMonitoringExtension], which has more troubleshooting information for the Azure Enhanced Monitoring Extension for SAP
- Azure Services documentation
   - [NFS on Azure Files][azdoc-afs-intro]
   - [Azure NetApp Files][azdoc-anf-intro]
   - [Azure Internal Load Balancer][azdoc-ilb-intro]
- NetApp NFS documentation
   - [NetApp NFS best practices](https://www.netapp.com/media/10720-tr-4067.pdf)
- Microsoft SAP on Azure documentation
   - [Azure Virtual Machines planning and implementation for SAP on Linux][azdoc-sap-planning-guide]
   - [Azure Virtual Machines deployment for SAP on Linux][azdoc-sap-deployment-guide]
   - [Azure Virtual Machines DBMS deployment for SAP on Linux][azdoc-sap-dbms-guide]



[azdoc-afs-intro]: ../../articles/storage/files/storage-files-introduction.md

[azdoc-anf-intro]: ../../articles/azure-netapp-files/azure-netapp-files-introduction.md

[azdoc-ilb-intro]: ../../articles/load-balancer/load-balancer-overview.md

[azdoc-sap-dbms-guide]: ../../articles/sap/workloads/dbms-guide-general.md
[azdoc-sap-deployment-guide]: ../../articles/sap/workloads/deployment-guide.md
[azdoc-sap-planning-guide]: ../../articles/sap/workloads/planning-guide.md

[sapnote-1928533-AzureVMInfo]: https://launchpad.support.sap.com/#/notes/1928533
[sapnote-2015553-AzurePrereqs]: https://launchpad.support.sap.com/#/notes/2015553
[sapnote-2178632-AzureMonitoringMetrics]: https://launchpad.support.sap.com/#/notes/2178632
[sapnote-2191498-AzureHostAgentLinux]: https://launchpad.support.sap.com/#/notes/2191498
[sapnote-2243692-LicensingInAzure]: https://launchpad.support.sap.com/#/notes/2243692
[sapnote-1999351-AzureEnhancedMonitoringExtension]: https://launchpad.support.sap.com/#/notes/1999351