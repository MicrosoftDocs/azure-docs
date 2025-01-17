---
title: Deploy Azure Virtual Desktop
description: Learn how to deploy Azure Virtual Desktop by creating a host pool, workspace, application group, and session hosts, and then assign users.
ms.topic: how-to
zone_pivot_groups: azure-virtual-desktop-host-pool-management-approaches
ms.custom: devx-track-azurecli, devx-track-azurepowershell
author: dknappettmsft
ms.author: daknappe
ms.date: 10/18/2024
---

# Deploy Azure Virtual Desktop

> [!IMPORTANT]
> The following features are currently in preview:
>
> - Azure Virtual Desktop on Azure Local for Azure Government and for Azure operated by 21Vianet (Azure in China).
>
> - Host pools with a session host configuration.
>
> For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article shows you how to deploy Azure Virtual Desktop on Azure, Azure Local, or Azure Extended Zones by using the Azure portal, the Azure CLI, or Azure PowerShell. To deploy Azure Virtual Desktop, you:

- Create a host pool.
- Create a workspace.
- Create an application group.
- Create session host virtual machines (VMs).
- Enable diagnostic settings (*optional*).
- Assign users or groups to the application group for users to get access to desktops and applications.

You can do all these tasks in a single process when using the Azure portal, but you can also do them separately.

When you create a host pool, you can choose one of two [management approaches](host-pool-management-approaches.md):

- *Session host configuration* (preview) is available for pooled host pools with session hosts on Azure. Azure Virtual Desktop manages the lifecycle of session hosts in a pooled host pool for you by using a combination of native features to provide an integrated and dynamic experience.

- *Standard* management is available for pooled and personal host pools with session hosts on Azure or Azure Local. You manage creating, updating, and scaling session hosts in a host pool. If you want to use existing tools and processes, such as automated pipelines, custom scripts, or external partner solutions, you need to use the standard host pool management type.

For more information on the terminology used in this article, see [Azure Virtual Desktop terminology](environment-setup.md). For more information about the Azure Virtual Desktop service, see [Azure Virtual Desktop service architecture and resilience](service-architecture-resilience.md).

> [!TIP]
> The process covered in this article is an in-depth and adaptable approach to deploying Azure Virtual Desktop. If you want to try Azure Virtual Desktop with a more simple approach to deploy a sample Windows 11 desktop, see [Tutorial: Deploy a sample Azure Virtual Desktop infrastructure with a Windows 11 desktop](tutorial-try-deploy-windows-11-desktop.md) or use the [quickstart](quickstart.md).
>
> Select a button at the top of this article to choose between host pools using standard management or host pools using session host configuration to see the relevant documentation.

## Prerequisites

::: zone pivot="host-pool-session-host-configuration"
Review the [Prerequisites for Azure Virtual Desktop](prerequisites.md) for a general idea of what's required and supported, such as operating systems (OS), virtual networks, and identity providers. It also includes a list of the [supported Azure regions](prerequisites.md#azure-regions) in which you can deploy host pools, workspaces, and application groups. This list of regions is where the *metadata* for the host pool can be stored. However, session hosts can be located in any Azure region. For more information about the types of data and locations, see [Data locations for Azure Virtual Desktop](data-locations.md).
::: zone-end

::: zone pivot="host-pool-standard"
For a general idea of what's required and supported, such as operating systems (OSs), virtual networks, and identity providers, review [Prerequisites for Azure Virtual Desktop](prerequisites.md). That article also includes a list of the [supported Azure regions](prerequisites.md#azure-regions) in which you can deploy host pools, workspaces, and application groups. This list of regions is where the *metadata* for the host pool can be stored. However, session hosts can be located in any Azure region and on-premises with [Azure Local](azure-stack-hci-overview.md). For more information about the types of data and locations, see [Data locations for Azure Virtual Desktop](data-locations.md).
::: zone-end

For more prerequisites, including role-based access control (RBAC) roles, select the relevant tab for your scenario.

::: zone pivot="host-pool-session-host-configuration"
# [Azure portal](#tab/portal-session-host-configuration)

In addition to the general prerequisites, you need:

- The Azure account you use to create a host pool must have the following built-in role-based access control (RBAC) roles or equivalent as a minimum on the resource group or subscription to create the following resource types. If you want to assign the roles to a resource group, you need to create this first.

   | Resource type | RBAC role |
   |--|--|
   | Host pool, workspace, and application group | [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) |
   | Session hosts (Azure) | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |

   For ongoing management of host pools, workspaces, and application groups, you can use more granular roles for each resource type. For more information, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).

