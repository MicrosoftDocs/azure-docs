---
title: Patching considerations for BareMetal for Nutanix  
description: Learn about operating system/kernel patching considerations for BareMetal Infrastructure for Nutanix.
ms.topic: reference
ms.subservice: baremetal-nutanix
ms.date: 10/06/2021
---

# Patching considerations for BareMetal for Nutanix

In this article, we'll look at important operating system (OS)/kernel patching considerations for BareMetal Infrastructure for Nutanix.

For proper network performance and system stability, install the OS-specific version of eNIC and fNIC drivers. See the following compatibility table. 

Servers are delivered to customers with compatible versions. However, during OS/kernel patching, drivers can be rolled back to the default driver versions. So be sure to confirm that the correct driver version is running after OS/kernel patching.

| OS Vendor | OS Package Version | Firmware Version | eNIC Driver | fNIC Driver |
| --- | --- | --- | --- | --- |
| Red Hat | RHEL 7.6 | 3.2.3i | 2.3.0.53 | 1.6.0.34 |
| Red Hat | RHEL 7.6 | 4.1.1b | 2.3.0.53 | 1.6.0.34 |
| Red Hat | RHEL 7.6 | 4.1.1b | 4.0.0.8  | 2.0.0.60 |

## Next steps

Learn about the Ethernet configuration of BareMetal for Nutanix.

> [!div class="nextstepaction"]
> [Ethernet configuration of BareMetal for Nutanix](nutanix-baremetal-ethernet.md)

