---
title: Configure a multi-team shared gateway with Gateway API ListenerSet
description: Learn how to configure Application Gateway for Containers so platform teams can centrally manage gateway infrastructure while application teams independently manage listeners and routes.
services: application gateway
author: mbender-ms
ms.service: azure-application-gateway-containers
ms.topic: how-to
ms.date: 11/03/2026
ms.author: mbender
# Customer intent: As a platform engineer, I want to authorize application teams to manage their own listeners and routes on a centrally managed gateway, so that I can provide self-service application onboarding while retaining control of the infrastructure.
---

# Configure a multi-team shared gateway with Gateway API ListenerSet

This article shows you how to configure Application Gateway for Containers for multiple application teams. A platform administrator authorizes two application namespaces on a centrally managed Gateway. Each application team then creates its own Gateway API [`ListenerSet`](https://gateway-api.sigs.k8s.io/geps/gep-1713/) and `HTTPRoute` without modifying the parent Gateway.

For the operating model, ownership boundaries, attachment controls, conflict behavior, and isolation boundaries, see [Multi-team shared gateway](multi-team-shared-gateway.md).

> [!IMPORTANT]
> This multi-team model requires Gateway API. Application Gateway for Containers doesn't provide an equivalent ListenerSet-based delegation model through the Ingress API. If the applicable workloads currently use Ingress API, migrate their ingress configuration to Gateway API before following this article.

## Prerequisites

Before you begin, ensure you have:

1. If following the BYO deployment strategy, ensure you set up your Application Gateway for Containers resources and ALB Controller ([Add-on](quickstart-deploy-application-gateway-for-containers-alb-controller-addon.md) or [Helm](quickstart-deploy-application-gateway-for-containers-alb-controller-helm.md)).
2. If following the ALB managed deployment strategy, ensure you provision your ALB Controller ([Add-on](quickstart-deploy-application-gateway-for-containers-alb-controller-addon.md) or [Helm](quickstart-deploy-application-gateway-for-containers-alb-controller-helm.md)) and provision the Application Gateway for Containers resources via the  [ApplicationLoadBalancer custom resource](quickstart-create-application-gateway-for-containers-managed-by-alb-controller.md).

The following table shows the resources used in the examples:

| Resource | Value |
| --- | --- |
| Platform namespace | `test-infra` |
| Application namespaces | `team-a`, `team-b` |
| Gateway | `gateway-01` |
| ListenerSets | `team-a-listeners`, `team-b-listeners` |
| Listeners | `team-a-http`, `team-b-http` |
| HTTPRoutes | `team-a-route`, `team-b-route` |
| Hostnames | `team-a.contoso.com`, `team-b.contoso.com` |

If your resources use different values, update the manifests and commands.

## Create and authorize the application namespaces

Create the platform and application namespaces, and label both application namespaces so that the Gateway can select them:

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: test-infra
---
apiVersion: v1
kind: Namespace
metadata:
  name: team-a
  labels:
    gateway-access: shared
---
apiVersion: v1
kind: Namespace
metadata:
  name: team-b
  labels:
    gateway-access: shared
EOF
```

The Gateway configuration in the next section evaluates the `gateway-access=shared` label. This label doesn't grant Kubernetes permissions.

> [!NOTE]
> Use Kubernetes role-based access control (RBAC) to restrict each application team to its namespace and reserve write access to the parent Gateway for the platform team.

## Deploy the required Gateway API resources

# [ALB managed deployment](#tab/alb-managed)

Create a Gateway that uses the ALB managed Application Gateway for Containers resource and permits ListenerSets from labeled namespaces:

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
  allowedListeners:
    namespaces:
      from: Selector
      selector:
        matchLabels:
          gateway-access: shared
  listeners:
  - name: platform-http
    hostname: platform.contoso.com
    port: 80
    protocol: HTTP
    allowedRoutes:
      namespaces:
        from: Same
EOF
```

# [Bring your own (BYO) deployment](#tab/byo)

Set the following environment variables:

```bash
RESOURCE_GROUP='<resource group name of the Application Gateway for Containers resource>'
RESOURCE_NAME='alb-test'

RESOURCE_ID=$(az network alb show --resource-group $RESOURCE_GROUP --name $RESOURCE_NAME --query id -o tsv)
FRONTEND_NAME='frontend'
```

Create a Gateway that uses the existing Application Gateway for Containers frontend and permits ListenerSets from labeled namespaces:

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
  allowedListeners:
    namespaces:
      from: Selector
      selector:
        matchLabels:
          gateway-access: shared
  listeners:
  - name: platform-http
    hostname: platform.contoso.com
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

The Gateway's `allowedListeners` field permits ListenerSets only from namespaces with the `gateway-access=shared` label. The listener's `allowedRoutes` field independently controls which routes can attach to the platform-owned listener.

## Verify the Gateway status

Wait for the Gateway to be accepted and programmed:

```bash
kubectl wait gateway/gateway-01 \
  -n test-infra \
  --for=condition=Accepted \
  --timeout=5m

kubectl wait gateway/gateway-01 \
  -n test-infra \
  --for=condition=Programmed \
  --timeout=5m
```

Inspect the Gateway status:

```bash
kubectl get gateway gateway-01 -n test-infra -o yaml
```

Confirm that the Gateway reports `Accepted=True` and `Programmed=True`, the `platform-http` listener reports `Accepted=True` and `Programmed=True`, and an address is assigned to the Gateway. Before the application teams create their ListenerSets, `status.attachedListenerSets` is `0` or omitted.

## Deploy sample backends

Create a sample application and Service in its authorized namespace for each application team:

```bash
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: team-a-backend
  namespace: team-a
spec:
  replicas: 1
  selector:
    matchLabels:
      app: team-a-backend
  template:
    metadata:
      labels:
        app: team-a-backend
    spec:
      containers:
      - name: backend
        image: registry.k8s.io/echoserver:1.10
        ports:
        - name: http
          containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: team-a-backend
  namespace: team-a
spec:
  selector:
    app: team-a-backend
  ports:
  - name: http
    port: 80
    targetPort: 8080
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: team-b-backend
  namespace: team-b
spec:
  replicas: 1
  selector:
    matchLabels:
      app: team-b-backend
  template:
    metadata:
      labels:
        app: team-b-backend
    spec:
      containers:
      - name: backend
        image: registry.k8s.io/echoserver:1.10
        ports:
        - name: http
          containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: team-b-backend
  namespace: team-b
spec:
  selector:
    app: team-b-backend
  ports:
  - name: http
    port: 80
    targetPort: 8080
EOF
```

Wait for both backends to become available:

```bash
kubectl rollout status deployment/team-a-backend \
  -n team-a \
  --timeout=5m

kubectl rollout status deployment/team-b-backend \
  -n team-b \
  --timeout=5m
```

## Create ListenerSets

Create a ListenerSet in its authorized namespace for each application team. Each `parentRef` selects the same platform-owned Gateway:

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: ListenerSet
metadata:
  name: team-a-listeners
  namespace: team-a
spec:
  parentRef:
    group: gateway.networking.k8s.io
    kind: Gateway
    name: gateway-01
    namespace: test-infra
  listeners:
  - name: team-a-http
    hostname: team-a.contoso.com
    protocol: HTTP
    port: 80
    allowedRoutes:
      namespaces:
        from: Same
---
apiVersion: gateway.networking.k8s.io/v1
kind: ListenerSet
metadata:
  name: team-b-listeners
  namespace: team-b
spec:
  parentRef:
    group: gateway.networking.k8s.io
    kind: Gateway
    name: gateway-01
    namespace: test-infra
  listeners:
  - name: team-b-http
    hostname: team-b.contoso.com
    protocol: HTTP
    port: 80
    allowedRoutes:
      namespaces:
        from: Same
EOF
```

The Gateway accepts both ListenerSets because their namespaces have the label selected by `allowedListeners`. Each ListenerSet listener permits routes from only its own namespace.

Wait for both ListenerSets to be accepted and programmed:

```bash
kubectl wait listenerset/team-a-listeners \
  -n team-a \
  --for=condition=Accepted \
  --timeout=5m

kubectl wait listenerset/team-a-listeners \
  -n team-a \
  --for=condition=Programmed \
  --timeout=5m

kubectl wait listenerset/team-b-listeners \
  -n team-b \
  --for=condition=Accepted \
  --timeout=5m

kubectl wait listenerset/team-b-listeners \
  -n team-b \
  --for=condition=Programmed \
  --timeout=5m
```

Inspect the ListenerSet statuses:

```bash
kubectl get listenerset team-a-listeners -n team-a -o yaml
kubectl get listenerset team-b-listeners -n team-b -o yaml
```

Confirm that both ListenerSets report `Accepted=True` and `Programmed=True` and that the `team-a-http` and `team-b-http` listeners report `Accepted=True`, `ResolvedRefs=True`, and `Programmed=True`. A top-level accepted condition doesn't guarantee that every listener is valid.

The parent Gateway now reports two attached ListenerSets:

```bash
kubectl get gateway gateway-01 \
  -n test-infra \
  -o jsonpath='{.status.attachedListenerSets}{"\n"}'
```

The command returns:

```text
2
```

## Attach HTTPRoutes

As each application team, create an HTTPRoute whose `parentRefs` entry selects its ListenerSet and listener:

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: team-a-route
  namespace: team-a
spec:
  parentRefs:
  - group: gateway.networking.k8s.io
    kind: ListenerSet
    name: team-a-listeners
    sectionName: team-a-http
  hostnames:
  - team-a.contoso.com
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: team-a-backend
      port: 80
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: team-b-route
  namespace: team-b
spec:
  parentRefs:
  - group: gateway.networking.k8s.io
    kind: ListenerSet
    name: team-b-listeners
    sectionName: team-b-http
  hostnames:
  - team-b.contoso.com
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: team-b-backend
      port: 80
EOF
```

Inspect the route statuses:

```bash
kubectl get httproute team-a-route -n team-a -o yaml
kubectl get httproute team-b-route -n team-b -o yaml
```

Confirm that each route's parent status identifies its team's ListenerSet and reports `Accepted=True` and `ResolvedRefs=True`.

## Test the application listeners

Get the parent Gateway address:

```bash
GATEWAY_ADDRESS=$(kubectl get gateway gateway-01 \
  -n test-infra \
  -o jsonpath='{.status.addresses[0].value}')
```

Send a request with each application listener's hostname:

```bash
curl -i \
  -H 'Host: team-a.contoso.com' \
  "http://${GATEWAY_ADDRESS}/"

curl -i \
  -H 'Host: team-b.contoso.com' \
  "http://${GATEWAY_ADDRESS}/"
```

Each request returns `200 OK` from its team's sample backend. After you create DNS records that map `team-a.contoso.com` and `team-b.contoso.com` to the Gateway address, you can send requests directly to the hostnames.

## Verify listener conflict isolation

Introduce a conflict by changing Team B's listener to use Team A's hostname:

```bash
kubectl patch listenerset team-b-listeners \
  -n team-b \
  --type=json \
  -p='[{"op":"replace","path":"/spec/listeners/0/hostname","value":"team-a.contoso.com"}]'
```

Inspect Team B's ListenerSet:

```bash
kubectl get listenerset team-b-listeners -n team-b -o yaml
```

Confirm that the `team-b-http` listener reports `Accepted=False` with a conflict reason. The conflicting listener isn't programmed because Team A's existing listener has precedence.

Confirm that the parent Gateway remains programmed:

```bash
kubectl wait gateway/gateway-01 \
  -n test-infra \
  --for=condition=Programmed \
  --timeout=5m
```

Send another request to Team A:

```bash
curl -i \
  -H 'Host: team-a.contoso.com' \
  "http://${GATEWAY_ADDRESS}/"
```

The request continues to return `200 OK`, demonstrating that Team B's listener conflict doesn't interrupt Team A.

Restore Team B's hostname:

```bash
kubectl patch listenerset team-b-listeners \
  -n team-b \
  --type=json \
  -p='[{"op":"replace","path":"/spec/listeners/0/hostname","value":"team-b.contoso.com"}]'
```

Inspect the ListenerSet until the `team-b-http` listener reports `Accepted=True`, `ResolvedRefs=True`, and `Programmed=True` again:

```bash
kubectl get listenerset team-b-listeners -n team-b -o yaml
```

Send another request to Team B and confirm that it returns `200 OK`:

```bash
curl -i \
  -H 'Host: team-b.contoso.com' \
  "http://${GATEWAY_ADDRESS}/"
```

This test demonstrates configuration-failure isolation between listeners. The application teams still share the underlying Application Gateway for Containers infrastructure and its capacity.

Congratulations, you configured a multi-team shared gateway, routed traffic for two application teams through independently managed ListenerSets, and verified that a listener conflict in one team doesn't interrupt the other team.

## Troubleshoot attachment

Inspect the Gateway, both ListenerSets, and both HTTPRoutes when a request doesn't reach a backend:

```bash
kubectl get gateway gateway-01 -n test-infra -o yaml
kubectl get listenerset team-a-listeners -n team-a -o yaml
kubectl get listenerset team-b-listeners -n team-b -o yaml
kubectl get httproute team-a-route -n team-a -o yaml
kubectl get httproute team-b-route -n team-b -o yaml
```

Common conditions include:

| Condition or symptom | Cause | Resolution |
| --- | --- | --- |
| ListenerSet `Accepted=False` with reason `NotAllowed` | The Gateway doesn't allow ListenerSets from the application namespace | Correct `spec.allowedListeners` or the namespace labels |
| Listener `Accepted=False` with a conflict reason | The hostname, port, or protocol conflicts with a higher-precedence Gateway or ListenerSet listener | Choose a nonconflicting listener configuration |
| Listener `ResolvedRefs=False` | A referenced object, such as a TLS Secret, is missing or not authorized | Create the object and any required `ReferenceGrant` |
| HTTPRoute `Accepted=False` with reason `NotAllowedByListeners` | The listener's `allowedRoutes` rules don't allow the route | Correct `allowedRoutes` or move the route to an allowed namespace |
| HTTPRoute `ResolvedRefs=False` | A backend reference is missing or not authorized | Correct the backend reference and any required `ReferenceGrant` |

If some listeners are valid and others aren't, the ListenerSet can remain accepted. Always inspect the status entry for the specific listener selected by the route.

## Clean up resources

Delete both teams' routes, ListenerSets, backends, and the Gateway:

```bash
kubectl delete httproute team-a-route -n team-a
kubectl delete httproute team-b-route -n team-b
kubectl delete listenerset team-a-listeners -n team-a
kubectl delete listenerset team-b-listeners -n team-b
kubectl delete service team-a-backend -n team-a
kubectl delete service team-b-backend -n team-b
kubectl delete deployment team-a-backend -n team-a
kubectl delete deployment team-b-backend -n team-b
kubectl delete gateway gateway-01 -n test-infra
```

Delete the example namespaces:

```bash
kubectl delete namespace team-a
kubectl delete namespace team-b
kubectl delete namespace test-infra
```

Deleting the Gateway doesn't delete a BYO Application Gateway for Containers frontend or the ALB managed `ApplicationLoadBalancer` resource used by the Gateway.
