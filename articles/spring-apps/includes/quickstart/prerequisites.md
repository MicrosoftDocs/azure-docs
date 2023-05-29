---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 05/26/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to clean up resources using Azure Portal or AZD.

[!INCLUDE [prerequisites](includes/quickstart/prerequisites.md)]

-->

## 1 Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

::: zone pivot="sc-enterprise"

- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](../../how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](../../how-to-enterprise-marketplace-offer.md).

::: zone-end

- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Apache Maven](https://maven.apache.org/download.cgi)

::: zone pivot="sc-consumption-plan"

- [Azure CLI](/cli/azure/install-azure-cli). Install the Azure CLI extension for Azure Spring Apps Standard consumption and dedicated plan by using the following command:

  ```azurecli-interactive
  az extension remove --name spring && \
  az extension add --name spring
  ```

- Use the following commands to install the Azure Container Apps extension for the Azure CLI and register these namespaces: `Microsoft.App`, `Microsoft.OperationalInsights`, and `Microsoft.AppPlatform`:

  ```azurecli-interactive
  az extension add --name containerapp --upgrade
  az provider register --namespace Microsoft.App
  az provider register --namespace Microsoft.OperationalInsights
  az provider register --namespace Microsoft.AppPlatform
  ```

::: zone-end

::: zone pivot="sc-standard,sc-enterprise"

- [Azure CLI](/cli/azure/install-azure-cli). Install the Azure Spring Apps extension with the following command: `az extension add --name spring`

::: zone-end
