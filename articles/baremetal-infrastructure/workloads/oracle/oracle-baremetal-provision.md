---
title: Provision BareMetal for Oracle
description: Learn about provisioning your BareMetal Infrastructure for Oracle.
ms.topic: reference
ms.subservice: workloads
ms.date: 04/14/2021
---

# Provision BareMetal for Oracle

In this article, we'll look at how to provision your BareMetal Infrastructure instances for Oracle workloads. 

The first step to provision your BareMetal instances is to work with your Microsoft CSA. They'll help you based on your specific workload needs and the architecture you're deploying, whether single instance, One Node RAC, or RAC. For more information on these topologies, see [Architecture of BareMetal Infrastructure for Oracle](oracle-baremetal-architecture.md).

## Prerequisites

> [!div class="checklist"]
> * An active Azure subscription
> * Microsoft Premier support contract
> * Licenses for Red Hat Enterprise Linux 7.6
> * Oracle support contract 
> * Licenses and software installation components for Oracle
> * ExpressRoute connected **on-premises to Azure** (**Optionally**, configure ExpressRoute Global Reach for direct connectivity from on-premises to the Oracle Database)   
> * Virtual network
> * Gateway creation
> * Virtual machines (VMs) in the virtual network (jump boxes)

## Information to provide Microsoft Operations

You'll need to provide the following information to your CSA:

1. Virtual network address space. This range must be /24 subnet; for example, 10.11.0.0/24.
2. P2P range. This range must be a /29 subnet; for example, 10.12.0.0/29.
3. Server IP address pool. The recommended range is /24; for example, 10.13.0.0/24.
4. Server IP address. Pick an IP address from the Server IP address pool.

    > [!Note] 
    > The first thirty IP addresses are reserved for Microsoft infrastructure configuration. So, in this example, your first available IP address for a blade would be 10.13.0.30.

5. The Azure Region required; for example, West US2.
6. The BareMetal Infrastructure SKU required; for example, S192 (two machines).

## Storage requirements

Work with your CSA representative for your storage needs during the provisioning request, including expected storage needs based on future growth. Added storage is in 1-TB increments.

For volumes, we follow Oracle's [Optimal Flexible Architecture (OFA) standard](https://docs.oracle.com/en/database/oracle/oracle-database/19/ladbi/about-the-optimal-flexible-architecture-standard.html#GUID-6619CDB7-9667-426E-8471-5A996707D093), with Basic tier and Enterprise configuration. If you have custom storage requirements other than standard "T-shirt sizing," make your custom request through your CSA.

| Basic Configuration(POC/ Testing) | Description | Small | Medium | Large |
| --- | --- | --- | --- | --- |
| /u01 | Oracle binaries | 500 GB | 500 GB | 500 GB |
| /u02 | Read Intensive/Admin | 500 GB | 1 TB | 5 TB |
| /u03 | Write Intensive/Logs | 500 GB | 1 TB | 5 TB |
| /u09 | Backup | 5 TB | 10 TB | 15 TB |

| Enterprise Configuration | Description | Small | Medium | Large | Extra Large |
| --- | --- | --- | --- | --- | --- |
| /u01 | Oracle binaries | 500 GB | 500 GB | 500 GB | 500 GB |
| /u02 | Admin | 100 GB | 100 GB | 100 GB | 100 GB |
| /u10 to /u59 | Read Intensive | 500 GB | 5 TB | 10 TB | 20 TB |
| /u60 to /u89 | Write Intensive | 500 GB | 5 TB | 10 TB | 20 TB |
| /u90 to /u91 | Redo Logs | 500 GB | 500 GB | 1 TB | 1 TB |
| /u95 | Archive | 10 TB | 10 TB | 20 TB | 20 TB |
| /u98 | Backup | 25 TB | 25 TB | 50 TB | 50 TB |

## Next step

Learn more about BareMetal Infrastructure for Oracle.

> [!div class="nextstepaction"]
> [What is BareMetal Infrastructure on Azure?](../../concepts-baremetal-infrastructure-overview.md)
