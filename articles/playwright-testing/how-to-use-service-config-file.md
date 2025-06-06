---
title: Microsoft Playwright Testing service configuration file options
description: Learn how to use options available in configuration file with Microsoft Playwright Testing preview
ms.topic: how-to
ms.date: 09/07/2024
ms.custom: playwright-testing-preview, ignite-2024
zone_pivot_group_filename: playwright-testing/zone-pivots-groups.json
zone_pivot_groups: microsoft-playwright-testing
---

# Use options available in service package with Microsoft Playwright Testing preview

::: zone pivot="playwright-test-runner"

This article shows you how to use the options available in the `playwright.service.config.ts` file that was generated for you. 
If you don't have this file in your code, follow [Quickstart: Run end-to-end tests at scale with Microsoft Playwright Testing Preview](./quickstart-run-end-to-end-tests.md) 

::: zone-end

::: zone pivot="nunit-test-runner"

This article shows you how to use the options available in the `.runsettings` file. 
If you don't have this file in your code, follow [Quickstart: Run end-to-end tests at scale with Microsoft Playwright Testing Preview](./quickstart-run-end-to-end-tests.md) 

::: zone-end

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* Follow the Quickstart guide and set up a project to run with Microsoft Playwright Testing service. See, [Quickstart: Run end-to-end tests at scale with Microsoft Playwright Testing Preview](./quickstart-run-end-to-end-tests.md) 

::: zone pivot="playwright-test-runner"

Here's version of the `playwright.service.config.ts` file with all the available options:

```typescript
import { getServiceConfig, ServiceOS } from "@azure/microsoft-playwright-testing";
import { defineConfig } from "@playwright/test";
import { AzureCliCredential } from "@azure/identity";
import config from "./playwright.config";

export default defineConfig(
  config,
  getServiceConfig(config, {
    serviceAuthType:'ACCESS_TOKEN' // Use this option when you want to authenticate using access tokens. This mode of auth should be enabled for the workspace.
    os: ServiceOS.WINDOWS, // Select the operating system where you want to run tests.
    runId: new Date().toISOString(), // Set a unique ID for every test run to distinguish them in the service portal.
    credential: new AzureCliCredential(), // Select the authentication method you want to use with Entra.
    useCloudHostedBrowsers: true, // Select if you want to use cloud-hosted browsers to run your Playwright tests.
    exposeNetwork: '<loopback>', // Use this option to connect to local resources from your Playwright test code without having to configure additional firewall settings.
    timeout: 30000 // Set the timeout for your tests.
  }),
  {
    reporter: [
      ["list"],
      [
        "@azure/microsoft-playwright-testing/reporter",
        {
          enableGitHubSummary: true, // Enable/disable GitHub summary in GitHub Actions workflow.
        },
      ],
    ],
  },
);

```

## Settings in `playwright.service.config.ts` file

* **`serviceAuthType`**:
    - **Description**: This setting allows you to choose the authentication method you want to use for your test run. 
    - **Available Options**:
        - `ACCESS_TOKEN` to use access tokens. You need to enable authentication using access tokens if you want to use this option, see [manage authentication](./how-to-manage-authentication.md).
        - `ENTRA_ID` to use Microsoft Entra ID for authentication. It's the default mode. 
    - **Default Value**: `ENTRA_ID`
    - **Example**:
      ```typescript
      serviceAuthType:'ENTRA_ID'
      ```


* **`os`**:
    - **Description**: This setting allows you to choose the operating system where the browsers running Playwright tests are hosted.
    - **Available Options**:
        - `ServiceOS.WINDOWS` for Windows OS.
        - `ServiceOS.LINUX` for Linux OS.
    - **Default Value**: `ServiceOS.LINUX`
    - **Example**:
      ```typescript
      os: ServiceOS.WINDOWS
      ```

* **`runId`**:
    - **Description**: This setting allows you to set a unique ID for every test run to distinguish them in the service portal. Using the same runId for multiple test runs results in error. For sharding, keep this same across all shards.
    - **Example**:
      ```typescript
      runId: new Date().toISOString()
      ```

* **`credential`**:
    - **Description**: This setting allows you to select the authentication method you want to use with Microsoft Entra ID.
    - **Example**:
      ```typescript
      credential: new AzureCliCredential()
      ```

* **`useCloudHostedBrowsers`**
    - **Description**: This setting allows you to choose whether to use cloud-hosted browsers or the browsers on your client machine to run your Playwright tests. If you disable this option, your tests run on the browsers of your client machine instead of cloud-hosted browsers, and you don't incur any charges.
    - **Default Value**: true
    - **Example**:
      ```typescript
      useCloudHostedBrowsers: true
      ```

* **`exposeNetwork`**
    - **Description**: This setting allows you to connect to local resources from your Playwright test code without having to configure another firewall settings. To learn more, see [how to test local applications](./how-to-test-local-applications.md)
    - **Example**:
      ```typescript
      exposeNetwork: '<loopback>'
      ```

* **`timeout`**
    - **Description**: This setting allows you to set timeout for your tests connecting to the cloud-hosted browsers. 
    - **Example**:
      ```typescript
      timeout: 30000,
      ```     

* **`reporter`**
    - **Description**: The `playwright.service.config.ts` file extends the playwright config file of your setup. This option overrides the existing reporters and sets Microsoft Playwright Testing reporter. You can add or modify this list to include the reporters that you want to use. You're billed for Microsoft Playwright Testing reporting if you add `@azure/microsoft-playwright-testing/reporter`. 
    - **Default Value**: ["@azure/microsoft-playwright-testing/reporter"]
    - **Example**:
      ```typescript
      reporter: [
      ["list"],
      ["@azure/microsoft-playwright-testing/reporter"],
      ```
