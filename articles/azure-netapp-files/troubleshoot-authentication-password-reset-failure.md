---
title: Troubleshoot Azure NetApp Files SMB authentication and CIFS password reset failures
description: Describes how to troubleshoot the SMB authentication and CIFS password reset failures
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: troubleshooting
ms.date: 07/08/2026
ms.author: anfdocs

---

# Troubleshoot Azure NetApp Files SMB authentication and CIFS password reset failures

This article describes the symptoms, cause, and resolution for SMB authentication and CIFS password reset failures.

You might experience one or more of the following issues with Azure NetApp Files SMB volumes:

* Users can't access SMB shares.
* CIFS health checks report authentication failures.
* CIFS password reset operations fail.
* SMB authentication failures occur after Active Directory changes.
* Errors similar to the following are reported:
* Password update failed.
    * SecD Error: LDAP attribute missing
    * LDAP returned 0 results for attribute
    * msDS-SupportedEncryptionTypes
 
## Cause

These problems occur when the Azure NetApp Files computer account in Active Directory has an invalid configuration or is missing required attributes. Recent Active Directory security hardening activities, updates, or manual modifications to the computer account can cause authentication failures and prevent CIFS password reset operations.

## Resolution

Verify that the Azure NetApp Files computer account:

* Exists in Active Directory.
* Is enabled.
* Isn't modified or recreated incorrectly.
* Returns a valid value for the `msDS-SupportedEncryptionTypes` attribute.

Also verify that the account used by the Azure NetApp Files Active Directory connection has permissions to read and update computer account attributes.

After correcting any Active Directory configuration issues:   

1. Retry the CIFS password reset operation.   
1. Verify that CIFS health checks report a healthy status.  
1. Confirm that users can access SMB shares successfully. 

If the issue persists
Review recent Active Directory changes, security hardening activities, and updates that might have affected the computer account configuration. If the problem persists, create a Microsoft Support request.

## Next steps

* [Create and manage Active Directory connections for Azure NetApp Files](create-active-directory-connections.md)
* [SMB FAQs for Azure NetApp Files](faq-smb.md)
* [Troubleshoot Azure NetApp Files using diagnose and solve problems tool](troubleshoot-diagnose-solve-problems.md)

