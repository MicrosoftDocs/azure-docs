---
title: Use remote browsers for local or private applications
titleSuffix: Playwright Workspaces
description: Learn how to run end-to-end for locally deployed applications with Playwright Workspaces. Use cloud-hosted browsers to test apps on localhost or private networks.
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

# Use cloud-hosted browsers for locally deployed or privately hosted apps with Playwright Workspaces

Learn how to use Playwright Workspaces to run end-to-end tests for locally deployed applications. Playwright Workspaces uses cloud-hosted, remote browsers for running Playwright tests at scale. You can use the service to run tests for apps on localhost, or that you host on your infrastructure.

Playwright enables you to expose networks that are available on the client machine to remote browsers. When you expose a network, you can connect to local resources from your Playwright test code without having to configure additional firewall settings.

## Configure Playwright to expose local networks

To expose local networks and resources to remote browsers, you can use the `exposeNetwork` option in Playwright. Learn more about the [`exposeNetwork` option](https://playwright.dev/docs/next/api/class-browsertype#browser-type-connect-option-expose-network) in the Playwright documentation.

You can specify one or multiple networks by using a list of rules. For example, to expose test/staging deployments and [localhost](https://en.wikipedia.org/wiki/Localhost): `*.test.internal-domain,*.staging.internal-domain,<loopback>`.

::: zone pivot="playwright-test-runner"

You can configure the `exposeNetwork` option in `playwright.service.config.ts`. The following example shows how to expose the `localhost` network by using the [`<loopback>`](https://en.wikipedia.org/wiki/Loopback) rule. You can also replace `localhost` with a domain that you want to enable for the service.

```typescript
import { createAzurePlaywrightConfig, ServiceOS } from "@azure/playwright";
import { defineConfig } from "@playwright/test";
import { DefaultAzureCredential } from "@azure/identity";
import config from "./playwright.config";

export default defineConfig(
  config,
  createAzurePlaywrightConfig(config, {
    exposeNetwork: '<loopback>', // Allow service to access the localhost.
    credential: new DefaultAzureCredential()
  }),
);

```

You can now reference `localhost` in the Playwright test code, and run the tests on cloud-hosted browsers with Playwright Workspaces:

```bash
npx playwright test --config=playwright.service.config.ts --workers=20
```
::: zone-end


::: zone pivot="nunit-test-runner"

You can configure the `ExposeNetwork` option in the setup file. The following example shows how to expose the `localhost` network by using the [`<loopback>`](https://en.wikipedia.org/wiki/Loopback) rule. You can also replace `localhost` with a domain that you want to enable for the service. 

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
        credential: new DefaultAzureCredential(),
        options: new PlaywrightServiceBrowserClientOptions()
        {
            ExposeNetwork = "<loopback>"
        }
    )
    {
        // no-op
    }
}
```

You can now reference `localhost` in the Playwright test code, and run the tests on cloud-hosted browsers with Playwright Workspaces:

```bash
dotnet test -- NUnit.NumberOfTestWorkers=20
```

::: zone-end

## Related content

- [Run Playwright tests at scale with Playwright Workspaces](./quickstart-run-end-to-end-tests.md)
- Learn more about [writing Playwright tests](https://playwright.dev/docs/intro) in the Playwright documentation