- Assign the Azure Virtual Desktop service principal the [**Desktop Virtualization Virtual Machine Contributor**](rbac.md#desktop-virtualization-virtual-machine-contributor) role-based access control (RBAC) role on the resource group or subscription with the host pools and session hosts you want to use with session host update. For more information, see [Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals](service-principal-assign-roles.md).

- A key vault containing the secrets you want to use for your virtual machine local administrator account credentials and, if you're joining session hosts to an Active Directory domain, your domain join account credentials. You need one secret for each username and password.

   - You need to provide the Azure Virtual Desktop service principal the ability to read the secrets. Your key vault can be configured to use either:

      - [The Azure RBAC permission model](/azure/key-vault/general/rbac-guide) with the custom role you created assigned to the Azure Virtual Desktop service principal.

      - [An access policy](/azure/key-vault/general/assign-access-policy) with the *Get* secret permission assigned to the Azure Virtual Desktop service principal.

   - The key vault must allow [Azure Resource Manager for template deployment](../azure-resource-manager/managed-applications/key-vault-access.md#enable-template-deployment).

- An Active Directory domain that you can join session hosts to. Joining session hosts to Microsoft Entra ID isn't supported, but you can use [Microsoft Entra hybrid join](/entra/identity/devices/concept-hybrid-join).

- Don't disable [Windows Remote Management](/windows/win32/winrm/about-windows-remote-management) (WinRM) when creating session hosts using the Azure portal, as [PowerShell DSC](/powershell/dsc/overview) requires it.

# [Azure PowerShell](#tab/powershell-session-host-configuration)

In addition to the general prerequisites, you need:

- The Azure account you use to create a host pool must have the following built-in role-based access control (RBAC) roles or equivalent as a minimum on the resource group or subscription to create the following resource types. If you want to assign the roles to a resource group, you need to create this first.

   | Resource type | RBAC role |
   |--|--|
   | Host pool, workspace, and application group | [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) |
   | Session hosts (Azure) | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |

   For ongoing management of host pools, workspaces, and application groups, you can use more granular roles for each resource type. For more information, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).

- Assign the Azure Virtual Desktop service principal the [**Desktop Virtualization Virtual Machine Contributor**](rbac.md#desktop-virtualization-virtual-machine-contributor) role-based access control (RBAC) role on the resource group or subscription with the host pools and session hosts you want to use with session host update. For more information, see [Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals](service-principal-assign-roles.md).

- A key vault containing the secrets you want to use for your virtual machine local administrator account credentials and, if you're joining session hosts to an Active Directory domain, your domain join account credentials. You need one secret for each username and password. The virtual machine local administrator password must meet the [password requirements when creating a VM](/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm-).

   - You need to provide the Azure Virtual Desktop service principal the ability to read the secrets. Your key vault can be configured to use either:

      - [The Azure RBAC permission model](/azure/key-vault/general/rbac-guide) with the custom role you created assigned to the Azure Virtual Desktop service principal.

      - [An access policy](/azure/key-vault/general/assign-access-policy) with the *Get* secret permission assigned to the Azure Virtual Desktop service principal.

   - The key vault must allow [Azure Resource Manager for template deployment](../azure-resource-manager/managed-applications/key-vault-access.md#enable-template-deployment).

- Don't disable [Windows Remote Management](/windows/win32/winrm/about-windows-remote-management) (WinRM) when creating session hosts using the Azure portal, as [PowerShell DSC](/powershell/dsc/overview) requires it.

- If you want to use Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

- Azure PowerShell cmdlets for Azure Virtual Desktop that support host pools with a session host configuration are in preview. You need to download and install the [preview version of the Az.DesktopVirtualization module](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/) to use these cmdlets, which are added in version 5.3.0.

   > [!NOTE]
   > You can't use PowerShell to add session hosts to a host pool with a session host configuration. You need to use the Azure portal to specify the number of session hosts you want to add, then Azure Virtual Desktop automatically creates them based on the session host configuration. 

::: zone-end

::: zone pivot="host-pool-standard"
# [Azure portal](#tab/portal-standard)

- The Azure account that you use must have the following built-in RBAC roles or equivalent as a minimum on a resource group or subscription to create the following resource types. If you want to assign the roles to a resource group, you need to create the resource group first.

   | Resource type | RBAC role |
   |--|--|
   | Host pool, workspace, and application group | [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) |
   | Session hosts (Azure and Azure Extended Zones) | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |
   | Session hosts (Azure Local) | [Azure Stack HCI VM Contributor](/azure-stack/hci/manage/assign-vm-rbac-roles) |

   For ongoing management of host pools, workspaces, and application groups, you can use more granular roles for each resource type. For more information, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).

- To assign users to the application group, you also need `Microsoft.Authorization/roleAssignments/write` permissions on the application group. Built-in RBAC roles that include this permission are [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) and [Owner](../role-based-access-control/built-in-roles.md#owner).

- Don't disable [Windows Remote Management](/windows/win32/winrm/about-windows-remote-management) when you're creating session hosts by using the Azure portal, because [PowerShell DSC](/powershell/dsc/overview) requires it.

- To add session hosts on Azure Local, you also need:

  - An [Azure Local instance registered with Azure](/azure-stack/hci/deploy/register-with-azure). Your Azure Local instances need to be running a minimum of version 23H2. For more information, see [Azure Stack HCI, version 23H2 deployment overview](/azure-stack/hci/deploy/deployment-introduction). [Azure Arc VM management](/azure-stack/hci/manage/azure-arc-vm-management-overview) is installed automatically.

  - A stable connection to Azure from your on-premises network.

  - At least one Windows OS image available on the instance. For more information, see how to [create VM images by using Azure Marketplace images](/azure-stack/hci/manage/virtual-machine-image-azure-marketplace), [use images in an Azure Storage account](/azure-stack/hci/manage/virtual-machine-image-storage-account), and [use images in a local share](/azure-stack/hci/manage/virtual-machine-image-local-share).

  - A logical network that you created on your Azure Local instance. DHCP logical networks or static logical networks with automatic IP allocation are supported. For more information, see [Create logical networks for Azure Local](/azure-stack/hci/manage/create-logical-networks).

- To deploy session hosts to [Azure Extended Zones](/azure/virtual-desktop/azure-extended-zones), you also need:

  - Your Azure subscription registered with the respective Azure Extended Zone. For more information, see [Request access to an Azure Extended Zone](../extended-zones/request-access.md).

  - An [Azure load balancer](../load-balancer/load-balancer-outbound-connections.md) with an outbound rule on the virtual network to which you're deploying session hosts. You can use an existing load balancer or you create a new one when adding session hosts.

# [Azure PowerShell](#tab/powershell-standard)

- The Azure account that you use must have the following built-in RBAC roles or equivalent as a minimum on a resource group or subscription to create the following resource types. If you want to assign the roles to a resource group, you need to create the resource group first.

   | Resource type | RBAC role |
   |--|--|
   | Host pool, workspace, and application group | [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) |
   | Session hosts | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |

   For ongoing management of host pools, workspaces, and application groups, you can use more granular roles for each resource type. For more information, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).

- If you want to use Azure PowerShell locally, see [Use the Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) Azure PowerShell module installed. Alternatively, use [Azure Cloud Shell](../cloud-shell/overview.md).

> [!IMPORTANT]
> If you want to create Microsoft Entra joined session hosts, we only support this using the [`AADLoginForWindows`](/entra/identity/devices/howto-vm-sign-in-azure-ad-windows) VM extension, which is added and configured automatically when using the Azure portal or ARM template with the Azure Virtual Desktop service.

# [Azure CLI](#tab/cli-standard)

- The Azure account that you use must have the following built-in RBAC roles or equivalent as a minimum on a resource group or subscription to create the following resource types. If you want to assign the roles to a resource group, you need to create the resource group first.

   | Resource type | RBAC role |
   |--|--|
   | Host pool, workspace, and application group | [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) |
   | Session hosts | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |

   For ongoing management of host pools, workspaces, and application groups, you can use more granular roles for each resource type. For more information, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).

- If you want to use the Azure CLI locally, see [Use the Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension installed. Alternatively, use [Azure Cloud Shell](../cloud-shell/overview.md).

> [!IMPORTANT]
> If you want to create Microsoft Entra joined session hosts, we only support this using the [`AADLoginForWindows`](/entra/identity/devices/howto-vm-sign-in-azure-ad-windows) VM extension, which is added and configured automatically when using the Azure portal or ARM template with the Azure Virtual Desktop service.
::: zone-end

---

::: zone pivot="host-pool-session-host-configuration"
## Create a host pool with a session host configuration

To create a host pool with a session host configuration, select the relevant tab for your scenario and follow the steps.

# [Azure portal](#tab/portal-session-host-configuration)

Here's how to create a host pool with a session host configuration using the Azure portal, which also creates a default session host management policy and default session host configuration. You can change the default session host management policy and session host configuration after deployment.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, enter *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select **Create**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | Select the subscription you want to create the host pool in from the drop-down list. |
   | Resource group | Select an existing resource group or select **Create new** and enter a name. |
   | Host pool name | Enter a name for the host pool, for example **hp01**, up to 64 characters in length. |
   | Location | Select the Azure region where you want to create your host pool. |
   | Validation environment | Select **Yes** to create a host pool that is used as a [validation environment](create-validation-host-pool.md).<br /><br />A validation environment is required during the preview. |
   | Preferred app group type | Select the preferred [application group type](environment-setup.md#app-groups) for this host pool from *Desktop* or *RemoteApp*. A Desktop application group is created automatically when using the Azure portal, with whichever application group type you set as the preferred. |
   | **Host pool type** |  |
   | Host pool type | **Pooled** is automatically selected and is the only host pool type supported with a session host configuration. |
   | Use a session host configuration | Select **Yes**. |

   Once you complete this tab, select **Next: Session hosts**.

1. On the **Session hosts** tab, complete the following information, which is captured in a session host configuration and used to create session hosts.

   | Parameter | Value/Description |
   |--|--|
   | Number of session hosts | Enter the number of session hosts you want to create when creating the host pool. You can enter **0** to not create any session hosts at this point, but a session host configuration is still created with the values you specify for when you do create session hosts.<br /><br />You can deploy up to 500 session host VMs at this point if you wish (depending on your [subscription quota](/azure/quotas/view-quotas)), or you can add more later.<br /><br />For more information, see [Azure Virtual Desktop service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-virtual-desktop-service-limits) and [Virtual Machines limits](../azure-resource-manager/management/azure-subscription-service-limits.md#virtual-machines-limits---azure-resource-manager). |
   | **Session host configuration** |  |
   | Resource group | Automatically defaults to the resource group you chose your host pool to be in on the *Basics* tab, but you can also select an alternative from the drop-down list. |
   | Name prefix | Enter a name for your session hosts, for example **hp01-sh**.<br /><br />This value is used as the prefix for your session host VMs. Each session host has a suffix of a hyphen and then a sequential number added to the end, for example **hp01-sh-0**.<br /><br />It can be a maximum of 10 characters and is used in the computer name in the operating system. The prefix and the suffix combined can be a maximum of 15 characters. Session host names must be unique. |
   | Virtual machine location | Select the Azure region where to deploy your session host VMs. This region must be the same as your virtual network is in. |
   | Availability zones | Select one or more [availability zones](../reliability/availability-zones-overview.md) in which to deploy your virtual machines. |
   | Security type | Select from **Standard**, **[Trusted launch virtual machines](/azure/virtual-machines/trusted-launch)**, or **[Confidential virtual machines](../confidential-computing/confidential-vm-overview.md)**.<br /><br />- If you select **Trusted launch virtual machines**, options for **secure boot** and **vTPM** are automatically selected.<br /><br />- If you select **Confidential virtual machines**, options for **secure boot**, **vTPM**, and **integrity monitoring** are automatically selected. You can't opt out of vTPM when using a confidential VM.<br /><br />**Trusted launch virtual machines** is the default. |
   | Image | Select the OS image you want to use from the list, or select **See all images** to see more, including any custom images you create and store as an [Azure Compute Gallery shared image](/azure/virtual-machines/shared-image-galleries) or a [managed image](/azure/virtual-machines/windows/capture-image-resource). |
   | Virtual machine size | Select a SKU. If you want to use different SKU, select **Change size**, then select from the list. |
   | OS disk type | Select the disk type to use for your session hosts. We recommend **Premium SSD** for production workloads. |
   | OS disk size | Select a size for the OS disk.<br /><br />If you enable hibernate, ensure the OS disk is large enough to store the contents of the memory in addition to the OS and other applications. |
   | Boot Diagnostics | Select whether you want to enable [boot diagnostics](/azure/virtual-machines/boot-diagnostics). |
   | **Network and security** |  |
   | Virtual network | Select your virtual network. An option to select a subnet appears. |
   | Subnet | Select a subnet from your virtual network. |
   | Network security group type | Select whether you want to use a network security group (NSG).<br /><br />- **Basic** creates a new NSG and you can specify public inbound ports.<br /><br />- **Advanced** enables you to select an existing NSG.<br /><br />You don't need to open inbound ports to connect to Azure Virtual Desktop. Learn more at [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md). |
   | **Domain to join** |  |
   | Select which directory you would like to join | Select **Active Directory**, then select the key vault that contains the secrets for the username and password for the domain join account.<br /><br />You can optionally specify a domain name and organizational unit path. |
   | **Virtual Machine Administrator account** | Select the key vault and secret for the username and password for the local administrator account of the new session host VMs. The username and password must meet [the requirements for Windows VMs in Azure](/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm-). |
   | **Custom configuration** |  |
   | Custom configuration script URL | If you want to run a PowerShell script during deployment you can enter the URL here. |

   > [!TIP]
   > Once you complete this tab, you can continue to optionally register the default desktop application group with a new or preexisting workspace from this host pool, and enable diagnostics settings by selecting **Next: Workspace**. Alternatively, if you want to create and configure these separately, select **Next: Review + create** and go to step 9.

1. *Optional*: On the **Workspace** tab, if you want to create a workspace and register the default desktop application group from this host pool, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Register desktop app group | Select **Yes**. This registers the default desktop application group to the selected workspace. |
   | To this workspace | Select an existing workspace from the list, or select **Create new** and enter a name, for example **ws01**. |

   Once you complete this tab, select **Next: Advanced**.

1. *Optional*: On the **Advanced** tab, if you want to enable diagnostics settings, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Enable diagnostics settings | Check the box. |
   | Choosing destination details to send logs to | Select one of the following destinations:<br /><br />- Send to Log Analytics workspace<br /><br />- Archive to storage account<br /><br />- Stream to an event hub |

   Once you complete this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any name/value pairs you need, then select **Next: Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that is during deployment.

1. Select **Create** to create the host pool.

1. Once the host pool is created, select **Go to resource** to go to the overview of your new host pool, then select **Properties** to view its properties.

### Post deployment

If you also added session hosts to your host pool, there's some extra configuration you might need to do, which is covered in the following sections.

[!INCLUDE [include-session-hosts-post-deployment](includes/include-session-hosts-post-deployment.md)]

> [!NOTE]
> - If you created a host pool, workspace, and registered the default desktop application group from this host pool in the same process, go to the section [Assign users to an application group](#assign-users-to-an-application-group) and complete the rest of the article. A Desktop application group is created automatically when using the Azure portal, whichever application group type you set as the preferred.
>
> - If you created a host pool and workspace in the same process, but didn't register the default desktop application group from this host pool, go to the section [Create an application group](#create-an-application-group) and complete the rest of the article.
>
> - If you didn't create a workspace, continue to the next section and complete the rest of the article.

# [Azure PowerShell](#tab/powershell-session-host-configuration)

Here's how to create a host pool with a session host configuration, and a session host management policy using Azure PowerShell. You can change the session host configuration and session host management policy after deployment. Be sure to change the `<placeholder>` values for your own.

> [!IMPORTANT]
> In the following examples, the property `ManagementType = 'Automated'` is specified. This property is currently required to use a session host configuration and can't be changed after the host pool is created. This property is planned to be deprecated during the preview, allowing any host pool to manage using a session host configuration. Host pools created with the property `ManagementType = 'Automated` will continue to work after this property is deprecated.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Use the `New-AzWvdHostPool` cmdlet with the following example to create a host pool with a session host configuration using the *breadth-first* [load-balancing algorithm](host-pool-load-balancing.md) and *Desktop* as the preferred [application group type](environment-setup.md#app-groups). More parameters are available; for more information, see the [New-AzWvdHostPool PowerShell reference](/powershell/module/az.desktopvirtualization/new-azwvdhostpool).

   ```azurepowershell
   $parameters = @{
       Name = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       ManagementType = 'Automated'
       HostPoolType = 'Pooled'
       PreferredAppGroupType = 'Desktop'
       LoadBalancerType = 'BreadthFirst'
       MaxSessionLimit = '<value>'
       Location = '<AzureRegion>'
   }

   New-AzWvdHostPool @parameters
   ```

3. You can view the properties of your new host pool by running the following command:

   ```azurepowershell
   Get-AzWvdHostPool -Name <Name> -ResourceGroupName <ResourceGroupName> | FL *
   ```

4. Next you need to create a session host configuration using the `New-AzWvdSessionHostConfiguration` cmdlet. Here are some examples:

   1. To create a session host configuration using the **Windows 11 Enterprise multi-session, version 22H2** marketplace image, join Microsoft Entra ID, and Premium SSD for the OS disk type, run the following command. For information about how to find the values for the Marketplace image, see [Find and use Azure Marketplace VM images with Azure PowerShell](/azure/virtual-machines/windows/cli-ps-findimage).

      ```azurepowershell
      $parameters = @{
          FriendlyName = '<FriendlyName>'
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          VMNamePrefix = '<Prefix>'
          VMLocation = '<AzureRegion>'
          ImageInfoType = 'Marketplace'
          MarketplaceInfoPublisher = 'MicrosoftWindowsDesktop'
          MarketplaceInfoOffer = 'Windows-11'
          MarketplaceInfoSku = 'win11-22h2-avd'
          MarketplaceInfoExactVersion = '<VersionNumber>'
          VMSizeId = 'Standard_D8s_v5'
          DiskInfoType = 'Premium_LRS'
          NetworkInfoSubnetId = '/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/<VNetName>/subnets/<SubnetName>'
          DomainInfoJoinType = 'AzureActiveDirectory'
          VMAdminCredentialsUsernameKeyVaultSecretUri = 'https://<VaultName>.vault.azure.net/secrets/<SecretName>/<Version>'
          VMAdminCredentialsPasswordKeyVaultSecretUri = 'https://<VaultName>.vault.azure.net/secrets/<SecretName>/<Version>'
      }

      New-AzWvdSessionHostConfiguration @parameters
      ```

   1. To create a session host configuration using a custom image, join an Active Directory domain, and Premium SSD for the OS disk type, run the following command:

      ```azurepowershell
      $parameters = @{
          FriendlyName = '<FriendlyName>'
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          VMNamePrefix = '<Prefix>'
          VMLocation = '<AzureRegion>'
          ImageInfoType = 'Custom'
          CustomInfoResourceID  = '/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/galleries/<GalleryName>/images/<ImageName>/versions/<ImageVersion>'
          VMSizeId = 'Standard_D8s_v5'
          DiskInfoType = 'Premium_LRS'
          NetworkInfoSubnetId = '/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/<VNetName>/subnets/<SubnetName>'
          DomainInfoJoinType = 'ActiveDirectory'
          ActiveDirectoryInfoDomainName = '<DomainName>'
          DomainCredentialsUsernameKeyVaultSecretUri = 'https://<VaultName>.vault.azure.net/secrets/<SecretName>/<Version>'
          DomainCredentialsPasswordKeyVaultSecretUri = 'https://<VaultName>.vault.azure.net/secrets/<SecretName>/<Version>'
          VMAdminCredentialsUsernameKeyVaultSecretUri = 'https://<VaultName>.vault.azure.net/secrets/<SecretName>/<Version>'
          VMAdminCredentialsPasswordKeyVaultSecretUri = 'https://<VaultName>.vault.azure.net/secrets/<SecretName>/<Version>'
      }

      New-AzWvdSessionHostConfiguration @parameters
      ```

   1. You can view the configuration of your session host configuration by running the following command:

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }

   Get-AzWvdSessionHostConfiguration @parameters | FL *
   ```

5. Finally, create a session host management policy using the `New-AzWvdSessionHostManagement` cmdlet by running the following command. For valid time zone values, see [Get-TimeZone PowerShell reference](/powershell/module/microsoft.powershell.management/get-timezone) and use the value from the `StandardName` property.

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       ScheduledDateTimeZone = '<TimeZone>'
       UpdateLogOffDelayMinute = '<Number>'
       UpdateMaxVmsRemoved = '<Number>'
       UpdateDeleteOriginalVM = $False
       UpdateLogOffMessage = '<Message>'
   }

   New-AzWvdSessionHostManagement @parameters
   ```

---

::: zone-end

::: zone pivot="host-pool-standard"
## Create a host pool with standard management

To create a host pool, select the relevant tab for your scenario and follow the steps.

# [Azure portal](#tab/portal-standard)

Here's how to create a host pool by using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. On the search bar, enter **Azure Virtual Desktop** and select the matching service entry.

1. Select **Host pools**, and then select **Create**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | **Subscription** | In the dropdown list, select the subscription where you want to create the host pool. |
   | **Resource group** | Select an existing resource group, or select **Create new** and enter a name. |
   | **Host pool name** | Enter a name for the host pool, such as **hp01**. |
   | **Location** | Select the Azure region where you want to create your host pool. |
   | **Validation environment** | Select **Yes** to create a host pool that's used as a [validation environment](create-validation-host-pool.md).<br /><br />Select **No** (*default*) to create a host pool that isn't used as a validation environment. |
   | **Preferred app group type** | Select the [preferred application group type](preferred-application-group-type.md) for this host pool: **Desktop** or **RemoteApp**. A desktop application group is created automatically when you use the Azure portal. |
   | **Host pool type** | Select whether you want your host pool to be **Personal** or **Pooled**.<br /><br />If you select **Personal**, a new option appears for **Assignment type**. Select either **Automatic** or **Direct**.<br /><br />If you select **Pooled**, two new options appear for **Load balancing algorithm** and **Max session limit**.<br /><br />- For **Load balancing algorithm**, choose either **breadth-first** or **depth-first**, based on your usage pattern.<br /><br />- For **Max session limit**, enter the maximum number of users that you want load-balanced to a single session host. For more information, see [Host pool load-balancing algorithms](host-pool-load-balancing.md). |

   > [!TIP]
   > After you complete this tab, you can continue to optionally create session hosts, create a workspace, register the default desktop application group from this host pool, and enable diagnostic settings by selecting **Next: Virtual Machines**. Alternatively, if you want to create and configure these resources separately, select **Next: Review + create** and go to step 9.

1. *Optional*: On the **Virtual machines** tab, if you want to add session hosts, expand one of the following sections and complete the information, depending on whether you want to create session hosts on Azure or on Azure Local. For guidance on sizing session host virtual machines, see [Session host virtual machine sizing guidelines](/windows-server/remote/remote-desktop-services/virtual-machine-recs).<br /><br />

   <details>
       <summary>To add session hosts on <b>Azure</b>, expand this section.</summary>

      | Parameter | Value/Description |
      |--|--|
      | **Add virtual machines** | Select **Yes**. This action shows several new options. |
      | **Resource group** | This value defaults to the resource group that you chose to contain your host pool on the **Basics** tab, but you can select an alternative. |
      | **Name prefix** | Enter a name prefix for your session hosts, such as **hp01-sh**.<br /><br />Each session host has a suffix of a hyphen and then a sequential number added to the end, such as **hp01-sh-0**.<br /><br />This name prefix can be a maximum of 11 characters and is used in the computer name in the operating system. The prefix and the suffix combined can be a maximum of 15 characters. Session host names must be unique. |
      | **Virtual machine type** | Select **Azure virtual machine**. |
      | **Virtual machine location** | Select the Azure region where you want to deploy your session hosts. This value must be the same region that contains your virtual network. |
      | **Availability options** | Select from [availability zones](/azure/reliability/availability-zones-overview), [availability set](/azure/virtual-machines/availability-set-overview), or **No infrastructure redundancy required**. If you select **availability zones** or **availability set**, complete the extra parameters that appear.  |
      | **Security type** | Select from **Standard**, [Trusted launch virtual machines](/azure/virtual-machines/trusted-launch), or [Confidential virtual machines](/azure/confidential-computing/confidential-vm-overview).<br /><br />- If you select **Trusted launch virtual machines**, options for **secure boot** and **vTPM** are automatically selected.<br /><br />- If you select **Confidential virtual machines**, options for **secure boot**, **vTPM**, and **integrity monitoring** are automatically selected. You can't opt out of vTPM when using a confidential VM. |
      | **Image** | Select the OS image that you want to use from the list, or select **See all images** to see more. The full list includes any images that you created and stored as an [Azure Compute Gallery shared image](/azure/virtual-machines/shared-image-galleries) or a [managed image](/azure/virtual-machines/windows/capture-image-resource). |
      | **Virtual machine size** | Select a size. If you want to use a different size, select **Change size**, and then select from the list. |
      | **Hibernate** | Select the box to enable hibernation. Hibernation is available only for personal host pools. For more information, see [Hibernation in virtual machines](/azure/virtual-machines/hibernate-resume). If you're using Microsoft Teams media optimizations, you should update the [WebRTC redirector service to 1.45.2310.13001](whats-new-webrtc.md#updates-for-version-145231013001).<br /><br />FSLogix and app attach currently don't support hibernation. Don't enable hibernation if you're using FSLogix or app attach for your personal host pools. |
      | **Number of VMs** | Enter the number of virtual machines that you want to deploy. You can deploy up to 400 session hosts at this point if you want (depending on your [subscription quota](/azure/quotas/view-quotas)), or you can add more later.<br /><br />For more information, see [Azure Virtual Desktop service limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-virtual-desktop-service-limits) and [Virtual Machines limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#virtual-machines-limits---azure-resource-manager). |
      | **OS disk type** | Select the disk type to use for your session hosts. We recommend that you use only **Premium SSD** for production workloads. |
      | **OS disk size** | Select a size for the OS disk.<br /><br />If you enable hibernation, ensure that the OS disk is large enough to store the contents of the memory in addition to the OS and other applications. |
      | **Confidential computing encryption** | If you're using a confidential VM, you must select the **Confidential compute encryption** checkbox to enable OS disk encryption.<br /><br />This checkbox appears only if you selected **Confidential virtual machines** as your security type. |
      | **Boot Diagnostics** | Select whether you want to enable [boot diagnostics](/azure/virtual-machines/boot-diagnostics). |
      | **Network and security** |  |
      | **Virtual network** | Select your virtual network. An option to select a subnet appears. |
      | **Subnet** | Select a subnet from your virtual network. |
      | **Network security group** | Select whether you want to use a network security group (NSG).<br /><br />- **None** doesn't create a new NSG.<br /><br />- **Basic** creates a new NSG for the VM network adapter.<br /><br />- **Advanced** enables you to select an existing NSG.<br /><br />We recommend that you don't create an NSG here, but [create an NSG on the subnet instead](../virtual-network/manage-network-security-group.md). |
      | **Public inbound ports** | You can select a port to allow from the list. Azure Virtual Desktop doesn't require public inbound ports, so we recommend that you select **No**. |
      | **Domain to join** |  |
      | **Select which directory you would like to join** | Select from **Microsoft Entra ID** or **Active Directory**, and complete the relevant parameters for the selected option.  |
      | **Virtual Machine Administrator account** |  |
      | **Username** | Enter a name to use as the local administrator account for the new session hosts. For more information, see [What are the username requirements when creating a VM?](/azure/virtual-machines/windows/faq#what-are-the-username-requirements-when-creating-a-vm-) |
      | **Password** | Enter a password for the local administrator account. For more information, see [What are the password requirements when creating a VM?](/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm-) |
      | **Confirm password** | Reenter the password. |
      | **Custom configuration** |  |
      | **Custom configuration script URL** | If you want to run a PowerShell script during deployment, you can enter the URL here. |

   </details>

   <details>
       <summary>To add session hosts on <b>Azure Local</b>, expand this section.</summary>

      | Parameter | Value/Description |
      |--|--|
      | **Add virtual machines** | Select **Yes**. This action shows several new options. |
      | **Resource group** | This value defaults to the resource group that you chose to contain your host pool on the **Basics** tab, but you can select an alternative. |
      | **Name prefix** | Enter a name prefix for your session hosts, such as **hp01-sh**.<br /><br />Each session host has a suffix of a hyphen and then a sequential number added to the end, such as **hp01-sh-0**.<br /><br />This name prefix can be a maximum of 11 characters and is used in the computer name in the operating system. The prefix and the suffix combined can be a maximum of 15 characters. Session host names must be unique. |
      | **Virtual machine type** | Select **Azure Local**. |
      | **Custom location** | In the dropdown list, select the Azure Local instance where you want to deploy your session hosts. |
      | **Images** | Select the OS image that you want to use from the list, or select **Manage VM images** to manage the images available on the instance that you selected. |
      | **Number of VMs** | Enter the number of virtual machines that you want to deploy. You can add more later. |
      | **Virtual processor count** | Enter the number of virtual processors that you want to assign to each session host. This value isn't validated against the resources available in the instance. |
      | **Memory type** | Select **Static** for a fixed memory allocation, or select **Dynamic** for a dynamic memory allocation. |
      | **Memory (GB)** | Enter a number for the amount of memory, in gigabytes, that you want to assign to each session host. This value isn't validated against the resources available in the instance. |
      | **Maximum memory** | If you selected dynamic memory allocation, enter a number for the maximum amount of memory, in gigabytes, that you want your session host to be able to use. |
      | **Minimum memory** | If you selected dynamic memory allocation, enter a number for the minimum amount of memory, in gigabytes, that you want your session host to be able to use. |
      | **Network and security** |  |
      | **Network dropdown** | Select an existing network to connect each session to. |
      | **Domain to join** |  |
      | **Select which directory you would like to join** | **Active Directory** is the only available option. This includes using [Microsoft Entra hybrid join](/entra/identity/devices/concept-hybrid-join).  |
      | **AD domain join UPN** | Enter the user principal name (UPN) of an Active Directory user who has permission to join the session hosts to your domain. |
      | **Password** | Enter the password for the Active Directory user. |
      | **Specify domain or unit** | Select **yes** if you want to join session hosts to a specific domain or be placed in a specific organizational unit (OU). If you select **no**, the suffix of the UPN is used as the domain. |
      | **Virtual Machine Administrator account** |  |
      | **Username** | Enter a name to use as the local administrator account for the new session hosts. For more information, see [What are the username requirements when creating a VM?](/azure/virtual-machines/windows/faq#what-are-the-username-requirements-when-creating-a-vm-) |
      | **Password** | Enter a password for the local administrator account. For more information, see [What are the password requirements when creating a VM?](/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm-) |
      | **Confirm password** | Reenter the password. |

   </details>

   <details>
       <summary>To add session hosts on <b>Azure Extended Zones</b>, expand this section.</summary>

      | Parameter | Value/Description |
      |--|--|
      | **Add virtual machines** | Select **Yes**. This action shows several new options. |
      | **Resource group** | This value defaults to the resource group that you chose to contain your host pool on the **Basics** tab, but you can select an alternative. |
      | **Name prefix** | Enter a name prefix for your session hosts, such as **hp01-sh**.<br /><br />Each session host has a suffix of a hyphen and then a sequential number added to the end, such as **hp01-sh-0**.<br /><br />This name prefix can be a maximum of 11 characters and is used in the computer name in the operating system. The prefix and the suffix combined can be a maximum of 15 characters. Session host names must be unique. |
      | **Virtual machine type** | Select **Azure virtual machine**. |
      | **Virtual machine location** | Select **Deploy to an Azure Extended Zone**. |
      | **Azure Extended Zone** | Select the Extended Zone you require. |
      | **Network and security** |  |
      | **Select a load balancer** | Select an existing Azure load balancer on the same virtual network you want to use for your session hosts, or select **Create a load balancer** to create a new load balancer.|
      | **Select a backend pool** | Select a backend pool on the load balancer you want to use for your session hosts. If you're creating a new load balancer, select **Create new** to create a new backend pool for the new load balancer. |
      | **Add outbound rule** | If you're creating a new load balancer, select **Create new** to create a new outbound rule for it. |

   </details>

   After you complete this tab, select **Next: Workspace**.

1. *Optional*: On the **Workspace** tab, if you want to create a workspace and register the default desktop application group from this host pool, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | **Register desktop app group** | Select **Yes**. This action registers the default desktop application group to the selected workspace. |
   | **To this workspace** | Select an existing workspace from the list, or select **Create new** and enter a name, such as **ws01**. |

   After you complete this tab, select **Next: Advanced**.

1. *Optional*: On the **Advanced** tab, if you want to enable diagnostic settings, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | **Enable diagnostics settings** | Select the box. |
   | **Choosing destination details to send logs to** | Select one of the following destinations:<br /><br />- Send to a Log Analytics workspace<br /><br />- Archive to a storage account<br /><br />- Stream to an event hub |

   After you complete this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any name/value pairs that you need, and then select **Next: Review + create**.

1. On the **Review + create** tab, ensure that validation passes and review the information that will be used during deployment.

1. Select **Create** to create the host pool.

1. Once the deployment has completed successfully, select **Go to resource** to go to the overview of your new host pool, and then select **Properties** to view its properties.

### Post-deployment tasks

If you also added session hosts to your host pool, you need to do some extra configuration, as described in the following sections.

[!INCLUDE [include-session-hosts-post-deployment](includes/include-session-hosts-post-deployment.md)]

> [!NOTE]
> - If you created a host pool and a workspace, and you registered the default desktop application group from this host pool in the same process, go to the section [Assign users to an application group](#assign-users-to-an-application-group) and complete the rest of the article. A desktop application group (whichever application group type you set as preferred) is created automatically when you use the Azure portal.
>
> - If you created a host pool and workspace in the same process, but you didn't register the default desktop application group from this host pool, go to the section [Create an application group](#create-an-application-group) and complete the rest of the article.
>
> - If you didn't create a workspace, continue to the next section and complete the rest of the article.

# [Azure PowerShell](#tab/powershell-standard)

Here's how to create a host pool by using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) Azure PowerShell module. The following examples show you how to create a pooled host pool and a personal host pool. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Use the `New-AzWvdHostPool` cmdlet with the following examples to create a host pool. More parameters are available. For more information, see the [New-AzWvdHostPool Azure PowerShell reference](/powershell/module/az.desktopvirtualization/new-azwvdhostpool).

   - To create a pooled host pool by using the *breadth-first* [load-balancing algorithm](host-pool-load-balancing.md) and *desktop* as the preferred [app group type](environment-setup.md#app-groups), run the following command:

      ```azurepowershell
      $parameters = @{
          Name = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          HostPoolType = 'Pooled'
          LoadBalancerType = 'BreadthFirst'
          PreferredAppGroupType = 'Desktop'
          MaxSessionLimit = '<value>'
          Location = '<AzureRegion>'
      }
      
      New-AzWvdHostPool @parameters
      ```

   - To create a personal host pool by using the *automatic* assignment type and *desktop* as the preferred [app group type](environment-setup.md#app-groups), run the following command:

      ```azurepowershell
      $parameters = @{
          Name = '<HostPoolName>'
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
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }

   Get-AzWvdHostPool @parameters | FL *
   ```

# [Azure CLI](#tab/cli-standard)

Here's how to create a host pool by using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for the Azure CLI. The following examples show you how to create a pooled host pool and a personal host pool. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Use the `az desktopvirtualization hostpool create` command with the following examples to create a host pool. More parameters are available. For more information, see the [az desktopvirtualization hostpool Azure CLI reference](/cli/azure/desktopvirtualization/hostpool).

   - To create a pooled host pool by using the *breadth-first* [load-balancing algorithm](host-pool-load-balancing.md) and *desktop* as the preferred [app group type](environment-setup.md#app-groups), run the following command:

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

   - To create a personal host pool by using the *automatic* assignment type, run the following command:

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
::: zone-end

## Create a workspace

Next, to create a workspace, select the relevant tab for your scenario and follow the steps.

# [Azure portal](#tab/portal)

Here's how to create a workspace by using the Azure portal:

1. On the Azure Virtual Desktop overview, select **Workspaces**, and then select **Create**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | **Subscription** | In the dropdown list, select the subscription where you want to create the workspace. |
   | **Resource group** | Select an existing resource group, or select **Create new** and enter a name. |
   | **Workspace name** | Enter a name for the workspace, such as **workspace01**. |
   | **Friendly name** | *Optional*: Enter a display name for the workspace. |
   | **Description** | *Optional*: Enter a description for the workspace. |
   | **Location** | Select the Azure region where you want to deploy your workspace. |

   > [!TIP]
   > After you complete this tab, you can continue to optionally register an existing application group to this workspace, if you have one, and enable diagnostic settings by selecting **Next: Application groups**. Alternatively, if you want to create and configure these resources separately, select **Review + create** and go to step 9.

1. *Optional*: On the **Application groups** tab, if you want to register an existing application group to this workspace, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | **Register application groups** | Select **Yes**, and then select **+ Register application groups**. On the new pane that opens, select the **Add** icon for the application groups that you want to add, and then choose **Select**. |

   After you complete this tab, select **Next: Advanced**.

1. *Optional*: On the **Advanced** tab, if you want to enable diagnostic settings, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | **Enable diagnostics settings** | Select the box. |
   | **Choosing destination details to send logs to** | Select one of the following destinations:<br /><br />- Send to a Log Analytics workspace<br /><br />- Archive to a storage account<br /><br />- Stream to an event hub |

   After you complete this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any name/value pairs that you need, and then select **Next: Review + create**.

1. On the **Review + create** tab, ensure that validation passes and review the information that will be used during deployment.

1. Select **Create** to create the workspace.

1. Select **Go to resource** to go to the overview of your new workspace, and then select **Properties** to view its properties.

> [!NOTE]
> - If you added an application group to this workspace, go to the section [Assign users to an application group](#assign-users-to-an-application-group) and complete the rest of the article.
>
> - If you didn't add an application group to this workspace, continue to the next section and complete the rest of the article.

# [Azure PowerShell](#tab/powershell)

Here's how to create a workspace by using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) Azure PowerShell module:

1. In the same PowerShell session, use the `New-AzWvdWorkspace` cmdlet with the following example to create a workspace. More parameters are available, such as parameters to register existing application groups. For more information, see the [New-AzWvdWorkspace Azure PowerShell reference](/powershell/module/az.desktopvirtualization/new-azwvdworkspace).

   ```azurepowershell
   $parameters = @{
      Name = '<WorkspaceName>'
      ResourceGroupName = '<ResourceGroupName>'
      Location = '<AzureRegion>'
   }

   New-AzWvdWorkspace @parameters
   ```

1. You can view the properties of your new workspace by running the following command:

   ```azurepowershell
   $parameters = @{
      Name = '<WorkspaceName>'
      ResourceGroupName = '<ResourceGroupName>'
   }

   Get-AzWvdWorkspace @parameters | FL *
   ```

# [Azure CLI](#tab/cli)

Here's how to create a workspace by using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for the Azure CLI:

1. In the same CLI session, use the `az desktopvirtualization workspace create` command with the following example to create a workspace. More parameters are available, such as parameters to register existing application groups. For more information, see the [az desktopvirtualization workspace Azure CLI reference](/cli/azure/desktopvirtualization/workspace).

   ```azurecli
   az desktopvirtualization workspace create \
       --name <Name> \
       --resource-group <ResourceGroupName>
   ```

1. You can view the properties of your new workspace by running the following command:

   ```azurecli
   az desktopvirtualization workspace show \
       --name <Name> \
       --resource-group <ResourceGroupName>
   ```

---

## Create an application group

To create an application group, select the relevant tab for your scenario and follow the steps.

# [Azure portal](#tab/portal)

Here's how to create an application group by using the Azure portal:

1. On the Azure Virtual Desktop overview, select **Application groups**, and then select **Create**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | **Subscription** | In the dropdown list, select the subscription where you want to create the application group. |
   | **Resource group** | Select an existing resource group, or select **Create new** and enter a name. |
   | **Host pool** | Select the host pool for the application group. |
   | **Location** | Metadata is stored in the same location as the host pool. |
   | **Application group type** | Select the [application group type](environment-setup.md#app-groups) for the host pool: **Desktop** or **RemoteApp**. |
   | **Application group name** | Enter a name for the application group, such as **Session Desktop**. |

   > [!TIP]
   > After you complete this tab, select **Next: Review + create**. You don't need to complete the other tabs to create an application group, but you need to [create a workspace](#create-a-workspace), [add an application group to a workspace](#add-an-application-group-to-a-workspace), and [assign users to the application group](#assign-users-to-an-application-group) before users can access the resources.
   >
   > If you created an application group for RemoteApp, you also need to add applications to it. For more information, see [Publish applications](publish-applications.md).

1. *Optional*: If you chose to create a RemoteApp application group, you can add applications to this group. On the **Application groups** tab, select **+ Add applications**, and then select an application. For more information on the application parameters, see [Publish applications with RemoteApp](manage-app-groups.md). At least one session host in the host pool must be turned on and available in Azure Virtual Desktop.

   After you complete this tab, or if you're creating a desktop application group, select **Next: Assignments**.

1. *Optional*: On the **Assignments** tab, if you want to assign users or groups to this application group, select **+ Add Microsoft Entra users or user groups**. On the new pane that opens, select the box next to the users or groups that you want to add, and then choose **Select**.

   After you complete this tab, select **Next: Workspace**.

1. *Optional*: On the **Workspace** tab, if you're creating a desktop application group, you can register the default desktop application group from the host pool that you selected by completing the following information:

   | Parameter | Value/Description |
   |--|--|
   | **Register application group** | Select **Yes**. This action registers the default desktop application group to the selected workspace. |
   | **Register application group** | Select an existing workspace from the list. |

   After you complete this tab, select **Next: Advanced**.

1. *Optional*: If you want to enable diagnostic settings, on the **Advanced** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | **Enable diagnostics settings** | Select the box. |
   | **Choosing destination details to send logs to** | Select one of the following destinations:<br /><br />- Send to a Log Analytics workspace<br /><br />- Archive to a storage account<br /><br />- Stream to an event hub |

   After you complete this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any name/value pairs that you need, and then select **Next: Review + create**.

1. On the **Review + create** tab, ensure that validation passes and review the information that will be used during deployment.

1. Select **Create** to create the application group.

1. Select **Go to resource** to go to the overview of your new application group, and then select **Properties** to view its properties.

> [!NOTE]
> - If you created a desktop application group, assigned users or groups, and registered the default desktop application group to a workspace, your assigned users can connect to the desktop and you don't need to complete the rest of the article.
>
> - If you created a RemoteApp application group, added applications, and assigned users or groups, go to the section [Add an application group to a workspace](#add-an-application-group-to-a-workspace) and complete the rest of the article.
>
> - If you didn't add applications, assign users or groups, or register the application group to a workspace, continue to the next section and complete the rest of the article.

# [Azure PowerShell](#tab/powershell)

Here's how to create an application group by using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) Azure PowerShell module:

1. In the same PowerShell session, get the resource ID of the host pool for which you want to create an application group and store it in a variable by running the following command:

   ```azurepowershell
   $parameters = @{
       Name = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }

   $hostPoolArmPath = (Get-AzWvdHostPool @parameters).Id
   ```

1. Use the `New-AzWvdApplicationGroup` cmdlet with the following examples to create an application group. For more information, see the [New-AzWvdApplicationGroup Azure PowerShell reference](/powershell/module/az.desktopvirtualization/new-azwvdapplicationgroup).

   - To create a desktop application group, run the following command:

      ```azurepowershell
      $parameters = @{
          Name = '<ApplicationGroupName>'
          ResourceGroupName = '<ResourceGroupName>'
          ApplicationGroupType = 'Desktop'
          HostPoolArmPath = $hostPoolArmPath
          Location = '<AzureRegion>'
      }
   
      New-AzWvdApplicationGroup @parameters
      ```

   - To create a RemoteApp application group, run the following command. You can only create a RemoteApp application group with a pooled host pool.

      ```azurepowershell
      $parameters = @{
          Name = '<Name>'
          ResourceGroupName = '<ResourceGroupName>'
          ApplicationGroupType = 'RemoteApp'
          HostPoolArmPath = $hostPoolArmPath
          Location = '<AzureRegion>'
      }
   
      New-AzWvdApplicationGroup @parameters
      ```

1. You can view the properties of your new application group by running the following command:

   ```azurepowershell
   $parameters = @{
      Name = '<ApplicationGroupName>'
      ResourceGroupName = '<ResourceGroupName>'
   }

   Get-AzWvdApplicationGroup @parameters | FL *
   ```

# [Azure CLI](#tab/cli)

Here's how to create an application group by using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for the Azure CLI:

1. In the same CLI session, get the resource ID of the host pool for which you want to create an application group and store it in a variable by running the following command:

   ```azurecli
   hostPoolArmPath=$(az desktopvirtualization hostpool show \
       --name <Name> \
       --resource-group <ResourceGroupName> \
       --query [id] \
       --output tsv)
   ```

1. Use the `az desktopvirtualization applicationgroup create` command with the following examples to create an application group. For more information, see the [az desktopvirtualization applicationgroup Azure CLI reference](/cli/azure/desktopvirtualization/applicationgroup).

   - To create a Desktop application group, run the following command:

      ```azurecli
      az desktopvirtualization applicationgroup create \
          --name <Name> \
          --resource-group <ResourceGroupName> \
          --application-group-type Desktop \
          --host-pool-arm-path $hostPoolArmPath \
          --location <AzureRegion>
      ```

   - To create a RemoteApp application group, run the following command. You can only create a RemoteApp application group with a pooled host pool.

      ```azurecli
      az desktopvirtualization applicationgroup create \
          --name <Name> \
          --resource-group <ResourceGroupName> \
          --application-group-type RemoteApp \
          --host-pool-arm-path $hostPoolArmPath \
          --location <AzureRegion>
      ```

1. You can view the properties of your new application group by running the following command:

   ```azurecli
   az desktopvirtualization applicationgroup show \
       --name <Name> \
       --resource-group <ResourceGroupName>
   ```

---

## Add an application group to a workspace

Next, to add an application group to a workspace, select the relevant tab for your scenario and follow the steps.

# [Azure portal](#tab/portal)

Here's how to add an application group to a workspace by using the Azure portal:

1. On the Azure Virtual Desktop overview, select **Workspaces**, and then select the name of the workspace to which you want to assign an application group.

1. On the workspace overview, select **Application groups**, and then select **+ Add**.

1. In the list, select the plus icon (**+**) next to an application group. Only application groups that aren't already assigned to a workspace are listed.

1. Choose **Select**. The application group is added to the workspace.

# [Azure PowerShell](#tab/powershell)

Here's how to add an application group to a workspace by using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) Azure PowerShell module:

1. In the same PowerShell session, use the `Update-AzWvdWorkspace` cmdlet with the following example to add an application group to a workspace:

   ```azurepowershell
   # Get the resource ID of the application group that you want to add to the workspace

   $parameters = @{
       Name = '<ApplicationGroupName>'
       ResourceGroupName = '<ResourceGroupName>'
   }

   $appGroupPath = (Get-AzWvdApplicationGroup @parameters).Id

   # Add the application group to the workspace
   $parameters = @{
       Name = '<WorkspaceName>'
       ResourceGroupName = '<ResourceGroupName>'
       ApplicationGroupReference = $appGroupPath
   }

   Update-AzWvdWorkspace @parameters
   ```

1. You can view the properties of your workspace by running the following command. The key `ApplicationGroupReference` contains an array of the application groups added to the workspace.

   ```azurepowershell
   $parameters = @{
       Name = '<WorkspaceName>'
       ResourceGroupName = '<ResourceGroupName>'
   }

   Get-AzWvdWorkspace @parameters | FL *
   ```

# [Azure CLI](#tab/cli)

Here's how to add an application group to a workspace by using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for the Azure CLI:

1. In the same CLI session, use the `az desktopvirtualization workspace update` command with the following example to add an application group to a workspace:

   ```azurecli
   # Get the resource ID of the application group that you want to add to the workspace
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

1. You can view the properties of your workspace by running the following command. The key `applicationGroupReferences` contains an array of the application groups added to the workspace.

   ```azurecli
   az desktopvirtualization applicationgroup show \
       --name <Name> \
       --resource-group <ResourceGroupName>
   ```

---

## Assign users to an application group

Finally, to assign users or user groups to an application group, select the relevant tab for your scenario and follow the steps. We recommend that you assign user groups to application groups to make ongoing management simpler.

The account you use needs permission to assign roles in Azure RBAC on the application group after it's created. The permission is `Microsoft.Authorization/roleAssignments/write`, which is included in some built-in roles, such as [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) and [Owner](../role-based-access-control/built-in-roles.md#owner).

# [Azure portal](#tab/portal)

Here's how to assign users or user groups to an application group by using the Azure portal:

1. On the Azure Virtual Desktop overview, select **Application groups**.

1. Select the application group from the list.

1. On the application group overview, select **Assignments**.

1. Select **+ Add**, and then search for and select the user account or user group that you want to assign to this application group.

1. Finish by choosing **Select**.

# [Azure PowerShell](#tab/powershell)

Here's how to assign users or user groups to an application group by using the [Az.Resources](/powershell/module/az.resources) Azure PowerShell module.

In the same PowerShell session, use the `New-AzRoleAssignment` cmdlet with the following examples to assign users or user groups to an application group:

- To assign users to the application group, run the following commands:

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

- To assign user groups to the application group, run the following commands:

  ```azurepowershell
  # Get the object ID of the user group that you want to assign to the application group
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

Here's how to assign users or user groups to an application group by using the [role](/cli/azure/role/assignment) extension for the Azure CLI.

In the same CLI session, use the `az role assignment create` command with the following examples to assign users or user groups to an application group:

- To assign users to the application group, run the following commands:

  ```azurecli
  # Get the resource ID of the application group that you want to add to the workspace
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

- To assign user groups to the application group, run the following commands:

  ```azurecli
  # Get the resource ID of the application group that you want to add to the workspace
  appGroupPath=$(az desktopvirtualization applicationgroup show \
      --name <Name> \
      --resource-group <ResourceGroupName> \
      --query [id] \
      --output tsv)

  # Get the object ID of the user group that you want to assign to the application group
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

## Related content

# [Azure portal](#tab/portal)

After you deploy Azure Virtual Desktop, your users can connect from several platforms, including a web browser. For more information, see [Remote Desktop clients for Azure Virtual Desktop](users/remote-desktop-clients-overview.md) and [Connect to Azure Virtual Desktop with the Remote Desktop Web client](users/connect-web.md).

Here are some extra tasks that you might want to do:

- [Configure profile management for Azure Virtual Desktop by using FSLogix profile containers](fslogix-profile-containers.md)
- [Add session hosts to a host pool](add-session-hosts-host-pool.md)
- [Enable diagnostic settings](diagnostics-log-analytics.md)

# [Azure PowerShell](#tab/powershell)

After you deploy a host pool, workspace, and application group, you need to create session hosts before your users can connect. Follow the steps in [Add session hosts to a host pool](add-session-hosts-host-pool.md).

Here are some extra tasks that you might want to do:

- [Configure profile management for Azure Virtual Desktop by using FSLogix profile containers](fslogix-profile-containers.md)
- [Enable diagnostic settings](diagnostics-log-analytics.md)

# [Azure CLI](#tab/cli)

After you deploy a host pool, workspace, and application group, you need to create session hosts before your users can connect. Follow the steps in [Add session hosts to a host pool](add-session-hosts-host-pool.md).

Here are some extra tasks that you might want to do:

- [Configure profile management for Azure Virtual Desktop by using FSLogix profile containers](fslogix-profile-containers.md)
- [Enable diagnostic settings](diagnostics-log-analytics.md)
