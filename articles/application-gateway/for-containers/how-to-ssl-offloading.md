---

title: SSL Offloading with Application Gateway for Containers
titlesuffix: Azure Application Load Balancer
description: Learn how to configure SSL Offloading with Application Gateway for Containers.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: how-to
ms.date: 7/7/2023
ms.author: greglin
---

# SSL Offloading with Application Gateway for Containers

This document helps set up an example application that uses the following resources from Gateway API:
- [Gateway](https://gateway-api.sigs.k8s.io/concepts/api-overview/#gateway) - creating a gateway with one https listener
- [HTTPRoute](https://gateway-api.sigs.k8s.io/v1alpha2/api-types/httproute/) - creating an HTTP route that references a backend service

## Prerequisites
1. Ensure you have set up your Application Gateway for Containers resources and ALB Controller by following either of the following quickstart guides:
- [Quickstart ALB managed deployment](quickstart-create-application-gateway-for-containers-alb-managed.md)
- [Quickstart bring your own deployment](quickstart-create-application-gateway-for-containers-byo-deployment.md)

2. Deploy sample HTTPS Application
    Apply the following deployment.yaml file on your cluster:
    ```bash
    kubectl apply -f https://trafficcontrollerdocs.blob.core.windows.net/examples/https-scenario/ssl-termination/deployment.yaml
    ```
    
    This command creates the following on your cluster:
    - a namespace called `test-infra`
    - 1 service called `echo` in the `test-infra` namespace
    - 1 deployment called `echo` in the `test-infra` namespace
    - 1 secret called `listener-tls-secret` in the `test-infra` namespace

## Deploy the required gateway api objects

# [ALB managed deployment](#tab/alb-managed)

1. Create a Gateway
    ```bash
    kubectl apply -f - <<EOF
    apiVersion: gateway.networking.k8s.io/v1beta1
    kind: Gateway
    metadata:
      name: gateway-01
      namespace: test-infra
      annotations:
        alb.networking.azure.io/alb-namespace: alb-test-infra
        alb.networking.azure.io/alb-name: alb-test
    spec:
      gatewayClassName: azure-alb-external
      listeners:
      - name: https-listener
        port: 443
        protocol: HTTPS
        allowedRoutes:
          namespaces:
            from: Same
        tls:
          mode: Terminate
          certificateRefs:
          - kind : Secret
            group: ""
            name: listener-tls-secret
    EOF
    ```

    Once the gateway object has been created check the status on the object to ensure that the gateway is valid, and the listener is ready. Verify an address has been assigned to the gateway.
```yaml
status:
  addresses:
  - type: IPAddress
    value: xxxx.yyyy.trafficcontroller.azure.com
  conditions:
  - lastTransitionTime: "2023-06-19T21:04:55Z"
    message: Valid Gateway
    observedGeneration: 1
    reason: Accepted
    status: "True"
    type: Accepted
  - lastTransitionTime: "2023-06-19T21:04:55Z"
    message: Application Gateway For Containers resource has been successfully updated.
    observedGeneration: 1
    reason: Programmed
    status: "True"
    type: Programmed
  - lastTransitionTime: "2023-06-19T21:04:55Z"
    message: Application Gateway For Containers resource has been successfully updated.
    observedGeneration: 1
    reason: Ready
    status: "True"
    type: Ready
  listeners:
  - attachedRoutes: 0
    conditions:
    - lastTransitionTime: "2023-06-19T21:04:55Z"
      message: ""
      observedGeneration: 1
      reason: ResolvedRefs
      status: "True"
      type: ResolvedRefs
    - lastTransitionTime: "2023-06-19T21:04:55Z"
      message: Listener is accepted
      observedGeneration: 1
      reason: Accepted
      status: "True"
      type: Accepted
    - lastTransitionTime: "2023-06-19T21:04:55Z"
      message: Application Gateway For Containers resource has been successfully updated.
      observedGeneration: 1
      reason: Programmed
      status: "True"
      type: Programmed
    - lastTransitionTime: "2023-06-19T21:04:55Z"
      message: Application Gateway For Containers resource has been successfully updated.
      observedGeneration: 1
      reason: Ready
      status: "True"
      type: Ready
    name: https-listener
    supportedKinds:
    - group: gateway.networking.k8s.io
      kind: HTTPRoute
```


# [Bring your own (BYO) deployment](#tab/byo)

1. Set the following environment variables

```bash
RESOURCE_GROUP='<resource group name of the Application Gateway For Containers resource>'
RESOURCE_NAME='test-alb'

RESOURCE_ID=$(az network alb show --resource-group $RESOURCE_GROUP --name $RESOURCE_NAME --query id -o tsv)
FRONTEND_NAME='frontend'
```

2. Create a Gateway
```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1beta1
kind: Gateway
metadata:
  name: gateway-01
  namespace: test-infra
  annotations:
    alb.networking.azure.io/alb-id: $RESOURCE_ID
spec:
  gatewayClassName: azure-alb-external
  listeners:
  - name: https-listener
    port: 443
    protocol: HTTPS
    allowedRoutes:
      namespaces:
        from: Same
    tls:
      mode: Terminate
      certificateRefs:
      - kind : Secret
        group: ""
        name: listener-tls-secret
  addresses:
  - type: alb.networking.azure.io/alb-frontend
    value: $FRONTEND_NAME
EOF
```

---

Once the gateway has been created, create an HTTPRoute
```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
  name: https-route
  namespace: test-infra
spec:
  parentRefs:
  - name: gateway-01
  rules:
  - backendRefs:
    - name: echo
      port: 80
EOF
```

Once the HTTPRoute object has been created check the status on the object to ensure that the route is accepted via kubectl command:
```bash
kubectl get httproute https-route -n test-infra -o yaml
```

Verify the status of the Application Gateway for Containers resource has been successfully updated.

```yaml
status:
  parents:
  - conditions:
    - lastTransitionTime: "2023-06-19T22:18:23Z"
      message: ""
      observedGeneration: 1
      reason: ResolvedRefs
      status: "True"
      type: ResolvedRefs
    - lastTransitionTime: "2023-06-19T22:18:23Z"
      message: Route is Accepted
      observedGeneration: 1
      reason: Accepted
      status: "True"
      type: Accepted
    - lastTransitionTime: "2023-06-19T22:18:23Z"
      message: Application Gateway For Containers resource has been successfully updated.
      observedGeneration: 1
      reason: Ready
      status: "True"
      type: Ready
    controllerName: alb.networking.azure.io/alb-controller
    parentRef:
      group: gateway.networking.k8s.io
      kind: Gateway
      name: gateway-01
      namespace: test-infra
  ```

## Test access to the application

Now we're ready to send some traffic to our sample application, via the FQDN assigned to the frontend. Use the command below to get the FQDN.

```bash
fqdn=$(kubectl get gateway gateway-01 -n test-infra -o jsonpath='{.status.addresses[0].value}')
```

Curling this FQDN should return responses from the backend as configured on the HTTPRoute.

```bash
curl --insecure https://$fqdn/
```

Congratulations, you have installed ALB Controller, deployed a backend application and routed traffic to the application via the ingress on Application Gateway for Containers.
