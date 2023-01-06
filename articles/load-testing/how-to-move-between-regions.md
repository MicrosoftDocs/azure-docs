---
title: Move an Azure Load testing resource to another region
titleSuffix: Azure Load Testing
description: Learn how to move an Azure Load testing resource to another region.
services: load-testing
ms.service: load-testing
ms.custom: subject-moving-resources
ms.author: ninallam
author: ninallam
ms.date: 04/12/2022
ms.topic: how-to
---

# Move an Azure Load Testing Preview resource to another region

This article describes how to move your Azure Load Testing Preview resource to another Azure region. You might want to move your resource for a number of reasons. For example, to take advantage of a new Azure region, to meet internal policy and governance requirements, or in response to capacity planning requirements.

Azure Load Testing resources are region-specific and can't be moved across regions automatically. You can use an Azure Resource Manager template (ARM template) to export the existing configuration of your Load Testing resource instead. Then, stage the resource in another region and create the tests in the new resource.

## Prerequisites

- Make sure that the target region supports Azure Load Testing.

- Have access to the tests in the resource you're migrating.

## Prepare

To get started, you'll need to export and then modify an ARM template. You will also need to download artifacts for any exiting tests in the resource.

1. Export the ARM template that contains settings and information for your Azure Load Testing resource by following the steps mentioned [here](../azure-resource-manager/templates/export-template-portal.md).

1. Download the input artifacts for all the existing tests from the resource. Navigate to the **Tests** section in the resource and then click on the test name. **Download the input file** for the test by clicking the More button (...) on the right side of the latest test run.

    :::image type="content" source="media/how-to-move-an-azure-load-testing-resource/download-input-artifacts.png" alt-text="Screenshot that shows how to download input files for a test.":::

> [!NOTE]
> If you are using an Azure Key Vault to configure secrets for your load test, you can continue to use the same Key Vault.  

## Move

Load and modify the template so you can create a new Azure Load Testing resource in the target region and then create tests in the new resource.

### Move the resource

1. In the Azure portal, select **Create a resource**.

1. In the Marketplace, search for **template deployment**. Select **Template deployment (deploy using custom templates)**.

1. Select **Create**.

1. Select **Build your own template in the editor**.

1. Select **Load file**, and then select the template.json file that you downloaded in the last section.

1. In the uploaded template.json file, name the target Azure Load Testing resource by entering a new **defaultValue** for the resource name This example sets the defaultValue of the resource name to `myLoadTestResource`.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "loadtest_name": {
                "defaultValue": "myLoadTestResource",
                "type": "String"
            }
        },
    ```

1. Edit the **location** property to use your target region. This example sets the target region to `eastus`.

    ```json
    "resources": [
            {
                "type": "Microsoft.LoadTestService/loadtests",
                "apiVersion": "2021-12-01-preview",
                "name": "[parameters('loadtest_name')]",
                "location": "eastus",
    ```
    To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/data-residency/). The code for a region is the region name with no spaces. For example, East US = eastus.

1. Click on **Save**.

1. Enter the **Subscription** and **Resource group** for the target resource.

1. Select **Review and create**, then select **Create**.

### Create tests

Once the resource is created in the target location, you can create new tests by following the steps mentioned [here](how-to-create-and-run-load-test-with-jmeter-script.md#create-a-load-test).

1. You can refer to the test configuration in the config.yaml file of the input artifacts downloaded earlier.

1. Upload the Apache JMeter script and optional configuration files from the downloaded input artifacts.

If you are invoking the previous Azure Load Testing resource in a CI/CD workflow you can update the `loadTestResource` parameter in the [Azure Load testing task](/azure/devops/pipelines/tasks/test/azure-load-testing) or [Azure Load Testing action](https://github.com/marketplace/actions/azure-load-testing) of your workflow.

> [!NOTE]
> If you have configured any of your load test with secrets from Azure Key Vault, make sure to grant the new resource access to the Key Vault following the steps mentioned [here](./how-to-use-a-managed-identity.md?tabs=azure-portal#grant-access-to-your-azure-key-vault).

## Clean up source resources

After the move is complete, delete the Azure Load Testing resource from the source region. You pay for resources, even when the resource is not being utilized.

1. In the Azure portal, search and select **Azure Load Testing**.

1. Select your Azure Load Testing resource.

1. On the resource overview page, Select **Delete**, and then confirm.

> [!NOTE]
> Test results for the test runs in the previous resource will be lost once the resource is deleted.

## Next steps

- Learn how to run high-scale load tests, see [Set up a high-scale load test](./how-to-high-scale-load.md).