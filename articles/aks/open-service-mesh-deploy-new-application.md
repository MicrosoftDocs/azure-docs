---
title: Manage a new application with Open Service Mesh
description: How to manage a new application with Open Service Mesh
services: container-service
ms.topic: article
ms.date: 11/10/2021
ms.author: pgibson
---

# Manage a new application with Open Service Mesh (OSM) on Azure Kubernetes Service (AKS)

This article shows you how to run a sample application on your OSM mesh running on AKS.

## Prerequisites

- An existing AKS cluster with the AKS OSM add-on installed. If you need to create a cluster or enable the AKS OSM add-on on an existing cluster, see [Install the Open Service Mesh (OSM) Azure Kubernetes Service (AKS) add-on using Azure CLI][osm-cli]
- OSM mesh version v0.11.1 or later running on your cluster.
- The Azure CLI, version 2.20.0 or later.
- The latest version of the OSM CLI.

## Verify your mesh has permissive mode enabled

Use `kubectl get meshconfig osm-mesh-config` to verify *enablePermissveTrafficPolicyMode* is *true*. For example:

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n kube-system -o=jsonpath='{$.spec.traffic.enablePermissiveTrafficPolicyMode}'
```

If permissive mode is not enabled, you can enable it using `kubectl patch meshconfig osm-mesh-config`. For example:

```azurecli-interactive
kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"traffic":{"enablePermissiveTrafficPolicyMode":true}}}' --type=merge
```

## Create and onboard the namespaces to be managed by OSM

When you add namespaces to the OSM mesh, the OSM controller automatically injects the Envoy sidecar proxy containers with applications deployed in those namespaces. Use `kubectl create ns` to create the *bookstore*, *bookbuyer*, *bookthief*, and *bookwarehouse* namespaces, then use `osm namespace add` to add those namespaces to your mesh.

```azurecli-interactive
kubectl create ns bookstore
kubectl create ns bookbuyer
kubectl create ns bookthief
kubectl create ns bookwarehouse

osm namespace add bookstore bookbuyer bookthief bookwarehouse
```

You should see the following output:

```output
namespace/bookstore created
namespace/bookbuyer created
namespace/bookthief created
namespace/bookwarehouse created

Namespace [bookstore] successfully added to mesh [osm]
Namespace [bookbuyer] successfully added to mesh [osm]
Namespace [bookthief] successfully added to mesh [osm]
Namespace [bookwarehouse] successfully added to mesh [osm]
```

## Deploy the sample application to the AKS cluster

Use `kubectl apply` to deploy the sample application to your cluster.

```azurecli-interactive
SAMPLE_VERSION=v0.11
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/release-$SAMPLE_VERSION/docs/example/manifests/apps/bookbuyer.yaml
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/release-$SAMPLE_VERSION/docs/example/manifests/apps/bookthief.yaml
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/release-$SAMPLE_VERSION/docs/example/manifests/apps/bookstore.yaml
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/release-$SAMPLE_VERSION/docs/example/manifests/apps/bookwarehouse.yaml
```

You should see the following output:

```output
serviceaccount/bookbuyer created
deployment.apps/bookbuyer created
serviceaccount/bookthief created
deployment.apps/bookthief created
service/bookstore created
serviceaccount/bookstore created
deployment.apps/bookstore created
serviceaccount/bookwarehouse created
service/bookwarehouse created
deployment.apps/bookwarehouse created
```

The sample application is an example of a multi-tiered application that works well for testing service mesh functionality. The application consists of four services: *bookbuyer*, *bookthief*, *bookstore*, and *bookwarehouse*.

![OSM sample application architecture](./media/aks-osm-addon/osm-bookstore-app-arch.png)

Both the *bookbuyer* and *bookthief* service communicate to the *bookstore* service to retrieve books from the *bookstore* service. The *bookstore* service retrieves books from the *bookwarehouse* service. This application helps demonstrate how a service mesh can be used to protect and authorize communications between the services. For example, later sections show how to disable permissive traffic mode and use SMI policies to secure access to services.

## Access the bookbuyer and bookthief services using port forwarding

Use `kubectl get pod` to get the name of the *bookbuyer* pod in the *bookbuyer* namespace. For example:

```output
$ kubectl get pod -n bookbuyer

NAME                         READY   STATUS    RESTARTS   AGE
bookbuyer-1245678901-abcde   2/2     Running   0          7m8s
```

Open a new terminal and use `kubectl port forward` to begin forwarding traffic between your development computer and the *bookbuyer* pod. For example:

```output
$ kubectl port-forward bookbuyer-1245678901-abcde -n bookbuyer 8080:14001
Forwarding from 127.0.0.1:8080 -> 14001
Forwarding from [::1]:8080 -> 14001
```

The above example shows traffic is being forwarded between port 8080 on your development computer and 14001 on pod *bookbuyer-1245678901-abcde*.

Go to `http://localhost:8080` on a web browser and confirm you see the *bookbuyer* application. For example:

![OSM bookbuyer application](./media/aks-osm-addon/osm-bookbuyer-service-ui.png)

