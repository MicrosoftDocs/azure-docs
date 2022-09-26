---
title: Load test secured endpoints
description: Learn how to load test secured endpoints with Azure Load Testing.
author: ntrogh
ms.author: nicktrog
services: load-testing
ms.service: load-testing
ms.topic: how-to 
ms.date: 09/06/2022
ms.custom: template-how-to
---

# Load test secured endpoints with Azure Load Testing Preview

In this article, you learn how to load test secured endpoints with Azure Load Testing Preview. Azure Load Testing enables you to [authenticate with endpoints by using shared secrets or credentials](#authenticate-with-a-shared-secret-or-credentials), or to [authenticate with client certificates](#authenticate-with-client-certificates).


> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

## Authenticate with a shared secret or credentials

In this scenario, the application endpoint requires that you use a shared secret, such as an access token, an API key, or user credentials to authenticate. In the JMeter script, you have to provide this security information with each application request. For example, to load test a web endpoint that uses OAuth 2.0, you add an `Authorization` header, which contains the access token, to the HTTP request.

To avoid storing, and disclosing, security information in the JMeter script, Azure Load Testing enables you to securely store secrets in Azure Key Vault or in the CI/CD secrets store. By using a custom JMeter function `GetSecret`, you can retrieve the secret value and pass it to the application endpoint.

The following diagram shows how to use shared secrets or credentials to authenticate with an application endpoint in your load test.

:::image type="content" source="./media/how-to-test-secured-endpoints/load-test-authentication-with-shared-secret.png" alt-text="Diagram that shows how to use shared-secret authentication with Azure Load Testing.":::

1. Add the security information in a secrets store in either of two ways:

    * Add the secret information in Azure Key Vault. Follow the steps in [Parameterize load tests with secrets](./how-to-parameterize-load-tests.md#use-azure-key-vault-to-store-load-test-secrets) to store a secret and authorize your load testing resource to read its value.

    * Add the secret information as a secret in CI/CD ([GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) or [Azure Pipelines secret variables](/azure/devops/pipelines/process/set-secret-variables)).

1. Add a secret to the load test configuration:

    # [Azure portal](#tab/portal)

    To add a secret to your load test in the Azure portal:

    1. Navigate to your load testing resource in the Azure portal. If you don't have a load test yet, [create a new load test using a JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md).
    1. On the left pane, select **Tests** to view the list of load tests.
    1. Select your test from the list, and then select **Edit**, to edit the load test configuration.

        :::image type="content" source="./media/how-to-test-secured-endpoints/edit-load-test.png" alt-text="Screenshot that shows how to edit a load test in the Azure portal.":::

    1. On the **Parameters** tab, enter the details of the secret.

        | Field | Value |
        | ----- | ----- |
        | **Name** | Name of the secret. You'll provide this name to the `GetSecret` function to retrieve the secret value in the JMeter script. |
        | **Value** | Matches the Azure Key Vault **Secret identifier**. |

        :::image type="content" source="media/how-to-test-secured-endpoints/load-test-secrets.png" alt-text="Screenshot that shows how to add secrets to a load test in the Azure portal.":::

    1. Select **Apply**, to save the load test configuration changes.
    
    # [GitHub Actions](#tab/github)

    To add a secret to your load test in GitHub Actions, update the GitHub Actions workflow YAML file. In the workflow, add a `secrets` parameter to the `azure/load-testing` action. 

    | Field | Value |
    | ----- | ----- |
    | **name** | Name of the secret. You'll provide this name to the `GetSecret` function to retrieve the secret value in the JMeter script. |
    | **value** | References the GitHub Actions secret name. |
    
    The following code snippet gives an example of how to configure a load test secret in GitHub Actions.

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
            "value": "${{ secrets.APP_TOKEN }}"
            }
        ]
    ```

    # [Azure Pipelines](#tab/pipelines)
        
    To add a secret to your load test in Azure Pipelines, update the Azure Pipelines definition file. In the pipeline, add a `secrets` parameter to the `AzureLoadTest` task. 

    | Field | Value |
    | ----- | ----- |
    | **name** | Name of the secret. You'll provide this name to the `GetSecret` function to retrieve the secret value in the JMeter script. |
    | **value** | References the Azure Pipelines secret variable name. |
    
    The following code snippet gives an example of how to configure a load test secret in Azure Pipelines.

    ```yaml
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
                "value": "$(appToken)"
                }
            ]
    ```
    ---

1. Update the JMeter script to retrieve the secret value:

    1. Create a user-defined variable that retrieves the secret value with the `GetSecret` custom function:
        <!-- Add screenshot -->

    1. Update the JMeter sampler component to pass the secret in the request. For example, to provide an OAuth2 access token, you configure the `Authentication` HTTP header:
        <!-- Add screenshot -->

When you now run your load test, the JMeter script can retrieve the secret information from the secrets store and authenticate with the application endpoint.

## Authenticate with client certificates

Support for PFX format certificate - must be stored in Azure Key Vault

:::image type="content" source="./media/how-to-test-secured-endpoints/load-test-authentication-with-client-certificate.png" alt-text="Diagram that shows how to use client-certificate authentication with Azure Load Testing.":::

steps:
- store cert in AKV
- give access to AKV for the MI of Load Testing resource
- specify cert in Parameters (how in config?)
- JMX changes?
- 

## Next steps

* Learn more about [how to parameterize a load test](./how-to-parameterize-load-tests.md).
