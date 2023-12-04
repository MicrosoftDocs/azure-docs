---
title: Configure visual comparisons
description: Learn how to configure visual comparisons with Microsoft Playwright Testing.
ms.topic: how-to
ms.date: 10/04/2023
ms.custom: playwright-testing-preview
---

# Configure visual comparisons with Microsoft Playwright Testing Preview

In this article, you learn how to properly configure Playwright's visual comparison tests when using Microsoft Playwright Testing Preview. Unexpected test failures may occur because Playwright's snapshots differ between local and remote browsers.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Background

The Playwright Test runner uses the host OS as a part of the expected screenshot path. If you're running tests using remote browsers on a different OS than your host machine, the visual comparison tests fail. Our recommendation is to only run visual comparisons when using the service. If you're taking screenshots on the service, there's no need to compare them to your local setup since they don't match.

## Configure ignoreSnapshots

You can use the [`ignoreSnapshots` option](https://playwright.dev/docs/api/class-testconfig#test-config-ignore-snapshots) to only run visual comparisons when using Microsoft Playwright Testing.

1. Set `ignoreSnapshots: true` in the original `playwright.config.ts` that doesn't use the service.
1. Set `ignoreSnapshots: false` in `playwright.service.config.ts`.

When you're using the service, its configuration overrides `playwright.config.ts`, and runs visual comparisons.

## Configure the snapshot path

To configure snapshot paths for a particular project or the whole config, you can set [`snapshotPathTemplate` option](https://playwright.dev/docs/api/class-testproject#test-project-snapshot-path-template).

```js
// This path is exactly like the default path, but replaces OS with hardcoded value that is used on the service (linux).
config.snapshotPathTemplate = '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}-linux{ext}'

// This is an alternative path where you keep screenshots in a separate directory, one per service OS (linux in this case).
config.snapshotPathTemplate = '{testDir}/__screenshots__/{testFilePath}/linux/{arg}{ext}';
```

## Example service config

Example service config that runs visual comparisons and configures the path for `snapshotPathTemplate`:

```typeScript
import { defineConfig } from '@playwright/test';
import config from './playwright.config';
import dotenv from 'dotenv';

dotenv.config();

// Name the test run if it's not named yet.
process.env.PLAYWRIGHT_SERVICE_RUN_ID = process.env.PLAYWRIGHT_SERVICE_RUN_ID || new Date().toISOString();

// Can be 'linux' or 'windows'.
const os = process.env.PLAYWRIGHT_SERVICE_OS || 'linux';

export default defineConfig(config, {
  workers: 20,

  // Enable screenshot testing and configure directory with expectations.
  ignoreSnapshots: false,
  snapshotPathTemplate: `{testDir}/__screenshots__/{testFilePath}/${os}/{arg}{ext}`,

  use: {
    // Specify the service endpoint.
    connectOptions: {
      wsEndpoint: `${process.env.PLAYWRIGHT_SERVICE_URL}?cap=${JSON.stringify({
        os,
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

## Related content

- Learn more about [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots).
