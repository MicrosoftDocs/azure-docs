---
author: paulbouwer

ms.topic: include
ms.date: 10/09/2019
ms.author: pabouwer
---

```bash
INGRESS_IP=20.188.211.19
for i in {1..5}; do curl -si $INGRESS_IP | grep results; done
```