---
author: msakande
ms.service: machine-learning
ms.topic: include
ms.date: 02/27/2024
ms.author: mopeakande
---

> [!NOTE]
> Managed online endpoints share the workspace's private endpoint. If you're manually adding DNS records to the private DNS zone `privatelink.api.azureml.ms`, an A record with wildcard
> `*.<per-workspace globally-unique identifier>.inference.<region>.privatelink.api.azureml.ms` should be added to route all endpoints under the workspace to the private endpoint.