---
title: Create a custom classification and classification rule (preview)
description: Learn how to create custom classifications to define data types in your data estate that are unique to your organization in Azure Purview.
author: animukherjee
ms.author: anmuk
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 2/5/2021
---
# Custom classifications in Azure Purview

This article describes how you can create custom classifications to define data types in your data estate that are unique to your organization. It also describes the creation of custom classification rules that let you find specified data throughout your data estate.

## Default classifications

The Azure Purview Data Catalog provides a large set of default classifications that represent typical personal data types that you might have in your data estate.

:::image type="content" source="media/create-a-custom-classification-and-classification-rule/classification.png" alt-text="select classification" border="true":::

You also have the ability to create custom classifications, if any of the default classifications don't meet your needs.

## Steps to create a custom classification

To create a custom classification, do the following:

1. From your catalog, select **Management Center** from the left menu.

2. Select **Classifications** under **Metadata management**.

3. Select **+ New**

   :::image type="content" source="media/create-a-custom-classification-and-classification-rule/new-classification.png" alt-text="New classification" border="true":::

The **Add new classification** pane opens, where you can give your
classification a name and a description. It's good practice to use a name-spacing convention, such as `your company name.classification name`.

The Microsoft system classifications are grouped under the reserved `MICROSOFT.` namespace. An example is **MICROSOFT.GOVERNMENT.US.SOCIAL\_SECURITY\_NUMBER**.

The name of your classification must start with a letter followed by a sequence of letters, numbers, and period (.) or underscore characters. No spaces are allowed. As you type, the UX automatically generates a friendly name. This friendly name is what users see when you apply it to an asset in the catalog.

To keep the name short, the system creates the friendly name based on
the following logic:

- All but the last two segments of the namespace are trimmed.

- The casing is adjusted so that the first letter of each word is
    capitalized. All other letters are converted to lowercase.

- All underscores (\_) are replaced with spaces.

As an example, if you named your
classification **CONTOSO.HR.EMPLOYEE\_ID**, the friendly name is stored
in the system as **Hr.Employee ID**.

:::image type="content" source="media/create-a-custom-classification-and-classification-rule/contoso-hr-employee-id.png" alt-text="Contoso.hr.employee_id" border="true":::

Select **OK**, and your new classification is added to your
classification list.

:::image type="content" source="media/create-a-custom-classification-and-classification-rule/custom-classification.png" alt-text="Custom classification" border="true":::

Selecting the classification in the list opens the classification
details page. Here, you find all the details about the classification.

These details include the count of how many instances there are, the formal name, associated classification rules (if any), and the owner name.

:::image type="content" source="media/create-a-custom-classification-and-classification-rule/select-classification.png" alt-text="Select classification" border="true":::

## Custom classification rules

The catalog service provides a set of default classification rules, which are used by the scanner to automatically detect certain data types. You can also add your own custom classification rules to detect other types of data that you might be interested in finding across your data estate. This capability can be very powerful when you\'re trying to find data within your data estate.

As an example, let\'s say that a company named Contoso has employee IDs that are standardized throughout the company with the word \"Employee\" followed by a GUID to create EMPLOYEE{GUID}. For example, one instance of an employee ID looks like `EMPLOYEE9c55c474-9996-420c-a285-0d0fc23f1f55`.

Contoso can configure the scanning system to find instances of these IDs by creating a custom classification rule. They can supply a regular expression that matches the data pattern, in this
case, `\^Employee\[A-Za-z0-9\]{8}-\[A-Za-z0-9\]{4}-\[A-Za-z0-9\]{4}-\[A-Za-z0-9\]{4}-\[A-Za-z0-9\]{12}\$`. Optionally,
if the data usually is in a column that they know the name of, such as Employee\_ID or EmployeeID, they can add a column pattern regular expression to make the scan even more accurate. An example regex is Employee\_ID\|EmployeeID.

The scanning system can then use this rule to examine the actual data in the column and the column name to try to identify every instance of where the employee ID pattern is found.

## Steps to create a custom classification rule

To create a custom classification rule:

1. Create a custom classification by following the instructions in the previous section. You will add this custom classification in the classification rule configuration so that the system applies it when it finds a match in the column.

