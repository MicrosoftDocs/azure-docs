---
title: Managed API linting and analysis - Azure API Center
description: Configure managed linting of API definitions in your API center to analyze compliance of APIs with the organization's API style guide.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 08/20/2024
ms.author: danlep
author: dlepow
ms.custom: 
# Customer intent: As an API developer or API program manager, I want to lint the API definitions in my organization's API center and analyze whether my APIs comply with my organization's API style guide.
---

# Enable managed linting and analysis for API governance in your API center

This article explains how to enable a managed linting capability (preview) to analyze API definitions in your organization's [API center](overview.md). Linting checks your APIs against your organization's style rules and generates both individual and summary reports. Use this tool to find and fix common errors and inconsistencies in your API definitions.

> [!NOTE]
> With managed linting and analysis, API Center sets up a linting engine and any required dependencies and triggers. You can also configure linting and analysis [manually](enable-api-analysis-linting.md). Currently, managed linting in API Center is in preview.

In this scenario:

1. Add a linting ruleset (API style guide) in your API center using the Visual Studio Code extension for Azure API Center.
1. Linting automatically runs on existing, new, or updated API definitions, and when a linting ruleset is added or updated.
1. Review API analysis reports in the Azure portal to see how your API definitions conform to the style guide.

## Limitations

* Linting currently supports only JSON or YAML specification files, such as OpenAPI or AsyncAPI specification documents.
* Currently, only a single ruleset can be configured, and it's applied to all APIs in your API center.
* By default, API linting and analysis are configured using the [`spectral:oas` ruleset](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules). To extend the ruleset or create custom API style guides, see the [Spectral GitHub repo](https://github.com/stoplightio/spectral/blob/develop/docs/reference/openapi-rules.md).

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).
* One or more APIs in your API center. If you haven't registered an API yet, see [Tutorial: Register APIs in your API inventory](register-apis.md).
* [Visual Studio Code](https://code.visualstudio.com/) 

* The following Visual Studio Code extensions:
    * [Azure API Center extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center)
    
    > [!NOTE]
    > Currently, managed API analysis and linting are only available in the extension's pre-release version. When installing the extension from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center&ssr=false#overview), you can choose to install the release version or a pre-release version. Switch between the release and pre-release versions at any time by using the extension's **Manage** button context menu in the Extensions view.
    
    * [Spectral Linter for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=stoplight.spectral)
    
## Enable analysis of API definitions

To enable analysis of API definitions in your API center, first add a linting ruleset. The ruleset defines the API style guide that the linting engine uses to analyze API definitions. Currently, you use the Visual Studio Code extension for Azure API Center to add the ruleset.


To enable analysis using the default linting ruleset:

1. In Visual Studio Code, select the Azure API Center icon from the Activity Bar.
1. In the Explorer pane, expand the API center resource in which to enable managed linting and analysis.
1. Select **Rules** and select the message that appears.

:::image type="content" source="media/enable-managed-api-analysis-linting/enable-analysis-visual-studio-code.png" alt-text="Screenshot of enabling API linting and analysis in Visual Studio Code.":::

A message notifies you after API analysis is successfully enabled. The following are installed:
 
* A `ruleset.yml` file that defines the default linting rules
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

Learn more about Event Grid:

* [System topics in Azure Event Grid](../event-grid/system-topics.md)
* [Event Grid push delivery - concepts](../event-grid/concepts.md)
* [Event Grid schema for Azure API Center](../event-grid/event-schema-api-center.md)
