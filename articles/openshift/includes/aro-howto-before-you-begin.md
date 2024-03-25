---
author: sabbour
ms.author: asabbour
ms.date: 5/31/2022
---

### Create a cluster

Follow the tutorial to [create an Azure Red Hat OpenShift cluster](../tutorial-create-cluster.md). If you choose to install and use the *command-line interface* (CLI) locally, this tutorial requires you to use Azure CLI version 2.6.0 or later. Run `az --version` to find your current version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

### Connect to the cluster

To manage an Azure Red Hat OpenShift cluster, you need to use [oc](https://docs.openshift.com/container-platform/4.7/cli_reference/openshift_cli/getting-started-cli.html), the OpenShift command-line client.

> [!NOTE]
> We recommend that you [install OpenShift command line](../tutorial-connect-cluster.md) on [Azure Cloud Shell](https://shell.azure.com/) and that you use it for all of the command-line operations in this article. Open your shell from shell.azure.com or select the link:
>
> [![Button to launch Azure Cloud Shell](~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png)](https://shell.azure.com/bash)

Follow the tutorial to install your CLI, to retrieve your cluster credentials and to [connect to the cluster](../tutorial-connect-cluster.md) with the web console and the OpenShift CLI.

Once you're logged in, you should see a message saying you're using the `default` project.

```output
Login successful.

You have access to 61 projects, the list has been suppressed. You can list all projects with 'oc projects'

Using project "default".
```