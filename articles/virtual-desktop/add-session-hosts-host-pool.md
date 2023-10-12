---
title: Add session hosts to a host pool - Azure Virtual Desktop
description: Learn how to add session hosts virtual machines to a host pool in Azure Virtual Desktop.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 07/11/2023
---

# Add session hosts to a host pool

Once you've created a host pool, workspace, and an application group, you need to add session hosts to the host pool for your users to connect to. You may also need to add more session hosts for extra capacity.

You can create new virtual machines to use as session hosts and add them to a host pool natively using the Azure Virtual Desktop service in the Azure portal. Alternatively you can also create virtual machines outside of the Azure Virtual Desktop service, such as an automated pipeline, then add them as session hosts to a host pool. When using Azure CLI or Azure PowerShell you'll need to create the virtual machines outside of Azure Virtual Desktop, then add them as session hosts to a host pool separately.

This article shows you how to generate a registration key using the Azure portal, Azure CLI, or Azure PowerShell, then how to add session hosts to a host pool using the Azure Virtual Desktop service or adding them to a host pool separately.

## Prerequisites

Review the [Prerequisites for Azure Virtual Desktop](prerequisites.md) for a general idea of what's required, such as operating systems, virtual networks, and identity providers. In addition, you'll need:

- An existing host pool.

- If you have existing session hosts in the host pool, make a note of the virtual machine size, the image, and name prefix that was used. All session hosts in a host pool should be the same configuration, including the same identity provider. For example, a host pool shouldn't contain some session hosts joined to Azure AD and some session hosts joined to an Active Directory domain.

