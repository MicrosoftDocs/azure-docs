---
author: khdownie
ms.service: azure-container-storage
ms.topic: include
ms.date: 09/10/2025
ms.author: kendownie
---

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

- This article requires Azure CLI version v2.83.0 or later. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli). Disable extensions such as `aks-preview` if issues occur. Install or update extensions as needed:
  - `az extension add --upgrade --name k8s-extension`
  - `az extension add --upgrade --name elastic-san` (Elastic SAN only)

- You need the Kubernetes command-line client, `kubectl`. It's already installed if you're using Azure Cloud Shell. You can install it locally by running the `az aks install-cli` command.

- Check if your target region is supported in [Azure Container Storage regions](../articles/storage/container-storage/container-storage-introduction.md#regional-availability).
