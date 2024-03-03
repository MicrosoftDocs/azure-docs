---
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.topic: include
ms.date: 11/12/2023
---

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
    labels:
        app: azuremonitor-ingestion
    name: azuremonitor-ingestion
    namespace: observability
spec:
    replicas: 1
    selector:
        matchLabels:
            app: azuremonitor-ingestion
    template:
        metadata:
            labels:
                app: azuremonitor-ingestion
            name: azuremonitor-ingestion
        spec:
            containers:
            - name: aad-auth-proxy
              image: mcr.microsoft.com/azuremonitor/auth-proxy/prod/aad-auth-proxy/images/aad-auth-proxy:0.1.0-main-05-24-2023-b911fe1c
              imagePullPolicy: Always
              ports:
              - name: auth-port
                containerPort: 8081
              env:
              - name: AUDIENCE
                value: https://monitor.azure.com/.default
              - name: TARGET_HOST
                value: http://<workspace-endpoint-hostname>
              - name: LISTENING_PORT
                value: "8081"
              - name: IDENTITY_TYPE
                value: userAssigned
              - name: AAD_CLIENT_ID
                value: <clientId>
              - name: AAD_TOKEN_REFRESH_INTERVAL_IN_PERCENTAGE
                value: "10"
              - name: OTEL_GRPC_ENDPOINT
                value: <YOUR-OTEL-GRPC-ENDPOINT> # "otel-collector.observability.svc.cluster.local:4317"
              - name: OTEL_SERVICE_NAME
                value: <YOUE-SERVICE-NAME>
              livenessProbe:
                httpGet:
                  path: /health
                  port: auth-port
                initialDelaySeconds: 5
                timeoutSeconds: 5
              readinessProbe:
                httpGet:
                  path: /ready
                  port: auth-port
                initialDelaySeconds: 5
                timeoutSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
    name: azuremonitor-ingestion
    namespace: observability
spec:
    ports:
        - port: 80
          targetPort: 8081
    selector:
        app: azuremonitor-ingestion
```  