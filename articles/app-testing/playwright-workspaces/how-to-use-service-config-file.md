---
title: Playwright Workspaces configuration file options
titleSuffix: Playwright Workspaces
description: Learn how to use options available in configuration file with Playwright Workspaces
ms.topic: how-to
ms.date: 08/07/2025
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: johnsta
ms.author: johnsta
ms.custom: playwright-workspaces
zone_pivot_group_filename: app-testing/playwright-workspaces/zone-pivots-groups.json
zone_pivot_groups: playwright-workspaces
---

# Use options available in service package with Playwright Workspaces

::: zone pivot="playwright-test-runner"

This article shows you how to use the options available in the `playwright.service.config.ts` file that was generated for you. 
If you don't have this file in your code, follow [Quickstart: Run end-to-end tests at scale with Playwright Workspaces](./quickstart-run-end-to-end-tests.md) 

::: zone-end

::: zone pivot="nunit-test-runner"

This article shows you how to use the options available in the `PlaywrightServiceSetup.cs` file. 
If you don't have this file in your code, follow [Quickstart: Run end-to-end tests at scale with Playwright Workspaces](./quickstart-run-end-to-end-tests.md) 

::: zone-end

## Prerequisites

* Follow the Quickstart guide and set up a project to run with Playwright Workspaces. See, [Quickstart: Run end-to-end tests at scale with Playwright Workspaces](./quickstart-run-end-to-end-tests.md) 

::: zone pivot="playwright-test-runner"

Below is a complete example of a `playwright.service.config.ts` file showing all supported configuration options:

```typescript
import { createAzurePlaywrightConfig, ServiceOS, ServiceAuth } from "@azure/playwright";
import { defineConfig } from "@playwright/test";
import { AzureCliCredential } from "@azure/identity";
import config from "./playwright.config";

export default defineConfig(
  config,
  createAzurePlaywrightConfig(config, {
    serviceAuthType: ServiceAuth.ACCESS_TOKEN // Use this option if authenticating with access tokens. This mode of authentication must be explicitly enabled in your workspace.
    os: ServiceOS.WINDOWS, // Specify the browser's OS your tests will automate.
    runName: "Sample-Run-Name1", // Set a Name for every test run to distinguish them in the azure portal.
    credential: new AzureCliCredential(), // Select the authentication method you want to use with Entra.
    exposeNetwork: '<loopback>', // Allows cloud browsers to access local resources from your Playwright test code without additional firewall config.
    connectTimeout: 30000 // Set the timeout for your tests (in milliseconds).
  })
);

```

## Settings in `playwright.service.config.ts` file

* **`serviceAuthType`**:
    - **Description**: This setting allows you to choose the authentication method you want to use for your test run. 
    - **Available Options**:
        - `ServiceAuth.ACCESS_TOKEN` to use access tokens. You need to enable authentication using access tokens if you want to use this option, see [manage authentication](./how-to-manage-authentication.md).
        - `ServiceAuth.ENTRA_ID` to use Microsoft Entra ID for authentication. It's the default mode. 
    - **Default Value**: `ServiceAuth.ENTRA_ID`
    - **Example**:
      ```typescript
      serviceAuthType: ServiceAuth.ENTRA_ID
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

* **`runName`**:
    - **Description**: This setting allows you to set a custom name for every test run to distinguish them in the portal.
    - **Example**:
      ```typescript
      runName: "Sample-Run-Name1"
      ```

* **`credential`**:
    - **Description**: This setting allows you to select the authentication method you want to use with Microsoft Entra ID. You must specify this if `serviceAuthType` is **not** set to `ACCESS_TOKEN`.
    - **Example**:
      ```typescript
      credential: new AzureCliCredential()
      ```

* **`exposeNetwork`**
    - **Description**: This setting allows you to connect to local resources from your Playwright test code without having to configure another firewall settings. To learn more, see [how to test local applications](./how-to-test-local-applications.md)
    - **Example**:
      ```typescript
      exposeNetwork: '<loopback>'
      ```

* **`connectTimeout`**
    - **Description**: This setting allows you to set timeout for your tests connecting to the cloud-hosted browsers. 
    - **Example**:
      ```typescript
      connectTimeout: 30000,
      ```     
::: zone-end

::: zone pivot="nunit-test-runner"


Here's version of the setup file with all the available options:

```c#
using Azure.Developer.Playwright.NUnit;
using Azure.Developer.Playwright;
using Azure.Identity;
using System.Runtime.InteropServices;
using System;

namespace PlaywrightService.SampleTests; // Remember to change this as per your project namespace

[SetUpFixture]
public class PlaywrightServiceNUnitSetup : PlaywrightServiceBrowserNUnit
{
    public PlaywrightServiceNUnitSetup() : base(
        credential: new ManagedIdentityCredential(), // Select the authentication method you want to use with Entra.
        options: new PlaywrightServiceBrowserClientOptions()
        {
            OS = OSPlatform.Linux, // Specify the browser's OS your tests will automate.
            ExposeNetwork = "<loopback>", // Allows cloud browsers to access local resources from your Playwright test code without additional firewall config.
            RunName = 'CustomRun', // Set a name for every test run to distinguish them in the portal.
            ServiceAuth = ServiceAuthType.EntraId // Use this option if authenticating with access tokens. This mode of authentication must be explicitly enabled in your workspace.
        }
    )
    {
        // no-op
    }
}
```

## Config options in the setup file

* **`ServiceAuth`**:
    - **Description**: This setting allows you to choose the authentication method you want to use for your test run. 
    - **Available Options**:
        - `ServiceAuthType.AccessToken` to use access tokens. You need to enable authentication using access tokens if you want to use this option, see [manage authentication](./how-to-manage-authentication.md).
        - `ServiceAuthType.EntraId` to use Microsoft Entra ID for authentication. It's the default mode. 
    - **Default Value**: `ServiceAuthType.EntraId`

* **`OS`**:
    - **Description**: This setting allows you to choose the operating system where the browsers running Playwright tests are hosted.
    - **Available Options**:
        - `OSPlatform.Windows` for Windows OS.
        - `OSPlatform.Linux` for Linux OS.
    - **Default Value**: `OSPlatform.Linux`

* **`RunName`**:
    - **Description**: This setting allows you to set a name for every test run to distinguish them in the service portal. If you don't set it, the service package will generate a unique ID every time you trigger a test run.

* **`credential`**:
    - **Description**: This setting allows you to select the authentication method you want to use with Microsoft Entra ID. You must specify this if `ServiceAuth` is **not** set to `ServiceAuthType.AccessToken`.

* **`ExposeNetwork`**
    - **Description**: This setting allows you to connect to local resources from your Playwright test code without having to configure another firewall settings. To learn more, see [how to test local applications](./how-to-test-local-applications.md)
      
::: zone-end
