---
title: Patching considerations for BareMetal for Oracle  
description: Learn about operating system/kernel patching considerations for BareMetal Infrastructure for Oracle.
ms.topic: reference
ms.subservice: workloads
ms.date: 04/14/2021
---

# Patching considerations for BareMetal for Oracle

In this article, we'll look at important operating system/kernel patching considerations for BareMetal Infrastructure for Oracle.

For proper network performance and system stability, install the OS-specific version of eNIC and fNIC drivers as shown in following compatibility table. 

Servers are delivered to customers with compatible versions. During operating system (OS)/kernel patching, however, drivers can be rolled back to the default driver versions. So be sure to confirm that the appropriate driver version is running following OS/kernel patching operations.

| OS Vendor | OS Package Version | Firmware Version | eNIC Driver | fNIC Driver |
| --- | --- | --- | --- | --- |
| Red Hat | RHEL 7.6 | 3.2.3i | 2.3.0.53 | 1.6.0.34 |
| Red Hat | RHEL 7.6 | 4.1.1b | 2.3.0.53 | 1.6.0.34 |

## Next steps

Learn about the Ethernet configuration of BareMetal for Oracle.

> [!div class="nextstepaction"]
> [Ethernet configuration of BareMetal for Oracle](oracle-baremetal-ethernet.md)

