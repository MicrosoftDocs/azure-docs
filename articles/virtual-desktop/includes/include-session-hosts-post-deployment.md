---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 11/14/2023
---

### Licensing

To ensure your session hosts have licenses applied correctly, you'll need to do the following tasks:

- If you have the correct licenses to run Azure Virtual Desktop workloads, you can apply a Windows or Windows Server license to your session hosts as part of Azure Virtual Desktop and run them without paying for a separate license. This is automatically applied when creating session hosts with the Azure Virtual Desktop service, but you may have to apply the license separately if you create session hosts outside of Azure Virtual Desktop. For more information, see [Apply a Windows license to session host virtual machines](../apply-windows-license.md).

- If your session hosts are running a Windows Server OS, you'll also need to issue them a Remote Desktop Services (RDS) Client Access License (CAL) from a Remote Desktop Licensing Server. For more information, see [License your RDS deployment with client access licenses (CALs)](/windows-server/remote/remote-desktop-services/rds-client-access-license).

<a name='azure-ad-joined-session-hosts'></a>

### Microsoft Entra joined session hosts

For more information about using session hosts joined to Microsoft Entra ID, see [Microsoft Entra joined session hosts](../azure-ad-joined-session-hosts.md).