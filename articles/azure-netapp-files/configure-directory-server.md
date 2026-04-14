---
title: Configure LDAP directory servers for Azure NetApp Files NFS volumes
description: Azure NetApp Files NFS volumes support FreeIPA, OpenLDAP, and Red Hat Directory Server as alternative directory services in Azure NetApp Files.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 12/09/2025
ms.author: anfdocs
---
# Configure LDAP directory services for Azure NetApp Files NFS volumes (preview)

In addition to native Active Directory support, Azure NetApp Files supports native integration with directory services including FreeIPA, OpenLDAP, and Red Hat Directory Server for lightweight directory access protocol (LDAP) directory servers. With native LDAP directory server support, you can achieve secure and scalable identity-based access control for NFS volumes in Linux environments.

Azure NetApp Files' LDAP integration simplifies file share access management by leveraging trusted directory services. It supports NFSv3 and NFSv4.1 protocols and uses DNS SRV record-based discovery for high availability and load balancing across LDAP servers. From a business perspective, this feature enhances: 

- **Compliance**: Centralized identity management supports auditability and policy enforcement
- **Efficiency**: Reduces administrative overhead by unifying identity controls across Linux and NTFS systems
- **Security**: Supports LDAP over TLS, symmetric/asymmetric name mapping, and extended group memberships
- **Seamless integration**: Works with existing LDAP infrastructure
- **Scalability**: Supports large user and group directories
- **Flexibility**: Compatible with multiple LDAP implementations

## Supported directory services 

* **FreeIPA**: Ideal for secure, centralized identity management in Linux environments
* **OpenLDAP**: Lightweight and flexible directory service for custom deployments
* **Red Hat Directory Server**: Enterprise-grade LDAP service with advanced scalability and security features

>[!IMPORTANT]
>To configure LDAP with Active Directory, see [Configure AD DS LDAP with extended groups for NFS volume access](configure-ldap-extended-groups.md).

## Architecture 

The following diagram outlines how Azure NetApp Files uses LDAP bind/search operations to authenticate users and enforce access control based on directory information.

:::image type="content" source="./media/configure-directory-server/server-diagram.png" alt-text="Diagram of LDAP directory server in Azure NetApp Files." lightbox="./media/configure-directory-server/server-diagram.png":::

The architecture involves the following components:

- Linux VM client: initiates an NFS mount request to Azure NetApp Files
- Azure NetApp Files volume: receives the mount request and performs LDAP queries
- LDAP directory server: responds to bind/search requests with user and group information
- Access control logic: enforces access decisions based on LDAP responses

### Data flow 

1.	Mount Request: The Linux VM sends an NFSv3 or NFSv4.1 mount request to Azure NetApp Files.
2.	LDAP Bind/Search: Azure NetApp Files sends a bind/search request to the LDAP server (FreeIPA, OpenLDAP, or RHDS) using the UID/GID.
3. LDAP Response: The directory server returns user and group attributes.
4. Access Control Decision: Azure NetApp Files evaluates the response and grants or denies access.
5.	Client Access: The decision is communicated back to the client.


## Use cases 

Each directory service appeals to different use cases in Azure NetApp Files. 

### FreeIPA

* **Hybrid Linux environments**: Ideal for enterprises using FreeIPA for centralized identity management across Linux systems in hybrid cloud deployments.
* **HPC and analytics workloads**: Supports secure authentication for high-performance computing clusters and analytics platforms that rely on FreeIPA.
* **Kerberos integration**: Enables environments that require Kerberos-based authentication for NFS workloads without Active Directory.

### OpenLDAP

* **Legacy application support**: Perfect for organizations running legacy or custom applications that depend on OpenLDAP for identity services.
* **Multi-platform identity management**: Provides a lightweight, standards-based solution for managing access across Linux, UNIX, and containerized workloads.
* **Cost-optimized deployments**: Suitable for businesses seeking an open-source, flexible directory solution without the overhead of Active Directory.

