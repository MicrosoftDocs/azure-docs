---
title: View resource properties
description: Describes how to search for resource schemas.
ms.topic: conceptual
ms.date: 05/05/2020
---

# View resource properties

When creating Resource Manager templates, you need to understand what resource types are available, and what values to use in your template. You can use the following resources to find the information. As an example, the procedures in this article demonstrate how to find the property name of Azure storage account SKU type, and the allowed values of the SKU type.

- Template reference
- REST API
- Resource Explorer
- Resource.azure.com
- Export
- portal

## Find the resource provider namespaces

https://docs.microsoft.com/en-gb/azure/azure-resource-manager/management/azure-services-resource-providers

## Use template reference

The Azure Resource Manager template reference is located at [https://docs.microsoft.com/azure/templates/](https://docs.microsoft.com/azure/templates/).

To find the allowed values for SKU name.

1. From the left navigation, select **Storage**, and then select **All resources**. This page lists the resource types and the versions. The **storageAccounts** resource type has these version when the article is written.

    ![template reference resource versions](./media/view-resource-properties/resource-manager-template-reference-resource-versions.png)

2. Select the latest version **2019-06-01**.  It is recommended to use the latest template schema.

    In the **Template format** section, it shows the sku property name and how to set it:

    ![template reference storage account format](./media/view-resource-properties/resource-manager-template-reference-storage-account-sku.png)

    Scroll down to see **Sku object**. The article shows the allowed values for SKU name:

    ![template reference storage account sku values](./media/view-resource-properties/resource-manager-template-reference-storage-account-sku-values.png)


## REST API

## Resource Explorer

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **resource explorer**, and then select **Resource Explorer**.

    ![Azure portal Resource Explorer](./media/view-resource-properties/azure-portal-resource-explorer.png)

1. There are two nodes:

    - Providers: view teh list of available resource providers
    - Subscriptions: view

## Next steps

For a step-by-step tutorial that guides you through the process of creating a template, see [Tutorial: Create and deploy your first ARM template](template-tutorial-create-first-template.md).
