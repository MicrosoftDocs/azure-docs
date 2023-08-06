---
title: Create and run component-based ML pipelines (UI)
titleSuffix: Azure Machine Learning
description: Create and run machine learning pipelines using the Azure Machine Learning studio UI. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: keli19
author: likebupt
ms.reviewer: lagayhar
ms.date:  03/27/2022
ms.topic: how-to
ms.custom: devplatv2, designer, event-tier1-build-2022, ignite-2022
---

# Create and run machine learning pipelines using components with the Azure Machine Learning studio

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

In this article, you'll learn how to create and run [machine learning pipelines](concept-ml-pipelines.md) by using the Azure Machine Learning studio and [Components](concept-component.md). You can create pipelines without using components, but components offer better amount of flexibility and reuse. Azure Machine Learning Pipelines may be defined in YAML and [run from the CLI](how-to-create-component-pipelines-cli.md), [authored in Python](how-to-create-component-pipeline-python.md), or composed in Azure Machine Learning studio Designer with a drag-and-drop UI. This document focuses on the Azure Machine Learning studio designer UI.

## Prerequisites

* If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace[Create workspace resources](quickstart-create-resources.md).

* [Install and set up the Azure CLI extension for Machine Learning](how-to-configure-cli.md).

* Clone the examples repository:

    ```azurecli-interactive
    git clone https://github.com/Azure/azureml-examples --depth 1
    cd azureml-examples/cli/jobs/pipelines-with-components/
    ```

>[!Note]
> Designer supports two types of components, classic prebuilt components（v1） and custom components(v2). These two types of components are NOT compatible. 
>
>Classic prebuilt components provide prebuilt components majorly for data processing and traditional machine learning tasks like regression and classification. This type of component continues to be supported but will not have any new components added. 
>
>Custom components allow you to wrap your own code as a component. It supports sharing components across workspaces and seamless authoring across Studio, CLI v2, and SDK v2 interfaces. 
>
>For new projects, we highly suggest you use custom component, which is compatible with AzureML V2 and will keep receiving new updates. 
>
>This article applies to custom components.

## Register component in your workspace

To build pipeline using components in UI, you need to register components to your workspace first. You can use UI, CLI or SDK to register components to your workspace, so that you can share and reuse the component within the workspace. Registered components support automatic versioning so you can update the component but assure that pipelines that require an older version continues to work.  

