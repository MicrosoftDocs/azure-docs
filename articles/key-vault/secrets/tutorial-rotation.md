---
title: Rotation tutorial for resources with one set of authentication credentials stored in Azure Key Vault
description: Use this tutorial to learn how to automate the rotation of a secret for resources that use one set of authentication credentials.
services: key-vault
author: msmbaldwin
tags: 'rotation'

ms.service: key-vault
ms.subservice: secrets
ms.topic: tutorial
ms.date: 01/26/2020
ms.author: mbaldwin
ms.custom: devx-track-csharp

---
# Automate the rotation of a secret for resources that use one set of authentication credentials

The best way to authenticate to Azure services is by using a [managed identity](../general/authentication.md), but there are some scenarios where that isn't an option. In those cases, access keys or secrets are used. You should periodically rotate access keys or secrets.

This tutorial shows how to automate the periodic rotation of secrets for databases and services that use one set of authentication credentials. Specifically, this tutorial rotates SQL Server passwords stored in Azure Key Vault by using a function triggered by Azure Event Grid notification:


:::image type="content" source="../media/rotate-1.png" alt-text="Diagram of rotation solution":::

1. Thirty days before the expiration date of a secret, Key Vault publishes the "near expiry" event to Event Grid.
1. Event Grid checks the event subscriptions and uses HTTP POST to call the function app endpoint subscribed to the event.
1. The function app receives the secret information, generates a new random password, and creates a new version for the secret with the new password in Key Vault.
1. The function app updates SQL Server with the new password.

> [!NOTE]
> There could be a lag between steps 3 and 4. During that time, the secret in Key Vault won't be able to authenticate to SQL Server. 
> In case of a failure of any of the steps, Event Grid retries for two hours.

## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Azure Key Vault
* SQL Server

Below deployment link can be used, if you don't have existing Key Vault and SQL Server:

