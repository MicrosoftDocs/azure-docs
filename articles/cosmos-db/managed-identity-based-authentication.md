---
title: How to use a system-assigned managed identity to access Azure Cosmos DB data
description: Learn how to configure an Azure Active Directory (Azure AD) system-assigned managed identity (managed service identity) to access keys from Azure Cosmos DB. 
author: j-patrick
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.date: 03/20/2020
ms.author: justipat
ms.reviewer: sngun
ms.custom: devx-track-csharp, devx-track-azurecli

---

# Use system-assigned managed identities to access Azure Cosmos DB data
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

In this article, you'll set up a *robust, key rotation agnostic* solution to access Azure Cosmos DB keys by using [managed identities](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md). The example in this article uses Azure Functions, but you can use any service that supports managed identities. 

You'll learn how to create a function app that can access Azure Cosmos DB data without needing to copy any Azure Cosmos DB keys. The function app will wake up every minute and record the current temperature of an aquarium fish tank. To learn how to set up a timer-triggered function app, see the [Create a function in Azure that is triggered by a timer](../azure-functions/functions-create-scheduled-function.md) article.

To simplify the scenario, a [Time To Live](./time-to-live.md) setting is already configured to clean up older temperature documents. 

## Assign a system-assigned managed identity to a function app

In this step, you'll assign a system-assigned managed identity to your function app.

