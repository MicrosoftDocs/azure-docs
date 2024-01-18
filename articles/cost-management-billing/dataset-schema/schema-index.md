---
title: Cost Management and Billing dataset schema index
description: Learn about the dataset schemas available in Cost Management + Billing.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/18/2024
ms.author: banders
---

# Cost Management + Billing dataset schema index

This article lists all dataset schemas available in Microsoft Cost Management + Billing. The schema files list and describe all of the data fields found in various CSV files. The CSV files might get generated from Cost Management exports, downloads in the Azure portal, or output from API queries.

## Dataset schema files

Here's the list of all dataset schema files available in Cost Management + Billing. The dataset name is the name of the CSV file that contains the data. The contract is the type of Azure subscription that the data is associated with. The dataset version is the version of the dataset schema. The mapped API version is the version of the API that the dataset schema maps to.

|Dataset|Contract|Dataset version|Mapped API versions|
|------|------|------|------|
|FocusCost|None|[1.0-preview v1](usage-details-focus-v1.0-preview.md)|2023-07-01-preview|
|PriceSheet|EA|[2023-05-01](price-sheet-ea-2023-05-01.md)||
|PriceSheet|MCA|[2023-05-01](price-sheet-mca-2023-05-01.md)||
|ReservationDetails|EA|[2023-03-01](reservation-details-ea-2023-03-01.md>)||
|ReservationDetails|MCA|[2023-03-01](reservation-details-mca-2023-03-01.md>)||
|ReservationRecommendations|EA|[2023-05-01](reservation-recommendations-ea-2023-05-01.md)||
|ReservationRecommendations|MCA|[2023-05-01](reservation-recommendations-mca-2023-05-01.md)||
|ReservationTransactions|EA|[2023-05-01](reservation-transactions-ea-2023-05-01.md)||
|ReservationTransactions|MCA|[2023-05-01](reservation-transactions-mca-2023-05-01.md)||
|Usage|MSInternal|[2019-11-01](usage-details-airs-2019-11-01.md)|• 2018-05-31<br/><br/>• 2018-06-30<br/><br/>• 2018-08-31<br/><br/>• 2018-10-01-preview<br/><br/>• 2019-01-01-preview<br/><br/>• 2018-10-01<br/><br/>• 2018-07-31<br/><br/>• 2018-08-31<br/><br/>• 2018-08-01-preview<br/><br/>• 2018-11-01-preview<br/><br/>• 2018-12-01-preview<br/><br/>• 2019-01-01-preview<br/><br/>• 2019-01-01<br/><br/>• 2019-03-01-preview<br/><br/>• 2019-04-01-preview<br/><br/>• 2019-05-01-preview<br/><br/>• 2019-05-01<br/><br/>• 2018-08-01-preview<br/><br/>• 2019-11-01<br/><br/>• 2021-01-01<br/><br/>• 2021-04-01-preview<br/><br/>• 2021-05-01<br/><br/>• 2021-10-01<br/><br/>• 2022-02-01-preview<br/><br/>• 2022-04-01-preview<br/><br/>• 2022-05-01<br/><br/>• 2022-06-01<br/><br/>• 2022-09-01<br/><br/>• 2023-04-01-preview<br/><br/>• 2023-04-15-privatepreview<br/><br/>• 2023-08-01-preview|
|Usage|EA|[2019-07-02-preview](usage-details-ea-2019-07-02-preview.md)|2019-07-02-preview|
|Usage|EA|[2019-10-01](usage-details-ea-2019-10-01.md>)|• 2018-05-31<br/><br/>• 2018-06-30<br/><br/>• 2018-08-31<br/><br/>• 2018-10-01-preview<br/><br/>• 2019-01-01-preview<br/><br/>• 2018-10-01<br/><br/>• 2018-07-31<br/><br/>• 2018-08-31<br/><br/>• 2018-08-01-preview<br/><br/>• 2018-11-01-preview<br/><br/>• 2018-12-01-preview<br/><br/>• 2019-01-01-preview<br/><br/>• 2019-01-01<br/><br/>• 2019-03-01-preview<br/><br/>• 2019-04-01-preview<br/><br/>• 2019-05-01-preview<br/><br/>• 2019-05-01<br/><br/>• 2018-08-01-preview<br/><br/>• 2019-10-01<br/><br/>• 2019-11-01|
|Usage|EA|[2020-01-01](usage-details-ea-2020-01-01.md)|• 2020-01-01<br/><br/>• 2020-08-01-preview<br/><br/>• 2020-12-01-preview|
|Usage|EA|[2021-01-01](usage-details-ea-2021-01-01.md)|• 2021-01-01<br/><br/>• 2021-04-01-preview<br/><br/>• 2021-05-01|
|Usage|EA|[2021-10-01](usage-details-ea-2021-10-01.md)|• 2021-10-01<br/><br/>• 2022-02-01-preview<br/><br/>• 2022-04-01-preview<br/><br/>• 2022-05-01<br/><br/>• 2022-06-01<br/><br/>• 2022-09-01<br/><br/>• 2023-04-01-preview<br/><br/>• 2023-04-15-privatepreview<br/><br/>• 2023-08-01-preview|
|Usage|EA|[2023-12-01](usage-details-ea-2023-12-01.md)|2023-12-01-preview|
|Usage|MCA|[2019-11-01](usage-details-mca-2019-11-01.md)|• 2018-05-31<br/><br/>• 2018-06-30<br/><br/>• 2018-08-31<br/><br/>• 2018-10-01-preview<br/><br/>• 2019-01-01-preview<br/><br/>• 2018-10-01<br/><br/>• 2018-07-31<br/><br/>• 2018-08-31<br/><br/>• 2018-08-01-preview<br/><br/>• 2018-11-01-preview<br/><br/>• 2018-12-01-preview<br/><br/>• 2019-01-01-preview<br/><br/>• 2019-01-01<br/><br/>• 2019-03-01-preview<br/><br/>• 2019-04-01-preview<br/><br/>• 2019-05-01-preview<br/><br/>• 2019-05-01<br/><br/>• 2018-08-01-preview<br/><br/>• 2019-11-01|
|Usage|MCA|[2021-01-01](usage-details-mca-2021-01-01.md)|• 2021-01-01<br/><br/>• 2021-04-01-preview<br/><br/>• 2021-05-01<br/><br/>• 2020-05-01-preview|
|Usage|MCA|[2021-10-01](usage-details-mca-2021-10-01.md)|• 2021-10-01<br/><br/>• 2022-02-01-preview<br/><br/>• 2022-04-01-preview<br/><br/>• 2022-05-01<br/><br/>• 2022-06-01<br/><br/>• 2022-09-01<br/><br/>• 2023-04-01-preview<br/><br/>• 2023-04-15-privatepreview<br/><br/>• 2023-08-01-preview|
|Usage|MCA|[2019-11-01](usage-details-mca-2019-11-01.md)|• 2018-05-31<br/><br/>• 2018-06-30<br/><br/>• 2018-08-31<br/><br/>• 2018-10-01-preview<br/><br/>• 2019-01-01-preview<br/><br/>• 2018-10-01<br/><br/>• 2018-07-31<br/><br/>• 2018-08-31<br/><br/>• 2018-08-01-preview<br/><br/>• 2018-11-01-preview<br/><br/>• 2018-12-01-preview<br/><br/>• 2019-01-01-preview<br/><br/>• 2019-01-01<br/><br/>• 2019-03-01-preview<br/><br/>• 2019-04-01-preview<br/><br/>• 2019-05-01-preview<br/><br/>• 2019-05-01<br/><br/>• 2019-10-01<br/><br/>• 2018-08-01-preview<br/><br/>• 2019-11-01|
|Usage|MCA|[2021-01-01](usage-details-mca-2021-01-01.md)|• 2021-01-01<br/><br/>• 2021-04-01-preview<br/><br/>• 2021-05-01<br/><br/>• 2020-05-01-preview|
|Usage|MCA|[2021-10-01](usage-details-mca-2021-10-01.md)|• 2021-10-01<br/><br/>• 2022-02-01-preview<br/><br/>• 2022-04-01-preview<br/><br/>• 2022-05-01<br/><br/>• 2022-06-01<br/><br/>• 2022-09-01<br/><br/>• 2023-04-01-preview<br/><br/>• 2023-04-15-privatepreview<br/><br/>• 2023-08-01-preview|
|Usage|MCA|[2019-10-01](usage-details-mca-2019-10-01.md)|• 2018-05-31<br/><br/>• 2018-06-30<br/><br/>• 2018-08-31<br/><br/>• 2018-10-01-preview<br/><br/>• 2019-01-01-preview<br/><br/>• 2018-10-01<br/><br/>• 2018-07-31<br/><br/>• 2018-08-31<br/><br/>• 2018-08-01-preview<br/><br/>• 2018-11-01-preview<br/><br/>• 2018-12-01-preview<br/><br/>• 2019-01-01-preview<br/><br/>• 2019-01-01<br/><br/>• 2019-03-01-preview<br/><br/>• 2019-04-01-preview<br/><br/>• 2019-05-01-preview<br/><br/>• 2019-05-01<br/><br/>• 2019-10-01<br/><br/>• 2018-08-01-preview|
|Usage|MCA|[2019-11-01](usage-details-mca-2019-11-01.md)|2019-11-01|
|Usage|MCA|[2021-01-01](usage-details-mca-2021-01-01.md)|• 2021-01-01<br/><br/>• 2021-04-01-preview<br/><br/>• 2021-05-01<br/><br/>• 2020-05-01-preview|
|Usage|MCA|[2021-10-01](usage-details-mca-2021-10-01.md)|• 2021-10-01<br/><br/>• 2022-02-01-preview<br/><br/>• 2022-04-01-preview<br/><br/>• 2022-05-01<br/><br/>• 2022-06-01<br/><br/>• 2022-09-01<br/><br/>• 2023-04-01-preview<br/><br/>• 2023-04-15-privatepreview<br/><br/>• 2023-08-01-preview|
|Usage|MCA|[2023-12-01](usage-details-mca-2023-12-01.md)|2023-12-01-preview|
|Usage|WebDirect|[2019-11-01](usage-details-web-direct-2019-11-01.md)|• 2018-05-31<br/><br/>• 2018-06-30<br/><br/>• 2018-08-31<br/><br/>• 2018-10-01-preview<br/><br/>• 2019-01-01-preview<br/><br/>• 2018-10-01<br/><br/>• 2018-07-31<br/><br/>• 2018-08-31<br/><br/>• 2018-08-01-preview<br/><br/>• 2018-11-01-preview<br/><br/>• 2018-12-01-preview<br/><br/>• 2019-01-01-preview<br/><br/>• 2019-01-01<br/><br/>• 2019-03-01-preview<br/><br/>• 2019-04-01-preview<br/><br/>• 2019-05-01-preview<br/><br/>• 2019-05-01<br/><br/>• 2018-08-01-preview<br/><br/>• 2019-11-01<br/><br/>• 2021-01-01<br/><br/>• 2021-04-01-preview<br/><br/>• 2021-05-01<br/><br/>• 2021-10-01<br/><br/>• 2022-02-01-preview<br/><br/>• 2022-04-01-preview<br/><br/>• 2022-05-01<br/><br/>• 2022-06-01<br/><br/>• 2022-09-01<br/><br/>• 2023-04-01-preview<br/><br/>• 2023-04-15-privatepreview<br/><br/>• 2023-08-01-preview|

