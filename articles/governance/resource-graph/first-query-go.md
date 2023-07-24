---
title: "Quickstart: Your first Go query"
description: In this quickstart, you follow the steps to enable the Resource Graph package for Go and run your first query.
ms.date: 07/09/2021
ms.topic: quickstart
ms.devlang: golang
ms.custom: devx-track-go
---
# Quickstart: Run your first Resource Graph query using Go

The first step to using Azure Resource Graph is to check that the required packages for Go are
installed. This quickstart walks you through the process of adding the packages to your Go
installation.

At the end of this process, you'll have added the packages to your Go installation and run your
first Resource Graph query.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

## Add the Resource Graph package

To enable Go to query Azure Resource Graph, the package must be added. This package works wherever
Go can be used, including [bash on Windows 10](/windows/wsl/install-win10) or locally installed.

1. Check that the latest Go is installed (at least **1.14**). If it isn't yet installed, download it
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

1. In your Go environment of choice, install the required packages for Azure Resource Graph:

   ```bash
   # Add the Resource Graph package for Go
   go get -u github.com/Azure/azure-sdk-for-go/services/resourcegraph/mgmt/2021-03-01/resourcegraph

   # Add the Azure auth package for Go
   go get -u github.com/Azure/go-autorest/autorest/azure/auth
   ```

## Run your first Resource Graph query

With the Go packages added to your environment of choice, it's time to try out a simple Resource
Graph query. The query returns the first five Azure resources with the **Name** and **Resource
Type** of each resource.

1. Create the Go application and save the following source as `argQuery.go`:

   ```go
   package main

   import (
      "fmt"
      "os"
      "context"
      "strconv"
      arg "github.com/Azure/azure-sdk-for-go/services/resourcegraph/mgmt/2021-03-01/resourcegraph"
      "github.com/Azure/go-autorest/autorest/azure/auth"
   )

   func main() {
       // Get variables from command line arguments
       var query = os.Args[1]
       var subList = os.Args[2:]

       // Create and authorize a ResourceGraph client
       argClient := arg.New()
       authorizer, err := auth.NewAuthorizerFromCLI()
       if err == nil {
           argClient.Authorizer = authorizer
       } else {
           fmt.Printf(err.Error())
       }

       // Set options
       RequestOptions := arg.QueryRequestOptions {
           ResultFormat: "objectArray",
       }

       // Create the query request
       Request := arg.QueryRequest {
           Subscriptions: &subList,
           Query: &query,
           Options: &RequestOptions,
       }

       // Run the query and get the results
       var results, queryErr = argClient.Resources(context.Background(), Request)
       if queryErr == nil {
           fmt.Printf("Resources found: " + strconv.FormatInt(*results.TotalRecords, 10) + "\n")
           fmt.Printf("Results: " + fmt.Sprint(results.Data) + "\n")
       } else {
           fmt.Printf(queryErr.Error())
       }
   }
   ```

1. Build the Go application:

   ```bash
   go build argQuery.go
   ```

1. Run your first Azure Resource Graph query using the compiled Go application. Replace `<SubID>`
   with your subscription ID:

   ```bash
   argQuery "Resources | project name, type | limit 5" "<SubID>"
   ```

   > [!NOTE]
   > As this query example does not provide a sort modifier such as `order by`, running this query
   > multiple times is likely to yield a different set of resources per request.

1. Change the first parameter to `argQuery` and change the query to `order by` the **Name**
   property. Replace `<SubID>` with your subscription ID:

   ```bash
   argQuery "Resources | project name, type | limit 5 | order by name asc" "<SubID>"
   ```

   > [!NOTE]
   > Just as with the first query, running this query multiple times is likely to yield a different
   > set of resources per request. The order of the query commands is important. In this example,
   > the `order by` comes after the `limit`. This command order first limits the query results and
   > then orders them.

1. Change the first parameter to `argQuery` and change the query to first `order by` the **Name**
   property and then `limit` to the top five results. Replace `<SubID>` with your subscription ID:

   ```bash
   argQuery "Resources | project name, type | order by name asc | limit 5" "<SubID>"
   ```

When the final query is run several times, assuming that nothing in your environment is changing,
the results returned are consistent and ordered by the **Name** property, but still limited to the
top five results.

## Clean up resources

If you wish to remove the installed packages from your Go environment, you can do so by using
the following command:

```bash
# Remove the installed packages from the Go environment
go clean -i github.com/Azure/azure-sdk-for-go/services/resourcegraph/mgmt/2019-04-01/resourcegraph
go clean -i github.com/Azure/go-autorest/autorest/azure/auth
```

## Next steps

In this quickstart, you've added the Resource Graph packages to your Go environment and run your
first query. To learn more about the Resource Graph language, continue to the query language details
page.

> [!div class="nextstepaction"]
> [Get more information about the query language](./concepts/query-language.md)
