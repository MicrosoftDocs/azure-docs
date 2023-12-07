---
title: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID authentication
description: Learn how to configure single sign-on for an Azure Virtual Desktop environment using Microsoft Entra ID authentication.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 06/12/2023
---

# Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID authentication

This article walks you through the process of configuring single sign-on (SSO) for Azure Virtual Desktop using Microsoft Entra ID authentication. When you enable SSO, users will authenticate to Windows using a Microsoft Entra ID token. This token enables the use of passwordless authentication and third-party identity providers that federate with Microsoft Entra ID when connecting to a session host.

Single sign-on using Microsoft Entra ID authentication also provides a seamless experience when connecting Microsoft Entra ID-based resources inside the session. For more information on using passwordless authentication within a session, see [In-session passwordless authentication](authentication.md#in-session-passwordless-authentication).

To enable single sign-on using Microsoft Entra ID authentication, there are five tasks you must complete:

1. Enable Microsoft Entra authentication for Remote Desktop Protocol (RDP).

1. Configure the target device groups.

1. Create a *Kerberos Server object*, if Active Directory Domain Services is part of your environment. More information on the criteria is included in its section.

1. Review your conditional access policies.

1. Configure your host pool to enable single sign-on.

## Before enabling single sign-on

Before you enable single sign-on, review the following information for using it in your environment.

### Disconnection when the session is locked

When single sign-on is enabled, you sign in to Windows using a Microsoft Entra ID authentication token, which provides support for passwordless authentication to Windows. The Windows lock screen in the remote session doesn't support Microsoft Entra ID authentication tokens or passwordless authentication methods, like FIDO keys. The lack of support for these authentication methods means that users can't unlock their screens in a remote session. When you try to lock a remote session, either through user action or system policy, the session is instead disconnected and the service sends a message to the user explaining they've been disconnected.

Disconnecting the session also ensures that when the connection is relaunched after a period of inactivity, Microsoft Entra ID reevaluates any applicable conditional access policies.

### Using an Active Directory domain administrator account with single sign-on

In environments with an Active Directory Domain Services (AD DS) and hybrid user accounts, the default *Password Replication Policy* on read-only domain controllers denies password replication for members of *Domain Admins* and *Administrators* security groups. This policy prevents these administrator accounts from signing in to Microsoft Entra hybrid joined hosts and might keep prompting them to enter their credentials. It also prevents administrator accounts from accessing on-premises resources that leverage Kerberos authentication from Microsoft Entra joined hosts.

To allow these admin accounts to connect when single sign-on is enabled, see [Allowing Active Directory domain administrator accounts to connect](#allowing-active-directory-domain-administrator-accounts-to-connect).

## Prerequisites

Before you can enable single sign-on, you must meet the following prerequisites:

- To configure your Microsoft Entra tenant, you must be assigned one of the following [Microsoft Entra built-in roles](/entra/identity/role-based-access-control/manage-roles-portal):
   - [Application Administrator](/entra/identity/role-based-access-control/permissions-reference#application-administrator)
   - [Cloud Application Administrator](/entra/identity/role-based-access-control/permissions-reference#cloud-application-administrator)
   - [Global Administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator)

   You must also have one of the following [Microsoft Graph permissions](/graph/permissions-overview):
   - [Application-RemoteDesktopConfig.ReadWrite.All](/graph/permissions-reference)
   - [Application.ReadWrite.All](/graph/permissions-reference)
   - [Directory.ReadWrite.All](/graph/permissions-reference)

- Your session hosts must be running one of the following operating systems with the relevant cumulative update installed:

   - Windows 11 Enterprise single or multi-session with the [2022-10 Cumulative Updates for Windows 11 (KB5018418)](https://support.microsoft.com/kb/KB5018418) or later installed.
   - Windows 10 Enterprise single or multi-session with the [2022-10 Cumulative Updates for Windows 10 (KB5018410)](https://support.microsoft.com/kb/KB5018410) or later installed.
   - Windows Server 2022 with the [2022-10 Cumulative Update for Microsoft server operating system (KB5018421)](https://support.microsoft.com/kb/KB5018421) or later installed.

- Your session hosts must be [Microsoft Entra joined](/entra/identity/devices/concept-directory-join) or [Microsoft Entra hybrid joined](/entra/identity/devices/concept-hybrid-join). Session hosts joined to Microsoft Entra Domain Services or to Active Directory Domain Services only aren't supported.

- [Create a dynamic group in Microsoft Entra ID](/entra/identity/users/groups-create-rule) that contains all your session hosts. This group is used to configure the target device group for single sign-on.

- A supported Remote Desktop client to connect to a remote session. The following clients are supported:

   - [Windows Desktop client](users/connect-windows.md) on local PCs running Windows 10 or later. There's no requirement for the local PC to be joined to Microsoft Entra ID or an Active Directory domain.
   - [Web client](users/connect-web.md).
   - [macOS client](users/connect-macos.md), version 10.8.2 or later.
   - [iOS client](users/connect-ios-ipados.md), version 10.5.1 or later.
   - [Android client](users/connect-android-chrome-os.md), version 10.0.16 or later.

### Enable Microsoft Entra authentication for RDP

> [!IMPORTANT]
> Due to an upcoming change, the steps below should be completed for the following Microsoft Entra Apps:
> 
> - Microsoft Remote Desktop (App ID a4a365df-50f1-4397-bc59-1a1564b8bb9c).
> - Windows Cloud Login (App ID 270efc09-cd0d-444b-a71f-39af4910ec45).

Before enabling the single sign-on feature, you must first allow Microsoft Entra authentication for Windows in your Microsoft Entra tenant. This will enable issuing RDP access tokens allowing users to sign in to Azure Virtual Desktop session hosts. This is done by enabling the isRemoteDesktopProtocolEnabled property on the service principal's remoteDesktopSecurityConfiguration object for the apps listed above.

Use the [Microsoft Graph API](/graph/use-the-api) to [create remoteDesktopSecurityConfiguration](/graph/api/serviceprincipal-post-remotedesktopsecurityconfiguration) or the [PowerShell Microsoft Graph Module](https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview?view=graph-powershell-1.0) to [create remoteDesktopSecurityConfiguration](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.applications/update-mgserviceprincipalremotedesktopsecurityconfiguration?view=graph-powershell-1.0) to set the property **isRemoteDesktopProtocolEnabled** to **true**.

```powershell
#Requirements
Install-Module Microsoft.Graph.Authentication
Install-Module Microsoft.Graph.Applications

#Login to Microsoft Graph
Connect-MgGraph -Scopes Application-RemoteDesktopConfig.ReadWrite.All

#Get the service principal ID's
$MSRDspId = Get-MgServicePrincipal -Filter "DisplayName eq 'Microsoft Remote Desktop'"
$WCLspId = Get-MgServicePrincipal -Filter "DisplayName eq 'Windows Cloud Login'"

#Check status of IsRemoteDesktopProtocolEnabled flag if already enabled for the service principal ID's
Get-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $MSRDspId.Id
Get-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $WCLspId.Id

#Set the IsRemoteDesktopProtocolEnabled flag to true
Update-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $MSRDspId.Id -IsRemoteDesktopProtocolEnabled
Update-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $WCLspId.Id -IsRemoteDesktopProtocolEnabled
```

### Configure the target device groups

> [!IMPORTANT]
> Due to an upcoming change, the steps below should be completed for the following Microsoft Entra Apps:
> 
> - Microsoft Remote Desktop (App ID a4a365df-50f1-4397-bc59-1a1564b8bb9c).
> - Windows Cloud Login (App ID 270efc09-cd0d-444b-a71f-39af4910ec45).

> [!IMPORTANT]
> To complete this step, the calling user must be assigned the Application Administrator, Cloud Application Administrator, or Global Administrator [directory role](/entra/identity/role-based-access-control/permissions-reference). They must also have the Application-RemoteDesktopConfig.ReadWrite.All, Application.ReadWrite.All or Directory.ReadWrite.All [permission](/graph/permissions-reference).

By default when enabling single sign-on, users are prompted to authenticate to Microsoft Entra ID and allow the Remote Desktop connection when launching a connection to a new session host. Microsoft Entra remembers up to 15 hosts for 30 days before prompting again. If you see this dialogue, select **Yes** to connect.

To provide single sign-on for all connections, you can hide this dialog by configuring a list of trusted devices. This is done by adding one or more Device Groups containing Azure Virtual Desktop session hosts to a property on the service principals for the apps listed above in your Microsoft Entra tenant.

Follow these steps to hide the dialog:

1. [Create a Dynamic Device Group](/entra/identity/users/groups-create-rule) in Microsoft Entra containing the devices to hide the dialog for. Remember the device group ID for the next step.
    > [!TIP]
    > It's recommended to use a dynamic device group and configure the dynamic membership rules to includes all your Azure Virtual Desktop session hosts. This can be done using the device names or for a more secure option, you can set and use [device extension attributes](/graph/extensibility-overview) using [Microsoft Graph API](/graph/api/resources/device). While dynamic device groups normally update within 5-10 minutes, in some large tenant this can take up to 24 hours.
2. Use the [Microsoft Graph API](/graph/use-the-api) to [create a new targetDeviceGroup object](/graph/api/remotedesktopsecurityconfiguration-post-targetdevicegroups) or the [PowerShell Microsoft Graph Module](https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview?view=graph-powershell-1.0) to [create a new targetDeviceGroup object](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.applications/update-mgserviceprincipalremotedesktopsecurityconfiguration?view=graph-powershell-1.0) to suppress the prompt from these devices.

```powershell
#Requirements
Install-Module Microsoft.Graph.Authentication
Install-Module Microsoft.Graph.Applications

#Login to Microsoft Graph
Connect-MgGraph -Scopes Application-RemoteDesktopConfig.ReadWrite.All

#Get the service principal ID's
$MSRDspId = Get-MgServicePrincipal -Filter "DisplayName eq 'Microsoft Remote Desktop'"
$WCLspId = Get-MgServicePrincipal -Filter "DisplayName eq 'Windows Cloud Login'"

#Check if any Targetdevicegroup is already configured
Get-MgServicePrincipalRemoteDesktopSecurityConfigurationTargetDeviceGroup -ServicePrincipalId $MSRDspId.Id
Get-MgServicePrincipalRemoteDesktopSecurityConfigurationTargetDeviceGroup -ServicePrincipalId $WCLspId.Id

#Create a Targetdevicegroup Object
$tdg = New-Object -TypeName Microsoft.Graph.PowerShell.Models.MicrosoftGraphTargetDeviceGroup
$tdg.Id = "<Your Group Object Id>"
$tdg.DisplayName = "<Your Group Display Name>"

#Configure a Targetdevicegroup
New-MgServicePrincipalRemoteDesktopSecurityConfigurationTargetDeviceGroup -ServicePrincipalId $MSRDspId.Id -BodyParameter $tdg
New-MgServicePrincipalRemoteDesktopSecurityConfigurationTargetDeviceGroup -ServicePrincipalId $WCLspId.Id -BodyParameter $tdg
```

**Microsoft Graph Explorer example:**

There are multiple ways to configure the service principal using Microsoft Graph API, but an example is provided below that leverages Microsoft Graph Explorer to enable Microsoft Entra authentication and configure a target device group.

Start by giving Graph Explorer permission to update the new properties on the service principal.

1. Navigate to the [consent page](https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=de8bc8b5-d9f9-48b1-a8ad-b748da725064&response_type=code&scope=https://graph.microsoft.com/Application-RemoteDesktopConfig.ReadWrite.All) for Graph Explorer (App ID de8bc8b5-d9f9-48b1-a8ad-b748da725064).
1. Follow the prompts and check the box to Consent on behalf of your organization.
1. At the end of the flow, you might see an error page with error “AADSTS9002325: Proof Key for Code Exchange is required for cross-origin authorization code redemption”, you can ignore it as the permissions should have been consented successfully.
1. If you want to confirm:
    1. Navigate to the [Microsoft Entra ID](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview) section in the Azure Portal.
    1. Select **Enterprise applications** on the left.
    1. Remove any **Application type** filters to see all applications.
    1. Search for **Graph Explorer**.
    1. Click on the app with Application ID starting with **de8bc8b5-d9f9-48b1-a8ad-b748da725064**.
    1. Select **Permissions** on the left.
    1. Look for the **Application-RemoteDesktopConfig.ReadWrite.All** Claim value with Type = Delegated mode under the Admin Consent tab.
1. Close your browser or sign out of your account to ensure the permission changes are applied.

Repeat the steps to configure the service principal using Graph Explorer for the Microsoft Remote Desktop (App ID a4a365df-50f1-4397-bc59-1a1564b8bb9c) and the Windows Cloud Login (App ID 270efc09-cd0d-444b-a71f-39af4910ec45) apps.

1. Navigate to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
1. Sign in with your Microsoft Entra ID credentials.
1. Retrieve the object id of the service principal in your tenant:
    1. In Graph Explorer, ensure the command type is set to **GET**.
    1. Type this command in the text box: `https://graph.microsoft.com/v1.0/servicePrincipals(appID='a4a365df-50f1-4397-bc59-1a1564b8bb9c')`.
    1. Click **Run query**.
    1. Copy the **Id** attribute in the response. Use this value to replace the \<SPObjectID\> referred to in the steps below.
1. Enable issuing RDP Access Tokens.
    1. Change the command type to **PATCH**.
    1. Change the command in the text box to: `https://graph.microsoft.com/v1.0/servicePrincipals/<SPObjectID>/remoteDesktopSecurityConfiguration`, replacing the SPObjectID  with your value.
    1. Copy the following in the Request body:
        ```json
        {
          "isRemoteDesktopProtocolEnabled": true,
          "targetDeviceGroups": []
        }
        ```
    1. Click **Run query**.
1. Add the device group to the list.
    1. Change the command type to **POST**.
    1. Change the command in the text box to: `https://graph.microsoft.com/v1.0/servicePrincipals/<SPObjectID>/remoteDesktopSecurityConfiguration/targetDeviceGroups`, replacing the SPObjectID  with your value.
    1. Copy the following in the Request body, replacing the GroupObjectID with the object ID from your device group. The GroupName is for your reference and doesn’t need to match the device group name.
        ```json
        {
          "id": "<GroupObjectID>",
          "displayName": "<GroupName>"
        }
        ```
    1. Click **Run query**.
1. Check the configuration of the service principal.
    1. Change the command type to **GET**.
    1. Change the command in the text box to: `https://graph.microsoft.com/v1.0/servicePrincipals/<SPObjectID>/remoteDesktopSecurityConfiguration`, replacing the SPObjectID  with your value.
    1. Click **Run query**.
    1. You should see the following as part of the output:
        ```json
        {
          "isRemoteDesktopProtocolEnabled": true,
          "targetDeviceGroups": [
          {
            "id": "<GroupObjectID>",
            "displayName": "<GroupName>"
          }
          ]
        }
        ```

If you later need to remove a device group using Graph Explorer.

1. Navigate to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
1. Sign in with your Microsoft Entra ID credentials.
1. Retrieve the object id of the service principal in your tenant:
    1. In Graph Explorer, ensure the command type is set to **GET**.
    1. Type this command in the text box: `https://graph.microsoft.com/v1.0/servicePrincipals(appID='a4a365df-50f1-4397-bc59-1a1564b8bb9c')`.
    1. Click **Run query**.
    1. Copy the **Id** attribute in the response. Use this value to replace the \<SPObjectID\> referred to in the steps below.
1. Remove the device group from the list.
    1. Change the command type to **DELETE**.
    1. Change the command in the text box to: `https://graph.microsoft.com/v1.0/servicePrincipals/<SPObjectID>/remoteDesktopSecurityConfiguration/targetDeviceGroups/<GroupObjectID>`, replacing the SPObjectID  with your value and the GroupObjectID with the object ID from your device group.
    1. Click **Run query**.

### Create a Kerberos Server object

You must [Create a Kerberos Server object](../active-directory/authentication/howto-authentication-passwordless-security-key-on-premises.md#create-a-kerberos-server-object) if your session host meets the following criteria:

- Your session host is Microsoft Entra hybrid joined. You must have a Kerberos Server object to complete authentication to the domain controller.
- Your session host is Microsoft Entra joined and your environment contains Active Directory Domain Controllers. You must have a Kerberos Server object for users to access on-premises resources, such as SMB shares, and Windows-integrated authentication to websites.

> [!IMPORTANT]
> If you enable SSO on your Microsoft Entra hybrid joined VMs before you create a Kerberos server object, one of the following things can happen: 
>
> - You receive an error message saying the specific session doesn't exist.
> - SSO will be skipped and you'll see a standard authentication dialog for the session host. 
>
> To resolve these issues, create the Kerberos server object before trying to connect again.

### Review your conditional access policies

When single sign-on is enabled, a new Microsoft Entra ID app is introduced to authenticate users to the session host. If you have conditional access policies that apply when accessing Azure Virtual Desktop, review the recommendations on setting up [multifactor authentication](set-up-mfa.md) to ensure users have the desired experience.

### Configure your host pool

To enable SSO on your host pool, you must configure the following RDP property, which you can do using the Azure portal or PowerShell. You can find the steps to do this in [Customize Remote Desktop Protocol (RDP) properties for a host pool](customize-rdp-properties.md).

- In the Azure portal, set **Microsoft Entra single sign-on** to **Connections will use Microsoft Entra authentication to provide single sign-on**.
- For PowerShell, set the **enablerdsaadauth** property to **1**.

## Allowing Active Directory domain administrator accounts to connect

To allow Active Directory domain administrator accounts to connect when single sign-on is enabled:

1. On a device that you use to manage your Active Directory domain, open the **Active Directory Users and Computers** console using an account that is a member of the **Domain Admins** security group.
1. Open the **Domain Controllers** folder for your tenant.
1. Find the **AzureADKerberos** object, then right-click it and select **Properties**.
1. Select the **Password Replication Policy** tab.
1. Change the policy for **Domain Admins** from *Deny* to *Allow*.
1. Delete the policy for **Administrators**. The Domain Admins group is a member of the Administrators group, so denying replication for administrators also denies it for domain admins.
1. Select **OK** to save your changes.


## Next steps

- Check out [In-session passwordless authentication](authentication.md#in-session-passwordless-authentication) to learn how to enable passwordless authentication.
- For more information about Microsoft Entra Kerberos, see [Deep dive: How Microsoft Entra Kerberos works](https://techcommunity.microsoft.com/t5/itops-talk-blog/deep-dive-how-azure-ad-kerberos-works/ba-p/3070889)
- If you're accessing Azure Virtual Desktop from our Windows Desktop client, see [Connect with the Windows Desktop client](./users/connect-windows.md).
- If you're accessing Azure Virtual Desktop from our web client, see [Connect with the web client](./users/connect-web.md).
- If you encounter any issues, go to [Troubleshoot connections to Microsoft Entra joined VMs](troubleshoot-azure-ad-connections.md).
