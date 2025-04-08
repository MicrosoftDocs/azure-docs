---
author: ProfessorKendrick
ms.topic: include
ms.date: 01/10/2025
ms.author: kkendrick
---

To set up the partner service on Azure, you need to register the service as a resource provider in your Azure subscription:

- To register the resource provider in the Azure portal, follow the steps in [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

- To register the resource provider in the Azure CLI, use this command:

  ```azurecli
  az provider register --namespace NewRelic.Observability --subscription <subscription-id>
  ```