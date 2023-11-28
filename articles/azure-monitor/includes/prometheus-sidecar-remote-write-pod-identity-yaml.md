---
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.topic: include
ms.date: 11/12/2023
---

```yml
prometheus: 
  prometheusSpec: 
    podMetadata: 
      labels: 
        aadpodidbinding: <AzureIdentityBindingSelector> 
    externalLabels: 
      cluster: <AKS-CLUSTER-NAME> 
    remoteWrite: 
    - url: 'http://localhost:8081/api/v1/write' 
    containers: 
    - name: prom-remotewrite 
      image: <CONTAINER-IMAGE-VERSION> 
      imagePullPolicy: Always 
      ports: 
        - name: rw-port 
      containerPort: 8081 
      livenessProbe: 
        httpGet: 
          path: /health
          port: rw-port
          initialDelaySeconds: 10 
          timeoutSeconds: 10 
      readinessProbe: 
         httpGet: 
          path: /ready
          port: rw-port
          initialDelaySeconds: 10 
          timeoutSeconds: 10 
    env: 
      - name: INGESTION_URL 
        value: <INGESTION_URL> 
      - name: LISTENING_PORT 
        value: '8081' 
      - name: IDENTITY_TYPE 
        value: userAssigned 
      - name: AZURE_CLIENT_ID 
        value: <MANAGED-IDENTITY-CLIENT-ID> 
      # Optional parameter 
      - name: CLUSTER 
        value: <CLUSTER-NAME>         
```