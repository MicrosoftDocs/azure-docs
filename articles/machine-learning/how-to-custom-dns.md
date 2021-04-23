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
ms.date: 04/01/2021
ms.topic: how-to
ms.custom: contperf-fy21q3
---

# How to use your workspace with a custom DNS server

When using an Azure Machine Learning workspace with a private endpoint, there are [several ways to handle DNS name resolution](../private-link/private-endpoint-dns.md). By default, Azure automatically handles name resolution for your workspace and private endpoint. If you instead __use your own custom DNS server__, you must manually create DNS entries or use conditional forwarders for the workspace.

> [!IMPORTANT]
> This article covers how to find the fully qualified domain names (FQDN) and IP addresses for these entries if you would like to manually register DNS records in your DNS solution. Additionally this article provides architecture recommendations for how to configure your custom DNS solution to automatically resolve FQDNs to the correct IP addresses. This article does NOT provide information on configuring the DNS records for these items. Consult the documentation for your DNS software for information on how to add records.

## Prerequisites

- An Azure Virtual Network that uses [your own DNS server](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).

- An Azure Machine Learning workspace with a private endpoint. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

- Familiarity with using [Network isolation during training & inference](./how-to-network-security-overview.md).

- Familiarity with [Azure Private Endpoint DNS zone configuration](../private-link/private-endpoint-dns.md)

- Optionally, [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-az-ps).

## Automated custom DNS server integration

### Introduction

There are two predominant architectures Azure Machine Learning customers should use when accessing their Machine Learning workspace via a Private Endpoint when using a custom DNS solution. While some customers will find final architectures that deviate from those described here, the two architectures discussed here can serve as a reference point to ensure the custom DNS solution is implemented properly – and, if something with the implemented solution is not working, this document can walk through troubleshooting steps that can identify the components in the architecture that may be misconfigured.

### Workspace DNS resolution path

Access to a given Azure Machine Learning workspace via Private Link is done by communicating with the following Fully Qualified Domains (called the workspace FQDNs) listed below:
###### Azure Public Cloud:
- ```<per-workspace globally-unique identifier>.workspace.<region the workspace was created in>.api.azureml.ms```
- ```ml-<workspace-name, truncated>-<region>-<per-workspace globally-unique identifier>. notebooks.azure.net```
###### Azure China Cloud:
- ```<per-workspace globally-unique identifier>.workspace.<region the workspace was created in>.api.ml.azure.cn```
- ```ml-<workspace-name, truncated>-<region>-<per-workspace globally-unique identifier>. notebooks.chinacloudapi.cn```
###### Azure US Government:
- ```<per-workspace globally-unique identifier>.workspace.<region the workspace was created in>.api.ml.azure.us```
- ```ml-<workspace-name, truncated>-<region>-<per-workspace globally-unique identifier>. notebooks.usgovcloudapi.net```

The Fully Qualified Domains resolve to the following Canonical Names (CNAMEs) called the workspace Private Link FQDNs:

###### Azure Public Cloud:
- ```<per-workspace globally-unique identifier>.workspace.<region the workspace was created in>.privatelink.api.azureml.ms```
- ```ml-<workspace-name, truncated>-<region>-<per-workspace globally-unique identifier>.privatelink.notebooks.azure.net```
###### Azure China Cloud:
- ```<per-workspace globally-unique identifier>.workspace.<region the workspace was created in>.privatelink.api.ml.azure.cn```
- ```ml-<workspace-name, truncated>-<region>-<per-workspace globally-unique identifier>.privatelink.notebooks.chinacloudapi.cn```
###### Azure US Government:
- ```<per-workspace globally-unique identifier>.workspace.<region the workspace was created in>.privatelink.api.ml.azure.us```
- ```ml-<workspace-name, truncated>-<region>-<per-workspace globally-unique identifier>.privatelink.notebooks.usgovcloudapi.net```


