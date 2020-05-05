---
title: Allow access from public networks
description: Allow access to an Azure container registry from selected public IP addresses or address ranges.
ms.topic: article
ms.date: 05/04/2020
---

# Allow access from selected public networks

An Azure container registry by default accepts connections over the internet from hosts on any network. This article shows how to configure your container registry to allow access from only specific public IP addresses or address ranges. Equivalent steps using the Azure CLI and Azure portal are provided.

Ub IP network rules, provide allowed internet address ranges using CIDR notation such as *16.17.18.0/24* or an individual IP addresses like *16.17.18.19*. IP network rules are only allowed for *public* internet IP addresses. IP address ranges reserved for private networks (as defined in RFC 1918) aren't allowed.

## Prerequisites

* If you don't already have a container registry, create one (Premium SKU required) and push a sample image such as `hello-world` from Docker Hub. For example, use the [Azure portal][quickstart-portal] or the [Azure CLI][quickstart-cli] to create a registry. 

[!INCLUDE [Set up Docker-enabled VM](../../includes/container-registry-docker-vm-setup.md)]

## Access from selected public network - CLI

### Change default network access to registry

By default, an Azure container registry allows connections from hosts on any network. To limit access to a selected network, change the default action to deny access. Substitute the name of your registry in the following [az acr update][az-acr-update] command:

```azurecli
az acr update --name myContainerRegistry --default-action Deny
```

### Add network rule to registry

Use the [az acr network-rule add][az-acr-network-rule-add] command to add a network rule to your registry that allows access from a public IP address or range. For example, substitute the container registry's name and the public IP address of the VM in the following command.

```azurecli
az acr network-rule add \
  --name mycontainerregistry \
  --ip-address <public-IP-address>
```

Continue to [Verify access to the registry](#verify-access-to-the-registry).

## Access from selected public network - portal

1. In the portal, navigate to your container registry.
1. Under **Settings**, select **Networking**.
1. On the **Public access** tab, select to allow public access from **Selected networks**.
1. Under **Firewall**, enter a public IP address, such as your test VM's public IP address. Or, enter an address range in CIDR notation that contains the VM's IP address.
1. Select **Save**.

![Configure firewall rule for container registry][acr-access-selected-networks]

> [!TIP]
> Optionally, enable registry access from a local client computer or IP address range. To allow this access, you need the computer's public IPv4 address. You can find this address using a search like "what is my IP address" in an Internet browser. The current client IPv4 address also appears automatically when you configure firewall settings on the **Networking** page in the portal.

Continue to [Verify access to the registry](#verify-access-to-the-registry).

## Verify access to the registry

After waiting a few minutes for the configuration to update, verify that the VM can access the container registry. Make an SSH connection to your VM, and run the [az acr login][az-acr-login] command to login to your registry. 

```bash
az acr login --name mycontainerregistry
```

You can perform registry operations such as run `docker pull` to pull a sample image from the registry. Substitute an image and tag value appropriate for your registry, prefixed with the registry login server name (all lowercase):

```bash
docker pull mycontainerregistry.azurecr.io/hello-world:v1
``` 

Docker successfully pulls the image to the VM.

This example demonstrates that you can access the private container registry through the network access rule. However, the registry can't be accessed from a different login host that doesn't have a network access rule configured. If you attempt to login from another host using the `az acr login` command or `docker login` command, output is similar to the following:

```Console
Error response from daemon: login attempt to https://xxxxxxx.azurecr.io/v2/ failed with status: 403 Forbidden
```

## Disable public network access

In certain scenarios, you might want to disable all public network access to registry. For example, if you set up a [private endpoint](container-registry-private-link.md) for a registry in a virtual network, you might also decide to disable access from outside the virtual network.

### Disable public access - CLI

Substitute the name of your registry in the following [az acr update][az-acr-update] command:
```azurecli
az acr update --name myContainerRegistry --default-action Deny
```

### Disable public access - Portal

1. In the portal, navigate to your container registry and select **Settings > Networking**.
1. On the **Public access** tab, in **Allow public access**, select **Disabled**. Then select **Save**.

## Restore default registry access

To restore the registry to allow access by default, update the default action. Equivalent steps using the Azure CLI and Azure portal are provided. 

### Restore default registry access - CLI

Substitute the name of your registry in the following [az acr update][az-acr-update] command:

```azurecli
az acr update --name myContainerRegistry --default-action Allow
```

### Restore default registry access - portal

1. In the portal, navigate to your container registry and select **Settings > Networking**.
1. Under **Firewall**, select each address range, and then select the Delete icon.
1. On the **Public access** tab, in **Allow public access**, select **All networks**. Then select **Save**.

## Clean up resources

If you created all the Azure resources in the same resource group and no longer need them, you can optionally delete the resources by using a single [az group delete](/cli/azure/group) command:

```azurecli
az group delete --name myResourceGroup
```

To clean up your resources in the portal, navigate to the myResourceGroup resource group. Once the resource group is loaded, click on **Delete resource group** to remove the resource group and the resources stored there.

## Next steps

[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-network-rule-add]: /cli/azure/acr/network-rule/#az-acr-network-rule-add
[az-acr-network-rule-remove]: /cli/azure/acr/network-rule/#az-acr-network-rule-remove
[az-acr-network-rule-list]: /cli/azure/acr/network-rule/#az-acr-network-rule-list
[az-acr-run]: /cli/azure/acr#az-acr-run
[az-acr-update]: /cli/azure/acr#az-acr-update
[quickstart-portal]: container-registry-get-started-portal.md
[quickstart-cli]: container-registry-get-started-azure-cli.md
[azure-portal]: https://portal.azure.com

[acr-access-selected-networks]: ./media/container-registry-access-selected-networks/acr-access-selected-networks.png
