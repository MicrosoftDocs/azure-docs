---
author: backwind1233
ms.author: zhihaoguo
ms.date: 06/26/2024
ms.topic: include
---

### Validate the service principal

Use the following command to validate the service principal:

```azurecli
az login \
    --service-principal \
    --username <service-principal-client-id> \
    --password <service-principal-client-secret> \
    --tenant <tenant-id>
az account show
```

Replace `<service-principal-client-id>`, `<service-principal-client-secret>`, and `<tenant-id>` with the values you obtained in the previous steps. If you see the account information, the service principal is valid.
