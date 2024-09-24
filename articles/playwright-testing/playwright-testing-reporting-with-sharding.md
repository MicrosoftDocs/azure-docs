---
title: Use Microsoft Playwright Testing Reporting with Playwright sharding (preview)
description: Learn how to use the Microsoft Playwright Testing service's reporting feature with test runs that use Playwright's sharding features.
author: vvs11
ms.service: playwright-testing
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 05/06/2024
ms.author: vanshsingh
---

# Use Microsoft Playwright Testing Reporting with Playwright sharding (preview)

In this article, you learn how to use the Microsoft Playwright Testing service's reporting feature with test runs that use [Playwright's sharding features](https://playwright.dev/docs/test-sharding). 

Playwright's sharding enables you to split your test suite to run across multiple machines simultaneously. This feature helps running tests in parallel.

You can use Playwright Testing's reporting feature to get a consolidated report of a test run with sharding. You need to make sure you set the variable `PLAYWRIGHT_SERVICE_RUN_ID` so that it remains same across all shards. 

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Set up continuous end-to-end testing. Complete the [Quickstart: Set up continuous end-to-end testing with Microsoft Playwright Testing Preview](./quickstart-automate-end-to-end-testing.md) to set up continuous integration (CI) pipeline.


## Set up variables

The `PLAYWRIGHT_SERVICE_RUN_ID` variable is an identifier that is used by Playwright Testing service to distinguish between test runs. The results from multiple runs with same `RUN_ID` are reported to the same run on the Playwright portal. 

By default, a test run that uses reporting feature automatically generates a unique `RUN_ID` unless you explicitly set the value yourself. If the value of the variable remains same across runs, the results are reported together in the same run on the Playwright portal. 

> [!Tip]
> If you use the cloud-hosted browsers provided by Microsoft Playwright Testing service to run your tests, you might have already set this variable. To avoid overwrites, make sure you set it only once. 


While using sharding, make sure the same `RUN_ID` is set across all the shards for the results to be reported together. 

Here's an example of how you can set it in your pipeline via GitHub Actions. 

```yml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:
    strategy:
        fail-fast: false
        matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
permissions:
  id-token: write
  contents: read
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
      # This step is to sign-in to Azure to run tests from GitHub Action workflow.
      # You can choose how set up Authentication to Azure from GitHub Actions, this is one example. 
     - name: Login to Azure with AzPowershell (enableAzPSSession true) 
      uses: azure/login@v2 
      with: 
        client-id: ${{ secrets.AZURE_CLIENT_ID }} 
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}  
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}  
        enable-AzPSSession: true 

    - name: Install dependencies
        working-directory: path/to/playwright/folder # update accordingly
      run: npm ci

    - name: Run Playwright tests
        working-directory: path/to/playwright/folder # update accordingly
      env:
        # Regional endpoint for Microsoft Playwright Testing
        PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
        PLAYWRIGHT_SERVICE_RUN_ID: ${{ github.run_id }}-${{ github.run_attempt }}-${{ github.sha } #This Run_ID will be unique and will remain same across all shards
      run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
```
