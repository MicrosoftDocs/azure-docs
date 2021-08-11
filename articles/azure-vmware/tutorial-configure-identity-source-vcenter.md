---
title: Tutorial - Configure external identity source for vCenter
description:  Learn how to configure Active Directory over LDAP or LDAPS for vCenter as an external identity source.
ms.topic: tutorial
ms.date: 08/15/2021

#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---

# Tutorial: Configure external identity source for vCenter



[!INCLUDE [vcenter-access-identity-description](includes/vcenter-access-identity-description.md)]



In this tutorial, you learn how to:

> [!div class="checklist"]
> * List all existing external identity sources integrated with vCenter SSO
> * Add Active Directory over LDAP, with or without SSL 
> * Add existing AD group to cloudadmin group
> * Remove AD group from the cloudadmin role
> * Remove existing external identity sources



## Prerequisites

- Establish connectivity from your on-premises network to your private cloud.

- If you have AD with SSL, download the certificate for AD authentication and upload it to an Azure Storage account as a blob storage.  You must [grant access to Azure Storage resources using shared access signature (SAS)](../storage/common/storage-sas-overview.md). 

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
   | **Retain up to**  | Job retention period. The cmdlet output will be stored for these many days. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name of the task to execute.  |
   | **Timeout**  | The period after which a cmdlet will exit if a certain task is taking too long to finish.  |

1. Check **Notifications** to see the progress.


## Add Active Directory over LDAP

You'll run the `New-AvsLDAPIdentitySource` cmdlet to add AD over LDAP as an external identity source to use with SSO into vCenter. 

1. Select **Run command** > **Packages** > **New-AvsLDAPIdentitySource**.

1. Provide the required values or change the default values, and then select **Run**.
   
   | **Field** | **Value** |
   | --- | --- |
   | **Name**  | User-friendly name of the external identity source. For example, **avslap.local**.  |
   | **DomainName**  | The FQDN of the domain.    |
   | **DomainAlias**  | For Active Directory identity sources, the domain's NetBIOS name. Add the NetBIOS name of the Active Directory domain as an alias of the identity source if you are using SSPI authentications.      |
   | **PrimaryUrl**  | Primary URL of the external identity source. For example, **ldap://yourserver:389**.  |
   | **SecondaryURL**  | Secondary fall-back URL if there is primary failure.  |
   | **BaseDNUsers**  |  Where to look for valid users. For example, **CN=users,DC=yourserver,DC=internal**.  Base DN is needed to use LDAP Authentication.  |
   | **BaseDNGroups**  | Where to look for groups. For example, **CN=group1, DC=yourserver,DC= internal**. Base DN is needed to use LDAP Authentication.  |
   | **Credential**  | The username and password used for authentication with the AD source (not cloudadmin).  |
   | **GroupName**  | Group to give cloud admin access in your external identity source.  For example, **avs-admins**.  |
   | **Retain up to**  | Job retention period. The cmdlet output is stored for the number of days defined. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name of the task to execute. For example, **addexternalIdentity**.  |
   | **Timeout**  | The time in which the cmdlet exits if a certain task takes too long to finish.  |

1. Check **Notifications** to see the progress.



## Add Active Directory over LDAP with SSL

You'll run the `New-AvsLDAPSIdentitySource` cmdlet to add an AD over LDAP with SSL as an external identity source to use with SSO into vCenter. 

1. Make sure you've downloaded the certificate for AD authentication and uploaded it to an Azure Storage account as a blob storage.  You must [grant access to Azure Storage resources using shared access signature (SAS)](../storage/common/storage-sas-overview.md).  
   
