---
author: paulbouwer

ms.topic: include
ms.date: 11/15/2019
ms.author: pabouwer
---

To delete the secrets, run the following command:

```bash
kubectl get secret --all-namespaces -o json | jq '.items[].metadata | ["kubectl delete secret -n", .namespace, .name] | join(" ")' -r | fgrep "istio." | xargs -t0 bash -c
```