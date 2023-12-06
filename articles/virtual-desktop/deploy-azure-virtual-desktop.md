---
title: Deploy Azure Virtual Desktop - Azure Virtual Desktop
description: Learn how to deploy Azure Virtual Desktop by creating a host pool, workspace, application group, session hosts, and assign users.
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
author: dknappettmsft
ms.author: daknappe
ms.date: 11/16/2023
---

# Deploy Azure Virtual Desktop

> [!IMPORTANT]
> Using Azure Stack HCI with Azure Virtual Desktop is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article shows you how to deploy Azure Virtual Desktop on Azure or Azure Stack HCI by using the Azure portal, Azure CLI, or Azure PowerShell. You create a host pool, workspace, application group, and session hosts and can optionally enable diagnostics settings. You also assign users or groups to the application group for users to get access to their desktops and applications. You can do all these tasks in the same process when using the Azure portal, but you can also do them separately.

The process covered in this article is an in-depth and adaptable approach to deploying Azure Virtual Desktop. If you want a more simple approach to deploy a sample Windows 11 desktop in Azure Virtual Desktop, see [Tutorial: Deploy a sample Azure Virtual Desktop infrastructure with a Windows 11 desktop](tutorial-try-deploy-windows-11-desktop.md) or use the [getting started feature](getting-started-feature.md).

For more information on the terminology used in this article, see [Azure Virtual Desktop terminology](environment-setup.md), and to learn about the service architecture and resilience of the Azure Virtual Desktop service, see [Azure Virtual Desktop service architecture and resilience](service-architecture-resilience.md).

## Prerequisites

Review the [Prerequisites for Azure Virtual Desktop](prerequisites.md) for a general idea of what's required and supported, such as operating systems (OS), virtual networks, and identity providers. It also includes a list of the [supported Azure regions](prerequisites.md#azure-regions) in which you can deploy host pools, workspaces, and application groups. This list of regions is where the *metadata* for the host pool can be stored. However, session hosts can be located in any Azure region, and on-premises with [Azure Stack HCI (preview)](azure-stack-hci-overview.md). For more information about the types of data and locations, see [Data locations for Azure Virtual Desktop](data-locations.md).

Select the relevant tab for your scenario for more prerequisites.

# [Portal](#tab/portal)

In addition, you need:

- The Azure account you use must be assigned the following built-in role-based access control (RBAC) roles as a minimum on a resource group or subscription to create the following resource types. If you want to assign the roles to a resource group, you need to create this first.

   | Resource type | RBAC role |
   |--|--|
   | Host pool, workspace, and application group | [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) |
   | Session hosts (Azure) | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |
   | Session hosts (Azure Stack HCI) | [Azure Stack HCI VM Contributor](/azure-stack/hci/manage/assign-vm-rbac-roles) |

   Alternatively you can assign the [Contributor](../role-based-access-control/built-in-roles.md#contributor) RBAC role to create all of these resource types.

   For ongoing management of host pools, workspaces, and application groups, you can use more granular roles for each resource type. For more information, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).

- Don't disable [Windows Remote Management](/windows/win32/winrm/about-windows-remote-management) (WinRM) when creating session hosts using the Azure portal, as [PowerShell DSC](/powershell/dsc/overview) requires it.

- To add session hosts on Azure Stack HCI, you'll also need:

   - An [Azure Stack HCI cluster registered with Azure](/azure-stack/hci/deploy/register-with-azure). Your Azure Stack HCI clusters need to be running a minimum of version 23H2. For more information, see [Azure Stack HCI, version 23H2 deployment overview](/azure-stack/hci/deploy/deployment-introduction). [Azure Arc virtual machine (VM) management](/azure-stack/hci/manage/azure-arc-vm-management-overview) is installed automatically.
   
   - A stable connection to Azure from your on-premises network.

   - At least one Windows OS image available on the cluster. For more information, see how to [create VM images using Azure Marketplace images](/azure-stack/hci/manage/virtual-machine-image-azure-marketplace), [use images in Azure Storage account](/azure-stack/hci/manage/virtual-machine-image-storage-account), and [use images in local share](/azure-stack/hci/manage/virtual-machine-image-local-share).

