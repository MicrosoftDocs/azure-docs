---
title: Configure LDAP directory servers for Azure NetApp Files NFS volumes
description: Azure NetApp Files NFS volumes support FreeIPA, OpenLDAP, and Red Hat Directory Server as alternative directory services in Azure NetApp Files.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 07/01/2025
ms.author: anfdocs
---
# Configure LDAP directory servers for Azure NetApp Files NFS volumes (preview)

In addiition to native Active Directory, Azure NetApp Files supports FreeIPA, OpenLDAP, and Red Hat Directory Server. 

>[!IMPORTANT]
>To configure LDAP with Active Directory, see [Configure AD DS LDAP with extended groups for NFS volume access](configure-ldap-extended-groups.md).

## Considerations 

* FreeIPA, OpenLDAP, and Red Hat Directory Server are supported with NFSv3 and NFSv4.1 volumes; they aren't currently supported with dual-protocol volumes. 
* These directory services aren't currently supported with large volumes. 
* You must configure the LDAP server before creating the volume. 
* You can only configure FreeIPA, OpenLDAP, or Red Hat Directory Server on _new_ NFS volumes. You can't convert an existing NFS volumes to use these LDAP servers. 


## Register the feature

Support for FreeIPA, OpenLDAP, and Red Hat Directory Server is currently in preview. Before connecting your NFS volumes to one of these directory servers, you must register the feature: 

1.  Register the feature

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFOpenLDAP
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFOpenLDAP
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Create the LDAP server 

You must first create the LDAP server before you can connect it to Azure NetApp Files. Follow the instructions for the relevant server: 

* To configure FreeIPA, see the [FreeIPA QuickStart Guide](https://www.freeipa.org/page/Quick_Start_Guide) then follow [Red Hat's guidance](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/linux_domain_identity_authentication_and_policy_guide/client-install#client-install-non-interactive).
* For OpenLDAP, see [OpenLDAP documentation](https://www.openldap.org/doc/).
* For Red Hat Directory Server, follow the [Red Hat documentation](https://docs.redhat.com/en/documentation/red_hat_fuse/6.3/html/security_guide/esbldaptutorialinstallds#ESBLDAPTutorialInstallDS).For additional information, see the [install guide for 389 Directory Server](https://www.port389.org/docs/389ds/howto/howto-install-389.html). 

## Configure the LDAP connection in Azure NetApp Files 

1. In the Azure portal, navigate to LDAP connections under Azure NetApp Files. 
1. Create the new LDAP connection. 
1. In the new menu, provide: 
    * **Domain:** The domain name acts as the base DN. 
    * **LDAP servers:** The IP address of the LDAP server. 
    * **LDAP over TLS:** Check the box to enable LDAP over TLS for secure communication. This is optional. For more information, see [Configure LDAP over TLS](configure-ldap-over-tls.md).
    * **Server CA certificate:** The certification authority certificate. This is required if you select LDAP over TLS. 
    * **Certificate CN Host:** The common name server of the host, for example contoso.server.com. 

    :::image type="content" source="./media/configure-ldap/configure-ldap-connection.png" alt-text="Screenshot of Configure LDAP connection options." lightbox="./media/configure-ldap/configure-ldap-connection.png":::

1. Select **Save**. 

## Validate the LDAP connection 

1. After you've followed the steps to create an [NFS volume](azure-netapp-files-create-volumes.md) with your LDAP server of choice, 
1. In the Protocol menu, ensure you select LDAP. Selecting LDAP presents the LDAP server type action. Select LDAP connection. 
1. To validate the connection, navigate to the volume overview. Select **LDAP connection** then **LDAP Group ID List**.  
1. In the Username field, enter the username used when configuring the LDAP server. Select **Get Group IDs**. Ensure the group IDs match the client and server.

## Next steps

- [Understand LDAP](lightweight-directory-access-protocol.md)
- [Understand name mapping using LDAP](lightweight-directory-access-protocol-name-mapping.md)
- [Understand allow local NFS users with LDAP option](lightweight-directory-access-protocol-local-users.md)
- [Understand LDAP schemas](lightweight-directory-access-protocol-schemas.md)
- [Create an NFS volume](azure-netapp-files-create-volumes.md)