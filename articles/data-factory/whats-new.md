---
title: What's new in Azure Data Factory 
description: This page highlights new features and recent improvements for Azure Data Factory. Data Factory is a managed cloud service that's built for complex hybrid extract-transform-and-load (ETL), extract-load-and-transform (ELT), and data integration projects.
author: pennyzhou-msft
ms.author: xupzhou
ms.service: data-factory
ms.subservice: concepts
ms.topic: overview
ms.custom: references_regions
ms.date: 01/21/2022
---

# What's new in Azure Data Factory

Azure Data Factory is improved on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases.
- Known issues.
- Bug fixes.
- Deprecated functionality.
- Plans for changes.

This page is updated monthly, so revisit it regularly.

## August 2022
<br>
<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>
<tr><td rowspan=3><b>Data flow</b></td><td>Appfigures connector added as Source (Preview)</td><td>We’ve added a new REST-based connector to mapping data flows! Users can now read their tables from Appfigures. Note: This connector is only available when using inline datasets.<br><a href="connector-appfigures.md">Learn more</a></td></tr>
<tr><td>Cast transformation added – visually convert data types </td><td>Now, you can use the cast transformation to quickly transform data types visually!<br><a href="data-flow-cast.md">Learn more</a></td></tr>
<tr><td>New UI for inline datasets - categories added to easily find data sources </td><td>We’ve updated our data flow source UI to make it easier to find your inline dataset type. Previously, you would have to scroll through the list or filter to find your inline dataset type. Now, we have categories that group your dataset types, making it easier to find what you’re looking for.<br><a href="data-flow-source.md#inline-datasets">Learn more</a></td></tr>
<tr><td rowspan=1><b>Data Movement</b></td><td>Service principal authentication type added for Blob storage</td><td>Service principal is added as a new additional authentication type based on existing authentication.<br><a href="connector-azure-blob-storage.md#service-principal-authentication">Learn more</a></td></tr>
<tr><td rowspan=1><b>Continuous integration and continuous delivery (CI/CD)</b></td><td>Exclude turning off triggers that did not change in deployment</td><td>When CI/CD integrating ARM template, instead of turning off all triggers, it can exclude triggers that did not change in deployment.<br><a href=https://techcommunity.microsoft.com/t5/azure-data-factory-blog/ci-cd-improvements-related-to-pipeline-triggers-deployment/ba-p/3605064>Learn more</a></td></tr>
<tr><td rowspan=3><b>Developer productivity</b></td><td> Default activity time-out changed from 7 days to 12 hours </td><td>The previous default timeout for new pipeline activities is 7 days for most activities, which was too long  and far outside of the most common activity execution times we observed and heard from you. So we change the default timeout of new activities to 12 hours. Keep in mind that you should adjust the timeout on long-running processes (i.e. large copy activity and data flow jobs) to a higher value if needed. <br><a href=https://techcommunity.microsoft.com/t5/azure-data-factory-blog/azure-data-factory-changing-default-pipeline-activity-timeout/ba-p/3598729>Learn more</a></td></tr>
<tr><td>Expression builder UI update – categorical tabs added for easier use </td><td>We’ve updated our expression builder UI to make adding pipeline designing easier. We’ve created new content category tabs to make it easier to find what you’re looking for.<br><a href="data-flow-cast.md">Learn more</a></td></tr>
<tr><td>New data factory creation experience - 1 click to have your factory ready within seconds </td><td>The new creation experience is available in adf.azure.com to successfully create your factory within several seconds.<br><a href=https://techcommunity.microsoft.com/t5/azure-data-factory-blog/new-experience-for-creating-data-factory-within-seconds/ba-p/3561249>Learn more</a></td></tr>
</table>

## July 2022
<br>
<table>
<tr><td><b>Service category</b></td><td><b>Service improvements</b></td><td><b>Details</b></td></tr>
<tr><td rowspan=5><b>Data flow</b></td><td>Asana connector added as source</td><td>We’ve added a new REST-based connector to mapping data flows! Users can now read their tables from Asana. Note: This connector is only available when using inline datasets.<br><a href="connector-asana.md">Learn more</a></td></tr>
<tr><td>3 new data transformation functions are supported</td><td>3 new data transformation functions have been added to mapping data flows in Azure Data Factory and Azure Synapse Analytics. Now, users are able to use collectUnique(), to create a new collection of unique values in an array, substringIndex(), to extract the substring before n occurrences of a delimiter, and topN(), to return the top n results after sorting your data.<br><a href=https://techcommunity.microsoft.com/t5/azure-data-factory-blog/3-new-data-transformation-functions-in-adf/ba-p/3582738>Learn more</a></td></tr>
<tr><td>Refetch from source available in Refresh for data source change scenarios</td><td>When building and debugging a data flow, your source data can change. There is now a new easy way to refetch the latest updated source data from the refresh button in the data preview pane.<br><a href="concepts-data-flow-debug-mode.md#data-preview">Learn more</a></td></tr>
<tr><td>User defined functions (GA) </td><td>Create reusable and customized expressions to avoid building complex logic over and over<br><a href="concepts-data-flow-udf.md">Learn more</a></td></tr>
<tr><td>Easier configuration on data flow runtime – choose compute size among Small, Medium, and Large to pre-configure all integration runtime settings</td><td>Azure Data Factory has made it easier for users to configure Azure Integration Runtime for mapping data flows by choosing compute size among Small, Medium, and Large to pre-configure all integration runtime settings. You can still set your own custom configurations.<br><a href=https://techcommunity.microsoft.com/t5/azure-data-factory-blog/adf-makes-it-easy-to-select-azure-ir-size-for-data-flows/ba-p/3578033>Learn more</a></td></tr>
<tr><td rowspan=1><b>Continuous integration and continuous delivery (CI/CD)</b></td><td>Include Global parameters supported in ARM template</td><td>We’ve added a new mechanism to include Global Parameters in the ARM templates. This helps to solve an earlier issue, which overrode some configurations during deployments when users included global parameters in ARM templates.<br><a href=https://techcommunity.microsoft.com/t5/azure-data-factory-blog/ci-cd-improvement-using-global-parameters-in-azure-data-factory/ba-p/3557265#M665>Learn more</a></td></tr>
<tr><td><b>Developer productivity</b></td><td>Azure Data Factory studio preview experience</td><td>Be a part of Azure Data Factory Preview features to experience latest Azure Data Factory capabilities, and be the first to share your feedback<br><a href=https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-the-azure-data-factory-studio-preview-experience/ba-p/3563880>Learn more</a></td></tr>
</table>

## More information

- [Blog - Azure Data Factory](https://techcommunity.microsoft.com/t5/azure-data-factory/bg-p/AzureDataFactoryBlog)
- [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter](https://twitter.com/AzDataFactory?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor)
- [Videos](https://www.youtube.com/channel/UC2S0k7NeLcEm5_IhHUwpN0g/featured)
