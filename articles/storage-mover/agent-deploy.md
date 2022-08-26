---
title: How to deploy an Azure Storage Mover agent. #Required; page title is displayed in search results. Include the brand.
description: Learn how to deploy an Azure Mover agent #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 08/25/2022
ms.custom: template-how-to
---

# Deploy an Azure Storage Mover agent

The Azure Storage Mover service utilizes agents to perform the migration jobs you configure in the service. An agent is a virtual machine-based migration appliance which runs on a virtualization host. Ideally, your virtualization host will be located as near as possible to the source storage which you intend to migrate.

Because the agent is essentially a migration appliance, you'll interact with it through an agent-local administrative shell. The shell limits the operations you can perform on this machine, though network configuration and troubleshooting tasks are accessible.

Use of the agent in migrations is managed through Azure. Both Azure PowerShell and CLI are supported, and graphical interaction is available within the Azure Portal. The agent is made available as a VM disk image compatible with a new Windows Hyper-V virtual machine (VM).

In this article you'll learn how to successfully deploy a Storage Mover agent virtual machine.

## Prerequisites

- A capable Windows Hyper-V host on which to run the agent VM. See the [Recommended compute and memory resources](#recommended-compute-and-memory-resources) section in this article for details about resource requirements for the agent VM.

> [!NOTE]
> During public preview, Windows Hyper-V is the only supported virtualization environment for your agent VM. Other virtualization environments have not been tested and are not supported at this time.

## Download the agent VM image

The image is hosted on Microsoft Download Center as a zip file. Download the file at [https://aka.ms/StorageMover/agent](https://aka.ms/StorageMover/agent) and extract the agent virtual hard disk (VHD) image to your virtualization host.

## Determine required resources for the VM

Like every VM, the agent requires available compute, memory and storage space resources on the host. Although overall data size may impact the time to complete a migration, it is generally the number of files and folders that drives resource requirements.

### Recommended compute and memory resources

|Migration scale*        |Memory (RAM)                |Virtual processor count     |
|------------------------|----------------------------|----------------------------|
|&lt;  1 million items   | &lt;min-spec RAM&gt; GiB   | &lt;min-spec core count&gt;|
|&lt; 10 million items   | &lt;RAM&gt; GiB            | &lt;core count&gt;         |
|&lt; 30 million items   | &lt;RAM&gt; GiB            | &lt;core count&gt;         |
|&lt; 50 million items   | &lt;RAM&gt; GiB            | &lt;core count&gt;         |
|&lt;100 million items   | &lt;RAM&gt; GiB            | &lt;core count&gt;         |

**Number of items refers to the total number of files and folders in the source share.*

> [!IMPORTANT]
> While agent VMs below minimal specs may work for your migration, they do not qualify for support from Microsoft.

The [Performance targets](performance-targets.md) article contains test results from different source share sizes and VM resources.

### Local storage capacity

At a minimum, the agent image needs 20GiB of local storage. The amount required may increase if a large number of small files are cached during a migration.

## Create the agent VM

1. Create a new VM to host the agent. Open **Hyper-V Manager**. In the **Actions** pane, select **New** and **Virtual Machine...** to launch the **New Virtual Machine Wizard**.
  :::image type="content" source="media/agent-deploy/agent-vm-create-sml.png" alt-text="Image showing how to launch the New Virtual Machine Wizard from within the Hyper-V Manager." lightbox="media/agent-deploy/agent-vm-create-lrg.png":::

1. Within the **Specify Name and Location** pane, specify values for the agent VM's **Name** and **Location** fields. The location should match the folder where the VHD is stored, if possible. Select **Next**.
  :::image type="content" source="media/agent-deploy/agent-name-select-sml.png" alt-text="Image showing the location of the Name and Location fields within the New Virtual Machine Wizard." lightbox="media/agent-deploy/agent-name-select-lrg.png":::

1. Within the **Specify Generation** pane, select the **Generation 1** option.

   :::image type="content" source="media/agent-deploy/agent-vm-generation-select-sml.png" lightbox="media/agent-deploy/agent-vm-generation-select-lrg.png"  alt-text="Image showing the location of the VM Generation options within the New Virtual Machine Wizard.":::

   > [!IMPORTANT]
   Only *Generation 1* VMs are supported. This Linux image won't boot as a *Generation 2* VM.

1. If you haven't already, [determine the amount of memory you'll need for your VM](#determine-required-resources-for-the-vm). Enter this amount in the **Assign Memory** pane. Note that you need to enter the value in MiB. 1GiB = 1024MiB. Using the **Dynamic Memory** feature is fine.
  :::image type="content" source="media/agent-deploy/agent-memory-allocate-sml.png" lightbox="media/agent-deploy/agent-memory-allocate-lrg.png"  alt-text="Image showing the location of the Startup Memory field within the New Virtual Machine Wizard.":::

1. Within the **Configure Networking** pane, select the **Connection** drop-down and choose the virtual switch which will provide the agent with internet connectivity. Select **Next**. Refer to the [HyperV virtual networking documentation](/windows-server/networking/sdn/technologies/hyper-v-network-virtualization/hyperv-network-virtualization-overview-windows-server) for more details.
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

## Decommissioning an agent

When you no longer need a specific storage mover agent, you can decommission it.
During public review, decommissioning is a two-step process:

1. The agent needs to be unregistered from the storage mover resource.
1. Stop and delete the agent VM on your virtualization host.

Decommissioning an agent starts with unregistering the agent. There are three options to start the unregistration process:

# [Agent administrative shell](#tab/xdmshell)

You can unregister an agent using the administrative shell of the agent VM. The agent must be connected to the service and showing online locally as well as through Azure portal or Az PowerShell / Az CLI.

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

Select the option **4) Unregister**. You will be prompted for confirmation.

> [!WARNING]
> Unregistration stops any running migration job on the agent and permanently removes the agent from the pool of available migration agents. Re-registration of a previously registered agent VM is not supported in public preview. If you need a new agent, you must use a new agent image that was never registered before and register this new agent VM. Do not reuse a previously unregistered agent VM.

# [Azure portal](#tab/azure-portal)

You can unregister an agent in the Azure portal by navigating to your storage mover resource the agent is registered with.

- select **Registered agents** in the main navigation menu.
- select the agent you wish to decommission - a context blade showing agent details opens.
- select **Unregister agent** and wait for this operation to finish.

> [!WARNING]
> Unregistration stops any running migration job on the agent and permanently removes the agent from the pool of available migration agents. Re-registration of a previously registered agent VM is not supported in public preview. If you need a new agent, you must use a new agent image that was never registered before and register this new agent VM. Do not reuse a previously unregistered agent VM.

# [PowerShell](#tab/powershell)

You can unregister an agent using the Az PowerShell. As a prerequisite, ensure that you have the latest version of PowerShell on your machine, and also the latest versions of the Az and Az.StorageMover PowerShell modules installed.

```powershell
Login-AzAccount -subscriptionId <YourSubscriptionId> #log into the Azure subscription that contains the storage mover resource the agent is registered with.
Unregister-AzStorageMoverAgent -ResourceGroupName <YourResourceGroupName> -StorageMoverName <YourStorageMoverName> -AgentName <YourAgentName>
```

*-Force* is an optional parameter, suppressing the confirmation prompt.

> [!WARNING]
> Unregistration stops any running migration job on the agent and permanently removes the agent from the pool of available migration agents. Re-registration of a previously registered agent VM is not supported in public preview. If you need a new agent, you must use a new agent image that was never registered before and register this new agent VM. Do not reuse a previously unregistered agent VM.

---

The unregistration process has multiple effects:

- The agent is removed from the storage mover resource. You'll no longer be able to see the agent in the *Registered agents* tab in the portal or select it for new migration jobs.
- The agent is also removed from the Azure ARC service. This removal deletes the hybrid compute resource of type *Server - Azure Arc* that represented the agent with the Azure ARC service in the same resource group as your storage mover resource.
- Unregistration removes the managed identity of the agent from Azure Active Directory (AAD). The associated service principal is automatically removed, invalidating any permissions this agent may have had on other Azure resources. If you check the RBAC (role based access control) role assignments, for instance of a target storage container the agent previously had permissions to, you'll no longer find the service principal of the agent, because it was deleted. The assignment itself is still visible as "Unknown service principal" but this assignment no longer connects to an identity and can never be reconnected. It is simply a sign that a role assignment used to be here, of a service principal that no longer exists. </br></br>This is standard behavior and not specific to Azure Storage Mover. You can observe the same behavior if you remove a different service principal from AAD and then check a former role assignment.

> [!WARNING]
> During public preview, unregistration of an offline agent is supported but the Azure ARC resource for the agent is not automatically deleted. You must manually delete the resource after unregistering an offline agent. The lifecycle of the agent's managed identity is tied to this resource. Removing it removes the managed identity and service principal, as previously described.

You can check that the uregistration process is complete when the agent disappears in the Azure portal or Az PowerShell/CLI and the hybrid compute resource of type *Server - Azure Arc* is also gone from the resource group.

You can also use the agent's administrative shell to check that the agent is unregistered. Simply navigate to a sub-menu and back to the top menu. You should see the menu option toggle from "Unregister" to Register. During public preview, do not re-register!

You can then stop the agent VM on your virtualization host. It's best to delete the agent VM image. It was previously registered, retains some state and must not be used again. If you need a new agent, deploy a new VM with a new agent image that had never been registered before.

## Next steps

After you've deployed your agent VM, started it, and changed the default password of the local account:
> [!div class="nextstepaction"]
> [Register the agent with your storage mover Azure resource](agent-register.md)
