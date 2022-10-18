---
title: Deploy a self-hosted gateway to Kubernetes with YAML
description: Learn how to deploy a self-hosted gateway component of Azure API Management to Kubernetes with YAML
author: dlepow
manager: gwallace
ms.service: api-management
ms.workload: mobile
ms.topic: article
ms.author: danlep
ms.date: 05/25/2021
---
# Deploy a self-hosted gateway to Kubernetes with YAML

This article describes the steps for deploying the self-hosted gateway component of Azure API Management to a Kubernetes cluster.

[!INCLUDE [preview](./includes/preview/preview-callout-self-hosted-gateway-deprecation.md)]

> [!NOTE]
> You can also deploy self-hosted gateway to an [Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md) as a [cluster extension](../azure-arc/kubernetes/extensions.md).

## Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
- Create a Kubernetes cluster, or have access to an existing one.
   > [!TIP]
   > [Single-node clusters](https://kubernetes.io/docs/setup/#learning-environment) work well for development and evaluation purposes. Use [Kubernetes Certified](https://kubernetes.io/partners/#conformance) multi-node clusters on-premises or in the cloud for production workloads.
- [Provision a self-hosted gateway resource in your API Management instance](api-management-howto-provision-self-hosted-gateway.md).

## Deploy to Kubernetes

1. Select **Gateways** under **Deployment and infrastructure**.
2. Select the self-hosted gateway resource that you want to deploy.
3. Select **Deployment**.
4. An access token in the **Token** text box was auto-generated for you, based on the default **Expiry** and **Secret key** values. If needed, choose values in either or both controls to generate a new token.
5. Select the **Kubernetes** tab under **Deployment scripts**.
6. Select the **\<gateway-name\>.yml** file link and download the YAML file.
7. Select the **copy** icon at the lower-right corner of the **Deploy** text box to save the `kubectl` commands to the clipboard.
8. Paste commands to the terminal (or command) window. The first command creates a Kubernetes secret that contains the access token generated in step 4. The second command applies the configuration file downloaded in step 6 to the Kubernetes cluster and expects the file to be in the current directory.
9. Run the commands to create the necessary Kubernetes objects in the [default namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) and start self-hosted gateway pods from the [container image](https://aka.ms/apim/shgw/registry-portal) downloaded from the Microsoft Artifact Registry.
10. Run the following command to check if the deployment succeeded. Note that it might take a little time for all the objects to be created and for the pods to initialize.

    ```console
    kubectl get deployments
    NAME             READY   UP-TO-DATE   AVAILABLE   AGE
    <gateway-name>   1/1     1            1           18s
    ```
11. Run the following command to check if the service was successfully created. Note that your service IPs and ports will be different.

    ```console
    kubectl get services
    NAME             TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
    <gateway-name>   LoadBalancer   10.99.236.168   <pending>     80:31620/TCP,443:30456/TCP   9m1s
    ```
1. Go back to the Azure portal and select **Overview**.
1. Confirm that **Status** shows a green check mark, followed by a node count that matches the number of replicas specified in the YAML file. This status means the deployed self-hosted gateway pods are successfully communicating with the API Management service and have a regular "heartbeat."

    ![Gateway status](media/how-to-deploy-self-hosted-gateway-kubernetes/status.png)

> [!TIP]
> Run the `kubectl logs deployment/<gateway-name>` command to view logs from a randomly selected pod if there's more than one.
> Run `kubectl logs -h` for a complete set of command options, such as how to view logs for a specific pod or container.

## Next steps

* To learn more about the self-hosted gateway, see [Self-hosted gateway overview](self-hosted-gateway-overview.md).
* Learn [how to deploy API Management self-hosted gateway to Azure Arc-enabled Kubernetes clusters](how-to-deploy-self-hosted-gateway-azure-arc.md).
* Learn more about guidance for [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md).
