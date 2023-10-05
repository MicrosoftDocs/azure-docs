---
title: Configure external identity source for vCenter Server
description: Learn how to configure Azure Active Directory over LDAP or LDAPS for vCenter Server as an external identity source.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 10/21/2022
---

# Configure external identity source for vCenter Server

[!INCLUDE [vcenter-access-identity-description](includes/vcenter-access-identity-description.md)]

> [!NOTE]
> Execute commands one at a time in the order provided.

In this article, you'll learn how to:

> [!div class="checklist"]
>
> * (Optional) Export the certificate for LDAPS authentication
> * (Optional) Upload the LDAPS certificate to blob storage and generate a SAS URL
> * Configure NSX-T DNS for resolution to your Active Directory Domain
> * Add Active Directory over (Secure) LDAPS (LDAP over SSL) or (unsecure) LDAP
> * Add existing AD group to cloudadmin group
> * List all existing external identity sources integrated with vCenter Server SSO
> * Assign additional vCenter Server roles to Active Directory identities
> * Remove AD group from the cloudadmin role
> * Remove existing external identity sources

> [!NOTE]
> [Export the certificate for LDAPS authentication](#optional-export-the-certificate-for-ldaps-authentication) and [Upload the LDAPS certificate to blob storage and generate a SAS URL](#optional-upload-the-ldaps-certificate-to-blob-storage-and-generate-a-sas-url) are optional steps. The certificate(s) will be downloaded from the domain controller(s) automatically through the **PrimaryUrl** and/or **SecondaryUrl** parameters if the **SSLCertificatesSasUrl** parameter is not provided. You can still provide **SSLCertificatesSasUrl** and follow the optional steps to manually export and upload the certificate(s).

## Prerequisites

- Ensure your Active Directory network is connected to your Azure VMware Solution private cloud.

- For AD authentication with LDAPS:

    - Obtain access to the Active Directory Domain Controller(s) with Administrator permissions.
    - Enable LDAPS on your Active Directory Domain Controller(s) with a valid certificate. You may obtain the certificate from an [Active Directory Certificate Services Certificate Authority (CA)](https://social.technet.microsoft.com/wiki/contents/articles/2980.ldap-over-ssl-ldaps-certificate.aspx) or a [third-party/public CA](/troubleshoot/windows-server/identity/enable-ldap-over-ssl-3rd-certification-authority).
    - Follow the steps in [create a certificate for secure LDAP](../active-directory-domain-services/tutorial-configure-ldaps.md#create-a-certificate-for-secure-ldap) to obtain a valid certificate. Ensure the certificate meets the listed requirements.
    > [!NOTE]
    > Avoid using self-signed certificates in production environments.  
    - Optional: If you don't provide the **SSLCertificatesSasUrl** parameter, the certificate(s) is automatically downloaded from the domain controller(s) through the **PrimaryUrl** and/or  **SecondaryUrl** parameters. Alternatively, you can manually [export the certificate for LDAPS authentication](#optional-export-the-certificate-for-ldaps-authentication) and upload it to an Azure Storage account as blob storage. Then, [grant access to Azure Storage resources using a shared access signature (SAS)](../storage/common/storage-sas-overview.md).  

- Configure DNS resolution for Azure VMware Solution to your on-premises AD. Enable DNS Forwarder from the Azure portal. For more information, see [configure DNS forwarder for Azure VMware Solution](configure-dns-azure-vmware-solution.md).

> [!NOTE]
> Consult your security or identity management team for more information about LDAPS and certificate issuance.

## (Optional) Export the certificate for LDAPS authentication

First, verify that the certificate used for LDAPS is valid. If you don't have a certificate, follow the steps to [create a certificate for secure LDAP](../active-directory-domain-services/tutorial-configure-ldaps.md#create-a-certificate-for-secure-ldap) before continuing.

1. Sign in to a domain controller with administrator permissions where LDAPS is enabled.
1. Open the **Run command**, type **mmc**, and select **OK**.
1. Select **File** > **Add/Remove Snap-in**.
1. Choose **Certificates** from the list of Snap-ins and select **Add>**.
1. In the **Certificates snap-in** window, select **Computer account** and then select **Next**.
1. Keep **Local computer...** selected, select **Finish**, and then **OK**.
1. Expand the **Personal** folder under the **Certificates (Local Computer)** management console and select the **Certificates** folder to view the installed certificates.

    :::image type="content" source="media/run-command/ldaps-certificate-personal-certficates.png" alt-text="Screenshot of the list of certificates in the management console." lightbox="media/run-command/ldaps-certificate-personal-certficates.png":::

1. Double-click the certificate for LDAPS purposes. Ensure the certificate date **Valid from** and **to** is current and the certificate has a **private key** that corresponds to the certificate.

    :::image type="content" source="media/run-command/ldaps-certificate-personal-general.png" alt-text="Screenshot of the properties of the LDAPS certificate." lightbox="media/run-command/ldaps-certificate-personal-general.png":::

1. In the same window, select the **Certification Path** tab and verify that the **Certification path** is valid. It should include the certificate chain of root CA and optional intermediate certificates. Check that the **Certificate Status** is OK.

    :::image type="content" source="media/run-command/ldaps-certificate-cert-path.png" alt-text="Screenshot of the certificate chain in the Certification Path tab." lightbox="media/run-command/ldaps-certificate-cert-path.png":::

1. Close the window.

Next, export the certificate:

1. In the Certificates console, right-click the LDAPS certificate and select **All Tasks** > **Export**. The Certificate Export Wizard appears. Select **Next**.
1. In the **Export Private Key** section, choose **No, do not export the private key** and select **Next**.
1. In the **Export File Format** section, select **Base-64 encoded X.509(.CER)** and select **Next**.
1. In the **File to Export** section, select **Browse...**, choose a folder location to export the certificate, enter a name, and select **Save**.

> [!NOTE]
> If more than one domain controller is LDAPS enabled, repeat the export procedure for each additional domain controller to export their corresponding certificates. Note that you can only reference two LDAPS servers in the `New-LDAPSIdentitySource` Run Command. If the certificate is a wildcard certificate, such as ***.avsdemo.net**, you only need to export the certificate from one of the domain controllers.

## (Optional) Upload the LDAPS certificate to blob storage and generate a SAS URL

- Upload the certificate file (.cer format) you just exported to an Azure Storage account as blob storage. Then, [grant access to Azure Storage resources using a shared access signature (SAS)](../storage/common/storage-sas-overview.md).

- If you need multiple certificates, upload each one individually and generate a SAS URL for each.

> [!IMPORTANT]
> Remember to copy all SAS URL strings, as they won't be accessible once you leave the page.

> [!TIP]
> An alternative method for consolidating certificates involves storing all the certificate chains in one file, as detailed in [this VMware KB article](https://kb.vmware.com/s/article/2041378). Then, generate a single SAS URL for the file that contains all the certificates.

## Configure NSX-T DNS for Active Directory domain resolution

Create a DNS zone and add it to the DNS service. Follow the instructions in [configure a DNS forwarder in the Azure portal](./configure-dns-azure-vmware-solution.md).

After completing these steps, verify that your DNS service includes your DNS zone.

:::image type="content" source="media/run-command/ldaps-dns-zone-service-configured.png" alt-text="Screenshot of the DNS service with the required DNS zone included." lightbox="media/run-command/ldaps-dns-zone-service-configured.png":::

Your Azure VMware Solution private cloud should now properly resolve your on-premises Active Directory domain name.

## Add Active Directory over LDAP with SSL

To add AD over LDAP with SSL as an external identity source to use with SSO into vCenter Server, run the `New-LDAPSIdentitySource` cmdlet:

1. Navigate to your Azure VMware Solution private cloud and select **Run command** > **Packages** > **New-LDAPSIdentitySource**.

1. Provide the required values or modify the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **GroupName**  | The group in the external identity source that grants cloudadmin access. For example, **avs-admins**.  |
   | **SSLCertificatesSasUrl** | Path to SAS strings containing the certificates for authentication to the AD source. Separate multiple certificates with a comma. For example, **pathtocert1,pathtocert2**.  |
   | **Credential**  | The domain username and password for authentication with the AD source (not cloudadmin). Use the **username@avslab.local** format. |
   | **BaseDNGroups**  | Location to search for groups. For example, **CN=group1, DC=avsldap,DC=local**. Base DN is required for LDAP Authentication.  |
   | **BaseDNUsers**  |  Location to search for valid users. For example, **CN=users,DC=avsldap,DC=local**. Base DN is required for LDAP Authentication.  |
   | **PrimaryUrl**  | Primary URL of the external identity source. For example, **ldaps://yourserver.avslab.local.:636**.  |
   | **SecondaryURL**  | Secondary fallback URL if there is primary failure. For example, **ldaps://yourbackupldapserver.avslab.local:636**. |
   | **DomainAlias**  | For Active Directory identity sources, the domain's NetBIOS name. Add the NetBIOS name of the AD domain as an alias of the identity source, typically in the **avsldap\** format.    |
   | **DomainName**  | The domain's FQDN. For example, **avslab.local**.  |
   | **Name**  | User-friendly name of the external identity source. For example,**avslab.local**. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name. For example, **addexternalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if it takes too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to monitor progress and confirm successful completion.

## Add Active Directory over LDAP

> [!NOTE]
> We recommend that you use the [Add Active Directory over LDAP with SSL](#add-active-directory-over-ldap-with-ssl) method.

To add AD over LDAP as an external identity source to use with SSO into vCenter Server, run the `New-LDAPIdentitySource` cmdlet:

1. Select **Run command** > **Packages** > **New-LDAPIdentitySource**.

1. Provide the required values or modify the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Name**  | User-friendly name of the external identity source. For example, **avslab.local**. This name will be displayed in vCenter.  |
   | **DomainName**  | The domain's FQDN. For example, **avslab.local**.  |
   | **DomainAlias**  | For Active Directory identity sources, the domain's NetBIOS name. Add the AD domain's NetBIOS name as an alias of the identity source, typically in the **avsldap\** format.      |
   | **PrimaryUrl**  | Primary URL of the external identity source. For example, **ldap://yourserver.avslab.local:389**.  |
   | **SecondaryURL**  | Secondary fallback URL in case of primary failure.  |
   | **BaseDNUsers**  |  Location to search for valid users. For example, **CN=users,DC=avslab,DC=local**. Base DN is required for LDAP Authentication.  |
   | **BaseDNGroups**  | Location to search for groups. For example, **CN=group1, DC=avslab,DC=local**. Base DN is required for LDAP Authentication.  |
   | **Credential**  | The domain username and password for authentication with the AD source (not cloudadmin). The user must be in the **username@avslab.local** format.  |
   | **GroupName**  | The group in your external identity source that grants cloudadmin access. For example, **avs-admins**.  |
   | **Retain up to**  | Retention period for the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name. For example, **addexternalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if it takes too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to monitor the progress.

## Add existing AD group to a cloudadmin group

> [!IMPORTANT]
> Nested groups aren't supported, and their use may cause loss of access.

Users in a cloudadmin group have privileges equal to the cloudadmin (cloudadmin@vsphere.local) role defined in vCenter Server SSO. To add an existing AD group to a cloudadmin group, run the `Add-GroupToCloudAdmins` cmdlet:

1. Select **Run command** > **Packages** > **Add-GroupToCloudAdmins**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **GroupName**  | Name of the group to add. For example, **VcAdminGroup**.  |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name. For example, **addADgroup**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.

## List external identity sources

To list all external identity sources already integrated with vCenter Server SSO, run the `Get-ExternalIdentitySources` cmdlet:

1. Sign in to the [Azure portal](https://portal.azure.com).
    
   >[!NOTE]
   >If you need access to the Azure US Gov portal, go to https://portal.azure.us/

1. Select **Run command** > **Packages** > **Get-ExternalIdentitySources**.

   :::image type="content" source="media/run-command/run-command-overview.png" alt-text="Screenshot of the Run command menu with available packages in the Azure portal." lightbox="media/run-command/run-command-overview.png":::

1. Provide the required values or change the default values, and then select **Run**.

   :::image type="content" source="media/run-command/run-command-get-external-identity-sources.png" alt-text="Screenshot of the Get-ExternalIdentitySources cmdlet in the Run command menu.":::

   | **Field** | **Value** |
   | --- | --- |
   | **Retain up to**  |Retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name. For example, **getExternalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.

    :::image type="content" source="media/run-command/run-packages-execution-command-status.png" alt-text="Screenshot of the Run Execution Status pane in the Azure portal." lightbox="media/run-command/run-packages-execution-command-status.png":::

## Assign more vCenter Server roles to Active Directory identities

After you've added an external identity over LDAP or LDAPS, you can assign vCenter Server roles to Active Directory security groups based on your organization's security controls.

1. Sign in to vCenter Server with cloudadmin privileges, select an item from the inventory, select the **ACTIONS** menu, and choose **Add Permission**.

    :::image type="content" source="media/run-command/ldaps-vcenter-permission-assignment-1.png" alt-text="Screenshot of the ACTIONS menu in vCenter Server with Add Permission option." lightbox="media/run-command/ldaps-vcenter-permission-assignment-1.png":::

1. In the Add Permission prompt:
    1. *Domain*: Select the previously added Active Directory.
    1. *User/Group*: Enter the desired user or group name, find it, then select it.
    1. *Role*: Choose the role to assign.
    1. *Propagate to children*: Optionally, select the checkbox to propagate permissions to child resources.
    :::image type="content" source="media/run-command/ldaps-vcenter-permission-assignment-2.png" alt-text="Screenshot of the Add Permission prompt in vCenter Server." lightbox="media/run-command/ldaps-vcenter-permission-assignment-3.png":::

1. Switch to the **Permissions** tab and verify the permission assignment was added.

    :::image type="content" source="media/run-command/ldaps-vcenter-permission-assignment-3.png" alt-text="Screenshot of the Permissions tab in vCenter Server after adding a permission assignment." lightbox="media/run-command/ldaps-vcenter-permission-assignment-3.png":::

1. Users can now sign in to vCenter Server using their Active Directory credentials.

## Remove AD group from the cloudadmin role

To remove a specified AD group from the cloudadmin role, run the `Remove-GroupFromCloudAdmins` cmdlet:

1. Select **Run command** > **Packages** > **Remove-GroupFromCloudAdmins**.

1. Provide the required values or change the default values, then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **GroupName**  | Name of the group to remove. For example, **VcAdminGroup**.  |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name. For example, **removeADgroup**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.

## Remove existing external identity sources

To remove all existing external identity sources in bulk, run the `Remove-ExternalIdentitySources` cmdlet:

1. Select **Run command** > **Packages** > **Remove-ExternalIdentitySources**.

1. Provide the required values or change the default values, then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60 days.   |
   | **Specify name for execution**  | Alphanumeric name. For example, **remove_externalIdentity**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.

## Rotate an existing external identity source account's username and/or password

1. Rotate the password of the account used for authentication with the AD source in the domain controller.

1. Select **Run command** > **Packages** > **Update-IdentitySourceCredential**.

1. Provide the required values and the updated password, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Credential**  | The domain username and password used for authentication with the AD source (not cloudadmin). The user must be in the **username@avslab.local** format. |
   | **DomainName**  |  The FQDN of the domain. For example, **avslab.local**.  |

1. Check **Notifications** or the **Run Execution Status** pane to see the progress.

> [!IMPORTANT]
> If you don't provide a DomainName, all external identity sources will be removed. The command **Update-IdentitySourceCredential** should be run only after the password is rotated in the domain controller.

## Next steps

Now that you've learned about how to configure LDAP and LDAPS, explore the following topics:

- [How to configure storage policy](configure-storage-policy.md) - Each VM deployed to a vSAN datastore is assigned at least one VM storage policy. Learn how to assign a VM storage policy during an initial deployment of a VM or other VM operations, such as cloning or migrating.
- [Azure VMware Solution identity concepts](concepts-identity.md) - Use vCenter Server to manage virtual machine (VM) workloads and NSX-T Manager to manage and extend the private cloud. Access and identity management use the cloudadmin role for vCenter Server and restricted administrator rights for NSX-T Manager.
- [Configure external identity source for NSX-T](configure-external-identity-source-nsx-t.md) 
- [Azure VMware Solution identity concepts](concepts-identity.md)
- [VMware product documentation](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/administration/GUID-DB5A44F1-6E1D-4E5C-8B50-D6161FFA5BD2.html)
