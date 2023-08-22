---
author: justinha
ms.service: active-directory
ms.custom: has-azure-ad-ps-ref
ms.topic: include
ms.date: 02/08/2022
ms.author: justinha
---

To configure your certificate authorities in Azure Active Directory, for each certificate authority, upload the following:

* The public portion of the certificate, in *.cer* format
* The internet-facing URLs where the Certificate Revocation Lists (CRLs) reside

The schema for a certificate authority looks as follows:

```csharp
    class TrustedCAsForPasswordlessAuth
    {
       CertificateAuthorityInformation[] certificateAuthorities;
    }

    class CertificateAuthorityInformation

    {
        CertAuthorityType authorityType;
        X509Certificate trustedCertificate;
        string crlDistributionPoint;
        string deltaCrlDistributionPoint;
        string trustedIssuer;
        string trustedIssuerSKI;
    }

    enum CertAuthorityType
    {
        RootAuthority = 0,
        IntermediateAuthority = 1
    }
```

For the configuration, you can use the [Azure Active Directory PowerShell Version 2](/powershell/azure/active-directory/install-adv2):

1. Start Windows PowerShell with administrator privileges.
2. Install the Azure AD module version [2.0.0.33](https://www.powershellgallery.com/packages/AzureAD/2.0.0.33) or higher.

   ```powershell
       Install-Module -Name AzureAD –RequiredVersion 2.0.0.33
   ```

As a first configuration step, you need to establish a connection with your tenant. As soon as a connection to your tenant exists, you can review, add, delete, and modify the trusted certificate authorities that are defined in your directory.
