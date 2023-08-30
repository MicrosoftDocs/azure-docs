---
title: Azure Kubernetes Service (AKS) external or internal ingresses for Istio service mesh add-on (preview)
description: Deploy external or internal ingresses for Istio service mesh add-on for Azure Kubernetes Service (preview)
ms.topic: how-to
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
author: asudbring
ms.date: 08/07/2023
ms.author: allensu
---

# Azure Kubernetes Service (AKS) external or internal ingresses for Istio service mesh add-on deployment (preview)

This article shows you how to deploy external or internal ingresses for Istio service mesh add-on for Azure Kubernetes Service (AKS) cluster.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

This guide assumes you followed the [documentation][istio-deploy-addon] to enable the Istio add-on on an AKS cluster, deploy a sample application and set environment variables.

## Enable external ingress gateway

Use `az aks mesh enable-ingress-gateway` to enable an externally accessible Istio ingress on your AKS cluster:

```azurecli-interactive
az aks mesh enable-ingress-gateway --resource-group $RESOURCE_GROUP --name $CLUSTER --ingress-gateway-type external
```

Use `kubectl get svc` to check the service mapped to the ingress gateway:

```bash
kubectl get svc aks-istio-ingressgateway-external -n aks-istio-ingress
```

Observe from the output that the external IP address of the service is a publicly accessible one:

```
NAME                                TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                                      AGE
aks-istio-ingressgateway-external   LoadBalancer   10.0.10.249   <EXTERNAL_IP>   15021:30705/TCP,80:32444/TCP,443:31728/TCP   4m21s
```

Applications aren't accessible from outside the cluster by default after enabling the ingress gateway. To make an application accessible, map the sample deployment's ingress to the Istio ingress gateway using the following manifest:

```bash
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: bookinfo-gateway-external
spec:
  selector:
    istio: aks-istio-ingressgateway-external
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: bookinfo-vs-external
spec:
  hosts:
  - "*"
  gateways:
  - bookinfo-gateway-external
  http:
  - match:
    - uri:
        exact: /productpage
    - uri:
        prefix: /static
    - uri:
        exact: /login
    - uri:
        exact: /logout
    - uri:
        prefix: /api/v1/products
    route:
    - destination:
        host: productpage
        port:
          number: 9080
EOF
```

> [!NOTE]
> The selector used in the Gateway object points to `istio: aks-istio-ingressgateway-external`, which can be found as label on the service mapped to the external ingress that was enabled earlier.

Set environment variables for external ingress host and ports:

```bash
export INGRESS_HOST_EXTERNAL=$(kubectl -n aks-istio-ingress get service aks-istio-ingressgateway-external -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
export INGRESS_PORT_EXTERNAL=$(kubectl -n aks-istio-ingress get service aks-istio-ingressgateway-external -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')
export GATEWAY_URL_EXTERNAL=$INGRESS_HOST_EXTERNAL:$INGRESS_PORT_EXTERNAL
```

Retrieve the external address of the sample application:

```bash
echo "http://$GATEWAY_URL_EXTERNAL/productpage"
```

Navigate to the URL from the output of the previous command and confirm that the sample application's product page is displayed. Alternatively, you can also use `curl` to confirm the sample application is accessible. For example:

```bash
curl -s "http://${GATEWAY_URL_EXTERNAL}/productpage" | grep -o "<title>.*</title>"
```

Confirm that the sample application's product page is accessible. The expected output is:

```html
<title>Simple Bookstore App</title>
```

## Enable internal ingress gateway

Use `az aks mesh enable-ingress-gateway` to enable an internal Istio ingress on your AKS cluster:

```azurecli-interactive
az aks mesh enable-ingress-gateway --resource-group $RESOURCE_GROUP --name $CLUSTER --ingress-gateway-type internal
```


Use `kubectl get svc` to check the service mapped to the ingress gateway:

```bash
kubectl get svc aks-istio-ingressgateway-internal -n aks-istio-ingress
```

Observe from the output that the external IP address of the service isn't a publicly accessible one and is instead only locally accessible:

```
NAME                                TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                                      AGE
aks-istio-ingressgateway-internal   LoadBalancer   10.0.182.240  <IP>      15021:30764/TCP,80:32186/TCP,443:31713/TCP   87s
```

Applications aren't mapped to the Istio ingress gateway after enabling the ingress gateway. Use the following manifest to map the sample deployment's ingress to the Istio ingress gateway:

```bash
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: bookinfo-internal-gateway
spec:
  selector:
    istio: aks-istio-ingressgateway-internal
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: bookinfo-vs-internal
spec:
  hosts:
  - "*"
  gateways:
  - bookinfo-internal-gateway
  http:
  - match:
    - uri:
        exact: /productpage
    - uri:
        prefix: /static
    - uri:
        exact: /login
    - uri:
        exact: /logout
    - uri:
        prefix: /api/v1/products
    route:
    - destination:
        host: productpage
        port:
          number: 9080
EOF
```

> [!NOTE]
> The selector used in the Gateway object points to `istio: aks-istio-ingressgateway-internal`, which can be found as label on the service mapped to the internal ingress that was enabled earlier.

Set environment variables for internal ingress host and ports:

```bash
export INGRESS_HOST_INTERNAL=$(kubectl -n aks-istio-ingress get service aks-istio-ingressgateway-internal -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
export INGRESS_PORT_INTERNAL=$(kubectl -n aks-istio-ingress get service aks-istio-ingressgateway-internal -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')
export GATEWAY_URL_INTERNAL=$INGRESS_HOST_INTERNAL:$INGRESS_PORT_INTERNAL
```

Retrieve the address of the sample application:

```bash
echo "http://$GATEWAY_URL_INTERNAL/productpage"
```

Navigate to the URL from the output of the previous command and confirm that the sample application's product page is  **NOT** displayed. Alternatively, you can also use `curl` to confirm the sample application is **NOT** accessible. For example:

```bash
curl -s "http://${GATEWAY_URL_INTERNAL}/productpage" | grep -o "<title>.*</title>"
```

Use `kubectl exec` to confirm application is accessible from inside the cluster's virtual network:

```bash
kubectl exec "$(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}')" -c ratings -- curl -sS  "http://$GATEWAY_URL_INTERNAL/productpage"  | grep -o "<title>.*</title>"
```

Confirm that the sample application's product page is accessible. The expected output is:

```html
<title>Simple Bookstore App</title>
```

## Delete resources

If you want to clean up the Istio service mesh and the ingresses (leaving behind the cluster), run the following command:

```azurecli-interactive
az aks mesh disable --resource-group ${RESOURCE_GROUP} --name ${CLUSTER}
```

If you want to clean up all the resources created from the Istio how-to guidance documents, run the following command:

```azurecli-interactive
az group delete --name ${RESOURCE_GROUP} --yes --no-wait
```

[istio-deploy-addon]: istio-deploy-addon.md
