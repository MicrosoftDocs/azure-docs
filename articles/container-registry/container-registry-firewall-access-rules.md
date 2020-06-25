---
title: Firewall access rules
description: Configure rules to access an Azure container registry from behind a firewall, by allowing access to ("whitelisting") REST API and data endpoint domain names or service-specific IP address ranges.
ms.topic: article
ms.date: 05/18/2020
---

# Configure rules to access an Azure container registry behind a firewall

This article explains how to configure rules on your firewall to allow access to an Azure container registry. For example, an Azure IoT Edge device behind a firewall or proxy server might need to access a container registry to pull a container image. Or, a locked-down server in an on-premises network might need access to push an image.

If instead you want to configure inbound network access to a container registry only within an Azure virtual network, see [Configure Azure Private Link for an Azure container registry](container-registry-private-link.md).

## About registry endpoints

To pull or push images or other artifacts to an Azure container registry, a client such as a Docker daemon needs to interact over HTTPS with two distinct endpoints. For clients that access a registry from behind a firewall, you need to configure access rules for both endpoints. Both endpoints are reached over port 443.

* **Registry REST API endpoint** - Authentication and registry management operations are handled through the registry's public REST API endpoint. This endpoint is the login server name of the registry. Example: `myregistry.azurecr.io`

* **Storage (data) endpoint** - Azure [allocates blob storage](container-registry-storage.md) in Azure Storage accounts on behalf of each registry to manage the data for container images and other artifacts. When a client accesses image layers in an Azure container registry, it makes requests using a storage account endpoint provided by the registry.

If your registry is [geo-replicated](container-registry-geo-replication.md), a client might need to interact with the data endpoint in a specific region or in multiple replicated regions.

## Allow access to REST and data endpoints

