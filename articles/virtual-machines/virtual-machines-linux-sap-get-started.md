<properties
   pageTitle="Using SAP on Linux virtual machines (VMs) | Microsoft Azure"
   description="Learn about using SAP on Linux virtual machines (VMs) in Microsoft Azure"
   services="virtual-machines-linux,virtual-network,storage"
   documentationCenter="saponazure"
   authors="MSSedusch"
   manager="juergent"
   editor=""
   tags="azure-resource-manager"
   keywords=""/>
<tags
   ms.service="virtual-machines-linux"
   ms.devlang="NA"
   ms.topic="campaign-page"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="na"
   ms.date="02/12/2016"
   ms.author="sedusch"/>

# Using SAP on Linux virtual machines (VMs)

[AZURE.INCLUDE [virtual-machines-common-sap-shared](virtual-machines-common-sap-shared.md)]

Cloud Computing is a widely used term which is gaining more and more importance within the IT industry, from small companies up to large and multinational corporations. Microsoft Azure is the Cloud Services Platform from Microsoft which offers a wide spectrum of new possibilities. Now customers are able to rapidly provision and de-provision applications as Cloud-Services, so they are not limited to technical or budgeting restrictions. Instead of investing time and budget into hardware infrastructure, companies can focus on the application, business processes and its benefits for customers and users.

With Microsoft Azure Virtual Machine Services, Microsoft offers a comprehensive Infrastructure as a Service (IaaS) platform. SAP NetWeaver based applications are supported on Azure Virtual Machines (IaaS). The whitepapers below  describe how to plan and implement SAP NetWeaver based applications within Microsoft Azure as the platform of choice.

##  <a name="3da0389e-708b-4e82-b2a2-e92f132df89c"></a>Planning and Implementation

Title: SAP NetWeaver on Linux virtual machines (VMs) – Planning and Implementation Guide

Summary: This is the paper to start with if you are thinking about running SAP NetWeaver in Azure Virtual Machines. This planning and implementation guide will help you evaluate whether an existing or planned SAP NetWeaver-based system can be deployed to an Azure Virtual Machines environment. It covers multiple SAP NetWeaver deployment scenarios, and includes SAP configurations that are specific to Azure. The paper lists and describes all the necessary configuration information you’ll need on the SAP/Azure side to run a hybrid SAP landscape. Measures you can take to ensure high availability of SAP NetWeaver-based systems on IaaS are also covered.

Updated: March 2016

[This guide can be found here][planning-guide-linux]
## <a name="6aadadd2-76b5-46d8-8713-e8d63630e955"></a>Deployment

Title: SAP NetWeaver on Linux virtual machines (VMs) – Deployment Guide

Summary: This document provides procedural guidance for deploying SAP NetWeaver software to virtual machines in Azure. This paper focuses on three specific deployment scenarios, with an emphasis on enabling the Azure Monitoring Extensions for SAP, including troubleshooting recommendations for the Azure Monitoring Extensions for SAP. This paper assumes that you’ve read the planning and implementation guide.

Updated: March 2016

[This guide can be found here][deployment-guide-linux]

## <a name="1343ffe1-8021-4ce6-a08d-3a1553a4db82"></a>DBMS Deployment Guide

Title: SAP NetWeaver on Linux virtual machines (VMs) – DBMS Deployment Guide

Summary: This paper covers planning and implementation considerations for the DBMS systems that should run in conjunction with SAP. In the first part, general considerations are listed and presented. The following parts of the paper relate to deployments of different DBMS in Azure that are supported by SAP. Different DBMS presented are SQL Server, SAP ASE and Oracle. In those specific parts considerations you have to account for when you are running SAP systems on Azure in conjunction with those DBMS are discussed. Subjects like backup and high availability methods that are supported by the different DBMS on Azure are presented for the usage with SAP applications.

Updated: March 2016

[This guide can be found here][dbms-guide-linux]