Those Fully Qualified Domains resolve to the IP addresses of Azure Machine Learning in the region the workspace was created in. However, resolution of the workspace Private Link FQDNs will be overridden when resolving with the Azure DNS Virtual Server IP address in a Virtual Network linked to the Private DNS Zones created as described above.

### Custom DNS Server hosted in Azure Virtual Network

One architecture uses the common Hub and Spoke virtual network topology, with one Virtual Network hosting the DNS Server, and one Virtual Network containing the Private Endpoint to the Azure Machine Learning workspace and associated compute resources. There must be a valid route between both of those Virtual Networks through a series of peered Virtual Networks. 
    
#### Setup

##### 1. Create Private DNS Zone and link to DNS Server Virtual Network

The first step in ensuring a Custom DNS solution works with your Azure Machine Learning workspace is to create two Private DNS Zones rooted at the following domains:
###### Azure Public Cloud:
- ``` privatelink.api.azureml.ms```
- ``` privatelink.notebooks.azure.net```
###### Azure China Cloud:
- ```privatelink.api.ml.azure.cn```
- ```privatelink.notebooks.chinacloudapi.cn```
###### Azure US Government:
- ```privatelink.api.ml.azure.us```
- ```privatelink.notebooks.usgovcloudapi.net```

Following creation of the Private DNS Zone, it needs to be linked to the DNS Server Virtual Network – the Virtual Network that contains the DNS Server.

A Private DNS Zone overrides domain name resolution for all domain names in the scope of the root of the zone, for all Virtual Networks the Private DNS Zone is linked to. For example, if a Private DNS Zone rooted at privatelink.api.azureml.ms is linked to Virtual Network foo, all resources in Virtual Network foo that attempt to resolve bar.workspace.westus2.privatelink.api.azureml.ms will receive any record that is listed in the privatelink.api.azureml.ms zone.

However, records listed in Private DNS Zones are only returned to devices resolving domains using the default Azure DNS Virtual Server IP address. So while the custom DNS Server will resolve domains for devices spread throughout your network topology, the custom DNS Server will need to resolve Azure Machine Learning-related domains against the Azure DNS Virtual Server IP address.

##### 2. Create private endpoint with private DNS integration targeting Private DNS Zone linked to DNS Server Virtual Network

The next step is to create a Private Endpoint to the Azure Machine Learning workspace, ensuring Private DNS integration is enabled, and targeting both Private DNS Zones created in step 1. This ensures all communication with the workspace is done via the Private Endpoint in the Azure Machine Learning Virtual Network.

##### 3. Create conditional forwarder in DNS Server to forward to Azure DNS 

The next step is to create a conditional forwarder to the Azure DNS Virtual Server. This ensures that, for FQDNs related to Private Link for the Azure Machine Learning workspaces, the DNS Server always queries the Azure DNS Virtual Server IP address for the answer – which means the DNS Server will return the corresponding record from the Private DNS Zone.

The zones to conditionally forward are listed below. The Azure DNS Virtual Server IP address is 168.63.129.16.

###### Azure Public Cloud:
- ``` privatelink.api.azureml.ms```
- ``` privatelink.notebooks.azure.net```
###### Azure China Cloud:
- ```privatelink.api.ml.azure.cn```
- ```privatelink.notebooks.chinacloudapi.cn```
###### Azure US Government:
- ```privatelink.api.ml.azure.us```
- ```privatelink.notebooks.usgovcloudapi.net```

> [!IMPORTANT]
> Configuration steps for the DNS Server are not included here, as there are many DNS solutions available that can be used as a custom DNS Server. Refer to the documentation for your DNS solution for how to appropriately configure conditional forwarding.

##### 4. Resolve workspace domain

At this point all setup is done. Now any client that uses DNS Server for name resolution and has a route to the Azure ML Private Endpoint can proceed to access the workspace.
The client will first start by querying DNS Server for the address of the following FQDNs:

