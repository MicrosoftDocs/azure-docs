---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 10/28/2025
ms.author: dobett
---

**Enable resource sync rules.** A deployed instance of Azure IoT Operations with resource sync rules enabled:

Run `enable-rsync` to enable resource sync rules on your Azure IoT Operations instance. This command also sets the required permissions on the custom location:

```bash
az iot ops enable-rsync - n <my instance> -g <my resource group>
```

If the signed-in CLI user doesn't have permission to look up the object ID (OID) of the K8 Bridge service principal, you can provide it explicitly using the `--k8-bridge-sp-oid` parameter:

```bash
az iot ops enable-rsync --k8-bridge-sp-oid <k8 bridge service principal object ID>
```

> [!NOTE]
> You can manually look up the OID by a signed-in CLI principal that has MS Graph app read permissions. Run the following command to get the OID:
> 
> ```bash
> az ad sp list --display-name "K8 Bridge" --query "[0].appId" -o tsv
> ```
