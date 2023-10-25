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
* [Azure IoT OPC UA broker](../manage-devices-assets/concept-opcua-broker-overview.md) with simulated thermostat asset to start generating data
* [Azure IoT Data Processor](../process-data/overview-data-processor.md) with a demo pipeline to start routing the simulated data
* [Azure IoT Akri](../manage-devices-assets/concept-akri-overview.md)
* [Azure Device Registry](../manage-devices-assets/overview-manage-assets.md#manage-assets-as-azure-resources-in-a-centralized-registry)
* [Azure IoT Layered Network Management](../administer/concept-layered-network-management.md)
<!--* [Observability](/docs/observability/)-->


## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An Azure Arc-enabled Kubernetes cluster. If you don't have one, follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy/howto-prepare-cluster.md?tabs=wsl-ubuntu). Using Ubuntu in Windows Subsystem for Linux (WSL) is the simplest way to get a Kubernetes cluster for testing.

  Azure IoT Operations should work on any CNCF-conformant kubernetes cluster. Currently, Microsoft only supports K3s on Ubuntu Linux and WSL, or AKS Edge Essentials on Windows.


<!-- 6. Open Azure Cloud Shell ------------------------------------------------------------------------------
If you want to refer to using the Cloud Shell, place the instructions after the
Prerequisites to keep the prerequisites as the first H2.

However, only include the Cloud Shell if ALL commands can be run in the cloud shell.


## Open Azure Cloud Shell
TODO: add your instructions
--->

<!-- Use this exact H2 -->
## What problem will we solve?
TODO: Write a brief description of the problem and how the product or service solves that problem. Include one or more diagrams when appropriate to show the solution architecture and/or the dataflow.

<!-- 

Present the demonstration in a series of H2s.

Each H2 should describe either what they'll do in the step or which part of the problem the step solves.

* Each H2 should be a major step in the demonstration
* The H2 title should describe either what they'll do in the step or which part of the problem the step solves
* Phrase each H2 title as "<verb> * <noun>".
* Don't start with a gerund.
* Don't number the H2s.
* Begin each H2 with a brief explanation for context
* Provide a numbered list of procedural steps as applicable
* Provide a code block, diagram, or screenshot if appropriate
* An image, code block, or other graphical element comes after numbered step it illustrates.

-->

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
   | **Name** | Call your secret `AIOSecret`. |
   | **Secret value** | Provide any value for your secret. |

1. Select **Create**.

### Create a service principal

Create a service principal that the secrets store in Azure IoT Operations will use to authenticate to your key vault.

1. In the Azure portal search bar, search for and select **Microsoft Entra ID**.

1. Select **App registrations** from the **Manage** section of the Microsoft Entra ID menu.

1. Select **New registration**.

1. On the **Register an application** page, provide the following information:

   | Field | Value |
   | ----- | ----- |
   | **Name** | Call your application `AIO-app`. |
   | **Supported account types** | Ensure that **Accounts in this organizational directory only (<YOUR_TENANT_NAME> only - Single tenant)** is selected. |
   | **Redirect URL** | Select **Web** as the platform. |
   <!-- TODO: Web address value? -->

1. Select **Register**.

   When your application is created, you are directed to its resource page.

1. Select **API permissions** from the **Manage** section of the app menu.

1. Select **Add a permission**.

1. On the **Request API permissions** page, scroll down and select **Azure Key Vault**.

1. Select **Delegated permissions**.

1. Check the box to select **user_impersonation** permissions.

1. Select **Add permissions**.







<!-- Use this exact H2 -->
## How did we solve the problem?
TODO: End the demonstration with a few paragraphs of analysis to make it clear that the product or service was a good choice to solve the customer problem.

<!-- 8. Clean up resources ------------------------------------------------------------------------

Required: To avoid any costs associated with following the Quickstart procedure, a Clean up resources (H2) should come just before Next step or Related content (H2)

If there is a follow-on Quickstart that uses the same resources, make that option clear so that a reader doesn't need to recreate those resources. 

-->

<!-- Use this exact H2 -->
## Clean up resources

If you're not going to continue to use this application, delete \<resources\> with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!-- 9. Next step/Related content ------------------------------------------------------------------------ 

Optional: You have two options for manually curated links in this pattern: Next step and Related content. You don't have to use either, but don't use both.
  - For Next step, provide one link to the next step in a sequence. Use the blue box format
  - For Related content provide 1-3 links. Include some context so the customer can determine why they would click the link. Add a context sentence for the following links.

-->

## Next step

Continue to the next quickstart, [Add OPC UA assets to your Azure IoT Operations cluster](quickstart-add-assets.md)
