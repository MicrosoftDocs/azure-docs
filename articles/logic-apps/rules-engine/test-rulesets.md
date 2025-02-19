---
title: Test rulesets with Microsoft Rules Composer
description: Learn how to test rulesets by using the Microsoft Rules Composer along with output examples for rules testing.
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/27/2025

#CustomerIntent: As a developer, I want to learn how to test rulesets with the Microsoft Rules Composer.
---

# Test rulesets using the Microsoft Rules Composer (Preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

As you build your ruleset so that you can integrate business logic with your Standard workflows, test your ruleset incrementally or before you use the rules in your application. That way, you can check that the rules work the way that you expect along the way, or you can find and fix problems sooner when your rules are less complex and easier to troubleshoot.

If you wait to test your rules all at the same time or when you're all done, and your rules are long or complex, you might get more errors or problems than you thought, which might take longer to resolve or prove difficult to troubleshoot.

## Prerequisites

- Download and install the [Microsoft Rules Composer](https://go.microsoft.com/fwlink/?linkid=2274238).

- The XML file that contains the ruleset that you want to work on and the facts that you want to test.

  To add facts, specify their values in the XML files that you reference from the **Select Facts** window that opens after you select **Test Ruleset** in the following steps. You might want to build a fact creator to add .NET facts. For more information, see [Build fact creators and retrievers](build-fact-creators-retrievers.md).

## Test a ruleset version

1. Open the Microsoft Rules Composer. In the **RuleSet Explorer** window, select the ruleset version that you want to test, which opens the version information window.

1. From the ruleset version's shortcut menu, select **Test Ruleset**.

   In the **Select Facts** box that appears, the top window shows the fact types referenced by the ruleset rules.

1. To add a fact instance, under **XML Documents** or **.NET Classes**, select a corresponding fact type, and then select **Add Instance**.

   > [!NOTE]
   >
   > If you assert a derived class into a rule, but the rules are directly written 
   > against the base class members, a base class instance is asserted instead, 
   > and the conditions are evaluated against the base class instance.

1. To remove a fact instance, select the corresponding fact type, and then select **Remove Instance**.

1. To add a fact creator that you built, in the **Fact Creators** window, select **Add**.

1. When you're ready, select **Test**.

   The Output window shows the [ruleset test trace output](#ruleset-test-trace-output).

1. Open the shortcut menu for the test output window, and select an option to save, clear, select, or copy the output text so that you can review the results.

   The following table describes the Output window commands that you can use to work with the output text:

   | Task | Shortcut command |
   |------|------------------|
   | Clear all text from the Output window. | **Clear All** |
   | Copy the selected text in the Output window to the clipboard. | **Copy** |
   | Select all the text in the Output window. | **Select All** |
   | Save the text contained in the Output window to a specified file. | **Save to File** |

<a name="ruleset-test-trace-output"></a>

## Ruleset test trace output

This section describes the tracking information and activities included with the trace when you test a ruleset using the Microsoft Rules Composer. Tracking output can include the following statement types:

- Fact activity
- Condition evaluation
- Agenda update
- Rule fired

### Fact activity

This activity indicates changes to the facts in the engine's working memory. The following example shows a sample fact activity entry:

```text
FACT ACTIVITY 3/16/2023 9:50:28 AM
Rule Engine Instance Identifier: 9effe3f9-d3ad-4125-99fa-56bb379188f7
Ruleset Name: LoanProcessing
Operation: Assert
Object Type: MyTest.test
Object Instance Identifier: 872
```

The following table describes the information in this entry:

| Item | Description |
|------|-------------|
| **Rule Engine Instance Identifier** | A unique identifier for the **RuleEngine** instance that provides the execution environment for the rule firing. |
| **Ruleset Name** | The name of the ruleset. |
| **Operation** | The following operation types can occur in a fact activity: <br><br>- **Assert**: A fact is added to working memory. **Note**: If the type for an asserted fact doesn't match any of the types used in the ruleset, the **Assert** function shows the error "**Assert – Fact Unrecognized**". <br><br>- **Update**: A rule updates a fact, which must then be reasserted into the engine for reevaluation, based on the new data and state. <br><br>- **Retract**: A fact is removed from working memory. |
| **Object Type** | The fact type for a particular activity: - **TypedXmlDocument** <br><br>Assertions are shown for both parent and child **TypedXmlDocument** instances. |
| **Object Instance Identifier** | The unique instance ID for the fact reference. |

### Condition evaluation

This activity indicates the result from evaluating individual predicates. The following example shows a sample condition evaluation entry:

```text
CONDITION EVALUATION TEST (MATCH) 1/07/2023 5:33:13 PM
Rule Engine Instance Identifier: f1dd3ff2-b4a8-4fe1-8d46-4d9b3e2502d3
Ruleset Name: LoanProcessing
Test Expression: TypedXmlDocument:Microsoft.Samples.BizTalk.LoansProcessor.Case:Root.EmploymentType/TimeInMonths >= 18
Left Operand Value: 31
Right Operand Value: 18
Test Result: True
```

The following table describes the information in this entry:

| Item | Description |
|------|-------------|
| **Test Expression** | A simple unary or binary expression within a rule. |
| **Left Operand Value** | The value of the term to the left side of an expression. |
| **Right Operand Value** | The value of the term to the right side of an expression. |
| **Test Result** | The result from the evaluation, which is either **True** or **False**. |

### Agenda update

This activity indicates the rules that are added to the rules engine's agenda for subsequent execution. The following example shows a sample agenda update entry:

```text
AGENDA UPDATE 1/07/2023 5:33:13 PM
Rule Engine Instance Identifier: f1dd3ff2-b4a8-4fe1-8d46-4d9b3e2502d3
Ruleset Name: LoanProcessing
Operation: Add
Rule Name: Employment Status Rule
Conflict Resolution Criteria: 0
```

The following table describes the information in this entry:

| Item | Description |
|------|-------------|
| **Operation** | The operation that adds or removes rules from the agenda. |
| **Rule Name** | The name for the rule that is added or removed from the agenda. |
| **Conflict Resolution Criteria** | The priority of a rule, which determines the relative order for when actions execute and where higher-priority actions execute first. |

### Rule fired

This activity indicates the execution of a rule's actions. The following example shows a rule fired entry:

```text
RULE FIRED 1/07/2023 5:33:13 PM
Rule Engine Instance Identifier: f1dd3ff2-b4a8-4fe1-8d46-4d9b3e2502d3
Ruleset Name: LoanProcessing
Rule Name: Residency Status Rule
Conflict Resolution Criteria: 10
```

## Update function

This example shows a sample "InventoryCheck" rule and a "Ship" rule in a sample ruleset named "Order." When the rule is first checked, the condition associated with the "Ship" rule evaluates to **False**. However, when the "InventoryCheck" rule fires, the **InventoryAvailable** field on the **Order** is changed, and the **Update** command is issued to the engine for the "Order object", causing reevaluation for the "Ship" rule. This time, the condition evaluates to **True**, and the "Ship" rule fires.

> [!NOTE]
>
> If your rules are incorrectly written, forward chaining with the **Update** function might cause 
> an infinite loop. In this event, when you test the ruleset in the Microsoft Rules Composer, 
> you get an error message with the text **"The rule engine detected an execution loop."**

**InventoryCheck rule**

```text
IF Inventory.AllocateInventory == True
THEN Order.InventoryAvailable == True
Update(Order)
```

**Ship rule**

```text
IF Order.InventoryAvailable == True
THEN Shipment.ShipOrder
```

**Output**

```text
RULE ENGINE TRACE for RULESET: Order 3/17/2023 10:31:17 AM
FACT ACTIVITY 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Operation: Assert
Object Type: TestClasses.Order
Object Instance Identifier: 448
CONDITION EVALUATION TEST (MATCH) 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Test Expression: TestClasses.Order.inventoryAvailable == True
Left Operand Value: null
Right Operand Value: True
Test Result: False
FACT ACTIVITY 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Operation: Assert
Object Type: TestClasses.Shipment
Object Instance Identifier: 447
FACT ACTIVITY 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Operation: Assert
Object Type: TestClasses.Inventory
Object Instance Identifier: 446
CONDITION EVALUATION TEST (MATCH) 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Test Expression: TestClasses.Inventory.AllocateInventory == True
Left Operand Value: True
Right Operand Value: True
Test Result: True
AGENDA UPDATE 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Operation: Add
Rule Name: InventoryCheck
Conflict Resolution Criteria: 0
RULE FIRED 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Rule Name: InventoryCheck
Conflict Resolution Criteria: 0
FACT ACTIVITY 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Operation: Update
Object Type: TestClasses.Order
Object Instance Identifier: 448
CONDITION EVALUATION TEST (MATCH) 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Test Expression: TestClasses.Order.inventoryAvailable == True
Left Operand Value: True
Right Operand Value: True
Test Result: True
AGENDA UPDATE 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Operation: Add
Rule Name: Ship
Conflict Resolution Criteria: 0
RULE FIRED 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Rule Name: Ship
Conflict Resolution Criteria: 0
FACT ACTIVITY 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Operation: Retract
Object Type: TestClasses.Order
Object Instance Identifier: 448
FACT ACTIVITY 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Operation: Retract
Object Type: TestClasses.Shipment
Object Instance Identifier: 447
FACT ACTIVITY 3/17/2023 10:31:17 AM
Rule Engine Instance Identifier: 533f2fb6-a91f-49c1-8f36-e03a27ca9d72
Ruleset Name: Order
Operation: Retract
Object Type: TestClasses.Inventory
Object Instance Identifier: 446
```

## Ruleset test trace output examples

This section provides examples that show ruleset test output for different types of facts.

### .NET Class fact type

This example is a sample rule named "TestRule1" in a ruleset named "LoanProcessing":

```text
IF test.get_ID > 0
THEN <do something>
```

**Output**

```text
RULE ENGINE TRACE for RULESET: LoanProcessing 3/16/2023 9:50:28 AM
FACT ACTIVITY 3/16/2023 9:50:28 AM
Rule Engine Instance Identifier: 9effe3f9-d3ad-4125-99fa-56bb379188f7
Ruleset Name: LoanProcessing
Operation: Assert
Object Type: MyTest.test
Object Instance Identifier: 872
CONDITION EVALUATION TEST (MATCH) 3/16/2023 9:50:28 AM
Rule Engine Instance Identifier: 9effe3f9-d3ad-4125-99fa-56bb379188f7
Ruleset Name: LoanProcessing
Test Expression: MyTest.test.get_ID > 0
Left Operand Value: 100
Right Operand Value: 0
Test Result: True
AGENDA UPDATE 3/16/2023 9:50:28 AM
Rule Engine Instance Identifier: 9effe3f9-d3ad-4125-99fa-56bb379188f7
Ruleset Name: LoanProcessing
Operation: Add
Rule Name: TestRule1
Conflict Resolution Criteria: 0
RULE FIRED 3/16/2023 9:50:28 AM
Rule Engine Instance Identifier: 9effe3f9-d3ad-4125-99fa-56bb379188f7
Ruleset Name: LoanProcessing
Rule Name: TestRule1
Conflict Resolution Criteria: 0
FACT ACTIVITY 3/16/2023 9:50:28 AM
Rule Engine Instance Identifier: 9effe3f9-d3ad-4125-99fa-56bb379188f7
Ruleset Name: LoanProcessing
Operation: Retract
Object Type: MyTest.test
Object Instance Identifier: 872
```

### TypedXmlDocument fact type

This example shows that a **TypedXmlDocument** entity with the document type named **Microsoft.Samples.BizTalk.LoansProcessor.Case** is asserted into the rules engine. Based on the **XPath Selector** value defined in the rule, the engine creates and asserts a child **TypedXmlDocument** entity with the type named **Microsoft.Samples.BizTalk.LoansProcessor.Case:/Root/EmploymentType**, based on the document type and selector string. This child **TypedXmlDocument** entity evaluates to **True** in the condition, causing an agenda update and rule firing. The parent and child **TypedXmlDocument** entities are then retracted.

This example shows the sample rule named "TestRule1" in a ruleset named "LoanProcessing":

```text
IF Microsoft.Samples.BizTalk.LoansProcessor.Case:/Root/EmploymentType.TimeInMonths >= 4
THEN <do something>
```

 **Output**

```text
RULE ENGINE TRACE for RULESET: LoanProcessing 3/17/2023 9:23:05 AM
FACT ACTIVITY 3/17/2023 9:23:05 AM
Rule Engine Instance Identifier: 51ffbea4-468f-4ce8-8ab7-977cadda2e2b
Ruleset Name: LoanProcessing
Operation: Assert
Object Type: TypedXmlDocument:Microsoft.Samples.BizTalk.LoansProcessor.Case
Object Instance Identifier: 858
FACT ACTIVITY 3/17/2023 9:23:05 AM
Rule Engine Instance Identifier: 51ffbea4-468f-4ce8-8ab7-977cadda2e2b
Ruleset Name: LoanProcessing
Operation: Assert
Object Type: TypedXmlDocument:Microsoft.Samples.BizTalk.LoansProcessor.Case:/Root/EmploymentType
Object Instance Identifier: 853
CONDITION EVALUATION TEST (MATCH) 3/17/2023 9:23:05 AM
Rule Engine Instance Identifier: 51ffbea4-468f-4ce8-8ab7-977cadda2e2b
Ruleset Name: LoanProcessing
Test Expression: TypedXmlDocument:Microsoft.Samples.BizTalk.LoansProcessor.Case:/Root/EmploymentType.TimeInMonths >= 4
Left Operand Value: 6
Right Operand Value: 4
Test Result: True
AGENDA UPDATE 3/17/2023 9:23:05 AM
Rule Engine Instance Identifier: 51ffbea4-468f-4ce8-8ab7-977cadda2e2b
Ruleset Name: LoanProcessing
Operation: Add
Rule Name: TestRule1
Conflict Resolution Criteria: 0
RULE FIRED 3/17/2023 9:23:05 AM
Rule Engine Instance Identifier: 51ffbea4-468f-4ce8-8ab7-977cadda2e2b
Ruleset Name: LoanProcessing
Rule Name: TestRule1
Conflict Resolution Criteria: 0
FACT ACTIVITY 3/17/2023 9:23:05 AM
Rule Engine Instance Identifier: 51ffbea4-468f-4ce8-8ab7-977cadda2e2b
Ruleset Name: LoanProcessing
Operation: Retract
Object Type: TypedXmlDocument:Microsoft.Samples.BizTalk.LoansProcessor.Case
Object Instance Identifier: 858
FACT ACTIVITY 3/17/2023 9:23:05 AM
Rule Engine Instance Identifier: 51ffbea4-468f-4ce8-8ab7-977cadda2e2b
Ruleset Name: LoanProcessing
Operation: Retract
Object Type: TypedXmlDocument:Microsoft.Samples.BizTalk.LoansProcessor.Case:/Root/EmploymentType
Object Instance Identifier: 853
```

## Related content

- [Create rules with the Microsoft Rules Composer](create-rules.md)
- [Perform advanced tasks on rulesets](perform-advanced-ruleset-tasks.md)
