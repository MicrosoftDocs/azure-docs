---
title: Azure API Management Self-Hosted Gateway - Access Token Authentication
description: Enable the Azure API Management self-hosted gateway to authenticate with its associated cloud-based API Management instance using the default token-based authentication method.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 02/19/2026
ms.author: danlep
ai-usage: ai-assisted
---

# Use token authentication for the self-hosted gateway

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

The Azure API Management [self-hosted gateway](self-hosted-gateway-overview.md) needs connectivity with its associated cloud-based API Management instance for reporting status, checking for and applying configuration updates, and sending metrics and events.

This article shows you how to enable the self-hosted gateway to authenticate by using the default token-based authentication method. This approach uses an access token and endpoint URL to establish secure communication between the self-hosted gateway and your API Management instance. For other authentication options, see [Self-hosted gateway authentication options](self-hosted-gateway-authentication-options.md).


## Prerequisites

- An API Management instance in the Developer or Premium service tier. If needed, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
- A [gateway resource](api-management-howto-provision-self-hosted-gateway.md) on the instance.
- An Azure Kubernetes Service (AKS) cluster or Kubernetes cluster.
- Self-hosted gateway container image version 2.0 or later

## Generate the access token

When you provision a gateway resource in API Management, a default authentication token is generated automatically. To retrieve the token:

1. In the Azure portal, go to your API Management instance.
1. Select **Deployment and infrastructure** > **Gateways**.
1. Select your gateway from the list.
1. On the gateway page, select **Settings** > **Deployment**.
1. Copy the **Token** value. Use this token to authenticate the self-hosted gateway to the API Management instance.
1. Select a deployment script for your environment to copy and use in the next section to deploy the gateway with token authentication.

> [!IMPORTANT]
> * Keep the access token secure. This token grants access to your gateway configuration. Don't commit it to source control or expose it publicly.
> * The access token has a defined lifetime and must be rotated periodically. You can subscribe to system events to be notified when a token is near expiration or has expired. See later sections in this article for details.

## Deploy the self-hosted gateway

Deploy the self-hosted gateway to a containerized environment, such as Kubernetes, by using the default token authentication. 

#### [Helm](#tab/helm)

You can deploy the self-hosted gateway with token authentication by using a [Helm chart](https://github.com/Azure/api-management-self-hosted-gateway).  

Replace the following values in the `helm install` command with your actual values:

- `<gateway-name>`: Your Azure API Management instance name
- `<gateway-url>`: The URL of your gateway, in the format `https://<gateway-name>.configuration.azure-api.net`
- `<gateway-key>`: Your access token    

For prerequisites and details, see [Deploy API Management self-hosted gateway with Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md).


```console
helm install --name azure-api-management-gateway azure-apim-gateway/azure-api-management-gateway \
             --set gateway.configuration.uri='<gateway-url>' \
             --set gateway.auth.key='<gateway-key>'
```

[!INCLUDE [api-management-self-hosted-gateway-kubernetes-services-helm](../../includes/api-management-self-hosted-gateway-kubernetes-services-helm.md)]

#### [YAML](#tab/yaml)

The following sample YAML configuration shows the required components and settings for deployment to Kubernetes with token authentication.

> [!IMPORTANT]
> For steps to install by using a deployment script provided in the Azure portal, see [Deploy a self-hosted gateway to Kubernetes with YAML](how-to-deploy-self-hosted-gateway-kubernetes.md).

> [!NOTE]
> Make sure to replace the placeholder values with your actual configuration:
> - `<namespace-name>`: Your Kubernetes namespace
> - `<service-name>.configuration.azure-api.net`: Your API Management configuration endpoint
> - `<gateway-name>`: Your gateway name
> - `<configuration-token>`: Your access token

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: apim-access-token
  namespace: <namespace-name>
type: Opaque
stringData:
  config.service.auth.key: "<configuration-token>"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: apim-gateway-env
  namespace: <namespace-name>
data:
  gateway.name: <gateway-name>
  config.service.auth: key
  config.service.endpoint: https://<service-name>.configuration.azure-api.net
  telemetry.logs.std.level: info
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: apim-gateway
  namespace: <namespace-name>
spec:
  replicas: 1
  selector:
    matchLabels:
      app: apim-gateway
  template:
    metadata:
      labels:
        app: apim-gateway
    spec:
      containers:
      - name: apim-gateway
        image: mcr.microsoft.com/azure-api-management/gateway:v2
        ports:
        - name: http
          containerPort: 8080
          protocol: TCP
        - name: https
          containerPort: 8081
          protocol: TCP
        readinessProbe:
          failureThreshold: 3
          httpGet:
            path: /internal-status-0123456789abcdef
            port: http
            scheme: HTTP
          periodSeconds: 5
          successThreshold: 1
          timeoutSeconds: 1
        resources:
          limits:
            cpu: "2"
            memory: 2Gi
          requests:
            cpu: "2"
            memory: 2Gi
        envFrom:
        - configMapRef:
            name: apim-gateway-env
        - secretRef:
            name: apim-access-token
---
apiVersion: v1
kind: Service
metadata:
  name: apim-gateway-loadbalancer
  namespace: <namespace-name>
spec:
  type: LoadBalancer
  selector:
    app: apim-gateway
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 8080
  - name: https
    port: 443
    protocol: TCP
    targetPort: 8081
```

The ConfigMap defines the gateway's authentication and connection settings:
- **config.service.auth: key** - Specifies token-based authentication as the method
- **config.service.endpoint** - The API Management configuration endpoint URL
- **gateway.name** - The name of the gateway resource in your API Management instance

### Deploy to Kubernetes

Save the YAML configuration to a file (for example, `apim-access-token.yaml`) and deploy it to your Kubernetes cluster:

```bash
kubectl apply -f apim-access-token.yaml
```

Verify the deployment:

```bash
kubectl get pods -n <namespace-name>
kubectl logs -n <namespace-name> <pod-name>
```

[!INCLUDE [api-management-self-hosted-gateway-kubernetes-services](../../includes/api-management-self-hosted-gateway-kubernetes-services.md)]

---

## Token rotation and management

The access token has a defined lifetime. When the token expires, the gateway loses connectivity to the API Management instance.

To rotate the token:

1. In the Azure portal, go to your API Management instance.
1. Select **Deployment and infrastructure** > **Gateways**.
1. Select your gateway.
1. On the **Deployment** tab, select **Regenerate token**.
1. Copy the new token.
1. Update the Kubernetes Secret with the new token:

```bash
kubectl patch secret apim-access-token -n <namespace-name> -p '{"data":{"config.service.auth.key":"'$(echo -n "<new-token>" | base64)'"}}' --type=merge
```

## Event Grid events for token expiration

API Management generates system events when a self-hosted gateway access token is near expiration or expires. Subscribe to these events to ensure that deployed gateways can always authenticate by using their associated API Management instance. For more information, see [Azure API Management as an Event Grid source](/azure/event-grid/event-schema-api-management).

## Related content

- Learn more about the API Management [self-hosted gateway](self-hosted-gateway-overview.md).
- Learn more about guidance for [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md).
- Compare with [Microsoft Entra workload identity authentication](self-hosted-gateway-enable-workload-identity.md).
- Compare with [Microsoft Entra authentication using client secrets](self-hosted-gateway-enable-azure-ad.md).