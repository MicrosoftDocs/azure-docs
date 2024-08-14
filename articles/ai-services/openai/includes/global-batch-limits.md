---
title: Azure OpenAI Global Batch Limits
titleSuffix: Azure OpenAI Service
description: Azure OpenAI model global batch limits
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 07/22/2024
---

## Global batch limits

| Limit Name | Limit Value |
|--|--|
| Max files per resource | 500 |
| Max input file size | 200 MB |
| Max requests per file | 100,000 |

## Global batch quota

The table shows the batch quota limit. Quota values for global batch are represented in terms of enqueued tokens. When you submit a file for batch processing the number of tokens present in the file are counted. Until the batch job reaches a terminal state, those tokens will count against your  total enqueued token limit.

|Model|Enterprise agreement|Default| Monthly credit card based subscriptions | MSDN subscriptions | Azure for Students, Free Trials |
|---|---|---|---|---|---|
| `gpt-4o` | 5 B | 50 M | 1.35 M | 90 K | N/A|
| `gpt-4o-mini` | 5 B | 50 M | 1.35 M | 90 K | N/A |
| `gpt-4-turbo` | 300 M | 40 M | 1.35 M | 90 K | N/A |
| `gpt-4` | 150 M | 5 M | 200 K | 100 K | N/A |
| `gpt-35-turbo` | 10 B | 100 M | 5 M | 2 M | 50 K |

B = billion | M = million | K = thousand