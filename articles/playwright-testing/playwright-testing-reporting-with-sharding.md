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
> Microsoft Playwright Testing's reporting feature is currently in invite-only preview. If you want to try it out, [submit a request for access to the preview](https://aka.ms/mpt/reporting-signup).


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
jobs:
    playwright-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
        fail-fast: false
        matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
        with:
        node-version: 18
    - name: Install dependencies
        working-directory: path/to/playwright/folder # update accordingly
        run: npm ci

    - name: Install Playwright browsers # Add this step if not using cloud-hosted browsers
        working-directory: path/to/playwright/folder # update accordingly  
        run: npx playwright install --with-deps  
    
    - name: Install reporting package 
      working-directory: path/to/playwright/folder # update accordingly
      run: | # Use your GitHub PAT to install reporting package.
        npm config set @microsoft:registry=https://npm.pkg.github.com
        npm set //npm.pkg.github.com/:_authToken ${{secrets.PAT_TOKEN_PACKAGE}} 
        npm install
    
    - name: Run Playwright tests
        working-directory: path/to/playwright/folder # update accordingly
        env:
        # Access token and regional endpoint for Microsoft Playwright Testing
        PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
        PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
        PLAYWRIGHT_SERVICE_RUN_ID: ${{ github.run_id }}-${{ github.run_attempt }}-${{ github.sha }} #This Run_ID will be unique and will remain same across all shards
    run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
```
