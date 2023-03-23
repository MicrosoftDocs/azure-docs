---
author: cephalin
ms.author: cephalin
ms.topic: include
ms.date: 01/30/2023
---

### [With an A record](#tab/a)

Create two records according to the following table:

|Record type|Host|Value|Comments|
|--- |--- |--- |--- |
|A|\<subdomain\> (for example, www)|IP address shown in the **Add custom domain** dialog.| The domain mapping itself. |
|TXT|asuid.\<subdomain\> (for example, asuid.www)|The domain verification ID shown in the **Add custom domain** dialog.| App Service accesses the `asuid.<subdomain>` TXT record to verify your ownership of the custom domain. |

![Screenshot that shows a DNS records subdomain page.](../../media/app-service-web-tutorial-custom-domain/a-record-subdomain.png)

### [With a CNAME record](#tab/cname)

Create two records according to the following table:

| Record type | Host | Value | Comments |
| - | - | - |
| CNAME | `<subdomain>` (for example, `www`) | `<app-name>.azurewebsites.net` | The domain mapping itself. |
| TXT | `asuid.<subdomain>` (for example, `asuid.www`) | The domain verification ID shown in the **Add custom domain** dialog. | App Service accesses the `asuid.<subdomain>` TXT record to verify your ownership of the custom domain. |

![Screenshot that shows the portal navigation to an Azure app.](../../media/app-service-web-tutorial-custom-domain/cname-record.png)

-----

