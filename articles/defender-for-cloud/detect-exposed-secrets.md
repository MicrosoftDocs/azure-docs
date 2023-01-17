---
title: Detect exposed secrets in code
titleSuffix: Defender for Cloud
description: Prevent passwords and other secrets that may be stored in your code from being accessed by outside individuals by using Defender for Cloud's secret scanning for Defender for DevOps.
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 01/17/2023
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

By adding the additions to your yaml file, you will ensure that secret scanning only runs when you execute a build to your Azure DevOps pipeline.

## Remediate secrets findings

When credential are discovered in your code, you can remove them. Instead you can use an alternative method that will not expose the secrets directly in your source code. Some of the best practices that exist to handle this type of situation include:

- Eliminating the use of credentials (if possible).

- Using secret storage such as Azure Key Vault (AKV).

- Updating your authentication methods to take advantage of managed identities (MSI) via Azure Active Directory (AAD).
  
**To remediate secrets findings using Azure Key Vault**:

1. Create a [key vault using PowerShell](../key-vault/general/quick-create-powershell.md).

1. [Add any necessary secrets](../key-vault/secrets/quick-create-net.md) for your application to your Key Vault.

1. Update your application to connect to Key Vault using managed identity with one of the following:

    - [Azure Key Vault for App Service application](../key-vault/general/tutorial-net-create-vault-azure-web-app.md)
    - [Azure Key Vault for applications deployed to a VM](../key-vault/general/tutorial-net-virtual-machine.md)

Once you have remediated findings you can review the [Best practices for using Azure Key Vault](../key-vault/general/best-practices.md).

**To remediate secrets findings using managed identities**:

Before you can remediate secrets findings using managed identities, you need to ensure that the Azure resource you are authenticating to in your code supports managed identities. You can check the full list of [Azure services that can use managed identities to access other services](../active-directory/managed-identities-azure-resources/managed-identities-status.md).

If your Azure service is listed, you can [manage your identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).


## Suppress false positives

When the scanner runs, it may detect credentials that are false positives. Inline-suppression tools can be used to suppress false positives. 

Some reasons to suppress false positives include:

- Fake or mocked credentials in the test files. These credentials can't access resources.

- Placeholder strings. For example, placeholder strings may be used to initialize a variable which is then populated using a secret store such as AKV.

- External library or SDKs that are directly consumed. For example, openssl.

- THard-coded credentials for an ephemeral test resource that only exists for the lifetime of the test being run.

- Self-signed certificates that are used locally and not used as a root. For example, they may be used when running localhost to allow HTTPS.

- Source-controlled documentation with non-functional credential for illustration purposes only

- Invalid results. The output is not a credential or a secret.

You may want to suppress fake secrets in unit tests or mock paths, or inaccurate results. We don't recommend using suppression to suppress test credentials. Test credentials can still pose a security risk and should be securely stored.

> [!NOTE]
> Valid inline suppression syntax depends on the language, data format and CredScan version you are using. 

Credentials that are used for test resources and environments shouldn't be suppressed. They are being used to demonstration purposes only and do not affect anything else. 

### Suppress a same line secret

To suppress a secret that is found on the same line, add the following code as a comment at the end of the line that has the secret:

```bash
[SuppressMessage("Microsoft.Security", "CS001:SecretInLine", Justification="... .")]
```

### Suppress a secret in the next line 

To suppress the secret found in the next line, add the following code as a comment before the line that has the secret:

```bash
[SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine", Justification="... .")]
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
| CSCAN-AZURE0030 | Azure Service Bus Shared Access Signature | Endpoint=sb://account.servicebus.windows.net;SharedAccessKey=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE=
ServiceBusNamespace=...SharedAccessPolicy=...Key=abcdefghijklmnopqrstuvwxyz0123456789/+ABCDE= | [Service Bus authentication and authorization](../service-bus-messaging/service-bus-authentication-and-authorization.md) <br> [Service Bus access control with Shared Access Signatures](../service-bus-messaging/service-bus-sas.md) | 
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










## Next steps
+ Learn how to [configure pull request annotations](enable-pull-request-annotations.md) in Defender for Cloud to remediate secrets in code before they are shipped to production.
