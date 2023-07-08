---
title: 'Quickstart: Create Application Gateway for Containers managed by ALB Controller'
titlesuffix: Azure Application Load Balancer
description: In this quickstart, you learn how to provision the Application Gateway for Containers resources via Kubernetes definition.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: quickstart
ms.date: 7/7/2023
ms.author: greglin
---

# Quickstart: Create Application Gateway for Containers managed by ALB Controller

This guide assumes you're following the "managed by ALB controller" deployment strategy, where all the Application Gateway for Containers resources are managed by ALB controller and lifecycle is determined by definition of the resources defined in Kubernetes.  ALB Controller creates the Application Gateway for Containers resource when an _ApplicationLoadBalancer_ custom resource is defined on the cluster. Application Gateway for Containers' lifecycle is based on the lifecycle of the custom resource.

## Prerequisites

Ensure you have first deployed ALB Controller into your Kubernetes cluster.  You may follow the [Quickstart: Deploy Application Gateway for Containers ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md) guide if you haven't yet deployed the ALB Controller.

## Create ApplicationLoadBalancer kubernetes resource

1. Define the Kubernetes namespace for the ApplicationLoadBalancer resource

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: alb-test-infra
EOF
```

2. Define the _ApplicationLoadBalancer_ resource, specifying the subnet ID the Application Gateway for Containers association resource should deploy into.  The association establishes connectivity from Application Gateway for Containers to the defined subnet (and connected networks where applicable) to be able to proxy traffic to a defined backend.

```bash
kubectl apply -f - <<EOF
apiVersion: alb.networking.azure.io/v1
kind: ApplicationLoadBalancer
metadata:
  name: alb-test
  namespace: alb-test-infra
spec:
  associations:
  - $albSubnetId
EOF
```

## Validate creation of the Application Gateway for Containers resources

Once the _ApplicationLoadBalancer_ resource has been created, you can track deployment progress of the Application Gateway for Containers resources. The deployment transitions from _InProgress_ to _Ready_ state when provisioning has completed. It can take 5-6 minutes for the Application Gateway For Containers resource to be created.

You can check the status of the _ApplicationLoadBalancer_ resource by running the following command:

```bash
kubectl get applicationloadbalancer alb-test -n alb-test-infra -o yaml -w
```

Example output of a successful provisioning of the Application Gateway for Containers resource from Kubernetes.
```yaml
status:
  conditions:
  - lastTransitionTime: "2023-06-19T21:03:29Z"
    message: Valid Application Gateway for Containers resource
    observedGeneration: 1
    reason: Accepted
    status: "True"
    type: Accepted
  - lastTransitionTime: "2023-06-19T21:03:29Z"
    message: alb-id=/subscriptions/xxx/resourceGroups/yyy/providers/Microsoft.ServiceNetworking/trafficControllers/alb-zzz
    observedGeneration: 1
    reason: Ready
    status: "True"
    type: Deployment
```

## Next steps

Congratulations, you have installed ALB Controller on your cluster and deployed the Application Gateway for Containers resources in Azure!

Try out a few of the how-to guides to deploy a sample application, demonstrating some of Application Gateway for Container's load balancing concepts.
- [Backend MTLS](how-to-backend-mtls.md)
- [SSL/TLS Offloading](how-to-ssl-offloading.md)
- [Traffic Splitting / Weighted Round Robin](how-to-traffic-splitting.md)
