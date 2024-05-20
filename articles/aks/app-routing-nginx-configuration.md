---
title: Configure multiple ingress controllers and NGINX ingress annotations with the application routing add-on for Azure Kubernetes Service (AKS)
description: Understand the advanced configuration options that are supported with the application routing add-on with the NGINX ingress controller for Azure Kubernetes Service (AKS). 
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 11/21/2023
---

# Advanced NGINX ingress controller and ingress configurations with the application routing add-on

The application routing add-on supports two ways to configure ingress controllers and ingress objects:

- [Configuration of the NGINX ingress controller](#configuration-of-the-nginx-ingress-controller) such as creating multiple controllers, configuring private load balancers, and setting static IP addresses.
- [Configuration per ingress resource](#configuration-per-ingress-resource-through-annotations) through annotations.

## Prerequisites

An AKS cluster with the [application routing add-on][app-routing-add-on-basic-configuration].

## Connect to your AKS cluster

To connect to the Kubernetes cluster from your local computer, you use `kubectl`, the Kubernetes command-line client. You can install it locally using the [az aks install-cli][az-aks-install-cli] command. If you use the Azure Cloud Shell, `kubectl` is already installed.

Configure kubectl to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

```azurecli-interactive
az aks get-credentials -resource-group <ResourceGroupName> --name <ClusterName>
```

## Configuration of the NGINX ingress controller

The application routing add-on uses a Kubernetes [custom resource definition (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) called [`NginxIngressController`](https://github.com/Azure/aks-app-routing-operator/blob/main/config/crd/bases/approuting.kubernetes.azure.com_nginxingresscontrollers.yaml) to configure NGINX ingress controllers. You can create more ingress controllers or modify existing configuration.

`NginxIngressController` CRD has a `loadBalancerAnnotations` field to control the behavior of the NGINX ingress controller's service by setting [load balancer annotations](load-balancer-standard.md#customizations-via-kubernetes-annotations). 


### The default NGINX ingress controller

When you enable the application routing add-on with NGINX, it creates an ingress controller called `default` in the `app-routing-namespace` configured with a public facing Azure load balancer. That ingress controller uses an ingress class name of `webapprouting.kubernetes.azure.com`.

### Create another public facing NGINX ingress controller

To create another NGINX ingress controller with a public facing Azure Load Balancer:

1. Copy the following YAML manifest into a new file named **nginx-public-controller.yaml** and save the file to your local computer.

    ```yml
    apiVersion: approuting.kubernetes.azure.com/v1alpha1
    kind: NginxIngressController
    metadata:
      name: nginx-public
    spec:
      ingressClassName: nginx-public
      controllerNamePrefix: nginx-public
    ```

1. Create the NGINX ingress controller resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f nginx-public-controller.yaml
    ```

    The following example output shows the created resource:

    ```output
    nginxingresscontroller.approuting.kubernetes.azure.com/nginx-public created
    ```

### Create an internal NGINX ingress controller with a private IP address

To create an NGINX ingress controller with an internal facing Azure Load Balancer with a private IP address:

1. Copy the following YAML manifest into a new file named **nginx-internal-controller.yaml** and save the file to your local computer.

    ```yml
    apiVersion: approuting.kubernetes.azure.com/v1alpha1
    kind: NginxIngressController
    metadata:
      name: nginx-internal
    spec:
      ingressClassName: nginx-internal
      controllerNamePrefix: nginx-internal
      loadBalancerAnnotations: 
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    ```

1. Create the NGINX ingress controller resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f nginx-internal-controller.yaml
    ```

    The following example output shows the created resource:

    ```output
    nginxingresscontroller.approuting.kubernetes.azure.com/nginx-internal created
    ```

### Create an NGINX ingress controller with a static IP address

To create an NGINX ingress controller with a static IP address on the Azure Load Balancer:

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myNetworkResourceGroup --location eastus
    ```

1. Create a static public IP address using the [`az network public ip create`][az-network-public-ip-create] command.

    ```azurecli-interactive
    az network public-ip create \
        --resource-group myNetworkResourceGroup \
        --name myIngressPublicIP \
        --sku Standard \
        --allocation-method static
    ```

    > [!NOTE]
    > If you're using a *Basic* SKU load balancer in your AKS cluster, use *Basic* for the `--sku` parameter when defining a public IP. Only *Basic* SKU IPs work with the *Basic* SKU load balancer and only *Standard* SKU IPs work with *Standard* SKU load balancers.

1. Ensure the cluster identity used by the AKS cluster has delegated permissions to the public IP's resource group using the [`az role assignment create`][az-role-assignment-create] command.

    > [!NOTE]
    > Update *`<ClusterName>`* and *`<ClusterResourceGroup>`* with your AKS cluster's name and resource group name.

    ```azurecli-interactive
    CLIENT_ID=$(az aks show --name <ClusterName> --resource-group <ClusterResourceGroup> --query identity.principalId -o tsv)
    RG_SCOPE=$(az group show --name myNetworkResourceGroup --query id -o tsv)
    az role assignment create \
        --assignee ${CLIENT_ID} \
        --role "Network Contributor" \
        --scope ${RG_SCOPE}
    ```

1. Copy the following YAML manifest into a new file named **nginx-staticip-controller.yaml** and save the file to your local computer.

    > [!NOTE]
    > You can either use `service.beta.kubernetes.io/azure-pip-name` for public IP name, or use `service.beta.kubernetes.io/azure-load-balancer-ipv4` for an IPv4 address and `service.beta.kubernetes.io/azure-load-balancer-ipv6` for an IPv6 address, as shown in the example YAML. Adding the `service.beta.kubernetes.io/azure-pip-name` annotation ensures the most efficient LoadBalancer creation and is highly recommended to avoid potential throttling. 

    ```yml
    apiVersion: approuting.kubernetes.azure.com/v1alpha1
    kind: NginxIngressController
    metadata:
      name: nginx-static
    spec:
      ingressClassName: nginx-static
      controllerNamePrefix: nginx-static
      loadBalancerAnnotations: 
        service.beta.kubernetes.io/azure-pip-name: "myIngressPublicIP"
        service.beta.kubernetes.io/azure-load-balancer-resource-group: "myNetworkResourceGroup"
    ```

1. Create the NGINX ingress controller resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f nginx-staticip-controller.yaml
    ```

    The following example output shows the created resource:

    ```output
    nginxingresscontroller.approuting.kubernetes.azure.com/nginx-static created
    ```

### Verify the ingress controller was created

You can verify the status of the NGINX ingress controller using the [`kubectl get nginxingresscontroller`][kubectl-get] command.

> [!NOTE]
> Update *`<IngressControllerName>`* with name you used when creating the `NginxIngressController``.

```bash
kubectl get nginxingresscontroller -n <IngressControllerName>
```

The following example output shows the created resource. It may take a few minutes for the controller to be available:

```output
NAME           INGRESSCLASS   CONTROLLERNAMEPREFIX   AVAILABLE
nginx-public   nginx-public   nginx                  True
```

You can also view the conditions to troubleshoot any issues:

```bash
kubectl get nginxingresscontroller -n <IngressControllerName> -o jsonpath='{range .items[*].status.conditions[*]}{.lastTransitionTime}{"\t"}{.status}{"\t"}{.type}{"\t"}{.message}{"\n"}{end}'
```

The following example output shows the conditions of a healthy ingress controller:

```output
2023-11-29T19:59:24Z    True    IngressClassReady       Ingress Class is up-to-date
2023-11-29T19:59:50Z    True    Available               Controller Deployment has minimum availability and IngressClass is up-to-date
2023-11-29T19:59:50Z    True    ControllerAvailable     Controller Deployment is available
2023-11-29T19:59:25Z    True    Progressing             Controller Deployment has successfully progressed
```

### Use the ingress controller in an ingress

1. Copy the following YAML manifest into a new file named **ingress.yaml** and save the file to your local computer.

    > [!NOTE]
    > Update *`<Hostname>`* with your DNS host name.
    > The *`<IngressClassName>`* is the one you defined when creating the `NginxIngressController`.

    ```yml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: aks-helloworld
      namespace: hello-web-app-routing
    spec:
      ingressClassName: <IngressClassName>
      rules:
      - host: <Hostname>
        http:
          paths:
          - backend:
              service:
                name: aks-helloworld
                port:
                  number: 80
            path: /
            pathType: Prefix
    ```

3. Create the cluster resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f ingress.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resource:

    ```output
    ingress.networking.k8s.io/aks-helloworld created
    ```


### Verify the managed Ingress was created

You can verify the managed Ingress was created using the [`kubectl get ingress`][kubectl-get] command.

```bash
kubectl get ingress -n hello-web-app-routing
```

The following example output shows the created managed Ingress. The ingress class, host and IP address may be different:

```output
NAME             CLASS                                HOSTS               ADDRESS       PORTS     AGE
aks-helloworld   webapprouting.kubernetes.azure.com   myapp.contoso.com   20.51.92.19   80, 443   4m
```

### Clean up of ingress controllers

You can remove the NGINX ingress controller using the [`kubectl delete nginxingresscontroller`][kubectl-delete] command.

> [!NOTE]
> Update *`<IngressControllerName>`* with name you used when creating the `NginxIngressController`.

```bash
kubectl delete nginxingresscontroller -n <IngressControllerName>
```

## Configuration per ingress resource through annotations

The NGINX ingress controller supports adding [annotations to specific Ingress objects](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/) to customize their behavior. 

You can [annotate](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) the ingress object by adding the respective annotation in the `metadata.annotations` field.

> [!NOTE]
> Annotation keys and values can only be strings. Other types, such as boolean or numeric values must be quoted, i.e. `"true"`, `"false"`, `"100"`.

Here are some examples annotations for common configurations. Review the [NGINX ingress annotations documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/) for a full list.

### Custom max body size

For NGINX, a 413 error is returned to the client when the size in a request exceeds the maximum allowed size of the client request body. To override the default value, use the annotation: 

```yml
nginx.ingress.kubernetes.io/proxy-body-size: 4m
```

Here's an example ingress configuration using this annotation:

> [!NOTE]
> Update *`<Hostname>`* with your DNS host name.
> The *`<IngressClassName>`* is the one you defined when creating the `NginxIngressController`.

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aks-helloworld
  namespace: hello-web-app-routing
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: 4m
spec:
  ingressClassName: <IngressClassName>
  rules:
  - host: <Hostname>
    http:
      paths:
      - backend:
          service:
            name: aks-helloworld
            port:
              number: 80
        path: /
        pathType: Prefix
```

### Custom connection timeout

You can change the timeout that the NGINX ingress controller waits to close a connection with your workload. All timeout values are unitless and in seconds. To override the default timeout, use the following annotation to set a valid 120-seconds proxy read timeout:

```yml
nginx.ingress.kubernetes.io/proxy-read-timeout: "120"
```

Review [custom timeouts](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#custom-timeouts) for other configuration options.

Here's an example ingress configuration using this annotation:

> [!NOTE]
> Update *`<Hostname>`* with your DNS host name.
> The *`<IngressClassName>`* is the one you defined when creating the `NginxIngressController`.

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aks-helloworld
  namespace: hello-web-app-routing
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "120"
spec:
  ingressClassName: <IngressClassName>
  rules:
  - host: <Hostname>
    http:
      paths:
      - backend:
          service:
            name: aks-helloworld
            port:
              number: 80
        path: /
        pathType: Prefix
```

### Backend protocol

By default the NGINX ingress controller uses `HTTP` to reach the services. To configure alternative backend protocols such as `HTTPS` or `GRPC`, use the annotation:

```yml
nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
``` 
or
```yml
nginx.ingress.kubernetes.io/backend-protocol: "GRPC"
```

Review [backend protocols](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#backend-protocol) for other configuration options.

Here's an example ingress configuration using this annotation:

> [!NOTE]
> Update *`<Hostname>`* with your DNS host name.
> The *`<IngressClassName>`* is the one you defined when creating the `NginxIngressController`.

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aks-helloworld
  namespace: hello-web-app-routing
  annotations:
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
spec:
  ingressClassName: <IngressClassName>
  rules:
  - host: <Hostname>
    http:
      paths:
      - backend:
          service:
            name: aks-helloworld
            port:
              number: 80
        path: /
        pathType: Prefix
```

### Cross-Origin Resource Sharing (CORS)

To enable Cross-Origin Resource Sharing (CORS) in an Ingress rule, use the annotation:

```yml
nginx.ingress.kubernetes.io/enable-cors: "true"
```

Review [enable CORS](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#enable-cors) for other configuration options.

Here's an example ingress configuration using this annotation:

> [!NOTE]
> Update *`<Hostname>`* with your DNS host name.
> The *`<IngressClassName>`* is the one you defined when creating the `NginxIngressController`.

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aks-helloworld
  namespace: hello-web-app-routing
  annotations:
    nginx.ingress.kubernetes.io/enable-cors: "true"
spec:
  ingressClassName: <IngressClassName>
  rules:
  - host: <Hostname>
    http:
      paths:
      - backend:
          service:
            name: aks-helloworld
            port:
              number: 80
        path: /
        pathType: Prefix
```

### Disable SSL redirect

By default the controller redirects (308) to HTTPS if TLS is enabled for an ingress. To disable this feature for specific ingress resources, use the annotation:

```yml
nginx.ingress.kubernetes.io/ssl-redirect: "false"
```

Review [server-side HTTPS enforcement through redirect](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-side-https-enforcement-through-redirect) for other configuration options.

Here's an example ingress configuration using this annotation:

> [!NOTE]
> Update *`<Hostname>`* with your DNS host name.
> The *`<IngressClassName>`* is the one you defined when creating the `NginxIngressController`.

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aks-helloworld
  namespace: hello-web-app-routing
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
spec:
  ingressClassName: <IngressClassName>
  rules:
  - host: <Hostname>
    http:
      paths:
      - backend:
          service:
            name: aks-helloworld
            port:
              number: 80
        path: /
        pathType: Prefix
```

### URL rewriting

In some scenarios, the exposed URL in the backend service differs from the specified path in the Ingress rule. Without a rewrite any request returns 404. This is particularly useful with [path based routing](https://kubernetes.github.io/ingress-nginx/user-guide/ingress-path-matching/) where you can serve two different web applications under the same domain. You can set path expected by the service using the annotation:

```yml
nginx.ingress.kubernetes.io/rewrite-target": /$2
```

Here's an example ingress configuration using this annotation:

> [!NOTE]
> Update *`<Hostname>`* with your DNS host name.
> The *`<IngressClassName>`* is the one you defined when creating the `NginxIngressController`.

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aks-helloworld
  namespace: hello-web-app-routing
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  ingressClassName: <IngressClassName>
  rules:
  - host: <Hostname>
    http:
      paths:
      - path: /app-one(/|$)(.*)
        pathType: Prefix 
        backend:
          service:
            name: app-one
            port:
              number: 80
      - path: /app-two(/|$)(.*)
        pathType: Prefix 
        backend:
          service:
            name: app-two
            port:
              number: 80
```

## Next steps

Learn about monitoring the ingress-nginx controller metrics included with the application routing add-on with [with Prometheus in Grafana][prometheus-in-grafana] as part of analyzing the performance and usage of your application.

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete

<!-- LINKS - internal -->
[az-network-public-ip-create]: /cli/azure/network/public-ip#az_network_public_ip_create
[az-network-public-ip-list]: /cli/azure/network/public-ip#az_network_public_ip_list
[az-group-create]: /cli/azure/group#az-group-create
[summary-msi]: use-managed-identity.md#summary-of-managed-identities
[rbac-owner]: ../role-based-access-control/built-in-roles.md#owner
[rbac-classic]: ../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles
[app-routing-add-on-basic-configuration]: app-routing.md
[csi-secrets-store-autorotation]: csi-secrets-store-configuration-options.md#enable-and-disable-auto-rotation
[azure-key-vault-overview]: ../key-vault/general/overview.md
[az-aks-approuting-update]: /cli/azure/aks/approuting#az-aks-approuting-update
[az-aks-approuting-zone]: /cli/azure/aks/approuting/zone
[az-network-dns-zone-show]: /cli/azure/network/dns/zone#az-network-dns-zone-show
[az-network-dns-zone-create]: /cli/azure/network/dns/zone#az-network-dns-zone-create
[az-keyvault-certificate-import]: /cli/azure/keyvault/certificate#az-keyvault-certificate-import
[az-keyvault-create]: /cli/azure/keyvault#az-keyvault-create
[authorization-systems]: ../key-vault/general/rbac-access-policy.md
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[create-and-export-a-self-signed-ssl-certificate]: #create-and-export-a-self-signed-ssl-certificate
[create-an-azure-dns-zone]: #create-a-global-azure-dns-zone
[azure-dns-overview]: ../dns/dns-overview.md
[az-keyvault-certificate-show]: /cli/azure/keyvault/certificate#az-keyvault-certificate-show
[prometheus-in-grafana]: app-routing-nginx-prometheus.md
