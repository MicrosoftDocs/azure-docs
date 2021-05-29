---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 03/16/2020
ms.author: larryfr
---

The entries in the `deploymentconfig.json` document map to the parameters for [AksWebservice.deploy_configuration](/python/api/azureml-core/azureml.core.webservice.aks.aksservicedeploymentconfiguration). The following table describes the mapping between the entities in the JSON document and the parameters for the method:

| JSON entity | Method parameter | Description |
| ----- | ----- | ----- |
| `computeType` | NA | The compute target. For AKS, the value must be `aks`. |
| `autoScaler` | NA | Contains configuration elements for autoscale. See the autoscaler table. |
| &emsp;&emsp;`autoscaleEnabled` | `autoscale_enabled` | Whether to enable autoscaling for the web service. If `numReplicas` = `0`, `True`; otherwise, `False`. |
| &emsp;&emsp;`minReplicas` | `autoscale_min_replicas` | The minimum number of containers to use when autoscaling this web service. Default, `1`. |
| &emsp;&emsp;`maxReplicas` | `autoscale_max_replicas` | The maximum number of containers to use when autoscaling this web service. Default, `10`. |
| &emsp;&emsp;`refreshPeriodInSeconds` | `autoscale_refresh_seconds` | How often the autoscaler attempts to scale this web service. Default, `1`. |
| &emsp;&emsp;`targetUtilization` | `autoscale_target_utilization` | The target utilization (in percent out of 100) that the autoscaler should attempt to maintain for this web service. Default, `70`. |
| `dataCollection` | NA | Contains configuration elements for data collection. |
| &emsp;&emsp;`storageEnabled` | `collect_model_data` | Whether to enable model data collection for the web service. Default, `False`. |
| `authEnabled` | `auth_enabled` | Whether or not to enable key authentication for the web service. Both `tokenAuthEnabled` and `authEnabled` cannot be `True`. Default, `True`. |
| `tokenAuthEnabled` | `token_auth_enabled` | Whether or not to enable token authentication for the web service. Both `tokenAuthEnabled` and `authEnabled` cannot be `True`. Default, `False`. |
| `containerResourceRequirements` | NA | Container for the CPU and memory entities. |
| &emsp;&emsp;`cpu` | `cpu_cores` | The number of CPU cores to allocate for this web service. Defaults, `0.1` |
| &emsp;&emsp;`memoryInGB` | `memory_gb` | The amount of memory (in GB) to allocate for this web service. Default, `0.5` |
| `appInsightsEnabled` | `enable_app_insights` | Whether to enable Application Insights logging for the web service. Default, `False`. |
| `scoringTimeoutMs` | `scoring_timeout_ms` | A timeout to enforce for scoring calls to the web service. Default, `60000`. |
| `maxConcurrentRequestsPerContainer` | `replica_max_concurrent_requests` | The maximum concurrent requests per node for this web service. Default, `1`. |
| `maxQueueWaitMs` | `max_request_wait_time` | The maximum time a request will stay in thee queue (in milliseconds) before a 503 error is returned. Default, `500`. |
| `numReplicas` | `num_replicas` | The number of containers to allocate for this web service. No default value. If this parameter is not set, the autoscaler is enabled by default. |
| `keys` | NA | Contains configuration elements for keys. |
| &emsp;&emsp;`primaryKey` | `primary_key` | A primary auth key to use for this Webservice |
| &emsp;&emsp;`secondaryKey` | `secondary_key` | A secondary auth key to use for this Webservice |
| `gpuCores` | `gpu_cores` | The number of GPU cores (per-container replica) to allocate for this Webservice. Default is 1. Only supports whole number values. |
| `livenessProbeRequirements` | NA | Contains configuration elements for liveness probe requirements. |
| &emsp;&emsp;`periodSeconds` | `period_seconds` | How often (in seconds) to perform the liveness probe. Default to 10 seconds. Minimum value is 1. |
| &emsp;&emsp;`initialDelaySeconds` | `initial_delay_seconds` | Number of seconds after the container has started before liveness probes are initiated. Defaults to 310 |
| &emsp;&emsp;`timeoutSeconds` | `timeout_seconds` | Number of seconds after which the liveness probe times out. Defaults to 2 seconds. Minimum value is 1 |
| &emsp;&emsp;`successThreshold` | `success_threshold` | Minimum consecutive successes for the liveness probe to be considered successful after having failed. Defaults to 1. Minimum value is 1. |
| &emsp;&emsp;`failureThreshold` | `failure_threshold` | When a Pod starts and the liveness probe fails, Kubernetes will try failureThreshold times before giving up. Defaults to 3. Minimum value is 1. |
| `namespace` | `namespace` | The Kubernetes namespace that the webservice is deployed into. Up to 63 lowercase alphanumeric ('a'-'z', '0'-'9') and hyphen ('-') characters. The first and last characters can't be hyphens. |

The following JSON is an example deployment configuration for use with the CLI:

```json
{
    "computeType": "aks",
    "autoScaler":
    {
        "autoscaleEnabled": true,
        "minReplicas": 1,
        "maxReplicas": 3,
        "refreshPeriodInSeconds": 1,
        "targetUtilization": 70
    },
    "dataCollection":
    {
        "storageEnabled": true
    },
    "authEnabled": true,
    "containerResourceRequirements":
    {
        "cpu": 0.5,
        "memoryInGB": 1.0
    }
}
```