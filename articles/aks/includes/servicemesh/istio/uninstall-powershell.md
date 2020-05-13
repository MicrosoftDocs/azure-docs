---
author: paulbouwer

ms.topic: include
ms.date: 11/15/2019
ms.author: pabouwer
---

To delete the secrets, run the following command:

```powershell
(kubectl get secret --all-namespaces -o json | ConvertFrom-Json).items.metadata |% { if ($_.name -match "istio.") { "Deleting {0}.{1}" -f $_.namespace, $_.name; kubectl delete secret -n $_.namespace $_.name } }
```
