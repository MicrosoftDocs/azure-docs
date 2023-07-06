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

This guide assumes you are following the "managed by ALB controller" deployment strategy, where all the Application Gateway for Containers resources are managed by ALB controller and lifecycle is determine by definition of the the objects defined in Kubernetes.  ALB Controller will create Application Gateway for Containers resource when an _ApplicationLoadBalancer_ custom resource is defined on the cluster and its lifecycle will be based on the lifecycle of the custom resource.

## Create ApplicationLoadBalancer kubernetes resource

1. Define the Kubernetes namespace for the ApplicationLoadBalancer object

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: alb-test-infra
EOF
```

2. Define the _ApplicationLoadBalancer_ object, specifying the subnet ID the Application Gateway for Containers association resource should deploy into.  The association will establish connectivity from Application Gateway for Containers to the defined subnet (and connected networks where applicable) to be able to proxy traffic to a defined backend.

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

Once the _ApplicationLoadBalancer_ object has been created, you can track deployment progress of the Application Gateway for Containers resources. During provisioning, you will notice the deployment will transition between _InProgress_ and ultimately _Ready_ state once provision has completed. Please note, it can take 5-6 minutes for the Application Gateway For Containers resource to be created.

You can check the status of the _ApplicationLoadBalancer_ object by running the following command:

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
