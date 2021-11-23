---
title: Parameterize load tests with secrets and environment variables
titleSuffix: Azure Load Testing
description: Parameterize load tests with Azure Load Testing by using secret and non-secret parameters.
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 11/30/2021
ms.topic: how-to
---

# Parameterize load tests with secrets and environment variables

In this article, you'll learn how to parameterize your load tests with Azure Load Testing Preview. You can change the behavior of a load test without making modifications to the test script. For example, specify the application endpoint as a parameter to reuse your test script across different environments.

Azure Load Testing service supports two types of parameters:

- Secrets: contain sensitive information and are securely passed to the load test engine. For example, credentials required to authenticate to a web service.

- Environment variables: contain non-sensitive information and are exposed as environment variables to the load test engine at runtime.

> [!IMPORTANT]
> Azure Load Testing is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An Azure Load Testing Resource already created. If you need to create an Azure Load Testing Resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Use secrets in a load test  

In this section, you'll configure your load test to use a secret parameter.

To use secrets in your load test in a secure manner, Azure Load Testing uses a secret store to securely store secrets, and tightly control access. You can use Azure Key Vault as the secret store, or use the secret store that is linked to your CI/CD workflow.

### Configure Azure Key Vault

If you specify load test secrets in the Azure portal, or by defining them in the load test YAML configuration file, you're using Azure Key Vault as the secret store. 

In this section, you'll configure Azure Key Vault and grant access for the Azure Load Testing service to read secret values.

If you don't have an Azure Key Vault yet, see [Azure Key Vault quick-start](/azure/key-vault/secrets/quick-create-cli) to create it.

1. Add the secret value to Azure Key Vault.

    1. Navigate to your Azure Key Vault in the Azure portal.
    1. On the Key Vault settings page, select **Secrets**.
    1. Select **Generate/Import**.
    1. On the **Create a secret** screen, enter the following values, and then select **Create**.
    
        * **Upload options**: *Manual*
        * **Name**: The secret name must be unique within the Key Vault. The name must be a 1-127 character string, starting with a letter and containing only 0-9, a-z, A-Z, and -.
        * **Value**: The value for your secret.
    
1. Navigate to your Azure Load Testing resource.

1. Open the **Identity**, switch on the system assigned identity, and then select **Save**.

    :::image type="content" source="media/how-to-parameterize-load-tests/system-assigned-managed-identity.png" alt-text="Screenshot that shows how to turn on system assigned managed identity for Azure Load Testing.":::

1. Open your Azure Key Vault resource in the Azure portal.

1. Under **Settings**, select **Access Policies**, and then **Add Access Policy**.

1. Select **Get** in the **Secret permissions**.

    :::image type="content" source="media/how-to-parameterize-load-tests/key-vault-add-policy.png" alt-text="Screenshot that shows how to add an access policy to Azure Key Vault.":::

1. Select **Select principal** and select your Azure Load Testing resource system-assigned principal.

1. Select **Add**.

You now have your secret value securely stored in Azure Key Vault, and you've granted access to your Azure Load Testing resource to read the secret value from the secret store.

### Specify secrets in the Azure portal

In this section, you'll learn how to add secrets to your load test by using the Azure portal.

1. When creating a new test or editing an existing test, go to the **Parameters** tab.  

    :::image type="content" source="media/how-to-parameterize-load-tests/edit-test-parameters.png" alt-text="Screenshot that shows the parameters tab when editing a load test.":::

1. In the **Secrets** section, enter the secret name.
    
    You'll use this secret name later in the Apache JMeter script.

1. In the **Value** field, enter the Azure Key Vault secret URI.

    The secret URI should be the full data-plane URI of the secret in Azure Key Vault. Optionally, you can also include a version number. For example, `https://myvault.vault.azure.net/secrets/mysecret/` or `https://myvault.vault.azure.net/secrets/mysecret/abcdef01-2345-6789-0abc-def012345678`.

    :::image type="content" source="media/how-to-parameterize-load-tests/test-creation-secrets.png" alt-text="Screenshot that shows how to add secret details to a load test.":::

1. Select **Apply** to save the changes to the test configuration.
    
    The next test run will use this new configuration.

