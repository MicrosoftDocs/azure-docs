<properties
   pageTitle="Service resiliency guidance | Microsoft Azure"
   description="Links to disaster recovery and proactive resiliency and availability guidance for Microsoft Azure services."
   services=""
   documentationCenter="na"
   authors="adamglick"
   manager="hongfeig"
   editor=""/>

<tags
   ms.service="resiliency"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/01/2016"
   ms.author="aglick"/>

# Microsoft Azure service resiliency guidance
Microsoft Azure is designed to provide you with the resources you need, when you need them. As part of good design and operational practices, you should know both how to architect your use of Azure services to achieve high availability as well as what to do if your application is impacted by a service disruption. To aid you in this process, this document contains links to disaster recovery guidance as well as design guidance for various Azure services.

##Disaster recovery guidance
The disaster recovery guidance links below are can provide you with the information you need to help you get your application back online quickly if you are impacted by an Azure service disruption. These links were created to help you answer the question, "I'm being impacted by an Azure service disruption, what can I do?"

##Design guidance
The design guidance links below are design and architectural guidance that has been created to help you understand how best to use each Azure service in a way that maximizes your application's uptime. These links were created to help you answer the question "How do I make sure that a bug, hardware failure, service disruption, or other failure won't impact the overall availability of my application?" If there is no specific guidance for the service you are currently looking for, the [High availability for applications built on Microsoft Azure](./resiliency-high-availability-azure-applications.md) article may have additional information that can help you in your design. 

##Service guidance
| Service  | Disaster recovery guidance | Design guidance |
|:---------|:--------------------------:|:------------------:|
| [Cloud Services](https://azure.microsoft.com/services/cloud-services/ "Azure Cloud Services")       | [link](../cloud-services/cloud-services-disaster-recovery-guidance.md "Azure Cloud Services disaster recovery guidance")   | Not Available |
| [Key Vault](https://azure.microsoft.com/services/key-vault/ "Azure Key Vault")                      | [link](../key-vault/key-vault-disaster-recovery-guidance.md "Azure Key Vault disaster recovery guidance")        | Not Available |
| [Storage](https://azure.microsoft.com/services/storage/ "Azure Storage")                            | [link](../storage/storage-disaster-recovery-guidance.md "Azure Storage disaster recovery guidance")          | Not Available |
| [SQL Databases](https://azure.microsoft.com/services/sql-database/ "Azure SQL Databases")           | [link](../sql-database/sql-database-disaster-recovery.md  "Azure SQL Database disaster recovery guidance")    | [link](../sql-database/sql-database-business-continuity-design.md "Azure SQL Databases design guidance") |
| [Virtual Machines](https://azure.microsoft.com/services/virtual-machines/ "Azure Virtual Machines") | [link](../virtual-machines/virtual-machines-disaster-recovery-guidance.md "Azure Virtual Machines disaster recovery guidance") | Not Available |
| [Virtual Network](https://azure.microsoft.com/services/virtual-network/ "Azure Virtual Network")    | [link](../virtual-network/virtual-network-disaster-recovery-guidance.md "Azure Virtual Network disaster recovery guidance")  | Not Available |

##Next steps
If you are looking for guidance that focuses more broadly on systems and solutions, please read [Disaster recovery and high availability for applications built on Microsoft Azure](https://aka.ms/drtechguide).
