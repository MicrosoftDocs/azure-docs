---
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.topic: include
ms.date: 11/12/2023
---


```yml
apiVersion: keda.sh/v1alpha1
kind: TriggerAuthentication
metadata:
  name: azure-managed-prometheus-trigger-auth
spec:
  podIdentity:
      provider: azure-workload | azure # use "azure" for pod identity and "azure-workload" for workload identity
      identityId: <identity-id> # Optional. Default: Identity linked with the label set when installing KEDA.
---
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: azure-managed-prometheus-scaler
spec:
  scaleTargetRef:
    name: deployment-name-to-be-scaled
  minReplicaCount: 1
  maxReplicaCount: 20
  triggers:
  - type: prometheus
    metadata:
      serverAddress: https://test-azure-monitor-workspace-name-1234.eastus.prometheus.monitor.azure.com
      metricName: http_requests_total
      query: sum(rate(http_requests_total{deployment="my-deployment"}[2m])) # Note: query must return a vector/scalar single element response
      threshold: '100.50'
      activationThreshold: '5.5'
    authenticationRef:
      name: azure-managed-prometheus-trigger-auth
```