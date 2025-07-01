---
title: How to deploy a CycleCloud Workspace for Slurm environment using the CLI
description: How to deploy a CycleCloud Workspace for Slurm environment using the Azure CLI and the Azure portal UI Sandbox
author: xpillons
ms.date: 07/01/2025
ms.author: padmalathas
---

# How to deploy a CycleCloud Workspace for Slurm environment using the CLI

Prerequisites: Install the Azure CLI and Git, and then sign in or set your Azure subscription.
> [!IMPORTANT]
> Run the following command from a Linux shell where Azure CLI is installed and authenticated with the Azure account designated for deployment. Azure Cloud Shell isn't supported for this scenario.

1. Clone the Azure CycleCloud Workspace for Slurm on the latest stable release

```bash
git clone --depth 1 https://github.com/azure/cyclecloud-slurm-workspace.git
```

1. Copy the content of the UI definition file `./uidefinitions/createUiDefinition.json`

1. Browse to the UI Definition Sandbox:
    - For Azure Public Cloud [Azure Public portal](https://portal.azure.com/#view/Microsoft_Azure_CreateUIDef/SandboxBlade)
    - For Azure US Gov [Azure US Gov portal](https://portal.azure.us/#view/Microsoft_Azure_CreateUIDef/SandboxBlade)

- Paste the content of the UI Definition file into the multiline text box on the right,
- Select `Preview >>` in the bottom-left corner to bring up a UI experience. 
- Go through each page of the UI flow to make sure that necessary values appear in the output payload described in the next step,
- Go through the UI flow to the `Review + create` page and then select the link labeled `View outputs payload` to the right of the `Create` button to generate a pane with JSON-formatted text in its body on the right-hand side of the browser window,
- Copy the JSON-formatted text into a local JSON file, 
- Save it as `parameters.json` and note the path to it. This file is the Parameters File for the deployment,
- Open the shell of your choice and go to the folder or directory that contains the `cyclecloud-slurm-workspace` repository you cloned earlier,
- Accept the terms of the Cycle image plan:

```bash
az vm image terms accept --urn azurecyclecloud:azure-cyclecloud:cyclecloud8-gen2:latest
```
- Run the following deployment command in a shell. Substitute values for fields in square brackets (be sure to delete the brackets). The current directory is as described in the previous step.

```bash
az deployment sub create --template-file ./cyclecloud-slurm-workspace/bicep/mainTemplate.bicep --parameters parameters.json --location [ANY AZURE LOCATION E.G. eastus] --name [OPTIONAL BUT HELPFUL, DELETE IF UNUSED] 
```

- Wait until the shell indicates that the deployment was successful. You can also track the progress of the deployment in the Azure portal. Go to the resource group shown in the UI, select **Deployments** from the Settings menu, and check the status of the deployment name that begins with "pid-" at the bottom of the displayed list.

## Resources

* [Configure Open OnDemand with CycleCloud](./configure-open-ondemand.md)
* [Add users for Open OnDemand](./open-ondemand-add-users.md)
* [How to connect to the CycleCloud portal through Bastion](/azure/cyclecloud/how-to/ccws/connect-to-portal-with-bastion)
* [How to connect to a Login Node through Bastion](/azure/cyclecloud/how-to/ccws/connect-to-login-node-with-bastion)