The example below uses UI to register components, and the [component source files](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/pipelines-with-components/basics/1b_e2e_registered_components)  are in the `cli/jobs/pipelines-with-components/basics/1b_e2e_registered_components` directory of the [`azureml-examples` repository](https://github.com/Azure/azureml-examples). You need to clone the repo to local first.

1. In your Azure Machine Learning workspace, navigate to **Components** page and select **New Component**.

:::image type="content" source="./media/how-to-create-component-pipelines-ui/register-component-entry-button.png" alt-text="Screenshot showing register entry button in component page." lightbox ="./media/how-to-create-component-pipelines-ui/register-component-entry-button.png":::

This example uses `train.yml` [in the directory](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/pipelines-with-components/basics/1b_e2e_registered_components). The YAML file defines the name, type, interface including inputs and outputs, code, environment and command of this component. The code of this component `train.py` is under `./train_src` folder, which describes the execution logic of this component. To learn more about the component schema, see the [command component YAML schema reference](reference-yaml-component-command.md).

>[!Note]
> When register components in UI, `code` defined in the component YAML file can only point to the current folder where YAML file locates or the subfolders, which means you cannot specify `../` for `code` as UI cannot recognize the parent directory.
> `additional_includes` can only point to the current or sub folder.


2. Select Upload from **Folder**, and select the `1b_e2e_registered_components` folder to upload. Select `train.yml` from the drop down list below.

:::image type="content" source="./media/how-to-create-component-pipelines-ui/upload-from-local-folder.png" alt-text="Screenshot showing upload from local folder." lightbox ="./media/how-to-create-component-pipelines-ui/upload-from-local-folder.png":::

3. Select **Next** in the bottom, and you can confirm the details of this component. Once you've confirmed, select **Create** to finish the registration process.

4. Repeat the steps above to register Score and Eval component using `score.yml` and `eval.yml` as well.

5. After registering the three components successfully, you can see your components in the studio UI.

:::image type="content" source="./media/how-to-create-component-pipelines-ui/component-page.png" alt-text="Screenshot showing registered component in component page." lightbox ="./media/how-to-create-component-pipelines-ui/component-page.png":::

## Create pipeline using registered component

1. Create a new pipeline in the designer. Remember to select the **Custom** option.

    :::image type="content" source="./media/how-to-create-component-pipelines-ui/new-pipeline.png" alt-text="Screenshot showing creating new pipeline in designer homepage." lightbox ="./media/how-to-create-component-pipelines-ui/new-pipeline.png":::

2. Give the pipeline a meaningful name by selecting the pencil icon besides the autogenerated name. 

    :::image type="content" source="./media/how-to-create-component-pipelines-ui/rename-pipeline.png" alt-text="Screenshot showing rename the pipeline." lightbox ="./media/how-to-create-component-pipelines-ui/rename-pipeline.png":::

3. In designer asset library, you can see **Data**, **Model** and **Components** tabs. Switch to the **Components** tab, you can see the components registered from previous section. If there are too many components, you can search with the component name.

    :::image type="content" source="./media/how-to-create-component-pipelines-ui/asset-library.png" alt-text="Screenshot showing registered component in asset library." lightbox ="./media/how-to-create-component-pipelines-ui/asset-library.png":::

    Find the *train*, *score* and *eval* components registered in previous section then drag-and-drop them on the canvas. By default it uses the default version of the component, and you can change to a specific version in the right pane of component. The component right pane is invoked by double click on the component.
    
    :::image type="content" source="./media/how-to-create-component-pipelines-ui/change-component-version.png" alt-text="Screenshot showing changing version of component." lightbox ="./media/how-to-create-component-pipelines-ui/change-component-version.png":::
    
    In this example, we'll use the sample data under [this path](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/pipelines-with-components/basics/1b_e2e_registered_components/data). Register the data into your workspace by clicking the add icon in designer asset library -> data tab, set Type = Folder(uri_folder) then follow the wizard to register the data. The data type need to be uri_folder to align with the [train component definition](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/pipelines-with-components/basics/1b_e2e_registered_components/train.yml).

    :::image type="content" source="./media/how-to-create-component-pipelines-ui/add-data.png" alt-text="Screenshot showing add data." lightbox ="./media/how-to-create-component-pipelines-ui/add-data.png":::

    Then drag and drop the data into the canvas. Your pipeline look should look like the following screenshot now.
    
    :::image type="content" source="./media/how-to-create-component-pipelines-ui/pipeline-with-all-boxes.png" alt-text="Screenshot showing the pipeline draft." lightbox ="./media/how-to-create-component-pipelines-ui/pipeline-with-all-boxes.png":::


    
4. Connect the data and components by dragging connections in the canvas.
  
     :::image type="content" source="./media/how-to-create-component-pipelines-ui/connect.gif" alt-text="Gif showing connecting the pipeline." lightbox ="./media/how-to-create-component-pipelines-ui/connect.gif":::


5. Double click one component, you'll see a right pane where you can configure the component.

     :::image type="content" source="./media/how-to-create-component-pipelines-ui/component-parameter.png" alt-text="Screenshot showing component parameter settings." lightbox ="./media/how-to-create-component-pipelines-ui/component-parameter.png":::

    For components with primitive type inputs like number, integer, string and boolean, you can change values of such inputs in the component detailed pane, under **Inputs** section.

    You can also change the output settings (where to store the component's output) and run settings (compute target to run this component) in the right pane.

    Now let's promote the *max_epocs* input of the *train* component to pipeline level input. Doing so, you can assign a different value to this input every time before submitting the pipeline.

     :::image type="content" source="./media/how-to-create-component-pipelines-ui/promote-pipeline-input.png" alt-text="Screenshot showing how to promote component input to pipeline input." lightbox ="./media/how-to-create-component-pipelines-ui/promote-pipeline-input.png":::



> [!NOTE]
> Custom components and the designer classic prebuilt components cannot be used together.

## Submit pipeline

1. Select **Configure & Submit** on the right top corner to submit the pipeline.

    :::image type="content" source="./media/how-to-create-component-pipelines-ui/configure-submit.png" alt-text="Screenshot showing configure and submit button." border="false":::


1. Then you'll see a step-by-step wizard, follow the wizard to submit the pipeline job.

  :::image type="content" source="./media/how-to-create-component-pipelines-ui/submission-wizard.png" alt-text="Screenshot showing submission wizard." lightbox ="./media/how-to-create-component-pipelines-ui/submission-wizard.png":::

In **Basics** step, you can configure the experiment, job display name, job description etc.

In **Inputs & Outputs** step, you can configure the Inputs/Outputs that are promoted to pipeline level. In previous step, we promoted the *max_epocs* of *train* component to pipeline input, so you should be able to see and assign value to *max_epocs* here.

In **Runtime settings**, you can configure the default datastore and default compute of the pipeline. It's the default datastore/compute for all components in the pipeline. But note if you set a different compute or datastore for a component explicitly, the system respects the component level setting. Otherwise, it uses the pipeline default value. 

The **Review + Submit** step is the last step to review all configurations before submit. The wizard remembers your last time's configuration if you ever submit the pipeline.

After submitting the pipeline job, there will be a message on the top with a link to the job detail. You can click this link to review the job details.

  :::image type="content" source="./media/how-to-create-component-pipelines-ui/submit-message.png" alt-text="Screenshot showing submission message." lightbox ="./media/how-to-create-component-pipelines-ui/submit-message.png":::



## Next steps

- Use [these Jupyter notebooks on GitHub](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/pipelines-with-components) to explore machine learning pipelines further
- Learn [how to use CLI v2 to create pipeline using components](how-to-create-component-pipelines-cli.md).
- Learn [how to use SDK v2 to create pipeline using components](how-to-create-component-pipeline-python.md)
