---
title: Azure Service Fabric networking best practices
description: Rules and design considerations for managing network connectivity using Azure Service Fabric.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Networking

As you create and manage Azure Service Fabric clusters, you are providing network connectivity for your nodes and applications. The networking resources include IP address ranges, virtual networks, load balancers, and network security groups. In this article, you will learn best practices for these resources.

Review Azure [Service Fabric Networking Patterns](service-fabric-patterns-networking.md) to learn how to create clusters that use the following features: Existing virtual network or subnet, Static public IP address, Internal-only load balancer, or Internal and external load balancer.

## Infrastructure Networking
Maximize your Virtual Machine's performance with Accelerated Networking, by declaring *enableAcceleratedNetworking* property in your Resource Manager template, the following snippet is of a Virtual Machine Scale Set NetworkInterfaceConfigurations that enables Accelerated Networking:

```json
"networkInterfaceConfigurations": [
  {
    "name": "[concat(variables('nicName'), '-0')]",
    "properties": {
      "enableAcceleratedNetworking": true,
      "ipConfigurations": [
        {
        <snip>
        }
      ],
      "primary": true
    }
  }
]
```
Service Fabric cluster can be provisioned on [Linux with Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md), and [Windows with Accelerated Networking](../virtual-network/create-vm-accelerated-networking-powershell.md).

Accelerated Networking is supported for Azure Virtual Machine Series SKUs: D/DSv2, D/DSv3, E/ESv3, F/FS, FSv2, and Ms/Mms. Accelerated Networking was tested successfully using the Standard_DS8_v3 SKU on 01/23/2019 for a Service Fabric Windows Cluster, and using Standard_DS12_v2 on 01/29/2019 for a Service Fabric Linux Cluster. Please note that Accelerated Networking requires at least 4 vCPUs. 

To enable Accelerated Networking on an existing Service Fabric cluster, you need to first [Scale a Service Fabric cluster out by adding a Virtual Machine Scale Set](virtual-machine-scale-set-scale-node-type-scale-out.md), to perform the following:
1. Provision a NodeType with Accelerated Networking enabled
2. Migrate your services and their state to the provisioned NodeType with Accelerated Networking enabled

