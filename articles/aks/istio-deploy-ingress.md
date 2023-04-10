---
title: Deploy external or internal ingresses for Istio service mesh add-on for Azure Kubernetes Service (preview)
description: Deploy external or internal ingresses for Istio service mesh add-on for Azure Kubernetes Service (preview)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 04/09/2023
ms.author: shasb
---

# Deploy external or internal ingresses for Istio service mesh add-on for Azure Kubernetes Service (preview)

This article shows you how to deploy external or internal ingresses for Istio service mesh add-on for Azure Kubernetes Service (AKS) cluster.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

Complete the steps listed in the [Istio add-on deployment document][istio-deploy-addon]. The rest of this ingress enablement guide builds on top of the Istio add-on and the sample application that were deployed in the previous document.

## Enable external ingress gateway

1. Run the following command to enable externally accessible Istio ingress on your AKS cluster:

    ```azurecli-interactive
    az aks mesh enable-ingress-gateway --resource-group $RESOURCE_GROUP --name $CLUSTER --ingress-gateway-type external
    ```

    Check the service mapped to the ingress gateway:

    ```bash
    kubectl get svc aks-istio-ingressgateway-external -n aks-istio-ingress
    ```

    **Expected output:**

    ```
    NAME                                TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                                      AGE
    aks-istio-ingressgateway-external   LoadBalancer   10.0.10.249   20.69.150.235   15021:30705/TCP,80:32444/TCP,443:31728/TCP   4m21s
    ```

1. The Bookinfo application is deployed but not accessible from the outside. To make it accessible, you need to create an Istio Ingress Gateway mapped to the ingress you deployed in previous step. Apply the following:

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

1. Set environment variables for external ingress host and ports:

    ```bash
    export INGRESS_HOST_EXTERNAL=$(kubectl -n aks-istio-ingress get service aks-istio-ingressgateway-external -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    export INGRESS_PORT_EXTERNAL=$(kubectl -n aks-istio-ingress get service aks-istio-ingressgateway-external -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')
    export GATEWAY_URL_EXTERNAL=$INGRESS_HOST_EXTERNAL:$INGRESS_PORT_EXTERNAL
    ```

1. Run the following command to retrieve the external address of the Bookinfo application:

    ```bash
    echo "http://$GATEWAY_URL_EXTERNAL/productpage"
    ```

    Paste the output from the previous command into your web browser and confirm that the Bookinfo product page is displayed. Or run the following command:

    ```bash
    curl -s "http://${GATEWAY_URL_EXTERNAL}/productpage" | grep -o "<title>.*</title>"
    ```


## Enable internal ingress gateway

1. Run the following command to enable Istio ingress only accessible from the virtual network of your AKS cluster:

    ```azurecli-interactive
    az aks mesh enable-ingress-gateway --resource-group $RESOURCE_GROUP --name $CLUSTER --ingress-gateway-type internal
    ```

    Check the service mapped to the ingress gateway:

    ```bash
    kubectl get svc aks-istio-ingressgateway-internal -n aks-istio-ingress
    ```

    **Expected output:**

    ```
    NAME                                TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                                      AGE
    aks-istio-ingressgateway-internal   LoadBalancer   10.0.182.240  10.224.0.7      15021:30764/TCP,80:32186/TCP,443:31713/TCP   87s
    ```

1. Create an Istio Ingress Gateway mapped to the ingress you deployed in previous step. Apply the following:

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

1. Set environment variables for external ingress host and ports:

    ```bash
    export INGRESS_HOST_INTERNAL=$(kubectl -n aks-istio-ingress get service aks-istio-ingressgateway-internal -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    export INGRESS_PORT_INTERNAL=$(kubectl -n aks-istio-ingress get service aks-istio-ingressgateway-internal -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')
    export GATEWAY_URL_INTERNAL=$INGRESS_HOST_INTERNAL:$INGRESS_PORT_INTERNAL
    ```

1. Run the following command to retrieve the external address of the Bookinfo application:

    ```bash
    echo "http://$GATEWAY_URL_INTERNAL/productpage"
    ```

    Paste the output from the previous command into your web browser and confirm that the Bookinfo product page is **not displayed**, or try running the following curl command:

    ```bash
    curl -s "http://${GATEWAY_URL_INTERNAL}/productpage" | grep -o "<title>.*</title>"
    ```

1. Verify application is accessible from inside the cluster's virtual network:

    ```bash
    kubectl exec "$(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}')" -c ratings -- curl -sS  "http://$GATEWAY_URL_INTERNAL/productpage"  | grep -o "<title>.*</title>"
    ```

    **Expected output:**

    ```
    <title>Simple Bookstore App</title>
    ```

[istio-deploy-addon]: istio-deploy-addon.md