---
author: greglin
description: include file for Application Gateway for Containers - Managed by ALB deployment
ms.topic: include
ms.date: 7/7/2023
ms.author: greglin
---

1. Create ApplicationLoadBalancer kubernetes resource
Now that you have successfully installed a ALB Controller, let's create an ApplicationLoadBalancer custom resource which will create an Application Gateway For Containers resource in your subscription.

Create a namespace

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: alb-test-infra
EOF
```

1. Create an ApplicationLoadBalancer custom resource

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

1. Once the ApplicationLoadBalancer object has been created, you will notice that it has a Deployment InProgress state and finally has a Deployment Ready state. It can take 5-6 minutes for the Application Gateway For Containers resource to be created.

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
