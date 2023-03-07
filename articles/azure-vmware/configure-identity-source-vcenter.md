---
title: Configure external identity source for vCenter Server
description:  Learn how to configure Active Directory over LDAP or LDAPS for vCenter Server as an external identity source.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 10/21/2022
---

# Configure external identity source for vCenter Server

[!INCLUDE [vcenter-access-identity-description](includes/vcenter-access-identity-description.md)]

>[!NOTE]
>Run commands are executed one at a time in the order submitted.

In this article, you learn how to:

> [!div class="checklist"]
>
> * Export the certificate for LDAPS authentication
> * Upload the LDAPS certificate to blob storage and generate a SAS URL
> * Configure NSX-T DNS for resolution to your Active Directory Domain
> * Add Active Directory over (Secure) LDAPS (LDAP over SSL) or (unsecure) LDAP
> * Add existing AD group to cloudadmin group
> * List all existing external identity sources integrated with vCenter Server SSO
> * Assign additional vCenter Server Roles to Active Directory Identities
> * Remove AD group from the cloudadmin role
> * Remove existing external identity sources

## Prerequisites

- Connectivity from your Active Directory network to your Azure VMware Solution private cloud must be operational.

- For AD authentication with LDAPS:

    - You'll need access to the Active Directory Domain Controller(s) with Administrator permissions.
    - Your Active Directory Domain Controller(s) must have LDAPS enabled with a valid certificate. The certificate could be issued by an [Active Directory Certificate Services Certificate Authority (CA)](https://social.technet.microsoft.com/wiki/contents/articles/2980.ldap-over-ssl-ldaps-certificate.aspx) or a [Third-party/Public CA](/troubleshoot/windows-server/identity/enable-ldap-over-ssl-3rd-certification-authority).
    - You need to have a valid certificate. To create a certificate, follow the steps shown in [create a certificate for secure LDAP](https://learn.microsoft.com/azure/active-directory-domain-services/tutorial-configure-ldaps#create-a-certificate-for-secure-ldap). Make sure the certificate meets the requirements that are listed after the steps you used to create a certificate for secure LDAP.
    >[!NOTE]
    >Self-sign certificates are not recommended for production environments.  
    - [Export the certificate for LDAPS authentication](#export-the-certificate-for-ldaps-authentication) and upload it to an Azure Storage account as blob storage. Then, you'll need to [grant access to Azure Storage resources using shared access signature (SAS)](../storage/common/storage-sas-overview.md).  

- Ensure Azure VMware Solution has DNS resolution configured to your on-premises AD. Enable DNS Forwarder from Azure portal. See [Configure DNS forwarder for Azure VMware Solution](configure-dns-azure-vmware-solution.md) for further information.

>[!NOTE]
>For more information about LDAPS and certificate issuance, see with your security or identity management team.

## Export the certificate for LDAPS authentication

First, verify that the certificate used for LDAPS is valid. If you don't already have a certificate, follow the steps to [create a certificate for secure LDAP](https://learn.microsoft.com/azure/active-directory-domain-services/tutorial-configure-ldaps#create-a-certificate-for-secure-ldap) before you continue.

1. Sign in to a domain controller with administrator permissions where LDAPS is enabled.

1. Open the **Run command**, type **mmc** and select the **OK** button.
1. Select the **File** menu option then **Add/Remove Snap-in**.
1. Select the **Certificates** in the list of Snap-ins and select the **Add>** button.
1. In the **Certificates snap-in** window, select **Computer account** then select **Next**.
1. Keep the first option selected **Local computer...** , and select **Finish**, and then **OK**.
1. Expand the **Personal** folder under the **Certificates (Local Computer)** management console and select the **Certificates** folder to list the installed certificates.

    :::image type="content" source="media/run-command/ldaps-certificate-personal-certficates.png" alt-text="Screenshot showing displaying the list of certificates." lightbox="media/run-command/ldaps-certificate-personal-certficates.png":::

1. Double click the certificate for LDAPS purposes. The **Certificate** General properties will display. Ensure the certificate date **Valid from** and **to** is current and the certificate has a **private key** that corresponds to the certificate.

    :::image type="content" source="media/run-command/ldaps-certificate-personal-general.png" alt-text="Screenshot showing the properties of the certificate." lightbox="media/run-command/ldaps-certificate-personal-general.png":::

1. On the same window, select the **Certification Path** tab and verify that the **Certification path** is valid, which it should include the certificate chain of root CA and optionally intermediate certificates and the **Certificate Status** is OK.

    :::image type="content" source="media/run-command/ldaps-certificate-cert-path.png" alt-text="Screenshot showing the certificate chain." lightbox="media/run-command/ldaps-certificate-cert-path.png":::

1. Close the window.

Now proceed to export the certificate

1. Still on the Certificates console, right select the LDAPS certificate and select **All Tasks** > **Export**. The Certificate Export Wizard prompt is displayed,  select the **Next** button.

1. In the **Export Private Key** section, select the second option, **No, do not export the private key** and select the **Next** button.
1. In the **Export File Format** section, select the second option, **Base-64 encoded X.509(.CER)** and then select the **Next** button.
1. In the **File to Export** section, select the **Browse...** button and select a folder location where to export the certificate, enter a name then select the **Save** button.

>[!NOTE]
>If more than one domain controller is LDAPS enabled, repeat the export procedure in the additional domain controller(s) to also export the corresponding certificate(s). Be aware that you can only reference two LDAPS server in the `New-LDAPSIdentitySource` Run Command. If the certificate is a wildcard certificate, for example ***.avsdemo.net** you only need to export the certificate from one of the domain controllers.

## Upload the LDAPS certificate to blob storage and generate a SAS URL

- Upload the certificate file (.cer format) you just exported to an Azure Storage account as blob storage. Then [grant access to Azure Storage resources using shared access signature (SAS)](../storage/common/storage-sas-overview.md).

- If multiple certificates are required, upload each certificate individually and for each certificate, generate a SAS URL.

> [!IMPORTANT]
> Make sure to copy each SAS URL string(s), because they will no longer be available once you leave the page.

> [!TIP]
> Another alternative method for consolidating certificates is saving the certificate chains in a single file as mentioned in [this VMware KB article](https://kb.vmware.com/s/article/2041378), and generate a single SAS URL for the file that contains all the certificates.

## Configure NSX-T DNS for resolution to your Active Directory Domain

A DNS Zone needs to be created and added to the DNS Service, follow the instructions in [Configure a DNS forwarder in the Azure portal](./configure-dns-azure-vmware-solution.md) to complete these two steps.

After completion, verify that your DNS Service has your DNS zone included.
 :::image type="content" source="media/run-command/ldaps-dns-zone-service-configured.png" alt-text="Screenshot showing the DNS Service that includes the required DNS zone." lightbox="media/run-command/ldaps-dns-zone-service-configured.png":::

Your Azure VMware Solution Private cloud should now be able to resolve your on-premises Active Directory domain name properly.

## Add Active Directory over LDAP with SSL

In your Azure VMware Solution private cloud, you'll run the `New-LDAPSIdentitySource` cmdlet to add an AD over LDAP with SSL as an external identity source to use with SSO into vCenter Server.

1. Browse to your Azure VMware Solution private cloud and then select **Run command** > **Packages** > **New-LDAPSIdentitySource**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **GroupName**  | The group in the external identity source that gives the cloudadmin access. For example, **avs-admins**.  |
   | **CertificateSAS** | Path to SAS strings with the certificates for authentication to the AD source. If you're using multiple certificates, separate each SAS string with a comma. For example, **pathtocert1,pathtocert2**.  |
   | **Credential**  | The domain username and password used for authentication with the AD source (not cloudadmin). The user must be in the **username@avslab.local** format. |
   | **BaseDNGroups**  | Where to look for groups, for example, **CN=group1, DC=avsldap,DC=local**. Base DN is needed to use LDAP Authentication.  |
   | **BaseDNUsers**  |  Where to look for valid users, for example, **CN=users,DC=avsldap,DC=local**.  Base DN is needed to use LDAP Authentication.  |
   | **PrimaryUrl**  | Primary URL of the external identity source, for example, **ldaps://yourserver.avslab.local.:636**.  |
   | **SecondaryURL**  | Secondary fall-back URL if there's primary failure. For example, **ldaps://yourbackupldapserver.avslab.local:636**. |
   | **DomainAlias**  | For Active Directory identity sources, the domain's NetBIOS name. Add the NetBIOS name of the AD domain as an alias of the identity source. Typically the **avsldap\** format.    |
   | **DomainName**  | The FQDN of the domain, for example **avslab.local**.  |
   | **Name**  | User-friendly name of the external identity source. For example, **avslab.local**, is how it will be displayed in vCenter. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name, for example, **addexternalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress and successful completion.

## Add Active Directory over LDAP

>[!NOTE]
>We recommend you use the [Add Active Directory over LDAP with SSL](#add-active-directory-over-ldap-with-ssl) method.

You'll run the `New-LDAPIdentitySource` cmdlet to add AD over LDAP as an external identity source to use with SSO into vCenter Server.

1. Select **Run command** > **Packages** > **New-LDAPIdentitySource**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Name**  | User-friendly name of the external identity source, for example, **avslab.local**. This is how it will be displayed in vCenter.  |
   | **DomainName**  | The FQDN of the domain, for example **avslab.local**.  |
   | **DomainAlias**  | For Active Directory identity sources, the domain's NetBIOS name. Add the NetBIOS name of the AD domain as an alias of the identity source. Typically the **avsldap\** format.      |
   | **PrimaryUrl**  | Primary URL of the external identity source, for example, **ldap://yourserver.avslab.local:389**.  |
   | **SecondaryURL**  | Secondary fall-back URL if there's primary failure.  |
   | **BaseDNUsers**  |  Where to look for valid users, for example, **CN=users,DC=avslab,DC=local**.  Base DN is needed to use LDAP Authentication.  |
   | **BaseDNGroups**  | Where to look for groups, for example, **CN=group1, DC=avslab,DC=local**. Base DN is needed to use LDAP Authentication.  |
   | **Credential**  | The domain username and password used for authentication with the AD source (not cloudadmin). The user must be in the **username@avslab.local** format.  |
   | **GroupName**  | The group to give cloudadmin access in your external identity source, for example, **avs-admins**.  |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name, for example, **addexternalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.

## Add existing AD group to cloudadmin group

You'll run the `Add-GroupToCloudAdmins` cmdlet to add an existing AD group to a cloudadmin group. Users in the cloudadmin group have privileges equal to the cloudadmin (cloudadmin@vsphere.local) role defined in vCenter Server SSO.

1. Select **Run command** > **Packages** > **Add-GroupToCloudAdmins**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **GroupName**  | Name of the group to add, for example, **VcAdminGroup**.  |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name, for example, **addADgroup**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.

## List external identity

You'll run the `Get-ExternalIdentitySources` cmdlet to list all external identity sources already integrated with vCenter Server SSO.

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

    :::image type="content" source="media/run-command/run-packages-execution-command-status.png" alt-text="Screenshot showing how to check the run commands notification or status." lightbox="media/run-command/run-packages-execution-command-status.png":::

## Assign more vCenter Server Roles to Active Directory Identities

After you've added an external identity over LDAP or LDAPS, you can assign vCenter Server Roles to Active Directory security groups based on your organization's security controls.

1. After you sign in to vCenter Server with cloudadmin privileges, you can select an item from the inventory, select **ACTIONS** menu and select **Add Permission**.

    :::image type="content" source="media/run-command/ldaps-vcenter-permission-assignment-1.png" alt-text="Screenshot displaying hot to add permission assignment." lightbox="media/run-command/ldaps-vcenter-permission-assignment-1.png":::

1. In the Add Permission prompt:
    1. *Domain*. Select the Active Directory that was added previously.
    1. *User/Group*. Enter the name of the desired user or group to find then select once is found.
    1. *Role*. Select the desired role to assign.
    1. *Propagate to children*. Optionally select the checkbox if permissions should be propagated down to children resources.
    :::image type="content" source="media/run-command/ldaps-vcenter-permission-assignment-2.png" alt-text="Screenshot displaying assign the permission." lightbox="media/run-command/ldaps-vcenter-permission-assignment-3.png":::

1. Switch to the **Permissions** tab and verify the permission assignment was added.
    :::image type="content" source="media/run-command/ldaps-vcenter-permission-assignment-3.png" alt-text="Screenshot displaying the add completion of permission assignment." lightbox="media/run-command/ldaps-vcenter-permission-assignment-3.png":::
1. Users should now be able to sign in to vCenter Server using their Active Directory credentials.

## Remove AD group from the cloudadmin role

You'll run the `Remove-GroupFromCloudAdmins` cmdlet to remove a specified AD group from the cloudadmin role.

1. Select **Run command** > **Packages** > **Remove-GroupFromCloudAdmins**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **GroupName**  | Name of the group to remove, for example, **VcAdminGroup**.  |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name, for example, **removeADgroup**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.

## Remove existing external identity sources

You'll run the `Remove-ExternalIdentitySources` cmdlet to remove all existing external identity sources in bulk. 

1. Select **Run command** > **Packages** > **Remove-ExternalIdentitySources**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name, for example, **remove_externalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.

## Next steps

Now that you've learned about how to configure LDAP and LDAPS, you can learn more about:

- [How to configure storage policy](configure-storage-policy.md) - Each VM deployed to a vSAN datastore is assigned at least one VM storage policy. You can assign a VM storage policy in an initial deployment of a VM or when you do other VM operations, such as cloning or migrating.
- [Azure VMware Solution identity concepts](concepts-identity.md) - Use vCenter Server to manage virtual machine (VM) workloads and NSX-T Manager to manage and extend the private cloud. Access and identity management use the cloudadmin role for vCenter Server and restricted administrator rights for NSX-T Manager.
- [Configure external identity source for NSX-T](configure-external-identity-source-nsx-t.md) 
- [Azure VMware Solution identity concepts](concepts-identity.md)
- [VMware product documentation](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/administration/GUID-DB5A44F1-6E1D-4E5C-8B50-D6161FFA5BD2.html)

