---
title: Set up IP ingress restrictions in Azure Container Apps
description: Enable IP restrictions in your app with Azure Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: how-to
ms.date: 02/10/2023
ms.author: v-bcatherine
---

# Set up IP ingress restrictions in Azure Container Apps (preview)

Azure Container Apps' ingress feature lets you control inbound traffic to your container app.  You can configure IP ingress restriction to limit inbound access to your container app. There are two types of IP ingress restrictions:

* *Allow*:  Allow inbound traffic from address ranges you specify in allow rules.
* *Deny*: Deny all inbound traffic from address ranges you specify in deny rules.

If no IP restriction rules are defined, all inbound traffic is allowed.

## Configure IP ingress restrictions

You can configure IP ingress restrictions using the Azure CLI or the Azure portal.

The `ip-address` parameter accepts a single IP address or a range of IP addresses in CIDR notation. For example, To allow access from a single IP address, use the following format: `--ip-address 19.168.1.1./24`.

> [!NOTE]
> If defined, all rules must be the same type. You cannot combine allow rules and deny rules.
>
> IPv4 addresses are supported. Define each IPv4 address block in Classless Inter-Domain Routing (CIDR) notation. To learn more about CIDR notation, see [Classless Inter-Domain Routing](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).

### Configure IP ingress restrictions using the Azure portal

You can manage IP ingress restrictions from **Ingress** on your container app resource page in the portal.

1. Go to your container app resource page in the Azure portal.
1. Select **Ingress** from the left side menu.
1. Select the **IP Security Restrictions Mode** toggle to enable IP restrictions.  You can choose to Allow or Deny traffic from the specified IP address ranges.
1. Select **Add* to create the rule
    :::image type="content" source="media/ingress/screenshot-ingress-page-ip-restrictions.png" alt-text="Screenshot of IP restriction settings on container app Ingress page.":::
1. Enter information in the following fields:
    1. **IPv4 address or range**: Enter the IP address or range of IP addresses in CIDR notation. For example, to allow access from a single IP address, use the following format: *10.200.10.2/32*.
    1. **Name**: Enter a name for the rule.
    1. **Description**: Enter a description for the rule.
1. Select **Save** to save the rule.
    :::image type="content" source="media/ingress/screenshot-ip-restriction-allow-rule-settings.png" alt-text="Screenshot of IP restrictions Add DENY rule page":::
1. Repeat steps 4-6 to add more rules.
1. When you have finished adding rules, select **Save** to save the rules.
    :::image type="content" source="media/ingress/screenshot-save-ip-restriction.png" alt-text="Screenshot to save IP restrictions on container app Ingress page.":::

You can edit and delete rules from the IP restrictions list on the **Ingress** page.

### Configure IP ingress restrictions using the Azure CLI

The `az containerapp ingress access-restriction set` command group uses the following parameters.

| Argument | Values | Description |
|`--action` (required) | Allow, Deny | Specifies whether to allow or deny access from the specified IP address range. |
| `--ip-address` (required) | IP address or range of IP addresses in CIDR notation | Specifies the IP address range to allow or deny. |
| `--rule-name` (required) | String | Specifies the name of the access restriction rule. |
| `--description` | String | Specifies a description for the access restriction rule. |

Add more rules by repeating the command with a different IP address range in the `--ip-address` parameter. When you configure one or more rules, only traffic that matches at least one rule is allowed. All other traffic is denied.

#### Configure allow rules

The following example `az containerapp access-restriction set` command creates an access rule to allow inbound traffic from a specified IP range.

```azurecli
az containerapp ingress access-restriction set \
   --name MyContainerapp \
   --resource-group MyResourceGroup \
   --rule-name myRestrictionName \
   --ip-address 192.168.1.1/28 \
   --description "Restriction description." \
   --action Allow
```

You can add to the allow rules by repeating the command with a different `--ip-address` and `--rule-name` values.

#### Configure deny rules

The following example of the `az containerapp access-restriction set` command creates an access rule to deny inbound traffic from a specified IP range.

```azurecli
az containerapp ingress access-restriction set \
  --name MyContainerapp \
  --resource-group MyResourceGroup \
  --rule-name my-restriction \
  --ip-address 192.168.1.1/28 \
  --description "Restriction description."
  --action Deny
```

You can add to the deny rules by repeating the command with a different `--ip-address` and `--rule-name` values.

### Remove access restrictions

The following example `az containerapp ingress access-restriction remove` command removes a rule.

```azurecli
az containerapp ingress access-restriction list
  --name MyContainerapp \
  --resource-group MyResourceGroup \
  --rule-name my-restriction
```

### List access restrictions

The following example `az containerapp ingress access-restriction list` command lists the IP restriction rules for the container app.

```azurecli
az containerapp ingress access-restriction list
  --name MyContainerapp \
  --resource-group MyResourceGroup
```


## Next steps

> [!div class="nextstepaction"]
> [Manage scaling](scale-app.md)