<properties
   pageTitle="Using SAP on Windows virtual machines | Microsoft Azure"
   description="Lear about using SAP on Windows virtual machines (VMs) in Microsoft Azure"
   services="virtual-machines-windows,virtual-network,storage"
   documentationCenter="saponazure"
   authors="MSSedusch"
   manager="juergent"
   editor=""
   tags="azure-service-management"
   keywords=""/>
<tags
   ms.service="virtual-machines-windows"
   ms.devlang="NA"
   ms.topic="campaign-page"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="na"
   ms.date="07/20/2016"
   ms.author="sedusch"/>

# Using SAP on Windows virtual machines in Azure

Cloud Computing is a widely used term which is gaining more and more importance within the IT industry, from small companies up to large and multinational corporations. Microsoft Azure is the Cloud Services Platform from Microsoft which offers a wide spectrum of new possibilities. Now customers are able to rapidly provision and de-provision applications as Cloud-Services, so they are not limited to technical or budgeting restrictions. Instead of investing time and budget into hardware infrastructure, companies can focus on the application, business processes and its benefits for customers and users.

With Microsoft Azure virtual machines, Microsoft offers a comprehensive Infrastructure as a Service (IaaS) platform. SAP NetWeaver based applications are supported on Azure Virtual Machines (IaaS). The whitepapers below describe how to plan and implement SAP NetWeaver based applications on Windows virtual machines in Azure. You can also implement SAP NetWeaver based applications on [Linux virtual machines](virtual-machines-linux-classic-sap-get-started.md).

[AZURE.INCLUDE [virtual-machines-common-classic-sap-get-started](../../includes/virtual-machines-common-classic-sap-get-started.md)]

## SAP NetWeaver on Azure - HA

Title: SAP NetWeaver on Azure - Clustering SAP ASCS/SCS Instances using Windows Server Failover Cluster on Azure with SIOS DataKeeper

Summary: 'This document describes how to use SIOS DataKeeper to set up a highly available SAP ASCS/SCS configuration on Azure. SAP protects their single point of failure components like SAP ASCS/SCS or Enqueue Replication Services with Windows Server Failover Cluster configurations that require shared disks. These SAP components are essential for the functionality of a SAP system. Therefore high-availability functionality needs to be put in place to make sure that those components can sustain a failure of a server or a VM as done with Windows Cluster configurations for bare-metal and Hyper-V environments. As of August 2015 Azure on itself cannot provide shared disks that would be required for the Windows based highly available configurations required for these critical SAP components. However with the help of the product DataKeeper by SIOS, Windows Server Failover Cluster configurations as needed for SAP ASCS/SCS can be built on the Azure IaaS platform. This paper describes in a step-to-step approach how to install a Windows Server Failover Cluster configuration with shared disk provided by SIOS Datakeeper in Azure. The paper will explain details in configurations on the Azure, Windows and SAP side which make the high availability configuration work in an optimal manner. The paper complements the SAP Installation Documentation and SAP Notes which represent the primary resources for installations and deployments of SAP software on given platforms.

Updated: August 2015

[Download this guide now](http://go.microsoft.com/fwlink/?LinkId=613056)