You've now configured your load test with a secret parameter. The Azure Load Testing service retrieves the secret value from Azure Key Vault for every test run.

### Specify secrets in the YAML configuration file

When you create and run a load test in your CI/CD workflow, you use a test configuration YAML file. You can specify parameters and secrets in this YAML configuration file. The Azure Load Testing service retrieves the secret value from Azure Key Vault for every test run.

For more information about YAML configuration, see [Test configuration YAML reference](./reference-test-config-yaml.md).

### Configure secrets in the CI/CD secret store

In this section, you'll learn how to configure secret parameters for your load test script by using the CI/CD secret store.

If you're using Azure Load Testing in your CI/CD workflow, you can also use the associated secret store instead of Azure Key Vault. For example, by using [GitHub repository secrets](https://docs.github.com/actions/security-guides/encrypted-secrets), or [secret variables in Azure Pipelines](/azure/devops/pipelines/process/variables.md?view=azure-devopsd&tabs=yaml%2Cbatch#secret-variables&preserve-view=true).

> [!NOTE]
> This approach is recommended in a CI/CD system if you are already using another secret store. 

Use the following steps to provide secret parameters to Azure Load Testing resource:

1. Add the secret value to the secret store.

    > [!NOTE]
    > Don't provide an Azure Key Vault URI as the secret value. Enter the actual secret value.

1. Retrieve the secret value from the CI/CD secret store by using the CI/CD specific syntax.

1. Provide a reference for the secret to the Azure Load Testing CI/CD workflow step.

    The following YAML snippet shows a GitHub Actions example.

    ```yaml
    - name: 'Azure Load Testing'
      uses: azure/load-testing
      with:
        loadtestConfigFile: 'SampleApp.yaml'
        loadtestResource: 'MyTest'
        resourceGroup: 'loadtests-rg'
        secrets: |
        [
            {
            "name": "appToken",
            "value": "${{ secrets.MY_SECRET }}",
            }
        ]
    ```

    The following YAML snippet shows an Azure Pipelines example.

    ```yml
    - task: AzureLoadTest@1
      inputs:
        azureSubscription: 'MyAzureLoadTestingRG'
        loadTestConfigFile: 'SampleApp.yaml'
        loadTestResource: 'MyTest'
        resourceGroup: 'loadtests-rg'
        secrets: |
          [
              {
              "name": "appToken",
              "value": "$(mySecret)",
              }
          ]
    ```

    > [!IMPORTANT]
    > The name of the secret parameter needs to match the name used in the Apache JMeter script.

### Reference secrets in Apache JMeter

Now that you've passed the secret parameter to the Apache JMeter script, you can use the value to configure the script's behavior.

1. Add a user-defined variable in your Apache JMeter script.

1. Retrieve the secret value by using the custom function `{__GetSecret(<SecretName>)}` as the value for the variable.

    Replace the placeholder text *`<SecretName>`* with the secret name you used in the load test configuration or in the CI/CD workflow definition.

    :::image type="content" source="media/how-to-parameterize-load-tests/user-defined-variables.png" alt-text="Screenshot that shows how to add user-defined variables to your Apache JMeter script.":::

1. Use the user-defined variable in the test script.

    You can use the `${}` syntax to reference the variable in the script. For example:

    ```xml
      <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">
        <collectionProp name="HeaderManager.headers">
          <elementProp name="" elementType="Header">
            <stringProp name="Header.name">api-key</stringProp>
            <stringProp name="Header.value">${appToken}</stringProp>
          </elementProp>
        </collectionProp>
      </HeaderManager>
    ```
    
## Use environment variables in a load test

In this section, you'll use environment variables to pass parameters to your load test.

First, you need to define the environment variable name and value in the load test configuration, or in the CI/CD workflow definition. Then, you'll reference the environment variable in the Apache JMeter script, based on the environment variable name.

### Specify environment variables in the Azure portal

In this section, you'll learn how to add environment variables to your load test by using the Azure portal.

1. When creating a new test or editing an existing test, go to the **Parameters** tab.  

    :::image type="content" source="media/how-to-parameterize-load-tests/edit-test-parameters.png" alt-text="Screenshot that shows the parameters tab when editing a load test.":::

