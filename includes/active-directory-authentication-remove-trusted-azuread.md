---
author: justinha
ms.service: active-directory
ms.custom: has-azure-ad-ps-ref
ms.topic: include
ms.date: 06/07/2022
ms.author: justinha
---

To remove a trusted certificate authority, use the [Remove-AzureADTrustedCertificateAuthority](/powershell/module/azuread/remove-azureadtrustedcertificateauthority) cmdlet:

```azurepowershell
    $c=Get-AzureADTrustedCertificateAuthority
    Remove-AzureADTrustedCertificateAuthority -CertificateAuthorityInformation $c[2]
```

You can change the command to remove 0<sup>th</sup> element by changing to
`Remove-AzureADTrustedCertificateAuthority -CertificateAuthorityInformation $c[0]`.
