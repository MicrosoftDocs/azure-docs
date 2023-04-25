---
title: Move an Azure Load testing resource to another region
titleSuffix: Azure Load Testing
description: Learn how to move an Azure Load testing resource to another region.
services: load-testing
ms.service: load-testing
ms.custom: subject-moving-resources
ms.author: ninallam
author: ninallam
ms.date: 04/05/2023
ms.topic: how-to
---

# Move an Azure load testing resource to another region

This article describes how to move your Azure load testing resource to another Azure region. You might want to move your resource for a number of reasons. For example, to take advantage of a new Azure region, to generate load from a different location, to meet internal policy and governance requirements, or in response to capacity planning requirements.

Azure load testing resources are region-specific and can't be moved across regions automatically. When you recreate the Azure load testing resource in the target Azure region, you need to recreate existing load tests in the new resource.

Go through the following steps to move your resource to another region:

1. Export the configuration of your Azure load testing resource in an Azure Resource Manager template (ARM template).

1. Optionally, download any test artifacts from existing load tests.

1. Create a new Azure load testing resource in the target region by using the ARM template.

1. Recreate the load tests in the new resource.

1. Optionally, delete the Azure load testing resource in the previous region.

## Prerequisites

- The target Azure region supports Azure Load Testing. Learn more about the [regional availability](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=load-testing) for Azure Load Testing.

- You have access to the tests in the resource you're migrating. Learn more about how to [manage access in Azure Load Testing](./how-to-assign-roles.md).

## Prepare

To get started, export the ARM template for the Azure load testing resource and download the input artifacts for existing load tests. Later, you'll update the ARM template to deploy the resource in the target Azure region.

1. Export the ARM template that contains settings and information for your Azure Load Testing resource by following the steps mentioned [here](../azure-resource-manager/templates/export-template-portal.md).

    :::image type="content" source="media/how-to-move-an-azure-load-testing-resource/load-testing-export-arm-template.png" alt-text="Screenshot that shows the ARM template to export an Azure load testing resource in the Azure portal." lightbox="media/how-to-move-an-azure-load-testing-resource/load-testing-export-arm-template.png":::

1. Download the input artifacts for each existing test in the resource:

    1. Navigate to the **Tests** section for the load testing resource.
    
    1. Select the test name to go to the list of test runs.
    
    1. Select the ellipsis (**...**) for a test run, and then select **Download input file**.
    
        The browser should now start downloading a zipped folder that contains all input files for the test, such as the [test configuration YAML file](./reference-test-config-yaml.md), the JMeter script, and any configuration or data files.
        
        :::image type="content" source="media/how-to-move-an-azure-load-testing-resource/download-input-artifacts.png" alt-text="Screenshot that shows how to download input files for a test.":::
        
> [!NOTE]
> If you are using an Azure Key Vault to configure secrets for your load test, you can continue to use the same Key Vault.  

## Move

To move the resource to the target Azure region, modify the ARM template, create a new resource by using the template, and recreate the load tests in the new resource.

### Move the resource

1. In the Azure portal, select **Create a resource**.

1. In the Marketplace, search for **template deployment**. Select **Template deployment (deploy using custom templates)**, and then select **Create**.

    :::image type="content" source="media/how-to-move-an-azure-load-testing-resource/azure-marketplace-template-deployment.png" alt-text="Screenshot that shows the Template deployment option in the Azure Marketplace, highlighting the Create button.":::

1. Select **Build your own template in the editor**.

1. Select **Load file**, and then select the `template.json` file that you exported previously.

1. Update the JSON contents:

    1. Update the name of the target Azure load testing resource by updating the `defaultValue` property.
    
        ```json
        {
            "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
                "loadtest_name": {
                    "defaultValue": "{new-resource-name}",
                    "type": "String"
                }
            },
        ```

    1. Edit the **location** property to use your target region. The following example sets the target region to `eastus`.

        ```json
        "resources": [
                {
                    "type": "Microsoft.LoadTestService/loadtests",
                    "apiVersion": "2021-12-01-preview",
                    "name": "[parameters('loadtest_name')]",
                    "location": "eastus",
        ```

        To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/data-residency/). The code for a region is the region name with no spaces. For example, East US = eastus.

1. Select **Save**.

1. Enter the **Subscription** and **Resource group** for the target resource.

1. Select **Review and create**, then select **Create** to create a new Azure load testing resource in the target Azure region.

### Create tests

After creating the Azure load testing resource, you can [recreate the load tests in the Azure portal](how-to-create-and-run-load-test-with-jmeter-script.md#create-a-load-test).

Refer to the test configuration in the `config.yaml` files you downloaded earlier for configuring the load test settings. Upload the Apache JMeter script and optional configuration files from the downloaded input artifacts.

If you invoke the load tests in a CI/CD workflow, update the `loadTestResource` parameter in the CI/CD pipeline definition to match the new Azure load testing resource name.

> [!NOTE]
> If you have configured any of your load test with secrets from Azure Key Vault, make sure to [grant the new resource access to the Key Vault](./how-to-use-a-managed-identity.md?tabs=azure-portal#grant-access-to-your-azure-key-vault).

## Clean up source resources

After the move is complete, delete the Azure load testing resource from the source region. You pay for resources, even when you're not using them.

1. In the Azure portal, search and select **Azure Load Testing**.

1. Select your Azure load testing resource.

1. On the resource **Overview** page, select **Delete**, and then confirm.

> [!CAUTION]
> When you delete an Azure load testing resource, you can no longer view the associated test runs and test results.

## Next steps

- Learn how to run high-scale load tests, see [Set up a high-scale load test](./how-to-high-scale-load.md).