Notice the number of bought books continues to increase.  Stop the port forwarding command.

Use `kubectl get pod` to get the name of the *bookthief* pod in the *bookthief* namespace. For example:

```output
$ kubectl get pod -n bookthief

NAME                         READY   STATUS    RESTARTS   AGE
bookthief-1245678901-abcde   2/2     Running   0          7m8s
```

Open a new terminal and use `kubectl port forward` to begin forwarding traffic between your development computer and the *bookthief* pod. For example:

```output
$ kubectl port-forward bookthief-1245678901-abcde -n bookthief 8080:14001
Forwarding from 127.0.0.1:8080 -> 14001
Forwarding from [::1]:8080 -> 14001
```

The above example shows traffic is being forwarded between port 8080 on your development computer and 14001 on pod *bookthief-1245678901-abcde*.

Go to `http://localhost:8080` on a web browser and confirm you see the *bookthief* application. For example:

![OSM bookthief application](./media/aks-osm-addon/osm-bookthief-service-ui.png)

Notice the number of stolen books continues to increase. Stop the port forwarding command.

## Disable permissive traffic mode on your mesh

When permissive traffic mode is enabled, you do not need to define explicit [SMI][smi] policies for services to communicate with other services in onboarded namespaces. For more information on permissive traffic mode in OSM, see [Permissive Traffic Policy Mode][osm-permissive-traffic-mode].

In the sample application with permissive mode enabled, both the *bookbuyer* and *bookthief* services can communicate with the *bookstore* service and obtain books. 

Use `kubectl patch meshconfig osm-mesh-config` to disable permissive traffic mode:

```azurecli-interactive
kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"traffic":{"enablePermissiveTrafficPolicyMode":false}}}' --type=merge
```

The following example output shows the *osm-mesh-config* has been updated:

```output
$ kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"traffic":{"enablePermissiveTrafficPolicyMode":false}}}' --type=merge

meshconfig.config.openservicemesh.io/osm-mesh-config patched
```

Repeat the steps from the previous section to forward traffic between the *bookbuyer* service and your development computer. Confirm the counter is no longer incrementing, even if you refresh the page. Stop the port forwarding command and repeat the steps to forward traffic between the *bookthief* service and your development computer. Confirm the counter is no longer incrementing even if you refresh the page. Stop the port forwarding command.

## Apply an SMI traffic access policy for buying books

Create `allow-bookbuyer-smi.yaml` using the following YAML:

```yaml
apiVersion: access.smi-spec.io/v1alpha3
kind: TrafficTarget
metadata:
  name: bookbuyer-access-bookstore
  namespace: bookstore
spec:
  destination:
    kind: ServiceAccount
    name: bookstore
    namespace: bookstore
  rules:
  - kind: HTTPRouteGroup
    name: bookstore-service-routes
    matches:
    - buy-a-book
    - books-bought
  sources:
  - kind: ServiceAccount
    name: bookbuyer
    namespace: bookbuyer
---
apiVersion: specs.smi-spec.io/v1alpha4
kind: HTTPRouteGroup
metadata:
  name: bookstore-service-routes
  namespace: bookstore
spec:
  matches:
  - name: books-bought
    pathRegex: /books-bought
    methods:
    - GET
    headers:
    - "user-agent": ".*-http-client/*.*"
    - "client-app": "bookbuyer"
  - name: buy-a-book
    pathRegex: ".*a-book.*new"
    methods:
    - GET
  - name: update-books-bought
    pathRegex: /update-books-bought
    methods:
    - POST
---
kind: TrafficTarget
apiVersion: access.smi-spec.io/v1alpha3
metadata:
  name: bookstore-access-bookwarehouse
  namespace: bookwarehouse
spec:
  destination:
    kind: ServiceAccount
    name: bookwarehouse
    namespace: bookwarehouse
  rules:
  - kind: HTTPRouteGroup
    name: bookwarehouse-service-routes
    matches:
    - restock-books
  sources:
  - kind: ServiceAccount
    name: bookstore
    namespace: bookstore
  - kind: ServiceAccount
    name: bookstore-v2
    namespace: bookstore
---
apiVersion: specs.smi-spec.io/v1alpha4
kind: HTTPRouteGroup
metadata:
  name: bookwarehouse-service-routes
  namespace: bookwarehouse
spec:
  matches:
    - name: restock-books
      methods:
      - POST
      headers:
      - host: bookwarehouse.bookwarehouse
```

The above creates the following SMI access policies that allow the *bookbuyer* service to communicate with the *bookstore* service for buying books. It also allows the *bookstore* service to communicate with the *bookwarehouse* service for restocking books.

Use `kubectl apply` to apply the SMI access policies.

```azurecli-interactive
kubectl apply -f allow-bookbuyer-smi.yaml
```

The following example output shows the SMI access policies successfully applied:

```output
$ kubectl apply -f allow-bookbuyer-smi.yaml

traffictarget.access.smi-spec.io/bookbuyer-access-bookstore-v1 created
httproutegroup.specs.smi-spec.io/bookstore-service-routes created
traffictarget.access.smi-spec.io/bookstore-access-bookwarehouse created
httproutegroup.specs.smi-spec.io/bookwarehouse-service-routes created
```

