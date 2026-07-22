---
title: Enable Microsoft Entra Kerberos Authentication for Azure Files on macOS with Platform SSO (preview)
description: Learn how to configure Microsoft Entra Kerberos authentication for SMB Azure file shares on macOS devices using Platform Single Sign-On (SSO). Once configured, macOS users can access Azure file shares seamlessly without being prompted for credentials.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 05/27/2026
ms.author: kendownie
# Customer intent: As a storage administrator, I want to enable Microsoft Entra Kerberos authentication for SMB Azure file shares on macOS devices using Platform SSO, so that macOS users can mount and access Azure file shares without being prompted for credentials.
---

# Enable Microsoft Entra Kerberos authentication for Azure Files on macOS with Platform SSO (preview)

**Applies to:** :heavy_check_mark: SMB file shares

This article explains how to configure Microsoft Entra Kerberos authentication for Azure Files on macOS devices by using [macOS Platform Single Sign-On (PSSO)](/entra/identity/devices/macos-psso) (preview). By using this configuration, Microsoft Entra joined macOS devices can access SMB Azure file shares seamlessly by using cloud-based Kerberos Ticket Granting Tickets (TGTs), without prompting users for credentials.

macOS Platform SSO integrates Mac devices with Microsoft Entra ID and enables users to sign in with their Microsoft Entra ID credentials by using a hardware-bound key, smart card, or Microsoft Entra ID password. In addition to the Platform SSO Primary Refresh Token (PRT), Microsoft Entra ID issues a cloud Kerberos TGT, which is shared with the native macOS Kerberos stack through TGT mapping in PSSO. On-premises Kerberos TGTs can also be obtained when the client is configured (for example, via Intune) to query on-premises domain controllers. This configuration enables seamless single sign-on to Azure Files without prompting users for interactive credentials.

