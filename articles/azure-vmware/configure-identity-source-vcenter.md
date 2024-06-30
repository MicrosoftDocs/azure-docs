---
title: Set an external identity source for vCenter Server
description: Learn how to set Windows Server Active Directory over LDAP or LDAPS for VMware vCenter Server as an external identity source.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/29/2024
ms.custom: engagement-fy23
---

# Set an external identity source for vCenter Server

[!INCLUDE [vcenter-access-identity-description](includes/vcenter-access-identity-description.md)]

You can set up vCenter Server to use an external Lightweight Directory Access Protocol (LDAP) directory service to authenticate users. A user can sign in by using their Windows Server Active Directory account credentials or credentials from a third-party LDAP server. Then, the account can be assigned a vCenter Server role, like in an on-premises environment, to provide role-based access for vCenter Server users.

:::image type="content" source="media/nsxt/azure-vmware-solution-to-ldap-server.png" alt-text="Screenshot that shows vCenter Server connectivity to the LDAP Windows Server Active Directory server." lightbox="media/nsxt/azure-vmware-solution-to-ldap-server.png":::

In this article, you learn how to:

> [!div class="checklist"]
>
> - Export a certificate for LDAPS authentication. (Optional)
> - Upload the LDAPS certificate to blob storage and generate a shared access signature (SAS) URL. (Optional)
> - Configure NSX DNS for resolution to your Windows Server Active Directory domain.
> - Add Windows Server Active Directory by using LDAPS (secure) or LDAP (unsecured).
> - Add an existing Windows Server Active Directory group to the CloudAdmin group.
> - List all existing external identity sources that are integrated with vCenter Server SSO.
> - Assign additional vCenter Server roles to Windows Server Active Directory identities.
> - Remove a Windows Server Active Directory group from the CloudAdmin role.
> - Remove all existing external identity sources.

