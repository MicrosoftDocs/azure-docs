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
* _dc.applicationinsights.azure.com_ (Azure Application Insights)
* _dc.applicationinsights.microsoft.com_ (Azure Application Insights)
* _dc.services.visualstudio.com_ (Azure Application Insights)
* _ratecard.azure-api.net_ (Azure Price Data)
  
The management API is hosted regionally, and the public IP address ranges can be found [here](https://www.microsoft.com/download/confirmation.aspx?id=41653).

The Azure AD login is part of the Microsoft 365 common APIs and IP address ranges for the service can be found [here](/office365/enterprise/urls-and-ip-address-ranges).

The Azure Insights and Log Analytics IP address ranges can be found [here](/azure/azure-monitor/app/ip-addresses).

Azure CycleCloud must be able to access Azure Storage accounts. The recommended way to provide private access to this service and any other supported Azure service is through [Virtual Network Service Endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

If using Network Security Groups or the Azure Firewall to limit outbound access to the required domains, then it is possible to configure Azure Cyclecloud to route all requests through an HTTPS proxy. See: [Using a Web Proxy](./running-behind-proxy.md)

### Configuring an Azure Network Security Group for the CycleCloud VM

One way to limit outbound internet access from the CycleCloud VM without configuring the Azure Firewall or an HTTPS proxy is to configure a strict Azure Network Security Group for the CycleCloud VM's subnet.  The simplest way to do that is to use [Service Tags](/azure/virtual-network/service-tags-overview) in the subnet or VM level [Network Security Group](/azure/virtual-network/security-overview) to permit the required outbound Azure access.

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
to provide private access to this service and any other supported Azure service is to enable a [Virtual Network Service Endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) for Azure Storage.


## Project Updates from GitHub

Cyclecloud will download cluster projects from GitHub during the "Staging" orchestration
phase. This download will occur after initial installation, after upgrading Cyclecloud, or
when starting a cluster of a certain type for the first time. In a locked down environment, HTTPS
outbound traffic to [github.com](https://www.github.com) may be blocked. In such a case, node
creation during the staging resources phase will fail.

If access to GitHub can be opened temporarily during the creation of the first node
then CycleCloud will prepare the local files for all subsequent nodes. If temporary 
access is not possible then the necessary files can be downloaded
from another machine and copied to CycleCloud. 

First determine which project and
version your cluster will need, e.g. Slurm 3.0.8. It's normally the highest version
number in the database for a given project.
You can determine the latest version either by visiting the github project page or by
querying CycleCloud for the latest version.

To query CycleCloud (note that there will often be multiple versions listed):

```shell
/opt/cycle_server/cycle_server execute 'select Name, Version, Url from cloud.project where name == "slurm" order by Version'

Name = "slurm"
Version = "3.0.8"
Url = "https://github.com/Azure/cyclecloud-slurm/releases/3.0.8"
```

This project version and all dependencies are found in the [release tag]
(https://github.com/Azure/cyclecloud-slurm/releases/tag/3.0.8).

You can download all release artifacts manually, but the CycleCloud CLI provides
a helper for this operation.

First, use the CycleCloud CLI to fetch and prepare the repository from github 
(this is the same operation CycleCloud performs during the "Staging Resources" phase):

```bash
RELEASE_URL="https://github.com/Azure/cyclecloud-slurm/releases/3.0.8"
RELEASE_VERSION="3.0.8"
mkdir "${RELEASE_VERSION}"
cd "${RELEASE_VERSION}"
# Download release artifacts from githug (on a machine with github access)
cyclecloud project fetch "${RELEASE_URL}" .

# Create a tarbal with the project files pre-staged
cyclecloud project build
mv ./build/slurm "./${RELEASE_VERSION}"
tar czf "slurm-${RELEASE_VERSION}.tgz" ./blobs "./${RELEASE_VERSION}"
```

Next, copy the packaged project tarball to the CycleCloud server and extract:

```bash
#... copy the "slurm-${RELEASE_VERSION}.tgz" file to the Cyclecloud server in /tmp
sudo -i
mkdir -p /opt/cycle_server/work/staging/projects/slurm
cd /opt/cycle_server/work/staging/projects/slurm
tar xzf "/tmp/slurm-${RELEASE_VERSION}.tgz"
chown -R cycle_server:cycle_server /opt/cycle_server/work/staging
```

Once these files have been staged locally Cyclecloud will detect them and
won't try to download them from GitHub.


