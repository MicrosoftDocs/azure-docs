---
author: MikeRayMSFT
ms.author: mikeray
ms.service: azure-arc
ms.topic: include
ms.date: 12/13/2022
---


|**Service**|**Port**|**URL**|**Direction**|**Notes**|
|--|--|--|--|--|
|Microsoft container registry | 443 | `https://mcr.microsoft.com`| Appliance VM IP and Control Plane IP need outbound connection. | Required to pull container images for installation. | 
| Helm chart (direct connected mode) | 443 | `arcdataservicesrow1.azurecr.io` | Outbound |Provisions the Azure Arc data controller bootstrapper and cluster level objects, such as custom resource definitions, cluster roles, and cluster role bindings, is pulled from an Azure Container Registry. | 
| Azure Resource Manager APIs | 443 |`login.microsoftonline.com`</br>`management.azure.com`| Outbound<br/> Inbound | Connects to the Azure Resource Manager APIs to send and retrieve data to and from Azure for some features.<br/><br/>To use proxy, verify that the agents meet the network requirements. See [Meet network requirements](../../kubernetes/quickstart-connect-cluster.md#meet-network-requirements).
| Azure monitor APIs | 443 |`login.microsoftonline.com`<br/>`management.azure.com`<br/>`*.ods.opinsights.azure.com`<br/>`*.oms.opinsights.azure.com`<br/>`*.monitoring.azure.com` | Outbound<br/> Inbound | Azure Data Studio and Azure CLI connect to the Azure Resource Manager APIs to send and retrieve data to and from Azure for some features. See [Azure Monitor APIs](#azure-monitor-apis).
| Azure Arc data processing service | 443 |`san-af-eastus-prod.azurewebsites.net`<br/>`san-af-eastus2-prod.azurewebsites.net`<br/>`san-af-australiaeast-prod.azurewebsites.net`<br/>`san-af-centralus-prod.azurewebsites.net`<br/>`san-af-westus2-prod.azurewebsites.net`<br/>`san-af-westeurope-prod.azurewebsites.net`<br/>`san-af-southeastasia-prod.azurewebsites.net`<br/>`san-af-koreacentral-prod.azurewebsites.net`<br/>`san-af-northeurope-prod.azurewebsites.net`<br/>`san-af-westeurope-prod.azurewebsites.net`<br/>`san-af-uksouth-prod.azurewebsites.net`<br/>`san-af-francecentral-prod.azurewebsites.net` | Outbound<br/> Inbound |


All HTTPS connections to Azure and the Microsoft Container Registry are encrypted using SSL/TLS using officially signed and verifiable certificates.

To use proxy, verify that the agents meet the network requirements. See [Meet network requirements](../../kubernetes/quickstart-connect-cluster.md#meet-network-requirements).

### Azure Monitor APIs

Connectivity from Azure Data Studio to the Kubernetes API server uses the Kubernetes authentication and encryption that you have established.  Each user that is using Azure Data Studio or CLI must have an authenticated connection to the Kubernetes API to perform many of the actions related to Azure Arc-enabled data services.
