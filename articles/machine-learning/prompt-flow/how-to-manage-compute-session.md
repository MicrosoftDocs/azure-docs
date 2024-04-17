---
title: Manage prompt flow compute session
titleSuffix: Azure Machine Learning
description: Learn how to manage prompt flow compute session in Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - build-2024
ms.topic: how-to
author: cloga
ms.author: lochen
ms.reviewer: lagayhar
ms.date: 04/1/2024
---

# Manage prompt flow compute session in Azure Machine Learning studio

A prompt flow compute session provides computing resources that are required for the application to run, including a Docker image that contains all necessary dependency packages. This reliable and scalable environment enables prompt flow to efficiently execute its tasks and functions for a seamless user experience.

## Permissions and roles for compute session management

To assign roles, you need to have `owner` or `Microsoft.Authorization/roleAssignments/write` permission on the resource.

For users of the compute session, assign the `AzureML Data Scientist` role in the workspace . To learn more, see [Manage access to an Azure Machine Learning workspace](../how-to-assign-roles.md?view=azureml-api-2&tabs=labeler&preserve-view=true).

Role assignment might take several minutes to take effect.

## Start a compute session on the UI

Before you use Azure Machine Learning studio to start a compute session, make sure that:

- You have the `AzureML Data Scientist` role in the workspace.
- The default data store (usually `workspaceblobstore`) in your workspace is the blob type.
- The working directory (`workspaceworkingdirectory`) exists in the workspace.
- If you use a virtual network for prompt flow, you understand the considerations in [Network isolation in prompt flow](how-to-secure-prompt-flow.md).

### Start and manage an compute session on a flow page

One flow will bind to one compute session. You can start an compute session on a flow page.

- Select **Start**. Start an compute session by using the environment defined in `flow.dag.yaml` in the flow folder, it runs on the virtual machine (VM) size of serverless compute which you have enough quota in the workspace.

  :::image type="content" source="./media/how-to-manage-compute-session/start-compute-session.png" alt-text="Screenshot of prompt flow with default settings for starting an compute session on a flow page." lightbox = "./media/how-to-manage-compute-session/start-compute-session.png":::

