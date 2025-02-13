---
title: Migrate monitoring assets from AWS Lambda to Azure Functions
description: Monitoring specification for migrating AWS Lambda to Azure Functions.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025  
ms.topic: conceptual
---

# Migrate monitoring assets from AWS Lambda to Azure Functions

|![Goal icon](../../migration/images/goal.svg) Transfer the monitoring logs and metrics emitted from the existing AWS Lambda service and its hosted functions to Azure Functions. Ensure that all monitoring sinks in the current AWS monitoring stack are connected to their equivalent sinks on Azure. Transition monitoring alerts and visualizations to operate on Azure, maintaining equivalent observability setup on Azure without any regression.|
|--| 

## Scope

` **Author note**: Capture the specfic scope for the Azure offering. For example, if this article covers multi-tenancy or bring-your-own compute host, mention the broader scope. If the article doesn't apply to specific scope that's part of Azure offering, note that scope as not covered.  Expect this section to be boilerplate for all design areas. `

This article provides a pre-migration assessment of AWS Lambda and its monitoring capabilities with Azure Functions. 

These aspects are covered in this article:

- End state of Azure Functions hosted in Flex Consumption plan, Premium plan, Dedicated plan, or Consumption plan.
- Azure Monitor integration with Azure Functions.

These aspects are not covered in this article:

- Migration to a container hosting solution, such as through Container Apps.
- Hosting AWS Lambda containers in Azure.

## Discovery

` **Author note**: Use this section to help the reader understand the context of their workload. During the discovery phase, they will be able to justify why it's important to carry these over to Azure. Keep in mind that the answers will vary based on the reader's business needs and won't be covered in this article.`

Understand the observability behavior of the Lambda service and function monitoring, which focuses on the code running on Lambda. The goal is to catalog the key CloudWatch logs and metrics with Lambda. Additionally, it's important to understand the data sinks that collect monitoring data. Take note of AWS CloudTrail or other tools used for collection and analysis. The alerting strategy and reporting use cases should also be covered, along with external health checks and application performance monitoring tools.

&#9997; Document your existing AWS monitoring stack: Data sources, Collection and storage, Analysis, Visualization, and Alerting. 

### Assess the business requirements

- What are the core aspects monitored for the Lambda service, and how does Azure address these monitoring needs?
- What monitoring sinks are connected to the service?
- What APM tools were used for function monitoring?
- Who consumed monitoring data, for what purpose, and the which tools were used. 

### Key technical factors

` **Author note**: Enumerate the typical monitoring capabilities of Lambda and the function. Try to achieve a one-to-one mapping in Azure Monitor. Make a note of gaps.` 

This table lists the common monitoring tools used to monitor Lambda functions on AWS, and the recommended equivalent in Azure. 

| Feature   | AWS implementation | Azure implementation | Migration strategy |
|-----------|--------------|----------------------|--------------------|
| Feature 1 | Description  | Description          | Built-in/custom    |
| Feature 2 | Description  | Description          | Built-in/custom    |
| ...       | ...          | ...                  | ...                |

&#9997; Use the preceding table as a foundation to gather the technical details of the current AWS deployment. Include AWS sources that emit monitoring data, data storage, analysis tools, dashboards, and alerts. Expand on this list by identifying specific elements from your implementation.

### How to collect information 

Here are some approaches on taking inventory of an existing monitoring implementations on AWS.

#### Source resources

Familiarize yourself with the Lambda monitoring by using these resources:

` **Author note**: List the sources that will help the reader fill out the preceding table. Collect these sources from an AWS SME. Here are some typical examples.`
`- Function logs and metrics through CloudWatch`
`- CloudTrail logs` 
`- Lamdda Insights`
`- Application Signals`
`- Software engineering documentation`

#### Tools and processes

` **Author note**: Collect these sources from an AWS SME.`
` - Provide instructions (or link to instructions) on how to view logs and metrics for Lambda functions.`
` - Provide instructions on how to view activity logs on AWS Lambda.`
` - Provide information about logging formats`

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

- Boilerplate: Link to essential Functions metrics.
- Boilerplate: Link to essential documentation.

## Post-migration considerations

After you've migrated your Lambda to Azure Functions with a level of satisfaction that doesn't regress in existing observability practices, we recommend you explore additional features on Azure. This can help you in future requirements or help close gaps in areas where your workload is not currently meeting existing requirements.

- Item 1
- Item 2
- Item 3

&#9997; Create a list of optimization opportunities. Utilize the [Well-Architected Framework for Azure Functions](/azure/well-architected/service-guides/azure-functions) to evaluate the settings that can help you achieve a higher level of excellence.