###### Azure Public Cloud:
- ```<per-workspace globally-unique identifier>.workspace.<region the workspace was created in>.api.azureml.ms```
- ```ml-<workspace-name, truncated>-<region>-<per-workspace globally-unique identifier>. notebooks.azure.net```
###### Azure China Cloud:
- ```<per-workspace globally-unique identifier>.workspace.<region the workspace was created in>.api.ml.azure.cn```
- ```ml-<workspace-name, truncated>-<region>-<per-workspace globally-unique identifier>. notebooks.chinacloudapi.cn```
###### Azure US Government:
- ```<per-workspace globally-unique identifier>.workspace.<region the workspace was created in>.api.ml.azure.us```
- ```ml-<workspace-name, truncated>-<region>-<per-workspace globally-unique identifier>. notebooks.usgovcloudapi.net```

##### 5. Public DNS responds with CNAME

DNS Server will proceed to resolve the FQDNs from step 4 from the Public DNS. The Public DNS will respond with one of the domains listed in the informational section in step 1.

##### 6. DNS Server recursively resolves workspace domain CNAME record from Azure DNS

DNS Server will proceed to recursively resolve the CNAME received in step 5. Because there was a conditional forwarder setup in step 3, DNS Server will send the request to the Azure DNS Virtual Server IP address for resolution.

##### 7. Azure DNS returns records from Private DNS zone

The corresponding records stored in the Private DNS Zones will be returned to DNS Server, which will mean Azure DNS Virtual Server returns the IP addresses of the Private Endpoint.

##### 8. Custom DNS Server resolves workspace domain name to private endpoint address

Ultimately the Custom DNS Server now returns the IP addresses of the Private Endpoint to the client from step 4. This ensures that all traffic to the Azure Machine Learning workspace is via the Private Endpoint.

#### Troubleshooting

If after running through the above steps you are unable to access the workspace from a virtual machine or jobs fail on compute resources in the Virtual Network containing the Private Endpoint to the Azure Machine learning workspace, follow the below steps to try to identify the cause.

##### Locate the workspace FQDNs on the Private Endpoint