[![Image showing a button labeled "Deploy to Azure".](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FKeyVault-Rotation-SQLPassword-Csharp%2Fmain%2FARM-Templates%2FInitial-Setup%2Fazuredeploy.json)

1. Under **Resource group**, select **Create new**. Give group a name, we use **akvrotation** in this tutorial.
1. Under **Sql Admin Login**, type Sql administrator login name. 
1. Select **Review + create**.
1. Select **Create**

:::image type="content" source="../media/rotate-2.png" alt-text="Create a resource group":::

You'll now have a Key Vault, and a SQL Server instance. You can verify this setup in the Azure CLI by running the following command:

```azurecli
az resource list -o table -g akvrotation
```

The result will look something the following output:

```console
Name                     ResourceGroup         Location    Type                               Status
-----------------------  --------------------  ----------  ---------------------------------  --------
akvrotation-kv           akvrotation      eastus      Microsoft.KeyVault/vaults
akvrotation-sql          akvrotation      eastus      Microsoft.Sql/servers
akvrotation-sql/master   akvrotation      eastus      Microsoft.Sql/servers/databases
akvrotation-sql2         akvrotation      eastus      Microsoft.Sql/servers
akvrotation-sql2/master  akvrotation      eastus      Microsoft.Sql/servers/databases
```

## Create and deploy sql server password rotation function
> [!IMPORTANT]
> Below template requires Key Vault, SQL server and Azure Function to be in the same resource group

Next, create a function app with a system-managed identity, in addition to the other required components, and deploy sql server password rotation functions

The function app requires these components:
- An Azure App Service plan
- A Function App with Sql password rotation functions with event trigger and http trigger 
- A storage account required for function app trigger management
- An access policy for Function App identity to access secrets in Key Vault
- An EventGrid event subscription for **SecretNearExpiry** event

1. Select the Azure template deployment link: 

   [![Image showing a button labeled "Deploy to Azure".](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FKeyVault-Rotation-SQLPassword-Csharp%2Fmain%2FARM-Templates%2FFunction%2Fazuredeploy.json)

1. In the **Resource group** list, select **akvrotation**.
1. In the **Sql Server Name**, type the Sql Server name with password to rotate
1. In the **Key Vault Name**,  type the key vault name
1. In the **Function App Name**,  type the function app name
1. In the **Secret Name**,  type secret name where the password will be stored
1. In the **Repo Url**, type function code GitHub location (**https://github.com/Azure-Samples/KeyVault-Rotation-SQLPassword-Csharp.git**)
1. Select **Review + create**.
1. Select **Create**.

:::image type="content" source="../media/rotate-3.png" alt-text="Select Review+create":::
  

After you complete the preceding steps, you'll have a storage account, a server farm, and a function app. You can verify this setup in the Azure CLI by running the following command:

```azurecli
az resource list -o table -g akvrotation
```

The result will look something like the following output:

```console
Name                     ResourceGroup         Location    Type                               Status
-----------------------  --------------------  ----------  ---------------------------------  --------
akvrotation-kv           akvrotation       eastus      Microsoft.KeyVault/vaults
akvrotation-sql          akvrotation       eastus      Microsoft.Sql/servers
akvrotation-sql/master   akvrotation       eastus      Microsoft.Sql/servers/databases
cfogyydrufs5wazfunctions akvrotation       eastus      Microsoft.Storage/storageAccounts
akvrotation-fnapp        akvrotation       eastus      Microsoft.Web/serverFarms
akvrotation-fnapp        akvrotation       eastus      Microsoft.Web/sites
akvrotation-fnapp        akvrotation       eastus      Microsoft.insights/components
```

For information on how to create a function app and use managed identity to access Key Vault, see [Create a function app from the Azure portal](../../azure-functions/functions-create-function-app-portal.md), [How to use managed identity for App Service and Azure Functions](../../app-service/overview-managed-identity.md), and [Assign a Key Vault access policy using the Azure portal](../general/assign-access-policy-portal.md).

### Rotation function
Deployed in previous step function uses an event to trigger the rotation of a secret by updating Key Vault and the SQL database. 

#### Function trigger event

This function reads event data and runs the rotation logic:

```csharp
public static class SimpleRotationEventHandler
{
   [FunctionName("AKVSQLRotation")]
   public static void Run([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
   {
      log.LogInformation("C# Event trigger function processed a request.");
      var secretName = eventGridEvent.Subject;
      var secretVersion = Regex.Match(eventGridEvent.Data.ToString(), "Version\":\"([a-z0-9]*)").Groups[1].ToString();
      var keyVaultName = Regex.Match(eventGridEvent.Topic, ".vaults.(.*)").Groups[1].ToString();
      log.LogInformation($"Key Vault Name: {keyVaultName}");
      log.LogInformation($"Secret Name: {secretName}");
      log.LogInformation($"Secret Version: {secretVersion}");

      SecretRotator.RotateSecret(log, secretName, keyVaultName);
   }
}
```

#### Secret rotation logic
This rotation method reads database information from the secret, creates a new version of the secret, and updates the database with the new secret:

```csharp
    public class SecretRotator
    {
		private const string CredentialIdTag = "CredentialId";
		private const string ProviderAddressTag = "ProviderAddress";
		private const string ValidityPeriodDaysTag = "ValidityPeriodDays";

		public static void RotateSecret(ILogger log, string secretName, string keyVaultName)
        {
            //Retrieve Current Secret
            var kvUri = "https://" + keyVaultName + ".vault.azure.net";
            var client = new SecretClient(new Uri(kvUri), new DefaultAzureCredential());
            KeyVaultSecret secret = client.GetSecret(secretName);
            log.LogInformation("Secret Info Retrieved");

            //Retrieve Secret Info
            var credentialId = secret.Properties.Tags.ContainsKey(CredentialIdTag) ? secret.Properties.Tags[CredentialIdTag] : "";
            var providerAddress = secret.Properties.Tags.ContainsKey(ProviderAddressTag) ? secret.Properties.Tags[ProviderAddressTag] : "";
            var validityPeriodDays = secret.Properties.Tags.ContainsKey(ValidityPeriodDaysTag) ? secret.Properties.Tags[ValidityPeriodDaysTag] : "";
            log.LogInformation($"Provider Address: {providerAddress}");
            log.LogInformation($"Credential Id: {credentialId}");

            //Check Service Provider connection
            CheckServiceConnection(secret);
            log.LogInformation("Service  Connection Validated");
            
            //Create new password
            var randomPassword = CreateRandomPassword();
            log.LogInformation("New Password Generated");

            //Add secret version with new password to Key Vault
            CreateNewSecretVersion(client, secret, randomPassword);
            log.LogInformation("New Secret Version Generated");

            //Update Service Provider with new password
            UpdateServicePassword(secret, randomPassword);
            log.LogInformation("Password Changed");
            log.LogInformation($"Secret Rotated Successfully");
        }
}
```
You can find the complete code on [GitHub](https://github.com/Azure-Samples/KeyVault-Rotation-SQLPassword-Csharp).

## Add the secret to Key Vault
Set your access policy to grant *manage secrets* permissions to users:

```azurecli
az keyvault set-policy --upn <email-address-of-user> --name akvrotation-kv --secret-permissions set delete get list
```

Create a new secret with tags that contain the SQL Server resource ID, the SQL Server login name, and validity period for the secret in days. Provide name of the secret, initial password from SQL database (in our example "Simple123") and include an expiration date that's set for tomorrow.

```azurecli
$tomorrowDate = (get-date).AddDays(+1).ToString("yyy-MM-ddThh:mm:ssZ")
az keyvault secret set --name sqlPassword --vault-name akvrotation-kv --value "Simple123" --tags "CredentialId=sqlAdmin" "ProviderAddress=<sql-database-resource-id>" "ValidityPeriodDays=90" --expires $tomorrowDate
```

Creating a secret with a short expiration date will publish a `SecretNearExpiry` event within 15 minutes, which will in turn trigger the function to rotate the secret.

## Test and verify

To verify that the secret has rotated, go to **Key Vault** > **Secrets**:

:::image type="content" source="../media/rotate-8.png" alt-text="Screenshot that shows how to access Key Vault > Secrets.":::

Open the **sqlPassword** secret and view the original and rotated versions:

:::image type="content" source="../media/rotate-9.png" alt-text="Go to Secrets":::

### Create a web app

To verify the SQL credentials, create a web app. This web app will get the secret from Key Vault, extract SQL database information and credentials from the secret, and test the connection to SQL Server.

The web app requires these components:
- A web app with system-managed identity
- An access policy to access secrets in Key Vault via web app managed identity

1. Select the Azure template deployment link: 

   [![Image showing a button labeled "Deploy to Azure".](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FKeyVault-Rotation-SQLPassword-Csharp-WebApp%2Fmain%2FARM-Templates%2FWeb-App%2Fazuredeploy.json)

1. Select the **akvrotation** resource group.
1. In the **Sql Server Name**, type the Sql Server name with password to rotate
1. In the **Key Vault Name**,  type the key vault name
1. In the **Secret Name**,  type secret name where the password is stored
1. In the **Repo Url**, type web app code GitHub location (**https://github.com/Azure-Samples/KeyVault-Rotation-SQLPassword-Csharp-WebApp.git**)
1. Select **Review + create**.
1. Select **Create**.


### Open the web app

Go to the deployed application URL:
 
'https://akvrotation-app.azurewebsites.net/'

When the application opens in the browser, you will see the **Generated Secret Value** and a **Database Connected** value of *true*.

## Learn more

- Tutorial: [Rotation for resources with two sets of credentials](tutorial-rotation-dual.md)
- Overview: [Monitoring Key Vault with Azure Event Grid](../general/event-grid-overview.md)
- How to: [Receive email when a key vault secret changes](../general/event-grid-logicapps.md)
- [Azure Event Grid event schema for Azure Key Vault](../../event-grid/event-schema-key-vault.md)
