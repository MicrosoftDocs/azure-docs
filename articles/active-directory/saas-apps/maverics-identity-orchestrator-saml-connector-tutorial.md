---
title: 'Tutorial: Integrate Azure Active Directory single sign-on (SSO) with Maverics Identity Orchestrator SAML Connector | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Maverics Identity Orchestrator SAML Connector.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/12/2020
ms.author: jeedes
---

# Tutorial: Integrate Azure AD single sign-on with Maverics Identity Orchestrator SAML Connector

Strata provides a simple way to integrate on-premises applications with Azure Active Directory (Azure AD) for authentication and access control.

This article walks you through how to configure Maverics Identity Orchestrator to:
* Incrementally migrate users from an on-premises identity system into Azure AD during login to a legacy on-premises application.
* Route login requests from a legacy web-access management product, such as CA SiteMinder or Oracle Access Manager, to Azure AD.
* Authenticate users to on-premises applications that are protected by using HTTP headers or proprietary session cookies after authenticating the user against Azure AD.

Strata provides software that you can deploy on-premises or in the cloud. It helps you discover, connect, and orchestrate across identity providers to create distributed identity management for hybrid and multi-cloud enterprises.

This tutorial demonstrates how to migrate an on-premises web application that's currently protected by a legacy web access management product (CA SiteMinder) to use Azure AD for authentication and access control. Here are the basic steps:
1. Install Maverics Identity Orchestrator.
2. Register your enterprise application with Azure AD, and configure it to use Maverics Azure AD SAML Zero Code Connector for SAML-based single sign-on (SSO).
3. Integrate Maverics with SiteMinder and the Lightweight Directory Access Protocol (LDAP) user store.
4. Set up an Azure key vault, and configure Maverics to use it as its secrets management provider.
5. Demonstrate user migration and session abstraction by using Maverics to provide access to an on-premises Java web application.

