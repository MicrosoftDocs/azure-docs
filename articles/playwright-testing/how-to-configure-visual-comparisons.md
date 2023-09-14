---
title: Configure visual comparisons
description: Learn how to configure visual comparisons with Microsoft Playwright Testing.
ms.topic: how-to
ms.date: 09/13/2023
ms.custom: playwright-testing-preview
---

# Configure visual comparisons with Microsoft Playwright Testing Preview

The Playwright Test runner uses the host OS as a part of the expected screenshot path. If you're running tests using remote browsers on a different OS than your host machine, this means the visual comparison tests will likely fail. To configure snapshot paths for a particular project or the whole config, you can set [`snapshotPathTemplate` option](https://playwright.dev/docs/api/class-testproject#test-project-snapshot-path-template):

```js
// This path is exactly like the default path, but replaces OS with hardcoded value that is used on the service (linux).
config.snapshotPathTemplate = '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}-linux{ext}'

// This is an alternative path where you keep screenshots in a separate directory, one per service OS (linux in this case).
config.snapshotPathTemplate = '{testDir}/__screenshots__/{testFilePath}/linux/{arg}{ext}';
```

Our recommendation is to set `ignoreSnapshots: true` in the original `playwright.config.ts` that doesn't use the service. If you're taking screenshots on the service, there's no need to compare them to your local setup since they'll never match. Set `snapshotPathTemplate` to a separate directory and `ignoreSnapshots: false` in the service config.

## Example service config

This is an example service config that sets the OS to linux, then the OS variable gets referenced in the path for `snapshotPathTemplate`:

```ts
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
        'x-mpt-access-key': process.env.PLAYWRIGHT_SERVICE_ACCESS_KEY!
      },
      // Allow service to access the localhost.
      exposeNetwork: '<loopback>'
    }
  }
});
```
