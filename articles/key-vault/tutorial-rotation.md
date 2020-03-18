---
title: Single User/Password Rotation Tutorial
description: Use this tutorial for automating rotation of single user/password
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: 'rotation'

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 01/26/2020
ms.author: mbaldwin

---
# Automate the rotation of a secret for resources with single user/password authentication

Although the best way to authenticate to Azure services is by using an [managed identity](managed-identity.md), there are some scenarios where this is not an option. In these cases, access keys or secrets are used. Access keys or secrets should be periodically rotated.

This tutorial demonstrates how to automate the periodic rotation of secrets for databases and services with single user/password authentication. Specifically, this scenario rotates SQL server passwords stored in key vault using a function triggered by Event Grid notification:

![Rotation diagram](./media/rotate1.png)

1. Thirty days before the expiration date of a secret, Key Vault publish the "near expiry" event to Event Grid.
1. Event Grid checks the event subscriptions and, using http post, calls the Function App endpoint subscribed to this event.
1. The function App receives the secret information, generates a new random password, and creates a new version for the secret with a new password in Key Vault.
1. The function App updates SQL with new password.

> [!NOTE]
> There could be a lag between step 3 and 4 and during that time secret in Key Vault would not be valid to authenticate to SQL. 
> In case of failure in any of the steps Event Grid retries for 2 hours.

## Setup

## Create a key vault and SQL server

Before we begin, we must create a Key Vault, create a SQL Server and database, and store the SQL Server admin password in Key Vault.

