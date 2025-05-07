---
title: Build fact creators and retrievers
description: Learn how to build fact creators and retrievers to develop and test rules in Microsoft Rules Composer.
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/27/2025

#CustomerIntent: As a developer, I want to understand how to build fact creators and retrievers so that I can test my rules and rulesets in Microsoft Rules Composer and use those rulesets with my Azure Logic Apps Rules Engine project.
---

# Build fact creators and retrievers to use with rules and rulesets (Preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To create facts for your rules engine to use during business rules development and testing, you can build a *fact creator*, which provides your engine with an array of .NET objects. You can also build a *fact retriever* that inserts long-term or slowly changing facts into your rules for evaluation during execution.

This how-to guide shows how to build a fact creator and fact retriever for your Azure Logic Apps Rules Engine project to use.

## Build a fact creator

To create your fact instances, implement the **IFactCreator** interface and its methods, **CreateFacts** and **GetFactTypes**. After you build the .NET assembly (DLL file) for your first fact creator, you can select the assembly from the ruleset testing capability in Microsoft Rules Composer. For more information, see [Test rulesets](test-rulesets.md).

The following example shows a sample fact creator implementation:

```csharp
public class MyFactCreator : IFactCreator
{
    private object[] myFacts;
    public MyFactCreator()
    {
    }

    public object[] CreateFacts ( RuleSetInfo rulesetInfo )
    {
        myFacts = new object[1];
        myFacts.SetValue(new MySampleBusinessObject(),0);
        return myFacts;
    }

    public Type[] GetFactTypes (RuleSetInfo rulesetInfo)
    {
       return null;
    }
}
```

## Build a fact retriever

A fact retriever is an .NET object that implements standard methods and typically uses them to supply long-term and slowly changing facts to the rules engine before the engine executes the ruleset. The engine caches these facts and uses them over multiple execution cycles. The fact retriever submits the fact the first time and then updates the fact in memory only when necessary. Rather than submit a fact each time that you invoke the rules engine, create fact retriever that submits the fact the first time, and then updates the fact in memory only when necessary.

To supply fact instances to your rules engine, implement the **IFactRetriever** interface and the **UpdateFacts** method. You can then set up your ruleset version to use this implementation to bring in facts at run time. Your ruleset version then calls the **UpdateFacts** method at every execution cycle.

Optionally, you can implement the **IFactRemover** interface on a fact retriever component. The rules engine can then call the method named **UpdateFactsAfterExecution** from the **IFactRemover** interface when the ruleset is disposed. That way, you can do any post-execution work, such as committing any database changes or retracting any object instances from the rules engine's working memory.

You can design your fact retriever with the required application-specific logic to perform the following tasks:

1. Connect to the required data sources.

1. Assert the data as long-term facts into the engine.

1. Specify the logic to refresh or assert new long-term fact instances into the engine.

   The engine uses the initially asserted and cached values on subsequent execution cycles until those values are updated.

The fact retriever implementation returns an object that is analogous to a token that the retriever can use with the **factsHandleIn** object to determine whether to update existing facts or assert new facts. When a ruleset version calls the fact retriever for the first time, the **factsHandleIn** object is always set to null, but takes on the return object's value after the fact retriever completes execution.

The following sample code shows how to assert .NET and XML facts using a fact retriever implementation:

```csharp
using System;
using System.Xml;
using System.Collections;
using Microsoft.Azure.Workflows.RuleEngine;
using System.IO;
using System.Data;
using System.Data.SqlClient;
namespace MyApplication.FactRetriever
{
    public class myFactRetriever:IFactRetriever
    {
        public object UpdateFacts(RuleSetInfo rulesetInfo, RuleEngine engine, object factsHandleIn)
        {
            object factsHandleOut;
            if (factsHandleIn == null)
            {
                // Create .NET object instances.
                bookInstance = new Book();
                magazineInstance = new Magazine();

                // Create XML object instance.
                XmlDocument xd = new XmlDocument();

                // Load the XML document.
                xd.Load(@"..\myXMLInstance.xml");

                // Create and instantiate a TypedXmlDocument class instance.
                TypedXmlDocument doc = new TypedXmlDocument("mySchema",xd1);

                engine.Assert(bookInstance);
                engine.Assert(magazineInstance);
                engine.Assert(doc);
                factsHandleOut = doc;
            }
            else
                factsHandleOut = factsHandleIn;
                return factsHandleOut;
        }
    }
}
```

To include the following capabilities, write your own code implementation:

- Determine when to update the long-term facts.

- Track whichever rules engine instance uses whichever long-term facts.

## Specify a fact retriever for a ruleset

To set up fact retriever for your ruleset version, you can either [set the Fact Retriever property in the Microsoft Rules Composer](perform-advanced-ruleset-tasks.md#set-up-fact-retriever), or write your own code as shown in the following example, which uses a class named "MyFactRetriever" in the assembly named "MyAssembly":

```csharp
RuleEngineComponentConfiguration fr = new RuleEngineComponentConfiguration("MyAssembly", "MyFactRetriever");
RuleSet rs = new RuleSet("ruleset");

// Associate the execution configuration with a ruleset version.
RuleSetExecutionConfiguration rsCfg = rs.ExecutionConfiguration;
rsCfg.FactRetriever = factRetriever;
```

> [!NOTE]
>
> If you use a simple generic assembly name, such as "MyAssembly", as the 
> first parameter for the **RuleEngineComponentConfiguration** constructor, 
> the rules engine looks for the assembly in the application folder.

## Related content

- [Create rules with the Microsoft Rules Composer?](create-rules.md)
- [Test rulesets](test-rulesets.md)
- [Create an Azure Logic Apps Rules Engine project](create-rules-engine-project.md)
