---
title: Create and manage prompt flow runtimes
titleSuffix: Azure Machine Learning
description: Learn how to create and manage prompt flow runtimes in Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: how-to
author: cloga
ms.author: lochen
ms.reviewer: lagayhar
ms.date: 02/26/2024
---

# Create and manage prompt flow runtimes in Azure Machine Learning studio

A prompt flow runtime provides computing resources that are required for the application to run, including a Docker image that contains all necessary dependency packages. This reliable and scalable runtime environment enables prompt flow to efficiently execute its tasks and functions for a seamless user experience.

Azure Machine Learning supports the following types of runtimes:

|Runtime type|Underlying compute type|Life cycle management|Customize environment              |
|------------|----------------------|---------------------|---------------------|
|Automatic runtime (preview)        |[Serverless compute](../how-to-use-serverless-compute.md) and [Compute instance](../how-to-create-compute-instance.md)| Automatic | Easily customize packages|
|Compute instance runtime | [Compute instance](../how-to-create-compute-instance.md) | Manual | Manually customize via Azure Machine Learning environment|

If you're a new user, we recommend that you use the automatic runtime (preview). You can easily customize the environment by adding packages in the `requirements.txt` file in `flow.dag.yaml` in the flow folder. 

If you want manage compute resource by your self, you can use compute instance as compute type in automatic runtime or use compute instance runtime.

## Permissions and roles for runtime management

To assign roles, you need to have `owner` or `Microsoft.Authorization/roleAssignments/write` permission on the resource.

For users of the runtime, assign the `AzureML Data Scientist` role in the workspace (if you're using a compute instance as a runtime) or endpoint (if you're using a managed online endpoint as a runtime). To learn more, see [Manage access to an Azure Machine Learning workspace](../how-to-assign-roles.md?view=azureml-api-2&tabs=labeler&preserve-view=true).

Role assignment might take several minutes to take effect.

## Permissions and roles for deployments

After you deploy a prompt flow, the endpoint must be assigned the `AzureML Data Scientist` role to the workspace for successful inferencing. You can do this operation at any time after you create the endpoint.

## Create a runtime on the UI

Before you use Azure Machine Learning studio to create a runtime, make sure that:

- You have the `AzureML Data Scientist` role in the workspace.
- The default data store (usually `workspaceblobstore`) in your workspace is the blob type.
- The working directory (`workspaceworkingdirectory`) exists in the workspace.
- If you use a virtual network for prompt flow, you understand the considerations in [Network isolation in prompt flow](how-to-secure-prompt-flow.md).

### Create an automatic runtime (preview) on a flow page

Automatic is the default option for a runtime. You can start an automatic runtime (preview) by selecting an option from the runtime dropdown list on a flow page.

> [!IMPORTANT]
> Automatic runtime is currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

- Select **Start**. Start creating an automatic runtime (preview) by using the environment defined in `flow.dag.yaml` in the flow folder, it runs on the virtual machine (VM) size of serverless compute which you have enough quota in the workspace.

  :::image type="content" source="./media/how-to-create-manage-runtime/runtime-create-automatic-init.png" alt-text="Screenshot of prompt flow with default settings for starting an automatic runtime on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-create-automatic-init.png":::