For additional installation and configuration instructions, go to the [Strata website](https://www.strata.io).

## Prerequisites

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
- A Maverics Identity Orchestrator SAML Connector SSO-enabled
subscription. To obtain the Maverics software, contact [Strata sales](mailto:sales@strata.io).

## Install Maverics Identity Orchestrator

To get started with the Maverics Identity Orchestrator installation, see the [installation instructions](https://www.strata.io).

### System requirements
* Supported operating systems
  * RHEL 7+
  * CentOS 7+

* Dependencies
  * systemd

### Installation

1. Obtain the latest Maverics Redhat Package Manager (RPM) package. Copy the package to the system on which you want to install the Maverics software.

2. Install the Maverics package, substituting your file name in place of `maverics.rpm`.

	`sudo rpm -Uvf maverics.rpm`

3. After you install Maverics, it will run as a service under `systemd`. To verify that the service is running, execute the following command:

	`sudo systemctl status maverics`

By default, Maverics is installed in the */usr/local/bin* directory.

After you install Maverics, the default *maverics.yaml* file is created in the */etc/maverics* directory. Before you edit your configuration to include `workflows` and `connectors`, your configuration file will look like this:

```yaml
# © Strata Identity Inc. 2020. All Rights Reserved. Patents Pending.

version: 0.1
listenAddress: ":7474"
```
## Configuration options
### Version
The `version` field declares which version of the configuration file is being used. If the version isn't specified, the most recent configuration version will be used.

```yaml
version: 0.1
```
### listenAddress
`listenAddress` declares which address Orchestrator will listen on. If the host section of the address is blank, Orchestrator will listen on all available unicast and anycast IP addresses of the local system. If the port section of the address is blank, a port number is chosen automatically.

```yaml
listenAddress: ":453"
```
### TLS

The `tls` field declares a map of Transport Layer Security (TLS) objects. The TLS objects can be used by connectors and the Orchestrator server. For all available TLS options, see the `transport` package documentation.

Microsoft Azure requires communication over TLS when you're using SAML-based SSO. For information about generating certificates, go to the [Let's Encrypt website](https://letsencrypt.org/getting-started/).

The `maverics` key is reserved for the Orchestrator server. All other keys are available and can be used to inject a TLS object into a given connector.

```yaml
tls:
  maverics:
    certFile: /etc/maverics/maverics.cert
    keyFile: /etc/maverics/maverics.key
```  
### Include files

You can define `connectors` and `workflows` in their own, separate configuration files and reference them in the *maverics.yaml* file by using `includeFiles`, per the following example:

```yaml
includeFiles:
  - workflow/sessionAbstraction.yaml
  - connector/AzureAD-saml.yaml
  - connector/siteminder.yaml
  ```

This tutorial uses a single *maverics.yaml* configuration file.

## Use Azure Key Vault as your secrets provider

### Manage secrets

To load secrets, Maverics can integrate with various secret management solutions. The current integrations include a file, Hashicorp Vault, and Azure Key Vault. If no secret management solution is specified, Maverics defaults to loading secrets in plain text out of the *maverics.yaml* file.

To declare a value as a secret in a *maverics.yaml* config file, enclose the secret in angle brackets:

  ```yaml
  connectors:
  - name: AzureAD
    type: AzureAD
    apiToken: <AzureADAPIToken>
    oauthClientID: <AzureADOAuthClientID>
    oauthClientSecret: <AzureADOAuthClientSecret>
  ```

### Load secrets from a file

1. To load secrets from a file, add the environment variable `MAVERICS_SECRET_PROVIDER` in the */etc/maverics/maverics.env* file by using:

   `MAVERICS_SECRET_PROVIDER=secretfile:///<PATH TO SECRETS FILE>`

2. Restart the Maverics service by running:

   `sudo systemctl restart maverics`

The *secrets.yaml* file contents can be filled with any number of `secrets`.

```yaml
secrets:
  AzureADAPIToken: aReallyGoodToken
  AzureADOAuthClientID: aReallyUniqueID
  AzureADOAuthClientSecret: aReallyGoodSecret
```
### Set up an Azure key vault

You can set up an Azure key vault by using either the Azure portal or the Azure CLI.

**Use the Azure portal**
1. Sign in to the [Azure portal](https://portal.azure.com).
1. [Create a new key vault](https://docs.microsoft.com/azure/key-vault/secrets/quick-create-portal#create-a-vault).
1. [Add the secrets to the key vault](https://docs.microsoft.com/azure/key-vault/secrets/quick-create-portal#add-a-secret-to-key-vault).
1. [Register an application with Azure AD](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application).
1. [Authorize an application to use a secret](https://docs.microsoft.com/azure/key-vault/secrets/quick-create-portal#add-a-secret-to-key-vault).

**Use the Azure CLI**

1. Open the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest), and then enter the following command:

    ```shell
    az login
    ```

1. Create a new key vault by running the following command:
    ```shell
    az keyvault create --name "[VAULT_NAME]" --resource-group "[RESOURCE_GROUP]" --location "[REGION]"
    ```

1. Add the secrets to the key vault by running the following command:
    ```shell
    az keyvault secret set --vault-name "[VAULT_NAME]" --name "[SECRET_NAME]" --value "[SECRET_VALUE]"
    ```

1. Register an application with Azure AD by running the following command:
    ```shell
    az ad sp create-for-rbac -n "MavericsKeyVault" --skip-assignment > azure-credentials.json
    ```

1. Authorize an application to use a secret by running the following command:
    ```shell
    az keyvault set-policy --name "[VAULT_NAME]" --spn [APPID] --secret-permissions list get
    #APPID can be found in the azure-credentials.json
    generated in the previous step
    ```

1. To load secrets from your Azure key vault, set the environment variable `MAVERICS_SECRET_PROVIDER` in the */etc/maverics/maverics.env* file by using the credentials found in the *azure-credentials.json* file, in the following format:
 
   `MAVERICS_SECRET_PROVIDER='azurekeyvault://<KEYVAULT NAME>.vault.azure.net?clientID=<APPID>&clientSecret=<PASSWORD>&tenantID=<TENANT>'`

1. Restart the Maverics service:
`sudo systemctl restart maverics`

## Configure your application in Azure AD for SAML-based SSO

1. In your Azure AD tenant, go to **Enterprise applications**, search for **Maverics Identity Orchestrator SAML Connector**, and then select it.

1. On the Maverics Identity Orchestrator SAML Connector **Properties** pane, set **User assignment required?** to **No** to enable the application to work for newly migrated users.

1. On the Maverics Identity Orchestrator SAML Connector **Overview** pane, select **Set up single sign-on**, and then select **SAML**.

1. On the Maverics Identity Orchestrator SAML Connector **SAML-based sign on** pane, edit the **Basic SAML Configuration** by selecting the **Edit** (pencil icon) button.

   ![Screenshot of the "Basic SAML Configuration" Edit button.](common/edit-urls.png)

1. Enter the **Entity ID** by typing a URL in the following format: `https://<SUBDOMAIN>.maverics.org`. The Entity ID must be unique across the apps in the tenant. Save the value entered here to be included in the configuration of Maverics.

1. Enter the **Reply URL** in the following format: `https://<AZURECOMPANY.COM>/<MY_APP>/`. 

1. Enter the **Sign on URL** in the following format: `https://<AZURE-COMPANY.COM>/<MY_APP>/<LOGIN PAGE>`. 

1. Select **Save**.

1. In the **SAML Signing Certificate** section, select the **Copy** button to copy the **App Federation Metadata URL**, and then save it to your computer.

	![Screenshot of the "SAML Signing Certificate" Copy button.](common/copy-metadataurl.png)

## Configure Maverics Identity Orchestrator Azure AD SAML Connector

Maverics Identity Orchestrator Azure AD Connector supports OpenID Connect and SAML Connect. To configure the connector, do the following: 

1. To enable SAML-based SSO, set `authType: saml`.

1. Create the value for `samlMetadataURL` in the following format: `samlMetadataURL:https://login.microsoftonline.com/<TENANT ID>/federationmetadata/2007-06/federationmetadata.xml?appid=<APP ID>`.

1. Define the URL that Azure will be redirected back to in your app after users have logged in with their Azure credentials. Use the following format:
`samlRedirectURL: https://<AZURECOMPANY.COM>/<MY_APP>`.

1. Copy the value from the previously configured EntityID:
`samlEntityID: https://<SUBDOMAIN>.maverics.org`.

1. Copy the value from the Reply URL that Azure AD will use to post the SAML response:
`samlConsumerServiceURL: https://<AZURE-COMPANY.COM>/<MY_APP>`.

1. Generate a JSON Web Token (JWT) signing key, which is used to protect the Maverics Identity Orchestrator session information, by using the [OpenSSL tool](https://www.openssl.org/source/):

    ```shell 
    openssl rand 64 | base64
    ```
1. Copy the response to the `jwtSigningKey` config property:
`jwtSigningKey: TBHPvTtu6NUqU84H3Q45grcv9WDJLHgTioqRhB8QGiVzghKlu1mHgP1QHVTAZZjzLlTBmQwgsSoWxGHRcT4Bcw==`.

## Attributes and attribute mapping
Attribute mapping is used to define the mapping of user attributes from a source on-premises user directory into an Azure AD tenant after the user is set up.

Attributes determine which user data might be returned to an application in a claim, passed into session cookies, or passed to the application in HTTP header variables.

## Configure the Maverics Identity Orchestrator Azure AD SAML Connector YAML file

Your Maverics Identity Orchestrator Azure AD Connector configuration will look like this:

```yaml
- name: AzureAD
  type: azure
  authType: saml
  samlMetadataURL: https://login.microsoftonline.com/<TENANT ID>/federationmetadata/2007-06/federationmetadata.xml?appid=<APP ID>
  samlRedirectURL: https://<AZURECOMPANY.COM>/<MY_APP>
  samlConsumerServiceURL: https://<AZURE-COMPANY.COM>/<MY_APP>
  jwtSigningKey: <SIGNING KEY>
  samlEntityID: https://<SUBDOMAIN>.maverics.org
  attributeMapping:
    displayName: username
    mailNickname: givenName
    givenName: givenName
    surname: sn
    userPrincipalName: mail
    password: password
```

## Migrate users to an Azure AD tenant

Follow this configuration to incrementally migrate users from a web access management product, such as CA SiteMinder, Oracle Access Manager, or IBM Tivoli. You can also migrate them from a Lightweight Directory Access Protocol (LDAP) directory or a SQL database.

### Configure your application permissions in Azure AD to create users

1. In your Azure AD tenant, go to `App registrations` and select the **Maverics Identity Orchestrator SAML Connector** application.

1. On the **Maverics Identity Orchestrator SAML Connector | Certificates & secrets** pane, select `New client secret` and then select on expiration option. Select the **Copy** button to copy the secret and save it to your computer.

1. On the **Maverics Identity Orchestrator SAML Connector | API permissions** pane, select **Add permission** and then, on the **Request API permissions** pane, select **Microsoft Graph** and **Application permissions**. 

1. On the next screen, select **User.ReadWrite.All**, and then select **Add permissions**. 

1. Back on the **API permissions** pane, select **Grant admin consent**.

### Configure the Maverics Identity Orchestrator SAML Connector YAML file for user migration

To enable the user migration workflow, add these additional properties to the configuration file:
1. Enter the **Azure Graph URL** in the following format: `graphURL: https://graph.microsoft.com`.
1. Enter the **OAuth Token URL** in the following format:
`oauthTokenURL: https://login.microsoftonline.com/<TENANT ID>/federationmetadata/2007-06/federationmetadata.xml?appid=<APP ID>`.
1. Enter the previously generated client secret in the following format: `oauthClientSecret: <CLIENT SECRET>`.


Your final Maverics Identity Orchestrator Azure AD Connector configuration file will look like this:

```yaml
- name: AzureAD
  type: azure
  authType: saml
  samlMetadataURL: https://login.microsoftonline.com/<TENANT ID>/federationmetadata/2007-06/federationmetadata.xml?appid=<APP ID>
  samlRedirectURL: https://<AZURECOMPANY.COM>/<MY_APP>
  samlConsumerServiceURL: https://<AZURE-COMPANY.COM>/<MY_APP>
  jwtSigningKey: TBHPvTtu6NUqU84H3Q45grcv9WDJLHgTioqRhB8QGiVzghKlu1mHgP1QHVTAZZjzLlTBmQwgsSoWxGHRcT4Bcw==
  samlEntityID: https://<SUBDOMAIN>.maverics.org
  graphURL: https://graph.microsoft.com
  oauthTokenURL: https://login.microsoftonline.com/<TENANT ID>/oauth2/v2.0/token
  oauthClientID: <APP ID>
  oauthClientSecret: <NEW CLIENT SECRET>
  attributeMapping:
    displayName: username
    mailNickname: givenName
    givenName: givenName
    surname: sn
    userPrincipalName: mail
    password: password
```

### Configure Maverics Zero Code Connector for SiteMinder

You use the SiteMinder connector to migrate users to an Azure AD tenant. You log the users in to legacy on-premises applications that are protected by SiteMinder by using the newly created Azure AD identities and credentials.

For this tutorial, SiteMinder has been configured to protect the legacy application by using forms-based authentication and the `SMSESSION` cookie. To integrate with an app that consumes authentication and session information through HTTP headers, you need to add the header emulation configuration to the connector.

This example maps the `username` attribute to the `SM_USER` HTTP header:

```yaml
  headers:
    SM_USER: username
```

Set `proxyPass` to the location that requests are proxied to. Typically, this location is the host of the protected application.

`loginPage` should match the URL of the login form that's currently used by SiteMinder when it redirects users for authentication.

```yaml
connectors:
- name: siteminder-login-form
  type: siteminder
  loginType: form
  loginPage: /siteminderagent/forms/login.fcc
  proxyPass: http://host.company.com
```

### Configure Maverics Zero Code Connector for LDAP

When applications are protected by a web access management (WAM) product such as SiteMinder, user identities and attributes are typically stored in an LDAP directory.

This connector configuration demonstrates how to connect to the LDAP directory. The connector is configured as the user store for SiteMinder so that the correct user profile information can be collected during the migration workflow and a corresponding user can be created in Azure AD.

* `baseDN` specifies the location in the directory against which to perform the LDAP search.

* `url` is the address and port of the LDAP server to connect to.

* `serviceAccountUsername` is the username that's used to connect to the LDAP server, usually expressed as a bind DN (for example, `CN=Directory Manager`).

* `serviceAccountPassword` is the password that's used to connect to the LDAP server. This value is stored in the previously configured Azure key vault instance.  

* `userAttributes` defines the list of user-related attributes to query for. These attributes are later mapped into corresponding Azure AD attributes.

```yaml
- name: company-ldap
  type: ldap
  url: "ldap://ldap.company.com:389"
  baseDN: ou=People,o=company,c=US
  serviceAccountUsername: uid=admin,ou=Admins,o=company,c=US
  serviceAccountPassword: <vaulted-password>
  userAttributes:
    - uid
    - cn
    - givenName
    - sn
    - mail
    - mobile
```

### Configure the migration workflow

The migration workflow configuration determines how Maverics migrates users from SiteMinder or LDAP to Azure AD.

This workflow:
- Uses the SiteMinder connector to proxy the SiteMinder login. User credentials are validated through SiteMinder authentication and then passed to subsequent steps of the workflow.
- Retrieves user profile attributes from the SiteMinder user store.
- Makes a request to the Microsoft Graph API to create the user in your Azure AD tenant.

To configure the migration workflow, do the following:

1. Give the workflow a name (for example, **SiteMinder to Azure AD Migration**).
1. Specify the `endpoint`, which is an HTTP path on which the workflow is exposed, triggering the `actions` of that workflow in response to requests. The `endpoint` typically corresponds to the app that's proxied (for example, `/my_app`). The value must include both the leading and trailing slashes.
1. Add the appropriate `actions` to the workflow.

   a. Define the `login` method for the SiteMinder connector. The connector value must match the name value in the connector configuration.

   b. Define the `getprofile` method for the LDAP connector.

   c.  Define the `createuser` method for the AzureAD connector.

    ```yaml
      workflows:
      - name: SiteMinder to Azure AD Migration
        endpoint: /my_app/
        actions:
        - connector: siteminder-login-form
          method: login
        - connector: company-ldap
          method: getprofile
        - connector: AzureAD
          method: createuser
    ```
### Verify the migration workflow

1. If the Maverics service is not already running, start it by executing the following command: 

   `sudo systemctl start maverics`

1. Go to the proxied login URL, `http://host.company.com/my_app`.
1. Provide the user credentials that are used to log in to the application while it's protected by SiteMinder.
4. Go to **Home** > **Users | All Users** to verify that the user is created in the Azure AD tenant.  

### Configure the session abstraction workflow

The session abstraction workflow moves authentication and access control for the legacy on-premises web application to the Azure AD tenant.

The Azure connector uses the `login` method to redirect the user to the login URL, assuming that no session exists.

After it's authenticated, the session token that's created as a result is passed to Maverics. The SiteMinder connector's `emulate` method is used to emulate the cookie-based session or the header-based session and then decorate the request with any additional attributes required by the application.

1. Give the workflow a name (for example, **SiteMinder Session Abstraction**).
1. Specify the `endpoint`, which corresponds to the app that's being proxied. The value must include both leading and trailing slashes (for example, `/my_app/`).
1. Add the appropriate `actions` to the workflow.

   a. Define the `login` method for the Azure connector. The `connector` value must match the `name` value in the connector configuration.

   b. Define the `emulate` method for the SiteMinder connector.

     ```yaml
      - name: SiteMinder Session Abstraction
        endpoint: /my_app/
        actions:
      - connector: azure
        method: login
      - connector: siteminder-login-form
        method: emulate
     ```
### Verify the session abstraction workflow

1. Go to the proxied application URL, `https://<AZURECOMPANY.COM>/<MY_APP>`. 
    
    You're redirected to the proxied login page.

1. Enter the Azure AD user credentials.

   You should be redirected to the application as though you were authenticated directly by SiteMinder.
