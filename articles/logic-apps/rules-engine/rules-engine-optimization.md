---
title: Optimization for the Azure Logic Apps Rules Engine
description: Learn how the Azure Logic Apps Rules Engine works from condition evaluation and action execution to prioritization, and how to optimize operation.
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 01/27/2025

#CustomerIntent: As a developer, I want to understand how the Azure Logic Apps Rules Engine works and ways to optimize operation.
---

# Optimization for Azure Logic Apps Rules Engine execution (Preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The Azure Logic Apps Rules Engine provides the execution context for a ruleset, which you can create with the Microsoft Rules Composer. This guide explains the core concepts around how the rules engine works and provides optimization recommendations for operations and execution.

## Core components

- **Ruleset executor**

  This component implements the algorithm responsible for rule condition evaluation and action execution. The default ruleset executor is a discrimination network-based, forward chaining inference engine designed to optimize in-memory operation.

- **Ruleset translator**

  This component takes a **RuleSet** object as input and produces an executable representation of the ruleset. The default in-memory translator creates a compiled discrimination network from the ruleset definition.

- **Ruleset tracking interceptor**

  This component receives output from the ruleset executor and forwards that output to ruleset tracking and monitoring tools.

## Condition evaluation and action execution

The Azure Logic Apps Rules Engine is a highly efficient inference engine that can link rules to .NET objects or XML documents. The rules engine uses a three-stage algorithm for ruleset execution with the following stages:

- **Match**

  In the match stage, the rules engine matches facts against the predicates that use the fact type, which are object references maintained in the rules engine's working memory, by using the predicates defined in the rule conditions. For efficiency, pattern matching occurs across all the rules in the ruleset, and conditions that are shared across rules are matched only once. the rules engine might store partial condition matches in working memory to expedite subsequent pattern matching operations. The output from the pattern matching phase contains updates to the rules engine's agenda.

- **Conflict resolution**

  In the conflict resolution stage, the rules engine examines rules that are candidates for execution to determine the next set of rule actions to run, based on a predetermined resolution scheme. the rules engine adds all the candidate rules found during the matching stage to the rules engine's agenda.

  The default conflict resolution scheme is based on rule priorities within a ruleset. The priority is a rule property that you can configure in the Microsoft Rules Composer. The larger the number, the higher the priority. If multiple rules are triggered, the rules engine runs the higher-priority actions first.

- **Action**

  In the action stage, the rules engine runs the actions in the resolved rule. Rule actions can assert new facts into the rules engine, which causes the cycle to continue and is also known as forward chaining.

  > [!IMPORTANT]
  >
  > The algorithm never preempts the currently running rule. The rules engine executes all actions in the 
  > currently running rule before the match phase repeats. However, other rules on the rules engine's 
  > agenda won't run before the match phase begins again. The match phase might cause the rules engine to 
  > remove those rules from the agenda before they ever run.

### Example

The following example shows how the three-stage algorithm of match, conflict resolution, and action works:

**Rule 1: Evaluate income**

- Declarative representation

  **Obtain an applicant's credit rating only if the applicant's income-to-loan ratio is less than 0.2.**

- IF—THEN representation using business objects

  ```text
  IF Application.Income / Property.Price < 0.2
  THEN Assert new CreditRating( Application)
  ```

**Rule 2: Evaluate credit rating**

- Declarative representation

  **Approve an applicant only if the applicant's credit rating is more than 725.**

- IF—THEN Representation using business objects:

  ```text
  IF Application.SSN = CreditRating.SSN AND CreditRating.Value > 725
  THEN SendApprovalLetter(Application)
  ```

The following table summarizes the facts:

| Fact | Description | Fields |
|------|-------------|--------|
| **Application** | An XML document that represents a home loan application. | - Income: $65,000 <br>- SSN: XXX-XX-XXXX |
| **Property** | An XML document that represents the property to purchase. | - Price: $225,000 |
| **CreditRating** | An XML document that contains the loan applicant's credit rating. | - Value: 0-800 <br>- SSN: XXX-XX-XXXX |

### Updates to working memory and agenda

