---
title: Recover a deploment to a Flex Consumption plan in Azure Functions
description: Learn how to recover from a bad deployment to an app running in the Flex Consumption plan by rolling back or rolling forward through your deployment process.
#customer intent: As a developer, I want to roll back or forward a Flex Consumption function app deployment so that I can quickly recover from a bad release.
ms.topic: how-to
ms.service: azure-functions
ms.date: 06/28/2026
---

# Recover from a bad Flex Consumption plan app deployment

When a deployment introduces a bug, you need a way to recover quickly. This article shows you how to recover from a bad deployment to a [Flex Consumption](./flex-consumption-plan.md) function app by using a continuous integration and continuous deployment (CI/CD) process. This process includes these recovery methods:

| Recovery method | Speed | When to use | Description |
| --- | --- | --- | --- |
| Re-run previous successful run ([roll back](#roll-back-a-deployment)) | Fastest | Known good version exists, or no data or state changes between versions | Select a previous run and re-run it, then wait for build and deploy. |
| `git revert` and then `git push` ([roll forward](#roll-forward-a-deployment)) | Moderate | Fix is simple, or external state can't be rolled back | Identify the breaking commit, revert it, and push. Then wait for the same build and deploy time. |
| `git commit` a hotfix and then `git push` ([roll forward](#roll-forward-a-deployment)) | Slowest | Root cause is known and needs a targeted fix | Identify the root cause; create, review, test, and merge a fix; and then wait for build and deploy to complete. |

These strategies recover both your function app code and the app settings, so your configuration changes are recoverable with code changes.

## Why you need CI/CD to recover a deployment

When you deploy code to your Flex Consumption plan app: 

- Your code is deployed as a zip package to a blob storage container, which is mounted at startup. 
- Each deployment overwrites the current package. 
- The platform keeps no built-in revision history to retain previous versions.
- The [deployment slots](./functions-deployment-slots.md) feature isn't currently supported.   
- App settings are applied separately through the Azure portal, CLI, or infrastructure-as-code (IaC), and the platform can't restore them to a previous state.

These deployment behaviors limit your options for recovering your Flex Consumption plan app from a bad deployment. 

Your Git history and CI/CD process provide the only way to track code deployments at a given point in time. Building a deployment that includes both code and configuration enables you to recover from a bad release by pointing the next run at a known good commit.

For more information about the Flex Consumption deployment model, see [Flex Consumption plan](flex-consumption-plan.md#deployment) and [Site updates in the Flex Consumption plan](flex-consumption-site-updates.md).

## Prerequisites

- An existing function app deployed to a [Flex Consumption plan](./flex-consumption-plan.md) in Azure.

- Source code in a Git repository. Use Git tags or record commit SHAs for each release so you can quickly identify what to roll back to. 

- A deployment configured for your function app:

    #### [GitHub Actions](#tab/github-actions)
       
    A workflow configured with OIDC authentication as described in [Continuous delivery by using GitHub Actions](functions-how-to-github-actions.md). The workflow must use `azure/login`. Publish-profile auth doesn't support the `az cli` commands used in this guide.
    
    #### [Azure Pipelines](#tab/azure-pipelines)
    
    A pipeline configured with a service connection as described in [Continuous delivery by using Azure Pipelines](functions-how-to-azure-devops.md).

    ---

## Prepare your deployment to manage app settings

Before you can perform a complete rollback, you must put your app settings in source control and apply them as part of your deployment. While this approach lets you recover both code and configuration in a single re-run, it requires extra steps, such as applying settings, waiting for restarts, and cleaning up undeclared values. 

> [!TIP]  
> When your deployment doesn't include settings, you can only roll back the deployed code but not the configuration.

This section details two approaches for managing app settings as part of your deployment:

| Approach | [In the workflow (Azure CLI)](#configure-app-settings-in-the-workflow) | [In the service definition (Bicep)](#define-settings-in-a-bicep-deployment) |
| --- | --- | --- |
| **How it works** | Deployment steps apply settings from a JSON file using `az functionapp config appsettings`, then remove undeclared settings | Bicep template declares settings in `siteConfig.appSettings`; ARM replaces the entire collection on deploy |
| **Complexity** | Moderate. JSON file plus extra CLI steps in your workflow | Higher. Requires Bicep knowledge |
| **Drift detection** | No | Yes (`what-if`) |
| **Best for** | Getting started, small teams | Production-ready, multi-environment, complex infrastructure |

For more general information about app settings, see [App settings reference for Azure Functions](functions-app-settings.md).

### App settings considerations

Pay attention to these considerations when working with programmatic configuration of app settings.

> [!IMPORTANT]
> Failure to include all required settings by using either approach can break your deployed app.  

- Both approaches in this section treat your settings file as the complete desired state. They remove any app settings not declared in the file from the app on every deployment. Always include all required settings to avoid breaking your app.

- Treat `app-settings.json` and Bicep file template changes with the same scrutiny as code changes. Review settings changes in pull requests to catch configuration errors before they reach production.

- For optimal security, follow these guidelines for your connections:

    - **Use managed identity connections wherever possible.** Set up [identity-based connections](functions-reference.md#configure-an-identity-based-connection) for host storage (`AzureWebJobsStorage`), deployment storage, and trigger/binding connections. For more information, see [Configure deployment settings](flex-consumption-how-to.md#configure-deployment-settings).
     
        - **Use Key Vault references when secrets are unavoidable.** Key Vault securely stores your secrets. Instead of storing secrets directly, you can use a reference to securely access the required secret at runtime. For more information, see [Use Key Vault references](../app-service/app-service-key-vault-references.md?toc=/azure/azure-functions/toc.json).

- When you use CI/CD, each change to either your app settings or your code triggers a separate [site update](flex-consumption-site-updates.md). By default, this deployment process produces at least two site updates: first when settings are applied and then when code is deployed. For zero downtime deployments, instead use a _rolling update_ strategy, where instances are drained and replaced in batches. For more information, see [Site updates in the Flex Consumption plan](flex-consumption-site-updates.md).

### Configure app settings in the workflow

Use these basic steps to add an app settings configuration file to your project deployment:

1. Create a JSON file in your repository, such as in `infra/app-settings.json`. This file must include all required app settings in a JSON format that looks like the following example:

    ```json
    [
      {
        "name": "FUNCTIONS_EXTENSION_VERSION",
        "value": "~4"
      },
      {
        "name": "FUNCTIONS_WORKER_RUNTIME",
        "value": "dotnet-isolated"
      },
      {
        "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
        "value": "InstrumentationKey=00000000-..."
      },
      {
        "name": "AzureWebJobsStorage__blobServiceUri",
        "value": "https://mystorageaccount.blob.core.windows.net"
      },
      {
        "name": "AzureWebJobsStorage__queueServiceUri",
        "value": "https://mystorageaccount.queue.core.windows.net"
      },
      {
        "name": "AzureWebJobsStorage__tableServiceUri",
        "value": "https://mystorageaccount.table.core.windows.net"
      },
      {
        "name": "MyFeatureFlag",
        "value": "true"
      },
      {
        "name": "ServiceBus__fullyQualifiedNamespace",
        "value": "my-namespace.servicebus.windows.net"
      }
    ]
    ```

1. In your specific deployment definition, add steps that apply the settings before the code deployment occurs, with a 30-second pause between them.

The following sections provide specific deployment examples using both approaches. 

### Example: app-settings.json deployment

This deployment example shows how to configure your deployment to include configuration. Choose the tab that matches your CI/CD method. 

#### [GitHub Actions](#tab/github-actions)

Add the following steps to the `deploy` job in your workflow. Add `actions/checkout@v4` to the `deploy` job so `infra/app-settings.json` is available, and add `RESOURCE_GROUP` to your workflow-level `env` block. The steps apply settings first, wait for the restart, deploy code, then clean up undeclared settings.

```yaml
  deploy:
    needs: build
    steps:
      - name: 'Checkout repository'
        uses: actions/checkout@v4

      - name: 'Download artifact from build job'
        uses: actions/download-artifact@v4
        with:
          name: ${{ env.BUILD_ARTIFACT_NAME }}
          path: ./downloaded-artifact

      - name: 'Log in to Azure'
        uses: azure/login@v2
        with:
          client-id: ${{ vars.AZURE_CLIENT_ID }}
          tenant-id: ${{ vars.AZURE_TENANT_ID }}
          subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}

      - name: 'Apply app settings'
        run: |
          az functionapp config appsettings set \
            --name ${{ env.AZURE_FUNCTIONAPP_NAME }} \
            --resource-group ${{ env.RESOURCE_GROUP }} \
            --settings @infra/app-settings.json

      - name: 'Wait for settings restart'
        run: sleep 30

      - name: 'Deploy code'
        uses: Azure/functions-action@v1
        with:
          app-name: ${{ env.AZURE_FUNCTIONAPP_NAME }}
          package: ./downloaded-artifact

      - name: 'Remove undeclared app settings'
        run: |
          DESIRED=$(jq -r '.[].name' infra/app-settings.json)
          CURRENT=$(az functionapp config appsettings list \
            --name ${{ env.AZURE_FUNCTIONAPP_NAME }} \
            --resource-group ${{ env.RESOURCE_GROUP }} \
            --query "[].name" -o tsv)
          TO_DELETE=""
          for setting in $CURRENT; do
            if ! echo "$DESIRED" | grep -qx "$setting"; then
              TO_DELETE="$TO_DELETE $setting"
            fi
          done
          if [ -n "$TO_DELETE" ]; then
            az functionapp config appsettings delete \
              --name ${{ env.AZURE_FUNCTIONAPP_NAME }} \
              --resource-group ${{ env.RESOURCE_GROUP }} \
              --setting-names $TO_DELETE
          fi
```

The `azure/login@v2` step in the OIDC-based workflow provides the authentication needed for the `az cli` commands.

#### [Azure Pipelines](#tab/azure-pipelines)

Add the following tasks to the deploy stage in your pipeline. The tasks apply settings first, wait for the restart, deploy code (using `AzureFunctionApp@2`), and then clean up undeclared settings.

```yaml
- task: AzureCLI@2
  displayName: 'Apply app settings'
  inputs:
    azureSubscription: '$(SERVICE_CONNECTION)'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      az functionapp config appsettings set \
        --name $(FUNCTION_APP_NAME) \
        --resource-group $(RESOURCE_GROUP) \
        --settings @infra/app-settings.json

- script: sleep 30
  displayName: 'Wait for settings restart'

- task: AzureFunctionApp@2
  displayName: 'Deploy code'
  inputs:
    azureSubscription: '$(SERVICE_CONNECTION)'
    appType: 'functionAppLinux'
    isFlexConsumption: true
    appName: '$(FUNCTION_APP_NAME)'
    package: '$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip'
    deploymentMethod: 'auto'

- task: AzureCLI@2
  displayName: 'Remove undeclared app settings'
  inputs:
    azureSubscription: '$(SERVICE_CONNECTION)'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      DESIRED=$(jq -r '.[].name' infra/app-settings.json)
      CURRENT=$(az functionapp config appsettings list \
        --name $(FUNCTION_APP_NAME) \
        --resource-group $(RESOURCE_GROUP) \
        --query "[].name" -o tsv)
      TO_DELETE=""
      for setting in $CURRENT; do
        if ! echo "$DESIRED" | grep -qx "$setting"; then
          TO_DELETE="$TO_DELETE $setting"
        fi
      done
      if [ -n "$TO_DELETE" ]; then
        az functionapp config appsettings delete \
          --name $(FUNCTION_APP_NAME) \
          --resource-group $(RESOURCE_GROUP) \
          --setting-names $TO_DELETE
      fi
```

---

### Define settings in a Bicep deployment

For IaC deployments, manage app settings directly in the Bicep template. Bicep natively replaces the entire `siteConfig.appSettings` collection on every deployment without needing a separate cleanup step. It also supports drift detection by using `what-if`.

When you update only the app settings section of your Bicep file, all other Azure resources remain unmodified during the deployment. This article doesn't cover Bicep authoring end-to-end. For complete Flex Consumption templates, see [Azure Functions infrastructure as code](functions-infrastructure-as-code.md).

Here's the relevant fragment of the Bicep template (the `appSettings` portion only):

```bicep
siteConfig: {
  appSettings: [
    {
      name: 'MyFeatureFlag'
      value: 'true'
    }
    {
      name: 'ServiceBus__Connection'
      value: '@Microsoft.KeyVault(SecretUri=https://my-vault.vault.azure.net/secrets/sb-conn)'
    }
  ]
}
```

Add steps to deploy the Bicep template **before** the code deployment, with a 30-second wait in between. Updating app settings through Bicep is asynchronous. The app restarts to pick up the new values, and deploying code during the restart can fail.

#### [GitHub Actions](#tab/github-actions)

```yaml
      - name: 'Deploy infrastructure'
        run: |
          az deployment group create \
            --resource-group ${{ env.RESOURCE_GROUP }} \
            --template-file infra/main.bicep \
            --parameters appName=${{ env.AZURE_FUNCTIONAPP_NAME }}

      - name: 'Wait for settings restart'
        run: sleep 30

      - name: 'Deploy code'
        uses: Azure/functions-action@v1
        with:
          app-name: ${{ env.AZURE_FUNCTIONAPP_NAME }}
          package: ./downloaded-artifact
```

#### [Azure Pipelines](#tab/azure-pipelines)

```yaml
- task: AzureCLI@2
  displayName: 'Deploy infrastructure'
  inputs:
    azureSubscription: '$(SERVICE_CONNECTION)'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      az deployment group create \
        --resource-group $(RESOURCE_GROUP) \
        --template-file infra/main.bicep \
        --parameters appName=$(FUNCTION_APP_NAME)

- script: sleep 30
  displayName: 'Wait for settings restart'

- task: AzureFunctionApp@2
  displayName: 'Deploy code'
  inputs:
    azureSubscription: '$(SERVICE_CONNECTION)'
    appType: 'functionAppLinux'
    isFlexConsumption: true
    appName: '$(FUNCTION_APP_NAME)'
    package: '$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip'
    deploymentMethod: 'auto'
```

---

## Roll back a deployment

Rolling back means re-running a previous successful run. A re-run checks out the **original commit SHA** that triggered that run (not the current branch HEAD), so it rebuilds and deploys the code and settings file from that point in time. You don't need new commits.

To roll back a deployment by re-running a previous successful run:

#### [GitHub Actions](#tab/github-actions)

1. Go to the **Actions** tab in your GitHub repository.
1. Find the last **successful** workflow run before the bad deployment.
1. Select **Re-run all jobs**.
1. The workflow checks out that run's commit, rebuilds, deploys the code, and syncs the app settings from that commit's `app-settings.json`.

#### [Azure Pipelines](#tab/azure-pipelines)

1. Go to **Pipelines** in your Azure DevOps project.
1. Find the last **successful** pipeline run.
1. Select **Rerun**.
1. The pipeline rebuilds from that run's source commit and deploys the code and settings.

---

### What re-running rebuilds

The re-run rebuilds the code from the old commit. It doesn't reuse the original binary artifact. This behavior means:

- With pinned dependency lock files (`package-lock.json`, `requirements.txt`, and so on), the output is functionally identical.
- Build time is the same as a normal deployment. It's not instant.
- External dependencies fetched at build time (NuGet, npm, pip) must still be available.

### Roll back considerations

- Pin your dependency lock files (`package-lock.json`, `requirements.txt`, or locked `.csproj` versions) in source control. Pinned lock files ensure that re-running a deployment produces a functionally identical build regardless of when the re-run happens.

- Re-running uses the workflow or pipeline YAML from the original commit. However, secrets and pipeline variables resolve to their current values at the time that they are re-run. When you rotate your secrets between the original run and a re-run, the new secret value is used.

- A re-run restores your deployed app to a known-good state, but it doesn't change your Git history. Your branch HEAD still points to the broken commit.

- What re-running doesn't restore: 

    - Azure resource configuration managed outside your deployment, including hosting plans, networking, and identity assignments.
    - Data or schema changes in downstream services, such as databases, message queues, and storage.
    - Key Vault secret values. Only Key Vault references are maintained in source control. Rotating secrets is a Key Vault operation.

- Test your rollback process regularly. Don't wait for a production incident to discover it's broken.

### Fix the branch after a rollback

Because the next push-triggered run redeploys the broken commit, other developers pulling the branch still see the broken code. You must fix this situation with one of these actions:

- Create a hotfix commit that addresses the issue, which is essentially a roll forward operation.
- Perform a `git revert` to undo the broken commit by creating a new commit, which is also a roll forward action.
- A branch policy that prevents merging until you fix the issue.

Until you complete one of these actions, avoid triggering a new run on that branch. For validation guidance, see [Validate before merging](#validate-before-merging).

## Roll forward a deployment

Rolling forward means pushing a new commit to fix the issue. The broken deployment stays live until the fix deploys, so this strategy works best when the app can tolerate degraded behavior during that time.

1. Create a fix commit on your branch. This fix can be:
   - A **hotfix** that directly addresses the issue.
   - A **`git revert <bad-commit-sha>`** that creates a new commit that undoes the bad changes. Even though `git revert` reverses the code, it's a roll forward because it produces a new commit and triggers a new deployment.

1. If the fix also requires configuration changes, update your app settings (either in `app-settings.json` or in your Bicep template) in the same commit.

1. Push the commit. Your deployment automatically builds and deploys the fix.

## Validate before merging

Regardless of your recovery strategy, validate and fix commits before merging them to your production branch to avoid compounding the problem. 

These recommendations apply whether you're rolling forward proactively or fixing the branch after a rollback:

- **Use a staging environment**: Because the Flex Consumption plan doesn't currently support deployment slots, instead consider deploying to a separate Flex Consumption plan app to validate your fix before merging to the production branch.

- **Automate health checks**: Add a postdeploy step that calls a health check endpoint in your app and verifies a positive response. On failure, consider triggering a rerun of the previous successful run to roll back automatically.

- **Monitor after deployment**: Set up Application Insights alerts for regression detection. Early detection reduces the impact of a bad deployment.

## Related content

- [Continuous delivery by using GitHub Actions](functions-how-to-github-actions.md)
- [Continuous delivery by using Azure Pipelines](functions-how-to-azure-devops.md)
- [Flex Consumption plan](flex-consumption-plan.md)
- [Azure Functions infrastructure as code](functions-infrastructure-as-code.md)
- [Manage your function app](functions-how-to-use-azure-function-app-settings.md)
