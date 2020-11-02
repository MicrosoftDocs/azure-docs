---
title: Create a Custom Classification and classification rule
description: This article describes how you can create custom classifications to define data types in your data estate that are unique to your organization as well as create custom classification rules in Babylon that let you find specified data throughout your data estate.
author: chandrakavya
ms.author: kchandra
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: overview
ms.date: 11/1/2020
---

# Custom classification

By default, the catalog provides a large set of default classifications
that represent typical personal data types that you might have in your
data estate.

 ![Classification](media/create-a-custom-classification-and-classification-rule/image1.png)

## Steps to create a custom classification

To create a custom classification:

1. From your catalog, select the **Management Center** icon.

 ![Management center](media/create-a-custom-classification-and-classification-rule/image2.png)

2. Select **Classifications** under Metadata management from the left navigation

 ![Select classifications](media/create-a-custom-classification-and-classifictaion-rule/image3.png)

3. Select **New**

 ![New classification](media/create-a-custom-classification-and-classification-rule/image4.png)

The **Add new classification** pane opens, where you can give your
classification a name and a description. It\'s good practice to use a
name-spacing convention, such as your company name.classification name.
The Microsoft system classifications are grouped under the reserved
MS.Namespace. An example
is **MS.GOVERNMENT.US.SOCIAL\_SECURITY\_NUMBER**.

The system enforces that your name starts with a letter followed by a
sequence of letters, numbers, and period (.) or underscore characters.
No spaces are allowed. As you type, the UX automatically generates a
friendly name. This friendly name is what users see when you apply it to
an asset in the catalog.

To keep the name short, the system creates the friendly name based on
the following logic:

- All but the last two segments of the namespace are trimmed.

- The casing is adjusted so that the first letter of each word is
    capitalized. All other letters are converted to lowercase.

- All underscores (\_) are replaced with spaces.

As an example, if you named your
classification **CONTOSO.HR.EMPLOYEE\_ID**, the friendly name is stored
in the system as **Hr.Employee ID**.

 ![Contoso.hr.employee_id](media/create-a-custom-classification-and-classification-rule/image5.png)

Select **OK**, and your new classification is added to your
classification list.

 ![Custom classification](media/create-a-custom-classification-and-classification-rule/image6.png)

Selecting the classification in the list opens the classification
details page. Here, you find all the details about the classification.
These details include the count of how many instances there are, the
formal name, associated classification rules (if any), and the owner
name.

 ![Select classification](media/create-a-custom-classification-and-classification-rule/image7.png)

# Custom classification rules

The catalog service provides a set of default classification rules,
which are used by the scanner to automatically detect certain data
types. You can also add your own custom classification rules to detect
other types of data that you might be interested in finding across your
data estate. This capability can be very powerful when you\'re trying to
find data within your data estate.

As an example, let\'s say that a company named Contoso has employee IDs
that are standardized throughout the company with the word \"Employee\"
followed by a GUID to create EMPLOYEE{GUID}. For example, one instance
of an employee ID looks
like EMPLOYEE9c55c474-9996-420c-a285-0d0fc23f1f55.

Contoso can configure the scanning system to find instances of these IDs
by creating a custom classification rule. They can supply a regular
expression that matches the data pattern, in this
case, \^Employee\[A-Za-z0-9\]{8}-\[A-Za-z0-9\]{4}-\[A-Za-z0-9\]{4}-\[A-Za-z0-9\]{4}-\[A-Za-z0-9\]{12}\$. Optionally,
if the data usually is in a column that they know the name of, such as
Employee\_ID or EmployeeID, they can add a column pattern regular
expression to make the scan even more accurate. An example regex
is Employee\_ID\|EmployeeID.

The scanning system can then use this rule to examine the actual data in
the column and the column name to try to identify every instance of
where the employee ID pattern is found.

## Steps to create a custom classification rule

To create a custom classification rule:

1. Create a custom classification by following the instructions
    in above section. You will add this custom classification in the
    classification rule configuration so that the system applies it when
    it finds a match in the column.

2. Select the **Management Center** icon.

3. Select the **Classifications rules** section.

 ![Classification rules tile](media/create-a-custom-classification-and-classification-rule/classificationrules.png)

4. Select **New**.

 ![Add new classification
rule](media/create-a-custom-classification-and-classification-rule/newclassificationrule.png)

The **New classification rule** dialog box opens. Fill in the
configuration information for your new rule.

 ![Create new classification rule](media/create-a-custom-classification-and-classification-rule/createclassificationrule.png)

|Field     |Description  |
|---------|---------|
|Name   |    Required. The maximum is 100 characters.    |
|Description      |Optional. The maximum is 256 characters.    |
|Classification Name    | Required. Select the name of the classification from the drop-down list to tell the scanner to apply it if a match is found.        |
|State   |  Required. The options are enabled or disabled. Enabled is the default.    |
|Data Pattern    |Optional. A regular expression that represents the data that's stored in the data field. The limit is very large. In the previous example, the data patterns test for an employee ID that's literally the word `Employee{GUID}`.  |
|Column Pattern    |Optional. A regular expression that represents the column names that you want to match. The limit is very large.          |

Under **Data Pattern**, there are two options:

- **Distinct match threshold**: The total number of distinct data values that need to be found in a column before the scanner runs the data pattern on it. The suggested value is 8. This value can be manually adjusted in a range from 2 to 32. The system requires this value to make sure that the column contains enough data for the scanner to accurately classify it. For example, a column that contains multiple rows that all contain the value 1 won't be classified. Columns that contain one row with a value and the rest of the rows have null values also won't get classified. If you specify multiple patterns, this value applies to each of them.

- **Minimum match threshold**: You can use this setting to set the minimum percentage of data value matches in a column that must be found by the scanner for the classification to be applied. The suggested value is 60%. You need to be careful with this setting. If you reduce the level below 60%, you might introduce false-positive classifications into your catalog. If you specify multiple data patterns, this setting is disabled and the value is fixed at 60%.

## Next steps

Now that you've created your classification rule, it's ready to be added to a scan rule set so that your scan uses the rule when scanning. For more information, see [Create a scan rule set](create-a-scan-rule-set.md).
