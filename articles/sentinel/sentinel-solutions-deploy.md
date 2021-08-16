---
title: Deploy Azure Sentinel solutions | Microsoft Docs
description: This article shows how customers can easily find and deploy data analysis tools packaged together with data connectors.
services: sentinel
cloud: na
documentationcenter: na
author: yelevin
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 05/05/2021
ms.author: yelevin
---
# Discover and deploy Azure Sentinel solutions

> [!IMPORTANT]
>
> The Azure Sentinel solutions experience is currently in **PREVIEW**, as are all individual solution packages. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Sentinel solutions provide in-product discoverability, single-step deployment, and enablement of end-to-end product, domain, and/or vertical scenarios in Azure Sentinel. This experience is powered by [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace) for solutions’ discoverability, deployment, and enablement, and by [Microsoft Partner Center](/partner-center/overview) for solutions’ authoring and publishing.

Solutions can consist of any or all of the following components:

- **Data connectors**, some with accompanying **parsers**
- **Workbooks**
- **Analytics rules**
- **Hunting queries**
- **Playbooks**

## Find your solution

1. From the Azure Sentinel navigation menu, select **Solutions (Preview)**.

1. The **Solutions** blade displays a searchable list of solutions.

    :::image type="content" source="./media/sentinel-solutions-deploy/solutions-list.png" alt-text="Solutions list":::

    - If you scroll to the bottom of the list but don't find what you're looking for, click the **Load more** link at the bottom to expand the list.

        :::image type="content" source="./media/sentinel-solutions-deploy/load-more.png" alt-text="Load more solutions":::

1. To narrow down your choices and find the solution you want more easily, type any part of the solution's name in the **Search** field at the top of the list. (The search engine will only recognize whole words.)

    :::image type="content" source="./media/sentinel-solutions-deploy/solutions-search-1.png" alt-text="Search solutions":::

1. Select your desired solution from the list to deploy it. The solution's details page will open on the **Overview** tab, which displays essential and important information about the solution.

    :::image type="content" source="./media/sentinel-solutions-deploy/proofpoint-tap-solution.png" alt-text="Proofpoint Tap solution":::

1. You can view other useful information about your solution in the **Plans** and **Usage Information + Support** tabs, and you can get other customers' impressions in the **Reviews** tab.

## Deploy your solution

1. Select the **Create** button to launch the solution deployment wizard, which will open on the **Basics** tab.

    :::image type="content" source="./media/sentinel-solutions-deploy/wizard-basics.png" alt-text="deployment wizard basics tab":::

1. Enter the subscription, resource group, and workspace to which you want to deploy the solution. 

1. Click **Next** to cycle through the remaining tabs (corresponding to the components included in the solution), where you can learn about, and in some cases configure, each of the components.

    > [!NOTE]
    > The tabs listed below correspond with the components offered by the solution shown in the accompanying screenshots. Different solutions may have different types of components, so you may not see all the same tabs in every solution, and you may see tabs not shown below.

    1. **Analytics** tab
        :::image type="content" source="./media/sentinel-solutions-deploy/wizard-analytics.png" alt-text="deployment wizard analytics tab":::

    1. **Workbooks** tab
        :::image type="content" source="./media/sentinel-solutions-deploy/wizard-workbooks.png" alt-text="deployment wizard workbooks tab":::

    1. **Playbooks** tab - you'll need to enter valid Proofpoint TAP credentials here, so that the playbook can authenticate to your Proofpoint system to take any prescribed response actions.
        :::image type="content" source="./media/sentinel-solutions-deploy/wizard-playbooks.png" alt-text="deployment wizard playbooks tab":::

1. Finally, in the **Review + create** tab, wait for the "Validation Passed" message, then click **Create** to deploy the solution. You can also select the **Download a template for automation** link to deploy the solution as code.

    :::image type="content" source="./media/sentinel-solutions-deploy/wizard-create.png" alt-text="deployment wizard review and create tab":::

## Next steps

In this document, you learned about Azure Sentinel solutions and how to find and deploy them.

- Learn more about [Azure Sentinel solutions](sentinel-solutions.md).
- See the full [Sentinel solutions catalog](sentinel-solutions-catalog.md).
