---
title: Create and manage vocabularies for rulesets
description: Learn how to build and manage vocabularies for use with rulesets using the Microsoft Rules Composer.
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/27/2025

#CustomerIntent: As a developer, I want to build vocabularies so I can use them with rulesets for my Azure Logic Apps Rules Engine project.
---

# Create and manage vocabularies to use with rulesets using the Microsoft Rules Composer (Preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

A *vocabulary* is a collection of *vocabulary definitions* that use friendly names for the facts used in rule conditions and actions. Vocabulary definitions make rules in your ruleset easier to read, understand, and shareable by multiple people in a specific business domain. For example, tool developers responsible for integrating rule authoring into new or existing applications can consume vocabularies. Vocabularies bridge the gap between business semantics and implementation.

This guide shows how to create and define vocabularies that are placed in the shared rule store by using the Microsoft Rules Composer. You can select the data sources to use, create a new vocabulary, and add vocabulary definitions. You can save a version of your vocabulary to the rule store.

## Prerequisites

- Download and install the [Microsoft Rules Composer](https://go.microsoft.com/fwlink/?linkid=2274238).

- The XML file that contains the rule store where you want to add a vocabulary.

## How does a vocabulary make rules easier to read and understand?

The terms that you use to define rule conditions and actions are often expressed using domain or industry-specific nomenclature. For example, an e-mail user writes rules using terms such as "messages received from" and "messages received after". An insurance business analyst writes rules using terms such as "risk factors" and "coverage amount".

As another example, a variable for an approval status might point at a certain value in an XML schema. Rather than insert this complex representation in a rule, you might instead create a vocabulary definition that is associated with that variable value, and use "Status" as the friendly name. You can then use "Status" in any number of rules. Technology artifacts, such as XML objects and XML documents, that implement the rule conditions and rule actions lie under this domain-specific terminology. However, the rules engine can retrieve the corresponding data from the table that stores that data.

Rule conditions and actions are based on data sources that might have detailed, difficult-to-read binding information, which tells the user little or nothing about what the bindings reference. The rules engine empowers you to create vocabularies that simplify the rules development by offering intuitive, domain-specific terminology that you can associate with rule conditions and actions.

## Create a vocabulary

1. Open the **Microsoft Rules Composer**. From the **Rule Store** menu, select **Load**.

1. Find and select the XML file that contains the rule store that you want to work on.

1. In the **Facts Explorer** window, select the **Vocabularies** tab.

1. On the **Vocabularies** tab, find the **Vocabularies** folder.

1. Open the folder's shortcut menu, and select **Add New Vocabulary**.

   The Microsoft Rules Composer creates a new empty vocabulary with a vocabulary version numbered **1.0** as the default version.

   Before you can use a vocabulary, the vocabulary needs to have a version stamp. This requirement guarantees that the vocabulary definitions won't change and preserves referential integrity, which means that any rulesets that use that particular version doesn't unexpectedly fail due to changes in the underlying vocabulary.

The following table describes other shortcut commands you can use to work with vocabularies:

| Shortcut command | Task |
|------------------|------|
| **Add New Version** | Create a new empty vocabulary version from the selected vocabulary. You can copy vocabulary definitions from other vocabulary versions and paste them into the new version. |
| **Paste Vocabulary Version** | In the selected vocabulary, paste the previously copied vocabulary definitions from another vocabulary version as a new version. |
| **Delete** | Delete the selected vocabulary and all its versions. |

The following table describes other shortcut commands you can use to work with vocabulary versions:

| Shortcut command | Task |
|------------------|------|
| **Add New Definition** | Launch the Vocabulary Definition Wizard to create a new definition in the selected vocabulary version. |
| **Save** | Save the changes made to the selected vocabulary version and its definitions. |
| **Reload** | Reload the selected vocabulary version and its definitions, including the option to discard any current changes made in that version and restore the contents from the rule store. |

The following table describes other shortcut commands you can use to work with vocabulary versions:

| Shortcut command | Task |
|------------------|------|
| **Modify** | Launch the Vocabulary Definition Wizard to change the selected definition. |
| **Go to source fact** | For the selected vocabulary definition, go to the corresponding source fact in a .NET assembly or XML schema. |

| Shortcut command | Task |
|------------------|------|
| **Select Root Node** | From an XML schema that contains multiple root nodes, select a root node to load. |

The following sections provide more information about these tasks.

## Copy a vocabulary version

When you want to make changes in a vocabulary, create a new vocabulary version to reflect the changes. You can create a copy from an existing vocabulary version but with a different version number.

1. In the **Facts Explorer** window, open the vocabulary version's shortcut menu, and select **Copy**.

1. Open the vocabulary's shortcut menu, and select **Paste RuleSet Version**.

   The Microsoft Rules Composer creates a new vocabulary version with the same definitions as the copied version but with a different number.

> [!IMPORTANT]
>
> When you create a new vocabulary version, the rules built using a previous vocabulary version still reference 
> the previous version. Make sure that you update the references between those rules and the new vocabulary version. 

## Create an empty vocabulary version

After you add definitions to a vocabulary version, you can create a new empty vocabulary version with a different number, and save that version for you to work on later.

1. In the **Facts Explorer** window, select the **Vocabularies** tab.

1. On the **Vocabularies** tab, find the vocabulary from which to create a new version.

1. Open the vocabulary's shortcut menu, and select **Add New Version**.

   The Microsoft Rules Composer creates a new empty vocabulary version with a different number.

1. Open the new vocabulary version's shortcut menu, and select **Save**.

You can now copy vocabulary definitions from other vocabulary versions, and paste them into the new version.

## Rename a vocabulary

Before you can rename a vocabulary or a ruleset, you must save everything, which means all versions of the vocabulary definitions.

1. In the **Facts Explorer** window, select the **Vocabularies** tab.

1. On the **Vocabularies** tab, in the **Vocabularies** folder, find the vocabulary that you want to rename.

1. Select the vocabulary, and in the **Properties** window, edit the name.

## Create a vocabulary definition

You can create a *vocabulary definition* as a constant value, a range of values, a set of values, or elements from a .NET assembly or an XML document. To create a vocabulary definition, you can use the Vocabulary Definition Wizard. 

Alternatively, you can create a new vocabulary definition by selecting a fact from either the **.NET Classes** tab or **XML Schemas** tab, such as or a member of a .NET class—dragging the fact over to the **Vocabularies** tab.

—for example, an XML node, 

If you select a public variable, **Get** and **Set** options are still available, just like in the XML definition wizard.

## Add a constant value as a vocabulary definition

1. On the **Vocabularies** tab, in the **Vocabularies** folder.

1. In the **Vocabularies** folder, open the shortcut menu for the vocabulary version that you want.

1. From the vocabulary version's shortcut menu, select **Add New Definition**.

   You can also drag items from the **.NET Classes** tab and **XML Schemas** tab.

   The Vocabulary Definition Wizard launches to help you create the definition.

1. In the wizard, select **Constant Value, Range of Values, or Set of Values**, and then select **Next**.

1. Provide the following information:

   | Property | Description |
   |----------|-------------|
   | **Definition name** | The definition's name. |
   | **Description** | The definition's description. |
   | **Definition type** | For this task, select **Constant Value**. |

1. When you're ready, select **Next**.

1. Provide the following information:

   | Property | Description |
   |----------|-------------|
   | **Definition type** | Select a system data type for the definition. |
   | **Display name** | Enter a name that doesn't exceed 512 characters. |
   | **Value** | Enter a value for the constant. |

1. When you're done, select **Finish**.

### Add a value range as a vocabulary definition

1. On the **Vocabularies** tab, in the **Vocabularies** folder.

1. In the **Vocabularies** folder, open the shortcut menu for the vocabulary version that you want.

1. From the vocabulary version's shortcut menu, select **Add New Definition**.

   You can also drag items from the **.NET Classes** tab and **XML Schemas** tab.

   The Vocabulary Definition Wizard launches to help you create the definition.

1. In the wizard, select **Constant Value, Range of Values, or Set of Values**, and then select **Next**.

1. Provide the following information:

   | Property | Description |
   |----------|-------------|
   | **Definition name** | The definition's name. |
   | **Description** | The definition's description. |
   | **Definition type** | For this task, select **Range of Values**. |

1. When you're ready, select **Next**.

1. From the **Definition type** list, select a system data type for the definition.

1. Under **Step 1 - Specify the display name/value for Range Low and Range High**, in the table, select **Range Low**, and then select **Edit**. 

   In the **Parameter Definition** box that opens, only the **Use Constant Value** option is available.

1. Enter a constant value to specify the lower range, and select **OK**.

1. Repeat the preceding steps for **Range High**, which must exceed the **Range Low** value.

1. Under **Step 2 - Specify the display format string for the range**, in the **Display format string** property, enter the display format string. To revert to the default display format string, select **Default**.

   > [!NOTE]
   >
   > Make sure that your format string includes parameter indexes using curly braces, for example, 
   > use `{0}` and `{1}` to serve as placeholders for the high and low range parameters.

   The following example shows a sample vocabulary definition for a range of values:

   :::image type="content" source="media/create-manage-vocabularies/vocabulary-range.png" alt-text="Screenshot shows Vocabulary Definition Wizard, a vocabulary definition with a range of values definition and display format string." lightbox="media/create-manage-vocabularies/vocabulary-range.png":::

1. When you're ready, select **Finish**.

### Add a set of values as a vocabulary definition

1. On the **Vocabularies** tab, in the **Vocabularies** folder.

1. In the **Vocabularies** folder, open the shortcut menu for the vocabulary version that you want.

1. From the vocabulary version's shortcut menu, select **Add New Definition**.

   You can also drag items from the **.NET Classes** tab and **XML Schemas** tab.

   The Vocabulary Definition Wizard launches to help you create the definition.

1. In the wizard, select **Constant Value, Range of Values, or Set of Values**, and then select **Next**.

1. Provide the following information:

   | Property | Description |
   |----------|-------------|
   | **Definition name** | The definition's name. |
   | **Description** | The definition's description. |
   | **Definition type** | For this task, select **Set of Values**. |

1. When you're ready, select **Next**.

1. Provide the following information:

   | Property | Description |
   |----------|-------------|
   | **Definition type** | Select a system data type for the definition. |
   | **Display name** | Enter a name that doesn't exceed 512 characters. |

   Under **Define values**, only the **Use Constant Value** option is available.

1. To add a member to the set, enter a constant value, and select **Add**.

1. Repeat the previous step for as many values as you want to include in your set.

   The following example shows multiple values in the set:

   :::image type="content" source="media/create-manage-vocabularies/vocabulary-set-values.png" alt-text="Screenshot shows Vocabulary Definition Wizard, a vocabulary definition with formatted strings as a set of values." lightbox="media/create-manage-vocabularies/vocabulary-set-values.png":::

1. To move a value within the relative order of the set, in the **Values** box, select the value, and then select **Up** or **Down**.

1. To remove a member from the set, in the **Values** box, select the value, and select **Remove**.

1. When you complete your set, select **Finish**.

### Add a .NET class or class member as a vocabulary definition

Before you start, make sure to put your .NET assemblies in a directory local to the Microsoft Rules Composer. If you update the .NET assembly, make sure to update your ruleset version's references to that assembly. For more information, see [Update .NET assembly references](create-rules.md#update-assembly-references).

1. On the **Vocabularies** tab, in the **Vocabularies** folder.

1. In the **Vocabularies** folder, open the shortcut menu for the vocabulary version that you want.

1. From the vocabulary version's shortcut menu, select **Add New Definition**.

   You can also [drag a .NET class or class member from the **.NET Classes** tab](#create-vocabulary-definition-from-assembly).

   The Vocabulary Definition Wizard launches to help you create the definition.

1. In the wizard, select **.NET Class or Class Member**, and then select **Next**.

1. Provide the following information:

   | Property | Description |
   |----------|-------------|
   | **Definition name** | The definition's name. |
   | **Description** | The definition's description. |

1. In the **Class member information** section, select **Browse**.

1. Find and select the assembly that you want, and then select **Open**.

1. In the **Select Binding** box, expand the assembly node.

1. Select a class, or expand a class and select a class member, and then select **OK**.

1. Choose one of the following steps:

   - If you select a class, for **Display name**, enter a name that doesn't exceed 512 characters, and select **Finish**.

     You're now done with this section.

   - If you select a class member that has parameters, select **Next**.

     The **Specify the Display Name - .NET Class or Class Member Definition** page appears for you to provide a value and display format string for each parameter.

     1. Under **Step 1 - Specify the display name/value for each parameter**, in the **Parameters** box, select a parameter, and then select **Edit**.

     1. For **Parameter value**, only the **Use Constant Value** option is available, so enter a constant value.

     1. Under **Step 2 - Specify the display format string**, in the **Display format string** property, enter the display format string. To revert to the default display format string, select **Default**.

        > [!NOTE]
        >
        > Make sure that your format string includes parameter indexes using curly braces, for example, 
        > use `{0}` and `{1}` to serve as placeholders for the parameters.

     1. Repeat the previous steps for each parameter in your class member.

        The following example shows multiple parameters in the class member:

        :::image type="content" source="media/create-manage-vocabularies/vocabulary-net-class.png" alt-text="Screenshot shows Vocabulary Definition Wizard for vocabulary definition with a .NET class or class member." lightbox="media/create-manage-vocabularies/vocabulary-net-class.png":::

<a name="create-vocabulary-definition-from-assembly"></a>

### Create a vocabulary definition from a .NET assembly

You can create vocabulary definitions from classes or class members in a .NET assembly to define predicates, arguments, and actions. Before you start, make sure to put your .NET assemblies in a directory local to the Microsoft Rules Composer. If you update the .NET assembly, make sure to update your ruleset version's references to that assembly. For more information, see [Update .NET assembly references](create-rules.md#update-assembly-references).

1. In the **Facts Explorer** window, select the **.NET Classes** tab.

1. From under **.NET Assemblies**, drag a class or class member onto an existing vocabulary definition, which appears on the **Vocabularies** tab.

<a name="create-vocabulary-definition-from-xml"></a>

### Create a vocabulary definition from an XML document element or attribute

You can create vocabulary definitions from XML elements and attributes by browsing through XSD schemas and dragging items to the conditions editor or actions editor to define predicates, arguments, and actions.

1. On the **Vocabularies** tab, in the **Vocabularies** folder.

1. In the **Vocabularies** folder, open the shortcut menu for the vocabulary version that you want.

1. From the vocabulary version's shortcut menu, select **Add New Definition**.

   The Vocabulary Definition Wizard launches to help you create the definition.

1. In the wizard, select **XML Document Element or Attribute**, and then select **Next**.

1. Provide the following information:

   | Property | Description |
   |----------|-------------|
   | **Definition name** | The definition's name. |
   | **Description** | The definition's description. |

1. In the **XML document information** section, select **Browse**.

1. Find and select a schema (.xsd) file, and select a document element or attribute.

1. From the **Type** list, select a type that is compatible with the type for the selected element or attribute from the schema.

   > [!NOTE]
   >
   > The engine doesn't validate defined element's existence and the document type. If you 
   > assert an XML document that doesn't have the element, you get an error at runtime. 
   > If you assert an XML document with an unknown document type, the engine just ignores the document.
   >
   > If the engine can't perform a valid cast between the specified type and the type 
   > for the selected document element or attribute, you get an error at run time.

1. In the **Select operation** section, select the operation type that indicates whether you plan to get the element or attribute's value or set the value.

1. If you chose to set the value, select **Next**, and specify the display format.

   The **Specify the Display Name - XML Document Element or Attribute** page appears for you to provide a value and display format string to use.

   1. Under **Step 1 - Specify the display name/value for each parameter**, in the **Parameters** box, select a parameter, and then select **Edit**.

   1. For **Parameter value**, only the **Use Constant Value** option is available, so enter a constant value.

   1. Under **Step 2 - Specify the display format string**, in the **Display format string** property, enter the display format string. To revert to the default display format string, select **Default**.

      > [!NOTE]
      >
      > Make sure that your format string includes parameter indexes using curly braces, for example, 
      > use `{0}` and `{1}` to serve as placeholders for the parameters.

1. When you're done, select **Finish**.

   The following example shows the details for a vocabulary definition based on an XML document element or attribute:

   :::image type="content" source="media/create-manage-vocabularies/vocabulary-xml.png" alt-text="Screenshot shows the Vocabulary Definition Wizard for vocabulary definition with an XML document element or attribute." lightbox="media/create-manage-vocabularies/vocabulary-xml.png":::

   When you create vocabulary definitions for XML nodes, the XPath expressions for the bindings have similar default values, based on the rules described earlier. However, you can edit these values in the Vocabulary Definition Wizard. Changes to the expressions are put in the vocabulary definition and are reflected in any rule arguments that you build from the vocabulary definitions.

## Related content

- [Create rules with the Microsoft Rules Composer](create-rules.md)
- [Test your rulesets](test-rulesets.md)
- [Create an Azure Logic Apps Rules Engine project](create-rules-engine-project.md)
