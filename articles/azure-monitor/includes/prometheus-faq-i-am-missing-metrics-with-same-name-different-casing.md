---
ms.service: azure-monitor
ms.topic: include
ms.date: 10/31/2023
ms.author: edbaynash
author: EdB-MSFT
---

### Why am I missing metrics that have two labels with the same name but different casing?

Metrics that have two label names that are the same except for their casing will be treated as having duplicate label names. These time series will be dropped upon ingestion since the two labels are seen as the same. For example, the time series `my_metric{ExampleLabel="label_value_0", examplelabel="label_value_1}` will be dropped due to duplicate labels since `ExampleLabel` and `examplelabel` will be seen as the same label name.
