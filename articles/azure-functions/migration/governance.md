---
title: Migrate governance from AWS Lambda to Azure Functions
description: Governance specifications and best practices for migrating AWS Lambda to Azure Functions.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025  
ms.topic: conceptual
---

# Migrate governance from AWS Lambda to Azure Functions

**Goal**: All policies, procedures, and controls applied to your existing AWS Lambda solution are transferred and enforced when you migrate to Azure Functions, so you maintain equivalent compliance requirements without regression.

## Scope

> Author note: This would be the same on many articles, so maybe doesn't belong in each article. Only include this section if the Governance page is going to be broader or narrower than the top-level defined scope.  For example, if this article addresses multi-tenancy or addresses BYO compute hosting, then you'd mention how the scope is broader than the other articles in the series. Also, as an example, if this article doesn't apply to Flex Conusmption plan, then you'd mention how this article's specific scope is narrower than the other articles in the series.

This article specifically addresses workloads being replatformed to run in Azure Functions hosted as Flex Consumption plan, Premium plan, Dedicated plan, or Consumption plan. This article does not address migration to own container hosting solution, such as through Container Apps; likewise, this article doesn't address hosting AWS Lambda containers in Azure.

## Discovery

> Author note: Use this section to set the context for what the reader is going to need to know about their existing deployments, and why that's important. We are going to ask them to do some discovery tasks, let them know why it's important to do this for a successful migration to Azure Functions.

It's essential to thoroughly understand the existing organizational policies, workload polices, regulatory requirements, and governance reporting applied to your AWS Lamba deployment.  These existing investments need to be replicated or adapted to maintain continuity in Azure Functions. Without a complete inventory of the existing governance implementation, you risk regressing in your governance posture.

Document your existing governance and regulatory requirements applied to your AWS Lambda deployment through these various discovery activities.

### Assess the business requirements

By addressing these points, you can determine the governance responsibilities and maintain continuity in Azure Functions.

- What are the external and internal governance settings on the AWS Lambda deployment? What was the intent for each?
- How will the responsibilities for governance transfer to Azure?
- What governance tooling is used to enforce policies in your AWS Lambda deployment?
- Who is responsible for validating your governance compliance after migration, and how will they expect to validate compliance?

### Key factors in your existing governance implementation

> Author note: Enumerate the typical and prominent features AWS Lambda governance. Try to achieve a one-to-one mapping of governance implementation. Make a note of gaps, following this [template](). 

This table lists the features that typical AWS Lambda deployments for their governance implementations and provides a mapping to how that is recommended to be replicated in Azure, and any migration tips for that specific feature.

| Feature   | Source state | Azure implementation | Migration strategy |
|-----------|--------------|----------------------|--------------------|
| Feature 1 | Description  | Description          | Built-in/custom    |
| Feature 2 | Description  | Description          | Built-in/custom    |
| Region(s) | single region/multi-region   | ...                  | ...                |
| ...       | ...          | ...                  | ...                |

#### How to collect information 


Customers who have successfully migrated have found using the following approaches helpful to take inventory of their existing governance implementations on AWS Lambda.

##### Tools and processes

- Provide instructions (or link to instructions) on how to enumerate current policies and controls applied to AWS Lambda.
- Provide instructions on how to export typical governance reporting techniques for AWS Lambda.

##### Source resources


To get a complete picture of your current AWS Lambda governance implementation, be sure to consult the following resources:

- Your existing infrastructure as code artifacts
- Your documented processes, such as security or recovery playbooks 
- Architecture diagrams and architecture decision records (ADR).
- Software engineering documentation

## Best practices

This section outlines the best practices for identifying and managing governance settings, responsibilities, and policies during the migration process. 

#### Recommendations
- Recommendation 1 -  Description and rationale.
- ...
- Recommendation 5 -  Description and rationale.
##### Tooling recommendations

Microsoft recommends you use the following tools to help you successfully migrate your governance controls and reporting to Azure and validate their effectiveness.

- Recommendation 1
- Recommendation 2


#### Tradeoffs

Tradeoffs involve balancing different factors, when one-to-one mapping isn't feasible. Treat those features as gaps that you'll need to make decisions for, keeping in mind minimal deviation of the source's fullfiments to business requirements. Considering the potential benefits and drawbacks of each gap discovered in the technical footprint.

- Tradeoff 1 -  Description and impact.
- Tradeoff 2 -  Description and impact.

#### Challenges

When planning a migration to Azure, a critical challenge is understanding the end state expectations while mapping to business requirements as they are implemented on AWS. 

- Potential Issue 1 - Description and mitigation.
- Potential Issue 2 - Description and mitigation.


## Optimizations

After you ensure your replatforming from AWS Lambda to Azure Functions doesn't regress in existing governance controls, we recommend you explore additional governance features offered by Azure and Azure Functions. This can help you in future requirements or help close gaps in areas where your workload is not currently meeting existing requirements.

- Item 1
- Item 2
- Item 3

## Migration resources

- Boilerplate: Link to essential built-in policies.
- Boilerplate: Link to essential documentation.

## Next step

> [!div class="nextstepaction"]
> [Address $TOPIC in your AWS Lambda migration](./governance.md)
