---
title: Decision management with Azure Logic Apps Rules Engine
description: Learn about decision management and business logic integration with Standard logic app workflows using the Azure Logic Apps Rules Engine.
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.topic: conceptual
ms.date: 01/27/2025

#CustomerIntent: As an integration developer, I want to learn about integrating business logic and decision management capabilities with Standard workflows in Azure Logic Apps.
---

# Decision management and business logic integration using the Azure Logic Apps Rules Engine (Preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Organizations deal with decisions every day, but when you have clear business rules that govern your organization's business logic, these decisions are easier to make. Business rules are the guidelines that shape how a business operates. You can find these rules in manuals, contracts, or agreements, or they can be the unwritten knowledge or expertise of employees. Business rules change over time and affect different types of applications. Many business domains, such as finance, healthcare, insurance, transportation, and telecommunications need to communicate their business rules to their staff so they can implement them in software applications.

Traditional programming languages, such as C++, Java, COBOL, Python, JavaScript, or C#, are designed for programmers. So, non-programmers have difficulties changing the business rules that guide how software applications work. These languages also require much time and work to create and update applications. However, business rules engines solve this problem by offering a low-code environment that lets you build applications faster and easier. You can use a rules engine to create and change business rules without having to write code or restart the applications that use them.

## Rules engines in a world of microservices

In a world of microservices that promotes decoupling, rules engines are vital because they provide consistency, clarity, and compliance across different services and domains. Rules help define the logic, constraints, and policies that govern how to process validate, and exchange data across microservices. Rules also help you make sure that applications follow the regulations and standards of their respective industries and markets. By using a rules engine, you can manage and update business logic independently from the code and the infrastructure of the microservices. This way, you can reduce the complexity and maintenance costs of your applications and increase their agility and scalability.

## Rules engine benefits

A decision management rules engine can offer many benefits, for example:

- Increases application flexibility and adaptability by empowering users to change the business rules without modifying the code or redeploying microservices.

- Improves application performance and efficiency by offloading complex and computationally intensive decision-making to the rules engine from microservices.

- Enhances application consistency and reliability by ensuring that the same business rules are applied across different microservices and cloud environments.

- Facilitates application governance and compliance by providing a centralized and auditable repository of the business rules that you can easily access and verify.

- Enables application collaboration and innovation by empowering users to share and reuse business rules across different projects and domains.

## Azure Logic Apps Rules Engine

The Azure Logic Apps Rules Engine is a *decision management inference engine* in Azure Logic Apps, which provides the capability for customers to build Standard workflows in Azure Logic Apps and integrate readable, declarative, and semantically rich rules that operate on multiple data sources. The native data sources available today for the Rules Engine are XML and .NET objects. These data sources are called "facts" and are used to construct rules from small building blocks of business logic or "rulesets". The Rules Engine can also interact with the data exchanged by all the connectors available for Standard logic app resources. This design pattern promotes code reuse, design simplicity, and business logic modularity.

:::image type="content" source="media/rules-engine-overview/rules-engine.png" alt-text="Conceptual diagram shows the Azure Logic Apps Rules Engine." lightbox="media/rules-engine-overview/rules-engine.png":::

For more information on how to configure a Standard logic app resource with a Rules Engine project, see [Create an Azure Logic Apps Rules Engine project](create-rules-engine-project.md).

> [!NOTE]
>
> This feature is based on the [Rete algorithm](https://ieeexplore.ieee.org/document/5454996).

## Related content

- [Create rules with the Microsoft Rules Composer](create-rules.md)
- [Create an Azure Logic Apps Rules Engine project](create-rules-engine-project.md)
- [Optimization for Azure Logic Apps Rules Engine execution](rules-engine-optimization.md)
