---
author: justinha
ms.service: active-directory
ms.custom: has-azure-ad-ps-ref, azure-ad-ref-level-one-done
ms.topic: include
ms.date: 10/13/2023
ms.author: justinha
---

To configure your certificate authorities in Microsoft Entra ID, for each certificate authority, upload the following:

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

For the configuration, you can use [Microsoft Graph PowerShell](/powershell/microsoftgraph):

1. Start Windows PowerShell with administrator privileges.
2. Install [Microsoft Graph PowerShell](/powershell/microsoftgraph/installation):

   ```powershell
       Install-Module Microsoft.Graph
   ```

As a first configuration step, you need to establish a connection with your tenant. As soon as a connection to your tenant exists, you can review, add, delete, and modify the trusted certificate authorities that are defined in your directory.
