---
title: Tutorial - Automate Azure Device Provisioning Service with GitHub Actions
description: Tutorial - Use GitHub Actions to automate the steps for creating and managing Azure Device Provisioning Service (DPS) resources
author: kgremban
ms.author: kgremban
manager: lizross
ms.date: 12/13/2022
ms.topic: tutorial
ms.service: iot-dps
services: iot-dps
ms.custom: mvc
---

# Tutorial: Automate Azure Device Provisioning Service processes with GitHub Actions


TODO: Add your introductory paragraph


In this tutorial, you learn how to:

> [!div class="checklist"]
> * [All tutorials include a list summarizing the steps to completion]
> * [Each of these bullet points align to a key H2]
> * [Use these green checkboxes in a tutorial]

## Prerequisites

* An Azure subscription

  If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Azure CLI

* A GitHub account with either a repository that you own or a repository where you have admin access. For more information, see [Get started with GitHub](https://docs.github.com/en/get-started).

## 1 - Create a workflow

A GitHub Actions *workflow* defines the tasks that will run once it's triggered by an *event*. A workflow contains one or more *jobs* which can run in parallel or sequentially. For more information, see [Understanding GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).

For this tutorial, we'll create one workflow that contains jobs for each of the following tasks:

* Provision an IoT Hub instance and a DPS instance.
* Link the IoT Hub and DPS instances to each other.
* Create an individual enrollment on the DPS instance, and register a device to the IoT hub via the DPS enrollment.
* Simulate the device for five minutes and monitor the IoT hub events.

Workflows are YAML files that are located in the `.github/workflows/` directory of a repository.

1. In your GitHub repository, navigate to the **Actions** tab.
1. In the **Actions** pane, select **New workflow**.
1. On the **Choose a workflow page**, you can choose prebuilt templates to use. We're going to create out own workflow for this tutorial, so select **Set up a workflow yourself**.
1. GitHub creates a new workflow file for you. Notice that it's in the `.github/workflows/` directory. Give the new file a meaningful name, like `dps-tutorial.yml`.
1. Add the [name](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#name) parameter to give your workflow a name.

   ```yml
   name: DPS Tutorial
   ```

1. Add the [on.workflow_dispatch.inputs](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputs) parameter. The `on` parameter defines when a workflow will run. The `workflow_dispatch` parameter indicates that we want to manually trigger the workflow after providing inputs to the workflow. The `inputs` parameter lets you define the inputs that will be passed to the workflow.

   ```yml
   on:
     workflow_dispatch:
       inputs:
   ```

1. Define the input parameters for the workflow. You'll manually provide these parameters any time you run the workflow.

   ```yml
         hubName:
           type: string
           description: Desired IoT hub name
           required: true
         dpsName:
           type: string
           description: Desired Device Provisioning Service name
           required: true
         deviceName:
           type: string
           description: Desired device name
           required: true
         resourceGroup:
           type: string
           description: Solution resource group
           required: true
   ```

1. Add the [jobs](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#jobs) parameter to the workflow file.

   ```yml
   jobs:
   ```

1. Define the first job for our workflow, which we'll call the `provision` job. This job provisions the IoT Hub and DPS instances.

   ```yml
     provision:
       runs-on: ubuntu-latest
       steps:
         - name: Provision Infra
           env:
             spUser: ${{ secrets.APP_ID }}
             spSecret: ${{ secrets.SECRET }}
             spTenant: ${{ secrets.TENANT }}
           run: |
             az --version
             az login --service-principal -u "$spUser" -p "$spSecret" --tenant "$spTenant"
             az iot hub create -n "${{ github.event.inputs.hubName }}" -g "${{ github.event.inputs.resourceGroup }}"
             az iot dps create -n "${{ github.event.inputs.dpsName }}" -g "${{ github.event.inputs.resourceGroup }}"
   ```

1. Define a job to `configure` the DPS and IoT Hub instances. Notice that this job uses the [needs](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idneeds) parameter, which means that the `configure` job won't run until listed job completes its own run successfully.

   ```yml
     configure:
       runs-on: ubuntu-latest
       needs: provision
       steps:
         - name: Configure Infra
           env:
             spUser: ${{ secrets.APP_ID }}
             spSecret: ${{ secrets.SECRET }}
             spTenant: ${{ secrets.TENANT }}
           run: |
             az login --service-principal -u "$spUser" -p "$spSecret" --tenant "$spTenant"
             az iot dps linked-hub create --dps-name "${{ github.event.inputs.dpsName }}" --hub-name "${{ github.event.inputs.hubName }}"   
   ```

1. Define a job called `register` that will create an individual enrollment and then use that enrollment to register a device to IoT Hub.

   ```yml
     register:
       runs-on: ubuntu-latest
       needs: configure
       steps:
         - name: Create enrollment
           env:
             spUser: ${{ secrets.APP_ID }}
             spSecret: ${{ secrets.SECRET }}
             spTenant: ${{ secrets.TENANT }}
           run: |
             az login --service-principal -u "$spUser" -p "$spSecret" --tenant "$spTenant"
             az extension add --name azure-iot
             az iot dps enrollment create -n "${{ github.event.inputs.dpsName }}" --eid "${{ github.event.inputs.deviceName }}" --attestation-type symmetrickey --auth-type login
         - name: Register device
           run: |
             az iot device registration create -n "${{ github.event.inputs.dpsName }}" --rid "${{ github.event.inputs.deviceName }}" --auth-type login   
   ```

1. Define a job to `simulate` an IoT device that will connect to the IoT hub and send sample telemetry messages.

   ```yml
     simulate:
       runs-on: ubuntu-latest
       needs: register
       steps:
         - name: Simulate device
           env:
             spUser: ${{ secrets.APP_ID }}
             spSecret: ${{ secrets.SECRET }}
             spTenant: ${{ secrets.TENANT }}
           run: |
             az login --service-principal -u "$spUser" -p "$spSecret" --tenant "$spTenant"
             az extension add --name azure-iot
             az iot device simulate -n "${{ github.event.inputs.hubName }}" -d "${{ github.event.inputs.deviceName }}"
   ```

1. Define a job to `monitor` the IoT hub endpoint for events, and watch messages coming in from the simulated device. Notice that the **simulate** and **monitor** jobs both define the **register** job in their `needs` parameter. This configuration means that once the **register** job completes successfuly, both these jobs will run in parallel.

   ```yml
     monitor:
       runs-on: ubuntu-latest
       needs: register
       steps:
         - name: Monitor d2c telemetry
           env:
             spUser: ${{ secrets.APP_ID }}
             spSecret: ${{ secrets.SECRET }}
             spTenant: ${{ secrets.TENANT }}
           run: |
             az login --service-principal -u "$spUser" -p "$spSecret" --tenant "$spTenant"
             az extension add --name azure-iot
             az iot hub monitor-events -n "${{ github.event.inputs.hubName }}" -y   
   ```

1. Save, commit, and push this new file to your GitHub repository.

## 2 - Create repository secrets

The workflow that you defined in the previous section requires access to your Azure subscription to create and manage resources. You don't want to put that information in an unprotected file where it could be discovered, so instead we'll use repository secrets to store this information but still make it accessible as an environment variable in the workflow. For more information, see [Encrypted secrets](https://docs.github.com/actions/security-guides/encrypted-secrets).

Only repository owners and admins can manage repository secrets.

### Create a service principal

Rather than providing your personal access credentials, we'll create a service principal and then add those credentials as repository secrets. Use the Azure CLI to create a new service principal. For more information, see [Create an Azure service principal](/cli/azure/create-an-azure-service-principal-azure-cli).

The following command creates a service principal with *contributor* access to a specific resource group. Replace **<SUBSCRIPTION_ID>** and **<RESOURCE_GROUP_NAME>** with your own information.

This command requires owner or user access administrator roles in the subscription.

```azurecli
az ad sp create-for-rbac --name github-actions-sp --role contributor --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>
```

The output for this command includes a generated password for the service principal. Copy this password to use in the next section. You won't be able to access the password again.

### Save service principal credentials as secrets

1. On [GitHub.com](https://github.com), navigate to the **Settings** for your repository.

1. Select **Secrets** from the navigation menu, then select **Actions**.

1. Select **New repository secret**.

1. Create a secret for your service principal ID.

   * **Name**: `APP_ID`
   * **Secret**: `github-actions-sp`, or the value you used for the service principal name if you used a different value.

1. Select **Add secret**, then select **New repository secret** to add a second secret.

1. Create a secret for your service principal password.

   * **Name**: `SECRET`
   * **Secret**: Paste the password that you copied from the output of the service principal creation command.

1. Select **Add secret**, then select **New repository secret** to add the final secret.

1. Create a secret for your Azure tenant.

   * **Name**: `TENANT`
   * **Secret**: Provide your Azure tenant. The value of this argument can either be an .onmicrosoft.com domain or the Azure object ID for the tenant.

1. Select **Add secret**.

## 3 - Run the workflow

1. Navigate to the **Actions** tab of your GitHub repository.
1. In the **Actions** pane, select **DPS Tutorial**, which is the name that we defined in the workflow file.
1. Select the **Run workflow** drop-down box.
1. The **Run workflow** box provides text fields for each of the input parameters that we defined in the workflow file. Provide values for each of them:

   * **Desired IoT hub name**: Provide a globally unique name for your IoT Hub instance.
   * **Desired Device Provisioning Service name**: Provide a unique name for your Device Provisioning Service instance.
   * **Desired device name**: Provide a name for your device.
   * **Solution resource group**: Provide the name of the resource group where the IoT hub and DPS instance will be created. This is the same resource group that your service principal has access to.

1. Select **Run workflow**.

1. A new workflow run appears in progress. Select the name to view details of the run.

## Clean up resources

If you're not going to continue to use this resources created in this tutorial, delete
them with the following steps.

Use the Azure CLI:

1. List the resources in your resource group.

   ```azurecli
   az resource list --resource-group <RESOURCE_GROUP_NAME>
   ```

1. To delete individual resources, use the resource ID.

   ```azurecli
   az resource delete --resource-group <RESOURCE_GROUP_NAME> --ids <RESOURCE_ID>
   ```

1. If you want to delete the whole resource group and all resources within it, run the following command:

   ```azurecli
   az group delete --resource-group <RESOURCE_GROUP_NAME>
   ```

Use the Azure portal:

1. In the [Azure portal](https://portal.azure.com), navigate to the resource group where you created the new resources.
1. You can either delete the entire resource group or select the individual resources that you want to remove, then select **Delete**.

## Next steps

Learn how to provision DPS instances with other automation tools.

> [!div class="nextstepaction"]
> [Set up DPS with Bicep](tutorial-custom-allocation-policies.md)

