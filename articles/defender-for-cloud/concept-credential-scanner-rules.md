---
title: Credential scanner rules

description: Learn more about the Defender for DevOps credential scanner's rules, descriptions and the supported file types in Defender for Cloud.
ms.topic: conceptual
ms.date: 01/31/2023
---

# Credential scanner 

Defender for DevOps supports many types of files and rules. This article explains all of the available file types and rules that are available.

## Supported file types

Credential scanning supports the following file types:

| Supported file types | Supported file types | Supported file types | Supported file types | Supported file types | Supported file types |
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

## Supported exit codes

The following exit codes are available for credential scanning:

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


## Rules and descriptions

The following are the available rules and descriptions for credential scanning

### CSCAN-AWS0010

Amazon S3 Client Secret Access Key

**Sample**: `AWS Secret: abcdefghijklmnopqrst0123456789/+ABCDEFGH;`

Learn more about [Setup Credentials](https://docs.aws.amazon.com/toolkit-for-eclipse/v1/user-guide/setup-credentials.html) and [Access keys](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys).

### CSCAN-AZURE0010

Azure Subscription Management Certificate

**Sample**: `<Subscription id="..." ManagementCertificate="MIIPuQIBGSIb3DQEHAaC..."`

Learn more about [Azure API management certificates](/azure/azure-api-management-certs).

### CSCAN-AZURE0020

Azure SQL Connection String

**Sample**: `<add key="ConnectionString" value="server=tcp:server.database.windows.net;database=database;user=user;password=ZYXWVU_2;"`

Learn more about [SQL database Microsoft Entra authentication configure](/azure/sql-database/sql-database-aad-authentication-configure).

### CSCAN-AZURE0030

Azure Service Bus Shared Access Signature

**Sample**: `Endpoint=sb://account.servicebus.windows.net;SharedAccessKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE= <br>ServiceBusNamespace=...SharedAccessPolicy=...Key=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=`

Learn more about [Service Bus authentication and authorization](../service-bus-messaging/service-bus-authentication-and-authorization.md) and [Service Bus access control with Shared Access Signatures](../service-bus-messaging/service-bus-sas.md).

### CSCAN-AZURE0040

Azure Redis Cache Connection String Password

**Sample**: `HostName=account.redis.cache.windows.net;Password=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=` 

Learn more about [Azure Cache for Redis](../azure-cache-for-redis/index.yml).

### CSCAN-AZURE0041

Azure Redis Cache Identifiable Secret

**Sample**: `HostName=account.redis.cache.windows.net;Password= cThIYLCD6H7LrWrNHQjxhaSBu42KeSzGlAzCaNQJXdA=`  <br> `HostName=account.redis.cache.windows.net;Password= fbQqSu216MvwNaquSqpI8MV0hqlUPgGChOY19dc9xDRMAzCaixCYbQ`

Learn more about [Azure Cache for Redis](../azure-cache-for-redis/index.yml).

### CSCAN-AZURE0050

Azure IoT Shared Access Key

**Sample**: `HostName=account.azure-devices.net;SharedAccessKeyName=key;SharedAccessKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=` <br> `iotHub...abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=`

Learn more about [Securing your Internet of Things (IoT) deployment](../iot-fundamentals/iot-security-deployment.md) and [Control access to IoT Hub using Shared Access Signatures](../iot-hub/iot-hub-dev-guide-sas.md).

### CSCAN-AZURE0060

Azure Storage Account Shared Access Signature

**Sample**: `https://account.blob.core.windows.net/?sr=...&sv=...&st=...&se=...&sp=...&sig=abcdefghijklmnopqrstuvwxyz0123456789%2F%2BABCDE%3D`

Learn more about [Delegating access by using a shared access signature](/rest/api/storageservices/delegate-access-with-shared-access-signature) and [Migrate an application to use passwordless connections with Azure services](../storage/common/migrate-azure-credentials.md).

### CSCAN-AZURE0061

Azure Storage Account Shared Access Signature for High Risk Resources

**Sample**: `https://account.blob.core.windows.net/file.cspkg?...&sig=abcdefghijklmnopqrstuvwxyz0123456789%2F%2BABCDE%3D`

Learn more about [Delegating access by using a shared access signature](/rest/api/storageservices/delegate-access-with-shared-access-signature) and [Migrate an application to use passwordless connections with Azure services](../storage/common/migrate-azure-credentials.md).

### CSCAN-AZURE0062

Azure Logic App Shared Access Signature

**Sample**: `https://account.logic.azure.com/?...&sig=abcdefghijklmnopqrstuvwxyz0123456789%2F%2BABCDE%3D`

Learn more about [Securing access and data in Azure Logic Apps](../logic-apps/logic-apps-securing-a-logic-app.md)

### CSCAN-AZURE0070

Azure Storage Account Access Key

**Sample**: `Endpoint=account.table.core.windows.net;AccountName=account;AccountKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE==` <br> `AccountName=account;AccountKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE==...;` <br> `PrimaryKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE==`

Learn more about [Authorization with Shared Key](/rest/api/storageservices/authorize-with-shared-key).

### CSCAN-AZURE0071

Azure Storage Identifiable Secret

**Sample**: `Endpoint=table.core.windows.net;AccountName=account;AccountKey=U1imXW0acA5QRtnkKuW14QPSC/F1JFS9mOjd8Ny/Muab42CVkI8G0/ja7uM13GlfiS8pp4c/kzYp+AStvBjS1w==` <br> `AccountName=accountAccountKey=U1imXW0acA5QRtnkKuW14QPSC/F1JFS9mOjd8Ny/Muab42CVkI8G0/ja7uM13GlfiS8pp4c/kzYp+AStvBjS1w==;EndpointSuffix=...;` <br> `PrimaryKey=U1imXW0acA5QRtnkKuW14QPSC/F1JFS9mOjd8Ny/Muab42CVkI8G0/ja7uM13GlfiS8pp4c/kzYp+AStvBjS1w==`

Learn more about [Authorization with Shared Key](/rest/api/storageservices/authorize-with-shared-key) and [Migrating an application to use passwordless connections with Azure services](../storage/common/migrate-azure-credentials.md).

### CSCAN-AZURE0080

Azure COSMOS DB Account Access Key

**Sample**: `AccountEndpoint=https://account.documents.azure.com;AccountKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE== DocDbConnectionStr...abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE==`

Learn more about [Securing access to data in Azure Cosmos DB](../cosmos-db/secure-access-to-data.md).

### CSCAN-AZURE0081

Identifiable Azure COSMOS DB Account Access Key 

**Sample**: `AccountEndpoint=https://account.documents.azure.com;AccountKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE==` <br> `DocDbConnectionStr...abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE==`

Learn more about [Securing access to data in Azure Cosmos DB](../cosmos-db/secure-access-to-data.md).

### CSCAN-AZURE0090

Azure App Service Deployment Password

**Sample**: `userPWD=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEFGHIJKLMNOPQRSTUV;`<br> `PublishingPassword=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEFGHIJKLMNOPQRSTUV;`

Learn more about [Configuring deployment credentials for Azure App Service](../app-service/deploy-configure-credentials.md) and [Get publish settings from Azure and import into Visual Studio](/visualstudio/deployment/tutorial-import-publish-settings-azure).

### CSCAN-AZURE0100

Azure DevOps Personal Access Token

**Sample**: `URL="org.visualstudio.com/proj"; PAT = "ntpi2ch67ci2vjzcohglogyygwo5fuyl365n2zdowwxhsys6jnoa"` <br> `URL="dev.azure.com/org/proj"; PAT = "ntpi2ch67ci2vjzcohglogyygwo5fuyl365n2zdowwxhsys6jnoa"`

Learn more about [Using personal access tokens](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate).

### CSCAN-AZURE0101

Azure DevOps App Secret

**Sample**: `AdoAppId=...;AdoAppSecret=ntph2ch67ciqunzcohglogyygwo5fuyl365n4zdowwxhsys6jnoa;`

Learn more about [Authorizing access to REST APIs with OAuth 2.0](/azure/devops/integrate/get-started/authentication/oauth).

### CSCAN-AZURE0120

Azure Function Primary / API Key

**Sample**: `https://account.azurewebsites.net/api/function?code=abcdefghijklmnopqrstuvwxyz0123456789%2F%2BABCDEF0123456789%3D%3D...` <br> `ApiEndpoint=account.azurewebsites.net/api/function;ApiKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEFGHIJKLMNOP==;` <br> `x-functions-key:abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEFGHIJKLMNOP==`

Learn more about [Getting your function access keys](../azure-functions/functions-how-to-use-azure-function-app-settings.md#get-your-function-access-keys) and [Function access keys](/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-csharp#authorization-keys)

### CSCAN-AZURE0121

Identifiable Azure Function Primary / API Key

**Sample**: `https://account.azurewebsites.net/api/function?code=abcdefghijklmnopqrstuvwxyz0123456789%2F%2BABCDEF0123456789%3D%3D...` <br> `ApiEndpoint=account.azurewebsites.net/api/function;ApiKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEFGHIJKLMNOP==;` <br> `x-functions-key:abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEFGHIJKLMNOP==`

Learn more about [Getting your function access keys](../azure-functions/functions-how-to-use-azure-function-app-settings.md#get-your-function-access-keys) and [Function access keys](/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-csharp#authorization-keys).

### CSCAN-AZURE0130

Azure Shared Access Key / Web Hook Token

**Sample**: `PrimaryKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=;`

Learn more about [Security claims](../notification-hubs/notification-hubs-push-notification-security.md#security-claims) and [Azure Media Services concepts](/previous-versions/media-services/previous/media-services-concepts).

### CSCAN-AZURE0140

Microsoft Entra Client Access Token

**Sample**: `Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJS...`

Learn more about [Requesting an access token in Azure Active Directory B2C](../active-directory-b2c/access-tokens.md).

### CSCAN-AZURE0150

Microsoft Entra user Credentials

**Sample**: `username=user@tenant.onmicrosoft.com;password=ZYXWVU$1;`

Learn more about [Resetting a user's password using Microsoft Entra ID](../active-directory/fundamentals/active-directory-users-reset-password-azure-portal.md).

### CSCAN-AZURE0151

Microsoft Entra Client Secret

**Sample**: `"AppId=01234567-abcd-abcd-abcd-abcdef012345;AppSecret="abc7Q~defghijklmnopqrstuvwxyz-_.~0123"` <br> `"AppId=01234567-abcd-abcd-abcd-abcdef012345;AppSecret="abc8Q~defghijklmnopqrstuvwxyz-_.~0123456"`

Learn more about [Securing service principals](../active-directory/fundamentals/service-accounts-principal.md).

### CSCAN-AZURE0152

Azure Bot Service App Secret

**Sample**: `"account.azurewebsites.net/api/messages;AppId=01234567-abcd-abcd-abcd-abcdef012345;AppSecret="abcdeFGHIJ0K1234567%;[@"`

Learn more about [Authentication types](/azure/bot-service/bot-builder-concept-authentication-types).

### CSCAN-AZURE0160

Azure Databricks Personal Access Token

**Sample**: `account.azuredatabricks.net;PAT=dapiabcdef0123456789abcdef0123456789;`

Learn more about [Managing personal access tokens](/azure/databricks/administration-guide/access-control/tokens)

### CSCAN-AZURE0170

Azure Container Registry Access Key

**Sample**: `account.azurecr.io/ #docker password: abcdefghijklmnopqr0123456789/+AB;`

Learn more about [Admin account](../container-registry/container-registry-authentication.md#admin-account) and [Create a token with repository-scoped permissions](../container-registry/container-registry-repository-scoped-permissions.md)

### CSCAN-AZURE0180

Azure Batch Shared Access Key

**Sample**: `Account=account.batch.azure.net;AccountKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=;`

Learn more about [Batch security and compliance best practices](../batch/security-best-practices.md) and [Create a Batch account with the Azure portal](../batch/batch-account-create-portal.md).

### CSCAN-AZURE0181

Identifiable Azure Batch Shared Access Key

**Sample**: `Account=account.batch.azure.net;AccountKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=;`

Learn more about [Batch security and compliance best practices](../batch/security-best-practices.md) and [Create a Batch account with the Azure portal](../batch/batch-account-create-portal.md).

### CSCAN-AZURE0190

Azure SignalR Access Key

**Sample**: `host: account.service.signalr.net; accesskey: abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=;`

Learn more about [How to rotate access key for Azure SignalR Service](../azure-signalr/signalr-howto-key-rotation.md).

### CSCAN-AZURE0200

Azure Event Grid Access Key

**Sample**: `host: account.eventgrid.azure.net; accesskey: abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=;`

Learn more about [Getting access keys for Event Grid resources (articles or domains)](../event-grid/get-access-keys.md)

### CSCAN-AZURE0210

Azure Machine Learning Web Service API Key

**Sample**: `host: account.azureml.net/services/01234567-abcd-abcd-abcd-abcdef012345/workspaces/01234567-abcd-abcd-abcd-abcdef012345/; apikey: abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE==;`

Learn more about [How to consume a Machine Learning Studio (classic) web service](/previous-versions/azure/machine-learning/classic/consume-web-services).

### CSCAN-AZURE0211

Identifiable Azure Machine Learning Web Service API Key

**Sample**: `host: account.azureml.net/services/01234567-abcd-abcd-abcd-abcdef012345/workspaces/01234567-abcd-abcd-abcd-abcdef012345/; apikey: abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE==`

Learn more about [How to consume a Machine Learning Studio (classic) web service](/previous-versions/azure/machine-learning/classic/consume-web-services).

### CSCAN-AZURE0220

Azure Cognitive Search API Key

**Sample**: `host: account.search.windows.net; apikey: abcdef0123456789abcdef0123456789;`

Learn more about [Connecting to cognitive search using key authentication](../search/search-security-api-keys.md).

### CSCAN-AZURE0221

Azure Cognitive Service Key

**Sample**: `cognitiveservices.azure.com...apikey= abcdef0123456789abcdef0123456789;` <br> `api.cognitive.microsoft.com...apikey= abcdef0123456789abcdef0123456789;`

Learn more about [Connecting to cognitive search using key authentication](../search/search-security-api-keys.md).

### CSCAN-AZURE0222

Identifiable Azure Cognitive Search Key

**Sample**: `cognitiveservices.azure.com...apikey= abcdefghijklmnopqrstuvwxyz0123456789ABCDEFAzSeKLMNOP;` <br> `api.cognitive.microsoft.com...apikey= abcdefghijklmnopqrstuvwxyz0123456789ABCDEFAzSeKLMNOP;`

Learn more about [Connecting to cognitive search using key authentication](../search/search-security-api-keys.md).

### CSCAN-AZURE0230

Azure Maps Subscription Key

**Sample**: `host: atlas.microsoft.com; key: abcdefghijklmnopqrstuvwxyz0123456789-_ABCDE;`

Learn more about [Managing authentication in Azure Maps](../azure-maps/how-to-manage-authentication.md).

### CSCAN-AZURE0250

Azure Bot Framework Secret Key

**Sample**: `host: webchat.botframework.com/?s=abcdefghijklmnopqrstuvwxyz.0123456789_ABCDEabcdefghijkl&...` <br> `host: webchat.botframework.com/?s=abcdefghijk.lmn.opq.rstuvwxyz0123456789-_ABCDEFGHIJKLMNOPQRSTUV&...`

Learn more about [Connecting a bot to Web Chat](/azure/bot-service/bot-service-channel-connect-webchat)

### CSCAN-GENERAL0020

X.509 Certificate Private Key

**Sample**: `���������������� (binary certificate file: *.pfx, *.key...)` <br> `-----BEGIN PRIVATE KEY----- MIIPuQIBAzCCD38GCSqGSIb3DQEH...` <br> `-----BEGIN RSA PRIVATE KEY----- ��������������� ...` <br> `-----BEGIN DSA PRIVATE KEY----- MIIPuQIBAzCCD38GCSqGSIb3DQEH...`<br> `-----BEGIN EC PRIVATE KEY----- ��������������� ...` <br> `-----BEGIN OPENSSH PRIVATE KEY----- MIIPuQIBAzCCD38GCSqGSIb3DQEH...` <br> `certificate = "MIIPuQIBAzCCD38GCSqGSIb3DQEH..."`

Learn more about [Getting started with Key Vault certificates](../key-vault/certificates/certificate-scenarios.md)

### CSCAN-GENERAL0030

User sign in Credentials

**Sample**: `{ "user": "user_name", "password": "ZYXWVU_2" }`

Learn more about [Setting and retrieve a secret from Azure Key Vault using the Azure portal](../key-vault/secrets/quick-create-portal.md).

### CSCAN-GENERAL0031

ODBC Connection String

**Sample**: `data source=...;initial catalog=...;user=...;password=ZYXWVU_2;`

Learn more about [Connection strings reference](https://www.connectionstrings.com/).

### CSCAN-GENERAL0050

ASP.NET Machine Key

**Sample**: `machineKey validationKey="ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789" decryptionKey="ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789"...`

Learn more about [MachineKey Class](/dotnet/api/system.web.security.machinekey)


### CSCAN-GENERAL0060

General Password 

**Sample**: `UserName=...;Passwpod=abcdefgh0123456789/+AB==;` <br> `tool.exe ...-u ... -p..."ZYXWVU_2"...` <br> `<secret>ZYXWVU_3</secret>` <br> `NetworkCredential(..., ZYXWVU_2)` <br> `net use .../u:redmond... /p ZYXWVU_2` <br> `schtasks.../ru ntdev.../rp ZYXWVU_2` <br> `RemoteUserNameParameter:...;;RemotePasswordParameter:***;;`

Learn more about [Setting and retrieving a secret from Azure Key Vault using the Azure portal](../key-vault/secrets/quick-create-portal.md).

### CSCAN-GENERAL0070

General Password in URL

**Sample**: `s://my.zoom.us/636362?pwd=ZYXWVU` <br> `https://www.microsoft.com/?secret=ZYXWVU`

Learn more about [Setting and retrieving a secret from Azure Key Vault using the Azure portal](../key-vault/secrets/quick-create-portal.md).

### CSCAN-GENERAL0120

Http Authorization Header

**Sample**: `Authorization: Basic ABCDEFGHIJKLMNOPQRS0123456789;` <br> `Authorization: Digest ABCDEFGHIJKLMNOPQRS0123456789;`

Learn more about [HttpRequestHeaders.Authorization Property](/dotnet/api/system.net.http.headers.httprequestheaders.authorization).

### CSCAN-GENERAL0130

Client Secret / API Key

**Sample**: `client_secret=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=` <br> `ida:password=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=` <br> `ida:...issuer...Api...abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=` <br> `Namespace...ACS...Issuer...abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=` <br> `IssuerName...IssuerSecret=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=` <br> `App_Secret=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDEabcdefghijklmnopqrstuvwxyz0123456789/+ABCDE==`

Learn more about [The Client ID and Secret](https://www.oauth.com/oauth2-servers/client-registration/client-id-secret/) and [How and why applications are added to Microsoft Entra ID](../active-directory/develop/how-applications-are-added.md).

### CSCAN-GENERAL0140

General Symmetric Key

**Sample**: `key=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=;`

Learn more about [AES Class](/dotnet/api/system.security.cryptography.aes).

### CSCAN-GENERAL0150

Ansible Vault

**Sample**: `$ANSIBLE_VAULT;1.1;AES256abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE...`

Learn more about [Protecting sensitive data with Ansible vault](https://docs.ansible.com/ansible/latest/vault_guide/index.html#creating-encrypted-files).

### CSCAN-GH0010

GitHub Personal Access Token

**Sample**: `pat=ghp_abcdefghijklmnopqrstuvwxyzABCD012345` <br> `pat=v1.abcdef0123456789abcdef0123456789abcdef01` <br> `https://user:abcdef0123456789abcdef0123456789abcdef01@github.com`

Learn more about [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

### CSCAN-GOOG0010

Google API key

**Sample**: `apiKey=AIzaefgh0123456789_-ABCDEFGHIJKLMNOPQRS;`

Learn more about [Authentication using API keys](https://cloud.google.com/docs/authentication/api-keys).

### CSCAN-MSFT0100

Microsoft Bing Maps Key

**Sample**: `bingMapsKey=abcdefghijklmnopqrstuvwxyz0123456789-_ABCDEabcdefghijklmnopqrstu` <br>`...bing.com/api/maps/...key=abcdefghijklmnopqrstuvwxyz0123456789-_ABCDEabcdefghijklmnopqrstu` <br>`...dev.virtualearth.net/...key=abcdefghijklmnopqrstuvwxyz0123456789-_ABCDEabcdefghijklmnopqrstu`

Learn more about [Getting a Bing Maps Key](/bingmaps/getting-started/bing-maps-dev-center-help/getting-a-bing-maps-key).

### CSCAN-WORK0010

Slack Access Token

**Sample**: `slack_token= xoxp-abcdef-abcdef-abcdef-abcdef ;` <br> `slack_token= xoxb-abcdef-abcdef ;` <br> `slack_token= xoxa-2-abcdef-abcdef-abcdef-abcdef ;` <br>`slack_token= xoxr-abcdef-abcdef-abcdef-abcdef ;`

Learn more about [Token types](https://api.slack.com/authentication/token-types).

## Next steps

[Overview of Defender for DevOps](defender-for-devops-introduction.md)
