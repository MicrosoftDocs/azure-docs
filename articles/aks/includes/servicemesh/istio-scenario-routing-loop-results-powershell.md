---
author: paulbouwer
services: container-service
ms.topic: include
ms.date: 10/9/2019
ms.author: pabouwer
---

```powershell
$INGRESS_IP="20.188.211.19"
(1..5) |% { (Invoke-WebRequest -Uri $INGRESS_IP).Content.Split("`n") | Select-String -Pattern "results" }
```