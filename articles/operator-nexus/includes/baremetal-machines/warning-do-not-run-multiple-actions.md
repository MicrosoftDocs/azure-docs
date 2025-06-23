---
author: omarrivera
ms.author: omarrivera
ms.date: 03/26/2025
ms.topic: include
ms.service: azure-operator-nexus
---

> [!WARNING]
> Don't run more than one `baremetalmachine replace` or `reimage` command at the same time for the same BareMetal Machine (BMM) resource.
> Executing `replace` at the same time as a `reimage` leaves servers in a nonoperational state.
> Make sure any `replace`/`reimage` on the BMM completes fully before starting another one.
> Additionally, avoid executing sequential `reimage` actions on a BMM that just completed a `replace` action unless specified maintenance operation is being performed.