Initially, the rules engine's working memory and agenda are empty. After your application adds the **Application** and **Property** facts, the rules engine's updates its working memory and agenda as shown:

| Working memory | Agenda |
|----------------|--------|
| - Application <br>- Property | Rule 1 |

- The rules engine adds Rule 1 to its agenda because the condition, **Application.Income / Property.Price < 0.2**, evaluates to **true** during the match phase.

- No **CreditRating** fact exists in working memory, so the condition for Rule 2 isn't evaluated. 

- Rule 1 is the only rule in the agenda, so the rule executes and then disappears from the agenda.

- Rule 1 defines a single action that results in a new fact, which is the applicant's **CreditRating** document that is added to working memory.

- After Rule 1 completes execution, control returns to the match phase.

  The only new object to match is the **CreditRating** fact, so the results of the match phase are the following:

  | Working memory | Agenda |
  |----------------|--------|
  | - Application <br>- Property <br>- CreditRating | Rule 2 |

- Rule 2 now executes, which calls a function that sends an approval letter to the applicant.

- After Rule 2 completes, control returns to the match phase. However, no more new facts are available to match, and the agenda is empty, so forward chaining terminates, and the ruleset execution is complete.

## Agenda and priority

To understand how the Azure Logic Apps Rules Engine evaluates rules and executes actions, you must also learn about the concepts of *agenda* and *priority*.

### Agenda

The rules engine's agenda is a schedule that queues rules for execution. The agenda exists for an engine instance and acts on a single ruleset, not a series of rulesets. When a fact is asserted into working memory, and a rule's conditions are met, the engine places the rule on the agenda and executes that rule based on priority. The engine executes a rule's actions from top to bottom priority, and then executes the actions for the next rule on the agenda.

The rules engine treats the actions in a rule as a block, so all actions run before the engine moves to the next rule. All actions in a rule block execute regardless of other actions in the block. For more information about assertion, see [Optimize your rules engine with control functions ](add-rules-control-functions.md).

The following example shows how the agenda works:

**Rule 1**

```text
IF
Fact1 == 1
THEN
Action1
Action2
```

**Rule 2**

```text
IF
Fact1 > 0
THEN
Action3
Action4
```

When the **Fact1** fact, which has a value of 1, is asserted into the engine, both Rule 1 and Rule 2 have their conditions met. So, the engine moves both rules to the agenda to execute their actions.

| Working memory | Agenda |
|----------------|--------|
| Fact 1 (value=1) | **Rule 1**: <br>- Action1 <br>- Action2 <br><br>**Rule 2**: <br>- Action3 <br>- Action4 |

### Priority

By default, all rules are set to 0 as the priority for execution. However, you can change this priority on each individual rule. The priority can range to either side of 0 with larger numbers having higher priority. The engine executes actions from highest priority to lowest priority.

The following example shows how priority affects the order execution for rules:

**Rule 1 (priority = 0)**

```text
IF
Fact1 == 1
THEN
Discount = 10%
```

**Rule 2 (priority = 10)**

```text
IF
Fact1 > 0
THEN
Discount = 15%
```

Although the conditions for both rules are met, Rule 2 executes first due to its higher priority. The final discount is 10 percent due to the result from the action executed for Rule 1 as shown in the following table:

| Working memory | Agenda |
|----------------|--------|
| Fact1 (value=1) | **Rule 2**: <br>Discount: 15% <br><br>**Rule 1**: <br>Discount: 10% |

## Action side effects

If an action's execution affects an object's state or a term used in conditions, this action is said to have a "side effect" on that object or term. This phrase doesn't mean that the action has side effects, but rather, the object or term is potentially affected by one or more actions.

For example, suppose you have the following rules:

**Rule 1**

```text
IF OrderForm.ItemCount > 100
THEN OrderForm.Status = "Important"
```

**Rule 2**

```text
IF OrderList.IsFromMember = true
THEN OrderForm.UpdateStatus("Important")
```

In this example, **OrderForm.UpdateStatus** has a "side effect" on **OrderForm.Status**, meaning that **OrderForm.Status** is potentially affected by one or more actions.

