---
title: Access Event Hubs from a VM using a managed identity
description: Learn how to enable a managed identity on an Azure virtual machine, grant it access to Azure Event Hubs, and run a sample application that authenticates without credentials.
ms.topic: how-to
ms.date: 08/25/2026
ms.custom: subject-rbac-steps
ai-usage: ai-generated
#customer intent: As a developer, I want to access Azure Event Hubs from an application running on a virtual machine by using a managed identity so that I don't have to manage credentials.
---

# Access Azure Event Hubs from a VM by using a managed identity

This article shows you how to connect to Azure Event Hubs from an application that runs on an Azure virtual machine (VM) by using a managed identity. When you use a managed identity, your application authenticates to Event Hubs without storing connection strings or access keys in code or configuration. Azure provisions and rotates the credentials automatically.

In this article, you complete the following tasks:

> [!div class="checklist"]
> - Enable a system-assigned managed identity on a VM.
> - Grant the managed identity permission to send events to an event hub.
> - Create and run a sample application on the VM that uses the managed identity.

To learn how managed identity authentication works with Event Hubs, see [Managed identity authentication for Azure Event Hubs](authenticate-managed-identity.md).

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- An Event Hubs namespace and an event hub. To create them, see [Quickstart: Create an event hub using Azure portal](event-hubs-create.md).
- An Azure virtual machine. To create one, see [Quickstart: Create a Windows VM in the Azure portal](/azure/virtual-machines/windows/quick-create-portal) or [Quickstart: Create a Linux VM in the Azure portal](/azure/virtual-machines/linux/quick-create-portal).
- Permission to assign Azure roles at the target scope. The [Owner](/azure/role-based-access-control/built-in-roles#owner) or [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) role includes this permission.
- The [.NET SDK](https://dotnet.microsoft.com/download) installed on the VM to build and run the sample application.

## Enable a managed identity on the VM

Enable a system-assigned managed identity on the VM. Azure creates an identity in Microsoft Entra ID that's tied to the lifecycle of the VM.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your virtual machine.
1. On the VM page, select **Security** > **Identity** from the left menu.
1. On the **Identity** page, confirm that you're on the **System assigned** tab.
1. For the **Status** field, select **On**.
1. Select **Save** on the command bar, and then select **Yes** to confirm.

    After Azure creates the identity, the **Object (principal) ID** appears on the page. You use this identity in the next section.

To enable a user-assigned managed identity instead, see [Configure managed identities for Azure resources on a VM](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities). A user-assigned identity is a standalone resource that you can assign to more than one VM.

## Grant the managed identity access to Event Hubs

Assign an Azure built-in role to the managed identity so that it can send events to your event hub. This example assigns the **Azure Event Hubs Data Sender** role at the scope of a single event hub. Grant the narrowest scope that meets your application's needs.

1. In the Azure portal, go to your event hub.
1. On the event hub page, select **Access control (IAM)** from the left menu.
1. Select **Add** > **Add role assignment**.
1. On the **Role** tab, select **Azure Event Hubs Data Sender**, and then select **Next**.
1. On the **Members** tab, for **Assign access to**, select **Managed identity**.
1. Select **+ Select members**, choose the **Virtual machine** managed identity that you enabled in the previous section, and then select **Select**.
1. Select **Review + assign** to complete the role assignment.

For the full list of roles and scopes, see [Azure built-in roles for Azure Event Hubs](authorize-access-azure-active-directory.md#azure-built-in-roles-for-azure-event-hubs). To assign roles in the Azure portal, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

> [!NOTE]
> Role assignments can take a few minutes to propagate. If your application can't authenticate immediately, wait and try again.

## Create and run the sample application on the VM

Create a .NET console application that sends events to your event hub. When the application runs on the VM, [`DefaultAzureCredential`](/dotnet/api/azure.identity.defaultazurecredential) automatically detects the managed identity, so you don't provide a connection string or key.

1. Connect to the VM. For a Windows VM, use Remote Desktop. For a Linux VM, use SSH.

1. In a terminal on the VM, create a project and add the required packages:

    ```console
    dotnet new console --name EventHubsManagedIdentitySample
    cd EventHubsManagedIdentitySample
    dotnet add package Azure.Messaging.EventHubs
    dotnet add package Azure.Identity
    ```

1. Replace the contents of `Program.cs` with the following code. Replace `<namespace>` with your Event Hubs namespace name and `<event-hub-name>` with your event hub name.

    ```csharp
    using Azure.Identity;
    using Azure.Messaging.EventHubs;
    using Azure.Messaging.EventHubs.Producer;

    // DefaultAzureCredential detects the managed identity available on the VM.
    var credential = new DefaultAzureCredential();

    var producerClient = new EventHubProducerClient(
        "<namespace>.servicebus.windows.net",
        "<event-hub-name>",
        credential);

    using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();
    eventBatch.TryAdd(new EventData("First event from a managed identity"));
    eventBatch.TryAdd(new EventData("Second event from a managed identity"));

    await producerClient.SendAsync(eventBatch);
    await producerClient.DisposeAsync();

    Console.WriteLine("Events sent to the event hub.");
    ```

1. Build and run the application on the VM:

    ```console
    dotnet run
    ```

    The application uses the VM's managed identity to authenticate and sends the events. When the events are sent, the console displays `Events sent to the event hub.`

1. To confirm that the events arrived, use the **Data Explorer** in the Azure portal for your event hub, or the metrics on the namespace **Overview** page.

> [!TIP]
> When you use a user-assigned managed identity, or when more than one identity is available on the VM, set the client ID so that `DefaultAzureCredential` selects the correct identity. For more information, see [DefaultAzureCredentialOptions.ManagedIdentityClientId](/dotnet/api/azure.identity.defaultazurecredentialoptions.managedidentityclientid).

## Related content

- [Managed identity authentication for Azure Event Hubs](authenticate-managed-identity.md)
- [Enable managed identity for an Azure Event Hubs namespace](enable-managed-identity.md)
- [Authorize access to Event Hubs resources using Microsoft Entra ID](authorize-access-azure-active-directory.md)
- [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)
