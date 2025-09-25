---
title: Configure AD DS LDAP over TLS for Azure NetApp Files
description: Describes how to configure AD DS LDAP over TLS for Azure NetApp Files, including root CA certificate management.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 07/01/2025
ms.author: anfdocs
ms.custom: sfi-image-nochange
# Customer intent: “As a system administrator, I want to configure LDAP over TLS for Azure NetApp Files so that I can secure communication between the volumes and the Active Directory server.”
---
# Configure AD DS LDAP over TLS for Azure NetApp Files

You can use Lightweight Directory Access Protocol (LDAP) over TLS to secure communication between an Azure NetApp Files volume and the Active Directory LDAP server. You can enable LDAP over TLS for NFS, SMB, and dual-protocol volumes of Azure NetApp Files.  

## Considerations

* DNS pointer (PTR) records must exist for each AD DS domain controller assigned to the **AD Site Name** specified in the Azure NetApp Files Active Directory connection.
* PTR records must exist for all domain controllers in the site for AD DS LDAP over TLS to function properly.

## Generate and export root CA certificate 

If you don't have a root CA certificate, you need to generate one and export it for use with LDAP over TLS authentication. 

1. [Install the Certification Authority (CA) on Windows Server.](/windows-server/networking/core-network-guide/cncg/server-certs/install-the-certification-authority)

2. [View certificates with the Microsoft Management Console (MMC) snap-in.](/dotnet/framework/wcf/feature-details/how-to-view-certificates-with-the-mmc-snap-in)
    Use the Certificate Manager snap-in to locate the root or issuing certificate for the local device. You should run the Certificate Management snap-in commands from one of the following settings:  
    * A Windows-based client that has joined the domain and has the root certificate installed 
    * Another machine in the domain containing the root certificate  

3. Export the root CA certificate.  
    Root CA certificates can be exported from the Personal or Trusted Root Certification Authorities directory. The following image shows the Personal Root Certification Authority directory:   
    ![Screenshot that shows personal certificates.](./media/configure-ldap-over-tls/personal-certificates.png).  

    Ensure that the certificate is exported in the Base-64 encoded X.509 (.CER) format: 

    ![Screenshot of the Certificate Export Wizard.](./media/configure-ldap-over-tls/certificate-export-wizard.png)

## Enable LDAP over TLS and upload root CA certificate 

1. Go to the NetApp account used for the volume, then select **Active Directory connections**.

1. Select **Join** to create a new AD connection or **Edit** to edit an existing AD connection.  

1. In the **Join Active Directory** or **Edit Active Directory** window that appears, select the **LDAP over TLS** checkbox to enable LDAP over TLS for the volume. Then select **Server root CA Certificate** and upload the [generated root CA certificate](#generate-and-export-root-ca-certificate) to use for LDAP over TLS.  

    ![Screenshot that shows the LDAP over TLS option](./media/configure-ldap-over-tls/ldap-over-tls-option.png)

    Ensure that the certificate authority name can be resolved by DNS. This name is the "Issued By" or "Issuer" field on the certificate:  

    ![Screenshot that shows certificate information](./media/configure-ldap-over-tls/certificate-information.png)

    If you uploaded an invalid certificate, and you have existing AD configurations, SMB volumes, or Kerberos volumes, an error similar to the following occurs: `Unable to validate the LDAP client configuration from LDAP server, please check connectivity or LDAP settings under AD connection.`

    To resolve the error condition, upload a valid root CA certificate to your NetApp account as required by the Windows Active Directory LDAP server for LDAP authentication.

## Disable LDAP over TLS

Disabling LDAP over TLS stops encryption LDAP queries to Active Directory (LDAP server). There are no other precautions or impact on existing Azure NetApp Files volumes. 

1. Go to the NetApp account used for the volume then select **Active Directory connections**.

1. Select **Edit** to edit the existing AD connection.

2. In the **Edit Active Directory** window that appears, deselect the **LDAP over TLS** checkbox then select **Save** to disable LDAP over TLS for the volume.

## Next steps  

* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md) 
* [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md)
* [Modify Active Directory connections for Azure NetApp Files](modify-active-directory-connections.md)
* [Understand the use of LDAP with Azure NetApp Files](lightweight-directory-access-protocol.md)
