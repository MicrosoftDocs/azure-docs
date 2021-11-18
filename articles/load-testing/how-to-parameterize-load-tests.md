---
title: Parameterize load tests
titleSuffix: Azure Load Testing
description: Parameterize load tests with Azure Load Testing using secret and non-secret parameters
services: load-testing
ms.service: load-testing
ms.author: jmartens
author: j-martens
ms.date: 10/21/2021
ms.topic: how-to
---

# Parameterize load tests with Azure Load Testing  

Azure Load Testing service supports different configuration options for load testing scripts. It allows parameters that can be provided without requiring changes to the test script. Parameters can be of two types.  

- Secrets: Sensitive variables you don't want checked in to your source control repository. These parameters are passed to the load test engine in a secure way and are not exposed anywhere. An example could be credentials required to authenticate to a web service.  

- Environment Variables: Non-sensitive information that may change based on the test run. These are exposed as environment variables for access by the load test engine at runtime. Configuration variables for different environments such as dev, test, or prod, for example.  

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An existing Azure Load Testing resource. Follow these steps to create one.  

## Parameterization using secrets  

Secret parameters can be provided while creating and running tests from Azure portal or CI/CD workflows. Secrets can read in the test script using the custom function *GetSecret(secret_name)*

Add a user defined variable in your JMeter script. Add the value of the variable using the custom function `{{__GetSecret(SecretName)}` as shown below.

:::image type="content" source="media/how-to-parameterize-load-tests/user-defined-variables.png" alt-text="Add user defined variables to your JMeter script":::

### Granting your Load Testing resource access to Key Vault  

To read secrets from Key Vault, you need an existing vault. Give your app permission to access it. App access to your vault is required if you're defining your secrets in Azure portal or a YAML configuration file.  

1. Create an Azure key vault by following the [Key Vault quick-start](/azure/key-vault/secrets/quick-create-cli.md) or use an existing Key vault.  

