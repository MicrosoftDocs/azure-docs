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
> Azure Sentinel solutions and the Azure Sentinel Content Hub are currently in **PREVIEW**, as are all individual solution packages. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Azure Sentinel Content hub provides access to Azure Sentinel solutions, packed with content for for end-to-end product, domain, or industry needs. This article describes how to install solutions in your Azure Sentinel workspace, making the content inside them available for your use.

If you are a partner who wants to create your own solution, see the [Microsoft Partner Center](/partner-center/overview) for solutions’ authoring and publishing.

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

### Find a solution

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

### Install or update a solution

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

## Solution support

Both Microsoft and other organizations author Azure Sentinel solutions. Each solution has one of the following support types:

| Support type| Description|
|-------------|------------|
|**Microsoft-supported**|Applies to:<ul><li>Solutions where Microsoft is the data provider, where relevant, and author.</li><li>Some Microsoft-authored solutions for non-Microsoft data sources.</li></ul>Microsoft supports and maintains solutions in this category in accordance with [Microsoft Azure Support Plans](https://azure.microsoft.com/support/options/#overview).<br><br>Partners or the Community support solutions that are authored by any party other than Microsoft.|
|**Partner-supported**|Applies to solutions authored by parties other than Microsoft.<br><br>The partner company provides support or maintenance for these solutions. The partner company can be an Independent Software Vendor, a Managed Service Provider (MSP/MSSP), a Systems Integrator (SI), or any organization whose contact information is provided on the Azure Sentinel page for that solution.<br><br>For any issues with a partner-supported solution, contact the specified solution support contact.|
|**Community-supported**|Applies to solutions authored by Microsoft or partner developers that don't have listed contacts for solution support and maintenance on the specified solution page in Azure Sentinel.<br><br>For questions or issues with these solutions, you can [file an issue](https://github.com/Azure/Azure-Sentinel/issues/new/choose) in the [Azure Sentinel GitHub community](https://aka.ms/threathunters).|



## Next steps

In this document, you learned about Azure Sentinel solutions and how to find and deploy them.

- Learn more about [Azure Sentinel solutions](sentinel-solutions.md).
- See the full [Sentinel solutions catalog](sentinel-solutions-catalog.md).
