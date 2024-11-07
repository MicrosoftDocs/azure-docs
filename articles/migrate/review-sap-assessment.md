---
title: Tutorial to review the SAP assessments
description: Learn how to review VMware assessments for on-premises SAP systems
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 11/07/2024
ms.custom: engagement-fy24
---

# Review a SAP assessment

To review an assessment, follow these steps:

1. On the **Azure Migrate** page, under **Migration goals**, select **Servers, databases and web apps**.
1. On the **Servers, databases and web apps** page, under **Assessment tools** > **Assessments**, select the number associated with **SAP® Systems (Preview)**.

    :::image type="content" source="./media/tutorial-assess-sap-systems/review-assess.png" alt-text="Screenshot that shows the option to access assess." lightbox="./media/tutorial-assess-sap-systems/review-assess.png":::

1. On the **Assessments** page, select a desired assessment name to view from the list of assessments. <br/>On the **Overview** page, you can view the SAP system details of **Essentials**, **Assessed entities** and **SAP® on Azure** cost estimates.
1. Select **SAP on Azure** for the drill-down assessment details at the System ID (SID) level.
1. On the **SAP on Azure** page, select any SID to review the assessment summary such as cost of the SID, including its ASCS, App, and DB server assessments and storage details for the DB server assessments. <br/>If required, you can edit the assessment properties or recalculate the assessment.

    :::image type="content" source="./media/tutorial-assess-sap-systems/sap-on-azure.png" alt-text="Screenshot that shows to select SAP on Azure." lightbox="./media/tutorial-assess-sap-systems/sap-on-azure.png":::

> [!NOTE]
> When you update any of the assessment settings, it triggers a new assessment, which takes a few minutes to reflect the updates.

## Next steps
Find server dependencies using [dependency mapping](concepts-dependency-visualization.md).
