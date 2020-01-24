---
title: Single User/Password Rotation Tutorial
description: Use this how-to guide to help you set up key rotation and monitor key vault logs.
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: ''

ms.service: key-vault
ms.topic: conceptual
ms.date: 01/26/2020
ms.author: mbaldwin

---
# Single User/Password Rotation Tutorial
Single User/Password Rotation Tutorial

The best option to authenticate to Azure services is by using Managed Identity. There are scenarios where Managed Identity is not an option and then access keys or secrets are used. In those scenarios access keys or secrets should be periodically rotated.
This tutorial demonstrates how to automate periodic rotation (30 days before expiry) of secrets for databases and services with single user/password authentication. Below scenario would rotate SQL server password stored in key vault using function triggered by event grid notification.

![Rotation diagram](./media/rotate1.png)

1. Key Vault publish near expiry event to Event Grid 30 days before expiration date
1. Event Grid checks event subscriptions and calls (http post) Function App endpoint subscribed to this event
1. Function App receives secret information, generates new random password and create new version for that secret with new password in Key Vault
1. Function App updates SQL with new password

Note: There could be a lag between step 3 and 4 and during that time secret in Key Vault would not be valid to authenticate to SQL. In case of failure in any of the steps Event Grid retries for 2 hours.

## Infrastructure setup
Before required steps for rotation are demonstrated we need initial infrastructure setup to imitate common environment. 
Create resource group with Key Vault, SQL Server and store admin password in Key Vault as secret. 
This tutorial would use pre-created Azure Resource Manager template to create components. You can find entire code here(Basic Secret Rotation Template Sample).
Components List:
- Key Vault
- SQL Server

Azure Resource Manager template to create components: [Deploy](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjlichwa%2Fazure-keyvault-basicrotation-tutorial%2Fmaster%2Farm-templates%2Finitial-setup%2Fazuredeploy.json)
- Create new resource group like below
- Click Purchase

![Purchase screen](./media/rotate2.png)

For simplicity you can run below deployment to create all components and configuration at once and skip to step 3:
Components List:
- Key Vault
- SQL Server
- App Service Plan
- Function App
- Storage Account
- Web App
Azure Resource Manager template to create components: [Deploy](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjlichwa%2Fazure-keyvault-basicrotation-tutorial%2Fmaster%2Farm-templates%2Fall%2Fazuredeploy.json)

## Create Function App

Function app requires below components and configuration:
- App Service Plan
- Storage Account
- Function App with System Managed Identity
- Access policy to access secrets in Key Vault using Function App Managed Identity

Azure Resource Manager template to create components:[Deploy](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjlichwa%2Fazure-keyvault-basicrotation-tutorial%2Fmaster%2Farm-templates%2Ffunction-app%2Fazuredeploy.json)
- Select resource group like below
- Click Purchase

![Purchase screen](./media/rotate3.png)


For information how to create Function App and using Managed Identity to access Key Vault, see [Create a function app from the Azure portal](../azure-functions/functions-create-function-app-portal.md) and [Provide Key Vault authentication with a managed identity](managed-identity.md)

### Rotation function and deployment

Rotation function is using event grid as a trigger, retrieves secret information and executes rotation:

```
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

Rotation method reads database information from secret, create new version of secret and updates database with new secret.

```
public class SeretRotator
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

Download function app zip file:
https://github.com/jlichwa/azure-keyvault-basicrotation-tutorial/raw/master/simplerotationsample-fn.zip

Upload file simplerotationsample-fn.zip to Cloud Shell 
 
Use below CLI command to deploy zip file to function app:

```azurecli
az functionapp deployment source config-zip -g simplerotation -n simplerotation-fn --src /home/{firstname e.g jack}/simplerotationsample-fn.zip
```

After deployment you should notice two functions under simplerotation-fn:

![Purchase screen](./media/rotate4.png)

### Add event subscription for “SecretNearExpiry” event

Copy function app eventgrid_extension key.

![Cloud Shell](./media/rotate5.png)

![Cloud Shell](./media/rotate6.png)

Replace copied key and your subscription id in below command to create event grid subscription for SecretNearExpiry events.

```azurecli
az eventgrid event-subscription create --name simplerotation-eventsubscription --source-resource-id "/subscriptions/{subscriptionId}/resourceGroups/simplerotation/providers/Microsoft.KeyVault/vaults/simplerotation-kv" --endpoint "https://simplerotation-fn.azurewebsites.net/runtime/webhooks/EventGrid?functionName=SimpleRotation&code={key}" --endpoint-type WebHook --included-event-types "Microsoft.KeyVault.SecretNearExpiry"
```

### Add secret to Key Vault
Set access policy to give permission to manage secrets for user

```azurecli
az keyvault set-policy --upn "{email e.g. jalichwa@microsoft.com}" --name simplerotation-kv --secret-permissions set delete get list
```

Create new secret with tags containing sql database datasource and user id with expiration date for tomorrow. 

```azurecli
$tomorrowDate = (get-date).AddDays(+1).ToString("yyy-MM-ddThh:mm:ssZ")
az keyvault secret set --name sqluser --vault-name simplerotation-kv --value "Simple123" --tags "UserID=azureuser" "DataSource=simplerotation-sql.database.windows.net" --expires $tomorrowDate
```

Creating secret with short expiration date would immediately publish SecretNearExpiry event which would trigger function to rotate the secret.

### Test and verify
After few minutes sqluser secret should automatically rotate. 

To verify secret rotation verification, go to Key Vault>Secrets

  ![Test and verify](./media/rotate7.png)

Open sqluser secret to see initial and rotated version

   ![Test and verify](./media/rotate8.png)

To verify SQL credentials, use a web application. The web application will get secret from key vault, extract sql database information and credentials from secret and test connection to sql.

## Create Web App

Web app requires below components and configuration:
- Web App with System Managed Identity
- Access policy to access secrets in Key Vault using Web App Managed Identity

Azure Resource Manager template to create components:
[Deploy](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjlichwa%2Fazure-keyvault-basicrotation-tutorial%2Fmaster%2Farm-templates%2Fweb-app%2Fazuredeploy.json)
- Select ‘simplerotation’ resource group
- Click Purchase

### Deploy Web App

Source code:
https://github.com/jlichwa/azure-keyvault-basicrotation-tutorial/tree/master/test-webapp

1. Download function app zip file:
https://github.com/jlichwa/azure-keyvault-basicrotation-tutorial/raw/master/simplerotationsample-app.zip
1. Upload file simplerotationsample-app.zip to Cloud Shell
1. Use below CLI command to deploy zip file to function app:

   ```azurecli
   az webapp deployment source config-zip -g simplerotation -n simplerotation-app --src /home/{firstname e.g jack}/simplerotationsample-app.zip
   ```

#### Open web Application

Go to deployed application and click URL
 
![Test and verify](./media/rotate10.png)

Generated Secret Value should be shown with Database Connected as true.

![Test and verify](./media/rotate11.png)
