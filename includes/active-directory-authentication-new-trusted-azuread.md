---
author: justinha
ms.service: active-directory
ms.topic: include
ms.date: 02/08/2022
ms.author: justinha
---

To create a trusted certificate authority, use the [New-AzureADTrustedCertificateAuthority](/powershell/module/azuread/new-azureadtrustedcertificateauthority) cmdlet and set the **crlDistributionPoint** attribute to a correct value:

```azurepowershell
    $cert=Get-Content -Encoding byte "[LOCATION OF THE CER FILE]"
    $new_ca=New-Object -TypeName Microsoft.Open.AzureAD.Model.CertificateAuthorityInformation
    $new_ca.AuthorityType=0
    $new_ca.TrustedCertificate=$cert
    $new_ca.crlDistributionPoint="<CRL Distribution URL>"
    New-AzureADTrustedCertificateAuthority -CertificateAuthorityInformation $new_ca
```

Each trusted CA in a user certificate chain needs to be uploaded to Azure AD. The root and each of the intermediate CAs be seen as "trusted root CAs".
For example, if you have a classic two-tier PKI (RootCA + IntermediateCA), you must import both public key certificates (Root + Intermediate) into Azure AD for CBA to work.
If the root CA and every intermediate CA is not imported in to Azure AD, the certificate chain validation will fail, and authentication will fail.

Let's explain some of the cmdlet parameters:

`$new_ca.AuthorityType=0` is only for root CA. For all intermediate CAs, you should set `$new_ca.AuthorityType=1`.

The value for `$new_ca.crlDistributionPoint` is the http location for the CA's Certificate Revocation List (CRL). 
If the issuing CA runs Windows Server, you can find the location a couple ways:

- In the properties of the CA in the Certificate Authority Microsoft Management Console (MMC)
- On the CA by running `certutil -cainfo cdp` at the command line. 

A root certificate will not have a CRL entry, so you must walk the certificate chain down to the leaf entity certificate.

The "<CRL Distribution URL>" for the root CA needs to point to the intermediate "issuing" CA below it.  

The "<CRL Distribution URL>" value for the intermediate CA needs to point to the URL value that will only be found in the end entity certificate.  

The following image shows how to find the CRL Distribution URL value for your CA where the first one is a root certificate and the second one is an intermediate certificate.

:::image type="content" border="true" source="./media/active-directory-authentication-new-trusted-azuread/crl.png" alt-text="Diagram of how to find the CRL Distribution URL" lightbox="./media/active-directory-authentication-new-trusted-azuread/crl.png":::
