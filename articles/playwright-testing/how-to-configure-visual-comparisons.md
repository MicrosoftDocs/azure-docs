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
import { getServiceConfig, ServiceOS } from '@azure/microsoft-playwright-testing';
import config from './playwright.config';

/* Learn more about service configuration at https://aka.ms/mpt/config */
export default defineConfig(
  config,
  getServiceConfig(config, {
    exposeNetwork: '<loopback>',
    timeout: 30000,
    os: ServiceOS.LINUX
  }),
  {
    /* 
    Playwright Testing service reporter is added by default.
    This will override any reporter options specified in the base playwright config.
    If you are using more reporters, please update your configuration accordingly.
    */
    reporter: [["list"], ['@azure/microsoft-playwright-testing/reporter']],
    ignoreSnapshots: false,
    // Enable screenshot testing and configure directory with expectations. 
    snapshotPathTemplate: `{testDir}/__screenshots__/{testFilePath}/${ServiceOS.LINUX}/{arg}{ext}`,
  }
);
```

## Related content

- Learn more about [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots).
