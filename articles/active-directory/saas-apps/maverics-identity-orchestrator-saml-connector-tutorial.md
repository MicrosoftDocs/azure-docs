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
ms.date: 03/17/2021
ms.author: jeedes
---
# Integrate Azure AD single sign-on with Maverics Identity Orchestrator SAML Connector

Strata's Maverics Identity Orchestrator provides a simple way to integrate on-premises applications with Azure Active Directory (Azure AD) for authentication and access control. The Maverics Orchestrator is capable of modernizing authentication and authorization for apps that currently rely on headers, cookies, and other proprietary authentication methods. Maverics Orchestrator instances can be deployed on-premises or in the cloud. 

This hybrid access tutorial demonstrates how to migrate an on-premises web application that's currently protected by a legacy web access management product to use Azure AD for authentication and access control. Here are the basic steps:

1. Set up the Maverics Orchestrator
1. Proxy an application
1. Register an enterprise application in Azure AD
1. Authenticate via Azure and authorize access to the application
1. Add headers for seamless application access
1. Work with multiple applications

## Prerequisites

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Maverics Identity Orchestrator SAML Connector SSO-enabled subscription. To get the Maverics software, contact [Strata sales](mailto:sales@strata.io).
* At least one application that uses header-based authentication. The examples work against an application called Connectulum, hosted at `https://app.connectulum.com`.
* A Linux machine to host the Maverics Orchestrator
  * OS: RHEL 7.7 or higher, CentOS 7+
  * Disk: >= 10 GB
  * Memory: >= 4 GB
  * Ports: 22 (SSH/SCP), 443, 7474
  * Root access for install/administrative tasks
  * Network egress from the server hosting the Maverics Identity Orchestrator to your protected application

## Step 1: Set up the Maverics Orchestrator

### Install Maverics

1. Get the latest Maverics RPM. Copy the package to the system on which you want to install the Maverics software.

1. Install the Maverics package, substituting your file name in place of `maverics.rpm`.

   `sudo rpm -Uvf maverics.rpm`

   After you install Maverics, it will run as a service under `systemd`. To verify that the service is running, execute the following command:

   `sudo systemctl status maverics`

1. To restart the Orchestrator and follow the logs, you can run the following command:

   `sudo service maverics restart; sudo journalctl --identifier=maverics -f`

After you install Maverics, the default `maverics.yaml` file is created in the `/etc/maverics` directory. Before you edit your configuration to include `appgateways` and `connectors`, your configuration file will look like this z:

```yaml
# © Strata Identity Inc. 2020. All Rights Reserved. Patents Pending.

version: 0.1
listenAddress: ":7474"
```

### Configure DNS

DNS will be helpful so that you don't have to remember the Orchestrator server's IP.

Edit the browser machine's (your laptop's) hosts file, using a hypothetical Orchestrator IP of 12.34.56.78. On Linux-based operating systems, this file is located in `/etc/hosts`. On Windows, it's located at `C:\windows\system32\drivers\etc`.

```
12.34.56.78 sonar.maverics.com
12.34.56.78 connectulum.maverics.com
```

To confirm that DNS is configured as expected, you can make a request to the Orchestrator's status endpoint. From your browser, request http://sonar.maverics.com:7474/status.

### Configure TLS

Communicating over secure channels to talk to your Orchestrator is critical to maintain security. You can add a certificate/key pair in your `tls` section to achieve this.

To generate a self-signed certificate and key for the Orchestrator server, run the following command from within the `/etc/maverics` directory:

`openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out maverics.crt -keyout maverics.key`

