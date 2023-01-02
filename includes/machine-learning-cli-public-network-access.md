---
author: blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 03/28/2022
ms.author: larryfr
---

* If your Azure Machine Learning workspace uses a private endpoint to communicate with a virtual network and you want to use the CLI v2, you must enable public network access. Enabling public network access allows you to access the workspace over the internet, while keeping communications between the workspace and resources in the virtual network secure.

    Public network access can be enabled using one of the following methods:

    # [Azure CLI](#tab/cli)

    The `--public-network-access` parameter for the `az ml workspace update` command provided by CLI 2.0 can be used to enable public network access. For example, the following command updates a workspace for public network access:

    ```azurecli
    az ml workspace update --name myworkspace --public-network-access
    ```

    # [Azure portal](#tab/portal)

    From the [Azure portal](https://portal.azure.com), select your Azure Machine Learning workspace and then select __Networking__. From the __Public access__ tab, select __All networks__. To save these changes, select __Save__.

    :::image type="content" source="./media/machine-learning-cli-public-network-access/public-network-access.png" alt-text="Screenshot of the public access settings.":::