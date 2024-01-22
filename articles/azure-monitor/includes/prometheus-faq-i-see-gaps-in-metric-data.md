---
ms.service: azure-monitor
ms.topic: include
ms.date: 10/31/2023
ms.author: edbaynash
author: EdB-MSFT
---

### I see some gaps in metric data, why is this occurring?   

During node updates, you might see a 1-minute to 2-minute gap in metric data for metrics collected from our cluster level collectors. This gap occurs because the node that the data runs on is being updated as part of a normal update process. This update process affects cluster-wide targets such as kube-state-metrics and custom application targets that are specified. This occurs when your cluster is updated manually or via autoupdate. This behavior is expected and occurs due to the node it runs on being updated. This behavior doesn't affect any of our recommended alert rules. 
