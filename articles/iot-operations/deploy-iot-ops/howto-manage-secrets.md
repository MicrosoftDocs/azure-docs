---
title: Manage secrets 
description: Create, update, and manage secrets that are required to give your Arc-connected cluster access to Azure resources.
author: kgremban
ms.author: kgremban
ms.subservice: orchestrator
ms.topic: how-to
ms.date: 03/21/2024
ms.custom: ignite-2023, devx-track-azurecli

#CustomerIntent: As an IT professional, I want prepare an Azure-Arc enabled Kubernetes cluster with Key Vault secrets so that I can deploy Azure IoT Operations to it.
---

# Manage secrets for your Azure IoT Operations Preview deployment

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Secrets management in Azure IoT Operations Preview uses Azure Key Vault as the managed vault solution on the cloud and uses the secrets store CSI driver to pull secrets down from the cloud and store them on the edge.

## Prerequisites

* An Arc-enabled Kubernetes cluster. For more information, see [Prepare your cluster](./howto-prepare-cluster.md).

## Configure a secret store on your cluster

Azure IoT Operations supports Key Vault for storing secrets and certificates. The `az iot ops init` Azure CLI command automates the steps to set up a service principal to give access to the key vault and configure the secrets that you need for running Azure IoT Operations.

For more information, see [Deploy Azure IoT Operations Preview extensions to a Kubernetes cluster](../deploy-iot-ops/howto-deploy-iot-operations.md?tabs=cli).

## Configure service principal and Key Vault manually

If the Azure account executing the `az iot ops init` command doesn't have permissions to query the Microsoft Graph and create service principals, you can prepare these upfront and use extra arguments when running the CLI command as described in [Deploy Azure IoT Operations extensions](./howto-deploy-iot-operations.md?tabs=cli).

### Configure service principal for interacting with Key Vault via Microsoft Entra ID

Follow these steps to create a new Application Registration for the Azure IoT Operations application to use to authenticate to Key Vault.

First, register an application with Microsoft Entra ID:

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

   When your application is created, you're directed to its resource page.

1. Copy the **Application (client) ID** from the app registration overview page. You'll use this value as an argument when running Azure IoT Operations deployment with the `az iot ops init` command.

Next, give your application permissions for Key Vault:

1. On the resource page for your app, select **API permissions** from the **Manage** section of the app menu.

1. Select **Add a permission**.

1. On the **Request API permissions** page, scroll down and select **Azure Key Vault**.

1. Select **Delegated permissions**.

1. Check the box to select **user_impersonation** permissions.

1. Select **Add permissions**.

Create a client secret that is added to your Kubernetes cluster to authenticate to your key vault:

1. On the resource page for your app, select **Certificates & secrets** from the **Manage** section of the app menu.

1. Select **New client secret**.

1. Provide an optional description for the secret, then select **Add**.

1. Copy the **Value** from your new secret. You'll use this value later when you run `az iot ops init`.

Retrieve the service principal Object ID:

1. On the **Overview** page for your app, under the **Essentials** section, select the **Application name** link under **Managed application in local directory**. This opens the Enterprise Application properties. Copy the Object ID to use when you run `az iot ops init`.

### Create a key vault

Create a new Azure Key Vault instance and ensure that it has the **Permission Model** set to **Vault access policy**.

```bash
az keyvault create --enable-rbac-authorization false --name "<your unique key vault name>" --resource-group "<the name of the resource group>"
```
If you have an existing key vault, you can change the permission model by executing the following:

```bash
az keyvault update --name "<your unique key vault name>" --resource-group "<the name of the resource group>" --enable-rbac-authorization false 
```
You'll need the Key Vault resource ID when you run `az iot ops init`. To retrieve the resource ID, run:

```bash
az keyvault show --name "<your unique key vault name>" --resource-group "<the name of the resource group>" --query id  -o tsv
```

### Set service principal access policy in Key Vault

The newly created service principal needs **secret** `list` and `get` access policy for the Azure IoT Operations to work with the secret store. 

To manage Key Vault access policies, the principal logged in to the CLI needs sufficient Azure permissions. In the Role Based Access Control (RBAC) model, this permission is included in Key Vault contributor or higher roles.

>[!TIP]
>If you used the logged-in CLI principal to create the key vault, then you probably already have the right permissions. However, if you're pointing to a different or existing key vault then you should check that you have sufficient permissions to set access policies.

Run the following to assign **secret** `list` and `get` permissions to the service principal.

```bash
az keyvault set-policy --name "<your unique key vault name>" --resource-group "<the name of the resource group>" --object-id <Object ID copied from Enterprise Application SP in Microsoft Entra ID> --secret-permissions get list
```

### Pass service principal and Key Vault arguments to Azure IoT Operations deployment

When following the guide [Deploy Azure IoT Operations extensions](./howto-deploy-iot-operations.md?tabs=cli), pass in additional flags to the `az iot ops init` command in order to use the preconfigured service principal and key vault.

The following example shows how to prepare the cluster for Azure IoT Operations without fully deploying it by using `--no-deploy` flag. You can also run the command without this argument for a default Azure IoT Operations deployment.

```bash
az iot ops init --name "<your unique key vault name>" --resource-group "<the name of the resource group>" \
    --kv-id <Key Vault Resource ID> \
    --sp-app-id <Application registration App ID (client ID) from Microsoft Entra ID> \
    --sp-object-id <Object ID copied from Enterprise Application in Microsoft Entra ID> \
    --sp-secret "<Client Secret from App registration in Microsoft Entra ID>" \
    --no-deploy
```

One step that the `init` command takes is to ensure all Secret Provider Classes (SPCs) required by Azure IoT Operations have a default secret configured in key vault. If a value for the default secret does not exist `init` will create one. This step requires that the principal logged in to the CLI has secret `set` permissions. If you want to use an existing secret as the default SPC secret, you can specify it with the `--kv-sat-secret-name` parameter, in which case the logged in principal only needs secret `get` permissions.

## Add a secret to an Azure IoT Operations component

Once you have the secret store set up on your cluster, you can create and add Key Vault secrets.

1. Create your secret in Key Vault with whatever name and value you need. You can create a secret by using the [Azure portal](https://portal.azure.com) or the [az keyvault secret set](/cli/azure/keyvault/secret#az-keyvault-secret-set) command.

1. On your cluster, identify the secret provider class (SPC) for the component that you want to add the secret to. For example, `aio-default-spc`. Use the following command to list all SPCs on your cluster:

   ```bash
   kubectl get secretproviderclasses -A
   ```

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

The CSI driver updates secrets by using a polling interval, therefore the new secret isn't available to the pod until the next polling interval. To update a component immediately, restart the pods for the component. For example, to restart the Data Processor component, run the following commands:

```console
kubectl delete pod aio-dp-reader-worker-0 -n azure-iot-operations
kubectl delete pod aio-dp-runner-worker-0 -n azure-iot-operations
```

## Azure IoT MQ Preview secrets

The steps to manage secrets with Azure Key Vault for Azure IoT MQ Preview are different. For more information, see [Manage MQ secrets using Key Vault](../manage-mqtt-connectivity/howto-manage-secrets.md).
