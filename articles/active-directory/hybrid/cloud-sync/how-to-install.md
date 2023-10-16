---
title: 'Install the Microsoft Entra Provisioning Agent'
description: Learn how to install the Microsoft Entra Provisioning Agent and how to configure it in the Microsoft Entra admin center.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/20/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Install the Microsoft Entra Provisioning Agent

This article walks you through the installation process for the Microsoft Entra Provisioning Agent and how to initially configure it in the Microsoft Entra admin center.

> [!IMPORTANT]
> The following installation instructions assume that you've met all the [prerequisites](how-to-prerequisites.md).

>[!NOTE]
>This article deals with installing the provisioning agent by using the wizard. For information about installing the Microsoft Entra Provisioning Agent by using a CLI, see [Install the Microsoft Entra Provisioning Agent by using a CLI and PowerShell](how-to-install-pshell.md).

For more information and an example, view the following video:

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWK5mR]

## Group Managed Service Accounts
A group Managed Service Account (gMSA) is a managed domain account that provides automatic password management, simplified service principal name (SPN) management, and the ability to delegate the management to other administrators. A gMSA also extends this functionality over multiple servers. Microsoft Entra Cloud Sync supports and recommends the use of a gMSA for running the agent. For more information, see [Group Managed Service Accounts](how-to-prerequisites.md#group-managed-service-accounts).


### Update an existing agent to use the gMSA
To update an existing agent to use the Group Managed Service Account created during installation, upgrade the agent service to the latest version by running *AADConnectProvisioningAgent.msi*. Now run through the installation wizard again and provide the credentials to create the account when you're prompted to do so.

## Install the agent

[!INCLUDE [active-directory-cloud-sync-how-to-install](../../../../includes/active-directory-cloud-sync-how-to-install.md)]

## Verify the agent installation

[!INCLUDE [active-directory-cloud-sync-how-to-verify-installation](../../../../includes/active-directory-cloud-sync-how-to-verify-installation.md)]

>[!IMPORTANT]
> After you've installed the agent, you must configure and enable it before it will start synchronizing users. To configure a new agent, see [Create a new configuration for Microsoft Entra Cloud Sync](how-to-configure.md).



## Enable password writeback in cloud sync 

You can enable password writeback in SSPR directly in the portal or through PowerShell. 

### Enable password writeback in the portal
To use *password writeback* and enable the self-service password reset (SSPR) service to detect the cloud sync agent, using the portal, complete the following steps: 

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Hybrid Identity Administrator](../../roles/permissions-reference.md#hybrid-identity-administrator).
 2. On the left, select **Protection**, select **Password reset**, then choose **On-premises integration**.
 3. Check the option for **Enable password write back for synced users** .
 4. (optional) If Microsoft Entra Connect provisioning agents are detected, you can additionally check the option for **Write back passwords with Microsoft Entra Cloud Sync**.   
 5. Check the option for **Allow users to unlock accounts without resetting their password** to *Yes*.
 6. When ready, select **Save**.

### Using PowerShell

To use *password writeback* and enable the self-service password reset (SSPR) service to detect the cloud sync agent, use the `Set-AADCloudSyncPasswordWritebackConfiguration` cmdlet and the tenant’s global administrator credentials: 

  ```   
   Import-Module "C:\\Program Files\\Microsoft Azure AD Connect Provisioning Agent\\Microsoft.CloudSync.Powershell.dll" 
   Set-AADCloudSyncPasswordWritebackConfiguration -Enable $true -Credential $(Get-Credential)
  ```

For more information about using password writeback with Microsoft Entra Cloud Sync, see [Tutorial: Enable cloud sync self-service password reset writeback to an on-premises environment (preview)](../../../active-directory/authentication/tutorial-enable-cloud-sync-sspr-writeback.md).

## Install an agent in the US government cloud

By default, the Microsoft Entra Provisioning Agent is installed in the default Azure environment. If you're installing the agent for US government use, make this change in step 7 of the preceding installation procedure:

- Instead of selecting **Open file**, select **Start** > **Run**, and then go to the *AADConnectProvisioningAgentSetup.exe* file.  In the **Run** box, after the executable, enter **ENVIRONMENTNAME=AzureUSGovernment**, and then select **OK**.

    [![Screenshot that shows how to install an agent in the US government cloud.](media/how-to-install/new-install-12.png)](media/how-to-install/new-install-12.png#lightbox)

## Password hash synchronization and FIPS with cloud sync

If your server has been locked down according to the Federal Information Processing Standard (FIPS), MD5 (message-digest algorithm 5) is disabled.

To enable MD5 for password hash synchronization, do the following:

1. Go to %programfiles%\Microsoft Azure AD Connect Provisioning Agent.
1. Open *AADConnectProvisioningAgent.exe.config*.
1. Go to the configuration/runtime node at the top of the file.
1. Add the `<enforceFIPSPolicy enabled="false"/>` node.
1. Save your changes.

For reference, your code should look like the following snippet:

```xml
<configuration>
   <runtime>
      <enforceFIPSPolicy enabled="false"/>
   </runtime>
</configuration>
```

For information about security and FIPS, see [Microsoft Entra password hash sync, encryption, and FIPS compliance](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/aad-password-sync-encryption-and-fips-compliance/ba-p/243709).

## Next steps 

- [What is provisioning?](../what-is-provisioning.md)
- [What is Microsoft Entra Cloud Sync?](what-is-cloud-sync.md)
- [Create a new configuration for Microsoft Entra Cloud Sync](how-to-configure.md).
