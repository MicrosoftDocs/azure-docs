---
title: Configure LDAP directory servers for Azure NetApp Files NFS volumes
description: Azure NetApp Files NFS volumes support FreeIPA, Red Hat IdM OpenLDAP, Red Hat Directory Server, and Oracle Unified Directory (OUD) as alternative directory services in Azure NetApp Files.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 12/09/2025
ms.author: anfdocs
---
# Configure LDAP directory services for Azure NetApp Files NFS volumes (preview)

In addition to native Active Directory support, Azure NetApp Files supports native integration with directory services including FreeIPA, Red Hat Identity Management (IdM), OpenLDAP, Red Hat Directory Server, and Oracle Unified Directory (OUD) for lightweight directory access protocol (LDAP) directory servers. With native LDAP directory server support, you can achieve secure and scalable identity-based access control for NFS volumes in Linux environments.

Azure NetApp Files' LDAP integration simplifies file share access management by leveraging trusted directory services. It supports NFSv3 and NFSv4.1 protocols and uses DNS SRV record-based discovery for high availability and load balancing across LDAP servers. From a business perspective, this feature enhances: 

- **Compliance**: Centralized identity management supports auditability and policy enforcement
- **Efficiency**: Reduces administrative overhead by unifying identity controls across Linux and NTFS systems
- **Security**: Supports LDAP over TLS, symmetric/asymmetric name mapping, and extended group memberships
- **Seamless integration**: Works with existing LDAP infrastructure
- **Scalability**: Supports large user and group directories
- **Flexibility**: Compatible with multiple LDAP implementations

## Supported directory services 

* **FreeIPA**: Ideal for secure, centralized identity management in Linux environments
* **Red Hat IdM**: Centralized identity and access management in Linux environments
* **OpenLDAP**: Lightweight and flexible directory service for custom deployments
* **Red Hat Directory Server**: Enterprise-grade LDAP service with advanced scalability and security features
* **Oracle Unified Directory**: Enterprise-grade LDAP directory service ideal for Oracle application ecosystems, with multi-master replication and comprehensive compliance features

>[!IMPORTANT]
>To configure LDAP with Active Directory, see [Configure AD DS LDAP with extended groups for NFS volume access](configure-ldap-extended-groups.md).

## Architecture 

The following diagram outlines how Azure NetApp Files uses LDAP bind/search operations to authenticate users and enforce access control based on directory information.

:::image type="content" source="./media/configure-directory-server/server-diagram.png" alt-text="Diagram of LDAP directory server in Azure NetApp Files." lightbox="./media/configure-directory-server/server-diagram.png":::

The architecture involves the following components:

- Client Linux VM: initiates an NFS mount request to Azure NetApp Files
- Azure NetApp Files volume: receives the mount request and performs LDAP queries
- LDAP directory server: responds to bind/search requests with user and group information
- Access control decision: enforces access decisions based on LDAP responses

### Data flow 

1.	Mount Request: The Linux VM sends an NFSv3 or NFSv4.1 mount request to Azure NetApp Files.
2.	LDAP Bind/Search: Azure NetApp Files sends a bind/search request to the LDAP server (FreeIPA, Red Hat IdM, OpenLDAP, or RHDS) using the UID/GID.
3.  LDAP Response: The directory server returns user and group attributes.
4.  Access Control Decision: Azure NetApp Files evaluates the response and grants or denies access.
5.	Client Access: The decision is communicated back to the client.


## Considerations 

* FreeIPA, Red Hat IdM, OpenLDAP, Red Hat Directory Server, and Oracle Unified Directory are supported with NFSv3 and NFSv4.1 volumes; they aren't currently supported with dual-protocol volumes. 
* You must configure the LDAP server before creating the volume. 
* You can only configure FreeIPA, Red Hat IdM, OpenLDAP, Red Hat Directory Server, or Oracle Unified Directory on _new_ NFS volumes. You can't convert existing volumes to use these directory services. 
* [!INCLUDE [Kerberos support limitation](includes/kerberos-other-servers.md)]
* By default, the Time-to-Live (TTL) for both positive and negative user/group authentication entries in the NFS credential cache is set to 1 hour.
* You should contact Red Hat (IdM) Support for any IdM availability, connectivity, or directory/authentication issues observed directly on the IdM server. You should contact NetApp Support for issues relating to Azure NetApp Files integration, configuration, or access.
* You should contact Oracle Support for any LDAP connectivity or directory data issues observed directly with Oracle Unified Directory. You should contact NetApp Support for issues relating to Azure NetApp Files integration and operations.


## Register the feature

Support for FreeIPA, Red Hat IdM, OpenLDAP, Red Hat Directory Server, and Oracle Unified Directory is currently in preview. Before connecting your NFS volumes to one of these directory servers, you must register the feature: 

