---
title: Managed API linting and analysis - Azure API Center
description: Automatic linting of API definitions in your API center helps you analyze compliance of APIs with the organization's API style guide.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 03/31/2025
ms.author: danlep
author: dlepow
ms.custom: 
# Customer intent: As an API developer or API program manager, I want to analyze the API definitions in my organization's API center for compliance with my organization's API style guide.
---

# Analyze APIs in your API center - Microsoft managed

Your organization's [API center](overview.md) includes built-in, Microsoft-managed linting capabilities (preview) to analyze API definitions for adherence to organizational style rules, generating both individual and summary reports. API analysis identifies and helps you correct common errors and inconsistencies in your API definitions.

With API analysis:

* Azure API Center automatically analyzes your API definitions whenever you add or update an API definition. API definitions are linted by default with a [spectral:oas ruleset](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules) (API style guide).  
* API analysis reports are generated in the Azure portal, showing how your API definitions conform to the style guide.
* Use analysis profiles to specify the ruleset and filter conditions for the APIs that are analyzed. Customize a profile's ruleset using the Azure API Center extension for Visual Studio Code. 

> [!IMPORTANT]
> If you prefer, you can enable [self-managed](enable-api-analysis-linting.md) linting and analysis using a custom Azure function, overriding the built-in capabilities. **Disable any function used for self-managed linting before using managed API analysis.**

## Limitations

* Currently, only OpenAPI and AsyncAPI specification documents in JSON or YAML format are analyzed.
* There are [limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=/azure/api-center/toc.json&bc=/azure/api-center/breadcrumb/toc.json#azure-api-center-limits) for the number of analysis profiles and the maximum number of API definitions analyzed. Analysis can take a few minutes to up to 24 hours to complete.

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md). 
* For customizing the ruleset, [Visual Studio Code](https://code.visualstudio.com/) and the following Visual Studio Code extensions:
    * [Azure API Center extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center)
    * [Spectral extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=stoplight.spectral)
    
## View API analysis reports

View an analysis summary and the analysis reports for your API definitions in the Azure portal. After API definitions are analyzed, the reports list errors, warnings, and information based on the configured API style guide. 

In the API analysis report, also review the ruleset that was used for the analysis and the history of linting passes.

To view an analysis summary in your API center:

1. In the portal, navigate to your API center.
1. In the left-hand menu, under **Governance**, select **API Analysis**. The summary appears.

    :::image type="content" source="media/enable-api-analysis-linting/api-analysis-summary.png" alt-text="Screenshot of the API analysis summary in the portal." lightbox="media/enable-api-analysis-linting/api-analysis-summary.png":::

1. Optionally select the API Analysis Report icon for an API definition. The definition's API analysis report appears, as shown in the following screenshot.

    :::image type="content" source="media/enable-api-analysis-linting/api-analysis-report.png" alt-text="Screenshot of an API analysis report in the portal." lightbox="media/enable-api-analysis-linting/api-analysis-report.png":::

    > [!TIP]
    > You can also view the API analysis report by selecting **Analysis** from the API definition's menu bar.

## Manage analysis profiles

Azure API Center uses *analysis profiles* for linting and analyzing APIs. An analysis profile specifies a ruleset and optionally filter conditions for APIs that are analyzed. The default analysis profile applies the `spectral:oas` ruleset to all OpenAPI and AsyncAPI definitions. 

You can customize the ruleset and define filter conditions in the default profile, or you can create a new profile. For example, you might want to use one profile for APIs that are in development and a different one for APIs that are in production.

> [!NOTE]
> In the Standard plan of API Center, you can create up to 3 analysis profiles. Only a single profile is supported in the Free plan.

To create an analysis profile:

1. In the Azure portal, navigate to your API center.
1. In the left-hand menu, under **Governance**, select **API Analysis** > **Manage analysis profiles** > **+ Create analysis profile**.
1. In the **Create new analysis profile** pane, enter a **Name** and **Description** for the profile.
1. In **Ruleset**, the analyzer type (linting engine) for the ruleset appears. Currently only Spectral is supported.
1. Under **Define filter conditions**, add one or more filter conditions for API definitions that the profile is applied to.
1. Select **Create**.


:::image type="content" source="media/enable-managed-api-analysis-linting/create-analysis-profile.png" alt-text="Screenshot of creating an analysis profile in the portal.":::

The profile is created and a ruleset scaffold is created. To view the current ruleset, select the profile, and in the context (...) menu, select **View the ruleset**.

Continue to the following sections to customize the ruleset. 

### Customize the profile's ruleset

Use the Visual Studio Code extension for Azure API Center to customize a profile's ruleset. After customizing the ruleset and testing it locally, you can deploy it back to your API center.

1. In Visual Studio Code, select the Azure API Center icon from the Activity Bar.
1. In the API Center pane, expand the API center resource you are working with, and expand **Profiles**.
1. Expand the profile you want to modify, and select `ruleset.yaml`.
1. Modify or replace the content as needed. 
1. Save your changes to `ruleset.yaml`.

### Test ruleset locally

Before deploying the custom ruleset to your API center, validate it locally. The Azure API Center extension for Visual Studio Code provides integrated support for API specification linting with Spectral.

1. In Visual Studio Code, use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. 
1. Type **Azure API Center: Set active API Style Guide** and hit **Enter**.
1. Choose **Select Local File** and specify the `ruleset.yaml` file that you customized. Hit **Enter**. 

    This step makes the custom ruleset the active API style guide for local linting.

Now, when you open an OpenAPI-based API definition file, a local linting operation is automatically triggered in Visual Studio Code. Results are displayed inline in the editor and in the **Problems** window (**View > Problems** or **Ctrl+Shift+M**).

> [!TIP]
> API developers in your organization can also use this local linting capability to help improve their API definitions before registering APIs in your API center.

:::image type="content" source="media/enable-managed-api-analysis-linting/validate-local-linting.png" alt-text="Screenshot of linting an API definition in Visual Studio Code." lightbox="media/enable-managed-api-analysis-linting/validate-local-linting.png":::

Review the linting results. Make any necessary adjustments to the ruleset and continue to test it locally until it performs the way you want.

### Deploy ruleset to your API center

To deploy the custom ruleset to your API center:

1. In Visual Studio Code, select the Azure API Center icon from the Activity Bar.
1. In the API Center pane, expand the API center resource in which you customized the ruleset.
1. Expand **Profiles**.
1. Right-click the profile in which you customized the ruleset, and select **Deploy Rules to API Center**.

A message notifies you after the rules are successfully deployed to your API center. The linting engine uses the updated ruleset to analyze API definitions in the profile.

To see the results of linting with the updated ruleset, view the API analysis reports in the portal. 

## Related content

* To learn more about the default built-in ruleset, see the [Spectral GitHub repo](https://github.com/stoplightio/spectral/blob/develop/docs/reference/openapi-rules.md). 
* [Enable API analysis in your API center - self-managed](enable-api-analysis-linting.md)
