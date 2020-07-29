---
title: Running in Locked Down Networks
description: Learn how to install and run Azure CycleCloud in a locked down networks. Details on internal communication between cluster nodes and CycleCloud.
author: anhoward
ms.date: 2/26/2020
ms.author: anhoward
---

# Operating in a locked down network

The CycleCloud application and cluster nodes can operate in environments with limited internet access, though there are a minimal number of TCP ports that must remain open.

## Installing Azure CycleCloud in a locked down network

The CycleCloud VM must be able to connect to a number of Azure APIs to orchestrate cluster VMs and to authenticate to Azure Active Directory. Since these APIs use HTTPS, CycleCloud requires outbound HTTPS access to:

* _management.azure.com_ (Azure ARM Management)
* _login.microsoftonline.com_ (Azure AD)
* _watson.telemetry.microsoft.com_ (Azure Telemetry)
* _dc.services.visualstudio.com_ (Azure Application Insights)
* _ratecard.azure-api.net_ (Azure Price Data)
  
The management API is hosted regionally, and the public IP address ranges can be found [here](https://www.microsoft.com/download/confirmation.aspx?id=41653).

The Azure AD login is part of the Microsoft 365 common APIs and IP address ranges for the service can be found [here](https://docs.microsoft.com/office365/enterprise/urls-and-ip-address-ranges).

Azure CycleCloud must be able to access Azure Storage accounts. The recommended way to provide private access to this service and any other supported Azure service is through [Virtual Network Service Endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview).

If using Network Security Groups or the Azure Firewall to limit outbound access to the required domains, then it is possible to configure Azure Cyclecloud to route all requests through an HTTPS proxy. See: [Using a Web Proxy](./running-behind-proxy.md)

### Configuring an Azure Network Security Group for the CycleCloud VM

One way to limit outbound internet access from the CycleCloud VM without configuring the Azure Firewall or an HTTPS proxy is to configure a strict Azure Network Security Group for the CycleCloud VM's subnet.  The simplest way to do that is to use [Service Tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview) in the subnet or VM level [Network Security Group](https://docs.microsoft.com/azure/virtual-network/security-overview) to permit the required outbound Azure access.

1. Configure a **Storage Service Endpoint** for the Subnet to allow access from CycleCloud to Azure Storage

2. Add the following NSG Outbound rule to *Deny* outbound access by default using the  "**Internet**" destination Service Tag:

| Priority    | Name              | Port       | Protocol | Source   | Destination    | Action |
| ----------- | ----------------- | ---------- | -------- | -------- | -------------- | ------ |
| 4000        | BlockOutbound     | Any        | Any      | Any      | Internet       | Deny   |

3. Add the following NSG Outbound rules to *Allow* outbound access to the required Azure services by destination Service Tag:

| Priority    | Name                 | Port       | Protocol | Source   | Destination          | Action |
| ----------- | -------------------- | ---------- | -------- | -------- | -------------------- | ------ |
| 100         | AllowAzureStorage    | 443        | TCP      | Any      | Storage              | Allow  |
| 101         | AllowActiveDirectory | 443        | TCP      | Any      | AzureActiveDirectory | Allow  |
| 102         | AllowAzureMonitor    | 443        | TCP      | Any      | AzureMonitor         | Allow  |
| 103         | AllowAzureRM         | 443        | TCP      | Any      | AzureResourceManager | Allow  |

## Internal communications between cluster nodes and CycleCloud

These ports need to be open to allow for communication between the cluster nodes and CycleCloud server:

| Name        | Source            | Destination    | Service | Protocol | Port Range |
| ----------- | ----------------- | -------------- | ------- | -------- | ---------- |
| amqp_5672  | Cluster Node   | CycleCloud     | AMQP    | TCP      | 5672       |
| https_9443 | Cluster Node   | CycleCloud     | HTTPS   | TCP      | 9443       |

## Launching Azure CycleCloud clusters in a locked down network

> [!NOTE]
> Running cluster nodes in a subnet without outbound internet access is fully supported today, but it is an advanced topic that often requires either a custom image or customization of the default CycleCloud cluster types and projects or both.
>
> We are actively updating the cluster types and projects to eliminate most or all of that work.  But, if you encounter failures with your cluster type or project in your locked down environment, please consider opening a Support request for assistance.
>

Running VMs or Cyclecloud clusters in a virtual network or subnet with outbound internet access generally requires
the following:

1. Azure Cyclecloud must be reachable from the cluster VMs for full functionality.   Either:
   1. Cluster VMs must be able to connect to Azure Cyclecloud directly via HTTPS and AMQP, or
   2. The Cyclecloud ReturnProxy feature must be enabled at cluster creation time and Cyclecloud itself must be able to connect to the ReturnProxy VM via SSH
2. All software packages required by the cluster must either be:
   1. Pre-installed in a custom Managed Image for the cluster VMs, or
   2. Available in a package repository mirror accessible from the VMs, or
   3. Copied to the VM from Azure Storage and installed directly by a Cyclecloud project
3. All Cluster nodes must be able to access Azure Storage accounts. The recommended way
to provide private access to this service and any other supported Azure service is to enable a [Virtual Network Service Endpoint](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview) for Azure Storage.