This tutorial uses a pre-created Azure Resource Manager template to create components. You can find entire code here: [Basic Secret Rotation Template Sample](https://github.com/jlichwa/azure-keyvault-basicrotation-tutorial/tree/master/arm-templates).

1. Click Azure template deployment link: 
<br><a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjlichwa%2Fazure-keyvault-basicrotation-tutorial%2Fmaster%2Farm-templates%2Finitial-setup%2Fazuredeploy.json" target="_blank"> <img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png"/></a>
1. For "Resource Group", select "Create New" and give it the name "simplerotation".
1. Select "Purchase".

    ![Create new resource group](./media/rotate2.png)

After completing these steps, you will have a key vault, a SQL server, and a SQL database. You can verify this in an Azure CLI terminal by running:

```azurecli
az resource list -o table
```

The results will look something this:

```console
Name                     ResourceGroup         Location    Type                               Status
-----------------------  --------------------  ----------  ---------------------------------  --------
simplerotation-kv             simplerotation             eastus      Microsoft.KeyVault/vaults
simplerotation-sql            simplerotation             eastus      Microsoft.Sql/servers
simplerotation-sql/master     simplerotation             eastus      Microsoft.Sql/servers/databases
```

## Create Function App

Create a Function App with a system-managed identity, as well as the additional required components: 

Function app requires below components and configuration:
- App Service Plan
- Storage Account
- Access policy to access secrets in Key Vault using Function App Managed Identity

1. Click Azure template deployment link: 
<br><a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjlichwa%2Fazure-keyvault-basicrotation-tutorial%2Fmaster%2Farm-templates%2Ffunction-app%2Fazuredeploy.json" target="_blank"><img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png"/></a>
1. For "Resource Group", select "simplerotation".
1. Select "Purchase".

   ![Purchase screen](./media/rotate3.png)

After completing the steps above, you will have a storage account, a server farm, and a Function App.  You can verify this in an Azure CLI terminal by running:

```azurecli
az resource list -o table
```

The results will look something this:

```console
Name                     ResourceGroup         Location    Type                               Status
-----------------------  --------------------  ----------  ---------------------------------  --------
simplerotation-kv             simplerotation             eastus      Microsoft.KeyVault/vaults
simplerotation-sql            simplerotation             eastus      Microsoft.Sql/servers
simplerotation-sql/master     simplerotation             eastus      Microsoft.Sql/servers/databases
simplerotationstrg            simplerotation             eastus      Microsoft.Storage/storageAccounts
simplerotation-plan           simplerotation             eastus      Microsoft.Web/serverFarms
simplerotation-fn             simplerotation             eastus      Microsoft.Web/sites
```

For information how to create Function App and using Managed Identity to access Key Vault, see [Create a function app from the Azure portal](../azure-functions/functions-create-function-app-portal.md) and [Provide Key Vault authentication with a managed identity](managed-identity.md)

### Rotation function and deployment
Function is using event as trigger and perform rotation of a secret updating Key Vault and SQL database.

#### Function Event Trigger Handler

Below Function reads event data and executes rotation logic

```csharp
public static class SimpleRotationEventHandler
{
    [FunctionName("SimpleRotation")]
       public static void Run([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
       {
            log.LogInformation("C# Event trigger function processed a request.");
            var secretName = eventGridEvent.Subject;
            var secretVersion = Regex.Match(eventGridEvent.Data.ToString(), "Version\":\"([a-z0-9]*)").Groups[1].ToString();
            var keyVaultName = Regex.Match(eventGridEvent.Topic, ".vaults.(.*)").Groups[1].ToString();
            log.LogInformation($"Key Vault Name: {keyVaultName}");
            log.LogInformation($"Secret Name: {secretName}");
            log.LogInformation($"Secret Version: {secretVersion}");

            SeretRotator.RotateSecret(log, secretName, secretVersion, keyVaultName);
        }
}
```

#### Secret Rotation Logic
This rotation method reads database information from the secret, create a new version of the secret, and updates the database with a new secret.

```csharp
public class SecretRotator
    {
       private const string UserIdTagName = "UserID";
       private const string DataSourceTagName = "DataSource";
       private const int SecretExpirationDays = 31;

    public static void RotateSecret(ILogger log, string secretName, string secretVersion, string keyVaultName)
    {
           //Retrieve Current Secret
           var kvUri = "https://" + keyVaultName + ".vault.azure.net";
           var client = new SecretClient(new Uri(kvUri), new DefaultAzureCredential());
           KeyVaultSecret secret = client.GetSecret(secretName, secretVersion);
           log.LogInformation("Secret Info Retrieved");
        
           //Retrieve Secret Info
           var userId = secret.Properties.Tags.ContainsKey(UserIdTagName) ?  
                        secret.Properties.Tags[UserIdTagName] : "";
           var datasource = secret.Properties.Tags.ContainsKey(DataSourceTagName) ? 
                            secret.Properties.Tags[DataSourceTagName] : "";
           log.LogInformation($"Data Source Name: {datasource}");
           log.LogInformation($"User Id Name: {userId}");
        
           //create new password
           var randomPassword = CreateRandomPassword();
           log.LogInformation("New Password Generated");
        
           //Check db connection using existing secret
           CheckServiceConnection(secret);
           log.LogInformation("Service Connection Validated");
                    
           //Create new secret with generated password
           CreateNewSecretVersion(client, secret, randomPassword);
           log.LogInformation("New Secret Version Generated");
        
           //Update db password
           UpdateServicePassword(secret, randomPassword);
           log.LogInformation("Password Changed");
           log.LogInformation($"Secret Rotated Succesffuly");
    }
}
```
You can find entire code here:
https://github.com/jlichwa/azure-keyvault-basicrotation-tutorial/tree/master/rotation-function

#### Function deployment

1. Download function app zip file:
https://github.com/jlichwa/azure-keyvault-basicrotation-tutorial/raw/master/simplerotationsample-fn.zip

1. Upload file simplerotationsample-fn.zip to Azure Cloud Shell.
 
1. Use below CLI command to deploy zip file to function app:

```azurecli
az functionapp deployment source config-zip -g simplerotation -n simplerotation-fn --src /home/{firstname e.g jack}/simplerotationsample-fn.zip
```
![Purchase screen](./media/rotate4.png)

After deployment you should notice two functions under simplerotation-fn:

![Azure Cloud Shell](./media/rotate5.png)

### Add event subscription for "SecretNearExpiry" event

Copy the function app eventgrid_extension key.

![Azure Cloud Shell](./media/rotate6.png)

![Test and verify](./media/rotate7.png)

Use the copied eventgrid extension key and your subscription ID in below command to create an event grid subscription for SecretNearExpiry events.

```azurecli
az eventgrid event-subscription create --name simplerotation-eventsubscription --source-resource-id "/subscriptions/<subscription-id>/resourceGroups/simplerotation/providers/Microsoft.KeyVault/vaults/simplerotation-kv" --endpoint "https://simplerotation-fn.azurewebsites.net/runtime/webhooks/EventGrid?functionName=SimpleRotation&code=<extension-key>" --endpoint-type WebHook --included-event-types "Microsoft.KeyVault.SecretNearExpiry"
```

### Add secret to Key Vault
Set your access policy to give "manage secrets" permission to users.

```azurecli
az keyvault set-policy --upn <email-address-of-user> --name simplerotation-kv --secret-permissions set delete get list
```

Now create a new secret with tags containing sql database datasource and user ID, with the expiration date set for tomorrow.

```azurecli
$tomorrowDate = (get-date).AddDays(+1).ToString("yyy-MM-ddThh:mm:ssZ")
az keyvault secret set --name sqluser --vault-name simplerotation-kv --value "Simple123" --tags "UserID=azureuser" "DataSource=simplerotation-sql.database.windows.net" --expires $tomorrowDate
```

Creating a secret with a short expiration date will immediately publish a SecretNearExpiry event, which will in turn trigger the function to rotate the secret.

### Test and verify
After few minutes, sqluser secret should automatically rotate.

To verify secret rotation verification, go to Key Vault > Secrets

![Test and verify](./media/rotate8.png)

Open the "sqluser" secret and view the original and rotated version

![Test and verify](./media/rotate9.png)

## Create Web App

To verify SQL credentials, create a web application. This web application will get the secret from key vault, extract sql database information and credentials from the secret, and test the connection to sql.

The web app requires below components and configuration:
- Web App with System-Managed Identity
- Access policy to access secrets in Key Vault using Web App Managed Identity

1. Click Azure template deployment link: 
<br><a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjlichwa%2Fazure-keyvault-basicrotation-tutorial%2Fmaster%2Farm-templates%2Fweb-app%2Fazuredeploy.json" target="_blank"> <img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png"/></a>
1. Select the **simplerotation** resource group
1. Click Purchase

### Deploy Web App

Source code for the web app you can find at https://github.com/jlichwa/azure-keyvault-basicrotation-tutorial/tree/master/test-webapp 
For deployment of the web app, do the following:

1. Download the function app zip file from 
https://github.com/jlichwa/azure-keyvault-basicrotation-tutorial/raw/master/simplerotationsample-app.zip
1. Upload the file `simplerotationsample-app.zip` to Azure Cloud Shell.
1. Use this Azure CLI command to deploy the zip file to the function app:

   ```azurecli
   az webapp deployment source config-zip -g simplerotation -n simplerotation-app --src /home/{firstname e.g jack}/simplerotationsample-app.zip
   ```

#### Open web Application

Go to the deployed application and click "URL":
 
![Test and verify](./media/rotate10.png)

The Generated Secret Value should be shown with Database Connected as true.

## Learn more:

- Overview: [Monitoring Key Vault with Azure Event Grid (preview)](event-grid-overview.md)
- How to: [Receive email when a key vault secret changes](event-grid-logicapps.md)
- [Azure Event Grid event schema for Azure Key Vault (preview)](../event-grid/event-schema-key-vault.md)
