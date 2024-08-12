---
author: anaharris-ms
ms.service: app-service
ms.topic: include
ms.date: 08/12/2024
ms.author: anaharris
---

### Certificates

App Service certificate resources can be moved to a new resource group or subscription but not across regions. Certificates that can be exported can also be imported into the app or into Key Vault in the new region. This export and import process is equivalent to a move between regions.

There are different types of certificates that need to be taken into consideration as you plan your service relocation:

| Certificate type | Exportable | Comments |
| ----- | ----- | ----- | 
| [App Service managed](../../app-service/configure-ssl-certificate.md#import-an-app-service-certificate) | No | Recreate these certificates in the new region. | 
| [Azure Key Vault managed](../../app-service/configure-ssl-certificate.md#import-a-certificate-from-key-vault) | Yes | These certificates can be [exported from Key Vault](../../key-vault/certificates/how-to-export-certificate.md) and then [imported into Key Vault](../../key-vault/certificates/tutorial-import-certificate.md) in the new region. |
| Private key (self-managed)  | Yes | Certificates you acquired outside of Azure can be exported from App Service and then imported either into the new app or [into Key Vault](../../key-vault/certificates/tutorial-import-certificate.md) in the new region. | 
| Public key | No | Your app might have certificates with only a public key and no secret, which are used to access other secured endpoints. Obtain the required public key certificate files and import them into the app in the new region. |

