---
title: Push settings to App Configuration with Azure Pipelines
description: Learn to use Azure Pipelines to push key-values to an App Configuration Store
services: azure-app-configuration
author: lisaguthrie
ms.service: azure-app-configuration
ms.topic: how-to
ms.date: 07/27/2020
ms.author: lcozzens
---

# Push settings to App Configuration with Azure Pipelines

The [Azure App Configuration Push](https://marketplace.visualstudio.com/items?itemName=AzureAppConfiguration.azure-app-configuration-task-push) task pushes key-values from a configuration file into your App Configuration store. This task enables full circle functionality within the pipeline as you're now able to pull settings from the App Configuration store as well as push settings to the App Configuration store.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- App Configuration resource - create one for free in the [Azure portal](https://portal.azure.com).
- Azure DevOps project - [create one for free](https://go.microsoft.com/fwlink/?LinkId=2014881)
- Azure App Configuration Push task - download for free from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=AzureAppConfiguration.azure-app-configuration-task-push#:~:text=Navigate%20to%20the%20Tasks%20tab,the%20Azure%20App%20Configuration%20instance.).

## Create a service connection

A service connection allows you to access resources in your Azure subscription from your Azure DevOps project.

1. In Azure DevOps, go to the project containing your target pipeline and open the **Project settings** at the bottom left.
1. Under **Pipelines** select **Service connections** and select **New service connection** in the top right.
1. Select **Azure Resource Manager**.
1. Select **Service principal (automatic)**.
1. Fill in your subscription and resource. Give your service connection a name.

Now that your service connection is created, find the name of the service principal assigned to it. You'll add a new role assignment to this service principal in the next step.

1. Go to **Project Settings** > **Service connections**.
1. Select the service connection that you created in the previous section.
1. Select **Manage Service Principal**.
1. Note the **Display name** listed.

## Add role assignment

Assign the proper App Configuration role assignments to the credentials being used within the task so that the task can access the App Configuration store.

1. Navigate to your target App Configuration store. 
1. On the left, select **Access control (IAM)**.
1. At the top, select **+ Add** and pick **Add role assignment**.
1. Under **Role**, select **App Configuration Data Owner**. This role allows the task to read from and write to the App Configuration store. 
1. Select the service principal associated with the service connection that you created in the previous section.
  
## Use in builds

This section will cover how to use the Azure App Configuration Push task in an Azure DevOps build pipeline.

1. Navigate to the build pipeline page by clicking **Pipelines** > **Pipelines**. Documentation for build pipelines can be found [here](/azure/devops/pipelines/create-first-pipeline?tabs=tfs-2018-2&view=azure-devops).
      - If you're creating a new build pipeline, select **Show assistant** on the right side of the pipeline, and search for the **Azure App Configuration Push** task.
      - If you're using an existing build pipeline, navigate to the **Tasks** tab when editing the pipeline, and search for the **Azure App Configuration Push** Task.
2. Configure the necessary parameters for the task to push the key-values from the configuration file to the App Configuration store. The **Configuration File Path** parameter begins at the root of the file repository.
3. Save and queue a build. The build log will display any failures that occurred during the execution of the task.

## Use in releases

This section will cover how to use the Azure App Configuration Push task in an Azure DevOps release pipelines.

1. Navigate to release pipeline page by selecting **Pipelines** > **Releases**. Documentation for release pipelines can be found [here](/azure/devops/pipelines/release?view=azure-devops).
1. Choose an existing release pipeline. If you don’t have one, select **+ New** to create a new one.
1. Select the **Edit** button in the top-right corner to edit the release pipeline.
1. Choose the **Stage** to add the task. More information about stages can be found [here](/azure/devops/pipelines/release/environments?view=azure-devops).
1. Select **+** for that Job, then add the **Azure App Configuration Push** task under the **Deploy** tab.
1. Configure the necessary parameters within the task to push your key-values from your configuration file to your App Configuration store. Explanations of the parameters are available in the **Parameters** section below, and in tooltips next to each parameter.
1. Save and queue a release. The release log will display any failures encountered during the execution of the task.

## Parameters

The following parameters are used by the App Configuration Push task:

- **Azure subscription**: A drop-down containing your available Azure service connections. To update and refresh your list of available Azure service connections, press the **Refresh Azure subscription** button to the right of the textbox.
- **App Configuration Name**: A drop-down that loads your available configuration stores under the selected subscription. To update and refresh your list of available configuration stores, press the **Refresh App Configuration Name** button to the right of the textbox.
- **Configuration File Path**: The path to your configuration file. You can browse through your build artifact to select a configuration file. (`...` button to the right of the textbox).
- **Separator**: The separator that's used to flatten .json and .yml files.
- **Depth**: The depth that the .json and .yml files will be flattened to.
- **Prefix**: A string that's appended to the beginning of each key pushed to the App Configuration store.
- **Label**: A string that's added to each key-value as the label within the App Configuration store.
- **Content Type**: A string that's added to each key-value as the content type within the App Configuration store.
- **Tags**: A JSON object in the format of `{"tag1":"val1", "tag2":"val2"}`, which defines tags that are added to each key-value pushed to your App Configuration store.
- **Delete all other Key-Values in store with the specified prefix and label**: Default value is **Unchecked**.
  - **Checked**: Removes all key-values in the App Configuration store that match both the specified prefix and label before pushing new key-values from the configuration file.
  - **Unchecked**: Pushes all key-values from the configuration file into the App Configuration store and leaves everything else in the App Configuration store intact.

After filling out required parameters, run the pipeline. All key-values in the specified configuration file will be uploaded to App Configuration.

## Troubleshooting

If an unexpected error occurs, debug logs can be enabled by setting the pipeline variable `system.debug` to `true`.

## FAQ

**How can I upload multiple configuration files?**

Create multiple instances of the Azure App Configuration Push task within the same pipeline to push multiple configuration files to the App Configuration store.

**Why am I receiving a 409 error when attempting to push key-values to my configuration store?**

A 409 Conflict error message will occur if the task tries to remove or overwrite a key-value that is locked in the App Configuration store.