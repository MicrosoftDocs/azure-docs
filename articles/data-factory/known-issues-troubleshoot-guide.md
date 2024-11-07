---
title: Azure Data Factory known issues
description: Learn about the currently known issues with Azure Data Factory and their possible workarounds or resolutions.
author: sveldurthi
ms.author: sveldurthi
ms.reviewer: brianwan
ms.date: 10/02/2024
ms.service: azure-data-factory
ms.topic: conceptual
---

# Azure Data Factory known issues

This page lists the known issues in Azure Data factory. Before submitting [an Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest), review this list to see if the issue that you're experiencing is already known and being addressed.

## Active known issues

|ADF Component|Known Issue |Status|
|:---------|:---------|:---------|
|Snow Flake Connector Issue|[Intermittent data retrieval issue with LookUp using the Snowflake Connector V2](#intermittent-data-retrieval-issue-with-lookup-using-the-snowflake-connector-v2)|Has workaround|


## Recently ADF Closed known issues

|ADF Component|Issue|Status|Date Resolved|
|---------|---------|---------|---------|


### Intermittent data retrieval issue with LookUp using the Snowflake Connector v2

Intermittently, lookup queries against Snowflake return no values even when results are expected. No errors are generated, and the lookup activity completes successfully. This issue has been observed with Managed VNet IR and SHIR.

**Workaround**: Add an If-condition activity after the Lookup to check its output. If the Lookup returns data, proceed without further action. If no data is returned, re-execute the Lookup activity.
:::image type="content" source="media/known-issue/snowflake-rcs.png" alt-text="Diagram of Snowflake v2 Known issue.":::