---
title: Test private and localhost endpoints
titleSuffix: Microsoft Playwright Testing
description: Learn how to configure Microsoft Playwright Testing to test application endpoints that aren't publicly hosted, or run on development servers hosted on localhost.
services: playwright-testing
ms.service: playwright-testing
ms.topic: how-to
ms.author: nicktrog
author: ntrogh
ms.date: 08/01/2022
---

# Test private endpoints with Microsoft Playwright Testing Preview

Learn how to configure Microsoft Playwright Testing Preview to test application endpoints that aren't publicly hosted, or run on development servers hosted on localhost.

This functionality enables the following usage scenarios:

* Test an on-premises application that isn't publicly accessible.
* Test an application that is publicly accessible with access restrictions, such as client IP addresses.
* Test an application that is hosted on a development server, on localhost.

Microsoft Playwright Testing enables you to test any application endpoint that is accessible by the Playwright client machine. If you're running tests interactively from the command-line or your developer IDE, the client machine is your developer box. If you run your tests in a CI/CD pipeline, the client machine is the CI/CD agent machine. The client machine has to create an outbound connection on port 443 to the Microsoft Playwright Testing endpoint.

The following diagram shows an architectural overview for testing an endpoint from a CI/CD pipeline.

:::image type="content" source="./media/how-to-test-private-endpoints/playwright-testing-private-endpoints.png" alt-text="Diagram that shows an architectural overview for testing private endpoints in a CI/CD pipeline with Microsoft Playwright Testing.":::

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* The client machine that runs the Playwright tests can:

  * Make an outbound connection to Microsoft Playwright Testing on port 443.
  * Connect to the application endpoint.

## Enable connectivity

To enable testing privately hosted endpoints, update the Playwright configuration file and enable the `enablePortForward` setting.

1. Open the `playwright.config.ts` file, or an equivalent Playwright configuration file, in your favorite editor.

1. Set the value of `enablePortForward` to `true`.

    ```typescript
    const playwrightService = new PlaywrightService({
      name: "Private endpoint test",
      dashboard: process.env.DASHBOARD || "Default Group",
      enablePortForward: true,
    });
    ```

1. Save the file changes.

1. Reference your endpoint in the Playwright test specifications.

    For example, to test an endpoint that is hosted on localhost, port 3000:

    ```typescript
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:3000/");
    });
    ```

1. Run your Playwright tests.

    To run your tests by using the Playwright CLI:

    ```bash
    npx playwright test
    ```

## Next steps

- Learn more about [how Microsoft Playwright Testing works](./overview-what-is-microsoft-playwright-testing.md).
- Learn more about [managing workspaces in the Azure portal](./how-to-manage-workspace-in-azure-portal.md).
