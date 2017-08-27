# Platform-supported migration of IaaS resources from classic to Azure Resource Manager
In this article, we describe how we're enabling migration of infrastructure as a service (IaaS) resources from the Classic to Resource Manager deployment models. You can read more about [Azure Resource Manager features and benefits](../articles/azure-resource-manager/resource-group-overview.md). We detail how to connect resources from the two deployment models that coexist in your subscription by using virtual network site-to-site gateways.

## Goal for migration
Resource Manager enables deploying complex applications through templates, configures virtual machines by using VM extensions, and incorporates access management and tagging. Azure Resource Manager includes scalable, parallel deployment for virtual machines into availability sets. The new deployment model also provides lifecycle management of compute, network, and storage independently. Finally, there’s a focus on enabling security by default with the enforcement of virtual machines in a virtual network.

Almost all the features from the classic deployment model are supported for compute, network, and storage under Azure Resource Manager. To benefit from the new capabilities in Azure Resource Manager, you can migrate existing deployments from the Classic deployment model.

## Supported resources for migration
These classic IaaS resources are supported during migration

* Virtual Machines
* Availability Sets
* Cloud Services
* Storage Accounts
* Virtual Networks
* VPN Gateways
* Express Route Gateways _(in the same subscription as Virtual Network only)_
* Network Security Groups 
* Route Tables 
* Reserved IPs 

## Supported scopes of migration
There are 4 different ways to complete migration of compute, network, and storage resources. These are 

* Migration of virtual machines (NOT in a virtual network)
* Migration of virtual machines (in a virtual network)
* Storage accounts migration
* Unattached resources (Network Security Groups, Route Tables & Reserved IPs)

### Migration of virtual machines (NOT in a virtual network)
In the Resource Manager deployment model, security is enforced for your applications by default. All VMs need to be in a virtual network in the Resource Manager model. The Azure platform restarts (`Stop`, `Deallocate`, and `Start`) the VMs as part of the migration. You have two options for the virtual networks that the Virtual Machines will be migrated to:

* You can request the platform to create a new virtual network and migrate the virtual machine into the new virtual network.
* You can migrate the virtual machine into an existing virtual network in Resource Manager.

> [!NOTE]
> In this migration scope, both the management-plane operations and the data-plane operations may not be allowed for a period of time during the migration.
>
>

### Migration of virtual machines (in a virtual network)
For most VM configurations, only the metadata is migrating between the Classic and Resource Manager deployment models. The underlying VMs are running on the same hardware, in the same network, and with the same storage. The management-plane operations may not be allowed for a certain period of time during the migration. However, the data plane continues to work. That is, your applications running on top of VMs (classic) do not incur downtime during the migration.

The following configurations are not currently supported. If support is added in the future, some VMs in this configuration might incur downtime (go through stop, deallocate, and restart VM operations).

* You have more than one availability set in a single cloud service.
* You have one or more availability sets and VMs that are not in an availability set in a single cloud service.

> [!NOTE]
> In this migration scope, the management plane may not be allowed for a period of time during the migration. For certain configurations as described earlier, data-plane downtime occurs.
>
>

### Storage accounts migration
To allow seamless migration, you can deploy Resource Manager VMs in a classic storage account. With this capability, compute and network resources can and should be migrated independently of storage accounts. Once you migrate over your Virtual Machines and Virtual Network, you need to migrate over your storage accounts to complete the migration process.

> [!NOTE]
> The Resource Manager deployment model doesn't have the concept of Classic images and disks. When the storage account is migrated, Classic images and disks are not visible in the Resource Manager stack but the backing VHDs remain in the storage account.
>
>

### Unattached resources (Network Security Groups, Route Tables & Reserved IPs)
Network Security Groups, Route Tables & Reserved IPs that are not attached to any Virtual Machines and Virtual Networks can be migrated independently.

<br>

## Unsupported features and configurations
We do not currently support some features and configurations. The following sections describe our recommendations around them.

### Unsupported features
The following features are not currently supported. You can optionally remove these settings, migrate the VMs, and then re-enable the settings in the Resource Manager deployment model.

