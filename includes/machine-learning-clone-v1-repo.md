---
author: sdgilley
ms.service: machine-learning
ms.topic: include
ms.date: 09/28/2022
ms.author: sgilley
---

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/).

1. Select your subscription and the workspace you created.

1. On the left, select **Notebooks**.

1. Select the **Open terminal** tool to open a terminal window.

    :::image type="content" source="../articles/machine-learning/v1/media/samples-notebooks-v1/open-terminal.png" alt-text="Screenshot: Open terminal from Notebooks section.":::

1. On the top bar, select the compute instance you created during the  [Quickstart: Get started with Azure Machine Learning](../articles/machine-learning/quickstart-create-resources.md) to use if it's not already selected.  Start the compute instance if it is stopped.

1. In the terminal window, clone the MachineLearningNotebooks repository:

    ```bash
    git clone --depth 1  https://github.com/Azure/MachineLearningNotebooks
    ```

1. If necessary, refresh the list of files with the **Refresh** tool to see the newly cloned folder under your user folder.
