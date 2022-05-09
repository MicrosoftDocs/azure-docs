---
title: 'Quickstart: Connect your GitHub repositories to Microsoft Defender for Cloud'
description: Learn how to 
ms.date: 05/09/2022
ms.topic: tutorial
---

# Quickstart: Connect your GitHub repositories to Microsoft Defender for Cloud 

This article explains how to connect your GitHub repositories to Microsoft Defender for Cloud.

Microsoft Defender for Cloud protects workloads that are stored in GitHub. To protect your GitHub-based resources, you must connect your GitHub account to Defender for Cloud.

Some of the benefits provided by Defender for Cloud's protections include;

- **Environment settings page (Preview)** - This page provides an onboarding experience (including auto provisioning). This mechanism extends Defender for Cloud's enhanced security features to your GitHub resources.

- **Defender for Cloud's CSPM features** - This feature assesses your GitHub resources according to GitHub-specific security recommendations. These recommendations are also included in your secure score. Resources will be assessed for compliance with built-in standards that are specific to DevOps. Defender for Cloud's [asset inventory page](asset-inventory.md) is a multi-cloud enabled feature that helps you manage your GitHub resources alongside your Azure resources.

- **Microsoft Defender for DevOps** - Extends Defender for Cloud's threat detection capabilities and advanced defenses to your GitHub resources.

For a reference list of all the recommendations Defender for Cloud can provide for GitHub resources, see [Reference list of DevOps recommendations](#reference-list-of-recommendations).

## Prerequisitess

- A GitHub Enterprise account, or a public repository with GitHub Advanced Security enabled.
- An Azure account with Defender for Cloud onboarded. If you do not already have an Azure account [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Availability

| Aspect | Details |
|--|--|
| Release state: | Preview <br> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. |
| Pricing: | The Defender for DevOps plan is free during the Preview. <br><br> GitHub Advanced Security is a paid service and will be billed through your GitHub Enterprise Account |
| Required roles and permissions: | **Contributor** on the relevant Azure subscription <br> **Security Admin Role** in Defender for Cloud <br> **GitHub Organization Administrator** |
| Clouds: | :::image type="icon" source="media/quickstart-onboard-github/check-yes.png" border="false"::: Commercial clouds <br> :::image type="icon" source="media/quickstart-onboard-github/x-no.png" border="false"::: National (Azure Government, Azure China 21Vianet) |

## Connect your GitHub account

**To connect your github account to Microsoft Defender for Cloud**:

1.  Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Defender for Cloud**.

1. Navigate to **Environment Settings**.

    :::image type="content" source="media/quickstart-onboard-github/environmental-settings.png" alt-text="A screenshot showing where to find environment settings.":::

1. Select **Add environment**.

1. Select **GitHub**.

    :::image type="content" source="media/quickstart-onboard-github/select-github.png" alt-text="A screenshot that shows you where to select, to select Github.":::

1. Select a subscription and enter the **Name**

1. Select a **region**, **subscription**, and **resource group** from the drop-down menus.

> [!Note] 
> The subscription will be the location where Defender for DevOps will create and store the connection and GitHub resources.

1. Select **Next: Select plans**.

![Graphical user interface, text, application, email Description
automatically generated](./media/quickstart-onboard-github/image013.png)

7.  Click **Next: Authorize connection**

8.  Click **Authorize** to grant access for Azure to access your GitHub repositories. Login if required with an account that has permissions to the repositories you want to protect

     Click **Install** and choose the repositories to install the GitHub app

![Graphical user interface Description automatically generated with
medium confidence](./media/quickstart-onboard-github/image014.png)

>*Note: This will install the Defender for DevOps App on the selected repositories which will grant Defender for DevOps access to the repositories.*

9.  Click **Next : Review and create**

10. Click **Create**

    The GitHub connector should look like the following screenshot when completed:

![Graphical user interface, text, application, email Description
automatically generated](./media/quickstart-onboard-github/image015.png)

The Defender for DevOps service will now start discovering your repositories and analyzing any security issues. Once discovered, the Inventory blade will show the repositories and the Recommendations blade will show any security issues related to a repository.
