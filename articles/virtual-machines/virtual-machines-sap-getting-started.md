<properties
   pageTitle="Using SAP on Azure Virtual Machines (VMs) | Microsoft Azure"
   description="Using SAP on Azure Virtual Machines (VMs)"
   services="virtual-machines,virtual-network,storage"
   documentationCenter="saponazure"
   authors="MSSedusch"
   manager="juergent"
   editor=""
   tags="azure-service-management"
   keywords=""/>
<tags
   ms.service="virtual-machines"
   ms.devlang="NA"
   ms.topic="campaign-page"
   ms.tgt_pltfrm="vm-multiple"
   ms.workload="na"
   ms.date="11/18/2015"
   ms.author="sedusch"/>
   
# Using SAP on Azure Virtual Machines (VMs)

Cloud Computing is a widely used term which is gaining more and more importance within the IT industry, from small companies up to large and multinational corporations. Microsoft Azure is the Cloud Services Platform from Microsoft which offers a wide spectrum of new possibilities. Now customers are able to rapidly provision and de-provision applications as Cloud-Services, so they are not limited to technical or budgeting restrictions. Instead of investing time and budget into hardware infrastructure, companies can focus on the application, business processes and its benefits for customers and users.

With Microsoft Azure Virtual Machine Services, Microsoft offers a comprehensive Infrastructure as a Service (IaaS) platform. SAP NetWeaver based applications are supported on Azure Virtual Machines (IaaS). The whitepapers below  describe how to plan and implement SAP NetWeaver based applications within Microsoft Azure as the platform of choice.

## Planning and Implementation

Title: SAP NetWeaver on Azure Virtual Machines – Planning and Implementation Guide

Summary: This is the paper to start with if you are thinking about running SAP NetWeaver in Azure Virtual Machines. This planning and implementation guide will help you evaluate whether an existing or planned SAP NetWeaver-based system can be deployed to an Azure Virtual Machines environment. It covers multiple SAP NetWeaver deployment scenarios, and includes SAP configurations that are specific to Azure. The paper lists and describes all the necessary configuration information you’ll need on the SAP/Azure side to run a hybrid SAP landscape. Measures you can take to ensure high availability of SAP NetWeaver-based systems on IaaS are also covered.

Updated: August 2015

[Download this guide now](http://go.microsoft.com/fwlink/?LinkId=397963)
## Deployment
Title: SAP NetWeaver on Azure Virtual Machines – Deployment Guide

Summary: This document provides procedural guidance for deploying SAP NetWeaver software to virtual machines in Azure. This paper focuses on three specific deployment scenarios, with an emphasis on enabling the Azure Monitoring Extensions for SAP, including troubleshooting recommendations for the Azure Monitoring Extensions for SAP. This paper assumes that you’ve read the planning and implementation guide.

Updated: September 2015

[Download this guide now](http://go.microsoft.com/fwlink/?LinkId=397964)

## SAP DBMS on Azure
Title: SAP DBMS in Azure Deployment Guide

Summary: This paper covers planning and implementation considerations for the DBMS systems that should run in conjunction with SAP. In the first part, general considerations are listed and presented. The following parts of the paper relate to deployments of different DBMS in Azure that are supported by SAP. Different DBMS presented are SQL Server, SAP ASE, Oracle, SAP MaxDB and IBM DB2 for Linux, Unix and Windows. In those specific parts considerations you have to account for when you are running SAP systems on Azure in conjunction with those DBMS are discussed. Subjects like backup and high availability methods that are supported by the different DBMS on Azure are presented for the usage with SAP applications.

Updated: December 2015

[Download this guide now](http://go.microsoft.com/fwlink/?LinkId=397965)

## SAP NetWeaver on Azure

Title: SAP NetWeaver - Building an Azure based Disaster Recovery Solution

Summary:This document provides a step-by-step guidance for building an Azure based Disaster Recovery solution for SAP NetWeaver. The solution described assumes that the SAP landscape is running virtualized on-premise based on Hyper-V. In the first part of the document Azure Site Recovery (ASR) services are introduced in its components. The second part of the document describes specifics for SAP NetWeaver based landscapes. Possibilities of using ASR with SAP NetWeaver application instances and SAP Central Services are discussed and described. A focus of the second part is leveraging ASR for SAP Central Services which are protected with windows Server Failover Cluster configurations.

Updated: September 2015

[Download this guide now](http://go.microsoft.com/fwlink/?LinkID=521971)

## SAP NetWeaver on Azure - HA

Title: SAP NetWeaver on Azure - Clustering SAP ASCS/SCS Instances using Windows Server Failover Cluster on Azure with SIOS DataKeeper

Summary: 'This document describes how to use SIOS DataKeeper to set up a highly available SAP ASCS/SCS configuration on Azure. SAP protects their single point of failure components like SAP ASCS/SCS or Enqueue Replication Services with Windows Server Failover Cluster configurations that require shared disks. These SAP components are essential for the functionality of a SAP system. Therefore high-availability functionality needs to be put in place to make sure that those components can sustain a failure of a server or a VM as done with Windows Cluster configurations for bare-metal and Hyper-V environments. As of August 2015 Azure on itself cannot provide shared disks that would be required for the Windows based highly available configurations required for these critical SAP components. However with the help of the product DataKeeper by SIOS, Windows Server Failover Cluster configurations as needed for SAP ASCS/SCS can be built on the Azure IaaS platform. This paper describes in a step-to-step approach how to install a Windows Server Failover Cluster configuration with shared disk provided by SIOS Datakeeper in Azure. The paper will explain details in configurations on the Azure, Windows and SAP side which make the high availability configuration work in an optimal manner. The paper complements the SAP Installation Documentation and SAP Notes which represent the primary resources for installations and deployments of SAP software on given platforms.

Updated: August 2015

[Download this guide now](http://go.microsoft.com/fwlink/?LinkId=613056)

## SAP NetWeaver on Azure SUSE Linux Virtual Machines

Title: Testing SAP NetWeaver on Microsoft Azure SUSE Linux VMs

Summary: There is no official SAP support for running SAP NetWeaver on Azure Linux VMs at this point in time. Nevertheless customers
might want to do some testing or might consider to run SAP demo or training systems on Azure Linux VMs as long as there is no need for contacting SAP support. 
This article should help setting up Azure SUSE Linux VMs for running SAP and gives some basic hints in order to avoid common potential pitfalls.

Updated: December 2015

[This article can be found here](virtual-machines-sap-on-linux-suse-quickstart.md)
