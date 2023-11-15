---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 11/06/2023
---

### Licensing

To ensure your session hosts have licenses applied correctly, you'll need to do the following tasks:

- If you have the correct licenses to run Azure Virtual Desktop workloads, you can apply a Windows or Windows Server license to your session hosts as part of Azure Virtual Desktop and run them without paying for a separate license. This is automatically applied when creating session hosts with the Azure Virtual Desktop service, but you may have to apply the license separately if you create session hosts outside of Azure Virtual Desktop. For more information, see [Apply a Windows license to session host virtual machines](../apply-windows-license.md).

- If your session hosts are running a Windows Server OS, you'll also need to issue them a Remote Desktop Services (RDS) Client Access License (CAL) from a Remote Desktop Licensing Server. For more information, see [License your RDS deployment with client access licenses (CALs)](/windows-server/remote/remote-desktop-services/rds-client-access-license).

- For session hosts on Azure Stack HCI, you must license and activate the virtual machines you use for your session hosts on Azure Stack HCI before you use them with Azure Virtual Desktop. For activating Windows 10 and Windows 11 Enterprise multi-session, and Windows Server 2022 Datacenter: Azure Edition, you need to enable [Azure Benefits on Azure Stack HCI](/azure-stack/hci/manage/azure-benefits). Once Azure Benefits is enabled on Azure Stack HCI 23H2, Windows 11 Enterprise multi-session, and Windows Server 2022 Datacenter: Azure Edition are activated automatically. For all other OS images (such as Windows 10 and Windows 11 Enterprise, and other editions of Windows Server), you should continue to use existing activation methods. For more information, see [Activate Windows Server VMs on Azure Stack HCI](/azure-stack/hci/manage/vm-activate).

<a name='azure-ad-joined-session-hosts'></a>

### Microsoft Entra joined session hosts

If your users are going to connect to session hosts joined to Microsoft Entra ID, you'll need to do the following tasks:

- If your users are going to connect to session hosts joined to Microsoft Entra ID, you must assign them the [*Virtual Machine User Login*](../../role-based-access-control/built-in-roles.md#virtual-machine-user-login) or [*Virtual Machine Administrator Login*](../../role-based-access-control/built-in-roles.md#virtual-machine-administrator-login) RBAC role either on each virtual machine, the resource group containing the virtual machines, or the subscription. We recommend you assign the *Virtual Machine User Login* RBAC role on the resource group containing your session hosts to the same user group as you assign to the application group. For more information, see [Log in to a Windows virtual machine in Azure by using Microsoft Entra ID](../../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#configure-role-assignments-for-the-vm).

- For users connecting from Windows devices that aren't joined to Microsoft Entra ID or non-Windows devices, add the custom RDP property `targetisaadjoined:i:1` to the host pool's RDP properties. These connections are restricted to entering user name and password credentials when signing in to a session host. For more information, see [Customize RDP properties for a host pool](../customize-rdp-properties.md).

For more information about using session hosts joined to Microsoft Entra ID, see [Microsoft Entra joined session hosts](../azure-ad-joined-session-hosts.md).