Scaling out infrastructure is required to enable Accelerated Networking on an existing cluster, because enabling Accelerated Networking in place would cause downtime, as it requires all virtual machines in an availability set be [stop and deallocate before enabling Accelerated networking on any existing NIC](../virtual-network/create-vm-accelerated-networking-cli.md#enable-accelerated-networking-on-existing-vms).

## Cluster Networking

* Service Fabric clusters can be deployed into an existing virtual network by following the steps outlined in [Service Fabric networking patterns](service-fabric-patterns-networking.md).

* Network security groups (NSGs) are recommended for node types to restrict inbound and outbound traffic to their cluster. Ensure that the necessary ports are opened in the NSG. 

* The primary node type, which contains the Service Fabric system services does not need to be exposed via the external load balancer and can be exposed by an [internal load balancer](service-fabric-patterns-networking.md#internal-only-load-balancer)

* Use a [static public IP address](service-fabric-patterns-networking.md#static-public-ip-address-1) for your cluster.

## Network Security Rules

The rules described below are the recommended minimum for a typical configuration. We also include what rules are mandatory for an operational cluster if optional rules are not desired. It allows a complete security lockdown with network peering and jumpbox concepts like Azure Bastion. Failure to open the mandatory ports or approving the IP/URL will prevent proper operation of the cluster and may not be supported. 

### Inbound 
|Priority   |Name               |Port        |Protocol  |Source             |Destination       |Action        |Mandatory
|---        |---                |---         |---       |---                |---               |---           |---
|3900       |Azure portal       |19080       |TCP       |ServiceFabric      |Any               |Allow         |Yes
|3910       |Client API         |19000       |TCP       |Internet           |Any               |Allow         |No
|3920       |SFX + Client API   |19080       |TCP       |Internet           |Any               |Allow         |No
|3930       |Cluster            |1025-1027   |TCP       |VirtualNetwork     |Any               |Allow         |Yes
|3940       |Ephemeral          |49152-65534 |TCP       |VirtualNetwork     |Any               |Allow         |Yes
|3950       |Application        |20000-30000 |TCP       |VirtualNetwork     |Any               |Allow         |Yes
|3960       |RDP                |3389        |TCP       |Internet           |Any               |Deny          |No
|3970       |SSH                |22          |TCP       |Internet           |Any               |Deny          |No
|3980       |Custom endpoint    |443         |TCP       |Internet           |Any               |Deny          |No

More information about the inbound security rules:

* **Azure portal**. This port is used by the Service Fabric Resource Provider to query information about your cluster in order to display in the Azure Management Portal. If this port is not accessible from the Service Fabric Resource Provider then you will see a message such as 'Nodes Not Found' or 'UpgradeServiceNotReachable' in the Azure portal and your node and application list will appear empty. This means that if you wish to have visibility of your cluster in the Azure Management Portal then your load balancer must expose a public IP address and your NSG must allow incoming 19080 traffic. This port is recommended for extended management operations from the Service Fabric Resource Provider to guarantee higher reliability.

* **Client API**. The client connection endpoint for APIs used by PowerShell.

* **SFX + Client API**. This port is used by Service Fabric Explorer to browse and manage your cluster. In the same way it's used by most common APIs like REST/PowerShell (Microsoft.ServiceFabric.PowerShell.Http)/CLI/.NET. 

* **Cluster**. Used for inter-node communication.

* **Ephemeral**. Service Fabric uses a part of these ports as application ports, and the remaining are available for the OS. It also maps this range to the existing range present in the OS, so for all purposes, you can use the ranges given in the sample here. Make sure that the difference between the start and the end ports is at least 255. You might run into conflicts if this difference is too low, because this range is shared with the OS. To see the configured dynamic port range, run *netsh int ipv4 show dynamic port tcp*. These ports aren't needed for Linux clusters.

* **Application**. The application port range should be large enough to cover the endpoint requirement of your applications. This range should be exclusive from the dynamic port range on the machine, that is, the ephemeralPorts range as set in the configuration. Service Fabric uses these ports whenever new ports are required and takes care of opening the firewall for these ports on the nodes.

* **RDP**. Optional, if RDP is required from the Internet or VirtualNetwork for jumpbox scenarios. 

* **SSH**. Optional, if SSH is required from the Internet or VirtualNetwork for jumpbox scenarios.

* **Custom endpoint**. An example for your application to enable an internet accessible endpoint.

> [!NOTE]
> For most rules with Internet as source please consider to restrict to your known network, ideally defined by CIDR block.

### Outbound

|Priority   |Name               |Port        |Protocol  |Source    |Destination               |Action        |Mandatory 
|---        |---                |---         |---       |---       |---                       |---           |---
|4010       |Resource Provider  |443         |TCP       |Any       |ServiceFabric             |Allow         |Yes
|4020       |Download Binaries  |443         |TCP       |Any       |AzureFrontDoor.FirstParty |Allow         |Yes


More information about the outbound security rules:

* **Resource Provider**. Connection between UpgradeService and Service Fabric resource provider to receive management operations such as ARM deployments or mandatory operations like seed node selection or primary node type upgrade.

* **Download Binaries**. The upgrade service is using the address download.microsoft.com to get the binaries, this is needed for setup, re-image and runtime upgrades. In the scenario of an "internal only" load balancer, an [additional external load balancer](service-fabric-patterns-networking.md#internal-and-external-load-balancer) must be added with a rule allowing outbound traffic for port 443. Optionally, this port can be blocked after an successful setup, but in this case the upgrade package must be distributed to the nodes or the port has to be opened for the short period of time, afterwards a manual upgrade is needed.

Use Azure Firewall with [NSG flow log](../network-watcher/network-watcher-nsg-flow-logging-overview.md) and [traffic analytics](../network-watcher/traffic-analytics.md) to track connectivity issues. The ARM template [Service Fabric with NSG](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure-NSG) is a good example to start. 

> [!NOTE]
> Please note that the default network security rules should not be overwritten as they ensure the communication between the nodes. [Network Security Group - How it works](../virtual-network/network-security-group-how-it-works.md). Another example, outbound connectivity on port 80 is needed to do the Certificate Revocation List check.

### Common scenarios needing additional rules

All additional scenarios can be covered with [Azure Service Tags](../virtual-network/service-tags-overview.md).

#### Azure DevOps

The classic PowerShell tasks in Azure DevOps (Service Tag: AzureCloud) need Client API access to the cluster, examples are application deployments or operational tasks. This does not apply to the ARM templates only approach, including [ARM application resources](service-fabric-application-arm-resource.md).

|Priority   |Name               |Port        |Protocol  |Source             |Destination       |Action     |Direction     
|---        |---                |---         |---       |---                |---               |---        |---     
|3915       |Azure DevOps       |19000       |TCP       |AzureCloud         |Any               |Allow      |Inbound       

#### Updating Windows

Best practice to patch the Windows operating system is replacing the OS disk by [automatic OS image upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md), no additional rule is required.
The [Patch Orchestration Application](service-fabric-patch-orchestration-application.md) is managing in-VM upgrades where Windows Updates applies operating system patches, this needs access to the Download Center (Service Tag: AzureUpdateDelivery) to download the update binaries.

|Priority   |Name               |Port        |Protocol  |Source    |Destination           |Action  |Direction      
|---        |---                |---         |---       |---       |---                   |---     |---      
|4015       |Windows Updates    |443         |TCP       |Any       |AzureUpdateDelivery   |Allow   |Outbound       

#### API Management

The integration of Azure API Management (Service Tag: ApiManagement) need Client API access to query endpoint information from the cluster. 

|Priority   |Name               |Port        |Protocol  |Source             |Destination    |Action    |Direction
|---        |---                |---         |---       |---                |---            |---       |--- 
|3920       |API Management     |19080       |TCP       |ApiManagement      |Any            |Allow     |Inbound

## Application Networking

* To run Windows container workloads, use [open networking mode](service-fabric-networking-modes.md#set-up-open-networking-mode) to make service-to-service communication easier.

* Use a reverse proxy such as [Traefik](https://docs.traefik.io/v1.6/configuration/backends/servicefabric/) or the [Service Fabric reverse proxy](service-fabric-reverseproxy.md) to expose common application ports such as 80 or 443.

* For Windows Containers hosted on air-gapped machines that can't pull base layers from Azure cloud storage, override the foreign layer behavior, by using the [--allow-nondistributable-artifacts](/virtualization/windowscontainers/about/faq#how-do-i-make-my-container-images-available-on-air-gapped-machines) flag in the Docker daemon.

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

[NSGSetup]: ./media/service-fabric-best-practices/service-fabric-nsg-rules.png