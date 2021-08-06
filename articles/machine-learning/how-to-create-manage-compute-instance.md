---
title: Create and manage a compute instance
titleSuffix: Azure Machine Learning
description: Learn how to create and manage an Azure Machine Learning compute instance. Use as your development environment, or as  compute target for dev/test purposes.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: devx-track-azurecli, references_regions
ms.author: sgilley
author: sdgilley
ms.reviewer: sgilley
ms.date: 08/06/2021
---

# Create and manage an Azure Machine Learning compute instance

Learn how to create and manage a [compute instance](concept-compute-instance.md) in your Azure Machine Learning workspace.

Use a compute instance as your fully configured and managed development environment in the cloud. For development and testing, you can also use the instance as a [training compute target](concept-compute-target.md#train) or for an [inference target](concept-compute-target.md#deploy).   A compute instance can run multiple jobs in parallel and has a job queue. As a development environment, a compute instance cannot be shared with other users in your workspace.

In this article, you learn how to:

* [Create](#create) a compute instance
* [Manage](#manage) (start, stop, restart, delete) a compute instance
* [Create  a schedule](#schedule) to automatically start and stop the compute instance (preview)
* [Use a setup script](#setup-script) to customize and configure the compute instance

Compute instances can run jobs securely in a [virtual network environment](how-to-secure-training-vnet.md), without requiring enterprises to open up SSH ports. The job executes in a containerized environment and packages your model dependencies in a Docker container.

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

* The [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md), [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro), or the [Azure Machine Learning Visual Studio Code extension](how-to-setup-vs-code.md).

## Create

> [!IMPORTANT]
> Items marked (preview) below are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

**Time estimate**: Approximately 5 minutes.

Creating a compute instance is a one time process for your workspace. You can reuse the compute as a development workstation or as a compute target for training. You can have multiple compute instances attached to your workspace. 

The dedicated cores per region per VM family quota and total regional quota, which applies to compute instance creation, is unified and shared with Azure Machine Learning training compute cluster quota. Stopping the compute instance does not release quota to ensure you will be able to restart the compute instance. It is not possible to change the virtual machine size of compute instance once it is created.

<a name="create-instance"></a> The following example demonstrates how to create a compute instance:

# [Python](#tab/python)

```python
import datetime
import time

from azureml.core.compute import ComputeTarget, ComputeInstance
from azureml.core.compute_target import ComputeTargetException

# Choose a name for your instance
# Compute instance name should be unique across the azure region
compute_name = "ci{}".format(ws._workspace_id)[:10]

# Verify that instance does not exist already
try:
    instance = ComputeInstance(workspace=ws, name=compute_name)
    print('Found existing instance, use it.')
except ComputeTargetException:
    compute_config = ComputeInstance.provisioning_configuration(
        vm_size='STANDARD_D3_V2',
        ssh_public_access=False,
        # vnet_resourcegroup_name='<my-resource-group>',
        # vnet_name='<my-vnet-name>',
        # subnet_name='default',
        # admin_user_ssh_public_key='<my-sshkey>'
    )
    instance = ComputeInstance.create(ws, compute_name, compute_config)
    instance.wait_for_completion(show_output=True)
```

For more information on the classes, methods, and parameters used in this example, see the following reference documents:

* [ComputeInstance class](/python/api/azureml-core/azureml.core.compute.computeinstance.computeinstance)
* [ComputeTarget.create](/python/api/azureml-core/azureml.core.compute.computetarget#create-workspace--name--provisioning-configuration-)
* [ComputeInstance.wait_for_completion](/python/api/azureml-core/azureml.core.compute.computeinstance(class)#wait-for-completion-show-output-false--is-delete-operation-false-)


# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az ml computetarget create computeinstance  -n instance -s "STANDARD_D3_V2" -v
```

For more information, see the [az ml computetarget create computeinstance](/cli/azure/ml(v1)/computetarget/create#az_ml_computetarget_create_computeinstance) reference.

# [Studio](#tab/azure-studio)

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com).
1. Under __Manage__, select __Compute__.
1. Select **Compute instance** at the top.
1. If you have no compute instances, select  **Create** in the middle of the page.
  
    :::image type="content" source="media/how-to-create-attach-studio/create-compute-target.png" alt-text="Create compute target":::

1. If you see a list of compute resources, select **+New** above the list.

    :::image type="content" source="media/how-to-create-attach-studio/select-new.png" alt-text="Select new":::
1. Fill out the form:

    |Field  |Description  |
    |---------|---------|
    |Compute name     |  <ul><li>Name is required and must be between 3 to 24 characters long.</li><li>Valid characters are upper and lower case letters, digits, and the  **-** character.</li><li>Name must start with a letter</li><li>Name needs to be unique across all existing computes within an Azure region. You will see an alert if the name you choose is not unique</li><li>If **-**  character is used, then it needs to be followed by at least one letter later in the name</li></ul>     |
    |Virtual machine type |  Choose CPU or GPU. This type cannot be changed after creation     |
    |Virtual machine size     |  Supported virtual machine sizes might be restricted in your region. Check the [availability list](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines)     |

1. Select **Create** unless you want to configure advanced settings for the compute instance.
1. <a href="advanced-settings"></a> Select **Next: Advanced Settings** if you want to:

    * Enable SSH access.  Follow the [detailed SSH access instructions](#enable-ssh) below.
    * Enable virtual network. Specify the **Resource group**, **Virtual network**, and **Subnet** to create the compute instance inside an Azure Virtual Network (vnet). For more information, see these [network requirements](./how-to-secure-training-vnet.md) for vnet. 
    * Assign the computer to another user. For more about assigning to other users, see [Create on behalf of](#on-behalf).
    * Provision with a setup script (preview) - for more details about how to create and use a setup script, see [Customize the compute instance with a script](#setup-script).
    * Add schedule (preview). Schedule times for the compute instance to automatically start and/or shutdown. See [schedule details](#schedule) below.

---

You can also create a compute instance with an [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/machine-learning-compute-create-computeinstance).

## <a name="enable-ssh"></a> Enable SSH access

SSH access is disabled by default.  SSH access cannot be changed after creation. Make sure to enable access if you plan to debug interactively with [VS Code Remote](how-to-set-up-vs-code-remote.md).  

[!INCLUDE [amlinclude-info](../../includes/machine-learning-enable-ssh.md)]

Once the compute instance is created and running, see [Connect with SSH access](how-to-create-attach-compute-studio.md#ssh-access).

## <a name="on-behalf"></a> Create on behalf of (preview)

As an administrator, you can create a compute instance on behalf of a data scientist and assign the instance to them with:

* Studio, using the [Advanced settings](?tabs=azure-studio#advanced-settings)

* [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/machine-learning-compute-create-computeinstance).  For details on how to find the TenantID and ObjectID needed in this template, see [Find identity object IDs for authentication configuration](../healthcare-apis/azure-api-for-fhir/find-identity-object-ids.md).  You can also find these values in the Azure Active Directory portal.

* REST API

The data scientist you create the compute instance for needs the following be [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) permissions:

* *Microsoft.MachineLearningServices/workspaces/computes/start/action*
* *Microsoft.MachineLearningServices/workspaces/computes/stop/action*
* *Microsoft.MachineLearningServices/workspaces/computes/restart/action*
* *Microsoft.MachineLearningServices/workspaces/computes/applicationaccess/action*
* *Microsoft.MachineLearningServices/workspaces/computes/updateSchedules/action*

The data scientist can start, stop, and restart the compute instance. They can use the compute instance for:
* Jupyter
* JupyterLab
* RStudio
* Integrated notebooks

## <a name="schedule"></a> Schedule automatic start and stop (preview)

Define multiple schedules for auto-shutdown and auto-start. For instance, create a schedule to start at 9 AM and stop at 6 PM from Monday-Thursday, and a second schedule to start at 9 AM and stop at 4 PM for Friday.  You can create a total of four schedules per compute instance.

Schedules can also be defined for [create on behalf of](#on-behalf) compute instances. You can create schedule to create a compute instance in a stopped state. This is particularly useful when a user creates a compute instance on behalf of another user.

### Create a schedule in studio

1. [Fill out the form](?tabs=azure-studio#create-instance).
1. On the second page of the form, open **Show advanced settings**.
1. Select **Add schedule** to add a new schedule.

    :::image type="content" source="media/how-to-create-attach-studio/create-schedule.png" alt-text="Screenshot: Add schedule in advanced settings.":::

1. Select **Start compute instance** or **Stop compute instance**.
1. Select the **Time zone**.
1. Select the **Startup time** or **Shutdown time**.
1. Select the days when this schedule is active.

    :::image type="content" source="media/how-to-create-attach-studio/stop-compute-schedule.png" alt-text="Screenshot: schedule a compute instance to shut down.":::

1. Select **Add schedule** again if you want to create another schedule.

Once the compute instance is created, you can view, edit, or add new schedules from the compute instance details section.

### Create a schedule with a Resource Manager template

You can schedule the automatic start and stop of a compute instance by using a Resource Manager template.  In a Resource Manager template, use either cron or LogicApps expressions to define a schedule to start or stop the instance.  

```json
"schedules": {
    "value": {
    "computeStartStop": [
        {
        "TriggerType": "Cron",
        "Cron": {
            "StartTime": "2021-03-10T21:21:07",
            "TimeZone": "Pacific Standard Time",
            "Expression": "0 18 * * *"
        },
        "Action": "Stop",
        "Status": "Enabled"
        },
        {
        "TriggerType": "Cron",
        "Cron": {
            "StartTime": "2021-03-10T21:21:07",
            "TimeZone": "Pacific Standard Time",
            "Expression": "0 8 * * *"
        },
        "Action": "Start",
        "Status": "Enabled"
        },
        { 
        "triggerType": "Recurrence", 
        "recurrence": { 
            "frequency": "Day", 
            "interval": 1, 
            "timeZone": "Pacific Standard Time", 
          "schedule": { 
            "hours": [18], 
            "minutes": [0], 
            "weekDays": [ 
                "Saturday", 
                "Sunday"
            ] 
            } 
        }, 
        "Action": "Stop", 
        "Status": "Enabled" 
        } 
    ]
```

* Action can have value of “Start” or “Stop”.
* For trigger type of `Recurrence` use the same syntax as logic app, with this [recurrence schema](../logic-apps/logic-apps-workflow-actions-triggers.md#recurrence-trigger).
* For trigger type of `cron`, use standard cron syntax:  

    ```cron
    // Crontab expression format: 
    // 
    // * * * * * 
    // - - - - - 
    // | | | | | 
    // | | | | +----- day of week (0 - 6) (Sunday=0) 
    // | | | +------- month (1 - 12) 
    // | | +--------- day of month (1 - 31) 
    // | +----------- hour (0 - 23) 
    // +------------- min (0 - 59) 
    // 
    // Star (*) in the value field above means all legal values as in 
    // braces for that column. The value column can have a * or a list 
    // of elements separated by commas. An element is either a number in 
    // the ranges shown above or two numbers in the range separated by a 
    // hyphen (meaning an inclusive range). 
    ```

Use Azure policy to enforce a shutdown schedule exists for every compute instance in a subscription or default to a schedule if nothing exists.

## <a name="setup-script"></a> Customize the compute instance with a script (preview)

Use a setup script for an automated way to customize and configure the compute instance at provisioning time. As an administrator, you can write a customization script to be used to provision all compute instances in the workspace according to your requirements.

Some examples of what you can do in a setup script:

* Install packages, tools, and software
* Mount data
* Create custom conda environment and Jupyter kernels
* Clone git repositories and set git config
* Set network proxies
* Set environment variables
* Install JupyterLab extensions

### Create the setup script

The setup script is a shell script, which runs as *rootuser*.  Create or upload the script into your **Notebooks** files:

1. Sign into the [studio](https://ml.azure.com) and select your workspace.
2. On the left, select **Notebooks**
3. Use the **Add files** tool to create or upload your setup shell script.  Make sure the script filename ends in ".sh".  When you create a new file, also change the **File type** to *bash(.sh)*.

:::image type="content" source="media/how-to-create-manage-compute-instance/create-or-upload-file.png" alt-text="Create or upload your setup script to Notebooks file in studio":::

When the script runs, the current working directory of the script is the directory where it was uploaded. For example, if you upload the script to **Users>admin**, the location of the script on the compute instance and current working directory when the script runs is */home/azureuser/cloudfiles/code/Users/admin*. This would enable you to use relative paths in the script.

Script arguments can be referred to in the script as $1, $2, etc.

If your script was doing something specific to azureuser such as installing conda environment or jupyter kernel, you will have to put it within *sudo -u azureuser* block like this

```shell
#!/bin/bash

set -e

# This script installs a pip package in compute instance azureml_py38 environment

sudo -u azureuser -i <<'EOF'
# PARAMETERS
PACKAGE=numpy
ENVIRONMENT=azureml_py38 
conda activate "$ENVIRONMENT"
pip install "$PACKAGE"
conda deactivate
EOF
```
The command *sudo -u azureuser* changes the current working directory to */home/azureuser*. You also can't access the script arguments in this block.

You can also use the following environment variables in your script:

1. CI_RESOURCE_GROUP
2. CI_WORKSPACE
3. CI_NAME
4. CI_LOCAL_UBUNTU_USER. This points to azureuser

You can use setup script in conjunction with Azure policy to either enforce or default a setup script for every compute instance creation.

### Use the script in the studio

Once you store the script, specify it during creation of your compute instance:

1. Sign into the [studio](https://ml.azure.com/) and select your workspace.
1. On the left, select **Compute**.
1. Select **+New** to create a new compute instance.
1. [Fill out the form](?tabs=azure-studio#create-instance).
1. On the second page of the form, open **Show advanced settings**.
1. Turn on **Provision with setup script**.
1. Browse to the shell script you saved.  Or upload a script from your computer.
1. Add command arguments as needed.

:::image type="content" source="media/how-to-create-manage-compute-instance/setup-script.png" alt-text="Provisiona compute instance with a setup script in the studio.":::

If workspace storage is attached to a virtual network you might not be able to access the setup script file unless you are accessing the Studio from within virtual network.

### Use script in a Resource Manager template

In a Resource Manager [template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/machine-learning-compute-create-computeinstance), add `setupScripts` to invoke the setup script when the compute instance is provisioned. For example:

```json
"setupScripts":{
    "scripts":{
        "creationScript":{
        "scriptSource":"workspaceStorage",
        "scriptData":"[parameters('creationScript.location')]",
        "scriptArguments":"[parameters('creationScript.cmdArguments')]"
        }
    }
}
```
*scriptData* above specifies the location of the creation script in the notebooks file share such as *Users/admin/testscript.sh*.
*scriptArguments* is optional above and specifies the arguments for the creation script.

You could instead provide the script inline for a Resource Manager template.  The shell command can refer to any dependencies uploaded into the notebooks file share.  When you use an inline string, the working directory for the script is */mnt/batch/tasks/shared/LS_root/mounts/clusters/**ciname**/code/Users*.

For example, specify a base64 encoded command string for `scriptData`:

```json
"setupScripts":{
    "scripts":{
        "creationScript":{
        "scriptSource":"inline",
        "scriptData":"[base64(parameters('inlineCommand'))]",
        "scriptArguments":"[parameters('creationScript.cmdArguments')]"
        }
    }
}
```

### Setup script logs

Logs from the setup script execution appear in the logs folder in the compute instance details page. Logs are stored back to your notebooks file share under the Logs\<compute instance name> folder. Script file and command arguments for a particular compute instance are shown in the details page.


## Manage

Start, stop, restart, and delete a compute instance. A compute instance does not automatically scale down, so make sure to stop the resource to prevent ongoing charges. Stopping a compute instance deallocates it. Then start it again when you need it. While stopping the compute instance stops the billing for compute hours, you will still be billed for disk, public IP, and standard load balancer. 

You can [create a schedule](#schedule) for the compute instance to automatically start and stop based on a time and day of week.

> [!TIP]
> The compute instance has 120GB OS disk. If you run out of disk space, [use the terminal](how-to-access-terminal.md) to clear at least 1-2 GB before you stop or restart the compute instance. Please do not stop the compute instance by issuing sudo shutdown from the terminal.

# [Python](#tab/python)

In the examples below, the name of the compute instance is **instance**

* Get status

    ```python
    # get_status() gets the latest status of the ComputeInstance target
    instance.get_status()
    ```

* Stop

    ```python
    # stop() is used to stop the ComputeInstance
    # Stopping ComputeInstance will stop the billing meter and persist the state on the disk.
    # Available Quota will not be changed with this operation.
    instance.stop(wait_for_completion=True, show_output=True)
    ```

* Start

    ```python
    # start() is used to start the ComputeInstance if it is in stopped state
    instance.start(wait_for_completion=True, show_output=True)
    ```

* Restart

    ```python
    # restart() is used to restart the ComputeInstance
    instance.restart(wait_for_completion=True, show_output=True)
    ```

* Delete

    ```python
    # delete() is used to delete the ComputeInstance target. Useful if you want to re-use the compute name
    instance.delete(wait_for_completion=True, show_output=True)
    ```

# [Azure CLI](#tab/azure-cli)

In the examples below, the name of the compute instance is **instance**

* Stop

    ```azurecli-interactive
    az ml computetarget stop computeinstance -n instance -v
    ```

    For more information, see [az ml computetarget stop computeinstance](/cli/azure/ml(v1)/computetarget/computeinstance#az_ml_computetarget_computeinstance_stop).

* Start

    ```azurecli-interactive
    az ml computetarget start computeinstance -n instance -v
    ```

    For more information, see [az ml computetarget start computeinstance](/cli/azure/ml(v1)/computetarget/computeinstance#az_ml_computetarget_computeinstance_start).

* Restart

    ```azurecli-interactive
    az ml computetarget restart computeinstance -n instance -v
    ```

    For more information, see [az ml computetarget restart computeinstance](/cli/azure/ml(v1)/computetarget/computeinstance#az_ml_computetarget_computeinstance_restart).

* Delete

    ```azurecli-interactive
    az ml computetarget delete -n instance -v
    ```

    For more information, see [az ml computetarget delete computeinstance](/cli/azure/ml(v1)/computetarget#az_ml_computetarget_delete).

# [Studio](#tab/azure-studio)
<a name="schedule"></a>

In your workspace in Azure Machine Learning studio, select **Compute**, then select **Compute Instance** on the top.

![Manage a compute instance](./media/concept-compute-instance/manage-compute-instance.png)

You can perform the following actions:

* Create a new compute instance
* Refresh the compute instances tab.
* Start, stop, and restart a compute instance.  You do pay for the instance whenever it is running. Stop the compute instance when you are not using it to reduce cost. Stopping a compute instance deallocates it. Then start it again when you need it. You can also schedule a time for the compute instance to start and stop.
* Delete a compute instance.
* Filter the list of compute instances to show only those you have created.

For each compute instance in a workspace that you created (or that was created for you), you can:

* Access Jupyter, JupyterLab, RStudio on the compute instance.
* SSH into compute instance. SSH access is disabled by default but can be enabled at compute instance creation time. SSH access is through public/private key mechanism. The tab will give you details for SSH connection such as IP address, username, and port number. In a virtual network deployment, disabling SSH prevents SSH access from public internet, you can still SSH from within virtual network using private IP address of compute instance node and port 22.
* Select the compute name to:
    * View details about a specific compute instance such as IP address, and region.
    * Create or modify the schedule for starting and stopping the compute instance (preview).  Scroll down to the bottom of the page to edit the schedule.

---

[Azure RBAC](../role-based-access-control/overview.md) allows you to control which users in the workspace can create, delete, start, stop, restart a compute instance. All users in the workspace contributor and owner role can create, delete, start, stop, and restart compute instances across the workspace. However, only the creator of a specific compute instance, or the user assigned if it was created on their behalf, is allowed to access Jupyter, JupyterLab, and RStudio on that compute instance. A compute instance is dedicated to a single user who has root access, and can terminal in through Jupyter/JupyterLab/RStudio. Compute instance will have single-user log in and all actions will use that user’s identity for Azure RBAC and attribution of experiment runs. SSH access is controlled through public/private key mechanism.

These actions can be controlled by Azure RBAC:
* *Microsoft.MachineLearningServices/workspaces/computes/read*
* *Microsoft.MachineLearningServices/workspaces/computes/write*
* *Microsoft.MachineLearningServices/workspaces/computes/delete*
* *Microsoft.MachineLearningServices/workspaces/computes/start/action*
* *Microsoft.MachineLearningServices/workspaces/computes/stop/action*
* *Microsoft.MachineLearningServices/workspaces/computes/restart/action*
* *Microsoft.MachineLearningServices/workspaces/computes/updateSchedules/action*

To create a compute instance you'll need permissions for the following actions:
* *Microsoft.MachineLearningServices/workspaces/computes/write*
* *Microsoft.MachineLearningServices/workspaces/checkComputeNameAvailability/action*


## Next steps

* [Access the compute instance terminal](how-to-access-terminal.md)
* [Create and manage files](how-to-manage-files.md)
* [Submit a training run](how-to-set-up-training-targets.md)
