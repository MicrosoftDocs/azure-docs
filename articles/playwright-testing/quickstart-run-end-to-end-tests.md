---
title: 'Quickstart: Run Playwright tests at scale'
description: 'This quickstart shows how to run your Playwright tests with highly parallel cloud browsers using Microsoft Playwright Testing. Provision cloud-hosted browsers with support for multiple operating systems and all modern browsers.'
ms.topic: quickstart
ms.date: 08/16/2023
ms.custom: playwright-testing-preview
---

# Quickstart: Run end-to-end tests at scale with Microsoft Playwright Testing Preview

In this quickstart, you learn how to run your Playwright tests with highly parallel cloud browsers using Microsoft Playwright Testing Preview. Use cloud infrastructure to validate your application across multiple browsers, devices, and operating systems.

After you complete this quickstart, you have a Microsoft Playwright Testing workspace to run your Playwright tests at scale.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Your Azure account needs the [Owner](/azure/role-based-access-control/built-in-roles#owner), or one of the [classic administrator roles](/azure/role-based-access-control/rbac-and-directory-admin-roles#classic-subscription-administrator-roles).

## Create a workspace

To get started with running your Playwright tests at scale on cloud browsers, you first create a Microsoft Playwright Testing workspace in the Playwright portal.

[!INCLUDE [Create workspace in Playwright portal](./includes/include-playwright-portal-create-workspace.md)]

## Create an access token for service authentication

Microsoft Playwright Testing uses access token to authorize users to run Playwright tests with the service. You first generate a service access token in the Playwright portal, and then store the value in an environment variable.

To generate the access token, perform the following steps:

1. In the [Playwright portal](https://aka.ms/mpt/portal), select **Generate token**, and then copy the shell command for your environment.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/playwright-testing-generate-token.png" alt-text="Screenshot that shows setup guide in the Playwright Testing portal, highlighting the 'Generate token' button.":::

1. Copy the access token for the workspace.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/playwright-testing-copy-access-token.png" alt-text="Screenshot that shows how to copy the generated access token in the Playwright Testing portal.":::

## Configure the service region endpoint

In the service configuration, you have to provide the region-specific service endpoint. The endpoint depends on the Azure region you selected when creating the workspace.

To get the service endpoint URL, perform the following steps:

1. Sign in to the [Microsoft Playwright Testing portal](https://aka.ms/mpt/portal) with your Azure account.

1. Select the workspace you created previously.

1. In **Add region endpoint in your setup**, copy the region endpoint for your workspace.

    The endpoint URL matches the Azure region that you selected when creating the workspace.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/playwright-testing-region-endpoint.png" alt-text="Screenshot that shows how to copy the workspace region endpoint in the Playwright Testing portal.":::

## Set up your environment

Ensure that the `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` and `PLAYWRIGHT_SERVICE_URL` environment variables that you obtained in the previous steps are available in your environment.

We recommend that you use the `dotenv` module to manage your environment. With `dotenv`, you define your environment variables in the `.env` file.

1. Add the `dotenv` module to your project:

    ```shell
    npm i --save-dev dotenv
    ```

1. Create a `.env` file and replace the `{MY-ACCESS-TOKEN}` and `{MY-REGION-ENDPOINT}` text placeholders:

    ```
    PLAYWRIGHT_SERVICE_ACCESS_TOKEN={MY-ACCESS-TOKEN}
    PLAYWRIGHT_SERVICE_URL={MY-REGION-ENDPOINT}
    ```

## Add Microsoft Playwright Testing configuration

To run your Playwright tests in your Microsoft Playwright Testing workspace, you need to add a service configuration file alongside your Playwright configuration file. The service configuration file references the environment variables that you specified previously. In a later step, you use this service configuration file with the Playwright CLI.

Use playwright.service.config.ts as a starting point:

1. Create a new file `playwright.service.config.ts` alongside the `playwright.config.ts` file.

1. Create a file `playwright.service.config.ts` and add the following content to it:

    ```typescript
    import { defineConfig } from '@playwright/test';
    import config from './playwright.config';
    import dotenv from 'dotenv';
    
    dotenv.config();
    
    // Name the test run if it's not named yet.
    process.env.PLAYWRIGHT_SERVICE_RUN_ID = process.env.PLAYWRIGHT_SERVICE_RUN_ID || new Date().toISOString();
    
    export default defineConfig(config, {
        // Define more generous timeout for the service operation if necessary.
        // timeout: 60000,
        // expect: {
        //   timeout: 10000,
        // },
        workers: 20,
        use: {
            // Specify the service endpoint.
            connectOptions: {
                wsEndpoint: `${process.env.PLAYWRIGHT_SERVICE_URL}?cap=${JSON.stringify({
                    // Can be 'linux' or 'windows'.
                    os: process.env.PLAYWRIGHT_SERVICE_OS || 'linux',
                    runId: process.env.PLAYWRIGHT_SERVICE_RUN_ID
                })}`,
                timeout: 30000,
                headers: {
                    'x-mpt-access-key': process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN!
                },
                // Allow service to access the localhost.
                exposeNetwork: '<loopback>'
            }
        }
    });
    ```

1. Save and commit the file to your source code repository.

## Run your tests at scale with Microsoft Playwright Testing

You've now configured your Playwright tests to run in the cloud with Microsoft Playwright Testing. To run your Playwright tests, you use the Playwright CLI and specify the service configuration file and number of workers on the command-line.

Perform the following steps to run your Playwright tests:

1. Open a terminal window and enter the following command to run your Playwright tests on remote browsers in your workspace:

    Depending on the size of your test suite, the tests run on up to 20 parallel workers.

    ```bash
    npx playwright test --config=playwright.service.config.ts --workers=20
    ```

    You should see a similar output when the tests complete:

    ```output
    Running 6 tests using 6 workers
      6 passed (18.2s)
    
    To open last HTML report run:
    
      npx playwright show-report
    ```

1. You can view the list of test runs in the Playwright portal.

    The activity log lists for each test run the following details: the total test completion time, the number of parallel workers, and the number of test minutes.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/playwright-testing-activity-log.png" alt-text="Screenshot that shows the activity log for a workspace in the Playwright Testing portal.":::

## Optimize parallel worker configuration

Once your tests are running smoothly with the service, experiment with varying the number of parallel workers to determine the optimal configuration that minimizes test completion time. With Microsoft Playwright Testing, you can run with up to 50 parallel workers. Several factors influence the best configuration for your project, such as the CPU, memory, and network resources of your client machine, the target application's load-handling capacity, and the type of actions carried out in your tests.

Learn more about how to [determine the optimal configuration for optimizing test suite completion](./concept-determine-optimal-configuration.md).

## Troubleshooting

[!INCLUDE [include-troubleshooting-unauthorized](includes/include-troubleshooting-unauthorized.md)]

[!INCLUDE [include-troubleshooting-slow-tests](includes/include-troubleshooting-slow-tests.md)]

[!INCLUDE [include-troubleshooting-test-timeout](includes/include-troubleshooting-test-timeout.md)]

[!INCLUDE [include-troubleshooting-test-hang](includes/include-troubleshooting-test-hang.md)]

[!INCLUDE [include-troubleshooting-time-different](includes/include-troubleshooting-time-different.md)]

[!INCLUDE [include-troubleshooting-firewall](includes/include-troubleshooting-firewall.md)]

## Next step

You've successfully created a Microsoft Playwright Testing workspace in the Playwright portal and run your Playwright tests on cloud browsers.

Advance to the next quickstart to set up continuous end-to-end testing by running your Playwright tests in your CI/CD workflow.

> [!div class="nextstepaction"]
> [Set up continuous end-to-end testing in CI/CD](./quickstart-automate-end-to-end-testing.md)
