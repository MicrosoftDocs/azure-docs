---
title: "Quickstart: Create a management group with .NET Core"
description: In this quickstart, you use .NET Core to create a management group to organize your resources into a resource hierarchy.
ms.date: 08/17/2021
ms.topic: quickstart
ms.custom: devx-track-csharp, devx-track-dotnet
---
# Quickstart: Create a management group with .NET Core

Management groups are containers that help you manage access, policy, and compliance across multiple
subscriptions. Create these containers to build an effective and efficient hierarchy that can be
used with [Azure Policy](../policy/overview.md) and [Azure Role Based Access
Controls](../../role-based-access-control/overview.md). For more information on management groups,
see [Organize your resources with Azure management groups](overview.md).

The first management group created in the directory could take up to 15 minutes to complete. There
are processes that run the first time to set up the management groups service within Azure for your
directory. You receive a notification when the process is complete. For more information, see
[initial setup of management groups](./overview.md#initial-setup-of-management-groups).

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.

- An Azure service principal, including the _clientId_ and _clientSecret_. If you don't have a
  service principal for use with Azure Policy or want to create a new one, see
  [Azure management libraries for .NET authentication](/dotnet/azure/sdk/authentication#mgmt-auth).
  Skip the step to install the .NET Core packages as we'll do that in the next steps.

- Any Azure AD user in the tenant can create a management group without the management group write
  permission assigned to that user if
  [hierarchy protection](./how-to/protect-resource-hierarchy.md#setting---require-authorization)
  isn't enabled. This new management group becomes a child of the Root Management Group or the
  [default management group](./how-to/protect-resource-hierarchy.md#setting---default-management-group)
  and the creator is given an "Owner" role assignment. Management group service allows this ability
  so that role assignments aren't needed at the root level. No users have access to the Root
  Management Group when it's created. To avoid the hurdle of finding the Azure AD Global Admins to
  start using management groups, we allow the creation of the initial management groups at the root
  level.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Application setup

To enable .NET Core to manage management groups, create a new console application and install the
required packages.

1. Check that the latest .NET Core is installed (at least **3.1.8**). If it isn't yet installed,
   download it at [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet-core).

1. Initialize a new .NET Core console application named "mgCreate":

   ```dotnetcli
   dotnet new console --name "mgCreate"
   ```

1. Change directories into the new project folder and install the required packages for Azure
   Policy:

   ```dotnetcli
   # Add the Azure Policy package for .NET Core
   dotnet add package Microsoft.Azure.Management.ManagementGroups --version 1.1.1-preview

   # Add the Azure app auth package for .NET Core
   dotnet add package Microsoft.Azure.Services.AppAuthentication --version 1.6.1
   ```

1. Replace the default `program.cs` with the following code and save the updated file:

   ```csharp
   using System;
   using System.Collections.Generic;
   using System.Threading.Tasks;
   using Microsoft.IdentityModel.Clients.ActiveDirectory;
   using Microsoft.Rest;
   using Microsoft.Azure.Management.ManagementGroups;
   using Microsoft.Azure.Management.ManagementGroups.Models;

   namespace mgCreate
   {
       class Program
       {
           static async Task Main(string[] args)
           {
               string strTenant = args[0];
               string strClientId = args[1];
               string strClientSecret = args[2];
               string strGroupId = args[3];
               string strDisplayName = args[4];

               var authContext = new AuthenticationContext($"https://login.microsoftonline.com/{strTenant}");
               var authResult = await authContext.AcquireTokenAsync(
                      "https://management.core.windows.net",
                      new ClientCredential(strClientId, strClientSecret));

               using (var client = new ManagementGroupsAPIClient(new TokenCredentials(authResult.AccessToken)))
               {
                   var mgRequest = new CreateManagementGroupRequest
                   {
                       DisplayName = strDisplayName
                   };
                   var response = await client.ManagementGroups.CreateOrUpdateAsync(strGroupId, mgRequest);
               }
           }
       }
   }
   ```

1. Build and publish the `mgCreate` console application:

   ```dotnetcli
   dotnet build
   dotnet publish -o {run-folder}
   ```

## Create the management group

In this quickstart, you create a new management group in the root management group.

1. Change directories to the `{run-folder}` you defined with the previous `dotnet publish` command.

1. Enter the following command in the terminal:

   ```bash
   mgCreate.exe `
      "{tenantId}" `
      "{clientId}" `
      "{clientSecret}" `
      "{groupID}" `
      "{displayName}"
   ```

The preceding commands use the following information:

- `{tenantId}` - Replace with your tenant ID
- `{clientId}` - Replace with the client ID of your service principal
- `{clientSecret}` - Replace with the client secret of your service principal
- `{groupID}` - Replace with the ID for your new management group
- `{displayName}` - Replace with the friendly name for your new management group

The result is a new management group in the root management group.

## Clean up resources

- Delete the new management group through the portal.

- If you wish to remove the .NET Core console application and installed packages, delete the
  `mgCreate` project folder.

## Next steps

In this quickstart, you created a management group to organize your resource hierarchy. The
management group can hold subscriptions or other management groups.

To learn more about management groups and how to manage your resource hierarchy, continue to:

> [!div class="nextstepaction"]
> [Manage your resources with management groups](./manage.md)
