---
title: Managed API linting and analysis - Azure API Center
description: Enable managed linting of API definitions in your API center to analyze compliance of APIs with the organization's API style guide.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 08/21/2024
ms.author: danlep
author: dlepow
ms.custom: 
# Customer intent: As an API developer or API program manager, I want to analyze the API definitions in my organization's API center for compliance with my organization's API style guide.
---

# Enable API analysis in your API center - Microsoft managed

This article explains how to enable API analysis in [Azure API Center](overview.md) without having to manage it yourself (preview). API analysis offers linting capabilities to analyze API definitions within your organization's API center. Linting ensures your API definitions adhere to organizational style rules, generating both individual and summary reports. Use API analysis to identify and correct common errors and inconsistencies in your API definitions.

> [!NOTE]
> With managed linting and analysis, API Center sets up a linting engine and any required dependencies and triggers. You can also enable linting and analysis [manually](enable-api-analysis-linting.md). 

In this scenario:

1. Add a linting ruleset (API style guide) in your API center using the Visual Studio Code extension for Azure API Center.
1. Linting automatically runs when you add or update an API definition. It's also triggered for all API definitions when you deploy a ruleset to your API center.
1. Review API analysis reports in the Azure portal to see how your API definitions conform to the style guide.

## Limitations

* Currently, only OpenAPI specification documents in JSON or YAML format are analyzed.
* By default, you enable analysis with the [`spectral:oas` ruleset](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules). To extend the ruleset or create custom API style guides, see the [Spectral GitHub repo](https://github.com/stoplightio/spectral/blob/develop/docs/reference/openapi-rules.md).
* Currently, you configure a single ruleset, and it's applied to all APIs in your API center.

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).
* [Visual Studio Code](https://code.visualstudio.com/) 

* The following Visual Studio Code extensions:
    * [Azure API Center extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center)
    * [Spectral extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=stoplight.spectral)

    > [!NOTE]
    > Enable managed API analysis using the API Center extension's pre-release version. Install the extension from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center&ssr=false#overview) and choose the pre-release version. Switch between release and pre-release versions any time via the extension's **Manage** button in the Extensions view.
    
## Enable API analysis using Visual Studio Code

To enable API analysis using the default linting ruleset:

1. In Visual Studio Code, select the Azure API Center icon from the Activity Bar.
1. In the Explorer pane, expand the API center resource in which to enable managed linting and analysis.
1. Right-click **Rules** and select **Enable API Analysis**.

:::image type="content" source="media/enable-managed-api-analysis-linting/enable-analysis-visual-studio-code.png" alt-text="Screenshot of enabling API linting and analysis in Visual Studio Code.":::

A message notifies you after API analysis is successfully enabled. The following are installed locally in the `.api-center-rules` folder:
 
* A `ruleset.yml` file that defines the default API style guide used by the linting engine
* A `functions` folder with an example custom function that you can use to extend the ruleset. 

With analysis enabled, the linting engine analyzes API definitions in your API center based on the default ruleset and generates API analysis reports.

## View API analysis reports

View the analysis reports for your API definitions in the Azure portal. After an API definition is analyzed, the report lists errors, warnings, and information based on the configured API style guide. 

In the portal, you can also view a summary of analysis reports for all API definitions in your API center.

### Analysis report for an API definition

To view the analysis report for an API definition in your API center:

1. In the portal, navigate to an API version in your API center where you have added or updated an API definition.
1. In the left menu, under **Details**, select **Definitions**.
1. Select the API definition.
1. Select the **Analysis** tab.
    :::image type="content" source="media/enable-api-analysis-linting/analyze-api-definition.png" alt-text="Screenshot of Analysis tab for API definition in the portal." lightbox="media/enable-api-analysis-linting/api-analysis-report.png":::

The **API Analysis Report** opens, and it displays the API definition and errors, warnings, and information based on the configured API style guide. The following screenshot shows an example of an API analysis report.

:::image type="content" source="media/enable-api-analysis-linting/api-analysis-report.png" alt-text="Screenshot of an API analysis report in the portal." lightbox="media/enable-api-analysis-linting/api-analysis-report.png":::

### API analysis summary

To view a summary of analysis reports for all API definitions in your API center:

1. In the portal, navigate to your API center.
1. In the left-hand menu, under **Governance**, select **API Analysis**. The summary appears.

    :::image type="content" source="media/enable-api-analysis-linting/api-analysis-summary.png" alt-text="Screenshot of the API analysis summary in the portal." lightbox="media/enable-api-analysis-linting/api-analysis-summary.png":::

    Optionally select the API Analysis Report icon to view the detailed analysis report for an API definition.

## Modify or replace ruleset

You can modify or replace the default ruleset to create a custom API style guide for your organization. To modify or replace the ruleset:

1. In Visual Studio Code, select the Azure API Center icon from the Activity Bar.
1. In the Explorer pane, expand the API center resource in which you want to apply the ruleset.
1. Select **Rules** and select the `ruleset.yml` file.
1. Modify or replace the content as needed. Save your changes to `ruleset.yml`.
1. Right-click **Rules** and select **Deploy Rules to API Center**.

A message notifies you after the rules are successfully deployed to your API center. The linting engine uses the updated ruleset to analyze API definitions.

View the API analysis reports in the portal to see the results of linting with the updated ruleset.

## Related content

* [Enable API analysis in your API center - self-managed](enable-api-analysis-linting.md)
