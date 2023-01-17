---
title: Advanced Security Information Model (ASIM) known issues | Microsoft Docs
description: This article outlines the Microsoft Sentinel Advanced Security Information Model (ASIM) known issues.
author: oshezaf
ms.topic: reference
ms.date: 08/02/2021
ms.author: ofshezaf
---

# Advanced Security Information Model (ASIM) known issues (Public preview)

The following are the Advanced Security Information Model (ASIM) known issues and limitations:

## Time picker set to a custom range

When using filtering ASIM parsers (with the prefixes `_Im`, `im`, or `vim`) in the log screen, the time picker will change automatically to "set in query", which will result in querying over all data in the relevant tables. The query results may not be the expected results and performance may be slow.

:::image type="content" source="media/normalization/asim-custom-time-picker.png" alt-text="Screenshot of custom time picker when using ASIM.":::

To ensure correct and timely results, set the time range to your preferred range after it changes to "set in query". In add-hoc queries, you may want to use non-filtering parsers (with the prefixes `_ASim` or `ASim`).

## Performance challenges

ASIM based queries over a long time range, and which do not use filtering parameters, may be slow. Parsing is a resource-intensive operation, and when applied to a large, unfiltered, dataset, it is expected to be slow.

If you encounter performance issues:
- When using an interactive query, make sure to set the time picker to time range needed.
- Use parser filters. Most importantly use the `starttime` and the `endtime` filter parameters.

## The ingest_time() function is not supported

The `ingest_time()` function reports the time at which a record was ingested into Microsoft Sentinel, which may be different from `TimeGenerated`. This information is commonly used in queries that take into account ingestion delays. The `ingest_time()` has to be used in the context of a specific table and does not work with ASIM functions, which unify many different tables. 

## Misleading informational message

In some cases when using ASIM parser functions, usually when there are no results to the query, the following information message is displayed. 

:::image type="content" source="media/normalization/asim-error-message.png" alt-text="Screenshot of ASIM-related misleading informational message.":::

While the message is alarming, it is informational only, and the system behaved as expected. ASIM functions combine data from many sources, regardless of whether they are available in your environment or not. The message suggests that some of the sources are not available in your environment.

## <a name="next-steps"></a>Next steps

This article discusses the Advanced Security Information Model (ASIM) help functions.

For more information, see:

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-about-parsers.md)
- [Using the Advanced Security Information Model (ASIM)](normalization-about-parsers.md)
- [Modifying Microsoft Sentinel content to use the Advanced Security Information Model (ASIM) parsers](normalization-modify-content.md)
