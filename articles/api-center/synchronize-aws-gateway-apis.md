---
title: Synchronize APIs from Amazon API Gateway - Azure API Center
description: Integrate an Amazon API Gateway to Azure API Center for automatic synchronization of APIs to the inventory.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 12/23/2024
ms.author: danlep 
ms.custom: devx-track-azurecli
# Customer intent: As an API program manager, I want to integrate my Azure API Management instance with my API center and synchronize API Management APIs to my inventory.
---

# Synchronize APIs from Amazon API Gateway to Azure API Center (preview)

This article shows how to integrate an Amazon API Gateway so that the gateway's APIs are continuously kept up to date in your [API center](overview.md) inventory. 

## About integrating Amazon API Gateway

Integrating Amazon API Gateway as an API source for your API center enables continuous synchronization so that the API inventory stays up to date.

When you integrate an Amazon API Gateway as an API source, the following happens:

1. APIs, and optionally API definitions (specs), from the API Gateway are added to the API center inventory.
1. You configure an [environment](key-concepts.md#environment) of type *Amazon API Gateway* in the API center. 
1. An associated [deployment](key-concepts.md#deployment) is created for each synchronized API definition. 

Synchronization is one-way from Amazon API Gateway to your Azure API center, meaning API updates in the API center aren't synchronized back to the API Gateway.

> [!NOTE]
> * There are [limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=/azure/api-center/toc.json&bc=/azure/api-center/breadcrumb/toc.json#api-center-limits) for the number of integrated API sources.
> * APIs in your Amazon API Gateway synchronize to your API center once per hour.

### Entities synchronized from Amazon API Gateway

You can add or update metadata properties and documentation in your API center to help stakeholders discover, understand, and consume the synchronized APIs. Learn more about Azure API Center's [built-in and custom metadata properties](add-metadata-properties.md).

The following table shows entity properties that can be modified in Azure API Center and properties that are determined based on their values in Amazon API Gateway. Also, entities' resource or system identifiers in Azure API Center are generated automatically and can't be modified.

| Entity       | Properties configurable in API Center                     | Properties determined in Amazon API Gateway                                           |
|--------------|-----------------------------------------|-----------------|
| API          | summary<br/>lifecycleStage<br/>termsOfService<br/>license<br/>externalDocumentation<br/>customProperties    | title<br/>description<br/>kind                   |
| API version  | lifecycleStage      | title<br/>definitions (if synchronized)                      |
| Environment  | title<br/>description<br/>kind</br>server.managementPortalUri<br/>onboarding<br/>customProperties      | server.type
| Deployment   |  title<br/>description<br/>server<br/>state<br/>customProperties    |      server.runtimeUri |

For property details, see the [Azure API Center REST API reference](/rest/api/apicenter).


## Prerequisites

* An API center in your Azure subscription. If you haven't created one, see [Quickstart: Create your API center](set-up-api-center.md).

* An Azure key vault. If you need to create one, see [Quickstart: Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal).

* An [Amazon API Gateway](https://docs.aws.amazon.com/apigateway/). 

* An AWS [IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) identity with the `AmazonAPIGatewayAdministrator` policy attached.

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    [!INCLUDE [install-apic-extension](includes/install-apic-extension.md)]

    > [!NOTE]
    > Azure CLI command examples in this article can run in PowerShell or a bash shell. Where needed because of different variable syntax, separate command examples are provided for the two shells.

## Add a managed identity in your API center

[!INCLUDE [enable-managed-identity](includes/enable-managed-identity.md)]

## Create IAM user access keys

To authenticate your API center with Amazon API Gateway, you need access keys for an AWS IAM user. 

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

Take note of the **Secret identifier** URI of each secret. You'll use these identifiers in the next steps.


## Add a managed identity in your API center

[!INCLUDE [enable-managed-identity](includes/enable-managed-identity.md)]

## Assign the managed identity the Key Vault Secrets User role

[!INCLUDE [configure-managed-identity-kv-secret-user](includes/configure-managed-identity-kv-secret-user.md)]


## Integrate an Amazon API Gateway 

You can integrate an Amazon API Gateway to your API center using the portal or the Azure CLI.

#### [Portal](#tab/portal)

1. In the [portal](https://portal.azure.com), navigate to your API center.
1. Under **Assets**, select **Environments**.
1. Select **Integrations (preview)** > **+ New integration** > **From Amazon API Gateway**.
1. In the **Integrate your Amazon API Gateway service** page:
    1. Under **Configure AWS credentials using Azure Key Vault**, enter or select the Key Vault secret identifiers for the **AWS access key** and **AWS secret access key** you stored previously. Also, select the **AWS region** where the Amazon API Gateway is deployed.
    1. In **Integration details**, enter an identifier.
    1. In **Environment details**, enter an **Environment title** (name), **Environment type**, and optional **Environment description**.
    1. In **API details**, select a **Lifecycle stage** for the synchronized APIs. (You can update this value for your APIs after they're added to your API center.) Also, select whether to synchronize API definitions.
1. Select **Create**.

<!----
:::image type="content" source="media/synchronize-api-management-apis/link-api-management-service.png" alt-text="Screenshot of linking an Azure API Management Service in the portal.":::

--->

#### [Azure CLI](#tab/cli)

Run the `az apic integration create aws` command to integrate an Amazon API Gateway to your API center. Provide the Key Vault secret identifiers for the AWS access key and secret access key, and the AWS region where the Amazon API Gateway is deployed.

```azurecli

az apic integration create aws --name <api-center-name> \
    --integration-name <aws-integration-name> \
    --aws-access-key-reference <access-key-uri> \
    --aws-secret-access-key-reference <secret-access-key-uri> \
    --aws-region-name <aws-region>
``` 
---


The environment is added in your API center. The Amazon API Gateway APIs are imported to the API center inventory.


[!INCLUDE [delete-api-integration](includes/delete-api-integration.md)]

## Related content
 
* [Manage API inventory with Azure CLI commands](manage-apis-azure-cli.md)
* [Synchronize APIs from API Management to your Azure API center](synchronize-api-management-apis.md)
