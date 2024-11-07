---
title: Tutorial to review the assessments created for migration of web apps to Azure App Service and Azure Kubernetes services
description: Learn how to review web apps assessments in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 11/07/2024
ms.custom: engagement-fy24
---

# Review a Web app assessment

This article describes the process to review an assessment that you created.

To view an assessment, follow these steps:

1. On the **Azure Migrate** page, under **Migration goals**, select **Servers, databases and web apps**.
1. On the **Servers, databases and web apps** page, under **Assessment tools** > **Assessments**, select the number next to the Web apps on Azure assessment. 
1. On the **Assessments** page, select a desired assessment name to view from the list of assessments. 

   
   :::image type="content" source="./media/tutorial-assess-webapps/overview.png" alt-text="Screenshot of Overview screen.":::

   The **Overview** page contains 3 sections:  

    - **Essentials**: The **Essentials** section displays the group the assessed entity belongs to, its status, the location, discovery source, and currency in US dollars.
    - **Assessed entities**: This section displays the number of servers selected for the assessments, number of Azure app services in the selected servers, and the number of distinct Sprint Boot app instances that were assessed.
    - **Migration scenario**: This section provides a pictorial representation of the number of apps that are ready, ready with conditions, and not ready. You can see two graphical representations, one for *All Web applications to App Service Code* and the other for *All Web applications to App Service Containers*. In addition, it also lists the number of apps ready to migrate and the estimated cost for the migration for the apps that are ready to migrate.  

3. Review the assessment summary. You can also edit the assessment properties or recalculate the assessment.

## Review readiness

To review the readiness for the web apps, follow these steps:

1. On **Assessments**, select the name of the assessment that you want to view. 
1. Select **View more details** to view more details about each app and instances. Review the Azure App service Code and Azure App service Container readiness column in the table for the assessed web apps:  


   :::image type="content" source="./media/tutorial-assess-webapps/code-readiness.png" alt-text="Screenshot of Azure App Service Code readiness.":::

    1. If there are no compatibility issues found, the readiness is marked as **Ready** for the target deployment type.
    1. If there are non-critical compatibility issues, such as degraded or unsupported features that don't block the migration to a specific target deployment type, the readiness is marked as **Ready with conditions** (hyperlinked) with **warning** details and recommended remediation guidance.
    1. If there are any compatibility issues that may block the migration to a specific target deployment type, the readiness is marked as **Not ready** with **issue** details and recommended remediation guidance.
    1. If the discovery is still in progress or there are any discovery issues for a web app, the readiness is marked as **Unknown** as the assessment couldn't compute the readiness for that web app.
    1. If the assessment isn't up-to-date, the status shows as **Outdated**. Select the corresponding assessment and select **Recalculate assessment**. The assessment is recalculated and the Readiness overview screen is updated with the results of the recalculated assessments.
1. Select the Readiness status to open the **Migration issues and warnings** pane with details of the cause of the issue and recommended action.  

   :::image type="content" source="./media/tutorial-assess-webapps/code-check.png" alt-text="Screenshot of recommended actions.":::


1. Review the recommended SKU for the web apps, which is determined as per the matrix below:

    **Readiness** | **Determine size estimate** | **Determine cost estimates**
    --- | --- | ---
    Ready  | Yes | Yes
    Ready with conditions  | Yes  | Yes
    Not ready  | No | No
    Unknown  | No | No

### Review cost estimates

The assessment summary shows the estimated monthly costs for hosting your web apps.  
Select the **Cost details** tab to view a monthly cost estimate depending on the SKUs. 

:::image type="content" source="./media/tutorial-assess-webapps/code-cost.png" alt-text="Screenshot of cost details.":::

## Next steps

- Learn how to [perform at-scale agentless migration of ASP.NET web apps to Azure App Service](./tutorial-modernize-asp-net-appservice-code.md).
- [Learn more](concepts-azure-webapps-assessment-calculation.md) about how Azure App Service assessments are calculated.

