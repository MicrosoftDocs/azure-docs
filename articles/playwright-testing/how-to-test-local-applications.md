---
title: Use remote browsers for local or private applications
description: Learn how to run end-to-end for locally deployed applications with Microsoft Playwright Testing Preview. Use cloud-hosted browsers to test apps on localhost or private networks.
ms.topic: how-to
ms.date: 10/04/2023
ms.custom: playwright-testing-preview, ignite-2024
zone_pivot_group_filename: playwright-testing/zone-pivots-groups.json
zone_pivot_groups: microsoft-playwright-testing
---

# Use cloud-hosted browsers for locally deployed or privately hosted apps with Microsoft Playwright Testing Preview

Learn how to use Microsoft Playwright Testing Preview to run end-to-end tests for locally deployed applications. Microsoft Playwright Testing uses cloud-hosted, remote browsers for running Playwright tests at scale. You can use the service to run tests for apps on localhost, or that you host on your infrastructure.

Playwright enables you to expose networks that are available on the client machine to remote browsers. When you expose a network, you can connect to local resources from your Playwright test code without having to configure additional firewall settings.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Configure Playwright to expose local networks

To expose local networks and resources to remote browsers, you can use the `exposeNetwork` option in Playwright. Learn more about the [`exposeNetwork` option](https://playwright.dev/docs/next/api/class-browsertype#browser-type-connect-option-expose-network) in the Playwright documentation.

You can specify one or multiple networks by using a list of rules. For example, to expose test/staging deployments and [localhost](https://en.wikipedia.org/wiki/Localhost): `*.test.internal-domain,*.staging.internal-domain,<loopback>`.

::: zone pivot="playwright-test-runner"

You can configure the `exposeNetwork` option in `playwright.service.config.ts`. The following example shows how to expose the `localhost` network by using the [`<loopback>`](https://en.wikipedia.org/wiki/Loopback) rule. You can also replace `localhost` with a domain that you want to enable for the service.

```typescript
import { getServiceConfig, ServiceOS } from "@azure/microsoft-playwright-testing";
import { defineConfig } from "@playwright/test";
import { AzureCliCredential } from "@azure/identity";
import config from "./playwright.config";

export default defineConfig(
  config,
  getServiceConfig(config, {
    exposeNetwork: '<loopback>', // Allow service to access the localhost.
  }),
);

```

You can now reference `localhost` in the Playwright test code, and run the tests on cloud-hosted browsers with Microsoft Playwright Testing:

```bash
npx playwright test --config=playwright.service.config.ts --workers=20
```
::: zone-end


::: zone pivot="nunit-test-runner"

You can configure the `ExposeNetwork` option in `.runsettings`. The following example shows how to expose the `localhost` network by using the [`<loopback>`](https://en.wikipedia.org/wiki/Loopback) rule. You can also replace `localhost` with a domain that you want to enable for the service. 

```xml
    <TestRunParameters>
        <!--Use this option to connect to local resources from your Playwright test code without having to configure additional firewall-->
        <Parameter name="ExposeNetwork" value="loopback" />
    </TestRunParameters>
```

You can now reference `localhost` in the Playwright test code, and run the tests on cloud-hosted browsers with Microsoft Playwright Testing:

```bash
dotnet test --settings:.runsettings --logger "microsoft-playwright-testing" -- NUnit.NumberOfTestWorkers=20
```

::: zone-end

## Related content

- [Run Playwright tests at scale with Microsoft Playwright Testing](./quickstart-run-end-to-end-tests.md)
- Learn more about [writing Playwright tests](https://playwright.dev/docs/intro) in the Playwright documentation
