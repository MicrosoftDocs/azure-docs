---
title: Manage secrets - Azure IoT Operations
description: Create, update, and manage secrets that are required to give your Arc-connected cluster access to Azure resources.
author: kgremban
ms.author: kgremban
# ms.subservice: orchestrator
ms.topic: how-to
ms.date: 11/13/2023
ms.custom:
  - ignite-2023

#CustomerIntent: As an IT professional, I want prepare an Azure-Arc enabled Kubernetes cluster with Key Vault secrets so that I can deploy Azure IoT Operations to it.
---

# Manage secrets for your Azure IoT Operations deployment

Secrets management in Azure IoT Operations uses Azure Key Vault as the managed vault solution on the cloud and uses the secrets store CSI driver to pull secrets down from the cloud and store them on the edge.

## Prerequisites

* An Arc-enabled Kubernetes cluster. For more information, see [Prepare your cluster](./howto-prepare-cluster.md).

## Configure a secret store on your cluster

Azure IoT Operations supports Azure Key Vault for storing secrets and certificates. In this section, you create a key vault, set up a service principal to give access to the key vault, and configure the secrets that you need for running Azure IoT Operations.

>[!TIP]
>The `az iot ops init` Azure CLI command automates the steps in this section. For more information, see [Deploy Azure IoT Operations extensions](./howto-deploy-iot-operations.md?tabs=cli).

### Create a vault

1. Open the [Azure portal](https://portal.azure.com).

1. In the search bar, search for and select **Key vaults**.

1. Select **Create**.

1. On the **Basics** tab of the **Create a key vault** page, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Subscription** | Select the subscription that also contains your Arc-enabled Kubernetes cluster. |
   | **Resource group** | Select the resource group that also contains your Arc-enabled Kubernetes cluster. |
   | **Key vault name** | Provide a globally unique name for your key vault. |
   | **Region** | Select a region close to you. |
   | **Pricing tier** | The default **Standard** tier is suitable for this scenario. |

1. Select **Next**.

1. On the **Access configuration** tab, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Permission model** | Select **Vault access policy**. |

1. Select **Review + create**.

1. Select **Create**.

1. Wait for your resource to be created, and then navigate to your new key vault.

1. Select **Secrets** from the **Objects** section of the Key Vault menu.

1. Select **Generate/Import**.

1. On the **Create a secret** page, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Name** | Call your secret `PlaceholderSecret`. |
   | **Secret value** | Provide any value for your secret. |

1. Select **Create**.

### Create a service principal

Create a service principal that the secrets store in Azure IoT Operations will use to authenticate to your key vault.

First, register an application with Microsoft Entra ID.

1. In the Azure portal search bar, search for and select **Microsoft Entra ID**.

1. Select **App registrations** from the **Manage** section of the Microsoft Entra ID menu.

1. Select **New registration**.

1. On the **Register an application** page, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Name** | Provide a name for your application. |
   | **Supported account types** | Ensure that **Accounts in this organizational directory only (<YOUR_TENANT_NAME> only - Single tenant)** is selected. |
   | **Redirect URI** | Select **Web** as the platform. You can leave the web address empty. |

1. Select **Register**.

   When your application is created, you are directed to its resource page.

1. Copy the **Application (client) ID** from the app registration overview page. You'll use this value in the next section.

Next, give your application permissions for your key vault.

1. On the resource page for your app, select **API permissions** from the **Manage** section of the app menu.

1. Select **Add a permission**.

1. On the **Request API permissions** page, scroll down and select **Azure Key Vault**.

1. Select **Delegated permissions**.

1. Check the box to select **user_impersonation** permissions.

1. Select **Add permissions**.

Create a client secret that will be added to your Kubernetes cluster to authenticate to your key vault.

1. On the resource page for your app, select **Certificates & secrets** from the **Manage** section of the app menu.

1. Select **New client secret**.

1. Provide an optional description for the secret, then select **Add**.

1. Copy the **Value** and **Secret ID** from your new secret. You'll use these values later in the scenario.

Finally, return to your key vault to grant an access policy for the service principal.

1. In the Azure portal, navigate to the key vault that you created in the previous section.

1. Select **Access policies** from the key vault menu.

1. Select **Create**.

1. On the **Permissions** tab of the **Create an access policy** page, scroll to the **Secret permissions** section. Select the **Get** and **List** permissions.

1. Select **Next**.

1. On the **Principal** tab, search for and select the name or ID of the app that you registered at the beginning of this section.

1. Select **Next**.

1. On the **Application (optional)** tab, there's no action to take. Select **Next**.

1. Select **Create**.

### Run the cluster setup script

Now that your Azure resources and permissions are configured, you need to add this information to the Kubernetes cluster where you're going to deploy Azure IoT Operations. We've provided a setup script that runs these steps for you.

1. Download or copy the [setup-cluster.sh](https://github.com/Azure/azure-iot-operations/blob/main/tools/setup-cluster/setup-cluster.sh) and save the file locally.

1. Open the file in the text editor of your choice and update the following variables:

   | Variable | Value |
   | -------- | ----- |
   | **Subscription** | Your Azure subscription ID. |
   | **RESOURCE_GROUP** | The resource group where your Arc-enabled cluster is located. |
   | **CLUSTER_NAME** | The name of your Arc-enabled cluster. |
   | **TENANT_ID** | Your Azure directory ID. You can find this value in the Azure portal settings page. |
   | **AKV_SP_CLIENTID** | The client ID or the app registration that you copied in the previous section. |
   | **AKV_SP_CLIENTSECRET** | The client secret value that you copied in the previous section. |
   | **AKV_NAME** | The name of your key vault. |
   | **PLACEHOLDER_SECRET** | (Optional) If you named your secret something other than `PlaceholderSecret`, replace the default value of this parameter. |

   >[!WARNING]
   >Do not change the names or namespaces of the **SecretProviderClass** objects.

1. Save your changes to `setup-cluster.sh`.

1. Open your preferred terminal application and run the script:

   * Bash:

   ```bash
   <FILE_PATH>/setup-cluster.sh
   ```

   * PowerShell:

   ```powershell
   bash <FILE_PATH>\setup-cluster.sh
   ```

## Add a secret to an Azure IoT Operations component

Once you have the secret store set up on your cluster, you can create and add Azure Key Vault secrets.

1. Create your secret in Key Vault with whatever name and value you need. You can create a secret by using the [Azure portal](https://portal.azure.com) or the [az keyvault secret set](/cli/azure/keyvault/secret#az-keyvault-secret-set) command.

1. On your cluster, identify the secret provider class (SPC) for the component that you want to add the secret to. For example, `aio-default-spc`.

1. Open the file in your preferred text editor. If you use k9s, type `e` to edit.

1. Add the secret object to the list under `spec.parameters.objects.array`. For example:

   ```yml
   spec:
     parameters:
       keyvaultName: my-key-vault
       objects: |
         array:
           - |
             objectName: PlaceholderSecret
             objectType: secret
             objectVersion: ""
   ```

1. Save your changes and apply them to your cluster. If you use k9s, your changes are automatically applied.

The CSI driver updates secrets according to a polling interval, so a new secret won't be updated on the pods until the next polling interval. If you want the secrets to be updated immediately, update the pods for that component. For example, for the Azure IoT Data Processor component, update the `aio-dp-reader-worker-0` and `aio-dp-runner-worker-0` pods.

### Azure IoT MQ

The steps to manage secrets with Azure Key Vault for Azure IoT MQ are different. For more information, see [Manage Azure IoT MQ secrets using Azure Key Vault](../manage-mqtt-connectivity/howto-manage-secrets.md).
