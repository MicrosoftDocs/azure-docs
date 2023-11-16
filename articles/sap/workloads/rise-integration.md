---
title: Integrating Azure with SAP RISE managed workloads| Microsoft Docs
description: Describes integrating SAP RISE managed virtual network with customer's own Azure environment
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: msftrobiro
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 11/09/2023
ms.author: robiro

---

# Integrating Azure with SAP RISE managed workloads

For customers with SAP solutions such as RISE with SAP Enterprise Cloud Services (ECS) and SAP S/4HANA Cloud, private edition (PCE) deployed in Azure, integrating the SAP managed environment with their own Azure ecosystem and third party applications is of particular importance. The following articles explain the concepts and best practices to follow for a performant and secure solution.

- [Network connectivity options in Azure with SAP RISE managed workloads](./rise-integration-network.md)
- [Integrating Azure services with SAP RISE managed workloads](./rise-integration-services.md)

## Azure support aspects

SAP RISE customers in Azure have the SAP landscape run by SAP in an Azure subscription owned by SAP. The subscription and all Azure resources of your SAP environment are visible to and managed by SAP only. In turn, the customer's own Azure environment contains applications that interact with the SAP systems. Elements such as virtual networks, network security groups, firewalls, routing, Azure services such as Azure Data Factory and others running inside the customer subscription access the SAP managed landscape. When you engage with Azure support, only resources in your own subscriptions are in scope. Contact SAP for issues with any resources operated in SAP's Azure subscriptions for your RISE workload.

:::image type="complex" source="./media/sap-rise-integration/sap-rise-support.png" alt-text="Support separation between SAP and customer's environments in Azure":::
   This diagram shows a split of different Azure subscriptions. On one side, all customer subscriptions with customer managed workload. Other half with SAP ECS/RISE subscription containing customer's SAP workload, managed by SAP. Each side responsible themselves to contact Azure support, with no crossed responsibilities.
:::image-end:::

As part of your RISE project, document the interfaces and transfer points between your own Azure environment, SAP workload managed by SAP RISE and on-premises. Such document needs to include network information such as address space, firewall(s) and routing, file shares, Azure services, DNS and others. Document ownership of any interface partner and where any resource is running, to access this information quickly in a troubleshooting and support situation. Contact SAPs support organization for services running in SAP's Azure subscriptions.

> [!IMPORTANT]
> For all details about RISE with SAP Enterprise Cloud Services and SAP S/4HANA Cloud private edition, contact your SAP representative.

## RISE architecture

SAP creates and manages the entire SAP RISE architecture running in SAP's subscription and Azure tenant. SAP also decides, validates and deploys all technical elements and details used by SAP for RISE in Azure. Microsoft and SAP are continuously working together to create the Azure infrastructure architectures optimized to support the RISE SLAs,  to apply Azure best practices as documented by Microsoft, and adapt these best practices to the unique challenges of the RISE managed services. The cooperation on Azure architecture as experiences by RISE customers includes continuous optimizations and adaption to new Azure functionalities to provide added value for RISE customers.  Microsoft documents the integration part with SAP RISE in these documents, however not the details about SAP's used architecture, which is intellectual property of SAP. From Microsoft's recommended architecture SAP might use modifications and optimizations in their employed architecture, to fulfill RISE SLAs and expectations by customers. Work with SAP for any extensions or customizations and configuration, for your organization's requirements.

## Next steps
Check out the documentation:

- [Network connectivity options in Azure with SAP RISE managed workloads](./rise-integration-network.md)
- [Integrating Azure services with SAP RISE managed workloads](./rise-integration-services.md)
- [Virtual network peering](../../virtual-network/virtual-network-peering-overview.md)
- [Get started with SAP on Azure VMs](./get-started.md)
