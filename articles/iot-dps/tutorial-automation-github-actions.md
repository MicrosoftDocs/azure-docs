---
title: GitOps for Azure Device Provisioning Service
description: Tutorial - Use GitHub Actions to automate the steps for creating and managing Azure Device Provisioning Service (DPS) resources
author: kgremban
ms.author: kgremban
manager: lizross
ms.date: 12/19/2022
ms.topic: tutorial
ms.service: iot-dps
services: iot-dps
ms.custom: mvc, devx-track-azurecli
---

# Tutorial: Automate Azure Device Provisioning Service with GitHub Actions

Use automation tools like GitHub Actions to manage your IoT device lifecycle. This tutorial demonstrates a GitHub Actions workflow that connects a device to an IoT hub using Azure Device Provisioning Service (DPS).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Save authentication credentials as repository secrets.
> * Create a workflow to provision IoT Hub and Device Provisioning Service resources.
> * Run the workflow and monitor a simulated device as it connects to IoT Hub.

## Prerequisites

* An Azure subscription

  If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* The Azure CLI

  * Use the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).
   [![Launch Cloud Shell in a new window](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)
  * Or, If you prefer to run CLI reference commands locally, [install](/cli/azure/install-azure-cli) the Azure CLI. If you're running on Windows or macOS, consider [running Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

    * If you're using a local installation, sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.

    * Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).

