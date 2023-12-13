---
title: COVID-19 Data Lake
description: Learn how to use the COVID-19 Data Lake in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# COVID-19 Data Lake

The COVID-19 Data Lake contains COVID-19 related datasets from various sources. It covers testing and patient outcome tracking data, social distancing policy, hospital capacity, mobility, and so on.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

The COVID-19 Data Lake is hosted in Azure Data Lake Storage in the East US region. For each dataset, modified versions in csv, json, json-lines, and parquet formats are available. The raw data is also available as ingested.

ISO 3166 subdivision codes are added where not present to simplify joining. Column names reformatted in lower case with underscore separators. Datasets are updated daily with historical copies of modified and raw files also available.

## Datasets

| Datasets                                                                 | Description                                                                                                                                                                                                                                             |
|--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Bing COVID-19 Data](dataset-bing-covid-19.md)                                                       | Bing COVID-19 data includes confirmed, fatal, and recovered cases from all regions, updated daily.                                                                                                                                                      |
| [COVID Tracking Project](dataset-covid-tracking.md)                                                | The COVID Tracking Project dataset provides the latest numbers on tests, confirmed cases, hospitalizations, and patient outcomes from every US state and territory.                                                                                     |
| [European Centre for Disease Prevention and Control (ECDC) Covid-19 Cases](dataset-ecdc-covid-cases.md) | The latest available public data on geographic distribution of COVID-19 cases worldwide from the European Center for Disease Prevention and Control (ECDC). Each row/entry contains the number of new cases reported per day and per country or region. |
| [Oxford COVID-19 Government Response Tracker](dataset-oxford-covid-government-response-tracker.md)                              | The Oxford Covid-19 Government Response Tracker (OxCGRT) dataset contains systematic information on which governments have taken which measures, and when.                                                                                              |

---

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).