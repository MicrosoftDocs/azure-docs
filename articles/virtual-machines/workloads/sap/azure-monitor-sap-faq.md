---
title: FAQ - Azure Monitor for SAP Solutions | Microsoft Docs
description: This article provides answers to frequently asked questions about Azure monitor for SAP solutions
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: rdeltcheva
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 5e514964-c907-4324-b659-16dd825f6f87
ms.service: virtual-machines-windows

ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 06/30/2020
ms.author: radeltch

---

# Azure monitor for SAP solutions FAQ (preview)

This article provides answers to frequently asked questions (FAQ) about Azure monitor for SAP solutions.  

1. **Do I have to pay for Azure Monitor for SAP Solutions?**  
There is no licensing fee for Azure Monitor for SAP Solutions.  
However, customers are responsible to bear the cost of managed resource group components.  

2. **In which regions is this service available for public preview?**  
For public preview, this service will be available in East US 2, West US 2, East US and West Europe.  

3. **Do I need to provide permissions to allow the deployment of managed resource group in my subscription?**  
No, explicit permissions are not required.  

4. **Where does the collector VM reside?**  
At the time of deploying Azure Monitor for SAP Solutions resource, we recommend that customers choose the same VNET for monitoring resource as their SAP HANA server.  
Therefore, collector VM is recommended to reside in the same VNET as SAP HANA server.  
If customers are using non-HANA database, the collector VM will reside in the same VNET as non-HANA database.  

5. **Which versions of HANA are supported?**  
HANA 1.0 SPS 12 (Rev. 120 or higher) and HANA 2.0 SPS03 or higher  

6. **Which HANA deployment configurations are supported?**  
The following configurations are supported:
   - Single node (scale-up) and multi-node (scale-out)  
   - Single database container (HANA 1.0 SPS 12) and multiple database containers (HANA 1.0 SPS 12 or HANA 2.0)  
   - Auto host failover (n+1) and HSR  

7. **Which SQL Server Versions are supported?**  
SQL Server 2012 SP4 or higher.  

8. **Which SQL Server configurations are supported?**  
The following configurations are supported:
   - Default or named standalone instances in a virtual machine  
   - Clustered instances or instances in an AlwaysOn configuration when either using the virtual name of the clustered resource or the AlwaysOn listener name. Currently no cluster or AlwaysOn specific metrics are collected (planned)  
   - Azure SQL Database (PAAS) is currently not supported  

9. **What happens if I accidentally delete the managed resource group?**  
The managed resource group is locked by default. Therefore, the chances of accidental deletion of the managed resource group by customers are minuscule.  
If a customer deletes the managed resource group, Azure Monitor for SAP Solutions will stop working. The customer will have to deploy a new Azure Monitor for SAP Solutions resource and start over.  

10. **Which roles do I need in my Azure subscription to deploy Azure Monitor for SAP Solutions resource?**  
Contributor role.  

11. **What is the SLA on this product?**  
Previews are excluded from service level agreements. Please read the full license term through Azure Monitor for SAP Solutions marketplace image.  

12. **Can I monitor my entire landscape through this solution?**  
You can currently monitor HANA database, the underlying infrastructure, High-availability cluster, and Microsoft SQL server in public preview.  

13. **Does this service replace SAP Solution manager?**  
No. Customers can still use SAP Solution manager for Business process monitoring.  

14. **What is the value of this service over traditional solutions like SAP HANA Cockpit/Studio?**  
Azure Monitor for SAP Solutions is not HANA database specific. Azure Monitor for SAP Solutions supports also AnyDB.  

## Next steps

- Create your first Azure Monitor for SAP solutions resource.