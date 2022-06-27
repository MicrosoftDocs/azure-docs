---
title: 'Tutorial: Set up continuous end-to-end testing'
titleSuffix: Microsoft Playwright Testing
description: In this tutorial, you learn how to set up continuous end-to-end testing with GitHub Actions and Microsoft Playwright Testing.
services: playwright-testing
ms.service: playwright-testing
ms.author: nicktrog
author: ntrogh
ms.date: 06/27/2022
ms.topic: tutorial
---

# Tutorial: Set up continuous end-to-end testing with GitHub Actions and Microsoft Playwright Testing Preview

In this tutorial, you'll learn how to set up continuous end-to-end testing with GitHub Actions and Microsoft Playwright Testing Preview. Create a CI/CD pipeline to trigger Playwright tests with every code push. You'll then use the CI/CD logs and the Microsoft Playwright Testing portal to diagnose failing tests.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create an access token in Microsoft Playwright Testing.
> * Create a GitHub Actions workflow.
> * Trigger tests from CI/CD on every code push.
> * Analyze test results using GitHub Actions logs.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Git. If you don't have it, [download and install it](https://git-scm.com/download).

## Set up the sample repository

The sample repository contains Playwright tests and the configuration settings to run these tests with Microsoft Playwright Testing.

1. Open a browser and go to the [sample GitHub repository](https://github.com/microsoft/playwright-service-preview).

1. Select **Fork** to fork the sample application's repository to your GitHub account.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/fork-github-repo.png" alt-text="Screenshot that shows the button to fork the sample application's GitHub repo.":::

## Authenticate with private npm repository

To run tests with Microsoft Playwright Testing, you use the `@microsoft/playwright-service` npm package. This package resides in a private package registry.

To authenticate your GitHub user account with the private repository, follow these steps:

1. Create a [GitHub personal access token (PAT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for your account.

    The token should have the `read:packages` permission.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/access-token-permissions.png" alt-text="Screenshot that shows the access token permissions.":::

    > [!IMPORTANT]
    > After generating the token, make sure to copy the token value, as you won't see it again.

1. If your organization requires SAML SSO for GitHub, authorize your personal access token to use SSO.

    1. Go to your [Personal access tokens](https://github.com/settings/tokens) page.
    1. Select **[Configure SSO](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on)** to the right of the token.
    1. Select your organization from the list to authorize SSO.

1. Create a GitHub secret *PLAYWRIGHT_SERVICE_PACKAGE_GITHUB_TOKEN* in the sample repository, and set its value to the access token you copied previously.
    
    The CI/CD workflow uses the secret to authenticate with the private npm repository.

    1. In your forked repository, select **Settings > Secrets > Actions > New repository secret**.
    1. Enter *PLAYWRIGHT_SERVICE_PACKAGE_GITHUB_TOKEN* for the **Name**, and paste the access token value that you copied previously, for the **Value**. Then, select **Add secret**.

        :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/create-secret-npm-repository.png" alt-text="Screenshot that shows the page to add a GitHub secret for the private npm repository access token.":::

## Authenticate with Microsoft Playwright Testing

Set up an access key to authenticate with Microsoft Playwright Testing.

1. Open the [Playwright portal](https://dashboard.playwright-ppe.io/) and sign in with your GitHub username and password.

1. Access the **Settings > Access Token** menu in the top-right of the screen.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/access-token-menu.png" alt-text="Screenshot that shows the Access Token menu in the Playwright portal.":::

1. Select **Generate a new token**.

1. Enter a **Token name**, select an **Expiration** duration, and then select **Generate Token**.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/create-access-token.png" alt-text="Screenshot that shows the New access token page in the Playwright portal.":::

1. In the list of access tokens, select **Copy** to copy the generated token value.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/copy-access-token-value.png" alt-text="Screenshot that shows how to copy the access token functionality in the Playwright portal.":::
    
    > [!IMPORTANT]
    > After generating the token, make sure to copy the token value, as you won't see it again.

1. Create a GitHub secret *ACCESS_KEY* in the sample repository, and set its value to the Microsoft Playwright Testing access token you copied previously.
    
    The CI/CD workflow uses the secret to authenticate with the Microsoft Playwright Testing for running the tests.

    1. In your forked repository, select **Settings > Secrets > Actions > New repository secret**.
    1. Enter *ACCESS_KEY* for the **Name**, and paste the access token value that you copied previously, for the **Value**. Then, select **Add secret**.

        :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/create-secret-playwright-testing.png" alt-text="Screenshot that shows the page to add a GitHub secret for Microsoft Playwright Testing access token.":::

## Create a GitHub Actions workflow

To run your end-to-end tests with every source code change in the repository, create a GitHub Actions workflow that triggers on every push. This workflow performs the following steps:

1. Check out the source code onto the CI/CD agent, and set up Node.js.
1. Install all dependencies for running the tests. This step uses the `PLAYWRIGHT_SERVICE_PACKAGE_GITHUB_TOKEN` secret to authenticate with the private npm repository.
1. Run the Playwright tests with Microsoft Playwright Testing. This step uses the `ACCESS_KEY` secret to authenticate with the service.

To create the GitHub Actions workflow, perform the following:

1. In your forked repository, select **Actions**, and then select **New workflow**.

      :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/create-github-actions-workflow.png" alt-text="Screenshot that shows Actions page in GitHub, highlighting the New workflow button.":::

1. Select **set up a workflow yourself**, to create a new workflow.

1. Replace the default workflow code with below code snippet:

    ```yml
    name: Run end-to-end tests with Microsoft Playwright Testing
    
    # Controls when the workflow will run
    on:
      # Triggers the workflow on push events but only for the "main" branch
      push:
        branches: [ "main" ]
    
      # Allows you to run this workflow manually from the Actions tab
      workflow_dispatch:
    
    jobs:
      test:
        defaults:
          run:
            working-directory: samples/PlaywrightTestRunner
        name: Run e2e tests
        runs-on: ubuntu-latest
    
        # Steps represent a sequence of tasks that will be executed as part of the job
        steps:
          # Checks-out your repository
          - uses: actions/checkout@v3
    
          - name: Setup Node.js environment
            uses: actions/setup-node@v3.3.0
    
          - name: Install Dependencies
            run: |
              npm set //npm.pkg.github.com/:_authToken ${{ secrets.PLAYWRIGHT_SERVICE_PACKAGE_GITHUB_TOKEN }}
              npm i
            
          - name: Run Playwright Tests
            run: |
             npm run test
            continue-on-error: true
            env:
                # Access Key for Playwright Service
                 ACCESS_KEY: ${{secrets.ACCESS_KEY}}
                 # Group Id for Playwright Test. Please change it to reflect the dashboard name
                 DASHBOARD: <my-dashboard-name>
                 WORKERS: 10
    ```

1. Replace the text placeholder `<my-dashboard-name>` with your dashboard name. 

    You can use dashboards to group test results in the Microsoft Playwright Testing portal.

    ```yml
    DASHBOARD: <my-dashboard-name>
    ```

1. Select **Start commit** to commit the GitHub Actions workflow to your repository.

    After you commit the changes, the workflow starts and runs the Playwright tests with Microsoft Playwright Testing.
    
    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/new-workflow-commit.png" alt-text="Screenshot that shows how to commit the new GitHub Actions workflow file on the GitHub page.":::

## Analyze results


## Update tests



1. Open Windows PowerShell, sign in to Azure, and set the subscription:

   ```azurecli
   az login
   az account set --subscription <your-Azure-Subscription-ID>
   ```

1. Clone the sample application's source repo:

   ```powershell
   git clone https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git
   ```

   The sample application is a Node.js app that consists of an Azure App Service web component and an Azure Cosmos DB database. The repo includes a PowerShell script that deploys the sample app to your Azure subscription. It also has an Apache JMeter script that you'll use in later steps.

1. Go to the Node.js app's directory and deploy the sample app by using this PowerShell script:

   ```powershell
   cd nodejs-appsvc-cosmosdb-bottleneck
   .\deploymentscript.ps1
   ```

   > [!TIP]
   > You can install PowerShell on [Linux/WSL](/powershell/scripting/install/installing-powershell-on-linux) or [macOS](/powershell/scripting/install/installing-powershell-on-macos).
   >
   > After you install it, you can run the previous command as `pwsh ./deploymentscript.ps1`.

1. At the prompt, provide:

   * Your Azure subscription ID.
   * A unique name for your web app.
   * A location. By default, the location is `eastus`. You can get region codes by running the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command.

   > [!IMPORTANT]
   > For your web app's name, use only lowercase letters and numbers. Don't use spaces or special characters.

1. After deployment finishes, go to the running sample application by opening `https://<yourappname>.azurewebsites.net` in a browser window.

1. To see the application's components, sign in to the [Azure portal](https://portal.azure.com) and go to the resource group that you created.

   :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/resource-group.png" alt-text="Screenshot that shows the list of Azure resource groups.":::

Now that you have the application deployed and running, you can run your first load test against it.

## Configure and create the load test

In this section, you'll create a load test by using a sample Apache JMeter test script.

The sample application's source repo includes an Apache JMeter script named *SampleApp.jmx*. This script makes three API calls to the web app on each test iteration:

* `add`: Carries out a data insert operation on Azure Cosmos DB for the number of visitors on the web app.
* `get`: Carries out a GET operation from Azure Cosmos DB to retrieve the count.
* `lasttimestamp`: Updates the time stamp since the last user went to the website.

> [!NOTE]
> The sample Apache JMeter script requires two plugins: ```Custom Thread Groups``` and ```Throughput Shaping Timer```. To open the script on your local Apache JMeter instance, you need to install both plugins. You can use the [Apache JMeter Plugins Manager](https://jmeter-plugins.org/install/Install/) to do this.

### Create the Azure Load Testing resource

The Load Testing resource is a top-level resource for your load-testing activities. This resource provides a centralized place to view and manage load tests, test results, and related artifacts.

If you don't yet have a Load Testing resource, create one now.

### Create a load test

To create a load test in the Load Testing resource for the sample app:

1. Go to the Load Testing resource and select **Create new test** on the command bar.

   :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/create-test.png" alt-text="Screenshot that shows the button for creating a new test." :::

1. On the **Basics** tab, enter the **Test name** and **Test description** information. Optionally, you can select the **Run test after creation** checkbox to automatically start the load test after creating it.

   :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/create-new-test-basics.png" alt-text="Screenshot that shows the Basics tab for creating a test." :::

1. On the **Test plan** tab, select the **JMeter script** test method, and then select the *SampleApp.jmx* test script from the cloned sample application directory. Next, select **Upload** to upload the file to Azure and configure the load test.

   :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/create-new-test-test-plan.png" alt-text="Screenshot that shows the Test plan tab and how to upload an Apache J Meter script." :::

    Optionally, you can select and upload additional Apache JMeter configuration files or other files that are referenced in the JMX file. For example, if your test script uses CSV data sets, you can upload the corresponding *.csv* file(s).

1. On the **Parameters** tab, add a new environment variable. Enter *webapp* for the **Name** and *`<yourappname>.azurewebsites.net`* for the **Value**. Replace the placeholder text `<yourappname>` with the name of the newly deployed sample application. Don't include the `https://` prefix.

    The Apache JMeter test script uses the environment variable to retrieve the web application URL. The script then invokes the three APIs in the web application.

    :::image type="content" source="media/tutorial-identify-issues-with-end-to-end-web-tests/create-new-test-parameters.png" alt-text="Screenshot that shows the parameters tab to add environment variable.":::

1. On the **Load** tab, configure the following details. You can leave the default value for this tutorial.

    |Setting  |Value  |Description  |
    |---------|---------|---------|
    |**Engine instances**     |**1**         |The number of parallel test engines that run the Apache JMeter script. |

   :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/create-new-test-load.png" alt-text="Screenshot that shows the Load tab for creating a test." :::

1. On the **Monitoring** tab, specify the application components that you want to monitor with the resource metrics. Select **Add/modify** to manage the list of application components.

   :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/create-new-test-monitoring.png" alt-text="Screenshot that shows the Monitoring tab for creating a test." :::

   :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/create-new-test-add-resource.png" alt-text="Screenshot that shows how to add Azure resources to monitor during the load test." :::

   :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/create-new-test-added-resources.png" alt-text="Screenshot that shows the Monitoring tab with the list of Azure resources to monitor." :::

1. Select **Review + create**, review all settings, and select **Create**.

   :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/create-new-test-review.png" alt-text="Screenshot that shows the tab for reviewing and creating a test." :::

> [!NOTE]
> You can update the test configuration at any time, for example to upload a different JMX file. Choose your test in the list of tests, and then select **Edit**.

## Run the load test in the Azure portal

In this section, you'll use the Azure portal to manually start the load test that you created previously. If you checked the **Run test after creation** checkbox, the test will already be running.

1. Select **Tests** to view the list of tests, and then select the test that you created.

   :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/test-list.png" alt-text="Screenshot that shows the list of tests." :::

   >[!TIP]
   > You can use the search box and the **Time range** filter to limit the number of tests.

1. On the test details page, select **Run** or **Run test**. Then, select **Run** on the **Run test** confirmation pane to start the load test.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/test-runs-run.png" alt-text="Screenshot that shows selections for running a test." :::

    Azure Load Testing begins to monitor and display the application's server metrics on the dashboard.

    You can see the streaming client-side metrics while the test is running. By default, the results refresh automatically every five seconds.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/aggregated-by-percentile.png" alt-text="Screenshot that shows the dashboard with test results.":::

    You can apply multiple filters or aggregate the results to different percentiles to customize the charts.

   > [!TIP]
   > You can stop a load test at any time from the Azure portal by selecting **Stop**.

Wait until the load test finishes fully before you proceed to the next section.

## Identify performance bottlenecks

In this section, you'll analyze the results of the load test to identify performance bottlenecks in the application. Examine both the client-side and server-side metrics to determine the root cause of the problem.

1. First, look at the client-side metrics. You'll notice that the 90th percentile for the **Response time** metric for the `add` and `get` API requests is higher than it is for the `lasttimestamp` API.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/client-side-metrics.png" alt-text="Screenshot that shows the client-side metrics.":::

    You can see a similar pattern for **Errors**, where the `lasttimestamp` API has fewer errors than the other APIs.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/client-side-metrics-errors.png" alt-text="Screenshot that shows the error chart.":::

    The results of the `add` and `get` APIs are similar, whereas the `lasttimestamp` API behaves differently. The cause might be database related, because both the `add` and `get` APIs involve database access.

1. To investigate this bottleneck in more detail, scroll down to the **Server-side metrics** dashboard section.

    The server-side metrics show detailed information about your Azure application components: Azure App Service plan, Azure App Service web app, and Azure Cosmos DB.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/app-service-metrics-for-load-testing.png" alt-text="Screenshot that shows the Azure App Service plan metrics.":::

    In the metrics for the Azure App Service plan, you can see that the **CPU Percentage** and **Memory Percentage** metrics are within an acceptable range.

1. Now, look at the Azure Cosmos DB server-side metrics.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/cosmos-db-metrics.png" alt-text="Screenshot that shows Azure Cosmos D B metrics.":::

    Notice that the **Normalized RU Consumption** metric shows that the database was quickly running at 100% resource utilization. The high resource usage might have caused database throttling errors. It also might have increased response times for the `add` and `get` web APIs.

    You can also see that the **Provisioned Throughput** metric for the Azure Cosmos DB instance has a maximum throughput of 400 RUs. Increasing the provisioned throughput of the database might resolve the performance problem.

## Validate the performance improvements

Now that you've increased the database throughput, rerun the load test and verify that the performance results have improved:

1. On the test run dashboard, select **Rerun**, and then select **Rerun** on the **Rerun test** pane.

   :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/rerun-test.png" alt-text="Screenshot that shows selections for running the load test.":::

   You'll see a new test run entry with a status column that cycles through the **Provisioning**, **Executing**, and **Done** states. At any time, select the test run to monitor how the load test is progressing.

1. After the load test finishes, check the **Response time** results and the **Errors** results of the client-side metrics.

1. Check the server-side metrics for Azure Cosmos DB and ensure that the performance has improved.

   :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/cosmos-db-metrics-post-run.png" alt-text="Screenshot that shows the Azure Cosmos D B client-side metrics after update of the scale settings.":::

   The Azure Cosmos DB **Normalized RU Consumption** value is now well below 100%.

Now that you've changed the scale settings of the database, you see that:

* The response time for the `add` and `get` APIs has improved.
* The normalized RU consumption remains well under the limit.

As a result, the overall performance of your application has improved.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

Advance to the next tutorial to learn how to set up an automated regression testing workflow by using Azure Pipelines or GitHub Actions.

> [!div class="nextstepaction"]
> [What is Microsoft Playwright Testing](./overview-what-is-microsoft-playwright-testing.md)
