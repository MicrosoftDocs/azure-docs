---
title: Running in Locked Down Networks
description: Learn how to install and run Azure CycleCloud in a locked down networks. Details on internal communication between cluster nodes and CycleCloud.
author: anhoward
ms.date: 07/01/2025
ms.author: anhoward
---

# Operating in a locked down network

The CycleCloud application and cluster nodes can operate in environments with limited internet access, though you must keep a minimal number of TCP ports open.

## Install Azure CycleCloud in a locked down network

The CycleCloud VM needs to connect to several Azure APIs to manage cluster VMs and authenticate to Azure Active Directory. Since these APIs use HTTPS, CycleCloud requires outbound HTTPS access to:

* _management.azure.com_ (Azure ARM Management)
* _login.microsoftonline.com_ (Azure AD)
* _watson.telemetry.microsoft.com_ (Azure Telemetry)
* _dc.applicationinsights.azure.com_ (Azure Application Insights)
* _dc.applicationinsights.microsoft.com_ (Azure Application Insights)
* _dc.services.visualstudio.com_ (Azure Application Insights)
* _ratecard.azure-api.net_ (Azure Price Data)
  
The management API is hosted regionally. You can find the public IP address ranges [here](https://www.microsoft.com/en-us/download/details.aspx?id=41653).

The Azure AD authentication is part of the Microsoft 365 common APIs. You can find the IP address ranges for this service [here](/office365/enterprise/urls-and-ip-address-ranges).

You can find the IP address ranges for Azure Insights and Log Analytics [here](/azure/azure-monitor/app/ip-addresses).

Azure CycleCloud must access Azure Storage accounts. To provide private access to this service and any other supported Azure service, we recommend using [Virtual Network Service Endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

If you use Network Security Groups or the Azure Firewall to limit outbound access to the required domains, you can configure Azure CycleCloud to route all requests through an HTTPS proxy. For more information, see [Using a Web Proxy](./running-behind-proxy.md).

### Configuring an Azure Network Security Group for the CycleCloud VM

You can limit outbound internet access from the CycleCloud VM by configuring a strict Azure Network Security Group for the CycleCloud VM's subnet. This approach doesn't require configuring the Azure Firewall or an HTTPS proxy. The simplest way to do that is to use [Service Tags](/azure/virtual-network/service-tags-overview) in the subnet or VM level [Network Security Group](/azure/virtual-network/security-overview) to permit the required outbound Azure access.

1. Configure a **Storage Service Endpoint** for the Subnet to allow access from CycleCloud to Azure Storage

1. Add the following NSG Outbound rule to *Deny* outbound access by default using the  "**Internet**" destination Service Tag:

| Priority    | Name              | Port       | Protocol | Source   | Destination    | Action |
| ----------- | ----------------- | ---------- | -------- | -------- | -------------- | ------ |
| 4000        | BlockOutbound       | Any        | Any      | Any      | Internet             | Deny   |

1. Add the following NSG Outbound rules to *Allow* outbound access to the required Azure services by destination Service Tag:

| Priority    | Name                 | Port       | Protocol | Source   | Destination          | Action |
| ----------- | -------------------- | ---------- | -------- | -------- | -------------------- | ------ |
| 100         | AllowAzureStorage    | 443        | TCP      | Any      | Storage              | Allow  |
| 101         | AllowActiveDirectory | 443        | TCP      | Any      | AzureActiveDirectory | Allow  |
| 102         | AllowAzureMonitor    | 443        | TCP      | Any      | AzureMonitor         | Allow  |
| 103         | AllowAzureRM         | 443        | TCP      | Any      | AzureResourceManager | Allow  |

## Internal communications between cluster nodes and CycleCloud

Open these ports to allow communication between the cluster nodes and CycleCloud server:

| Name        | Source            | Destination    | Service | Protocol | Port Range |
| ----------- | ----------------- | -------------- | ------- | -------- | ---------- |
| amqp_5672  | Cluster Node   | CycleCloud     | AMQP    | TCP      | 5672       |
| https_9443 | Cluster Node   | CycleCloud     | HTTPS   | TCP      | 9443       |

## Launching Azure CycleCloud clusters in a locked down network

> [!NOTE]
> Azure CycleCloud supports running cluster nodes in a subnet without outbound internet access. However, it's an advanced topic that often requires either a custom image or customization of the default CycleCloud cluster types and projects, or both.
>
> We're actively updating the cluster types and projects to eliminate most or all of that work. If you encounter failures with your cluster type or project in your locked down environment, consider opening a support request for assistance.
>

Running VMs or Cyclecloud clusters in a virtual network or subnet with outbound internet access generally requires
the following steps:

1. Make Azure Cyclecloud reachable from the cluster VMs for full functionality.   Either:
   1. Cluster VMs connect to Azure Cyclecloud directly via HTTPS and AMQP, or
   1. Enable the Cyclecloud ReturnProxy feature when you create the cluster. Cyclecloud must be able to connect to the ReturnProxy VM through SSH.
1. Make sure the cluster VMs have all the required software packages by:
   1. Preinstalling them in a custom Managed Image,
   1. Providing a package repository mirror that the VMs can access, or
   1. Copying them to the VM from Azure Storage and installing them directly through a Cyclecloud project.
1. Make sure all cluster nodes can access Azure Storage accounts. To provide private access to this service and any other supported Azure service, enable a [Virtual Network Service Endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) for Azure Storage.


## Project updates from GitHub

CycleCloud downloads cluster projects from GitHub during the **Staging** orchestration phase. This download happens after initial installation, after upgrading CycleCloud, or when you start a cluster of a certain type for the first time. In a locked down environment, HTTPS outbound traffic to [github.com](https://www.github.com) might be blocked. If this traffic is blocked, node creation during the staging resources phase fails.

If you can temporarily open access to GitHub during the creation of the first node, CycleCloud prepares the local files for all subsequent nodes. If temporary access isn't possible, you can download the necessary files from another machine and copy them to CycleCloud.

First, determine which project and version your cluster needs, such as Slurm 3.0.8. It's usually the highest version number in the database for a given project.
You can find the latest version by visiting the GitHub project page or by querying CycleCloud for the latest version.

To query CycleCloud (note that there are often multiple versions listed):

```shell
/opt/cycle_server/cycle_server execute 'select Name, Version, Url from cloud.project where name == "slurm" order by Version'

Name = "slurm"
Version = "3.0.8"
Url = "https://github.com/Azure/cyclecloud-slurm/releases/3.0.8"
```

You can find this project version and all dependencies in the [release tag](https://github.com/Azure/cyclecloud-slurm/releases/tag/3.0.8).

You can manually download all release artifacts, but the CycleCloud CLI provides a helper for this operation.

First, use the CycleCloud CLI to fetch and prepare the repository from GitHub. This operation is the same operation CycleCloud performs during the "Staging Resources" phase:

```bash
RELEASE_URL="https://github.com/Azure/cyclecloud-slurm/releases/3.0.8"
RELEASE_VERSION="3.0.8"
mkdir "${RELEASE_VERSION}"
cd "${RELEASE_VERSION}"
# Download release artifacts from githug (on a machine with github access)
cyclecloud project fetch "${RELEASE_URL}" .

# Create a tarball with the project files pre-staged
cyclecloud project build
mv ./build/slurm "./${RELEASE_VERSION}"
tar czf "slurm-${RELEASE_VERSION}.tgz" ./blobs "./${RELEASE_VERSION}"
```

Next, copy the packaged project tarball to the CycleCloud server and extract it:

```bash
#... copy the "slurm-${RELEASE_VERSION}.tgz" file to the Cyclecloud server in /tmp
sudo -i
mkdir -p /opt/cycle_server/work/staging/projects/slurm
cd /opt/cycle_server/work/staging/projects/slurm
tar xzf "/tmp/slurm-${RELEASE_VERSION}.tgz"
chown -R cycle_server:cycle_server /opt/cycle_server/work/staging
```

Once you stage these files locally, CycleCloud detects them and doesn't try to download them from GitHub.


