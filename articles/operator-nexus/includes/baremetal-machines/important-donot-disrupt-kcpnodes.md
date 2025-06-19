---
author: omarrivera
ms.author: omarrivera
ms.date: 03/26/2025
ms.topic: include
ms.service: azure-operator-nexus
---

> [!IMPORTANT]
> Multiple disruptive command requests against a Kubernetes Control Plane (KCP) node are rejected.
> This check is done to maintain the integrity of the Nexus Cluster instance and avoid multiple KCP nodes become nonoperational at once due to simultaneous disruptive actions.
> Rejected disruptive action commands can be due to either already running against another KCP node or if the full KCP isn't available.
> If multiple nodes become nonoperational, it breaks the healthy quorum threshold of the Kubernetes Control Plane.
>
> The actions listed are considered disruptive to BareMetal Machines (BMM):
>
> - **Power off a BMM**
> - **Restart a BMM**
> - **Make a BMM unschedulable (cordon with evacuate, drains the node)**
> - **Reimage a BMM**
> - **Replace a BMM**
>
> Leaving only the nondisruptive actions:
> - Start a BMM
> - Make a BMM unschedulable (cordon without evacuate, doesn't drain node)
> - Make a BMM schedulable (uncordon)
