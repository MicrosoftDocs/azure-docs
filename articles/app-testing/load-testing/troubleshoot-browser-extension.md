---
title: Troubleshoot issues with browser recording extension
titleSuffix: Azure Load Testing
description: Learn about the troubleshooting steps to fix issues with using browser recorder extension to create and run load tests. 
services: load-testing
ms.service: azure-app-testing
author: Abhinav-Premsekhar
ms.author: apremsekhar
ms.topic: troubleshooting
ms.date: 05/26/2026
---

# Troubleshoot issues with using the Browser Recorder extension to create and run load tests

This article helps you diagnose and resolve common issues when using the Azure App Testing browser extension to record user scenarios and generate load tests in Azure Load Testing. 

## Prerequisites

Before you begin troubleshooting, ensure that you:

- Install the Azure App Testing browser extension for Microsoft Edge or Google Chrome.
- Have access to an Azure subscription and an Azure Load Testing resource.
- Can sign in to the extension and select your subscription and resource.

## Troubleshoot extension setup

### Selecting **Record** redirects to install the extension | The extension tab doesn't open | The extension opens but doesn't initialize

- Install or reinstall the Azure App Testing browser extension.
- Ensure the extension is enabled in your browser.
- Use a supported browser (Microsoft Edge or Google Chrome).
- Restart your browser and clear cache if needed.
- Sign out and sign in again in the extension tab.

## Troubleshoot recording issues

### Recording doesn't start | User actions aren't captured | Navigation steps are missing

1. Start recording from the extension:
  - Enter your application URL.
  - Select **Start recording**.

1. Perform actions only within the recording browser window.

1. Avoid:
  - Switching to windows.
  - Using unsupported browser interactions.

1. Verify network connectivity:
  - Ensure no firewall or proxy blocks requests.
  - Ensure your application endpoint is reachable.

1. Retry recording by using a clean browser profile or incognito mode.

## Troubleshoot script generation issues

### Selecting Review and create test fails | Generated script has missing or incorrect steps | Issues with parameterization or correlation

1. Review recorded domains and filter requests if needed.
1. Re-record the scenario:
- Use a simpler user flow.
- Avoid unnecessary redirects.
1. If you're using AI enhancements:
- Disable AI suggestions and regenerate the script.
1. Download the generated script and inspect it for missing or invalid requests.

## Troubleshoot test execution failures

### Test run ends with Error or Stopped status | High error rate during execution | Test doesn't complete

#### Possible causes

- Errors in the generated test script
- Unsupported JMeter features
- Missing files or dependencies
- Auto-stop triggered due to high failure rate

---
1. Review the load test dashboard:
- Check error rates and failing requests

1. Download test logs and results:
- Identify failing requests and error messages

1. Run the test in debug mode:
- Inspect request and response details

1. Validate your script:
- Ensure all referenced files and dependencies are included
- Remove unsupported components
- Download the generated test script and run it locally

## Troubleshoot issues when tests work locally but fail in Azure

### Script runs successfully locally but test fails or behaves differently in Azure

1. Verify you can access your application endpoint from Azure.
1. Ensure your test script includes all dependencies.
1. Review authentication and session handling in the script.
1. Inspect logs to identify environment-specific failures.

## Troubleshoot missing or incorrect results

### No results after test run | 504 or other HTTP errors | Metrics missing or incomplete

1. Verify the test run completed successfully.
1. Download the results file and analyze request-level errors.
1. Check error codes and response messages in the results.
1. Review client-side and server-side metrics for performance issues.

## Next steps

- Learn how to [Create and run a load test from a recording](./quickstart-create-run-load-tests-from-recording.md).
- Learn more about the [Analyze load test results](./how-to-analyze-test-results-using-actionable-insights.md).
