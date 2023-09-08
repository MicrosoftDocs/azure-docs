---
title: Migration guidance for Open Service Mesh to Istio
description: Migration guidance for Open Service Mesh configurations to Istio
services: container-service
ms.topic: article
ms.date: 5/15/2023
ms.author: pgibson
---

# Migration guidance for Open Service Mesh (OSM) configurations to Istio

> [!IMPORTANT]
> This article aims to provide a simplistic understanding of how to identify OSM configurations and translate them to equivalent Istio configurations for migrating workloads from OSM to Istio. This by no means, is considered to be an exhaustive detailed guide.

This article provides practical guidance for mapping OSM policies to the [Istio](https://istio.io/) policies to help migrate your microservices deployments managed by OSM over to being managed by Istio. We utilize the OSM [Bookstore sample application](https://docs.openservicemesh.io/docs/getting_started/install_apps/) as a base reference for current OSM users. The following walk-through deploys the Bookstore application. The same steps are followed and explain how to apply the OSM [SMI](https://smi-spec.io/) traffic policies using the Istio equivalent.

If you are not using OSM and are new to Istio, start with [Istio's own Getting Started guide](https://istio.io/latest/docs/setup/getting-started/) to learn how to use the Istio service mesh for your applications. If you are currently using OSM, make sure you are familiar with the OSM [Bookstore sample application](https://docs.openservicemesh.io/docs/getting_started/install_apps/) walk-through on how OSM configures traffic policies. The following walk-through does not duplicate the current documentation, and reference specific topics when relevant. You should be comfortable and fully aware of the bookstore application architecture before proceeding.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli).
- The OSM AKS add-on is uninstalled from your AKS cluster
- Any existing OSM Bookstore application, including namespaces, is uninstalled and deleted from your cluster
- [Install the Istio AKS service mesh add-on](istio-deploy-addon.md)

## Modifications needed to the OSM Sample Bookstore Application

To allow for Istio to manage the OSM bookstore application, there are a couple of changes needed in the existing manifests. Those changes are with the bookstore and the mysql services.

### Bookstore Modifications

In the OSM Bookstore walk-through, the bookstore service is deployed along with another bookstore-v2 service to demonstrate how OSM provides traffic shifting. This deployed services allowed you to split the client (`bookbuyer`) traffic between multiple service endpoints. The first new concept to understand how Istio handles what they refer to as [Traffic Shifting](https://istio.io/latest/docs/tasks/traffic-management/traffic-shifting/).

OSM implementation of traffic shifting is based on the [SMI Traffic Split specification](https://github.com/servicemeshinterface/smi-spec/blob/main/apis/traffic-split/v1alpha4/traffic-split.md). The SMI Traffic Split specification requires the existence of multiple top-level services that are added as backends with the desired weight metric to shift client requests from one service to another. Istio accomplishes traffic shifting using a combination of a [Virtual Service](https://istio.io/latest/docs/reference/config/networking/virtual-service/) and a [Destination Rule](https://istio.io/latest/docs/reference/config/networking/destination-rule/). It is highly recommended that you familiarize yourself with both the concepts of a virtual service and destination rule.

Put simply, the Istio virtual service defines routing rules for clients that request the host (service name). Virtual Services allows for multiple versions of a deployment to be associated to one virtual service hostname for clients to target. Multiple deployments can be labeled for the same service, representing different versions of the application behind the same hostname. The Istio virtual service can then be configured to weight the request to a specific version of the service. The available versions of the service are configured to use the `subsets` attribute in a Istio destination rule.

The modification made to the bookstore service and deployment for Istio removes the need to have an explicit second service to target, which the SMI Traffic Split needs. There's no need for another service account for the bookstore v2 service as well, since it's to be consolidated under the bookstore service. The original OSM [traffic-access-v1.yaml](https://raw.githubusercontent.com/openservicemesh/osm-docs/release-v1.2/manifests/access/traffic-access-v1.yaml) manifest modification to Istio for both the bookstore v1 and v2 are shown in the below [Create Pods, Services, and Service Accounts](#create-pods-services-and-service-accounts) section. We demonstrate how we do traffic splitting, known as traffic shifting later in the walk-through:

### MySql Modifications

Changes to the mysql stateful set are only needed in the service configuration. Under the service specification, OSM needed the `targetPort` and `appProtocol` attributes. These attributes are not needed for Istio. The following updated service for the mysqldb looks like:

```yml
apiVersion: v1
kind: Service
metadata:
  name: mysqldb
  labels:
    app: mysqldb
    service: mysqldb
spec:
  ports:
    - port: 3306
      name: tcp
  selector:
    app: mysqldb
```

## Deploy the Modified Bookstore Application

Similar to the OSM Bookstore walk-through, we start with a new install of the bookstore application.

### Create the Namespaces

```bash
kubectl create namespace bookstore
kubectl create namespace bookbuyer
kubectl create namespace bookthief
kubectl create namespace bookwarehouse
```

### Add a namespace label for Istio sidecar injection

For OSM, using the command `osm namespace add <namespace>` created the necessary annotations to the namespace for the OSM controller to add automatic sidecar injection. With Istio, you only need to just label a namespace to allow the Istio controller to be instructed to automatically inject the Envoy sidecar proxies.

```bash
kubectl label namespace bookstore istio-injection=enabled
kubectl label namespace bookbuyer istio-injection=enabled
kubectl label namespace bookthief istio-injection=enabled
kubectl label namespace bookwarehouse istio-injection=enabled
```

### Deploy the Istio Virtual Service and Destination Rule for Bookstore

As mentioned earlier in the Bookstore Modification section, Istio handles traffic shifting utilizing a VirtualService weight attribute we configure later in the walk-through. We deploy the virtual service and destination rule for the bookstore service. We deploy only the bookstore version 1 even though the bookstore version 2 is deployed. The Istio virtual service is only supplying a route to the version 1 of bookstore. Different from how OSM handles traffic shifting (traffic split), OSM deployed another service for the bookstore version 2 application. OSM needed to set up traffic to be split between client requests using a TrafficSplit. When using traffic shifting with Istio, we can reference shifting traffic to multiple Kubernetes application deployments (versions) labeled for the same service.

In this walk-though, the deployment of both bookstore versions (v1 & v2) is deployed at the same time. Only the version 1 is reachable due to the virtual service configuration. There is no need to deploy another service for bookstore version 2, we enable a route to the bookstore version 2 later when we update the bookstore virtual service and provide the necessary weight attribute to do traffic shifting.

```bash
kubectl apply -f - <<EOF
# Create bookstore virtual service
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: bookstore-virtualservice
  namespace: bookstore
spec:
  hosts:
  - bookstore
  http:
  - route:
    - destination:
        host: bookstore
        subset: v1
---
# Create bookstore destination rule
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: bookstore-destination
  namespace: bookstore
spec:
  host: bookstore
  subsets:
  - name: v1
    labels:
      app: bookstore
      version: v1
  - name: v2
    labels:
      app: bookstore
      version: v2
EOF
```

### Create Pods, Services, and Service Accounts

We use a single manifest file that contains the modifications discussed earlier in the walk-through to deploy the `bookbuyer`, `bookthief`, `bookstore`, `bookwarehouse`, and `mysql` applications.

```bash
kubectl apply -f - <<EOF
##################################################################################################
# bookbuyer service
##################################################################################################
---
# Create bookbuyer Service Account
apiVersion: v1
kind: ServiceAccount
metadata:
  name: bookbuyer
  namespace: bookbuyer
---
# Create bookbuyer Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookbuyer
  namespace: bookbuyer
spec:
  replicas: 1
  selector:
    matchLabels:
      app: bookbuyer
      version: v1
  template:
    metadata:
      labels:
        app: bookbuyer
        version: v1
    spec:
      serviceAccountName: bookbuyer
      nodeSelector:
        kubernetes.io/arch: amd64
        kubernetes.io/os: linux
      containers:
        - name: bookbuyer
          image: openservicemesh/bookbuyer:latest-main
          imagePullPolicy: Always
          command: ["/bookbuyer"]
          env:
            - name: "BOOKSTORE_NAMESPACE"
              value: bookstore
            - name: "BOOKSTORE_SVC"
              value: bookstore
---
##################################################################################################
# bookthief service
##################################################################################################
---
# Create bookthief ServiceAccount
apiVersion: v1
kind: ServiceAccount
metadata:
  name: bookthief
  namespace: bookthief
---
# Create bookthief Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookthief
  namespace: bookthief
spec:
  replicas: 1
  selector:
    matchLabels:
      app: bookthief
  template:
    metadata:
      labels:
        app: bookthief
        version: v1
    spec:
      serviceAccountName: bookthief
      nodeSelector:
        kubernetes.io/arch: amd64
        kubernetes.io/os: linux
      containers:
        - name: bookthief
          image: openservicemesh/bookthief:latest-main
          imagePullPolicy: Always
          command: ["/bookthief"]
          env:
            - name: "BOOKSTORE_NAMESPACE"
              value: bookstore
            - name: "BOOKSTORE_SVC"
              value: bookstore
            - name: "BOOKTHIEF_EXPECTED_RESPONSE_CODE"
              value: "503"
---
##################################################################################################
# bookstore service version 1 & 2
##################################################################################################
---
# Create bookstore Service
apiVersion: v1
kind: Service
metadata:
  name: bookstore
  namespace: bookstore
  labels:
    app: bookstore
spec:
  ports:
    - port: 14001
      name: bookstore-port
  selector:
    app: bookstore

---
# Create bookstore Service Account
apiVersion: v1
kind: ServiceAccount
metadata:
  name: bookstore
  namespace: bookstore

---
# Create bookstore-v1 Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookstore-v1
  namespace: bookstore
spec:
  replicas: 1
  selector:
    matchLabels:
      app: bookstore
      version: v1
  template:
    metadata:
      labels:
        app: bookstore
        version: v1
    spec:
      serviceAccountName: bookstore
      nodeSelector:
        kubernetes.io/arch: amd64
        kubernetes.io/os: linux
      containers:
        - name: bookstore
          image: openservicemesh/bookstore:latest-main
          imagePullPolicy: Always
          ports:
            - containerPort: 14001
              name: web
          command: ["/bookstore"]
          args: ["--port", "14001"]
          env:
            - name: BOOKWAREHOUSE_NAMESPACE
              value: bookwarehouse
            - name: IDENTITY
              value: bookstore-v1

---
# Create bookstore-v2 Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookstore-v2
  namespace: bookstore
spec:
  replicas: 1
  selector:
    matchLabels:
      app: bookstore
      version: v2
  template:
    metadata:
      labels:
        app: bookstore
        version: v2
    spec:
      serviceAccountName: bookstore
      nodeSelector:
        kubernetes.io/arch: amd64
        kubernetes.io/os: linux
      containers:
        - name: bookstore
          image: openservicemesh/bookstore:latest-main
          imagePullPolicy: Always
          ports:
            - containerPort: 14001
              name: web
          command: ["/bookstore"]
          args: ["--port", "14001"]
          env:
            - name: BOOKWAREHOUSE_NAMESPACE
              value: bookwarehouse
            - name: IDENTITY
              value: bookstore-v2
---
##################################################################################################
# bookwarehouse service
##################################################################################################
---
# Create bookwarehouse Service Account
apiVersion: v1
kind: ServiceAccount
metadata:
  name: bookwarehouse
  namespace: bookwarehouse
---
# Create bookwarehouse Service
apiVersion: v1
kind: Service
metadata:
  name: bookwarehouse
  namespace: bookwarehouse
  labels:
    app: bookwarehouse
spec:
  ports:
  - port: 14001
    name: bookwarehouse-port
  selector:
    app: bookwarehouse
---
# Create bookwarehouse Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookwarehouse
  namespace: bookwarehouse
spec:
  replicas: 1
  selector:
    matchLabels:
      app: bookwarehouse
  template:
    metadata:
      labels:
        app: bookwarehouse
        version: v1
    spec:
      serviceAccountName: bookwarehouse
      nodeSelector:
        kubernetes.io/arch: amd64
        kubernetes.io/os: linux
      containers:
        - name: bookwarehouse
          image: openservicemesh/bookwarehouse:latest-main
          imagePullPolicy: Always
          command: ["/bookwarehouse"]
##################################################################################################
# mysql service
##################################################################################################
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: mysql
  namespace: bookwarehouse
---
apiVersion: v1
kind: Service
metadata:
  name: mysqldb
  labels:
    app: mysqldb
    service: mysqldb
spec:
  ports:
    - port: 3306
      name: tcp
  selector:
    app: mysqldb
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  namespace: bookwarehouse
spec:
  serviceName: mysql
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      serviceAccountName: mysql
      nodeSelector:
        kubernetes.io/os: linux
      containers:
      - image: mysql:5.6
        name: mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: mypassword
        - name: MYSQL_DATABASE
          value: booksdemo
        ports:
        - containerPort: 3306
          name: mysql
        volumeMounts:
        - mountPath: /mysql-data
          name: data
        readinessProbe:
          tcpSocket:
            port: 3306
          initialDelaySeconds: 15
          periodSeconds: 10
      volumes:
        - name: data
          emptyDir: {}
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 250M
EOF
```

To view these resources on your cluster, run the following commands:

```bash
kubectl get pods,deployments,serviceaccounts -n bookbuyer
kubectl get pods,deployments,serviceaccounts -n bookthief

kubectl get pods,deployments,serviceaccounts,services,endpoints -n bookstore
kubectl get pods,deployments,serviceaccounts,services,endpoints -n bookwarehouse
```

### View the Application UIs

Similar to the original OSM walk-through, if you have the OSM repo cloned you can utilize the port forwarding scripts to view the UIs of each application [here](https://release-v1-2.docs.openservicemesh.io/docs/getting_started/install_apps/#view-the-application-uis). For now, we are only concerned to view the `bookbuyer` and `bookthief` UI.

```bash
cp .env.example .env
bash <<EOF
./scripts/port-forward-bookbuyer-ui.sh &
./scripts/port-forward-bookthief-ui.sh &
wait
EOF
```

In a browser, open up the following urls:

http://localhost:8080 - bookbuyer

http://localhost:8083 - bookthief

## Configure Istio's Traffic Policies

To maintain continuity with the original OSM Bookstore walk-through for the translation to Istio, we discuss [OSM's Permissive Traffic Policy Mode](https://release-v1-2.docs.openservicemesh.io/docs/getting_started/traffic_policies/#permissive-traffic-policy-mode). OSM's permissive traffic policy mode was a concept of allowing or denying traffic in the mesh without any specific [SMI Traffic Access Control rule](https://github.com/servicemeshinterface/smi-spec/blob/main/apis/traffic-access/v1alpha3/traffic-access.md) deployed. The permissive traffic mode configuration existed to allow users to onboard applications into the mesh, while gaining mTLS encryption, without requiring explicit rules to allow applications in the mesh to communicate. The permissive traffic mode feature was to avoid breaking the communications of your application as soon as OSM managed it, and provide time to define your rules while ensuring that application communications was mTLS encrypted. This setting could be set to `true` or `false` via OSM's MeshConfig.

Istio handles mTLS enforcement differently. Different from OSM, Istio's permissive mode automatically configures sidecar proxies to use mTLS but allow the service to accept both plaintext and mTLS traffic. The equivalent to OSM's permissive mode configuration is to utilize Istio's `PeerAuthentication` settings. `PeerAuthentication` can be done granularly at the namespace or for the entire mesh. For more information on Istio's enforcement of mTLS, read the [Istio Mutual TLS Migration article](https://istio.io/latest/docs/tasks/security/authentication/mtls-migration/).

### Enforce Istio Strict Mode on Bookstore Namespaces

It is important to remember, just like OSM's permissive mode, Istio's `PeerAuthentication` configuration is only related to the use of mTLS enforcement. Actual layer-7 policies, much like those used in OSM's HTTPRouteGroups, is handled using Istio's AuthorizationPolicy configurations you see later in the walk-through.

We granularly put the `bookbuyer`, `bookthief`, `bookstore`, and `bookwarehouse` namespaces in Istio's mTLS strict mode.

```bash
kubectl apply -f - <<EOF
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: bookbuyer
  namespace: bookbuyer
spec:
  mtls:
    mode: STRICT
---
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: bookthief
  namespace: bookthief
spec:
  mtls:
    mode: STRICT
---
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: bookstore
  namespace: bookstore
spec:
  mtls:
    mode: STRICT
---
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: bookwarehouse
  namespace: bookwarehouse
spec:
  mtls:
    mode: STRICT
EOF
```

### Deploy Istio Access Control Policies

Similar to OSM's [SMI Traffic Target](https://github.com/servicemeshinterface/smi-spec/blob/v0.6.0/apis/traffic-access/v1alpha2/traffic-access.md) and [SMI Traffic Specs](https://github.com/servicemeshinterface/smi-spec/blob/v0.6.0/apis/traffic-specs/v1alpha4/traffic-specs.md) resources to define access control and routing policies for the applications to communicate, Istio accomplishes these similar fine-grain controls by using `AuthorizationPolicy` configurations.

Let's walk through translating the bookstore TrafficTarget policy, which specifically allows the `bookbuyer` to communicate to it, with only certain layer-7 path, headers, and methods. The following is a portion of the [traffic-access-v1.yaml](https://raw.githubusercontent.com/openservicemesh/osm-docs/release-v1.2/manifests/access/traffic-access-v1.yaml) manifest.

```yml
kind: TrafficTarget
apiVersion: access.smi-spec.io/v1alpha3
metadata:
  name: bookstore
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
```

If you notice under the TrafficTarget policy, in the spec is where you can explicitly define what source service can communicate with a destination service. We can see that we are allowing the source `bookbuyer` to be authorized to communicate to the destination bookstore. If we translate the service-to-service authorization from an OSM `TrafficTarget` configuration to an Istio `AuthorizationPolicy`, it looks like this below:

```yml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: bookstore
  namespace: bookstore
spec:
  selector:
    matchLabels:
      app: bookstore
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/bookbuyer/sa/bookbuyer"]
```

In the Istio's `AuthorizationPolicy`, you notice how the OSM TrafficTarget policy destination service is mapped to the selector label match and the namespace the service resides in. The source service is shown under the rules section where there is a source/principles attribute that maps to the service account name for the `bookbuyer` service.

In addition to just the source/destination configuration in the OSM TrafficTarget, OSM binds the use of a HTTPRouteGroup to further define the layer-7 authorization the source has access to. We can see in just the portion of the HTTPRouteGroup below. There are two `matches` for the allowed source service.

```yml
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
```

There is a `match` named `books-bought` that allows the source to access path `/books-bought` using a `GET` method with host header user-agent and client-app information, and a `buy-a-book` match that uses a regex express for a path containing `.*a-book.*new` using a `GET` method.

We can define these OSM HTTPRouteGroup configurations in the rules section of the Istio `AuthorizationPolicy` shown below:

```yml
apiVersion: "security.istio.io/v1beta1"
kind: "AuthorizationPolicy"
metadata:
  name: "bookstore"
  namespace: bookstore
spec:
  selector:
    matchLabels:
      app: bookstore
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/bookbuyer/sa/bookbuyer"]
        - source:
            namespaces: ["bookbuyer"]
      to:
        - operation:
            methods: ["GET"]
            paths: ["*/books-bought", "*/buy-a-book/new"]
    - when:
        - key: request.headers[User-Agent]
          values: ["*-http-client/*"]
        - key: request.headers[Client-App]
          values: ["bookbuyer"]
```

We can now deploy the OSM migrated traffic-access-v1.yaml manifest as understood by Istio below. There is not an `AuthorizationPolicy` for the bookthief, so the bookthief UI should stop incrementing books from bookstore v1:

```bash
kubectl apply -f - <<EOF
##################################################################################################
# bookstore policy
##################################################################################################
apiVersion: "security.istio.io/v1beta1"
kind: "AuthorizationPolicy"
metadata:
  name: "bookstore"
  namespace: bookstore
spec:
  selector:
    matchLabels:
      app: bookstore
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/bookbuyer/sa/bookbuyer"]
        - source:
            namespaces: ["bookbuyer"]
      to:
        - operation:
            methods: ["GET"]
            paths: ["*/books-bought", "*/buy-a-book/new"]
    - when:
        - key: request.headers[User-Agent]
          values: ["*-http-client/*"]
        - key: request.headers[Client-App]
          values: ["bookbuyer"]
---
##################################################################################################
# bookwarehouse policy
##################################################################################################
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: "bookwarehouse"
  namespace: bookwarehouse
spec:
  selector:
    matchLabels:
      app: bookwarehouse
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/bookstore/sa/bookstore"]
        - source:
            namespaces: ["bookstore"]
      to:
        - operation:
            methods: ["POST"]
---
##################################################################################################
# mysql policy
##################################################################################################
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: "mysql"
  namespace: bookwarehouse
spec:
  selector:
    matchLabels:
      app: mysql
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/bookwarehouse/sa/bookwarehouse"]
        - source:
            namespaces: ["bookwarehouse"]
      to:
         - operation:
            ports: ["3306"]
EOF
```

### Allowing the Bookthief Application to access Bookstore

Currently there is no `AuthorizationPolicy` that allows for the bookthief to communicate with bookstore. We can deploy the following `AuthorizationPolicy` to allow the bookthief to communicate to the bookstore. You notice the addition for the rule for the bookstore policy that allows the bookthief authorization.

```bash
kubectl apply -f - <<EOF
##################################################################################################
# bookstore policy
##################################################################################################
apiVersion: "security.istio.io/v1beta1"
kind: "AuthorizationPolicy"
metadata:
  name: "bookstore"
  namespace: bookstore
spec:
  selector:
    matchLabels:
      app: bookstore
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/bookbuyer/sa/bookbuyer", "cluster.local/ns/bookthief/sa/bookthief"]
        - source:
            namespaces: ["bookbuyer", "bookthief"]
      to:
        - operation:
            methods: ["GET"]
            paths: ["*/books-bought", "*/buy-a-book/new"]
    - when:
        - key: request.headers[User-Agent]
          values: ["*-http-client/*"]
        - key: request.headers[Client-App]
          values: ["bookbuyer"]
---
##################################################################################################
# bookwarehouse policy
##################################################################################################
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: "bookwarehouse"
  namespace: bookwarehouse
spec:
  selector:
    matchLabels:
      app: bookwarehouse
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/bookstore/sa/bookstore"]
        - source:
            namespaces: ["bookstore"]
      to:
        - operation:
            methods: ["POST"]
---
##################################################################################################
# mysql policy
##################################################################################################
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: "mysql"
  namespace: bookwarehouse
spec:
  selector:
    matchLabels:
      app: mysql
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/bookwarehouse/sa/bookwarehouse"]
        - source:
            namespaces: ["bookwarehouse"]
      to:
         - operation:
            ports: ["3306"]
EOF
```

The bookthief UI should now be incrementing books from bookstore v1.

## Configure Traffic Shifting between two Service Versions

To demonstrate how to balance traffic between two versions of a Kubernetes service, known as traffic shifting in Istio. As you recall in a previous section, OSM implementation of traffic shifting relied on two distinct services being deployed and adding those service names to the backend configuration of the `TrafficTarget` policy. This deployment architecture is not needed for how Istio implements traffic shifting. With Istio, we can create multiple deployments that represent each version of the service application and shift traffic to those specific versions via the Istio `virtualservice` configuration.

The currently deployed `virtualservice` only has a route rule to the v1 version of the bookstore shown below:

```yml
spec:
  hosts:
    - bookstore
  http:
    - route:
        - destination:
            host: bookstore
            subset: v1
```

We update the `virtualservice` to shift 100% of the weight to the v2 version of the bookstore.

```bash
kubectl apply -f - <<EOF
# Create bookstore virtual service
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: bookstore-virtualservice
  namespace: bookstore
spec:
  hosts:
  - bookstore
  http:
  - route:
    - destination:
        host: bookstore
        subset: v1
      weight: 0
    - destination:
        host: bookstore
        subset: v2
      weight: 100
EOF
```

You should now see both the `bookbuyer` and `bookthief` UI incrementing for the `bookstore` v2 service only. You can continue to experiment by changing the `weigth` attribute to shift traffic between the two `bookstore` versions.

## Summary

We hope this walk-through provided the necessary guidance on how to migrate your current OSM policies to Istio policies. Take time and review the [Istio Concepts](https://istio.io/latest/docs/concepts/) and walking through [Istio's own Getting Started guide](https://istio.io/latest/docs/setup/getting-started/) to learn how to use the Istio service mesh to manage your applications.