For more information about Microsoft Entra Kerberos authentication for Azure Files, see [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md#microsoft-entra-kerberos).

## Prerequisites

Before configuring Azure Files access on macOS by using Platform SSO, complete the following prerequisites.

### macOS device requirements

- macOS Tahoe 26.5 or later with the latest updates installed.
- [Microsoft Intune Company Portal](/mem/intune/apps/apps-company-portal-macos) version 5.2408.0 or later installed on the device.
- The macOS device must be enrolled in a mobile device management (MDM) solution.
- macOS Platform SSO must already be configured and deployed to devices. If you didn't configure Platform SSO, refer to the [Platform SSO documentation](/entra/identity/devices/macos-psso) for general information or the [Intune deployment guide](/mem/intune/configuration/platform-sso-macos) for step-by-step instructions before continuing.

### Azure Files requirements

- Microsoft Entra Kerberos authentication must be enabled on your Azure storage account. If you didn't enable this feature, follow the instructions in [Enable Microsoft Entra Kerberos authentication for hybrid and cloud-only identities on Azure Files](storage-files-identity-auth-hybrid-identities-enable.md).
- Admin consent must be granted to the service principal registered by enabling Microsoft Entra Kerberos. For instructions, see [Grant admin consent to the new service principal](storage-files-identity-auth-hybrid-identities-enable.md#grant-admin-consent-to-the-new-service-principal).
- Multifactor authentication (MFA) must be disabled for the Entra app representing the storage account. For instructions, see [Disable multifactor authentication on the storage account](storage-files-identity-auth-hybrid-identities-enable.md#disable-multifactor-authentication-on-the-storage-account).

### Permissions and tooling requirements

To run the app registration update script described in this article, you need:

- PowerShell 5.1 or PowerShell 7.x.
- The **Microsoft.Graph.Applications** PowerShell module. If you don't have this module installed, run `Install-Module Microsoft.Graph.Applications -Scope CurrentUser`.
- Either the **Application Administrator** or **Global Administrator** Microsoft Entra role, with **Application.ReadWrite.All** Microsoft Graph API permission.

## Update the app registration identifier URI

This step is only required if you have existing file shares in the storage account. It doesn't apply to newly created file shares. If there are no existing file shares in the storage account, you can skip this step.

In order for macOS clients to access existing Azure file shares by using Microsoft Entra Kerberos with Platform SSO, you must update the `CIFS` identifier URI to lowercase `cifs`, or the file share mount fails.

When you enable a storage account for Microsoft Entra Kerberos authentication, the system automatically registers a Microsoft Entra application with identifier URIs that include a `CIFS/<storageaccount>.file.core.windows.net` prefix. macOS requires the `cifs` prefix to be **lowercase** when mounting an SMB file share by using Kerberos. If any identifier URI contains the uppercase `CIFS` prefix, macOS clients can't authenticate and mount the share.

To update the identifier URI, use the PowerShell script provided in the [Azure Files samples repository](https://github.com/Azure-Samples/azure-files-samples/blob/master/update-app-manifest/updateappmanifestazurefiles.ps1). The script updates identifier URIs in app registrations from `CIFS/<storageaccount>.file.core.windows.net` to `cifs/<storageaccount>.file.core.windows.net`. It supports both single-app and bulk updates through a CSV file, and it creates an audit log of all changes.

> [!TIP]
> Run the script with the `-WhatIf` parameter first to preview changes without applying them.

### Update a single app registration

Replace `<app-registration-id>` with the app registration ID for your storage account. To find this ID, go to **Microsoft Entra ID** > **App registrations** > **All applications** and search for your storage account name.

```powershell
.\updateappmanifestazurefiles.ps1 -AppId "<app-registration-id>"
```

To generate an audit log, specify the `-OutputFile` parameter:

```powershell
.\updateappmanifestazurefiles.ps1 -AppId "<app-registration-id>" -OutputFile "C:\audit\output.csv"
```

### Update multiple app registrations

Create a CSV file with an `AppId` column header containing the app registration IDs for each storage account you want to update. For example:

```
AppId
12345678-1234-1234-1234-123456789012
87654321-4321-4321-4321-210987654321
```

Then run the script with the `-CsvFilePath` parameter:

```powershell
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outputFile = "C:\audit\production_update_$timestamp.csv"
.\updateappmanifestazurefiles.ps1 -CsvFilePath "C:\apps.csv" -OutputFile $outputFile
```

> [!NOTE]
> The script processes apps in batches of 50, with a 100ms delay between apps and a 2-second delay between batches. It works with up to 20,000 apps. For large runs, test with a small subset first and review the audit log before running at scale.

### Verify the update

After running the script, verify that the identifier URI was updated successfully.

1. In the [Azure portal](https://portal.azure.com), open **Microsoft Entra ID**.
1. Under **Manage**, select **App registrations** > **All applications**.
1. Search for your storage account name and select the matching application.
1. Under **Manage**, select **Manifest**.
1. Confirm that the identifier URI now shows `cifs/<storageaccount>.file.core.windows.net` in lowercase.

## Configure Kerberos SSO MDM profiles on macOS

To enable Kerberos SSO for Azure Files on macOS, deploy a Kerberos SSO MDM profile that points macOS to the Microsoft Entra ID Cloud Kerberos realm. If your users also need to access on-premises Active Directory resources via Kerberos, deploy a separate profile for the on-premises AD realm.

> [!NOTE]
> If you plan to use both Microsoft Entra ID Cloud Kerberos and on-premises Active Directory realms, deploy the on-premises Active Directory profile before the Microsoft Entra ID Cloud Kerberos profile.

### Configure the Microsoft Entra ID Cloud Kerberos profile

Use the following settings to configure the Microsoft Entra ID Cloud Kerberos MDM profile. Replace all placeholder values with the correct values for your tenant.

| Configuration Key | Recommended value | Note |
|---|---|---|
| `preferredKDCs` | `kkdcp://login.microsoftonline.com/<tenantId>/kerberos` | Replace `<tenantId>` with your Microsoft Entra tenant ID. You can find this value on the **Overview** page of the [Microsoft Entra admin center](https://entra.microsoft.com). |
| `PayloadOrganization` | Your organization name | |
| `Hosts` | `.windows.net` and `windows.net` | |
| `Realm` | `KERBEROS.MICROSOFTONLINE.COM` | Must be all uppercase. |

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>ExtensionData</key>
            <dict>
                <key>usePlatformSSOTGT</key>
                <true/>
                <key>performKerberosOnly</key>
                <true/>
                <key>preferredKDCs</key>
                <array>
                    <string>kkdcp://login.microsoftonline.com/<tenantId>/kerberos</string>
                </array>
            </dict>
            <key>ExtensionIdentifier</key>
            <string>com.apple.AppSSOKerberos.KerberosExtension</string>
            <key>Hosts</key>
            <array>
                <string>windows.net</string>
                <string>.windows.net</string>
            </array>
            <key>Realm</key>
            <string>KERBEROS.MICROSOFTONLINE.COM</string>
            <key>PayloadDisplayName</key>
            <string>Single Sign-On Extensions Payload for Microsoft Entra ID Cloud Kerberos</string>
            <key>PayloadIdentifier</key>
            <string>com.apple.extensiblesso.00aa00aa-bb11-cc22-dd33-44ee44ee44ee</string>
            <key>PayloadType</key>
            <string>com.apple.extensiblesso</string>
            <key>PayloadUUID</key>
            <string>00aa00aa-bb11-cc22-dd33-44ee44ee44ee</string>
            <key>TeamIdentifier</key>
            <string>apple</string>
            <key>Type</key>
            <string>Credential</string>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string></string>
    <key>PayloadDisplayName</key>
    <string>Kerberos SSO Extension for macOS for Microsoft Entra ID Cloud Kerberos</string>
    <key>PayloadEnabled</key>
    <true/>
    <key>PayloadIdentifier</key>
    <string>11bb11bb-cc22-dd33-ee44-55ff55ff55ff</string>
    <key>PayloadOrganization</key>
    <string>Contoso</string>
    <key>PayloadRemovalDisallowed</key>
    <true/>
    <key>PayloadScope</key>
    <string>System</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>11bb11bb-cc22-dd33-ee44-55ff55ff55ff</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>
```

Save this configuration by using a text editor with the `.mobileconfig` file extension (for example, `cloud-kerberos.mobileconfig`) after updating the values for your environment.

> [!NOTE]
> When you set the `usePlatformSSOTGT` key to `true`, the Kerberos extension uses the TGT from Platform SSO with the same realm. When you set the `performKerberosOnly` key to `true`, the extension doesn't perform password expiration checks, external password change checks, or retrieve the user's home directory. Configure both keys in any Kerberos SSO profiles you deploy.

### Configure the on-premises Active Directory Kerberos profile (optional)

If your users also need Kerberos SSO to on-premises Active Directory resources, configure a separate MDM profile for the on-premises AD realm. Replace all references to **contoso.com** and **Contoso** with the correct values for your environment.

| Configuration Key | Recommended value | Note |
|---|---|---|
| `Hosts` | `.contoso.com` and `contoso.com` | Replace with your on-premises domain or forest name. Keep the preceding `.` character before your domain name. |
| `Realm` | `CONTOSO.COM` | Replace with your on-premises realm name. Must be all uppercase. |
| `PayloadOrganization` | Your organization name | |

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>ExtensionData</key>
            <dict>
                <key>allowPasswordChange</key>
                <true/>
                <key>allowPlatformSSOAuthFallback</key>
                <true/>
                <key>performKerberosOnly</key>
                <true/>
                <key>pwReqComplexity</key>
                <true/>
                <key>syncLocalPassword</key>
                <false/>
                <key>usePlatformSSOTGT</key>
                <true/>
            </dict>
            <key>ExtensionIdentifier</key>
            <string>com.apple.AppSSOKerberos.KerberosExtension</string>
            <key>Hosts</key>
            <array>
                <string>.contoso.com</string>
                <string>contoso.com</string>
            </array>
            <key>Realm</key>
            <string>CONTOSO.COM</string>
            <key>PayloadDisplayName</key>
            <string>Single Sign-On Extensions Payload for On-Premises</string>
            <key>PayloadIdentifier</key>
            <string>com.apple.extensiblesso.1aaaaaa1-2bb2-3cc3-4dd4-5eeeeeeeeee5</string>
            <key>PayloadType</key>
            <string>com.apple.extensiblesso</string>
            <key>PayloadUUID</key>
            <string>1aaaaaa1-2bb2-3cc3-4dd4-5eeeeeeeeee5</string>
            <key>TeamIdentifier</key>
            <string>apple</string>
            <key>Type</key>
            <string>Credential</string>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string></string>
    <key>PayloadDisplayName</key>
    <string>Kerberos SSO Extension for macOS for On-Premises</string>
    <key>PayloadEnabled</key>
    <true/>
    <key>PayloadIdentifier</key>
    <string>2bbbbbb2-3cc3-4dd4-5ee5-6ffffffffff6</string>
    <key>PayloadOrganization</key>
    <string>Contoso</string>
    <key>PayloadRemovalDisallowed</key>
    <true/>
    <key>PayloadScope</key>
    <string>System</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>2bbbbbb2-3cc3-4dd4-5ee5-6ffffffffff6</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>
```

Save this configuration by using a text editor with the `.mobileconfig` file extension (for example, `on-prem-kerberos.mobileconfig`) after updating the values for your environment.

### Deploy the profiles by using Microsoft Intune

If you use Intune as your MDM solution, follow these steps to deploy each profile. Repeat the steps for each `.mobileconfig` file you need to deploy.

1. Sign in to the [Microsoft Intune admin center](https://go.microsoft.com/fwlink/?linkid=2109431).
1. Select **Devices** > **Configuration** > **Create** > **New policy**.
1. Enter the following properties:
   - **Platform**: Select **macOS**.
   - **Profile type**: Select **Templates**.
1. Choose the **Custom** template and select **Create**.
1. In **Basics**, enter a descriptive name for the policy, such as **macOS - Azure Files Cloud Kerberos SSO**, and an optional description. Select **Next**.
1. Enter a name in the **Custom configuration profile name** box.
1. For **Deployment channel**, select **Device channel**.
1. Select the folder icon and upload the `.mobileconfig` file you saved and customized previously.
1. Select **Next**.
1. In **Scope tags**, assign any applicable scope tags, and then select **Next**.
1. In **Assignments**, select the users or user groups that receive the profile. Platform SSO policies are user-based; don't assign the policy to devices.
1. Select **Next**, review your settings, and then select **Create**.

The settings are applied the next time each device checks for configuration updates.

## Assign share-level permissions

For each Azure file share, assign share-level permissions to the users or groups that need access. Once share-level permissions are in place, Windows ACLs on individual files and directories control fine-grained access.

To set share-level permissions, follow the instructions in [Assign share-level permissions to an identity](storage-files-identity-assign-share-level-permissions.md).

## Mount the Azure file share on macOS

After you deploy the Kerberos SSO profiles and update the app registration, macOS users can mount the Azure file share from Finder.

1. Open **Finder**.
1. From the **Go** menu, select **Connect to Server**, or press **Command+K**.
1. In the **Server Address** field, enter the SMB URL for your file share. Convert the Windows UNC path to an SMB URL by replacing `\\` with `smb://` and each `\` with `/`. For example:

   ```
   smb://<storageaccountname>.file.core.windows.net/<sharename>
   ```

1. Select **Connect**.

If the configuration is correct, the share mounts without prompting the user for credentials.

## Test and verify

After completing the configuration, verify that Kerberos tickets are being issued and that file share access works as expected.

### Verify Kerberos ticket issuance

On the macOS client, open **Terminal** and run the following command:

```console
app-sso platform -s
```

Confirm that the output includes a Kerberos ticket for the Microsoft Entra ID Cloud Kerberos realm, indicated by a `ticketKeyPath` value of **tgt_cloud**. If you also deployed the on-premises AD Kerberos profile, a second ticket with `ticketKeyPath` set to **tgt_ad** should also be present.

Verify that port 445 is open:

```console
nc -vz exampleaccount.file.core.windows.net 445
```

### Verify file share access

Attempt to mount the Azure file share from Finder using the steps in the previous section. The share should mount without prompting for interactive credentials. If a credential prompt appears, see the [troubleshooting section](#users-are-prompted-for-credentials-when-mounting-the-file-share).

## Troubleshoot

### Users are prompted for credentials when mounting the file share

If users are prompted to enter credentials when connecting to the Azure file share, verify the following conditions:

- The app registration identifier URI is updated from `CIFS/` to `cifs/` (lowercase). See [Update the app registration identifier URI](#update-the-app-registration-identifier-uri) and [Verify the update](#verify-the-update).
- The macOS device has a valid cloud Kerberos TGT, confirmed by running `app-sso platform -s` in Terminal.
- The Kerberos SSO MDM profiles are applied to the device.
- Admin consent is granted to the Azure Files app registration in Microsoft Entra ID.
- The user has share-level permissions on the Azure file share.
- MFA is disabled for the Microsoft Entra app representing the storage account.

### Script errors

| Error | Resolution |
|---|---|
| Neither `AppId` nor `CsvFilePath` specified | Specify exactly one of these parameters. |
| Invalid CSV file | Ensure the file exists, is UTF-8 encoded, has an `AppId` column header, and contains no duplicate entries. |
| Microsoft Graph API errors | Verify that you have the **Application.ReadWrite.All** permission and the **Application Administrator** or **Global Administrator** role. |
| Invalid app registration ID | Confirm the app registration ID exists in your tenant and is accessible. Clear cached credentials by using `Disconnect-MgGraph` and re-authenticate if needed. |

## Known issues

### Kerberos SSO extension menu extra

When you deploy Kerberos SSO support by using Platform SSO, the macOS Kerberos SSO extension menu bar extra appears in the menu bar. Users don't need to interact with the menu bar extra for Kerberos SSO to work. SSO functionality operates correctly even if the menu bar extra reports "Not signed in." You can instruct users to ignore the menu bar extra.


## Related content

- [Enable Microsoft Entra Kerberos authentication for hybrid and cloud-only identities on Azure Files](storage-files-identity-auth-hybrid-identities-enable.md)
- [Enable Kerberos SSO to on-premises Active Directory and Microsoft Entra ID Kerberos resources in Platform SSO](/entra/identity/devices/device-join-macos-platform-single-sign-on-kerberos-configuration)
- [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md)
- [Assign share-level permissions to an identity](storage-files-identity-assign-share-level-permissions.md)
- [Configure directory and file-level permissions over SMB](storage-files-identity-configure-file-level-permissions.md)
