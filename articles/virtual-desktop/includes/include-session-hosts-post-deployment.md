---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 11/15/2023
---

### Licensing

To ensure your session hosts have licenses applied correctly, you'll need to do the following tasks:

- If you have the correct licenses to run Azure Virtual Desktop workloads, you can apply a Windows or Windows Server license to your session hosts as part of Azure Virtual Desktop and run them without paying for a separate license. This is automatically applied when creating session hosts with the Azure Virtual Desktop service, but you may have to apply the license separately if you create session hosts outside of Azure Virtual Desktop. For more information, see [Apply a Windows license to session host virtual machines](../apply-windows-license.md).

- If your session hosts are running a Windows Server OS, you'll also need to issue them a Remote Desktop Services (RDS) Client Access License (CAL) from a Remote Desktop Licensing Server. For more information, see [License your RDS deployment with client access licenses (CALs)](/windows-server/remote/remote-desktop-services/rds-client-access-license).

- For session hosts on Azure Stack HCI, you must license and activate the virtual machines you use before you use them with Azure Virtual Desktop. For activating Windows 10 and Windows 11 Enterprise multi-session, and Windows Server 2022 Datacenter: Azure Edition, use [Azure verification for VMs](/azure-stack/hci/deploy/azure-verification). For all other OS images (such as Windows 10 and Windows 11 Enterprise, and other editions of Windows Server), you should continue to use existing activation methods. For more information, see [Activate Windows Server VMs on Azure Stack HCI](/azure-stack/hci/manage/vm-activate).

<a name='azure-ad-joined-session-hosts'></a>

### Microsoft Entra joined session hosts

If your users are going to connect to session hosts joined to Microsoft Entra ID, you'll also need to enable single sign-on or legacy authentication protocols, assign an RBAC role to users, and review your multifactor authentication policies so they can sign in to the VMs.

For more information about using Microsoft Entra joined session hosts, see [Microsoft Entra joined session hosts](../azure-ad-joined-session-hosts.md).
