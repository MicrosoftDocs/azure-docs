---
title: Authentication a managed identity with Azure Active Directory
description: This article provides information about authenticating a managed identity with Azure Active Directory to access Azure SignalR Service
author: terencefan

ms.author: tefa
ms.date: 08/03/2020
ms.service: signalr
ms.topic: conceptual
---

# Authenticate a managed identity with Azure Active Directory to access Azure SignalR Resources
Azure SignalR Service supports Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md). Managed identities for Azure resources can authorize access to Azure SignalR Service resources using Azure AD credentials from applications running in Azure Virtual Machines (VMs), Function apps, Virtual Machine Scale Sets, and other services. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.

This article shows how to authorize access to an Azure SignalR Service by using a managed identity.

## Enable managed identities
Before you can use managed identities for Azure Resources to authorize access to Azure SignalR Service resources, you must first enable managed identities for Azure Resources. 
### For Azure resources on a VM
To learn how to enable managed identities for Azure Resources on a VM, see one of these articles:

- [Azure portal](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
  1. Go to **Settings** on Azure portal and select **Identity**. 
  2. Select the **Status** to be **On**. 
  3. Select **Save** to save the setting. 

      ![Managed identity for a virtual machine](./media/authenticate/identity-virtual-machine.png)
- [Azure PowerShell](../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)

### For Azure Functions

See [How to use managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md).

## Grant permissions to a managed identity in Azure AD
To authorize a request to Azure SignalR Service from a managed identity in your application, first configure role-based access control (RBAC) settings for that managed identity. Azure SignalR Service defines RBAC roles that encompass permissions for acquiring `AccessKey` or `ClientToken`. When the RBAC role is assigned to a managed identity, the managed identity is granted access to Azure SignalR Service at the appropriate scope.

Follow these instructions to manage role assignments:

1. In the [Azure portal](https://portal.azure.com/), navigate to your SignalR resource.
1. Select **Access Control (IAM)** to display access control settings for the Azure SignalR. 
1. Select the **Role assignments** tab to see the list of role assignments. Select the **Add** button on the toolbar and then select **Add role assignment**. 

    ![Add button on the toolbar](./media/authenticate/role-assignments-add-button.png)

1. On the **Add role assignment** page, do the following steps:
    1. Select the **SignalR App Server** as the role. Note that this also applies to **Azure Functions App**.
    1. Search to locate the **security principal** (user, group, service principal) to which you want to assign the role.
    1. Select **Save** to save the role assignment. 

        ![Assign role to an application](./media/authenticate/assign-role-to-application.png)

    1. The identity to whom you assigned the role appears listed under that role. For example, the following image shows that application `signalr-dev` and `signalr-service` are in the SignalR App Server role. 
        
        ![Role Assignment List](./media/authenticate/role-assignment-list.png)

You can follow similar steps to assign a role scoped to resource group, or subscription. Once you define the role and its scope, you can test this behavior with samples [in this GitHub location](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac).

For more information about assigning RBAC roles, see [Authenticate with Azure Active Directory for access to Azure SignalR Service resources](authorize-access-azure-active-directory.md).

To learn more on managing access to Azure resources using Azure RBAC and the Azure portal, see [this article](..//role-based-access-control/role-assignments-portal.md). 

## Configure your app
### App server

Add following options when `AddAzureSignalR`:

```C#
services.AddSignalR().AddAzureSignalR(option =>
{
    option.ConnectionString = "Endpoint=https://<name>.signalr.net;AuthType=aad;Version=1.0;";
});
```

### Azure Functions App

On Azure portal, add an application setting with name `AzureSignalRConnectionString` and value `Endpoint=https://<name>.signalr.net;AuthType=aad;`.

On local, in your `local.appsettings.json` file, add in the `Values` section:
```json
{
    "Values": {
        "AzureSignalRConnectionString": "Endpoint=https://<name>.signalr.net;AuthType=aad;Version=1.0;"
    }
}
```

## Next steps
- To learn more about RBAC, see [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)?
- To learn how to assign and manage Azure role assignments with Azure PowerShell, Azure CLI, or the REST API, see these articles:
    - [Manage role-based access control (RBAC) with Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)  
    - [Manage role-based access control (RBAC) with Azure CLI](../role-based-access-control/role-assignments-cli.md)
    - [Manage role-based access control (RBAC) with the REST API](../role-based-access-control/role-assignments-rest.md)
    - [Manage role-based access control (RBAC) with Azure Resource Manager Templates](../role-based-access-control/role-assignments-template.md)

See the following related articles:
- [Authenticate an application with Azure Active Directory to access Azure SignalR Service](authenticate-application.md)
- [Authorize access to Azure SignalR Service using Azure Active Directory](authorize-access-azure-active-directory.md)
