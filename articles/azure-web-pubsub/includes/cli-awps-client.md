---
author: vicancy
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 08/06/2021
ms.author: lianwei
---

### Connect to the service

[!INCLUDE [az webpubsub client](cli-awps-client-connect.md)]

Play with it and try joining to groups using `joingroup <group-name>` and send messages to groups using `sendtogroup <group-name>`:

```azurecli
joingroup group1
```

```azurecli
sendtogroup group1 hello
```

[!INCLUDE [publish messages](cli-awps-service.md)]
