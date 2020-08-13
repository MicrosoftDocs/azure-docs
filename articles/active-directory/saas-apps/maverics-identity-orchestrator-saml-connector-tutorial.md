---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Maverics Identity Orchestrator SAML Connector | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Maverics Identity Orchestrator SAML Connector.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 9cad791f-8746-4584-bf4e-e281b709fb2b
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 08/12/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Maverics Identity Orchestrator SAML Connector

## Introduction

Strata provides a simple way to integrate on-premises applications with Azure AD for authentication and access control.

This guide walks through how to configure Maverics Identity Orchestrator&trade; to:
* Incrementally migrate users from an on-premises identity system into Azure AD during login to a legacy on-premises application.
* Route login requests from a legacy web access management product such as CA SiteMinder or Oracle Access Manager to Azure AD.
* Authenticate users to on-premises applications that are protected using http headers or proprietary session cookies after authenticating the user against Azure AD.

Strata provides software that deploys on-premises or in the cloud to discover, connect, and orchestrate across identity providers to create distributed identity management for hybrid and multi-cloud enterprises.

This tutorial will demonstrate how to migrate an on-premises web application currently protected by a legacy web access management product (CA SiteMinder) to use Azure AD for authentication and access control.
1. Install Maverics Identity Orchestrator&trade;
2. Register your enterprise application with Azure AD and configure it to use the Maverics Azure AD SAML Zero Code Connector&trade; for SAML-based SSO.
3. Integrate Maverics with SiteMinder and the LDAP user store.
4. Set up Azure Key Vault and configure Maverics to use it as its secrets management provider.
5. Demonstrate user migration and session abstraction using Maverics to provide access to an on-premises Java web application.

For additional installation and configuration instructions, please visit https://strata.io/docs

## Prerequisites

