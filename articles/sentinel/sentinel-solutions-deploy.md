---
title: Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions
description: This article shows how customers can easily find and deploy data analysis tools, packaged together with data connectors and other content.
author: yelevin
ms.topic: how-to
ms.date: 11/09/2021
ms.author: yelevin
ms.custom: ignite-fall-2021
---
# Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

> [!IMPORTANT]
>
> Microsoft Sentinel solutions and the Microsoft Sentinel Content Hub are currently in **PREVIEW**, as are all individual solution packages. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Microsoft Sentinel Content hub provides access to Microsoft Sentinel out-of-the-box (built-in) content and solutions, which are packed with content for end-to-end product, domain, or industry needs.

This article describes how to install solutions in your Microsoft Sentinel workspace, making the content inside them available for your use.

- Find your solutions in the Content hub based on their statuses, the content included, support, and more.

- Install the solution in your workspace when you find one that fits your organization's needs. Make sure to keep it updated with the latest changes.

> [!TIP]
> If you are a partner who wants to create your own solution, see the [Microsoft Sentinel Solutions Build Guide](https://aka.ms/sentinelsolutionsbuildguide) for solution authoring and publishing.
>
## Find a solution

1. From the Microsoft Sentinel navigation menu, under **Content management**, select **Content hub (Preview)**.

1. The **Content hub** page displays a searchable and filterable grid of solutions.

    Filter the list displayed, either by selecting specific values from the filters, or entering any part of a solution name or description in the **Search** field.

    For more information, see [Microsoft Sentinel out-of-the-box content and solution categories](sentinel-solutions.md#microsoft-sentinel-out-of-the-box-content-and-solution-categories).

    > [!TIP]
    > If a solution that you've deployed has updates since you deployed it, an orange triangle will indicate that you have updates to deploy, and it'll be indicated in the blue triangle at the top of the page.
    >

Each solution in the grid shows the categories applied to the solution, and types of content included in the solution.

For example, in the following image, the **Cisco Umbrella** solution shows a category of **Security - Others**, and that this solution includes 10 analytics rules, 11 hunting queries, a parser, three playbooks, and more.

:::image type="content" source="./media/sentinel-solutions-deploy/solutions-list.png" alt-text="Screenshot of the Microsoft Sentinel content hub." lightbox="./media/sentinel-solutions-deploy/solutions-list.png":::

## Install or update a solution

1. In the content hub, select a solution to view more information on the right. Then select **Install**, or **Update**, if you need updates. For example:

1. On the solution details page, select **Create** or **Update** to start the solution wizard. On the wizard's **Basics** tab, enter the subscription, resource group, and workspace to which you want to deploy the solution. For example:

    :::image type="content" source="media/sentinel-solutions-deploy/wizard-basics.png" alt-text="Screenshot of a solution installation wizard, showing the Basics tab.":::

1. Select **Next** to cycle through the remaining tabs (corresponding to the components included in the solution), where you can learn about, and in some cases configure, each of the content components.

    > [!NOTE]
    > The tabs displayed for you correspond with the content offered by the solution. Different solutions may have different types of content, so you may not see all the same tabs in every solution.
    >
    > You may also be prompted to enter credentials to a third party service so that Microsoft Sentinel can authenticate to your systems. For example, with playbooks, you may want to take response actions as prescribed in your system.
    >

1. Finally, in the **Review + create** tab, wait for the `Validation Passed` message, then select **Create** or **Update** to deploy the solution. You can also select the **Download a template for automation** link to deploy the solution as code.

For more information, see [Microsoft Sentinel content hub catalog](sentinel-solutions-catalog.md) and [Find your Microsoft Sentinel data connector](data-connectors-reference.md).

## Find the support model for your solution

Each solution lists details about its support model on the solution's details pane, in the **Support** box, where either **Microsoft** or a partner's name is listed. For example:

:::image type="content" source="media/sentinel-solutions-deploy/find-support-details.png" alt-text="Screenshot of where you can find your support model for your solution." lightbox="media/sentinel-solutions-deploy/find-support-details.png":::

When contacting support, you may need other details about your solution, such as a publisher, provider, and plan ID values. You can find each of these on the solution's details page, on the **Usage information & support** tab. For example:

:::image type="content" source="media/sentinel-solutions-deploy/usage-support.png" alt-text="Screenshot of usage and support details for a solution.":::

## Next steps

In this document, you learned about Microsoft Sentinel solutions and how to find and deploy built-in content.

- Learn more about [Microsoft Sentinel solutions](sentinel-solutions.md).
- See the full [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).

Many solutions include data connectors that you'll need to configure so that you can start ingesting your data into Microsoft Sentinel. Each data connector will have it's own set of requirements, detailed on the data connector page in Microsoft Sentinel. 

For more information, see [Connect your data source](data-connectors-reference.md).
