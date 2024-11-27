---
title: Microsoft Playwright Testing features
description: Learn how to use different features offered by Microsoft Playwright Testing service
ms.topic: how-to
ms.date: 09/07/2024
ms.custom: playwright-testing-preview, ignite-2024
zone_pivot_group_filename: playwright-testing/zone-pivots-groups.json
zone_pivot_groups: microsoft-playwright-testing
---

# Use features of Microsoft Playwright Testing preview

In this article, you learn how to use the features provided by Microsoft Playwright Testing preview. 

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Microsoft Playwright Testing workspace. To create a workspace, see [Quickstart: Run Playwright tests at scale](./quickstart-run-end-to-end-tests.md).
- To manage features, your Azure account needs to have the [Contributor](/azure/role-based-access-control/built-in-roles#owner) or [Owner](/azure/role-based-access-control/built-in-roles#contributor) role at the workspace level. Learn more about [managing access to a workspace](./how-to-manage-workspace-access.md).

## Background

Microsoft Playwright Testing preview allows you to:
- Accelerate build pipelines by running tests in parallel using cloud-hosted browsers.
- Simplify troubleshooting by publishing test results and artifacts to the service, making them easily accessible through the service portal.

These features have their own pricing plans and are billed separately. You can choose to use either feature or both. These features can be enabled or disabled for the workspace or for any specific run. To know more about pricing, see [Microsoft Playwright Testing preview pricing](https://aka.ms/mpt/pricing)

## Manage feature for the workspace

1. Sign in to the [Playwright portal](https://aka.ms/mpt/portal) with your Azure account.

1. Select the workspace settings icon, and then go to the **General** page to view the workspace settings.

1. Navigate to **Feature management** section.

    :::image type="content" source="./media/how-to-use-service-features/playwright-testing-enable-reporting-for-workspace.png" alt-text="Screenshot that shows the workspace settings page in the Playwright Testing portal for Feature Management." lightbox="./media/how-to-use-service-features/playwright-testing-enable-reporting-for-workspace.png":::


1. Choose the features you want to enable for your workspace.

    Currently, you can choose to enable or disable only reporting feature of the service. By default, reporting is enabled for the workspace. 

## Manage features while running tests

You can also choose to use either feature or both for a test run. 

> [!IMPORTANT]
> You can only use a feature in a test run if it is enabled for the workspace.
::: zone pivot="playwright-test-runner"
1. In your Playwright setup, go to `playwright.service.config.ts` file and use these settings for feature management. 

```typescript
import { getServiceConfig, ServiceOS } from "@azure/microsoft-playwright-testing";
import { defineConfig } from "@playwright/test";
import { AzureCliCredential } from "@azure/identity";
import config from "./playwright.config";

export default defineConfig(
  config,
  getServiceConfig(config, {
    useCloudHostedBrowsers: true, // Select if you want to use cloud-hosted browsers to run your Playwright tests.
  }),
  {
    reporter: [
      ["list"],
      ["@azure/microsoft-playwright-testing/reporter"], //Microsoft Playwright Testing reporter
    ],
  },
);
```
- **`useCloudHostedBrowsers`**: 
    - **Description**: This setting allows you to choose whether to use cloud-hosted browsers or the browsers on your client machine to run your Playwright tests. If you disable this option, your tests run on the browsers of your client machine instead of cloud-hosted browsers, and you do not incur any charges. You can still configure reporting options.
    - **Default Value**: true
    - **Example**:
      ```typescript
      useCloudHostedBrowsers: true
      ```
- **`reporter`**
    - **Description**: The `playwright.service.config.ts` file extends the Playwright configuration file of your setup. This option overrides the existing reporters and sets the Microsoft Playwright Testing reporter. You can add or modify this list to include the reporters you want to use. You are billed for Microsoft Playwright Testing reporting if you add `@azure/microsoft-playwright-testing/reporter`. This feature can be used independently of cloud-hosted browsers, meaning you don’t have to run tests on service-managed browsers to get reports and artifacts on the Playwright portal.
    - **Default Value**: ["@azure/microsoft-playwright-testing/reporter"]
    - **Example**:
      ```typescript
      reporter: [
      ["list"],
      ["@azure/microsoft-playwright-testing/reporter"]],
      ```

::: zone-end

::: zone pivot="nunit-test-runner"

1. In your Playwright setup, go to `.runsettings` file and use these settings for feature management. 

```xml
﻿<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
    <TestRunParameters>
        <!--Select if you want to use cloud-hosted browsers to run your Playwright tests.-->
        <Parameter name="UseCloudHostedBrowsers" value="true" />
    </TestRunParameters>
  <!-- NUnit adapter -->  
  .
  .
  .
    <LoggerRunSettings>
        <Loggers>
            <!--microsoft playwright testing service logger for reporting -->
            <Logger friendlyName="microsoft-playwright-testing" enabled="true" />
            <!--could enable any logger additionally -->
            <Logger friendlyName="trx" enabled="false" />
        </Loggers>
    </LoggerRunSettings>
</RunSettings>

```

* **`UseCloudHostedBrowsers`**
    - **Description**: This setting allows you to choose whether to use cloud-hosted browsers or the browsers on your client machine to run your Playwright tests. If you disable this option, your tests run on the browsers of your client machine instead of cloud-hosted browsers, and you don't incur any charges.
    - **Default Value**: true
    - **Example**:
      ```xml
      <Parameter name="UseCloudHostedBrowsers" value="true" />
      ```   

* **`reporter`**
    - **Description**: You can publish your test results and artifacts to the service using `microsoft-playwright-testing` logger. You can disable reporting by removing this from your `.runsettings` or by setting it to false. 
    - **Default Value**: true
    - **Example**:
      ```xml
      <Logger friendlyName="microsoft-playwright-testing" enabled="true" />
      ```
::: zone-end
## Related content

- Learn more about [Microsoft Playwright Testing preview pricing](https://aka.ms/mpt/pricing).
