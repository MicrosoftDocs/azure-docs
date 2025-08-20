---
title: Synchronize APIs from Amazon API Gateway - Azure API Center
description: Integrate an Amazon API Gateway to Azure API Center for automatic synchronization of APIs to the inventory.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 06/02/2025
ms.author: danlep 
ms.custom: 
  - devx-track-azurecli
ms.collection: 
 - migration
 - aws-to-azure
# Customer intent: As an API program manager, I want to integrate my Azure API Management instance with my API center and synchronize API Management APIs to my inventory.
---

# Synchronize APIs from Amazon API Gateway to Azure API Center (preview)

This article shows how to integrate an Amazon API Gateway so that the gateway's APIs are continuously kept up to date in your [API center](overview.md) inventory.

## About integrating Amazon API Gateway

Integrating Amazon API Gateway as an API source for your API center enables continuous synchronization so that the API inventory stays up to date. Azure API Center can also synchronize APIs from sources including [Azure API Management](synchronize-api-management-apis.md). 

When you integrate an Amazon API Gateway as an API source, the following happens:

1. APIs, and optionally API definitions (specs), from the API Gateway are added to the API center inventory.
1. You configure an [environment](key-concepts.md#environment) of type *Amazon API Gateway* in the API center. 
1. An associated [deployment](key-concepts.md#deployment) is created for each synchronized API definition. 

Synchronization is one-way from Amazon API Gateway to your Azure API center, meaning API updates in the API center aren't synchronized back to Amazon API Gateway.

> [!NOTE]
> * Integration of Amazon API Gateway is currently in preview.
> * There are [limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=/azure/api-center/toc.json&bc=/azure/api-center/breadcrumb/toc.json#azure-api-center-limits) for the number of integrated API sources.
> * APIs in Amazon API Gateway synchronize to your API center once per hour. Only REST APIs are synchronized.
> * API definitions also synchronize to the API center if you select the option to include them during integration. Only definitions from deployed APIs are synchronized.

### Entities synchronized from Amazon API Gateway

[!INCLUDE [synchronized-properties-api-source](includes/synchronized-properties-api-source.md)]

## Prerequisites

* An API center in your Azure subscription. If you haven't created one, see [Quickstart: Create your API center](set-up-api-center.md).

* An Azure key vault. If you need to create one, see [Quickstart: Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal). To add or manage secrets in the key vault, at least the **Key Vault Secrets Officer** role or equivalent permissions are required. 

* An [Amazon API Gateway](https://docs.aws.amazon.com/apigateway/). 

* An AWS [IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) identity with the `AmazonAPIGatewayAdministrator` policy attached.

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    [!INCLUDE [install-apic-extension](includes/install-apic-extension.md)]

    > [!NOTE]
    > Azure CLI command examples in this article can run in PowerShell or a bash shell. Where needed because of different variable syntax, separate command examples are provided for the two shells.

## Create IAM user access keys

To authenticate your API center to Amazon API Gateway, you need access keys for an AWS IAM user. 

To generate the required access key ID and secret key using the AWS Management Console, see [Create an access key for yourself](https://docs.aws.amazon.com/IAM/latest/UserGuide/access-key-self-managed.html#Using_CreateAccessKey) in the AWS documentation. 

Save your access keys in a safe location. You'll store them in Azure Key Vault in the next steps.

> [!CAUTION]
> Access keys are long-term credentials, and you should manage them as securely as you would a password. Learn more about [securing access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/securing_access-keys.html)

## Store IAM user access keys in Azure Key Vault

Manually upload and securely store the two IAM user access keys in Azure Key Vault using the configuration recommended in the following table. For more information, see [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](/azure/key-vault/secrets/quick-create-portal). 


| AWS secret | Upload options | Name | Secret value | 
|------------|----------------|------|--------------|
| Access key | Manual | *aws-access-key* | Access key ID retrieved from AWS |
| Secret access key | Manual | *aws-secret-access-key* | Secret access key retrieved from AWS |

:::image type="content" source="media/synchronize-aws-gateway-apis/key-vault-secrets.png" alt-text="Screenshot of secrets list in Azure Key Vault in the portal.":::

Take note of the **Secret identifier** of each secret, a URI similar to `https://<key-vault-name>.vault.azure.net/secrets/<secret-name>`. You'll use these identifiers in the next steps.


[!INCLUDE [enable-managed-identity](includes/enable-managed-identity.md)]

## Assign the managed identity the Key Vault Secrets User role

[!INCLUDE [configure-managed-identity-kv-secret-user](includes/configure-managed-identity-kv-secret-user.md)]


## Integrate an Amazon API Gateway 

You can integrate an Amazon API Gateway using the portal or the Azure CLI.

#### [Portal](#tab/portal)
1. In the [portal](https://portal.azure.com), navigate to your API center.
1. Under **Platforms**, select **Integrations**.
1. Select **+ New integration** > **From Amazon API Gateway**.
1. In the **Integrate your Amazon API Gateway Service** page:
    1. For the **AWS access key** and **AWS secret access key**, click **Select** and select the subscription, key vault, secret that you stored. 
    1. Select the **AWS region** where the Amazon API Gateway is deployed.
    1. In **Integration details**, enter an identifier.
    1. In **Environment details**, enter an **Environment title** (name), **Environment type**, and optional **Description**.
    1. In **API Details**:
        1. Select a **Lifecycle** for the synchronized APIs. (You can update this value for the APIs after they're added to your API center.)
        1. Optionally, select whether to include API definitions with the synchronized APIs.
1. Select **Create**.


:::image type="content" source="media/synchronize-aws-gateway-apis/link-aws-gateway-service.png" alt-text="Screenshot of integrating an Amazon API Gateway service in the portal.":::

#### [Azure CLI](#tab/cli)

Run the [az apic integration create aws](/cli/azure/apic/integration/create#az-apic-integration-create-aws) (preview) command to integrate an Amazon API Gateway to your API center. 

* Provide the names of the resource group, API center, and integration. 

* Provide the Key Vault secret identifiers for the AWS access key and secret access key, and the AWS region where the Amazon API Gateway is deployed.

```azurecli
az apic integration create aws \
    --resource-group <resource-group-name> \
    --service-name-name <api-center-name> \
    --integration-name <aws-integration-name> \
    --aws-access-key-reference <access-key-uri> \
    --aws-secret-access-key-reference <secret-access-key-uri> 
    --aws-region-name <aws-region>
``` 
---

The environment is added in your API center. The Amazon API Gateway APIs are imported to the API center inventory.

[!INCLUDE [delete-api-integration](includes/delete-api-integration.md)]

## Related content
 
* [Manage API inventory with Azure CLI commands](manage-apis-azure-cli.md)
* [Synchronize APIs from API Management to your Azure API center](synchronize-api-management-apis.md)