# [Azure PowerShell](#tab/powershell)

In addition, you need:

- The Azure account you use must be assigned the following built-in role-based access control (RBAC) roles as a minimum on a resource group or subscription to create the following resource types. If you want to assign the roles to a resource group, you need to create this first.

   | Resource type | RBAC role |
   |--|--|
   | Host pool, workspace, and application group | [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) |
   | Session hosts | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |

   Alternatively you can assign the [Contributor](../role-based-access-control/built-in-roles.md#contributor) RBAC role to create all of these resource types.

   For ongoing management of host pools, workspaces, and application groups, you can use more granular roles for each resource type. For more information, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).

- If you want to use Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

> [!IMPORTANT]
> If you want to create Microsoft Entra joined session hosts, we only support this using the Azure portal.

# [Azure CLI](#tab/cli)

In addition, you need:

- The Azure account you use must be assigned the following built-in role-based access control (RBAC) roles as a minimum on a resource group or subscription to create the following resource types. If you want to assign the roles to a resource group, you need to create this first.

   | Resource type | RBAC role |
   |--|--|
   | Host pool, workspace, and application group | [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) |
   | Session hosts | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |

   Alternatively you can assign the [Contributor](../role-based-access-control/built-in-roles.md#contributor) RBAC role to create all of these resource types.

   For ongoing management of host pools, workspaces, and application groups, you can use more granular roles for each resource type. For more information, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).

- If you want to use Azure CLI locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

> [!IMPORTANT]
> If you want to create Microsoft Entra joined session hosts, we only support this using the Azure portal.

---

## Create a host pool

