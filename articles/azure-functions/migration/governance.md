---
title: Migrate governance from AWS Lambda to Azure Functions
description: Governance specification for migrating AWS Lambda to Azure Functions.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025  
ms.topic: conceptual
---

# Migrate governance from AWS Lambda to Azure Functions

|![Goal icon](../../migration/images/goal.svg) All policies, procedures, and controls applied to an existing AWS Lambda service are transferred and enforced when you migrate to Azure Functions, so you maintain equivalent compliance requirements without regression.|
|--| 

## Scope

` **Author note**: Capture the specfic scope for the Azure offering. For example, if this article covers multi-tenancy or bring-your-own compute host, mention the broader scope. If the article doesn't apply to specific scope that's part of Azure offering, note that scope as not covered.  Expect this section to be boilerplate for all design areas. `

This article provides a pre-migration assessment of AWS Lambda and its compatibility with Azure Functions. 

These aspects are covered in this article:

- End state of Azure Functions hosted in Flex Consumption plan, Premium plan, Dedicated plan, or Consumption plan.

These aspects are not covered in this article:

- Migration to a container hosting solution, such as through Container Apps.
- Hosting AWS Lambda containers in Azure.

## Discovery

` **Author note**: Use this section to help the reader understand the context of their workload. During the discovery phase, they will be able to justify why it's important to carry these over to Azure. Keep in mind that the answers will vary based on the reader's business needs and won't be covered in this article.`

Understand the existing organizational policies, workload polices, regulatory requirements, and governance reporting applied to your AWS Lamba service. These existing investments need to be migrated or adapted to maintain continuity in Azure Functions. Without a complete inventory of the existing governance implementation, you risk regressing in your governance posture.

&#9997; Document your existing governance and regulatory requirements and their application to your Lambda through these various discovery activities. 

### Assess the business requirements

- What are the external and internal governance settings on the Lambda? What was the intent for each?
- How will the responsibilities for governance transfer to Azure?
- What governance tooling is used to enforce policies in your Lambda?
- Who is responsible for validating your governance compliance after migration, and how will they expect to validate compliance?

### Key technical map

` **Author note**: Enumerate the typical and prominent features of Lambda governance. Try to achieve a one-to-one mapping of governance implementation. Make a note of gaps.` 

This table lists the common features of Lambda, their governance implementation on AWS, and the recommended equivalent in Azure. 

| Feature   | AWS implementation | Azure implementation | Migration strategy |
|-----------|--------------|----------------------|--------------------|
| Feature 1 | Description  | Description          | Built-in/custom    |
| Feature 2 | Description  | Description          | Built-in/custom    |
| ...       | ...          | ...                  | ...                |

&#9997; Use the preceding table as a foundation to gather the technical details of the current AWS deployment. Expand on this list by identifying specific elements from your implementation.

### How to collect information 

Here are some approaches on taking inventory of an existing governance implementations on AWS.

#### Source resources

Familiarize yourself with the Lambda governance implementation by using these resources:

` **Author note**: List the sources that will help the reader fill out the preceding table. Collect these sources form an AWS SME. Here are some typical examples.`
`- Your existing infrastructure as code artifacts`
`- Your documented processes, such as security or recovery playbooks` 
`- Architecture diagrams and architecture decision records (ADR).`
`- Software engineering documentation`

#### Tools and processes

` **Author note**:`
` - Provide instructions (or link to instructions) on how to enumerate current policies and controls applied to Lambda.`
` - Provide instructions on how to export typical governance reporting techniques for AWS Lambda.`

### Deviations

` **Author note**: Analyze the technical map and summarize the features that require decision making.`

Deviations reflect gaps when one-to-one mapping isn't feasible. You'll need to make decisions for, prioritizing minimal deviation to business requirements. Consider the potential benefits and drawbacks of each mitigation.

Here's the summarized view of the gaps identified in the technical map. 

| Feature   | Deviation | Impact | Mitigation |
|-----------|-----------|--------|------------|
| Feature 1 |Description| Impact to business requirements | How do you plan to address this during migration|
| Feature n |Description| Impact to business requirements | How do you plan to address this during migration|

&#9997; Use this list as a starting point and build on it by identifying specifics from your implementation. Clearly outline how to address any deviations as part of the migration process.

### Challenges

When planning a migration to Azure, expect challenges in understanding Azure expectations and how they align with the business requirements already achieved in the existing AWS solution running in production. This list presents some of those challenges. 

` **Author note**: Have a discussion with the SME on challenges faced in their customers' migrations in this area. Provide at least two points.`

- Potential Issue 1 - Description and mitigation.
- Potential Issue 2 - Description and mitigation.

## Azure resources

- Boilerplate: Link to essential built-in policies.
- Boilerplate: Link to essential documentation.

## Post-migration considerations

After you've migrated your Lambda to Azure Functions with a level of satisfaction that doesn't regress in existing governance controls, we recommend you explore additional governance features on Azure. This can help you in future requirements or help close gaps in areas where your workload is not currently meeting existing requirements.

- Item 1
- Item 2
- Item 3

&#9997; Create a list of optimization opportunities. Utilize the [Well-Architected Framework for Azure Functions](/azure/well-architected/service-guides/azure-functions) to evaluate the settings that can help you achieve a higher level of excellence.

## Next step

> [!div class="nextstepaction"]
> [Address $TOPIC in your AWS Lambda migration](./governance.md)