- The Azure account you use must have the following built-in role-based access control (RBAC) roles as a minimum on the resource group:

   | Action | RBAC role(s) |
   |--|--|
   | Generate a host pool registration key | [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor) |
   | Create and add session hosts using the Azure portal | [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor)<br />[Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |

   Alternatively you can assign the [Contributor](../role-based-access-control/built-in-roles.md#contributor) RBAC role.

- Don't disable [Windows Remote Management](/windows/win32/winrm/about-windows-remote-management) (WinRM) when creating and adding session hosts using the Azure portal, as it's required by [PowerShell DSC](/powershell/dsc/overview).

- If you want to use Azure CLI or Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension or the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

> [!IMPORTANT]
> If you want to create Azure Active Directory-joined session hosts, we only support this using the Azure portal with the Azure Virtual Desktop service.

## Generate a registration key

When you add session hosts to a host pool, first you'll need to generate a registration key. A registration key needs to be generated per host pool and it authorizes session hosts to join that host pool. It's only valid for the duration you specify. If an existing registration key has expired, you can also use these steps to generate a new key.

To generate a registration key, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to generate a registration key using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the name of the host pool you want to generate a registration key for.

1. On the host pool overview, select **Registration key**.

1. Select **Generate new key**, then enter an expiration date and time and select **OK**. The registration key will be created.

1. Select **Download** to download a text file containing the registration key, or copy the registration key to your clipboard to use later. You can also retrieve the registration key later by returning to the host pool overview.


# [Azure PowerShell](#tab/powershell)

Here's how to generate a registration key using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]
2. Use the `New-AzWvdRegistrationInfo` cmdlet with the following example to generate a registration key that is valid for 24 hours.

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       ExpirationTime = $((Get-Date).ToUniversalTime().AddHours(24).ToString('yyyy-MM-ddTHH:mm:ss.fffffffZ'))
   }
   
   New-AzWvdRegistrationInfo @parameters
   ```

3. Get the registration key and copy it to your clipboard to use later. You can also retrieve the registration key later by running this command again anytime while the registration key is valid.

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }
   
   (Get-AzWvdHostPoolRegistrationToken @parameters).Token
   ```

# [Azure CLI](#tab/cli)

Here's how to generate a registration key using the [desktopvirtualization](/cli/azure/desktopvirtualization) extension for Azure CLI.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]
2. Use the `az desktopvirtualization workspace update` command with the following example to generate a registration key that is valid for 24 hours.

   ```azurecli
   az desktopvirtualization hostpool update \
       --name <Name> \
       --resource-group <ResourceGroupName> \
       --registration-info expiration-time=$(date -d '+24 hours' --iso-8601=ns) registration-token-operation="Update"
   ```

3. Get the registration key and copy it to your clipboard to use later. You can also retrieve the registration key later by running this command again anytime while the registration key is valid.

   ```azurecli
   az desktopvirtualization hostpool retrieve-registration-token \
       --name <Name> \
       --resource-group <ResourceGroupName> \
       --query token --output tsv
   ```

---

## Create and register session hosts with the Azure Virtual Desktop service

You can create session hosts and register them to a host pool in a single end-to-end process with the Azure Virtual Desktop service using the Azure portal or an ARM template. You can find some example ARM templates in our [GitHub repo](https://github.com/Azure/RDS-Templates/tree/master/ARM-wvd-templates).

> [!IMPORTANT]
> If you want to create virtual machines using an alternative method outside of Azure Virtual Desktop, such as an automated pipeline, you'll need to register them separately as session hosts to a host pool. Skip to the section [Register session hosts to a host pool](#register-session-hosts-to-a-host-pool).

Here's how to create session hosts and register them to a host pool using the Azure Virtual Desktop service in the Azure portal. Make sure you're generated a registration key first.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, enter *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the name of the host pool you want to add session hosts to.

1. On the host pool overview, select **Session hosts**, then select **+ Add**.

1. The **Basics** tab will be greyed out because you're using the existing host pool. Select **Next: Virtual Machines**.

1. On the **Virtual machines** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Resource group | This automatically defaults to the same resource group as your host pool, but you can select an alternative existing one from the drop-down list. |
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
   | Network security group | Select whether you want to use a network security group (NSG).<br /><br />- **Basic** will create a new NSG for the VM NIC.<br /><br />- **Advanced** enables you to select an existing NSG. |
   | Public inbound ports | We recommend you select **No**. |
   | **Domain to join** |  |
   | Select which directory you would like to join | Select from **Azure Active Directory** or **Active Directory** and complete the relevant parameters for the option you select.<br /><br />To learn more about joining session hosts to Azure AD, see [Azure AD-joined session hosts](azure-ad-joined-session-hosts.md). |
   | **Virtual Machine Administrator account** |  |
   | Username | Enter a name to use as the local administrator account for the new session host VMs. |
   | Password | Enter a password for the local administrator account. |
   | Confirm password | Re-enter the password. |
   | **Custom configuration** |  |
   | ARM template file URL | If you want to use an extra ARM template during deployment you can enter the URL here. |
   | ARM template parameter file URL | Enter the URL to the parameters file for the ARM template. |

   Once you've completed this tab, select **Next: Tags**.

1. On the **Tags** tab, you can optionally enter any name/value pairs you need, then select **Next: Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that will be used during deployment. If validation doesn't pass, review the error message and check what you entered in each tab.

1. Select **Create**. Once your deployment is complete, the session hosts should appear in the host pool.

> [!IMPORTANT]
> Once you've added session hosts with the Azure Virtual Desktop service, skip to the section [Post deployment](#post-deployment) for some extra configuration you may need to do.

## Register session hosts to a host pool

If you created virtual machines using an alternative method outside of Azure Virtual Desktop, such as an automated pipeline, you'll need to register them separately as session hosts to a host pool. To register session hosts to a host pool, you need to install the Azure Virtual Desktop Agent and the Azure Virtual Desktop Agent Bootloader on each virtual machine and use the registration key you generated. You can register session hosts to a host pool using the agent installers' graphical user interface (GUI) or using `msiexec` from a command line. Once complete, four applications will be listed as installed applications:

- Remote Desktop Agent Boot Loader.
- Remote Desktop Services Infrastructure Agent.
- Remote Desktop Services Infrastructure Geneva Agent.
- Remote Desktop Services SxS Network Stack.

Select the relevant tab for your scenario and follow the steps.

# [GUI](#tab/gui)

1. Make sure the virtual machines you want to use as session hosts are joined to Azure Active Directory or an Active Directory domain (AD DS or Azure AD DS).

1. If your virtual machines are running a Windows Server OS, you'll need to install the *Remote Desktop Session Host* role, then restart the virtual machine. For more information, see [Install roles, role services, and features by using the add Roles and Features Wizard](/windows-server/administration/server-manager/install-or-uninstall-roles-role-services-or-features#install-roles-role-services-and-features-by-using-the-add-roles-and-features-wizard).

1. Sign in to your virtual machine as an administrator.

1. Download the Agent and the Agent Bootloader installation files using the following links You may need to unblock them; right-click each file and select **Properties**, then select **Unblock**, and finally select **OK**.

   - [Azure Virtual Desktop Agent](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RWrmXv)
   - [Azure Virtual Desktop Agent Bootloader](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RWrxrH)

   > [!TIP]
   > This is the latest downloadable version of the Azure Virtual Desktop Agent in [non-validation environments](terminology.md#validation-environment). For more information about the rollout of new versions of the agent, see [What's new in the Azure Virtual Desktop Agent](whats-new-agent.md#latest-agent-versions).

1. Run the `Microsoft.RDInfra.RDAgent.Installer-x64-<version>.msi` file to install the Remote Desktop Services Infrastructure Agent.

1. Follow the prompts and when the installer prompts for the registration token, paste it into the text box, which will appear on a single line. Select **Next**, then complete the installation.

   :::image type="content" source="media/add-session-hosts-host-pool/agent-install-token.png" alt-text="Screenshot showing where to paste the registration token" lightbox="media/add-session-hosts-host-pool/agent-install-token.png":::

1. Run the `Microsoft.RDInfra.RDAgentBootLoader.Installer-x64.msi` file to install the remaining components.

1. Follow the prompts and complete the installation.

1. After a short time, the virtual machines should now be listed as session hosts in the host pool. The status of the session hosts may initially show as **Unavailable** and if there is a newer agent version available, it will upgrade automatically.

1. Once the status of the session hosts is **Available**, restart the virtual machines.

# [Command line](#tab/cmd)

Using `msiexec` enables you to install the agent and boot loader from the command line using automated deployment tools, such as Intune or Configuration Manager from Microsoft Endpoint Manager.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

1. Make sure the virtual machines you want to use as session hosts are joined to Azure Active Directory or an Active Directory domain (AD DS or Azure AD DS).

1. If your virtual machines are running a Windows Server OS, you'll need to install the *Remote Desktop Session Host* role by running the following command as an administrator, which will also restart the virtual machines:

   ```powershell
   Install-WindowsFeature -Name RDS-RD-Server -Restart
   ```

1. Download the Agent and the Agent Bootloader installation files and unblock them by running the following commands. The files will be downloaded to the current working directory.

   ```powershell
   $uris = @(
       "https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RWrmXv"
       "https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RWrxrH"
   )

   $installers = @()
   foreach ($uri in $uris) {
       $download = Invoke-WebRequest -Uri $uri -UseBasicParsing

       $fileName = ($download.Headers.'Content-Disposition').Split('=')[1].Replace('"','')
       $output = [System.IO.FileStream]::new("$pwd\$fileName", [System.IO.FileMode]::Create)
       $output.write($download.Content, 0, $download.RawContentLength)
       $output.close()
       $installers += $output.Name
   }

   foreach ($installer in $installers) {
       Unblock-File -Path "$installer"
   }
   ```

   > [!TIP]
   > This is the latest downloadable version of the Azure Virtual Desktop Agent in [non-validation environments](terminology.md#validation-environment). For more information about the rollout of new versions of the agent, see [What's new in the Azure Virtual Desktop Agent](whats-new-agent.md#latest-agent-versions).

1. To install the Remote Desktop Services Infrastructure Agent, run the following command as an administrator:

   ```powershell
   msiexec /i Microsoft.RDInfra.RDAgent.Installer-x64-<version>.msi /quiet REGISTRATIONTOKEN=<RegistrationToken>
   ```

1. To install the remaining components, run the following command as an administrator:

   ```powershell
   msiexec /i Microsoft.RDInfra.RDAgentBootLoader.Installer-x64.msi /quiet
   ```

1. After a short time, the virtual machines should now be listed as session hosts in the host pool. The status of the session hosts may initially show as **Unavailable** and if there is a newer agent version available, it will upgrade automatically.

1. Once the status of the session hosts is **Available**, restart the virtual machines.

---

## Post deployment

After you've added session hosts to your host pool, there's some extra configuration you may need to do, which is covered in the following sections.

[!INCLUDE [include-session-hosts-post-deployment](includes/include-session-hosts-post-deployment.md)]

## Next steps

Now that you've expanded your existing host pool, you can sign in to an Azure Virtual Desktop client to test them as part of a user session. You can connect to a session with any of the following clients:

- [Connect with the Windows Desktop client](./users/connect-windows.md)
- [Connect with the web client](./users/connect-web.md)
- [Connect with the Android client](./users/connect-android-chrome-os.md)
- [Connect with the macOS client](./users/connect-macos.md)
- [Connect with the iOS client](./users/connect-ios-ipados.md)
