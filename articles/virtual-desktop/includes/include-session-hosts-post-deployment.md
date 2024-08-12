---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 04/17/2024
---

#### Licensing

To ensure that your session hosts have licenses applied correctly, you need to do the following tasks:

- If you have the correct licenses to run Azure Virtual Desktop workloads, you can apply a Windows or Windows Server license to your session hosts as part of Azure Virtual Desktop and run them without paying for a separate license. This license is automatically applied when you create session hosts by using the Azure Virtual Desktop service, but you might have to apply the license separately if you create session hosts outside Azure Virtual Desktop. For more information, see [Apply a Windows license to session host virtual machines](../apply-windows-license.md).

- If your session hosts are running a Windows Server OS, you also need to issue them a Remote Desktop Services (RDS) client access license (CAL) from an RDS license server. For more information, see [License your RDS deployment with client access licenses](/windows-server/remote/remote-desktop-services/rds-client-access-license).

- For session hosts on Azure Stack HCI, you must license and activate the virtual machines before you use them with Azure Virtual Desktop. For activating VMs that use Windows 10 Enterprise multi-session, Windows 11 Enterprise multi-session, and Windows Server 2022 Datacenter: Azure Edition, use [Azure verification for VMs](/azure-stack/hci/deploy/azure-verification). For all other OS images (such as Windows 10 Enterprise, Windows 11 Enterprise, and other editions of Windows Server), you should continue to use existing activation methods. For more information, see [Activate Windows Server VMs on Azure Stack HCI](/azure-stack/hci/manage/vm-activate).

> [!NOTE]
> To ensure continued functionality, update your VMs on Azure Stack HCI to the latest cumulative update by June 17, 2024. This update is essential for VMs to continue using Azure benefits. For more information, see [Azure verification for VMs](/azure-stack/hci/deploy/azure-verification?tabs=wac#benefits-available-on-azure-stack-hci).

<a name='azure-ad-joined-session-hosts'></a>

#### Microsoft Entra joined session hosts

For session hosts on Azure that are joined to Microsoft Entra ID, you also need to enable single sign-on or earlier authentication protocols, assign an RBAC role to users, and review your multifactor authentication policies so that users can sign in to the VMs. For more information, see [Microsoft Entra joined session hosts](../azure-ad-joined-session-hosts.md).
