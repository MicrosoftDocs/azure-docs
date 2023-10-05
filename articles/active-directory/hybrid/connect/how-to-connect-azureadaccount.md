---
title: 'Change the Microsoft Entra Connector account password'
description: This topic documents how to restore the Microsoft Entra Connector account.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.assetid: 6077043a-27f1-4304-a44b-81dc46620f24
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Change the Microsoft Entra Connector account password
The Microsoft Entra Connector account is supposed to be service free. If you need to reset its credentials, then this topic is for you. For example, if a Global Administrator has by mistake reset the password on the account using PowerShell.

## Reset the credentials
If the Microsoft Entra Connector account cannot contact Microsoft Entra ID due to authentication problems, the password can be reset.

1. Sign in to the Microsoft Entra Connect Sync server and open PowerShell.
2. To provide the Microsoft Entra Global Administrator credentials, run `$credential = Get-Credential`.
3. Run the cmdlet `Add-ADSyncAADServiceAccount -AADCredential $credential`.

   If the cmdlet is successful, the PowerShell command prompt appears. 
   
The cmdlet resets the password for the service account and updates it both in Microsoft Entra ID and the sync engine.

## Known issues these steps can solve
This section is a list of errors reported by customers that were fixed by a credentials reset on the Microsoft Entra Connector account.

---
Event 6900
The server encountered an unexpected error while processing a password change notification:
AADSTS70002: Error validating credentials. AADSTS50054: Old password is used for authentication.

---
Event 659
Error while retrieving password policy sync configuration. Microsoft.IdentityModel.Clients.ActiveDirectory.AdalServiceException:
AADSTS70002: Error validating credentials. AADSTS50054: Old password is used for authentication.

## Next steps
**Overview topics**

* [Microsoft Entra Connect Sync: Understand and customize synchronization](how-to-connect-sync-whatis.md)
* [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md)
