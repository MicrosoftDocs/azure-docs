---
title: Create and manage a compute instance
titleSuffix: Azure Machine Learning
description: Learn how to create and manage an Azure Machine Learning compute instance. Use as your development environment, or as  compute target for dev/test purposes.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: event-tier1-build-2022
ms.topic: how-to
author: swatig007
ms.author: swatig
ms.reviewer: sgilley
ms.date: 09/21/2022
---

# Create and manage an Azure Machine Learning compute instance

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

> [!div class="op_single_selector" title1="Select the Azure Machine Learning SDK or CLI version you are using:"]
> * [v1](v1/how-to-create-manage-compute-instance.md)
> * [v2 (current version)](how-to-create-manage-compute-instance.md)

Learn how to create and manage a [compute instance](concept-compute-instance.md) in your Azure Machine Learning workspace.

Use a compute instance as your fully configured and managed development environment in the cloud. For development and testing, you can also use the instance as a [training compute target](concept-compute-target.md#train).   A compute instance can run multiple jobs in parallel and has a job queue. As a development environment, a compute instance can't be shared with other users in your workspace.

In this article, you learn how to:

* [Create](#create) a compute instance
* [Manage](#manage) (start, stop, restart, delete) a compute instance
* [Create  a schedule](#schedule-automatic-start-and-stop-preview) to automatically start and stop the compute instance (preview)

You can also [use a setup script (preview)](how-to-customize-compute-instance.md) to create the compute instance with your own custom environment.

Compute instances can run jobs securely in a [virtual network environment](how-to-secure-training-vnet.md), without requiring enterprises to open up SSH ports. The job executes in a containerized environment and packages your model dependencies in a Docker container.

> [!NOTE]
> This article shows CLI v2 in the sections below. If you are still using CLI v1, see [Create an Azure Machine Learning compute cluster CLI v1)](v1/how-to-create-manage-compute-instance.md).

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

* The [Azure CLI extension for Machine Learning service (v2)](https://aka.ms/sdk-v2-install), [Azure Machine Learning Python SDK (v2)](https://aka.ms/sdk-v2-install), or the [Azure Machine Learning Visual Studio Code extension](how-to-setup-vs-code.md).

* If using the Python SDK, [set up your development environment with a workspace](how-to-configure-environment.md).  Once your environment is set up, attach to the workspace in your Python script:

  [!INCLUDE [connect ws v2](../../includes/machine-learning-connect-ws-v2.md)]


## Create

> [!IMPORTANT]
> Items marked (preview) below are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

**Time estimate**: Approximately 5 minutes.

Creating a compute instance is a one time process for your workspace. You can reuse the compute as a development workstation or as a compute target for training. You can have multiple compute instances attached to your workspace. 

The dedicated cores per region per VM family quota and total regional quota, which applies to compute instance creation, is unified and shared with Azure Machine Learning training compute cluster quota. Stopping the compute instance doesn't release quota to ensure you'll be able to restart the compute instance. It isn't possible to change the virtual machine size of compute instance once it's created.

The following example demonstrates how to create a compute instance:

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=ci_basic)]

For more information on the classes, methods, and parameters used in this example, see the following reference documents:

* [`AmlCompute` class](/python/api/azure-ai-ml/azure.ai.ml.entities.amlcompute)
* [`ComputeInstance` class](/python/api/azure-ai-ml/azure.ai.ml.entities.computeinstance)

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

```azurecli
az ml compute create -f create-instance.yml
```

Where the file *create-instance.yml* is:

:::code language="yaml" source="~/azureml-examples-main/cli/resources/compute/instance-basic.yml":::


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
    |Compute name     |  <ul><li>Name is required and must be between 3 to 24 characters long.</li><li>Valid characters are upper and lower case letters, digits, and the  **-** character.</li><li>Name must start with a letter</li><li>Name needs to be unique across all existing computes within an Azure region. You'll see an alert if the name you choose isn't unique</li><li>If **-**  character is used, then it needs to be followed by at least one letter later in the name</li></ul>     |
    |Virtual machine type |  Choose CPU or GPU. This type can't be changed after creation     |
    |Virtual machine size     |  Supported virtual machine sizes might be restricted in your region. Check the [availability list](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines)     |

1. Select **Create** unless you want to configure advanced settings for the compute instance.
1. <a name="advanced-settings"></a> Select **Next: Advanced Settings** if you want to:

    * Enable SSH access.  Follow the [detailed SSH access instructions](#enable-ssh-access) below.
    * Enable virtual network. Specify the **Resource group**, **Virtual network**, and **Subnet** to create the compute instance inside an Azure Virtual Network (vnet). You can also select __No public IP__ (preview) to prevent the creation of a public IP address, which requires a private link workspace. You must also satisfy these [network requirements](./how-to-secure-training-vnet.md) for virtual network setup. 
    * Assign the computer to another user. For more about assigning to other users, see [Create on behalf of](#create-on-behalf-of-preview)
    * Provision with a setup script (preview) - for more information about how to create and use a setup script, see [Customize the compute instance with a script](how-to-customize-compute-instance.md).
    * Add schedule (preview). Schedule times for the compute instance to automatically start and/or shutdown. See [schedule details](#schedule-automatic-start-and-stop-preview) below.
    * Enable auto-stop (preview). Configure a compute instance to automatically shut down if it's inactive. For more information, see [configure auto-stop](#configure-auto-stop-preview).



You can also create a compute instance with an [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/machine-learning-compute-create-computeinstance).

### Enable SSH access

SSH access is disabled by default.  SSH access can't be changed after creation. Make sure to enable access if you plan to debug interactively with [VS Code Remote](how-to-set-up-vs-code-remote.md).  

[!INCLUDE [amlinclude-info](../../includes/machine-learning-enable-ssh.md)]

### Connect with SSH

[!INCLUDE [ssh-access](../../includes/machine-learning-ssh-access.md)]

---

## Configure auto-stop (preview)
To avoid getting charged for a compute instance that is switched on but inactive, you can configure auto-stop. 

A compute instance is considered inactive if the below conditions are met:
* No active Jupyter Kernel sessions (which translates to no Notebooks usage via Jupyter, JupyterLab or Interactive notebooks)
* No active Jupyter terminal sessions
* No active AzureML runs or experiments
* No SSH connections
* No VS code connections; you must close your VS Code connection for your compute instance to be considered inactive. Sessions are auto-terminated if VS code detects no activity for 3 hours. 

Activity on custom applications installed on the compute instance isn't considered. There are also some basic bounds around inactivity time periods; CI must be inactive for a minimum of 15 mins and a maximum of three days.

This setting can be configured during CI creation or for existing CIs via the following interfaces:
* AzureML Studio
    
    :::image type="content" source="media/how-to-create-attach-studio/idle-shutdown-advanced-settings.jpg" alt-text="Screenshot of the Advanced Settings page for creating a compute instance":::
    :::image type="content" source="media/how-to-create-attach-studio/idle-shutdown-update.jpg" alt-text="Screenshot of the compute instance details page showing how to update an existing compute instance with idle shutdown":::

* REST API

    Endpoint:
    ```
    POST https://management.azure.com/subscriptions/{SUB_ID}/resourceGroups/{RG_NAME}/providers/Microsoft.MachineLearningServices/workspaces/{WS_NAME}/computes/{CI_NAME}/updateIdleShutdownSetting?api-version=2021-07-01
    ```
    Body:
    ```JSON
    {
        "idleTimeBeforeShutdown": "PT30M" // this must be a string in ISO 8601 format
    }
    ```

* CLIv2 (YAML): only configurable during new CI creation

    ```YAML
    # Note that this is just a snippet for the idle shutdown property. Refer to the "Create" Azure CLI section for more information.
    idle_time_before_shutdown_minutes: 30
    ```

* Python SDKv2: only configurable during new CI creation

    ```Python
    ComputeInstance(name=ci_basic_name, size="STANDARD_DS3_v2", idle_time_before_shutdown_minutes="30")
    ```

* ARM Templates: only configurable during new CI creation
    ```JSON
    // Note that this is just a snippet for the idle shutdown property in an ARM template
    {
        "idleTimeBeforeShutdown":"PT30M" // this must be a string in ISO 8601 format
    }
    ```

### Azure policy support
Administrators can use a built-in [Azure Policy](./../governance/policy/overview.md) definition to enforce auto-stop on all compute instances in a given subscription/resource-group. 

1. Navigate to Azure Policy in the Azure portal.
2. Under "Definitions", look for the idle shutdown policy.

      :::image type="content" source="media/how-to-create-attach-studio/idle-shutdown-policy.png" alt-text="Screenshot for the idle shutdown policy in Azure portal.":::

3. Assign policy to the necessary scope.

You can also create your own custom Azure policy. For example, if the below policy is assigned, all new compute instances will have auto-stop configured with a 60-minute inactivity period. 

```json
{
  "mode": "All",
  "policyRule": {
    "if": {
      "allOf": [
        {
          "field": "type",
          "equals": "Microsoft.MachineLearningServices/workspaces/computes"
        },
        {
          "field": "Microsoft.MachineLearningServices/workspaces/computes/computeType",
          "equals": "ComputeInstance"
        },
        {
          "anyOf": [
            {
              "field": "Microsoft.MachineLearningServices/workspaces/computes/idleTimeBeforeShutdown",
              "exists": false
            },
            {
              "value": "[empty(field('Microsoft.MachineLearningServices/workspaces/computes/idleTimeBeforeShutdown'))]",
              "equals": true
            }
          ]
        }
      ]
    },
    "then": {
      "effect": "append",
      "details": [
        {
          "field": "Microsoft.MachineLearningServices/workspaces/computes/idleTimeBeforeShutdown",
          "value": "PT60M"
        }
      ]
    }
  },
  "parameters": {}
}
```


## Create on behalf of (preview)

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

## Schedule automatic start and stop (preview)

Define multiple schedules for auto-shutdown and auto-start. For instance, create a schedule to start at 9 AM and stop at 6 PM from Monday-Thursday, and a second schedule to start at 9 AM and stop at 4 PM for Friday.  You can create a total of four schedules per compute instance.

Schedules can also be defined for [create on behalf of](#create-on-behalf-of-preview) compute instances. You can create a schedule that creates the compute instance in a stopped state. Stopped compute instances are useful when you create a compute instance on behalf of another user.

### Create a schedule in studio

1. [Fill out the form](?tabs=azure-studio#create).
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


> [!NOTE]
> Timezone labels don't account for day light savings. For instance,  (UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna is actually UTC+02:00 during day light savings.

### Create a schedule with CLI

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

```azurecli
az ml compute create -f create-instance.yml
```

Where the file *create-instance.yml* is:

:::code language="yaml" source="~/azureml-examples-main/cli/resources/compute/instance-schedule.yml":::


### Create a schedule with a Resource Manager template

You can schedule the automatic start and stop of a compute instance by using a Resource Manager [template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/machine-learning-compute-create-computeinstance).

In the Resource Manager template, add:

```
"schedules": "[parameters('schedules')]"
```

Then use either cron or LogicApps expressions to define the schedule that starts or stops the instance in your parameter file:
 
```json
        "schedules": {
        "value": {
        "computeStartStop": [
          {
            "triggerType": "Cron",
            "cron": {              
              "timeZone": "UTC",
              "expression": "0 18 * * *"
            },
            "action": "Stop",
            "status": "Enabled"
          },
          {
            "triggerType": "Cron",
            "cron": {              
              "timeZone": "UTC",
              "expression": "0 8 * * *"
            },
            "action": "Start",
            "status": "Enabled"
          },
          { 
            "triggerType": "Recurrence", 
            "recurrence": { 
              "frequency": "Day", 
              "interval": 1, 
              "timeZone": "UTC", 
              "schedule": { 
                "hours": [17], 
                "minutes": [0]
              } 
            }, 
            "action": "Stop", 
            "status": "Enabled" 
          } 
        ]
      }
    }
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

### Azure Policy support to default a schedule
Use Azure Policy to enforce a shutdown schedule exists for every compute instance in a subscription or default to a schedule if nothing exists.
Following is a sample policy to default a shutdown schedule at 10 PM PST.
```json
{
    "mode": "All",
    "policyRule": {
     "if": {
      "allOf": [
       {
        "field": "Microsoft.MachineLearningServices/workspaces/computes/computeType",
        "equals": "ComputeInstance"
       },
       {
        "field": "Microsoft.MachineLearningServices/workspaces/computes/schedules",
        "exists": "false"
       }
      ]
     },
     "then": {
      "effect": "append",
      "details": [
       {
        "field": "Microsoft.MachineLearningServices/workspaces/computes/schedules",
        "value": {
         "computeStartStop": [
          {
           "triggerType": "Cron",
           "cron": {
            "startTime": "2021-03-10T21:21:07",
            "timeZone": "Pacific Standard Time",
            "expression": "0 22 * * *"
           },
           "action": "Stop",
           "status": "Enabled"
          }
         ]
        }
       }
      ]
     }
    }
}    
```

## Assign managed identity (preview)

You can assign a system- or user-assigned [managed identity](/azure/active-directory/managed-identities-azure-resources/overview) to a compute instance, to authenticate against other Azure resources such as storage. Using managed identities for authentication helps improve workspace security and management. For example, you can allow users to access training data only when logged in to a compute instance. Or use a common user-assigned managed identity to permit access to a specific storage account. 

You can create compute instance with managed identity from Azure ML Studio:

1.	Fill out the form to [create a new compute instance](?tabs=azure-studio#create).
1.	Select **Next: Advanced Settings**.
1.	Enable **Assign a managed identity**.
1.  Select **System-assigned** or **User-assigned** under **Identity type**.
1.  If you selected **User-assigned**, select subscription and name of the identity.

You can use V2 CLI to create compute instance with assign system-assigned managed identity:

```azurecli
az ml compute create --name myinstance --identity-type SystemAssigned --type ComputeInstance --resource-group my-resource-group --workspace-name my-workspace
```

You can also use V2 CLI with yaml file, for example to create a compute instance with user-assigned managed identity:

```azurecli
azure ml compute create --file compute.yaml --resource-group my-resource-group --workspace-name my-workspace
```

The identity definition is contained in compute.yaml file:

```yaml
https://azuremlschemas.azureedge.net/latest/computeInstance.schema.json
name: myinstance
type: computeinstance
identity:
  type: user_assigned
  user_assigned_identities: 
    - resource_id: identity_resource_id
```

Once the managed identity is created, enable [identity-based data access enabled](how-to-datastore.md) to your storage accounts for that identity. Then, when you work on the compute instance, the managed identity is used automatically to authenticate against data stores.

You can also use the managed identity manually to authenticate against other Azure resources. The following example shows how to use it to get an Azure Resource Manager access token:

```python
import requests

def get_access_token_msi(resource):
    client_id = os.environ.get("DEFAULT_IDENTITY_CLIENT_ID", None)
    resp = requests.get(f"{os.environ['MSI_ENDPOINT']}?resource={resource}&clientid={client_id}&api-version=2017-09-01", headers={'Secret': os.environ["MSI_SECRET"]})
    resp.raise_for_status()
    return resp.json()["access_token"]

arm_access_token = get_access_token_msi("https://management.azure.com")
```

## Add custom applications such as RStudio (preview)

You can set up other applications, such as RStudio, when creating a compute instance. Follow these steps in studio to set up a custom application on your compute instance

1.	Fill out the form to [create a new compute instance](?tabs=azure-studio#create)
1.	Select **Next: Advanced Settings**
1.	Select **Add application** under the **Custom application setup (RStudio Workbench, etc.)** section
 
:::image type="content" source="media/how-to-create-manage-compute-instance/custom-service-setup.png" alt-text="Screenshot showing Custom Service Setup.":::

### Setup RStudio Workbench

RStudio is one of the most popular IDEs among R developers for ML and data science projects. You can easily set up RStudio Workbench to run on your compute instance, using your own RStudio license, and access the rich feature set that RStudio Workbench offers.

1.	Follow the steps listed above to **Add application** when creating your compute instance.
1.	Select **RStudio Workbench (bring your own license)** in the **Application** dropdown and enter your RStudio Workbench license key in the **License key** field. You can get your RStudio Workbench license or trial license [from RStudio](https://www.rstudio.com/). 
1. Select **Create** to add RStudio Workbench application to your compute instance.
 
:::image type="content" source="media/how-to-create-manage-compute-instance/rstudio-workbench.png" alt-text="Screenshot shows RStudio settings." lightbox="media/how-to-create-manage-compute-instance/rstudio-workbench.png":::

[!INCLUDE [private link ports](../../includes/machine-learning-private-link-ports.md)]

> [!NOTE]
> * Support for accessing your workspace file store from RStudio is not yet available.
> * When accessing multiple instances of RStudio, if you see a "400 Bad Request. Request Header Or Cookie Too Large" error, use a new browser or access from a browser in incognito mode.
> * Shiny applications are not currently supported on RStudio Workbench.
 

### Setup RStudio open source

To use RStudio open source, set up a custom application as follows:

1.	Follow the steps listed above to **Add application** when creating your compute instance.
1.	Select **Custom Application** on the **Application** dropdown 
1.	Configure the **Application name** you would like to use.
1. Set up the application to run on **Target port** `8787` - the docker image for RStudio open source listed below needs to run on this Target port. 

1. Set up the application to be accessed on **Published port** `8787` - you can configure the application to be accessed on a different Published port if you wish.
1. Point the **Docker image** to `ghcr.io/azure/rocker-rstudio-ml-verse:latest`. 
1. Use **Bind mounts** to add access to the files in your default storage account: 
   * Specify **/home/azureuser/cloudfiles** for **Host path**.  
   * Specify **/home/azureuser/cloudfiles** for the **Container path**.
   * Select **Add** to add this mounting.  Because the files are mounted, changes you make to them will be available in other compute instances and applications.
1. Select **Create** to set up RStudio as a custom application on your compute instance.

:::image type="content" source="media/how-to-create-manage-compute-instance/rstudio-open-source.png" alt-text="Screenshot shows form to set up RStudio as a custom application" lightbox="media/how-to-create-manage-compute-instance/rstudio-open-source.png":::

[!INCLUDE [private link ports](../../includes/machine-learning-private-link-ports.md)]
 
### Setup other custom applications

Set up other custom applications on your compute instance by providing the application on a Docker image.

1. Follow the steps listed above to **Add application** when creating your compute instance.
1. Select **Custom Application** on the **Application** dropdown. 
1. Configure the **Application name**, the **Target port** you wish to run the application on, the **Published port** you wish to access the application on and the **Docker image** that contains your application.
1. Optionally, add **Environment variables**  you wish to use for your application.
1. Use **Bind mounts** to add access to the files in your default storage account: 
   * Specify **/home/azureuser/cloudfiles** for **Host path**.  
   * Specify **/home/azureuser/cloudfiles** for the **Container path**.
   * Select **Add** to add this mounting.  Because the files are mounted, changes you make to them will be available in other compute instances and applications.
1. Select **Create** to set up the custom application on your compute instance.

:::image type="content" source="media/how-to-create-manage-compute-instance/custom-service.png" alt-text="Screenshot show custom application settings." lightbox="media/how-to-create-manage-compute-instance/custom-service.png":::

[!INCLUDE [private link ports](../../includes/machine-learning-private-link-ports.md)]

### Accessing custom applications in studio

Access the custom applications that you set up in studio:

1. On the left, select **Compute**.
1. On the **Compute instance** tab, see your applications under the **Applications** column.

:::image type="content" source="media/how-to-create-manage-compute-instance/custom-service-access.png" alt-text="Screenshot shows studio access for your custom applications.":::
> [!NOTE]
> It might take a few minutes after setting up a custom application until you can access it via the links above. The amount of time taken will depend on the size of the image used for your custom application. If you see a 502 error message when trying to access the application, wait for some time for the application to be set up and try again.

## Manage

Start, stop, restart, and delete a compute instance. A compute instance doesn't automatically scale down, so make sure to stop the resource to prevent ongoing charges. Stopping a compute instance deallocates it. Then start it again when you need it. While stopping the compute instance stops the billing for compute hours, you'll still be billed for disk, public IP, and standard load balancer. 

You can [create a schedule](#schedule-automatic-start-and-stop-preview) for the compute instance to automatically start and stop based on a time and day of week.

> [!TIP]
> The compute instance has 120GB OS disk. If you run out of disk space, [use the terminal](how-to-access-terminal.md) to clear at least 1-2 GB before you stop or restart the compute instance. Please do not stop the compute instance by issuing sudo shutdown from the terminal. The temp disk size on compute instance depends on the VM size chosen and is mounted on /mnt.

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]


In the examples below, the name of the compute instance is stored in the variable `ci_basic_name`.

* Get status

  [!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=ci_basic_state)]


* Stop

  [!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=stop_compute)]


* Start

  [!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=start_compute)]


* Restart

  [!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=restart_compute)]


* Delete

  [!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=delete_compute)]


# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

In the examples below, the name of the compute instance is **instance**, in workspace **my-workspace**, in resource group **my-resource-group**.

* Stop

    ```azurecli
    az ml compute stop --name instance --resource-group my-resource-group --workspace-name my-workspace
    ```

* Start

    ```azurecli
    az ml compute start --name instance --resource-group my-resource-group --workspace-name my-workspace
    ```

* Restart

    ```azurecli
    az ml compute restart --name instance --resource-group my-resource-group --workspace-name my-workspace
    ```

* Delete

    ```azurecli
    az ml compute delete --name instance --resource-group my-resource-group --workspace-name my-workspace
    ```

# [Studio](#tab/azure-studio)
<a name="schedule"></a>

In your workspace in Azure Machine Learning studio, select **Compute**, then select **compute instance** on the top.

![Manage a compute instance](./media/concept-compute-instance/manage-compute-instance.png)

You can perform the following actions:

* Create a new compute instance
* Refresh the compute instances tab.
* Start, stop, and restart a compute instance.  You do pay for the instance whenever it's running. Stop the compute instance when you aren't using it to reduce cost. Stopping a compute instance deallocates it. Then start it again when you need it. You can also schedule a time for the compute instance to start and stop.
* Delete a compute instance.
* Filter the list of compute instances to show only ones you've created.

For each compute instance in a workspace that you created (or that was created for you), you can:

* Access Jupyter, JupyterLab, RStudio on the compute instance.
* SSH into compute instance. SSH access is disabled by default but can be enabled at compute instance creation time. SSH access is through public/private key mechanism. The tab will give you details for SSH connection such as IP address, username, and port number. In a virtual network deployment, disabling SSH prevents SSH access from public internet, you can still SSH from within virtual network using private IP address of compute instance node and port 22.
* Select the compute name to:
    * View details about a specific compute instance such as IP address, and region.
    * Create or modify the schedule for starting and stopping the compute instance (preview).  Scroll down to the bottom of the page to edit the schedule.

---

[Azure RBAC](../role-based-access-control/overview.md) allows you to control which users in the workspace can create, delete, start, stop, restart a compute instance. All users in the workspace contributor and owner role can create, delete, start, stop, and restart compute instances across the workspace. However, only the creator of a specific compute instance, or the user assigned if it was created on their behalf, is allowed to access Jupyter, JupyterLab, and RStudio on that compute instance. A compute instance is dedicated to a single user who has root access.  That user has access to Jupyter/JupyterLab/RStudio running on the instance. Compute instance will have single-user sign-in and all actions will use that user’s identity for Azure RBAC and attribution of experiment jobs. SSH access is controlled through public/private key mechanism.

These actions can be controlled by Azure RBAC:
* *Microsoft.MachineLearningServices/workspaces/computes/read*
* *Microsoft.MachineLearningServices/workspaces/computes/write*
* *Microsoft.MachineLearningServices/workspaces/computes/delete*
* *Microsoft.MachineLearningServices/workspaces/computes/start/action*
* *Microsoft.MachineLearningServices/workspaces/computes/stop/action*
* *Microsoft.MachineLearningServices/workspaces/computes/restart/action*
* *Microsoft.MachineLearningServices/workspaces/computes/updateSchedules/action*

To create a compute instance, you'll need permissions for the following actions:
* *Microsoft.MachineLearningServices/workspaces/computes/write*
* *Microsoft.MachineLearningServices/workspaces/checkComputeNameAvailability/action*

## Next steps

* [Access the compute instance terminal](how-to-access-terminal.md)
* [Create and manage files](how-to-manage-files.md)
* [Update the compute instance to the latest VM image](concept-vulnerability-management.md#compute-instance)
* [Submit a training job](v1/how-to-set-up-training-targets.md)
