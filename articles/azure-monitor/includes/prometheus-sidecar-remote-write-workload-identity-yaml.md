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
    externalLabels:
          cluster: <AKS-CLUSTER-NAME>
    podMetadata:
        labels:
            azure.workload.identity/use: "true"
    ## https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write    
    remoteWrite:
    - url: 'http://localhost:8081/api/v1/write'

    containers:
    - name: prom-remotewrite
      image: <CONTAINER-IMAGE-VERSION>
      imagePullPolicy: Always
      ports:
        - name: rw-port
          containerPort: 8081
      env:
      - name: INGESTION_URL
        value: <INGESTION_URL>
      - name: LISTENING_PORT
        value: '8081'
      - name: IDENTITY_TYPE
        value: workloadIdentity
```