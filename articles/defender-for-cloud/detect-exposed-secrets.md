---
title: Detect exposed secrets in code
titleSuffix: Defender for Cloud
description: Prevent passwords and other secrets that may be stored in your code from being accessed by outside individuals by using Defender for Cloud's secret scanning for Defender for DevOps.
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 01/24/2023
---

# Detect exposed secrets in code

When passwords and other secrets are stored in source code, it poses a significant risk and could compromise the security of your environments. Defender for Cloud offers a solution by using secret scanning to detect credentials, secrets, certificates, and other sensitive content in your source code and your build output. Secret scanning can be run as part of the Microsoft Security DevOps for Azure DevOps extension. To explore the options available for secret scanning in GitHub, learn more [about secret scanning](https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/about-secret-scanning) in GitHub.

> [!NOTE]
> During the Defender for DevOps preview period, GitHub Advanced Security for Azure DevOps (GHAS for AzDO) is also providing a free trial of secret scanning.

Check the list of [supported file types and exit codes](#supported-file-types-and-exit-codes).

## Prerequisites

- An Azure subscription. If you don't have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

- [Configure the Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md)

## Setup secret scanning in Azure DevOps

You can run secret scanning as part of the Azure DevOps build process by using the Microsoft Security DevOps (MSDO) Azure DevOps extension.

**To add secret scanning to Azure DevOps build process**:

1. Sign in to [Azure DevOps](https://dev.azure.com/)

1. Navigate to **Pipeline**.

1. Locate the pipeline with MSDO Azure DevOps Extension is configured.

1. Select **Edit**.

1. Add the following lines to the YAML file

    ```yml
    inputs:
        categories: 'secrets'
    ```

1.  Select **Save**.

By adding the additions to your yaml file, you'll ensure that secret scanning only runs when you execute a build to your Azure DevOps pipeline.

## Remediate secrets findings

When credentials are discovered in your code, you can remove them. Instead you can use an alternative method that won't expose the secrets directly in your source code. Some of the best practices that exists to handle this type of situation include:

- Eliminating the use of credentials (if possible).

- Using secret storage such as Azure Key Vault (AKV).

- Updating your authentication methods to take advantage of managed identities (MSI) via Azure Active Directory (AAD).
  
**To remediate secrets findings using Azure Key Vault**:

1. Create a [key vault using PowerShell](../key-vault/general/quick-create-powershell.md).

1. [Add any necessary secrets](../key-vault/secrets/quick-create-net.md) for your application to your Key Vault.

1. Update your application to connect to Key Vault using managed identity with one of the following:

    - [Azure Key Vault for App Service application](../key-vault/general/tutorial-net-create-vault-azure-web-app.md)
    - [Azure Key Vault for applications deployed to a VM](../key-vault/general/tutorial-net-virtual-machine.md)

Once you have remediated findings, you can review the [Best practices for using Azure Key Vault](../key-vault/general/best-practices.md).

**To remediate secrets findings using managed identities**:

Before you can remediate secrets findings using managed identities, you need to ensure that the Azure resource you're authenticating to in your code supports managed identities. You can check the full list of [Azure services that can use managed identities to access other services](../active-directory/managed-identities-azure-resources/managed-identities-status.md).

If your Azure service is listed, you can [manage your identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).


## Suppress false positives

When the scanner runs, it may detect credentials that are false positives. Inline-suppression tools can be used to suppress false positives. 

Some reasons to suppress false positives include:

- Fake or mocked credentials in the test files. These credentials can't access resources.

- Placeholder strings. For example, placeholder strings may be used to initialize a variable, which is then populated using a secret store such as AKV.

- External library or SDKs that 's directly consumed. For example, openssl.

- Hard-coded credentials for an ephemeral test resource that only exists for the lifetime of the test being run.

- Self-signed certificates that are used locally and not used as a root. For example, they may be used when running localhost to allow HTTPS.

- Source-controlled documentation with non-functional credential for illustration purposes only

- Invalid results. The output isn't a credential or a secret.

You may want to suppress fake secrets in unit tests or mock paths, or inaccurate results. We don't recommend using suppression to suppress test credentials. Test credentials can still pose a security risk and should be securely stored.

> [!NOTE]
> Valid inline suppression syntax depends on the language, data format and CredScan version you are using. 

Credentials that are used for test resources and environments shouldn't be suppressed. They're being used to demonstration purposes only and don't affect anything else. 

### Suppress a same line secret

To suppress a secret that is found on the same line, add the following code as a comment at the end of the line that has the secret:

```bash
#[SuppressMessage("Microsoft.Security", "CS001:SecretInLine", Justification="... .")]
```

### Suppress a secret in the next line 

To suppress the secret found in the next line, add the following code as a comment before the line that has the secret:

```bash
#[SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine", Justification="... .")]
```

## Supported file types and exit codes

CredScan supports the following file types:

| Supported file types |  |  |  |  |  |
|--|--|--|--|--|--|
| 0.001 |\*.conf | id_rsa |\*.p12 |\*.sarif |\*.wadcfgx |
| 0.1 |\*.config |\*.iis |\*.p12* |\*.sc |\*.waz |
| 0.8 |\*.cpp |\*.ijs |\*.params |\*.scala |\*.webtest |
| *_sk |\*.crt |\*.inc | password |\*.scn |\*.wsx |
| *password |\*.cs |\*.inf |\*.pem | scopebindings.json |\*.wtl |
| *pwd*.txt |\*.cscfg |\*.ini |\*.pfx* |\*.scr |\*.xaml |
|\*.*_/key |\*.cshtm |\*.ino | pgpass |\*.script |\*.xdt |
|\*.*__/key |\*.cshtml |\*.insecure |\*.php |\*.sdf |\*.xml |
|\*.1/key |\*.csl |\*.install |\*.pkcs12* |\*.secret |\*.xslt |
|\*.32bit |\*.csv |\*.ipynb |\*.pl |\*.settings |\*.yaml |
|\*.3des |\*.cxx |\*.isml |\*.plist |\*.sh |\*.yml |
|\*.added_cluster |\*.dart |\*.j2 |\*.pm |\*.shf |\*.zaliases |
|\*.aes128 |\*.dat |\*.ja |\*.pod |\*.side |\*.zhistory |
|\*.aes192 |\*.data |\*.jade |\*.positive |\*.side2 |\*.zprofile |
|\*.aes256 |\*.dbg |\*.java |\*.ppk* |\*.snap |\*.zsh_aliases |
|\*.al |\*.defaults |\*.jks* |\*.priv |\*.snippet |\*.zsh_history |
|\*.argfile |\*.definitions |\*.js | privatekey |\*.sql |\*.zsh_profile |
|\*.as |\*.deployment |\*.json | privatkey |\*.ss |\*.zshrc |
|\*.asax | dockerfile |\*.jsonnet |\*.prop | ssh\\config |  |
|\*.asc | _dsa |\*.jsx |\*.properties | ssh_config |  |
|\*.ascx |\*.dsql | kefile |\*.ps |\*.ste |  |
|\*.asl |\*.dtsx | key |\*.ps1 |\*.svc |  |
|\*.asmmeta | _ecdsa | keyfile |\*.psclass1 |\*.svd |  |
|\*.asmx | _ed25519 |\*.key |\*.psm1 |\*.svg |  |
|\*.aspx |\*.ejs |\*.key* | psql_history |\*.svn-base |  |
|\*.aurora |\*.env |\*.key.* |\*.pub |\*.swift |  |
|\*.azure |\*.erb |\*.keys |\*.publishsettings |\*.tcl |  |
|\*.backup |\*.ext |\*.keystore* |\*.pubxml |\*.template |  |
|\*.bak |\*.ExtendedTests |\*.linq |\*.pubxml.user | template |  |
|\*.bas |\*.FF |\*.loadtest |\*.pvk* |\*.test |  |
|\*.bash_aliases |\*.frm |\*.local |\*.py |\*.textile |  |
|\*.bash_history |\*.gcfg |\*.log |\*.pyo |\*.tf |  |
|\*.bash_profile |\*.git |\*.m |\*.r |\*.tfvars |  |
|\*.bashrc |\*.git/config |\*.managers |\*.rake | tmdb |  |
|\*.bat |\*.gitcredentials |\*.map |\*.razor |\*.trd |  |
|\*.Beta |\*.go |\*.md |\*.rb |\*.trx |  |
|\*.BF |\*.gradle |\*.md-e |\*.rc |\*.ts |  |
|\*.bicep |\*.groovy |\*.mef |\*.rdg |\*.tsv |  |
|\*.bim |\*.grooy |\*.mst |\*.rds |\*.tsx |  |
|\*.bks* |\*.gsh |\*.my |\*.reg |\*.tt |  |
|\*.build |\*.gvy |\*.mysql_aliases |\*.resx |\*.txt |  |
|\*.c |\*.gy |\*.mysql_history |\*.retail |\*.user |  |
|\*.cc |\*.h |\*.mysql_profile |\*.robot | user |  |
|\*.ccf | host | npmrc |\*.rqy | userconfig* |  |
|\*.cfg |\*.hpp |\*.nuspec | _rsa |\*.usersaptinstall |  |
|\*.clean |\*.htm |\*.ois_export |\*.rst |\*.usersaptinstall |  |
|\*.cls |\*.html |\*.omi |\*.ruby |\*.vb |  |
|\*.cmd |\*.htpassword |\*.opn |\*.runsettings |\*.vbs |  |
|\*.code-workspace | hubot |\*.orig |\*.sample |\*.vizfx |  |
|\*.coffee |\*.idl |\*.out |\*.SAMPLE |\*.vue |  |

The following exit codes are available in CredScan:

| Code | Description |
|--|--|
| 0 | Scan completed successfully with no application warning, no suppressed match, no credential match. |
| 1 | Partial scan completed with nothing but application warning. |
| 2 | Scan completed successfully with nothing but suppressed match(es). |
| 3 | Partial scan completed with both application warning(s) and suppressed match(es). |
| 4 | Scan completed successfully with nothing but credential match(es). |
| 5 | Partial scan completed with both application warning(s) and credential match(es). |
| 6 | Scan completed successfully with both suppressed match(es) and credential match(es). |
| 7 | Partial scan completed with application warning(s), suppressed match(es) and credential match(es). |
| -1000 | Scan failed with command line argument error. |
| -1100 | Scan failed with app settings error. |
| -1500 | Scan failed with other configuration error. |
| -1600 | Scan failed with IO error. |
| -9000 | Scan failed with unknown error. |

## CredScan rules

| Rule | Rule description | Sample | Helpful link |
|--|--|--|--|--|
| CSCAN-AWS0010 | Amazon S3 Client Secret Access Key | AWS Secret: abcdefghijklmnopqrst0123456789/+ABCDEFGH; | [Setup Credentials](https://docs.aws.amazon.com/toolkit-for-eclipse/v1/user-guide/setup-credentials.html) <br> [Access keys](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) |
| CSCAN-AZURE0010 | Azure Subscription Management Certificate | <Subscription id="..." ManagementCertificate="MIIPuQIBGSIb3DQEHAaC..." | [Azure API management certificates](/azure/azure-api-management-certs) |
| CSCAN-AZURE0020 | Azure SQL Connection String | <add key="ConnectionString" value="server=tcp:server.database.windows.net;database=database;user=user;password=ZYXWVU_2;" | [SQL database AAD authentication configure](/azure/sql-database/sql-database-aad-authentication-configure) | 
| CSCAN-AZURE0030 | Azure Service Bus Shared Access Signature | Endpoint=sb://account.servicebus.windows.net;SharedAccessKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE= <br>ServiceBusNamespace=...SharedAccessPolicy=...Key=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE= | [Service Bus authentication and authorization](../service-bus-messaging/service-bus-authentication-and-authorization.md) <br> [Service Bus access control with Shared Access Signatures](../service-bus-messaging/service-bus-sas.md) | 
| CSCAN-AZURE0040 | Azure Redis Cache Connection String Password | HostName=account.redis.cache.windows.net;Password=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE= | [Azure Cache for Redis](../azure-cache-for-redis/index.yml) |
| CSCAN-AZURE0041 | Azure Redis Cache Identifiable Secret | HostName=account.redis.cache.windows.net;Password= cThIYLCD6H7LrWrNHQjxhaSBu42KeSzGlAzCaNQJXdA=  <br> HostName=account.redis.cache.windows.net;Password= fbQqSu216MvwNaquSqpI8MV0hqlUPgGChOY19dc9xDRMAzCaixCYbQ | [Azure Cache for Redis](../azure-cache-for-redis/index.yml) |
| CSCAN-AZURE0050 | Azure IoT Shared Access Key | HostName=account.azure-devices.net;SharedAccessKeyName=key;SharedAccessKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE= <br> iotHub...abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE= | [Secure your Internet of Things (IoT) deployment](../iot-fundamentals/iot-security-deployment.md) <br> [Control access to IoT Hub using Shared Access Signatures](../iot-hub/iot-hub-dev-guide-sas.md) |
| CSCAN-AZURE0060 | Azure Storage Account Shared Access Signature | https://account.blob.core.windows.net/?sr=...&sv=...&st=...&se=...&sp=...&sig=abcdefghijklmnopqrstuvwxyz0123456789%2F%2BABCDE%3D | [Delegate access by using a shared access signature](/rest/api/storageservices/delegate-access-with-shared-access-signature) <br> [Migrate an application to use passwordless connections with Azure services](../storage/common/migrate-azure-credentials.md) |
| CSCAN-AZURE0061 | Azure Storage Account Shared Access Signature for High Risk Resources | https://account.blob.core.windows.net/file.cspkg?...&sig=abcdefghijklmnopqrstuvwxyz0123456789%2F%2BABCDE%3D | [Delegate access by using a shared access signature](/rest/api/storageservices/delegate-access-with-shared-access-signature) <br> [Migrate an application to use passwordless connections with Azure services](../storage/common/migrate-azure-credentials.md) |
| CSCAN-AZURE0062 | Azure Logic App Shared Access Signature | https://account.logic.azure.com/?...&sig=abcdefghijklmnopqrstuvwxyz0123456789%2F%2BABCDE%3D | [Secure access and data in Azure Logic Apps](../logic-apps/logic-apps-securing-a-logic-app.md) |
| CSCAN-AZURE0070 | Azure Storage Account Access Key | Endpoint=account.table.core.windows.net;AccountName=account;AccountKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE== <br> AccountName=account;AccountKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE==...; <br> PrimaryKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE== | [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key) |
| CSCAN-AZURE0071 | Azure Storage Identifiable Secret | Endpoint=table.core.windows.net;AccountName=account;AccountKey=U1imXW0acA5QRtnkKuW14QPSC/F1JFS9mOjd8Ny/Muab42CVkI8G0/ja7uM13GlfiS8pp4c/kzYp+AStvBjS1w== <br> AccountName=accountAccountKey=U1imXW0acA5QRtnkKuW14QPSC/F1JFS9mOjd8Ny/Muab42CVkI8G0/ja7uM13GlfiS8pp4c/kzYp+AStvBjS1w==;EndpointSuffix=...; <br> PrimaryKey=U1imXW0acA5QRtnkKuW14QPSC/F1JFS9mOjd8Ny/Muab42CVkI8G0/ja7uM13GlfiS8pp4c/kzYp+AStvBjS1w== | [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key) <br> [Migrate an application to use passwordless connections with Azure services](../storage/common/migrate-azure-credentials.md) |
| CSCAN-AZURE0080 | Azure COSMOS DB Account Access Key | AccountEndpoint=https://account.documents.azure.com;AccountKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE== DocDbConnectionStr...abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE== | [Secure access to data in Azure Cosmos DB](../cosmos-db/secure-access-to-data.md) |
| CSCAN-AZURE0081 | Identifiable Azure COSMOS DB Account Access Key | AccountEndpoint=https://account.documents.azure.com;AccountKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE== <br> DocDbConnectionStr...abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE== | [Secure access to data in Azure Cosmos DB](../cosmos-db/secure-access-to-data.md) |
| CSCAN-AZURE0090 | Azure App Service Deployment Password | userPWD=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEFGHIJKLMNOPQRSTUV;<br> PublishingPassword=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEFGHIJKLMNOPQRSTUV; | [Configure deployment credentials for Azure App Service](../app-service/deploy-configure-credentials.md) <br> [Get publish settings from Azure and import into Visual Studio](/visualstudio/deployment/tutorial-import-publish-settings-azure?view=vs-2019) |
| CSCAN-AZURE0100 | Azure DevOps Personal Access Token | URL="org.visualstudio.com/proj"; PAT = "ntpi2ch67ci2vjzcohglogyygwo5fuyl365n2zdowwxhsys6jnoa" <br> URL="dev.azure.com/org/proj"; PAT = "ntpi2ch67ci2vjzcohglogyygwo5fuyl365n2zdowwxhsys6jnoa" | [Use personal access tokens](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows) |
| CSCAN-AZURE0101 | Azure DevOps App Secret | AdoAppId=...;AdoAppSecret=ntph2ch67ciqunzcohglogyygwo5fuyl365n4zdowwxhsys6jnoa; | [Authorize access to REST APIs with OAuth 2.0](/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops) |
| CSCAN-AZURE0120 | Azure Function Master / API Key | https://account.azurewebsites.net/api/function?code=abcdefghijklmnopqrstuvwxyz0123456789%2F%2BABCDEF0123456789%3D%3D... <br> ApiEndpoint=account.azurewebsites.net/api/function;ApiKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEFGHIJKLMNOP==; <br> x-functions-key:abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEFGHIJKLMNOP== | [Get your function access keys](../azure-functions/functions-how-to-use-azure-function-app-settings.md#get-your-function-access-keys) <br> [Function access keys](https://learn.microsoft.com/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-csharp#authorization-keys) |
| CSCAN-AZURE0121 | Identifiable Azure Function Master / API Key | https://account.azurewebsites.net/api/function?code=abcdefghijklmnopqrstuvwxyz0123456789%2F%2BABCDEF0123456789%3D%3D... <br> ApiEndpoint=account.azurewebsites.net/api/function;ApiKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEFGHIJKLMNOP==; <br> x-functions-key:abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEFGHIJKLMNOP== | [Get your function access keys](../azure-functions/functions-how-to-use-azure-function-app-settings.md#get-your-function-access-keys) <br> [Function access keys](https://learn.microsoft.com/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-csharp#authorization-keys) |
| CSCAN-AZURE0130 | Azure Shared Access Key / Web Hook Token | PrimaryKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=; | [Security claims](../notification-hubs/notification-hubs-push-notification-security.md#security-claims) <br> [Azure Media Services concepts](/previous-versions/media-services/previous/media-services-concepts) |
| CSCAN-AZURE0140 | Azure AD Client Access Token | Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJS... | [Request an access token in Azure Active Directory B2C](../active-directory-b2c/access-tokens.md) |
| CSCAN-AZURE0150 | Azure AD User Credentials | username=user@tenant.onmicrosoft.com;password=ZYXWVU$1; | [Reset a user's password using Azure Active Directory](../active-directory/fundamentals/active-directory-users-reset-password-azure-portal.md) |
| CSCAN-AZURE0151 | Azure AD Client Secret | "AppId=01234567-abcd-abcd-abcd-abcdef012345;AppSecret="abc7Q~defghijklmnopqrstuvwxyz-_.~0123" <br> "AppId=01234567-abcd-abcd-abcd-abcdef012345;AppSecret="abc8Q~defghijklmnopqrstuvwxyz-_.~0123456" | [Securing service principals](../active-directory/fundamentals/service-accounts-principal.md) |
| CSCAN-AZURE0152 | Azure Bot Service App Secret | "account.azurewebsites.net/api/messages;AppId=01234567-abcd-abcd-abcd-abcdef012345;AppSecret="abcdeFGHIJ0K1234567%;[@" | [Authentication types](/azure/bot-service/bot-builder-concept-authentication-types?view=azure-bot-service-4.0) |
| CSCAN-AZURE0160 | Azure Databricks Personal Access Token |  account.azuredatabricks.net;PAT=dapiabcdef0123456789abcdef0123456789; | [Manage personal access tokens](/azure/databricks/administration-guide/access-control/tokens) |
| CSCAN-AZURE0170 | Azure Container Registry Access Key | account.azurecr.io/ #docker password: abcdefghijklmnopqr0123456789/+AB; | [Admin account](../container-registry/container-registry-authentication.md#admin-account) <br> [Create a token with repository-scoped permissions](../container-registry/container-registry-repository-scoped-permissions.md) | 
| CSCAN-AZURE0180 | Azure Batch Shared Access Key | Account=account.batch.azure.net;AccountKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=; | [Batch security and compliance best practices](../batch/security-best-practices.md) <br> [Create a Batch account with the Azure portal](../batch/batch-account-create-portal.md) |
| CSCAN-AZURE0181 | Identifiable Azure Batch Shared Access Key | Account=account.batch.azure.net;AccountKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=; | [Batch security and compliance best practices](../batch/security-best-practices.md) <br> [Create a Batch account with the Azure portal](../batch/batch-account-create-portal.md) |
| CSCAN-AZURE0190 | Azure SignalR Access Key | host: account.service.signalr.net; accesskey: abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=; | [How to rotate access key for Azure SignalR Service](../azure-signalr/signalr-howto-key-rotation.md) |
| CSCAN-AZURE0200 | Azure EventGrid Access Key | host: account.eventgrid.azure.net; accesskey: abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=; | [Get access keys for Event Grid resources (topics or domains)](../event-grid/get-access-keys.md) |
| CSCAN-AZURE0210 | Azure Machine Learning Web Service API Key | host: account.azureml.net/services/01234567-abcd-abcd-abcd-abcdef012345/workspaces/01234567-abcd-abcd-abcd-abcdef012345/; apikey: abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE==; | [How to consume a Machine Learning Studio (classic) web service](/previous-versions/azure/machine-learning/classic/consume-web-services) |
| CSCAN-AZURE0211 | Identifiable Azure Machine Learning Web Service API Key | host: account.azureml.net/services/01234567-abcd-abcd-abcd-abcdef012345/workspaces/01234567-abcd-abcd-abcd-abcdef012345/; apikey: abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE== | [How to consume a Machine Learning Studio (classic) web service](/previous-versions/azure/machine-learning/classic/consume-web-services) |
| CSCAN-AZURE0220 | Azure Cognitive Search API Key | host: account.search.windows.net; apikey: abcdef0123456789abcdef0123456789; | [Connect to Cognitive Search using key authentication](../search/search-security-api-keys.md) |
| CSCAN-AZURE0221 | Azure Cognitive Service Key | cognitiveservices.azure.com...apikey= abcdef0123456789abcdef0123456789; <br> api.cognitive.microsoft.com...apikey= abcdef0123456789abcdef0123456789; | [Connect to Cognitive Search using key authentication](../search/search-security-api-keys.md) |
| CSCAN-AZURE0222 | Identifiable Azure Cognitive Search Key | cognitiveservices.azure.com...apikey= abcdefghijklmnopqrstuvwxyz0123456789ABCDEFAzSeKLMNOP; <br> api.cognitive.microsoft.com...apikey= abcdefghijklmnopqrstuvwxyz0123456789ABCDEFAzSeKLMNOP; | [Connect to Cognitive Search using key authentication](../search/search-security-api-keys.md) |
| CSCAN-AZURE0230 | Azure Maps Subscription Key | host: atlas.microsoft.com; key: abcdefghijklmnopqrstuvwxyz0123456789-_ABCDE; | [Manage authentication in Azure Maps](../azure-maps/how-to-manage-authentication.md) |
| CSCAN-AZURE0250 | Azure Bot Framework Secret Key | host: webchat.botframework.com/?s=abcdefghijklmnopqrstuvwxyz.0123456789_ABCDEabcdefghijkl&... <br> host: webchat.botframework.com/?s=abcdefghijk.lmn.opq.rstuvwxyz0123456789-_ABCDEFGHIJKLMNOPQRSTUV&... | [Connect a bot to Web Chat](/azure/bot-service/bot-service-channel-connect-webchat?view=azure-bot-service-4.0)
| CSCAN-GENERAL0020 | X.509 Certificate Private Key | ���������������� (binary certificate file: *.pfx, *.key...) <br> -----BEGIN PRIVATE KEY----- MIIPuQIBAzCCD38GCSqGSIb3DQEH... <br> -----BEGIN RSA PRIVATE KEY----- ��������������� ... <br> -----BEGIN DSA PRIVATE KEY----- MIIPuQIBAzCCD38GCSqGSIb3DQEH... <br> -----BEGIN EC PRIVATE KEY----- ��������������� ... <br> -----BEGIN OPENSSH PRIVATE KEY----- MIIPuQIBAzCCD38GCSqGSIb3DQEH... <br> certificate = "MIIPuQIBAzCCD38GCSqGSIb3DQEH..." | [Get started with Key Vault certificates](../key-vault/certificates/certificate-scenarios.md) |
| CSCAN-GENERAL0030 | User Login Credentials | { "user": "user_name", "password": "ZYXWVU_2" } | [Set and retrieve a secret from Azure Key Vault using the Azure portal](../key-vault/secrets/quick-create-portal.md) |
| CSCAN-GENERAL0031 | ODBC Connection String | data source=...;initial catalog=...;user=...;password=ZYXWVU_2; | [Connection strings reference](https://www.connectionstrings.com/) |
| CSCAN-GENERAL0050 | ASP.NET Machine Key | machineKey validationKey="ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789" decryptionKey="ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789"... | [MachineKey Class](/dotnet/api/system.web.security.machinekey?view=netframework-4.8) |
| CSCAN-GENERAL0060 | General Password | UserName=...;Passwpod=abcdefgh0123456789/+AB==; <br> tool.exe ...-u ... -p..."ZYXWVU_2"... <br> <secret>ZYXWVU_3</secret> <br> NetworkCredential(..., ZYXWVU_2) <br> net use .../u:redmond... /p ZYXWVU_2 <br> schtasks.../ru ntdev.../rp ZYXWVU_2 <br> RemoteUserNameParameter:...;;RemotePasswordParameter:***;; | [Set and retrieve a secret from Azure Key Vault using the Azure portal](../key-vault/secrets/quick-create-portal.md) |
| CSCAN-GENERAL0070 | General Password in URL | s://my.zoom.us/636362?pwd=ZYXWVU <br> https://www.microsoft.com/?secret=ZYXWVU | [Set and retrieve a secret from Azure Key Vault using the Azure portal](../key-vault/secrets/quick-create-portal.md) |
| CSCAN-GENERAL0120 | Http Authorization Header | Authorization: Basic ABCDEFGHIJKLMNOPQRS0123456789; <br> Authorization: Digest ABCDEFGHIJKLMNOPQRS0123456789; | [HttpRequestHeaders.Authorization Property](/dotnet/api/system.net.http.headers.httprequestheaders.authorization?view=netframework-4.8) |
| CSCAN-GENERAL0130 | Client Secret / API Key | client_secret=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE= <br> ida:password=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE= <br> ida:...issuer...Api...abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE= <br> Namespace...ACS...Issuer...abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE= <br> IssuerName...IssuerSecret=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE= <br> App_Secret=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE== | [The Client ID and Secret](https://www.oauth.com/oauth2-servers/client-registration/client-id-secret/) <br> [How and why applications are added to Azure AD](../active-directory/develop/active-directory-how-applications-are-added.md) |
| CSCAN-GENERAL0140 | General Symmetric Key | key=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=; | [Aes Class](/dotnet/api/system.security.cryptography.aes?view=net-5.0) |
| CSCAN-GENERAL0150 | Ansible Vault | $ANSIBLE_VAULT;1.1;AES256abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE... | [Protecting sensitive data with Ansible vault](https://docs.ansible.com/ansible/latest/vault_guide/index.html#creating-encrypted-files) |
| CSCAN-GH0010 | GitHub Personal Access Token | pat=ghp_abcdefghijklmnopqrstuvwxyzABCD012345 <br> pat=v1.abcdef0123456789abcdef0123456789abcdef01 <br> https://user:abcdef0123456789abcdef0123456789abcdef01@github.com | [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) |
| CSCAN-GOOG0010 | Google API key | apiKey=AIzaefgh0123456789_-ABCDEFGHIJKLMNOPQRS; | [Authenticate using API keys](https://cloud.google.com/docs/authentication/api-keys) |
| CSCAN-MSFT0100 | Microsoft Bing Maps Key | bingMapsKey=abcdefghijklmnopqrstuvwxyz0123456789-_ABCDEabcdefghijklmnopqrstu <br>...bing.com/api/maps/...key=abcdefghijklmnopqrstuvwxyz0123456789-_ABCDEabcdefghijklmnopqrstu <br>...dev.virtualearth.net/...key=abcdefghijklmnopqrstuvwxyz0123456789-_ABCDEabcdefghijklmnopqrstu | [Getting a Bing Maps Key](/bingmaps/getting-started/bing-maps-dev-center-help/getting-a-bing-maps-key) |
| CSCAN-WORK0010 | Slack Access Token | slack_token= xoxp-abcdef-abcdef-abcdef-abcdef ; <br> slack_token= xoxb-abcdef-abcdef ; <br> slack_token= xoxa-2-abcdef-abcdef-abcdef-abcdef ; <br>slack_token= xoxr-abcdef-abcdef-abcdef-abcdef ; | [Token types](https://api.slack.com/authentication/token-types) |

## Next steps
+ Learn how to [configure pull request annotations](enable-pull-request-annotations.md) in Defender for Cloud to remediate secrets in code before they're shipped to production.
