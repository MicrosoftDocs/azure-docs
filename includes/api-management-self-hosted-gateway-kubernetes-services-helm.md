---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 02/17/2026
ms.author: danlep
---
### Confirm that the gateway is running

1. Run the following command to check the gateway pod is running. Your pod name will be different.

   ```console
   kubectl get pods
   NAME                                           READY     STATUS    RESTARTS   AGE
   azure-api-management-gateway-59f5fb94c-s9stz   1/1       Running   0          1m
   ```

1. Run the following command to check the gateway service is running. Your service name and IP addresses will be different.

    ```console
    kubectl get services
    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)               AGE
    azure-api-management-gateway   ClusterIP   10.0.229.55     <none>        8080/TCP,8081/TCP     1m
    ```

1. Return to the Azure portal and confirm that gateway node you deployed is reporting healthy status.

> [!TIP]
> Use `kubectl logs <gateway-pod-name>` command to view a snapshot of self-hosted gateway log.