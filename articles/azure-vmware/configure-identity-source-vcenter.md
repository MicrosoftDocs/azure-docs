---
title: Configure external identity source for vCenter
description:  Learn how to configure Active Directory over LDAP or LDAPS for vCenter as an external identity source.
ms.topic: how-to
ms.date: 08/31/2021



---

# Configure external identity source for vCenter



[!INCLUDE [vcenter-access-identity-description](includes/vcenter-access-identity-description.md)]

>[!NOTE]
>Run commands are executed one at a time in the order submitted.

In this how-to, you learn how to:

> [!div class="checklist"]
> * List all existing external identity sources integrated with vCenter SSO
> * Add Active Directory over LDAP, with or without SSL 
> * Add existing AD group to cloudadmin group
> * Remove AD group from the cloudadmin role
> * Remove existing external identity sources



## Prerequisites

- Establish connectivity from your on-premises network to your private cloud.

- If you have AD with SSL, download the certificate for AD authentication and upload it to an Azure Storage account as blob storage. Then, you'll need to [grant access to Azure Storage resources using shared access signature (SAS)](../storage/common/storage-sas-overview.md).  

- If you use FQDN, enable DNS resolution on your on-premises AD.

 

## List external identity



You'll run the `Get-ExternalIdentitySources` cmdlet to list all external identity sources already integrated with vCenter SSO.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Run command** > **Packages** > **Get-ExternalIdentitySources**.

   :::image type="content" source="media/run-command/run-command-overview.png" alt-text="Screenshot showing how to access the run commands available." lightbox="media/run-command/run-command-overview.png":::

1. Provide the required values or change the default values, and then select **Run**.

   :::image type="content" source="media/run-command/run-command-get-external-identity-sources.png" alt-text="Screenshot showing how to list external identity source. ":::
   
   | **Field** | **Value** |
   | --- | --- |
   | **Retain up to**  |Retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name, for example, **getExternalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.


## Add Active Directory over LDAP

>[!NOTE]
> This is not recommended. We suggest using LDAPS as in the cmdlet in the following section.

You'll run the `New-AvsLDAPIdentitySource` cmdlet to add AD over LDAP as an external identity source to use with SSO into vCenter. 

1. Select **Run command** > **Packages** > **New-AvsLDAPIdentitySource**.

1. Provide the required values or change the default values, and then select **Run**.
   
   | **Field** | **Value** |
   | --- | --- |
   | **Name**  | User-friendly name of the external identity source, for example, **avslap.local**.  |
   | **DomainName**  | The FQDN of the domain.    |
   | **DomainAlias**  | For Active Directory identity sources, the domain's NetBIOS name. Add the NetBIOS name of the AD domain as an alias of the identity source if you're using SSPI authentications.      |
   | **PrimaryUrl**  | Primary URL of the external identity source, for example, **ldap://yourserver:389**.  |
   | **SecondaryURL**  | Secondary fall-back URL if there's primary failure.  |
   | **BaseDNUsers**  |  Where to look for valid users, for example, **CN=users,DC=yourserver,DC=internal**.  Base DN is needed to use LDAP Authentication.  |
   | **BaseDNGroups**  | Where to look for groups, for example, **CN=group1, DC=yourserver,DC= internal**. Base DN is needed to use LDAP Authentication.  |
   | **Credential**  | Username and password used for authentication with the AD source (not cloudadmin).  |
   | **GroupName**  | Group to give cloud admin access in your external identity source, for example, **avs-admins**.  |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60.   |
   | **Specify name for execution**  | Alphanumeric name, for example, **addexternalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.



## Add Active Directory over LDAP with SSL

You'll run the `New-AvsLDAPSIdentitySource` cmdlet to add an AD over LDAP with SSL as an external identity source to use with SSO into vCenter. 

1. Download the certificate for AD authentication and upload it to an Azure Storage account as blob storage. If multiple certificates are required, upload each certificate individually.

1. For each certificate, [Grant access to Azure Storage resources using shared access signature (SAS)](../storage/common/storage-sas-overview.md). These SAS strings will be supplied to the cmdlet in the following steps as a parameter. Make sure to copy each SAS string, as once you leave this page, they will no longer be available.
   
1. Select **Run command** > **Packages** > **New-AvsLDAPSIdentitySource**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Name**  | User-friendly name of the external identity source ,for example, **avslap.local**.  |
   | **DomainName**  | The FQDN of the domain.   |
   | **DomainAlias**  | For Active Directory identity sources, the domain's NetBIOS name. Add the NetBIOS name of the AD domain as an alias of the identity source if you're using SSPI authentications.     |
   | **PrimaryUrl**  | Primary URL of the external identity source, for example, **ldap://yourserver:389**.  |
   | **SecondaryURL**  | Secondary fall-back URL if there's primary failure.  |
   | **BaseDNUsers**  |  Where to look for valid users, for example, **CN=users,DC=yourserver,DC=internal**.  Base DN is needed to use LDAP Authentication.  |
   | **BaseDNGroups**  | Where to look for groups, for example, **CN=group1, DC=yourserver,DC= internal**. Base DN is needed to use LDAP Authentication.  |
   | **Credential**  | The username and password used for authentication with the AD source (not cloudadmin).  |
   | **CertificateSAS** | Path to SAS strings with the certificates for authentication to the AD source. If using mutliple certificates, separate each SAS string with a comma, like pathtocert1,pathtocert2  |
   | **GroupName**  | Group to give cloud admin access in your external identity source, for example, **avs-admins**. This is a group that exists in the external identity source  |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name, for example, **addexternalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.




## Add existing AD group to cloudadmin group

You'll run the `Add-GroupToCloudAdmins` cmdlet to add an existing AD group to cloudadmin group. The users in this group have privileges equal to the cloudadmin (cloudadmin@vsphere.local) role defined in vCenter SSO.

1. Select **Run command** > **Packages** > **Add-GroupToCloudAdmins**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **GroupName**  | Name of the group to add, for example, **VcAdminGroup**.  |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60.   |
   | **Specify name for execution**  | Alphanumeric name, for example, **addADgroup**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** to see the progress.




## Remove AD group from the cloudadmin role

You'll run the `Remove-GroupFromCloudAdmins` cmdlet to remove a specified AD group from the cloudadmin role. 

1. Select **Run command** > **Packages** > **Remove-GroupFromCloudAdmins**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **GroupName**  | Name of the group to remove, for example, **VcAdminGroup**.  |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60.   |
   | **Specify name for execution**  | Alphanumeric name, for example, **removeADgroup**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** to see the progress.






## Remove existing external identity sources

You'll run the `Remove-ExternalIdentitySources` cmdlet to remove all existing external identity sources in bulk. 

1. Select **Run command** > **Packages** > **Remove-ExternalIdentitySources**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60.   |
   | **Specify name for execution**  | Alphanumeric name, for example, **remove_externalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** to see the progress.


## Next steps

Now that you've learned about how to configure LDAP and LDAPS, you can learn more about:

- [How to configure storage policy](configure-storage-policy.md) - Each VM deployed to a vSAN datastore is assigned at least one VM storage policy. You can assign a VM storage policy in an initial deployment of a VM or when you do other VM operations, such as cloning or migrating.

- [Azure VMware Solution identity concepts](concepts-identity.md) - Use vCenter to manage virtual machine (VM) workloads and NSX-T Manager to manage and extend the private cloud. Access and identity management use the CloudAdmin role for vCenter and restricted administrator rights for NSX-T Manager. 

 
