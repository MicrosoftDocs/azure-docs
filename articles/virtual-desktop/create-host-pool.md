---
title: Create a host pool - Azure Virtual Desktop
description: Learn how to create a host pool in Azure Virtual Desktop by using the Azure portal, Azure CLI, or Azure PowerShell.
ms.topic: how-to
ms.custom: references_regions, devx-track-azurecli, devx-track-azurepowershell
author: dknappettmsft
ms.author: daknappe
ms.date: 07/11/2023
---

# Create a host pool in Azure Virtual Desktop

This article shows you how to create a host pool by using the Azure portal, Azure CLI, or Azure PowerShell. When using the Azure portal, you can optionally create session hosts, a workspace, register the default desktop application group from this host pool, and enable diagnostics settings in the same process, but you can also do this separately.

For more information on the terminology used in this article, see [Azure Virtual Desktop terminology](environment-setup.md).

You can create host pools in the following Azure regions:

:::row:::
    :::column:::
       - Australia East
       - Canada Central
       - Canada East
       - Central India
       - Central US
       - East US
       - East US 2
       - Japan East
       - North Central US
    :::column-end:::
    :::column:::
       - North Europe
       - South Central US
       - UK South
       - UK West
       - West Central US
       - West Europe
       - West US
       - West US 2
       - West US 3
    :::column-end:::
:::row-end:::

This list refers to the list of regions where the *metadata* for the host pool will be stored. Session hosts added to a host pool can be located in any Azure region, and on-premises when using [Azure Virtual Desktop on Azure Stack HCI](azure-stack-hci-overview.md).

## Prerequisites

Review the [Prerequisites for Azure Virtual Desktop](prerequisites.md) for a general idea of what's required, such as operating systems, virtual networks, and identity providers. Select the relevant tab for your scenario.

# [Portal](#tab/portal)

In addition, you'll need:

