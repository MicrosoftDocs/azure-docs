---
title: Enable Artifact Cache - Azure portal
description: Learn how to enable Registry Cache in your Azure Container Registry using Azure portal.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Enable Artifact Cache - Azure portal

This article is part two of a six-part tutorial series. [Part one](tutorial-artifact-cache.md) provides an overview of Artifact Cache, its features, benefits, and limitations. This article walks you through the steps of enabling Artifact Cache by using the Azure portal without authentication.

## Prerequisites

* Sign in to the [Azure portal](https://ms.portal.azure.com/)

## Configure Artifact Cache - Azure portal

Follow the steps to create cache rule in the [Azure portal](https://portal.azure.com). 

1. Navigate to your Azure Container Registry. 

2. In the side **Menu**, under the **Services**, select **Cache**.


    :::image type="content" source="./media/container-registry-artifact-cache/cache-preview-01.png" alt-text="Screenshot for Registry cache.":::


3. Select **Create Rule**.


    :::image type="content" source="./media/container-registry-artifact-cache/cache-blade-02.png" alt-text="Screenshot for Create Rule.":::


4. A window for **New cache rule** appears.


    :::image type="content" source="./media/container-registry-artifact-cache/new-cache-rule-03.png" alt-text="Screenshot for new Cache Rule.":::


5. Enter the **Rule name**.

6. Select **Source** Registry from the dropdown menu. 

7. Enter the **Repository Path** to the artifacts you want to cache.

8. You can skip **Authentication**, if you aren't accessing a private repository or performing an authenticated pull.

9. Under the **Destination**, Enter the name of the **New ACR Repository Namespace** to store cached artifacts.


    :::image type="content" source="./media/container-registry-artifact-cache/save-cache-rule-04.png" alt-text="Screenshot to save Cache Rule.":::


10. Select on **Save** 

11. Pull the image from your cache using the Docker command by the registry login server name, repository name, and its desired tag.

    - For example, to pull the image from the repository `hello-world` with its desired tag `latest` for a given registry login server `myregistry.azurecr.io`.

    ```azurecli-interactive
     docker pull myregistry.azurecr.io/hello-world:latest
    ```

## Next steps

* Advance to the [next article](tutorial-enable-artifact-cache-cli.md) to enable the Artifact Cache using Azure CLI.

<!-- LINKS - External -->
[create-and-store-keyvault-credentials]:../key-vault/secrets/quick-create-portal.md