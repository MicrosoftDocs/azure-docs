---
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.topic: include
ms.date: 11/12/2023
---

```yaml
prometheus:
  prometheusSpec:
    externalLabels:
      cluster: <CLUSTER-NAME>  

    ##	Azure Managed Prometheus currently exports some default mixins in Grafana.  
    ##  These mixins are compatible with data scraped by Azure Monitor agent on your 
    ##  Azure Kubernetes Service cluster. These mixins aren't compatible with Prometheus 
    ##  metrics scraped by the Kube Prometheus stack. 
    ##  To make these mixins compatible, uncomment the remote write relabel configuration below:
    ##	writeRelabelConfigs:
    ##	  - sourceLabels: [metrics_path]
    ##	    regex: /metrics/cadvisor
    ##	    targetLabel: job
    ##	    replacement: cadvisor
    ##	    action: replace
    ##	  - sourceLabels: [job]
    ##	    regex: 'node-exporter'
    ##	    targetLabel: job
    ##	    replacement: node
    ##	    action: replace  
    ## https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write
    remoteWrite:
      - url: 'http://localhost:8081/api/v1/write'
    
    # Additional volumes on the output StatefulSet definition.
    # Required only for Microsoft Entra ID based auth
    volumes:
      - name: secrets-store-inline
        csi:
          driver: secrets-store.csi.k8s.io
          readOnly: true
          volumeAttributes:
            secretProviderClass: azure-kvname-user-msi
    containers:
      - name: prom-remotewrite
        image: <CONTAINER-IMAGE-VERSION>
        imagePullPolicy: Always
        # Required only for Microsoft Entra ID based auth
        volumeMounts:
          - name: secrets-store-inline
            mountPath: /mnt/secrets-store
            readOnly: true
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
            value: '<INGESTION_URL>'
          - name: LISTENING_PORT
            value: '8081'
          - name: IDENTITY_TYPE
            value: aadApplication
          - name: AZURE_CLIENT_ID
            value: '<APP-REGISTRATION-CLIENT-ID>'
          - name: AZURE_TENANT_ID
            value: '<TENANT-ID>'
          - name: AZURE_CLIENT_CERTIFICATE_PATH
            value: /mnt/secrets-store/<CERT-NAME>
          - name: CLUSTER
            value: '<CLUSTER-NAME>'
```
