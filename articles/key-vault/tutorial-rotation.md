---
title: Single user/password rotation tutorial
description: Use this tutorial to learn how to automate the rotation of a secret for resources with single user/password authentication.
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

The best way to authenticate to Azure services is by using a [managed identity](managed-identity.md), but there are some scenarios where that isn't an option. In those cases, access keys or secrets are used. You should periodically rotate access keys or secrets.

This tutorial demonstrates how to automate the periodic rotation of secrets for databases and services with single user/password authentication. Specifically, this tutorial rotates SQL Server passwords stored in Azure Key Vault by using a function triggered by Azure Event Grid notification:

![Diagram of rotation solution](./media/rotate1.png)

1. Thirty days before the expiration date of a secret, Key Vault publishes the "near expiry" event to Event Grid.
1. Event Grid checks the event subscriptions and uses HTTP POST to call the function app endpoint subscribed to the event.
1. The function app receives the secret information, generates a new random password, and creates a new version for the secret with the new password in Key Vault.
1. The function app updates SQL Server with the new password.

> [!NOTE]
> There could be a lag between steps 3 and 4. During that time, the secret in Key Vault won't be able to authenticate to SQL Server. 
> In case of a failure of any of the steps, Event Grid retries for two hours.

## Create a key vault and SQL Server instance

The first step is to create a key vault and a SQL Server instance and database and store the SQL Server admin password in Key Vault.

This tutorial uses an existing Azure Resource Manager template to create components. You can find the code here: [Basic Secret Rotation Template Sample](https://github.com/jlichwa/azure-keyvault-basicrotation-tutorial/tree/master/arm-templates).

1. Select the Azure template deployment link: 
<br><a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjlichwa%2Fazure-keyvault-basicrotation-tutorial%2Fmaster%2Farm-templates%2Finitial-setup%2Fazuredeploy.json" target="_blank"> <img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png"/></a>
1. Under **Resource group**, select **Create new**. Name the group **simplerotation**.
1. Select **Purchase**.

    ![Create a resource group](./media/rotate2.png)

You will now have a key vault, a SQL Server instance, and a SQL database. You can verify this setup in Azure CLI by running this command:

```azurecli
az resource list -o table
```

The result will look something the following output:

```console
Name                     ResourceGroup         Location    Type                               Status
-----------------------  --------------------  ----------  ---------------------------------  --------
simplerotation-kv          simplerotation      eastus      Microsoft.KeyVault/vaults
simplerotation-sql         simplerotation      eastus      Microsoft.Sql/servers
simplerotation-sql/master  simplerotation      eastus      Microsoft.Sql/servers/databases
```

## Create a function app

Create a function app with a system-managed identity, in addition to the other required components.

The function app requires these components and configuration:
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
