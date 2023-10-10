---
title: Configure Okta as an identity provider
description: How to configure Okta as an identity provider in Microsoft Entra Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 10/10/2023
ms.author: jfields
---

# Configure Okta as an identity provider

This article describes how to integrate Okta as an identity provider (IdP) for an Amazon Web Services (AWS) account in Permissions Management. 

Permissions Required:


| **UI**                  | **Permissions Management**                                         |**Why?**                   |
|-----------------------|-----------------------------------------------------|---------------------------------|
| Permissions Management   | Permissions Management Administrator     | Admin can create and edit the AWS authorization system onboarding configuration.   | 
| Okta                 | API Access Management Administrator     | Admin can add the application in the Okta portal and add or edit the API scope.    |
| AWS   | AWS permissions explicitly     |  Admin should be able to run the cloudformation stack to create  1. AWS Secret in Secrets Manager; 2. Managed policy to allow the role to read the AWS secret. | 

> [!NOTE]
> While configuring the Amazon Web Services (AWS) app in Okta, the suggested AWS role group syntax is (```aws#{account alias]#{role name}#{account #]```).
 Sample RegEx pattern for the group filter name are:
 - ```^aws\#\S+\#?{{role}}[\w\-]+)\#(?{{accountid}}\d+)$```
 - ```aws_(?{{accountid}}\d+)_(?{{role}}[a-zA-Z0-9+=,.@\-_]+)```

Permissions Management reads default suggested filters. Custom RegEx expression for group syntax is not supported.

## How to configure Okta

1. Login to the Okta portal with API Access Management Administrator. 
2. Create a new **Okta API Services Application**. 
3. In the Admin Console, go to Applications. 
4. On the Create a new app integration page, select **API Services**.
5. Enter a name for your app integration and click **Save**. 
6. Copy the **Client ID** for future use.  
7. In the **Client Credentials** section of the General tab, click **Edit** to change the client authentication method. 
8. Select **Public key/Private key** as the Client authentication method. 
9. Leave the default **Save keys in Okta**, then click **Add key**. 
10. Click **Add** and in the **Add a public key** dialog, either paste your own public key or click **Generate new key** to auto-generate a new 2048-bit RSA key. 
11. Copy **Public Key Id** for future use.  
12. Click **Generate new key** and the public and private keys appear in JWK format. 
13. Click **PEM**. The private key appears in PEM format. 
    This is your only opportunity to save the private key. Click **Copy to clipboard** to copy the private key and store it somewhere safe. 
14. Click **Done**. The new public key is now registered with the app and appears in a table in the **PUBLIC KEYS** section of the **General** tab. 
15. From the Okta API scopes tab, grant these scopes:
    a. okta.users.read
    b. okta.groups.read
    c. okta.apps.read
16. Optional. Click the **Application rate limits** tab to adjust the rate-limit capacity percentage for this service application. By default, each new application sets this percentage at 50 percent. 

### Convert public key to a Base64 string

1. See instructions for [using a personal access token (PAT)](https://go.microsoft.com/fwlink/?linkid=2249174).

### Find your Okta URL (also called an Okta domain)

1. Sign in to your Okta organization with you administrator account.
2. Look for the Okta URL/Okta domain in the global header of the dashboard. 
Once located, note the Okta URL in an app such as Notepad. You will need this URL for your next steps. 

### Configure AWS

1. Fill in the following fields on the **CloudFormation Template Specify stack details** screen using the information from your Okta application:
    - **Stack name** - A name of our choosing
    - **Or URL** Your organization's Okta URL, example: *https://companyname.okta.com*
    - **Client Id** - From the **Client Credentials** section of your Okta application
    - **Public Key Id** - Click **Add > Generate new key**. The public key is generated 
    - **Private Key (in PEM format)** - Base64 encoded string of the PEM format of the **Private key**
     > [!NOTE]
     > You must copy all text in the field before converting to a Base64 string, including the dash before BEGIN PRIVATE KEY and after END PRIVATE KEY.
2. When the **CloudFormation Template Specify stack details** screen is complete, click **Next**.
3. On the **Configure stack options** screen, click **Next**.
4. Review the information you've entered, then click **Submit**.
5. Select the **Resources** tab, then copy the **Physical ID** (this ID is the Secret ARN) for future use.

### Configure Okta in the Permissions Management UI

> [!NOTE]
> Integrating Okta as an identity provider is an optional step. You can return to these steps to configure an IdP at any time. 

1. If the **Data Collectors** dashboard isn't displayed when Permissions Management launches, select **Settings** (gear icon), and then select the **Data Collectors** subtab.
2. On the **Data Collectors** dashboard, select **AWS**, and then select **Create Configuration**.
    Complete the **Manage Authorization System** steps.
    > [!NOTE]
    > If a Data Collector already exists in your AWS account and you want to add Okta integration, follow these steps:
    a. Select the Data Collector for which you want to add Okta integration.
    b. Click on the ellipsis next to the **Authorization System Status**.
    c. Select **Integrate Identity Provider**.
3. On the **Integrate Identity Provider (IdP)** page, select the box for **Okta**.
4. Select **Launch CloudFormation Template**. The template opens in a new window.
   > [!NOTE]
   > Here you'll fill in information to create a secret Amazon Resource Name (ARN) that you'll enter on the **Integrate Identity Provider (IdP)** page. Microsoft does not read or store this ARN.
5. Return to the Permissions Management **Integrate Identity Provider (IdP)** page and paste the **Secret ARN** in the field provided.
6. Click **Next** to review and confirm the information you've entered.
7. Click **Verify Now & Save**.
   The system returns the populated AWS CloudFormation Template. 

## Next steps

- For information on how to view existing roles/policies, requests, and permissions, see [View roles/policies, requests, and permission in the Remediation dashboard](ui-remediation.md).
