---
title: Tutorial to configure Azure Active Directory B2C with Strata
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with whoIam for user verification 
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 10/25/2020
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial for extending Azure AD B2C to protect on-premises applications using Strata

In this sample tutorial, learn how to integrate Azure Active Directory (AD) B2C with Strata's [Maverics Identity Orchestrator](https://www.strata.io/maverics-identity-orchestrator/).
Maverics Identity Orchestrator extends Azure AD B2C to protect on-premises applications. It connects to any identity system, transparently migrates users and credentials, synchronizes policies and configurations, and abstracts authentication and session management. Using Strata enterprises can quickly transition from legacy to Azure AD B2C without rewriting applications. The solution has the following benefits:

- **Customer Single Sign-On (SSO) to on-premises hybrid apps**: Azure AD B2C supports customer SSO with Maverics Identity Orchestrator. Users sign in with their accounts that are hosted in Azure AD B2C or social Identity provider (IdP). Maverics extends SSO to apps that have been historically secured by legacy identity systems like Symantec SiteMinder.

- **Extend standards-based SSO to apps without rewriting them**: Use Azure AD B2C to manage user access and enable SSO with Maverics Identity Orchestrator SAML or OIDC Connectors.

- **Easy configuration**: Azure AD B2C provides a simple step-by-step user interface for connecting Maverics Identity Orchestrator SAML or OIDC connectors to Azure AD B2C.

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant) that's linked to your Azure subscription.

- An instance of [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) to store secrets that are used by Maverics Identity Orchestrator. It's used to connect to Azure AD B2C or other attribute providers such as a Lightweight Directory Access Protocol (LDAP) directory or database.

