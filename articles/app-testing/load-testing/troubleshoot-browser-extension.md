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

#### Symptoms
- Selecting **Record** redirects to install the extension
- The extension tab doesn't open
- The extension opens but doesn't initialize

#### Solutions
- Install or reinstall the Azure App Testing browser extension.
- Ensure the extension is enabled in your browser.
- Use a supported browser (Microsoft Edge or Google Chrome).
- Restart your browser and clear cache if needed.
- Sign out and sign in again in the extension tab.

## Troubleshoot recording issues

#### Symptoms
- Recording doesn't start.
- User actions aren't captured.
- Navigation steps are missing.

#### Solutions
1. Start recording from the extension:
   - Enter your application URL.
   - Select **Start recording**.

2. Perform actions only within the recording browser window.

3. Avoid:
   - Switching to windows.
   - Using unsupported browser interactions.

4. Verify network connectivity:
   - Ensure no firewall or proxy blocks requests.
   - Ensure your application endpoint is reachable.

5. Retry recording by using a clean browser profile.

## Troubleshoot script generation issues

#### Symptoms
- Selecting **Review and create** test fails.
- Generated script has missing or incorrect steps.
- Problems with parameterization or correlation.

#### Solutions
1. Review recorded domains and filter requests if needed.
2. Re-record the scenario:
   - Use a simpler user flow.
   - Avoid unnecessary redirects.
3. If you're using AI enhancements:
   - Disable AI suggestions and regenerate the script.
4. Download the generated script and inspect it for missing or invalid requests.

## Troubleshoot test execution failures

#### Symptoms
- Test run ends with Error or Stopped status.
- High error rate during execution.
- Test doesn't complete.

#### Possible causes
- Errors in the generated test script
- Unsupported JMeter features
- Missing files or dependencies
- Auto-stop triggered due to high failure rate

#### Solutions
1. Review the load test dashboard:
   - Check error rates and failing requests

2. Download test logs and results:
   - Identify failing requests and error messages

3. Run the test in debug mode:
   - Inspect request and response details

## Troubleshoot issues when tests work locally but fail in Azure

#### Symptoms
- Script runs successfully locally but test fails or behaves differently in Azure

#### Solutions
1. Verify you can access your application endpoint from Azure.
2. Ensure your test script includes all dependencies.
3. Review authentication and session handling in the script.
4. Inspect logs to identify environment-specific failures.

## Troubleshoot missing or incorrect results

#### Symptoms
- No results after test run
- 504 or other HTTP errors
- Metrics missing or incomplete

#### Solutions
1. Verify the test run completed successfully.
2. Download the results file and analyze request-level errors.
3. Check error codes and response messages in the results.
4. Review client-side and server-side metrics for performance issues.

## Next steps

- Learn how to [Create and run a load test from a recording](./quickstart-create-run-load-tests-from-recording.md).
- Learn more about the [Analyze load test results](./how-to-analyze-test-results-using-actionable-insights.md).
