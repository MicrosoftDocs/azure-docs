---
author: KarlErickson
ms.author: karler
ms.service: azure-container-apps
ms.topic: include
ms.date: 02/18/2025
---

You can deploy your Java application with many different options, including a local file system, a code repository, Maven, an IDE, a WAR file, a JAR file, or even directly from the source code. By the end of this tutorial, you deploy a web application that you can manage through the Azure portal. The following screenshot shows the PetClinic application deployed to Azure:

:::image type="content" source="../media/java-get-started-petclinic/azure-container-apps-petclinic-warfile.png" alt-text="Screenshot of the home page of the PetClinic app." lightbox="media/java-get-started-petclinic/azure-container-apps-petclinic-warfile.png":::

## Install the Container Apps CLI extension

Use the the following command to install the latest version of the Container Apps CLI extension:

```azurecli
az extension add 
    --name containerapp
    --upgrade
    --allow-preview
```
