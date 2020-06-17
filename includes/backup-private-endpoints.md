---
author: dcurwin
ms.service: backup
ms.topic: include
ms.date: 03/12/2020
ms.author: dacurwin
---

You can now use [Private Endpoints](https://docs.microsoft.com/azure/private-link/private-endpoint-overview) to back up your data securely from servers inside a virtual network to your Recovery Services vault. The private endpoint uses an IP from the VNET address space for your vault. The network traffic between your resources inside the virtual network and the vault travels over your virtual network and a private link on the Microsoft backbone network. This eliminates exposure from the public internet. Private Endpoints can be used for backing up and restoring your SQL and SAP HANA databases that run inside your Azure VMs. It can also be used for your on-premises servers using the MARS agent.

Azure VM backup doesn't require internet connectivity and so doesn't require Private Endpoints to allow network isolation.

Read more on private endpoints for Azure Backup [here](https://docs.microsoft.com/azure/backup/private-endpoints).
