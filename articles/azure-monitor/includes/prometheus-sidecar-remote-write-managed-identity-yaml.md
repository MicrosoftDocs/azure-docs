```yml
prometheus:
  prometheusSpec:
    externalLabels:
          cluster: AKS-CLUSTER-NAME

    ## https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write    
    remoteWrite:
    - url: 'http://localhost:8081/api/v1/write'
  ## Azure Managed Prometheus currently exports some default mixins in Grafana. 
  ## These mixins are compatible with Azure Monitor agent on your Azure Kubernetes Service cluster. 
  ## However, these mixins aren't compatible with Prometheus metrics scraped by the Kube Prometheus stack. 
  ## In order to make these mixins compatible, uncomment remote write relabel configuration below:

  ## writeRelabelConfigs:
  ##   - sourceLabels: [metrics_path]
  ##     regex: /metrics/cadvisor
  ##     targetLabel: job
  ##     replacement: cadvisor
  ##     action: replace
  ##   - sourceLabels: [job]
  ##     regex: 'node-exporter'
  ##     targetLabel: job
  ##     replacement: node
  ##     action: replace
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