1. In the [Azure portal](https://portal.azure.com/), open the **Azure Function** pane and go to your function app. 

1. Open the **Platform features** > **Identity** tab: 

   :::image type="content" source="./media/managed-identity-based-authentication/identity-tab-selection.png" alt-text="Screenshot showing Platform features and Identity options for the function app.":::

1. On the **Identity** tab, turn **On** the system identity **Status** and select **Save**. The **Identity** pane should look as follows:  

   :::image type="content" source="./media/managed-identity-based-authentication/identity-tab-system-managed-on.png" alt-text="Screenshot showing system identity Status set to On.":::

## Grant access to your Azure Cosmos account

In this step, you'll assign a role to the function app's system-assigned managed identity. Azure Cosmos DB has multiple built-in roles that you can assign to the managed identity. For this solution, you'll use the following two roles:

|Built-in role  |Description  |
|---------|---------|
|[DocumentDB Account Contributor](../role-based-access-control/built-in-roles.md#documentdb-account-contributor)|Can manage Azure Cosmos DB accounts. Allows retrieval of read/write keys. |
|[Cosmos DB Account Reader Role](../role-based-access-control/built-in-roles.md#cosmos-db-account-reader-role)|Can read Azure Cosmos DB account data. Allows retrieval of read keys. |

> [!IMPORTANT]
> Support for role-based access control in Azure Cosmos DB applies to control plane operations only. Data plane operations are secured through primary keys or resource tokens. To learn more, see the [Secure access to data](secure-access-to-data.md) article.

> [!TIP] 
> When you assign roles, assign only the needed access. If your service requires only reading data, then assign the **Cosmos DB Account Reader** role to the managed identity. For more information about the importance of least privilege access, see the [Lower exposure of privileged accounts](../security/fundamentals/identity-management-best-practices.md#lower-exposure-of-privileged-accounts) article.

In this scenario, the function app will read the temperature of the aquarium, then write back that data to a container in Azure Cosmos DB. Because the function app must write the data, you'll need to assign the **DocumentDB Account Contributor** role. 

### Assign the role using Azure portal

1. Sign in to the Azure portal and go to your Azure Cosmos DB account. Open the **Access control (IAM)** pane and then the **Role assignments** tab:

   :::image type="content" source="./media/managed-identity-based-authentication/cosmos-db-iam-tab.png" alt-text="Screenshot showing the Access control pane and the Role assignments tab.":::

1. Select **+ Add** > **Add role assignment**.

1. The **Add role assignment** panel opens to the right:

   :::image type="content" source="./media/managed-identity-based-authentication/cosmos-db-iam-tab-add-role-pane.png" alt-text="Screenshot showing the Add role assignment pane.":::

   * **Role**: Select **DocumentDB Account Contributor**
   * **Assign access to**: Under the **Select system-assigned managed identity** subsection, select **Function App**.
   * **Select**: The pane will be populated with all the function apps in your subscription that have a **Managed System Identity**. In this case, select the **FishTankTemperatureService** function app: 

      :::image type="content" source="./media/managed-identity-based-authentication/cosmos-db-iam-tab-add-role-pane-filled.png" alt-text="Screenshot showing the Add role assignment pane populated with examples.":::

1. After you have selected your function app, select **Save**.

### Assign the role using Azure CLI

To assign the role by using Azure CLI, open the Azure Cloud Shell and run the following commands:

```azurecli-interactive

scope=$(az cosmosdb show --name '<Your_Azure_Cosmos_account_name>' --resource-group '<CosmosDB_Resource_Group>' --query id)

principalId=$(az webapp identity show -n '<Your_Azure_Function_name>' -g '<Azure_Function_Resource_Group>' --query principalId)

az role assignment create --assignee $principalId --role "DocumentDB Account Contributor" --scope $scope
```

## Programmatically access the Azure Cosmos DB keys

Now we have a function app that has a system-assigned managed identity with the **DocumentDB Account Contributor** role in the Azure Cosmos DB permissions. The following function app code will get the Azure Cosmos DB keys, create a CosmosClient object, get the temperature of the aquarium, and then save this to Azure Cosmos DB.

This sample uses the [List Keys API](/rest/api/cosmos-db-resource-provider/2021-03-15/databaseaccounts/listkeys) to access your Azure Cosmos DB account keys.

> [!IMPORTANT] 
> If you want to [assign the Cosmos DB Account Reader](#grant-access-to-your-azure-cosmos-account) role, you'll need to use the [List Read Only Keys API](/rest/api/cosmos-db-resource-provider/2021-03-15/databaseaccounts/listreadonlykeys). This will populate just the read-only keys.

The List Keys API returns the `DatabaseAccountListKeysResult` object. This type isn't defined in the C# libraries. The following code shows the implementation of this class:  

```csharp 
namespace Monitor 
{
  public class DatabaseAccountListKeysResult
  {
      public string primaryMasterKey {get;set;}
      public string primaryReadonlyMasterKey {get; set;}
      public string secondaryMasterKey {get; set;}
      public string secondaryReadonlyMasterKey {get;set;}
  }
}
```

The example also uses a simple document called "TemperatureRecord," which is defined as follows:

```csharp
using System;

namespace Monitor
{
    public class TemperatureRecord
    {
        public string id { get; set; } = Guid.NewGuid().ToString();
        public DateTime RecordTime { get; set; }
        public int Temperature { get; set; }

    }
}
```

You'll use the [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) library to get the system-assigned managed identity token. To learn other ways to get the token and find out more information about the `Microsoft.Azure.Service.AppAuthentication` library, see the [Service-to-service authentication](/dotnet/api/overview/azure/service-to-service-authentication) article.


```csharp
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace Monitor
{
    public static class FishTankTemperatureService
    {
        private static string subscriptionId =
        "<azure subscription id>";
        private static string resourceGroupName =
        "<name of your azure resource group>";
        private static string accountName =
        "<Azure Cosmos DB account name>";
        private static string cosmosDbEndpoint =
        "<Azure Cosmos DB endpoint>";
        private static string databaseName =
        "<Azure Cosmos DB name>";
        private static string containerName =
        "<container to store the temperature in>";

        [FunctionName("FishTankTemperatureService")]
        public static async Task Run([TimerTrigger("0 * * * * *")]TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"Starting temperature monitoring: {DateTime.Now}");

            // AzureServiceTokenProvider will help us to get the Service Managed token.
            var azureServiceTokenProvider = new AzureServiceTokenProvider();

            // Authenticate to the Azure Resource Manager to get the Service Managed token.
            string accessToken = await azureServiceTokenProvider.GetAccessTokenAsync("https://management.azure.com/");

            // Setup the List Keys API to get the Azure Cosmos DB keys.
            string endpoint = $"https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DocumentDB/databaseAccounts/{accountName}/listKeys?api-version=2019-12-12";

            // Setup an HTTP Client and add the access token.
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            // Post to the endpoint to get the keys result.
            var result = await httpClient.PostAsync(endpoint, new StringContent(""));

            // Get the result back as a DatabaseAccountListKeysResult.
            DatabaseAccountListKeysResult keys = await result.Content.ReadAsAsync<DatabaseAccountListKeysResult>();

            log.LogInformation("Starting to create the client");

            CosmosClient client = new CosmosClient(cosmosDbEndpoint, keys.primaryMasterKey);

            log.LogInformation("Client created");

            var database = client.GetDatabase(databaseName);
            var container = database.GetContainer(containerName);

            log.LogInformation("Get the temperature.");

            var tempRecord = new TemperatureRecord() { RecordTime = DateTime.UtcNow, Temperature = GetTemperature() };

            log.LogInformation("Store temperature");

            await container.CreateItemAsync<TemperatureRecord>(tempRecord);

            log.LogInformation($"Ending temperature monitor: {DateTime.Now}");
        }

        private static int GetTemperature()
        {
            // Fake the temperature sensor for this demo.
            Random r = new Random(DateTime.UtcNow.Second);
            return r.Next(0, 120);
        }
    }
}
```

You are now ready to [deploy your function app](../azure-functions/create-first-function-vs-code-csharp.md).

## Next steps

* [Certificate-based authentication with Azure Cosmos DB and Azure Active Directory](certificate-based-authentication.md)
* [Secure Azure Cosmos DB keys using Azure Key Vault](access-secrets-from-keyvault.md)
* [Security baseline for Azure Cosmos DB](security-baseline.md)
