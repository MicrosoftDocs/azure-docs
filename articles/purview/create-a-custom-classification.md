---
title: Create a custom classification
description: This article describes how to create custom Azure Purview classifications to define data types in your data estate that are unique to your organization.
author: chandrakavya
ms.author: kchandra
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: overview
ms.date: 10/08/2020
---

# Create a custom classification

This article describes how you can create custom Azure Purview classifications to define data types in your data estate that are unique to your organization.

## Default classifications

By default, the catalog provides a large set of default classifications that represent typical personal data types that you might have in your data estate. In addition to these default classifications, you can define your own custom classifications to support your data estate.

To display the default classifications, select the **System** tab on the **Classifications** page.

:::image type="content" source="media/create-a-custom-classification/default-classifications-in-catalog.png" alt-text="Screenshot showing the default classifications in a catalog." lightbox="media/create-a-custom-classification/default-classifications-in-catalog.png":::

## Steps to create a custom classification

To create a custom classification:

1. From your Azure Purview account page, select **Launch Purview account**, and then select **Management Center**.

   :::image type="content" source="media/create-a-custom-classification/select-management-center.png" alt-text="Screenshot showing how to select Management Center.":::

1. Under **Metadata management** in the left pane, select **Classifications**.

   :::image type="content" source="media/create-a-custom-classification/select-classifications.png" alt-text="Screenshot showing how to select the custom classifications in a catalog.":::

1. From the **Classifications** page, select **New**.

   :::image type="content" source="media/create-a-custom-classification/create-new-classification.png" alt-text="Screenshot showing how to select New to create a new custom classification." lightbox="media/create-a-custom-classification/create-new-classification.png":::

1. On the **Add new classification** page, give your classification a **Name** and a **Description**.

   It's a good practice to use a name-spacing convention, such as *&lt;your company name>.<classification name&gt;*. The Microsoft system classifications are grouped under the reserved MS.Namespace, for example, **MS.GOVERNMENT.US.SOCIAL\_SECURITY\_NUMBER**.

1. When you enter a **Name**, the system enforces that your name starts with a letter followed by a sequence of letters, numbers, period (.) or underscore (_) characters. No spaces are allowed.

   As you type, the UX automatically generates and displays the friendly name. This friendly name is what users see when you apply it to an asset in the catalog.

   To keep the friendly name short, the system creates it based on the following logic:

   - All but the last two segments of the namespace are trimmed.

   - The casing is adjusted so that the first letter of each word is capitalized.

   - All underscores (\_) are replaced with spaces.

   For example, if you named your classification **CONTOSO.HR.EMPLOYEE_ID**, the friendly name is stored in the system as **Hr.Employee ID**.

   :::image type="content" source="media/create-a-custom-classification/classification-friendly-name.png" alt-text="Screenshot showing a friendly name generated for a new classification name.":::

1. Select **OK**.

   Your new classification is added to your classification list.

1. To find your new custom classification, select the **Custom** tab on the **Classifications** page.

   :::image type="content" source="media/create-a-custom-classification/new-classification-in-list.png" alt-text="Screenshot showing a new custom classification in a classification list." lightbox="media/create-a-custom-classification/new-classification-in-list.png":::

1. Select the new classification in the custom classifications list.

   The classification details page opens. Here, you find all the details about the classification. These details include the instances count, formal name, associated custom classification rules (if any), and the names of the owners.

   :::image type="content" source="media/create-a-custom-classification/classification-details-page.png" alt-text="Screenshot showing the custom classifications details page." lightbox="media/create-a-custom-classification/classification-details-page.png":::
