---
title: Azure Storage Explorer support lifecycle
description: Overview of the support policy and lifecycle for Azure Storage Explorer
services: storage
author: MRayermannMSFT
manager: jinglouMSFT
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: article
ms.date: 07/10/2020
ms.author: marayerm
---

# Azure Storage Explorer support lifecycle and policy

This document covers the support lifecycle and policy for Azure Storage Explorer.

## Update schedule and process

Azure Storage Explorer is released four to six times a year. Microsoft may also bypass this schedule to release fixes for critical issues.

Storage Explorer checks for updates every hour, and downloads them when they're available. User acceptance is required, however, to start the install process. If users choose to update at a different time, they can manually check for update. On Windows and Linux, users can check for updates by selecting **Check for Updates** from the **Help** menu. On macOS, **Check for Updates** can be found under the **app menu**. Users may also directly go to the [Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) download page to download and install the latest release.

We strongly recommend to always use the latest versions of Storage Explorer. If an issue is preventing you from updating to the latest version of Storage Explorer, open an issue on our [GitHub](https://github.com/microsoft/AzureStorageExplorer).

## Support lifecycle

Storage Explorer is governed by the [Modern Lifecycle Policy](https://support.microsoft.com/help/30881/modern-lifecycle-policy). It's expected that users keep their installation of Storage Explorer up to date. Staying up to date ensures that users have the latest capabilities, performance enhancements, security, and service reliability.

Starting with version 1.14.1, any Storage Explorer release that is greater than 12 months old will be considered out of support. Starting with 1.31.0, a release's age will be based on the release date of its minor version. All releases before 1.14.1 will be considered out of support starting on July 14, 2021. While a version is in support, Microsoft will endeavor to keep the version working as was intended at its release. Once a version is out of support, it is no longer guaranteed to work as intended. For a list of all releases, their release date, and their end of support date, see [Releases](#releases).

Starting with version 1.13.0, an in-app alert may be displayed once a version is approximately one month away from being out of support. The alert encourages users to update to the latest version of Storage Explorer. Once a version is out of support, the in-app alert may be displayed on each start-up.

## Releases

This table describes the release date and the end of support date for each release of Azure Storage Explorer.

| Storage Explorer version  | Release date       | End of support date |
|:-------------------------:|:------------------:|:-------------------:|
| v1.36.2                   | October 29, 2024   | October 14, 2025    |
| v1.36.1                   | October 23, 2024   | October 14, 2025    |
| v1.36.0                   | October 14, 2024   | October 14, 2025    |
| v1.35.0                   | August 19, 2024    | August 19, 2025     |
| v1.34.0                   | May 24, 2024       | May 24, 2025        |
| v1.33.0                   | March 1, 2024      | March 1, 2025       |
| v1.32.1                   | November 15, 2023  | November 1, 2024    |
| v1.32.0                   | November 1, 2023   | November 1, 2024    |
| v1.31.2                   | October 3, 2023    | August 11, 2024     |
| v1.31.1                   | August 22, 2023    | August 11, 2024     |
| v1.31.0                   | August 11, 2023    | August 11, 2024     |
| v1.30.2                   | July 21, 2023      | July 21, 2024       |
| v1.30.1                   | July 13, 2023      | July 13, 2024       |
| v1.30.0                   | June 12, 2023      | June 12, 2024       |
| v1.29.3                   | October 6, 2023    | May 24, 2024        |
| v1.29.2                   | May 24, 2023       | May 24, 2024        |
| v1.29.1                   | May 10, 2022       | May 10, 2024        |
| v1.29.0                   | April 28, 2023     | April 28, 2024      |
| v1.28.1                   | March 9, 2023      | March 9, 2024       |
| v1.28.0                   | February 14, 2023  | February 14, 2024   |
| v1.27.2                   | January 24, 2023   | January 24, 2024    |
| v1.27.1                   | December 20, 2022  | December 20, 2024   |
| v1.27.0                   | December 2, 2022   | December 2, 2023    |
| v1.26.1                   | October 17, 2022   | October 17, 2023    |
| v1.26.0                   | October 5, 2022    | October 5, 2023     |
| v1.25.1                   | August 12, 2022    | August 12, 2023     |
| v1.25.0                   | August 3, 2022     | August 3, 2023      |
| v1.24.3                   | June 21, 2022      | June 21, 2023       |
| v1.24.2                   | May 27, 2022       | May 27, 2023        |
| v1.24.1                   | May 12, 2022       | May 12, 2023        |
| v1.24.0                   | May 3, 2022        | May 3, 2023         |
| v1.23.1                   | April 12, 2022     | April 12, 2023      |
| v1.23.0                   | March 2, 2022      | March 2, 2023       |
| v1.22.1                   | January 25, 2022   | January 25, 2023    |
| v1.22.0                   | December 14, 2021  | December 14, 2022   |
| v1.21.3                   | October 25, 2021   | October 25, 2022    |
| v1.21.2                   | September 28, 2021 | September 28, 2022  |
| v1.21.1                   | September 22, 2021 | September 22, 2022  |
| v1.21.0                   | September 8, 2021  | September 8, 2022   |
| v1.20.1                   | July 23, 2021      | July 23, 2022       |
| v1.20.0                   | June 25, 2021      | June 25, 2022       |
| v1.19.1                   | April 29, 2021     | April 29, 2022      |
| v1.19.0                   | April 15, 2021     | April 15, 2022      |
| v1.18.1                   | March 4, 2021      | March 4, 2022       |
| v1.18.0                   | March 1, 2021      | March 1, 2022       |
| v1.17.0                   | December 15, 2020  | December 15, 2021   |
| v1.16.0                   | November 10, 2020  | November 10, 2021   |
| v1.15.1                   | September 2, 2020  | September 2, 2021   |
| v1.15.0                   | August 27, 2020    | August 27, 2021     |
| v1.14.2                   | July 16, 2020      | July 16, 2021       |
| v1.14.1                   | July 14, 2020      | July 14, 2021       |
| v1.14.0                   | June 24, 2020      | July 14, 2021       |
| v1.13.1                   | May 18, 2020       | July 14, 2021       |
| v1.13.0                   | May 1, 2020        | July 14, 2021       |
| v1.12.0                   | January 16, 2020   | July 14, 2021       |
| v1.11.2                   | December 17, 2019  | July 14, 2021       |
| v1.11.1                   | November 20, 2019  | July 14, 2021       |
| v1.11.0                   | November 4, 2019   | July 14, 2021       |
| v1.10.1                   | September 19, 2019 | July 14, 2021       |
| v1.10.0                   | September 12, 2019 | July 14, 2021       |
| v1.9.0                    | July 1, 2019       | July 14, 2021       |
| v1.8.1                    | May 10, 2019       | July 14, 2021       |
| v1.8.0                    | May 2, 2019        | July 14, 2021       |
| v1.7.0                    | March 5, 2019      | July 14, 2021       |
| v1.6.2                    | January 8, 2019    | July 14, 2021       |
| v1.6.1                    | December 18, 2018  | July 14, 2021       |
| v1.6.0                    | December 4, 2018   | July 14, 2021       |
| v1.5.0                    | October 29, 2018   | July 14, 2021       |
| v1.4.4                    | October 15, 2018   | July 14, 2021       |
| v1.4.2                    | September 24, 2018 | July 14, 2021       |
| v1.4.1                    | August 28, 2018    | July 14, 2021       |
| v1.3.1                    | July 11, 2018      | July 14, 2021       |
| v1.2.0                    | June 12, 2018      | July 14, 2021       |
| v1.1.0                    | May 9, 2018        | July 14, 2021       |
| v1.0.0 (and older)        | April 16, 2018     | July 14, 2021       |