> [!NOTE]
> For production environments, you'll likely want to use a certificate signed by a known CA to avoid warnings in the browser. [Let's Encrypt](https://letsencrypt.org/) is a good and free option if you're looking for a trusted CA.

Now, use the newly generated certificate and key for the Orchestrator. Your config file should now contain this code:

```yaml
version: 0.1
listenAddress: ":443"

tls:
  maverics:
    certFile: /etc/maverics/maverics.crt
    keyFile: /etc/maverics/maverics.key
```

To confirm that TLS is configured as expected, restart the Maverics service, and make a request to the status endpoint.

## Step 2: Proxy an application

Next, configure basic proxying in the Orchestrator by using `appgateways`. This step helps you validate that the Orchestrator has the necessary connectivity to the protected application.

Your config file should now contain this code:

```yaml
version: 0.1
listenAddress: ":443"

tls:
  maverics:
    certFile: /etc/maverics/maverics.crt
    keyFile: /etc/maverics/maverics.key

appgateways:
  - name: sonar
    location: /
    # Replace https://app.sonarsystems.com with the address of your protected application
    upstream: https://app.sonarsystems.com
```

To confirm that proxying is working as expected, restart the Maverics service, and make a request to the application through the Maverics proxy. You can optionally make a request to specific application resources.

## Step 3: Register an enterprise application in Azure AD

Now, create a new enterprise application in Azure AD that will be used for authenticating end users.

> [!NOTE]
> When you use Azure AD features like Conditional Access, it's important to create an enterprise application per on-premises application. This permits per-app Conditional Access, per-app risk evaluation, per-app assigned permissions, and so on. Generally, an enterprise application in Azure AD maps to an Azure connector in Maverics.

To register an enterprise application in Azure AD:

1. In your Azure AD tenant, go to **Enterprise applications**, and then select **New Application**. In the Azure AD gallery, search for **Maverics Identity Orchestrator SAML Connector**, and then select it.

1. On the Maverics Identity Orchestrator SAML Connector **Properties** pane, set **User assignment required?** to **No** to enable the application to work for all users in your directory.

1. On the Maverics Identity Orchestrator SAML Connector **Overview** pane, select **Set up single sign-on**, and then select **SAML**.

1. On the Maverics Identity Orchestrator SAML Connector **SAML-based sign on** pane, edit the **Basic SAML Configuration** by selecting the **Edit** (pencil icon) button.

   ![Screenshot of the "Basic SAML Configuration" Edit button.](common/edit-urls.png)

1. Enter an **Entity ID** of `https://sonar.maverics.com`. The entity ID must be unique across the apps in the tenant, and it can be an arbitrary value. You'll use this value when you define the `samlEntityID` field for your Azure connector in the next section.

1. Enter a **Reply URL** of `https://sonar.maverics.com/acs`. You'll use this value when you define the `samlConsumerServiceURL` field for your Azure connector in the next section.

1. Enter a **Sign on URL** of `https://sonar.maverics.com/`. This field won't be used by Maverics, but it is required in Azure AD to enable users to get access to the application through the Azure AD My Apps portal.

1. Select **Save**.

1. In the **SAML Signing Certificate** section, select the **Copy** button to copy the **App Federation Metadata URL** value, and then save it to your computer.

   ![Screenshot of the "SAML Signing Certificate" Copy button.](common/copy-metadataurl.png)

## Step 4: Authenticate via Azure and authorize access to the application

Next, put the enterprise application you just created to use by configuring the Azure connector in Maverics. This `connectors` configuration paired with the `idps` block allows the Orchestrator to authenticate users.

Your config file should now contain the following code. Be sure to replace `METADATA_URL` with the App Federation Metadata URL value from the preceding step.

```yaml
version: 0.1
listenAddress: ":443"

tls:
  maverics:
    certFile: /etc/maverics/maverics.crt
    keyFile: /etc/maverics/maverics.key

idps:
  - name: azureSonarApp

appgateways:
  - name: sonar
    location: /
    # Replace https://app.sonarsystems.com with the address of your protected application
    upstream: https://app.sonarsystems.com

    policies:
      - resource: /
        allowIf:
          - equal: ["{{azureSonarApp.authenticated}}", "true"]

connectors:
  - name: azureSonarApp
    type: azure
    authType: saml
    # Replace METADATA_URL with the App Federation Metadata URL
    samlMetadataURL: METADATA_URL
    samlConsumerServiceURL: https://sonar.maverics.com/acs
    samlEntityID: https://sonar.maverics.com
```

To confirm that authentication is working as expected, restart the Maverics service, and make a request to an application resource through the Maverics proxy. You should be redirected to Azure for authentication before accessing the resource.

## Step 5: Add headers for seamless application access

You aren't sending headers to the upstream application yet. Let's add `headers` to the request as it passes through the Maverics proxy to enable the upstream application to identify the user.

Your config file should now contain this code:

```yaml
version: 0.1
listenAddress: ":443"

tls:
  maverics:
    certFile: /etc/maverics/maverics.crt
    keyFile: /etc/maverics/maverics.key

idps:
  - name: azureSonarApp

appgateways:
  - name: sonar
    location: /
    # Replace https://app.sonarsystems.com with the address of your protected application
    upstream: https://app.sonarsystems.com

    policies:
      - resource: /
        allowIf:
          - equal: ["{{azureSonarApp.authenticated}}", "true"]

    headers:
      email: azureSonarApp.name
      firstname: azureSonarApp.givenname
      lastname: azureSonarApp.surname

connectors:
  - name: azureSonarApp
    type: azure
    authType: saml
    # Replace METADATA_URL with the App Federation Metadata URL
    samlMetadataURL: METADATA_URL
    samlConsumerServiceURL: https://sonar.maverics.com/acs
    samlEntityID: https://sonar.maverics.com
```

To confirm that authentication is working as expected, make a request to an application resource through the Maverics proxy. The protected application should now be receiving headers on the request. 

Feel free to edit the header keys if your application expects different headers. All claims that come back from Azure AD as part of the SAML flow are available to use in headers. For example, you can include another header of `secondary_email: azureSonarApp.email`, where `azureSonarApp` is the connector name and `email` is a claim returned from Azure AD. 

## Step 6: Work with multiple applications

Let's now take a look at what's required to proxy to multiple applications that are on different hosts. To achieve this step, configure another App Gateway, another enterprise application in Azure AD, and another connector.

Your config file should now contain this code:

```yaml
version: 0.1
listenAddress: ":443"

tls:
  maverics:
    certFile: /etc/maverics/maverics.crt
    keyFile: /etc/maverics/maverics.key

idps:
  - name: azureSonarApp
  - name: azureConnectulumApp

appgateways:
  - name: sonar
    host: sonar.maverics.com
    location: /
    # Replace https://app.sonarsystems.com with the address of your protected application
    upstream: https://app.sonarsystems.com

    policies:
      - resource: /
        allowIf:
          - equal: ["{{azureSonarApp.authenticated}}", "true"]

    headers:
      email: azureSonarApp.name
      firstname: azureSonarApp.givenname
      lastname: azureSonarApp.surname

  - name: connectulum
    host: connectulum.maverics.com
    location: /
    # Replace https://app.connectulum.com with the address of your protected application
    upstream: https://app.connectulum.com

    policies:
      - resource: /
        allowIf:
          - equal: ["{{azureConnectulumApp.authenticated}}", "true"]

    headers:
      email: azureConnectulumApp.name
      firstname: azureConnectulumApp.givenname
      lastname: azureConnectulumApp.surname

connectors:
  - name: azureSonarApp
    type: azure
    authType: saml
    # Replace METADATA_URL with the App Federation Metadata URL
    samlMetadataURL: METADATA_URL
    samlConsumerServiceURL: https://sonar.maverics.com/acs
    samlEntityID: https://sonar.maverics.com

  - name: azureConnectulumApp
    type: azure
    authType: saml
    # Replace METADATA_URL with the App Federation Metadata URL
    samlMetadataURL: METADATA_URL
    samlConsumerServiceURL: https://connectulum.maverics.com/acs
    samlEntityID: https://connectulum.maverics.com
```

You might have noticed that the code adds a `host` field to your App Gateway definitions. The `host` field enables the Maverics Orchestrator to distinguish which upstream host to proxy traffic to.

To confirm that the newly added App Gateway is working as expected, make a request to `https://connectulum.maverics.com`.

## Advanced scenarios

### Identity migration

Can't stand your end-of-life'd web access management tool, but you don't have a way to migrate your users without mass password resets? The Maverics Orchestrator supports identity migration by using `migrationgateways`.

### Web server gateways

Don't want to rework your network and proxy traffic through the Maverics Orchestrator? Not a problem. The Maverics Orchestrator can be paired with web server gateways (modules) to offer the same solutions without proxying.

## Wrap-up

At this point, you've installed the Maverics Orchestrator, created and configured an enterprise application in Azure AD, and configured the Orchestrator to proxy to a protected application while requiring authentication and enforcing policy. To learn more about how the Maverics Orchestrator can be used for distributed identity management use cases, [contact Strata](mailto:sales@strata.io).

## Next steps

- [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
- [What is conditional access in Azure Active Directory?](../conditional-access/overview.md)
