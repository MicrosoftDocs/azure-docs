---
title: Perform advanced tasks on rulesets
description: Learn how to perform advanced tasks and operations on rulesets by using the Microsoft Rules Composer.
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/27/2025

#CustomerIntent: As a developer, I want to perform more advanced tasks and operations on rulesets using the Microsoft Rules Composer.
---

# Perform advanced tasks on rulesets with the Microsoft Rules Composer (Preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This guide describes more advanced operations that you can perform on rulesets in the Microsoft Rules Composer.

## Prerequisites

- Download and install the [Microsoft Rules Composer](https://go.microsoft.com/fwlink/?linkid=2274238).

- The XML file that contains the ruleset that you want to work on.

## Copy a ruleset version

You can create a copy of an existing ruleset version but with a different version number.

1. Open the **Microsoft Rules Composer**. In the **RuleSet Explorer** window, open the ruleset version's shortcut menu, and select **Copy**.

1. Open the ruleset's shortcut menu, and select **Paste RuleSet Version**.

   The Microsoft Rules Composer creates a new ruleset version with the same elements as the copied version but with a different number.

   > [!NOTE]
   > 
   > If you update the .NET assembly used to provide facts to your ruleset, 
   > make sure to update your ruleset version's references to that assembly. 
   > For more information, see [Update .NET assembly references](create-rules.md#update-assembly-references).

## Create an empty ruleset version

After you add rules to a ruleset version, you can create a new empty ruleset version with a different number, and save that version for you to work on later.

1. Open the **Microsoft Rules Composer**. From the ruleset's shortcut menu, select **Add New Version**.

   The Microsoft Rules Composer creates a new empty ruleset version with a different number.

1. Open the new ruleset version's shortcut menu, and select **Save**.

You can now copy rules from other ruleset versions, and paste them into the new version.

## Pass fact types to a ruleset

Although you can't directly specify a return type for a ruleset, you can pass one of the following types of facts to the ruleset, have the ruleset change the value of the fact to **`true`** or **`false`**, and then check the value of the property or element/column after the ruleset executes:

- A .NET object that has a property with **`Boolean`** type
- An XML document that has an element with **`Boolean`** type

<a name="set-up-fact-retriever"></a>

## Set up a fact retriever for a ruleset

When you use a fact retriever with your ruleset, you can store facts that don't often change so that before your host application's first execution cycle. That way, you can retrieve these facts from storage, present them once to the rules engine for caching, and reuse them over multiple execution cycles. For more information, see [Build fact creators and retrievers](build-fact-creators-retrievers.md).

You have two ways to associate a fact retriever with a ruleset:

- Manually select a fact retriever for a ruleset version in the Microsoft Rules Composer.

- Programmatically by using the **`RuleSetExecutionConfiguration`** object.

> [!NOTE]
>
> You can associate only one fact retriever implementation with a ruleset version.

### Manually select a fact retriever for a ruleset

1. Open the **Microsoft Rules Composer**. In the **RuleSet Explorer**, select the ruleset version that you want to associate with the fact retriever.

1. In the **Properties** window, select the **FactRetriever** property row, and then select the **ellipsis** button (**…**) to find and select an existing fact retriever object.

   > [!NOTE]
   >
   > The **ellipsis** button (…) doesn't appear until you select the **FactRetriever** row in the **Properties** window.

## Call a child ruleset from a parent ruleset

For this task, use one of the following methods:

- Call the **`Ruleset.Execute`** method directly from the parent ruleset.

- From the parent ruleset, call a method of a helper .NET component that wraps the **`Ruleset.Execute`** method.

  With the second method, you can add preprocessing and postprocessing code to the **`Ruleset.Execute`** method. For example, you can create any facts required from the child ruleset within this wrapper method. The following sections provide an example for each method.

### Call the Ruleset.Execute method directly from the parent ruleset

This section provides high-level steps to call the child ruleset directly from the parent Ruleset by using the **`Ruleset.Execute`** method. The following procedure shows the steps to add the **`Ruleset.Execute`** method as an action to the parent ruleset that passes an XML document as a fact to the child ruleset.

> [!NOTE]
>
> In this sample scenario, an XML document is submitted as a fact to the parent ruleset. 
> This document is passed as a fact to the child ruleset. However, you can call a .NET 
> method that creates the facts for the child ruleset instead.

1. Open the Microsoft Rules Composer. In the **Facts Explorer** window, select the **.NET Classes** tab.

1. Open the shortcut menu for **.NET Assemblies**, and select **Browse**.

1. From the **.NET Assemblies** list, select **Microsoft.RuleEngine**, and then select **OK**.

1. Expand **Ruleset**, and drag either **Execute(Object facts)** or **Execute(Object facts, IRuleSetTrackingInterceptor trackingInterceptor)** to the **THEN** pane.

1. Select the **XML Schemas** node, open the shortcut menu for **Schemas**, and select **Browse**.

1. Select the schema for the XML document you want to pass as a fact, and then select **Open**.

1. To pass the XML document that is passed to the parent ruleset as a fact to the child ruleset, drag **<*schema-name*>.xsd** to the first argument in the **Ruleset.Execute** method.

1. If you use the **Execute** method that doesn't take **IRuleSetTrackingInterceptor** as the second argument, skip the following steps.

1. Select the **.NET Classes** tab, and drag **DebugTrackingInterceptor** in **Microsoft.RuleEngine** to the second argument of the **Ruleset.Execute** method.

   > [!NOTE]
   >
   > If you perform this action, the client must pass an instance of the **DebugTrackingInterceptor** class as a fact 
   > to the parent ruleset, which then passes the instance as a fact to the child ruleset. Instead, you can drag the 
   > constructor of the **DebugTrackingInterceptor** class so that the instance is automatically created for you.

### Modify the client application that calls the parent ruleset

The client that invokes the parent ruleset creates an instance of the **Ruleset** class with the child ruleset name as a parameter and passes that instance as a fact to the parent ruleset along with other facts. The following sample code illustrates this action:

```csharp
DebugTrackingInterceptor dti = new DebugTrackingInterceptor("RulesetTracking.txt");
Ruleset Ruleset = new Ruleset("ParentRuleset");
object[] facts = new object[3];
facts[0] = txd;
facts[1] = new Ruleset("ChildRuleset");
facts[2] = new DebugTrackingInterceptor("RulesetTracking2.txt");
Ruleset.Execute(facts, dti);
Ruleset.Dispose();
```

If the client is a BizTalk orchestration, you might need to put the code in an **Expression** shape to create facts, and then pass the facts as parameters to the **Call Rules** shape.

### Call a .NET wrapper method from the parent ruleset

This section presents the high-level steps to invoke a .NET method that wraps the call to the **Ruleset.Execute** method from the parent ruleset.

#### Create the utility .NET class

1. Create a .NET class library project. Add a class to the project.

1. Add a static method that calls the **`Ruleset.Execute`** method to invoke the ruleset whose name is passed as a parameter, for example, as the following sample code shows:

   ```csharp
   public static void Execute(string RulesetName, TypedXmlDocument txd)
   {
       DebugTrackingInterceptor dti = new   DebugTrackingInterceptor("RulesetTracking.txt");
       Ruleset Ruleset = new Ruleset("ParentRuleset");
       object[] facts = new object[3];
       facts[0] = txd;
       facts[1] = new Ruleset("ChildRuleset");
       facts[2] = new DebugTrackingInterceptor("RulesetTracking2.txt");
       Ruleset.Execute(facts, dti);
       Ruleset.Dispose();
   }
   ```

   The client invokes the parent ruleset, and the parent ruleset calls the helper method that invokes the child ruleset, for example, as the following sample code for the client shows:

   ```csharp
   facts[0] = txd;
   facts[1] = new RulesetExecutor(txd);

   // Call the first or parent ruleset.
   Ruleset Ruleset = new Ruleset(RulesetName);
   DebugTrackingInterceptor dti = new DebugTrackingInterceptor("RulesetTracking.txt");
   Ruleset.Execute(facts, dti);
   Ruleset.Dispose();
   ```

   > [!NOTE]
   >
   > If the method is an instance method, the client must create an instance of 
   > the helper .NET class, and pass that instance as a fact to the parent ruleset.

## Analyze multiple objects with the same type in a rule

In many scenarios, you write a business rule against a type and expect the engine to separately analyze and act on each instance of the type that is asserted into the engine. However, in some scenarios, you want the engine to simultaneously analyze multiple instances that have the same type. For example, the following sample rule uses multiple instances of the **FamilyMember** class:

```text
IF FamilyMember.Role == Father
AND FamilyMember.Role == Son
AND FamilyMember.Surname == FamilyMember.Surname
THEN FamilyMember.AddChild(FamilyMember)
```

The rule identifies multiple **FamilyMember** instances where one is a **Father** and another is a **Son**. If the instances are related by surname, the rule adds the **Son** instance to a collection of children on the **Father** instance. If the engine separately analyzes each **FamilyMember** instance, the rule never triggers because in this scenario, the **FamilyMember** only has one role, either **Father** or **Son**.

So, in this scenario, you must indicate that the engine analyzes multiple instances together in the rule, and you need a way to differentiate the identity of each instance in the rule. You can use the **Instance ID** field to provide this functionality. This field is available in the **Properties** window when you select a fact in the **Facts Explorer**.

> [!IMPORTANT]
>
> If you choose to use the **Instance ID** field, make sure that you 
> change its value before you drag a fact or member into a rule.

When you use the **Instance ID** field, the rule is rebuilt. For those rule arguments that use the **Son** instance of the **FamilyMember** class, change the **Instance ID** value from the default of **0** to **1**. When you change the **Instance ID** value from 0, and you drag the fact or member into the Rule Editor, the **Instance ID** value appears in the rule following the class, for example:

```text
IF FamilyMember.Role == Father
AND FamilyMember(1).Role== Son
AND FamilyMember.Surname == FamilyMember(1).Surname
THEN FamilyMember.AddChild(FamilyMember(1))
```

Now, assume that a **Father** instance and a **Son** instance are asserted into the engine. The engine evaluates the rule against the various combinations of these instances. Assuming that the **Father** and **Son** instance have the same surname, the **Son** instance is added to the **Father** instance as expected.

> [!NOTE]
>
> The **Instance ID** field is only used within the context of a specific rule evaluation. This field 
> isn't affixed to an object instance across the ruleset execution and isn't related to the order used 
> for asserting objects. Each object instance is evaluated in all rule arguments for that type.

## Related content

- [Create rules with the Microsoft Rules Composer](create-rules.md)
- [Create an Azure Logic Apps Rules Engine project](create-rules-engine-project.md)
