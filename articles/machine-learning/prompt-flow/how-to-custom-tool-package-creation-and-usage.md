---
title: Custom tool package creation and usage in prompt flow
titleSuffix: Azure Machine Learning
description: Learn how to develop your own tool package in prompt flow.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: how-to
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 09/12/2023
---

# Custom tool package creation and usage

When developing flows, you can not only use the built-in tools provided by prompt flow, but also develop your own custom tool. In this document, we guide you through the process of developing your own tool package, offering detailed steps and advice on how to utilize your creation.

After successful installation, your custom "tool" can show up in the tool list:
:::image type="content" source="./media/how-to-custom-tool-package-creation-and-usage/test-customer-tool-on-ui.png" alt-text="Screenshot of custom tools in the UI tool list."lightbox = "./media/how-to-custom-tool-package-creation-and-usage/test-customer-tool-on-ui.png":::

## Create your own tool package

Your tool package should be a python package. To develop your custom tool, follow the steps **Create your own tool package** and **build and share the tool package** in [Create and Use Tool package](https://microsoft.github.io/promptflow/how-to-guides/develop-a-tool/create-and-use-tool-package.html). You can also [Add a tool icon](https://microsoft.github.io/promptflow/how-to-guides/develop-a-tool/add-a-tool-icon.html) and [Add Category and tags](https://microsoft.github.io/promptflow/how-to-guides/develop-a-tool/add-category-and-tags-for-tool.html) for your tool.

## Prepare runtime

To add the custom tool to your tool list, it's necessary to create a runtime, which is based on a customized environment where your custom tool is preinstalled. Here we use [my-tools-package](https://pypi.org/project/my-tools-package/) as an example to prepare the runtime.

### Create customized environment

1. Create a customized environment with docker context.

   1. Create a customized environment in Azure Machine Learning studio by going to **Environments**  then select **Create**. In the settings tab under *Select environment source*, choose " Create a new docker content."

       Currently we support creating environment with "Create a new docker context" environment source. "Use existing docker image with optional conda file" has known [limitation](../how-to-manage-environments-v2.md#create-an-environment-from-a-conda-specification) and isn't supported now.

        :::image type="content" source="./media/how-to-custom-tool-package-creation-and-usage/create-customized-environment-step-1.png" alt-text="Screenshot of create environment in Azure Machine Learning studio."lightbox = "./media/how-to-custom-tool-package-creation-and-usage/create-customized-environment-step-1.png":::

   1. Under **Customize**, replace the text in the Dockerfile:

       ```sh
       FROM mcr.microsoft.com/azureml/promptflow/promptflow-runtime:latest
       RUN pip install my-tools-package==0.0.1
       ```

         :::image type="content" source="./media/how-to-custom-tool-package-creation-and-usage/create-customized-environment-step-2.png" alt-text="Screenshot of create environment in Azure Machine Learning studio on the customize step."lightbox ="./media/how-to-custom-tool-package-creation-and-usage/create-customized-environment-step-2.png":::
    
       It takes several minutes to create the environment. After it succeeded, you can copy the Azure Container Registry (ACR) from environment detail page for the next step.

### Prepare compute instance runtime

1. Create a compute instance runtime using the customized environment created in step 2.
    1. Create a new compute instance. Existing compute instance created long time ago can possibly hit unexpected issue.
    2. Create runtime on CI with customized environment.

    :::image type="content" source="./media/how-to-custom-tool-package-creation-and-usage/create-runtime-on-compute-instance.png" alt-text="Screenshot of add compute instance runtime in Azure Machine Learning studio."lightbox ="./media/how-to-custom-tool-package-creation-and-usage/create-runtime-on-compute-instance.png":::

## Test from prompt flow UI
1. Create a standard flow.
2. Select the correct runtime ("my-tool-runtime") and add your tools.
    :::image type="content" source="./media/how-to-custom-tool-package-creation-and-usage/test-customer-tool-on-ui-step-1.png" alt-text="Screenshot of flow in Azure Machine Learning studio showing the runtime and more tools dropdown."lightbox ="./media/how-to-custom-tool-package-creation-and-usage/test-customer-tool-on-ui-step-1.png":::
3. Change flow based on your requirements and run flow in the selected runtime.
    :::image type="content" source="./media/how-to-custom-tool-package-creation-and-usage/test-customer-tool-on-ui-step-2.png" alt-text="Screenshot of flow in Azure Machine Learning studio showing adding a tool."lightbox ="./media/how-to-custom-tool-package-creation-and-usage/test-customer-tool-on-ui-step-2.png":::

## Test from VS Code extension

1. Install prompt flow for VS Code extension
    :::image type="content" source="./media/how-to-custom-tool-package-creation-and-usage/prompt-flow-vs-code-extension.png" alt-text="Screenshot of prompt flow VS Code extension."lightbox ="./media/how-to-custom-tool-package-creation-and-usage/prompt-flow-vs-code-extension.png":::
2. Go to terminal and install your tool package in conda environment of the extension. Assume your conda env name is `prompt-flow`.

   ```sh
   (local_test) PS D:\projects\promptflow\tool-package-quickstart> conda activate prompt-flow
   (prompt-flow) PS D:\projects\promptflow\tool-package-quickstart> pip install .\dist\my_tools_package-0.0.1-py3-none-any.whl
   ```

3. Go to the extension and open one flow folder. Select 'flow.dag.yaml' and preview the flow. Next, select `+` button and you can see your tools. You need to **reload the windows** to clean previous cache if you don't see your tool in the list.

    :::image type="content" source="./media/how-to-custom-tool-package-creation-and-usage/auto-list-tool-in-extension.png" alt-text="Screenshot of the VS Code showing the tools." lightbox ="./media/how-to-custom-tool-package-creation-and-usage/auto-list-tool-in-extension.png":::

## FAQ

### Why is my custom tool not showing up in the UI?
You can test your tool package using the following script to ensure that you've packaged your tool YAML files and configured the package tool entry point correctly.

  1. Make sure to install the tool package in your conda environment before executing this script.
  2. Create a python file anywhere and copy the following content into it.

      ```python
      def test():
          # `collect_package_tools` gathers all tools info using the `package-tools` entry point. This ensures that your package is correctly packed and your tools are accurately collected. 
          from promptflow.core.tools_manager import collect_package_tools
          tools = collect_package_tools()
          print(tools)
      if __name__ == "__main__":
          test()
      ```

  3. Run this script in your conda environment. It returns the metadata of all tools installed in your local environment, and you should verify that your tools are listed.
- If you're using runtime with CI, try to restart your container with command `docker restart <container_name_or_id>` to see if the issue can be resolved.

### Why am I unable to upload package to PyPI?

- Make sure that the entered username and password of your PyPI account are accurate.
- If you encounter a `403 Forbidden Error`, it's likely due to a naming conflict with an existing package. You need to choose a different name. Package names must be unique on PyPI to avoid confusion and conflicts among users. Before creating a new package, it's recommended to search PyPI (https://pypi.org/) to verify that your chosen name isn't already taken. If the name you want is unavailable, consider selecting an alternative name or a variation that clearly differentiates your package from the existing one.

## Next steps

- Learn more about [customize environment for runtime](how-to-customize-environment-runtime.md)
