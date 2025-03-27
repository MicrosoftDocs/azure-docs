---
title: Add arithmetic and logical operators to rules
description: Learn how to add arithmetic and logical operators to the rules in your ruleset using the Microsoft Rules Composer.
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/27/2025

#CustomerIntent: As a developer, I want to understand how use arithmetic and logic operators in the rules that I create for my Azure Logic Apps Rules Engine project.
---

# Add arithmetic and logical operators to rules using Microsoft Rules Composer (Preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This guide describes how to add arithmetic and logical operators to the rules in your ruleset using the Microsoft Rules Composer.

## Prerequisites

- Download and install the [Microsoft Rules Composer](https://go.microsoft.com/fwlink/?linkid=2274238).

- The XML file that contains the ruleset that you want to work on.

<a name="add-arithmetic-operator"></a>

## Add an arithmetic operator to a rule

You can add an arithmetic operator to a condition or action in a rule. The following table describes the available arithmetic operators:

| Arithmetic operator | Description |
|---------------------|-------------|
| **Add** | The addition operator that adds *arg1* to *arg2*. |
| **Subtract** | The subtraction operator that subtracts *arg1* from *arg2*. |
| **Multiply** | The multiplication operator that multiplies *arg1* by *arg2*. |
| **Divide** | The division operator that divides *arg1* by *arg2*. |
| **Remainder** | The remainder operator that performs *arg1* modulo *arg2*. |

1. In the **Microsoft Rules Composer**, load the XML file that contains the rule store you want to work on.

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **Facts Explorer** window, select the **Vocabularies** tab.

1. Under **Vocabularies** > **Functions** > **Version 1.0**, drag the arithmetic operator that you want to an argument in a condition in the conditions editor or an action in the actions editor.

1. In the condition or action arguments, specify the values for left and right operands.

   - If the operands have different types, the rules engine performs automatic numeric promotion where the engine converts the smaller operand type to the larger operand type.

     For example, suppose you use the **Add** operator on an operand that has **int** type and an operand that has **long** type. Before the engine performs the **Add** operation, the engine converts the **int** type to the **long** type.

   - If the engine can promote both operands to a common type, the engine supports double promotion.

     For example, suppose you use the **Add** operator on an operand that has **int** type and an operand that has **uint** type. Before the engine performs the **Add** operation, the engine converts both operand types to the **long** type.

<a name="add-logical-operator"></a>

## Add a logical operator to a rule

You can add a logical operator to a predicate in a condition. The following table describes the available logical operators:

| Logical operator | Description|
|------------------|------------|
| **AND** | Combine two or more predicates to form a logical **AND** expression. Returns **true** if both predicates evaluate to **true**. Otherwise, returns **false**. |
| **OR** | Combine two or more predicates to form a logical **OR** expression. Returns **true** if one predicate evaluates to **true**. Otherwise, returns **false**. |
| **NOT** | Negate a logical expression or predicate. Returns **true** if the predicate evaluates to **false**. Otherwise, returns **false**. |

1. In the **Microsoft Rules Composer**, load the XML file that contains the rule store you want to work on.

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **IF** pane, which is the conditions editor, from the **Conditions** shortcut menu, select one of the following commands:

   | Logical operator | Description |
   |------------------|-------------|
   | **Add logical AND** | Combine two or more predicates to form a logical **AND** expression. |
   | **Add logical OR** | Combine two or more predicates to form a logical **OR** expression. |
   | **Add logical NOT** | Negate a logical expression or predicate. |

1. In the conditions editor, open the operator's shortcut menu, and add the predicates or nested logical operators that you want.

   If the operands have different types, the rules engine converts the type for one operand to match the type for the other operand, or converts the types for both operands to a common type before evaluating the expression.

## Handle null values

The following section describes the expected behaviors for null values associated with different types and provides options for checking null or the existence of a specific field or member.

### .NET classes

- For types derived from the **Object** type, you can set their fields to null.

- You can pass null as an argument for parameters that aren't value types, but you might get a runtime error, based on the member's implementation.

- You can't use null for comparison if the return type isn't an **Object** type.

### XML elements

- An XML document never returns an XML value as null. Instead, this value is either an empty string or a "doesn't exist" error. For an empty string, an error might occur for the conversion of certain types, such as fields specified as an integer type when you build a rule.

- The Microsoft Rules Composer doesn't allow you to set a field to null or to set a field type to **Object**.

- Through the object model, you can set the type to **Object**. In this case, the returned value has the type to which the XPath evaluates, such as **Float**, **Boolean**, or **String**, based on the XPath expression.

### Check for null or existence

When you write rules, you naturally want to check that a field exists before you compare its value. However, if the field is null or doesn't exist, comparing the value causes an error.

For example, suppose you have the following rule:

`IF Product/Quantity Exists AND Product/Quantity > 1`

If **Product/Quantity** doesn't exist, the rule throws an error. To work around this problem, you can pass a parent node to a helper method that returns the **Product/Quantity** value if that element exists, or return something else if that element doesn't exist.

The following example shows the updated and new helper method rule:

**Rule 1**

`IF Exists(Product/Quantity) THEN Assert(CreateObject(typeof(Helper), Product/Quantity))`

**Rule 2**

`IF Helper.Value == X THEN...`

As another possible solution, you can create a rule such as the following example:

`IF Product/Quantity Exists THEN CheckQuantityAndDoSomething(Product/Quantity)`

In the preceding example, the `<CheckQuantityAndDoSomething>` function checks the parameter value and executes if the condition is met.

> [!NOTE]
>
> Alternatively, you can modify the **XPath Field** property for the 
> XML fact to catch any errors, but this approach isn't recommended.

## Related content

- [Create rules with the Microsoft Rules Composer](create-rules.md)
- [Add control functions to actions for optimizing rules execution](add-rules-control-functions.md)
- [Test your rulesets](test-rulesets.md)
- [Create an Azure Logic Apps Rules Engine project](create-rules-engine-project.md)