- The Azure account you use must have the following built-in role-based access control (RBAC) roles as a minimum on a resource group or subscription to create the following resource types. If you want to assign the roles to a resource group, you'll need to create this first.

   | Resource type | RBAC role(s) |
   |--|--|
   | Host pool | [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor)<br />[Desktop Virtualization Application Group Contributor](rbac.md#desktop-virtualization-application-group-contributor) |
   | Workspace | [Desktop Virtualization Workspace Contributor](rbac.md#desktop-virtualization-workspace-contributor) |
   | Application group | [Desktop Virtualization Application Group Contributor](rbac.md#desktop-virtualization-application-group-contributor) |
   | Session hosts | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |

   Alternatively you can assign the [Contributor](../role-based-access-control/built-in-roles.md#contributor) RBAC role to create all of these resource types.

- Don't disable [Windows Remote Management](/windows/win32/winrm/about-windows-remote-management) (WinRM) when creating session hosts using the Azure portal, as it's required by [PowerShell DSC](/powershell/dsc/overview).

# [Azure PowerShell](#tab/powershell)

In addition, you'll need:

- The account must have the following built-in role-based access control (RBAC) roles as a minimum on a resource group or subscription to create the following resource types. If you want to assign the roles to a resource group, you'll need to create this first.

   | Resource type | RBAC role |
   |--|--|
   | Host pool | [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor) |
   | Workspace | [Desktop Virtualization Workspace Contributor](rbac.md#desktop-virtualization-workspace-contributor) |
   | Application group | [Desktop Virtualization Application Group Contributor](rbac.md#desktop-virtualization-application-group-contributor) |
   | Session hosts | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |

   Alternatively you can assign the [Contributor](../role-based-access-control/built-in-roles.md#contributor) RBAC role to create all of these resource types.

- If you want to use Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

> [!IMPORTANT]
> If you want to create Azure Active Directory-joined session hosts, we only support this using the Azure portal with the Azure Virtual Desktop service.

# [Azure CLI](#tab/cli)

In addition, you'll need:

- The account must have the following built-in role-based access control (RBAC) roles as a minimum on a resource group or subscription to create the following resource types. If you want to assign the roles to a resource group, you'll need to create this first.

   | Resource type | RBAC role |
   |--|--|
   | Host pool | [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor) |
   | Workspace | [Desktop Virtualization Workspace Contributor](rbac.md#desktop-virtualization-workspace-contributor) |
   | Application group | [Desktop Virtualization Application Group Contributor](rbac.md#desktop-virtualization-application-group-contributor) |
   | Session hosts | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |

   Alternatively you can assign the [Contributor](../role-based-access-control/built-in-roles.md#contributor) RBAC role to create all of these resource types.

- If you want to use Azure CLI locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

> [!IMPORTANT]
> If you want to create Azure Active Directory-joined session hosts, we only support this using the Azure portal with the Azure Virtual Desktop service.

---

## Create a host pool

To create a host pool, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to create a host pool using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select **Create**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | Select the subscription you want to create the host pool in from the drop-down list. |
   | Resource group | Select an existing resource group or select **Create new** and enter a name. |
   | Host pool name | Enter a name for the host pool, for example *hostpool01*. |
   | Location | Select the Azure region where your host pool will be deployed. |
   | Validation environment | Select **Yes** to create a host pool that is used as a [validation environment](create-validation-host-pool.md).<br /><br />Select **No** (*default*) to create a host pool that isn't used as a validation environment. |
   | Preferred app group type | Select the preferred [application group type](environment-setup.md#app-groups) for this host pool from *Desktop* or *RemoteApp*. |   
   | Host pool type | Select whether your host pool will be Personal or Pooled.<br /><br />If you select **Personal**, a new option will appear for **Assignment type**. Select either **Automatic** or **Direct**.<br /><br />If you select **Pooled**, two new options will appear for **Load balancing algorithm** and **Max session limit**.<br /><br />- For **Load balancing algorithm**, choose either **breadth-first** or **depth-first**, based on your usage pattern.<br /><br />- For **Max session limit**, enter the maximum number of users you want load-balanced to a single session host. |

   > [!TIP]
   > Once you've completed this tab, you can continue to optionally configure networking, create session hosts, a workspace, register the default desktop application group from this host pool, and enable diagnostics settings. Alternatively, if you want to create and configure these separately, select **Next: Review + create** and go to step 10.

1. *Optional*: On the **Networking** tab, select how end users and session hosts will connect to the Azure Virtual Desktop service. You also need to configure Azure Private Link to use private access. For more information, see [Azure Private Link with Azure Virtual Desktop](private-link-overview.md).

   | Parameter | Value/Description |
   |--|--|
   | **Enable public access from all networks** | End users can access the feed and session hosts securely over the public internet or the private endpoints. |
   | **Enable public access for end users, use private access for session hosts** | End users can access the feed securely over the public internet but must use private endpoints to access session hosts. |
   | **Disable public access and use private access** | End users can only access the feed and session hosts over the private endpoints. |

   Once you've completed this tab, select **Next: Virtual Machines**.

1. *Optional*: If you want to add session hosts in this process, on the **Virtual machines** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Add Azure virtual machines | Select **Yes**. This shows several new options. |
   | Resource group | This automatically defaults to the resource group you chose your host pool to be in on the *Basics* tab, but you can also select an alternative. |
   | Name prefix | Enter a name for your session hosts, for example **aad-hp01-sh**.<br /><br />This will be used as the prefix for your session host VMs. Each session host has a suffix of a hyphen and then a sequential number added to the end, for example **aad-hp01-sh-0**.<br /><br />This name prefix can be a maximum of 11 characters and is used in the computer name in the operating system. The prefix and the suffix combined can be a maximum of 15 characters. Session host names must be unique. |
   | Virtual machine location | Select the Azure region where your session host VMs will be deployed. This must be the same region that your virtual network is in. |
   | Availability options | Select from **[availability zones](../reliability/availability-zones-overview.md)**, **[availability set](../virtual-machines/availability-set-overview.md)**, or **No infrastructure dependency required**. If you select availability zones or availability set, complete the extra parameters that appear.  |
   | Security type | Select from **Standard**, **[Trusted launch virtual machines](../virtual-machines/trusted-launch.md)**, or **[Confidential virtual machines](../confidential-computing/confidential-vm-overview.md)**.<br /><br />- If you select **Trusted launch virtual machines**, options for **secure boot** and **vTPM** are automatically selected.<br /><br />- If you select **Confidential virtual machines**, options for **secure boot**, **vTPM**, and **integrity monitoring** are automatically selected. You can't opt out of vTPM when using a confidential VM. |
   | Image | Select the OS image you want to use from the list, or select **See all images** to see more, including any images you've created and stored as an [Azure Compute Gallery shared image](../virtual-machines/shared-image-galleries.md) or a [managed image](../virtual-machines/windows/capture-image-resource.md). |
   | Virtual machine size | Select a SKU. If you want to use different SKU, select **Change size**, then select from the list. |
   | Number of VMs | Enter the number of virtual machines you want to deploy. You can deploy up to 400 session host VMs at this point if you wish (depending on your [subscription quota](../quotas/view-quotas.md)), or you can add more later.<br /><br />For more information, see [Azure Virtual Desktop service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-virtual-desktop-service-limits) and [Virtual Machines limits](../azure-resource-manager/management/azure-subscription-service-limits.md#virtual-machines-limits---azure-resource-manager). |
   | OS disk type | Select the disk type to use for your session hosts. We recommend only **Premium SSD** is used for production workloads. |
   | Confidential computing encryption | If you're using a confidential VM, you must select the **Confidential compute encryption** check box to enable OS disk encryption.<br /><br />This check box only appears if you selected **Confidential virtual machines** as your security type. |
   | Boot Diagnostics | Select whether you want to enable [boot diagnostics](../virtual-machines/boot-diagnostics.md). |
   | **Network and security** |  |
   | Virtual network | Select your virtual network. An option to select a subnet will appear. |
   | Subnet | Select a subnet from your virtual network. |
   | Network security group | Select whether you want to use a network security group (NSG).<br /><br />- **None** won't create a new NSG.<br /><br />- **Basic** will create a new NSG for the VM NIC.<br /><br />- **Advanced** enables you to select an existing NSG.<br /><br />We recommend that you don't create an NSG here, but [create an NSG on the subnet instead](../virtual-network/manage-network-security-group.md). |
   | Public inbound ports | You can select a port to allow from the list. Azure Virtual Desktop doesn't require public inbound ports, so we recommend you select **No**. |
   | **Domain to join** |  |
   | Select which directory you would like to join | Select from **Azure Active Directory** or **Active Directory** and complete the relevant parameters for the option you select.  |
   | **Virtual Machine Administrator account** |  |
   | Username | Enter a name to use as the local administrator account for the new session host VMs. |
   | Password | Enter a password for the local administrator account. |
   | Confirm password | Re-enter the password. |
   | **Custom configuration** |  |
   | ARM template file URL | If you want to use an extra ARM template during deployment you can enter the URL here. |
   | ARM template parameter file URL | Enter the URL to the parameters file for the ARM template. |

   Once you've completed this tab, select **Next: Workspace**.

1. *Optional*: If you want to create a workspace and register the default desktop application group from this host pool in this process, on the **Workspace** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Register desktop app group | Select **Yes**. This registers the default desktop application group to the selected workspace. |
   | To this workspace | Select an existing workspace from the list, or select **Create new** and enter a name, for example **aad-ws01**. |

   Once you've completed this tab, select **Next: Advanced**.

1. *Optional*: If you want to enable diagnostics settings in this process, on the **Advanced** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Enable diagnostics settings | Check the box. |
   | Choosing destination details to send logs to | Select one of the following:<br /><br />- Send to Log Analytics workspace<br /><br />- Archive to storage account<br /><br />- Stream to an event hub |

   Once you've completed this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any name/value pairs you need, then select **Next: Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that will be used during deployment.

1. Select **Create** to create the host pool.

1. Once the host pool has been created, select **Go to resource** to go to the overview of your new host pool, then select **Properties** to view its properties.

## Optional: Post deployment

If you also added session hosts to your host pool, there's some extra configuration you may need to do, which is covered in the following sections.

[!INCLUDE [include-session-hosts-post-deployment](includes/include-session-hosts-post-deployment.md)]

# [Azure PowerShell](#tab/powershell)

Here's how to create a host pool using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module. The following examples show you how to create a pooled host pool and a personal host pool.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]
2. Use the `New-AzWvdHostPool` cmdlet with the following examples to create a host pool. More parameters are available; for more information, see the [New-AzWvdHostPool PowerShell reference](/powershell/module/az.desktopvirtualization/new-azwvdhostpool).

   1. To create a pooled host pool using the *breadth-first* [load-balancing algorithm](host-pool-load-balancing.md) and *Desktop* as the preferred [app group type](environment-setup.md#app-groups), run the following command:
   
      ```azurepowershell
      $parameters = @{
          Name = '<Name>'
          ResourceGroupName = '<ResourceGroupName>'
          HostPoolType = 'Pooled'
          LoadBalancerType = 'BreadthFirst'
          PreferredAppGroupType = 'Desktop'
          MaxSessionLimit = '<value>'
          Location = '<AzureRegion>'
      }
      
      New-AzWvdHostPool @parameters
      ```

   1. To create a personal host pool using the *Automatic* assignment type and *Desktop* as the preferred [app group type](environment-setup.md#app-groups), run the following command:
   
      ```azurepowershell
      $parameters = @{
          Name = '<Name>'
          ResourceGroupName = '<ResourceGroupName>'
          HostPoolType = 'Personal'
          LoadBalancerType = 'Persistent'
          PreferredAppGroupType = 'Desktop'
          PersonalDesktopAssignmentType = 'Automatic'
          Location = '<AzureRegion>'
      }
      
      New-AzWvdHostPool @parameters
      ```

3. You can view the properties of your new host pool by running the following command:

   ```azurepowershell
   Get-AzWvdHostPool -Name <Name> -ResourceGroupName <ResourceGroupName> | FL *
   ```

# [Azure CLI](#tab/cli)

Here's how to create a host pool using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for Azure CLI. The following examples show you how to create a pooled host pool and a personal host pool.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]
2. Use the `az desktopvirtualization hostpool create` command with the following examples to create a host pool. More parameters are available; for more information, see the [az desktopvirtualization hostpool Azure CLI reference](/cli/azure/desktopvirtualization/hostpool).

   1. To create a pooled host pool using the *breadth-first* [load-balancing algorithm](host-pool-load-balancing.md) and *Desktop* as the preferred [app group type](environment-setup.md#app-groups), run the following command:
   
      ```azurecli
      az desktopvirtualization hostpool create \
          --name <Name> \
          --resource-group <ResourceGroupName> \
          --host-pool-type Pooled \
          --load-balancer-type BreadthFirst \
          --preferred-app-group-type Desktop \
          --max-session-limit <value> \
          --location <AzureRegion>
      ```

   1. To create a personal host pool using the *Automatic* assignment type, run the following command:
   
      ```azurecli
      az desktopvirtualization hostpool create \
          --name <Name> \
          --resource-group <ResourceGroupName> \
          --host-pool-type Personal \
          --load-balancer-type Persistent \
          --preferred-app-group-type Desktop \
          --personal-desktop-assignment-type Automatic \
          --location <AzureRegion>
      ```

3. You can view the properties of your new host pool by running the following command:

   ```azurecli
   az desktopvirtualization hostpool show --name <Name> --resource-group <ResourceGroupName>
   ```

---

## Next steps

# [Portal](#tab/portal)

If you didn't complete the optional sections when creating a host pool, you'll still need to do the following tasks separately:

- [Create an application group and a workspace, then add the application group to a workspace and assign users](create-application-group-workspace.md).

- [Add session hosts to a host pool](add-session-hosts-host-pool.md).

- [Enable diagnostics settings](diagnostics-log-analytics.md).

 
# [Azure PowerShell](#tab/powershell)

Now that you've created a host pool, you'll still need to do the following tasks:

- [Create an application group and a workspace, then add the application group to a workspace and assign users](create-application-group-workspace.md).

- [Add session hosts to a host pool](add-session-hosts-host-pool.md).

- [Enable diagnostics settings](diagnostics-log-analytics.md).

# [Azure CLI](#tab/cli)

Now that you've created a host pool, you'll still need to do the following tasks:

- [Create an application group and a workspace, then add the application group to a workspace and assign users](create-application-group-workspace.md).

- [Add session hosts to a host pool](add-session-hosts-host-pool.md).

- [Enable diagnostics settings](diagnostics-log-analytics.md).
