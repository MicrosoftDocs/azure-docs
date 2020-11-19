---
author: paulbouwer

ms.topic: include
ms.date: 10/09/2019
ms.author: pabouwer
---

```powershell
$INGRESS_IP="20.188.211.19"
(1..5) |% { (Invoke-WebRequest -Uri $INGRESS_IP).Content.Split("`n") | Select-String -Pattern "results" }
```