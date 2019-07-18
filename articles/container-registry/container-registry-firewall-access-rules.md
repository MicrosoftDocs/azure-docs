---
title: Firewall rules to access Azure Container Registry
description: Configure rules to access an Azure container registry from behind a firewall.
services: container-registry
author: dlepow
manager: gwallace

ms.service: container-registry
ms.topic: article
ms.date: 07/17/2019
ms.author: danlep
---

# Configure rules to access an Azure container registry behind a firewall

This article explains how to configure rules on your firewall to allow access to an Azure container registry. For example, an Azure IoT Edge device behind a firewall might need to whitelist a container registry to pull a container image, or a locked-down server in an on-premises network might need access to push an image.

If instead you want to configure inbound network access rules on a container registry to allow access only within an Azure virtual network or a public IP address range, see [Restrict access to an Azure container registry from a virtual network](container-registry-vnet.md).


## About registry endpoints

To pull or push images or other artifacts to an Azure container registry, a client such as a Docker daemon needs to interact with two distinct endpoints.

* **Registry REST API endpoint** - Authentication and registry management operations are handled through the registry's public REST API endpoint. This endpoint is the login server URL of the registry, or an associated IP address range. 

* **Storage endpoint** - Azure [allocates blob storage](container-registry-storage.md) in Azure storage accounts on behalf of each registry to manage the images or other artifacts. For a client to access image layers in an Azure container registry, it makes requests using a storage account endpoint provided by the registry.

If your registry is [geo-replicated](container-registry-geo-replication.md), a client might need to interact with REST and storage endpoints in multiple regions.

## Whitelist REST and storage URLs

* **REST endpoint** - Whitelist the registry server URL, such as  `myregistry.azurecr.io`
* **Storage URL** - Whitelist all Azure blob storage accounts using `*.blob.core.windows.net`


## Whitelist by IP address range

If you need to whitelist specific IP addresses, download [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519).

To find the ACR REST endpoint IP ranges, search for **AzureContainerRegistry**.

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

## Whitelist by service tag

You can filter network traffic from a resource in an Azure virtual network to and from a container registry using security group rules. To simplify the creation of the Azure security rules, use the [service tag](../virtual-network/security-overview.md#service-tags) for Azure Container Registry. A service tag represents a group of IP address prefixes to access an Azure service. The tag is automatically updated when addresses change. 

For example, create an outbound network security group rule with destination **AzureContainerRegistry** to allow traffic to an Azure container registry. If you only want to allow access to the AzureContainerRegistry tag in a specific region, specify the region in the following format: **AzureContainerRegistry**.[*region name*].





## Next steps



<!-- IMAGES -->

[acr-subnet-service-endpoint]: ./media/container-registry-vnet/acr-subnet-service-endpoint.png
[acr-vnet-portal]: ./media/container-registry-vnet/acr-vnet-portal.png
[acr-vnet-firewall-portal]: ./media/container-registry-vnet/acr-vnet-firewall-portal.png

<!-- LINKS - External -->

<!-- LINKS - Internal -->