The **SideEffects** property for .NET class members is set to **true** as the default value, which prevents the rules engine from caching a member with side effects. In this example, the rules engine doesn't cache **OrderForm.Status** in working memory. Instead, the engine gets the most recent value of **OrderForm.Status** every time the engine evaluates Rule 1. If the **SideEffects** property value is **false**, the rules engine caches the value when the engine evaluates **OrderForm.Status** for the first time. However, for later evaluations in forward-chaining scenarios, the engine uses the cached value.

The Microsoft Rules Composer currently doesn't provide a way for you to modify the **SideEffects** property value. However, you can programmatically set the **SideEffects** property value through the Business Rules Framework, which is a Microsoft .NET-compliant class library. You set this value at binding by using the [ClassMemberBinding](/dotnet/api/microsoft.ruleengine.classmemberbinding) class to specify object methods, properties, and fields used in rule conditions and actions. The **ClassMemberBinding** class has a property named [SideEffects](/dotnet/api/microsoft.ruleengine.classmemberbinding.sideeffects), which contains a Boolean value that indicates whether accessing the member changes its value.

## Performance considerations

This section discusses how the Azure Logic Apps Rules Engine performs in various scenarios and with different values for configuration and tuning parameters.

### Fact types

The rules engine takes less time to access .NET facts than to access XML facts. If you have a choice between using .NET facts or XML facts in a ruleset, consider using .NET facts for better performance.

### Rule priority

The priority setting for a rule can range to either side of **0** with larger numbers having higher priority. Actions execute in order starting from highest priority to lowest priority. When the ruleset implements forward-chaining behavior by using **Assert** or **Update** calls, you can optimize chaining by using the **Priority** property.

For example, suppose that **Rule 2** has a dependency on a value that is set by **Rule 1**. If **Rule 1** has higher priority, **Rule 2** only executes after **Rule 1** fires and updates the value. Conversely, if **Rule 2** has a higher priority, the rule can fire once, and then fire again after **Rule 1** fires and updates the fact in the condition for **Rule 2**. This scenario might or might not produce the correct results, but clearly, firing twice has an impact on performance versus firing only once.

