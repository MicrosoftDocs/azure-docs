---
title: Automated publishing for continuous integration and delivery
description: Learn how to publish for continuous integration and delivery automatically.
ms.subservice: ci-cd
author: kromerm
ms.author: makromer
ms.reviewer: susabat
ms.topic: concept-article
ms.date: 07/29/2026
ai-usage: ai-assisted
ms.custom:
  - build-2025
---

# Automated publishing for continuous integration and delivery (CI/CD)

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

[!INCLUDE [Migrate to Data Factory in Microsoft Fabric](includes/migrate-to-fabric.md)]

> [!NOTE]
> Synapse Analytics also supports CI/CD. Refer to the [Synapse Analytics CI/CD documentation](/azure/synapse-analytics/cicd/continuous-integration-delivery) for more information.

## Overview

Continuous integration is the practice of testing each change made to your codebase automatically. As early as possible, continuous delivery follows the testing that happens during continuous integration and pushes changes to a staging or production system.

In Azure Data Factory, CI/CD means moving Data Factory pipelines from one environment, such as development, test, and production, to another. Data Factory uses [Azure Resource Manager templates (ARM templates)](../azure-resource-manager/templates/overview.md) to store the configuration of your various Data Factory entities, such as pipelines, datasets, and data flows.

There are two suggested methods to promote a data factory to another environment:

- Automated deployment by using the integration of Data Factory with [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines).
- Manually uploading an ARM template by using Data Factory user experience integration with Azure Resource Manager.

For more information, see [Continuous integration and delivery in Azure Data Factory](continuous-integration-delivery.md).

This article focuses on the continuous deployment improvements and the automated publish feature for CI/CD.

## Continuous deployment improvements

