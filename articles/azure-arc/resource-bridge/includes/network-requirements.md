---
ms.topic: include
ms.date: 03/19/2024
---

### Outbound connectivity

The firewall and proxy URLs below must be allowlisted in order to enable communication from the management machine, Appliance VM, and Control Plane IP to the required Arc resource bridge URLs.

### Firewall/Proxy URL allowlist

|**Service**|**Port**|**URL**|**Direction**|**Notes**|
|--|--|--|--|--|
|SFS API endpoint | 443 | `msk8s.api.cdp.microsoft.com` | Management machine & Appliance VM IPs need outbound connection. | Download product catalog, product bits, and OS images from SFS. |
|Resource bridge (appliance) Dataplane service| 443 | `https://*.dp.prod.appliances.azure.com`| Appliance VMs IP need outbound connection. | Communicate with resource provider in Azure.|
|Resource bridge (appliance) container image download| 443 | `*.blob.core.windows.net, https://ecpacr.azurecr.io`| Appliance VM IPs need outbound connection. | Required to pull container images. |
|Managed Identity| 443 | `*.his.arc.azure.com`| Appliance VM IPs need outbound connection. | Required to pull system-assigned Managed Identity certificates. | 
|Resource bridge (appliance) image download| 443 | `msk8s.sb.tlu.dl.delivery.mp.microsoft.com`| Management machine & Appliance VM IPs need outbound connection. |  Download the Arc Resource Bridge OS images.  |
|Azure Arc for Kubernetes container image download| 443 | `https://azurearcfork8s.azurecr.io`|  Appliance VM IPs need outbound connection. | Required to pull container images. |
|ADHS telemetry service | 443 | `adhs.events.data.microsoft.com`| Appliance VM IPs need outbound connection. | Periodically sends Microsoft required diagnostic data from appliance VM. |
|Microsoft events data service | 443 |`v20.events.data.microsoft.com`| Appliance VM IPs need outbound connection. | Send diagnostic data from Windows, like Windows Server or Azure Stack HCI. |
|Log collection for Arc Resource Bridge| 443 | `linuxgeneva-microsoft.azurecr.io`| Appliance VM IPs need outbound connection. | Push logs for Appliance managed components.|
|Azure Arc for Kubernetes container image download| 443 | `https://azurearcfork8sdev.azurecr.io`|  Appliance VM IPs need outbound connection. | Pull container images. |
|Resource bridge components download| 443 | `kvamanagementoperator.azurecr.io`| Appliance VM IPs need outbound connection. | Pull artifacts for Appliance managed components.|
|Microsoft Container Registry| 443 | `https://mcr.microsoft.com`| Management machine & Appliance VM IPs need outbound connection. | Download container images for Arc Resource Bridge.|
|Microsoft open source packages manager| 443 | `packages.microsoft.com`| Appliance VM IPs need outbound connection. | Download Linux installation package.|
|Custom Locations| 443 | `sts.windows.net`| Appliance VM IPs need outbound connection. | Required for use by the Custom Locations cluster extension.|
|Python package| 443 | `pypi.org`, `*.pypi.org`| Management machine needs outbound connection. | Validate Kubernetes and Python versions.|
|Azure CLI| 443 | `pythonhosted.org`, `*.pythonhosted.org`| Management machine needs outbound connection. | Python packages for Azure CLI installation.|
|Diagnostic data | 443 | `gcs.prod.monitoring.core.windows.net`	|	Appliance VM IPs need outbound connection. | Periodically sends Microsoft required diagnostic data. |
|Windows NTP Server| 123 | `time.windows.com` | Appliance VM & Management machine (if Hyper-V default is Windows NTP) need outbound connection on UDP | OS time sync in appliance VM & Management machine (Windows NTP).|
