---
title: Expose a WebSocket server to Application Gateway
description: This article provides information on how to expose a WebSocket server to Application Gateway with an ingress controller for AKS clusters. 
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 2/28/2025
ms.author: greglin
---

# Expose a WebSocket server to Application Gateway

Azure Application Gateway v2 [provides native support for the WebSocket and HTTP/2 protocols](features.md#websocket-and-http2-traffic). Both Application Gateway and the Kubernetes ingress don't have a user-configurable setting to selectively enable or disable WebSocket support.

> [!TIP]
> Consider [Application Gateway for Containers](for-containers/overview.md) for your Kubernetes ingress solution. For more information, see [Quickstart: Deploy Application Gateway for Containers ALB Controller](for-containers/quickstart-deploy-application-gateway-for-containers-alb-controller.md).

## YAML for WebSocket server deployment

The following Kubernetes deployment YAML shows the minimum configuration for deploying a WebSocket server, which is the same as deploying a regular web server:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: websocket-server
spec:
  selector:
    matchLabels:
      app: ws-app
  replicas: 2
  template:
    metadata:
      labels:
        app: ws-app
    spec:
      containers:
        - name: websocket-app
          imagePullPolicy: Always
          image: your-container-repo.azurecr.io/websockets-app
          ports:
            - containerPort: 8888
      imagePullSecrets:
        - name: azure-container-registry-credentials

---

apiVersion: v1
kind: Service
metadata:
  name: websocket-app-service
spec:
  selector:
    app: ws-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8888

---

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: websocket-repeater
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
spec:
  rules:
    - host: ws.contoso.com
      http:
        paths:
          - backend:
              serviceName: websocket-app-service
              servicePort: 80
```

Assuming that all the prerequisites are fulfilled, and you have an Application Gateway deployment controlled by a Kubernetes ingress in Azure Kubernetes Service (AKS), the preceding deployment would result in a WebSocket server exposed on port 80 of your Application Gateway deployment's public IP address and the `ws.contoso.com` domain.

The following cURL command would test the WebSocket server deployment:

```shell
curl -i -N -H "Connection: Upgrade" \
        -H "Upgrade: websocket" \
        -H "Origin: http://localhost" \
        -H "Host: ws.contoso.com" \
        -H "Sec-Websocket-Version: 13" \
        -H "Sec-WebSocket-Key: 123" \
        http://1.2.3.4:80/ws
```

## WebSocket health probes

If your deployment doesn't explicitly define health probes, Application Gateway attempts an HTTP `GET` operation on your WebSocket server endpoint.
Depending on the server implementation (such as [this example](https://github.com/gorilla/websocket/blob/master/examples/chat/main.go)), you might need WebSocket-specific headers (`Sec-Websocket-Version`, for instance).

Because Application Gateway doesn't add WebSocket headers, the Application Gateway health probe response from your WebSocket server is most likely `400 Bad Request`. Application Gateway then marks your pods as unhealthy. This status eventually results in a `502 Bad Gateway` error for the consumers of the WebSocket server.

To avoid the `502 Bad Gateway` error, you might need to add an HTTP `GET` handler for a health check to your server. For example, `/health` returns `200 OK`.

## Related content

- [Application Gateway for Containers](for-containers/overview.md)
- [Application Gateway for Containers - WebSocket support](for-containers/websockets.md)
