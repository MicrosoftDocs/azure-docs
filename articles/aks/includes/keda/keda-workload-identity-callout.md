---
author: nickomang
ms.service: azure-kubernetes-service
ms.topic: include
ms.date: 11/02/2023
ms.author: nickoman
---

> [!NOTE]
> If you're using [Microsoft Entra Workload ID](/azure/aks/workload-identity-overview) and you enable KEDA before Workload ID, you need to restart the KEDA operator pods so the proper environment variables can be injected:
>
> 1. Restart the pods by running `kubectl rollout restart deployment keda-operator -n kube-system`.
>
> 1. Obtain KEDA operator pods using `kubectl get pod -n kube-system` and finding pods that begin with `keda-operator`.
>
> 1. Verify successful injection of the environment variables by running `kubectl describe pod <keda-operator-pod> -n kube-system`.
> Under `Environment`, you should see values for `AZURE_TENANT_ID`, `AZURE_FEDERATED_TOKEN_FILE`, and `AZURE_AUTHORITY_HOST`.