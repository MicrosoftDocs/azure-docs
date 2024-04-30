---
 title: include file
 description: include file
 author: kgremban
 ms.topic: include
 ms.date: 03/20/2024
 ms.author: kgremban
ms.custom:
  - include file
  - ignite-2023
---

Use GitHub Codespaces to try Azure IoT Operations on a Kubernetes cluster without installing anything on your local machine. The **Azure-Samples/explore-iot-operations** codespace is preconfigured with:

- [K3s](https://k3s.io/) running in [K3d](https://k3d.io/) for a lightweight Kubernetes cluster
- [Azure CLI](/cli/azure/install-azure-cli)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/) for managing Kubernetes resources
- Other useful tools like [Helm](https://helm.sh/) and [k9s](https://k9scli.io/)

> [!IMPORTANT]
> Codespaces are easy to set up quickly and tear down later, but they're not suitable for performance evaluation or scale testing. Use GitHub Codespaces for exploration only.

To get started with your codespace:

1. Create a codespace in GitHub Codespaces.

   [![Create an explore-iot-operations codespace](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/explore-iot-operations?quickstart=1)

   You don't have to provide the recommended secrets at this step. If you do, they get saved on your GitHub account to be used in this and future codespaces. They're also added as environment variables in the codespace terminal, and you don't have to run the CLI commands in the next section that configure the subscription, resource group, or location variables.

   | Parameter | Value |
   | --------- | ----- |
   | SUBSCRIPTION_ID | Your Azure subscription ID. |
   | RESOURCE_GROUP | A name for a new Azure resource group where your cluster will be created. |
   | LOCATION | An Azure region close to you. The following regions are supported in public preview: eastus, eastus2, westus, westus2, westus3, westeurope, or northeurope. |

1. Select **Create new codespace**.

1. Once the codespace is ready, select the menu button at the top left, then select **Open in VS Code Desktop**.

   ![Open VS Code desktop](media/prepare-codespaces/open-in-vs-code-desktop.png)

1. If prompted, install the **GitHub Codespaces** extension for Visual Studio Code and sign in to GitHub.

1. In Visual Studio Code, select **View** > **Terminal**.

   Use this terminal to run all of the command line and CLI commands for managing your cluster.