| Resource provider | Feature | Recommendation |
| --- | --- | --- |
| Compute |Unassociated virtual machine disks. | The VHD blobs behind these disks will get migrated when the Storage Account is migrated |
| Compute |Virtual machine images. | The VHD blobs behind these disks will get migrated when the Storage Account is migrated |
| Network |Endpoint ACLs. | Remove Endpoint ACLs and retry migration. |
| Network |Virtual network with both ExpressRoute Gateway and VPN Gateway  | Remove the VPN Gateway before beginning migration and then recreate the VPN Gateway once migration is complete. Learn more about [ExpressRoute migration](../articles/expressroute/expressroute-migration-classic-resource-manager.md).|
| Network |ExpressRoute with authorization links  | Remove the ExpressRoute circuit to virtaul network connection before beginning migration and then recreate the connection once migration is complete. Learn more about [ExpressRoute migration](../articles/expressroute/expressroute-migration-classic-resource-manager.md). |
| Network |Application Gateway | Remove the Application Gateway before beginning migration and then recreate the Application Gateway once migration is complete. |
| Network |Virtual networks using VNet Peering. | Migrate Virtual Network to Resource Manager, then peer. Learn more about [VNet Peering](../articles/virtual-network/virtual-network-peering-overview.md). | 

### Unsupported configurations
The following configurations are not currently supported.

| Service | Configuration | Recommendation |
| --- | --- | --- |
| Resource Manager |Role Based Access Control (RBAC) for classic resources |Because the URI of the resources is modified after migration, it is recommended that you plan the RBAC policy updates that need to happen after migration. |
| Compute |Multiple subnets associated with a VM |Update the subnet configuration to reference only subnets. |
| Compute |Virtual machines that belong to a virtual network but don't have an explicit subnet assigned |You can optionally delete the VM. |
| Compute |Virtual machines that have alerts, Autoscale policies |The migration goes through and these settings are dropped. It is highly recommended that you evaluate your environment before you do the migration. Alternatively, you can reconfigure the alert settings after migration is complete. |
| Compute |XML VM extensions (BGInfo 1.*, Visual Studio Debugger, Web Deploy, and Remote Debugging) |This is not supported. It is recommended that you remove these extensions from the virtual machine to continue migration or they will be dropped automatically during the migration process. |
| Compute |Boot diagnostics with Premium storage |Disable Boot Diagnostics feature for the VMs before continuing with migration. You can re-enable boot diagnostics in the Resource Manager stack after the migration is complete. Additionally, blobs that are being used for screenshot and serial logs should be deleted so you are no longer charged for those blobs. |
| Compute |Cloud services that contain web/worker roles |This is currently not supported. |
| Network |Virtual networks that contain virtual machines and web/worker roles |This is currently not supported. |
| Azure App Service |Virtual networks that contain App Service environments |This is currently not supported. |
| Azure HDInsight |Virtual networks that contain HDInsight services |This is currently not supported. |
| Microsoft Dynamics Lifecycle Services |Virtual networks that contain virtual machines that are managed by Dynamics Lifecycle Services |This is currently not supported. |
| Azure AD Domain Services |Virtual networks that contain Azure AD Domain services |This is currently not supported. |
| Azure RemoteApp |Virtual networks that contain Azure RemoteApp deployments |This is currently not supported. |
| Azure API Management |Virtual networks that contain Azure API Management deployments |This is currently not supported. To migrate the IaaS VNET, please change the VNET of the API Management deployment which is a no downtime operation. |
| Compute |Azure Security Center extensions with a VNET that has a VPN gateway in transit connectivity or ExpressRoute gateway with on-prem DNS server |Azure Security Center automatically installs extensions on your Virtual Machines to monitor their security and raise alerts. These extensions usually get installed automatically if the Azure Security Center policy is enabled on the subscription. ExpressRoute gateway migration is not supported currently, and VPN gateways with transit connectivity loses on-premises access. Deleting ExpressRoute gateway or migrating VPN gateway with transit connectivity causes internet access to VM storage account to be lost when proceeding with committing the migration. The migration will not proceed when this happens as the guest agent status blob cannot be populated. It is recommended to disable Azure Security Center policy on the subscription 3 hours before proceeding with migration. |

