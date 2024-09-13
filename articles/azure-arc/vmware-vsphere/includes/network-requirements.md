---
ms.topic: include
ms.date: 06/04/2024
---

| **Service** | **Port** | **URL** | **Direction** | **Notes**|
| --- | --- | --- | --- | --- |
| vCenter Server | 443 | URL of the vCenter server  | Appliance VM IP and control plane endpoint need outbound connection. | Used to by the vCenter server to communicate with the Appliance VM and the control plane.|
| VMware Cluster Extension | 443 | `azureprivatecloud.azurecr.io` | Appliance VM IPs need outbound connection. | Pull container images for Microsoft.VMWare and Microsoft.AVS Cluster Extension.|
| Azure CLI and Azure CLI Extensions | 443 | `*.blob.core.windows.net` | Management machine needs outbound connection. | Download Azure CLI Installer and Azure CLI extensions.|
| Azure Resource Manager | 443 | `management.azure.com` | Management machine needs outbound connection. | Required to create/update resources in Azure using ARM.|
| Helm Chart for Azure Arc Agents | 443 | `*.dp.kubernetesconfiguration.azure.com` | Management machine needs outbound connection. | Data plane endpoint for downloading the configuration information of Arc agents.|
| Azure CLI | 443 | - `login.microsoftonline.com` <br> <br> - `aka.ms` | Management machine needs outbound connection. | Required to fetch and update Azure Resource Manager tokens.|
