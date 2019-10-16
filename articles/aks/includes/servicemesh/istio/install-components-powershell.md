---
author: paulbouwer
ms.service: container-service
ms.topic: include
ms.date: 10/09/2019
ms.author: pabouwer
---

```powershell
helm install istio.io/istio --name istio --namespace istio-system --version "1.3.2" `
  --set global.controlPlaneSecurityEnabled=true `
  --set global.mtls.enabled=true `
  --set grafana.enabled=true --set grafana.security.enabled=true `
  --set tracing.enabled=true `
  --set kiali.enabled=true `
  --set global.defaultNodeSelector."beta\.kubernetes\.io/os"=linux
```