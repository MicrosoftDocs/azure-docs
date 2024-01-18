---
ms.topic: include
ms.date: 06/02/2023
---

### Outbound connectivity

The firewall and proxy URLs below must be allowlisted in order to enable communication from the management machine, Appliance VM, and Control Plane IP to the required Arc resource bridge URLs.

### Firewall/Proxy URL allowlist

>[!Note]
>To configure SSL proxy and to view the exclusion list for no proxy, see [Additional network requirements](/azure/azure-arc/resource-bridge/network-requirements#additional-network-requirements).

|**Service**|**Port**|**URL**|**Direction**|**Notes**|
|--|--|--|--|--|
|SFS API endpoint | 443 | `msk8s.api.cdp.microsoft.com` | Management machine & Appliance VM IPs need outbound connection. | Used when downloading product catalog, product bits, and OS images from SFS. |
|Resource bridge (appliance) Dataplane service| 443 | `https://*.dp.prod.appliances.azure.com`| Appliance VMs IP need outbound connection. | Communicate with resource provider in Azure.|
|Resource bridge (appliance) container image download| 443 | `*.blob.core.windows.net, https://ecpacr.azurecr.io`| Appliance VM IPs need outbound connection. | Required to pull container images. |
|Managed Identity| 443 | `*.his.arc.azure.com`| Appliance VM IPs need outbound connection. | Required to pull system-assigned Managed Identity certificates. | 
|Resource bridge (appliance) image download| 80 | `msk8s.b.tlu.dl.delivery.mp.microsoft.com`| Management machine & Appliance VM IPs need outbound connection. |  *Only needed for Arc Appliance CLI extension version 0.2.32 and below.* Download the Arc Resource Bridge OS images.  |
|Resource bridge (appliance) image download| 443 | `msk8s.sb.tlu.dl.delivery.mp.microsoft.com`| Management machine & Appliance VM IPs need outbound connection. |  Download the Arc Resource Bridge OS images.  |
|Azure Arc for Kubernetes container image download| 443 | `https://azurearcfork8s.azurecr.io`|  Appliance VM IPs need outbound connection. | Required to pull container images. |
|ADHS telemetry service | 443 | `adhs.events.data.microsoft.com`| Appliance VM IPs need outbound connection. | Used periodically to send Microsoft required diagnostic data and telemetry from within the appliance VM. |
|Microsoft events data service | 443 |`v20.events.data.microsoft.com`| Appliance VM IPs need outbound connection. | Used periodically to send Microsoft required diagnostic data from the Azure Stack HCI or Windows Server host. Used when telemetry is coming off Windows like Windows Server or HCI. |
|Log collection for Arc Resource Bridge| 443 | `linuxgeneva-microsoft.azurecr.io`| Appliance VM IPs need outbound connection. | Push logs for Appliance managed components.|
|Azure Arc for Kubernetes container image download| 443 | `https://azurearcfork8sdev.azurecr.io`|  Appliance VM IPs need outbound connection. | Pull container images. |
|Resource bridge components download| 443 | `kvamanagementoperator.azurecr.io`| Appliance VM IPs need outbound connection. | Pull artifacts for Appliance managed components.|
|Microsoft Container Registry| 443 | `https://mcr.microsoft.com`| Management machine & Appliance VM IPs need outbound connection. | Download container images for Arc Resource Bridge.|
|Microsoft open source packages manager| 443 | `packages.microsoft.com`| Appliance VM IPs need outbound connection. | Download Linux installation package.|
|Custom Locations| 443 | `sts.windows.net`| Appliance VM IPs need outbound connection. | Required for use by the Custom Locations cluster extension.|
|Python package| 443 | `*.pypi.org`| Management machine needs outbound connection. | Validate Kubernetes and Python versions.|
|Azure CLI| 443 | `*.pythonhosted.org`| Management machine needs outbound connection. | Python packages for Azure CLI installation.|
|Diagnostic data | 443 | `gcs.prod.monitoring.core.windows.net`	|	Appliance VM IPs need outbound connection. | Used periodically to send Microsoft required diagnostic data from control plane nodes.|
