---
title: Prepare your Kubernetes cluster
description: Prepare an Azure Arc-enabled Kubernetes cluster before you deploy Azure IoT Operations. This article includes guidance for both Ubuntu and Windows machines.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 10/30/2023

#CustomerIntent: As an IT professional, I want prepare an Azure-Arc enabled Kubernetes cluster so that I can deploy Azure IoT Operations to it.
---

# Prepare your Azure Arc-enabled Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

An Azure Arc-enabled Kubernetes cluster is a prerequisite for deploying Azure IoT Operations Preview. This article describes how to prepare an Azure Arc-enabled Kubernetes cluster before you deploy Azure IoT Operations. This article includes guidance for both Ubuntu and Windows environments.

[!INCLUDE [validated-environments](../includes/validated-environments.md)]

This article also includes guidance for setting up an environment by using WSL on your Windows machine. Use WSL for testing and development purposes only.

## Prerequisites

To prepare your Azure Arc-enabled Kubernetes cluster, you need:

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- At least **Contributor** role permissions in your subscription plus the **Microsoft.Authorization/roleAssignments/write** permission.
- [Azure CLI version 2.38.0 or newer installed](/cli/azure/install-azure-cli) on your development machine.
- Hardware that meets the [system requirements](/azure/azure-arc/kubernetes/system-requirements).

## Arc-enable your cluster

# [Ubuntu](#tab/ubuntu)

[!INCLUDE [prepare-ubuntu](../includes/prepare-ubuntu.md)]

# [WSL Ubuntu](#tab/wsl-ubuntu)

You can run Ubuntu in Windows Subsystem for Linux (WSL) on your Windows machine. Use WSL for testing and development purposes only.

>[!IMPORTANT]
>Run all of these steps in your WSL environment, including the Azure CLI steps for configuring your cluster.

To set up your WSL Ubuntu environment:

1. [Install Linux on Windows with WSL](/windows/wsl/install).

1. Enable `systemd`:

    ```bash
    sudo -e /etc/wsl.conf
    ```

    Add the following to _wsl.conf_ and then save the file:

    ```text
    [boot]
    systemd=true
    ```

