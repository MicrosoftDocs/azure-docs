---
title: Parameterize load tests
titleSuffix: Azure Load Testing
description: Parameterize load tests with Azure Load Testing using secret and non-secret parameters
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 10/12/2021
ms.topic: how-to
---

# Parameterize load tests with Azure Load Testing

To allow different configuration options on a load testing script, Azure Load Testing service supports parameters that can be provided without requiring any changes to the test script. Parameters can be of two types.

1. Secrets: These are any sensitive variables you don't want to be checked in to your source control repository. An example could be credentials required to authenticate to a web service.

1. Environment Variables: These are non sensitive information that may keep changing based on the test run. These variables can be provided as inputs at runtime, instead of defining in the test script. An example could be configuration variables for different environments such as dev, prod, etc.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An existing Azure Load Testing resource. Follow these steps to create one.

## Parameterization using secrets

Secret parameters can be provided while creating and running tests from Azure Portal, VS Code extension (using YAML config file) or CI/CD workflows. Secrets can read in the test script using the custom function *GetSecret(secret_name)* as shown below

`${__GetSecret(SecretName)}`

### Granting your Load Testing resource access to Key Vault

To read secrets from Key Vault, you need to have a vault created and give your app permission to access it. This is required if you are defining your secrets in Azure Portal or YAML configuration file.

1. Create an Azure key vault by following the [Key Vault quick-start](https://docs.microsoft.com/azure/key-vault/secrets/quick-create-cli) or use an existing Key vault.

1. [Add the secret to the Key Vault] (https://docs.microsoft.com/en-us/azure/key-vault/secrets/quick-create-portal#add-a-secret-to-key-vault) , if it does not exist already.

1. Create a [system assigned managed identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) for your Azure Load Testing resource from Azure portal.

1. Create an [access policy in Key Vault](https://docs.microsoft.com/azure/key-vault/general/rbac-guide) for the identity you created earlier. Enable the "Get" secret permission on this policy.

### Providing secrets from Azure portal

1. In the test creation wizard, go to the **Parameters** tab.

1. In the **Secrets** section, enter the secret name as referenced in the test script.

1. For secret value, enter the Secret Uri only. The Secret Uri should be the full data-plane URI of a secret in Key Vault, optionally including a version, for example, `https://myvault.vault.azure.net/secrets/mysecret/` or `https://myvault.vault.azure.net/secrets/mysecret/ec96f02080254f109c51a1f14cdb1931`.

The secrets are fetched from the Key Vault for every test run.

### Providing secrets using YAML file

1. If you are using the YAML file to create and run tests, use the below syntax to provide secret values.

    ```yml
    - secrets:
        - name: '<Name of the secret>' #As referenced in the test script
          value: '<Secret Uri>'
        - name: '<Name of the secret>' #As referenced in the test script
          value: '<Secret Uri>'
    ```

1. For secret value, enter the Secret Uri only. The Secret Uri should be the full data-plane URI of a secret in Key Vault, optionally including a version, for example, `https://myvault.vault.azure.net/secrets/mysecret/` or `https://myvault.vault.azure.net/secrets/mysecret/ec96f02080254f109c51a1f14cdb1931`.

The secrets are fetched from the Key Vault for every test run.

### Providing secrets in CI/CD workflow

In a CI/CD workflow, you can provide parameter values using the YAML configuration file as shown [above](#providing-secrets-using-yaml-file), if you are using Azure Key Vault for storing your secrets. Alternatively, you can use any other secret store by fetching the secrets in the pipeline, and passing to the Azure Load Testing Task or Azure Load Testing Action. [Azure Pipeline variables](https://docs.microsoft.com/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#secret-variables) and [GitHub secrets](https://docs.github.com/actions/security-guides/encrypted-secrets) are widely used secret stores in Azure DevOps and GitHub respectively.

1. Add a step in the CI/CD workflow to fetch the relevant secrets from the secret store. For example, if you are secrets using Azure Pipelines variables or GitHub secrets, ensure to add the name and value of the secrets. Do not provide an Azure Key Vault secret Uri in this case.

1. Use the below syntax to pass secret values to the Azure Pipelines task or GitHub action.

    ```yml
    secrets: |
      [
          {
          "name": "<Name of the secret>",
          "value": "$(mySecret1)",
          },
          {
          "name": "<Name of the secret>",
          "value": "$(mySecret1)",
          }
      ]
    ```

## Parameterization using Environment Variables

Environment variables can be provided while creating and running tests. They can be read in the test script using the function *System.getenv(variableName)* as shown below

`${__BeanShell( System.getenv("client_id") )}`

### Setting environment variables from Azure portal

1. In the test creation wizard, go to the **Parameters** tab.

1. In the Environment Variables section, enter the variable name as referenced in the test script.

1. Enter the value in plain text.

### Setting environment variables using YAML file

1. If you are using the YAML file to create and run tests, use the below syntax to set environment variables.

    ```yml
    - env:
        - name: '<Name of the variable>' #As referenced in the test script
          value: '<Value of the variable>'
        - name: '<Name of the variable>' #As referenced in the test script
          value: '<Value of the variable>'
    ```

1. Enter the value of the variable in plain text.

### Setting environment variables in a CI/CD workflow

In a CI/CD workflow, you can provide environment variable by passing to the Azure Load Testing Task or Azure Load Testing Action.

1. Use the below syntax to pass secret values to the Azure Pipelines task or GitHub action.

    ```yml
    env: |
      [
          {
          "name": "<Name of the variable>",
          "value": "<Value of the variable>",
          },
          {
          "name": "<Name of the variable>",
          "value": "<Value of the variable>",
          }
      ]
    ```

## FAQ

### Are my secrets values stored by the Load Testing service?

No. The value of secrets are not stored by the Load testing service. If you have provided the Key Vault secret Uri, the secret Uri is stored and the value of the secret is fetched for every test run again. If you have provided the value of secrets in a CI/CD workflow, the secret values are not available after the test run. These need to be provided again for every test run.

### What happens if I have parameters in my YAML configuration file as well as in the CI/CD workflow?

For the same parameter, if a value exists in both the YAML configuration file and the Azure DevOps task / GitHub action, the latter will be used for the test run.

### I created and ran a test from my CI/CD workflow by passing parameters using Azure load testing task / action. Can I run this test from the Azure portal with the same parameters?

Since we do not store the values of parameters when passed from the CI/CD workflow, you will have to provide the parameter values again from the Azure portal while running the test. While running the test, you will get a prompt to enter these values. For secret values please enter Key Vault secret Uri only.
