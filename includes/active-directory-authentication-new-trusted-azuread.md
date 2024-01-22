---
author: justinha
ms.service: active-directory
ms.custom: has-azure-ad-ps-ref
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
