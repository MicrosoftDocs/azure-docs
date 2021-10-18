---
title: Manage an existing application with Open Service Mesh
description: How to manage an existing application with Open Service Mesh
services: container-service
ms.topic: article
ms.date: 8/26/2021
ms.custom: mvc, devx-track-azurecli
ms.author: pgibson
---

# Manage an existing application with the Open Service Mesh (OSM) Azure Kubernetes Service (AKS) add-on

## Before you begin

The steps detailed in this walk-through assume that you've previously enabled the OSM AKS add-on for your AKS cluster. If not, review the article [Deploy the OSM AKS add-on](./open-service-mesh-deploy-addon-az-cli.md) before proceeding. Also, your AKS cluster needs to be version Kubernetes `1.19+` and above, have Kubernetes RBAC enabled, and have established a `kubectl` connection with the cluster (If you need help with any of these items, then see the [AKS quickstart](./kubernetes-walkthrough.md), and have installed the AKS OSM add-on.

You must have the following resources installed:

- The Azure CLI, version 2.20.0 or later
- The `aks-preview` extension version 0.5.5 or later
- OSM version v0.8.0 or later
- JSON processor "jq" version 1.6+

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Verify the Open Service Mesh (OSM) Permissive Traffic Mode Policy

The OSM Permissive Traffic Policy mode is a mode where the [SMI](https://smi-spec.io/) traffic policy enforcement is bypassed. In this mode, OSM automatically discovers services that are a part of the service mesh and programs traffic policy rules on each Envoy proxy sidecar to be able to communicate with these services.

To verify the current permissive traffic mode of OSM for your cluster, run the following command:

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n kube-system -o yaml
```

Output of the OSM MeshConfig should look like the following:

```Output
apiVersion: config.openservicemesh.io/v1alpha1
kind: MeshConfig
metadata:
  creationTimestamp: "0000-00-00A00:00:00A"
  generation: 1
  name: osm-mesh-config
  namespace: kube-system
  resourceVersion: "2494"
  uid: 6c4d67f3-c241-4aeb-bf4f-b029b08faa31
spec:
  certificate:
    serviceCertValidityDuration: 24h
  featureFlags:
    enableEgressPolicy: true
    enableMulticlusterMode: false
    enableWASMStats: true
  observability:
    enableDebugServer: true
    osmLogLevel: info
    tracing:
      address: jaeger.osm-system.svc.cluster.local
      enable: false
      endpoint: /api/v2/spans
      port: 9411
  sidecar:
    configResyncInterval: 0s
    enablePrivilegedInitContainer: false
    envoyImage: mcr.microsoft.com/oss/envoyproxy/envoy:v1.18.3
    initContainerImage: mcr.microsoft.com/oss/openservicemesh/init:v0.9.1
    logLevel: error
    maxDataPlaneConnections: 0
    resources: {}
  traffic:
    enableEgress: true
    enablePermissiveTrafficPolicyMode: true
    inboundExternalAuthorization:
      enable: false
      failureModeAllow: false
      statPrefix: inboundExtAuthz
      timeout: 1s
    useHTTPSIngress: false
```

If the **enablePermissiveTrafficPolicyMode** is configured to **true**, you can safely onboard your namespaces without any disruption to your service-to-service communications. If the **enablePermissiveTrafficPolicyMode** is configured to **false**, you'll need to ensure you have the correct [SMI](https://smi-spec.io/) traffic access policy manifests deployed. You'll also need to ensure you have a service account representing each service deployed in the namespace. For more detailed information about permissive traffic mode, please visit and read the [Permissive Traffic Policy Mode](https://docs.openservicemesh.io/docs/guides/traffic_management/permissive_mode/) article.

## Onboard existing deployed applications with Open Service Mesh (OSM) Permissive Traffic Policy configured as True

The first thing we'll do is add the deployed application namespace(s) to OSM to manage. The example below will onboard the **bookstore** namespace to OSM.

```azurecli-interactive
osm namespace add bookstore
```

You should see the following output:

```Output
Namespace [bookstore] successfully added to mesh [osm]
```

Next we'll take a look at the current pod deployment in the namespace. Run the following command to view the pods in the `bookbuyer` namespace.

```azurecli-interactive
kubectl get pod -n bookbuyer
```

You should see the following similar output:

```Output
NAME                         READY   STATUS    RESTARTS   AGE
bookbuyer-78666dcff8-wh6wl   1/1     Running   0          43s
```

Notice the **READY** column showing **1/1**, meaning that the application pod has only one container. Next we'll need to restart your application deployments so that OSM can inject the Envoy sidecar proxy container with your application pod. Let's get a list of deployments in the namespace.

```azurecli-interactive
kubectl get deployment -n bookbuyer
```

You should see the following output:

```Output
NAME        READY   UP-TO-DATE   AVAILABLE   AGE
bookbuyer   1/1     1            1           23h
```

Now we'll restart the deployment to inject the Envoy sidecar proxy container with your application pod. Run the following command.

```azurecli-interactive
kubectl rollout restart deployment bookbuyer -n bookbuyer
```

You should see the following output:

```Output
deployment.apps/bookbuyer restarted
```

If we take a look at the pods in the namespace again:

```azurecli-interactive
kubectl get pod -n bookbuyer
```

You will now notice that the **READY** column is now showing **2/2** containers being ready for your pod. The second container is the Envoy sidecar proxy.

```Output
NAME                         READY   STATUS    RESTARTS   AGE
bookbuyer-84446dd5bd-j4tlr   2/2     Running   0          3m30s
```

We can further inspect the pod to view the Envoy proxy by running the describe command to view the configuration.

```azurecli-interactive
kubectl describe pod bookbuyer-84446dd5bd-j4tlr -n bookbuyer
```

```Output
Containers:
  bookbuyer:
    Container ID:  containerd://b7503b866f915711002292ea53970bd994e788e33fb718f1c4f8f12cd4a88198
    Image:         openservicemesh/bookbuyer:v0.8.0
    Image ID:      docker.io/openservicemesh/bookbuyer@sha256:813874bd2dc9c5a259b9657995348cf0822b905e29c4e86f21fdefa0ef21dcee
    Port:          <none>
    Host Port:     <none>
    Command:
      /bookbuyer
    State:          Running
      Started:      Tue, 23 Mar 2021 10:52:53 -0400
    Ready:          True
    Restart Count:  0
    Environment:
      BOOKSTORE_NAMESPACE:  bookstore
      BOOKSTORE_SVC:        bookstore
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from bookbuyer-token-zft2r (ro)
  envoy:
    Container ID:  containerd://f5f1cb5db8d5304e23cc984eb08146ea162a3e82d4262c4472c28d5579c25e10
    Image:         envoyproxy/envoy-alpine:v1.17.1
    Image ID:      docker.io/envoyproxy/envoy-alpine@sha256:511e76b9b73fccd98af2fbfb75c34833343d1999469229fdfb191abd2bbe3dfb
    Ports:         15000/TCP, 15003/TCP, 15010/TCP
    Host Ports:    0/TCP, 0/TCP, 0/TCP
```

Verify your application is still functional after the Envoy sidecar proxy injection.

## Onboard existing deployed applications with Open Service Mesh (OSM) Permissive Traffic Policy configured as False

When the OSM configuration for the permissive traffic policy is set to `false`, OSM will require explicit [SMI](https://smi-spec.io/) traffic access policies deployed for the service-to-service communication to happen within your cluster. Currently, OSM also uses Kubernetes service accounts as part of authorizing service-to-service communications as well. To ensure your existing deployed applications will communicate when managed by the OSM mesh, we'll now verify the existence of a service account to use, update the application deployment with the service account information, apply the [SMI](https://smi-spec.io/) traffic access policies.

### Verify Kubernetes Service Accounts

Verify if you have a kubernetes service account in the namespace your application is deployed to.

```azurecli-interactive
kubectl get serviceaccounts -n bookbuyer
```

In the following there's a service account named `bookbuyer` in the `bookbuyer` namespace.

```Output
NAME        SECRETS   AGE
bookbuyer   1         25h
default     1         25h
```

If you don't have a service account listed other than the default account, you will need to create one for your application. Use the following command as an example to create a service account in the application's deployed namespace.

```azurecli-interactive
kubectl create serviceaccount myserviceaccount -n bookbuyer
```

```Output
serviceaccount/myserviceaccount created
```

### View your application's current deployment specification

If you had to create a service account from the earlier section, chances are your application deployment isn't configured with a specific `serviceAccountName` in the deployment spec. We can view your application's deployment spec with the following commands:

```azurecli-interactive
kubectl get deployment -n bookbuyer
```

A list of deployments will be listed in the output.

```Output
NAME        READY   UP-TO-DATE   AVAILABLE   AGE
bookbuyer   1/1     1            1           25h
```

We'll describe the deployment as a check to see if there's a service account listed in the Pod Template section.

```azurecli-interactive
kubectl describe deployment bookbuyer -n bookbuyer
```

In this particular deployment you can see that there's a service account associated with the deployment listed under the Pod Template section. This deployment is using the service account `bookbuyer`. If you do not see the **Service Account:** property, your deployment isn't configured to use a service account.

```Output
Pod Template:
  Labels:           app=bookbuyer
                    version=v1
  Annotations:      kubectl.kubernetes.io/restartedAt: 2021-03-23T10:52:49-04:00
  Service Account:  bookbuyer
  Containers:
   bookbuyer:
    Image:      openservicemesh/bookbuyer:v0.8.0

```

There are several techniques to update your deployment to add a kubernetes service account. Review the Kubernetes documentation on [Updating a Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#updating-a-deployment) inline, or [Configure Service Accounts for Pods](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/). Once you have updated your deployment spec with the service account, redeploy (kubectl apply -f your-deployment.yaml) your deployment to the cluster.

### Deploy the necessary Service Mesh Interface (SMI) Policies

The last step to allowing authorized traffic to flow in the mesh is to deploy the necessary [SMI](https://smi-spec.io/) traffic access policies for your application. The amount of configuration you can achieve with [SMI](https://smi-spec.io/) traffic access policies is beyond the scope of this walkthrough, but we'll detail some of the common components of the specification and show how to configure both a simple TrafficTarget and HTTPRouteGroup policy to enable service-to-service communication for your application.

The [SMI](https://smi-spec.io/) [**Traffic Access Control**](https://github.com/servicemeshinterface/smi-spec/blob/main/apis/traffic-access/v1alpha3/traffic-access.md#traffic-access-control) specification allows users to define the access control policy for their applications. We'll focus on the **TrafficTarget** and **HTTPRoutGroup** api resources.

The TrafficTarget resource consists of three main configuration settings destination, rules, and sources. An example TrafficTarget is shown below.

```TrafficTarget Example spec
apiVersion: access.smi-spec.io/v1alpha3
kind: TrafficTarget
metadata:
  name: bookbuyer-access-bookstore-v1
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
```

In the above TrafficTarget spec, the `destination` denotes the service account that is configured for the destination source service. Remember the service account that was added to the deployment earlier will be used to authorize access to the deployment it is attached to. The `rules` section , in this particular example, defines the type of HTTP traffic that is allowed over the connection. You can configure fine grain regex patterns for the HTTP headers to be specific on what traffic is allowed via HTTP. The `sources` section is the service originating communications. This spec reads `bookbuyer` needs to communicate to the bookstore.

The HTTPRouteGroup resource consists of one or an array of matches of HTTP header information and is a requirement for the TrafficTarget spec. In the example below, you can see that the HTTPRouteGroup is authorizing three HTTP actions, two GET and one POST.

```HTTPRouteGroup Example Spec
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
```

If you aren't familiar with the type of HTTP traffic your front-end application makes to other tiers of the application, since the TrafficTarget spec requires a rule, you can create the equivalent of an allow all rule using the below spec for HTTPRouteGroup.

```HTTPRouteGroup Allow All Example
apiVersion: specs.smi-spec.io/v1alpha4
kind: HTTPRouteGroup
metadata:
  name: allow-all
  namespace: yournamespace
spec:
  matches:
  - name: allow-all
    pathRegex: '.*'
    methods: ["GET","PUT","POST","DELETE","PATCH"]
```

Once you configure your TrafficTarget and HTTPRouteGroup spec, you can put them together as one YAML and deploy. Below is the bookstore example configuration.

```Bookstore Example TrafficTarget and HTTPRouteGroup configuration
kubectl apply -f - <<EOF
---
apiVersion: access.smi-spec.io/v1alpha3
kind: TrafficTarget
metadata:
  name: bookbuyer-access-bookstore-v1
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
EOF
```

Visit the [SMI](https://smi-spec.io/) site for more detailed information on the specification.

## Manage the application's namespace with OSM

Next we'll ensure OSM to manage the namespace and restart the deployments to get the Envoy sidecar proxy injected with the application.

Run the following command to configure the `azure-vote` namespace to be managed my OSM.

```azurecli-interactive
osm namespace add azure-vote
```

```Output
Namespace [azure-vote] successfully added to mesh [osm]
```

Next restart both the `azure-vote-front` and `azure-vote-back` deployments with the following commands.

```azurecli-interactive
kubectl rollout restart deployment azure-vote-front -n azure-vote
kubectl rollout restart deployment azure-vote-back -n azure-vote
```

```Output
deployment.apps/azure-vote-front restarted
deployment.apps/azure-vote-back restarted
```

If we view the pods for the `azure-vote` namespace, we'll see **READY** stage of both the `azure-vote-front` and `azure-vote-back` as 2/2, meaning the Envoy sidecar proxy has been injected alongside the application.
