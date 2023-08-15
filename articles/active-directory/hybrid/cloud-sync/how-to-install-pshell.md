---
title: 'Install the Azure AD Connect cloud provisioning agent using a command-line interface (CLI) and PowerShell'
description: Learn how to install the Azure AD Connect cloud provisioning agent by using PowerShell cmdlets.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/11/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Install the Azure AD Connect cloud sync provisioning agent by using a CLI and PowerShell
This article shows you how to install the Azure Active Directory (Azure AD) Connect provisioning agent by using PowerShell cmdlets.
 
>[!NOTE]
>This article deals with installing the provisioning agent by using the command-line interface (CLI). For information on how to install the Azure AD Connect provisioning agent by using the wizard, see [Install the Azure AD Connect provisioning agent](how-to-install.md).

>[!IMPORTANT]
>If you're running these commands from a headless PowerShell session (e.g., via PSRemoting) and your Entra ID administrator account requires MFA, these instructions will not work for you. 

## Prerequisites

The Windows server on which you intend to install the Azure AD cloud sync agent must have TLS 1.2 enabled. To enable TLS 1.2, follow the steps in [Prerequisites for Azure AD Connect cloud sync](../how-to-prerequisites.md#tls-requirements).

>[!IMPORTANT]
>The following installation instructions assume that all the [prerequisites](../how-to-prerequisites.md) have been met.

## Download the provisioning agent

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

 1. Sign in to the [Entra admin center](https://entra.microsoft.com).
 2. In the menu on the left, expand **Identity**, click **Show more**, expand **Hybrid management**, and select **Azure AD Connect**.
    [![Screenshot showing Azure AD Connect menu option in Entra admin center sidebar](../media/how-to-install/azure-ad-cloud-connect-cli-0.png)](../media/how-to-install/azure-ad-cloud-connect-cli-0.png)
 3. Select **Cloud Sync**.
    [![Screenshot showing AAD Connect sidebar menu with Cloud Sync highlighted](../media/how-to-install/azure-ad-cloud-connect-cli-1.png)](../media/how-to-install/azure-ad-cloud-connect-cli-1.png#lightbox)</br>
 4. Select **Agents** under *Monitor*.
 7. Click **Download on-premises agent**.
    [![Screenshot showing Download on-premises agent button](../media/how-to-install/azure-ad-cloud-connect-cli-2.png)](../media/how-to-install/azure-ad-cloud-connect-cli-2.png)
 9. On the right, click **Accept terms & download**.

## Install the provisioning agent
 1. Copy the installer, `AADConnectProvisioningAgentSetup.exe`, to the server where you intend to install the Azure AD cloud sync provisioning agent.
 2. Log in to the server as a user with Administrator privileges.
 3. Run the installer.
      - If your Entra ID tenant is in the Azure public cloud, run this cmdlet:
        ```powershell
        Start-Process "<path to AADConnectProvisioningAgentSetup.exe>" -ArgumentList "/quiet" -NoNewWindow -Wait
        ```
      - If your Entra ID tenant is in the US Government cloud, run this cmdlet instead:
        ```powershell
        Start-Process "<path to AADConnectProvisioningAgentSetup.exe>" -ArgumentList "/quiet","ENVIRONMENTNAME=AzureUSGovernment" -NoNewWindow -Wait
        ```
        > [!NOTE]
        > No output will appear on the command line. Wait until the command completes before continuing.
 4. Import the cloud sync PowerShell module.
    ```powershell
    Import-Module "C:\Program Files\Microsoft Azure AD Connect Provisioning Agent\Microsoft.CloudSync.PowerShell.dll" 
    ```
 5. Connect the provisioning agent to your Entra ID tenant.
    ```powershell
    Connect-AADCloudSyncAzureAD -Credential (Get-Credential)
    ```
      - Log in to your Entra ID tenant as a Hybrid Identity Administrator or Global Administrator.
 6. Connect the provisioning agent to a gMSA in your Active Directory domain.
      - If you haven't already created a gMSA for the provisioning agent to use, run this cmdlet to create one:
        ```powershell
        Add-AADCloudSyncGMSA -Credential (Get-Credential) 
        ```
        - Log in as a Domain Administrator in your local Active Directory domain.
      - If you've already created a gMSA for this purpose, use this cmdlet instead:
        ```powershell
        Add-AADCloudSyncGMSA -CustomGMSAName "<name of gMSA>"
        ```
 7. Add an Active Directory domain that you want to sync.
      - If you want the provisioning agent to find your domain controllers automatically, run this cmdlet:
        ```powershell
        Add-AADCloudSyncADDomain -DomainName "<domain name>" -Credential (Get-Credential) 
        ```
      - If you want to specify which domain controllers to use, run this cmdlet instead:
        ```powershell
        Add-AADCloudSyncADDomain -DomainName "<domain name>" -Credential (Get-Credential) -PreferredDomainControllers "<first DC>","<second DC>","<third DC>" 
        ```
      - Log in as a Domain Administrator in the Active Directory domain you've specified for `-DomainName`.
      - Repeat this step for every Active Directory domain you want to sync.
 8. Restart the provisioning agent.
    ```powershell
    Restart-Service -Name AADConnectProvisioningAgent  
    ```

## Enable password writeback
To enable password writeback for use by self-service password reset (SSPR), run this cmdlet:
```powershell
Set-AADCloudSyncPasswordWritebackConfiguration -Enable $true -Credential (Get-Credential)
```
  - Log in to your Entra ID tenant as a Global Administrator.

## Restrict the permissions given to provisioning agent's gMSA
Now that you've installed the agent, you can apply more granular permissions to the gMSA it uses. For more information and step-by-step instructions on how to configure its permissions, see [Azure AD Connect cloud provisioning agent gMSA PowerShell cmdlets](../how-to-gmsa-cmdlets#using-set-aadcloudsyncpermissions).


## Next steps 

- [Create a new configuration for Azure AD Connect cloud sync](../how-to-configure.md)
- [Azure AD Connect cloud provisioning agent gMSA PowerShell cmdlets](how-to-gmsa-cmdlets.md)
- [Using single sign-on with cloud sync](../how-to-sso.md)
