---
author: molishv
ms.author: molir
ms.topic: include
ms.service: azure-migrate
ms.date: 08/25/2026
---

**Install the VDDK**: The appliance checks if the VMware vSphere Virtual Disk Development Kit (VDDK) is installed. Download VDDK version 8.0 or 9.0 from the [Broadcom Developer portal](https://developer.broadcom.com/sdks/vmware-virtual-disk-development-kit-vddk/8.0). After downloading, extract the zip file to the default location: `C:\Program Files\VMware\VMware Virtual Disk Development Kit`, as described in the installation instructions. Check the vCenter Server compatibility with the VDDK version. If you installed VDDK 9, you must also install the [Microsoft Visual C++ 14.5 Redistributable](https://aka.ms/vc14/vc_redist.x64.exe).

> [!IMPORTANT]
> Broadcom might restrict download access to VMware vSphere Virtual Disk Development Kit (VDDK) packages. Organizations that already downloaded a supported VDDK package can continue to use it for agentless migration. If your organization can't download a supported VDDK package, use [agent-based migration](../tutorial-migrate-vmware-agent.md).
