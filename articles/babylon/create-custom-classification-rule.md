---
title: Create a custom classification rule
description: This article explains the steps to create a custom classification rule in an Azure Babylon catalog.
author: viseshag
ms.author: viseshag
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 10/09/2020
---

# Create a custom classification rule

This article describes how you can create custom classification rules in Azure Babylon, which let you find specified data throughout your data estate.

## Custom classification rules

Azure Babylon provides a set of default classification rules, which are used by the scanner to automatically detect certain data types. You can also add your own custom classification rules to detect other types of data that you might be interested in finding across your data estate. This capability is powerful when you're trying to find data within your data estate.

As an example, suppose your company, Contoso, has employee IDs that are standardized throughout the company with the word *Employee* followed by a GUID to create `EMPLOYEE{GUID}`. For this example, an instance of an employee ID looks like `EMPLOYEE9c55c474-9996-420c-a285-0d0fc23f1f55`.

Your company can configure the scanning system to find instances of these IDs by creating a custom classification rule. For example, by supplying a regular expression that matches the data pattern, in this case: `^Employee[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$.`. Optionally, if the data is typically in a column that you know the name of, such as **Employee_ID** or **EmployeeID**, you can add a column-pattern regular expression to make the scan more accurate. For example, `Employee_ID|EmployeeID`. The scanning system uses this rule to examine the data in the column and the column name to identify every instance where the employee ID pattern is found.

## Steps to create a custom classification rule

To create a custom classification rule:

1. Create a custom classification by following the instructions in [Create a custom classification](create-a-custom-classification.md). Add this custom classification in the classification rule configuration so that the system applies it when it finds a match in the column.

1. From the left pane of your Azure Babylon catalog, select **Management Center**.

1. In the **Metadata management** section, select **Classifications rules**, and then select **New**.

   :::image type="content" source="media/create-custom-classification-rule/select-new-classification-rule.png" alt-text="Screenshot showing how to select the New classification rule page." lightbox="media/create-custom-classification-rule/select-new-classification-rule.png":::

1. The **New classification rule** dialog box opens. Fill in the configuration information for your new rule.

   :::image type="content" source="media/create-custom-classification-rule/create-classification-rule.png" alt-text="Screesnshot showing how to enter data to create a new classification rule":::

   |Field     |Description  |
   |---------|---------|
   | **Name** | Required. The maximum is 100 characters. |
   | **Description** | Optional. The maximum is 256 characters. |
   | **Classification Name** | Required. From the drop-down list, select the name of the classification for the scanner to apply if a match is found.        |
   | **State** |  Required. The options are **Enabled** or **Disabled**. The default is **Enabled**.    |
   | **Data Pattern** | Optional. A regular expression that represents the data that's stored in the data field. In the previous example, the data patterns test for an employee ID that's equal to `Employee{GUID}`.  |
   | **Column Pattern** | Optional. A regular expression that represents the column names that you want to match.          |

   Under **Data Pattern**, there are two options:

   - **Distinct match threshold**: The total number of distinct data values that need to be found in a column before the scanner runs the data pattern on it. The system requires this value to make sure that the column contains enough data for the scanner to accurately classify it. If you specify multiple patterns, this value applies to each of them. The default value is 8, and the allowable range is from 2 to 32.

      For example, a column that contains multiple rows that all contain the value 1 won't be classified. Columns that contain a single row with a value and the rest of the rows with null values also won't get classified.

   - **Minimum match threshold**: Use this setting to set the minimum percentage of data value matches in a column that must be found by the scanner for the classification to be applied. The default value is 60%. Be careful with this setting; if you reduce the level below 60%, you might introduce false-positive classifications into your catalog. If you specify multiple data patterns, this setting is disabled and the value is fixed at 60%.

## Next steps

Now that you've created your classification rule, you can add it to a scan rule set so that your scan uses the rule when scanning. For more information, see [Create a scan rule set](create-a-scan-rule-set.md).