Navigate to the Azure Portal using one of the following links:
- [Azure Public Cloud](https://ms.portal.azure.com/?feature.privateendpointmanagedns=false)
- [Azure China Cloud](https://portal.azure.cn/?feature.privateendpointmanagedns=false)
- [Azure US Government](https://portal.azure.us/?feature.privateendpointmanagedns=false)

Navigate to the Private Endpoint to the Azure Machine Learning workspace. The workspace FQDNs will be listed on the “Overview” tab.

##### Access compute resource in Virtual Network topology

Proceed to access a compute resource in the Azure Virtual Network topology. This will likely require accessing a Virtual Machine in a Virtual Network that is peered with the Hub Virtual Network. 

##### Resolve workspace FQDNs

Open a command prompt, shell, or PowerShell. Then for each of the workspace FQDNs run the following command:

```nslookup <workspace FQDN>```
    
The result of each nslookup should yield one of the two private IP addresses on the Private Endpoint to the Azure Machine Learning workspace. If it does not then there is something misconfigured in the custom DNS solution.

Possible causes:
- The compute resource running the troubleshooting commands is not using DNS Server for DNS resolution
- The Private DNS Zones chosen when creating the Private Endpoint are not linked to the DNS Server VNet
- Conditional forwarders to Azure DNS Virtual Server IP were not configured correctly


## Manual custom DNS server integration

### Public regions

The following list contains the fully qualified domain names (FQDN) used by your workspace if it is in a public region::

* `<workspace-GUID>.workspace.<region>.cert.api.azureml.ms`
* `<workspace-GUID>.workspace.<region>.api.azureml.ms`
* `ml-<workspace-name, truncated>-<region>-<workspace-guid>.notebooks.azure.net`

    > [!NOTE]
    > The workspace name for this FQDN may be truncated. Truncation is done to keep `ml-<workspace-name, truncated>-<region>-<workspace-guid>` 63 characters.
* `<instance-name>.<region>.instances.azureml.ms`

    > [!NOTE]
    > * Compute instances can be accessed only from within the virtual network.
    > * The IP address for this FQDN is **not** the IP of the compute instance. Instead, use the private IP address of the workspace private endpoint (the IP of the `*.api.azureml.ms` entries.)

### Azure China 21Vianet regions

The following FQDNs are for Azure China 21Vianet regions:

* `<workspace-GUID>.workspace.<region>.cert.api.ml.azure.cn`
* `<workspace-GUID>.workspace.<region>.api.ml.azure.cn`
* `ml-<workspace-name, truncated>-<region>-<workspace-guid>.notebooks.chinacloudapi.cn`

    > [!NOTE]
    > The workspace name for this FQDN may be truncated. Truncation is done to keep `ml-<workspace-name, truncated>-<region>-<workspace-guid>` 63 characters.
* `<instance-name>.<region>.instances.ml.azure.cn`
### Find the IP addresses

To find the internal IP addresses for the FQDNs in the VNet, use one of the following methods:

> [!NOTE]
> The fully qualified domain names and IP addresses will be different based on your configuration. For example, the GUID value in the domain name will be specific to your workspace.

### [Azure CLI](#tab/azure-cli)

```azurecli
az network private-endpoint show --endpoint-name <endpoint> --resource-group <resource-group> --query 'customDnsConfigs[*].{FQDN: fqdn, IPAddress: ipAddresses[0]}' --output table
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$workspaceDns=Get-AzPrivateEndpoint -Name <endpoint> -resourcegroupname <resource-group>
$workspaceDns.CustomDnsConfigs | format-table
```

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), select your Azure Machine Learning __workspace__.
1. From the __Settings__ section, select __Private endpoint connections__.
1. Select the link in the __Private endpoint__ column that is displayed.
1. A list of the fully qualified domain names (FQDN) and IP addresses for the workspace private endpoint are at the bottom of the page.

:::image type="content" source="./media/how-to-custom-dns/private-endpoint-custom-dns.png" alt-text="List of FQDNs in the portal":::

---

The information returned from all methods is the same; a list of the FQDN and private IP address for the resources. The following example is from a global Azure region:

| FQDN | IP Address |
| ----- | ----- |
| `fb7e20a0-8891-458b-b969-55ddb3382f51.workspace.eastus.api.azureml.ms` | `10.1.0.5` |
| `ml-myworkspace-eastus-fb7e20a0-8891-458b-b969-55ddb3382f51.notebooks.azure.net` | `10.1.0.6` |

> [!IMPORTANT]
> Some FQDNs are not shown in listed by the private endpoint, but are required by the workspace in eastus, southcentralus and westus2. These FQDNs are listed in the following table, and must also be added to your DNS server and/or an Azure Private DNS Zone:
>
> * `<workspace-GUID>.workspace.<region>.cert.api.azureml.ms`
> * `<workspace-GUID>.workspace.<region>.experiments.azureml.net`
> * `<workspace-GUID>.workspace.<region>.modelmanagement.azureml.net`
> * `<workspace-GUID>.workspace.<region>.aether.ms`
> * If you have a compute instance, use `<instance-name>.<region>.instances.azureml.ms`, where `<instance-name>` is the name of your compute instance. Use the private IP address of workspace private endpoint. The compute instance can be accessed only from within the virtual network.
>
> For all of these IP address, use the same address as the `*.api.azureml.ms` entries returned from the previous steps.

The following table shows example IPs from Azure China 21Vianet regions:

| FQDN | IP Address |
| ----- | ----- |
| `52882c08-ead2-44aa-af65-08a75cf094bd.workspace.chinaeast2.api.ml.azure.cn` | `10.1.0.5` |
| `ml-mype-pltest-chinaeast2-52882c08-ead2-44aa-af65-08a75cf094bd.notebooks.chinacloudapi.cn` | `10.1.0.6` |
## Next steps

For more information on using Azure Machine Learning with a virtual network, see the [virtual network overview](how-to-network-security-overview.md).

For more information on integrating Private Endpoints into your DNS configuration, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md).
