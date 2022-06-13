---
title: Azure Policy glossary
description: A glossary defining the terminology used throughout Azure Policy
author: timwarner-msft
ms.author: timwarner
ms.topic: conceptual
ms.date: 06/10/2022
---
# Azure Policy glossary

The term _policy_ is used widely in virtually every industry and is associated with many use cases. Azure Policy has specific vocabulary and applications that are not to be confused with policy embedded in other contexts.

This glossary provides definitions and descriptions of terms used by Azure Policy.

## Alias
A field used in policy definitions that maps to a resource property.
## Applicability
Resources that are considered for assessment depending on the policy rule
## Assignment
A JSON-defined object that determines the resources for which a definition is applied on. Learn more about the policy definition JSON structure here:[Azure Policy definition structure](./concepts/definition-structure.md)
## Azure Policy
A service that enables users to govern Azure resources by enforcing organizational standards and assessing compliance at scale
## Built-in
<!-- to be added -->
## Category
Metadata property on the policy definitions that highlights what resource provider the category is focused on (For example: Compute, Storage, Monitoring)
## Compliance state
Describes a resource's adherence to assigned policies. Can be compliant, non-compliant, exempt,conflict, not started, or protected
## Compliant
A compliance state which indicates that a resource conformed to the policy rule in the policy definition
## Control
Another term used for _group_, specifically in the context of regulatory compliance
## Custom
Describes a definition that is authored by a policy user. This is the alternative to a built-in
## Definition
A JSON-defined object that describes a policy, including resource compliance requirements and the effect to take if they are violated. Learn more about the policy definition JSON structure here:[Azure Policy definition structure](./concepts/definition-structure.md)
## Definition location
<!-- to be added -->
## Effect
<!-- to be added -->
## Enforcement
Describes the preventative action that certain types of policy effects can have
## Enforcement mode
A property of a policy assignment that allows users to enable or disable enforcement of certain policy effects like deny, while still evaluating for compliance and providing logs
## Evaluation
Describes the process Azure Policy uses in scanning resources in the cloud environment to determine applicability and compliance of assigned policies
## Event
<!-- to be added -->
## Exclusion
also called _NotScopes_; A property in the assignment that exclude scopes from assignments. Excluded scopes do not appear on the the Azure portal Compliance blade
## Exempt
A compliance state that indicates that a resource is covered by an exemption
## Exemption
<!-- to be added -->
## Group
A sub-collection of policy definition IDs within an initiative definition
## Identity
A system- or user-assigned managed identity used for policy remediation
## Initiative
Also known as a _policy set_. A type of policy definition that consist sof a collection of policy definition IDs. Used for centralization across common goal definitions that can share parameters, identities and be managed in a single assignment
## JSON
Abbreviation for JavaScript Object Notation (JSON). Used by Azure Policy to define policy objects
## Machine configuration
<!-- to be added -->
## Manual attestation
<!-- to be added -->
## Mode
Property on the policy definition that determines which resource types are evaluated for a policy definition. It is configured depending on whether the policy is targeting an Azure Resource Manager (ARM) property defined in an ARM template or Resource Provider (RP) property.
## Non-compliant
A compliance state that indicates that a resource did not conformed to the policy rule in the policy definition.
## Policy rule
The component of a policy definition that describes resource compliance requirements through logic-based conditional statements, as well as the effect taken if those conditions are not met. It is composed of _"_if_ and _then_ blocks.
## Policy state
Describes the aggregated compliance state of a policy assignment
## Regulatory compliance
<!-- to be added -->
## Remediation
A JSON-defined object that when triggered corrects violating resources. Remediation is only
automatic for resource during create or update. Existing resource need to be remediated by
triggering a remediation task.
## Remediation task
<!-- to be added -->
## Scope
the set of resources that an assignment applies to; for example: subscription, management group, or resource group
## Template info
How you define your constraint template in your policy definition

## Next steps

To get started with Azure Policy, see [What is Azure Policy?](./overview.md).
