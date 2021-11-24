---
title: Parameterize load tests with secrets and environment variables
titleSuffix: Azure Load Testing
description: 'Learn how to make configurable load tests by using secrets and environment variables as parameters in Azure Load Testing.'
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 11/30/2021
ms.topic: how-to
---

# Make configurable load tests with secrets and environment variables

Learn how to change the behavior of a load test without making modifications to the Apache JMeter script. With Azure Load Testing Preview, you can use parameters to make a configurable test script. For example, turn the application endpoint into a parameter to reuse your test script across multiple environments.

Azure Load Testing service supports two types of parameters:

- Secrets: contain sensitive information and are passed securely to the load test engine. For example, to provide web service credentials instead of hard-coding them in the test script. For more information, see [Configure load tests with secrets](#secrets).

- Environment variables: contain non-sensitive information and are available as environment variables in the load test engine. For example, to make the application endpoint URL configurable. For more information, see [Configure load tests with environment variables](#envvars).

> [!IMPORTANT]
> Azure Load Testing is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An Azure Load Testing resource. If you need to create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## <a name="secrets"></a> Configure load tests with secrets

In this section, you'll configure your load test to pass secrets to your load test script.

1. Update the Apache JMeter script to accept and use a secret input parameter. For example, a web service authentication token that you pass into an HTTP header.

1. Store the secret value in a secret store, which allows you to tightly control access. Azure Load Testing integrates with Azure Key Vault, or with the secret store linked to your CI/CD workflow.

1. Configure the load test and pass a reference for the secret to the test script.

### Use secrets in Apache JMeter

In this section, you'll update the Apache JMeter script to use a secret as input parameter.

First, you'll define a user-defined variable that retrieves the secret value. Then, you can use this variable in the test execution, for example to set an HTTP request header.

1. Create a user-defined variable in your JMX file, and assign the secret value to it by using the `GetSecret` custom function.

    The `GetSecret(<my-secret-name>)` function takes the secret name as an argument. You'll use this same name when you configure the load test in a later step.

    The following screenshot shows how to create a user-defined variable by using the Apache JMeter IDE.

    :::image type="content" source="media/how-to-parameterize-load-tests/user-defined-variables.png" alt-text="Screenshot that shows how to add user-defined variables to your Apache JMeter script.":::

    Instead, you can also directly edit the JMX file, as shown in this example code snippet:

    ```xml
    <Arguments guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
      <collectionProp name="Arguments.arguments">
        <elementProp name="appToken" elementType="Argument">
          <stringProp name="Argument.name">udv_appToken</stringProp>
          <stringProp name="Argument.value">${__GetSecret(appToken)}</stringProp>
          <stringProp name="Argument.desc">Value for x-secret header </stringProp>
          <stringProp name="Argument.metadata">=</stringProp>
        </elementProp>
      </collectionProp>
    </Arguments>
    ```

1. Reference the user-defined variable in the test script.

    You can use the `${}` syntax to reference the variable in the script. In the following example, you use the `udv_appToken` variable to set an HTTP header.

    ```xml
      <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">
        <collectionProp name="HeaderManager.headers">
          <elementProp name="" elementType="Header">
            <stringProp name="Header.name">api-key</stringProp>
            <stringProp name="Header.value">${udv_appToken}</stringProp>
          </elementProp>
        </collectionProp>
      </HeaderManager>
    ```

### <a name="akv_secrets"></a> Use Azure Key Vault

When you create a load test in the Azure portal, or you use a [YAML test configuration file](./reference-test-config-yaml.md), you'll use a reference to an Azure Key Vault secret.

> [!NOTE]
> If you run a load test as part of your CI/CD process, you might also use the related secret store. Skip to [Use the CI/CD secret store](#cicd_secrets).

1. [Add the secret to Azure Key Vault](/azure/key-vault/secrets/quick-create-portal#add-a-secret-to-key-vault), if it doesn't exist yet.

1. Retrieve the Key Vault secret identifier for your secret. You'll use this secret identifier to configure your load test.

    :::image type="content" source="media/how-to-parameterize-load-tests/key-vault-secret.png" alt-text="Screenshot that shows the details of the secret in Azure Key Vault.":::
    
    The secret identifier is the full URI of the secret in Azure Key Vault. Optionally, you can also include a version number. For example, `https://myvault.vault.azure.net/secrets/mysecret/` or `https://myvault.vault.azure.net/secrets/mysecret/abcdef01-2345-6789-0abc-def012345678`.

1. Grant your Azure Load Testing resource access to Key Vault.

    Your Azure Load Testing resource doesn't have permission to retrieve secrets from Azure Key Vault. You'll first enable system-assigned managed identity for your Load Testing resource. Then, you'll grant read permissions to this managed identity. 
    
    To provide Azure Load Testing access to your Key Vault, see [Use managed identities for Azure Load Testing](how-to-use-a-managed-identity.md).

1. Reference the secret in the load test configuration.
    
    You define a load test secret parameter for each secret that you reference in the Apache JMeter script. The parameter name should match the name you used in the test script. The secret parameter value is the Key Vault security identifier.

    You can specify secrets parameters in the Azure portal, or in the load test YAML configuration file.

    In the Azure portal, select your load test, select **Configure**, and then enter the parameter details in the **Parameters** tab.
    
    :::image type="content" source="media/how-to-parameterize-load-tests/test-creation-secrets.png" alt-text="Screenshot that shows how to add secret details to a load test.":::

    Instead, you can also specify a secret in the YAML configuration file. For more information about the syntax, see the [Test configuration YAML reference](./reference-test-config-yaml.md).

### <a name="cicd_secrets"></a> Use the CI/CD secret store

If you're using Azure Load Testing in your CI/CD workflow, you can also use the associated secret store. For example, you can use [GitHub repository secrets](https://docs.github.com/actions/security-guides/encrypted-secrets), or [secret variables in Azure Pipelines](/azure/devops/pipelines/process/variables?view=azure-devopsd&tabs=yaml%2Cbatch#secret-variables&preserve-view=true).

> [!NOTE]
> If you already use Azure Key Vault, you might also use it to store the load test secrets. Skip to [Use Azure KeyVault](#akv_secrets).

1. Add the secret value to the CI/CD secret store, if it doesn't exist yet.

    In Azure Pipelines, you can edit the pipeline and [add a variable](/azure/devops/pipelines/process/variables?view=azure-devopsd&tabs=yaml%2Cbatch#secret-variables&preserve-view=true).

    :::image type="content" source="media/how-to-parameterize-load-tests/new-variable.png" alt-text="Screenshot that shows how to add a variable to Azure Pipelines.":::

    In GitHub, you can use [GitHub repository secrets](https://docs.github.com/actions/security-guides/encrypted-secrets).

    :::image type="content" source="media/how-to-parameterize-load-tests/github-new-secret.png" alt-text="Screenshot that shows how to add a GitHub repository secret.":::

    > [!NOTE]
    > Make sure to use the actual secret value and not the Key Vault secret identifier as the value.

1. Pass the secret as an input parameter for the Load Testing task/action in the CI/CD workflow.
    
    The following YAML snippet shows a GitHub Actions example.

    ```yaml
    - name: 'Azure Load Testing'
      uses: azure/load-testing@v1
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


## <a name="envvars"></a> Configure load tests with environment variables

In this section, you'll use environment variables to pass parameters to your load test.

1. Update the Apache JMeter script to use the environment variable. For example, to configure the application endpoint hostname.

1. Configure the load test and pass the environment variable to the test script.

### Use environment variables in Apache JMeter

In this section, you'll update the Apache JMeter script to use environment variables to control the script behavior.

First, you'll define a user-defined variable that reads the environment variable. Then, you can use this variable in the test execution, for example to update the HTTP domain.

1. Create a user-defined variable in your JMX file, and assign the environment variable's value to it by using the `System.getenv` function.

    The `System.getenv("<my-variable-name>")` function takes the environment variable name as an argument. You'll use this same name when you configure the load test.

    The following screenshot shows how to create a user-defined variable by using the Apache JMeter IDE.

    :::image type="content" source="media/how-to-parameterize-load-tests/user-defined-variables-env.png" alt-text="Screenshot that shows how to add user-defined variables for environment variables to your JMeter script.":::

    Instead, you can also directly edit the JMX file, as shown in this example code snippet:

    ```xml
    <Arguments guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
      <collectionProp name="Arguments.arguments">
        <elementProp name="appToken" elementType="Argument">
          <stringProp name="Argument.name">udv_webapp</stringProp>
          <stringProp name="Argument.value">${__BeanShell( System.getenv("webapp") )}</stringProp>
          <stringProp name="Argument.desc">Web app URL</stringProp>
          <stringProp name="Argument.metadata">=</stringProp>
        </elementProp>
      </collectionProp>
    </Arguments>
    ```

1. Reference the user-defined variable in the test script.

    You can use the `${}` syntax to reference the variable in the script. In the following example, you use the `udv_webapp` variable to configure the application endpoint URL.

    ```xml
    <stringProp name="HTTPSampler.domain">${udv_webapp}</stringProp>
    ```

### Configure environment variables in Azure Load Testing

To pass environment variables to the Apache JMeter script, you can configure the load test in the Azure portal, in the YAML test configuration file, or directly in the CI/CD workflow.

> [!IMPORTANT]
> When you define the environment variable for the load test, its name must match the variable name you used in the Apache JMeter script.

To specify an environment variable to the load test by using the Azure portal, take the following steps:

1. In the test configuration page, go to the **Parameters** tab.

1. In the **Environment Variables** section, enter the environment variable **Name** and **Value**, and then select **Apply**.
    
    :::image type="content" source="media/how-to-parameterize-load-tests/test-creation-env.png" alt-text="Screenshot that shows how to add an environment variable to a load test.":::
    
If you run your load test in a CI/CD workflow, you can define environment variables in the YAML test configuration file. For more information about the syntax, see the [Test configuration YAML reference](./reference-test-config-yaml.md).

Alternatively, you can also directly specify environment variables in the CI/CD workflow definition. You use input parameters for the GitHub Action or Azure Pipelines task to pass environment variables to the Apache JMeter script.

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
        "name": "webapp",
        "value": "myapplication.contoso.com",
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
          "name": "webapp",
          "value": "myapplication.contoso.com",
          }
      ]
```

## FAQ  

### Are my secrets values stored by the Azure Load Testing service?  

No. The values of secrets aren't stored by the Azure Load Testing service. When you use an Azure Key Vault secret URI, the service only stores the secret URI, and fetches the value of the secret for each test run. If you provided the value of secrets in a CI/CD workflow, the secret values aren't available after the test run. You'll provide these values for each test run.

### What happens if I have parameters both in my YAML configuration file and in the CI/CD workflow?  

If a parameter exists in both the YAML configuration file and the Azure Pipelines task or GitHub Action, the Azure Pipelines task or GitHub Action value will be used for the test run.

### I created and ran a test from my CI/CD workflow by passing parameters using the Azure Load Testing task / action. Can I run this test from the Azure portal with the same parameters?

The values of the parameters are not stored when they're passed from the CI/CD workflow. You'll have to provide the parameter values again when running the test from the Azure portal. You'll get a prompt to enter the missing values. For secret values, you'll enter the Azure Key Vault secret URI. The values entered at the test run or rerun page are valid only for that test run. For making changes at the test level, go to *Configure Test* and input your parameter values.
