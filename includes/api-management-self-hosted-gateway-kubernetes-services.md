---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 05/22/2023
ms.author: danlep
---
## Confirm that the gateway is running

1. Run the following command to check if the deployment succeeded. It might take a little time for all the objects to be created and for the pods to initialize.

    ```console
    kubectl get deployments
    ```
    It should return
    ```console
    NAME             READY   UP-TO-DATE   AVAILABLE   AGE
    <gateway-name>   1/1     1            1           18s
    ```
1. Run the following command to check if the services were successfully created. Your service IPs and ports will be different.

    ```console
    kubectl get services
    ```
    It should return
    ```console
    NAME                                TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
    <gateway-name>-live-traffic         ClusterIP      None            <none>        4290/UDP,4291/UDP   9m1s
    <gateway-name>-instance-discovery   LoadBalancer   10.99.236.168   <pending>     80:31620/TCP,443:30456/TCP   9m1s
    ```
1. Go back to the Azure portal and select **Overview**.
1. Confirm that **Status** shows a green check mark, followed by a node count that matches the number of replicas specified in the YAML file. This status means the deployed self-hosted gateway pods are successfully communicating with the API Management service and have a regular "heartbeat."
    :::image type="content" source="./media/api-management-self-hosted-gateway-kubernetes-services/status.png" alt-text="Screenshot showing status of self-hosted gateway in the portal.":::

> [!TIP]
> * Run the `kubectl logs deployment/<gateway-name>` command to view logs from a randomly selected pod if there's more than one.
> * Run `kubectl logs -h` for a complete set of command options, such as how to view logs for a specific pod or container.