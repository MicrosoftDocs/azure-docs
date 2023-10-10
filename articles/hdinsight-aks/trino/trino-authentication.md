---
title: Client authentication
description: How to authenticate to Trino cluster
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Authentication mechanism

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Azure HDInsight on AKS Trino provides tools such as CLI client, JDBC driver etc., to access the cluster, which is integrated with Azure Active Directory to simplify the authentication for users.
Supported tools or clients need to authenticate using Azure Active Directory OAuth2 standards that are, a JWT access token issued by Azure Active Directory must be provided to the cluster endpoint.

This section describes common authentication flows supported by the tools.

## Authentication flows overview
The following authentication flows are supported. 

> [!NOTE]
> Name is reserved and should be used to specify certain flow.


|Name|Required parameters|Optional parameters|Description
|----|----|----|----|
AzureDefault|None|Tenant ID, client ID|Meant to be used during development in interactive environment. In most cases, user sign-in using browser. See [details](#azuredefault-flow).|
AzureInteractive|None|Tenant ID, client ID|User authenticates using browser. See [details](#azureinteractive-flow).|
AzureDeviceCode|None|Tenant ID, client ID|Meant for environments where browser isn't available. Device code provided to the user requires an action to sign-in on another device using the code and browser.|
AzureClientSecret|Tenant ID, client ID, client secret|None|Service principal identity is used, credentials required, non-interactive.|
AzureClientCertificate|Tenant ID, client ID, certificate file path|Secret/password. If provided, used to decrypt PFX certificate. Otherwise expects PEM format.|Service principal identity is used, certificate required, non-interactive. See [details](#azureclientcertificate-flow).|
AzureManagedIdentity|Tenant ID, client ID|None|Uses managed identity of the environment, for example, on Azure VMs or AKS pods.|

## AzureDefault flow

This flow is default mode for the Trino CLI and JDBC if `auth` parameter isn't specified. In this mode, client tool attempts to obtain the token using several methods until token is acquired. 
In the following chained execution, if token isn't found or authentication fails, process will continue with next method:

[DefaultAzureCredential](/java/api/overview/azure/identity-readme#defaultazurecredential) -> [AzureInteractive](#azureinteractive-flow) -> AzureDeviceCode (if no browser)

## AzureInteractive flow

This mode is used when `auth=AzureInteractive` is provided or as part of `AzureDefault` chained execution. 
> [!NOTE]
> 
> If browser is available, it will show authentication prompt and awaits user action. If browser isn't available, it will fallback to `AzureDeviceCode` flow.

## AzureClientCertificate flow

Allows using PEM/PFX(PKCS #12) files for service principal authentication. If secret/password is provided, expects file in PFX(PKCS #12) format and uses the secret to decrypt the file. If secret isn't provided, expects PEM formatted file to include private and public keys.

## Environment variables

All the required parameters could be provided to CLI/JDBC directly in arguments or connection string. Some of the optional parameters, if not provided, is looked up in environment variables.

> [!NOTE]
>
> Make sure to check environment variables if you face authentication issues. They may affect the flow.

The following table describes the parameters that can be configured in environment variables for the different authentication flows.
<br>**They will only be used if corresponding parameter isn't provided in the command line or connection string**.

|Variable name|Applicable authentication flows|Description
|----|----|----|
|AZURE_TENANT_ID|All|Azure Active Directory tenant ID.|
|AZURE_CLIENT_ID|AzureClientSecret, AzureClientCertificate, AzureManagedIdentity|Application/principal client ID.|
|AZURE_CLIENT_SECRET|AzureClientSecret, AzureClientCertificate|Secret or password for service principal or certificate file.|
|AZURE_CLIENT_CERTIFICATE_PATH|AzureClientCertificate|Path to certificate file.|