2. Select the **Management Center** icon.

3. Select the **Classifications rules** section.

   :::image type="content" source="media/create-a-custom-classification-and-classification-rule/classificationrules.png" alt-text="Classification rules tile" border="true":::

4. Select **New**.

   :::image type="content" source="media/create-a-custom-classification-and-classification-rule/newclassificationrule.png" alt-text="Add new classification rule" border="true":::

5. The **New classification rule** dialog box opens. Fill in the fields and decide whether to create a **regular expression rule** or a **dictionary rule**.

   |Field     |Description  |
   |---------|---------|
   |Name   |    Required. The maximum is 100 characters.    |
   |Description      |Optional. The maximum is 256 characters.    |
   |Classification Name    | Required. Select the name of the classification from the drop-down list to tell the scanner to apply it if a match is found.        |
   |State   |  Required. The options are enabled or disabled. Enabled is the default.    |

   :::image type="content" source="media/create-a-custom-classification-and-classification-rule/create-new-classification-rule.png" alt-text="Create new classification rule" border="true":::

### Creating a Regular Expression Rule

1. If creating a regular expression rule, you will see the following screen. You may optionally upload a file that will be used to **generate suggested regex patterns** for your rule.

   :::image type="content" source="media/create-a-custom-classification-and-classification-rule/create-new-regex-rule.png" alt-text="Create new regex rule" border="true":::

1. If you decide to generate a suggested regex pattern, after uploading a file, select one of the suggested patterns and click **Add to Patterns** to use the suggested data and column patterns. You can tweak the suggested patterns or you may also type your own patterns without uploading a file.

   :::image type="content" source="media/create-a-custom-classification-and-classification-rule/suggested-regex.png" alt-text="Generate suggested regex" border="true":::

   |Field     |Description  |
   |---------|---------|
   |Data Pattern    |Optional. A regular expression that represents the data that's stored in the data field. The limit is very large. In the previous example, the data patterns test for an employee ID that's literally the word `Employee{GUID}`.  |
   |Column Pattern    |Optional. A regular expression that represents the column names that you want to match. The limit is very large. |

1. Under **Data Pattern**, there are two thresholds you can set:

   - **Distinct match threshold**: The total number of distinct data values that need to be found in a column before the scanner runs the data pattern on it. The suggested value is 8. This value can be manually adjusted in a range from 2 to 32. The system requires this value to make sure that the column contains enough data for the scanner to accurately classify it. For example, a column that contains multiple rows that all contain the value 1 won't be classified. Columns that contain one row with a value and the rest of the rows have null values also won't get classified. If you specify multiple patterns, this value applies to each of them.

   - **Minimum match threshold**: You can use this setting to set the minimum percentage of the distinct data value matches in a column that must be found by the scanner for the classification to be applied. The suggested value is 60%. You need to be careful with this setting. If you reduce the level below 60%, you might introduce false-positive classifications into your catalog. If you specify multiple data patterns, this setting is disabled and the value is fixed at 60%.

1. You can now verify your rule and **create** it.

   :::image type="content" source="media/create-a-custom-classification-and-classification-rule/verify-rule.png" alt-text="Verify rule before creating" border="true":::

### Creating a Dictionary Rule

1. If creating a dictionary rule, you will see the following screen. Upload a file that contains all possible values for the classification you're creating in a single column.

   :::image type="content" source="media/create-a-custom-classification-and-classification-rule/dictionary-rule.png" alt-text="Create dictionary rule" border="true":::

1. After the dictionary is generated, you can adjust the distinct match and minimum match thresholds and submit the rule.

   :::image type="content" source="media/create-a-custom-classification-and-classification-rule/dictionary-generated.png" alt-text="Purview dictionary rule - adjust distinct match threshold and minimum match threshold" border="true":::

   :::image type="content" source="media/create-a-custom-classification-and-classification-rule/dictionary-generated.png" alt-text="Create dictionary rule, with Dictionary Generated checkmark." border="true":::

## Next steps

Now that you've created your classification rule, it's ready to be added to a scan rule set so that your scan uses the rule when scanning. For more information, see [Create a scan rule set](create-a-scan-rule-set.md).
