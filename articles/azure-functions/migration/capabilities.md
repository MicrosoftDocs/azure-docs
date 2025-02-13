---
title: Migrate core capabilities from AWS Lambda to Azure Functions
description: Plan the migration of the core capabilities of AWS Lambda.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025  
ms.topic: conceptual
---

# Migrate core capabilities from AWS Lambda to Azure Functions

| :::image type="icon" source="../../migration/images/goal.svg"::: You're ready to migrate your serverless code to its new compute platform, Azure Functions; which will provide an equivelant customer and operations experience. |
| :-- |

## Scope

> [!NOTE]
> **Content developer**: Capture the specfic scope for the Azure offering. For example, if this article covers multi-tenancy or bring-your-own compute host, mention the broader scope. If the article doesn't apply to specific scope that's part of Azure offering, note that scope as not covered. Expect this section to be boilerplate for all design areas.

This article guides you in your pre-migration assessment of your existing AWS Lambda governance implementation, to prepare you for replatforming to Azure Functions.

These aspects are covered in this article:

- End state of Azure Functions hosted in Flex Consumption plan, Premium plan, Dedicated plan, or Consumption plan.

These aspects are not covered in this article:

- Migration to a container hosting solution, such as through Container Apps.
- Hosting AWS Lambda containers in Azure.

## Discovery

> [!NOTE]
> **Content developer**: Use this section to help the reader understand the context of their workload. During the discovery phase, they will be able to justify why it's important to carry these over to Azure. Keep in mind that the answers will vary based on the reader's business needs and won't be covered in this article. Enumerate all key topics that are special to this platform.

Understand how your workload depends on these core capabilities:

- Relevant area 1
- Relevant area 2
- Relevant area 3
- Relevant area 4

Your code is hosted on a serverless compute platform to take advantage of the defining characteristics of this "functions-as-a-service" style of compute. This platform offers responsive scaling, reactive triggering, code hosting flexibility, and a programming model to align with those capabilities. These capabilities need to migrate to Azure Functions. Without having an understanding of the core capabilities used in AWS Lambda and how they map to Azure, you risk spending time building workarounds or sacrifacing functionality.

&#9997; Document your existing reasons why AWS Lambda was choosen as your code hosting platform.

### Assess the business requirements

> [!NOTE]
> **Content developer**: Work with your SME to identify the core things this platform does and generate four questions on how you can evaluate the usage of this platform as it ties back to common functional and non-functional requirements for a workload that uses this service. For example, a web hosting platform fullfills requirements around accepting HTTP traffic, maybe filtering that traffic, processing multiple requests in parallel, and code hosting. While a data platform might be focused on indexing capabilities, query capabilities, SDK integrations.

- Question 1?
- Question 2?
- Question 3?
- Question 4?

### Key technical factors

> [!NOTE]
> **Content developer**: Enumerate the typical and prominent features of Lambda serverless hosting. Try to achieve a one-to-one mapping of implementation. Make a note of gaps.

This table lists the core serverless, code-hosting features of Lambda and the recommended equivalent in Azure.

| Feature   | AWS implementation | Azure implementation | Migration strategy |
|-----------|--------------|----------------------|--------------------|
| Feature 1 | Description  | Description          | Built-in/custom    |
| Feature 2 | Description  | Description          | Built-in/custom    |
| ...       | ...          | ...                  | ...                |

&#9997; Use the preceding table as a foundation to gather the technical details of the current AWS deployment. Expand on this list by identifying specific elements from your implementation.

### How to collect information 

Here are some approaches on taking inventory of an existing functionality being used on AWS.

#### Source resources

Familiarize yourself with the Lambda implementation by using these resources:

> [!NOTE]
> **Content developer**: List the sources that will help the reader fill out the preceding table. Collect these sources from an AWS SME. Here are some typical examples.
>
> - Your workload infrastructure as code artifacts
> - Your deployment automation infrastructure
> - Your workload's security documentation

Familiarize yourself with the Lambda implementation by using these resources:

> [!NOTE]
> **Content developer**: List the sources that will help the reader fill out the preceding table. Collect these sources form an AWS SME. Here are some typical examples.
>
> - Your existing infrastructure as code artifacts
> - Logic in deployment pipelines
> - Your documented processes, such as security or recovery playbooks
> - Architecture diagrams and architecture decision records (ADR).
> - Software engineering documentation

- Resource 1
- Resource 2

#### Tools and processes

> [!NOTE]
> **Content developer**: Collect these sources form an AWS SME.
>
> - Provide instructions (or link to instructions) on how to evaluate their current feature usage.

- Tool 1
- Tool 2
- Process 1
- Process 2

### [Code|Data\] migration planning

> [!NOTE]
> **Content developer**: Depending on the platform, if not already covered in an above section, get into some specific concerns as it relates to the code running on the platform or the data hosted in the platform. What does someone planning a migration need to know?

AS NEEDED

### Deviations

> [!NOTE]
> **Content developer**: Analyze the technical map and summarize the features that require decision making.

Deviations reflect gaps when one-to-one mapping isn't feasible. You'll need to make decisions for, prioritizing minimal deviation to business requirements. Consider the potential benefits and drawbacks of each mitigation.

Here's the summarized view of the gaps identified in the technical map. 

| Feature   | Deviation | Impact | Mitigation |
|-----------|-----------|--------|------------|
| Feature 1 |Description| Impact to business requirements | How do you plan to address this during migration|
| Feature n |Description| Impact to business requirements | How do you plan to address this during migration|

&#9997; Use this list as a starting point and build on it by identifying specifics from your implementation. Clearly outline how to address any deviations as part of the migration process.

### Challenges

When planning a migration to Azure, expect challenges in understanding Azure expectations and how they align with the business requirements already achieved in the existing AWS solution running in production. This list presents some of those challenges. 

> [!NOTE]
> **Content developer**: Have a discussion with the SME on challenges faced in their customers' migrations in this area. Provide at least two points.

- Potential Issue 1 - Description and mitigation.
- Potential Issue 2 - Description and mitigation.

## Azure resources

- Boilerplate: Link to essential documentation for these core features.
- Boilerplate: Link to the [WAF service guide](/azure/well-architected/service-guides/?product=popular) for this service.

## Post-migration considerations

After you've migrated your Lambda to Azure Functions with a level of satisfaction that doesn't regress in existing core functionality, we recommend you explore additional capabilities in Azure Functions. This can help you in future requirements or help close gaps in areas where your workload is not currently meeting existing requirements.

- Item 1
- Item 2
- Item 3

&#9997; Create a list of optimization opportunities. Utilize the [Well-Architected Framework for Azure Functions](/azure/well-architected/service-guides/azure-functions) to evaluate the settings that can help you achieve a higher level of excellence.

## Next step

> [!div class="nextstepaction"]
> [Address $TOPIC in your AWS Lambda migration](./governance.md)

