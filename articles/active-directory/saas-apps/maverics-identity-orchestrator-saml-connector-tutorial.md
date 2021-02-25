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
# Integrate Azure AD single sign-on with Maverics Identity Orchestrator SAML Connector

Strata's Maverics Identity Orchestrator provides a simple way to integrate on-premises applications with Azure Active Directory (Azure AD) for authentication and access control. The Maverics Orchestrator is capable of modernizing authentication and authorization for apps that currently rely on headers, cookies, and other proprietary authentication methods. Maverics Orchestrator instances can be deployed on-premises or in the cloud. 

This hybrid access tutorial demonstrates how to migrate an on-premises web application that's currently protected by a legacy web access management product to use Azure AD for authentication and access control. Here are the basic steps:
1. Setting up the Maverics Orchestrator
2. Proxying an application
3. Registering an enterprise application in Azure AD
4. Authenticating via Azure and authorizing access to the application
5. Adding headers for seamless application access

## Prerequisites

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Maverics Identity Orchestrator SAML Connector SSO-enabled subscription. To obtain the Maverics software, contact [Strata sales](mailto:sales@strata.io).
* An application that uses header based authentication. In our examples, we will be working against an application called Sonar hosted at https://app.sonarsystems.com.
* A linux machine to host the Maverics Orchestrator
   * OS: RHEL 7.7 or higher, CentOS 7+
   * Disk: >=10GB
   * Memory: >=4GB
   * Ports: 22 (SSH/SCP), 443, 7474
   * Root access for install/administrative tasks
   * Network egress from the server hosting the Maverics Identity Orchestrator to your protected application.

## Step 1: Setting up the Maverics Orchestrator

### Installing Maverics
Obtain the latest Maverics RPM. Copy the package to the system on which you want to install the Maverics software.

Install the Maverics package, substituting your file name in place of `maverics.rpm`.

`sudo rpm -Uvf maverics.rpm`

After you install Maverics, it will run as a service under `systemd`. To verify that the service is running, execute the following command:

`sudo systemctl status maverics`

To restart the Orchestrator and follow the logs, you can run the following command:

`sudo service maverics restart; sudo journalctl --identifier=maverics -f`

After you install Maverics, the default `maverics.yaml` file is created in the `/etc/maverics` directory. Before you edit your configuration to include `appgateways` and `connectors`, your configuration file will look like this:

```yaml
# © Strata Identity Inc. 2020. All Rights Reserved. Patents Pending.

version: 0.1
listenAddress: ":7474"
```

### Configuring DNS
DNS will be helpful so that we don't have to remember the Orchestrator server's IP.

Edit the browser machine's (i.e., your laptop's) hosts file, using a hypothetical Orchestrator IP of 12.34.56.78. On linux-based operating systems this file is located in at `/etc/hosts`, and on Windows it is located at `C:\windows\system32\drivers\etc`.

```
12.34.56.78 tutorial.maverics.com
```

To confirm DNS is configured as expected, we can make a request to the Orchestrator's status endpoint. From your browser, request http://tutorial.maverics.com:7474/status.

### Configuring TLS
Communicating over secure channels to talk to our Orchestrator is critical in order to maintain security. We can add a certificate/key pair in our `tls` section to achieve this.

To generate a self-signed certificate and key for the Orchestrator server, run the following command from within the `/etc/maverics` directory:

`openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out maverics.crt -keyout maverics.key`

