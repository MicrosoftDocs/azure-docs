---
author: MikeRayMSFT
ms.author: mikeray
ms.service: azure-arc
ms.topic: include
ms.date: 12/13/2022
---

### Outbound connectivity

The firewall and proxy URLs below must be allowlisted in order to enable communication from the host machine, Appliance VM, and Control Plane IP to the required Arc resource bridge URLs.

### Firewall/Proxy URL allowlist

|**Service**|**Port**|**URL**|**Direction**|**Notes**|
|--|--|--|--|--|
|SFS API endpoint | 443 | `msk8s.api.cdp.microsoft.com` | Deployment machine,  Appliance VM IP and Control Plane IP need outbound connection. | Used when downloading product catalog, product bits, and OS images from SFS. |
|Resource bridge (appliance) Dataplane service| 443 | `https://*.dp.prod.appliances.azure.com`| Appliance VM IP and Control Plane IP need outbound connection. | Communicate with resource provider in Azure.|
|Resource bridge (appliance) container image download| 443 | `*.blob.core.windows.net, https://ecpacr.azurecr.io`| Appliance VM IP and Control Plane IP need outbound connection. | Required to pull container images. |
|Resource bridge (appliance) image download| 80 | `msk8s.b.tlu.dl.delivery.mp.microsoft.com`| Deployment machine,  Appliance VM IP and Control Plane IP need outbound connection. |  Download the Arc Resource Bridge OS images.  |
|Resource bridge (appliance) image download| 443 | `msk8s.sf.tlu.dl.delivery.mp.microsoft.com`| Deployment machine,  Appliance VM IP and Control Plane IP need outbound connection. |  Download the Arc Resource Bridge OS images.  |
|Azure Arc for Kubernetes container image download| 443 | `https://azurearcfork8sdev.azurecr.io`|  Appliance VM IP and Control Plane IP need outbound connection. | Required to pull container images. |
|ADHS telemetry service | 443 | `adhs.events.data.microsoft.com`| Appliance VM IP and Control Plane IP need outbound connection. | Runs inside the appliance/mariner OS. Used periodically to send Microsoft required diagnostic data from control plane nodes. Used when telemetry is coming off Mariner, which would mean any Kubernetes control plane. |
|Microsoft events data service | 443 |`v20.events.data.microsoft.com`| Appliance VM IP and Control Plane IP need outbound connection. | Used periodically to send Microsoft required diagnostic data from the Azure Stack HCI or Windows Server host. Used when telemetry is coming off Windows like Windows Server or HCI. |

### SSL proxy configuration

Azure Arc resource bridge must be configured for proxy so that it can connect to the Azure services. This configuration is handled automatically. However, proxy configuration of the client machine isn't configured by the Azure Arc resource bridge.

There are only two certificates that should be relevant when deploying the Arc resource bridge behind an SSL proxy: the SSL certificate for your SSL proxy (so that the host and guest trust your proxy FQDN and can establish an SSL connection to it), and the SSL certificate of the Microsoft download servers. This certificate must be trusted by your proxy server itself, as the proxy is the one establishing the final connection and needs to trust the endpoint. Non-Windows machines may not trust this second certificate by default, so you may need to ensure that it's trusted.

