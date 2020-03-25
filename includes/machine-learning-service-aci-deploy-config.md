---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 03/16/2020
ms.author: larryfr
---

The entries in the `deploymentconfig.json` document map to the parameters for [AciWebservice.deploy_configuration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aci.aciservicedeploymentconfiguration?view=azure-ml-py). The following table describes the mapping between the entities in the JSON document and the parameters for the method:

| JSON entity | Method parameter | Description |
| ----- | ----- | ----- |
| `computeType` | NA | The compute target. For ACI, the value must be `ACI`. |
| `containerResourceRequirements` | NA | Container for the CPU and memory entities. |
| &emsp;&emsp;`cpu` | `cpu_cores` | The number of CPU cores to allocate. Defaults, `0.1` |
| &emsp;&emsp;`memoryInGB` | `memory_gb` | The amount of memory (in GB) to allocate for this web service. Default, `0.5` |
| `location` | `location` | The Azure region to deploy this Webservice to. If not specified the Workspace location will be used. More details on available regions can be found here: [ACI Regions](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=container-instances) |
| `authEnabled` | `auth_enabled` | Whether to enable auth for this Webservice. Defaults to False |
| `sslEnabled` | `ssl_enabled` | Whether to enable SSL for this Webservice. Defaults to False. |
| `appInsightsEnabled` | `enable_app_insights` | Whether to enable AppInsights for this Webservice. Defaults to False |
| `sslCertificate` | `ssl_cert_pem_file` | The cert file needed if SSL is enabled |
| `sslKey` | `ssl_key_pem_file` | The key file needed if SSL is enabled |
| `cname` | `ssl_cname` | The cname for if SSL is enabled |
| `dnsNameLabel` | `dns_name_label` | The dns name label for the scoring endpoint. If not specified a unique dns name label will be generated for the scoring endpoint. |

The following JSON is an example deployment configuration for use with the CLI:

```json
{
    "computeType": "aci",
    "containerResourceRequirements":
    {
        "cpu": 0.5,
        "memoryInGB": 1.0
    },
    "authEnabled": true,
    "sslEnabled": false,
    "appInsightsEnabled": false
}
```