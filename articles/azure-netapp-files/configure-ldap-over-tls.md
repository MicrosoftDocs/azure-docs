---
title: Configure AD DS LDAP over TLS for Azure NetApp Files | Microsoft Docs
description: Describes how to configure AD DS LDAP over TLS for Azure NetApp Files, including root CA certificate management. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 02/23/2023
ms.author: anfdocs
---
# Configure AD DS LDAP over TLS for Azure NetApp Files

You can use LDAP over TLS to secure communication between an Azure NetApp Files volume and the Active Directory LDAP server.  You can enable LDAP over TLS for NFS, SMB, and dual-protocol volumes of Azure NetApp Files.  

## Considerations

* DNS PTR records must exist for each AD DS domain controller assigned to the **AD Site Name** specified in the Azure NetApp Files Active Directory connection.  
* PTR records must exist for all domain controllers in the site for AD DS LDAP over TLS to function properly.

## Generate and export root CA certificate 

If you do not have a root CA certificate, you need to generate one and export it for use with LDAP over TLS authentication. 

1. Follow [Install the Certification Authority](/windows-server/networking/core-network-guide/cncg/server-certs/install-the-certification-authority) to install and configure AD DS Certificate Authority. 

2. Follow [View certificates with the MMC snap-in](/dotnet/framework/wcf/feature-details/how-to-view-certificates-with-the-mmc-snap-in) to use the MMC snap-in and the Certificate Manager tool.  
    Use the Certificate Manager snap-in to locate the root or issuing certificate for the local device. You should run the Certificate Management snap-in commands from one of the following settings:  
    * A Windows-based client that has joined the domain and has the root certificate installed 
    * Another machine in the domain containing the root certificate  

3. Export the root CA certificate.  
    Root CA certificates can be exported from the Personal or Trusted Root Certification Authorities directory, as shown in the following examples:   
    ![screenshot that shows personal certificates](../media/azure-netapp-files/personal-certificates.png)   
    ![screenshot that shows trusted root certification authorities](../media/azure-netapp-files/trusted-root-certification-authorities.png)    

    Ensure that the certificate is exported in the Base-64 encoded X.509 (.CER) format: 

    ![Certificate Export Wizard](../media/azure-netapp-files/certificate-export-wizard.png)

## Enable LDAP over TLS and upload root CA certificate 

1. Go to the NetApp account used for the volume, and select **Active Directory connections**. Then, select **Join** to create a new AD connection or **Edit** to edit an existing AD connection.  

2. In the **Join Active Directory** or **Edit Active Directory** window that appears, select the **LDAP over TLS** checkbox to enable LDAP over TLS for the volume. Then select **Server root CA Certificate** and upload the [generated root CA certificate](#generate-and-export-root-ca-certificate) to use for LDAP over TLS.  

    ![Screenshot that shows the LDAP over TLS option](../media/azure-netapp-files/ldap-over-tls-option.png)

    Ensure that the certificate authority name can be resolved by DNS. This name is the "Issued By" or "Issuer" field on the certificate:  

    ![Screenshot that shows certificate information](../media/azure-netapp-files/certificate-information.png)

If you uploaded an invalid certificate, and you have existing AD configurations, SMB volumes, or Kerberos volumes, an error similar to the following occurs:

`Error updating Active Directory settings The LDAP client configuration "ldapUserMappingConfig" for Vservers is an invalid configuration.`

To resolve the error condition, upload a valid root CA certificate to your NetApp account as required by the Windows Active Directory LDAP server for LDAP authentication.

## Disable LDAP over TLS

Disabling LDAP over TLS stops encrypting LDAP queries to Active Directory (LDAP server). There are no other precautions or impact on existing ANF volumes. 

1. Go to the NetApp account that is used for the volume and select **Active Directory connections**. Then select **Edit** to edit the existing AD connection.

2. In the **Edit Active Directory** window that appears, deselect the **LDAP over TLS** checkbox and select **Save** to disable LDAP over TLS for the volume.


## Next steps  

* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md) 
* [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md)
* [Modify Active Directory connections for Azure NetApp Files](modify-active-directory-connections.md)
* [Understand the use of LDAP with Azure NetApp Files](lightweight-directory-access-protocol.md)
