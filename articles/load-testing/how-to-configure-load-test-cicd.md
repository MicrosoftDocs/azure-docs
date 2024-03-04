---
title: 'Manually configure CI/CD for load tests'
titleSuffix: Azure Load Testing
description: 'This article shows how to run your load tests with Azure Load Testing in CI/CD. Learn how to add a load test to GitHub Actions or Azure Pipelines.'
author: ntrogh
ms.author: nicktrog
ms.service: load-testing
ms.topic: how-to 
ms.date: 06/05/2023
---

# Manually configure CI/CD for load tests in GitHub Actions or Azure Pipelines

You can automate a load test in Azure Load Testing by creating a CI/CD pipeline. In this article, you learn how to manually configure GitHub Actions or Azure Pipelines to invoke an existing test in Azure Load Testing. Automate a load test to continuously validate your application performance and stability under load. 

To add an existing load test to a CI/CD pipeline:

- Configure service authentication to allow GitHub Actions or Azure Pipelines to connect to your Azure load testing resource.
- Export the load test configuration files, such as the JMeter file and load test YAML configuration.
- Update the CI/CD pipeline definition to invoke Azure Load Testing.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Load Testing test. Create a [URL-based load test](./quickstart-create-and-run-load-test.md) or [use an existing JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md) to create a load test.

# [Azure Pipelines](#tab/pipelines)
- An Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up?view=azure-devops&preserve-view=true). If you need help with getting started with Azure Pipelines, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline?preserve-view=true&view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser).

