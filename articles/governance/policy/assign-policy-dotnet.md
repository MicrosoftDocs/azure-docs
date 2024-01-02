---
title: "Quickstart: New policy assignment with .NET Core"
description: In this quickstart, you use .NET Core to create an Azure Policy assignment to identify non-compliant resources.
ms.date: 08/17/2021
ms.topic: quickstart
ms.custom: devx-track-csharp, devx-track-dotnet
---
# Quickstart: Create a policy assignment to identify non-compliant resources with .NET Core

The first step in understanding compliance in Azure is to identify the status of your resources. In
this quickstart, you create a policy assignment to identify virtual machines that aren't using
managed disks. When complete, you'll identify virtual machines that are _non-compliant_.

The .NET Core library is used to manage Azure resources. This guide explains how to use the .NET
Core library for Azure Policy to create a policy assignment.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a
  [free](https://azure.microsoft.com/free/) account before you begin.
- An Azure service principal, including the _clientId_ and _clientSecret_. If you don't have a
  service principal for use with Azure Policy or want to create a new one, see
  [Azure management libraries for .NET authentication](/dotnet/azure/sdk/authentication#mgmt-auth).
  Skip the step to install the .NET Core packages as we'll do that in the next steps.

## Create the Azure Policy project

To enable .NET Core to manage Azure Policy, create a new console application and install the
required packages.

1. Check that the latest .NET Core is installed (at least **3.1.8**). If it isn't yet installed,
   download it at [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet-core).

1. Initialize a new .NET Core console application named "policyAssignment":

   ```dotnetcli
   dotnet new console --name "policyAssignment"
   ```

1. Change directories into the new project folder and install the required packages for Azure
   Policy:

   ```dotnetcli
   # Add the Azure Policy package for .NET Core
   dotnet add package Microsoft.Azure.Management.ResourceManager --version 3.10.0-preview

   # Add the Azure app auth package for .NET Core
   dotnet add package Microsoft.Azure.Services.AppAuthentication --version 1.5.0
   ```

1. Replace the default `program.cs` with the following code and save the updated file:

   ```csharp
   using System;
   using System.Collections.Generic;
   using System.Threading.Tasks;
   using Microsoft.IdentityModel.Clients.ActiveDirectory;
   using Microsoft.Rest;
   using Microsoft.Azure.Management.ResourceManager;
   using Microsoft.Azure.Management.ResourceManager.Models;

   namespace policyAssignment
   {
       class Program
       {
           static async Task Main(string[] args)
           {
               string strTenant = args[0];
               string strClientId = args[1];
               string strClientSecret = args[2];
               string strSubscriptionId = args[3];
               string strName = args[4];
               string strDisplayName = args[5];
               string strPolicyDefID = args[6];
               string strDescription = args[7];
               string strScope = args[8];

               var authContext = new AuthenticationContext($"https://login.microsoftonline.com/{strTenant}");
               var authResult = await authContext.AcquireTokenAsync(
                   "https://management.core.windows.net",
                   new ClientCredential(strClientId, strClientSecret));

               using (var client = new PolicyClient(new TokenCredentials(authResult.AccessToken)))
               {
                   var policyAssignment = new PolicyAssignment
                   {
                       DisplayName = strDisplayName,
                       PolicyDefinitionId = strPolicyDefID,
                       Description = strDescription
                   };
                   var response = await client.PolicyAssignments.CreateAsync(strScope, strName, policyAssignment);
               }
           }
       }
   }
   ```

1. Build and publish the `policyAssignment` console application:

   ```dotnetcli
   dotnet build
   dotnet publish -o {run-folder}
   ```

## Create a policy assignment

In this quickstart, you create a policy assignment and assign the **Audit VMs that do not use
managed disks** (`06a78e20-9358-41c9-923c-fb736d382a4d`) definition. This policy definition
identifies resources that aren't compliant to the conditions set in the policy definition.

1. Change directories to the `{run-folder}` you defined with the previous `dotnet publish` command.

1. Enter the following command in the terminal:

   ```bash
   policyAssignment.exe `
      "{tenantId}" `
      "{clientId}" `
      "{clientSecret}" `
      "{subscriptionId}" `
      "audit-vm-manageddisks" `
      "Audit VMs without managed disks Assignment" `
      "/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d" `
      "Shows all virtual machines not using managed disks" `
      "{scope}"
   ```

The preceding commands use the following information:

- `{tenantId}` - Replace with your tenant ID
- `{clientId}` - Replace with the client ID of your service principal
- `{clientSecret}` - Replace with the client secret of your service principal
- `{subscriptionId}` - Replace with your subscription ID
- **name** - The unique name for the policy assignment object. The example above uses
  _audit-vm-manageddisks_.
- **displayName** - Display name for the policy assignment. In this case, you're using _Audit VMs
  without managed disks Assignment_.
- **policyDefID** - The policy definition path, based on which you're using to create the
  assignment. In this case, it's the ID of policy definition _Audit VMs that do not use managed
  disks_.
- **description** - A deeper explanation of what the policy does or why it's assigned to this scope.
- **scope** - A scope determines what resources or grouping of resources the policy assignment gets
  enforced on. It could range from a management group to an individual resource. Be sure to replace
  `{scope}` with one of the following patterns:
  - Management group: `/providers/Microsoft.Management/managementGroups/{managementGroup}`
  - Subscription: `/subscriptions/{subscriptionId}`
  - Resource group: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}`
  - Resource: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/[{parentResourcePath}/]`

You're now ready to identify non-compliant resources to understand the compliance state of your
environment.

## Identify non-compliant resources

Now that your policy assignment is created, you can identify resources that aren't compliant.

1. Initialize a new .NET Core console application named "policyCompliance":

   ```dotnetcli
   dotnet new console --name "policyCompliance"
   ```

1. Change directories into the new project folder and install the required packages for Azure
   Policy:

   ```dotnetcli
   # Add the Azure Policy package for .NET Core
   dotnet add package Microsoft.Azure.Management.PolicyInsights --version 3.1.0

   # Add the Azure app auth package for .NET Core
   dotnet add package Microsoft.Azure.Services.AppAuthentication --version 1.5.0
   ```

1. Replace the default `program.cs` with the following code and save the updated file:

   ```csharp
   using System;
   using System.Collections.Generic;
   using System.Threading.Tasks;
   using Microsoft.IdentityModel.Clients.ActiveDirectory;
   using Microsoft.Rest;
   using Microsoft.Azure.Management.PolicyInsights;
   using Microsoft.Azure.Management.PolicyInsights.Models;

   namespace policyAssignment
   {
       class Program
       {
           static async Task Main(string[] args)
           {
               string strTenant = args[0];
               string strClientId = args[1];
               string strClientSecret = args[2];
               string strSubscriptionId = args[3];
               string strName = args[4];

               var authContext = new AuthenticationContext($"https://login.microsoftonline.com/{strTenant}");
               var authResult = await authContext.AcquireTokenAsync(
                   "https://management.core.windows.net",
                   new ClientCredential(strClientId, strClientSecret));

               using (var client = new PolicyInsightsClient(new TokenCredentials(authResult.AccessToken)))
               {
                   var policyQueryOptions = new QueryOptions
                   {
                       Filter = $"IsCompliant eq false and PolicyAssignmentId eq '{strName}'",
                       Apply = "groupby(ResourceId)"
                   };

                   var response = await client.PolicyStates.ListQueryResultsForSubscriptionAsync(
                       "latest", strSubscriptionId, policyQueryOptions);
                   Console.WriteLine(response.Odatacount);
               }
           }
       }
   }
   ```

1. Build and publish the `policyAssignment` console application:

   ```dotnetcli
   dotnet build
   dotnet publish -o {run-folder}
   ```

1. Change directories to the `{run-folder}` you defined with the previous `dotnet publish` command.

1. Enter the following command in the terminal:

   ```bash
   policyCompliance.exe `
      "{tenantId}" `
      "{clientId}" `
      "{clientSecret}" `
      "{subscriptionId}" `
      "audit-vm-manageddisks"
   ```

The preceding commands use the following information:

- `{tenantId}` - Replace with your tenant ID
- `{clientId}` - Replace with the client ID of your service principal
- `{clientSecret}` - Replace with the client secret of your service principal
- `{subscriptionId}` - Replace with your subscription ID
- **name** - The unique name for the policy assignment object. The example above uses
  _audit-vm-manageddisks_.

The results in `response` match what you see in the **Resource compliance** tab of a policy
assignment in the Azure portal view.

## Clean up resources

- Delete the policy assignment _Audit VMs without managed disks Assignment_ through the portal. The
  policy definition is a built-in, so there's no definition to remove.

- If you wish to remove the .NET Core console applications and installed packages, delete the
  `policyAssignment` and `policyCompliance` project folders.

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your
Azure environment.

To learn more about assigning policy definitions to validate that new resources are compliant,
continue to the tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)