* **REST endpoint** - Allow access to the fully qualified registry login server name, `<registry-name>.azurecr.io`, or an associated IP address range
* **Storage (data) endpoint** - Allow access to all Azure blob storage accounts using the wildcard `*.blob.core.windows.net`, or an associated IP address range.
> [!NOTE]
> Azure Container Registry is introducing [dedicated data endpoints](#enable-dedicated-data-endpoints), allowing you to tightly scope client firewall rules for your registry storage. Optionally enable data endpoints in all regions where the registry is located or replicated, using the form `<registry-name>.<region>.data.azurecr.io`.

## Allow access by IP address range

If your organization has policies to allow access only to specific IP addresses or address ranges, download [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519).

To find the ACR REST endpoint IP ranges for which you need to allow access, search for **AzureContainerRegistry** in the JSON file.

> [!IMPORTANT]
> IP address ranges for Azure services can change, and updates are published weekly. Download the JSON file regularly, and make necessary updates in your access rules. If your scenario involves configuring network security group rules in an Azure virtual network or you use Azure Firewall, use the **AzureContainerRegistry** [service tag](#allow-access-by-service-tag) instead.
>

### REST IP addresses for all regions

```json
{
  "name": "AzureContainerRegistry",
  "id": "AzureContainerRegistry",
  "properties": {
    "changeNumber": 10,
    "region": "",
    "platform": "Azure",
    "systemService": "AzureContainerRegistry",
    "addressPrefixes": [
      "13.66.140.72/29",
    [...]
```

### REST IP addresses for a specific region

Search for the specific region, such as **AzureContainerRegistry.AustraliaEast**.

```json
{
  "name": "AzureContainerRegistry.AustraliaEast",
  "id": "AzureContainerRegistry.AustraliaEast",
  "properties": {
    "changeNumber": 1,
    "region": "australiaeast",
    "platform": "Azure",
    "systemService": "AzureContainerRegistry",
    "addressPrefixes": [
      "13.70.72.136/29",
    [...]
```

### Storage IP addresses for all regions

```json
{
  "name": "Storage",
  "id": "Storage",
  "properties": {
    "changeNumber": 19,
    "region": "",
    "platform": "Azure",
    "systemService": "AzureStorage",
    "addressPrefixes": [
      "13.65.107.32/28",
    [...]
```

### Storage IP addresses for specific regions

Search for the specific region, such as **Storage.AustraliaCentral**.

```json
{
  "name": "Storage.AustraliaCentral",
  "id": "Storage.AustraliaCentral",
  "properties": {
    "changeNumber": 1,
    "region": "australiacentral",
    "platform": "Azure",
    "systemService": "AzureStorage",
    "addressPrefixes": [
      "52.239.216.0/23"
    [...]
```

## Allow access by service tag

In an Azure virtual network, use network security rules to filter traffic from a resource such as a virtual machine to a container registry. To simplify the creation of the Azure network rules, use the **AzureContainerRegistry** [service tag](../virtual-network/security-overview.md#service-tags). A service tag represents a group of IP address prefixes to access an Azure service globally or per Azure region. The tag is automatically updated when addresses change. 

For example, create an outbound network security group rule with destination **AzureContainerRegistry** to allow traffic to an Azure container registry. To allow access to the service tag only in a specific region, specify the region in the following format: **AzureContainerRegistry**.[*region name*].

## Enable dedicated data endpoints 

> [!WARNING]
> If you previously configured client firewall access to the existing `*.blob.core.windows.net` endpoints, switching to dedicated data endpoints will impact client connectivity, causing pull failures. To ensure clients have consistent access, add the new data endpoint rules to the client firewall rules. Once completed, enable dedicated data endpoints for your registries using the Azure CLI or other tools.

Dedicated data endpoints is an optional feature of the **Premium** container registry service tier. For information about registry service tiers and limits, see [Azure Container Registry service tiers](container-registry-skus.md). 

You can enable dedicated data endpoints using the Azure portal or the Azure CLI. The data endpoints follow a regional pattern, `<registry-name>.<region>.data.azurecr.io`. In a geo-replicated registry, enabling data endpoints enables endpoints in all replica regions.

### Portal

To enable data endpoints using the portal:

1. Navigate to your container registry.
1. Select **Networking** > **Public access**.
1. Select the **Enable dedicated data endpoint** checkbox.
1. Select **Save**.

The data endpoint or endpoints appear in the portal.

:::image type="content" source="media/container-registry-firewall-access-rules/dedicated-data-endpoints-portal.png" alt-text="Dedicated data endpoints in portal":::

### Azure CLI

To enable data endpoints using the Azure CLI, use Azure CLI version 2.4.0 or higher. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

The following [az acr update][az-acr-update] command enables dedicated data endpoints on a registry *myregistry*. 

```azurecli
az acr update --name myregistry --data-endpoint-enabled
```

To view the data endpoints, use the [az acr show-endpoints][az-acr-show-endpoints] command:

```azurecli
az acr show-endpoints --name myregistry
```

Output for demonstration purposes shows two regional endpoints

```
{
    "loginServer": "myregistry.azurecr.io",
    "dataEndpoints": [
        {
            "region": "eastus",
            "endpoint": "myregistry.eastus.data.azurecr.io",
        },
        {
            "region": "westus",
            "endpoint": "myregistry.westus.data.azurecr.io",
        }
    ]
}
```

After you set up dedicated data endpoints for your registry, you can enable client firewall access rules for the data endpoints. Enable data endpoint access rules for all required registry regions.

## Configure client firewall rules for MCR

If you need to access Microsoft Container Registry (MCR) from behind a firewall, see the guidance to configure [MCR client firewall rules](https://github.com/microsoft/containerregistry/blob/master/client-firewall-rules.md). MCR is the primary registry for all Microsoft-published docker images, such as Windows Server images.

## Next steps

* Learn about [Azure best practices for network security](../security/fundamentals/network-best-practices.md)

* Learn more about [security groups](/azure/virtual-network/security-overview) in an Azure virtual network

* Learn more about setting up [Private Link](container-registry-private-link.md) for a container registry

* Learn more about [dedicated data endpoints](https://azure.microsoft.com/blog/azure-container-registry-mitigating-data-exfiltration-with-dedicated-data-endpoints/) for Azure Container Registry



<!-- IMAGES -->

<!-- LINKS - External -->

<!-- LINKS - Internal -->

[az-acr-update]: /cli/azure/acr#az-acr-update
[az-acr-show-endpoints]: /cli/azure/acr#az-acr-show-endpoints

