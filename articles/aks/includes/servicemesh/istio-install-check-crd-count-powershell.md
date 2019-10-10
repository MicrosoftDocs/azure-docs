---
author: paulbouwer
services: container-service
ms.topic: include
ms.date: 10/9/2019
ms.author: pabouwer
---

```powershell
(kubectl get crds | Select-String -Pattern 'istio.io').Count
```