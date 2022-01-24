---
title: What is Azure Arc-enabled VMware vSphere?
description: Azure Arc-enabled VMware vSphere extends Azure's governance and management capabilities to VMware vSphere infrastructure and delivers a consistent management experience across both platforms. 
ms.topic: overview
ms.date: 11/10/2021
ms.custom: references_regions
---

# What is Azure Arc-enabled VMware vSphere?

Azure Arc-enabled VMware vSphere extends Azure's governance and management capabilities to VMware vSphere infrastructure. It also delivers a consistent management experience across both platforms.

Arc-enabled VMware vSphere allows you to:

- Conduct various VMware virtual machine (VM) lifecycle operations directly from Azure, such as create, start/stop, resize, and delete.

- Empower developers and application teams to self-serve VM operations on-demand using [Azure role-based access control](../../role-based-access-control/overview.md) (RBAC).

- Browse your VMware vSphere resources (VMs, templates, networks, and storage) in Azure, providing you a single pane view for your infrastructure across both environments. You can also discover and onboard existing VMware VMs to Azure.

- Conduct governance and monitoring operations across Azure and VMware VMs by enabling guest management (installing the [Azure Arc-enabled servers Connected Machine agent](../servers/agent-overview.md)).

> [!IMPORTANT]
> In the interest of ensuring new features are documented no later than their release, this page may include documentation for features that may not yet be publicly available.

## How does it work?

To deliver this experience, you need to deploy the [Azure Arc resource bridge](../resource-bridge/overview.md) (preview), which is a virtual appliance, in your vSphere environment. It connects your vCenter Server to Azure. Azure Arc resource bridge (preview) enables you to represent the VMware resources in Azure and do various operations on them.

## Supported VMware vSphere versions

Azure Arc-enabled VMware vSphere currently works with VMware vSphere version 6.5 and above.

## Supported scenarios

The following scenarios are supported in Azure Arc-enabled VMware vSphere:

- Virtualized Infrastructure Administrators/Cloud Administrators can connect a vCenter instance to Azure and browse the VMware virtual machine inventory in Azure

- Administrators can use the Azure portal to browse VMware vSphere inventory and register virtual machines resource pools, networks, and templates into Azure. They can also bulk-enabled guest management on registered virtual machines.

- Administrators can provide app teams/developers fine-grained permissions on those VMware resources through Azure RBAC.

- App teams can use Azure portal, CLI, or REST API to manage the lifecycle of on-premises VMs they use for deploying their applications (CRUD, Start/Stop/Restart).

- App teams and administrators can install extensions, such as the Log Analytics agent, Custom Script Extension, and Dependency Agent, on  the virtual machines and do operations supported by the extensions.

## Supported regions

Azure Arc-enabled VMware vSphere is currently supported in these regions:

- East US

- West Europe

### vCenter requirements

- For the VMware vCenter Server Appliance, allow inbound connections on TCP port 443 to enable the Azure Arc resource bridge (preview) and VMware cluster extension to communicate with the appliance.

- A resource pool with capacity to allocate 16 GB of RAM and 4 vCPUs.

- A datastore with a minimum of 100 GB free disk space available through the resource pool.

- An external virtual network/switch and internet access, direct or through a proxy server to support outbound communication from Arc resource bridge.

### vSphere requirements

A vSphere account that can read all inventory, deploy, and update VMs to all the resource pools (or clusters), networks, and virtual machine templates that you want to use with Azure Arc. The account is also used for ongoing operations of the Arc-enabled VMware vSphere, and deployment of the Azure Arc resource bridge (preview) VM.

If you are using the [Azure VMware solution](../../azure-vmware/introduction.md), this account would be the **cloudadmin** account.

## Deployment

Deploying the Azure Arc resource bridge (preview) is accomplished using three configuration YAML files:

- **Application.yaml** - This is the primary configuration file that provides a path to the provider configuration and resource configuration YAML files. The file also specifies the network configuration of the resource bridge, and includes generic cluster information that is not provider-specific.
- **Infra.yaml** - A configuration file that includes a set of configuration properties specific to your private cloud provider.
- **Resource.yaml** - A configuration file that contains all the information related to the Azure Resource Manager resource, such as the subscription name and resource group for the resource bridge in Azure.

In the current preview release, these configuration files are automatically created when you run the [Az arcappliance createconfig](/cli/azure/arcappliance/createconfig) command, where the command queries the environment and prompts you to make selections through an interactive experience. See the [how to connect your VMware vCenter to Azure Arc using a helper script](quick-start-connect-vcenter-to-arc-using-script.md).

The `appliance.yaml` file is the main configuration file that specifies the path to two YAML files to deploy the Azure Arc resource bridge (preview) in your environment, and to register it in Azure. This file also includes the network configuration settings, specifically its IP address and optionally, a proxy server if direct network connection to the internet is not allowed in your environment.  

```bash
# Relative or absolute path to the infra.yaml file
infrastructureConfigPath: "VMware-infra.yaml"

# Relative or absolute path to ARM resource configuration file
applianceResourceFilePath: "VMware-resource.yaml"

# IP address to be used for control plane/API server from the DHCP range available in the environment. This IP address must be reserved for this, and can't be changed. If it is changed, the resource bridge will not be reachable by all the other Arc agents and services.
applianceClusterConfig:
   controlPlaneEndpoint: <ipAddress>
   networking:
    # Specify the proxy configuration.
    proxy:
       http: "<http://<proxyURL>:<proxyport>"
       https: "<https://<proxyURL>:<proxyport>"
       noproxy: "..."
       # Specify certificate if applicable
       certificateFilePath: "<certificatePath>"
```

The `infra.yaml` file includes specific information to enable deployment of the virtual machine within the vSphere infrastructure.  

```bash
vsphereprovider:
# vCenter credentials, which will be used to create the resource bridge.
credentials:
   address: <vcenterAddress>
   username: <userName>
   password: <password>
# Current deployment uses the template and snapshot to create the resource bridge VM.
appliancevm:
   vmtemplate: <templateName>
   templatesnapshot: <snapshotName>
# The datacenter where the resource bridge VM will be created on.
datacenter: <datacenteName>
   # The datastore used by the resource bridge VM
datastore: <datastoreName>
# The network interface used by the resource bridge VM
network: <networkInterfaceName>
# The resource pool where the resource bridge VM will be created on.
resourcepool: <resourcePoolName>
# The folder where the resource bridge will be created under.
folder: <folderName>
```

The `resource.yaml` file contains all the information related to the Azure Resource Manager resource definition, such as the subscription, resource group, resource name, and location for the resource bridge in Azure.

```bash
resource:
   resource_group: <resourceGroupName>
   name: <resourceName>
   location: <location>
   subscription: <subscription>
```

## Next steps

- [Connect VMware vCenter to Azure Arc using the helper script](quick-start-connect-vcenter-to-arc-using-script.md)