* A GitHub account with either a repository that you own or a repository where you have admin access. For more information, see [Get started with GitHub](https://docs.github.com/en/get-started).

## 1 - Create repository secrets

The workflow that you will define in the next section requires access to your Azure subscription to create and manage resources. You don't want to put that information in an unprotected file where it could be discovered, so instead we'll use repository secrets to store this information but still make it accessible as an environment variable in the workflow. For more information, see [Encrypted secrets](https://docs.github.com/actions/security-guides/encrypted-secrets).

Only repository owners and admins can manage repository secrets.

### Create a service principal

Rather than providing your personal access credentials, we'll create a service principal and then add those credentials as repository secrets. Use the Azure CLI to create a new service principal. For more information, see [Create an Azure service principal](/cli/azure/create-an-azure-service-principal-azure-cli).

1. Use the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command to create a service principal with *contributor* access to a specific resource group. Replace `<SUBSCRIPTION_ID>` and `<RESOURCE_GROUP_NAME>` with your own information.

   This command requires owner or user access administrator roles in the subscription.

   ```azurecli
   az ad sp create-for-rbac --name github-actions-sp --role contributor --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>
   ```

1. Copy the following items from the output of the service principal creation command to use in the next section:

   * The *clientId*.
   * The *clientSecret*. This is a generated password for the service principal that you won't be able to access again.
   * The *tenantId*.

1. Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to assign two more access roles to the service principal: *Device Provisioning Service Data Contributor* and *IoT Hub Data Contributor*. Replace `<SP_CLIENT_ID>` with the *clientId* value that you copied from the previous command's output.

   ```azurecli
   az role assignment create --assignee "<SP_CLIENT_ID>" --role "Device Provisioning Service Data Contributor" --resource-group "<RESOURCE_GROUP_NAME>"
   ```

   ```azurecli
   az role assignment create --assignee "<SP_CLIENT_ID>" --role "IoT Hub Data Contributor" --resource-group "<RESOURCE_GROUP_NAME>"
   ```

### Save service principal credentials as secrets

1. On [GitHub.com](https://github.com), navigate to the **Settings** for your repository.

1. Select **Secrets** from the navigation menu, then select **Actions**.

1. Select **New repository secret**.

1. Create a secret for your service principal ID.

   * **Name**: `APP_ID`
   * **Secret**: Paste the *clientId* that you copied from the output of the service principal creation command.

1. Select **Add secret**, then select **New repository secret** to add a second secret.

1. Create a secret for your service principal password.

   * **Name**: `SECRET`
   * **Secret**: Paste the *clientSecret* that you copied from the output of the service principal creation command.

1. Select **Add secret**, then select **New repository secret** to add the final secret.

1. Create a secret for your Azure tenant.

   * **Name**: `TENANT`
   * **Secret**: Paste the *tenantId* that you copied from the output of the service principal creation command.

1. Select **Add secret**.

## 2 - Create a workflow

A GitHub Actions *workflow* defines the tasks that will run once it's triggered by an *event*. A workflow contains one or more *jobs* which can run in parallel or sequentially. For more information, see [Understanding GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).

For this tutorial, we'll create one workflow that contains jobs for each of the following tasks:

* Provision an IoT Hub instance and a DPS instance.
* Link the IoT Hub and DPS instances to each other.
* Create an individual enrollment on the DPS instance, and register a device to the IoT hub using symmetric key authentication via the DPS enrollment.
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

1. Add the [on.workflow_dispatch](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_dispatchinputs) parameter. The `on` parameter defines when a workflow will run. The `workflow_dispatch` parameter indicates that we want to manually trigger the workflow. With this parameter, we could define `inputs` that would be passed to the workflow at each run, but we won't use those for this tutorial.

   ```yml
   on: workflow_dispatch
   ```

1. Define the [environment variables](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#env) for the resources you're creating in the workflow. These variables will be available to all the jobs in the workflow. You can also define environment variables for individual jobs, or for individual steps within jobs.

   Replace the placeholder values with your own values. Make sure that you specify the same resource group that the service principal has access to.

   ```yml
   env:
     HUB_NAME: <Globally unique IoT hub name>
     DPS_NAME: <Desired Device Provisioning Service name>
     DEVICE_NAME: <Desired device name>
     RESOURCE_GROUP: <Solution resource group where resources will be created>
   ```

1. Define environment variables for the secrets that you created in the previous section.

   ```yml
     SP_USER: ${{ secrets.APP_ID }}
     SP_SECRET: ${{ secrets.SECRET }}
     SP_TENANT: ${{ secrets.TENANT }}
   ```

1. Add the [jobs](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#jobs) parameter to the workflow file.

   ```yml
   jobs:
   ```

1. Define the first job for our workflow, which we'll call the `provision` job. This job provisions the IoT Hub and DPS instances:

   ```yml
     provision:
       runs-on: ubuntu-latest
       steps:
         - name: Provision Infra
           run: |
             az --version
             az login --service-principal -u "$SP_USER" -p "$SP_SECRET" --tenant "$SP_TENANT"
             az iot hub create -n "$HUB_NAME" -g "$RESOURCE_GROUP"
             az iot dps create -n "$DPS_NAME" -g "$RESOURCE_GROUP"
   ```

   For more information about the commands run in this job, see:

   * [az iot hub create](/cli/azure/iot/hub#az-iot-hub-create)
   * [az iot dps create](/cli/azure/iot/dps#az-iot-dps-create)

1. Define a job to `configure` the DPS and IoT Hub instances. Notice that this job uses the [needs](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idneeds) parameter, which means that the `configure` job won't run until listed job completes its own run successfully.

   ```yml
     configure:
       runs-on: ubuntu-latest
       needs: provision
       steps:
         - name: Configure Infra
           run: |
             az login --service-principal -u "$SP_USER" -p "$SP_SECRET" --tenant "$SP_TENANT"
             az iot dps linked-hub create --dps-name "$DPS_NAME" --hub-name "$HUB_NAME"   
   ```

   For more information about the commands run in this job, see:

   * [az iot dps linked-hub create](/cli/azure/iot/dps/linked-hub#az-iot-dps-linked-hub-create)

1. Define a job called `register` that will create an individual enrollment and then use that enrollment to register a device to IoT Hub.

   ```yml
     register:
       runs-on: ubuntu-latest
       needs: configure
       steps:
         - name: Create enrollment
           run: |
             az login --service-principal -u "$SP_USER" -p "$SP_SECRET" --tenant "$SP_TENANT"
             az extension add --name azure-iot
             az iot dps enrollment create -n "$DPS_NAME" --eid "$DEVICE_NAME" --attestation-type symmetrickey --auth-type login
         - name: Register device
           run: |
             az iot device registration create -n "$DPS_NAME" --rid "$DEVICE_NAME" --auth-type login   
   ```

   > [!NOTE]
   > This job and others use the parameter `--auth-type login` in some commands to indicate that the operation should use the service principal from the current Microsoft Entra session. The alternative, `--auth-type key` doesn't require the service principal configuration, but is less secure.

   For more information about the commands run in this job, see:

   * [az iot dps enrollment create](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-create)
   * [az iot device registration create](/cli/azure/iot/device/registration#az-iot-device-registration-create)

1. Define a job to `simulate` an IoT device that will connect to the IoT hub and send sample telemetry messages.

   ```yml
     simulate:
       runs-on: ubuntu-latest
       needs: register
       steps:
         - name: Simulate device
           run: |
             az login --service-principal -u "$SP_USER" -p "$SP_SECRET" --tenant "$SP_TENANT"
             az extension add --name azure-iot
             az iot device simulate -n "$HUB_NAME" -d "$DEVICE_NAME"
   ```

   For more information about the commands run in this job, see:

   * [az iot device simulate](/cli/azure/iot/device#az-iot-device-simulate)

1. Define a job to `monitor` the IoT hub endpoint for events, and watch messages coming in from the simulated device. Notice that the **simulate** and **monitor** jobs both define the **register** job in their `needs` parameter. This configuration means that once the **register** job completes successfully, both these jobs will run in parallel.

   ```yml
     monitor:
       runs-on: ubuntu-latest
       needs: register
       steps:
         - name: Monitor d2c telemetry
           run: |
             az login --service-principal -u "$SP_USER" -p "$SP_SECRET" --tenant "$SP_TENANT"
             az extension add --name azure-iot
             az iot hub monitor-events -n "$HUB_NAME" -y   
   ```

   For more information about the commands run in this job, see:

   * [az iot hub monitor-events](/cli/azure/iot/hub#az-iot-hub-monitor-events)

1. The complete workflow file should look like this example, with your information replacing the placeholder values in the environment variables:

   ```yml
   name: DPS Tutorial

   on: workflow_dispatch

   env:
     HUB_NAME: <Globally unique IoT hub name>
     DPS_NAME: <Desired Device Provisioning Service name>
     DEVICE_NAME: <Desired device name>
     RESOURCE_GROUP: <Solution resource group where resources will be created>
     SP_USER: ${{ secrets.APP_ID }}
     SP_SECRET: ${{ secrets.SECRET }}
     SP_TENANT: ${{ secrets.TENANT }}

   jobs:
     provision:
       runs-on: ubuntu-latest
       steps:
         - name: Provision Infra
           run: |
             az --version
             az login --service-principal -u "$SP_USER" -p "$SP_SECRET" --tenant "$SP_TENANT"
             az iot hub create -n "$HUB_NAME" -g "$RESOURCE_GROUP"
             az iot dps create -n "$DPS_NAME" -g "$RESOURCE_GROUP"
     configure:
       runs-on: ubuntu-latest
       needs: provision
       steps:
         - name: Configure Infra
           run: |
             az login --service-principal -u "$SP_USER" -p "$SP_SECRET" --tenant "$SP_TENANT"
             az iot dps linked-hub create --dps-name "$DPS_NAME" --hub-name "$HUB_NAME"
     register:
       runs-on: ubuntu-latest
       needs: configure
       steps:
         - name: Create enrollment
           run: |
             az login --service-principal -u "$SP_USER" -p "$SP_SECRET" --tenant "$SP_TENANT"
             az extension add --name azure-iot
             az iot dps enrollment create -n "$DPS_NAME" --eid "$DEVICE_NAME" --attestation-type symmetrickey --auth-type login
         - name: Register device
           run: |
             az iot device registration create -n "$DPS_NAME" --rid "$DEVICE_NAME" --auth-type login
     simulate:
       runs-on: ubuntu-latest
       needs: register
       steps:
         - name: Simulate device
           run: |
             az login --service-principal -u "$SP_USER" -p "$SP_SECRET" --tenant "$SP_TENANT"
             az extension add --name azure-iot
             az iot device simulate -n "$HUB_NAME" -d "$DEVICE_NAME"
     monitor:
       runs-on: ubuntu-latest
       needs: register
       steps:
         - name: Monitor d2c telemetry
           run: |
             az login --service-principal -u "$SP_USER" -p "$SP_SECRET" --tenant "$SP_TENANT"
             az extension add --name azure-iot
             az iot hub monitor-events -n "$HUB_NAME" -y
   ```

1. Save, commit, and push this new file to your GitHub repository.

## 3 - Run the workflow

1. Navigate to the **Actions** tab of your GitHub repository.

1. In the **Actions** pane, select **DPS Tutorial**, which is the name that we defined in the workflow file, then select the **Run workflow** drop-down box.

   :::image type="content" source="./media/tutorial-automation-github-actions/run-workflow.png" alt-text="Screenshot of the action tab where you can select a workflow and run it.":::

1. Change the branch if you created your workflow in a branch other than main, then select **Run workflow**.

1. A new workflow run appears in progress. Select the name to view details of the run.

1. In the workflow summary, you can watch as each job begins and completes. Select any job name to view its details. The simulated device job runs for five minutes and sends telemetry to IoT Hub. During this time, select the **simulate** job to watch messages being sent from the device, and the **monitor** job to watch those messages being received by IoT Hub.

1. When all the jobs have completed successfully, you should see green checkmarks by each one.

   :::image type="content" source="./media/tutorial-automation-github-actions/workflow-successful.png" alt-text="Screenshot of a successfully completed workflow.":::

## Clean up resources

If you're not going to continue to use these resources created in this tutorial, delete
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
