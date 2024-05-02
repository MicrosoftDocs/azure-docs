---
title: Updating ACL for Network-to-Network Interconnects (NNI)
description: Learn the process of updating ACLs associated for Network-to-Network Interconnects (NNI)
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/18/2024
ms.custom: template-how-to
---

# Updating ACL on NNI or External Network

The Nexus Network Fabric offers several methods for updating Access Control Lists (ACLs) applied on NNI or Isolation Domain External Networks. Below are two options:

## Option 1: Replace existing ACL

Create a new ACL using the az networkfabric acl create command.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

1. **Set subscription (if necessary):**
 
If you have multiple subscriptions and need to set one as the default, you can do so with:
 
```bash
az account set --subscription <subscription-id>
```

2. **Create ACL**

Use the `az networkfabric acl create` command to create the ACL with the desired parameters. Here's a general template:

```bash
az networkfabric acl create --resource-group "<resource-group>" --location "<location>" --resource-name "<acl-name>" --annotation "<annotation>" --configuration-type "<configuration-type>" --default-action "<default-action>" --match-configurations "<match-configurations>" --actions "<actions>"
```

3. **Update the NNI or External Network by passing a resource ID to `--ingress-acl-id` and `--egress-acl-id` parameter.**

```Azure CLI
az networkfabric nni update --resource-group "<resource-group-name>" --resource-name "<nni-name>" --fabric "<fabric-name>" --ingress-acl-id "<ingress-acl-resource-id>" --egress-acl-id "<egress-acl-resource-id>"
```

| Parameter            | Description                                                                                      |
|----------------------|--------------------------------------------------------------------------------------------------|
| `--resource-group`   | Name of the resource group containing the network fabric instance.                              |
| `--resource-name`    | Name of the network fabric NNI (Network-to-Network Interface) to be updated.                    |
| `--fabric`           | Name of the fabric where the NNI is provisioned.                                                     |
| `--ingress-acl-id`   | Resource ID of the ingress access control list (ACL) for inbound traffic (null for no specific ACL). |
| `--egress-acl-id`    | Resource ID of the egress access control list (ACL) for outbound traffic (null for no specific ACL). |

> [!NOTE]
> Based on requirements, either the Ingress, Egress, or both can be updated.

4. **Commit configuration changes:**

Execute `fabric commit-configuration` to commit the configuration changes.

```Azure CLI
az networkfabric fabric commit-configuration --resource-group "<resource-group>" --resource-name "<fabric-name>"
```

| Parameter        | Description                                                  |
|------------------|--------------------------------------------------------------|
| `--resource-group` | The name of the resource group containing the Nexus Network Fabric. |
| `--resource-name`  | The name of the Nexus Network Fabric to which the configuration changes will be committed. |

5. **Verify changes:**

Verify the changes using the `resource list` command.

## Option 2: Update existing ACL properties

Use the ACL update command to modify the properties of an existing ACL. 

1. Update the NNI or External Network by passing a null ID to `--ingress-acl-id` and `--egress-acl-id`.

```Azure CLI
az networkfabric nni update --resource-group "<resource-group-name>" --resource-name "<nni-name>" --fabric "<fabric-name>" --ingress-acl-id null --egress-acl-id null
```

| Parameter            | Description                                                                                      |
|----------------------|--------------------------------------------------------------------------------------------------|
| `--resource-group`   | Name of the resource group containing the network fabric instance.                              |
| `--resource-name`    | Name of the network fabric NNI (Network-to-Network Interface) to be updated.                    |
| `--fabric`           | Name of the fabric where the NNI is provisioned.                                                     |
| `--ingress-acl-id`   | Resource ID of the ingress access control list (ACL) for inbound traffic (null for no specific ACL). |
| `--egress-acl-id`    | Resource ID of the egress access control list (ACL) for outbound traffic (null for no specific ACL). |

> [!NOTE]
> Based on requirements, either the Ingress, Egress, or both can be updated.

2. Execute `fabric commit-configuration`. 

```Azure CLI
az networkfabric fabric commit-configuration --resource-group "<resource-group>" --resource-name "<fabric-name>"
```

| Parameter        | Description                                                  |
|------------------|--------------------------------------------------------------|
| `--resource-group` | The name of the resource group containing the Nexus Network Fabric. |
| `--resource-name`  | The name of the Nexus Network Fabric to which the configuration changes will be committed. |

4. Verify the changes using the `resource list` command.

## Next Steps

[Deleting ACLs associated with Network-to-Network Interconnects (NNI)](howto-delete-access-control-list-network-to-network-interconnect.md)