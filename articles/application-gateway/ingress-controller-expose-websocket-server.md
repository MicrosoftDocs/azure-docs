---
title: Expose a WebSocket server to Application Gateway
description: This article provides information on how to expose a WebSocket server to Application Gateway with ingress controller for AKS clusters. 
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 08/01/2023
ms.author: greglin
---

# Expose a WebSocket server to Application Gateway

As outlined in the Application Gateway v2 documentation - it [provides native support for the WebSocket and HTTP/2 protocols](features.md#websocket-and-http2-traffic). Both Application Gateway and the Kubernetes Ingress don't have a user-configurable setting to selectively enable or disable WebSocket support.

> [!TIP]
> Also see [What is Application Gateway for Containers?](for-containers/overview.md) currently in public preview.

The following Kubernetes deployment YAML shows the minimum configuration used to deploy a WebSocket server, which is the same as deploying a regular web server:
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

Given that all the prerequisites are fulfilled, and you have an Application Gateway controlled by a Kubernetes Ingress in your AKS, the deployment shown previously would result in a WebSockets server exposed on port 80 of your Application Gateway's public IP and the `ws.contoso.com` domain.

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

## WebSocket Health Probes

If your deployment doesn't explicitly define health probes, Application Gateway would attempt an  HTTP GET on your WebSocket server endpoint.
Depending on the server implementation ([here's one we love](https://github.com/gorilla/websocket/blob/master/examples/chat/main.go)) WebSocket specific headers may be required (`Sec-Websocket-Version` for instance).
Since Application Gateway doesn't add WebSocket headers, the Application Gateway's health probe response from your WebSocket server is most likely `400 Bad Request`.
As a result, Application Gateway marks your pods as unhealthy. This status eventually results in a `502 Bad Gateway` for the consumers of the WebSocket server.
To avoid the bad gateway error, you might need to add an HTTP GET handler for a health check to your server (`/health` for instance, which returns `200 OK`).
