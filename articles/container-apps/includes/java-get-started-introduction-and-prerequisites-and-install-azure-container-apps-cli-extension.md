---
author: KarlErickson
ms.author: karler
ms.service: azure-container-apps
ms.topic: include
ms.date: 02/18/2025
---

You can deploy your Java application with many different options, including a local file system, a code repository, Maven, an IDE, a WAR file, a JAR file, or even directly from the source code. By the end of this tutorial, you deploy a web application that you can manage through the Azure portal. The following screenshot shows the PetClinic application deployed to Azure:

:::image type="content" source="../media/java-get-started/azure-container-apps-petclinic-warfile.png" alt-text="Screenshot of the home page of the PetClinic app." lightbox="../media/java-get-started/azure-container-apps-petclinic-warfile.png":::

## Install the Container Apps CLI extension

Use the the following command to install the latest version of the Container Apps CLI extension:

```azurecli
az extension add 
    --name containerapp
    --upgrade
    --allow-preview
```

## Prerequisites

- An Azure subscription. [Create one for free.](https://azure.microsoft.com/free/).
- The `Contributor` or `Owner` [permission](../../role-based-access-control/role-assignments-portal.yml?tabs=current) on the Azure subscription.
- [A GitHub Account](https://github.com/join).
- [git](https://git-scm.com/downloads)
- [Azure CLI](/cli/azure/install-azure-cli).
- The Azure Container Apps CLI extension, version 0.3.47 or higher.
- The [Java Development Kit](/java/openjdk/install), version 17 or later.
- [Apache Maven](https://maven.apache.org/download.cgi).
