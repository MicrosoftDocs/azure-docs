---
title: Cost Management and Billing dataset schema index
description: Learn about the dataset schemas available in Cost Management + Billing.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 03/28/2024
ms.author: banders
---

# Cost Management + Billing dataset schema index

This article lists all dataset schemas available in Microsoft Cost Management + Billing. The schema files list and describe all of the data fields found in various data files.

## Dataset schema files

Here's the list of all dataset schema files available in Cost Management + Billing. The dataset name is the name of the file that contains the data. The contract is the agreement type of Azure subscription that the data is associated with. The dataset version is the version of the dataset schema. The mapped API version is the version of the API that the dataset schema maps to.

## Latest dataset schema files

|Dataset|Contract|Dataset version|
|------|------|------|
|FocusCost|EA and MCA|[1.0-preview(v1)](usage-details-focus.md)
|PriceSheet|EA|[2023-05-01](price-sheet-ea.md)
|PriceSheet|MCA|[2023-05-01](price-sheet-mca.md)
|ReservationDetails|EA|[2023-03-01](reservation-details-ea.md)
|ReservationDetails|MCA|[2023-03-01](reservation-details-mca.md)
|ReservationRecommendations|EA|[2023-05-01](reservation-recommendations-ea.md)
|ReservationRecommendations|MCA|[2023-05-01](reservation-recommendations-mca.md)
|ReservationTransactions|EA|[2023-05-01](reservation-transactions-ea.md)
|ReservationTransactions|MCA|[2023-05-01](reservation-transactions-mca.md)
|Usage|EA|[2021-10-01](usage-details-ea.md)
|Usage|MCA, Partner, and Subscription|[2021-10-01](usage-details-mca-partner-subscription.md)
|Usage|MCA and Partner|[2021-10-01](usage-details-mca-partner.md)
|Usage|MCA|[2021-10-01](usage-details-mca.md)
|Usage|Pay-as-you-go|[2019-11-01](usage-details-pay-as-you-go.md)

## Older versions of dataset schema files

|Dataset|Contract|Returned by <br/>API Versions|Dataset version|
|------|------|------|------|
|Usage|EA|2023-12-01-preview|[2023-12-01-preview](usage-details-ea.md#version-2023-12-01-preview)
|Usage|MCA|2023-12-01-preview|[2023-12-01-preview](usage-details-mca.md#version-2023-12-01-preview)
|Usage|EA|2021-01-01<br/>2021-04-01-preview<br/>2021-05-01|[2021-01-01](usage-details-ea.md#version-2021-01-01)
|Usage|MCA, Partner, and Subscription|2023-12-01-preview|[2023-12-01-preview](usage-details-mca-partner-subscription.md#version-2023-12-01-preview)
|Usage|MCA and Partner|2023-12-01-preview|[2023-12-01-preview](usage-details-mca-partner.md#version-2023-12-01-preview)
|Usage|MCA|2021-01-01<br/>2021-04-01-preview<br/>2021-05-01<br/>2020-05-01-preview|[2021-01-01](usage-details-mca.md#version-2021-01-01)
|Usage|EA|2020-01-01<br/>2020-08-01-preview<br/>2020-12-01-preview|[2020-01-01](usage-details-ea.md#version-2020-01-01)
|Usage|MCA, Partner, and Subscription|2021-01-01<br/>2021-04-01-preview<br/>2021-05-01<br/>2020-05-01-preview|[2021-01-01](usage-details-mca-partner-subscription.md#version-2021-01-01)
|Usage|MCA and Partner|2021-01-01<br/>2021-04-01-preview<br/>2021-05-01<br/>2020-05-01-preview|[2021-01-01](usage-details-mca-partner.md#version-2021-01-01)
|Usage|MCA|2019-11-01|[2019-11-01](usage-details-mca.md#version-2019-11-01)
|Usage|EA|2018-05-31<br/>2018-06-30<br/>2018-08-31<br/>2018-10-01-preview<br/>2019-01-01-preview<br/>2018-10-01<br/>2018-07-31<br/>2018-08-31<br/>2018-08-01-preview<br/>2018-11-01-preview<br/>2018-12-01-preview<br/>2019-01-01-preview<br/>2019-01-01<br/>2019-03-01-preview<br/>2019-04-01-preview<br/>2019-05-01-preview<br/>2019-05-01<br/>2018-08-01-preview<br/>2019-10-01<br/>2019-11-01|[2019-10-01](usage-details-ea.md#version-2019-10-01)
|Usage|MCA, Partner, and Subscription|2018-05-31<br/>2018-06-30<br/>2018-08-31<br/>2018-10-01-preview<br/>2019-01-01-preview<br/>2018-10-01<br/>2018-07-31<br/>2018-08-31<br/>2018-08-01-preview<br/>2018-11-01-preview<br/>2018-12-01-preview<br/>2019-01-01-preview<br/>2019-01-01<br/>2019-03-01-preview<br/>2019-04-01-preview<br/>2019-05-01-preview<br/>2019-05-01<br/>2018-08-01-preview<br/>2019-11-01|[2019-11-01](usage-details-mca-partner-subscription.md#version-2019-11-01)
|Usage|MCA and Partner|2018-05-31<br/>2018-06-30<br/>2018-08-31<br/>2018-10-01-preview<br/>2019-01-01-preview<br/>2018-10-01<br/>2018-07-31<br/>2018-08-31<br/>2018-08-01-preview<br/>2018-11-01-preview<br/>2018-12-01-preview<br/>2019-01-01-preview<br/>2019-01-01<br/>2019-03-01-preview<br/>2019-04-01-preview<br/>2019-05-01-preview<br/>2019-05-01<br/>2019-10-01<br/>2018-08-01-preview<br/>2019-11-01|[2019-11-01](usage-details-mca-partner.md#version-2019-11-01)
|Usage|MCA|2018-05-31<br/>2018-06-30<br/>2018-08-31<br/>2018-10-01-preview<br/>2019-01-01-preview<br/>2018-10-01<br/>2018-07-31<br/>2018-08-31<br/>2018-08-01-preview<br/>2018-11-01-preview<br/>2018-12-01-preview<br/>2019-01-01-preview<br/>2019-01-01<br/>2019-03-01-preview<br/>2019-04-01-preview<br/>2019-05-01-preview<br/>2019-05-01<br/>2019-10-01<br/>2018-08-01-preview|[2019-10-01](usage-details-mca.md#version-2019-10-01)