---
title: "Quickstart - Automate deployments"
titleSuffix: Azure Spring Apps Enterprise plan
description: Explains how to automate deployments to the Azure Spring Apps Enterprise plan by using GitHub Actions and Terraform.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: spring-apps
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java, devx-track-terraform
---

# Quickstart: Automate deployments

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This quickstart shows you how to automate deployments to the Azure Spring Apps Enterprise plan by using GitHub Actions and Terraform.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Understand and fulfill the [Requirements](how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]

## Set up a GitHub repository and authenticate

The automation associated with the sample application requires a Storage account for maintaining Terraform state. The following steps show you how to create a Storage Account for use with GitHub Actions and Terraform.

1. Use the following command to create a new resource group to contain the Storage Account:

   ```azurecli
   az group create \
       --name <storage-resource-group> \
       --location <location>
   ```

1. Use the following command to create a Storage Account:

   ```azurecli
   az storage account create \
       --resource-group <storage-resource-group> \
       --name <storage-account-name> \
       --location <location> \
       --sku Standard_RAGRS \
       --kind StorageV2
   ```

1. Use the following command to create a Storage Container within the Storage Account:

   ```azurecli
   az storage container create \
       --resource-group <storage-resource-group> \
       --name terraform-state-container \
       --account-name <storage-account-name> \
       --auth-mode login
   ```

1. Use the following commands to get an Azure credential. You need an Azure service principal credential to authorize Azure login action.

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

1. This example uses the [fitness store](https://github.com/Azure-Samples/acme-fitness-store) sample on GitHub. Fork the sample, open the GitHub repository page, and then select the **Settings** tab. Open the **Secrets** menu, then select **Add a new secret**, as shown in the following screenshot.

   :::image type="content" source="media/github-actions/actions1.png" alt-text="Screenshot showing GitHub Settings Add new secret." lightbox="media/github-actions/actions1.png"

1. Set the secret name to `AZURE_CREDENTIALS` and set its value to the JSON string that you found under the heading **Set up your GitHub repository and authenticate**.

   :::image type="content" source="media/github-actions/actions2.png" alt-text="Screenshot showing GitHub Settings Set secret data." lightbox="media/github-actions/actions2.png"

1. Add the following secrets to GitHub Actions:

   - `TF_PROJECT_NAME`: Use a value of your choosing. This value will be the name of your Terraform Project.
   - `AZURE_LOCATION`: The Azure Region your resources will be created in.
   - `OIDC_JWK_SET_URI`: Use the `JWK_SET_URI` defined in [Quickstart: Configure single sign-on for applications using the Azure Spring Apps Enterprise plan](quickstart-configure-single-sign-on-enterprise.md).
   - `OIDC_CLIENT_ID`: Use the `CLIENT_ID` defined in [Quickstart: Configure single sign-on for applications using the Azure Spring Apps Enterprise plan](quickstart-configure-single-sign-on-enterprise.md).
   - `OIDC_CLIENT_SECRET`: Use the `CLIENT_SECRET` defined in [Quickstart: Configure single sign-on for applications using the Azure Spring Apps Enterprise plan](quickstart-configure-single-sign-on-enterprise.md).
   - `OIDC_ISSUER_URI`: Use the `ISSUER_URI` defined in [Quickstart: Configure single sign-on for applications using the Azure Spring Apps Enterprise plan](quickstart-configure-single-sign-on-enterprise.md).

1. Add the secret `TF_BACKEND_CONFIG` to GitHub Actions with the following value:

   ```text
   resource_group_name  = "<storage-resource-group>"
   storage_account_name = "<storage-account-name>"
   container_name       = "terraform-state-container"
   key                  = "dev.terraform.tfstate"
   ```

## Automate with GitHub Actions

Now you can run GitHub Actions in your repository. The [provision workflow](https://github.com/Azure-Samples/acme-fitness-store/blob/HEAD/.github/workflows/provision.yml) provisions all resources necessary to run the example application. The following screenshot shows an example run:

:::image type="content" source="media/quickstart-automate-deployments-github-actions-enterprise/provision.png" alt-text="Screenshot of GitHub showing output from the provision workflow." lightbox="media/quickstart-automate-deployments-github-actions-enterprise/provision.png"

Each application has a [deploy workflow](https://github.com/Azure-Samples/acme-fitness-store/blob/HEAD/.github/workflows/catalog.yml) that will redeploy the application when changes are made to that application. The following screenshot shows some example output from the catalog service:

:::image type="content" source="media/quickstart-automate-deployments-github-actions-enterprise/deploy-catalog.png" alt-text="Screenshot of GitHub showing output from the Deploy Catalog workflow." lightbox="media/quickstart-automate-deployments-github-actions-enterprise/deploy-catalog.png"

The [cleanup workflow](https://github.com/Azure-Samples/acme-fitness-store/blob/HEAD/.github/workflows/cleanup.yml) can be manually run to delete all resources created by the `provision` workflow. The following screenshot shows the output:

:::image type="content" source="media/quickstart-automate-deployments-github-actions-enterprise/cleanup.png" alt-text="Screenshot of GitHub showing output from the cleanup workflow." lightbox="media/quickstart-automate-deployments-github-actions-enterprise/cleanup.png"

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

Continue on to any of the following optional quickstarts:

- [Configure single sign-on](quickstart-configure-single-sign-on-enterprise.md)
- [Integrate Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)
- [Load application secrets using Key Vault](quickstart-key-vault-enterprise.md)
- [Monitor applications end-to-end](quickstart-monitor-end-to-end-enterprise.md)
- [Set request rate limits](quickstart-set-request-rate-limits-enterprise.md)
- [Integrate Azure Open AI](quickstart-fitness-store-azure-openai.md)
