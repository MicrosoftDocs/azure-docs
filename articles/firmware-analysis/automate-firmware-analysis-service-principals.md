---
title: Use service principals to automate workflows in Firmware analysis
description: Learn about how to use service principals to automate workflows for Firmware Analysis.
author: karengu0
ms.author: karenguo
ms.topic: conceptual
ms.date: 11/04/2024
---

# How to Use Service Principals to Automate Workflows in Firmware analysis

Many users of the firmware analysis service may need to automate their workflow. The command `az login` creates an interactive login experience with two-factor authentication that makes it difficult for users to fully automate their workflow. A service principal [Apps & service principals in Microsoft Entra ID] is a secure identity with proper permissions that authenticates to Azure in the command line without requiring two-factor authentication or an interactive log-in. This article explains how to create a service principal and use it to interact with the firmware analysis service. For more information on creating service principals, visit Create Azure service principals using the Azure CLI . To authenticate securely, we recommend creating a service principal and authenticating using certificates. To learn more, visit Create a service principal containing a certificate using Azure CLI.

1. Log in to your Azure account using the portal.

2. Navigate to your subscription and assign yourself `User Access Administrator` or `Role Based Access Control Administrator` permissions, or higher, in your subscription. This gives you permission to create a service principal.

3.	Navigate to your command line
    1. Log in, specifying the tenant ID during login
    2. az login --tenant <TENANT_ID>
    3. Switch to your subscription where you have proper permissions to create a service principal
    4. az account set --subscription <SUBSCRIPTION_ID>
    5. Create service principal, assigning it the proper permissions at the proper scope. We recommend assigning your service principal the Firmware Analysis Admin role at the Subscription level.
        1. az ad sp create-for-rbac --name <SERVICE_PRINCIPAL_NAME> --role "Firmware Analysis Admin" --scopes /subscriptions/<SUBSCRIPTION_ID>

4.	Note down your service principal’s client ID (“appId”), tenant ID (“tenant”), and secret (“password”) in a safe place. You’ll need this for the next step.

5.	Log in to SP

    1. az login --service-principal --username $clientID --password $secret --tenant $tenantID

6.	Navigate to the script and run the script [link to quickstarts]


