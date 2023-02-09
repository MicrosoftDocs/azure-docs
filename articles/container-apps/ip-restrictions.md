---
title: Set up IP restrictions in Azure Container Apps
description: Enable IP restrictions in your app with Azure Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: how-to
ms.date: 02/10/2023
ms.author: v-bcatherine
---

# <a name="ip-access-restrictions"></a>Set up IP restrictions to inbound access restrictions by IP address ranges (preview)

By default, ingress doesn't filter traffic. You can add ip restrictions to limit inbound access to your container app. There are two ways to filter inbound traffic:

* **Allowlist**:  Deny all inbound traffic, but allow access from a list of IP address ranges
* **Denylist**: Allow all inbound traffic, but deny access from a list of IP address ranges

> [!NOTE]
> If defined, all rules must be the same type. You cannot combine allow rules and deny rules.
>
> IPv4 addresses are supported. Define each IPv4 address block in Classless Inter-Domain Routing (CIDR) notation. To learn more about CIDR notation, see [Classless Inter-Domain Routing](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).

## Configure an allowlist
To allow inbound traffic from a specified IP range, run the following Azure CLI command.

```azurecli
az containerapp ingress access-restriction set \
   --name MyContainerapp \
   --resource-group MyResourceGroup \
   --rule-name restrictionName \
   --ip-address 192.168.1.1/28 \
   --description "Restriction description." \
   --action Allow
```

Add more allow rules by repeating the command with a different IP address range in the `--ip-address` parameter. When you configure one or more allow rules, only traffic that matches at least one rule is allowed. All other traffic is denied.

## Configure a denylist

To deny inbound traffic from a specified IP range, run the following Azure CLI command.

```azurecli
az containerapp ingress access-restriction set \
  --name MyContainerapp \
  --resource-group MyResourceGroup \
  --rule-name my-restriction \
  --ip-address 192.168.1.1/28 \
  --description "Restriction description."
  --action Deny
```

Add more deny rules by repeating the command with a different IP address range in the `--ip-address` parameter. When you configure one or more deny rules, any traffic that matches at least one rule is denied. All other traffic is allowed.

## Remove access restrictions

To remove an access restriction, run the following Azure CLI command.

```azurecli
az containerapp ingress access-restriction remove
  --name MyContainerapp \
  --resource-group MyResourceGroup \
  --rule-name my-restriction
```

## Next steps

> [!div class="nextstepaction"]
> [Manage scaling](scale-app.md)