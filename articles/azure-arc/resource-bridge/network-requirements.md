---
title: Azure Arc resource bridge (preview) network requirements
description: Learn about network requirements for Azure Arc resource bridge (preview) including URLs that must be allowlisted.
ms.topic: conceptual
ms.date: 12/06/2022
---

# Azure Arc resource bridge (preview) network requirements

This article describes the networking requirements for deploying Azure Arc resource bridge (preview) in your enterprise.

## Outbound connectivity

The firewall and proxy URLs below must be allowlisted in order to enable communication from the host machine, Appliance VM, and Control Plane IP to the required Arc resource bridge URLs.

### Firewall/Proxy URL allowlist

|**Service**|**Port**|**URL**|**Direction**|**Notes**|
|--|--|--|--|--|
|Microsoft container registry | 443 | `https://mcr.microsoft.com`| Appliance VM IP and Control Plane IP need outbound connection. | Required to pull container images for installation. |  
|Azure Arc Identity service | 443 | `https://*.his.arc.azure.com` | Appliance VM IP and Control Plane IP need outbound connection. | Manages identity and access control for Azure resources |  
|Azure Arc configuration service | 443 | `https://*.dp.kubernetesconfiguration.azure.com`| Appliance VM IP and Control Plane IP need outbound connection. | Used for Kubernetes cluster configuration.|
|Cluster connect service | 443 | `https://*.servicebus.windows.net` | Appliance VM IP and Control Plane IP need outbound connection. | Provides cloud-enabled communication to connect on-premises resources with the cloud. |
|Guest Notification service| 443 | `https://guestnotificationservice.azure.com`| Appliance VM IP and Control Plane IP need outbound connection. | Used to connect on-premises resources to Azure.|
|SFS API endpoint | 443 | `msk8s.api.cdp.microsoft.com` | Deployment machine,  Appliance VM IP and Control Plane IP need outbound connection. | Used when downloading product catalog, product bits, and OS images from SFS. |
|Resource bridge (appliance) Dataplane service| 443 | `https://*.dp.prod.appliances.azure.com`| Appliance VM IP and Control Plane IP need outbound connection. | Communicate with resource provider in Azure.|
|Resource bridge (appliance) container image download| 443 | `*.blob.core.windows.net, https://ecpacr.azurecr.io`| Appliance VM IP and Control Plane IP need outbound connection. | Required to pull container images. |
|Resource bridge (appliance) image download| 80 | `msk8s.b.tlu.dl.delivery.mp.microsoft.com`| Deployment machine,  Appliance VM IP and Control Plane IP need outbound connection. |  Download the Arc Resource Bridge OS images.  |
|Resource bridge (appliance) image download| 443 | `msk8s.sf.tlu.dl.delivery.mp.microsoft.com`| Deployment machine,  Appliance VM IP and Control Plane IP need outbound connection. |  Download the Arc Resource Bridge OS images.  |
|Azure Arc for Kubernetes container image download| 443 | `https://azurearcfork8sdev.azurecr.io`|  Appliance VM IP and Control Plane IP need outbound connection. | Required to pull container images. |
|ADHS telemetry service | 443 | `adhs.events.data.microsoft.com`| Appliance VM IP and Control Plane IP need outbound connection. | Runs inside the appliance/mariner OS. Used periodically to send Microsoft required diagnostic data from control plane nodes. Used when telemetry is coming off Mariner, which would mean any Kubernetes control plane. |
|Microsoft events data service | 443 |`v20.events.data.microsoft.co`m| Appliance VM IP and Control Plane IP need outbound connection. | Used periodically to send Microsoft required diagnostic data from the Azure Stack HCI or Windows Server host. Used when telemetry is coming off Windows like Windows Server or HCI. |
|Secure token service | 443 |`sts.windows.net`| Appliance VM IP and Control Plane IP need outbound connection. | Used for custom locations. |

### Used by other Arc agents

|**Service**|**URL**|
|--|--|
|Azure Resource Manager| `https://management.azure.com`|
|Azure Active Directory| `https://login.microsoftonline.com`|

## SSL proxy configuration

Azure Arc resource bridge must be configured for proxy so that it can connect to the Azure services. This configuration is handled automatically. However, proxy configuration of the client machine isn't configured by the Azure Arc resource bridge.

There are only two certificates that should be relevant when deploying the Arc resource bridge behind an SSL proxy: the SSL certificate for your SSL proxy (so that the host and guest trust your proxy FQDN and can establish an SSL connection to it), and the SSL certificate of the Microsoft download servers. This certificate must be trusted by your proxy server itself, as the proxy is the one establishing the final connection and needs to trust the endpoint. Non-Windows machines may not trust this second certificate by default, so you may need to ensure that it's trusted.

## Next steps

- Review the [Azure Arc resource bridge (preview) overview](overview.md) to understand more about requirements and technical details.
- Learn about [security configuration and considerations for Azure Arc resource bridge (preview)](security-overview.md).
