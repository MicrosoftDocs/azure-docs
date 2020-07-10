---
title: Data & storage recommendations - Azure Security Center
description: This document addresses recommendations in Azure Security Center that help you protect your data and Azure SQL service and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: bcae6987-05d0-4208-bca8-6a6ce7c9a1e3
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/19/2019
ms.author: memildin
---

# Protect Azure data and storage services
When Azure Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls to harden and protect your resources.

This article explains the **Data Security page** of the resource security section of Security Center.

For a full list of the recommendations you might see on this page, see [Data and Storage recommendations](recommendations-reference.md#recs-datastorage).


## View your data security information

1. In the **Resource security hygiene** section, click **Data and storage resources**.

    ![Data & storage resources](./media/security-center-monitoring/click-data.png)

    The **Data security** page opens with recommendations for data resources.

    [![Data Resources](./media/security-center-monitoring/sql-overview.png)](./media/security-center-monitoring/sql-overview.png#lightbox)

    From this page, you can:

    * Click the **Overview** tab lists all the data resources recommendations to be remediated. 
    * Click each tab, and view the recommendations by resource type.

    > [!NOTE]
    > For more information about storage encryption, see [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md).


## Remediate a recommendation on a data resource

1. From any of the resource tabs, click a resource. The information page opens listing the recommendations to be remediated.

    ![Resource information](./media/security-center-monitoring/sql-recommendations.png)

2. Click a recommendation. The Recommendation page opens and displays the **Remediation steps** to implement the recommendation.

   ![Remediation steps](./media/security-center-monitoring/remediate1.png)

3. Click **Take action**. The resource settings page appears.

    ![Enable recommendation](./media/security-center-monitoring/remediate2.png)

4. Follow the **Remediation steps** and click **Save**.


## Next steps

To learn more about recommendations that apply to other Azure resource types, see the following topics:

* [Full reference list of Azure Security Center's security recommendations](recommendations-reference.md)
* [Protecting your machines and applications in Azure Security Center](security-center-virtual-machine-protection.md)
* [Protecting your network in Azure Security Center](security-center-network-recommendations.md)