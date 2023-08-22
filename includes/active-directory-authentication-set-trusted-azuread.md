---
author: justinha
ms.service: active-directory
ms.custom: has-azure-ad-ps-ref
ms.topic: include
ms.date: 02/08/2022
ms.author: justinha
---

To modify a trusted certificate authority, use the [Set-AzureADTrustedCertificateAuthority](/powershell/module/azuread/set-azureadtrustedcertificateauthority) cmdlet:

```azurepowershell
    $c=Get-AzureADTrustedCertificateAuthority
    $c[0].AuthorityType=1
    Set-AzureADTrustedCertificateAuthority -CertificateAuthorityInformation $c[0]
```
