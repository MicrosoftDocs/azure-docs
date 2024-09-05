---
title: Managed API linting and analysis - Azure API Center
description: Enable managed linting of API definitions in your API center to analyze compliance of APIs with the organization's API style guide.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 08/23/2024
ms.author: danlep
author: dlepow
ms.custom: 
# Customer intent: As an API developer or API program manager, I want to analyze the API definitions in my organization's API center for compliance with my organization's API style guide.
---

# Enable API analysis in your API center - Microsoft managed

This article explains how to enable API analysis in [Azure API Center](overview.md) without having to manage it yourself (preview). API analysis offers linting capabilities to analyze API definitions in your organization's API center. Linting ensures your API definitions adhere to organizational style rules, generating both individual and summary reports. Use API analysis to identify and correct common errors and inconsistencies in your API definitions.

> [!IMPORTANT]
> Managed API analysis in API Center sets up a linting engine and necessary dependencies automatically. You can also enable linting and analysis [manually](enable-api-analysis-linting.md) using a custom Azure function. **Disable any function used for manual linting before enabling managed API analysis.**


In this scenario:

1. Add a linting ruleset (API style guide) in your API center using the Visual Studio Code extension for Azure API Center.
1. Azure API Center automatically runs linting when you add or update an API definition. It's also triggered for all API definitions when you deploy a ruleset to your API center.
1. Review API analysis reports in the Azure portal to see how your API definitions conform to the style guide.
1. Optionally customize the ruleset for your organization's APIs. Test the custom ruleset locally before deploying it to your API center. 

## Limitations

* Currently, only OpenAPI specification documents in JSON or YAML format are analyzed.
* By default, you enable analysis with the [`spectral:oas` ruleset](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules). To learn more about the built-in rules, see the [Spectral GitHub repo](https://github.com/stoplightio/spectral/blob/develop/docs/reference/openapi-rules.md). 
* Currently, you configure a single ruleset, and it's applied to all OpenAPI definitions in your API center.
* The following are limits for maximum number of API definitions linted per 4 hours:
    * Free tier: 10
    * Standard tier: 100

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).
* [Visual Studio Code](https://code.visualstudio.com/) 

* The following Visual Studio Code extensions:
    * [Azure API Center extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center)

        > [!IMPORTANT]
        > Enable managed API analysis using the API Center extension's pre-release version. When installing the extension, choose the pre-release version. Switch between release and pre-release versions any time via the extension's **Manage** button in the Extensions view.
    * [Spectral extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=stoplight.spectral)
    
## Enable API analysis using Visual Studio Code

To enable API analysis using the default linting ruleset:

1. In Visual Studio Code, open a folder that you'll use to manage rulesets for Azure API Center.
1. Select the Azure API Center icon from the Activity Bar.
1. In the API Center pane, expand the API center resource in which to enable API analysis.
1. Right-click **Rules** and select **Enable API Analysis**.

    :::image type="content" source="media/enable-managed-api-analysis-linting/enable-analysis-visual-studio-code.png" alt-text="Screenshot of enabling API linting and analysis in Visual Studio Code.":::

A message notifies you after API analysis is successfully enabled. A folder for your API center is created in `.api-center-rules`, at the root of your working folder. The folder for your API center contains:
 
* A `ruleset.yml` file that defines the default API style guide used by the linting engine.
* A `functions` folder with an example custom function that you can use to extend the ruleset. 

With analysis enabled, the linting engine analyzes API definitions in your API center based on the default ruleset and generates API analysis reports.

## View API analysis reports

View an analysis summary and the analysis reports for your API definitions in the Azure portal. After API definitions are analyzed, the reports list errors, warnings, and information based on the configured API style guide. 

To view an analysis summary in your API center:

1. In the portal, navigate to your API center.
1. In the left-hand menu, under **Governance**, select **API Analysis**. The summary appears.

    :::image type="content" source="media/enable-api-analysis-linting/api-analysis-summary.png" alt-text="Screenshot of the API analysis summary in the portal." lightbox="media/enable-api-analysis-linting/api-analysis-summary.png":::

1. Optionally select the API Analysis Report icon for an API definition. The definition's API analysis report appears, as shown in the following screenshot.

    :::image type="content" source="media/enable-api-analysis-linting/api-analysis-report.png" alt-text="Screenshot of an API analysis report in the portal." lightbox="media/enable-api-analysis-linting/api-analysis-report.png":::

    > [!TIP]
    > You can also view the API analysis report by selecting **Analysis** from the API definition's menu bar.

## Customize ruleset

You can customize the default ruleset or replace it as your organization's API style guide. For example, you can [extend the ruleset](https://docs.stoplight.io/docs/spectral/83527ef2dd8c0-extending-rulesets) or add [custom functions](https://docs.stoplight.io/docs/spectral/a781e290eb9f9-custom-functions).

To customize or replace the ruleset:

1. In Visual Studio Code, open the `.api-center-rules` folder at the root of your working folder.
1. In the folder for the API center resource, open the `ruleset.yml` file.
1. Modify or replace the content as needed. 
1. Save your changes to `ruleset.yml`.

### Test ruleset locally

Before deploying the custom ruleset to your API center, validate it locally. The Azure API Center extension for Visual Studio Code provides integrated support for API specification linting with Spectral.

1. In Visual Studio Code, use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. 
1. Type **Azure API Center: Set active API Style Guide** and hit **Enter**.
1. Choose **Select Local File** and specify the `ruleset.yml` file that you customized. Hit **Enter**. 

    This step makes the custom ruleset the active API style guide for linting.

Now, when you open an OpenAPI-based API definition file, a local linting operation is automatically triggered in Visual Studio Code. Results are displayed inline in the editor and in the **Problems** window (**View > Problems** or **Ctrl+Shift+M**).

:::image type="content" source="media/enable-managed-api-analysis-linting/validate-local-linting.png" alt-text="Screenshot of linting an API definition in Visual Studio Code." lightbox="media/enable-managed-api-analysis-linting/validate-local-linting.png":::

Review the linting results. Make any necessary adjustments to the ruleset and continue to test it locally until it performs the way you want.

### Deploy ruleset to your API center

To deploy the custom ruleset to your API center:

1. In Visual Studio Code, select the Azure API Center icon from the Activity Bar.
1. In the API Center pane, expand the API center resource in which you customized the ruleset.
1. Right-click **Rules** and select **Deploy Rules to API Center**.

A message notifies you after the rules are successfully deployed to your API center. The linting engine uses the updated ruleset to analyze API definitions.

To see the results of linting with the updated ruleset, view the API analysis reports in the portal. 

## Related content

* [Enable API analysis in your API center - self-managed](enable-api-analysis-linting.md)