>Note: for production environments you'll likely want to use a certificate signed by a known CA to avoid warnings in the browser. [Let's Encrypt](https://letsencrypt.org/) is a good and free option if you are looking for a trusted CA.

We will now use the newly generated cert and key for the Orchestrator. Your config file should now contain the below:

```yaml
version: 0.1
listenAddress: ":443"

tls:
  maverics:
    certFile: /etc/maverics/maverics.crt
    keyFile: /etc/maverics/maverics.key
```

To confirm TLS is configured as expected, restart the Maverics service, and make a request to the status endpoint. From your browser, request https://tutorial.maverics.com/status.

## Step 2: Proxying an application
Next we wil configure basic proxying in the Orchestrator using `appgateways`. This step will help us validate that the Orchestrator has the necessary connectivity to the protected application.

Your config file should now contain the below:

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

To confirm proxying is working as expected, restart the Maverics service, and make a request to the application through the Maverics proxy. From your browser, request https://tutorial.maverics.com. You can optionally make a request to specific application resources, e.g. https://tutorial.maverics.com/RESOURCE, where `RESOURCE` is a valid application resource of the protected upstream app.

## Step 3: Registering an enterprise application in Azure AD

We will now create a new enterprise application in Azure AD that will be used for authenticating end-users.

>Note: when leveraging Azure AD features such as Conditional Access it is important to create an enterprise application per on-premises application. This permits per-app conditional access, per-app risk evaluation, per-app assigned permissions, etc. Generally, an enterprise app in Azure AD maps to an Azure connector in Maverics. 

1. In your Azure AD tenant, go to **Enterprise applications**, click **New Application** and search for **Maverics Identity Orchestrator SAML Connector** in the Azure AD gallery, and then select it.

1. On the Maverics Identity Orchestrator SAML Connector **Properties** pane, set **User assignment required?** to **No** to enable the application to work for all users in your directory.

1. On the Maverics Identity Orchestrator SAML Connector **Overview** pane, select **Set up single sign-on**, and then select **SAML**.

1. On the Maverics Identity Orchestrator SAML Connector **SAML-based sign on** pane, edit the **Basic SAML Configuration** by selecting the **Edit** (pencil icon) button.

   ![Screenshot of the "Basic SAML Configuration" Edit button.](common/edit-urls.png)

1. Enter an **Entity ID** of: `https://tutorial.maverics.com`. The Entity ID must be unique across the apps in the tenant, and can be an arbitrary value. We will use this value when defining the `samlEntityID` field for our Azure connector in the next section.

1. Enter a **Reply URL** of: `https://tutorial.maverics.com/acs`. We will use this value when defining the `samlConsumerServiceURL` field for our Azure connector in the next section.

1. Enter a **Sign on URL** of: `https://tutorial.maverics.com/`. This field won't be used by Maverics, but it is required in Azure AD to enable users to get access to the application through the Azure AD My Apps portal.

1. Select **Save**.

1. In the **SAML Signing Certificate** section, select the **Copy** button to copy the **App Federation Metadata URL**, and then save it to your computer.

   ![Screenshot of the "SAML Signing Certificate" Copy button.](common/copy-metadataurl.png)

## Step 4: Authenticating via Azure and authorizing access to the application

Next, we will put the enterprise application we just created to use by configuring the Azure connector in Maverics. This `connectors` configuration paired with the `idps` block will allow the Orchestrator to authenticate users.

Your config file should now contain the below, be sure to replace `METADATA_URL` with the App Federation Metadata URL from the previous step:

```yaml
version: 0.1
listenAddress: ":443"

tls:
  maverics:
    certFile: /etc/maverics/maverics.crt
    keyFile: /etc/maverics/maverics.key

idps:
  - name: azure

appgateways:
  - name: sonar
    location: /
    # Replace https://app.sonarsystems.com with the address of your protected application
    upstream: https://app.sonarsystems.com

    policies:
      - resource: /
        allowIf:
          - equal: ["{{azure.authenticated}}", "true"]
    
connectors:
  - name: azure
    type: azure
    authType: saml
    # Replace METADATA_URL with the App Federation Metadata URL
    samlMetadataURL: METADATA_URL
    samlConsumerServiceURL: https://tutorial.maverics.com/acs
    samlEntityID: https://tutorial.maverics.com
```

To confirm authentication is working as expected, restart the Maverics service, and make a request to an application resource through the Maverics proxy. You should be redirected to Azure for authentication before accessing the resource.

## Step 5: Adding headers for seamless application access

We are not yet sending headers to the upstream application. Let's add `headers` to the request as it passes through the Maverics proxy in order to enable the upstream application to identify the user.

Your config file should now contain the below:

```yaml
version: 0.1
listenAddress: ":443"

tls:
  maverics:
    certFile: /etc/maverics/maverics.crt
    keyFile: /etc/maverics/maverics.key

idps:
  - name: azure

appgateways:
  - name: sonar
    location: /
    # Replace https://app.sonarsystems.com with the address of your protected application
    upstream: https://app.sonarsystems.com

    policies:
      - resource: /
        allowIf:
          - equal: ["{{azure.authenticated}}", "true"]

    headers:
      email: azure.name
      firstname: azure.givenname
      lastname: azure.surname
    
connectors:
  - name: azure
    type: azure
    authType: saml
    # Replace METADATA_URL with the App Federation Metadata URL
    samlMetadataURL: METADATA_URL
    samlConsumerServiceURL: https://tutorial.maverics.com/acs
    samlEntityID: https://tutorial.maverics.com
```

To confirm authentication is working as expected, make a request to an application resource through the Maverics proxy. The protected application should now be receiving headers on the request. 

Feel free to edit the header keys if your application expects different headers. All claims that come back from Azure AD as part of the SAML flow are available to use in headers. Fore example, we could include an additional header of `secondary_email: azure.mail`, where `azure` is the connector name and `email` is a claim returned from Azure AD. 

## Advanced Scenarios

### Identity Migration
Can't stand your end-of-life'd web access management tool, but don't have a way to migrate your users without mass password resets? The Maverics Orchestrator supports identity migration through the use of `migrationgateways`.

### Web Server Gateways
Don't want to rework your network and proxy traffic through the Maverics Orchestrator? Not a problem, the Maverics Orchestrator can be paired with web server gateways (modules) to offer the same solutions without proxying.

## Wrapping Up

At this point, we have installed the Maverics Orchestrator, created and configured an enterprise application in Azure AD, and configured the Orchestrator to proxy to a protected application while requiring authentication and enforcing policy. To learn more about how the Maverics Orchestrator can be used for distributed identity management use cases please [contact Strata]((mailto:sales@strata.io)).
