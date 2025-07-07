---
title: Microsoft Playwright Testing authentication
description: Learn how to manage authentication and authorization for Microsoft Playwright Testing preview
ms.topic: how-to
ms.date: 09/07/2024
ms.custom: playwright-testing-preview, ignite-2024
zone_pivot_group_filename: playwright-testing/zone-pivots-groups.json
zone_pivot_groups: microsoft-playwright-testing
---

# Manage authentication and authorization for Microsoft Playwright Testing preview

In this article, you learn how to manage authentication and authorization for Microsoft Playwright Testing preview. Authentication is required to run Playwright tests on cloud-hosted browsers and to publish test results and artifacts to the service.

By default, [Microsoft Entra ID](/entra/identity/) is used for authentication. This method is more secure and is the recommended authentication method. You can't disable authentication using Microsoft Entra ID. However, you can also use access tokens to authenticate and authorize.


> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Background  

Microsoft Playwright Testing Preview is built on the Playwright open-source framework. It runs Playwright tests on cloud-hosted browsers and publishes reports and artifacts back to the service. 

To use the service, the client must authenticate with the service to access the browsers. Similarly, publishing results and artifacts requires authenticated API interactions. The service offers two authentication methods: Microsoft Entra ID and access tokens.

Microsoft Entra ID uses your Azure credentials, requiring a sign-in to your Azure account for secure access. Alternatively, you can generate an access token from your Playwright workspace and use it in your setup. However, we strongly recommend Microsoft Entra ID for authentication due to its enhanced security. Access tokens, while convenient, function like long-lived passwords and are more susceptible to being compromised.

## Enable authentication using access-tokens

Microsoft Playwright Testing service also supports authentication using access tokens. This authentication method is less secure. We recommend using Microsoft Entra ID to authenticate to the service. 

> [!CAUTION]
> Your workspace access tokens are similar to a password for your Microsoft Playwright Testing workspace. Always be careful to protect your access tokens. Avoid distributing access tokens to other users, hard-coding them, or saving them anywhere in plain text that is accessible to others.

Revoke and recreate your tokens if you believe they are compromised.

To enable authentication using access tokens:

1. Sign in to the [Playwright portal](https://aka.ms/mpt/portal) with your Azure account and select your workspace.

1. Select the settings icon on the home page to go to the workspace settings.

1. Select the **Authentication** page and turn on **Enable authentication using Access tokens**


    :::image type="content" source="./media/how-to-manage-authentication/playwright-testing-enable-access-token.png" alt-text="Screenshot that shows the access tokens settings page in the Playwright portal." lightbox="./media/how-to-manage-authentication/playwright-testing-enable-access-token.png":::

> [!CAUTION]
> Authentication using access tokens is less secure. [Learn how to manage access tokens](./how-to-manage-access-tokens.md)

## Set up authentication using access-tokens

::: zone pivot="playwright-test-runner"

1. While running the tests, enable access token auth in the `playwright.service.config.ts` file in your setup. 

    ```typescript
    /* Learn more about service configuration at https://aka.ms/mpt/config */
    export default defineConfig(config, getServiceConfig( config {
        serviceAuthType:'ACCESS_TOKEN'
    }));
    ```
::: zone-end

::: zone pivot="nunit-test-runner"

1. While running the tests, enable access token auth in the `.runsettings` file in your setup. 

    ```xml
    <TestRunParameters>
        <!-- Use this option when you want to authenticate using access tokens. This mode of auth should be enabled for the workspace. -->
         <Parameter name="ServiceAuthType" value="AccessToken" />
    </TestRunParameters>
    ```
::: zone-end

2. Create access token 

    Follow the steps to [create an access token](./how-to-manage-access-tokens.md#generate-a-workspace-access-token). Copy the value of the access token generated.

::: zone pivot="playwright-test-runner"

3. Set up your environment

    To set up your environment, configure the `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` environment variable with the value you obtained in the previous steps. Ensure this environment variable is available in your setup where you are running tests.

    We recommend that you use the `dotenv` module to manage your environment. With `dotenv`, you define your environment variables in the `.env` file.

    1. Add the `dotenv` module to your project:

        ```shell
        npm i --save-dev dotenv
        ```

    2. Create a `.env` file alongside the `playwright.config.ts` file in your Playwright project:
        
        ```
        PLAYWRIGHT_SERVICE_ACCESS_TOKEN={MY-ACCESS-TOKEN}
        ```

        Make sure to replace the `{MY-ACCESS-TOKEN}` text placeholder with the value you copied earlier.

::: zone-end

::: zone pivot="nunit-test-runner"

3. Set up your environment

    To set up your environment, configure the `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` environment variable with the value you obtained in the previous steps. Ensure this environment variable is available in your setup where you are running tests.

::: zone-end

## Run tests on the service and publish results

Run Playwright tests against cloud-hosted browsers and publish the results to the service using the configuration you created above.

::: zone pivot="playwright-test-runner"
```typescript
npx playwright test --config=playwright.service.config.ts --workers=20
```
::: zone-end

::: zone pivot="nunit-test-runner"
```bash
dotnet test --settings:.runsettings --logger "microsoft-playwright-testing" -- NUnit.NumberOfTestWorkers=20
```
::: zone-end
## Related content

- Learn more about [managing access tokens](./how-to-manage-access-tokens.md).
