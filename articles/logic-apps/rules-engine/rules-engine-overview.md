---
title: Decision Management with Azure Logic Apps Rules Engine
description: Learn about decision management and business logic integration with Standard logic app workflows using the Azure Logic Apps Rules Engine.
services: logic-apps
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewers: estfan, azla
ms.topic: concept-article
ms.date: 03/10/2026
ms.date-cycle: 1095-days
ms.custom:
  - build-2025
#Customer intent: As an integration developer who works with Azure Logic Apps, I want to learn about integrating business logic and decision management capabilities with Standard workflows in Azure Logic Apps.
---

# Decision management and business logic integration using the Azure Logic Apps Rules Engine

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

As an integration developer, you need to manage frequent changes to business logic without rewriting code or redeploying applications. The Azure Logic Apps Rules Engine gives you a low-code way to define, update, and apply business rules directly in your Standard logic app workflows.

Organizations across domains such as finance, healthcare, insurance, and telecommunications make decisions every day. This routine means business logic often changes, affects different applications or software, and quickly requires implementation. However, when your organization has clear business rules that govern business logic, your organization can make decisions more quickly and easily. Business rules are guidelines that shape how your organization operates. You can find them in manuals, contracts, agreements, or as unwritten institutional knowledge or employee expertise.

With a business rules engine, you can create and update business rules without writing code or restarting your applications. Traditional programming languages such as C++, Java, COBOL, Python, JavaScript, or C# are designed for programmers and require significant time, expertise, or both to update. So, non-programmers find it hard to change the business rules that guide how software applications work. Business rules engines solve this problem by offering a low-code environment where you can build applications easier and faster.

## Rules engines in a world of artificial intelligence (AI)

In a world of AI that essentially follows a probabilistic approach, rules engines are vital because they provide consistency, clarity, and compliance across different business goals. When you use rules with a workflow in Azure Logic Apps, you can:

- Define the logic, constraints, and policies that govern how to process, validate, and exchange data across systems, while you avoid incorrect information from AI.

- Enforce compliance by making sure that applications follow the regulations and standards of their industries and markets.

- Manage business logic independently from your code without having to change your workflow. This benefit reduces complexity and maintenance costs while increasing agility and scalability.

To get started, see [Create an Azure Logic Apps Rules Engine project](create-rules-engine-project.md). 

## Rules engine benefits

A decision management rules engine can offer many benefits, for example:

| Benefit | Description |
|---------|-------------|
| Flexibility | Change business rules without changing the code or redeploying logic app workflows. |
| Reliability | Make sure that certain decisions or actions always follow predefined and predictable logic, which is crucial in regulated industries or safety-critical applications. |
| Performance | Handle decisions instantly for routine or well-understood business cases without invoking AI models. |
| Governance | Simplify compliance by providing a centralized, auditable repository with business rules that you can easily access and verify. |
| Collaboration and reusability | Share and reuse business rules across different projects and domains. |

## Azure Logic Apps Rules Engine

The Azure Logic Apps Rules Engine is a *decision management inference engine* that lets you integrate declarative, semantically rich, and easily readable rules with your Standard logic app workflows. These rules can operate on multiple different data sources and interact with data exchanged by all the available connectors in Standard workflows. This design pattern promotes code reuse, design simplicity, and business logic modularity.

The Rules Engine supports the following core concepts:

- *Facts*

  Facts provide the data that rules evaluate. XML and .NET objects are the native data sources available today for the Rules Engine. You use these data sources to construct rules from *rulesets*.

- *Rulesets*

  Rulesets are small building blocks of business logic. You combine rulesets to define the decision logic for your workflow.

:::image type="content" source="media/rules-engine-overview/rules-engine.png" alt-text="Conceptual diagram that shows the Azure Logic Apps Rules Engine." lightbox="media/rules-engine-overview/rules-engine.png":::

To set up a Standard logic app resource with a Rules Engine project, see [Create an Azure Logic Apps Rules Engine project](create-rules-engine-project.md).

> [!NOTE]
>
> The Rules Engine is based on the [Rete algorithm](https://ieeexplore.ieee.org/document/5454996).

## Next step

> [!div class="nextstepaction"]
> [Create an Azure Logic Apps Rules Engine project](create-rules-engine-project.md)

## Related content

- [Create rules with the Microsoft Rules Composer](create-rules.md)
- [Execution optimization for Azure Logic Apps Rules Engine](rules-engine-optimization.md)
