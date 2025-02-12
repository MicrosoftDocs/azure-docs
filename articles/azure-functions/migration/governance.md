---
title: Migrate governance from AWS Lambda to Azure Functions
description: Governance specifications and best practices for migrating AWS Lambda to Azure Functions.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025  
ms.topic: conceptual
---

# Migrate governance from AWS Lambda to Azure Functions

The primary goal of governance migration is to ensure that all policies, procedures, and controls related to AWS Lambda are effectively transferred and enforced when using Functions Functions in an Azure environment, maintaining compliance requirements expected for the workload.

## Discovery

### Workload assessment

- What are the external and internal governance settings on the Lambda instance, what’s the intent?
- How will the responsibilities for governance transfer to Azure?
- Are there any policies related to multitenancy use of the Lambda instance?
- How’s governance reported for this Lambda instance?
- What governance tooling is used to enforce policies in the Lambda instance?

### Technical footprint

Enumerate the features under governance.

| Feature   | Source state | Azure implementation | Migration strategy |
|-----------|--------------|----------------------|--------------------|
| Feature 1 | Description  | Description          | Built-in/custom    |
| Feature 2 | Description  | Description          | Built-in/custom    |
| ...       | ...          | ...                  | ...                |

### Information collection

Tools

- Steps to enumerate current policies and controls.
- How to retrieve policies from the source environment.

Source resources

- Refer SRE playbooks
- Architecture diagrams

Technology options

- Recommended Ttools for the leaner to evaluate available for governance migration.

### Best practices

#### Recommendations
- Recommendation 1 -  Description and rationale.
- …
- Recommendation 5 -  Description and rationale.


#### Tradeoffs

- Tradeoff 1 -  Description and impact.
- Tradeoff 2 -  Description and impact.

#### Challenges

- Potential Issue 1 - Description and mitigation.
- Potential Issue 2 - Description and mitigation.

## Migration resources

- Boilerplate: Link to essential built-in policies and documentation.