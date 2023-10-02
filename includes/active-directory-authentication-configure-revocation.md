---
author: justinha
ms.service: active-directory
ms.custom: has-azure-ad-ps-ref
ms.topic: include
ms.date: 02/08/2022
ms.author: justinha
---

To revoke a client certificate, Azure Active Directory fetches the certificate revocation list (CRL) from the URLs uploaded as part of certificate authority information and caches it. The last publish timestamp (**Effective Date** property) in the CRL is used to ensure the CRL is still valid. The CRL is periodically referenced to revoke access to certificates that are a part of the list.

If a more instant revocation is required (for example, if a user loses a device), the authorization token of the user can be invalidated. To invalidate the authorization token, set the **StsRefreshTokenValidFrom** field for this particular user using Windows PowerShell. You must update the **StsRefreshTokenValidFrom** field for each user you want to revoke access for.

To ensure that the revocation persists, you must set the **Effective Date** of the CRL to a date after the value set by **StsRefreshTokenValidFrom** and ensure the certificate in question is in the CRL.

The following steps outline the process for updating and invalidating the authorization token by setting the **StsRefreshTokenValidFrom** field.

1. Connect with admin credentials to the MSOL service:

   ```powershell
           $msolcred = get-credential
            connect-msolservice -credential $msolcred
   ```

2. Retrieve the current StsRefreshTokensValidFrom value for a user:

   ```powershell
           $user = Get-MsolUser -UserPrincipalName test@yourdomain.com`
           $user.StsRefreshTokensValidFrom
   ```

3. Configure a new StsRefreshTokensValidFrom value for the user equal to the current timestamp:

   ```powershell
           Set-MsolUser -UserPrincipalName test@yourdomain.com -StsRefreshTokensValidFrom ("03/05/2021")
   ```

The date you set must be in the future. If the date is not in the future, the **StsRefreshTokensValidFrom** property is not set. If the date is in the future, **StsRefreshTokensValidFrom** is set to the current time (not the date indicated by Set-MsolUser command).
