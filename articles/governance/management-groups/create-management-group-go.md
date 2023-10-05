---
title: "Quickstart: Create a management group with Go"
description: In this quickstart, you use Go to create a management group to organize your resources into a resource hierarchy.
ms.date: 08/17/2021
ms.topic: quickstart
ms.devlang: golang
ms.custom: devx-track-csharp, devx-track-go
---
# Quickstart: Create a management group with Go

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

## Add the management group package

To enable Go to manage management groups, the package must be added. This package works wherever Go
can be used, including [bash on Windows 10](/windows/wsl/install-win10) or locally installed.

1. Check that the latest Go is installed (at least **1.15**). If it isn't yet installed, download it
   at [Golang.org](https://go.dev/dl/).

1. Check that the latest Azure CLI is installed (at least **2.5.1**). If it isn't yet installed, see
   [Install the Azure CLI](/cli/azure/install-azure-cli).

   > [!NOTE]
   > Azure CLI is required to enable Go to use the `auth.NewAuthorizerFromCLI()` method in the
   > following example. For information about other options, see
   > [Azure SDK for Go - More authentication details](https://github.com/Azure/azure-sdk-for-go#more-authentication-details).

1. Authenticate through Azure CLI.

   ```azurecli
   az login
   ```

1. In your Go environment of choice, install the required packages for management groups:

   ```bash
   # Add the management group package for Go
   go install github.com/Azure/azure-sdk-for-go/services/resources/mgmt/2020-05-01/managementgroups@latest

   # Add the Azure auth package for Go
   go install github.com/Azure/go-autorest/autorest/azure/auth@latest
   ```

## Application setup

With the Go packages added to your environment of choice, it's time to set up the Go application
that can create a management group.

1. Create the Go application and save the following source as `mgCreate.go`:

   ```go
   package main

   import (
   	"context"
   	"fmt"
   	"os"

   	mg "github.com/Azure/azure-sdk-for-go/services/resources/mgmt/2020-05-01/managementgroups"
   	"github.com/Azure/go-autorest/autorest/azure/auth"
   )

   func main() {
   	// Get variables from command line arguments
   	var mgName = os.Args[1]

   	// Create and authorize a client
   	mgClient := mg.NewClient()
   	authorizer, err := auth.NewAuthorizerFromCLI()
   	if err == nil {
   		mgClient.Authorizer = authorizer
   	} else {
   		fmt.Printf(err.Error())
   	}

   	// Create the request
   	Request := mg.CreateManagementGroupRequest{
   		Name: &mgName,
   	}

   	// Run the query and get the results
   	var results, queryErr = mgClient.CreateOrUpdate(context.Background(), mgName, Request, "no-cache")
   	if queryErr == nil {
   		fmt.Printf("Results: " + fmt.Sprint(results) + "\n")
   	} else {
   		fmt.Printf(queryErr.Error())
   	}
   }
   ```

1. Build the Go application:

   ```bash
   go build mgCreate.go
   ```

1. Create a management group using the compiled Go application. Replace `<Name>` with the name of
   your new management group:

   ```bash
   mgCreate "<Name>"
   ```

The result is a new management group in the root management group.

## Clean up resources

If you wish to remove the installed packages from your Go environment, you can do so by using
the following command:

```bash
# Remove the installed packages from the Go environment
go clean -i github.com/Azure/azure-sdk-for-go/services/resources/mgmt/2020-05-01/managementgroups
go clean -i github.com/Azure/go-autorest/autorest/azure/auth
```

## Next steps

In this quickstart, you created a management group to organize your resource hierarchy. The
management group can hold subscriptions or other management groups.

To learn more about management groups and how to manage your resource hierarchy, continue to:

> [!div class="nextstepaction"]
> [Manage your resources with management groups](./manage.md)
