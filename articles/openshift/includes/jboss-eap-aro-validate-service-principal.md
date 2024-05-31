---
author: backwind1233
ms.author: zhihaoguo
ms.date: 05/31/2024
---

### Validate the service principal

Use the following steps to validate the service principal:

```
az login --service-principal -u <service-principal-client-id> -p <service-principal-client-secret> --tenant <tenant-id>
az account show
```

Replace `<service-principal-client-id>`, `<service-principal-client-secret>`, and `<tenant-id>` with the values you obtained in the previous steps. If you see the account information, the service principal is valid.