To create a host pool, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to create a host pool using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, enter *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select **Create**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | Select the subscription you want to create the host pool in from the drop-down list. |
   | Resource group | Select an existing resource group or select **Create new** and enter a name. |
   | Host pool name | Enter a name for the host pool, for example **hp01**. |
   | Location | Select the Azure region where you want to create your host pool. |
   | Validation environment | Select **Yes** to create a host pool that is used as a [validation environment](create-validation-host-pool.md).<br /><br />Select **No** (*default*) to create a host pool that isn't used as a validation environment. |
   | Preferred app group type | Select the preferred [application group type](environment-setup.md#app-groups) for this host pool from *Desktop* or *RemoteApp*. |   
   | Host pool type | Select whether you want your host pool to be Personal or Pooled.<br /><br />If you select **Personal**, a new option appears for **Assignment type**. Select either **Automatic** or **Direct**.<br /><br />If you select **Pooled**, two new options appear for **Load balancing algorithm** and **Max session limit**.<br /><br />- For **Load balancing algorithm**, choose either **breadth-first** or **depth-first**, based on your usage pattern.<br /><br />- For **Max session limit**, enter the maximum number of users you want load-balanced to a single session host. |

   > [!TIP]
   > Once you've completed this tab, you can continue to optionally create session hosts, a workspace, register the default desktop application group from this host pool, and enable diagnostics settings by selecting **Next: Virtual Machines**. Alternatively, if you want to create and configure these separately, select **Next: Review + create** and go to step 9.

1. *Optional*: On the **Virtual machines** tab, if you want to add session hosts, complete the following information, depending on if you want to create session hosts on Azure or Azure Stack HCI:

   1. To add session hosts on Azure:

      | Parameter | Value/Description |
      |--|--|
      | Add virtual machines | Select **Yes**. This shows several new options. |
      | Resource group | This automatically defaults to the same resource group you chose your host pool to be in on the *Basics* tab, but you can also select an alternative. |
      | Name prefix | Enter a name for your session hosts, for example **hp01-sh**.<br /><br />This value is used as the prefix for your session hosts. Each session host has a suffix of a hyphen and then a sequential number added to the end, for example **hp01-sh-0**.<br /><br />This name prefix can be a maximum of 11 characters and is used in the computer name in the operating system. The prefix and the suffix combined can be a maximum of 15 characters. Session host names must be unique. |
      | Virtual machine type | Select **Azure virtual machine**. |
      | Virtual machine location | Select the Azure region where you want to deploy your session hosts. This must be the same region that your virtual network is in. |
      | Availability options | Select from **[availability zones](../reliability/availability-zones-overview.md)**, **[availability set](../virtual-machines/availability-set-overview.md)**, or **No infrastructure dependency required**. If you select availability zones or availability set, complete the extra parameters that appear.  |
      | Security type | Select from **Standard**, **[Trusted launch virtual machines](../virtual-machines/trusted-launch.md)**, or **[Confidential virtual machines](../confidential-computing/confidential-vm-overview.md)**.<br /><br />- If you select **Trusted launch virtual machines**, options for **secure boot** and **vTPM** are automatically selected.<br /><br />- If you select **Confidential virtual machines**, options for **secure boot**, **vTPM**, and **integrity monitoring** are automatically selected. You can't opt out of vTPM when using a confidential VM. |
      | Image | Select the OS image you want to use from the list, or select **See all images** to see more, including any images you've created and stored as an [Azure Compute Gallery shared image](../virtual-machines/shared-image-galleries.md) or a [managed image](../virtual-machines/windows/capture-image-resource.md). |
      | Virtual machine size | Select a SKU. If you want to use different SKU, select **Change size**, then select from the list. |
      | Hibernate (preview) | Check the box to enable hibernate. Hibernate is only available for personal host pools. You will need to [self-register your subscription](../virtual-machines/hibernate-resume.md) to use the hibernation feature. For more information, see [Hibernation in virtual machines](/azure/virtual-machines/hibernate-resume). <br /><br />Note: We recommend users using Teams media optimizations to upgrade their host pools to WebRTC redirector service 1.45.2310.13001, learn more [here](whats-new-webrtc.md).|   
      | Number of VMs | Enter the number of virtual machines you want to deploy. You can deploy up to 400 session hosts at this point if you wish (depending on your [subscription quota](../quotas/view-quotas.md)), or you can add more later.<br /><br />For more information, see [Azure Virtual Desktop service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-virtual-desktop-service-limits) and [Virtual Machines limits](../azure-resource-manager/management/azure-subscription-service-limits.md#virtual-machines-limits---azure-resource-manager). |
      | OS disk type | Select the disk type to use for your session hosts. We recommend only **Premium SSD** is used for production workloads. |
      | OS disk size | If you have hibernate enabled, the OS disk size needs to be larger than the amount of memory for the VM. Check the box if you need this for your session hosts. |
      | Confidential computing encryption | If you're using a confidential VM, you must select the **Confidential compute encryption** check box to enable OS disk encryption.<br /><br />This check box only appears if you selected **Confidential virtual machines** as your security type. |
      | Boot Diagnostics | Select whether you want to enable [boot diagnostics](../virtual-machines/boot-diagnostics.md). |
      | **Network and security** |  |
      | Virtual network | Select your virtual network. An option to select a subnet appears. |
      | Subnet | Select a subnet from your virtual network. |
      | Network security group | Select whether you want to use a network security group (NSG).<br /><br />- **None** doesn't create a new NSG.<br /><br />- **Basic** creates a new NSG for the VM NIC.<br /><br />- **Advanced** enables you to select an existing NSG.<br /><br />We recommend that you don't create an NSG here, but [create an NSG on the subnet instead](../virtual-network/manage-network-security-group.md). |
      | Public inbound ports | You can select a port to allow from the list. Azure Virtual Desktop doesn't require public inbound ports, so we recommend you select **No**. |
      | **Domain to join** |  |
      | Select which directory you would like to join | Select from **Microsoft Entra ID** or **Active Directory** and complete the relevant parameters for the option you select.  |
      | **Virtual Machine Administrator account** |  |
      | Username | Enter a name to use as the local administrator account for the new session hosts. |
      | Password | Enter a password for the local administrator account. |
      | Confirm password | Reenter the password. |
      | **Custom configuration** |  |
      | Custom configuration script URL | If you want to run a PowerShell script during deployment you can enter the URL here. |

   1. To add session hosts on Azure Stack HCI:

      | Parameter | Value/Description |
      |--|--|
      | Add virtual machines | Select **Yes**. This shows several new options. |
      | Resource group | This automatically defaults to the resource group you chose your host pool to be in on the *Basics* tab, but you can also select an alternative. |
      | Name prefix | Enter a name for your session hosts, for example **hp01-sh**.<br /><br />This value is used as the prefix for your session hosts. Each session host has a suffix of a hyphen and then a sequential number added to the end, for example **hp01-sh-0**.<br /><br />This name prefix can be a maximum of 11 characters and is used in the computer name in the operating system. The prefix and the suffix combined can be a maximum of 15 characters. Session host names must be unique. |
      | Virtual machine type | Select **Azure Stack HCI virtual machine (Preview)**. |
      | Custom location | Select the Azure Stack HCI cluster where you want to deploy your session hosts from the drop-down list. |
      | Images | Select the OS image you want to use from the list, or select **Manage VM images** to manage the images available on the cluster you selected. |
      | Number of VMs | Enter the number of virtual machines you want to deploy. You can add more later. |
      | Virtual processor count | Enter the number of virtual processors you want to assign to each session host. This value isn't validated against the resources available in the cluster. |
      | Memory type | Select **Static** for a fixed memory allocation, or **Dynamic** for a dynamic memory allocation. |
      | Memory (GB) | Enter a number for the amount of memory in GB you want to assign to each session host. This value isn't validated against the resources available in the cluster. |
      | Maximum memory | If you selected dynamic memory allocation, enter a number for the maximum amount of memory in GB you want your session host to be able to use. |
      | Minimum memory | If you selected dynamic memory allocation, enter a number for the minimum amount of memory in GB you want your session host to be able to use. |
      | **Network and security** |  |
      | Network dropdown | Select an existing network to connect each session to. |
      | **Domain to join** |  |
      | Select which directory you would like to join | **Active Directory** is the only available option. |
      | AD domain join UPN | Enter the User Principal Name (UPN) of an Active Directory user that has permission to join the session hosts to your domain. |
      | Password | Enter the password for the Active Directory user. |
      | Specify domain or unit | Select yes if you want to join session hosts to a specific domain or be placed in a specific organization unit (OU). If you select no, the suffix of the UPN will be used as the domain. |
      | **Virtual Machine Administrator account** |  |
      | Username | Enter a name to use as the local administrator account for the new session hosts. |
      | Password | Enter a password for the local administrator account. |
      | Confirm password | Reenter the password. |

   Once you've completed this tab, select **Next: Workspace**.

1. *Optional*: On the **Workspace** tab, if you want to create a workspace and register the default desktop application group from this host pool, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Register desktop app group | Select **Yes**. This registers the default desktop application group to the selected workspace. |
   | To this workspace | Select an existing workspace from the list, or select **Create new** and enter a name, for example **ws01**. |

   Once you've completed this tab, select **Next: Advanced**.

1. *Optional*: On the **Advanced** tab, if you want to enable diagnostics settings, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Enable diagnostics settings | Check the box. |
   | Choosing destination details to send logs to | Select one of the following destinations:<br /><br />- Send to Log Analytics workspace<br /><br />- Archive to storage account<br /><br />- Stream to an event hub |

   Once you've completed this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any name/value pairs you need, then select **Next: Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that is during deployment.

1. Select **Create** to create the host pool.

1. Once the host pool has been created, select **Go to resource** to go to the overview of your new host pool, then select **Properties** to view its properties.

### Optional: Post deployment

If you also added session hosts to your host pool, there's some extra configuration you might need to do, which is covered in the following sections.

[!INCLUDE [include-session-hosts-post-deployment](includes/include-session-hosts-post-deployment.md)]

> [!NOTE]
> - If you created a host pool, workspace, and registered the default desktop application group from this host pool in the same process, go to the section [Assign users to an application group](#assign-users-to-an-application-group) and complete the rest of the article.
>
> - If you created a host pool and workspace in the same process, but didn't register the default desktop application group from this host pool, go to the section [Create an application group](#create-an-application-group) and complete the rest of the article.
>
> - If you didn't create a workspace, continue to the next section and complete the rest of the article.

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

## Create a workspace

Next, to create a workspace, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to create a workspace using the Azure portal.

1. From the Azure Virtual Desktop overview, select **Workspaces**, then select **Create**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | Select the subscription you want to create the workspace in from the drop-down list. |
   | Resource group | Select an existing resource group or select **Create new** and enter a name. |
   | Workspace name | Enter a name for the workspace, for example *workspace01*. |
   | Friendly name | *Optional*: Enter a friendly name for the workspace. |
   | Description | *Optional*: Enter a description for the workspace. |
   | Location | Select the Azure region where you want to deploy your workspace. |

   > [!TIP]
   > Once you've completed this tab, you can continue to optionally register an existing application group to this workspace, if you have one, and enable diagnostics settings by selecting **Next: Application groups**. Alternatively, if you want to create and configure these separately, select **Review + create** and go to step 9.

1. *Optional*: On the **Application groups** tab, if you want to register an existing application group to this workspace, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Register application groups | Select **Yes**, then select **+ Register application groups**. In the new pane that opens, select the **Add** icon for the application group(s) you want to add, then select **Select**. |

   Once you've completed this tab, select **Next: Advanced**.

1. *Optional*: On the **Advanced** tab, if you want to enable diagnostics settings, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Enable diagnostics settings | Check the box. |
   | Choosing destination details to send logs to | Select one of the following destinations:<br /><br />- Send to Log Analytics workspace<br /><br />- Archive to storage account<br /><br />- Stream to an event hub |

   Once you've completed this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any name/value pairs you need, then select **Next: Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that is used during deployment.

1. Select **Create** to create the workspace.

1. Once the workspace has been created, select **Go to resource** to go to the overview of your new workspace, then select **Properties** to view its properties.

> [!NOTE]
> - If you added an application group to this workspace, go to the section [Assign users to an application group](#assign-users-to-an-application-group) and complete the rest of the article.
>
> - If you didn't add an application group to this workspace, continue to the next section and complete the rest of the article.

# [Azure PowerShell](#tab/powershell)

Here's how to create a workspace using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module.

1. In the same PowerShell session, use the `New-AzWvdWorkspace` cmdlet with the following example to create a workspace. More parameters are available, such as to register existing application groups. For more information, see the [New-AzWvdWorkspace PowerShell reference](/powershell/module/az.desktopvirtualization/new-azwvdworkspace).

   ```azurepowershell
   New-AzWvdWorkspace -Name <Name> -ResourceGroupName <ResourceGroupName>
   ```

1. You can view the properties of your new workspace by running the following command:

   ```azurepowershell
   Get-AzWvdWorkspace -Name <Name> -ResourceGroupName <ResourceGroupName> | FL *
   ```

# [Azure CLI](#tab/cli)

Here's how to create a workspace using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for Azure CLI.

1. In the same CLI session, use the `az desktopvirtualization workspace create` command with the following example to create a workspace. More parameters are available, such as to register existing application groups. For more information, see the [az desktopvirtualization workspace Azure CLI reference](/cli/azure/desktopvirtualization/workspace).

   ```azurecli
   az desktopvirtualization workspace create --name <Name> --resource-group <ResourceGroupName>
   ```

1. You can view the properties of your new workspace by running the following command:

   ```azurecli
   az desktopvirtualization workspace show --name <Name> --resource-group <ResourceGroupName>
   ```

---

## Create an application group

To create an application group, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to create an application group using the Azure portal.

1. From the Azure Virtual Desktop overview, select **Application groups**, then select **Create**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | Select the subscription you want to create the application group in from the drop-down list. |
   | Resource group | Select an existing resource group or select **Create new** and enter a name. |
   | Host pool | Select the host pool for the application group. |
   | Location | Metadata is stored in the same location as the host pool. |
   | Application group type | Select the [application group type](environment-setup.md#app-groups) for the host pool you selected from *Desktop* or *RemoteApp*. |
   | Application group name | Enter a name for the application group, for example *Session Desktop*. |

   > [!TIP]
   > Once you've completed this tab, select **Next: Review + create**. You don't need to complete the other tabs to create an application group, but you'll need to [create a workspace](#create-a-workspace), [add an application group to a workspace](#add-an-application-group-to-a-workspace) and [assign users to the application group](#assign-users-to-an-application-group) before users can access the resources.
   >
   > If you created an application group for RemoteApp, you will also need to add applications. For more information, see [Add applications to an application group](manage-app-groups.md)

1. *Optional*: If you selected to create a RemoteApp application group, you can add applications to this application group. On the **Application groups** tab, select **+ Add applications**, then select an application. For more information on the application parameters, see [Publish applications with RemoteApp](manage-app-groups.md). At least one session host in the host pool must be powered on and available in Azure Virtual Desktop.

   Once you've completed this tab, or if you're creating a desktop application group, select **Next: Assignments**.

1. *Optional*: On the **Assignments** tab, if you want to assign users or groups to this application group, select **+ Add Microsoft Entra users or user groups**. In the new pane that opens, check the box next to the users or groups you want to add, then select **Select**.

   Once you've completed this tab, select **Next: Workspace**.

1. *Optional*: On the **Workspace** tab, if you're creating a desktop application group, you can register the default desktop application group from the host pool you selected by completing the following information:

   | Parameter | Value/Description |
   |--|--|
   | Register application group | Select **Yes**. This registers the default desktop application group to the selected workspace. |
   | Register application group | Select an existing workspace from the list. |

   Once you've completed this tab, select **Next: Advanced**.

1. *Optional*: If you want to enable diagnostics settings, on the **Advanced** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Enable diagnostics settings | Check the box. |
   | Choosing destination details to send logs to | Select one of the following destinations:<br /><br />- Send to Log Analytics workspace<br /><br />- Archive to storage account<br /><br />- Stream to an event hub |

   Once you've completed this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any name/value pairs you need, then select **Next: Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that is used during deployment.

1. Select **Create** to create the application group.

1. Once the application group has been created, select **Go to resource** to go to the overview of your new application group, then select **Properties** to view its properties.

> [!NOTE]
> - If you created a desktop application group, assigned users or groups, and registered the default desktop application group to a workspace, your assigned users can connect to the desktop and you don't need to complete the rest of the article.
>
> - If you created a RemoteApp application group, added applications, and assigned users or groups, go to the section [Add an application group to a workspace](#add-an-application-group-to-a-workspace) and complete the rest of the article.
>
> - If you didn't add applications, assign users or groups, or register the application group to a workspace continue to the next section and complete the rest of the article.

# [Azure PowerShell](#tab/powershell)

Here's how to create an application group using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module.

1. In the same PowerShell session, get the resource ID of the host pool you want to create an application group for and store it in a variable by running the following command:

   ```azurepowershell
   $hostPoolArmPath = (Get-AzWvdHostPool -Name <HostPoolName> -ResourceGroupName <ResourceGroupName).Id
   ```

1. Use the `New-AzWvdApplicationGroup` cmdlet with the following examples to create an application group. For more information, see the [New-AzWvdApplicationGroup PowerShell reference](/powershell/module/az.desktopvirtualization/new-azwvdapplicationgroup).

   1. To create a Desktop application group in the Azure region UK South, run the following command:

      ```azurepowershell
      $parameters = @{
          Name = '<Name>'
          ResourceGroupName = '<ResourceGroupName>'
          ApplicationGroupType = 'Desktop'
          HostPoolArmPath = $hostPoolArmPath
          Location = 'uksouth'
      }
   
      New-AzWvdApplicationGroup @parameters
      ```

   1. To create a RemoteApp application group in the Azure region UK South, run the following command. You can only create a RemoteApp application group with a pooled host pool.

      ```azurepowershell
      $parameters = @{
          Name = '<Name>'
          ResourceGroupName = '<ResourceGroupName>'
          ApplicationGroupType = 'RemoteApp'
          HostPoolArmPath = $hostPoolArmPath
          Location = 'uksouth'
      }
   
      New-AzWvdApplicationGroup @parameters
      ```

1. You can view the properties of your new workspace by running the following command:

   ```azurepowershell
   Get-AzWvdApplicationGroup -Name <Name> -ResourceGroupName <ResourceGroupName> | FL *
   ```

# [Azure CLI](#tab/cli)

Here's how to create an application group using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for Azure CLI.

1. In the same CLI session, get the resource ID of the host pool you want to create an application group for and store it in a variable by running the following command:

   ```azurecli
   hostPoolArmPath=$(az desktopvirtualization hostpool show \
       --name <Name> \
       --resource-group <ResourceGroupName> \
       --query [id] \
       --output tsv)
   ```

1. Use the `az desktopvirtualization applicationgroup create` command with the following examples to create an application group. For more information, see the [az desktopvirtualization applicationgroup Azure CLI reference](/cli/azure/desktopvirtualization/applicationgroup).

   1. To create a Desktop application group in the Azure region UK South, run the following command:

      ```azurecli
      az desktopvirtualization applicationgroup create \
          --name <Name> \
          --resource-group <ResourceGroupName> \
          --application-group-type Desktop \
          --host-pool-arm-path $hostPoolArmPath \
          --location uksouth
      ```

   1. To create a RemoteApp application group in the Azure region UK South, run the following command. You can only create a RemoteApp application group with a pooled host pool.

      ```azurecli
      az desktopvirtualization applicationgroup create \
          --name <Name> \
          --resource-group <ResourceGroupName> \
          --application-group-type RemoteApp \
          --host-pool-arm-path $hostPoolArmPath \
          --location uksouth
      ```

1. You can view the properties of your new application group by running the following command:

   ```azurecli
   az desktopvirtualization applicationgroup show --name <Name> --resource-group <ResourceGroupName>
   ```

---

## Add an application group to a workspace

Next, to add an application group to a workspace, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to add an application group to a workspace using the Azure portal.

1. From the Azure Virtual Desktop overview, select **Workspaces**, then select the name of the workspace you want to assign an application group to.

1. From the workspace overview, select **Application groups**, then select **+ Add**.

1. Select the plus icon (**+**) next to an application group from the list. Only application groups that aren't already assigned to a workspace are listed.

1. Select **Select**. The application group is added to the workspace.

# [Azure PowerShell](#tab/powershell)

Here's how to add an application group to a workspace using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module.

1. In the same PowerShell session, use the `Update-AzWvdWorkspace` cmdlet with the following example to add an application group to a workspace:

   ```azurepowershell
   # Get the resource ID of the application group you want to add to the workspace
   $appGroupPath = (Get-AzWvdApplicationGroup -Name <Name -ResourceGroupName <ResourceGroupName>).Id

   # Add the application group to the workspace
   Update-AzWvdWorkspace -Name <Name> -ResourceGroupName <ResourceGroupName> -ApplicationGroupReference $appGroupPath
   ```

1. You can view the properties of your workspace by running the following command. The key **ApplicationGroupReference** contains an array of the application groups added to the workspace.

   ```azurepowershell
   Get-AzWvdWorkspace -Name <Name> -ResourceGroupName <ResourceGroupName> | FL *
   ```

# [Azure CLI](#tab/cli)

Here's how to add an application group to a workspace using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for Azure CLI.

1. In the same CLI session, use the `az desktopvirtualization workspace update` command with the following example to add an application group to a workspace:

   ```azurecli
   # Get the resource ID of the application group you want to add to the workspace
   appGroupPath=$(az desktopvirtualization applicationgroup show \
       --name <Name> \
       --resource-group <ResourceGroupName> \
       --query [id] \
       --output tsv)

   # Add the application group to the workspace
   az desktopvirtualization workspace update \
       --name <Name> \
       --resource-group <ResourceGroupName> \
       --application-group-references $appGroupPath
   ```

1. You can view the properties of your workspace by running the following command. The key **applicationGroupReferences** contains an array of the application groups added to the workspace.

   ```azurecli
   az desktopvirtualization applicationgroup show \
       --name <Name> \
       --resource-group <ResourceGroupName>
   ```

---

## Assign users to an application group

Finally, to assign users or user groups to an application group, select the relevant tab for your scenario and follow the steps. We recommend you assign user groups to application groups to make ongoing management simpler.

# [Portal](#tab/portal)

Here's how to assign users or user groups to an application group to a workspace using the Azure portal.

1. From the Azure Virtual Desktop overview, select **Application groups**.

1. Select the application group from the list.

1. From the application group overview, select **Assignments**.

1. Select **+ Add**, then search for and select the user account or user group you want to assign to this application group.

1. Finish by selecting **Select**.

# [Azure PowerShell](#tab/powershell)

Here's how to assign users or user groups to an application group to a workspace using [Az.Resources](/powershell/module/az.resources) PowerShell module.

1. In the same PowerShell session, use the `New-AzRoleAssignment` cmdlet with the following examples to assign users or user groups to an application group.

   1. To assign users to the application group, run the following commands:

      ```azurepowershell
      $parameters = @{
          SignInName = '<UserPrincipalName>'
          ResourceName = '<ApplicationGroupName>'
          ResourceGroupName = '<ResourceGroupName>'
          RoleDefinitionName = 'Desktop Virtualization User'
          ResourceType = 'Microsoft.DesktopVirtualization/applicationGroups'
      }
      
      New-AzRoleAssignment @parameters
      ```

   1. To assign user groups to the application group, run the following commands:
   
      ```azurepowershell
      # Get the object ID of the user group you want to assign to the application group
      $userGroupId = (Get-AzADGroup -DisplayName "<UserGroupName>").Id

      # Assign users to the application group
      $parameters = @{
          ObjectId = $userGroupId
          ResourceName = '<ApplicationGroupName>'
          ResourceGroupName = '<ResourceGroupName>'
          RoleDefinitionName = 'Desktop Virtualization User'
          ResourceType = 'Microsoft.DesktopVirtualization/applicationGroups'
      }
      
      New-AzRoleAssignment @parameters
      ```

# [Azure CLI](#tab/cli)

Here's how to assign users or user groups to an application group to a workspace using the [role](/cli/azure/role/assignment) extension for Azure CLI.

1. In the same CLI session, use the `az role assignment create` command with the following examples to assign users or user groups to an application group.

   1. To assign users to the application group, run the following commands:

      ```azurecli
      # Get the resource ID of the application group you want to add to the workspace
      appGroupPath=$(az desktopvirtualization applicationgroup show \
          --name <Name> \
          --resource-group <ResourceGroupName> \
          --query [id] \
          --output tsv)

      # Assign users to the application group
      az role assignment create \
          --assignee '<UserPrincipalName>' \
          --role 'Desktop Virtualization User' \
          --scope $appGroupPath
      ```

   1. To assign user groups to the application group, run the following commands:

      ```azurecli
      # Get the resource ID of the application group you want to add to the workspace
      appGroupPath=$(az desktopvirtualization applicationgroup show \
          --name <Name> \
          --resource-group <ResourceGroupName> \
          --query [id] \
          --output tsv)

      # Get the object ID of the user group you want to assign to the application group
      userGroupId=$(az ad group show \
          --group <UserGroupName> \
          --query [id] \
          --output tsv)

      # Assign users to the application group
      az role assignment create \
          --assignee $userGroupId \
          --role 'Desktop Virtualization User' \
          --scope $appGroupPath
      ```

---

## Next steps

Once you've deployed Azure Virtual Desktop, your users can connect. There are several platforms you can connect from, including from a web browser. For more information, see [Remote Desktop clients for Azure Virtual Desktop](users/remote-desktop-clients-overview.md) and [Connect to Azure Virtual Desktop with the Remote Desktop Web client](users/connect-web.md).

Here are some extra tasks you might want to do:

- Configure profile management with FSLogix. To learn more, see [FSLogix profile containers](fslogix-containers-azure-files.md).

- [Add session hosts to a host pool](add-session-hosts-host-pool.md).

- [Enable diagnostics settings](diagnostics-log-analytics.md).
