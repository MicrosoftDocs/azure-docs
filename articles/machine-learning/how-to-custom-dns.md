---
title: Use custom DNS server
titleSuffix: Azure Machine Learning
description: How to configure a custom DNS server to work with an Azure Machine Learning workspace and private endpoint.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 10/05/2020
ms.topic: conceptual
ms.custom: how-to
---

# How to use your workspace with a custom DNS server

When using Azure Machine Learning with a virtual network, there are [several ways to handle DNS name resolution](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances). By default, Azure automatically handles name resolution for your workspace and private endpoint. However, __when using your own custom DNS server__, you must manually create DNS entries for the workspace.

> [!IMPORTANT]
> This article only covers how to find the fully qualified domain name (FQDN) and IP addresses for these entries it does NOT provide information on configuring the DNS records for these items. Consult the documentation for your DNS software for information on how to add records.

## Prerequisites

- An Azure Virtual Network that uses [your own DNS server](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances#name-resolution-that-uses-your-own-dns-server).

- An Azure Machine Learning workspace with a private endpoint. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

- Familiarity with using [Network isolation during training & inference](how-to-enable-virtual-network.md).

- Optionally, [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) or [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps).

## Find the IP addresses

The following list contains the fully qualified domain names (FQDN) used by your workspace and private endpoint:

* `<workspace-GUID>.workspace.<region>.api.azureml.ms`
* `<workspace-GUID>.studio.workspace.<region>.api.azureml.ms`
* `cert-<workspace-GUID>.workspace.<region>.api.azureml.ms`
* `<workspace-GUID>.workspace.<region>.experiments.azureml.net`
* `<workspace-GUID>.workspace.<region>.modelmanagement.azureml.net`
* `<workspace-GUID>.workspace.<region>.aether.ms`
* `ml-<workspace-name>-<region>-<workspace-guid>.notebooks.azure.ml`
* If you create a compute instance, you must also add an entry for `<instance-name>.<region>.instances.azureml.ms` with private IP of workspace private endpoint. Please note compute instance can be accessed only from within the virtual network.

To find the internal IP addresses for the FQDNs in the VNet, use one of the following methods:

> [!NOTE]
> The fully qualified domain names and IP addresses will be different based on your configuration. For example, the GUID value in the domain name will be specific to your workspace.

# [Azure CLI](#tab/azure-cli)

```azurecli
az network private-endpoint show --endpoint-name <endpoint> --resource-group <resource-group> --query 'customDnsConfigs[*].{FQDN: fqdn, IPAddress: ipAddresses[0]}' --output table
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$workspaceDns=Get-AzPrivateEndpoint -Name <endpoint> -resourcegroupname <resource-group>
$workspaceDns.CustomDnsConfigs | format-table
```

# [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), select your Azure Machine Learning __workspace__.
1. From the __Settings__ section, select __Private endpoint connections__.
1. Select the link in the __Private endpoint__ column that is displayed.
1. A list of the fully qualified domain names (FQDN) and IP addresses for the workspace private endpoint are at the bottom of the page.

:::image type="content" source="./media/how-to-custom-dns/private-endpoint-custom-dns.png" alt-text="List of FQDNs in the portal":::

---

The information returned from all methods is the same; a list of the FQDN and private IP address for the resources.

| FQDN | IP Address |
| ----- | ----- |
| `fb7e20a0-8891-458b-b969-55ddb3382f51.workspace.eastus.api.azureml.ms` | `10.1.0.5` |
| `fb7e20a0-8891-458b-b969-55ddb3382f51.studio.workspace.eastus.api.azureml.ms` | `10.1.0.5` |
| `cert-fb7e20a0-8891-458b-b969-55ddb3382f51.workspace.eastus.api.azureml.ms` | `10.1.0.5` |
| `ml-myworkspace-eastus-fb7e20a0-8891-458b-b969-55ddb3382f51.notebooks.azure.net` | `10.1.0.6` |

> [!IMPORTANT]
> Some FQDNs are not shown in listed by the private endpoint, but are required by the workspace. These FQDNs are listed in the following table, and must also be added to your DNS server:
>
> * `<workspace-GUID>.workspace.<region>.experiments.azureml.net`
> * `<workspace-GUID>.workspace.<region>.modelmanagement.azureml.net`
> * `<workspace-GUID>.workspace.<region>.aether.ms`
> * If you have a compute instance, use `<instance-name>.<region>.instances.azureml.ms`, where `<instance-name>` is the name of your compute instance. Please use private IP address of workspace private endpoint. Please note compute instance can be accessed only from within the virtual network.
>
> For all of these IP address, use the same address as the `*.api.azureml.ms` entries returned from the previous steps.

## Next steps

For more information on using Azure Machine Learning with a virtual network, see the [virtual network overview](how-to-network-security-overview.md).
