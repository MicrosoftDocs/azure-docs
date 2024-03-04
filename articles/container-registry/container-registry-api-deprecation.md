---
title: Removed and deprecated features for Azure Container Registry 
description: This article lists and notifies the features that are deprecated or removed from support for Azure Container Registry.
ms.topic: article
ms.date: 06/27/2022
ms.author: tejaswikolli
---

# API Deprecations in Azure Container Registry

This article describes how to use the information about APIs that are removed from support for Azure Container Registry (ACR). This article provides early notice about future changes that might affect the APIs of ACR available to customers in preview or GA states.

This information helps you identify the deprecated API versions. The information is subject to change with future releases, and might not include each deprecated feature or product.

## How to use this information

When an API is first listed as deprecated, support for using it with ACR is on schedule to be removed in a future update. This information is provided to help you plan for alternatives and a replacement version for using that API. When a version of API is removed, this article is updated to indicate that specific version.

Unless noted otherwise, a feature, product, SKU, SDK, utility, or tool that's supporting the deprecated API typically continues to be fully supported, available, and usable.

When support is removed for a version of API, you can use a latest version of API, as long as the API remains in support. 

For CLI users, we recommend to use latest version of [Azure CLI][Azure Cloud Shell], for invoking SDK implementation. Run `az --version` to find the version.

To avoid errors due to using a deprecated API, we recommend moving to a newer version of the ACR API. You can find a list of [supported versions here.](/azure/templates/microsoft.containerregistry/allversions)

You may be consuming this API via one or more SDKs. Use a newer API version by updating to a newer version of the SDK. You can find a [list of SDKs and their latest versions here.](https://azure.github.io/azure-sdk/releases/latest/index.html?search=containerregistry)

## Removed and Deprecated APIs

The following API versions are ready for retirement/deprecation. In some cases, they're no longer in the product.

| API version        | Deprecation first announcement | Plan to end support |
| ------------------ | ------------------------------ | ------------------- |
| 2016-06-27-preview | July 17, 2023                  | October 16, 2023    |
| 2017-06-01-preview | July 17, 2023                  | October 16, 2023    |
| 2018-02-01-preview | July 17, 2023                  | October 16, 2023    |
| 2017-03-01-GA	     | September   2023	              | September   2026    |

## See also

For more information, see the following articles:

>* [Supported API versions](/azure/templates/microsoft.containerregistry/allversions)
>* [SDKs and their latest versions](https://azure.github.io/azure-sdk/releases/latest/index.html?search=containerregistry)

<!-- LINKS - External -->
[Azure Cloud Shell]: /azure/cloud-shell/quickstart