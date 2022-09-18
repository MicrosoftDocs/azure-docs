---
title: Prerequisites and support requirements
description: In this article, you'll understand the prerequisites and support requirements to connect VMware vCenter Server to Azure Arc.
ms.topic: quickstart 
ms.custom: *
ms.date: 09/19/2022

# Customer intent: As a VI admin, I want to ensure that I meet all the prerequisites and support requirements before connecting my vCenter Server instance to Azure to enable self-service through Azure Arc.
---

# Prerequisites and support requirements to connect VMware vCenter Server to Azure Arc

To start using the Azure Arc-enabled VMware vSphere (preview) features, you need to connect your VMware vCenter Server instance to Azure Arc. This article lists down the prerequisites and support requirements before you can connect your VMware vCenter Server instance to Azure Arc by using a helper script.

## Prerequisites

### Azure

- An Azure subscription.

- A resource group in the subscription where you're a member of the *Owner/Contributor* role.

### Azure Arc Resource Bridge

- Resource Bridge IP needs internet access. If you are using Static IP, then Start Range IP and End Range IP need internet access. If you are using DHCP, then it is the IP assigned to Azure Arc Resource Bridge (Appliance VM IP).

- Control Plane IP needs internet access.

- If you are using DHCP, the IP assigned to Azure Arc Resource Bridge must be reserved. 

- The Host (vCenter server in this case, I think) must be able to reach the Control Plane IP and Azure Arc Resource Bridge VM (Appliance VM IP, Start Range IP, End Range IP).

- Azure Arc Resource Bridge VM requires DNS resolution when configuring with Static IP. The IP Address(es) of the DNS servers are needed in the DNS Server input of the deployment script.

### vCenter Server

- vCenter Server version 6.7 or 7.

- A virtual network that can provide internet access, directly or through a proxy. It must also be possible for VMs on this network to communicate with the vCenter server on TCP port (usually 443).

- At least one free IP address on the above network that isn't in the DHCP range. At least three free IP addresses if there's no DHCP server on the network.

- A resource pool or a cluster with a minimum capacity of 16 GB of RAM and four vCPUs.

- A datastore with a minimum of 100 GB of free disk space available through the resource pool or cluster.

### vSphere account

You need a vSphere account that can:
- Read all inventory. 
- Deploy and update VMs to all the resource pools (or clusters), networks, and VM templates that you want to use with Azure Arc.

This account is used for the ongoing operation of Azure Arc-enabled VMware vSphere (preview) and the deployment of the Azure Arc resource bridge (preview) VM.

### Workstation

You need a Windows or Linux machine that can access both your vCenter Server instance and the internet, directly or through a proxy.

## Support requirements

The following firewall URL exceptions are needed for the appliance VM in the Azure Arc Resource Bridge:

| **Service** | **Port** | **URL** | **Direction** | **Notes**|
| --- | --- | --- | --- | --- |
| Microsoft container registry | 443 | https://mcr.microsoft.com | Appliance VM IP and control plane endpoint need outbound connection. | Required to pull container images for installation. |
| Azure Arc Identity service | 443 | https://*.his.arc.azure.com | Appliance VM IP and control plane endpoint need outbound connection. | Manages identity and access control for Azure resources |
| Azure Arc configuration service | 443	| https://*.dp.kubernetesconfiguration.azure.com | Appliance VM IP and control plane endpoint need outbound connection. | Used for Kubernetes cluster configuration. |
| Cluster connect service | 443	| https://*.servicebus.windows.net | Appliance VM IP and control plane endpoint need outbound connection. | Provides cloud-enabled communication to connect on-premise resources with the cloud. |
| Guest Notification service | 443 | https://guestnotificationservice.azure.com	| Appliance VM IP and control plane endpoint need outbound connection. | Used to connect on-prem resources to Azure. |
| SFS API endpoint | 443 | msk8s.api.cdp.microsoft.com | Host machine, Appliance VM IP and control plane endpoint need outbound connection. | Used when downloading product catalog, product bits, and OS images from SFS. |
| Resource bridge (appliance) Dataplane service | 443 | https://*.dp.prod.appliances.azure.com | Appliance VM IP and control plane endpoint need outbound connection. | Communicate with resource provider in Azure. |
| Resource bridge (appliance) container image download | 443 | *.blob.core.windows.net, https://ecpacr.azurecr.io | Appliance VM IP and control plane endpoint need outbound connection. | Required to pull container images. |
| Resource bridge (appliance) image download | 80 | *.dl.delivery.mp.microsoft.com | Host machine, Appliance VM IP and control plane endpoint need outbound connection. | Download the Arc Resource Bridge OS images. |
| Azure Arc for K8s container image download | 443 | https://azurearcfork8sdev.azurecr.io | Appliance VM IP and control plane endpoint need outbound connection. | Required to pull container images. |
| ADHS telemetry service | 443 | adhs.events.data.microsoft.com  | Appliance VM IP and control plane endpoint need outbound connection.	Runs inside the appliance/mariner OS. | Used periodically to send Microsoft required diagnostic data from control plane nodes. Used when telemetry is coming off Mariner, which would mean any K8s control plane. |
| Microsoft events data service | 443 | v20.events.data.microsoft.com  | Appliance VM IP and control plane endpoint need outbound connection. | Used periodically to send Microsoft required diagnostic data from the Azure Stack HCI or Windows Server host. Used when telemetry is coming off Windows like Windows Server or HCI. |

The following firewall URL exceptions are needed for the other Azure Arc agents:

| **Service** | **URL** |
| --- | --- |
| Azure Resource Manager | https://management.azure.com |
| Azure Active Directory | https://login.microsoftonline.com |


## Next steps

- [Connect VMware vCenter to Azure Arc using the helper script](quick-start-connect-vcenter-to-arc-using-script.md)