Repeat the steps from the previous section to forward traffic between the *bookbuyer* service and your development computer. Confirm the counter is incrementing. Stop the port forwarding command and repeat the steps to forward traffic between the *bookthief* service and your development computer. Confirm the counter is not incrementing even if you refresh the page. Stop the port forwarding command.

## Apply an SMI traffic split policy for buying books

In addition to access policies, you can also use SMI to create traffic split policies. Traffic split policies allow you to configure the distribution of communications from one service to multiple services as a backend. This capability can help you test a new version of a backend service by sending a small portion of traffic to it while sending the rest of traffic to the current version of the backend service. This capability can also help progressively transition more traffic to the new version of a service and reduce traffic to the previous version over time.

The following diagram shows an SMI Traffic Split policy that sends 25% of traffic to the *bookstore-v1* service and 75% of traffic to the *bookstore-v2* service.

![OSM bookbuyer traffic split diagram](./media/aks-osm-addon/osm-bookbuyer-traffic-split-diagram.png)

Create `bookbuyer-v2.yaml` using the following YAML:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: bookstore-v2
  namespace: bookstore
  labels:
    app: bookstore-v2
spec:
  ports:
  - port: 14001
    name: bookstore-port
  selector:
    app: bookstore-v2
---
# Deploy bookstore-v2 Service Account
apiVersion: v1
kind: ServiceAccount
metadata:
  name: bookstore-v2
  namespace: bookstore
---
# Deploy bookstore-v2 Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookstore-v2
  namespace: bookstore
spec:
  replicas: 1
  selector:
    matchLabels:
      app: bookstore-v2
  template:
    metadata:
      labels:
        app: bookstore-v2
    spec:
      serviceAccountName: bookstore-v2
      containers:
        - name: bookstore
          image: openservicemesh/bookstore:v0.8.0
          imagePullPolicy: Always
          ports:
            - containerPort: 14001
              name: web
          command: ["/bookstore"]
          args: ["--path", "./", "--port", "14001"]
          env:
            - name: BOOKWAREHOUSE_NAMESPACE
              value: bookwarehouse
            - name: IDENTITY
              value: bookstore-v2
---
kind: TrafficTarget
apiVersion: access.smi-spec.io/v1alpha3
metadata:
  name: bookbuyer-access-bookstore-v2
  namespace: bookstore
spec:
  destination:
    kind: ServiceAccount
    name: bookstore-v2
    namespace: bookstore
  rules:
  - kind: HTTPRouteGroup
    name: bookstore-service-routes
    matches:
    - buy-a-book
    - books-bought
  sources:
  - kind: ServiceAccount
    name: bookbuyer
    namespace: bookbuyer
```

The above creates a *bookstore-v2* service and SMI policies that allow the *bookbuyer* service to communicate with the *bookstore-v2* service for buying books. It also uses the SMI policies created in the previous section to allow the *bookstore-v2* service to communicate with the *bookwarehouse* service for restocking books.

Use `kubectl apply` to deploy *bookstore-v2* and apply the SMI access policies.

```azurecli-interactive
kubectl apply -f bookbuyer-v2.yaml
```

The following example output shows the SMI access policies successfully applied:

```output
$ kubectl apply -f bookbuyer-v2.yaml

service/bookstore-v2 configured
serviceaccount/bookstore-v2 created
deployment.apps/bookstore-v2 created
traffictarget.access.smi-spec.io/bookstore-v2 created
```

Create `bookbuyer-split-smi.yaml` using the following YAML:

```yaml
apiVersion: split.smi-spec.io/v1alpha2
kind: TrafficSplit
metadata:
  name: bookstore-split
  namespace: bookstore
spec:
  service: bookstore.bookstore
  backends:
  - service: bookstore
    weight: 25
  - service: bookstore-v2
    weight: 75
```

The above creates an SMI policy that splits traffic for the *bookstore* service. The original or v1 version of *bookstore* receives 25% of traffic and *bookstore-v2* receives 75% of traffic.

Use `kubectl apply` to apply the SMI split policy.

```azurecli-interactive
kubectl apply -f bookbuyer-split-smi.yaml
```

The following example output shows the SMI access policies successfully applied:

```output
$ kubectl apply -f bookbuyer-split-smi.yaml

trafficsplit.split.smi-spec.io/bookstore-split created
```

Repeat the steps from the previous section to forward traffic between the *bookbuyer* service and your development computer. Confirm the counter is incrementing for both *bookstore v1* and *bookstore v2*. Also confirm the number for *bookstore v2* is incrementing faster than for *bookstore v1*.

![OSM bookbuyer books bought UI](./media/aks-osm-addon/osm-bookbuyer-traffic-split-ui.png)

Stop the port forwarding command.


[osm-cli]: open-service-mesh-deploy-addon-az-cli.md
[osm-permissive-traffic-mode]: https://docs.openservicemesh.io/docs/guides/traffic_management/permissive_mode/
[smi]: https://smi-spec.io/