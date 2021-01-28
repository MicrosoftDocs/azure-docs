---
title: Automated publishing for continuous integration and delivery
description: Learn how to publish for continuous integration and delivery automatically.
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
author: nabhishek
ms.author: abnarain
ms.reviewer: maghan
manager: weetok
ms.topic: conceptual
ms.date: 01/28/2021
---

# Automated publishing for continuous integration and delivery

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

## Overview

Continuous integration is the practice of testing each change made to your codebase automatically and as early as possible Continuous delivery follows the testing that happens during continuous integration and pushes changes to a staging or production system.

In Azure Data Factory, continuous integration and delivery (CI/CD) means moving Data Factory pipelines from one environment (development, test, production) to another. Azure Data Factory utilizes [Azure Resource Manager templates](../azure-resource-manager/templates/overview.md) to store the configuration of your various ADF entities (pipelines, datasets, data flows, and so on). There are two suggested methods to promote a data factory to another environment:

-    Automated deployment using Data Factory's integration with [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines)
-    Manually upload a Resource Manager template using Data Factory UX integration with Azure Resource Manager.

## Continuous deployment improvements

This feature takes the *validate all* and export *ARM template* features from the ADF UX and makes the logic consumable via a publicly available npm package [@microsoft/azure-data-factory-utilities](https://www.npmjs.com/package/@microsoft/azure-data-factory-utilities/v/0.1.1). This allows you to programmatically trigger these actions instead of having to go to the ADF UI and do a button click. This will give your CI/CD pipelines a truer continuous integration experience.

### Current CI/CD flow

1. Each user makes changes in their private branches.
2. Push to master is forbidden, users must create a PR to master to make changes.
3. Users must load ADF UI and click publish to deploy changes to Data Factory and generate the ARM templates in the Publish branch.
4. DevOps Release pipeline is configured to create a new release and deploy the ARM template each time a new change is pushed to the publish branch.

    ![Current CI/CD Flow](media/continuous-integration-deployment-improvements/current-ci-cd-flow.png)

### Problem
The UX is the intermediary to create the ARM template, therefore a user must go to ADF UI and manually click publish to start the ARM template generation and drop it in the publish branch, which is a bit of a hack.

### Solution: new CI/CD flow

1. Each user makes changes in their private branches.
2. Push to master is forbidden, users must create a PR to master to make changes.
3. **Azure DevOps pipeline build is triggered every time a new commit is made to master, validates the resources and generates an ARM template as an artifact if validation succeeds.**
4. DevOps Release pipeline is configured to create a new release and deploy the ARM template each time a new build is available. 

    ![New CI/CD Flow](media/continuous-integration-deployment-improvements/new-ci-cd-flow.png)

### What changed?

- We now have a build process using a DevOps build pipeline.
- The build pipeline uses ADFUtilities NPM package, which will validate all the resources and generate the ARM templates (single and linked templates).
- The build pipeline will be responsible of validating ADF resources and generating the ARM template instead of ADF UI (Publish button).
- DevOps release definition will now consume this new build pipeline instead of the Git artifact.
- We get rid of the publish branch since it is not needed anymore.

> [!NOTE]
>  We will always be compatible with the old CI/CD flow, i.e., ADF UI will not change the current publish flow (we can make it optionally later leveraging publish_config.json to optimize publish time).

## Package Overview

There are two commands currently available in the package:
 
1. Export ARM template
 
    Run npm run start export <rootFolder> <factoryId> [outputFolder] to export the ARM template using the resources of a given folder. This command runs a validation check as well prior to generating the ARM template. Below is an example:

    ```
    npm run start export C:\DataFactories\DevDataFactory /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testResourceGroup/providers/Microsoft.DataFactory/factories/DevDataFactory ArmTemplateOutput
    ```

- RootFolder is a mandatory field that represents where the Data Factory resources are located.
- FactoryId is a mandatory field that represents the Data factory resource ID in the format: /subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.DataFactory/factories/<dfName>
- OutputFolder is an optional parameter that specifies the relative path to save the generated ARM template.
 
    > [!NOTE]
    > The ARM template generated is not published to the `Live` version of the factory. Deployment should be done using a CI/CD pipeline. 
 
2. Validate
 
    Run npm run start validate <rootFolder> <factoryId> to validate all the resources of a given folder. Below is an example:
    
        ```
        npm run start validate C:\DataFactories\DevDataFactory /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testResourceGroup/providers/Microsoft.DataFactory/factories/DevDataFactory
        ```
- RootFolder is a mandatory field that represents where the Data Factory resources are located.
- FactoryId is a mandatory field that represents the Data factory resource ID in the format: "/subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.DataFactory/factories/<dfName>".

## Creating an Azure Pipeline

While npm packages can be consumed in various ways, one of the primary benefits is being consumed via an [Azure Pipeline](https://docs.microsoft.com/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops#:~:text=Azure%20Pipelines%20is%20a%20cloud,it%20available%20to%20other%20users.&text=Azure%20Pipelines%20combines%20continuous%20integration,ship%20it%20to%20any%20target.). On each merge into your collaboration branch, a pipeline can be triggered that first validates all of the code and then exports the ARM template into a [build artifact](https://docs.microsoft.com/azure/devops/pipelines/artifacts/build-artifacts?view=azure-devops&tabs=yaml#how-do-i-consume-artifacts) that can be consumed by a release pipeline. **How it differs from the current CI/CD process is that you will point your release pipeline at this artifact instead of the existing `adf_publish` branch.**

Follow the below steps to get started:

1.	Open an Azure DevOps project and go to "Pipelines". Select "New Pipeline".

    ![New Pipeline](media/continuous-integration-deployment-improvements/new-pipeline.png)
2.	Select the repository where you wish to save your Pipeline YAML script. We recommend saving it in a build folder within the same repository of your ADF resources. Ensure there is a package.json file in the repository as well that contains the package name.
3.	Select *Starter pipeline*. If you have uploaded or merged the YAML file, you can also point directly at that and edit it. 

    ![Starter pipeline](media/continuous-integration-deployment-improvements/starter-pipeline.png) 
4.	Enter in your YAML code. We recommend taking the YAML file and using it as a starting point.
5.	Save and run. If using the YAML, it will get triggered every time the "main" branch is updated.