1. [Add the secret to the Key Vault](/azure/key-vault/secrets/quick-create-portal.md#add-a-secret-to-key-vault) if it doesn't exist.  

1. Create a system assigned managed identity for your Azure Load Testing resource from Azure portal by turning on in the identity tab of the resource as shown below.

    :::image type="content" source="media/how-to-parameterize-load-tests/system-assigned-managed-identity.png" alt-text="Turn on system assignd managed identity from the identity tab of the resource in Azure portal":::  

1. Create an [access policy in Key Vault](/azure/key-vault/general/assign-access-policy?tabs=azure-portal) for the identity you created earlier. Enable the "Get" permission for secrets on this policy.

### Providing secrets from Azure portal  

1. In the test creation or configure test wizard, go to the **Parameters** tab.  

1. In the **Secrets** section, enter the secret name as referenced in the test script.  

1. For secret value, enter the Secret Uri only. The Secret Uri should be the full data-plane URI of a secret in Key Vault, optionally including a version, for example, `https://myvault.vault.azure.net/secrets/mysecret/` or `https://myvault.vault.azure.net/secrets/mysecret/ec96f02080254f109c51a1f14cdb1931`.  

:::image type="content" source="media/how-to-parameterize-load-tests/test-creation-secrets.png" alt-text="Add secret name and secret Uri to parameters tab in test creation wizard":::

The secrets are fetched from the Key Vault for every test run.  

### Providing secrets using Load test YAML configuration file  

1. If you're using the load test YAML configuration file to create and run tests, use the below syntax to provide secret values. The name of the secret should be the same as it is in your JMeter script.

    ```yml
    secrets:
      - name: '<Name of the secret>' #As referenced in the test script
        value: '<Secret Uri>'
      - name: '<Name of the secret>' #As referenced in the test script
        value: '<Secret Uri>'
    ```

1. For secret value, enter the Secret Uri only. The Secret Uri should be the full data-plane URI of a secret in Key Vault, optionally including a version, for example, `https://myvault.vault.azure.net/secrets/mysecret/` or `https://myvault.vault.azure.net/secrets/mysecret/ec96f02080254f109c51a1f14cdb1931`.  

The secrets are fetched from the Key Vault for every test run.  

### Providing secrets in CI/CD workflow  

In a CI/CD workflow, if you're using Azure Key Vault for secrets storage, you can provide parameter values using the YAML configuration file as shown [above](#providing-secrets-using-load-test-yaml-configuration-file). You can use any other secret store by fetching the secrets in the pipeline. You then pass them to the Azure Load Testing Task or Azure Load Testing Action.

> [!NOTE]
> This approach is recommended in a CI/CD system if you are using any other secret store or secret variables apart from Azure Key Vault. [Azure Pipeline variables](/azure/devops/pipelines/process/variables.md?view=azure-devopsd&tabs=yaml%2Cbatch#secret-variables&preserve-view=true) and [GitHub secrets](https://docs.github.com/actions/security-guides/encrypted-secrets) are widely used secret stores in Azure DevOps Services and GitHub respectively.  

To provide secrets from a CI/CD workflow:

1. Add a step in the CI/CD workflow to fetch the relevant secrets from the secret store. For example, if your secrets use Azure Pipelines variables or GitHub secrets, add the name and value of the secrets. Don't provide an Azure Key Vault secret Uri in this case.  

1. Use the below syntax to pass secret values to the Azure Pipelines task or GitHub action. The name of the secret should be the same as it is in your JMeter script. The value is the name of the secret variable in your secret store.  

    ```yml
    secrets: |
      [
          {
          "name": "<Name of the secret as referenced in the JMeter script>",
          "value": "$(mySecret1)"
          },
          {
          "name": "<Name of the secret as referenced in the JMeter script>",
          "value": "$(mySecret1)"
          }
      ]
    ```

## Parameterization using Environment Variables  

Environment variables can be provided while creating and running tests. They're read in the test script using the function *System.getenv(variableName)*.

Add a user defined variable in your JMeter script. Add the value of the variable using the custom function `${__BeanShell( System.getenv("variable") )}` as shown below.

:::image type="content" source="media/how-to-parameterize-load-tests/user-defined-variables-env.png" alt-text="Add user defined variables for environment variables to your JMeter script":::

### Setting environment variables from Azure portal  

1. In the test creation or configure test wizard, go to the **Parameters** tab.  

1. In the Environment Variables section, enter the variable name as referenced in the test script.  

1. Enter the value in plain text.  

:::image type="content" source="media/how-to-parameterize-load-tests/test-creation-env.png" alt-text="Add environment variable name and value to the parameters tab in the test creation wizard":::

### Setting environment variables using Load Test YAML configuration file  

1. If you're using the load test YAML configuration file to create and run tests, use the below syntax to set environment variables.  

    ```yml
    env:
      - name: '<Name of the variable>' #As referenced in the test script
        value: '<Value of the variable>'
      - name: '<Name of the variable>' #As referenced in the test script
        value: '<Value of the variable>'
    ```

1. Enter the value of the variable in plain text.  

### Setting environment variables in a CI/CD workflow  

In a CI/CD workflow, provide environment variables by passing them to the Azure Load Testing Task or Azure Load Testing Action.  

Use the below syntax to pass secret values to the Azure Pipelines task or GitHub Action. The name of the variable should be the same as it is in your JMeter script.

  ```yml
  env: |
    [
        {
        "name": "<Name of the variable>",
        "value": "<Value of the variable>"
        },
        {
        "name": "<Name of the variable>",
        "value": "<Value of the variable>"
        }
    ]
  ```

## FAQ  

### Are my secrets values stored by the Load Testing service?  

No. The values of secrets aren't stored by the Load testing service. When you use a Key Vault secret Uri, the secret Uri is stored and the value of the secret is fetched for each test run. If you provided the value of secrets in a CI/CD workflow, the secret values aren't available after the test run. You'll provide these values for each test run.  

### What happens if I have parameters both in my YAML configuration file and in the CI/CD workflow?  

If the same value for the same parameter exists in both the YAML configuration file and the Azure DevOps Services task / GitHub Action, the Azure DevOps Services task / GitHub Action values will be used for the test run.  

### I created and ran a test from my CI/CD workflow by passing parameters using Azure load testing task / action. Can I run this test from the Azure portal with the same parameters?  

We don't store the values of parameters when they're passed from the CI/CD workflow. You'll have to provide the parameter values again from the Azure portal while running the test. While the test is running, you'll get a prompt to enter these values. For secret values, enter your Key Vault secret Uri only.
