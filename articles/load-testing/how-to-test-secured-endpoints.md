---
title: Load test secured endpoints
description: Learn how to load test secured endpoints with Azure Load Testing. Use shared secrets, credentials, or client certificates for load testing applications that require authentication.
author: ntrogh
ms.author: nicktrog
services: load-testing
ms.service: load-testing
ms.topic: how-to 
ms.date: 09/28/2022
ms.custom: template-how-to
---

# Load test secured endpoints with Azure Load Testing Preview

In this article, you learn how to load test secured applications with Azure Load Testing Preview. Secured applications require authentication to access the endpoint. Azure Load Testing enables you to [authenticate with endpoints by using shared secrets or credentials](#authenticate-with-a-shared-secret-or-credentials), or to [authenticate with client certificates](#authenticate-with-client-certificates).

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* An Azure Load Testing resource. To create a load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md#create-an-azure-load-testing-resource).
* If you're using client certificates, an Azure key vault. To create a key vault, see the quickstart [Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal).

## Authenticate with a shared secret or credentials

In this scenario, the application endpoint requires that you use a shared secret, such as an access token, an API key, or user credentials to authenticate. In the JMeter script, you have to provide this security information with each application request. For example, to load test a web endpoint that uses OAuth 2.0, you add an `Authorization` header, which contains the access token, to the HTTP request.

The following diagram shows how to use shared secrets or credentials to authenticate with an application endpoint in your load test. To avoid storing, and disclosing, security information in the JMeter script, you can securely store secrets in Azure Key Vault or in the CI/CD secrets store. In the JMeter script, you then use a custom JMeter function `GetSecret` to retrieve the secret value. Finally, you specify the secret value in the JMeter request to the application endpoint.

:::image type="content" source="./media/how-to-test-secured-endpoints/load-test-authentication-with-shared-secret.png" alt-text="Diagram that shows how to use shared-secret authentication with Azure Load Testing.":::

1. Add the security information in a secrets store in either of two ways:

    * Add the secret information in Azure Key Vault. Follow the steps in [Parameterize load tests with secrets](./how-to-parameterize-load-tests.md) to store a secret and authorize your load testing resource to read its value.

    * Add the secret information as a secret in CI/CD ([GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) or [Azure Pipelines secret variables](/azure/devops/pipelines/process/set-secret-variables)).

1. Add the secret to the load test configuration:

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

        :::image type="content" source="./media/how-to-test-secured-endpoints/jmeter-user-defined-variables.png" alt-text="Screenshot that shows how to add a user-defined variable that uses the GetSecret function in JMeter.":::

    1. Update the JMeter sampler component to pass the secret in the request. For example, to provide an OAuth2 access token, you configure the `Authorization` HTTP header:

        :::image type="content" source="./media/how-to-test-secured-endpoints/jmeter-add-http-header.png" alt-text="Screenshot that shows how to add an authorization header to a request in JMeter.":::
        
When you now run your load test, the JMeter script can retrieve the secret information from the secrets store and authenticate with the application endpoint.

## Authenticate with client certificates

In this scenario, the application endpoint requires that you use a client certificate to authenticate. Azure Load Testing supports Public Key Certificate Standard #12 (PKCS12) type of certificates. You can use only one client certificate in a load test.

The following diagram shows how to use a client certificate to authenticate with an application endpoint in your load test. To avoid storing, and disclosing, the client certificate alongside the JMeter script, you store the certificate in Azure Key Vault. When you run the load test, Azure Load Testing reads the certificate from the key vault, and automatically passes it to JMeter. JMeter then transparently passes the certificate in all application requests. You don't have to update the JMeter script to use the client certificate.

:::image type="content" source="./media/how-to-test-secured-endpoints/load-test-authentication-with-client-certificate.png" alt-text="Diagram that shows how to use client-certificate authentication with Azure Load Testing.":::

1. Follow the steps in [Import a certificate](/azure/key-vault/certificates/tutorial-import-certificate) to store your certificate in Azure Key Vault.

    > [!IMPORTANT]
    > Azure Load Testing only supports PKCS12 certificates. Upload the client certificate in PFX file format.

1. Verify that your load testing resource has permissions to retrieve the certificate from your key vault.

    Azure Load Testing retrieves the certificate as a secret to ensure that the private key for the certificate is available. [Assign the Get secret permission to your load testing resource](./how-to-use-a-managed-identity.md#grant-access-to-your-azure-key-vault) in Azure Key Vault.

1. Add the certificate to the load test configuration:

    # [Azure portal](#tab/portal)

    To add a client certificate to your load test in the Azure portal:

    1. Navigate to your load testing resource in the Azure portal. If you don't have a load test yet, [create a new load test using a JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md).
    1. On the left pane, select **Tests** to view the list of load tests.
    1. Select your test from the list, and then select **Edit**, to edit the load test configuration.

        :::image type="content" source="./media/how-to-test-secured-endpoints/edit-load-test.png" alt-text="Screenshot that shows how to edit a load test in the Azure portal.":::

    1. On the **Parameters** tab, enter the details of the certificate.

        | Field | Value |
        | ----- | ----- |
        | **Name** | Name of the certificate. |
        | **Value** | Matches the Azure Key Vault **Secret identifier** of the certificate. |

        :::image type="content" source="media/how-to-test-secured-endpoints/load-test-certificates.png" alt-text="Screenshot that shows how to add a certificate to a load test in the Azure portal.":::

    1. Select **Apply**, to save the load test configuration changes.

    # [GitHub Actions](#tab/github)

    To add a client certificate for your load test, update the `certificates` property in the [load test YAML configuration file](./reference-test-config-yaml.md).

    | Field | Value |
    | ----- | ----- |
    | **name** | Name of the client certificate. |
    | **value** | Matches the Azure Key Vault **Secret identifier** of the certificate. |

    ```yml
    certificates:
      - name: <my-certificate-name>
        value: <my-keyvault-secret-ID>
     ```

    # [Azure Pipelines](#tab/pipelines)

    To add a client certificate for your load test, update the `certificates` property in the [load test YAML configuration file](./reference-test-config-yaml.md).

    | Field | Value |
    | ----- | ----- |
    | **name** | Name of the client certificate. |
    | **value** | Matches the Azure Key Vault **Secret identifier** of the certificate. |

    ```yml
    certificates:
      - name: <my-certificate-name>
        value: <my-keyvault-secret-ID>
     ```
    ---

When you now run your load test, Azure Load Testing retrieves the client certificate from Azure Key Vault, and injects it in the JMeter web requests.

## Next steps

* Learn more about [how to parameterize a load test](./how-to-parameterize-load-tests.md).
