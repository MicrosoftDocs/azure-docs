---

title: Backend MTLS with Traffic Controller
titlesuffix: Azure Application Load Balancer
description: Learn how to configure Traffic Controller with support for backend MTLS authentication.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: how-to
ms.date: 5/1/2023
ms.author: greglin
---

# Backend MTLS with Traffic Controller

This document helps set up an example application that uses the following resources from Gateway API:
- [Gateway](https://gateway-api.sigs.k8s.io/concepts/api-overview/#gateway) - creating a gateway with one https listener
- [HTTPRoute](https://gateway-api.sigs.k8s.io/v1alpha2/api-types/httproute/) - creating an HTTP route that references a backend service
- [BackendTLSPolicy](api-specification-kubernetes.md#backendtlspolicy) - creating a backend TLS policy that has a client and CA certificate for the backend service referenced in the HTTPRoute

## Prerequisites
Ensure you have set up your Traffic Controller and ALB Controller following the [Quickstart guide](quickstart-create-traffic-controller.md).

Set the following environment variables
```bash
# This may be omitted if you are in the same shell session as where you created the Traffic Controller deployment
RESOURCE_GROUP='<name of the resource group where Traffic Controller is deployed>'
TRAFFIC_CONTROLLER_NAME='<name of the Traffic Controller resource>'
FRONTEND_NAME='<name of the Frontend resource of the Traffic Controller>'

# Get the frontend public IP address to access the system
publicIPAddressId=$(az resource show --namespace Microsoft.ServiceNetworking --resource-type frontends --resource-group $RESOURCE_GROUP --name $FRONTEND_NAME --parent "trafficControllers/$TRAFFIC_CONTROLLER_NAME" --query 'properties.publicIPAddress.id' -o tsv)
ip=$(az network public-ip show --id $publicIPAddressId --query "ipAddress" -o tsv)
```

## Deploy HTTPS Application
Apply the following deployment.yaml file on your cluster:
```bash
kubectl apply -f https://trafficcontrollerdocs.blob.core.windows.net/examples/https-scenario/end-to-end-ssl-with-backend-mtls/deployment.yaml
```

This creates the following on your cluster:
- a namespace called `test-infra`
- 1 service called `mtls-app` in the `test-infra` namespace
- 1 deployment called `mtls-app` in the `test-infra` namespace
- 1 config map called `mtls-app-nginx-cm` in the `test-infra` namespace
- 4 secrets called `backend.com`, `frontend.com` `gateway-client-cert` and `ca.bundle` in the `test-infra` namespace

## Deploy the required gateway api objects

1. Create a Gateway
    ```bash
    kubectl apply -f - <<EOF
    apiVersion: gateway.networking.k8s.io/v1beta1
    kind: Gateway
    metadata:
      name: gateway-01
      namespace: test-infra
    spec:
      gatewayClassName: azure-application-lb
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
            name: frontend.com
      addresses:
      - type: NamedAddress
        value: $publicIPAddressId
    EOF
    ```

    Once the gateway object has been created check the status on the object to ensure that the gateway is valid and the listener is ready. Verify that the address assigned to the gateway is the resource ID of your public IP Address

2. Create an HTTPRoute
    ```bash
    kubectl apply -f - <<EOF
    apiVersion: gateway.networking.k8s.io/v1beta1
    kind: HTTPRoute
    metadata:
      name: http-route
      namespace: test-infra
    spec:
      parentRefs:
      - name: gateway-01
      rules:
      - backendRefs:
        - name: mtls-app
          port: 443
    EOF
    ```
    Once the HTTPRoute object has been created check the status on the object to ensure that the route is accepted.

3. Create a BackendTLSPolicy
    ```bash
    kubectl apply -f - <<EOF
    apiVersion: networking.azure.io/v1alpha1
    kind: BackendTLSPolicy
    metadata:
      name: mtls-app-tls-policy
      namespace: test-infra
    spec:
      targetRef:
        group: ""
        kind: Service
        name: mtls-app
        namespace: test-infra
      default:
        sni: backend.com
        ports:
        - port: 443
        clientCertificateRef:
          name: gateway-client-cert
          group: ""
          kind: Secret
        verify:
          caCertificateRef:
            name: ca.bundle
            group: ""
            kind: Secret
          subjectAltName: backend.com
    EOF
    ```

    Once the BackendTLSPolicy object has been create check the status on the object to ensure that the policy is valid.

## Test access to the application

Now we're ready to send some traffic to our sample application, via the public IP Address. Use the command below to get the IP address

Curling this IP should return responses from the backend as configured on the HTTPRoute.
```bash
curl --insecure https://$ip/
```

Congratulations, you have installed ALB controller, deployed a backend application and routed traffic to the application via the ingress on Traffic Controller.
