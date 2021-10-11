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
# Discover and deploy Azure Sentinel solutions (Public preview)

> [!IMPORTANT]
>
> The Azure Sentinel solutions experience and the Azure Sentinel Content Hub are currently in **PREVIEW**, as are all individual solution packages. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Azure Sentinel Content hub provides access to both solutions, which are content packs for end-to-end product, domain, or industry needs, and are supported either by Microsoft or a partner. For more information, see the [Microsoft Partner Center](/partner-center/overview) for solutions’ authoring and publishing.

Solutions can consist of any or all of the following content types:

- **Data connectors**, some with accompanying **parsers**
- **Workbooks**
- **Analytics rules**
- **Hunting queries**
- **Playbooks**
- **Watchlists**

## Find and install or update a solution

Use this procedure to find your solution, based on it's status, the content included, support model, and more.

Install the solution in your workspace when find one that fits your organization's needs, and make sure to keep updating it with the latest changes.

**To find a solution**:

1. From the Azure Sentinel navigation menu, under **Content management**, select **Content hub (Preview)**.

1. The **Content hub** page displays a searchable and filterable grid of solutions.

    Filter the list displayed, either by entering any part of a solution name in the **Search** field, or by selecting specific values from the filters. Note that the search functionality only recognizes whole words.

    For a detailed list of available categories, see [below](#content-hub-categories).

    > [!TIP]
    > If a solution that you've deployed has updates since you deployed it, an orange triangle will indicate that you have updates to deploy, and it'll be indicated in the blue triangle at the top of the page.
    >

Each solution in the grid shows the categories applied to the solution, and types of content included in the solution.

For example, in the following image, the **Cisco Umbrella** solution shows a category of **Security - Others**, and that this solution includes 10 analytics rules, 11 hunting queries, a parser, three playbooks, and more.

:::image type="content" source="./media/sentinel-solutions-deploy/solutions-list.png" alt-text="Screenshot of the Azure Sentinel content hub":::



**To install or update a solution**:

1. In the content hub, select a solution to view more information on the right. Then select **Install**, or **Update**, if you need updates. For example:

1. On the solution details page, select **Create** or **Update** to start the solution wizard. On the wizard's **Basics** tab, enter the subscription, resource group, and workspace to which you want to deploy the solution.

1. Select **Next** to cycle through the remaining tabs (corresponding to the components included in the solution), where you can learn about, and in some cases configure, each of the content components.

    > [!NOTE]
    > The tabs displayed for you correspond with the content offered by the solution. Different solutions may have different types of content, so you may not see all the same tabs in every solution.
    >
    > You may also be prompted to enter credentials to a third party service so that Azure Sentinel can authenticate to your systems. For example, with playbooks, you may want to take response actions as prescribed in your system.
    >

1. Finally, in the **Review + create** tab, wait for the "Validation Passed" message, then select **Create** or **Update** to deploy the solution. You can also select the **Download a template for automation** link to deploy the solution as code.

For more information, see [Azure Sentinel content hub catalog](sentinel-solutions-catalog.md) and [Find your Azure Sentinel data connector](data-connectors-reference.md).


## Content hub categories

Content in the Azure Sentinel content hub is applied with one or more of the following categories:

**Domain categories**:

:::row:::
   :::column span="":::
      - Application
      - Cloud Provider
      - Compliance
      - Identity
      - IT Operations
   :::column-end:::
   :::column span="":::
      - Platform
      - Storage
      - Networking
      - User Behavior (UEBA)
   :::column-end:::
   :::column span="":::
      - Devops
      - Internet of Things (IoT)
      - Training and Tutorials
      - Migration
   :::column-end:::
:::row-end:::

**Security categories**:

:::row:::
   :::column span="":::
      - Security - Threat protection. Includes threat protection, email protection, XDR, and endpoint protection.
      - Security - Information protection
      - Security - Threat intelligence
      - Security - Network
      - Security - Vulnerability management
   :::column-end:::
   :::column span="":::
      - Security - Automation (SOAR)
      - Security - Insider Threat
      - Security - 0-day Vulnerability
      - Security - Cloud security
      - Security - Others
   :::column-end:::
:::row-end:::




## Next steps

In this document, you learned about Azure Sentinel solutions and how to find and deploy them.

- Learn more about [Azure Sentinel solutions](sentinel-solutions.md).
- See the full [Sentinel solutions catalog](sentinel-solutions-catalog.md).
