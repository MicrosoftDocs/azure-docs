---
title: Supported browsers & operating systems
titleSuffix: Microsoft Playwright Testing
description: Supported operating system and browsers in Microsoft Playwright Testing.
services: playwright-testing
ms.service: playwright-testing
ms.topic: reference
ms.author: nicktrog
author: ntrogh
ms.date: 10/10/2022
---

# Supported operating systems and browsers in Microsoft Playwright Testing Preview

In this article, learn which operating systems and browsers Microsoft Playwright Testing Preview supports for running Playwright tests. Microsoft Playwright Testing enables you to run tests against browsers on multiple operating systems by extending the configuration in [Playwright test projects](https://playwright.dev/docs/test-advanced#projects).

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Supported operating systems

Microsoft Playwright Testing supports running tests on Windows or Ubuntu. The following table lists the supported operating system versions:

| Operating system | Version | `os` | `os_version` |
|----|-----|----|-----|
| Windows | Windows 11    | `windows` | `windows-latest` or `windows-11`  |
| Windows | Windows 10    | `windows` | `windows-10`                      |
| Ubuntu  | Ubuntu 20.04  | `linux`   | `ubuntu-latest` or `ubuntu-20.04` |
| Ubuntu  | Ubuntu 18.04  | `linux`   | `ubuntu-18.04`                    |

By default, Microsoft Playwright Testing runs tests on the latest Ubuntu version. Learn how to override the default operating system and [run tests on multiple operating systems](./how-to-cross-platform-tests.md).

> [!NOTE]
> macOS support is coming soon. [Contact the product team](mailto:pw-service-preview@microsoft.com) to register early access for macOS.

## Supported browsers

Microsoft Playwright Testing supports all browsers that are supported by Playwright across all [supported operating systems](#supported-operating-systems). Playwright supports the latest browsers at any moment.
Learn more about [supported browsers](https://playwright.dev/docs/browsers) in the Playwright documentation.

You can configure the browser for a test by specifying the `testOptions.browserName` field. You can further configure the browser configuration, or select a [preconfigured configuration](https://playwright.dev/docs/test-configuration#emulation).

The following table lists the supported browser types:

| Browser | browserName |
|----|-----|
| Chromium | `chromium` |
| Firefox | `firefox` |
| WebKit | `webkit` |

By default, Playwright uses the Chrome browser. Learn how to [configure existing Playwright tests to run with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md).

## Next steps

- Learn how to [run tests on multiple operating systems](./how-to-cross-platform-tests.md).
- Learn how to [configure existing Playwright tests with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md).
