---
title: Parameterize load tests with secrets and environment variables
titleSuffix: Azure Load Testing
description: 'Learn how to create configurable load tests by using secrets and environment variables as parameters in Azure Load Testing.'
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 01/15/2023
ms.topic: how-to
---

# Create configurable load tests with secrets and environment variables

Learn how to change the behavior of a load test without having to edit the Apache JMeter script. With Azure Load Testing, you can use parameters to make a configurable test script. For example, turn the application endpoint into a parameter to reuse your test script across multiple environments.

The Azure Load Testing service supports two types of parameters:

- **Secrets**: Contain sensitive information and are passed securely to the load test engine. For example, secrets provide web service credentials instead of hard-coding them in the test script. For more information, see [Configure load tests with secrets](#secrets).

- **Environment variables**: Contain non-sensitive information and are available as environment variables in the load test engine. For example, environment variables make the application endpoint URL configurable. For more information, see [Configure load tests with environment variables](#envvars).

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An Azure load testing resource. If you need to create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## <a name="secrets"></a> Configure load tests with secrets

In this section, you learn how to pass secrets to your load test script in Azure Load Testing. For example, you might use a secret to pass the API key to a web service endpoint that you're load testing. Instead of storing the API key in configuration or hard-coding it in the script, you can save it in a secret store to tightly control access to the secret.

Azure Load Testing enables you to store secrets in Azure Key Vault. Alternatively, when you run your load test in a CI/CD pipeline, you can also use the secret store that's associated with your CI/CD technology, such as Azure Pipelines or GitHub Actions.

To use secrets with Azure Load Testing, you perform the following steps:

1. Store the secret value in the secret store (Azure Key Vault or the CI/CD secret store).
1. Pass a reference to the secret into the Apache JMeter test script.
1. Use the secret value in the Apache JMeter test script by using the `GetSecret` custom function.

### <a name="akv_secrets"></a> Use Azure Key Vault to store load test secrets

You can use Azure Key Vault to pass secret values to your test script in Azure Load Testing. You add a reference to the secret in the Azure Load Testing configuration. Azure Load Testing then uses this reference to retrieve the secret value in the Apache JMeter script.

You also need to grant Azure Load Testing access to your Azure key vault to retrieve the secret value.

> [!NOTE]
> If you run a load test as part of your CI/CD process, you might also use the related secret store. Skip to [Use the CI/CD secret store](#cicd_secrets).

#### Create a secret in Azure Key Vault

1. [Add the secret value to your key vault](../key-vault/secrets/quick-create-portal.md#add-a-secret-to-key-vault), if you haven't already done so.

    > [!IMPORTANT]
    > If you restricted access to your Azure key vault by a firewall or virtual networking, follow these steps to [grant access to trusted Azure services](/azure/key-vault/general/overview-vnet-service-endpoints#grant-access-to-trusted-azure-services).

1. Retrieve the key vault **secret identifier** for your secret. You use this secret identifier to configure your load test.

    :::image type="content" source="media/how-to-parameterize-load-tests/key-vault-secret.png" alt-text="Screenshot that shows the details of a secret in an Azure key vault.":::
    
    The **secret identifier** is the full URI of the secret in the Azure key vault. Optionally, you can also include a version number. For example, `https://myvault.vault.azure.net/secrets/mysecret/` or `https://myvault.vault.azure.net/secrets/mysecret/abcdef01-2345-6789-0abc-def012345678`.

#### Add the secret to your load test

1. Reference the secret in the load test configuration.
    
    You define a load test secret parameter for each secret that you reference in the Apache JMeter script. The parameter name should match the secret name that you use in the Apache JMeter test script. The parameter value is the key vault security identifier.

    You can specify secret parameters by doing either of the following:

    * In the Azure portal, select your load test, select **Configure**, select the **Parameters** tab, and then enter the parameter details.
    
      :::image type="content" source="media/how-to-parameterize-load-tests/test-creation-secrets.png" alt-text="Screenshot that shows where to add secret details to a load test in the Azure portal.":::

    * If you're configuring a CI/CD workflow and use Azure Key Vault, you can specify a secret in the YAML configuration file by using the `secrets` property. For more information about the syntax, see the [Test configuration YAML reference](./reference-test-config-yaml.md).

1. Specify the identity that Azure Load Testing uses to access your secrets in Azure Key Vault.

    The identity can be the system-assigned identity of the load testing resource, or one of the user-assigned identities. Make sure you use the same identity you've granted access previously.

    You can specify the key vault reference identity by doing either of the following:

    * In the Azure portal, select your load test, select **Configure**, select the **Parameters** tab, and then configure the **Key Vault reference identity**.

        :::image type="content" source="media/how-to-parameterize-load-tests/key-vault-reference-identity.png" alt-text="Screenshot that shows how to select key vault reference identity.":::

    * If you're configuring a CI/CD workflow and use Azure Key Vault, you can specify the reference identity in the YAML configuration file by using the `keyVaultReferenceIdentity` property. For more information about the syntax, see the [Test configuration YAML reference](./reference-test-config-yaml.md).

#### Grant access to your Azure key vault

[!INCLUDE [include-grant-key-vault-access-secrets](includes/include-grant-key-vault-access-secrets.md)]

Now that you've added a secret in Azure Key Vault, configured a secret for your load test, you can now move to [Use secrets in Apache JMeter](#jmeter_secrets).

### <a name="cicd_secrets"></a> Use the CI/CD secret store to save load test secrets 

If you're using Azure Load Testing in your CI/CD workflow, you can also use the associated secret store. For example, you can use [GitHub repository secrets](https://docs.github.com/actions/security-guides/encrypted-secrets), or [secret variables in Azure Pipelines](/azure/devops/pipelines/process/variables?view=azure-devopsd&tabs=yaml%2Cbatch#secret-variables&preserve-view=true).

> [!NOTE]
> If you're already using a key vault, you might also use it to store the load test secrets. Skip to [Use Azure Key Vault](#akv_secrets).

To use secrets in the CI/CD secret store and pass them to your load test in CI/CD:

1. Add the secret value to the CI/CD secret store, if it doesn't exist yet.

    In Azure Pipelines, you can edit the pipeline and [add a variable](/azure/devops/pipelines/process/variables?view=azure-devopsd&tabs=yaml%2Cbatch#secret-variables&preserve-view=true).

    :::image type="content" source="media/how-to-parameterize-load-tests/new-variable.png" alt-text="Screenshot that shows how to add a variable to Azure Pipelines.":::

    In GitHub, you can use [GitHub repository secrets](https://docs.github.com/actions/security-guides/encrypted-secrets).

    :::image type="content" source="media/how-to-parameterize-load-tests/github-new-secret.png" alt-text="Screenshot that shows how to add a GitHub repository secret.":::

    > [!NOTE]
    > Be sure to use the actual secret value and not the key vault secret identifier as the value.

1. Pass the secret as an input parameter to the Load Testing task/action in the CI/CD workflow.
    
    The following YAML snippet shows how to pass the secret to the [Load Testing GitHub action](https://github.com/marketplace/actions/azure-load-testing):

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
            "value": "${{ secrets.MY_SECRET }}"
            }
        ]
    ```

    The following YAML snippet shows how to pass the secret to the [Azure Pipelines task](/azure/devops/pipelines/tasks/test/azure-load-testing):

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
              "value": "$(mySecret)"
              }
          ]
    ```

    > [!IMPORTANT]
    > The name of the secret input parameter needs to match the name that's used in the Apache JMeter script.

You've now specified a secret in the CI/CD secret store and passed a reference to Azure Load Testing. You can now use the secret in the Apache JMeter script.

### <a name="jmeter_secrets"></a> Use secrets in Apache JMeter

Next, you update the Apache JMeter script to use the secret that you specified earlier.

You first create a user-defined variable that retrieves the secret value. Then, you can use this variable in your test (for example, to pass an API token in an HTTP request header).

1. Create a user-defined variable in your JMX file, and assign the secret value to it by using the `GetSecret` custom function.

    The `GetSecret(<my-secret-name>)` function takes the secret name as an argument. You use this same name when you configure the load test in a later step.

    You can create the user-defined variable by using the Apache JMeter IDE, as shown in the following image:

    :::image type="content" source="media/how-to-parameterize-load-tests/user-defined-variables.png" alt-text="Screenshot that shows how to add user-defined variables to your Apache JMeter script.":::

    Alternatively, you can directly edit the JMX file, as shown in this example code snippet:

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

## <a name="envvars"></a> Configure load tests with environment variables

In this section, you use environment variables to pass parameters to your load test.

1. Update the Apache JMeter script to use the environment variable (for example, to configure the application endpoint hostname).

1. Configure the load test and pass the environment variable to the test script.

### Use environment variables in Apache JMeter

In this section, you update the Apache JMeter script to use environment variables to control the script behavior.

You first define a user-defined variable that reads the environment variable, and then you can use this variable in the test execution (for example, to update the HTTP domain).

1. Create a user-defined variable in your JMX file, and assign the environment variable's value to it by using the `System.getenv` function.

    The `System.getenv("<my-variable-name>")` function takes the environment variable name as an argument. You use this same name when you configure the load test.

    You can create a user-defined variable by using the Apache JMeter IDE, as shown in the following image:

    :::image type="content" source="media/how-to-parameterize-load-tests/user-defined-variables-env.png" alt-text="Screenshot that shows how to add user-defined variables for environment variables to your JMeter script.":::

    Alternatively, you can directly edit the JMX file, as shown in this example code snippet:

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
> When you define the environment variable for the load test, its name must match the variable name that you used in the Apache JMeter script.

To specify an environment variable to the load test by using the Azure portal, do the following:

1. On the test configuration page, select the **Parameters** tab.

1. In the **Environment Variables** section, enter the environment variable **Name** and **Value**, and then select **Apply**.
    
    :::image type="content" source="media/how-to-parameterize-load-tests/test-creation-env.png" alt-text="Screenshot that shows how to add an environment variable to a load test in the Azure portal.":::
    
If you run your load test in a CI/CD workflow, you can define environment variables in the YAML test configuration file. For more information about the syntax, see the [Test configuration YAML reference](./reference-test-config-yaml.md).

Alternatively, you can directly specify environment variables in the CI/CD workflow definition. You use input parameters for the Azure Load Testing action or Azure Pipelines task to pass environment variables to the Apache JMeter script.

The following YAML snippet shows a GitHub Actions example:

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
        "value": "myapplication.contoso.com"
        }
    ]
```

The following YAML snippet shows an Azure Pipelines example:

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
          "value": "myapplication.contoso.com"
          }
      ]
```

## FAQ  

### Does the Azure Load Testing service store my secret values?  

No. The Azure Load Testing service doesn't store the values of secrets. When you use a key vault secret URI, the service stores only the secret URI, and it fetches the value of the secret for each test run. If you provide the value of secrets in a CI/CD workflow, the secret values aren't available after the test run. You provide these values for each test run.

### What happens if I have parameters in both my YAML configuration file and the CI/CD workflow?  

If a parameter exists in both the YAML configuration file and the Azure Load Testing action or Azure Pipelines task, the value from the CI/CD workflow is used for the test run.

### I created and ran a test from my CI/CD workflow by passing parameters using the Azure Load Testing task or action. Can I run this test from the Azure portal with the same parameters?

The values of the parameters aren't stored when they're passed from the CI/CD workflow. You have to provide the parameter values again when you run the test from the Azure portal. You get a prompt to enter the missing values. For secret values, you enter the key vault secret URI. The values that you enter at the test run or rerun page are valid only for that test run. For making changes at the test level, go to **Configure Test** and enter your parameter values.

## Next steps

- For more information about reading CSV files, see [Read CSV files in load tests](./how-to-read-csv-data.md).

- For information about high-scale load tests, see [Set up a high-scale load test](./how-to-high-scale-load.md).

- To learn about performance test automation, see [Configure automated performance testing](./tutorial-identify-performance-regression-with-cicd.md).
