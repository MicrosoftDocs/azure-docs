---
title: Authenticate with managed identities for Azure Relay resources 
description: This article describes how to use managed identities to access with Azure Relay resources.
ms.topic: article
ms.date: 07/22/2022
---

# Authenticate a managed identity with Microsoft Entra ID to access Azure Relay resources 
[Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) is a cross-Azure feature that enables you to create a secure identity associated with the deployment under which your application code runs. You can then associate that identity with access-control roles that grant custom permissions for accessing specific Azure resources that your application needs.

With managed identities, the Azure platform manages this runtime identity. You don't need to store and protect access keys in your application code or configuration, either for the identity itself, or for the resources you need to access. A Relay client app running inside an Azure App Service application or in a virtual machine with enabled managed entities for Azure resources support doesn't need to handle SAS rules and keys, or any other access tokens. The client app only needs the endpoint address of the Relay namespace. When the app connects, Relay binds the managed entity's context to the client in an operation that is shown in an example later in this article. Once it's associated with a managed identity, your Relay client can do all authorized operations. Authorization is granted by associating a managed entity with Relay roles.

> [!NOTE]
> This feature is generally available in all regions except Microsoft Azure operated by 21Vianet. 

[!INCLUDE [relay-roles](./includes/relay-roles.md)]

## Enable managed identity
First, enable managed identity for the Azure resource that needs to access Azure Relay entities (hybrid connections or WCF relays). For an example, if your Relay client application is running on an Azure VM, enable managed identity for the VM by following instructions from the [Configure managed identity for an Azure VM](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md) article. Once you've enabled this setting, a new managed service identity is created in your Microsoft Entra ID.

For a list of services that support managed identities, see [Services that support managed identities for Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md).

## Assign an Azure Relay role to the managed identity
After you enable the managed identity, assign one of the Azure Relay roles (Azure Relay Owner, Azure Relay Listener, or Azure Relay Sender) to the identity at the appropriate scope. When the Azure role is assigned to a managed identity, the managed identity is granted access to Relay entities at the appropriate scope.

The following section uses a simple application that runs under a managed identity on an Azure VM instance and accesses Relay resources.

## Sample app on VM accessing Relay entities

1. Download the [Hybrid Connections sample console application](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/dotnet/rolebasedaccesscontrol) to your computer from GitHub.
1. [Create an Azure VM](../virtual-machines/windows/quick-create-portal.md). For this sample, use a Windows 10 image. 
1. Enable system-assigned identity or a user-assigned identity for the Azure VM. For instructions, see [Enable identity for a VM](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md). 
1. Assign one of the Relay roles to the managed service identity at the desired scope (Relay entity, Relay namespace, resource group, subscription). For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).
1. Build the console app locally on your local computer as per instructions from the [README document](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/dotnet/rolebasedaccesscontrol#rolebasedaccesscontrol-hybrid-connection-sample). 
1. Copy the executable under \<your local path\>\RoleBasedAccessControl\bin\Debug folder to the VM. You can use RDP to connect to your Azure VM. For more information, see [How to connect and sign on to an Azure virtual machine running Windows](../virtual-machines/windows/connect-logon.md).
1. Run RoleBasedAccessControl.exe on the Azure VM as per instructions from the [README document](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/dotnet/rolebasedaccesscontrol#rolebasedaccesscontrol-hybrid-connection-sample). 

    > [!NOTE]
    > Follow the same steps to run the [console application for WCF Relays](https://github.com/Azure/azure-relay/tree/master/samples/wcf-relay/RoleBasedAccessControl).

#### Highlighted code from the sample
Here's the code from the sample that shows how to use Microsoft Entra authentication to connect to the Azure Relay service.  

1. Create a [TokenProvider](/dotnet/api/microsoft.azure.relay.tokenprovider) object by using the `TokenProvider.CreateManagedIdentityTokenProvider` method. 
    
    - If you're using a **system-assigned managed identity:**
        ```csharp
        TokenProvider.CreateManagedIdentityTokenProvider();
        ```
    - If you're using a **user-assigned managed identity**, get the **Client ID** for the user-assigned identity from the **Managed Identity** page in the Azure portal. For instructions, see [List user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#list-user-assigned-managed-identities).
        ```csharp
        var managedCredential = new ManagedIdentityCredential(clientId);
        tokenProvider = TokenProvider.CreateManagedIdentityTokenProvider(managedCredential);    
        ```
1. Create a [HybridConnectionListener](/dotnet/api/microsoft.azure.relay.hybridconnectionlistener.-ctor#Microsoft_Azure_Relay_HybridConnectionListener__ctor_System_Uri_Microsoft_Azure_Relay_TokenProvider_)  or [HybridConnectionClient](/dotnet/api/microsoft.azure.relay.hybridconnectionclient.-ctor#microsoft-azure-relay-hybridconnectionclient-ctor(system-uri-microsoft-azure-relay-tokenprovider)) object by passing the hybrid connection URI and the token provider you created in the previous step.

    **Listener:**
    ```csharp
    var listener = new HybridConnectionListener(hybridConnectionUri, tokenProvider);    
    ```
    
    **Sender:**
    ```csharp
    var sender = new HybridConnectionClient(hybridConnectionUri, tokenProvider);    
    ```

## Samples

- Hybrid Connections: [.NET](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/dotnet/rolebasedaccesscontrol), [Java](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/java/role-based-access-control), [JavaScript](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/node/rolebasedaccesscontrol)
- WCF Relay: [.NET](https://github.com/Azure/azure-relay/tree/master/samples/wcf-relay/RoleBasedAccessControl)

## Next steps
To learn more about Azure Relay, see the following articles.
- [What is Relay?](relay-what-is-it.md)
- [Get started with Azure Relay Hybrid connections WebSockets](relay-hybrid-connections-dotnet-get-started.md)
- [Get stated with Azure Relay Hybrid connections HTTP requests](relay-hybrid-connections-http-requests-dotnet-get-started.md)
