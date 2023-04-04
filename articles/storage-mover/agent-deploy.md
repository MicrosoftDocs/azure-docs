---
title: How to deploy an Azure Storage Mover agent. #Required; page title is displayed in search results. Include the brand.
description: Learn how to deploy an Azure Mover agent #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 03/27/2023
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final       

REVIEW Stephen/Fabian: COMPLETE
REVIEW Engineering: not reviewed
EDIT PASS: started

Initial doc score: 83
Current doc score: 96 (2026 words and 10 false-positive issues)

!########################################################
-->

# Deploy an Azure Storage Mover agent

The Azure Storage Mover service utilizes agents to perform the migration jobs you configure in the service. An agent is a virtual machine-based migration appliance that runs on a virtualization host. Ideally, your virtualization host is located as near as possible to the source storage to be migrated.

Because the agent is essentially a migration appliance, you interact with it through an agent-local administrative shell. The shell limits the operations you can perform on this machine, though network configuration and troubleshooting tasks are accessible.

Use of the agent in migrations is managed through Azure. Both Azure PowerShell and CLI are supported, and graphical interaction is available within the Azure portal. The agent is made available as a disk image compatible with new Windows Hyper-V virtual machines (VM).

This article guides you through the steps necessary to successfully deploy a Storage Mover agent VM.

## Prerequisites

