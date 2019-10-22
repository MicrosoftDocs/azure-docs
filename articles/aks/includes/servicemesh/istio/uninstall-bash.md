---
author: paulbouwer
ms.service: container-service
ms.topic: include
ms.date: 10/09/2019
ms.author: pabouwer
---

To delete the CRDs, run the following command:

```bash
kubectl get crds -o name | grep 'istio.io' | xargs -n1 kubectl delete
```

To delete the secrets, run the following command:

```bash
kubectl get secret --all-namespaces -o json | jq '.items[].metadata | ["kubectl delete secret -n", .namespace, .name] | join(" ")' -r | fgrep "istio." | xargs -t0 bash -c
```