- An instance of [Maverics Identity Orchestrator](https://www.strata.io/maverics-identity-orchestrator/) that is installed and running in an Azure virtual machine or the on-premises server of your choice. For information about how to get the software and access to the installation and configuration documentation, contact [Strata](https://www.strata.io/contact/)

- An on-premises application that you'll transition from a legacy identity system to Azure AD B2C.

## Scenario description

Strata's Maverics integration includes the following components:

- **Azure AD B2C**: The authorization server that's responsible for verifying the user's credentials. Authenticated users may access on-premises apps using a local account stored in the Azure AD B2C directory.

- **An external social or enterprise IdP**: Could be any OpenID Connect provider, Facebook, Google, or GitHub. See information on using [external IdPs](https://docs.microsoft.com/azure/active-directory-b2c/technical-overview#external-identity-providers) with Azure AD B2C.  

- **Strata's Maverics Identity Orchestrator**: The service that orchestrates user sign-on and transparently passes identity to apps through HTTP headers.

The following architecture diagram shows the implementation.

![Image show the architecture of an Azure AD B2C integration with Strata Maverics to enable access to hybrid apps](./media/partner-strata/strata-architecture-diagram.png)

| Steps | Description |
|:-------|:---------------|
| 1. | The user makes a request to access the on-premises hosted application. Maverics Identity Orchestrator proxies the request made by the user to the application.|
| 2. | The Orchestrator checks the user's authentication state. If it doesn't receive a session token, or the supplied session token is invalid, then it sends the user to Azure AD B2C for authentication.|
| 3. | Azure AD B2C sends the authentication request to the configured social IdP.|
| 4. | The IdP challenges the user for credentials. Depending on the IdP, the user may require to do Multi-factor authentication (MFA).|
| 5. | The IdP sends the authentication response back to Azure AD B2C. Optionally, the user may create a local account in the Azure AD B2C directory during this step.|
| 6. | Azure AD B2C sends the user request to the endpoint specified during the Orchestrator app's registration in the Azure AD B2C tenant.|
| 7. | The Orchestrator evaluates access policies and calculates attribute values to be included in HTTP headers forwarded to the app. During this step, the Orchestrator may call out to additional attribute providers to retrieve the information needed to set the header values correctly. The Orchestrator sets the header values and sends the request to the app.|
| 8. | The user is now authenticated and has access to the app.|

## Get Maverics Identity Orchestrator
To get the software you'll use to integrate your legacy on-premises app with Azure AD B2C, contact [Strata](https://www.strata.io/contact/). After you get the software, follow the steps below to determine Orchestrator-specific prerequisites and perform the required installation and configuration steps.

## Configure your Azure AD B2C tenant

1. **Register your application**

   a. [Register the Orchestrator as an application](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications?tabs=app-reg-ga) in Azure AD B2C tenant.
   >[!Note]
   >You'll need the tenant name and identifier, client ID, client secret, configured claims, and redirect URI later when you configure your Orchestrator instance.

   b. Grant Microsoft MS Graph API permissions to your applications. Your application will need the following permissions: `offline_access`, `openid`.

   c. Add a redirect URI for your application. This URI will match the `oauthRedirectURL` parameter of your Orchestrator's Azure AD B2C connector configuration, for example, `https://example.com/oidc-endpoint`.

2. **Create a user flow**: Create up a [sign and sign in user flow](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows).

3. **Add an IdP**: Choose to sign in your user with either a local account or a social or enterprise [IdP](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-add-identity-providers).

4. **Define user attributes**: Define the attributes to be collected during sign-up.

5. **Specify application claims**: Specify the attributes to be returned to the application via your Orchestrator instance. The Orchestrator consumes attributes from claims returned by Azure AD B2C and can retrieve additional attributes from other connected identity systems such as LDAP directories and databases. Those attributes are set in HTTP headers and sent to the upstream on-premises application.

## Configure Maverics Identity Orchestrator

In the following sections, we'll walk you through the steps required to configure your Orchestrator instance. For additional support and documentation, contact [Strata](https://www.strata.io/contact/).

### Maverics Identity Orchestrator server requirements

You can run your Orchestrator instance on any server, whether on-premises or in a public cloud infrastructure by provider such as Azure, AWS, or GCP.

- OS: REHL 7.7 or higher, CentOS 7+

- Disk: 10 GB (small)

- Memory: 16 GB

- Ports: 22 (SSH/SCP), 443, 80

- Root access for install/administrative tasks

- Maverics Identity Orchestrator runs as user `maverics` under `systemd`

- Network egress from the server hosting Maverics Identity Orchestrator with the ability to reach your Azure AD tenant.

### Install Maverics Identity Orchestrator

1. Obtain the latest Maverics RPM package. Place the package on the system on which you'd like to install Maverics. If you're copying the file to a remote host, [SCP](https://www.ssh.com/ssh/scp/) is a useful tool.

2. To install the Maverics package, run the following command replacing your filename in place of `maverics.rpm`.

   `sudo rpm -Uvf maverics.rpm`

   By default, Maverics is installed in the `/usr/local/bin` directory.

3. After installing Maverics, it will run as a service under `systemd`.  To verify Maverics service is running, run the following command:

   `sudo service maverics status`

  If the Orchestrator installation was successful, you should see a message similar to this:

```
Redirecting to /bin/systemctl status maverics.service
  maverics.service - Maverics
  Loaded: loaded (/etc/systemd/system/maverics.service; enabled; vendor preset: disabled)
  Active: active (running) since Thu 2020-08-13 16:48:01 UTC; 24h ago
  Main PID: 330772 (maverics)
  Tasks: 5 (limit: 11389)
  Memory: 14.0M
  CGroup: /system.slice/maverics.service
          └─330772 /usr/local/bin/maverics --config /etc/maverics/maverics.yaml
  ```

4. If the Maverics service fails to start, execute the following command to investigate the problem:

   `journalctl --unit=maverics.service --reverse`

   The most recent log entry will appear at the beginning of the output.

After installing Maverics, the default `maverics.yaml` file is created in the `/etc/maverics` directory.

Configure your Orchestrator to protect the application. Integrate with Azure AD B2C, store, and retrieve secrets from [Azure Key Vault](https://azure.microsoft.com/services/key-vault/?OCID=AID2100131_SEM_bf7bdd52c7b91367064882c1ce4d83a9:G:s&ef_id=bf7bdd52c7b91367064882c1ce4d83a9:G:s&msclkid=bf7bdd52c7b91367064882c1ce4d83a9). Define the location where the Orchestrator should read its configuration from.

### Supply configuration using environment variables

Provide config to your Orchestrator instances through environment variables.

`MAVERICS_CONFIG`

This environment variable tells the Orchestrator instance which YAML configuration files to use and where to find them during startup or restarts. Set the environment variable in `/etc/maverics/maverics.env`.

### Create the Orchestrator's TLS configuration

The `tls` field in your `maverics.yaml` declares the transport layer security configurations your Orchestrator instance will use. Connectors can use TLS objects and the Orchestrator server.

The `maverics` key is reserved for the Orchestrator server. All other keys are available and can be used to inject a TLS object into a given connector.

```yaml
tls:
  maverics:
    certFile: /etc/maverics/maverics.cert
    keyFile: /etc/maverics/maverics.key
```

### Configure the Azure AD B2C Connector

Orchestrators use Connectors to integrate with authentication and attribute providers. In this case, this Orchestrators App Gateway uses the Azure AD B2C connector as both an authentication and attribute provider. Azure AD B2C uses the social IdP for authentication and then acts as an attribute provider to the Orchestrator, passing attributes in claims set in HTTP headers.  

This Connector's configuration corresponds to the app registered in the Azure AD B2C tenant.

1. Copy the client ID, secret, and redirect URI from your app config in your tenant.

2. Give your Connector a name, shown here as `azureADB2C`, and set the connector `type` to be `azure`. Take note of the Connector name as this value is used in other configuration parameters below.

3. For this integration, the `authType` should be set to `oidc`.

4. Set the client ID you copied in step 1 as the value for the `oauthClientID` parameter.

5. Set the client secret you copied in step 1 as the value for the `oauthClientSecret` parameter.

6. Set the redirect URI you copied in step 1 as the value for the `oauthRedirectURL` parameter.

7. The Azure AD B2C OIDC Connector uses the well-known OIDC endpoint to discover metadata, including URLs and signing keys. Set the value of `oidcWellKnownURL` to your tenant's endpoint.

```yaml
connectors:
  name: azureADB2C
  type: azure
  oidcWellKnownURL: https://<tenant name>.b2clogin.com/<tenant name>.onmicrosoft.com/B2C_1_login/v2.0/.well-known/openid-configuration
  oauthRedirectURL: https://example.com/oidc-endpoint
  oauthClientID: <azureADB2CClientID>
  oauthClientSecret: <azureADB2CClientSecret>
  authType: oidc
```

### Define Azure AD B2C as your authentication provider

An authentication provider determines how to do authentication for a user who has not presented a valid session as part of the app resource request. Configuration in your Azure AD B2C tenant determines how to challenge a user for credentials and apply additional authentication policies. For example, to require a second factor to complete the authentication process and decide which claims should be returned to the Orchestrator App Gateway after authentication succeeds.

The value for the `authProvider` must match your Connector's `name` value.

```yaml
authProvider: azureADB2C
```

### Protect your on-premises app with an Orchestrator App Gateway

The Orchestrator's App Gateway configuration declares how Azure AD B2C should protect your application and how users should access the app.

1. Create a name for your App gateway. You can use a friendly name or fully qualified hostname as an identifier for your app.

2. Set the `location`. The example here uses the app's root `/`, however, can be any URL path of your application.

3. Define the protected application in `upstream` using the host:port convention: `https://example.com:8080`.

4. Set the values for error and unauthorized pages.

5. Define the HTTP header names and attribute values that must be provided to the application to establish authentication and control access to the app. Header names are arbitrary and typically correspond to the configuration of the app. Attribute values are namespaced by the Connector that supplies them. In the example below, the values returned from Azure AD B2C are prefixed with the Connector name `azureADB2C` where the suffix is the name of the attribute that contains the required value, for example `given_name`.

6. Set the policies to be evaluated and enforced. Three actions are defined: `allowUnauthenticated`, `allowAnyAuthenticated`, and `allowIfAny`. Each action is associated to a `resource` and the policy is evaluated for that `resource`.

>[!NOTE]
>Both `headers` and `policies` use JavaScript or GoLang service extensions to implement arbitrary logic that significantly enhances the default capabilities.

```yaml
appgateways:
  - name: Sonar
    location: /
    upstream: https://example.com:8080
    errorPage: https://example.com:8080/sonar/error
    unauthorizedPage: https://example.com:8080/sonar/accessdenied

    headers:
      SM_USER: azureADB2C.sub
      firstname: azureADB2C.given_name
      lastname: azureADB2C.family_name

    policies:
      - resource: ~ \.(jpg|png|ico|svg)
        allowUnauthenticated: true
      - resource: /
        allowAnyAuthenticated: true
      - resource: /sonar/daily_deals
        allowIfAny:
          azureADB2C.customAttribute: Rewards Member
```

### Use Azure Key Vault as your secrets provider

It's important to secure the secrets your Orchestrator uses to connect to Azure AD B2C and any other identity system. Maverics will default to loading secrets in plain text out of `maverics.yaml`, however, in this tutorial, you'll use Azure Key Vault as the secrets provider.

Follow the instructions to [create a new Key Vault](https://docs.microsoft.com/azure/key-vault/secrets/quick-create-portal#create-a-vault) that your Orchestrator instance will use as a secrets provider. Add your secrets to your vault and take note of the `SECRET NAME` given to each secret. For example, `AzureADB2CClientSecret`.

To declare a value as a secret in a `maverics.yaml` config file, wrap the secret with angle brackets:

```yaml
connectors:
  - name: AzureADB2C
    type: azure
    oauthClientID: <AzureADB2CClientID>
    oauthClientSecret: <AzureADB2CClientSecret>
```

The value specified within the angle brackets must correspond to the `SECRET NAME` given to secret in your Azure Key Vault.

To load secrets from Azure Key Vault, set the environment variable `MAVERICS_SECRET_PROVIDER` in the file `/etc/maverics/maverics.env`, with the credentials found in the azure-credentials.json file, using the following pattern:

`MAVERICS_SECRET_PROVIDER='azurekeyvault://<KEYVAULT NAME>.vault.azure.net?clientID=<APPID>&clientSecret=<PASSWORD>&tenantID=<TENANT>'`

### Put everything together

Here is how the Orchestrator's configuration will appear when you complete the configurations outlined above.

```yaml
version: 0.4.2
listenAddress: ":443"
tls:
  maverics:
    certFile: certs/maverics.crt
    keyFile: certs/maverics.key

authProvider: azureADB2C

connectors:
  - name: azureADB2C
    type: azure
    oidcWellKnownURL: https://<tenant name>.b2clogin.com/<tenant name>.onmicrosoft.com/B2C_1_login/v2.0/.well-known/openid-configuration
    oauthRedirectURL: https://example.com/oidc-endpoint
    oauthClientID: <azureADB2CClientID>
    oauthClientSecret: <azureADB2CClientSecret>
    authType: oidc

appgateways:
  - name: Sonar
    location: /
    upstream: http://example.com:8080
    errorPage: http://example.com:8080/sonar/accessdenied
    unauthorizedPage: http://example.com:8080/sonar/accessdenied

    headers:
      SM_USER: azureADB2C.sub
      firstname: azureADB2C.given_name
      lastname: azureADB2C.family_name

    policies:
      - resource: ~ \.(jpg|png|ico|svg)
        allowUnauthenticated: true
      - resource: /
        allowAnyAuthenticated: true
      - resource: /sonar/daily_deals
        allowIfAny:
          azureADB2C.customAttribute: Rewards Member
```

## Test the flow

1. Navigate to the on-premises application url, `https://example.com/sonar/dashboard`.

2. The Orchestrator should redirect to the page you configured in your user flow.

3. Select the IdP from the list on the page.

4. Once you're redirected to the IdP, supply your credentials as requested, including an MFA token if required by that IdP.

5. After successfully authenticating, you should be redirected to Azure AD B2C, which forwards the app request to the Orchestrator redirect URI.

6. The Orchestrator evaluates policies, calculates headers, and sends the user to the upstream application.  

7. You should see the requested application.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
