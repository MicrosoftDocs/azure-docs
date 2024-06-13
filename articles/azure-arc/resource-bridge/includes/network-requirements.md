---
ms.topic: include
ms.date: 05/22/2024
---

### Outbound connectivity requirements

The firewall and proxy URLs below must be allowlisted in order to enable communication from the management machine, Appliance VM, and Control Plane IP to the required Arc resource bridge URLs.

### Firewall/Proxy URL allowlist

|**Service**|**Port**|**URL**|**Direction**|**Notes**|
|--|--|--|--|--|
|SFS API endpoint | 443 | `msk8s.api.cdp.microsoft.com` | Management machine & Appliance VM IPs need outbound connection. | Download product catalog, product bits, and OS images from SFS. |
|Resource bridge (appliance) image download| 443 | `msk8s.sb.tlu.dl.delivery.mp.microsoft.com`| Management machine & Appliance VM IPs need outbound connection. |  Download the Arc Resource Bridge OS images.|
|Microsoft Container Registry| 443 | `mcr.microsoft.com`| Management machine & Appliance VM IPs need outbound connection. | Download container images for Arc Resource Bridge.|
|Windows NTP Server| 123 | `time.windows.com` | Management machine & Appliance VM IPs (if Hyper-V default is Windows NTP) need outbound connection on UDP | OS time sync in appliance VM & Management machine (Windows NTP).|
|Azure Resource Manager| 443 | `management.azure.com`| Management machine & Appliance VM IPs need outbound connection. | Manage resources in Azure. |
|Microsoft Graph | 443 | `graph.microsoft.com` | Management machine & Appliance VM IPs need outbound connection. | Required for Azure RBAC. |
|Azure Resource Manager | 443 | `login.microsoftonline.com`| Management machine & Appliance VM IPs need outbound connection. | Required to update ARM tokens.|
|Azure Resource Manager | 443 | `*.login.microsoft.com`| Management machine & Appliance VM IPs need outbound connection. | Required to update ARM tokens.|
|Azure Resource Manager | 443 | `login.windows.net`| Management machine & Appliance VM IPs need outbound connection. | Required to update ARM tokens.|
|Resource bridge (appliance) Dataplane service| 443 | `*.dp.prod.appliances.azure.com`| Appliance VMs IP need outbound connection. | Communicate with resource provider in Azure.|
|Resource bridge (appliance) container image download| 443 | `*.blob.core.windows.net, ecpacr.azurecr.io`| Appliance VM IPs need outbound connection. | Required to pull container images. |
|Managed Identity| 443 | `*.his.arc.azure.com`| Appliance VM IPs need outbound connection. | Required to pull system-assigned Managed Identity certificates. | 
|Azure Arc for Kubernetes container image download| 443 | `azurearcfork8s.azurecr.io`|  Appliance VM IPs need outbound connection. | Pull container images. |
|Azure Arc agent| 443 | `k8connecthelm.azureedge.net`|  Appliance VM IPs need outbound connection. | deploy Azure Arc agent. |
|ADHS telemetry service | 443 | `adhs.events.data.microsoft.com`| Appliance VM IPs need outbound connection. | Periodically sends Microsoft required diagnostic data from appliance VM. |
|Microsoft events data service | 443 |`v20.events.data.microsoft.com`| Appliance VM IPs need outbound connection. | Send diagnostic data from Windows. |
|Log collection for Arc Resource Bridge| 443 | `linuxgeneva-microsoft.azurecr.io`| Appliance VM IPs need outbound connection. | Push logs for Appliance managed components.|
|Resource bridge components download| 443 | `kvamanagementoperator.azurecr.io`| Appliance VM IPs need outbound connection. | Pull artifacts for Appliance managed components.|
|Microsoft open source packages manager| 443 | `packages.microsoft.com`| Appliance VM IPs need outbound connection. | Download Linux installation package.|
|Custom Location| 443 | `sts.windows.net`| Appliance VM IPs need outbound connection. | Required for Custom Location.|
|Azure Arc| 443 | `guestnotificationservice.azure.com` | Appliance VM IPs need outbound connection. | Required for Azure Arc.|
|Custom Location | 443 | `k8sconnectcsp.azureedge.net` | Appliance VM IPs need outbound connection. | Required for Custom Location. |
|Diagnostic data | 443 | `gcs.prod.monitoring.core.windows.net` | Appliance VM IPs need outbound connection. | Periodically sends Microsoft required diagnostic data. |
|Diagnostic data | 443 | `*.prod.microsoftmetrics.com` | Appliance VM IPs need outbound connection. | Periodically sends Microsoft required diagnostic data. |
|Diagnostic data | 443 | `*.prod.hot.ingest.monitor.core.windows.net` | Appliance VM IPs need outbound connection. | Periodically sends Microsoft required diagnostic data. |
|Diagnostic data | 443 | `*.prod.warm.ingest.monitor.core.windows.net` | Appliance VM IPs need outbound connection. | Periodically sends Microsoft required diagnostic data. |
|Azure portal | 443 | `*.arc.azure.net`| Appliance VM IPs need outbound connection. | Manage cluster from Azure portal.|
|Azure CLI & Extension | 443 | `*.blob.core.windows.net`| Management machine needs outbound connection. | Download Azure CLI Installer and extension. |
|Azure Arc Agent| 443 | `*.dp.kubernetesconfiguration.azure.com`| Management machine needs outbound connection. | Dataplane used for Arc agent.|
|Python package| 443 | `pypi.org`, `*.pypi.org`| Management machine needs outbound connection. | Validate Kubernetes and Python versions.|
|Azure CLI| 443 | `pythonhosted.org`, `*.pythonhosted.org`| Management machine needs outbound connection. | Python packages for Azure CLI installation.|

## Inbound connectivity requirements

The following ports must be allowlisted in your firewall/proxy to enable communication between the management machine, Appliance VM IPs, and Control Plane IPs. Ensure these ports are open to facilitate the deployment and maintenance of Arc resource bridge.

|**Service**|**Port**|**URL**|**Direction**|**Notes**|
|--|--|--|--|--|
|SSH| 22 | `appliance VM IPs` and `Management machine` | Bidirectional | Used for deploying and maintaining the appliance VM.|
|Kubernetes API server| 6443 | `appliance VM IPs` and `Management machine` | Bidirectional | Management of the appliance VM.|
|HTTPS | 443 | `private cloud management console` | Management machine needs outbound connection. | Communication with management console (for example, VMware vCenter Server).|

