---
title: Functional validation of a Dynamics 365 Business Central offer in Microsoft AppSource.
description: Functionally validate a Dynamics 365 Business Central offer in Microsoft AppSource.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: emuench
ms.author: navits
ms.date: 12/07/2020
---

# Dynamics 365 for Customer Engagement & PowerApps functional validation

Publishing a Dynamics 365 for Customer Engagement & PowerApps offer in [Partner Center](https://partner.microsoft.com/dashboard/home) requires two functional validations:

- Upload a demonstration video of the Dynamics 365 environment that shows basic functionality.
- Present screenshots that demonstrate the solution's [Lifecycle Services](https://lcs.dynamics.com/) (LCS) environment.

> [!NOTE]
> Subsequent recertification publishes do not require demonstration. To learn more, see the [AppSource Policy document](/legal/marketplace/certification-policies#1440-dynamics-365-finance-ops).

## How to validate

There are two options for functional validation:

- Hold a 30-minute conference call with us during Pacific Standard time (PST) business hours to demonstrate and record the [LCS](https://lcs.dynamics.com/) environment and solution, or
- In Partner Center, go to [Commercial Marketplace](https://partner.microsoft.com/dashboard/commercial-marketplace/overview) > **Overview** and upload a demo video URL and LCS screenshots on the offer's Supplemental Content tab.

The Microsoft certification team reviews the video and files, then either approves the solution or emails you about next steps.

### Option 1: 30-minute conference call

To schedule a final review call, contact [appsourceCRM@microsoft.com](mailto:appsourceCRM@microsoft.com) with the name of your offer and some potential time slots between 8 AM and 5 PM Pacific Time.

### Option 2: Upload a demo video and LCS screenshots

1. Record a video and upload the address to the hosting site of your choice. Follow these guidelines:

    - Viewable by the Microsoft certification team.
    - Less than 20 minutes long.
    - Includes up to three core functionality highlights of your solution in the Dynamics 365 environment.

    > [!NOTE]
    > It is acceptable to use an existing marketing video if it meets the guidelines.

2. Take the following screenshots of the [LCS](https://lcs.dynamics.com/) environment that match the offer or solution you want to publish. They must be clear enough for the certification team to read the text. Save the screenshots as JPG files. You may provide [appSourceCRM@microsoft.com](mailto:appSourceCRM@microsoft.com) permission to your LCS environment so we can verify the setup in lieu of providing screenshots.

    1. Go to **LCS** > **Business Process Modeler** > **Project library**. Take screenshots of all the Process steps. Include the **Diagrams** and **Reviewed** columns, as shown here:

       :::image type="content" source="media/dynamics-365-finance-operations/project-library.png" alt-text="Shows the project library window.":::

      2. Go to **LCS** > **Solution Management** > **Test Solution Package**. Take screenshots that include the package overview and contents shown in these examples:

    | Field | Image <img src="" width="400px">|
    | --- | --- |
    | Package overview | [![Screenshot that shows the "Package overview" window.](media/dynamics-365-finance-operations/package-overview-45.png)](media/dynamics-365-finance-operations/package-overview.png#lightbox) |
    | <ul><li>Solution approvers</li></ul> | [![Package overview screen](media/dynamics-365-finance-operations/solution-approvers-45.png)](media/dynamics-365-finance-operations/solution-approvers.png#lightbox) |
    | Package contents<ul><li>Model</li><li>Software deployable package</li></ul> | [![Package contents screen one](media/dynamics-365-finance-operations/package-contents-1-45.png)](media/dynamics-365-finance-operations/package-contents-1.png#lightbox) |
    | <ul><li>GER configuration</li><li>Database backup</li></ul><br>Artifacts are not required in the **GER configuration** section. | [![Package contents screen two](media/dynamics-365-finance-operations/package-contents-2-45.png)](media/dynamics-365-finance-operations/package-contents-2.png#lightbox) |
    | <ul><li>Power BI report model</li><li>BPM artifact</li></ul><br>Artifacts are not required in the **Power BI** section. | [![Package contents screen three](media/dynamics-365-finance-operations/package-contents-3-45.png)](media/dynamics-365-finance-operations/package-contents-3.png#lightbox) |
    | <ul><li>Process data package</li><li>Solution license agreement and privacy policy</li></ul><br>The **GER configuration** and **Power BI report model** sections are optional to include for operations offers. | [![Package contents screen four](media/dynamics-365-finance-operations/package-contents-4-45.png)](media/dynamics-365-finance-operations/package-contents-4.png#lightbox) |

    To learn more about each section of the LCS portal, see the [LCS User Guide](/dynamics365/fin-ops-core/dev-itpro/lifecycle-services/lcs-user-guide).

3. Upload to Partner Center.

    1. Create a text document that includes the demo video address and screenshots, or save the screenshots as separate JPG files.
    2. Add the text and images to a .zip file in [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace/overview) on the offer's **Supplemental content** tab.

    [![Shows the project library window](media/dynamics-365-finance-operations/supplemental-content.png)](media/dynamics-365-finance-operations/supplemental-content.png#lightbox)

## Next steps

- To start creating an offer, see [Planning a Microsoft Dynamics 365 offer](marketplace-dynamics-365.md).
