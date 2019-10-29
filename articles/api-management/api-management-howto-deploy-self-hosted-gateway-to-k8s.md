---
title: Deploy an Azure API Management self-hosted gateway to Kubernetes | Microsoft Docs
description: Learn how to deploy an API Management self-hosted gateway to Kubernetes
services: api-management
documentationcenter: ''
author: miaojiang
manager: gwallace
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 10/31/2019
ms.author: apimpm

---

# Deploy an Azure API Management self-hosted gateway to Kubernetes

This article walks through the steps to deploy an Azure API Management self-hosted gateway into a Kubernetes cluster.

## Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
- Create a Kubernetes cluster. You can use Azure Kubernetes Services, Minikube, or a Kubernetes cluster in a foreign cloud
- [Provision a gateway resource in your API Management instance](api-management-howto-provision-self-hosted-gateway.md)

Now that a gateway resource has been provisioned in your API Management instancel you can proceed to deploy the gateway node to your Kubernetes environment.

[!INCLUDE [api-management-self-hosted-gateway-token.md](../../includes/api-management-self-hosted-gateway-token.md)]

## Deploy the gateway to Kubernetes

1. Select the gateway resource that was created.
2. Click **Deployments**
3. Select **Kubernetes** under **Deployment scripts**
4. Download the yaml file
5. Run the below command to apply the configuration
```
    kubectl apply -f <gateway-name>.yaml
```
6. Run the below command to check the gateway pod is running:
```
kubectl get pods
NAME                              READY   STATUS    RESTARTS   AGE
<gateway-name>-55f774f844-bv9wt   1/1     Running   0          1m
```
7. Run the below command to check the gateway service is running:
```
kubectl get services
NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
<gatewayname     NodePort    10.110.230.87   <none>        80:32504/TCP,443:30043/TCP   1m
```
8. In the Azure Portal, you should also see 1 gateway node is running

![gateway status](media/api-management-howto-deploy-self-hosted-gateway-to-k8s/status.png)

## Next steps

* To learn more about the self-hosted gateway, see [Azure API Management self-hosted gateway overview](self-hosted-gateway-overview.md)
* Learn more about [Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/intro-kubernetes)


