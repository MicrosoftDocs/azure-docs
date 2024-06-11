---
title: Import a configuration file in your GitHub repository to App Configuration
description: Use GitHub Actions to automatically update your App Configuration instance when you update your configuration file in your GitHub repository
author: christinewanjau
ms.author: cwanjau
ms.date: 06/05/2024
ms.topic: conceptual
ms.service: azure-app-configuration

---
# Import configuration files from your GitHub repository to App Configuration

Teams that want to continue using their existing source control practices can use GitHub Actions to automatically import configuration files from their GitHub repository with their App Configuration store. This allows you to make changes to your configuration files as you normally would, while getting App Configuration benefits like:
* Centralized configuration outside of your code.
* Updating configuration without redeploying your entire app. 
* Integration with services like Azure App Service and Functions.

A GitHub Actions [workflow](https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions#the-components-of-github-actions) defines an automated process in a GitHub repository. To import a configuration file from your github repository to Azure App Configuration, we recommend using [Azure CLI GitHub action](https://github.com/Azure/cli).

You can create a custom Azure CLI script to trigger updates to an App Configuration instance when changes are made to the source repository. This script can be included in a YAML (.yml) file found in the `/.github/workflows/` path of your repository to define the steps and parameters. You can trigger configuration updates when pushing, reviewing, or branching app configuration files just as you do with app code.

For more information about Azure App Configuration CLI commands, see the [Azure AppConfifguration CLI documentation.](/cli/azure/appconfig)

The GitHub [documentation](https://docs.github.com/actions/learn-github-actions/introduction-to-github-actions) provides in-depth view of GitHub workflows and actions. 

## Enable GitHub Actions in your repository
To start using this GitHub Action, go to your repository and select the **Actions** tab. Select **New workflow**, then **Set up a workflow yourself**. Finally, search the marketplace for “Azure CLI Action.”
> [!div class="mx-imgBorder"]
> ![Select the Action tab](media/find-github-action.png)

> [!div class="mx-imgBorder"]
> ![Select the app configuration sync Action](media/azure-cli-github-action.png)

## Authentication
To import configurations to your Azure App Configuration you can authenticate using one of the following methods:

### Use Microsoft Entra ID
The recommended way to authenticate is by using Microsoft Entra ID, which allows you to securely connect to your Azure resources. You can automate the authentication process using the [Azure login](/azure/developer/github/connect-from-azure) Github action.

Azure login supports authentication with Azure using service principals with secrets and OpenID Connect with an Azure service principal using a Federated Identity Credential. However, for enhanced security, it's recommended to utilize OpenID Connect with an Azure service principal.

#### Use Azure login with OpenID Connect
To get started, you will need to create a [Microsoft Entra application and service principal](/entra/identity-platform/howto-create-service-principal-portal) and then assign it the **App Configuration Data Owner** role to allow your GitHub action to read and write to the App Configuration store.

To use the Azure login action with OpenID Connect, you will need to configure your Microsoft Entra application with a federated credential to trust tokens issued by Github Actions to your Github repository. For more detailed instructions, refer to the [Azure login](/azure/developer/github/connect-from-azure) documentation.

You need to provide your application's Client ID, Tenant ID, and Subscription ID to the login action. These values can be provided directly in the workflow or stored as GitHub secrets for better security. In the example below, these values are set as secrets.
For more information about using secrets in GitHub, see [GitHub's article](https://docs.github.com/en/actions/reference/encrypted-secrets).

#### Example using Microsoft Entra ID
The example below we use the Azure CLI action to import configuration files into an Azure App Configuration store when a change is pushed to `appsettings.json`. When a developer pushes a change to `appsettings.json`, the script passed to the Azure CLI action updates the App Configuration instance with the new values.

The first section of this workflow specifies that the action triggers *on* a *push* containing `appsettings.json` to the *main* branch. The second section lists the jobs run once the action is triggered. The action checks out the relevant files and updates the App Configuration instance.

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

### Use a connection string
Alternatively, you can authenticate by passing the connection string directly to the Azure CLI command. This method involves retrieving the connection string from the Azure portal and using it in your commands or scripts.

To get started, you can find the connection string under **Access Settings** of your App Configuration store in the Azure portal.

Next, set this connection string as a secret variable in your GitHub repository. For more information about using secrets in GitHub, see [GitHub's article](https://docs.github.com/en/actions/reference/encrypted-secrets). 

### Example using a connection string
In the example below we use the Azure CLI action to import configuration files into an Azure App Configuration store when a change is pushed to `appsettings.json`. When a developer pushes a change to `appsettings.json`, the script passed to the Azure CLI action updates the App Configuration instance with the new values.

The first section of this workflow specifies that the action triggers *on* a *push* containing `appsettings.json` to the *main* branch. The second section lists the jobs run once the action is triggered. The action checks out the relevant files and updates the App Configuration instance.

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

## Use a dynamic label on import
The following action inserts a dynamic label on each import, ensuring that each import to your App Configuration store can be uniquely identified and allowing code changes to be mapped to config changes.

The first section of this workflow specifies that the action triggers *on* a *push* containing `appsettings.json` to the *main* branch. The second section runs a job that creates a unique label for the config update based on the commit hash. The job then updates the App Configuration instance with the new values and the unique label for this update.

```yaml
 jobs: 
  syncconfig: 
    runs-on: ubuntu-latest 
    steps:      
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
## Next steps

> [!div class="nextstepaction"]
> [Azure CLI import commands](/cli/azure/appconfig/kv#az-appconfig-kv-import)

> [!div class="nextstepaction"]
> [Concept Config File](./concept-config-file.md)