> [!NOTE]
>
> - The steps to [export the certificate for LDAPS authentication](#export-the-certificate-for-ldaps-authentication-optional) and [upload the LDAPS certificate to blob storage and generate an SAS URL](#upload-the-ldaps-certificate-to-blob-storage-and-generate-an-sas-url-optional) are optional. If the `SSLCertificatesSasUrl` parameter is not provided, the certificate is downloaded from the domain controller automatically through the `PrimaryUrl` or `SecondaryUrl` parameters. To manually export and upload the certificate, you can provide the `SSLCertificatesSasUrl` parameter and complete the optional steps.
>
> - Run commands one at a time in the order that's described in the article.

## Prerequisites

- Ensure that your Windows Server Active Directory network is connected to your Azure VMware Solution private cloud.

- For Windows Server Active Directory authentication with LDAPS:

  1. Get access to the Windows Server Active Directory domain controller with Administrator permissions.
  1. Enable LDAPS on your Windows Server Active Directory domain controllers by using a valid certificate. You can obtain the certificate from an [Active Directory Certificate Services Certificate Authority (CA)](https://social.technet.microsoft.com/wiki/contents/articles/2980.ldap-over-ssl-ldaps-certificate.aspx) or a [third-party or public CA](/troubleshoot/windows-server/identity/enable-ldap-over-ssl-3rd-certification-authority).
  1. To obtain a valid certificate, complete the steps in [Create a certificate for secure LDAP](../active-directory-domain-services/tutorial-configure-ldaps.md#create-a-certificate-for-secure-ldap). Ensure that the certificate meets the listed requirements.

     > [!NOTE]
     > Avoid using self-signed certificates in production environments.  
  
  1. Optional: If you don't provide the `SSLCertificatesSasUrl` parameter, the certificate is automatically downloaded from the domain controller via the `PrimaryUrl` or the `SecondaryUrl` parameters. Alternatively, you can manually [export the certificate for LDAPS authentication](#export-the-certificate-for-ldaps-authentication-optional) and upload it to an Azure Storage account as blob storage. Then, [grant access to Azure Storage resources by using an SAS](../storage/common/storage-sas-overview.md).  

- Configure DNS resolution for Azure VMware Solution to your on-premises Windows Server Active Directory. Set up a DNS forwarder in the Azure portal. For more information, see [Configure a DNS forwarder for Azure VMware Solution](configure-dns-azure-vmware-solution.md).

> [!NOTE]
> For more information about LDAPS and certificate issuance, contact your security team or your identity management team.

## Export the certificate for LDAPS authentication (Optional)

First, verify that the certificate that's used for LDAPS is valid. If you don't have a certificate, complete the steps to [create a certificate for LDAPS](../active-directory-domain-services/tutorial-configure-ldaps.md#create-a-certificate-for-secure-ldap) before you continue.

To verify that the certificate is valid:

1. Sign in to a domain controller on which LDAPS is active by using Administrator permissions.
1. Open the **Run** tool, enter **mmc**, and then select **OK**.
1. Select **File** > **Add/Remove Snap-in**.
1. In the list of snap-ins, select **Certificates**, and then select **Add**.
1. In the **Certificates snap-in** pane, select **Computer account**, and then select **Next**.
1. Keep **Local computer** selected, select **Finish**, and then select **OK**.
1. In the **Certificates (Local Computer)** management console, expand the **Personal** folder and select the **Certificates** folder to view the installed certificates.

   :::image type="content" source="media/run-command/ldaps-certificate-personal-certficates.png" alt-text="Screenshot that shows the list of certificates in the management console." lightbox="media/run-command/ldaps-certificate-personal-certficates.png":::

1. Double-click the certificate for LDAPS. Ensure that the certificate date **Valid from** and **Valid to** is current and that the certificate has a private key that corresponds to the certificate.

   :::image type="content" source="media/run-command/ldaps-certificate-personal-general.png" alt-text="Screenshot that shows the properties of the LDAPS certificate." lightbox="media/run-command/ldaps-certificate-personal-general.png":::

1. In the same dialog, select the **Certification Path** tab and verify that the value for **Certification path** is valid. It should include the certificate chain of root CA and optional intermediate certificates. Check that the **Certificate status** is **OK**.

   :::image type="content" source="media/run-command/ldaps-certificate-cert-path.png" alt-text="Screenshot that shows the certificate chain on the Certification Path tab." lightbox="media/run-command/ldaps-certificate-cert-path.png":::

1. Select **OK**.

#### To export the certificate:

1. In the Certificates console, right-click the LDAPS certificate and select **All Tasks** > **Export**. The Certificate Export Wizard opens. Select **Next**.
1. In the **Export Private Key** section, select **No, do not export the private key**, and then select **Next**.
1. In the **Export File Format** section, select **Base-64 encoded X.509(.CER)**, and then select **Next**.
1. In the **File to Export** section, select **Browse**. Select a folder location to export the certificate, and enter a name. Then select **Save**.

> [!NOTE]
> If more than one domain controller is set to use LDAPS, repeat the export procedure for each additional domain controller to export their corresponding certificates. Note that you can reference only two LDAPS servers in the `New-LDAPSIdentitySource` Run tool. If the certificate is a wildcard certificate, such as `.avsdemo.net`, export the certificate from only one of the domain controllers.

## Upload the LDAPS certificate to blob storage and generate an SAS URL (Optional)

Next, upload the certificate file (in *.cer* format) you exported to an Azure Storage account as blob storage. Then, [grant access to Azure Storage resources by using an SAS](../storage/common/storage-sas-overview.md).

If you need multiple certificates, upload each one individually and generate an SAS URL for each certificate.

> [!IMPORTANT]
> Remember to copy all SAS URL strings. The strings aren't accessible after you leave the page.

> [!TIP]
> An alternative method to consolidate certificates involves storing all the certificate chains in one file, as detailed in a [VMware knowledge base article](https://kb.vmware.com/s/article/2041378). Then, generate a single SAS URL for the file that contains all the certificates.

## Set up NSX-T DNS for Windows Server Active Directory domain resolution

Create a DNS zone and add it to the DNS service. Complete the steps in [Configure a DNS forwarder in the Azure portal](./configure-dns-azure-vmware-solution.md).

After you complete these steps, verify that your DNS service includes your DNS zone.

:::image type="content" source="media/run-command/ldaps-dns-zone-service-configured.png" alt-text="Screenshot that shows the DNS service with the required DNS zone included." lightbox="media/run-command/ldaps-dns-zone-service-configured.png":::

Your Azure VMware Solution private cloud should now properly resolve your on-premises Windows Server Active Directory domain name.

## Add Windows Server Active Directory by using LDAP via SSL

To add Windows Server Active Directory over LDAP with SSL as an external identity source to use with SSO to vCenter Server, run the New-LDAPSIdentitySource cmdlet.

1. Go to your Azure VMware Solution private cloud and select **Run command** > **Packages** > **New-LDAPSIdentitySource**.

1. Provide the required values or modify the default values, and then select **Run**.

   | Name | Description |
   | --- | --- |
   | **GroupName** | The group in the external identity source that grants CloudAdmin access. For example, **avs-admins**.  |
   | **SSLCertificatesSasUrl** | The path to SAS strings that contain the certificates for authentication to the Windows Server Active Directory source. Separate multiple certificates with a comma. For example, **pathtocert1,pathtocert2**.  |
   | **Credential** | The domain username and password for authentication with the Windows Server Active Directory source (not CloudAdmin). Use the `<username@avslab.local>` format. |
   | **BaseDNGroups** | The location to search for groups. For example, **CN=group1, DC=avsldap,DC=local**. Base DN is required for LDAP authentication.  |
   | **BaseDNUsers** |  The location to search for valid users. For example, **CN=users,DC=avsldap,DC=local**. Base DN is required for LDAP authentication.  |
   | **PrimaryUrl** | The primary URL of the external identity source. For example, `ldaps://yourserver.avslab.local:636`.  |
   | **SecondaryURL** | The secondary fallback URL if the primary fails. For example, `ldaps://yourbackupldapserver.avslab.local:636`. |
   | **DomainAlias** | For Windows Server Active Directory identity sources, the domain's NetBIOS name. Add the NetBIOS name of the Windows Server Active Directory domain as an alias of the identity source, typically in the **avsldap\\** format.    |
   | **DomainName** | The domain's fully qualified domain name (FQDN). For example, **avslab.local**.  |
   | **Name** | A name for the external identity source. For example, **avslab.local**. |
   | **Retain up to** | The retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution** | An alphanumeric name. For example, **addexternalIdentity**.  |
   | **Timeout** | The period after which a cmdlet exits if it isn't finished running.  |

1. To monitor progress and confirm successful completion, check **Notifications** or the **Run Execution Status** pane.

## Add Windows Server Active Directory by using LDAP

> [!NOTE]
> We recommend that you use the method to [add Windows Server Active Directory over LDAP by using SSL](#add-windows-server-active-directory-by-using-ldap-via-ssl).

To add Windows Server Active Directory over LDAP as an external identity source to use with SSO to vCenter Server, run the New-LDAPIdentitySource cmdlet.

1. Select **Run command** > **Packages** > **New-LDAPIdentitySource**.

1. Provide the required values or modify the default values, and then select **Run**.

   | Name | Description |
   | --- | --- |
   | **Name**  | A name for the external identity source. For example, **avslab.local**. This name appears in vCenter Server.  |
   | **DomainName**  | The domain's FQDN. For example, **avslab.local**.  |
   | **DomainAlias**  | For Windows Server Active Directory identity sources, the domain's NetBIOS name. Add the Windows Server Active Directory domain's NetBIOS name as an alias of the identity source, typically in the **avsldap\** format.      |
   | **PrimaryUrl**  | The primary URL of the external identity source. For example, `ldap://yourserver.avslab.local:389`.  |
   | **SecondaryURL**  | The secondary fallback URL if there's a primary failure.  |
   | **BaseDNUsers**  |  The location to search for valid users. For example, **CN=users,DC=avslab,DC=local**. Base DN is required for LDAP authentication.  |
   | **BaseDNGroups**  | The location to search for groups. For example, **CN=group1, DC=avslab,DC=local**. Base DN is required for LDAP authentication.  |
   | **Credential**  | The domain username and password for authentication with the Windows Server Active Directory source (not CloudAdmin). The user must be in the `<username@avslab.local>` format.  |
   | **GroupName**  | The group in your external identity source that grants CloudAdmin access. For example, **avs-admins**.  |
   | **Retain up to**  | The retention period for the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | An alphanumeric name. For example, **addexternalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if it isn't finished running.  |

1. To monitor the progress, check **Notifications** or the **Run Execution Status** pane.

## Add an existing Windows Server Active Directory group to a CloudAdmin group

> [!IMPORTANT]
> Nested groups aren't supported. Using a nested group might cause loss of access.

Users in a CloudAdmin group have user rights that are equal to the CloudAdmin (`<cloudadmin@vsphere.local>`) role that's defined in vCenter Server SSO. To add an existing Windows Server Active Directory group to a CloudAdmin group, run the Add-GroupToCloudAdmins cmdlet.

1. Select **Run command** > **Packages** > **Add-GroupToCloudAdmins**.

1. Enter or select the required values, and then select **Run**.

   | Name | Description |
   | --- | --- |
   | **GroupName**  | The name of the group to add. For example, **VcAdminGroup**.  |
   | **Retain up to**  | The retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | An alphanumeric name. For example, **addADgroup**.  |
   | **Timeout**  |  The period after which a cmdlet exits if it isn't finished running.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.

## List external identity sources

To list all external identity sources that are already integrated with vCenter Server SSO, run the Get-ExternalIdentitySources cmdlet.

1. Sign in to the [Azure portal](https://portal.azure.com).

   > [!NOTE]
   > If you need access to the Azure for US Government portal, go to `<https://portal.azure.us/>`.

1. Select **Run command** > **Packages** > **Get-ExternalIdentitySources**.

   :::image type="content" source="media/run-command/run-command-overview.png" alt-text="Screenshot that shows the Run command menu with available packages in the Azure portal." lightbox="media/run-command/run-command-overview.png":::

1. Enter or select the required values, and then select **Run**.

   :::image type="content" source="media/run-command/run-command-get-external-identity-sources.png" alt-text="Screenshot that shows the Get-ExternalIdentitySources cmdlet in the Run command menu.":::

   | Name | Description |
   | --- | --- |
   | **Retain up to**  | The retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | An alphanumeric name. For example, **getExternalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if it isn't finished running.  |

1. To see the progress, check **Notifications** or the **Run Execution Status** pane.

   :::image type="content" source="media/run-command/run-packages-execution-command-status.png" alt-text="Screenshot that shows the Run Execution Status pane in the Azure portal." lightbox="media/run-command/run-packages-execution-command-status.png":::

## Assign more vCenter Server roles to Windows Server Active Directory identities

After you add an external identity over LDAP or LDAPS, you can assign vCenter Server roles to Windows Server Active Directory security groups based on your organization's security controls.

1. Sign in to vCenter Server as CloudAdmin, select an item from the inventory, select the **Actions** menu, and then select **Add Permission**.

   :::image type="content" source="media/run-command/ldaps-vcenter-permission-assignment-1.png" alt-text="Screenshot that shows the Actions menu in vCenter Server with the Add Permission option." lightbox="media/run-command/ldaps-vcenter-permission-assignment-1.png":::

1. In the **Add Permission** dialog:

   1. **Domain**: Select the previously added instance of Windows Server Active Directory.
   1. **User/Group**: Enter the user or group name, search for it, and then select it.
   1. **Role**: Select the role to assign.
   1. **Propagate to children**: Optionally, select the checkbox to propagate permissions to child resources.

   :::image type="content" source="media/run-command/ldaps-vcenter-permission-assignment-2.png" alt-text="Screenshot that shows the Add Permission dialog in vCenter Server." lightbox="media/run-command/ldaps-vcenter-permission-assignment-2.png":::

1. Select the **Permissions** tab and verify that the permission assignment was added.

   :::image type="content" source="media/run-command/ldaps-vcenter-permission-assignment-3.png" alt-text="Screenshot that shows the Permissions tab in vCenter Server after adding a permission assignment." lightbox="media/run-command/ldaps-vcenter-permission-assignment-3.png":::

Users can now sign in to vCenter Server by using their Windows Server Active Directory credentials.

## Remove a Windows Server Active Directory group from the CloudAdmin role

To remove a specific Windows Server Active Directory group from the CloudAdmin role, run the Remove-GroupFromCloudAdmins cmdlet.

1. Select **Run command** > **Packages** > **Remove-GroupFromCloudAdmins**.

1. Enter or select the required values, and then select **Run**.

   | Name | Description |
   | --- | --- |
   | **GroupName**  | The name of the group to remove. For example, **VcAdminGroup**.  |
   | **Retain up to**  | The retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | An alphanumeric name. For example, **removeADgroup**.  |
   | **Timeout**  |  The period after which a cmdlet exits if it isn't finished running.  |

1. To see the progress, check **Notifications** or the **Run Execution Status** pane.

## Remove all existing external identity sources

To remove all existing external identity sources at once, run the Remove-ExternalIdentitySources cmdlet.

1. Select **Run command** > **Packages** > **Remove-ExternalIdentitySources**.

1. Enter or select the required values, and then select **Run**:

   | Name | Description |
   | --- | --- |
   | **Retain up to**  | The retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | An alphanumeric name. For example, **remove_externalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if it isn't finished running.  |

1. To see the progress, check **Notifications** or the **Run Execution Status** pane.

## Rotate an existing external identity source account's username or password

1. Rotate the password of the account that's used for authentication with the Windows Server Active Directory source in the domain controller.

1. Select **Run command** > **Packages** > **Update-IdentitySourceCredential**.

1. Enter or select the required values, and then select **Run**.

   | Name | Description |
   | --- | --- |
   | **Credential**  | The domain username and password that are used for authentication with the Windows Server Active Directory source (not CloudAdmin). The user must be in the `<username@avslab.local>` format. |
   | **DomainName**  |  The FQDN of the domain. For example, **avslab.local**.  |

1. To see the progress, check **Notifications** or the **Run Execution Status** pane.

> [!WARNING]
> If you don't provide a value for **DomainName**, all external identity sources are removed. Run the cmdlet Update-IdentitySourceCredential only after the password is rotated in the domain controller.

## Renew existing certificates for LDAPS identity source

1. Renew the existing certificates in your domain controllers.

1. Optional: If the certificates are stored in default domain controllers, this step is optional. Leave the SSLCertificatesSasUrl parameter blank and the new certificates will be downloaded from the default domain controllers and updated in vCenter automatically. If you choose to not use the default way, [export the certificate for LDAPS authentication](#to-export-the-certificate) and [upload the LDAPS certificate to blob storage and generate an SAS URL](#upload-the-ldaps-certificate-to-blob-storage-and-generate-an-sas-url-optional). Save the SAS URL for the next step.

1. Select **Run command** > **Packages** > **Update-IdentitySourceCertificates**.

1. Provide the required values and the new SAS URL (optional), and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **DomainName***  |  The FQDN of the domain, for example **avslab.local**.  |
   | **SSLCertificatesSasUrl (optional)**  | A comma-delimited list of SAS path URI to Certificates for authentication. Ensure permissions to read are included. To generate, place the certificates in any storage account blob and then right-click the cert and generate SAS. If the value of this field isn't provided by a user, the certificates will be downloaded from the default domain controllers.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.

## Related content

- [Create a storage policy](configure-storage-policy.md)
- [Azure VMware Solution identity architecture](architecture-identity.md)
- [Set an external identity source for NSX](configure-external-identity-source-nsx-t.md)
- [VMware product documentation](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/administration/GUID-DB5A44F1-6E1D-4E5C-8B50-D6161FFA5BD2.html)