# [GitHub Actions](#tab/github)
- A GitHub account. If you don't have a GitHub account, you can [create one for free](https://github.com/).
- A GitHub repository to store the load test input files and create a GitHub Actions workflow. To create one, see [Creating a new repository](https://docs.github.com/github/creating-cloning-and-archiving-repositories/creating-a-new-repository).

---

## Configure service authentication

To run a load test in your CI/CD workflow, you need to grant permission to the CI/CD workflow to access your load testing resource. Create a service principal for the CI/CD workflow and assign the Load Test Contributor Azure RBAC role.

# [Azure Pipelines](#tab/pipelines)

### Create a service connection in Azure Pipelines

In Azure Pipelines, you create a *service connection* in your Azure DevOps project to access resources in your Azure subscription. When you create the service connection, Azure DevOps creates an Azure Active Directory service principal object.

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`), and select your project.
    
    Replace the `<your-organization>` text placeholder with your project identifier.

1. Select **Project settings** > **Service connections** > **+ New service connection**.

1. In the **New service connection** pane, select the **Azure Resource Manager**, and then select **Next**.

1. Select the **Service Principal (automatic)** authentication method, and then select **Next**.

1. Enter the service connection details, and then select **Save** to create the service connection.

    | Field | Value |
    | ----- | ----- |
    | **Scope level** | *Subscription*. |
    | **Subscription** | Select the Azure subscription that hosts your load testing resource. |
    | **Resource group** | Select the resource group that contains your load testing resource. |
    | **Service connection name** | Enter a unique name for the service connection. |
    | **Grant access permission to all pipelines** | Checked. |

1. From the list of service connections, select the one you created earlier, and then select **Manage Service Principal**.

    :::image type="content" source="./media/quickstart-add-load-test-cicd/service-connection-manage-service-principal.png" alt-text="Screenshot that shows selections for managing a service principal." lightbox="./media/quickstart-add-load-test-cicd/service-connection-manage-service-principal.png":::

    The Azure portal opens in a separate browser tab and shows the service principal details.

1. In the Azure portal, copy the **Display name** value.

    You use this value in the next step to grant permissions for running load tests to the service principal.

### Grant access to Azure Load Testing

Azure Load Testing uses Azure RBAC to grant permissions for performing specific activities on your load testing resource. To run a load test from your CI/CD pipeline, you grant the Load Test Contributor role to the service principal.

1. In the [Azure portal](https://portal.azure.com/), go to your Azure Load Testing resource.

1. Select **Access control (IAM)** > **Add** > **Add role assignment**.

1. In the **Role** tab, select **Load Test Contributor** in the list of job function roles.

    :::image type="content" source="media/quickstart-add-load-test-cicd/load-test-contributor-role-assignment.png" alt-text="Screenshot that shows the list of roles in the Add role assignment page in the Azure portal, highlighting the Load Test Contributor role." lightbox="media/quickstart-add-load-test-cicd/load-test-contributor-role-assignment.png":::

1. In the **Members** tab, select **Select members**, and then use the display name you copied previously to search the service principal.

1. Select the service principal, and then select **Select**.

1. In the **Review + assign tab**, select **Review + assign** to add the role assignment.

You can now use the service connection in your Azure Pipelines workflow definition to access your Azure load testing resource.

# [GitHub Actions](#tab/github)

To access your Azure Load Testing resource from the GitHub Actions workflow, you first create an Azure Active Directory [service principal](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object). This service principal represents your GitHub Actions workflow in Azure Active Directory. 

Next, you grant permissions to the service principal to create and run a load test with your Azure Load Testing resource.

### Create a service principal

Create a service principal in the Azure subscription and assign the Load Test Contributor role so that your GitHub Actions workflow has access to your Azure load testing resource to run load tests.

1. Create a service principal and assign the `Load Test Contributor` role:

    ```azurecli-interactive
    loadtest=$(az resource show -g <resource-group-name> -n <load-testing-resource-name> --resource-type "Microsoft.LoadTestService/loadtests" --query "id" -o tsv)
    echo $loadtest

    az ad sp create-for-rbac --name "my-load-test-cicd" --role "Load Test Contributor" \
                             --scopes $loadtest \
                             --sdk-auth
    ```

    The output is a JSON object that represents the service principal. You use this information to authenticate with Azure in the GitHub Actions workflow.

    ```output
    Creating 'Load Test Contributor' role assignment under scope
    {
      "clientId": "00000000-0000-0000-0000-000000000000",
      "clientSecret": "00000000-0000-0000-0000-000000000000",
      "subscriptionId": "00000000-0000-0000-0000-000000000000",
      "tenantId": "00000000-0000-0000-0000-000000000000",
      "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
      "resourceManagerEndpointUrl": "https://management.azure.com/",
      "activeDirectoryGraphResourceId": "https://graph.windows.net/",
      "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
      "galleryEndpointUrl": "https://gallery.azure.com/",
      "managementEndpointUrl": "https://management.core.windows.net/"    
    }
    ```

    > [!NOTE]
    > You might get a `--sdk-auth` deprecation warning when you run this command. Alternatively, you can use OpenID Connect (OIDC) based authentication for authenticating GitHub with Azure. Learn how to [use the Azure login action with OpenID Connect](/azure/developer/github/connect-from-azure#use-the-azure-login-action-with-openid-connect).

1. Copy the output JSON object to the clipboard.

    In the next step, you store the service principal information as a GitHub Actions secret.

### Store Azure credentials in GitHub Actions secret

Create a GitHub Actions secret to securely store the service principal information. You use this secret in your workflow definition to connect to authenticate with Azure and access your Azure load testing resource.

> [!NOTE]
> If you're using OpenID Connect to authenticate with Azure, you don't have to pass the service principal object in the Azure login action. Learn how to [use the Azure login action with OpenID Connect](/azure/developer/github/connect-from-azure#use-the-azure-login-action-with-openid-connect).

To create a GitHub Actions secret:

1. In [GitHub](https://github.com), browse to your repository.

1. Select **Settings** > **Secrets & variables** > **Actions**.

1. Select **New repository secret**, enter the secret information, and then select **Add secret** to create a new secret.

    | Field | Value |
    | ----- | ----- |
    | **Name** | *AZURE_CREDENTIALS* |
    | **Secret** | Paste the JSON output from the service principal creation command you copied earlier. |

You can now access your Azure subscription and load testing resource from your GitHub Actions workflow by using the stored credentials.

---

## Export load test input files

To run a load test with Azure Load Testing in a CI/CD workflow, you need to add the load test configuration settings and any input files in your source control repository. If you have an existing load test, you can download the configuration settings and all input files from the Azure portal.

Perform the following steps to download the input files for an existing load testing in the Azure portal:

1. In the [Azure portal](https://portal.azure.com/), go to your Azure Load Testing resource.

1. On the left pane, select **Tests** to view the list of load tests, and then select your test.

    :::image type="content" source="media/quickstart-add-load-test-cicd/view-all-tests.png" alt-text="Screenshot that shows the list of tests for an Azure Load Testing resource.":::  

1. Selecting the ellipsis (**...**) next to the test run you're working with, and then select **Download input file**.

    The browser downloads a zipped folder that contains the load test input files.

    :::image type="content" source="media/quickstart-add-load-test-cicd/download-load-test-input-files.png" alt-text="Screenshot that shows how to download the results file for a load test run.":::

1. Use any zip tool to extract the input files.

    The folder contains the following files:

    - `config.yaml`: the load test YAML configuration file. You reference this file in the CI/CD workflow definition.
    - `.jmx`: the JMeter test script
    - Any additional input files, such as CSV files or user properties files that are needed to run the load test.

1. Commit all extracted input files to your source control repository.

    Use the source code repository in which you configure the CI/CD pipeline.

## Update the CI/CD workflow definition

Azure Load Testing supports both GitHub Actions and Azure Pipelines for running load tests.

# [Azure Pipelines](#tab/pipelines)

### Install the Azure Load Testing extension for Azure DevOps

To create and run a load test, the Azure Pipelines workflow definition uses the [Azure Load Testing task](/azure/devops/pipelines/tasks/test/azure-load-testing) extension from the Azure DevOps Marketplace.

1. Open the [Azure Load Testing task extension](https://marketplace.visualstudio.com/items?itemName=AzloadTest.AzloadTesting) in the Azure DevOps Marketplace, and select **Get it free**.

1. Select your Azure DevOps organization, and then select **Install** to install the extension.

    If you don't have administrator privileges for the selected Azure DevOps organization, select **Request** to request an administrator to install the extension.

### Update the Azure Pipelines workflow

Update your Azure Pipelines workflow to run a load test for your Azure load testing resource.

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`), and select your project.