- A capable Windows Hyper-V host on which to run the agent VM. See the [Recommended compute and memory resources](#recommended-compute-and-memory-resources) section in this article for details about resource requirements for the agent VM.

> [!NOTE]
> At present, Windows Hyper-V is the only supported virtualization environment for your agent VM. Other virtualization environments have not been tested and are not supported.

## Download the agent VM image

The image is hosted on Microsoft Download Center as a zip file. Download the file at [https://aka.ms/StorageMover/agent](https://aka.ms/StorageMover/agent) and extract the agent virtual hard disk (VHD) image to your virtualization host.

## Determine required resources for the VM

Like every VM, the agent requires available compute, memory, network, and storage space resources on the host. Although overall data size may affect the time required to complete a migration, it's generally the number of files and folders that drives resource requirements.

### Network resources

The agent requires unrestricted internet connectivity.

There's no single network configuration option that works for every environment. However, the simplest configuration involves the deployment of an external virtual switch. The external switch type is connected to a physical adapter and allows your host operating system (OS) to share its connection with all your virtual machines (VMs). This switch allows communication between your physical network, the management operating system, and the virtual adapters on your virtual machines. This approach is fine for a test environment, but may not be suitable for a production server.

After the switch is created, ensure that both the management and agent VMs are on the same switch. On the WAN link firewall, outbound TCP port 443 must be open. Keep in mind that connectivity interruptions are to be expected when changing network configurations.

You can get help with [creating a virtual switch for Hyper-V virtual machines](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-switch-for-hyper-v-virtual-machines) in the [Windows Server](/windows-server/) documentation.

### Recommended compute and memory resources

|Migration scale*        |Memory (RAM)  |Virtual processor count cores (at 2 GHz min.) |
|------------------------|--------------|----------------------------------------------|
|  1 million items       | 8 GiB        | 4 virtual cores                              |
| 10 million items       | 8 GiB        | 4 virtual cores                              |
| 30 million items       | 12 GiB       | 6 virtual cores                              |
| 50 million items       | 16 GiB       | 8 virtual cores                              |
|100 million items       | 16 GiB       | 8 virtual cores                              |

**Number of items** *refers to the total number of files and folders in the source.*

> [!IMPORTANT]
> While agent VMs below minimal specs may work for your migration, they may not perform optimally.

The [Performance targets](performance-targets.md) article contains test results from different source namespaces and VM resources.

### Local storage capacity

At a minimum, the agent image needs 20 GiB of local storage. The amount required may increase if a large number of small files are cached during a migration.

## Create the agent VM

1. Create a new VM to host the agent. Open **Hyper-V Manager**. In the **Actions** pane, select **New** and **Virtual Machine...** to launch the **New Virtual Machine Wizard**.

   :::image type="content" source="media/agent-deploy/agent-vm-create-sml.png" alt-text="Image showing how to launch the New Virtual Machine Wizard from within the Hyper-V Manager." lightbox="media/agent-deploy/agent-vm-create-lrg.png":::

1. Within the **Specify Name and Location** pane, specify values for the agent VM's **Name** and **Location** fields. The location should match the folder where the VHD is stored, if possible. Select **Next**.

   :::image type="content" source="media/agent-deploy/agent-name-select-sml.png" alt-text="Image showing the location of the Name and Location fields within the New Virtual Machine Wizard." lightbox="media/agent-deploy/agent-name-select-lrg.png":::

1. Within the **Specify Generation** pane, select the **Generation 1** option.

   :::image type="content" source="media/agent-deploy/agent-vm-generation-select-sml.png" lightbox="media/agent-deploy/agent-vm-generation-select-lrg.png"  alt-text="Image showing the location of the VM Generation options within the New Virtual Machine Wizard.":::

   > [!IMPORTANT]
   > Only *Generation 1* VMs are supported. This Linux image won't boot as a *Generation 2* VM.

1. If you haven't already, [determine the amount of memory you need for your VM](#determine-required-resources-for-the-vm). Enter this amount in the **Assign Memory** pane, noting that you need to enter the value in MiB. 1 GiB = 1024 MiB. Using the **Dynamic Memory** feature is fine.

   :::image type="content" source="media/agent-deploy/agent-memory-allocate-sml.png" lightbox="media/agent-deploy/agent-memory-allocate-lrg.png"  alt-text="Image showing the location of the Startup Memory field within the New Virtual Machine Wizard.":::

1. Within the **Configure Networking** pane, select the **Connection** drop-down. From the list, choose the virtual switch that provides the agent with internet connectivity and select **Next**. For more information, see the [Hyper-V virtual networking documentation](/windows-server/networking/sdn/technologies/hyper-v-network-virtualization/hyperv-network-virtualization-overview-windows-server) for details.

   :::image type="content" source="media/agent-deploy/agent-networking-configure-sml.png" lightbox="media/agent-deploy/agent-networking-configure-lrg.png"  alt-text="Image showing the location of the network Connection field within the New Virtual Machine Wizard.":::

1. Within the **Connect Virtual Hard Disk** pane, select the **Use an existing Virtual Hard Disk** option. In the **Location** field, select **Browse** and navigate to the VHD file that was extracted in the previous steps. Select **Next**.

   :::image type="content" source="media/agent-deploy/agent-disk-connect-sml.png" lightbox="media/agent-deploy/agent-disk-connect-lrg.png"  alt-text="Image showing the location of the Virtual Hard Disk Connection fields within the New Virtual Machine Wizard.":::

1. Within the **Summary** pane, select **Finish** to create the agent VM.

   :::image type="content" source="media/agent-deploy/agent-configuration-details-sml.png"  lightbox="media/agent-deploy/agent-configuration-details-lrg.png" alt-text="Image showing the user-assigned values in the Summary pane of the New Virtual Machine Wizard.":::

1. After the new agent is successfully created, it will appear in the **Virtual Machines** pane within the **Hyper-V Manager**.

   :::image type="content" source="media/agent-deploy/agent-created-sml.png" lightbox="media/agent-deploy/agent-created-lrg.png" alt-text="Image showing the agent VM deployed within the New Virtual Machine Wizard.":::

## Change the default password

The agent is delivered with a default user account and password. Immediately after deploying and starting the agent VM, connect to it and change the default password!

[!INCLUDE [agent-shell-connect](includes/agent-shell-connect.md)]

## Bandwidth throttling

A general consideration when deploying new machines in a network is the amount of bandwidth they use. Any Azure Storage Mover agent uses all available network bandwidth on the local network (source share to agent) and the WAN link (agent to Azure Storage).

> [!IMPORTANT]
> The current Azure Storage Mover agent does not support bandwidth throttling schedules.

If bandwidth throttling is important to you, consider creating a local virtual network (VNet) with network quality of service (QoS) settings and an internet connection. Then expose the agent to the internet through this VNet. An unauthenticated network proxy server can also be configured locally on the agent.

## Decommissioning an agent

When you no longer need a specific storage mover agent, you can decommission it.
During public review, decommissioning is a two-step process:

1. The agent needs to be unregistered from the storage mover resource.
1. Stop and delete the agent VM on your virtualization host.

Decommissioning an agent starts with unregistering the agent. There are three options to start the unregistration process:

# [Agent administrative shell](#tab/xdmshell)

You can unregister an agent using the administrative shell of the agent VM. The agent must be connected to the service and showing online both locally and through Azure portal and either Azure PowerShell or Azure CLI.

[!INCLUDE [agent-shell-connect](includes/agent-shell-connect.md)]

```StorageMoverAgent-AdministrativeShell
1) System configuration
2) Network configuration
3) Service and job status
4) Unregister
5) Open restricted shell
6) Collect support bundle
7) Restart agent
8) Exit

xdmsh> 4
```

Select the option **4) Unregister**. You're prompted for confirmation.

> [!WARNING]
> Unregistration stops any running migration job on the agent and permanently removes the agent from the pool of available migration agents. Re-registration of a previously registered agent VM is not supported. If you need a new agent you should register a new, previously unregistered agent VM. Do not reuse a previously unregistered agent VM.

# [Azure portal](#tab/azure-portal)

You can unregister an agent in the Azure portal by navigating to your storage mover resource the agent is registered with.

- Select **Registered agents** in the main navigation menu.
- Select the agent to be decommissioned. The agent details pane opens.
- Select **Unregister agent** and wait for the operation to complete.

> [!WARNING]
> Unregistration stops any running migration job on the agent and permanently removes the agent from the pool of available migration agents. Re-registration of a previously registered agent VM is not supported. If you need a new agent, you must use a new agent image that was never registered before and register this new agent VM. Do not reuse a previously unregistered agent VM.

# [PowerShell](#tab/powershell)

You can unregister an agent using the Az PowerShell. As a prerequisite, ensure that you have the latest version of PowerShell on your machine, and also the latest versions of the Az and Az.StorageMover PowerShell modules installed.

```powershell
Login-AzAccount -subscriptionId <YourSubscriptionId> #log into the Azure subscription that contains the storage mover resource the agent is registered with.
Unregister-AzStorageMoverAgent -ResourceGroupName <YourResourceGroupName> -StorageMoverName <YourStorageMoverName> -AgentName <YourAgentName>
```

*-Force* is an optional parameter, suppressing the confirmation prompt.

> [!WARNING]
> Unregistration stops any running migration job on the agent and permanently removes the agent from the pool of available migration agents. Re-registration of a previously registered agent VM is not supported. If you need a new agent you should register a new, previously unregistered agent VM. Do not reuse a previously unregistered agent VM.

---

Several things take place during the unregistration process:

- The agent is removed from the storage mover resource. You can no longer see the agent in the *Registered agents* tab in the portal or select it for new migration jobs.
- The agent is also removed from the Azure ARC service. This removal deletes the hybrid compute resource of type *Server - Azure Arc* that represented the agent with the Azure ARC service in the same resource group as your storage mover resource.
- Unregistration removes the managed identity of the agent from Azure Active Directory (Azure AD). The associated service principal is automatically removed, invalidating any permissions this agent may have had on other Azure resources. If you check the role-based access control (RBAC) role assignments, for instance of a target storage container the agent previously had permissions to, you no longer find the service principal of the agent, because it was deleted. The assignment itself is still visible as "Unknown service principal" but this assignment no longer connects to an identity and can never be reconnected. It's simply a sign that a role assignment used to be here, of a service principal that no longer exists.

  This behavior is standard, and not specific to Azure Storage Mover. You can observe the same behavior if you remove a different service principal from Azure AD and then check a former role assignment.

> [!WARNING]
> Unregistration of an offline agent is supported, but the agent's Azure ARC resource isn't automatically deleted. Instead, you'll need to manually delete the resource after unregistering an offline agent. The lifecycle of the agent's managed identity is tied to this resource. Removing it removes the managed identity and service principal, as previously described.

You can check that the unregistration process is complete when the agent disappears from the Azure portal and either Azure PowerShell or Azure CLI. You also need to confirm that the hybrid compute resource of type *Server - Azure Arc* is gone from the resource group.

You can also use the agent's administrative shell to check that the agent is unregistered. To verify unregistration, navigate to any submenu and then return to the top-level menu. If unregistration was successful, you see the menu option toggle from *Unregister* to *Register*. As previously mentioned, re-registering isn't supported.

You can stop the agent VM on your virtualization host after the unregistration is complete. It's best to delete the agent VM image since it was previously registered, retains some state, and must not be used again. If you need a new agent, deploy a new VM with a new agent image, never before registered.

## Next steps

After you've deployed your agent VM, started it, and changed the default password of the local account:
> [!div class="nextstepaction"]
> [Register the agent with your storage mover Azure resource](agent-register.md)
