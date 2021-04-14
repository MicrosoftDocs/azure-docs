---
author: sabbour
ms.author: asabbour
ms.date: 4/5/2020
---

### Create the cluster

Follow the tutorial to [create an Azure Red Hat OpenShift cluster](../tutorial-create-cluster.md). If you choose to install and use the CLI locally, this tutorial requires that you're running the Azure CLI version 2.6.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

### Connect to the cluster

To manage an Azure Red Hat OpenShift cluster, you use [oc](https://docs.openshift.com/container-platform/4.7/cli_reference/openshift_cli/getting-started-cli.html), the OpenShift command-line client.

> [!NOTE]
> We recommend you [install the OpenShift command line](../tutorial-connect-cluster.md) on [Azure Cloud Shell](https://shell.azure.com/) and using it for all command-line operations below. Launch your shell from shell.azure.com or by clicking the link:
>
> [![Embed launch](https://docs.microsoft.com/azure/includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png "Launch Azure Cloud Shell")](https://shell.azure.com/bash)

Follow the tutorial to install the CLI, retrieve the cluster credentials and [connect to the cluster](../tutorial-connect-cluster.md) using the web console and the OpenShift CLI.

Once you're logged in, you should see a message saying you're using the `default` project.

```output
Login successful.

You have access to 61 projects, the list has been suppressed. You can list all projects with 'oc projects'

Using project "default".
```