- An Azure AD subscription. If you don't have a subscription, you can get a [free
account](https://azure.microsoft.com/free/).
- Maverics Identity Orchestrator SAML Connector single sign-on (SSO) enabled
subscription. To obtain the Maverics software please contact sales@strata.io

## Install Maverics Identity Orchestrator&trade;

To get started with Maverics Identity Orchestrator installation, please refer to the installation instructions at https://strata.io/docs

## System requirements
### Supported Operating Systems
* RHEL 7+
* CentOS 7+

### Dependencies
* systemd

## Installation

1. Obtain the latest Maverics RPM package. Copy the package to the system on which you'd like to install the Maverics software.

2. Install the Maverics package, substituting your filename in place of `maverics.rpm`.

	`sudo rpm -Uvf maverics.rpm`

3. After installing Maverics, it will run as a service under `systemd`. To verify the service is running, execute the following command.

	`sudo systemctl status maverics`

By default, Maverics is installed in the `/usr/local/bin` directory.

After installing Maverics, the default `maverics.yaml` file is created in the `/etc/maverics` directory. Before you edit your configuration to include `workflows` and `connectors`, your configuration file will look like this:

```yaml
# © Strata Identity Inc. 2020. All Rights Reserved. Patents Pending.

version: 0.1
listenAddress: ":7474"
```
## Config options
### Version
The `version` field declares which version of configuration file is being used. If not specified, the most recent config
version will be used.

```yaml
version: 0.1
```
### Listen Address
`listenAddress` declares which address the Orchestrator will listen on. If the host section of the address is blank, the Orchestrator will listen on all available unicast and anycast IP addresses of the local system. If the port section of the address is blank, a port number is automatically chosen.

```yaml
listenAddress: ":453"
```
### TLS

The `tls` field declares a map of transport layer security objects. The TLS objects can be used by connectors as well as the Orchestrator server. For all available TLS options, see the `transport`'s package documentation.

Microsoft Azure requires communication over TLS when using SAML-based SSO, you can find more information [here](https://letsencrypt.org/getting-started/) to generate your certificates.

The `maverics` key is reserved for the Orchestrator server. All other keys are available and can be used to inject a TLS object into a given connector.

```yaml
tls:
  maverics:
    certFile: /etc/maverics/maverics.cert
    keyFile: /etc/maverics/maverics.key
```  
### Include Files

`connectors` and `workflows` can be defined in their own, separate configuration files and referenced by `maverics.yaml` using `includeFiles` per the following example.
```yaml
includeFiles:
  - workflow/sessionAbstraction.yaml
  - connector/AzureAD-saml.yaml
  - connector/siteminder.yaml
  ```

This tutorial uses a single `maverics.yaml` configuration file.

## Using Azure Key Vault as your secrets provider

### Secret management

Maverics is capable of integrating with various secret management solutions in order to load secrets. The current integrations include a file, Hashicorp Vault and Azure Key Vault. If no secret management solution is specified, Maverics will default to loading secrets in plain text out of `maverics.yaml`.
To declare a value as a secret in a `maverics.yaml` config file, wrap the secret with angle brackets:

  ```yaml
  connectors:
  - name: AzureAD
    type: AzureAD
    apiToken: <AzureADAPIToken>
    oauthClientID: <AzureADOAuthClientID>
    oauthClientSecret: <AzureADOAuthClientSecret>
  ```

### File

To load secrets from a file, add the environment variable `MAVERICS_SECRET_PROVIDER` in the file  `/etc/maverics/maverics.env` , with:

`MAVERICS_SECRET_PROVIDER=secretfile:///<PATH TO SECRETS FILE>`

Then restart the maverics service:
`sudo systemctl restart maverics`

The `secrets.yaml` file contents can be filled with any number of `secrets`.
```yaml
secrets:
  AzureADAPIToken: aReallyGoodToken
  AzureADOAuthClientID: aReallyUniqueID
  AzureADOAuthClientSecret: aReallyGoodSecret
```
### Azure Key Vault

The following steps show how to set up an Azure Key Vault, using the [Azure portal](https://portal.azure.com) or using the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest):

1. [Log in](https://portal.azure.com) using the Azure portal, or using the CLI command:
    ```shell
    az login
    ```

2. [Create a new Vault](https://docs.microsoft.com/azure/key-vault/secrets/quick-create-portal#create-a-vault), or using the CLI command:
    ```shell
    az keyvault create --name "[VAULT_NAME]" --resource-group "[RESOURCE_GROUP]" --location "[REGION]"
    ```

3. [Add the Secrets to Key Vault](https://docs.microsoft.com/azure/key-vault/secrets/quick-create-portal#add-a-secret-to-key-vault), or using a CLI command:
    ```shell
    az keyvault secret set --vault-name "[VAULT_NAME]" --name "[SECRET_NAME]" --value "[SECRET_VALUE]"
    ```

4. [Register an application with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application), or using a CLI command:
    ```shell
    az ad sp create-for-rbac -n "MavericsKeyVault" --skip-assignment > azure-credentials.json
    ```

5. [Authorize an application to use a secret](https://docs.microsoft.com/azure/key-vault/secrets/quick-create-portal#add-a-secret-to-key-vault), or using a CLI command:
    ```shell
    az keyvault set-policy --name "[VAULT_NAME]" --spn [APPID] --secret-permissions list get
    #APPID can be found in the azure-credentials.json
    generated in the previous step
    ```

To load secrets from Azure KeyVault, set the environment variable `MAVERICS_SECRET_PROVIDER` in the file `/etc/maverics/maverics.env`, with the credentials found in the azure-credentials.json file, using the following pattern:
`MAVERICS_SECRET_PROVIDER='azurekeyvault://<KEYVAULT NAME>.vault.azure.net?clientID=<APPID>&clientSecret=<PASSWORD>&tenantID=<TENANT>'`

Then restart the maverics service:
`sudo systemctl restart maverics`

## Configure your application in Azure AD for SAML-based SSO

1. In your Azure Active Directory tenant, navigate to `Enterprise applications`, search for `Maverics Identity Orchestrator SAML Connector` and select it.

2. On the 'Maverics Identity Orchestrator SAML Connector' | Properties page, set `User assignment required?` to No to enable the application to work for newly migrated users.

3. On the 'Maverics Identity Orchestrator SAML Connector' | Overview page, select `Setup single sign-on` and then select `SAML`.

4. On the 'Maverics Identity Orchestrator SAML Connector' | SAML-based sign on, edit the Basic SAML Configuration.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

5. set the `Entity ID` typing a URL using the following pattern: `https://<SUBDOMAIN>.maverics.org`. The `Entity ID` must be unique across the apps in the tenant. Save the value entered here to be included in the configuration of Maverics.

6. Set Reply URL, using the following pattern: `https://<AZURECOMPANY.COM>/<MY_APP>/`. 

7. Set Sign on URL, using the following pattern: `https://<AZURE-COMPANY.COM>/<MY_APP>/<LOGIN PAGE>` and click Save.

8. Go to the SAML Signing Certificate section and click copy button to copy App Federation Metadata Url and save it on your
computer.

	![The Certificate download link](common/copy-metadataurl.png)

## Maverics Identity Orchestrator Azure AD SAML Connector configuration

The Maverics Identity Orchestrator Azure AD Connector supports: 
- OpenID Connect
- SAML Connect 

1. To enable SAML-based SSO, set `authType: saml`.

1. Create the value for `samlMetadataURL`: `samlMetadataURL:https://login.microsoftonline.com/<TENANT ID>/federationmetadata/2007-06/federationmetadata.xml?appid=<APP ID>`

1. Now, define the URL that Azure will redirected back to in your app after they have logged in with their Azure credentials.
`samlRedirectURL: https://<AZURECOMPANY.COM>/<MY_APP>`

1. Copy the value from the EntityID configured above:
`samlEntityID: https://<SUBDOMAIN>.maverics.org`

1. Copy the value from the Reply URL that Azure AD will use to POST the SAML response.
`samlConsumerServiceURL: https://<AZURE-COMPANY.COM>/<MY_APP>`

1. Generate a JWT signing key, used to protect the Maverics Identity Orchestrator&trade; session info, using the [OpenSSL tool](https://www.openssl.org/source/):

    ```shell 
    openssl rand 64 | base64
    ```
1. Copy the response to the `jwtSigningKey` config property:
`jwtSigningKey: TBHPvTtu6NUqU84H3Q45grcv9WDJLHgTioqRhB8QGiVzghKlu1mHgP1QHVTAZZjzLlTBmQwgsSoWxGHRcT4Bcw==`

## Attributes and Attribute mapping
Attribute Mapping is used to define the mapping of user attributes from a source on-premises user directory into Azure AD when users are provisioned.

Attributes determine the user data that may returned to an application in a claim, passed into session cookies, or passed to the application in http header variables.

## Configure Maverics Identity Orchestrator Azure AD SAML Connector yaml

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

## Migrate users to Azure AD

Follow this configuration to incrementally migrate users from a web access management product such as CA SiteMinder, Oracle Access Manager, or IBM Tivoli; a LDAP directory; or a SQL database.

## Configure your application permissions in Azure AD to create users

1. In your Azure Active Directory tenant, navigate to `App registrations` and select the 'Maverics Identity Orchestrator SAML Connector' application.

2. On the 'Maverics Identity Orchestrator SAML Connector' | Certificates & secrets, select `New client secret` and then select on expiration option. Click copy button to copy the secret and save it on your computer.

3. On the 'Maverics Identity Orchestrator SAML Connector' | API permissions, select `Add permission` and then on Request API permissions select `Microsoft Graph` and then `Application permissions`. On the next screen select the `User.ReadWrite.All` and then select `Add permissions`. This will lead you back to API permissions, there select `Grant admin consent`.


## Configure the Maverics Identity Orchestrator SAML Connector yaml for user migration

To enable user migration workflow, add this additional properties into the config file:
1. Set the Azure Graph URL: `graphURL: https://graph.microsoft.com`
1. Set the OAuth Token URL, following the pattern:
`oauthTokenURL: https://login.microsoftonline.com/<TENANT ID>/federationmetadata/2007-06/federationmetadata.xml?appid=<APP ID>`
1. Set the Client Secret generated above: `oauthClientSecret: <CLIENT SECRET>`


Your final Maverics Identity Orchestrator Azure AD Connector configuration will look like this:
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

## Configure the Maverics Zero Code Connector&trade; for SiteMinder

The SiteMinder connector is used to migrate users into Azure AD and to login users to legacy on-premises applications protected by SiteMinder using the newly created Azure AD identities and credentials.

For this tutorial, SiteMinder has been configured to protect the legacy application with forms-based authentication and using the `SMSESSION` cookie. To integrate with an app that consumes authentication and session through http headers, you will need to add the header emulation configuration to the connector.

This example maps the `username` attribute to the `SM_USER` http header:
```yaml
  headers:
    SM_USER: username
```

Set the `proxyPass` to the location that requests are proxied to. Typically this is the host of the protected application.

`loginPage` should match the URL of the login form currently used by SiteMinder when redirecting users for authentication.

```yaml
connectors:
- name: siteminder-login-form
  type: siteminder
  loginType: form
  loginPage: /siteminderagent/forms/login.fcc
  proxyPass: http://host.company.com
```

## Configure the Maverics Zero Code Connector&trade; for LDAP

When applications are protected by a WAM product such as SiteMinder, user identities and attributes are typically stored in a LDAP directory.

This connector configuration demonstrates how to connect to the LDAP directory configured as the user store for SiteMinder so that the correct user profile information can be collected during the migration workflow and a corresponding user can be created in Azure AD.

* `baseDN` specifies the location in the directory against which to perform the LDAP search.

* `url` is the address and port of the LDAP server to connect to.

* `serviceAccountUsername` is the username used to connect to the LDAP server, usually expressed as a Bind DN, for example `CN=Directory Manager`.

* `serviceAccountPassword` the password used to connect to the LDAP server. This value is stored in the Azure Key Vault instance configured previously.  

* `userAttributes` defines the list of user related attributes to query for. These attributes are later mapped into corresponding Azure AD attributes.

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

## Configure the Migration workflow

The migration workflow configuration determines how Maverics will migrate users from SiteMinder/LDAP to Azure AD.

This workflow:
- Uses the SiteMinder connector to proxy the SiteMinder login. User credentials are validated through SiteMinder authentication and then passed to subsequent steps of the workflow.
- Retrieves user profile attributes from the SiteMinder user store.
- Makes a request to the Microsoft Graph API to create the user in your Azure AD tenant.

Steps:
1. Give the workflow a name, e.g. SiteMinder to Azure AD Migration.
2. Specify the `endpoint`, which is an HTTP path on which the workflow is exposed which triggers the `actions` of that workflow in response to requests. The `endpoint` typically corresponds to the app being proxied, e.g. `/my_app`. The value must include both the leading and trailing slashes.
3. Add the appropriate `actions` to the workflow.
    - Define the `login` method for the SiteMinder connector. The connector value must match the name value in the connector configuration.
     - Define the `getprofile` method for the LDAP connector.
     - Define the `createuser` for the AzureAD connector.

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
### Verify the Migration workflow

1. If the Maverics service is not already running, start it by executing the following command: 
`sudo systemctl start maverics`

2. Navigate to the proxied login url: `http://host.company.com/my_app`.
3. Provide user credentials used to login to the application while protected by SiteMinder.
4. Navigate to Home > Users | All Users to verify that your user is created in the Azure AD tenant.  

## Configure the Session Abstraction workflow

The session abstraction workflow moves authentication and access control for the legacy on-premises web application to Azure AD.

The Azure connector uses the `login` method to redirect the user to the login URL, assuming no session exists.

Once authenticated, the session token created as a result is passed to Maverics and the SiteMinder connector's `emulate` method is used to emulate the cookie-based session and/or the header based session and then decorate the request with any additional attributes required by the application.

1. Give the workflow a name, e.g SiteMinder Session Abstraction.
2. Specify the `endpoint`, which corresponds to the app being proxied. The value must include both leading and trailing slashes, e.g. `/my_app/`.
3. Add the appropriate `actions` to the workflow.
    - Define the `login` method for the Azure connector. The `connector` value must match the `name` value in the connector configuration.
    - Define the `emulate` method for the SiteMinder connector.

     ```yaml
      - name: SiteMinder Session Abstraction
        endpoint: /my_app/
        actions:
      - connector: azure
        method: login
      - connector: siteminder-login-form
        method: emulate
     ```
### Verify the Session Abstraction workflow

1. Navigate to the proxied application URL: `https://<AZURECOMPANY.COM>/<MY_APP>`. The user will be redirected to the proxied login page.
2. Enter the Azure AD user credentials.
3. The user should be redirected to the application as though authenticated directly by SiteMinder.
