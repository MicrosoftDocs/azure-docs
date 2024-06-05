---
title: Import a configuration file in your GitHub repository to App Configuration
description: Use GitHub Actions to automatically update your App Configuration instance when you update your configuration file in your GitHub repository
author: christinewanjau
ms.author: cwanjau
ms.date: 06/05/2024
ms.topic: conceptual
ms.service: azure-app-configuration

---
# Import a configuration file in your GitHub repository to App Configuration

Teams that want to continue using their existing source control practices can use GitHub Actions to automatically import configuration files from their GitHub repository with their App Configuration store. This allows you to make changes to your configuration files as you normally would, while getting App Configuration benefits like:
*	Centralized configuration outside of your code.
* Updating configuration without redeploying your entire app.  
* Integration with services like Azure App Service and Functions. 

A GitHub Actions [workflow](https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions#the-components-of-github-actions) defines an automated process in a GitHub repository.To import a configuration file from your github repository to Azure App Configuration, we recommend using [Azure CLI GitHub action](https://github.com/Azure/cli).

You can create a custom Azure CLI script to trigger updates to an App Configuration instance when changes are made to the source repository. This script can be included in a YAML (.yml) file found in the `/.github/workflows/` path of your repository to define the steps and parameters. You can trigger configuration updates when pushing, reviewing, or branching app configuration files just as you do with app code.

For more information about Azure App Configuration CLI commands, see the [Azure AppConfifguration CLI documentation.](https://learn.microsoft.com/cli/azure/appconfig)

The GitHub [documentation](https://docs.github.com/actions/learn-github-actions/introduction-to-github-actions) provides in-depth view of GitHub workflows and actions. 

## Enable GitHub Actions in your repository
To start using this GitHub Action, go to your repository and select the **Actions** tab. Select **New workflow**, then **Set up a workflow yourself**. Finally, search the marketplace for “Azure CLI Action.”
> [!div class="mx-imgBorder"]
> ![Select the Action tab](media/find-github-action.png)

> [!div class="mx-imgBorder"]
> ![Select the app configuration sync Action](media/azure-cli-github-action.png)

## Authentication
To import configurations to your Azure App Configuration you can authenticate using one of the following methods:

### 1. Using Azure login.
The recommended way to authenticate is by using the [Azure login](https://learn.microsoft.com/azure/developer/github/connect-from-azure) Github action.

### 2. Using a Connection String. 
Alternatively, you can authenticate by passing the connection string directly to the Azure CLI command.

## Sync configuration files after a push
This action syncs Azure App Configuration files when a change is pushed to `appsettings.json`. When a developer pushes a change to `appsettings.json`, the App Configuration Sync action updates the App Configuration instance with the new values.

The first section of this workflow specifies that the action triggers *on* a *push* containing `appsettings.json` to the *main* branch. The second section lists the jobs run once the action is triggered. The action checks out the relevant files and updates the App Configuration instance using the connection string stored as a secret in the repository.  For more information about using secrets in GitHub, see [GitHub's article](https://docs.github.com/en/actions/reference/encrypted-secrets) about creating and using encrypted secrets.

### Example using Connection string
```yaml
on: 
  push: 
    branches: 
      - 'main' 
    paths: 
      - 'appsettings.json'
 
jobs: 
  syncconfig: 
    runs-on: ubuntu-latest
    
    # pass the secret variable as an environment variable to access it in your CLI action.
    env:
      CONNECTION_STRING: ${{ secrets.<ConnectionString> }} 
    steps: 
      # checkout done so that files in the repo can be read by the sync 
      - uses: actions/checkout@v1 
      - uses: azure/cli@v2
        with: 
          azcliversion: latest
          inlineScript: |
            az appconfig kv import -s file --path appsettings.json --format json --connection-string $CONNECTION_STRING --yes
```

## Example using Azure login
```yaml
on: 
  push: 
    branches: 
      - 'main' 
    paths: 
      - 'appsettings.json'

# Set permissions for the workflow. Specify 'id-token: write' to allow OIDC token generation at the workflow level.
permissions: 
  id-token: write
  contents: read
 
jobs: 
  syncconfig: 
    runs-on: ubuntu-latest 
    steps: 
      - name: Azure login
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
       
      # checkout done so that files in the repo can be read by the sync 
      - uses: actions/checkout@v1 
      - uses: azure/cli@v2
        with: 
          azcliversion: latest
          inlineScript: |
            az appconfig kv import --endpoint https://teststore.azconfig.io --auth-mode login -s file --path appsettings.json --format json --yes
```

## Use strict sync
By default the CLI does not enable strict mode, meaning that the sync will only add key-values from the configuration file to the App Configuration instance (no key-value pairs will be deleted). Enabling strict mode will mean key-value pairs that aren't in the configuration file are deleted from the App Configuration instance, so that it matches the configuration file. If you are syncing from multiple sources or using Azure Key Vault with App Configuration, you'll want to use different prefixes or labels with strict sync to avoid wiping out configuration settings from other files (see samples below). 

```yaml
on: 
  push: 
    branches: 
      - 'main' 
    paths: 
      - 'appsettings.json'

# Set permissions for the workflow. Specify 'id-token: write' to allow OIDC token generation at the workflow level
permissions: 
  id-token: write
  contents: read
 
jobs: 
  syncconfig: 
    runs-on: ubuntu-latest 
    steps: 
      - name: Azure login
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
       
      # checkout done so that files in the repo can be read by the sync 
      - uses: actions/checkout@v1 
      - uses: azure/cli@v2
        with: 
          azcliversion: latest
          inlineScript: |
            az appconfig kv import --endpoint https://teststore.azconfig.io --auth-mode login -s file --path appsettings.json --format json --strict --yes
```

## Sync by prefix or label
Specifying prefixes or labels in your custom CLI script the action will sync only that particular set. This is important for using strict sync with multiple files. Depending on how the configuration is set up, either a prefix or a label can be associated with each file and then each prefix or label can be synced separately so that nothing is overwritten. Typically prefixes are used for different applications or services and labels are used for different environments. 

Sync by prefix: 

```yaml
on: 
  push: 
    branches: 
      - 'main' 
    paths: 
      - 'appsettings.json'

# Set permissions for the workflow. Specify 'id-token: write' to allow OIDC token generation at the workflow level
permissions: 
  id-token: write
  contents: read
 
jobs: 
  syncconfig: 
    runs-on: ubuntu-latest 
    steps: 
      - name: Azure login
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
       
      # checkout done so that files in the repo can be read by the sync 
      - uses: actions/checkout@v1 
      - uses: azure/cli@v2
        with: 
          azcliversion: latest
          inlineScript: |
            az appconfig kv import --endpoint https://teststore.azconfig.io --auth-mode login -s file --path appsettings.json --format json --prefix Prefix:: --yes
```

Sync by label: 

```yaml
on: 
  push: 
    branches: 
      - 'main' 
    paths: 
      - 'appsettings.json'

# Set permissions for the workflow. Specify 'id-token: write' to allow OIDC token generation at the workflow level
permissions: 
  id-token: write
  contents: read
 
jobs: 
  syncconfig: 
    runs-on: ubuntu-latest 
    steps: 
      - name: Azure login
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
       
      # checkout done so that files in the repo can be read by the sync 
      - uses: actions/checkout@v1 
      - uses: azure/cli@v2
        with: 
          azcliversion: latest
          inlineScript: |
            az appconfig kv import --endpoint https://teststore.azconfig.io --auth-mode login -s file --path appsettings.json --format json --label Label --yes
```

## Use a dynamic label on sync
The following action inserts a dynamic label on each sync, ensuring that each sync can be uniquely identified and allowing code changes to be mapped to config changes.

The first section of this workflow specifies that the action triggers *on* a *push* containing `appsettings.json` to the *main* branch. The second section runs a job that creates a unique label for the config update based on the commit hash. The job then updates the App Configuration instance with the new values and the unique label for this update.

```yaml
on: 
  push: 
    branches: 
      - 'main' 
    paths: 
      - 'appsettings.json'

# Set permissions for the workflow. Specify 'id-token: write' to allow OIDC token generation at the workflow level
permissions: 
  id-token: write
  contents: read
 
jobs: 
  syncconfig: 
    runs-on: ubuntu-latest 
    steps: 
      - name: Azure login
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      
      # Creates a label based on the branch name and the first 8 characters          
      # of the commit hash 
      - id: determine_label 
        run: echo ::set-output name=LABEL::"${GITHUB_REF#refs/*/}/${GITHUB_SHA:0:8}" 
      # checkout done so that files in the repo can be read by the sync 
      - uses: actions/checkout@v1 
      - uses: azure/cli@v2
        with: 
          azcliversion: latest
          inlineScript: |
            az appconfig kv import --endpoint https://teststore.azconfig.io --auth-mode login -s file --path appsettings.json --format json --label ${{ steps.determine_label.outputs.LABEL }} --yes
```

## Use Azure Key Vault with GitHub Action
Developers using Azure Key Vault with AppConfiguration should use two separate files, typically an appsettings.json and a secretreferences.json. The secretreferences.json will contain the url to the key vault secret.

{
  "mySecret": "{\"uri\":\"https://myKeyVault.vault.azure.net/secrets/mySecret"}"
}

The GitHub Action can then be configured to do a strict sync on the appsettings.json, followed by a non-strict sync on secretreferences.json. The following sample will trigger a sync when either file is updated:

```yaml
on:
  push:
    branches:
      - 'main'
    paths:
      - 'appsettings.json'
      - 'secretreferences.json'

# Set permissions for the workflow. Specify 'id-token: write' to allow OIDC token generation at the workflow level
permissions: 
  id-token: write
  contents: read
 
jobs: 
  syncconfig: 
    runs-on: ubuntu-latest 
    steps: 
      - name: Azure login
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      
      # checkout done so that files in the repo can be read by the sync 
      - uses: actions/checkout@v1 
      - uses: azure/cli@v2
        with: 
          azcliversion: latest
          inlineScript: |
            az appconfig kv import --endpoint https://teststore.azconfig.io --auth-mode login -s file --path appsettings.json --format json --strict --yes

      - uses: azure/cli@v2
        with: 
          azcliversion: latest
          inlineScript: |
            az appconfig kv import --endpoint https://teststore.azconfig.io --auth-mode login -s file --path secretreferences.json --format json --content-type application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8 --yes
```

## Use max depth to limit GitHub Action
The default behavior for nested JSON attributes is to flatten the entire object.  The JSON below defines this key-value pair:

| Key | Value |
| --- | --- |
| Object:Inner:InnerKey | InnerValue |

```json
{ "Object": 
    { "Inner":
        {
        "InnerKey": "InnerValue"
        }
    }
}
```

If the nested object is intended to be the value pushed to the Configuration instance, you can use the *depth* value to stop the flattening at the appropriate depth.

```yaml
on: 
  push: 
    branches: 
      - 'main' 
    paths: 
      - 'appsettings.json'

# Set permissions for the workflow. Specify 'id-token: write' to allow OIDC token generation at the workflow level
permissions: 
  id-token: write
  contents: read
 
jobs: 
  syncconfig: 
    runs-on: ubuntu-latest 
    steps: 
      - name: Azure login
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
       
      # checkout done so that files in the repo can be read by the sync 
      - uses: actions/checkout@v1 
      - uses: azure/cli@v2
        with: 
          azcliversion: latest
          inlineScript: |
            az appconfig kv import --endpoint https://teststore.azconfig.io --auth-mode login -s file --path appsettings.json --format json --separator : --depth 2 --yes
```

Given a depth of 2, the example above now returns the following key-value pair:

| Key | Value |
| --- | --- |
| Object:Inner | {"InnerKey":"InnerValue"} |

## Next steps

> [!div class="nextstepaction"]
> [Azure CLI import commands](https://learn.microsoft.com/cli/azure/appconfig/kv?#az-appconfig-kv-import)

> [!div class="nextstepaction"]
> [Concept Config File](./concept-config-file.md)
