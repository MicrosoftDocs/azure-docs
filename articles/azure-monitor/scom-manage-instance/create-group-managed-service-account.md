---
ms.assetid: 
title: Create a computer group and group-managed service account for Azure Monitor SCOM Managed Instance
description: This article describes how to create a group-managed service account, computer group, and domain user account in on-premises Active Directory.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Create a computer group and group-managed service account for Azure Monitor SCOM Managed Instance

This article describes how to create a group-managed service account (gMSA) account, computer group, and domain user account in on-premises Active Directory.

> [!NOTE]
> To learn about the Azure Monitor SCOM Managed Instance architecture, see [Azure Monitor SCOM Managed Instance](overview.md).

## Active Directory prerequisites

To perform Active Directory operations, install the **RSAT: Active Directory Domain Services and Lightweight Directory Tools** feature. Then install the **Active Directory Users and Computers** tool. You can install this tool on any machine that has domain connectivity. You must sign in to this tool with admin permissions to perform all Active Directory operations.

### Configure a domain account in Active Directory

Create a domain account in your Active Directory instance. The domain account is a typical Active Directory account. (It can be a nonadmin account.) You use this account to add the System Center Operations Manager management servers to your existing domain.

:::image type="Active directory users" source="media/create-gmsa-account/active-directory-users.png" alt-text="Screenshot that shows Active Directory users.":::

Ensure that this account has the [permissions](/windows/security/threat-protection/security-policy-settings/add-workstations-to-domain) to join other servers to your domain. You can use an existing domain account if it has these permissions.

You use the configured domain account in later steps to create an instance of SCOM Managed Instance and subsequent steps.

### Create and configure a computer group

Create a computer group in your Active Directory instance. For more information, see [Create a group account in Active Directory](/windows/security/threat-protection/windows-firewall/create-a-group-account-in-active-directory). All the management servers that you create will be a part of this group so that all the members of the group can retrieve gMSA credentials. (You create these credentials in later steps.) The group name can't contain spaces and must have alphabet characters only.

:::image type="Active directory computers" source="media/create-gmsa-account/active-directory-computers.png" alt-text="Screenshot that shows Active Directory computers.":::

To manage this computer group, provide permissions to the domain account that you created.

1. Select the group properties, and then select **Managed By**.
1. For **Name**, enter the name of the domain account.
1. Select the **Manager can update membership list** checkbox.

     :::image type="Server group properties" source="media/create-gmsa-account/server-group-properties.png" alt-text="Screenshot that shows server group properties.":::

### Create and configure a gMSA account

Create a gMSA to run the management server services and to authenticate the services. Use the following PowerShell command to create a gMSA service account. The DNS host name can also be used to configure the static IP and associate the same DNS name to the static IP as in [step 8](create-static-ip.md).

```powershell
New-ADServiceAccount ContosogMSA -DNSHostName "ContosoLB.aquiladom.com" -PrincipalsAllowedToRetrieveManagedPassword "ContosoServerGroup" -KerberosEncryptionType AES128, AES256 -ServicePrincipalNames MSOMHSvc/ContosoLB.aquiladom.com, MSOMHSvc/ContosoLB, MSOMSdkSvc/ContosoLB.aquiladom.com, MSOMSdkSvc/ContosoLB 
```

In that command:

- `ContosogMSA` is the gMSA name.
- `ContosoLB.aquiladom.com` is the DNS name for the load balancer. Use the same DNS name to create the static IP and associate the same DNS name to the static IP as in [step 8](create-static-ip.md).
- `ContosoServerGroup` is the computer group created in Active Directory (specified previously).
- `MSOMHSvc/ContosoLB.aquiladom.com`, `SMSOMHSvc/ContosoLB`, `MSOMSdkSvc/ContosoLB.aquiladom.com`, and `MSOMSdkSvc/ContosoLB` are service principal names.

> [!NOTE]
> If the gMSA name is longer than 14 characters, ensure that you set `SamAccountName` at less than 15 characters, including the `$` sign.

If the root key isn't effective, use the following command:

```powershell
Add-KdsRootKey -EffectiveTime ((get-date).addhours(-10)) 
```

Ensure that the created gMSA account is a local admin account. If there are any Group Policy Object policies on the local admins at the Active Directory level, ensure that they have the gMSA account as the local admin.

> [!IMPORTANT]
> To minimize the need for extensive communication with both your Active Directory admin and the network admin, see [Self-verification](self-verification-steps.md). The article outlines the procedures that the Active Directory admin and network admin use to validate their configuration changes and ensure their successful implementation. This process reduces unnecessary back-and-forth interactions from the Operations Manager admin to the Active Directory admin and the network admin. This configuration saves time for the admins.

## Next steps

[Store domain credentials in Azure Key Vault](store-domain-credentials-key-vault.md)