- Select **Start with advanced settings**. In the advanced settings, you can:

  - Select compute type. You can choose between serverless compute and compute instance. 
    - If you choose serverless compute, you can set following settings:
        - Customize the VM size that the runtime uses.
        - Customize the idle time, which saves code by deleting the runtime automatically if it isn't in use.
        - Set the user-assigned managed identity. The automatic runtime uses this identity to pull a base image and install packages. Make sure that the user-assigned managed identity has Azure Container Registry `acrpull` permission. If you don't set this identity, we use the user identity by default. [Learn more about how to create and update user-assigned identities for a workspace](../how-to-identity-based-service-authentication.md#to-create-a-workspace-with-multiple-user-assigned-identities-use-one-of-the-following-methods). 

            :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-automatic-settings.png" alt-text="Screenshot of prompt flow with advanced settings using serverless compute for starting an automatic runtime on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-automatic-settings.png":::

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

    - If you choose compute instance, you can only set idle shutdown time. 
        - As it is running on an existing compute instance the VM size is fixed and cannot change in runtime side.
        - Identity used for this runtime also is defined in compute instance, by default it uses the user identity. [Learn more about how to assign identity to compute instance](../how-to-create-compute-instance.md#assign-managed-identity)
        - For the idle shutdown time it is used to define life cycle of the runtime, if the runtime is idle for the time you set, it will be deleted automatically. And of you have idle shut down enabled on compute instance, then it will continue 

            :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-automatic-compute-instance-settings.png" alt-text="Screenshot of prompt flow with advanced settings using compute instance for starting an automatic runtime on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-automatic-compute-instance-settings.png":::


### Create a compute instance runtime on a runtime page

Before you create a compute instance runtime, make sure that a compute instance is available and running. If you don't have a compute instance, [create one in an Azure Machine Learning workspace](../how-to-create-compute-instance.md).

1. On the page that lists runtimes, select **Create**.
  
   :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add.png" alt-text="Screenshot of the page that lists runtimes and the button for creating a runtime." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add.png":::

1. Select the compute instance that you want to use as a runtime.
  
   :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-ci.png" alt-text="Screenshot of the box for selecting a compute instance." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-ci.png":::

   Because compute instances are isolated by user, only your own compute instances (or the ones assigned to you) are available. To learn more, see [Create and manage an Azure Machine Learning compute instance](../how-to-create-compute-instance.md).

1. Select the **Authenticate** button to authenticate on the compute instance. You need to authenticate only one time per region in six months.

   :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-authentication.png" alt-text="Screenshot of the button for authenticating on a compute instance." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-authentication.png":::

1. Decide whether to create a custom application or select an existing one as a runtime:

   - To create a custom application, under **Custom application**, select **New**.

     :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-custom-application.png" alt-text="Screenshot of the option for creating a new custom application." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-custom-application.png":::

     We recommend this option for most users of prompt flow. The prompt flow system creates a new custom application on a compute instance as a runtime.

     Under **Environment**, if you want to use the default environment, select **Use default environment**. We recommend this choice for new users of prompt flow.

     :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-default-env.png" alt-text="Screenshot of the option for using a default environment." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-default-env.png":::

     If you want to install other packages in your project, you should use a custom environment. Select **Use customized environment**, and then choose an environment from the list that appears. To learn how to build your own custom environment, see [Customize an environment with a Docker context for a runtime](how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime).

     :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-custom-env.png" alt-text="Screenshot of the option for using a customized environment, along with a list of environments." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-custom-env.png":::

     > [!NOTE]
     > Your compute instance restarts automatically. Ensure that no tasks or jobs are running on it, because the restart might affect them.

   - To use an existing custom application as a runtime, under **Custom application**, select **Existing**. Then select an application in the **Custom application** box.

     This option is available if you previously created a custom application on a compute instance. [Learn more about how to create and use a custom application as a runtime](how-to-customize-environment-runtime.md#create-a-custom-application-on-compute-instance-that-can-be-used-as-prompt-flow-compute-instance-runtime).

     :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-existing-custom-application-ui.png" alt-text="Screenshot of the option to use an existing custom application and the box for selecting an application." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-existing-custom-application-ui.png":::

## Use a runtime in prompt flow authoring UI

When you're authoring a flow, you can select and change the runtime from the **Runtime** dropdown list on the upper right of the flow page.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-authoring-dropdown.png" alt-text="Screenshot of a flow page and the dropdown list for selecting a runtime." lightbox = "./media/how-to-create-manage-runtime/runtime-authoring-dropdown.png":::

When you're performing evaluation, you can use the original runtime in the flow or change to a more powerful runtime.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-authoring-bulktest.png" alt-text="Screenshot of runtime details on the wizard page for configuring an evaluation." lightbox = "./media/how-to-create-manage-runtime/runtime-authoring-bulktest.png":::

## Use a runtime to submit a flow run in CLI/SDK

Same as authoring UI, you can also specify the runtime in CLI/SDK when you submit a flow run.

# [Azure CLI](#tab/cli)

In your `run.yml` you can specify the runtime name or use the automatic runtime. If you specify the runtime name, it uses the runtime with the name you specified. If you specify automatic, it uses the automatic runtime. If you don't specify the runtime, it uses the automatic runtime by default.

In automatic runtime case, you can also specify the instance type or compute instance name under resource part. If you don't specify the instance type or compute instance name,  Azure Machine Learning chooses an instance type (VM size) based on factors like quota, cost, performance and disk size. Learn more about [serverless compute](../how-to-use-serverless-compute.md).

```yaml
$schema: https://azuremlschemas.azureedge.net/promptflow/latest/Run.schema.json
flow: <path_to_flow>
data: <path_to_flow>/data.jsonl

# specify identity used by serverless compute for automatic runtime.
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
# if omitted, it will use the automatic runtime, you can also specify the runtime name, specify automatic will also use the automatic runtime.
# runtime: <runtime_name> 


# define instance type only work for automatic runtime, will be ignored if you specify the runtime name.
resources:
  instance_type: <instance_type>
  # compute: <compute_instance_name> # use compute instance as compute type for automatic runtime

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

# runtime = <runtime_name>

# define instance type
# case 1: use automatic runtime
resources = {"instance_type": <instance_type>}
# case 2: use compute instance runtime
# resources = {"compute": <compute_instance_name>}

# create run
base_run = pf.run(
    flow=flow,
    data=data,
    # identity = {'type': 'managed', 'client_id': '<client_id>'}, # specify identity used by serverless compute for automatic runtime.
    # runtime=runtime, # if omitted, it will use the automatic runtime, you can also specify the runtime name, specif automatic will also use the automatic runtime.
   resources = resources, # only work for automatic runtime, will be ignored if you specify the runtime name.
    column_mapping={
        "url": "${data.url}"
    }, 
)
print(base_run)
```

Learn full end to end code first example: [Integrate prompt flow with LLM-based application DevOps](./how-to-integrate-with-llm-app-devops.md)

---

  > [!NOTE]
  > If you are using automatic runtime to submit promptflow run, the idle shutdown is one hour.

### Reference files outside of the flow folder - automatic runtime only
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

When you submit flow run using automatic runtime, the `requirements.txt` file is copied to the flow folder, and use it to start your automatic runtime.

## Update a runtime on the UI

### Update an automatic runtime (preview) on a flow page

On a flow page, you can use the following options to manage an automatic runtime (preview):

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
> Don't pin the version of `promptflow` and `promptflow-tools` in `requirements.txt`, because we already include them in the runtime base image.

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

### Update a compute instance runtime on a runtime page

We regularly update our base image (`mcr.microsoft.com/azureml/promptflow/promptflow-runtime-stable`) to include the latest features and bug fixes. We recommend that you update your runtime to the [latest version](https://mcr.microsoft.com/v2/azureml/promptflow/promptflow-runtime-stable/tags/list) if possible.

Every time you open the page for runtime details, we check whether there are new versions of the runtime. If new versions are available, a notification appears at the top of the page. You can also manually check the latest version by selecting the **Check version** button.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-update-env-notification.png" alt-text="Screenshot of the page for runtime details, with the button for checking the runtime version." lightbox = "./media/how-to-create-manage-runtime/runtime-update-env-notification.png":::

To get the best experience and performance, try to keep your runtime up to date. On the page for runtime details, select the **Update** button. On the **Edit compute instance runtime** pane, you can update the environment for your runtime. If you select **Use default environment**, the system tries to update your runtime to the latest version.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-update-env.png" alt-text="Screenshot of the pane for editing a compute instance runtime and the option for using the default environment." lightbox = "./media/how-to-create-manage-runtime/runtime-update-env.png":::

If you select **Use customized environment**, you first need to rebuild the environment by using the latest prompt flow image. Then update your runtime with the new custom environment.

## Relationship between runtime, compute resource, flow and user

- One single user can have multiple compute resources (serverless or compute instance). Base on customer different need, we allow single user to have multiple compute resources. For example, one user can have multiple compute resources with different VM size. You can find 
- One compute resource can only be used by single user. Compute resource is model as private dev box of single user, so we didn't allow multiple user share same compute resources. In AI studio case, different user can join different project and data and other asset need to be isolated, so we didn't allow multiple user share same compute resources.
- One compute resource can host multiple runtimes. Runtime is container running on underlying compute resource, as in common case, prompt flow authoring didn't need too many compute resources, we allow single compute resource to host multiple runtimes from same user. 
- One runtime only belongs to single compute resource in same time. But you can delete or stop runtime and reallocate it to other compute resource.
- In automatic runtime, one flow only have one runtime, as we expect each flow is self contained it defined the base image and required python package in flow folder. In compute instance runtime, you can run different flow on same compute instance runtime, but you need make sure the packages and image is compatible.

## Switch compute instance runtime to automatic runtime (preview)

Automatic runtime (preview) has following advantages over compute instance runtime:
- Automatic manage lifecycle of runtime and underlying compute. You don't need to manually create and managed them anymore.
- Easily customize packages by adding packages in the `requirements.txt` file in the flow folder, instead of creating a custom environment.

We would recommend you to switch to automatic runtime (preview) if you're using compute instance runtime. You can switch it to an automatic runtime (preview) by using the following steps:
- Prepare your `requirements.txt` file in the flow folder. Make sure that you don't pin the version of `promptflow` and `promptflow-tools` in `requirements.txt`, because we already include them in the runtime base image. Automatic runtime (preview) will install the packages in `requirements.txt` file when it starts.
- If you create custom environment to create compute instance runtime, you can also use get the image from environment detail page, and specify it in `flow.dag.yaml` file in the flow folder.  To learn more, see [Change the base image for automatic runtime (preview)](#change-the-base-image-for-automatic-runtime-preview). Make sure you have `acr pull` permission for the image.

:::image type="content" source="./media/how-to-create-manage-runtime/image-path-environment-detail.png" alt-text="Screenshot of finding image in environment detail page." lightbox = "./media/how-to-create-manage-runtime/image-path-environment-detail.png":::

- For compute resource, you can continue to use the existing compute instance if you would like to manually manage the lifecycle of compute resource or you can try serverless compute which lifecycle is managed by system.

## Next steps

- [Develop a standard flow](how-to-develop-a-standard-flow.md)
- [Develop a chat flow](how-to-develop-a-chat-flow.md)
