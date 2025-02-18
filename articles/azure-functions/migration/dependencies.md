---
title: Migrate dependencies associated with AWS Lambda to Azure Functions
description: Dependencies specification for migrating AWS Lambda to Azure Functions.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025
ms.topic: conceptual
---

# Migrate dependencies associated with AWS Lambda to Azure Functions


## Scope

> [!NOTE]
> **Content developer**: Capture the specfic scope for the Azure offering. For example, if this article covers multi-tenancy or bring-your-own compute host, mention the broader scope. If the article doesn't apply to specific scope that's part of Azure offering, note that scope as _Not Covered_. Expect this section to be boilerplate for all design areas.

This article guides you in your pre-migration assessment of your AWS Lambda dependencies, to prepare you for replatforming to Azure Functions.

These aspects are covered in this article:

- End state of Azure Functions hosted in Flex Consumption plan, Premium plan, Dedicated plan, or Consumption plan.
- Azure Virtual Network capabilities integration with Azure Functions. 
- Underlying compute choices, operating system, instructions set choices in Azure Functions.
- State-related settings that map to Azure Functions.

These aspects are not covered in this article:

- Migration to a container hosting solution, such as through Container Apps.
- Hosting AWS Lambda containers in Azure.

## Discovery

> [!NOTE]
> **Content developer**: Use this section to help the reader understand the context of their workload. During the discovery phase, they will be able to justify why it's important to carry these over to Azure. Keep in mind that the answers will vary based on the reader's business needs and won't be covered in this article. Enumerate all of the typical capabilities where there are crossovers with networking, state, compute choices on the Lambda service. These areas are where the customer needs to document their current state and learn about the equivelant solutions in Azure. Consider the following:
>
> - Ephemeral storage for Lambda functions and Amazon S3 dependencies
> - Private networks with Amazon Virtual Private Cloud (Amazon VPC)
> - Memory settings, instruction set choices 
> - Code dependencies that form Lambda layers

Understand the existing networking, storage, compute, and code dependencies configured in your AWS Lambda service:

- Relevant area 1
- Relevant area 2
- Relevant area 3
- Relevant area 4

&#9997; Document your existing AWS dependencies: networking, state, memory, and code layers.


### Assess the business requirements

- How is private connectivity ensured during migration?
- How do the core networking aspects map to Azure constructs, such as point of presence, caching, routing intelligence, TLS offloading, and load balancing?
- How is ingress traffic secured in the new environment?
- How does Azure's data tiering compare to AWS Lambda's state management?
- How are redundancy requirements transferred to Azure?
- What are the encryption requirements, and who manages the keys in Azure?
- What backup solutions are used on AWS for Lambda, and how do they translate to Azure?
- What are the compute and memory considerations, and are there equivalent options to support Lambda's operating system and instruction set choices in Azure?
- How does Azure support the scalability requirements of AWS Lambda?
- How does the code layering of AWS Lambda translate to Azure Functions?

### Key technical factors

> [!NOTE]
> **Content developer**: Enumerate the typical networking, state, and compute-related capabilities of Lambda and the function. Try to achieve a one-to-one mapping in Azure Functions. Make a note of gaps.`

This table lists the common capabilities used in Lambda functions on AWS, and the recommended equivalent in Azure.

| Feature   | AWS implementation | Azure implementation | Migration strategy |
|-----------|--------------|----------------------|--------------------|
| Feature 1 | Description  | Description          | Built-in/custom    |
| Feature 2 | Description  | Description          | Built-in/custom    |
| ...       | ...          | ...                  | ...                |

&#9997; Use the preceding table as a foundation to gather the technical details of the current AWS deployment. Expand on this list by identifying specific elements from your implementation.

### How to collect information

Here are some approaches on taking inventory of an existing implementations on AWS.

#### Source resources

Familiarize yourself with the Lambda dependencies by using these resources:

> [!NOTE]
> **Content developer**: List the sources that will help the reader fill out the preceding table. Collect these sources from an AWS SME. Here are some typical examples.
>
> - Ephemeral storage setting
> - Instruction set architecture
> - Lambda functions access to Amazon VPC
> - File system access
> - Function scaling
> - Code layering

- Resource 1
- Resource 2

#### Tools and processes

> [!NOTE]
> **Content developer**: Collect these sources from an AWS SME.
>
> - Provide instructions (or link to instructions) on how to enumerate settings for networing, state, compute, code configuration for Lambda functions.


- Tool 1
- Tool 2
- Process 1
- Process 2

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

- Boilerplate: Link to essential Functions platform/service logging & metrics documentation.
- Boilerplate: Link to essential Functions application logging documentation.
- Boilerplate: Link to other essential documentation.

## Post-migration considerations

After you've migrated your Lambda to Azure Functions with a level of satisfaction that doesn't regress in technical capabilities, we recommend you explore additional features on Azure. This can help you in future requirements or help close gaps in areas where your workload is not currently meeting existing requirements.

- Item 1
- Item 2
- Item 3

&#9997; Create a list of optimization opportunities. Utilize the [Well-Architected Framework for Azure Functions](/azure/well-architected/service-guides/azure-functions) to evaluate the settings that can help you achieve a higher level of excellence.

## Next step

> [!div class="nextstepaction"]
> [Address $TOPIC in your AWS Lambda migration](./governance.md)

