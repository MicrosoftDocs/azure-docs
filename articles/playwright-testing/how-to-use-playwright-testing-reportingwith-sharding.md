# Use Microsoft Playwright Testing Reporting (invite-only preview) with Playwright sharding

In this article you learn how to use the Microsoft Playwright Testing service's reporting feature (invite-only preview) with test runs that use the sharding feature of Playwright. 

Playwright's sharding enables you to split your test suite and run across multiple machines simultaneously. This helps running tests in parallel. You can learn more about the feature [here](https://playwright.dev/docs/test-sharding)

You can use Playwright Testing's reporting feature to get a consolidated report of the test run with sharding. You need to make sure you set the variable `PLAYWRIGHT_SERVICE_RUN_ID` and it remains same across all shards. 

> [!IMPORTANT]
> Microsoft Playwright Testing's reporting feature is currently in invite-only preview. If you want to try it out, sign up [here](https://aka.ms/mpt/reporting-signup)


## Use PLAYWRIGHT_SERVICE_RUN_ID variable in your test runs

`PLAYWRIGHT_SERVICE_RUN_ID` is an identifier that is used by Playwright Testing service to distinguish between test runs. The results from multiple runs with same RUN_ID are reported to the same run on the Playwright portal. 

By default, a test run that uses reporting feature always generates a unique RUN_ID unless the variable is set by the user, in which case, the set value is used. If the value of the variable remains same across runs, the results are reported together in the same run on the Playwright portal. 

> [!Tip]
> If you are using the cloud-hosted browsers provided by Microsoft Playwright Testing service to run your tests, you might already be setting this variable. Make sure you are using it properly to avoid overwrites. 

While using sharding, please make sure the same RUN_ID is set across all the shards for the results to be reported together. 

Here's an example of how you can set it in your pipeline. 

# [GitHub Actions](#tab/github)
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

    - name: Install Playwright browsers #Add this step if not using cloud-hosted browsers
        working-directory: path/to/playwright/folder # update accordingly  
        run: npx playwright install --with-deps  
    
    - name: Run Playwright tests
        working-directory: path/to/playwright/folder # update accordingly
        env:
        # Access token and regional endpoint for Microsoft Playwright Testing
        PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
        PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
        PLAYWRIGHT_SERVICE_RUN_ID: ${{ github.run_id }}-${{ github.run_attempt }}-${{ github.sha }} #This Run_ID will be unique and will remain same across all shards
    run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
```