### Red Hat Directory Server
 
* **Enterprise-grade security and compliance**: Designed for organizations that require hardened, enterprise-supported LDAP services with strong security controls.
* **Regulated industries**: Ideal for financial, healthcare, and government sectors where compliance and vendor support are critical.
* **Integration with Red Hat Ecosystem**: Seamlessly fits into environments leveraging Red Hat Enterprise Linux and related solutions.

## Considerations 

* FreeIPA, OpenLDAP, and Red Hat Directory Server are supported with NFSv3 and NFSv4.1 volumes; they aren't currently supported with dual-protocol volumes. 
* These directory services aren't currently supported with large volumes. 
* You must configure the LDAP server before creating the volume. 
* You can only configure FreeIPA, OpenLDAP, or Red Hat Directory Server on _new_ NFS volumes. You can't convert existing volumes to use these directory services. 
* [!INCLUDE [Kerberos support limitation](includes/kerberos-other-servers.md)]

## Register the feature

Support for FreeIPA, OpenLDAP, and Red Hat Directory Server is currently in preview. Before connecting your NFS volumes to one of these directory servers, you must register the feature: 

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

* To configure FreeIPA, see the [FreeIPA QuickStart Guide](https://www.freeipa.org/page/Quick_Start_Guide) then follow [Red Hat's guidance](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/linux_domain_identity_authentication_and_policy_guide/client-install#client-install-non-interactive).
* For OpenLDAP, see [OpenLDAP documentation](https://www.openldap.org/doc/).
* For Red Hat Directory Server, follow the [Red Hat documentation](https://docs.redhat.com/en/documentation/red_hat_fuse/6.3/html/security_guide/esbldaptutorialinstallds#ESBLDAPTutorialInstallDS). 
    For more information, see the [install guide for 389 Directory Server](https://www.port389.org/docs/389ds/howto/howto-install-389.html). 

## Configure the LDAP connection in Azure NetApp Files 

1. In the Azure portal, navigate to LDAP connections under Azure NetApp Files. 
1. Create the new LDAP connection. 
1. In the new menu, provide: 

    * **Domain:** The domain name serves as the base DN. 
    * **LDAP servers:** The IP address of the LDAP server. 
    * **LDAP over TLS:** Optionally, check the box to enable LDAP over TLS for secure communication. For more information, see [Configure LDAP over TLS](configure-ldap-over-tls.md).
      
       > [!NOTE]
       > To enable LDAP over TLS on multiple servers, you should generate and install the common certificate on each server and then upload the server CA certificate in the Azure portal.

    * **Server CA certificate:** The certification authority certificate. This option is required if you use LDAP over TLS. 
    * **Certificate CN Host:** The common name server of the host, for example contoso.server.com. 

    :::image type="content" source="./media/configure-directory-server/configure-connection.png" alt-text="Screenshot of Configure LDAP connection options." lightbox="./media/configure-directory-server/configure-connection.png":::

1. Select **Save**. 
1. Once you configure the LDAP connection, you can create an [NFS volume](azure-netapp-files-create-volumes.md).

## Validate the LDAP connection 

1. To validate the connection, navigate to the volume overview for the volume using the LDAP connection.
1. Select **LDAP connection** then **LDAP Group ID List**.  
1. In the Username field, enter the username provided when you configured the LDAP server. Select **Get Group IDs**. Ensure the group IDs match the client and server.

## Next steps

- [Understand LDAP](lightweight-directory-access-protocol.md)
- [Understand name mapping using LDAP](lightweight-directory-access-protocol-name-mapping.md)
- [Understand allow local NFS users with LDAP option](lightweight-directory-access-protocol-local-users.md)
- [Understand LDAP schemas](lightweight-directory-access-protocol-schemas.md)
- [Create an NFS volume](azure-netapp-files-create-volumes.md)
