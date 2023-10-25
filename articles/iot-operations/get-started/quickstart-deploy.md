---
title: "Quickstart: Deploy Azure IoT Operations"
description: "Quickstart: Use Azure IoT Orchestrator to deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster."
author: kgremban
ms.author: kgremban
ms.topic: quickstart
ms.date: 10/10/2023

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you will deploy a suite of IoT services to an Azure Arc-enabled Kubernetes cluster so that you can remotely manage your devices and workloads. Azure IoT Operations Preview – enabled by Azure Arc is a digital operations suite of services that includes Azure IoT Orchestrator. This quickstart guides you through using Orchestrator to deploy these services to a Kuberentes cluster. At the end of the quickstart, you'll have a cluster that you can manage from the cloud that's generating sample telemetry data to use in the following quickstarts.

The services deployed in this quickstart include:

* [Azure IoT Orchestrator](../deploy/overview-deploy-iot-operations.md)
* [Azure IoT MQ](../pub-sub-mqtt/overview-iot-mq.md)
* [Azure IoT Data Processor](../process-data/overview-data-processor.md) with a demo pipeline to start routing the simulated data
* [Azure IoT Akri](../manage-devices-assets/concept-akri-overview.md)
* [Azure Device Registry](../manage-devices-assets/overview-manage-assets.md#manage-assets-as-azure-resources-in-a-centralized-registry)
* [Azure IoT Layered Network Management](../administer/concept-layered-network-management.md)
* A simulated thermostat asset to start generating data

<!--* [Observability](/docs/observability/)-->
<!-- * [Azure IoT OPC UA broker](../manage-devices-assets/concept-opcua-broker-overview.md) with simulated thermostat asset to start generating data -->

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An Azure Arc-enabled Kubernetes cluster. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy/howto-prepare-cluster.md?tabs=wsl-ubuntu). Using Ubuntu in Windows Subsystem for Linux (WSL) is the simplest way to get a Kubernetes cluster for testing.

  Azure IoT Operations should work on any CNCF-conformant kubernetes cluster. Currently, Microsoft only supports K3s on Ubuntu Linux and WSL, or AKS Edge Essentials on Windows.

## What problem will we solve?

Azure IoT Operations is a suite of data services that run on Arc-enabled Kubernetes clusters, and those services need to be managed remotely. Orchestrator is the service that helps you define, deploy, and manage these application workloads.

## Configure secrets and certificates

Azure IoT Operations supports Azure Key Vault for storing secrets and certificates. In this section, you create a key vault, set up a service principal to give access to the key vault, and configure the secrets that you need for the rest of this quickstart.

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

   When your application is created, you are directed to its resource page.

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

1. Copy the **Value** and **Secret ID** from your new secret. You'll use these values later in the quickstart.

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

1. Download or copy the [setup-cluster.sh](https://github.com/Azure/azure-iot-operations/blob/main/tools/setup-cluster/setup-cluster.sh) and save the file locally.

1. Open the file in the text editor of your choice and update the following variables:

   | Variable | Value |
   | -------- | ----- |
   | **Subscription** | Your Azure subscription ID. |
   | **RESOURCE_GROUP** | The resource group where your Arc-enabled cluster is located. |
   | **CLUSTER_NAME** | The name of your Arc-enabled cluster. |
   | **TENANT_ID** | Your Azure directory ID. You can find this value in the Azure portal settings page. |
   | **AKV_SP_CLIENTID** | The client secret ID that you copied in the previous section. |
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
   bash <FILE_PATH>\setup-cluster.sh
   ```

   ---

## Deploy Azure IoT Operations

Use the Azure portal to deploy Azure IoT Operations components to your Arc-enabled Kubernetes cluster.

## How did we solve the problem?

In this quickstart, you configured your Arc-enabled Kubernetes cluster so that it could communicate securely with your Azure IoT Operations components. Then, you deployed those components to your cluster. For this test scenario, you have a single Kubernetes cluster that's probably running locally on your machine. In a production scenario, however, you can use the same steps to deploy workloads to many clusters across many sites.

## Clean up resources

If you're not going to continue to use this deployment, delete the Kubernetes cluster that you deployed Azure IoT Operations to and remove the Azure resource group that contains the cluster.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Add OPC UA assets to your Azure IoT Operations cluster](quickstart-add-assets.md)