* **`enableGitHubSummary`**:
    - **Description**: This setting allows you to configure the Microsoft Playwright Testing service reporter. You can choose whether to include the test run summary in the GitHub summary when running in GitHub Actions.
    - **Default Value**: true
    - **Example**:
    ```typescript
      reporter: [
        ["list"],
        [
          "@azure/microsoft-playwright-testing/reporter",
          {
            enableGitHubSummary: true,
          },
        ],
      ]
    ```
::: zone-end

::: zone pivot="nunit-test-runner"


Here's version of the `.runsettings` file with all the available options:

```xml
﻿<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
    <TestRunParameters>
        <!-- Use this option when you want to authenticate using access tokens. This mode of auth should be enabled for the workspace. -->
         <Parameter name="ServiceAuthType" value="EntraId" />
        <!-- Select the operating system where you want to run tests. -->
        <Parameter name="Os" value="linux" />
        <!-- Set a unique ID for every test run to distinguish them in the service portal.-->
        <Parameter name="RunId" value="sample-run-id1" />
        <!--Select if you want to use cloud-hosted browsers to run your Playwright tests.-->
        <Parameter name="UseCloudHostedBrowsers" value="true" />
        <!--Use this option to connect to local resources from your Playwright test code without having to configure additional firewall-->
        <Parameter name="ExposeNetwork" value="loopback" />
        <!--Select the authentication method you want to use with Entra-->
        <Parameter name="AzureTokenCredentialType" value="DefaultAzureCredential" />
        <!--Enable/disable GitHub summary in GitHub Actions workflow.-->
        <Parameter name="EnableGitHubSummary" value="false" />
    </TestRunParameters>
  <!-- NUnit adapter -->  
  <NUnit>
    <!-- Adjust parallel workers, parallel worker would also be bound by number of unit test files -->
    <NumberOfTestWorkers>10</NumberOfTestWorkers>
  </NUnit>
  <!-- General run configuration -->
  <RunConfiguration>
    <EnvironmentVariables>
      <!-- For debugging selectors, it's recommend to set the following environment variable -->
      <DEBUG>pw:api</DEBUG>
    </EnvironmentVariables>
  </RunConfiguration>
  <!-- Playwright -->  
  <Playwright>
    <BrowserName>chromium</BrowserName>
    <!--Set the timeout for your tests.-->
    <ExpectTimeout>5000</ExpectTimeout>
    <LaunchOptions>
      <Headless>false</Headless>
      <!--Channel>msedge</Channel-->
    </LaunchOptions>
  </Playwright>
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

## Config options in `.runsettings` file

* **`serviceAuthType`**:
    - **Description**: This setting allows you to choose the authentication method you want to use for your test run. 
    - **Available Options**:
        - `AccessToken` to use access tokens. You need to enable authentication using access tokens if you want to use this option, see [manage authentication](./how-to-manage-authentication.md).
        - `EntraId` to use Microsoft Entra ID for authentication. It's the default mode. 
    - **Default Value**: `EntraId`
    - **Example**:
      ```xml
      <Parameter name="ServiceAuthType" value="EntraId" />
      ```

* **`os`**:
    - **Description**: This setting allows you to choose the operating system where the browsers running Playwright tests are hosted.
    - **Available Options**:
        - "windows" for Windows OS.
        - "linux" for Linux OS.
    - **Default Value**: "linux"
    - **Example**:
      ```xml
      <Parameter name="Os" value="linux" />
      ```

* **`RunId`**:
    - **Description**: This setting allows you to set a unique ID for every test run to distinguish them in the service portal. Using the same runId for multiple test runs results in error. If you don't set it, the service package will generate a unique ID every time you trigger a test run. For sharding, keep this same across all shards.
    - **Example**:
      ```xml
      <Parameter name="RunId" value="sample-run-id1" />
      ```

* **`AzureTokenCredentialType`**:
    - **Description**: This setting allows you to select the authentication method you want to use with Microsoft Entra ID.
    - **Example**:
      ```xml
      <Parameter name="AzureTokenCredentialType" value="DefaultAzureCredential" />
      ```

* **`UseCloudHostedBrowsers`**
    - **Description**: This setting allows you to choose whether to use cloud-hosted browsers or the browsers on your client machine to run your Playwright tests. If you disable this option, your tests run on the browsers of your client machine instead of cloud-hosted browsers, and you don't incur any charges.
    - **Default Value**: true
    - **Example**:
      ```xml
      <Parameter name="UseCloudHostedBrowsers" value="true" />
      ```   
* **`ExposeNetwork`**
    - **Description**: This setting allows you to connect to local resources from your Playwright test code without having to configure another firewall settings. To learn more, see [how to test local applications](./how-to-test-local-applications.md)
    - **Example**:
      ```xml
      <Parameter name="ExposeNetwork" value="loopback" />
      ```

* **`reporter`**
    - **Description**: You can publish your test results and artifacts to the service using `microsoft-playwright-testing` logger. You can disable reporting by removing this from your `.runsettings` or by setting it to false. 
    - **Default Value**: true
    - **Example**:
      ```xml
      <Logger friendlyName="microsoft-playwright-testing" enabled="true" />
      ```

* **`EnableGitHubSummary`**:
    - **Description**: This setting allows you to configure the Microsoft Playwright Testing service reporter. You can choose whether to include the test run summary in the GitHub summary when running in GitHub Actions.
    - **Default Value**: true
    - **Example**:
    ```xml
      <Parameter name="EnableGitHubSummary" value="false" />
    ```
::: zone-end
