---
title: "Tutorial: Deploy a multi-container application managed by Open Service Mesh (OSM) with NGINX ingress"
description: Deploy a multi-container application managed by Open Service Mesh (OSM) with NGINX ingress
services: container-service
ms.topic: quickstart
ms.date: 3/17/2021
ms.custom: mvc
ms.author: phillipgibson
---

# Tutorial: Deploy a multi-container application managed by Open Service Mesh (OSM) with NGINX ingress

Open Service Mesh (OSM) is a lightweight, extensible, Cloud Native service mesh that allows users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

In this tutorial, you will:

> [!div class="checklist"]
>
> - View the current OSM cluster configuration
> - Create the namespace(s) for OSM to manage deployed applications in the namespace(s)
> - Onboard the namespaces to be managed by OSM
> - Deploy the sample multi-container application
> - Verify the multi-container application running inside the AKS cluster
> - Create a NGINX ingress controller used for the multi-container appliction
> - Expose a service via the Azure Application Gateway ingress to the internet

## Before you begin

The steps detailed in this article assume that you've created an AKS cluster (Kubernetes `1.19+` and above, with Kubernetes RBAC enabled), have established a `kubectl` connection with the cluster (If you need help with any of these items, then see the [AKS quickstart](./kubernetes-walkthrough.md), and have installed the [AKS OSM add-on](./servicemesh-osm-instgll.md).

You must have the following resources installed:

- The Azure CLI, version 2.20.0 or later
- The `azure-preview` extension version 0.5.5 or later
- OSM version v0.8.0 or later

## View and verify the current OSM cluster configuration

Once the OSM add-on for AKS has been enabled on the AKS cluster, you can view the current configuration parmaters in the osm-config Kubernetes ConfigMap. Run the following command to view the ConfigMap properties:

```azurecli
kubectl get configmap -n kube-system osm-config -o json | jq '.data'
```

Output shows the current OSM configuration for the cluster.

```Output
{
  "egress": "false",
  "enable_debug_server": "false",
  "enable_privileged_init_container": "false",
  "envoy_log_level": "error",
  "permissive_traffic_policy_mode": "true",
  "prometheus_scraping": "true",
  "service_cert_validity_duration": "24h",
  "tracing_enable": "false",
  "use_https_ingress": "false"
}
```

