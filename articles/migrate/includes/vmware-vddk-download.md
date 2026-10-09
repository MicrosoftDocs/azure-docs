---
author: molishv
ms.author: molir
ms.topic: include
ms.service: azure-migrate
ms.date: 10/07/2026
---

**Configure the appliance for migration**: Turn off the toggle if you plan to use the appliance only for discovery and assessment. Turn on the toggle if you plan to use the appliance for agentless migration. When the toggle is turned on, the appliance checks whether the VMware vSphere Virtual Disk Development Kit (VDDK) is extracted to `C:\Program Files\VMware\VMware Virtual Disk Development Kit`. Ensure that the VDDK version is compatible with your vCenter Server version. If you use VDDK 9, you must also install the [Microsoft Visual C++ 14.5 Redistributable](https://aka.ms/vc14/vc_redist.x64.exe).

> [!IMPORTANT]
> If the requirements for agentless migration can't be met, use [agent-based migration](../tutorial-migrate-vmware-agent.md).