For more information, see [Create rules using Microsoft Rules Composer](create-rules.md#set-rule-priority).

### Logical OR operators

The rules engine is optimized to execute [logical **AND** operators](add-rules-operators.md) and reconstructs the rule that the engine parsed into a [disjunctive normal form](https://mathworld.wolfram.com/DisjunctiveNormalForm.html) so that the [logical **OR** operator](add-rules-operators.md) is used only at the top level.

If you use more logical **OR** operators in conditions, the increase creates more permutations that expand the rules engine's analysis network. As a result, the rules engine might take a long time to normalize the rule.

The following list provides possible workarounds for this problem:

- Change the rule into a disjunctive normal form so that the **OR** operator is only at the top level.

  Consider creating the rule programmatically because you might find that building a rule in disjunctive normal form in the Microsoft Rules Composer can be tricky.

- Develop a helper component that performs the **OR** operations and returns a Boolean value, and then use the component in the rule.

- Split the rule into multiple rules and have the rules check for a flag set by a previously executed rule, or use an object that a previously executed rule asserted, for example:

  - **Rule 1**: `IF (a == 1 OR a == 3) THEN b = true`

    **Rule 2**: `IF (b == true) THEN …`

  - **Rule 1**: `IF (a == 1 OR a == 3) THEN Assert(new c())`

    **Rule 2**: `IF (c.flag == true) THEN …`

### Update calls

The **Update** function updates a fact that exists in the rules engine's working memory, which causes reevaluation for all the rules that use the updated fact in conditions. This behavior means **Update** function calls can be expensive, especially if many rules require reevaluation due to updated facts. In some situations, you can avoid having to reevaluate the rules.

For example, consider the following rules:

**Rule 1**

```text
IF PurchaseOrder.Amount > 5
THEN StatusObj.Flag = true; Update(StatusObj)
```

**Rule 2**

```text
IF PurchaseOrder.Amount <= 5
THEN StatusObj.Flag = false; Update(StatusObj)
```

All the remaining rules in the ruleset use **StatusObj.Flag** in their conditions. When you call the **Update** function on the **StatusObj** object, all the rules are reevaluated. Whatever the value is in the **Amount** field, all the rules except **Rule 1** and **Rule 2** are evaluated twice: once before the **Update** call and once after the **Update** call.

Instead, you can set the **Flag** value to **false** before you invoke the ruleset, and then use only **Rule 1** in the ruleset to set the flag. In this case, the **Update** function is called only if the **Amount** value is greater than 5. The **Update** function isn't called if the amount is less than or equal to 5. This way, all the rules except **Rule 1** and **Rule 2** are evaluated twice only if the **Amount** value is greater than 5.

### SideEffects property behavior

In the **XmlDocumentFieldBinding** and **ClassMemberBinding** classes, the **SideEffects** property determines whether to cache the value of the bound field, member, or column.

In the **XmlDocumentFieldBinding** class, the **SideEffects** property's default value is **false**. However, in the **ClassMemberBinding** class, the **SideEffects** property's default value is **true**. 

So, if the engine accesses a field in an XML document for the second time or later within the ruleset, the engine gets the field's value from the cache. However, if the engine accesses a member of a .NET object for the second time or later within the ruleset, the engine gets the value from the .NET object, not from the cache.

This behavior means that if you set the **SideEffects** property in a .NET **ClassMemberBinding** to **false**, you can improve performance because the engine gets the member's value from the cache starting with the second time and onwards. However, you can only programmatically set the property value because the Microsoft Rules Composer doesn't expose the **SideEffects** property.

### Instances and selectivity

The **XmlDocumentBinding** and **ClassBinding** classes each have the following properties, which the rules engine uses their values to optimize condition evaluation. These property values allow the engine to use the fewest possible instances first in condition evaluations and then use the remaining instances.

- **Instances**: The expected number of class instances in working memory.

  If you know the number of object instances beforehand, you can set the **Instances** property to this number to improve performance.

- **Selectivity**: The percentage of class instances that successfully pass the rule conditions.

  If you know the percentage of object instances that pass the conditions beforehand, you can set **Selectivity** property to this percentage to improve performance.

You can only programmatically set these property values because the Microsoft Rules Composer doesn't expose them.

## Support for class inheritance

Inheritance is the capability to use all the functionality from an existing class and extend those capabilities without rewriting the original class, which is a key feature in Object Oriented Programming (OOP) languages.

The Azure Logic Apps Rules Engine supports the following kinds of class inheritance:

- **Implementation inheritance**: The capability to use a base class's properties and methods with no other coding.

- **Interface inheritance**: The capability to use only property names and method names, but the child class must provide the implementation.

With the rules engine, you can write rules in terms of a common base class, but the objects asserted into the rules engine can come from derived classes.

The following example has a base class named **Employee**, while the derived classes are named **RegularEmployee** and **ContractEmployee**:

```csharp
class Employee
{
    public string Status()
    {
        // member definition
    }
    public string TimeInMonths()
    {
        // member definition
    }
}

class ContractEmployee : Employee
{
   // class definition
}
class RegularEmployee : Employee
{
   // class definition
}
```

For this example, assume you have the following rules:

**Rule 1**

```text
IF Employee.TimeInMonths < 12
THEN Employee.Status = "New"
```

```

At run time, if you assert two objects, a **ContractEmployee** instance and a **RegularEmployee** instance, the engine evaluates both objects against the Rule 1.

You can also assert derived class objects in actions by using an **Assert** function. This function causes the engine to reevaluate rules that contain the derived object and the base type in their conditions as shown in the following example, which demonstrates implementation inheritance:

**Rule 2**

```text
IF Employee.Status = "Contract"
THEN Employee.Bonus = false
Assert(new ContractEmployee())
```

After the assertion, the engine reevaluates all rules that contain the **Employee** type or the **ContractEmployee** type in their conditions. Even though only the derived class is asserted, the base class also gets asserted if rules are written using methods in the base class, rather than in the derived class.

## Related content

- [What is the Azure Logic Apps Rules Engine](rules-engine-overview.md)?
- [Create rules with the Microsoft Rules Composer](create-rules.md)
- [Create an Azure Logic Apps Rules Engine project](create-rules-engine-project.md)
