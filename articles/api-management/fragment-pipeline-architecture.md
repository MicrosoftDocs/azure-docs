---
title: Architecture for Building Advanced Execution Pipelines with Policy Fragments
titleSuffix: Azure API Management
description: Foundational patterns for designing modular, scalable policy fragment architectures in Azure API Management with clear separation of concerns.
services: api-management
author: nicolela

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 02/10/2026
ms.author: nicolela 
---

# Architecture for building advanced execution pipelines with policy fragments

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

To build advanced pipeline scenarios with custom behavior executed throughout the request and response lifecycle, you can use [policy fragments](policy-fragments.md). Policy fragments are centrally managed, reusable XML snippets that can contain [policy](api-management-howto-policies.md) configurations and [policy expressions](api-management-policy-expressions.md). Policy fragments offer the following capabilities:

- **Phases**: Custom behavior can be distributed across inbound, backend, outbound, and error phases using fragments.
- **Sequential processing**: Fragments execute in a defined order with clear dependencies, enabling business logic to unfold step by step. Each fragment completes before the next starts, with no parallel execution.
- **Scalable architecture**: Fragments provide efficient execution and caching to support enterprise-scale scenarios. 
- **Maintainable design**: Clear separation of concerns between fragments makes the system easier to understand and maintain.

## Recommended patterns

Follow these four recommended patterns to build advanced pipelines using policy fragments:

### 1. Modularity

Design each fragment with a single, well-defined responsibility. Each fragment should focus on one specific concern such as authentication, logging, or rate limiting. For example, a fragment named `security-authentication` should only contain authentication behavior and logic.

### 2. Data sharing

Share data between fragments using [context variables](api-management-policy-expressions.md#ContextVariables).

- **Define data contracts**: Use context variables as data contracts for sequentially passing data between fragments. For example, a `security-authentication` fragment can set a context variable called `user-id` that contains the authenticated user's extracted ID, making it available for downstream fragments in the pipeline. Under the covers, each request maintains its own isolated `context.Variables` dictionary for storing context variables, ensuring thread-safe communication between fragments. See [Variable Management for Policy Fragments](fragment-variable-management.md) for details.

- **Cache shared data**: When multiple fragments need to access the same data, use cross-request caching to reduce parsing overhead and improve performance. See [Central Metadata Cache for Policy Fragments](fragment-metadata-cache.md) for implementation guidance.

### 3. Fragment execution behavior

Define execution behavior by inserting fragments sequentially in [product and API policy](api-management-howto-policies.md#scopes) definitions.

- **Sequential execution**: Insert fragments in the order they need to execute, to enable workflows where later fragments depend on variables set by earlier fragments.

- **Policy division**: Divide fragments across product and API policies according to scope of custom logic.

- **Shared fragments**: To avoid duplication and maintain consistent behavior, you can reuse the same fragment in both product and API policy levels.

For detailed guidance on coordinating fragment execution across policy scopes, see [Policy Injection and Coordination with Fragments](fragment-policy-coordination.md).

### 4. Performance optimization

Optimize fragments for maximum performance.

- **Keep fragments under 32-KB**: Stay within the [32-KB limit](policy-fragments.md) to ensure fast in-memory parsing and avoid slower file-based processing. The limit includes all whitespace, comments, and XML markup - not just the code logic. To stay under the limit:
  - Extract lengthy values, such as multi-line JSON, to [Named Values](api-management-howto-properties.md).
  - Use shorter variable names.
  - Split complex fragments into smaller ones.

- **Apply recommended patterns**: Follow the recommendations outlined earlier in this article. Most importantly:
  - Eliminate redundant parsing by implementing a metadata cache.
  - Use early exit patterns for health checks, authentication failures, variable existence, and other scenarios where definitive responses can be determined without further processing.
  - Follow processing optimizations such as minimizing variable access.

For comprehensive implementation details, see the guidance in the below [Related content](#related-content) section.

## Related content

- **[Variable management for policy fragments](fragment-variable-management.md)** - Comprehensive guidance on context variable handling, safe access patterns, and inter-fragment communication.
- **[Central metadata cache for policy fragments](fragment-metadata-cache.md)** - Implementation guidance for shared metadata caching patterns across fragments.
- **[Policy injection and coordination with fragments](fragment-policy-coordination.md)** - Fragment injection patterns and coordination between product and API policies.