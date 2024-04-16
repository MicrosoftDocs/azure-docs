---
title: Use remote browsers for local applications
description: Learn how to run end-to-end for locally deployed applications with Microsoft Playwright Testing Preview. Use cloud-hosted browsers to test apps on localhost or private networks.
ms.topic: how-to
ms.date: 10/04/2023
ms.custom: playwright-testing-preview
---

# Use cloud-hosted browsers for locally deployed apps with Microsoft Playwright Testing Preview

Learn how to use Microsoft Playwright Testing Preview to run end-to-end tests for locally deployed applications. Microsoft Playwright Testing uses cloud-hosted, remote browsers for running Playwright tests at scale. You can use the service to run tests for apps on localhost, or that you host on your infrastructure.

Playwright enables you to expose networks that are available on the client machine to remote browsers. When you expose a network, you can connect to local resources from your Playwright test code without having to configure additional firewall settings.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Configure Playwright to expose local networks

To expose local networks and resources to remote browsers, you can use the `exposeNetwork` option in Playwright. Learn more about the [`exposeNetwork` option](https://playwright.dev/docs/next/api/class-browsertype#browser-type-connect-option-expose-network) in the Playwright documentation.

You can specify one or multiple networks by using a list of rules. For example, to expose test/staging deployments and [localhost](https://en.wikipedia.org/wiki/Localhost): `*.test.internal-domain,*.staging.internal-domain,<loopback>`.

You can configure the `exposeNetwork` option in `playwright.service.config.ts`. The following example shows how to expose the `localhost` network by using the [`<loopback>`](https://en.wikipedia.org/wiki/Loopback) rule:

```typescript
export default defineConfig(config, {
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

You can now reference `localhost` in the Playwright test code, and run the tests on cloud-hosted browsers with Microsoft Playwright Testing:

```bash
npx playwright test --config=playwright.service.config.ts --workers=20
```

## Related content

- [Run Playwright tests at scale with Microsoft Playwright Testing](./quickstart-run-end-to-end-tests.md)
- Learn more about [writing Playwright tests](https://playwright.dev/docs/intro) in the Playwright documentation
