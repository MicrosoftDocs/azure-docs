---
title: Move Azure VMware Solution resources across regions
description: This article describes how to move Azure VMware Solution resources from one Azure region to another.
ms.custom: "subject-moving-resources, engagement-fy23"
ms.topic: how-to
ms.service: azure-vmware
ms.date: 01/10/2025

# Customer intent: As an Azure service administrator, I want to move my Azure VMware Solution resources from Azure Region A to Azure Region B.
---

# Move Azure VMware Solution resources to another region

>[!IMPORTANT]
>The steps in this article are strictly for moving Azure VMware Solution (source) in one region to Azure VMware Solution (target) in another region. 

You can move Azure VMware Solution resources to a different region for several reasons. For example, deploy features or services available in specific regions only, meet policy and governance requirements, or respond to capacity planning requirements. 

This article helps you plan and migrate Azure VMware Solution from one Azure region to another, such as Azure region A to Azure region B.

The diagram shows the recommended ExpressRoute connectivity between the two Azure VMware Solution environments. An HCX site pairing and service mesh are created between the two environments. The HCX migration traffic and Layer-2 extension moves (depicted by the purple line) between the two environments. For VMware recommended HCX planning, see [Planning an HCX Migration](https://www.vmware.com/docs/vmware-cloud-planning-an-hcx-migration).

:::image type="content" source="media/move-across-regions/move-ea-csp-across-regions-2.png" alt-text="Diagram showing ExpressRoute Global Reach communication between the source and target Azure VMware Solution environments." border="false" lightbox="media/move-across-regions/move-ea-csp-across-regions-2.png":::

>[!NOTE]
>You don't need to migrate any workflow back to on-premises because the traffic will flow between the private clouds (source and target):
>
>**Azure VMware Solution private cloud (source) > ExpressRoute gateway (source) > Global Reach -> ExpressRoute gateway (target) > Azure VMware Solution private cloud (target)**

The diagram shows the connectivity between both Azure VMware Solution environments. 

:::image type="content" source="media/move-across-regions/move-ea-csp-across-regions-connectivity-diagram.png" alt-text="Diagram showing communication between the source and target Azure VMware Solution environments." border="false" lightbox="media/move-across-regions/move-ea-csp-across-regions-connectivity-diagram.png":::

In this article, walk through the steps to: 

> [!div class="checklist"]
> * Prepare and plan the move to another Azure region
> * Establish network connectivity between the two Azure VMware Solution private clouds
> * Export the configuration from the Azure VMware Solution source environment
> * Reapply the supported configuration elements to the Azure VMware Solution target environment
> * Migrate workloads using VMware HCX

## Prerequisites

- [VMware HCX appliance is upgraded to the latest patch](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-9/vmware-hcx-user-guide-4-9/updating-vmware-hcx.html) to avoid migration issues if any.

- Source's local content library is a [published content library](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-virtual-machine-administration-guide-8-0/using-content-librariesvsphere-vm-admin/publish-the-contents-of-a-library-and-a-single-template-to-a-subscribervsphere-vm-admin.html).

## Prepare

The following steps show how to prepare your Azure VMware Solution private cloud to move to another Azure VMware Solution private cloud. 

### Export the source configuration

1. From the source, [export the extended segments, firewall rules, port details, and route tables](https://techdocs.broadcom.com/us/en/vmware-cis/nsx/vmware-nsx/4-1-1/administration-guide/security/distributed-firewall/export-or-import-a-firewall-configuration.html).

1. [Export the contents of an inventory list view to a CSV file](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vcenter-and-host-management-8-0/using-the-vsphere-client-host-management/working-with-the-vsphere-client-inventory-host-management.html#GUID-C0E8DD52-677E-464F-A3EA-044EE20B7B92-en).

1. [Sort workloads into migration groups (migration wave)](https://www.vmware.com/docs/vmware-cloud-planning-an-hcx-migration).


### Deploy the target environment

Before you can move the source configuration, you need to [deploy the target environment](plan-private-cloud-deployment.md).

### Back up the source configuration

Back up the Azure VMware Solution (source) configuration that includes vCenter Server, NSX-T Data Center, and firewall policies and rules. 

- **Compute:** Export existing inventory configuration. For Inventory backup, you can use [RVTools (an open-source app)](https://www.robware.net/home).
  
- **Network and firewall policies and rules:** This is included as part of the VMware HCX Network Extension.

Azure VMware Solution supports all backup solutions. You need CloudAdmin privileges to install, backup data, and restore backups. For more information, see [Backup solutions for Azure VMware Solution VMs](ecosystem-back-up-vms.md).

- VM workload backup using the Commvault solution:

   - [Create a VMware client](https://documentation.commvault.com/11.20/guided_setup_for_vmware.html) from the Command center for Azure VMware Solution vCenter.

   - [Create a VM group](https://documentation.commvault.com/11.20/adding_vm_group_for_vmware.html) with the required VMs for backups.

   - [Run backups on VM groups](https://documentation.commvault.com/11.20/performing_backups_for_vmware_vm_or_vm_group.html).

   - [Restore VMs](https://documentation.commvault.com/11.20/restoring_full_virtual_machines_for_vmware.html).

- VM workload backup using [Veritas NetBackup solution](https://vrt.as/nb4avs). 

>[!TIP]
>You can use [Azure Resource Mover](../resource-mover/move-region-within-resource-group.md?toc=/azure/azure-resource-manager/management/toc.json) to verify and migrate the list of supported resources to move across regions, which are dependent on Azure VMware Solution.

### Locate the source ExpressRoute circuit ID

1. From the source, sign in to the [Azure portal](https://portal.azure.com/).

2. Select **Manage** > **Connectivity** > **ExpressRoute**.

3. Copy the source’s **ExpressRoute ID**. You need it to peer between the private clouds.

### Create the target’s authorization key

1. From the target, sign in to the [Azure portal](https://portal.azure.com/).

   > [!NOTE]
   > If you need access to the Azure US Gov portal, go to https://portal.azure.us/

1. Select **Manage** > **Connectivity** > **ExpressRoute**, then select **+ Request an authorization key**.

   :::image type="content" source="media/expressroute-global-reach/start-request-authorization-key.png" alt-text="Screenshot showing how to request an ExpressRoute authorization key." border="true" lightbox="media/expressroute-global-reach/start-request-authorization-key.png":::

1. Provide a name for it and select **Create**.

   It can take about 30 seconds to create the key. Once created, the new key appears in the list of authorization keys for the private cloud.

   :::image type="content" source="media/expressroute-global-reach/show-global-reach-auth-key.png" alt-text="Screenshot showing the ExpressRoute Global Reach authorization key.":::
  
1. Copy the authorization key and ExpressRoute ID. You need them to complete the peering. The authorization key disappears after some time, so copy it as soon as it appears.

### Peer between private clouds

Now that you have the ExpressRoute circuit IDs and authorization keys for both environments, you can peer the source to the target. You use the resource ID and authorization key of your private cloud ExpressRoute circuit to finish the peering.
 
1. From the target, sign in to the [Azure portal](https://portal.azure.com) using the same subscription as the source’s ExpressRoute circuit.

   >[!NOTE]
   >If you need access to the Azure US Gov portal, go to https://portal.azure.us/

1. Under Manage, select **Connectivity** > **ExpressRoute Global Reach** > **Add**.

   :::image type="content" source="./media/expressroute-global-reach/expressroute-global-reach-tab.png" alt-text="Screenshot showing the ExpressRoute Global Reach tab in the Azure VMware Solution private cloud.":::

1. Paste the ExpressRoute circuit ID and target’s authorization key you created in the previous step. Then select **Create**:

   :::image type="content" source="./media/expressroute-global-reach/on-premises-cloud-connections.png" alt-text="Screenshot that shows the dialog for entering the connection information."::: 

### Create a site pairing between private clouds

After you establish connectivity, you'll create a VMware HCX site pairing between the private clouds to facilitate the migration of your VMs. You can connect or pair the VMware HCX Cloud Manager in Azure VMware Solution with the VMware HCX Connector in your data center. 

1. Sign in to your source's vCenter Server, and under **Home**, select **HCX**.

1. Under **Infrastructure**, select **Site Pairing** and select the **Connect To Remote Site** option (in the middle of the screen). 

1. Enter the Azure VMware Solution HCX Cloud Manager URL or IP address you noted earlier `https://x.x.x.9`, the Azure VMware Solution cloudadmin@vsphere.local username, and the password. Then select **Connect**.

   > [!NOTE]
   > To successfully establish a site pair:
   > * Your VMware HCX Connector must be able to route to your HCX Cloud Manager IP over port 443.
   >
   > * Use the same password that you used to sign in to vCenter Server. You defined this password on the initial deployment screen.

   You see a screen showing that your VMware HCX Cloud Manager in Azure VMware Solution and your on-premises VMware HCX Connector are connected (paired).

   :::image type="content" source="media/tutorial-vmware-hcx/site-pairing-complete.png" alt-text="Screenshot that shows the pairing of the HCX Manager in Azure VMware Solution and the VMware HCX Connector.":::

### Create a service mesh between private clouds

> [!NOTE]
> To successfully establish a service mesh with Azure VMware Solution:
>
> * Ports UDP 500/4500 are open between your on-premises VMware HCX Connector 'uplink' network profile addresses and the Azure VMware Solution HCX Cloud 'uplink' network profile addresses.
>
> * Be sure to review the [VMware HCX required ports](https://ports.broadcom.com/home/VMware-HCX).

1. Under **Infrastructure**, select **Interconnect** > **Service Mesh** > **Create Service Mesh**.

   :::image type="content" source="media/tutorial-vmware-hcx/create-service-mesh.png" alt-text="Screenshot of selections to start creating a service mesh." lightbox="media/tutorial-vmware-hcx/create-service-mesh.png":::

1. Review the prepopulated sites, and then select **Continue**. 

   > [!NOTE]
   > If this is your first service mesh configuration, you won't need to modify this screen.

1. Select the source and remote compute profiles from the drop-down lists, and then select **Continue**.

   The selections define the resources where VMs can consume VMware HCX services.

   :::image type="content" source="media/tutorial-vmware-hcx/select-compute-profile-source.png" alt-text="Screenshot that shows selecting the source compute profile." lightbox="media/tutorial-vmware-hcx/select-compute-profile-source.png":::

   :::image type="content" source="media/tutorial-vmware-hcx/select-compute-profile-remote.png" alt-text="Screenshot that shows selecting the remote compute profile." lightbox="media/tutorial-vmware-hcx/select-compute-profile-remote.png":::

1. Review services that you want to be enabled, and then select **Continue**.

1. In **Advanced Configuration - Override Uplink Network profiles**, select **Continue**.

   Uplink network profiles connect to the network through which the remote site's interconnect appliances can be reached.
  
1. In **Advanced Configuration - Network Extension Appliance Scale Out**, review and select **Continue**. 

   You can have up to eight Network Segments per appliance, but you can deploy another appliance to add another eight Network Segments. You must also have IP space to account for the more appliances, and it's one IP per appliance.  For more information, see [VMware HCX Configuration Limits](https://configmax.broadcom.com/guest?vmwareproduct=VMware%20HCX&release=VMware%20HCX&categories=41-0,42-0,43-0,44-0,45-0).
   
   :::image type="content" source="media/tutorial-vmware-hcx/extend-networks-increase-vlan.png" alt-text="Screenshot that shows where to increase the VLAN count." lightbox="media/tutorial-vmware-hcx/extend-networks-increase-vlan.png":::

1. In **Advanced Configuration - Traffic Engineering**, review and make any modifications that you feel are necessary, and then select **Continue**.

1. Review the topology preview and select **Continue**.

1. Enter a user-friendly name for this service mesh and select **Finish** to complete.

1. Select **View Tasks** to monitor the deployment. 

   :::image type="content" source="media/tutorial-vmware-hcx/monitor-service-mesh.png" alt-text="Screenshot that shows the button for viewing tasks.":::

   When the service mesh deployment finishes successfully, you see the services as green.

   :::image type="content" source="media/tutorial-vmware-hcx/service-mesh-green.png" alt-text="Screenshot that shows green indicators on services." lightbox="media/tutorial-vmware-hcx/service-mesh-green.png":::

1. Verify the service mesh's health by checking the appliance status. 

1. Select **Interconnect** > **Appliances**.

   :::image type="content" source="media/tutorial-vmware-hcx/interconnect-appliance-state.png" alt-text="Screenshot that shows selections for checking the status of the appliance." lightbox="media/tutorial-vmware-hcx/interconnect-appliance-state.png":::

## Move

The following steps show how to move your Azure VMware Solution private cloud resources to another Azure VMware Solution private cloud in a different region. 

In this section, you migrate the:

- Resource pool configuration and folder creation

- VM templates and the associated tags

- Logical segments deployment based on the source's port groups and associated VLANs 

- Network security services and groups

- Gateway firewall policy and rules based on the source's firewall policies

### Migrate the source vSphere configuration

In this step, copy the source vSphere configuration and move it to the target environment. 

1. From the source vCenter Server, use the same resource pool configuration and [create the same resource pool configuration](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-resource-management-8-0/managing-resource-pools.html#GUID-0F6C6709-A5DA-4D38-BE08-6CB1002DD13D-en) on the target's vCenter Server.

2. From the source's vCenter Server, use the same VM folder name and [create the same VM folder](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vcenter-and-host-management-8-0/organizing-your-inventory-host-management/create-a-folder-host-management.html) on the target's vCenter Server under **Folders**.

3. Use VMware HCX to migrate all VM templates from the source's vCenter Server to the target's vCenter Server.

   1. From the source, convert the existing templates to VMs and then migrate them to the target.

   2. From the target, convert the VMs to VM templates.

4. From the source environment, use the same VM Tags name and [create them on the target's vCenter](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vcenter-and-host-management-8-0/vsphere-tags-and-attributes-host-management/vsphere-tags-host-management.html#GUID-2FF21224-B6BC-499B-AD8B-D2C4309AD9DC-en). 

5. From the source's vCenter Server Content Library, use the subscribed library option to copy the ISO, OVF, OVA, and VM Templates to the target content library:

   1. If the content library isn't already published, select the **Enable publishing** option.

   2. From the source's Content Library, copy the URL of the published library.

   3. From the target, [create a subscribed content library](deploy-vm-content-library.md) with the URL from the source's library.

   4. Select **Sync Now**.

### Configure the target NSX-T Data Center environment

In this step, use the source NSX-T Data Center configuration to configure the target NSX-T Data Center environment.

>[!NOTE]
>You'll have multiple features configured on the source NSX-T Data Center, so you must copy or read from the source NSX-T Data Center and recreate it in the target private cloud. Use L2 Extension to keep same IP address and Mac Address of the VM while migrating Source to target Azure VMware Solution Private Cloud to avoid downtime due to IP change and related configuration.

1. [Configure NSX-T Data Center network components](tutorial-nsx-t-network-segment.md) required in the target environment under default Tier-1 gateway.

1. [Create the security group configuration](https://techdocs.broadcom.com/us/en/vmware-cis/nsx/vmware-nsx/4-1-1/administration-guide/inventory/add-a-group.html#GUID-9DFF6EE2-2E00-4097-A412-B72472596E4D-en).

1. [Create the distributed firewall policy and rules](https://techdocs.broadcom.com/us/en/vmware-cis/nsx/vmware-nsx/4-1-1/administration-guide/security/distributed-firewall/add-a-distributed-firewall.html).

1. [Create the gateway firewall policy and rules](https://techdocs.broadcom.com/us/en/vmware-cis/nsx/vmware-nsx/4-1-1/administration-guide/security/gateway-firewall/add-a-gateway-firewall-policy-and-rule.html).

1. [Create the DHCP server or DHCP relay service](configure-dhcp-azure-vmware-solution.md). 

1. [Configure port mirroring](configure-port-mirroring-azure-vmware-solution.md).

1. [Configure DNS forwarder](configure-dns-azure-vmware-solution.md).

1. [Configure a new Tier-1 gateway (other than default)](https://techdocs.broadcom.com/us/en/vmware-cis/nsx/vmware-nsx/4-1-1/administration-guide/tier-1-gateways/add-an-nsx-tier-1-gateway.html). This configuration is based on the NSX-T Data Center configured on the source. 

### Migrate the VMs from the source 

In this step, use VMware HCX to migrate the VMs from the source to the target. You can opt to do a Layer-2 extension from the source and use HCX to vMotion the VMs from the source to the target with minimal interruption. 

Besides vMotion, other methods, like Bulk and Cold vMotion, are also recommended. Learn more about:

- [Plan an HCX Migration](https://www.vmware.com/docs/vmware-cloud-planning-an-hcx-migration)

- [Migrate Virtual Machines with HCX](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-14D48C15-3D75-485B-850F-C5FCB96B5637.html)

### Cutover extended networks 

In this step, perform a final gateway cutover to terminate the extended networks. Move (migrate) the gateways from the source Azure VMware Solution environment to the target environment.

>[!IMPORTANT]
>You must do the gateway cutover post VLAN workload migration to the target Azure VMware Solution environment. Also, there shouldn't be any VM dependency on the source and target environments.

Before the gateway cutover, verify all migrated workload services and performance. Once application and web service owners accept the performance (except for any latency issues), you can continue with the gateway cutover.  Once the cutover is completed, you need to modify the public DNS A and PTR records. 

For VMware recommendations, see [Cutover of extended networks](https://www.vmware.com/docs/vmware-cloud-planning-an-hcx-migration).

### Public IP DNAT for migrated DMZ VMs

To this point, you migrated the workloads to the target environment. These application workloads must be reachable from the public internet. The target environment provides two ways of hosting any application. Applications can be:

- Hosted and published under the application gateway load balancer.

- Published through the public IP feature in vWAN.

Public IP is typically the destination NAT translated into the Azure firewall. With DNAT rules, firewall policy would translate the public IP address request to a private address (webserver) with a port. For more information, see [How to use the public IP functionality in Azure Virtual WAN](./enable-public-ip-nsx-edge.md).

>[!NOTE]
>SNAT is by default configured in Azure VMware Solution, so you must enable SNAT from Azure VMware Solution private cloud connectivity settings under the Manage tab.

## Decommission

For this last step, verify that all the VM workloads were migrated successfully, including the network configuration. If there's no dependency, you can disconnect the HCX service mesh, site pairing, and network connectivity from the source environment. 

>[!NOTE]
>Once you decommission the private cloud, you cannot undo it as the configuration and data will be lost.


## Next steps

Learn more about:

- [Move operation support for Microsoft.AVS](../azure-resource-manager/management/move-support-resources.md#microsoftavs)
- [Move guidance for networking resources](../azure-resource-manager/management/move-limitations/networking-move-limitations.md)
- [Move guidance for virtual machines](../azure-resource-manager/management/move-limitations/virtual-machines-move-limitations.md)
- [Move guidance for App Service resources](../azure-resource-manager/management/move-limitations/app-service-move-limitations.md)
