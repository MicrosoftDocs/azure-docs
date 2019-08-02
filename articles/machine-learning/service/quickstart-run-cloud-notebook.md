---
title: "Quickstart: Run a notebook in the cloud"
titleSuffix: Azure Machine Learning service
description: This tutorial shows you how to get started with the Azure Machine Learning service and use a managed notebook server in the cloud. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: quickstart
author: sdgilley
ms.author: sgilley
ms.date: 05/14/2019
ms.custom: seodec18

---

# Quickstart: Use a cloud-based notebook server to get started with Azure Machine Learning

This quickstart teaches you how to start using the Azure Machine Learning service by using a managed notebook server in the cloud. No installation is required. If you want to instead install the SDK into your own Python environment, see [Quickstart: Use your own notebook server to get started with Azure Machine Learning](quickstart-run-local-notebook.md).

This quickstart shows you how to use the [Azure Machine Learning service workspace](concept-azure-machine-learning-architecture.md) to keep track of your machine learning (ML) experiments. You do this by creating a [notebook virtual machine (preview)](how-to-configure-environment.md#notebookvm): a secure, cloud-based Azure workstation that provides a Jupyter notebook server, JupyterLab, and a fully prepared ML environment. You then run a Python notebook on this virtual machine (VM) that logs values into the workspace.

To do this, take the following actions:

* Create a workspace.
* Create a notebook VM in your workspace.
* Open the Jupyter web interface.
* Open a notebook that contains code to estimate pi and logs errors at each iteration.
* Run the notebook.
* View the logged error values in your workspace. The following example shows how the workspace helps you keep track of information generated in a script.

If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of the Azure Machine Learning service](https://aka.ms/AMLFree).

## Create a workspace

If you have an Azure Machine Learning service workspace, skip to the [next section](#create-notebook). Otherwise, create one now.

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

## <a name="create-notebook"></a>Create a notebook VM

 From your workspace, create a cloud resource to start using Jupyter notebooks. This resource is a cloud-based platform that's preconfigured with everything you need to run the Azure Machine Learning service.

1. Open your workspace in the [Azure portal](https://portal.azure.com/). If you're not sure how to locate your workspace in the portal, see how to [view your workspace](how-to-manage-workspace.md#view).

1. On your workspace page, select **Notebook VMs** on the left.

1. Select **+New** to create a notebook VM.  

     ![Select New VM](./media/quickstart-run-cloud-notebook/add-workstation.png)

1. Provide a name for your VM. Then select **Create**.

    > [!NOTE]
    > Your notebook VM's name must be between 2 and 16 characters. Letters, digits, and hyphens are valid characters. The name must be unique across your Azure subscription.

    ![Create a new VM](media/quickstart-run-cloud-notebook/create-new-workstation.png)

1. Wait approximately 4 to 5 minutes, until the status changes to **Running**.


## Open the Jupyter web interface

After your VM is running, use the **Notebook VMs** section to open the Jupyter web interface.

1. Select **Jupyter** in the **URI** column for your VM.  

    ![Start the Jupyter notebook server](./media/quickstart-run-cloud-notebook/start-server.png)

    The link starts your notebook server and opens the Jupyter notebook webpage in a new browser tab.  This link will only work for the person who creates the VM.  Each user of the workspace must create their own VM.

1. On the Jupyter notebook webpage, the top folder's name is your username. Select this folder.

    > [!TIP]
    > This folder is located on the [storage container](concept-workspace.md#resources) in your workspace rather than on the notebook VM itself.  You can delete the notebook VM and still keep all your work.  When you create a new notebook VM later, it will load  this same folder.  If you share your workspace with others, they will see your folder and you will see theirs. 

1. The samples folder name includes a version number (**samples-1.0.33.1**, for example). Select the samples folder.

1. Select the **Quickstart** folder.

## Run the notebook

Run a notebook that estimates pi and logs the error to your workspace.

1. Select **01.run-experiment.ipynb** to open the notebook.

1. If you see a "Kernel not found" alert, select the kernel **Python 3.6 - AzureML** (approximately halfway down the list) and set the kernel.

1. Select the first code cell, and then select **Run**.

    > [!NOTE]
    > Code cells have brackets before them. If the brackets are empty (__[  ]__), the code has not been run. While the code is running, an asterisk appears (__[*]__). After the code completes, the number **[1]** appears.  The number tells you the order in which the cells ran.
    >
    > Use **Shift + Enter** as a shortcut to run a cell.

    ![Run the first code cell](media/quickstart-run-cloud-notebook/cell1.png)

1. Run the second code cell. If you see instructions to authenticate, copy the code and follow the link to sign in. After you sign in, your browser will remember this setting.  

    ![Authenticate](media/quickstart-run-cloud-notebook/authenticate.png)

1. When the code cell run is successful, the cell number __[2]__ appears. If you had to sign in, you will see a successful authentication status message.   If you didn't have to sign in, you won't see any output for this cell. You'll only see the number, which appears to show that the cell ran successfully.

    ![Success message](media/quickstart-run-cloud-notebook/success.png)

1. Run the rest of the code cells. As each cell finishes running, its cell number appears. Only the last cell displays any other output.  

    In the largest code cell, `run.log` appears in multiple places. Each `run.log` adds its value to your workspace.

## View logged values

1. The output from the `run` cell contains a link back to the Azure portal, where you can view the experiment results in your workspace.

    ![View experiments](./media/quickstart-run-cloud-notebook/view-exp.png)

1. Select **Link to Azure Portal** to view information about the run in your workspace. This link opens your workspace in the Azure portal.

1. The plots of logged values you see were automatically created in the workspace. Whenever you log multiple values with the same name parameter, a plot is automatically generated for you. Here is an example:

   ![View history](./media/quickstart-run-cloud-notebook/web-results.png)

Because the code to approximate pi uses random values, your plots may look different.  

## Clean up resources

### Stop the notebook VM

Stop the notebook VM when you are not using it to reduce cost.  

1. In your workspace, select **Notebook VMs**.

   ![Stop the VM server](./media/quickstart-run-cloud-notebook/stop-server.png)

1. From the list, select the VM.

1. Select **Stop**.

1. When you're ready to use the server again, select **Start**.

### Delete everything

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

After you complete these tasks, go to the Jupyter Notebook webpage. In the **Quickstart** folder, open and run the **02.deploy-web-service.ipynb** notebook to learn how to deploy a web service.

When you want to install other Python packages into your Jupyter environment, use this code inside a notebook:

```
!source activate py36 && pip install <packagename>
```

Also on the Jupyter Notebook webpage, browse through other notebooks in the samples folder to learn more about the Azure Machine Learning service.

For an in-depth workflow experience, follow Machine Learning tutorials to train and deploy a model:  

> [!div class="nextstepaction"]
> [Tutorial: Train an image classification model](tutorial-train-models-with-aml.md)
