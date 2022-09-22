---
title: High Scale and metric volume
description: 
ms.topic: conceptual
ms.date: 08/29/2022
ms.reviewer: viviandiec
---

# High Scale and metric volume


## CPU and Memory
The CPU and memory usage is correlated with the number of bytes of each sample and the number of samples scraped. Below are benchmarks based on the default targets scraped, volume of custom metrics scraped, and number of nodes, pods, and containers. These numbers are meant as a reference rather than a guarantee, since usage can still vary greatly depending on the number of timeseries and bytes per metric.

The upper volume limit per pod is currently about 3-3.5 million samples per minute, depending on the number of bytes per sample. This limitation will be eliminated when sharding is added to the feature.

The agent consists of a deployment with one replica and daemonset for scraping metrics. The daemonset scrapes any node-level targets such as cAdvisor, kubelet, and node exporter. You can also configure it to scrape any custom targets at the node level with static configs. The replicaset scrapes everything else such as kube-state-metrics or custom scrape jobs that utilize service discovery.

### Replicaset in Small vs Large Cluster

  Scrape Targets | Samples Sent / Minute | Node Count | Pod Count | Prometheus-Collector CPU Usage (cores) |Prometheus-Collector Memory Usage (bytes)
  | --- | --- | --- | --- | --- | --- |
  | default targets | 11,344 | 3 | 40 | 12.9 mc | 148 Mi |
  | default targets | 260,000  | 340 | 13000 | 1.10 c | 1.70 GB |
  | default targets + custom targets | 3.56 million | 340 | 13000 | 5.13 c | 9.52 GB |

### Daemonset in Small Cluster vs Large Cluster

  Scrape Targets | Samples Sent / Minute Total | Samples Sent / Minute / Pod |  Node Count | Pod Count | Prometheus-Collector CPU Usage Total (cores) |Prometheus-Collector Memory Usage Total (bytes) | Prometheus-Collector CPU Usage / Pod (cores) |Prometheus-Collector Memory Usage / Pod (bytes)
  | --- | --- | --- | --- | -- | --- | --- | --- | --- |
  | default targets | 9,858 | 3,327 | 3 | 40 | 41.9 mc | 581 Mi | 14.7 mc | 189 Mi |
  | default targets | 2.3 million | 14,400 | 340 | 13000 | 805 mc | 305.34 GB | 2.36 mc | 898 Mi |

  For additional custom metrics, the single pod will behave the same as the replicaset pod depending on the volume of custom metrics.


### Schedule ama-metrics replicaset pod on a nodepool with more resources 

Note that a very large volume of metrics per pod will require a large enough node to be able to handle the CPU and memory usage required. 
If the ama-metrics replicaset pod doesn't get scheduled on a node that has enough resources, it might keep getting OOMKilled and go to CrashLoopBackoff.
In order to overcome this, if you have a node on your cluster that has higher resources(preferably in the system nodepool) and want to get the replicaset scheduled on that node, you can add the label 'azuremonitor/metrics.replica.preferred=true' on the node and the replicaset pod will get scheduled on this node.  
  ```
  kubectl label nodes <node-name> azuremonitor/metrics.replica.preferred="true"
  ```

## Next steps
