---
title: Cost Management dataset schema index
description: Learn about the dataset schemas available in Cost Management.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 05/02/2024
ms.author: banders
---

# Cost Management dataset schema index

This article lists all dataset schemas available in Microsoft Cost Management. The schema files list and describe all of the data fields found in various data files.

## Dataset schema files

The following sections list of all dataset schema files available in Cost Management. The dataset name is the name of the file that contains the data. The contract is the agreement type of Azure subscription that the data is associated with. The dataset version is the version of the dataset schema. The mapped API version is the version of the API that the dataset schema maps to.

The latest version of each dataset is based on the agreement type and scope, where applicable. It includes:

- Enterprise Agreement (EA)
- Microsoft Customer Agreement (MCA)
- Microsoft Partner Agreement (MPA)
- Cloud Solution Provider (CSP)
- Microsoft Online Services Agreement (MOSA), also known as pay-as-you-go

For for more information about each agreement type and what's included, see [Supported Microsoft Azure offers](../costs/understand-cost-mgt-data.md#supported-microsoft-azure-offers).

## Latest dataset schema files

|Dataset|Contract|Dataset version|
|------|------|------|
|Cost and usage details|Enterprise Agreement (EA)|[2023-12-01-preview](cost-usage-details-ea.md)
|Cost and usage details|Microsoft Customer Agreement (MCA)|[2023-12-01-preview](cost-usage-details-mca.md)
|Cost and usage details|Microsoft Partner Agreement (MPA)|[2023-12-01-preview](cost-usage-details-mca-partner.md)
|Cost and usage details|Cloud Service Provider (CSP) subscription|[2023-12-01-preview](cost-usage-details-mca-partner-subscription.md)
|Cost and usage details|Pay-as-you-go (MOSA)|[2019-11-01](cost-usage-details-pay-as-you-go.md)
|Cost and usage details (FOCUS)|EA and MCA|[1.0-preview(v1)](cost-usage-details-focus.md)
|Price sheet|EA|[2023-05-01](price-sheet-ea.md)
|Price sheet|MCA|[2023-05-01](price-sheet-mca.md)
|Reservation details|EA|[2023-03-01](reservation-details-ea.md)
|Reservation details|MCA|[2023-03-01](reservation-details-mca.md)
|Reservation recommendations|EA|[2023-05-01](reservation-recommendations-ea.md)
|Reservation recommendations|MCA|[2023-05-01](reservation-recommendations-mca.md)
|Reservation transactions|EA|[2023-05-01](reservation-transactions-ea.md)
|Reservation transactions|MCA|[2023-05-01](reservation-transactions-mca.md)

## Older versions of dataset schema files

|Dataset|Contract|Returned by <br/>API Versions|Dataset version|
|------|------|------|------|
|Cost and usage details|EA|2023-12-01-preview|[2023-12-01-preview](cost-usage-details-ea.md#version-2023-12-01-preview)
|Cost and usage details|MCA|2023-12-01-preview|[2023-12-01-preview](cost-usage-details-mca.md#version-2023-12-01-preview)
|Cost and usage details|EA|2021-01-01<br/>2021-04-01-preview<br/>2021-05-01|[2021-01-01](cost-usage-details-ea.md#version-2021-01-01)
|Cost and usage details|Cloud Service Provider (CSP) subscription|2023-12-01-preview|[2023-12-01-preview](cost-usage-details-mca-partner-subscription.md#version-2023-12-01-preview)
|Cost and usage details|Microsoft Partner Agreement (MPA)|2023-12-01-preview|[2023-12-01-preview](cost-usage-details-mca-partner.md#version-2023-12-01-preview)
|Cost and usage details|MCA|2021-01-01<br/>2021-04-01-preview<br/>2021-05-01<br/>2020-05-01-preview|[2021-01-01](cost-usage-details-mca.md#version-2021-01-01)
|Cost and usage details|EA|2020-01-01<br/>2020-08-01-preview<br/>2020-12-01-preview|[2020-01-01](cost-usage-details-ea.md#version-2020-01-01)
|Cost and usage details|Cloud Service Provider (CSP) subscription|2021-01-01<br/>2021-04-01-preview<br/>2021-05-01<br/>2020-05-01-preview|[2021-01-01](cost-usage-details-mca-partner-subscription.md#version-2021-01-01)
|Cost and usage details|Microsoft Partner Agreement (MPA)|2021-01-01<br/>2021-04-01-preview<br/>2021-05-01<br/>2020-05-01-preview|[2021-01-01](cost-usage-details-mca-partner.md#version-2021-01-01)
|Cost and usage details|MCA|2019-11-01|[2019-11-01](cost-usage-details-mca.md#version-2019-11-01)
|Cost and usage details|EA|2018-05-31<br/>2018-06-30<br/>2018-08-31<br/>2018-10-01-preview<br/>2019-01-01-preview<br/>2018-10-01<br/>2018-07-31<br/>2018-08-31<br/>2018-08-01-preview<br/>2018-11-01-preview<br/>2018-12-01-preview<br/>2019-01-01-preview<br/>2019-01-01<br/>2019-03-01-preview<br/>2019-04-01-preview<br/>2019-05-01-preview<br/>2019-05-01<br/>2018-08-01-preview<br/>2019-10-01<br/>2019-11-01|[2019-10-01](cost-usage-details-ea.md#version-2019-10-01)
|Cost and usage details|Cloud Service Provider (CSP) subscription|2018-05-31<br/>2018-06-30<br/>2018-08-31<br/>2018-10-01-preview<br/>2019-01-01-preview<br/>2018-10-01<br/>2018-07-31<br/>2018-08-31<br/>2018-08-01-preview<br/>2018-11-01-preview<br/>2018-12-01-preview<br/>2019-01-01-preview<br/>2019-01-01<br/>2019-03-01-preview<br/>2019-04-01-preview<br/>2019-05-01-preview<br/>2019-05-01<br/>2018-08-01-preview<br/>2019-11-01|[2019-11-01](cost-usage-details-mca-partner-subscription.md#version-2019-11-01)
|Cost and usage details|Microsoft Partner Agreement (MPA)|2018-05-31<br/>2018-06-30<br/>2018-08-31<br/>2018-10-01-preview<br/>2019-01-01-preview<br/>2018-10-01<br/>2018-07-31<br/>2018-08-31<br/>2018-08-01-preview<br/>2018-11-01-preview<br/>2018-12-01-preview<br/>2019-01-01-preview<br/>2019-01-01<br/>2019-03-01-preview<br/>2019-04-01-preview<br/>2019-05-01-preview<br/>2019-05-01<br/>2019-10-01<br/>2018-08-01-preview<br/>2019-11-01|[2019-11-01](cost-usage-details-mca-partner.md#version-2019-11-01)
|Cost and usage details|MCA|2018-05-31<br/>2018-06-30<br/>2018-08-31<br/>2018-10-01-preview<br/>2019-01-01-preview<br/>2018-10-01<br/>2018-07-31<br/>2018-08-31<br/>2018-08-01-preview<br/>2018-11-01-preview<br/>2018-12-01-preview<br/>2019-01-01-preview<br/>2019-01-01<br/>2019-03-01-preview<br/>2019-04-01-preview<br/>2019-05-01-preview<br/>2019-05-01<br/>2019-10-01<br/>2018-08-01-preview|[2019-10-01](cost-usage-details-mca.md#version-2019-10-01)