- Select **Start with advanced settings**. In the advanced settings, you can:

  - Select compute type. You can choose between serverless compute and compute instance. 
    - If you choose serverless compute, you can set following settings:
        - Customize the VM size that the compute session uses.
        - Customize the idle time, which will delete the compute session automatically if it isn't in use for a while.
        - Set the user-assigned managed identity. The compute session uses this identity to pull a base image, auth with connection and install packages. Make sure that the user-assigned managed identity has enough permission. If you don't set this identity, we use the user identity by default. 

        :::image type="content" source="./media/how-to-manage-compute-session/start-compute-session-with-advanced-settings.png" alt-text="Screenshot of prompt flow with advanced settings using serverless compute for starting an compute session on a flow page." lightbox = "./media/how-to-manage-compute-session/start-compute-session-with-advanced-settings.png":::

        - You can use following CLI command to assign UAI to workspace. [Learn more about how to create and update user-assigned identities for a workspace](../how-to-identity-based-service-authentication.md#to-create-a-workspace-with-multiple-user-assigned-identities-use-one-of-the-following-methods). 


        ```azurecli
        az ml workspace update -f workspace_update_with_multiple_UAIs.yml --subscription <subscription ID> --resource-group <resource group name> --name <workspace name>
        ```
        
        Where the contents of *workspace_update_with_multiple_UAIs.yml* are as follows:
        
        ```yaml
        identity:
           type: system_assigned, user_assigned
           user_assigned_identities:
            '/subscriptions/<subscription_id>/resourcegroups/<resource_group_name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<uai_name>': {}
            '<UAI resource ID 2>': {}
        primary_user_assigned_identity: <one of the UAI resource IDs in the above list>
        ```

        > [!TIP]
        > The following [Azure RBAC role assignments](../../role-based-access-control/role-assignments.md) are required on your user-assigned managed identity for your Azure Machine Learning workspace to access data on the workspace-associated resources.
        
        |Resource|Permission|
        |---|---|
        |Azure Machine Learning workspace|Contributor|
        |Azure Storage|Contributor (control plane) + Storage Blob Data Contributor + Storage File Data Privileged Contributor (data plane,consume flow draft in fileshare and data in blob)|
        |Azure Key Vault (when using [RBAC permission model](../../key-vault/general/rbac-guide.md))|Contributor (control plane) + Key Vault Administrator (data plane)|
        |Azure Key Vault (when using [access policies permission model](../../key-vault/general/assign-access-policy.md))|Contributor + any access policy permissions besides **purge** operations|
        |Azure Container Registry|Contributor|
        |Azure Application Insights|Contributor|

    - If you choose compute instance as compute type, you can only set idle shutdown time. 
        - As it is running on an existing compute instance the VM size is fixed and cannot change in session side.
        - Identity used for this session is also defined in compute instance, by default it uses the user identity. [Learn more about how to assign identity to compute instance](../how-to-create-compute-instance.md#assign-managed-identity)
        - For the idle shutdown time it is used to define life cycle of the compute session, if the session is idle for the time you set, it will be deleted automatically. And of you have idle shut down enabled on compute instance, then it will take effect from compute level.

            :::image type="content" source="./media/how-to-manage-compute-session/start-compute-session-with-advanced-settings-compute-instance.png" alt-text="Screenshot of prompt flow with advanced settings using compute instance for starting an compute session on a flow page." lightbox = "./media/how-to-manage-compute-session/start-compute-session-with-advanced-settings-compute-instance.png":::
        - Learn more about [how to create and manage compute instance](../how-to-create-compute-instance.md)

## Use a compute session to submit a flow run in CLI/SDK

Same as authoring UI, you can also specify the compute session in CLI/SDK when you submit a flow run.

# [Azure CLI](#tab/cli)

You can also specify the instance type or compute instance name under resource part. If you don't specify the instance type or compute instance name,  Azure Machine Learning chooses an instance type (VM size) based on factors like quota, cost, performance and disk size. Learn more about [serverless compute](../how-to-use-serverless-compute.md).

```yaml
$schema: https://azuremlschemas.azureedge.net/promptflow/latest/Run.schema.json
flow: <path_to_flow>
data: <path_to_flow>/data.jsonl

# specify identity used by serverless compute.
# default value
# identity:
#   type: user_identity 

# use workspace primary UAI
# identity:
#   type: managed
  
# use specified client_id's UAI
# identity:
#   type: managed
#   client_id: xxx

column_mapping:
  url: ${data.url}

# define cloud resource

resources:
  instance_type: <instance_type> # serverless compute type
  # compute: <compute_instance_name> # use compute instance as compute type

```

Submit this run via CLI:

```sh
pfazure run create --file run.yml
```

# [Python SDK](#tab/python)

```python
# load flow
flow = "<path_to_flow>"
data = "<path_to_flow>/data.jsonl"


# define cloud resource

# define instance type
# case 1: use serverless compute type
resources = {"instance_type": <instance_type>}
# case 2: use compute instance compute type
# resources = {"compute": <compute_instance_name>}

# create run
base_run = pf.run(
    flow=flow,
    data=data,
    # identity = {'type': 'managed', 'client_id': '<client_id>'}, # specify identity used by serverless compute.
   resources = resources, # specify compute resource used by .
    column_mapping={
        "url": "${data.url}"
    }, 
)
print(base_run)
```

Learn full end to end code first example: [Integrate prompt flow with LLM-based application DevOps](./how-to-integrate-with-llm-app-devops.md)

---

  > [!NOTE]
  > The idle shutdown is one hour if you are using CLI/SDK to submit a flow run. You can go to compute page to release compute

### Reference files outside of the flow folder
Sometimes, you might want to reference a `requirements.txt` file that is outside of the flow folder. For example, you might have complex project that includes multiple flows, and they share the same `requirements.txt` file. To do this, You can add this field `additional_includes` into the `flow.dag.yaml`. The value of this field is a list of the relative file/folder path to the flow folder. For example, if requirements.txt is in the parent folder of the flow folder, you can add `../requirements.txt` to the `additional_includes` field.

```yaml
inputs:
  question:
    type: string
outputs:
  output:
    type: string
    reference: ${answer_the_question_with_context.output}
environment:
  python_requirements_txt: requirements.txt
additional_includes:
  - ../requirements.txt
...
```

The `requirements.txt` file is copied to the flow folder, and use it to start your compute session.

## Update a compute session on the flow page UI

On a flow page, you can use the following options to manage an compute session:

- **Change compute session settings**, you change compute settings like VM size and e user-assigned managed identity for serverless compute, if you are using compute instance you can change to use other instance. You can also change 
-   can also change the user-assigned managed identity for serverless compute. If you change the VM size, the compute session will be reset with the new VM size. If you
- **Install packages** Open `requirements.txt` in prompt flow UI, you can add packages in it.
- **View installed packages** shows the packages that are installed in the runtime. It includes the packages baked to base image and packages specify in the `requirements.txt` file in the flow folder.
- **Reset** deletes the current runtime and creates a new one with the same environment. If you encounter a package conflict issue, you can try this option.
- **Edit** opens the runtime configuration page, where you can define the VM side and the idle time for the runtime.
- **Stop** deletes the current runtime. If there's no active runtime on the underlying compute, the compute resource is also deleted.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-create-automatic-actions.png" alt-text="Screenshot of actions for an automatic runtime on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-create-automatic-actions.png":::

You can also customize the environment that you use to run this flow by adding packages in the `requirements.txt` file in the flow folder. After you add more packages in this file, you can choose either of these options:

- **Save and install** triggers `pip install -r requirements.txt` in the flow folder. The process can take a few minutes, depending on the packages that you install.
- **Save only** just saves the `requirements.txt` file. You can install the packages later yourself.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-create-automatic-save-install.png" alt-text="Screenshot of the option to save and install packages for an automatic runtime on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-create-automatic-save-install.png":::

> [!NOTE]
> You can change the location and even the file name of `requirements.txt`, but be sure to also change it in the `flow.dag.yaml` file in the flow folder.
>
> Don't pin the version of `promptflow` and `promptflow-tools` in `requirements.txt`, because we already include them in the session base image.
> 
> `requirements.txt` didn't support local wheel file, you need build them in your image and update customize base image in `flow.dag.yaml`. Learn more [how to build custom base image](how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime)

#### Add packages in a private feed in Azure DevOps

If you want to use a private feed in Azure DevOps, follow these steps:

1. Assign managed identity to workspace or compute instance.
    1. Use serverless compute as automatic runtime, you need assign user-assigned managed identity to workspace.
        1. Create a user-assigned managed identity and add this identity in the Azure DevOps organization. To learn more, see [Use service principals and managed identities](/azure/devops/integrate/get-started/authentication/service-principal-managed-identity).

            > [!NOTE]
            > If the **Add Users** button isn't visible, you probably don't have the necessary permissions to perform this action.
        
        2. [Add or update user-assigned identities to a workspace](../how-to-identity-based-service-authentication.md#to-create-a-workspace-with-multiple-user-assigned-identities-use-one-of-the-following-methods).

            > [!NOTE]
            > Please make sure the user-assigned managed identity has `Microsoft.KeyVault/vaults/read` on the workspace linked keyvault.
  
    2. Use compute instance as automatic runtime, you need [assign a user-assigned managed identity to a compute instance](../how-to-create-compute-instance.md#assign-managed-identity).

2. Add `{private}` to your private feed URL. For example, if you want to install `test_package` from `test_feed` in Azure DevOps, add `-i https://{private}@{test_feed_url_in_azure_devops}` in `requirements.txt`:

   ```txt
   -i https://{private}@{test_feed_url_in_azure_devops}
   test_package
   ```

3. Specify using user-assigned managed identity in the runtime configuration. 
    1. If you are using serverless compute, specify the user-assigned managed identity in **Start with advanced settings** if automatic runtime isn't running, or use the **Edit** button if automatic runtime is running.

       :::image type="content" source="./media/how-to-create-manage-runtime/runtime-advanced-setting-msi.png" alt-text="Screenshot that shows the toggle for using a workspace user-assigned managed identity. " lightbox = "./media/how-to-create-manage-runtime/runtime-advanced-setting-msi.png":::
    2. If you are using compute instance, it will use the user-assigned managed identity that you assigned to the compute instance.


> [!NOTE]
> This approach mainly focuses on quick testing in flow develop phase, if you also want to deploy this flow as endpoint please build this private feed in your image and update customize base image in `flow.dag.yaml`. Learn more [how to build custom base image](how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime)

#### Change the base image for automatic runtime (preview)

By default, we use the latest prompt flow image as the base image. If you want to use a different base image, you can [build a custom one](how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime). Then, put the new base image under `environment` in the `flow.dag.yaml` file in the flow folder. To use the new base image, you need to reset the runtime via the `reset` command. This process takes several minutes as it pulls the new base image and reinstalls packages.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-automatic-image-flow-dag.png" alt-text="Screenshot of actions for customizing an environment for an automatic runtime on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-automatic-image-flow-dag.png":::

```yaml
environment:
    image: <your-custom-image>
    python_requirements_txt: requirements.txt
```


## Relationship between runtime, compute resource, flow and user

- One single user can have multiple compute resources (serverless or compute instance). Base on customer different need, we allow single user to have multiple compute resources. For example, one user can have multiple compute resources with different VM size. You can find 
- One compute resource can only be used by single user. Compute resource is model as private dev box of single user, so we didn't allow multiple user share same compute resources. In AI studio case, different user can join different project and data and other asset need to be isolated, so we didn't allow multiple user share same compute resources.
- One compute resource can host multiple runtimes. Runtime is container running on underlying compute resource, as in common case, prompt flow authoring didn't need too many compute resources, we allow single compute resource to host multiple runtimes from same user. 
- One runtime only belongs to single compute resource in same time. But you can delete or stop runtime and reallocate it to other compute resource.
- In automatic runtime, one flow only have one runtime, as we expect each flow is self contained it defined the base image and required python package in flow folder. In compute instance runtime, you can run different flow on same compute instance runtime, but you need make sure the packages and image is compatible.

## Switch compute instance runtime to compute session

Compute session has following advantages over compute instance runtime:
- Automatic manage lifecycle of session and underlying compute. You don't need to manually create and managed them anymore.
- Easily customize packages by adding packages in the `requirements.txt` file in the flow folder, instead of creating a custom environment.

You can switch it to an compute session by using the following steps:
- Prepare your `requirements.txt` file in the flow folder. Make sure that you don't pin the version of `promptflow` and `promptflow-tools` in `requirements.txt`, because we already include them in the base image. Compute session will install the packages in `requirements.txt` file when it starts.
- If you create custom environment to create compute instance runtime, you can also use get the image from environment detail page, and specify it in `flow.dag.yaml` file in the flow folder.  To learn more, see [Change the base image for automatic runtime (preview)](#change-the-base-image-for-automatic-runtime-preview). Make sure you have `acr pull` permission for the image.

:::image type="content" source="./media/how-to-create-manage-runtime/image-path-environment-detail.png" alt-text="Screenshot of finding image in environment detail page." lightbox = "./media/how-to-create-manage-runtime/image-path-environment-detail.png":::

- For compute resource, you can continue to use the existing compute instance if you would like to manually manage the lifecycle of compute resource or you can try serverless compute which lifecycle is managed by system.

## Next steps

- [Develop a standard flow](how-to-develop-a-standard-flow.md)
- [Develop a chat flow](how-to-develop-a-chat-flow.md)
