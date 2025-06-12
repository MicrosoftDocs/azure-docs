---
author: KarlErickson
ms.author: karler
ms.reviewer: hangwan
ms.service: azure-container-apps
ms.topic: include
ms.date: 03/05/2025
---

There are several options available for deploying Java applications, including the following options:

- Deployment from a local file system or from a code repository.
- Deployment using Maven or an IDE.
- Deployment using a WAR file, a JAR file, or directly from source code.

By the end of this tutorial, you deploy a web application that you can manage through the Azure portal. The following screenshot shows the home page of the PetClinic application deployed to Azure Container Apps:

:::image type="content" source="../media/java-get-started/azure-container-apps-spring-pet-clinic-home-page.png" alt-text="Screenshot of the home page of the PetClinic app." lightbox="../media/java-get-started/azure-container-apps-spring-pet-clinic-home-page.png":::

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/).
- The `Contributor` or `Owner` permission on the Azure subscription. For more information, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml?tabs=current).
- [A GitHub account](https://github.com/join).
- [Git](https://git-scm.com/downloads)
- [Azure CLI](/cli/azure/install-azure-cli)
- The Azure Container Apps CLI extension, version 0.3.47 or higher. Use the following command to install the latest version: `az extension add --name containerapp --upgrade --allow-preview`
- [The Java Development Kit](/java/openjdk/install), version 17 or later.
- [Apache Maven](https://maven.apache.org/download.cgi)
