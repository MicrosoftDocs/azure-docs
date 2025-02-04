---
title: Add control functions to optimize rules
description: Learn how to optimize rules execution by adding control functions to rules using Microsoft Rules Composer.
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/27/2025

#CustomerIntent: As a developer, I want to understand how to optimize rules execution by adding control functions to actions in rules using Microsoft Rules Composer.
---

# Add control functions in actions to optimize rules execution using Microsoft Rules Composer (Preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This guide describes how to optimize rules execution by adding control functions to actions in your rules using the Microsoft Rules Composer. Control functions help your application or ruleset control the facts in the rules engine's working memory. These functions include the **Assert**, **Clear**, **Halt**, **Retract**, **RetractByType**, **Reassert**, and **Update** functions for the .NET object and **TypedXmlDocument** entities that you can use as facts. The existence of facts in working memory drives the conditions that the engine evaluates and the actions that execute.

## Prerequisites

- Download and install the [Microsoft Rules Composer](https://go.microsoft.com/fwlink/?linkid=2274238).

- The XML file that contains the ruleset that you want to work on.

  To add facts, specify their values in the XML documents that you point at from the RuleSet Explorer window. Or, you can use a fact creator to supply your rules engine with an array that contains .NET objects as facts. For more information, see [Build fact creators and retrievers](build-fact-creators-retrievers.md).

## Assert function

To add object instances to the rules engine's working memory, use the **Assert** function in the Microsoft Rules Composer. The engine processes each object instance according to the conditions and actions that are written against the instance's type using the match-conflict resolution-action phases.

The following table summarizes the **Assert** function behavior for the supported asserted entities and instance types, including the number of resulting instances created in the engine for each asserted entity and the type applied to each instance for identification.

| Entity | Number of instances asserted | Instance type |
|--------|------------------------------|---------------|
| .NET object | 1 (the object itself)| Fully qualified .NET class |
| TypedXmlDocument | 1-N TypedXmlDocument(s): Based on the selector bindings created and document content | DocumentType.Selector |

### Assert a .NET object

The rules engine natively supports basic .NET scalar types and objects for reference types. Asserted .NET object processing is the most straightforward of the processing types.

In the Microsoft Rules Composer, you can assert a .NET object from within a rule.

1. In the **Microsoft Rules Composer**, load the XML file that contains the rule store you want to work on.

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **THEN** pane, under **Actions**, add the **Assert** built-in function as an action.

1. In the **Facts Explorer** window, select **.NET Classes**.

1. From the **.NET Classes** tab, drag the constructor method for the object that you want to the argument in the **Assert** action.

   The Microsoft Rules Composer translates the constructor method into a **CreateObject** call in the rule definition.

   > [!NOTE]
   >
   > Although the rules engine has a **CreateObject** function, the function 
   > doesn't appear as a separate function in the Microsoft Rules Composer. 

Each object is asserted into working memory as a separate object instance, which means that each predicate that references the object's type, such as **`IF Object.Property = 1`**, analyzes the instance. The instance is also available to rule actions that reference the type, based on the results of the rule conditions.

For example, suppose you have the following rules:

**Rule 1**

```text
IF A.Value = 1
THEN A.Status = "good"
```

**Rule 2**

```text
IF B.Value = 1
THEN A.Status = "good"
```

In Rule 1, only the **A** instances with a value of 1 have their **Status** property updated. In Rule 2, however, if the condition evaluates to **true**, all **A** instances have their status updated. In fact, if there are multiple **B** instances exist, the **A** instances are updated each time the condition evaluates to **true** for a **B** instance.

### Assert a TypedXmlDocument entity

In the Microsoft Rules Composer, you can assert a **TypedXmlDocument** entity from within a rule.

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **THEN** pane, under **Actions**, add the **Assert** built-in function as an action.

1. In the **Facts Explorer** window, select **XML Schemas**.

1. From the **XML Schemas** tab, drag the node that you want to the argument in the **Assert** action.

XML documents are basically text, but the field values might be any type, which is based on the specified type when the rule was built. Fields are XPath expressions, so they might return a nodeset, which means that the first item in the set is used as the value.

When a **TypedXmlDocument** entity is asserted as a fact, the rules engine creates **TypedXmlDocument** child instances, based on the selectors defined in the rule. You can think of selectors as a way to isolate the nodes in an XML document, and fields as identifying specific items within the selector. The rules engine groups all the fields inside one selector as an object.

Selectors are also XPath expressions. In the **Facts Explorer**, when you select a node on the **XML Schemas** tab, the Microsoft Rules Composer automatically fills in the **XPath Selector** property for all nodes and the **XPath Field** property for any node that doesn't contain child nodes. Alternatively, you can enter your own XPath expressions for **XPath Selector** and **XPath Field** if necessary. If the selector matches multiple portions in the XML document, multiple objects of this type are asserted into or retracted from the rules engine's working memory.

You can use multiple selectors within the same document. That way, you can view different parts of the document, for example, suppose one section is the order and another section contains the shipping address. However, keep in mind that the created objects are defined by the XPath string that created them. If you use a different XPath expression, the result is a unique **TypedXmlDocument** entity, even if the expression resolves to the same node.

For example, suppose you have the following XML:

```xml
<root>
    <order customer="Joe">
        <item name="router" quantity="10" cost="550" />
        <item name="switch" quantity="3" cost="300" />
    </order>
    <order customer="Jane">
        <item name="switch" quantity="1" cost="300" />
        <item name="cable" quantity="23" cost="9.99" />
    </order>
</root>
```

If you use the selector **/root/order**, or **//order**, the following objects are added to the engine's working memory:

**Object 1**

```xml
<order customer="Joe">
    <item name="router" quantity="10" cost="550" />
    <item name="switch" quantity="3" cost="300" />
</order>
```

**Object 2**

```xml
<order customer="Jane">
    <item name="switch" quantity="1" cost="300" />
    <item name="cable" quantity="23" cost="9.99" />
</order>
```

Within each selector, XPaths refer to the individual fields. So, if you use the selector **/root/order/item**, **//order/item**, or **//item**, the following objects are added to the engine's working memory with two items for Joe and the two items for Jane:

```xml
<root>
    <order customer="Joe">
    </order>
    <order customer="Jane">
    </order>
</root>
```

Each object can access three fields: **@name**, **@quantity**, and **@cost**. You can refer to the parent fields because the object is a reference into the original document, for example, **../@customer**.

Behind the scenes, the rules engine can convert a text field value to any one of the supported types through the **XmlConvert** function. You can specify this option by setting the type in the Microsoft Rules Composer. If a conversion isn't possible, the engine throws an exception. You can retrieve the **bool** and **double** types only as their respective type, either strings or objects.

## Clear function

To reset the working memory and agenda for a rules engine instance, use the **Clear** function in the Microsoft Rules Composer. For more information about working memory and agenda, see [Rules engine optimization](rules-engine-optimization.md).

### Reset working memory and agenda for your rules engine

1. In the **RuleSet Explorer** window, find and select the rule where you want to clear the working memory and agenda for your rules engine.

1. In the **THEN** pane, under **Actions**, add the **Clear** built-in function as an action.

   The **Clear** function takes no arguments.

## Halt function

To stop the current execution by the rules engine, use the **Halt** function in the Microsoft Rules Composer.

### Stop ruleset execution

1. In the **RuleSet Explorer** window, find and select the rule where you want to stop ruleset execution.

1. In the **THEN** pane, under **Actions**, add the **Halt** built-in function as an action.

The **Halt** function takes a single **Boolean** argument. If you specify the value as **true**, the rules engine clears the agenda that contains the pending candidate rules.

The **Ruleset.Execute** method is a wrapper around the **RuleEngine.Execute** method, and uses code that's similar to the following code:

```csharp
RuleEngine.Assert(facts);
RuleEngine.Execute();
RuleEngine.Retract(facts);
```

If you use the **Ruleset.Execute** method to execute a ruleset, the rules engine returns control to the **Ruleset.Execute** method when the **Halt** function executes. The **Ruleset.Execute** method retracts the facts and returns control to the caller. In this case, the halted ruleset execution can't resume.

However, if you directly use the **RuleEngine.Execute** method to execute the ruleset, you can resume the halted ruleset execution with the next pending rule firing by calling **RuleEngine.Execute** again, provided that you didn't retract any objects needed between the two calls.

> [!NOTE]
>
> The **Ruleset.Execute** method caches the rules engine instances for better performance. 
> If you directly use the **RuleEngine.Execute** method, the rules engine instances aren't cached.

The following sample code shows how to resume the halted ruleset execution:

```csharp
// Assert facts into working memory of the rules engine instance.
RuleEngine.Assert(facts);

// Execute the ruleset.
RuleEngine.Execute();

// The ruleset invokes the Halt method when executing actions.
// Control returns here when the Halt function is called. 
// When engine halts, do the following tasks.

// Add your code here.

// Resume the halted rules engine execution.
RuleEngine.Execute();

// Retract or remove facts from working memory in the rules engine.
RuleEngine.Retract(facts);
```

## Retract function

To remove objects from a ruleset and from the rules engine's working memory, use the **Retract** function in the Microsoft Rules Composer.

### Retract a .NET object

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **THEN** pane, under **Actions**, add the **Retract** built-in function as an action.

1. In the **Facts Explorer** window, select **.NET Classes**.

1. From the **.NET Classes** tab, drag the class that you want, not the assembly or method, into the argument for the **Retract** parameter.

   If you drag a method into the **Retract** function, the engine attempts to retract the object returned by the method.

Retracting a .NET object has the following impact:

- Actions on the agenda that use the objects are removed from the agenda.
 
  > [!NOTE]
  >
  > Other actions higher up on the agenda might already have executed before you use the **Retract** function.

- Rules that use the object in a predicate have their actions removed from the agenda, if any actions exist on the agenda.

- The engine no longer evaluates the object.

### Retract a TypedXmlDocument entity or entities

You can retract the original **TypedXmlDocument** entity that was asserted into the rules engine, or you can retract one of the **TypedXmlDocument** child entities created from the parent **XmlDocument** entity.

Suppose you have the following example XML:

```xml
<order>
    <orderline customer="Joe" linenumber="001">
        <product name="router" quantity="10" cost="550" />
    </orderline>
    <orderline customer="Jane" linenumber="002">
        <product name="switch" quantity="1" cost="300" />
    </orderline>
</order>
```

You can either retract the **TypedXmlDocument** entity associated with an **order** object, or you can retract one or both of the **TypedXmlDocument** entities associated with the **orderline** object. All **TypedXmlDocument** entities are associated with the top-level **TypedXmlDocument** entity that was originally asserted, not with the **TypedXmlDocument** entity that appears above that top-level **TypedXmlDocument** node in the XML tree hierarchy.

For example, **product** is a **TypedXmlDocument** entity below the **orderline** object and is associated with the **TypedXmlDocument** entity for **order**, not the **TypedXmlDocument** entity for **orderline**. In most instances, this distinction isn't important. However, if you retract the **order** object, the **orderline** and **product** objects are also retracted. If you retract the **orderline** object, only that object is retracted, not the **product** object.

The engine only works with and tracks the object instances, which are **TypedXmlDocument** instances, that the engine created when the **TypedXmlDocument** entity was initially asserted. If you create additional nodes, such as sibling nodes for a node that was selected through a selector in the ruleset, these nodes aren't evaluated in rules unless **TypedXmlDocument** entities are created and asserted for them. If you assert these new, lower-level **TypedXmlDocument** instances, the engine evaluates the instances in the rules, but the top-level **TypedXmlDocument** entity doesn't have knowledge about them. When the top-level **TypedXmlDocument** is retracted, the new, the independently asserted **TypedXmlDocument** entities aren't automatically retracted. As a result, if new nodes are created, perform a **Retract** and **Reassert** on the full **XmlDocument**, which is the typical and most straightforward step to take.

The **TypedXmlDocument** class provides useful methods that you can call within a custom .NET member as part of an action. These methods include the capability to get the **XmlNode** associated with the **TypedXmlDocument** or the parent **TypedXmlDocument**.

#### Retract the top-level TypedXmlDocument entity

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **THEN** pane, under **Actions**, add the **Retract** built-in function as an action.

1. In the **Facts Explorer** window, and select **XML Schemas**.

1. From the **XML Schemas** tab, drag the top-level node for the schema into the argument for the **Retract** function.

   This top node ends in the **.xsd** extension and represents the document root node, not the document element node. The node has a **/** selector that refers to the initial **TypedXmlDocument**. When you retract the parent **TypedXmlDocument**, all **TypedXmlDocument** child entities associated with the **TypedXmlDocument** are removed from working memory, including all the **TypedXmlDocument** entities created by calling the **Assert** function, based on selectors used in the ruleset.

#### Retract a child TypedXmlDocument entity

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **THEN** pane, under **Actions**, add the **Retract** built-in function as an action.

1. In the **Facts Explorer** window, and select **XML Schemas**.

1. From the **XML Schemas** tab, drag the child node into the argument for the **Retract** function.

## RetractByType function

To remove all objects with the specified type from the rules engine's working memory, use the **RetractByType** function in the Microsoft Rules Composer. This function differs from the **Retract** function, which removes only specific items with a certain type.

### Retract all .NET objects with a specific type

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **THEN** pane, under **Actions**, add the **RetractByType** built-in function as an action.

1. In the **Facts Explorer** window, select **.NET Classes**.

1. From the **.NET Classes** tab, drag the class into the argument for the **RetractByType** function.

#### Retract all TypedXmlDocument entities with a specific type

The **RetractByType** removes all **TypedXmlDocument** entities with the same **DocumentType.Selector**.

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **THEN** pane, under **Actions**, add the **RetractByType** built-in function as an action.

1. In the **Facts Explorer** window, select **XML Schemas**.

1. From the **XML Schemas** tab, drag the appropriate node to the **RetractByType** function.

Consistent with the **Retract** function, if you use the **RetractByType** function on the document root node, not only does this action retract all **TypedXmlDocument** entities asserted with that **DocumentType**, but also all the child **TypedXmlDocument** entities, or **XmlNode** nodes in the tree hierarchy, associated with those parent **TypedXmlDocument** entities.

## Reassert function

To call the **Assert** function on an object that already exists in the engine's working memory, use the **Reassert** function in the Microsoft Rules Composer. The behavior is equivalent to issuing a **Retract** command for the object, followed by an **Assert** command.

For example, if you use the **Reassert** function on a .NET object, the rules engine takes the following steps:

1. Retract the .NET object from working memory.

1. Remove any actions on the agenda for rules that use the object in a predicate or action.

1. Assert the .NET object back into working memory and evaluate as a newly asserted object.

1. Reevaluate any rules that use the object in a predicate and add those rules' actions to the agenda as appropriate.

1. Readd the actions to the agenda for any rules that previously evaluated to **true** and only use the object in their actions.

### Reassert a .NET object

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **THEN** pane, under **Actions**, add the **Reassert** built-in function as an action.

1. In the **Facts Explorer** window, select **.NET Classes**.

1. From the **.NET Classes** tab, drag the class into the argument for the **Reassert** function.

### Reassert a TypedXmlDocument entity

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **THEN** pane, under **Actions**, add the **Reassert** built-in function as an action.

1. In the **Facts Explorer** window, select **XML Schemas**.

1. From the **XML Schemas** tab, drag the entity node that you want to the argument in the **Reassert** function.

If you reassert a top-level **TypedXmlDocument** entity, the **TypedXmlDocument** child entities, which were created when the the top-level **TypedXmlDocument** entity was first asserted, can behave differently, depending on the state of each **TypedXmlDocument** child entity.

For example, if a new or existing child entity is "dirty", meaning that at least one field was changed in the ruleset using an action, then an **Assert** function or **Reassert** function is performed on that child. Any existing child that isn't dirty stays in working memory.

> [!NOTE]
>
> A node isn't marked dirty from external operations that the engine doesn't know about, for example, 
> an external application programmatically adds, deletes, or updates that node.

The following example shows a simplified scenario that describes the child entity behaviors when their parent entity is reasserted. Suppose you have the following **TypedXmlDocument** entities in working memory: **Parent**, **Child1**, **Child2**, and **Child3**.

- **Parent** is the top-level **TypedXmlDocument** entity.
- Each child contains a field named **ExampleField** where the value is set to 1, for example, **`Child1.ExampleField` = 1`**.

Suppose a rule action performs the following operations on the child entities:

- The **ExampleField** value for **Child2** is updated from 1 to 0.
- User code deletes **Child3**.
- User code adds a new **TypedXmlDocument** child entity named **NewChild** to **Parent**.

The following example shows the new representation of objects in working memory:

```text
Parent
Child1 // Where Child1.ExampleField = 1
Child2 // Where Child2.ExampleField = 0
NewChild
```

Now, suppose you reassert the **Parent** entity, which results in the following child entity behaviors:

- **Child2** is reasserted because it's now dirty after its field was updated.
- **Child3** is retracted from working memory.
- **NewChild** is asserted into working memory.
- **Child1** stays unchanged in working memory because it wasn't updated before **Parent** was reasserted.

## Update function

To reassert an object into the rules engine for reevaluation, based on the new data and state, use the **Update** function in the Microsoft Rules Composer. The object can have .NET class type or **TypedXmlDocument** type. You can also use the **Update** function to improve engine performance and prevent endless loop scenarios.

> [!IMPORTANT]
>
> The default maximum loop count for rules reevaluation is 2^32, so for certain rules, 
> ruleset execution might last a long time. To reduce the loop count, change the 
> **Maximum Execution Loop Depth** property on the ruleset version.

### Update a .NET object

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **THEN** pane, under **Actions**, add the **Update** built-in function as an action.

1. In the **Facts Explorer** window, select **.NET Classes**.

1. From the **.NET Classes** tab, drag the class into the argument for the **Update** function.

Typically, you use **Assert** to place a new object in the rules engine's working memory, and use **Update** to update an already existing object in working memory. When you assert a new object as a fact, the engine reevaluates the conditions in all the rules. However, when you update an existing object, the engine reevaluates only conditions that use the updated fact and adds actions to the agenda, if these conditions evaluate to true.

For example, suppose you have the following rules and that the objects named **ItemA** and **ItemB** already exist in working memory.

- **Rule 1** evaluates the **Id** property in **ItemA**, sets the **Id** property on **ItemB**, and then reasserts **ItemB** after the change. When **ItemB** is reasserted, the engine treats **ItemB** as a new object, and the engine reevaluates all rules that use **ItemB** in the predicates or actions. This behavior makes sure that the engine reevaluates **Rule 2** against the new value in **ItemB.Id** as set in **Rule 1**.

  **Rule 1**

  ```text
  IF ItemA.Id == 1
  THEN ItemB.Id = 2
  Assert(ItemB)
  ```

- **Rule 2** might fail the first evaluation, but evaluates to **true** during the second evaluation.

  **Rule 2**

  ```text
  IF ItemB.Id == 2
  THEN ItemB.Value = 100
  ```

The capability to reassert objects into working memory gives you explicit control over the behavior in forward-chaining scenarios. However, this example reveals a side effect from reassertion where **Rule 1** is also reevaluated. With **ItemA.Id** unchanged, **Rule 1** again evaluates to **true**, and the **Assert(ItemB)** action fires again. As a result, the rule creates an endless loop situation.

#### Prevent endless loops

You must be able to reassert objects without creating endless loops. To avoid such scenarios, you can use the **Update** function. Like the **Reassert** function, the **Update** function performs the **Retract** and **Assert** functions on the associated object instances that are changed by rule actions, but with the following key differences:

- On the agenda, actions for rules stay on the agenda when the instance type is only used in the actions, not the predicates.

- Rules that only use the instance type in actions aren't reevaluated.

As a result, rules that use the instance types, either in only the predicates or both the predicates and actions, are reevaluated, and the rules' actions are added to the agenda as appropriate.

By changing the preceding example to use the **Update** function, you can make sure that the engine reevaluates only **Rule 2** because the condition for **Rule 2** uses **ItemB**. The engine doesn't reevaluate **Rule 1** because **ItemB** is only used in the actions for **Rule 1***, eliminating the looping scenario.

**Rule 1**

```text
IF ItemA.Id == 1
THEN ItemB.Id = 2
Update(ItemB)
```

**Rule 2**

```text
IF ItemB.Id == 2
THEN ItemB.Value = 100
```

Despite using the **Update** function this way, the possibility still exists for creating looping scenarios. For example, consider the following rule:

```text
IF ItemA.Id == 1
THEN ItemA.Value = 20
Update(ItemA)
```

The predicate uses **ItemA**, so the engine reevaluates the rule when **Update** is called on **ItemA**. If the value for **ItemA.Id** isn't changed elsewhere, **Rule 1** continues to evaluate as **true**, which causes calling **Update** again on **ItemA**.

As the rule designer, you must make sure to avoid creating such looping scenarios. The appropriate approach to fix this problem differs based on the nature of the rules.

The following example shows a simple way to solve the problem in the preceding example by adding a check on **ItemA.Value** that prevents the rule from evaluating as **true** again after the rule's actions executed the first time.

```text
IF ItemA.Id == 1 and ItemA.Value != 20
THEN ItemA.Value = 20
Update(ItemA)
```

### Update a TypedXmlDocument entity

1. In the **RuleSet Explorer** window, find and select the rule that you want.

1. In the **THEN** pane, under **Actions**, add the **Update** built-in function as an action.

1. In the **Facts Explorer** window, select **XML Schemas**.

1. From the **XML Schemas** tab, drag the entity node that you want to the argument in the **Update** function.

For example, suppose you have the following rules:

- **Rule 1** evaluates the total count of the items in a purchase order message.

  ```text
  IF 1 == 1
  THEN ProcessPO.Order:/Order/Items/TotalCount = (ProcessPO.Order:/Order/Items/TotalCount + ProcessPO:/Order/Items/Item/Count)  
  ```

- Rule 2 sets the status to "Needs approval" if the total count is greater than or equal to 10.

  **Rule 2**

  ```text
  IF ProcessPO.Order:/Order/Items/TotalCount >= 10
  THEN ProcessPO.Order:/Order/Status = "Needs approval"
  ```

If you pass the following purchase order message as input to this ruleset, you notice that the status isn't set to "Needs approval", even though the **TotalCount** is 14. This behavior happens because **Rule 2** is evaluated only at the start when the **TotalCount** value is 0. The rule isn't evaluated each time when **TotalCount** is updated.

```xml
<ns0:Order xmlns:ns0="http://ProcessPO.Order">
    <Items>
        <Item>
            <Id>ITM1</Id>
            <Count>2</Count>
        </Item>
        <Item>
            <Id>ITM2</Id>
            <Count>5</Count>
        </Item>
        <Item>
            <Id>ITM3</Id>
            <Count>7</Count>
        </Item>
        <TotalCount>0</TotalCount>
    </Items>
    <Status>No approval needed</Status>
</ns0:Order>
```

To have the engine reevaluate the conditions each time when **TotalCount** is updated, you have to call the **Update** function on the parent node (**Items**) for the updated node (**TotalCount**). If you change **Rule 1** as follows, and test the rule one more time, the **Status** field is set to "Needs approval":

**Rule 1** (updated)

```text
IF 1 == 1
THEN ProcessPO.Order:/Order/Items/TotalCount = (ProcessPO.Order:/Order/Items/TotalCount + ProcessPO:/Order/Items/Item/Count) AND
Update(ProcessPO.Order:/Order/Items)
```

## Related content

- [Create rules with the Microsoft Rules Composer](create-rules.md)
- [Add arithmetic and logical operators to rules](add-rules-operators.md)
- [Test your rulesets](test-rulesets.md)
- [Create an Azure Logic Apps Rules Engine project](create-rules-engine-project.md)