1.  Register the feature:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFOpenLDAP
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** can remain in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFOpenLDAP
    ```

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Create the LDAP server 

You must first create the LDAP server before you can connect it to Azure NetApp Files. Follow the instructions for the relevant server: 

* To configure FreeIPA, see the [FreeIPA QuickStart Guide](https://www.freeipa.org/page/Quick_Start_Guide) then follow [Red Hat's guidance](https://docs.redhat.com/documentation/red_hat_enterprise_linux/7/html/linux_domain_identity_authentication_and_policy_guide/client-install#client-install-non-interactive).
* To configure RedHat IDM, see [Red Hat documentation](https://docs.redhat.com/documentation/red_hat_enterprise_linux/8/html/installing_identity_management/index). 
* To configure OpenLDAP, see [OpenLDAP documentation](https://www.openldap.org/doc/).
* To configure Red Hat Directory Server, follow the [Red Hat documentation](https://docs.redhat.com/documentation/red_hat_fuse/6.3/html/security_guide/esbldaptutorialinstallds#ESBLDAPTutorialInstallDS). For more information, see the [Install Red Hat Directory Server](https://docs.redhat.com/documentation/red_hat_directory_server/13/html/installing_red_hat_directory_server/index). 
* To configure Oracle Unified Directory, follow the [Oracle Unified Directory documentation](https://docs.oracle.com/en/middleware/idm/unified-directory/14.1.2/install.html). 


## Configure the LDAP connection in Azure NetApp Files 

1. In the Azure portal, select **LDAP connections** within the NetApp account. 
1. Select **+ Create** to create a new LDAP connection.

    :::image type="content" source="./media/configure-directory-server/navigate-configure-connection.png" alt-text="Screenshot to navigate to Configure LDAP connection options." lightbox="./media/configure-directory-server/navigate-configure-connection.png":::

1. In the Configure LDAP connection window, provide the **Connection details**:

    :::image type="content" source="./media/configure-directory-server/configure-connection.png" alt-text="Screenshot of Configure LDAP connection options." lightbox="./media/configure-directory-server/configure-connection.png":::

    * **Domain name:** The domain name serves as the base DN. 
    * **LDAP servers:** The IP address of the LDAP server. 
    * **LDAP over TLS:** Optionally, check the box to enable LDAP over TLS for secure communication. 
      
       > [!NOTE]
       > To enable LDAP over TLS on multiple servers, you should generate and install the common certificate on each server and then upload the server CA certificate in the Azure portal.

    * **Server CA certificate:** The certification authority certificate. This option is required if you use LDAP over TLS. 
    * **Certificate CN host:** The common name server of the host, for example server.contoso.com. 
    
    
1. Select the **Authentication type**

    * **Anonymous:** Connects without providing a distinguished name or password. Access is governed by the LDAP server's anonymous access policies. 
    * **Simple:** Authenticates using the specified Bind DN and a password retrieved from a secret stored in Azure Key Vault. 

    :::image type="content" source="./media/configure-directory-server/authentication-settings.png" alt-text="Screenshot of the authentication setting options." lightbox="./media/configure-directory-server/authentication-settings.png":::

1. In the **Bind DN username**, specify the distinguished name of the account used to authenticate with the LDAP server.  
    Example: uid=binduser,cn=users,cn=accounts,dc=contoso,dc=com

1. Select the secret in Azure Key Vault that contains the bind password for LDAP authentication.

    * **Enter Secret URI:** You can manually enter the secret identifier.
    * **Select from Key Vault:** You can select the secret from the Azure Key Vault.

    The Key Vault and Secret are displayed. You can click **Change selection** to select another secret.

1. Select the identity type used to access the Key Vault secret. To configure a managed identity, click **Add New Identity** in the edit window and select one of the following:

    * **System-assigned:** Enable the system-assigned managed identity.
    * **User-assigned:** Select or add an existing user-assigned managed identity.

    > [!NOTE]
    > The identity must be granted at minimum the **Key Vault Secrets User** role on the target Key Vault.
    
   
1. Select **Save**. 
1. Once you configure the LDAP connection, you can create an [NFS volume](azure-netapp-files-create-volumes.md).

## Validate the LDAP connection 

1. To validate the connection, navigate to the volume overview for the volume using the LDAP connection.
1. Select **LDAP connection** then **LDAP Group ID List**.  
1. In the Username field, enter the username provided when you configured the LDAP server. Select **Get Group IDs**. Ensure the group IDs match the client and server.

For more information, see [Troubleshoot user access on LDAP volumes in Azure NetApp Files](troubleshoot-user-access-ldap.md).

## Next steps

- [Understand LDAP](lightweight-directory-access-protocol.md)
- [Understand name mapping using LDAP](lightweight-directory-access-protocol-name-mapping.md)
- [Understand allow local NFS users with LDAP option](lightweight-directory-access-protocol-local-users.md)
- [Understand LDAP schemas](lightweight-directory-access-protocol-schemas.md)
- [Create an NFS volume](azure-netapp-files-create-volumes.md)
