---
title: 'Create and run a storage task (.NET)'
titleSuffix: Azure Storage Actions
description: In this quickstart, you learn how to create your first storage task by using the Azure Storage client library for .NET.
services: storage
author: normesta
ms.service: azure-storage-actions
ms.topic: quickstart
ms.date: 05/05/2025
ms.author: normesta
ms.devlang: csharp
---

# Quickstart: Create and assign a storage task by using .NET

In this quickstart, you learn how to use the Azure Storage Actions client library for .NET to create a storage task and assign it to an Azure Storage account. Then, you'll review the results of the run. The storage task applies a time-based immutability policy on any Microsoft Word documents that exist in the storage account.

[API reference documentation](/dotnet/api/overview/azure/resourcemanager.storageactions-readme?view=azure-dotnet-preview&preserve-view=true) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storageactions/Azure.ResourceManager.StorageActions) | [Package (NuGet)](https://www.nuget.org/packages/Azure.ResourceManager.StorageActions/1.0.0-beta.2) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storageactions/Azure.ResourceManager.StorageActions/samples)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)

- An Azure storage account. See [create a storage account](../../storage/common/storage-account-create.md). As you create the account, make sure to enable version-level immutability support and that you don't enable the hierarchical namespace feature.

- The [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role is assigned to your user identity in the context of the storage account or resource group.

- A custom role assigned to your user identity in the context of the resource group which contains the RBAC actions necessary to assign a task to a storage account. See [Permissions required to assign a task](storage-task-authorization-roles-assign.md#permission-for-a-task-to-perform-operations).

- .NET Framework is 4.7.2 or greater installed. For more information, see [Download .NET Framework](https://dotnet.microsoft.com/download/dotnet-framework).

## Setting up

This section walks you through preparing a project.

### Create the project

Create a .NET console app using either the .NET CLI or Visual Studio 2022.

### [Visual Studio 2022](#tab/visual-studio)

1. At the top of Visual Studio, navigate to **File** > **New** > **Project..**.

1. In the dialog window, enter *console app* into the project template search box and select the first result. Choose **Next** at the bottom of the dialog.

    :::image type="content" source="../media/storage-tasks/storage-quickstart-dotnet/visual-studio-new-console-app.png" alt-text="A screenshot showing how to create a new project using Visual Studio.":::

1. For the **Project Name**, enter *StorageTaskQuickstart*. Leave the default values for the rest of the fields and select **Next**.

1. For the **Framework**, ensure the latest installed version of .NET is selected. Then choose **Create**. The new project opens inside the Visual Studio environment.

### [.NET CLI](#tab/net-cli)

1. In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name *BlobQuickstart*. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

   ```dotnetcli
   dotnet new console -n StorageTaskQuickstart
   ```

1. Switch to the newly created *StorageTaskQuickstart* directory.

   ```console
   cd StorageTaskQuickstart
   ```

1. Open the project in your desired code editor. To open the project in:
    * Visual Studio, locate, and double-click the `StorageTaskQuickstart.csproj` file.
    * Visual Studio Code, run the following command:

    ```bash
    code .
    ```
---

### Install the packages

### [Visual Studio 2022](#tab/visual-studio)

1. In **Solution Explorer**, right-click the **Dependencies** node of your project. Select **Manage NuGet Packages**.

2. In the resulting window, select the **Include prerelease** checkbox, and then search for *Azure.ResourceManager.StorageActions*. Select the appropriate result, and select **Install**.

    :::image type="content" source="../media/storage-tasks/storage-quickstart-dotnet/visual-studio-add-package.png" alt-text="A screenshot showing how to add the Azure.ResourceManager.StorageActions package using Visual Studio.":::

3. Next, search for *Azure.ResourceManager.Storage*. Select the appropriate result, and select **Install**.

    :::image type="content" source="../media/storage-tasks/storage-quickstart-dotnet/visual-studio-add-package-storage.png" alt-text="A screenshot showing how to add the Azure.ResourceManager.Storage package using Visual Studio.":::

4. Search for *Azure.ResourceManager.Authorization**. Select the appropriate result, and select **Install**.

    :::image type="content" source="../media/storage-tasks/storage-quickstart-dotnet/visual-studio-add-package-authorization.png" alt-text="A screenshot showing how to add the Azure.ResourceManager.Authorization package using Visual Studio.":::

### [.NET CLI](#tab/net-cli)

Use the following command to install the `Azure.ResourceManager.StorageActions` package:

```dotnetcli
dotnet add package Azure.ResourceManager.StorageActions --prerelease
```

Use the following command to install the `Azure.ResourceManager.Storage` package:

```dotnetcli
dotnet add package Azure.ResourceManager.Storage
```
Use the following command to install the `Azure.ResourceManager.Authorization` package:

```dotnetcli
dotnet add package Azure.ResourceManager.Authorization
```

If either of these commands fail, then follow these steps:

- Make sure that `nuget.org` is added as a package source. You can list the package sources using the [`dotnet nuget list source`](/dotnet/core/tools/dotnet-nuget-list-source#examples) command:

    ```dotnetcli
    dotnet nuget list source
    ```

- If you don't see `nuget.org` in the list, you can add it using the [`dotnet nuget add source`](/dotnet/core/tools/dotnet-nuget-add-source#examples) command:

    ```dotnetcli
    dotnet nuget add source https://api.nuget.org/v3/index.json -n nuget.org
    ```

Now that the package source is updated, run the commands to install the packages.

---

### Set up the app code

Replace the starting code in the `Program.cs` file so that it matches the following example, which includes the necessary `using` statements for this QuickStart.

```csharp
using Azure;
using Azure.Core;
using Azure.ResourceManager;
using Azure.ResourceManager.Models;
using Azure.ResourceManager.Resources;
using Azure.ResourceManager.StorageActions;
using Azure.ResourceManager.StorageActions.Models;
using Azure.ResourceManager.Storage.Models;
using Azure.ResourceManager.Storage;
using Azure.ResourceManager.Authorization;
using Azure.ResourceManager.Authorization.Models;
```

## Sign in and connect your app code to Azure using DefaultAzureCredential

1. [!INCLUDE [default-azure-credential-sign-in](~/reusable-content/ce-skilling/azure/includes/passwordless/default-azure-credential-sign-in.md)]

2. [!INCLUDE [visual-studio-add-identity](../../../includes/passwordless/visual-studio-add-identity.md)]

3. Add the following using statement to the *Program.cs** file:
 
   ```csharp
   using Azure.Identity;
   ```

4. Add the following code to the *Program.cs* file. When the code is run on your local workstation during development, it will use the developer credentials of the prioritized tool you're logged into to authenticate to Azure, such as the Azure CLI or Visual Studio.

   ```csharp
   TokenCredential cred = new DefaultAzureCredential();
   ArmClient client = new ArmClient(cred);
   ```

## Create a storage task

1. Pick a resource group in your subscription where you'd like to create a storage task. Then, get the storage task collection of that resource group. 

   - Replace the `<subscription-id>` placeholder value in this example with the ID of your subscription.

   - Replace the `<resource-group>` placeholder value in this example with the name of your resource group.

   ```csharp
    string subscriptionId = "<subscription-id>";
    string resourceGroupName = "<resource-group>";

    ResourceIdentifier resourceGroupResourceId = 
        ResourceGroupResource.CreateResourceIdentifier(subscriptionId, resourceGroupName);

    ResourceGroupResource resourceGroupResource = 
        client.GetResourceGroupResource(resourceGroupResourceId);

    StorageTaskCollection storageTaskcollection = resourceGroupResource.GetStorageTasks();
   ```

2. Define a *condition clause* by using JSON. A condition has a collection of one or more clauses. A clause contains a property, a value, and an operator. In the following JSON, the property is `Name`, the value is `.docx`, and the operator is `endsWith`. This clause allows operations only on Microsoft Word documents. 

   ```csharp
   string clause = "[[endsWith(Name, '.docx')]]"
   ```
   For a complete list of properties and operators, see [Storage task conditions](storage-task-conditions.md). 

   > [!TIP] 
   > You can add multiple conditions to the same string and separate them with a comma.

3. Define the complete condition by including the clause that you previously defined along with two operations. The first operation in this definition sets an immutability policy. The second operation sets a blob index tag in the metadata of the Word document.

   ```csharp
    StorageTaskIfCondition condition = new(clause, new StorageTaskOperationInfo[]
    {
        new StorageTaskOperationInfo(StorageTaskOperationName.SetBlobImmutabilityPolicy)
        {
            Parameters =
            {
                ["untilDate"] = "2025-10-20T22:30:40",
                ["mode"] = "locked"
            },
            OnSuccess = OnSuccessAction.Continue,
            OnFailure = OnFailureAction.Break,
        },        
        new StorageTaskOperationInfo(StorageTaskOperationName.SetBlobTags)
        {
            Parameters =
            {
                ["tagsetImmutabilityUpdatedBy"] = "StorageTaskQuickstart"
            },
            OnSuccess = OnSuccessAction.Continue,
            OnFailure = OnFailureAction.Break,
        }

    });
   ```

4. Create the storage task and then add it to the storage task collection.

   ```csharp
    StorageTaskProperties storageTaskProperties = 
        new(true, "My storage task", new StorageTaskAction(condition));

    StorageTaskData storageTaskData = new(
        new AzureLocation("westus"), 
        new ManagedServiceIdentity("SystemAssigned"), 
        storageTaskProperties);

    var storageTaskResult = (storageTaskcollection.CreateOrUpdate
        (WaitUntil.Completed, "mystoragetask", storageTaskData)).Value;

    Console.WriteLine($"Succeeded on id: {storageTaskResult.Data.Id}");
   ```

## Create an assignment

To use a storage task, you must create a *storage task assignment*. The assignment is saved as part of the storage account resource instance, and defines among other settings, a subset of objects to target, when and how often a task runs against those objects, and where the execution reports are stored. 

1. Specify prefix filters, run frequency, start times by creating an execution context. The following example targets the `mycontainer` container and is scheduled to run `10` minutes from the present time. 

    ```csharp
    ExecutionTriggerParameters executionTriggerParameters = new()
    {
        StartOn = DateTime.Now.AddMinutes(10).ToUniversalTime()
    };

    ExecutionTrigger executionTrigger = 
        new(ExecutionTriggerType.RunOnce, executionTriggerParameters);

    StorageTaskAssignmentExecutionContext storageTaskAssignmentExecutionContext = 
        new(executionTrigger)
    {
        Target = new ExecutionTarget
        {
            Prefix = { "mycontainer/" },
            ExcludePrefix = { },
        }
    };
    ```

2. Create the storage task assignment and then add it to the storage task assignment collection. The following assignment includes the execution context that you created in the previous step. It also specifies the target storage account and is configured to save execution reports to a folder named `storage-tasks-report`.

    ```csharp
    string accountName = "mystorageaccount";

    ResourceIdentifier storageAccountResourceId = 
        StorageAccountResource.CreateResourceIdentifier
        (subscriptionId, resourceGroupName, accountName);

    StorageAccountResource storageAccount = 
        client.GetStorageAccountResource(storageAccountResourceId);

    StorageTaskAssignmentCollection storageTaskAssignmentcollection = 
        storageAccount.GetStorageTaskAssignments();

    StorageTaskAssignmentProperties storageTaskAssignmentProperties = new(
        new ResourceIdentifier(storageTaskResult.Data.Id.ToString()), true, 
        "My Storage task assignment",
        storageTaskAssignmentExecutionContext,
        new("storage-tasks-report"));

    // Create and execute the storage task assignment
    storageTaskAssignmentcollection.CreateOrUpdate(
    WaitUntil.Started,
    "myStorageTaskAssignment",
    new StorageTaskAssignmentData(storageTaskAssignmentProperties));
    ```

3. Give the storage task permission to perform operations on the target storage account. Assign the role of `Storage Blob Data Owner` to the system-assigned managed identity of the storage task.

    ```csharp

    var roleDefId = $"/subscriptions/" + subscriptionId + "/providers/Microsoft.Authorization/roleDefinitions/<b7e6dc6d-f1e8-4753-8033-0f276bb0955b>";

    var operationContent = new RoleAssignmentCreateOrUpdateContent(
        new ResourceIdentifier(roleDefId),
        storageTaskResult.Data.Identity.PrincipalId ?? throw new InvalidOperationException("PrincipalId is null"))
    {
        PrincipalType = RoleManagementPrincipalType.ServicePrincipal
    };

    ResourceIdentifier roleAssignmentResourceId = RoleAssignmentResource.CreateResourceIdentifier(storageAccount.Id, Guid.NewGuid().ToString());

    RoleAssignmentResource roleAssignment = client.GetRoleAssignmentResource(roleAssignmentResourceId);

    ArmOperation <RoleAssignmentResource> lro = await roleAssignment.UpdateAsync(WaitUntil.Completed, operationContent);
    RoleAssignmentResource result = lro.Value;
    RoleAssignmentData resourceData = result.Data;
    Console.WriteLine($"Succeeded on id: {resourceData.Id}");
    ```

## Run the code

If you're using Visual Studio, press F5 to build and run the code and interact with the console app. If you're using the .NET CLI, navigate to your application directory, then build and run the application.

```console
dotnet build
```

```console
dotnet run
```

## View the results of a task run

After the task completes running, get a run report summary for each assignment.

```csharp
    ResourceIdentifier storageTaskResourceId = StorageTaskResource.CreateResourceIdentifier
        (subscriptionId, resourceGroupName, "mystoragetask");
    StorageTaskResource storageTask = client.GetStorageTaskResource(storageTaskResourceId);
    // invoke the operation and iterate over the result
    await foreach (Azure.ResourceManager.StorageActions.Models.StorageTaskReportInstance item in storageTask.GetStorageTasksReportsAsync())
    {
        Console.WriteLine($"Succeeded: {item.Properties.SummaryReportPath}");
    }
```

The `SummaryReportPath` field of each report summary contains a path to a detailed report. That report contains comma-separated list of the container, the blob, and the operation performed along with a status.

## Clean up resources

Remove all of the assets you've created. The easiest way to remove the assets is to delete the resource group. Removing the resource group also deletes all resources included within the group. In the following example, removing the resource group removes the storage account and the resource group itself.

```powershell
Remove-AzResourceGroup -Name $ResourceGroup 
```

## Next step

> [!div class="nextstepaction"]
> [What is Azure Storage Actions](../overview.md)