Notice the **permissive_traffic_policy_mode** is configured to **true**. Permissive traffic policy mode in OSM is a mode where the [SMI](https://smi-spec.io/) traffic policy enforcement is bypassed. In this mode, OSM automatically discovers services that are a part of the service mesh and programs traffic policy rules on each Envoy proxy sidecar to be able to communicate with these services.

## Create namespaces for the multi-container application

In this totorial we will be using the OMS bookstore appplication that has the following application components:

- bookbuyer
- booktheif
- bookstore
- bookwarehous

Create namespaces for each of these application components.

```azurecli
for i in bookstore bookbuyer bookthief bookwarehouse; do kubectl create ns $i; done
```

You should see the following output:

```Output
namespace/bookstore created
namespace/bookbuyer created
namespace/bookthief created
namespace/bookwarehouse created
```

## Onboard the namespaces to be managed by OSM

When you add the namespaces to the OSM mesh, this will allow the OSM controller to automatically inject the Envoy sidecar proxy containers with you application. Run the following command to onboard the OSM bookstore application namespaces.

```azurecli
osm namespace add bookstore bookbuyer bookthief bookwarehouse
```

You should see the following output:

```Output
Namespace [bookstore] successfully added to mesh [osm]
Namespace [bookbuyer] successfully added to mesh [osm]
Namespace [bookthief] successfully added to mesh [osm]
Namespace [bookwarehouse] successfully added to mesh [osm]
```

## Deploy the Bookstore multi-container application to the AKS cluster

```azurecli
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/main/docs/example/manifests/apps/bookbuyer.yaml
```

```azurecli
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/main/docs/example/manifests/apps/bookthief.yaml
```

```azurecli
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/main/docs/example/manifests/apps/bookstore.yaml
```

```azurecli
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/main/docs/example/manifests/apps/bookwarehouse.yaml
```

All of the deployment outputs are summarized below.

```Output
serviceaccount/bookbuyer created
service/bookbuyer created
deployment.apps/bookbuyer created

serviceaccount/bookthief created
service/bookthief created
deployment.apps/bookthief created

service/bookstore created
serviceaccount/bookstore created
deployment.apps/bookstore created

serviceaccount/bookwarehouse created
service/bookwarehouse created
deployment.apps/bookwarehouse created
```

## Verify the Bookstore multi-container application running inside the AKS cluster

As of now we have deployed the bookstore mulit-container application, but it is only accessible from within the AKS cluster. Later we will add the Azure Application Gateway ingress controller to expose the appliction outside the AKS cluster. To verify that the application is running inside the cluster, we will use a port forward to view the bookbuyer component UI.

First let's get the bookbuyer pod's name

```Console
kubectl get pod -n bookbuyer
```

You should see output similar to the following. Your bookbuyer pod will have a unique name appended.

```Output
NAME                         READY   STATUS    RESTARTS   AGE
bookbuyer-7676c7fcfb-mtnrz   2/2     Running   0          7m8s
```

Once we have the pod's name, we can now use the port-forward command to setup a tunnel from our local system to the application inside the AKS cluster. Run the following command to setup the port forward for the local system port 8080. Again use your specice bookbuyer pod name.

```Console
kubectl port-forward bookbuyer-7676c7fcfb-mtnrz -n bookbuyer 8080:14001
```

You should see output similar to this.

```Output
Forwarding from 127.0.0.1:8080 -> 14001
Forwarding from [::1]:8080 -> 14001
```

While the port forwarding session is in place, navigate to the following url from a browser `http://localhost:8080`. You should now be able to see the bookbuyer application UI in the browser similar to the image below.

![OSM bookbuyer app UI image](./media/aks-osm-addon/osm-agic-bookbuyer-img.png)

## Create an NGINX ingress controller in Azure Kubernetes Service (AKS)

An ingress controller is a piece of software that provides reverse proxy, configurable traffic routing, and TLS termination for Kubernetes services. Kubernetes ingress resources are used to configure the ingress rules and routes for individual Kubernetes services. Using an ingress controller and ingress rules, a single IP address can be used to route traffic to multiple services in a Kubernetes cluster.

We will utilize the ingress controller to expose the multi-container application managed by OSM to the internet. To create the ingress controller, use Helm to install nginx-ingress. For added redundancy, two replicas of the NGINX ingress controllers are deployed with the `--set controller.replicaCount` parameter. To fully benefit from running replicas of the ingress controller, make sure there's more than one node in your AKS cluster.

The ingress controller also needs to be scheduled on a Linux node. Windows Server nodes shouldn't run the ingress controller. A node selector is specified using the `--set nodeSelector` parameter to tell the Kubernetes scheduler to run the NGINX ingress controller on a Linux-based node.

> [!TIP]
> The following example creates a Kubernetes namespace for the ingress resources named _ingress-basic_. Specify a namespace for your own environment as needed.

```azurecli
# Create a namespace for your ingress resources
kubectl create namespace ingress-basic

# Add the ingress-nginx repository
helm repo add ingress-nginx https://helm.nginx.com/stable

# Update the helm repo(s)
helm repo update

# Use Helm to deploy an NGINX ingress controller in the ingress-basic namespace
helm install nginx-ingress ingress-nginx/ingress-nginx \
    --namespace ingress-basic \
    --set controller.replicaCount=1 \
    --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux
```

When the Kubernetes load balancer service is created for the NGINX ingress controller, a dynamic public IP address is assigned, as shown in the following example output:

```
$ kubectl --namespace ingress-basic get services -o wide -w nginx-ingress-ingress-nginx-controller

NAME                                     TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                      AGE   SELECTOR
nginx-ingress-ingress-nginx-controller   LoadBalancer   10.0.74.133   EXTERNAL_IP     80:32486/TCP,443:30953/TCP   44s   app.kubernetes.io/component=controller,app.kubernetes.io/instance=nginx-ingress,app.kubernetes.io/name=ingress-nginx
```

No ingress rules have been created yet, so the NGINX ingress controller's default 404 page is displayed if you browse to the internal IP address. Ingress rules are configured in the following steps.

## Expose the bookbuyer service to the internet

```Console
kubectl apply -f - <<EOF
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: bookbuyer-ingress
  namespace: bookbuyer
  annotations:
    kubernetes.io/ingress.class: nginx

spec:

  rules:
    - host: bookbuyer.contoso.com
      http:
        paths:
        - path: /
          backend:
            serviceName: bookbuyer
            servicePort: 14001

  backend:
    serviceName: bookbuyer
    servicePort: 14001
EOF
```

You should see the following output

```Output
Warning: extensions/v1beta1 Ingress is deprecated in v1.14+, unavailable in v1.22+; use networking.k8s.io/v1 Ingress
ingress.extensions/bookbuyer-ingress created
```

## View the NGINX logs

```Console
POD=$(kubectl get pods -n ingress-basic | grep 'nginx-ingress' | awk '{print $1}')

kubectl logs $POD -f
```

Output shows the NGINX ingress controller status when ingress rule has been applied successfully:

```Output
I0321 <date>       6 event.go:282] Event(v1.ObjectReference{Kind:"Pod", Namespace:"ingress-basic", Name:"nginx-ingress-ingress-nginx-controller-54cf6c8bf4-jdvrw", UID:"3ebbe5e5-50ef-481d-954d-4b82a499ebe1", APIVersion:"v1", ResourceVersion:"3272", FieldPath:""}): type: 'Normal' reason: 'RELOAD' NGINX reload triggered due to a change in configuration
I0321 <date>        6 event.go:282] Event(v1.ObjectReference{Kind:"Ingress", Namespace:"bookbuyer", Name:"bookbuyer-ingress", UID:"e1018efc-8116-493c-9999-294b4566819e", APIVersion:"networking.k8s.io/v1beta1", ResourceVersion:"5460", FieldPath:""}): type: 'Normal' reason: 'Sync' Scheduled for sync
I0321 <date>        6 controller.go:146] "Configuration changes detected, backend reload required"
I0321 <date>        6 controller.go:163] "Backend successfully reloaded"
I0321 <date>        6 event.go:282] Event(v1.ObjectReference{Kind:"Pod", Namespace:"ingress-basic", Name:"nginx-ingress-ingress-nginx-controller-54cf6c8bf4-jdvrw", UID:"3ebbe5e5-50ef-481d-954d-4b82a499ebe1", APIVersion:"v1", ResourceVersion:"3272", FieldPath:""}): type: 'Normal' reason: 'RELOAD' NGINX reload triggered due to a change in configuration
```

## View the NGINX services

```Console
kubectl get services -n ingress-basic
```

```Output
NAME                                     TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)                      AGE
nginx-ingress-1616041155-nginx-ingress   LoadBalancer   10.0.120.194   EXTERNAL-IP    80:32237/TCP,443:31563/TCP   23m
```

Since the host name in the ingress manifest is a psuedo name used for testing, the DNS name will not be available on the internet. We can alternatively use the curl program and past the hostname header to the NGINX public IP address and receive a 200 code succesfully connecting us to the bookbuyer service.

```Console

curl -H 'Host: bookbuyer.contoso.com' http://EXTERNAL-IP/
```

<!-- LINKS - internal -->

[kubernetes-service]: concepts-network.md#services
