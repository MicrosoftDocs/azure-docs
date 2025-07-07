---
title: WebSocket protocol and Azure Application Gateway for Containers - Gateway API
description: Learn how to send a WebSocket request to a backend target with Application Gateway for Containers.
services: application gateway
author: mbender-ms
ms.service: azure-appgw-for-containers
ms.topic: conceptual
ms.date: 1/14/2025
ms.author: mbender
# Customer intent: As a cloud architect, I want to deploy and configure WebSocket support with Application Gateway for Containers, so that I can ensure reliable communication between my applications and backend services.
---

# WebSocket request for Azure Application Gateway for Containers - Gateway API

Application Gateway for Containers allows you to leverage WebSocket protocol to connect to backend targets with Application Gateway for Containers.

## Usage details

WebSocket protocol has no specific implementation with Gateway API for configuration or enablement. However, you can use this how-to guide to understand the end-to-end configuration and proper health probe configuration. This ensures WebSocket requests are properly handled by a backend service.

## Prerequisites

1. If following the BYO deployment strategy, ensure you set up your Application Gateway for Containers resources and [ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md).
2. If following the ALB managed deployment strategy, ensure you provision your [ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md) and provision the Application Gateway for Containers resources via the  [ApplicationLoadBalancer custom resource](quickstart-create-application-gateway-for-containers-managed-by-alb-controller.md).
3. Deploy sample HTTP and WebSocket application:

   Apply the following deployment.yaml file on your cluster to create a sample web application to demonstrate WebSocket support.

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/refs/heads/main/articles/application-gateway/for-containers/examples/websocket-scenario/deployment.yaml
    ```
  
   This command creates the following on your cluster:

   - A namespace called `test-infra`
   - One service called `websocket-backend` in the `test-infra` namespace
   - One deployment called `websocket-backend` in the `test-infra` namespace

## Deploy the required Gateway API resources

# [ALB managed deployment](#tab/alb-managed)

1. Create a Gateway

    ```bash
    kubectl apply -f - <<EOF
    apiVersion: gateway.networking.k8s.io/v1
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
      - name: http-listener
        port: 80
        protocol: HTTP
        allowedRoutes:
          namespaces:
            from: Same
    EOF
    ```

[!INCLUDE [application-gateway-for-containers-frontend-naming](../../../includes/application-gateway-for-containers-frontend-naming.md)]

# [Bring your own (BYO) deployment](#tab/byo)

1. Set the following environment variables

    ```bash
    RESOURCE_GROUP='<resource group name of the Application Gateway For Containers resource>'
    RESOURCE_NAME='alb-test'

    RESOURCE_ID=$(az network alb show --resource-group $RESOURCE_GROUP --name $RESOURCE_NAME --query id -o tsv)
    FRONTEND_NAME='frontend'
    ```

2. Create a Gateway

    ```bash
    kubectl apply -f - <<EOF
    apiVersion: gateway.networking.k8s.io/v1
    kind: Gateway
    metadata:
      name: gateway-01
      namespace: test-infra
      annotations:
        alb.networking.azure.io/alb-id: $RESOURCE_ID
    spec:
      gatewayClassName: azure-alb-external
      listeners:
      - name: http-listener
        port: 80
        protocol: HTTP
        allowedRoutes:
          namespaces:
            from: Same
      addresses:
      - type: alb.networking.azure.io/alb-frontend
        value: $FRONTEND_NAME
    EOF
    ```

---

Once the gateway resource is created, ensure the status is valid, the listener is _Programmed_, and an address is assigned to the gateway.

```bash
kubectl get gateway gateway-01 -n test-infra -o yaml
```

Example output of successful gateway creation.

```yaml
status:
  addresses:
  - type: Hostname
    value: xxxx.yyyy.alb.azure.com
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
    name: https-listener
    supportedKinds:
    - group: gateway.networking.k8s.io
      kind: HTTPRoute
```

Once the gateway is created, create an HTTPRoute resource for `contoso.com`.

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: websocket-example
  namespace: test-infra
spec:
  parentRefs:
  - name: gateway-01
  hostnames:
  - "contoso.com"
  rules:
    - backendRefs:
        - name: websocket-backend
          port: 8080
EOF
```

When the HTTPRoute resource is created, ensure the HTTPRoute resource shows _Accepted_ and the Application Gateway for Containers resource is _Programmed_.

```bash
kubectl get httproute websocket-example -n test-infra -o yaml
```

Verify the Application Gateway for Containers resource is successfully updated for the HTTPRoute.

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
      reason: Programmed
      status: "True"
      type: Programmed
    controllerName: alb.networking.azure.io/alb-controller
    parentRef:
      group: gateway.networking.k8s.io
      kind: Gateway
      name: gateway-01
      namespace: test-infra
  ```

For this example, health checks are exposed on the path `/health`. To ensure Application Gateway for Containers can validate the health of this application, define a HealthCheckPolicy resource for the HTTP path of `/health`.

```bash
kubectl apply -f - <<EOF
apiVersion: alb.networking.azure.io/v1
kind: HealthCheckPolicy
metadata:
  name: websockets-backend-health-check-policy
  namespace: test-infra
spec:
  targetRef:
    group: ""
    kind: Service
    name: websocket-backend
    namespace: test-infra
  default:
    interval: 5s
    timeout: 3s
    healthyThreshold: 1
    unhealthyThreshold: 1
    http:
      path: /health 
EOF
```

When the HealthCheckPolicy resource is created, ensure the HealthCheckPolicy resource shows _Accepted_ and the Application Gateway for Containers resource is _Programmed_.

```bash
kubectl get httproute websocket-example -n test-infra -o yaml
```

Verify the Application Gateway for Containers HealthCheckPolicy is successfully updated.

```yaml
  status:
    conditions:
    - lastTransitionTime: "2024-10-29T16:40:34Z"
      message: Valid HealthCheckPolicy
      observedGeneration: 1
      reason: Accepted
      status: "True"
      type: Accepted
  ```

## Test access to the application

Now we're ready to send some traffic to our sample application, via the FQDN assigned to the frontend. Use the following command to get the FQDN and resolve its IP address.

```bash
fqdn=$(kubectl get gateway gateway-01 -n test-infra -o jsonpath='{.status.addresses[0].value}')
fqdnIp=$(dig +short $fqdn)
```

Obtain the websocket utility to make a websocket request. For example purposes, the latest version of the utility is downloaded and marked as executable in a linux home directory instead of installed locally on the machine. This enables you to use the utility via Cloud Shell.

```bash
wget -O ~/websocat https://github.com/vi/websocat/releases/latest/download/websocat.x86_64-unknown-linux-musl
chmod a+x ~/websocat
```

Call the websocket utility to make a websocket request. In this example, a chat application is exposed on the path `/chat`, where the application responds back with the text sent.

```bash
./websocat -t - --ws-c-uri=ws://contoso.com/chat ws-c:tcp:$fqdnIp:80
```

Once connected, type `Hello world!!!`

Via the response we should see the same response:

```
Hello world!!!
```

Use the keystroke combination Control + C to break out of the websocat utility.

Congratulations, you have installed ALB Controller, deployed a backend application and used the WebSocket protocol to establish a connection to a backend target on Application Gateway for Containers.
