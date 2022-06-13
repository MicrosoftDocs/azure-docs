---
title: Azure Center for SAP Solutions (preview)
description: Azure Center for SAP Solutions (ACSS) is an Azure offering that makes SAP a top-level workload on Azure. You can use ACSS to deploy or manage SAP systems on Azure seamlessly.
ms.service: azure-center-sap-solutions
ms.topic: overview
ms.date: 07/01/2022
ms.author: ladolan
author: lauradolan
---

# About Azure Center for SAP Solutions (preview)

[!INCLUDE [Preview content notice](./includes/preview.md)]

*Azure Center for SAP solutions (ACSS)* is an Azure offering that makes SAP a top-level workload on Azure. You can use ACSS to deploy or manage SAP systems on Azure seamlessly. The deployment experience sets up and connects the individual SAP components on your behalf. ACSS simplifies the management of SAP systems and provides quality checks to increase the reliability of these systems on Azure. 


## Virtual Instance for SAP

An important concept in ACSS is the *Virtual Instance for SAP (VIS)*, which is a guided, catalog-based way to deploy SAP on Azure. VIS is a logical representation of an SAP system's resources. 

Every time that you create a new SAP system through ACSS, or register an existing SAP system to ACSS, Azure creates a VIS. A VIS contains the metadata for the entire SAP system. 

After you create a VIS, you can:

- See an overview of the entire SAP system, including all [parts of the VIS](#parts-of-the-vis).
- View the SAP system metadata. For example, properties of ASCS, database, and Application Server instances; properties of SAP environment details; and properties of associated VM resources.
- Get the latest status and health check for your SAP system.
- Monitor your Azure infrastructure metrics for your SAP system resources. For example, the CPU percentage used for ASCS and Application Server VMs, or disk input/output operations per second (IOPS).

### Parts of the VIS

Each VIS consists of:

- The SAP system itself, referred to by the SAP System Identifier (SID)
- An ABAP Central Services (ASCS) instance
- A database instance
- One or more SAP Application Server instances

:::image type="complex" source="./media/overview/virtual-instance-for-sap.png" alt-text="Diagram of a Virtual Instance for S A P containing an S A P system identifier with A S C S, Application Server and Database instances.":::
   This diagram shows a V I S that contains an S A  P system. The S A P system contains an A S C S instance, an Application Server instance, and a database instance. Each instance connects to a virtual machine resource outside of the V I S. 
:::image-end:::

Inside the VIS, the SID is the parent resource. Your VIS resource is named after the SID of your SAP system. Any ASCS, Application Server, or database instances are child resources of the SID. The child resources are associated with one or more VM resources outside of the VIS. A standalone or distributed SAP system can only have one ASCS instance and one database instance. High Availability (HA) deployments have two ASCS instances. An SAP system can have multiple Application Server instances.

## Next steps

- [Create network for ACSS infrastructure deployment](create-network.md)