1. In the **Environment Variables** section, enter the environment variable name.
    
    You'll use this variable name later in the Apache JMeter script.

1. In the **Value** field, enter the value in plain text.

    :::image type="content" source="media/how-to-parameterize-load-tests/test-creation-env.png" alt-text="Screenshot that shows how to add an environment variable to a load test.":::
    
1. Select **Apply** to save the changes to the test configuration.
    
    The next test run will use this new configuration.

You've now configured your load test with an environment variable parameter.

### Setting environment variables using load test YAML configuration file  

When you create and run a load test in your CI/CD workflow, you use a test configuration YAML file. You can specify parameters and secrets in this YAML configuration file. The Azure Load Testing service retrieves the environment variable value for every test run.

For more information about YAML configuration, see [Test configuration YAML reference](./reference-test-config-yaml.md).

### Configure environment variables in the CI/CD workflow

In a CI/CD workflow, provide environment variables to the load test by passing them to the Azure Load Testing Task or GitHub Azure Load Testing Action.

Use the below syntax to pass environment variables to the Azure Pipelines task or GitHub Action. The name of the variable should be the same as it is in your Apache JMeter script.

The following YAML snippet shows a GitHub Actions example.

```yaml
- name: 'Azure Load Testing'
  uses: azure/load-testing
  with:
    loadtestConfigFile: 'SampleApp.yaml'
    loadtestResource: 'MyTest'
    resourceGroup: 'loadtests-rg'
    env: |
    [
        {
        "name": "environment",
        "value": "dev",
        }
    ]
```

The following YAML snippet shows an Azure Pipelines example.

```yml
- task: AzureLoadTest@1
  inputs:
    azureSubscription: 'MyAzureLoadTestingRG'
    loadTestConfigFile: 'SampleApp.yaml'
    loadTestResource: 'MyTest'
    resourceGroup: 'loadtests-rg'
    env: |
      [
          {
          "name": "environment",
          "value": "dev",
          }
      ]
```

  > [!IMPORTANT]
  > The name of the environment variable name needs to match the name used in the Apache JMeter script.

### Reference environment variables in Apache JMeter

Now that you've passed the environment variables to the Apache JMeter script, you can use the value to configure the script's behavior.

1. Add a user-defined variable in your Apache JMeter script.

1. Retrieve the environment variable value by using the custom function `${__BeanShell( System.getenv("<VariableName>") )}` as the value for the variable.

    Replace the placeholder text *`<VariableName>`* with the environment variable name you used in the load test configuration or in the CI/CD workflow definition.

    :::image type="content" source="media/how-to-parameterize-load-tests/user-defined-variables-env.png" alt-text="Screenshot that shows how to add user-defined variables for environment variables to your JMeter script.":::
    
1. Use the user-defined variable in the test script.

    You can use the `${}` syntax to reference the variable in the script. For example:

    ```xml
      <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">
        <collectionProp name="HeaderManager.headers">
          <elementProp name="" elementType="Header">
            <stringProp name="Header.name">environment</stringProp>
            <stringProp name="Header.value">${environment}</stringProp>
          </elementProp>
        </collectionProp>
      </HeaderManager>
    ```

## FAQ  

### Are my secrets values stored by the Azure Load Testing service?  

No. The values of secrets aren't stored by the Azure Load Testing service. When you use an Azure Key Vault secret URI, the service only stores the secret URI, and fetches the value of the secret for each test run. If you provided the value of secrets in a CI/CD workflow, the secret values aren't available after the test run. You'll provide these values for each test run.

### What happens if I have parameters both in my YAML configuration file and in the CI/CD workflow?  

If a parameter exists in both the YAML configuration file and the Azure Pipelines task or GitHub Action, the Azure Pipelines task or GitHub Action value will be used for the test run.

### I created and ran a test from my CI/CD workflow by passing parameters using the Azure Load Testing task / action. Can I run this test from the Azure portal with the same parameters?

The values of the parameters are not stored when they're passed from the CI/CD workflow. You'll have to provide the parameter values again when running the test from the Azure portal. You'll get a prompt to enter the missing values. For secret values, you'll enter the Azure Key Vault secret URI.
