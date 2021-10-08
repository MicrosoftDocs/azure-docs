---
title: Parameterize load tests
titleSuffix: Azure Load Testing
description: Parameterize load tests with Azure Load Testing using secret and non-secret parameters
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 10/07/2021
ms.topic: how-to

---

# Parameterize load tests with Azure Load Testing

To allow different configuration options on a load testing script, Azure Load Testing service supports parameters that can be provided without requiring any changes to the test script. Parameters can be of two types.

1. Secret parameters: These are any sensitive variables you don't want to be checked in to your source control repository. An example could be credentials required to authenticate to a web service.

1. Non-secret parameters: These are values that may keep changing based on the test run. These can be provided as inputs at runtime, instead of defining in the test script. An example could be variables for different environments such as dev, prod, etc.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An existing Azure Load Testing resource. Follow these steps to create one.

## Granting your resource access to Key Vault

To read secrets from Key Vault, you need to have a vault created and give your app permission to access it.

1. Create an Azure key vault by following the [Key Vault quick-start](https://docs.microsoft.com/azure/key-vault/secrets/quick-create-cli).

1. Create a [managed identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) for your Azure Load Testing resource.

1. Create an [access policy in Key Vault](https://docs.microsoft.com/azure/key-vault/general/security-features#privileged-access) for the application identity you created earlier. Enable the "Get" secret permission on this policy.

## Referencing parameters in load test files

In your JMeter script, use the built-in function *GetParam(param_name)*  to reference the parameters as shown below
       `{__GetParam(ParameterName)}}`

### Providing parameter values from Azure portal

1. If you are creating and running the test from Azure portal, enter the parameters name and values in the Parameters section of the **Test Plan** tab.

1. For secret parameters, enter the Secret Uri only. The Secret Uri should be the full data-plane URI of a secret in Key Vault, optionally including a version, for example, `https://myvault.vault.azure.net/secrets/mysecret/` or `https://myvault.vault.azure.net/secrets/mysecret/ec96f02080254f109c51a1f14cdb1931`. Enable the checkbox **Mark as secret**.

1. For a non-secret parameter, enter the value in plain text.

### Providing parameter values using YAML file

1. If you are using the YAML file to create and run tests, use the below syntax to provide parameter values.

    ```yml
    parameters: 
    - secrets: 
      - name: '<Name of the secret>' 
        value: '<Secret Uri>' 
      - name: '<Name of the secret>' 
        value: '<Secret Uri>' 
    - non_secrets: 
      - name: '<Name of the parameter>' 
        value: '<Value of the parameter>'
    ```

1. For secret parameters, enter the Secret Uri only. The Secret Uri should be the full data-plane URI of a secret in Key Vault, optionally including a version, for example, `https://myvault.vault.azure.net/secrets/mysecret/` or `https://myvault.vault.azure.net/secrets/mysecret/ec96f02080254f109c51a1f14cdb1931`.

1. For a non-secret parameter, enter the value in plain text.

### Providing parameter values in CI/CD workflow

In a CI/CD workflow you can provide parameter values using the YAML file as shown [above](#providing-parameter-values-using-yaml-file), if you are using Azure Key Vault for storing your secrets. Alternatively, you can use any other secret store by fetching the secrets in the pipeline, and passing to the Azure Load Testing Task or Azure Load Testing Action.

> [!IMPORTANT]
> For the same parameter, if a value exists in both the Load test YAML file and the Azure DevOps task / GitHub action, the latter will be used to run the test.

1. Add a step in the CI/CD workflow to fetch the relevant secrets from the secret store. For example, if your secrets are present in Azure Key Vault you can use the [Azure Key Vault task](https://docs.microsoft.com/azure/devops/pipelines/tasks/deploy/azure-key-vault) or [Azure Key Vault GitHub Action](https://github.com/marketplace/actions/azure-key-vault-get-secrets). If you are using Azure Pipelines variables or GitHub secrets, ensure to add these values as secrets.

1. Use the below syntax to provide parameter values in the Azure Pipelines task or GitHub action.

```yml
parameters: | 
      { 
        "secrets": [ 
            { 
                "name": "<Name of the secret>", 
                "value": "$(mySecret1)" 
            }, 
            { 
                "name": "<Name of the secret>", 
                "value": "$(mySecret2)" 
            } 
        ],
        "non_secrets": [ 
            { 
                "name": "<Name of the parameter>", 
                "value": "paramValue1" 
            }, 
            { 
                "name": "<Name of the parameter>", 
                "value": "paramValue2" 
            } 
        ] 
    }
```

> [!IMPORTANT]
> For a test run which is created and run from a CI/CD workflow and parameters are provided using the task/action, the value of the parameters are not available after the test run completes. If this test is run from the Azure Portal again, you will have to enter the parameter values as shown [here](#providing-parameter-values-from-azure-portal).
