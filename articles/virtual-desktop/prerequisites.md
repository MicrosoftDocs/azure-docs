---
title: Prerequisites for Azure Virtual Desktop
description: Find what prerequisites you need to complete to successfully connect your users to their Windows desktops and applications.
ms.topic: overview
ms.custom: references_regions
author: dknappettmsft
ms.author: daknappe
ms.date: 09/17/2024
---
# Prerequisites for Azure Virtual Desktop

There are a few things you need to start using Azure Virtual Desktop. Here you can find what prerequisites you need to complete to successfully provide your users with desktops and applications.

At a high level, you need:

> [!div class="checklist"]
> - An Azure account with an active subscription
> - A supported identity provider
> - A supported operating system for session host virtual machines
> - Appropriate licenses
> - Network connectivity
> - A Remote Desktop client

## Azure account with an active subscription

You need an Azure account with an active subscription to deploy Azure Virtual Desktop. If you don't have one already, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

To deploy Azure Virtual Desktop, you need to assign the relevant Azure role-based access control (RBAC) roles. The specific role requirements are covered in each of the related articles for deploying Azure Virtual Desktop, which are listed in the [Next steps](#next-steps) section.

Also make sure you've registered the *Microsoft.DesktopVirtualization* resource provider for your subscription. To check the status of the resource provider and register if needed, select the relevant tab for your scenario and follow the steps.

> [!IMPORTANT]
> You must have permission to register a resource provider, which requires the `*/register/action` operation. This is included if your account is assigned the [contributor or owner role](../role-based-access-control/built-in-roles.md) on your subscription.

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Subscriptions**.

1. Select the name of your subscription.

1. Select **Resource providers**.

1. Search for **Microsoft.DesktopVirtualization**.

1. If the status is *NotRegistered*, select **Microsoft.DesktopVirtualization**, and then select **Register**.

1. Verify that the status of Microsoft.DesktopVirtualization is *Registered*.

# [Azure CLI](#tab/cli)

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Register the **Microsoft.DesktopVirtualization** resource provider by running the following command. You can run this command even if the resource provider is already registered.

   ```azurecli-interactive
   az provider register --namespace Microsoft.DesktopVirtualization
   ```

3. Verify that the parameter **RegistrationState** is set to *Registered* by running the following command:

   ```azurecli-interactive
   az provider show \
       --namespace Microsoft.DesktopVirtualization \
       --query {RegistrationState:registrationState}
   ```

# [Azure PowerShell](#tab/powershell)

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Register the **Microsoft.DesktopVirtualization** resource provider by running the following command. You can run this command even if the resource provider is already registered.

   ```azurepowershell-interactive
   Register-AzResourceProvider -ProviderNamespace Microsoft.DesktopVirtualization
   ```

3. In the output, verify that the parameters **RegistrationState** are set to *Registered*. You can also run the following command:

   ```azurepowershell-interactive
   Get-AzResourceProvider -ProviderNamespace Microsoft.DesktopVirtualization
   ```

---

## Identity

To access desktops and applications from your session hosts, your users need to be able to authenticate. [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md) is Microsoft's centralized cloud identity service that enables this capability. Microsoft Entra ID is always used to authenticate users for Azure Virtual Desktop. Session hosts can be joined to the same Microsoft Entra tenant, or to an Active Directory domain using [Active Directory Domain Services](/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) (AD DS) or [Microsoft Entra Domain Services](../active-directory-domain-services/overview.md), providing you with a choice of flexible configuration options.

### Session hosts

You need to join session hosts that provide desktops and applications to the same Microsoft Entra tenant as your users, or an Active Directory domain (either AD DS or Microsoft Entra Domain Services).

> [!NOTE]
> For Azure Local, you can only join session hosts to an Active Directory Domain Services domain. You can only join session hosts on Azure Local to an Active Directory Domain Services (AD DS) domain. This includes using [Microsoft Entra hybrid join](/entra/identity/devices/concept-hybrid-join), where you can benefit from some of the functionality provided by Microsoft Entra ID.

To join session hosts to Microsoft Entra ID or an Active Directory domain, you need the following permissions:

- For Microsoft Entra ID, you need an account that can join computers to your tenant. For more information, see [Manage device identities](../active-directory/devices/manage-device-identities.md#configure-device-settings). To learn more about joining session hosts to Microsoft Entra ID, see [Microsoft Entra joined session hosts](azure-ad-joined-session-hosts.md).

- For an Active Directory domain, you need a domain account that can join computers to your domain. For Microsoft Entra Domain Services, you would need to be a member of the [*AAD DC Administrators* group](../active-directory-domain-services/tutorial-create-instance-advanced.md#configure-an-administrative-group).

### Users

Your users need accounts that are in Microsoft Entra ID. If you're also using AD DS or Microsoft Entra Domain Services in your deployment of Azure Virtual Desktop, these accounts need to be [hybrid identities](../active-directory/hybrid/whatis-hybrid-identity.md), which means the user accounts are synchronized. You need to keep the following things in mind based on which identity provider you use:

- If you're using Microsoft Entra ID with AD DS, you need to configure [Microsoft Entra Connect](../active-directory/hybrid/whatis-azure-ad-connect.md) to synchronize user identity data between AD DS and Microsoft Entra ID.
- If you're using Microsoft Entra ID with Microsoft Entra Domain Services, user accounts are synchronized one way from Microsoft Entra ID to Microsoft Entra Domain Services. This synchronization process is automatic.

> [!IMPORTANT]
> The user account must exist in the Microsoft Entra tenant you use for Azure Virtual Desktop. Azure Virtual Desktop doesn't support [B2B](../active-directory/external-identities/what-is-b2b.md), [B2C](../active-directory-b2c/overview.md), or personal Microsoft accounts.
>
> When using hybrid identities, either the UserPrincipalName (UPN) or the Security Identifier (SID) must match across Active Directory Domain Services and Microsoft Entra ID. For more information, see [Supported identities and authentication methods](authentication.md#hybrid-identity).

### Supported identity scenarios

The following table summarizes identity scenarios that Azure Virtual Desktop currently supports:

| Identity scenario | Session hosts | User accounts |
|--|--|--|
| Microsoft Entra ID + AD DS | Joined to AD DS | In Microsoft Entra ID and AD DS, synchronized |
| Microsoft Entra ID + AD DS | Joined to Microsoft Entra ID | In Microsoft Entra ID and AD DS, synchronized |
| Microsoft Entra ID + Microsoft Entra Domain Services | Joined to Microsoft Entra Domain Services | In Microsoft Entra ID and Microsoft Entra Domain Services, synchronized |
| Microsoft Entra ID + Microsoft Entra Domain Services + AD DS | Joined to Microsoft Entra Domain Services | In Microsoft Entra ID and AD DS, synchronized |
| Microsoft Entra ID + Microsoft Entra Domain Services | Joined to Microsoft Entra ID | In Microsoft Entra ID and Microsoft Entra Domain Services, synchronized|
| Microsoft Entra-only | Joined to Microsoft Entra ID | In Microsoft Entra ID |

For more detailed information about supported identity scenarios, including single sign-on and multifactor authentication, see [Supported identities and authentication methods](authentication.md).

### FSLogix Profile Container

To use [FSLogix Profile Container](/fslogix/configure-profile-container-tutorial) when joining your session hosts to Microsoft Entra ID, you need to [store profiles on Azure Files](create-profile-container-azure-ad.yml) or [Azure NetApp Files](create-fslogix-profile-container.md) and your user accounts must be [hybrid identities](../active-directory/hybrid/whatis-hybrid-identity.md). You must create these accounts in AD DS and synchronize them to Microsoft Entra ID. To learn more about deploying FSLogix Profile Container with different identity scenarios, see the following articles:

- [Set up FSLogix Profile Container with Azure Files and Active Directory Domain Services or Microsoft Entra Domain Services](fslogix-profile-container-configure-azure-files-active-directory.md).
- [Set up FSLogix Profile Container with Azure Files and Microsoft Entra ID](create-profile-container-azure-ad.yml).
- [Set up FSLogix Profile Container with Azure NetApp Files](create-fslogix-profile-container.md)

### Deployment parameters

You need to enter the following identity parameters when deploying session hosts:

- Domain name, if using AD DS or Microsoft Entra Domain Services.
- Credentials to join session hosts to the domain.
- Organizational Unit (OU), which is an optional parameter that lets you place session hosts in the desired OU at deployment time.

> [!IMPORTANT]
> The account you use for joining a domain can't have multifactor authentication (MFA) enabled.

## Operating systems and licenses

You have a choice of operating systems (OS) that you can use for session hosts to provide desktops and applications. You can use different operating systems with different host pools to provide flexibility to your users. We support the 64-bit operating systems and SKUs in the following table lists (where supported versions and dates are inline with the [Microsoft Lifecycle Policy](/lifecycle/)), along with the licensing methods applicable for each commercial purpose:

[!INCLUDE [Operating systems and user access rights](includes/include-operating-systems-user-access-rights.md)]

To learn more about licenses you can use, including per-user access pricing, see [Licensing Azure Virtual Desktop](licensing.md).

> [!IMPORTANT]
> - The following items aren't supported for session hosts:
>   - 32-bit operating systems.
>   - N, KN, LTSC, and other editions of Windows operating systems not listed in the previous table.
>   - [Ultra disks](/azure/virtual-machines/disks-types#ultra-disks) for the OS disk type.
>   - [Ephemeral OS disks for Azure VMs](/azure/virtual-machines/ephemeral-os-disks).
>   - [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/overview).
>   - Arm64-based Azure VMs.

For Azure, you can use operating system images provided by Microsoft in the [Azure Marketplace](https://azuremarketplace.microsoft.com), or create your own custom images stored in an Azure Compute Gallery or as a managed image. Using custom image templates for Azure Virtual Desktop enables you to easily create a custom image that you can use when deploying session host virtual machines (VMs). To learn more about how to create custom images, see:

- [Custom image templates in Azure Virtual Desktop](custom-image-templates.md)
- [Store and share images in an Azure Compute Gallery](/azure/virtual-machines/shared-image-galleries).
- [Create a managed image of a generalized VM in Azure](/azure/virtual-machines/windows/capture-image-resource).

Alternatively, for Azure Local you can use operating system images from:

- Azure Marketplace. For more information, see [Create Azure Local VM image using Azure Marketplace images](/azure-stack/hci/manage/virtual-machine-image-azure-marketplace).
- Azure Storage account. For more information, see [Create Azure Local VM image using image in Azure Storage account](/azure-stack/hci/manage/virtual-machine-image-storage-account).
- A local share. For more information, see [Create Azure Local VM image using images in a local share](/azure-stack/hci/manage/virtual-machine-image-local-share).

You can deploy a virtual machines (VMs) to be used as session hosts from these images with any of the following methods:

- Automatically, as part of the [host pool setup process](create-host-pool.md?tabs=portal) in the Azure portal.
- Manually by [adding session hosts to an existing host pool](add-session-hosts-host-pool.md?tabs=portal%2Cgui) in the Azure portal.
- Programmatically, with [Azure CLI](add-session-hosts-host-pool.md?tabs=cli%2Ccmd) or [Azure PowerShell](add-session-hosts-host-pool.md?tabs=powershell%2Ccmd).

If your license entitles you to use Azure Virtual Desktop, you don't need to install or apply a separate license, however if you're using per-user access pricing for external users, you need to [enroll an Azure Subscription](remote-app-streaming/per-user-access-pricing.md). You need to make sure the Windows license used on your session hosts is correctly assigned in Azure and the operating system is activated. For more information, see [Apply Windows license to session host virtual machines](apply-windows-license.md).

For session hosts on Azure Local, you must license and activate the virtual machines you use before you use them with Azure Virtual Desktop. For activating Windows 10 and Windows 11 Enterprise multi-session, and Windows Server 2022 Datacenter: Azure Edition, use [Azure verification for VMs](/azure-stack/hci/deploy/azure-verification). For all other OS images (such as Windows 10 and Windows 11 Enterprise, and other editions of Windows Server), you should continue to use existing activation methods. For more information, see [Activate Windows Server VMs on Azure Local](/azure-stack/hci/manage/vm-activate).

> [!NOTE]
> To ensure continued functionality with the latest security update, update your VMs on Azure Local to the latest cumulative update by June 17, 2024. This update is essential for VMs to continue using Azure benefits. For more information, see [Azure verification for VMs](/azure-stack/hci/deploy/azure-verification?tabs=wac#benefits-available-on-azure-stack-hci).

> [!TIP]
> To simplify user access rights during initial development and testing, Azure Virtual Desktop supports [Azure Dev/Test pricing](https://azure.microsoft.com/pricing/dev-test/). If you deploy Azure Virtual Desktop in an Azure Dev/Test subscription, end users may connect to that deployment without separate license entitlement in order to perform acceptance tests or provide feedback.

## Network

There are several network requirements you need to meet to successfully deploy Azure Virtual Desktop. This lets users connect to their desktops and applications while also giving them the best possible user experience.

Users connecting to Azure Virtual Desktop securely establish a reverse connection to the service, which means you don't need to open any inbound ports. Transmission Control Protocol (TCP) on port 443 is used by default, however RDP Shortpath can be used for [managed networks](shortpath.md) and [public networks](shortpath-public.md) that establishes a direct User Datagram Protocol (UDP)-based transport.

To successfully deploy Azure Virtual Desktop, you need to meet the following network requirements:

- You need a virtual network and subnet for your session hosts. If you create your session hosts at the same time as a host pool, you must create this virtual network in advance for it to appear in the drop-down list. Your virtual network must be in the same Azure region as the session host.

- Make sure this virtual network can connect to your domain controllers and relevant DNS servers if you're using AD DS or Microsoft Entra Domain Services, since you need to join session hosts to the domain.

- Your session hosts and users need to be able to connect to the Azure Virtual Desktop service. These connections also use TCP on port 443 to a specific list of URLs. For more information, see [Required URL list](safe-url-list.md). You must make sure these URLs aren't blocked by network filtering or a firewall in order for your deployment to work properly and be supported. If your users need to access Microsoft 365, make sure your session hosts can connect to [Microsoft 365 endpoints](/microsoft-365/enterprise/microsoft-365-endpoints).

Also consider the following:

- Your users might need access to applications and data that is hosted on different networks, so make sure your session hosts can connect to them.

- Round-trip time (RTT) latency from the client's network to the Azure region that contains the host pools should be less than 150 ms. To see which locations have the best latency, look up your desired location in [Azure network round-trip latency statistics](../networking/azure-network-latency.md). To optimize for network performance, we recommend you create session hosts in the Azure region closest to your users.

- Use [Azure Firewall for Azure Virtual Desktop deployments](../firewall/protect-azure-virtual-desktop.md) to help you lock down your environment and filter outbound traffic.

- To help secure your Azure Virtual Desktop environment in Azure, we recommend you don't open inbound port 3389 on your session hosts. Azure Virtual Desktop doesn't require an open inbound port to be open. If you must open port 3389 for troubleshooting purposes, we recommend you use [just-in-time VM access](../security-center/security-center-just-in-time.md). We also recommend you don't assign a public IP address to your session hosts.

To learn more, see [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md).

> [!NOTE]
> To keep Azure Virtual Desktop reliable and scalable, we aggregate traffic patterns and usage to check the health and performance of the infrastructure control plane. We aggregate this information from all locations where the service infrastructure is, then send it to the US region. The data sent to the US region includes scrubbed data, but not customer data. For more information, see [Data locations for Azure Virtual Desktop](data-locations.md).

## Session host management

Consider the following points when managing session hosts:

- Don't enable any policies or configurations that disable *Windows Installer*. If you disable Windows Installer, the service can't install agent updates on your session hosts, and your session hosts won't function properly.

- If you're joining session hosts to an AD DS domain and you want to manage them using [Intune](/mem/intune/fundamentals/what-is-intune), you need to configure [Microsoft Entra Connect](../active-directory/hybrid/whatis-azure-ad-connect.md) to enable [Microsoft Entra hybrid join](../active-directory/devices/hybrid-join-plan.md).

- If you're joining session hosts to a Microsoft Entra Domain Services domain, you can't manage them using [Intune](/mem/intune/fundamentals/what-is-intune).

- If you're using Microsoft Entra join with Windows Server for your session hosts, you can't enroll them in Intune as Windows Server isn't supported with Intune. You need to use Microsoft Entra hybrid join and Group Policy from an Active Directory domain, or local Group Policy on each session host.

## Azure regions

You can deploy host pools, workspaces, and application groups in the following Azure regions. This list of regions is where the *metadata* for the host pool can be stored. However, session hosts for the user sessions can be located in any Azure region, and on-premises when using [Azure Virtual Desktop on Azure Local](azure-stack-hci-overview.md), enabling you to deploy compute resources close to your users. For more information about the types of data and locations, see [Data locations for Azure Virtual Desktop](data-locations.md).

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

Azure Virtual Desktop is also available in sovereign clouds, such as [Azure for US Government](https://azure.microsoft.com/explore/global-infrastructure/government/) and [Azure operated by 21Vianet](https://docs.azure.cn/virtual-desktop/) in China.

To learn more about the architecture and resilience of the Azure Virtual Desktop service, see [Azure Virtual Desktop service architecture and resilience](service-architecture-resilience.md).

## Connecting to a remote session

Your users need to use [Windows App](/windows-app/) or the [Remote Desktop client](users/remote-desktop-clients-overview.md) to connect to desktops and applications. You can connect from:

- Windows
- macOS
- iOS/iPadOS
- Android/Chrome OS
- Web browser

For more information, see [Get started with Windows App to connect to devices and apps](/windows-app/get-started-connect-devices-desktops-apps?pivots=azure-virtual-desktop).

> [!IMPORTANT]
> Azure Virtual Desktop doesn't support connections from the RemoteApp and Desktop Connections (RADC) client or the Remote Desktop Connection (MSTSC) client.

To learn which URLs clients use to connect and that you must allow through firewalls and internet filters, see the [Required URL list](safe-url-list.md).

## Next steps

- When you're ready to try Azure Virtual Desktop, use [quickstart to deploy a sample Azure Virtual Desktop environment](quickstart.md) with Windows 11 Enterprise multi-session.

- For a more in-depth and adaptable approach to deploying Azure Virtual Desktop, see [Deploy Azure Virtual Desktop](create-host-pool.md).
