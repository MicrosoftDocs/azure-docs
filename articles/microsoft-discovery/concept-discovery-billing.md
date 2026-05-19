---
title: Microsoft Discovery billing overview
description: Learn about the Microsoft Discovery pricing and billing model, including what counts as a User Message, which operations are billable, and how charges appear in Azure.
author: DaveMuhich
ms.author: damuhic
ms.service: azure
ms.topic: concept-article
ms.date: 04/17/2026

#CustomerIntent: As a platform administrator or researcher, I want to understand how Microsoft Discovery billing works so that I can estimate costs and manage usage within my Azure subscription.
---

# Microsoft Discovery billing overview

Microsoft Discovery uses a billing model with two components:

- **Usage-based** billing for the underlying compute and storage Azure resources associated with your workspace and projects.
- **Message-based** billing for agent-driven runtime operations, tracked as *User Messages*.

This model lets you pay only for what you use and track spending with precision through Azure.

## What is a User Message?

A **User Message** is the unit of billing for Microsoft Discovery runtime usage. One User Message is counted for each billable operation - any action that creates, updates, deletes, runs, submits, or cancels work. Discovery aggregates these totals by the hour.

Read-only calls such as GET, list, status checks, and log retrieval are **not** billed. Billing covers **runtime (data-plane) usage** only, not resource management (control-plane) operations.

> [!NOTE]
> For billing calculations, treat each User Message as equivalent to 10 backend operations. Use this conversion when estimating usage or reconciling message-based charges with operation-based meters.
>
> **Example:** 1 message = 10 backend operations. At $0.20 per message, 100 messages = $20.00.

## Billable and non-billable operations

Each User Message is billed at $0.20 (adjusted to your local currency). The following table shows which operations are billable:

| Operation | Billable? |
|---|---|
| Create, update, or delete an investigation (PUT / PATCH / DELETE `/projects/{projectName}/investigations/{investigationName}`) | Yes |
| Create a conversation (POST `/conversations`) | Yes |
| Update a conversation (PATCH `/conversations/{name}`) | Yes |
| Send a message (POST `/conversations/{name}/messages`) | Yes |
| Submit user input (`/messages/{name}:submitUserInput`) | Yes |
| Cancel an operation (`...:cancel`) | Yes |
| Submit a job (POST `/tools/projects/{projectName}:run`) | Yes |
| Cancel a job (POST `/tools/projects/{projectName}/operations/{operationId}:cancel`) | Yes |
| List conversations or messages (GET `...`) | No |
| Check operation status or logs (GET `.../operations/{id}`, GET `.../logs`) | No |

The same pattern applies to Knowledge Bases: create, update, delete, and run operations are billable; get, list, and status operations aren't.

> [!NOTE]
> For jobs running on the Microsoft Discovery Supercomputer, you're billed for the act of submitting the job, not for the duration or compute consumed. Underlying compute and storage resources is billed separately in Azure.

### Example conversation flow and billing events

The following example shows a typical investigation session and which steps generate billable events:

| User prompt | Backend API (typical) | Billable | User Messages |
|---|---|---|---|
| "Create a new investigation 'tumorclassifierv2' in project 'genomics'" | PUT `/projects/{projectName}/investigations/{investigationName}` | Yes | 0.1 |
| "Start a conversation for this investigation called 'featureSearch'" | POST `/conversations` | Yes | 0.1 |
| "Run feature selection on Cohort A for the top 50 genes." | POST `/conversations/{name}/messages` and POST `/tools/projects/{projectName}:run` | Yes | 0.2 |
| "What's the status?" | GET `/tools/projects/{projectName}/operations/{operationId}` | No | 0 |
| "Cancel that run." | POST `/tools/projects/{projectName}/operations/{operationId}:cancel` | Yes | 0.1 |
| "Use LASSO with alpha 0.1 instead; go ahead." | POST `/conversations/{name}/messages/{messageName}:submitUserInput` | Yes | 0.1 |
| "Show me the logs for the latest message." | GET `/conversations/{name}/messages/{messageName}/logs` | No | 0 |
| "Update the investigation description to 'CohortA FS with LASSO alpha 0.1'" | PATCH `/projects/{projectName}/investigations/{investigationName}` | Yes | 0.1 |
| "List my investigations." | GET `/projects/{projectName}/investigations` | No | 0 |
| "Delete the 'tumorclassifierv2' investigation." | DELETE `/projects/{projectName}/investigations/{investigationName}` | Yes | 0.1 |

**Session totals:** 8 billable events (0.8 User Messages), 3 non-billable read events.

## How charges appear on your bill

Each billable action is tied to the Azure resource you're working with, such as your Discovery project or Bookshelf. That resource's Azure subscription receives the charge.

The billing unit is **Microsoft Discovery - User Messages**. Pricing is set per region.

**Rough order of magnitude estimate:**

Estimated cost ≈ (number of billable actions) × (price per User Message in your region)

To review your actual spend, an Azure subscription owner can open **Cost Management + Billing** in the Azure portal and filter to the relevant Microsoft Discovery resource.

## Frequently asked questions

**Do GET requests ever incur charges?**
No. Read, list, status, and log operations aren't billed.

**Do failed actions get billed?**
The goal is to bill only succeeded actions. Services verify resource state before recording usage.

**Are underlying Azure resources billed separately?**
Yes. Azure resources you deploy, such as compute and storage are billed in Azure as usual. Microsoft Discovery billing covers only API runtime usage (User Messages).

## Tips to manage usage

- Submit or run only when you intend to change or execute something.
- Combine steps where possible - fewer create, update, and run calls result in fewer billable messages.
- Use read-only GET calls to browse or check status; they're not billed.

## Related service pricing

| Service | Pricing details |
|---|---|
| **Microsoft Foundry** | [Save costs with Microsoft Foundry Provisioned Throughput Reservations](/azure/cost-management-billing/reservations/microsoft-foundry) |
| **Azure Storage** | [Plan and manage costs for Azure Blob Storage](/azure/storage/common/storage-plan-manage-costs) |

## Related content

- [What is Microsoft Discovery?](overview-what-is-microsoft-discovery.md)
- [Service architecture overview](overview-service-architecture.md)
- [Projects and investigations](concept-projects-investigations.md)
