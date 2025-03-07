---
title: How to deploy a CycleCloud Workspace for Slurm environment using the CLI
description: How to deploy a CycleCloud Workspace for Slurm environment using the Azure CLI and the Azure Portal UI Sandbox
author: xpillons
ms.date: 01/29/2025
ms.author: xpillons
---

# How to deploy a CycleCloud Workspace for Slurm environment using the CLI

Prerequisites: Users will need to install the Azure CLI and Git. They will then need to sign into or set their Azure subscription.

- Clone the Azure CycleCloud Workspace for Slurm on the latest stable release

```bash
latest=$(curl -s https://api.github.com/repos/azure/cyclecloud-slurm-workspace/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')
echo "cloning on $latest"
git clone --depth 1 --branch $latest https://github.com/azure/cyclecloud-slurm-workspace.git
```

- Copy the content of the UI definition file `./uidefinitions/createUiDefinition.json`

- Browse to the UI Definition Sandbox:
    - For Azure Public Cloud [Azure Public Portal](https://portal.azure.com/#view/Microsoft_Azure_CreateUIDef/SandboxBlade)
    - For Azure US Gov [Azure US Gov Portal](https://portal.azure.us/#view/Microsoft_Azure_CreateUIDef/SandboxBlade)

- Paste the content of the UI Definition file into the multiline text box in the right,
- Click `Preview >>` in the bottom-left corner. This will bring up a UI experience. 
- Proceed through each page of the UI flow to ensure that necessary values populate in the output payload described in the next step,
- Proceed with the UI flow to the `Review + create` page and then click the link labeled `View outputs payload` adjacent to the `Create` button. This will generate a pane with JSON-formatted text in its body on the right-hand side of the browser window,
- Copy the JSON-formatted text into a local JSON file, 
- Save it as `parameters.json` and make note of the path to it. This is what we call the Parameters File for the deployment,
- Open the shell of choice and navigate to the folder/directory that contains the `cyclecloud-slurm-workspace` repository cloned above,
- Accept the terms of the Cycle image plan:  

```bash
az vm image terms accept --urn azurecyclecloud:azure-cyclecloud:cyclecloud8-gen2:latest
```
- Run the following deployment command in shell. Substitutions should be made for fields with square brackets (be sure to delete brackets). The instructions below assume that the current directory is as described in the previous step,

```bash
az deployment sub create --template-file ./cyclecloud-slurm-workspace/bicep/mainTemplate.bicep --parameters parameters.json --location [ANY AZURE LOCATION E.G. eastus] --name [OPTIONAL BUT HELPFUL, DELETE IF UNUSED] 
```

- Wait until the shell indicates that the deployment was successful. One can also track the progress of the deployment in the Azure Portal by navigating to the resource group indicated in the UI, selecting `Deployments` from the Settings dropdown menu on the left-hand side menu, and checking the Status of the Deployment Name that begins with “pid-” at the bottom of the displayed list.

## Resources

* [How to connect to the CycleCloud Portal through Bastion](/azure/cyclecloud/how-to/ccws/connect-to-portal-with-bastion)
* [How to connect to a Login Node through Bastion](/azure/cyclecloud/how-to/ccws/connect-to-login-node-with-bastion)
