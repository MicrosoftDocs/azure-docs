---
title: Managed API linting and analysis - Azure API Center
description: Configure managed linting of API definitions in your API center to analyze compliance of APIs with the organization's API style guide.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 08/19/2024
ms.author: danlep
author: dlepow
ms.custom: 
# Customer intent: As an API developer or API program manager, I want to lint the API definitions in my organization's API center and analyze whether my APIs comply with my organization's API style guide.
---

# Enable managed linting and analysis for API governance in your API center

This article shows how to enable a managed linting experience (preview) to analyze API definitions in your organization's [API center](overview.md) for conformance with your organizations's API style rules. Linting generates an analysis report that you can access in your API center. Use API linting and analysis to detect common errors and inconsistencies in your API definitions.

> [!NOTE]
> With managed linting and analysis, API Center sets up all required dependencies for API linting and analysis. Currently, managed linting in API Center is in preview.

In this scenario:

1. To enable analysis of API definitions, add a linting ruleset to your API center using the Visual Studio Code extension for Azure API Center
1. Linting is automatically triggered when API definitions are added or updated in your API center, or when a linting ruleset is added or updated in your API center
1. Review the API Analysis reports in your API center to see the results of linting of your API deinitions.



### Limitations

* Linting currently supports only JSON or YAML specification files, such as OpenAPI or AsyncAPI specification documents.
* Only a single ruleset can be applied to all APIs in an API center.
<!--
* By default, the linting engine uses the built-in [`spectral:oas` ruleset](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules). To extend the ruleset or create custom API style guides, see the [Spectral GitHub repo](https://github.com/stoplightio/spectral/blob/develop/docs/reference/openapi-rules.md).-->

<!-- 
* The Azure function app that invokes linting is charged separately, and you manage and maintain it.
-->

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).
* One or more APIs in your API center. If you haven't registered an API yet, see [Tutorial: Register APIs in your API inventory](register-apis.md).
<!-- 
Any SKU limitation or API version prereq? -->

* [Visual Studio Code](https://code.visualstudio.com/) 

* The following Visual Studio Code extensions:
    * [Azure API Center extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center)
    
        > [!NOTE]
        > Currently, managed API analysis and linting are only available in the extension's pre-release version. When installing the extension from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center&ssr=false#overview), you can choose to install the release version or a pre-release version. Switch between the release and pre-release versions at any time by using the extension's **Manage** button context menu in the Extensions view.
    
    * [Spectral Linter for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=stoplight.spectral)
    
## Enable analysis of API definitions

To enable linting and analysis of API definitions in your API center, first add a linting ruleset. The ruleset defines the API style guide that the linting engine uses to analyze API definitions. Currently, you add the ruleset using the Visual Studio Code extension for Azure API Center.

By default, Azure API Center provides the [`spectral:oas` ruleset](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules).

To enable analysis using the default linting ruleset:

1. In Visual Studio Code, select the Azure API Center icon from the Activity Bar.
1. In the Explorer pane, expand the API center resource in which you want to enable managed linting and analysis.
1. To enable API analysis with the default ruleset, select **Rules** and select the message that appears.

:::image type="content" source="media/enable-managed-api-analysis-linting/enable-analysis-visual-studio-code.png" alt-text="Screenshot of enabling API linting and analysis in Visual Studio Code.":::


A message notifies you after API analysis is successfully enabled. The following are installed:

<!-- is the function app required? Could customer delete it? -->

* An Azure Function app
* A `ruleset.yml` file

With analysis enabled, the linting engine analyzes API definitions in your API center based on the default ruleset.

## View API analysis reports

You can view the analysis report for your API definitions in the Azure portal. After an API definition is analyzed, the report lists errors, warnings, and information based on the configured API style guide. 

In the portal, you can also view a summary of analysis reports for all API definitions in your API center.

### Analysis report for an API definition

To view the analysis report for an API definition in your API center:

1. In the portal, navigate to the API version in your API center where you added or updated an API definition.
1. In the left menu, under **Details**, select **Definitions**.
1. Select the API definition that you uploaded or updated.
1. Select the **Analysis** tab.
    :::image type="content" source="media/enable-api-analysis-linting/analyze-api-definition.png" alt-text="Screenshot of Analysis tab for API definition in the portal.":::

The **API Analysis Report** opens, and it displays the API definition and errors, warnings, and information based on the configured API style guide. The following screenshot shows an example of an API analysis report.

:::image type="content" source="media/enable-api-analysis-linting/api-analysis-report.png" alt-text="Screenshot of an API analysis report in the portal.":::

### API analysis summary

To view a summary of analysis reports for all API definitions in your API center:

1. In the portal, navigate to your API center.
1. In the left-hand menu, under **Governance**, select **API Analysis**. The summary appears.

    :::image type="content" source="media/enable-api-analysis-linting/api-analysis-summary.png" alt-text="Screenshot of the API analysis summary in the portal.":::

## Update or replace ruleset

You can modify or replace the default ruleset to create a custom API style guide for your organization. To add or update a ruleset:

1. In Visual Studio Code, select the Azure API Center icon from the Activity Bar.
1. In the Explorer pane, expand the API center resource in which you want to add or update a ruleset.
1. Select **Rules** and select the `ruleset.yml` file.
1. Modify or replace the ruleset as needed. Save your changes.
1. Right-click **Rules** and select **Deploy Rules to API Center**.

A message notifies you after the rules are successfully deployed to your API center. The linting engine uses the updated ruleset to analyze API definitions.

View the API analysis reports in the portal to see the results of linting with the updated ruleset.

## Related content

Learn more about Event Grid:

* [System topics in Azure Event Grid](../event-grid/system-topics.md)
* [Event Grid push delivery - concepts](../event-grid/concepts.md)
* [Event Grid schema for Azure API Center](../event-grid/event-schema-api-center.md)
