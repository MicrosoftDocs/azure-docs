---
title: Ethernet configuration of BareMetal for Oracle
description: Learn about the configuration of Ethernet interfaces on BareMetal instances for Oracle workloads.
ms.topic: reference
ms.subservice: workloads
ms.date: 04/14/2021
---

# Ethernet configuration of BareMetal for Oracle

In this article, we'll look at the configuration of Ethernet interfaces on BareMetal instances for Oracle workloads.

Each provisioned BareMetal instance for Oracle comes pre-configured with sets of Ethernet interfaces. The Ethernet interfaces are categorized into four types:

- Used for or by client access.
- Used for node-to-node communication. This interface is configured on all servers  irrespective of the topology requested. It is used only for scale-out scenarios.
- Used for node-to-storage connectivity.
- Used for disaster recovery (DR) setup and connectivity to global reach for cross-region connectivity.

## Architecture

The following diagram illustrates the architecture of the BareMetal Infrastructure pre-configured Ethernet interfaces. 

[![Diagram showing the architecture of the pre-configured Ethernet interfaces for Oracle workloads.](media/oracle-baremetal-ethernet/architecture-ethernet.png)](media/oracle-baremetal-ethernet/architecture-ethernet.png#lightbox)

The default configuration comes with one client IP interface (eth1), connecting from your Azure Virtual Network (VNET) by which you can use Secure Shell (SSH) to access a BareMetal instance.

> [!NOTE]
> For another client interface (eth10) from a different Azure VNET, contact your Microsoft CSA to submit a service request. For instance, if you want development/test as well as production/DR environments.

| **NIC logical interface** | **Name with RHEL OS** | **Use case** |
| --- | --- | --- |
| A | eth1.tenant | Client to BareMetal instance |
| C | eth2.tenant | Node-to-storage; supports the coordination and access to the storage controllers for management of the storage environment. |
| B | eth3.tenant | Node-to-node (Private interconnect) |
| C | eth4.tenant | Reserved/ iSCSI |
| C | eth5.tenant | Reserved/ Log Backup |
| C | eth6.tenant | Node-to-storage_Data Backup (RMAN, Snapshot) |
| C | eth7.tenant | Node-to-storage_dNFS-Pri; provides connectivity with the NetApp storage array. |
| C | eth8.tenant | Node-to-storage_dNFS-Sec; provides connectivity with the NetApp storage array. |
| D | eth9.tenant | DR connectivity for Global reach setup for accessing BMI in another region. |
| A | \*eth10.tenant | \* Client to BareMetal instance
 |

If necessary, you can define more network interface controller (NIC) cards on your own. However, the configurations of existing NICs *can't* be changed.

## Usage rules

For BareMetal instances, the default will have nine assigned IP addresses on the four logical NICs. The following usage rules apply:

- Ethernet "A" should have an assigned IP address that is outside of the server IP pool address range that you submitted to Microsoft. This IP address shouldn't be maintained in the etc/hosts directory of the OS.
- Ethernet "B" should be maintained exclusively in the etc/hosts directory for communication between the various instances. Maintain these IP addresses in scale-out Oracle Real Application Clusters (RAC) configurations as the IP addresses used for the inter-node configuration.
- Ethernet "C" should have an assigned IP address that is used for communication to NFS storage. This type of address shouldn't be maintained in the etc/hosts directory.
- Ethernet "D" should be used exclusively for global reach setup towards accessing BareMetal instances in your DR region.

## Next step

Learn more about BareMetal Infrastructure for Oracle architecture.

> [!div class="nextstepaction"]
> [Architecture of BareMetal Infrastructure for Oracle](oracle-baremetal-architecture.md)