The automated publish feature takes the **Validate all** and **Export ARM template** features from the Data Factory user experience and makes the logic consumable via a publicly available npm package [@microsoft/azure-data-factory-utilities](https://www.npmjs.com/package/@microsoft/azure-data-factory-utilities). For this reason, you can programmatically trigger these actions instead of having to go to the Data Factory UI and select a button manually. This capability gives your CI/CD pipelines a truer continuous integration experience.

> [!NOTE]
> Be sure to use Node.js version 20.x and its compatible version to avoid errors that can occur due to package incompatibility with older versions.

### Current CI/CD flow

1. Each user makes changes in their private branches.
1. Push to main isn't allowed. Users must create a pull request to make changes.
1. Users must load the Data Factory UI and select **Publish** to deploy changes to Data Factory and generate the ARM templates in the publish branch.
1. The DevOps Release pipeline is configured to create a new release and deploy the ARM template each time a new change is pushed to the publish branch.

:::image type="content" source="media/continuous-integration-delivery-improvements/current-ci-cd-flow.png" alt-text="Diagram that shows the current CI/CD flow.":::

### Manual step

In the current CI/CD flow, the user experience is the intermediary to create the ARM template. As a result, a user must go to the Data Factory UI and manually select **Publish** to start the ARM template generation and drop it in the publish branch.

### The new CI/CD flow

1. Each user makes changes in their private branches.
1. Push to main isn't allowed. Users must create a pull request to make changes.
1. The Azure DevOps pipeline build is triggered every time a new commit is made to main. It validates the resources and generates an ARM template as an artifact if validation succeeds.
1. The DevOps Release pipeline is configured to create a new release and deploy the ARM template each time a new build is available.

:::image type="content" source="media/continuous-integration-delivery-improvements/new-ci-cd-flow.png" alt-text="Diagram that shows the new CI/CD flow.":::

### What changed?

- You now have a build process that uses a DevOps build pipeline.
- The build pipeline uses the ADFUtilities (`@microsoft/azure-data-factory-utilities`) npm package, which validates all the resources and generates the ARM templates. These templates can be single and linked.
- The build pipeline validates Data Factory resources and generates the ARM template instead of the Data Factory UI (**Publish** button).
- The DevOps release definition now consumes this new build pipeline instead of the Git artifact.

> [!NOTE]
> You can continue to use the existing mechanism, which is the `adf_publish` branch, or you can use the new flow. Both are supported.

## Package overview

Two commands are currently available in the package:

- Export ARM template
- Validate

### Export ARM template

Run `npm run build export <rootFolder> <factoryId> [outputFolder]` to export the ARM template by using the resources of a given folder. This command also runs a validation check before generating the ARM template. Here's an example that uses a resource group named **testResourceGroup**:

```dos
npm run build export C:\DataFactories\DevDataFactory /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testResourceGroup/providers/Microsoft.DataFactory/factories/DevDataFactory ArmTemplateOutput
```

- `RootFolder` is a mandatory field that represents where the Data Factory resources are located.
- `FactoryId` is a mandatory field that represents the Data Factory resource ID in the format `/subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.DataFactory/factories/<dfName>`.
- `OutputFolder` is an optional parameter that specifies the relative path to save the generated ARM template.

The ability to stop/start only the updated triggers is now generally available and is merged into the preceding command. 

> [!NOTE]
> The ARM template generated isn't published to the live version of the factory. Deployment should be done by using a CI/CD pipeline.


### Validate

Run `npm run build validate <rootFolder> <factoryId>` to validate all the resources of a given folder. Here's an example:

```dos
npm run build validate C:\DataFactories\DevDataFactory /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testResourceGroup/providers/Microsoft.DataFactory/factories/DevDataFactory
```

- `RootFolder` is a mandatory field that represents where the Data Factory resources are located.
- `FactoryId` is a mandatory field that represents the Data Factory resource ID in the format `/subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.DataFactory/factories/<dfName>`.

## Create an Azure pipeline

While npm packages can be consumed in various ways, one of the primary benefits is being consumed through [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops&preserve-view=true). On each merge into your collaboration branch, a pipeline can be triggered that first validates all the code and then exports the ARM template into a [build artifact](/azure/devops/pipelines/artifacts/build-artifacts) that can be consumed by a release pipeline. How it differs from the current CI/CD process is that you'll *point your release pipeline at this artifact instead of the existing `adf_publish` branch*.

Follow these steps to get started:

1. Open an Azure DevOps project, and go to **Pipelines**. Select **New Pipeline**.

   :::image type="content" source="media/continuous-integration-delivery-improvements/new-pipeline.png" alt-text="Screenshot that shows the New pipeline button.":::

2. Select the repository where you want to save your pipeline YAML script. Save it in a build folder in the same repository as your Data Factory resources. Ensure there's a *package.json* file in the repository that contains the package name, as shown in the following example:

   ```json
   {
       "scripts":{
           "build":"node node_modules/@microsoft/azure-data-factory-utilities/lib/index"
       },
       "dependencies":{
           "@microsoft/azure-data-factory-utilities":"^1.0.0"
       }
   } 
   ```

3. Select **Starter pipeline**. If you've uploaded or merged the YAML file, as shown in the following example, you can also point directly at that and edit it.

   :::image type="content" source="media/continuous-integration-delivery-improvements/starter-pipeline.png" alt-text="Screenshot that shows Starter pipeline.":::

   ```yaml
   # Sample YAML file to validate and export an ARM template into a build artifact
   # Requires a package.json file located in the target repository
   
   trigger:
   - main #collaboration branch
   
   pool:
     vmImage: 'ubuntu-latest'
   
   steps:
   
   # Installs Node and the npm packages saved in your package.json file in the build
   
   - task: UseNode@1
     inputs:
       version: '20.x'
     displayName: 'Install Node.js'
   
   - task: Npm@1
     inputs:
       command: 'install'
       workingDir: '$(Build.Repository.LocalPath)/<folder-of-the-package.json-file>' #replace with the package.json folder
       verbose: true
     displayName: 'Install npm package'
   
   # Validates all of the Data Factory resources in the repository. You'll get the same validation errors as when "Validate All" is selected.
   # Enter the appropriate subscription and name for the source factory. Either of the "Validate" or "Validate and Generate ARM template" options are required to perform validation. Running both is unnecessary.
   
   - task: Npm@1
     inputs:
       command: 'custom'
       workingDir: '$(Build.Repository.LocalPath)/<folder-of-the-package.json-file>' #replace with the package.json folder
       customCommand: 'run build validate $(Build.Repository.LocalPath)/<Root-folder-from-Git-configuration-settings-in-ADF> /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/<Your-ResourceGroup-Name>/providers/Microsoft.DataFactory/factories/<Your-Factory-Name>'
     displayName: 'Validate'
   
   # Validate and then generate the ARM template into the destination folder, which is the same as selecting "Publish" from the UX.
   # The ARM template generated isn't published to the live version of the factory. Deployment should be done by using a CI/CD pipeline. 
   
   - task: Npm@1
     inputs:
       command: 'custom'
       workingDir: '$(Build.Repository.LocalPath)/<folder-of-the-package.json-file>' #replace with the package.json folder
       customCommand: 'run build export $(Build.Repository.LocalPath)/<Root-folder-from-Git-configuration-settings-in-ADF> /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/<Your-ResourceGroup-Name>/providers/Microsoft.DataFactory/factories/<Your-Factory-Name> "ArmTemplate"'
   #For using preview that allows you to only stop/ start triggers that are modified, please comment out the above line and uncomment the below line. Make sure the package.json contains the build-preview command. 
   	#customCommand: 'run build-preview export $(Build.Repository.LocalPath) /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/GartnerMQ2021/providers/Microsoft.DataFactory/factories/Dev-GartnerMQ2021-DataFactory "ArmTemplate"'
     displayName: 'Validate and Generate ARM template'
   
   # Publish the artifact to be used as a source for a release pipeline.
   
   - task: PublishPipelineArtifact@1
     inputs:
       targetPath: '$(Build.Repository.LocalPath)/<folder-of-the-package.json-file>/ArmTemplate' #replace with the package.json folder
       artifact: 'ArmTemplates'
       publishLocation: 'pipeline'
   ```

4. Enter your YAML code. Use the YAML file as a starting point.

5. Save and run. If you used the YAML, it gets triggered every time the main branch is updated. Confirm the run succeeds and produces the `ArmTemplates` artifact in the pipeline's published artifacts.

> [!NOTE]
> The generated artifacts already contain pre- and post-deployment scripts for the triggers, so you don't need to add them manually. However, when you deploy, you still need to reference the [documentation on stopping and starting triggers](continuous-integration-delivery-sample-script.md#script-execution-and-parameters) to run the provided script.

## Related content

Learn more about continuous integration and delivery in Data Factory:
[Continuous integration and delivery in Azure Data Factory](continuous-integration-delivery.md).
