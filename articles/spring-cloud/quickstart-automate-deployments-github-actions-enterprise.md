---
title: "Quickstart - Automate Deployments"
description: Explains how to automate deployments to Azure Spring Cloud Enterprise Tier using GitHub Actions and Terraform.
author: KarlErickson
ms.author: paly@vmware.com
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java
---

# Quickstart: Automate deployments

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you automate deployments to Azure Spring Cloud Enterprise Tier using GitHub Actions and Terraform.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Cloud Enterprise Tier. For more information, see [View Azure Spring Cloud Enterprise Tier Offer in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]

## Set up GitHub repository and authenticate

The automation associated with the sample application requires a Storage Account for maintaining terraform state. The following instructions describe how to create a Storage Account for use with GitHub Actions and Terraform.

Create a new resource group to contain the Storage Account using the following command:

```azurecli
az group create \
    --name <storage-resource-group> \
    --location <location>
```

Create a Storage Account using the following command:

```azurecli
az storage account create \
    --resource-group <storage-resource-group> \
    --name <storage-account-name> \
    --location <location> \
    --sku Standard_RAGRS \
    --kind StorageV2
```

Create a Storage Container within the Storage Account using the following command:

```azurecli
az storage container create \
    --resource-group <storage-resource-group> \
    --name terraform-state-container \
    --account-name <storage-account-name> \
    --auth-mode login
```

You need an Azure service principal credential to authorize Azure login action. To get an Azure credential, execute the following commands:

```azurecli
az login
az ad sp create-for-rbac \
    --role contributor \
    --scopes /subscriptions/<SUBSCRIPTION_ID> \
    --sdk-auth
```

The command should output a JSON object:

```json
{
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    ...
}
```

This example uses the [ACME Fitness Store](https://github.com/Azure-Samples/acme-fitness-store) sample on GitHub.  Fork the sample, open GitHub repository page, and select the **Settings** tab. Open **Secrets** menu, and select **Add a new secret**:

![Add new secret](./media/github-actions/actions1.png)

Set the secret name to `AZURE_CREDENTIALS` and its value to the JSON string that you found under the heading *Set up your GitHub repository and authenticate*.

![Set secret data](./media/github-actions/actions2.png)

In addition to `AZURE_CREDENTIALS`, add the following secrets to GitHub Actions:

- `TF_PROJECT_NAME` - with the value of your choosing. This will be the name of your Terraform Project
- `AZURE_LOCATION` - this is the Azure Region your resources will be created in.
- `OIDC_JWK_SET_URI` - use the `JWK_SET_URI` defined in [Configuring Single Sign-On](./quickstart-configure-single-sign-on-enterprise.md)
- `OIDC_CLIENT_ID` - use the `CLIENT_ID` defined in [Configuring Single Sign-On](./quickstart-configure-single-sign-on-enterprise.md)
- `OIDC_CLIENT_SECRET` - use the `CLIENT_SECRET` defined in [Configuring Single Sign-On](./quickstart-configure-single-sign-on-enterprise.md)
- `OIDC_ISSUER_URI` - use the `ISSUER_URI` defined in [Configuring Single Sign-On](./quickstart-configure-single-sign-on-enterprise.md)

Add the secret `TF_BACKEND_CONFIG` to GitHub Actions with the value:

```text
resource_group_name  = "<storage-resource-group>"
storage_account_name = "<storage-account-name>"
container_name       = "terraform-state-container"
key                  = "dev.terraform.tfstate"
```

## Automate with GitHub Actions

Now you can run GitHub Actions in your repository. The [provision workflow](https://github.com/Azure-Samples/acme-fitness-store/blob/Azure/.github/workflows/provision.yml) provisions all resources necessary to run the example application. An example run is seen below:

![Output from the provision workflow](media/spring-cloud-enterprise-quickstart-github-actions/provision.png)

Each application has a [deploy workflow](https://github.com/Azure-Samples/acme-fitness-store/blob/Azure/.github/workflows/catalog.yml) that will redeploy the application when changes are made to that application. An example output from the catalog service is seen below:

![Output from the Deploy Catalog workflow](media/spring-cloud-enterprise-quickstart-github-actions/deploy-catalog.png)

The [cleanup workflow](https://github.com/Azure-Samples/acme-fitness-store/blob/Azure/.github/workflows/cleanup.yml) can be manually run to delete all resources created by the `provision` workflow. The output can be seen below:

![Output from the cleanup workflow](media/spring-cloud-enterprise-quickstart-github-actions/cleanup.png)

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```