1. Select **Run command** > **Packages** > **New-AvsLDAPSIdentitySource**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Name**  | User-friendly name of the external identity source. For example, **avslap.local**.  |
   | **DomainName**  | The FQDN of the domain.   |
   | **DomainAlias**  | For Active Directory identity sources, the domain's NetBIOS name. Add the NetBIOS name of the Active Directory domain as an alias of the identity source if you are using SSPI authentications.     |
   | **PrimaryUrl**  | Primary URL of the external identity source. For example, **ldap://yourserver:389**.  |
   | **SecondaryURL**  | Secondary fall-back URL if there is primary failure.  |
   | **BaseDNUsers**  |  Where to look for valid users. For example, **CN=users,DC=yourserver,DC=internal**.  Base DN is needed to use LDAP Authentication.  |
   | **BaseDNGroups**  | Where to look for groups. For example, **CN=group1, DC=yourserver,DC= internal**. Base DN is needed to use LDAP Authentication.  |
   | **Credential**  | The username and password used for authentication with the AD source (not cloudadmin).  |
   | **CertificateSAS** | Path to SAS strings with the certificates for authentication to the AD source.  |
   | **GroupName**  | Group to give cloud admin access in your external identity source.  For example, **avs-admins**.  |
   | **Retain up to**  | Job retention period. The cmdlet output is stored for the number of days defined. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name of the task to execute. For example, **addexternalIdentity**.  |
   | **Timeout**  | The time in which the cmdlet exits if a certain task takes too long to finish.  |

1. Check **Notifications** to see the progress.




## Add existing AD group to cloudadmin group

You'll run the `Add-GroupToCloudAdmins` cmdlet to add an existing AD group to cloudadmin group. The users in this group have privileges equal to the cloudadmin (cloudadmin@vsphere.local) role defined in vCenter SSO.

1. Select **Run command** > **Packages** > **Add-GroupToCloudAdmins**.

1. Provide the required values or change the The default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **GroupName**  | Name of the group to add. For example, **VcAdminGroup**.  |
   | **Retain up to**  | Job retention period. The cmdlet output is stored for the number of days defined. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name of the task to execute. For example, **addADgroup**.  |
   | **Timeout**  | The time in which the cmdlet exits if a certain task takes too long to finish.  |

1. Check **Notifications** to see the progress.




## Remove AD group from the cloudadmin role

You'll run the `Remove-GroupFromCloudAdmins` cmdlet to remove a specified AD group from the cloudadmin role. 

1. Select **Run command** > **Packages** > **Remove-GroupFromCloudAdmins**.

1. Provide the required values or change the The default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **GroupName**  | Name of the group to remove. For example, **VcAdminGroup**.  |
   | **Retain up to**  | Job retention period. The cmdlet output is stored for the number of days defined. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name of the task to execute. For example, **removeADgroup**.  |
   | **Timeout**  | The time in which the cmdlet exits if a certain task takes too long to finish.  |

1. Check **Notifications** to see the progress.






## Remove existing external identity sources

You'll run the `Remove-ExternalIdentitySources` cmdlet to remove all existing external identity sources in bulk. 

1. Select **Run command** > **Packages** > **Remove-ExternalIdentitySources**.

1. Provide the required values or change the The default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Retain up to**  | Job retention period. The cmdlet output is stored for the number of days defined. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name of the task to execute. For example, **remove_externalIdentity**.  |
   | **Timeout**  | The time in which the cmdlet exits if a certain task takes too long to finish.  |

1. Check **Notifications** to see the progress.


## Next steps

Now that you've learned about how to configure LDAP and LDAPS, you can learn more about:

- [How to configure storage policy](tutorial-configure-storage-policy.md) - Each VM deployed to a vSAN datastore is assigned at least one VM storage policy. You can assign a VM storage policy in an initial deployment of a VM or when you perform other VM operations, such as cloning or migrating.

- [Azure VMware Solution identity concepts](concepts-identity.md) - Use vCenter to manage virtual machine (VM) workloads and NSX-T Manager to manage and extend the private cloud. Access and identity management use the CloudAdmin role for vCenter and restricted administrator rights for NSX-T Manager. 

 