---
title: Sync your GitHub repository to App Configuration
description: Use GitHub Actions to automatically update your App Configuration instance when you update your GitHub repository.
author: maud-lv
ms.author: malev
ms.date: 05/28/2020
ms.topic: conceptual
ms.service: azure-app-configuration

---
# Sync your GitHub repository to App Configuration

Teams that want to continue using their existing source control practices can use GitHub Actions to automatically sync their GitHub repository with their App Configuration store. This allows you to make changes to your config files as you normally would, while getting App Configuration benefits like: <br>
&nbsp;&nbsp;&nbsp;&nbsp;•	Centralized configuration outside of your code <br>
&nbsp;&nbsp;&nbsp;&nbsp;•	Updating configuration without redeploying your entire app <br>
&nbsp;&nbsp;&nbsp;&nbsp;•	Integration with services like Azure App Service and Functions. 

A GitHub Actions [workflow](https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions#the-components-of-github-actions) defines an automated process in a GitHub repository. The *Azure App Configuration Sync* Action triggers updates to an App Configuration instance when changes are made to the source repository. It uses a YAML (.yml) file found in the `/.github/workflows/` path of your repository to define the steps and parameters. You can trigger configuration updates when pushing, reviewing, or branching app configuration files just as you do with app code.

The GitHub [documentation](https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions) provides in-depth view of GitHub workflows and actions. 

## Enable GitHub Actions in your repository
To start using this GitHub Action, go to your repository and select the **Actions** tab. Select **New workflow**, then **Set up a workflow yourself**. Finally, search the marketplace for “Azure App Configuration Sync.”
> [!div class="mx-imgBorder"]
> ![Select the Action tab](media/find-github-action.png)

> [!div class="mx-imgBorder"]
> ![Select the app configuration sync Action](media/app-configuration-sync-action.png)

## Sync configuration files after a push
This action syncs Azure App Configuration files when a change is pushed to `appsettings.json`. When a developer pushes a change to `appsettings.json`, the App Configuration Sync action updates the App Configuration instance with the new values.

The first section of this workflow specifies that the action triggers *on* a *push* containing `appsettings.json` to the *main* branch. The second section lists the jobs run once the action is triggered. The action checks out the relevant files and updates the App Configuration instance using the connection string stored as a secret in the repository.  For more information about using secrets in GitHub, see [GitHub's article](https://docs.github.com/en/actions/reference/encrypted-secrets) about creating and using encrypted secrets.

```json
on: 
  push: 
    branches: 
      - 'main' 
    paths: 
      - 'appsettings.json' 
 
jobs: 
  syncconfig: 
    runs-on: ubuntu-latest 
    steps: 
      # checkout done so that files in the repo can be read by the sync 
      - uses: actions/checkout@v1 
      - uses: azure/appconfiguration-sync@v1 
        with: 
          configurationFile: 'appsettings.json' 
          format: 'json' 
          # Replace <ConnectionString> with the name of the secret in your                        
          # repository 
          connectionString: ${{ secrets.<ConnectionString> }} 
          separator: ':' 
```

## Use strict sync
By default the GitHub Action does not enable strict mode, meaning that the sync will only add key-values from the configuration file to the App Configuration instance (no key-value pairs will be deleted). Enabling strict mode will mean key-value pairs that aren't in the configuration file are deleted from the App Configuration instance, so that it matches the configuration file. If you are syncing from multiple sources or using Azure Key Vault with App Configuration, you'll want to use different prefixes or labels with strict sync to avoid wiping out configuration settings from other files (see samples below). 

```json
on: 
  push: 
    branches: 
      - 'main' 
    paths: 
      - 'appsettings.json' 
 
jobs: 
  syncconfig: 
    runs-on: ubuntu-latest 
    steps: 
      # checkout done so that files in the repo can be read by the sync 
      - uses: actions/checkout@v1 
      - uses: azure/appconfiguration-sync@v1 
        with: 
          configurationFile: 'appsettings.json' 
          format: 'json' 
          # Replace <ConnectionString> with the name of the secret in your 
          # repository 
          connectionString: ${{ secrets.<ConnectionString> }}  
          separator: ':' 
          label: 'Label' 
          prefix: 'Prefix:' 
          strict: true 
```
## Sync multiple files in one action 

If your configuration is in multiple files, you can use the pattern below to trigger a sync when either file is modified. This pattern uses the glob library https://www.npmjs.com/package/glob . Note that if your config file name contains a comma, you can use a backslash to escape the comma. 

```json
on:
  push:
    branches:
      - 'main'
    paths:
      - 'appsettings.json'
      - 'appsettings2.json'

jobs:
  syncconfig:
    runs-on: ubuntu-latest
    steps:
      # checkout done so that files in the repo can be read by the sync
      - uses: actions/checkout@v1
      - uses: azure/appconfiguration-sync@v1
        with:
          configurationFile: '{appsettings.json,appsettings2.json}'
          format: 'json'
          # Replace <ConnectionString> with the name of the secret in your repository
          connectionString: ${{ secrets.<ConnectionString> }}
          separator: ':'
```

## Sync by prefix or label
Specifying prefixes or labels in your sync action will sync only that particular set. This is important for using strict sync with multiple files. Depending on how the configuration is set up, either a prefix or a label can be associated with each file and then each prefix or label can be synced separately so that nothing is overwritten. Typically prefixes are used for different applications or services and labels are used for different environments. 

Sync by prefix: 

```json
on:
  push:
    branches:
      - 'main'
    paths:
      - 'appsettings.json'

jobs:
  syncconfig:
    runs-on: ubuntu-latest
    steps:
      # checkout done so that files in the repo can be read by the sync
      - uses: actions/checkout@v1
      - uses: azure/appconfiguration-sync@v1
        with:
          configurationFile: 'appsettings.json'
          format: 'json'
          # Replace <ConnectionString> with the name of the secret in your repository
          connectionString: ${{ secrets.<ConnectionString> }}
          separator: ':'
          prefix: 'Prefix::'
```

Sync by label: 

```json
on:
  push:
    branches:
      - 'main'
    paths:
      - 'appsettings.json'

jobs:
  syncconfig:
    runs-on: ubuntu-latest
    steps:
      # checkout done so that files in the repo can be read by the sync
      - uses: actions/checkout@v1
      - uses: azure/appconfiguration-sync@v1
        with:
          configurationFile: 'appsettings.json'
          format: 'json'
          # Replace <ConnectionString> with the name of the secret in your repository
          connectionString: ${{ secrets.<ConnectionString> }}
          separator: ':'
          label: 'Label'

```

## Use a dynamic label on sync
The following action inserts a dynamic label on each sync, ensuring that each sync can be uniquely identified and allowing code changes to be mapped to config changes.

The first section of this workflow specifies that the action triggers *on* a *push* containing `appsettings.json` to the *main* branch. The second section runs a job that creates a unique label for the config update based on the commit hash. The job then updates the App Configuration instance with the new values and the unique label for this update.

```json
on: 
  push: 
    branches: 
      - 'main' 
    paths: 
      - 'appsettings.json' 
 
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
      - uses: azure/appconfiguration-sync@v1 
        with: 
          configurationFile: 'appsettings.json' 
          format: 'json' 
          # Replace <ConnectionString> with the name of the secret in your 
          # repository 
          connectionString: ${{ secrets.<ConnectionString> }}  
          separator: ':' 
          label: ${{ steps.determine_label.outputs.LABEL }} 
```

## Use Azure Key Vault with GitHub Action
Developers using Azure Key Vault with AppConfiguration should use two separate files, typically an appsettings.json and a secretreferences.json. The secretreferences.json will contain the url to the key vault secret.

{
  "mySecret": "{\"uri\":\"https://myKeyVault.vault.azure.net/secrets/mySecret"}"
}

The GitHub Action can then be configured to do a strict sync on the appsettings.json, followed by a non-strict sync on secretreferences.json. The following sample will trigger a sync when either file is updated:

```json
on:
  push:
    branches:
      - 'main'
    paths:
      - 'appsettings.json'
      - 'secretreferences.json'

jobs:
  syncconfig:
    runs-on: ubuntu-latest
    steps:
      # checkout done so that files in the repo can be read by the sync
      - uses: actions/checkout@v1
      - uses: azure/appconfiguration-sync@v1
        with:
          configurationFile: 'appsettings.json'
          format: 'json'
          # Replace <ConnectionString> with the name of the secret in your repository
          connectionString: ${{ secrets.<ConnectionString> }}
          separator: ':'
          strict: true
      - uses: azure/appconfiguration-sync@v1
        with:
          configurationFile: 'secretreferences.json'
          format: 'json'
          # Replace <ConnectionString> with the name of the secret in your repository
          connectionString: ${{ secrets.<ConnectionString> }}
          separator: ':'
          contentType: 'application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8'

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

```json
on: 
  push: 
    branches: 
      - 'main' 
    paths: 
      - 'appsettings.json' 
 
jobs: 
  syncconfig: 
    runs-on: ubuntu-latest 
    steps: 
      # checkout done so that files in the repo can be read by the sync 
      - uses: actions/checkout@v1 
      - uses: azure/appconfiguration-sync@v1 
        with: 
          configurationFile: 'appsettings.json' 
          format: 'json' 
          # Replace <ConnectionString> with the name of the secret in your 
          # repository 
          connectionString: ${{ secrets.<ConnectionString> }}  
          separator: ':' 
          depth: 2 
```

Given a depth of 2, the example above now returns the following key-value pair:

| Key | Value |
| --- | --- |
| Object:Inner | {"InnerKey":"InnerValue"} |

## Understand action inputs
Input parameters specify data used by the action during runtime.  The following table contains input parameters accepted by App Configuration Sync and the expected values for each.  For more information about action inputs for GitHub Actions, see  GitHub's [documentation](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#inputs).

> [!Note]
> Input IDs are case insensitive.


| Input name | Required? | Value |
|----|----|----|
| configurationFile | Yes | Relative path to the configuration file in the repository.  Glob patterns are supported and can include multiple files. |
| format | Yes | File format of the configuration file.  Valid formats are: JSON, YAML, properties. |
| connectionString | Yes | Read-write connection string for the App Configuration instance. The connection string should be stored as a secret in the GitHub repository, and only the secret name should be used in the workflow. |
| separator | Yes | Separator used when flattening the configuration file to key-value pairs.  Valid values are: . , ; : - _ __ / |
| prefix | No | Prefix to be added to the start of keys. |
| label | No | Label used when setting key-value pairs. If unspecified, a null label is used. |
| strict | No | A boolean value that determines whether strict mode is enabled. The default value is false. |
| depth | No | Max depth for flattening the configuration file.  Depth must be a positive number.  The default will have no max depth. |
| tags | No | Specifies the tag set on key-value pairs.  The expected format is a stringified form of a JSON object of the following shape:  { [propertyName: string]: string; } Each property name-value becomes a tag. |

## Next steps

In this article, you learned about the App Configuration Sync GitHub Action and how it can be used to automate updates to your App Configuration instance. To learn how Azure App Configuration reacts to changes in key-value pairs, continue to the next [article](./concept-app-configuration-event.md).