1. After you enable `systemd`, [re-enable running windows executables from WSL](https://github.com/microsoft/WSL/issues/8843):

    ```bash
    sudo sh -c 'echo :WSLInterop:M::MZ::/init:PF > /usr/lib/binfmt.d/WSLInterop.conf'
    sudo systemctl unmask systemd-binfmt.service
    sudo systemctl restart systemd-binfmt
    sudo systemctl mask systemd-binfmt.service
    ```

[!INCLUDE [prepare-ubuntu](../includes/prepare-ubuntu.md)]

# [AKS Edge Essentials](#tab/aks-edge-essentials)

[!INCLUDE [prepare-aks-ee](../includes/prepare-aks-ee.md)]

---

## Verify your cluster

To verify that your Kubernetes cluster is now Azure Arc-enabled, run the following command:

```bash/powershell
kubectl get deployments,pods -n azure-arc
```

The output looks like the following example:

```text
NAME                                         READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/clusterconnect-agent         1/1     1            1           10m
deployment.apps/extension-manager            1/1     1            1           10m
deployment.apps/clusteridentityoperator      1/1     1            1           10m
deployment.apps/controller-manager           1/1     1            1           10m
deployment.apps/flux-logs-agent              1/1     1            1           10m
deployment.apps/cluster-metadata-operator    1/1     1            1           10m
deployment.apps/extension-events-collector   1/1     1            1           10m
deployment.apps/config-agent                 1/1     1            1           10m
deployment.apps/kube-aad-proxy               1/1     1            1           10m
deployment.apps/resource-sync-agent          1/1     1            1           10m
deployment.apps/metrics-agent                1/1     1            1           10m

NAME                                              READY   STATUS    RESTARTS        AGE
pod/clusterconnect-agent-5948cdfb4c-vzfst         3/3     Running   0               10m
pod/extension-manager-65b8f7f4cb-tp7pp            3/3     Running   0               10m
pod/clusteridentityoperator-6d64fdb886-p5m25      2/2     Running   0               10m
pod/controller-manager-567c9647db-qkprs           2/2     Running   0               10m
pod/flux-logs-agent-7bf6f4bf8c-mr5df              1/1     Running   0               10m
pod/cluster-metadata-operator-7cc4c554d4-nck9z    2/2     Running   0               10m
pod/extension-events-collector-58dfb78cb5-vxbzq   2/2     Running   0               10m
pod/config-agent-7579f558d9-5jnwq                 2/2     Running   0               10m
pod/kube-aad-proxy-56d9f754d8-9gthm               2/2     Running   0               10m
pod/resource-sync-agent-769bb66b79-z9n46          2/2     Running   0               10m
pod/metrics-agent-6588f97dc-455j8                 2/2     Running   0               10m
```

## Configure a secrets store on your cluster

Azure IoT Operations supports Azure Key Vault for storing secrets and certificates. In this section, you create a key vault and set up a service principal to give your cluster access to the key vault. Whenever you create a pipeline or process that connects to Azure resources, you need to create a secret. This section covers the steps to set up a secrets provider class on your cluster.

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
   | **Region** | Select a region close to you. The following regions are supported in public preview: East US, East US 2, West US, West US 2, West US 3, West Europe, North Europe. |
   | **Pricing tier** | The default **Standard** tier is suitable for this quickstart. |

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

   >[!TIP]
   >This secret is just a placeholder secret to use while configuring your cluster. It's not going to be used for any resources in this quickstart scenario.

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
   | **Name** | Call your application `AIO-app`. |
   | **Supported account types** | Ensure that **Accounts in this organizational directory only (<YOUR_TENANT_NAME> only - Single tenant)** is selected. |
   | **Redirect URI** | Select **Web** as the platform. You can leave the web address empty. |

1. Select **Register**.

   When your application is created, you're directed to its resource page.

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

1. Copy the **Value** from your new secret. You use this value later in the quickstart.

   >[!IMPORTANT]
   >Once you leave this page, you won't be able to view the value of the secret again.

Finally, return to your key vault to grant an access policy for the service principal.

1. In the Azure portal, navigate to the key vault that you created in the previous section.

1. Select **Access policies** from the key vault menu.

1. Select **Create**.

1. On the **Permissions** tab of the **Create an access policy** page, scroll to the **Secret permissions** section. Select the **Get** and **List** permissions.

1. Select **Next**.

1. On the **Principal** tab, search for and select the app that you registered at the beginning of this section, `AIO-app`.

1. Select **Next**.

1. On the **Application (optional)** tab, there's no action to take. Select **Next**.

1. Select **Create**.

### Run the cluster setup script

Now that your Azure resources and permissions are configured, you need to add this information to the Kubernetes cluster where you're going to deploy Azure IoT Operations. We've provided a setup script that runs these steps for you.

1. Download or copy the [setup-cluster.sh](https://github.com/Azure/azure-iot-operations/blob/main/tools/setup-cluster/setup-cluster.sh) file and save it locally.

1. Open the file in the text editor of your choice and update the following variables:

   | Variable | Value |
   | -------- | ----- |
   | **SUBSCRIPTION** | Your Azure subscription ID. |
   | **RESOURCE_GROUP** | The resource group where your Arc-enabled cluster is located. |
   | **CLUSTER_NAME** | The name of your Arc-enabled cluster. |
   | **TENANT_ID** | Your Azure directory ID. You can find this value on the **Overview** page of most Azure resources in the Azure portal or on the Azure portal settings page. |
   | **AKV_SP_CLIENTID** | The client ID of the app registration that you created in the previous section. You can find this value on the **Overview** page of your application. |
   | **AKV_SP_CLIENTSECRET** | The client secret value that you copied in the previous section. |
   | **AKV_NAME** | The name of your key vault. |
   | **PLACEHOLDER_SECRET** | (Optional) If you named your secret something other than `PlaceholderSecret`, replace the default value of this parameter. |

   >[!WARNING]
   >Do not change the names or namespaces of the **SecretProviderClass** objects.

1. Save your changes to `setup-cluster.sh`.

1. Open your preferred terminal application and run the script.

   #### [Bash](#tab/bash)

   ```bash
   <FILE_PATH>/setup-cluster.sh
   ```

   #### [PowerShell](#tab/powershell)

   ```powershell
   bash <FILE_PATH>/setup-cluster.sh
   ```

   ---

## Next steps

Now that you have an Azure Arc-enabled Kubernetes cluster, you can [deploy Azure IoT Operations](../get-started/quickstart-deploy.md).