1. Select **Pipelines** in the left navigation, select your pipeline, and then select **Edit** to edit your workflow definition.

    Alternately, select **Create Pipeline** to create a new pipeline in Azure Pipelines.

1. Use the `AzureLoadTest` task to run the load test.

    Specify the load test configuration file you exported earlier in the `loadTestConfigFile` property.
    
    Replace the *`<load-testing-resource>`* and *`<load-testing-resource-group>`* text placeholders with the name of your Azure load testing resource and the resource group.

    ```yml
        - task: AzureLoadTest@1
          inputs:
            azureSubscription: $(serviceConnection)
            loadTestConfigFile: 'config.yaml'
            loadTestResource: <load-testing-resource>
            resourceGroup: <load-testing-resource-group>
    ```

    Optionally, you can pass parameters or secrets to the load test by using the `env` or `secrets` property.

1. Use the `publish` task to publish the test results as artifacts in your Azure Pipelines workflow run.

    ```yml
        - publish: $(System.DefaultWorkingDirectory)/loadTest
          artifact: loadTestResults
    ```

# [GitHub Actions](#tab/github)

### Update the GitHub Actions workflow

Update your GitHub Actions workflow to run a load test for your Azure load testing resource.

1. In [GitHub](https://github.com), browse to your repository.

1. Edit your GitHub Actions workflow or [create a new workflow](https://docs.github.com/actions/quickstart) in your GitHub repository.

1. Use the `actions/checkout` action to check out the repository with the load test input files.

    ```yml
        - name: Checkout
          uses: actions/checkout@v3
    ```
    
1. Use the `azure/login` action to authenticate with Azure by using the stored credentials.

    Paste the following YAML contents in your workflow definition:

    ```yml
        - name: Login to Azure
          uses: azure/login@v1
          continue-on-error: false
          with:
            creds: ${{ secrets.AZURE_CREDENTIALS }}
    ```

1. Use the `azure/load-testing` action to run the load test.

    Specify the load test configuration file you exported earlier in the `loadTestConfigFile` property.
    
    Replace the *`<load-testing-resource>`* and *`<load-testing-resource-group>`* text placeholders with the name of your Azure load testing resource and the resource group.

    ```yml
        - name: 'Azure Load Testing'
          uses: azure/load-testing@v1
          with:
            loadTestConfigFile: 'config.yaml'
            loadTestResource: <load-testing-resource>
            resourceGroup: <load-testing-resource-group>
    ```

    Optionally, you can pass parameters or secrets to the load test by using the `env` or `secrets` property.

1. Use the `actions/upload-artifact` action to publish the test results as artifacts in your GitHub Actions workflow run.

    ```yml
        - uses: actions/upload-artifact@v2
          with:
            name: loadTestResults
            path: ${{ github.workspace }}/loadTest
    ```

---

## View load test results

When you run a load test from your CI/CD pipeline, you can view the summary results directly in the CI/CD output log. If you published the test results as a pipeline artifact, you can also download a CSV file for further reporting.

:::image type="content" source="./media/quickstart-add-load-test-cicd/github-actions-workflow-completed.png" alt-text="Screenshot that shows the workflow logging information.":::

## Clean up resources

If you don't plan to use any of the resources that you created, delete them so you don't incur any further charges.

# [Azure Pipelines](#tab/pipelines)

1. Remove Azure Pipelines changes:
    1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`), and select your project.
        
        Replace the `<your-organization>` text placeholder with your project identifier.

    1. If you created a new pipeline": 
        1. Select **Pipelines**, and then select your pipeline.
        1. Select the ellipsis, and then select **Delete**.

            :::image type="content" source="./media/quickstart-add-load-test-cicd/azure-pipelines-delete.png" alt-text="Screenshot that shows how to delete an Azure Pipelines definition." lightbox="./media/quickstart-add-load-test-cicd/azure-pipelines-delete.png":::

        1. Enter the pipeline name, and then select **Delete** to delete the pipeline.

    1. If you modified an existing workflow definition, undo the modifications for running the load test, and save the workflow.

1. Remove the service connection:    
    1. Select **Project settings** > **Service connections**, and then select your service connection.
    1. Select **Edit** > **Delete** to remove the service connection.

# [GitHub Actions](#tab/github)

1. Remove GitHub Actions changes:
    1. In [GitHub](https://github.com), browse to your repository.
    1. If you created a new workflow definition, delete the workflow YAML file in the `.github/workflows` folder.
    1. If you modified an existing workflow definition, undo the modifications for running the load test, and save the workflow.

1. Remove the service principal:

    ```azurecli-interactive
    az ad sp delete --id $(az ad sp show --display-name "my-load-test-cicd" -o tsv)
    ```

---

## Next steps

Advance to the next article to learn how to identify performance regressions by defining test fail criteria and comparing test runs.

- [Tutorial: automate regression tests](./tutorial-identify-performance-regression-with-cicd.md)
- [Define test fail criteria](./how-to-define-test-criteria.md)
- [View performance trends over time](./how-to-compare-multiple-test-runs.md)
