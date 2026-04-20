---
title: "Quickstart: Configure a cross-tenant application for Microsoft Planetary Computer Pro"
description: Learn how to configure a multitenant application to read and write data to customer Microsoft Planetary Computer Pro GeoCatalogs.
author: aloverro
ms.author: adamloverro
ms.service: planetary-computer-pro
ms.topic: quickstart
ms.date: 01/13/2026

#customer intent: As a developer of a geospatial data and / or service provider application, I want to learn how to configure my application and work with my customers so that I can read and process data from and deliver new data and insights to my customers Microsoft Planetary Computer Pro GeoCatalogs.
---

# Quickstart: Configure a cross-tenant application for Microsoft Planetary Computer Pro

In this quickstart, you create and configure a multitenant Azure application that can access customer Microsoft Planetary Computer Pro GeoCatalogs. As a geospatial data or service provider, this process enables your application to read or write data from or to your customers' GeoCatalogs.

## Prerequisites

- Azure account with an active subscription (create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio))
- One of the following Microsoft Entra ID roles in your tenant:
  - Application Administrator
  - Cloud Application Administrator
  - Global Administrator
- Azure CLI installed and configured - [install the Azure CLI](/cli/azure/install-azure-cli)
- Python 3.8 or later (for sample scripts)

## Download the sample code

This quickstart uses sample scripts from the Microsoft Planetary Computer Pro partner application repository. Clone or download the repository to your local machine:

```bash
git clone https://github.com/Azure/microsoft-planetary-computer-pro.git
cd tools/partner-app-integration
```

The repository contains three directories:

| Directory | Purpose |
| ----------- | --------- |
| `provider-app/` | Scripts for creating your multitenant application registration |
| `customer-app/` | Scripts your customers use to authorize your application |
| `client-app/` | Test scripts for validating GeoCatalog access |

## Create a multitenant application registration

The first step is to create an application registration in your Azure tenant configured for multitenant access. This application is the entity that customers authorize to access their GeoCatalogs.

### Understand the application configuration

A multitenant application registration requires specific configuration:

- **Sign-in audience**: Set to `AzureADMultipleOrgs` to allow sign-in from any Microsoft Entra tenant
- **Redirect URI**: URI where tokens are sent after authentication
- **Token configuration**: Enable ID and access token issuance
- **Client credentials**: A client secret for app-only authentication

### Create the application using Azure CLI

1. Sign in to Azure CLI:

    ```azurecli
    az login
    ```

1. Create the multitenant application registration:

    ```azurecli
    az ad app create \
      --display-name "My Geospatial Provider App" \
      --sign-in-audience AzureADMultipleOrgs \
      --web-redirect-uris "https://localhost:8080/callback" \
      --enable-id-token-issuance true \
      --enable-access-token-issuance true
    ```

    > [!NOTE]
    > The `appId` value in the output is your Application (client) ID.

1. Create a service principal for the application in your tenant:

    ```azurecli
    az ad sp create --id <your-app-id>
    ```

1. Create a client secret:

    ```azurecli
    az ad app credential reset \
      --id <your-app-id> \
      --append \
      --years 1
    ```

    > [!WARNING]
    > Save the `password` value immediately—this is the only time it is provided. Store it securely using Azure Key Vault or another secrets management solution.

1. Get your tenant ID:

    ```azurecli
    az account show --query tenantId -o tsv
    ```

### Use the sample script

Alternatively, use the provided setup script to automate these steps:

1. Navigate to the provider-app directory:

    ```bash
    cd provider-app
    pip install -r requirements.txt
    ```

1. Create a `.env` file with your configuration:

    ```bash
    AZURE_TENANT_ID=<your-tenant-id>
    PROVIDER_APP_NAME=my-geospatial-provider-app
    PROVIDER_APP_REDIRECT_URI=https://localhost:8080/callback
    ```

1. Run the setup script:

    ```bash
    python setup_provider_app.py
    ```

The script creates the application registration and outputs a `customer_onboarding.json` file containing the information you need to share with customers.

## Prepare customer onboarding materials

After creating your application, prepare the information your customers need to authorize your application in their tenant.

### Required information for customers

Provide customers with:

| Information | Description | Example |
| ------------- | ------------- | --------- |
| Application (client) ID | Unique identifier for your application | `abcd1234-ef56-7890-abcd-1234567890ab` |
| Admin consent URL | URL for granting admin consent | See next section |

### Generate the admin consent URL

Construct the admin consent URL using this template:

```text
https://login.microsoftonline.com/{customer-tenant-id}/adminconsent?client_id={your-app-id}&redirect_uri={your-redirect-uri}
```

Provide customers with this template and instruct them to replace `{customer-tenant-id}` with their own tenant ID.

> [!NOTE]
> Outside the scope of this quickstart, you can collect your customers tenant-id as part of the registration and onboarding flow for your application. 


### Sample onboarding document

The `customer_onboarding.json` file generated by the setup script contains:

```json
{
  "provider_app_name": "my-geospatial-provider-app",
  "application_id": "abcd1234-ef56-7890-abcd-1234567890ab",
  "admin_consent_url_template": "https://login.microsoftonline.com/{customer-tenant-id}/adminconsent?client_id=abcd1234-ef56-7890-abcd-1234567890ab&redirect_uri=https://localhost:8080/callback",
  "instructions": {
    "step_1": "Customer admin navigates to admin consent URL",
    "step_2": "Admin grants consent for requested permissions",
    "step_3": "Customer runs customer-app registration script",
    "step_4": "Customer assigns GeoCatalog Administrator role to the service principal"
  }
}
```

## Authenticate and access customer GeoCatalogs

Once your customer [authorizes the your cross-tenant application](./authorize-cross-tenant-partner-applications.md), you can authenticate and access their GeoCatalog resources.

### Authentication flow

Your application authenticates using the OAuth2 client credentials flow:

[ ![Sequence diagram showing OAuth2 client credentials authentication flow between your application, Microsoft Entra ID, and customer GeoCatalog.](media/partner-application-authentication-workflow.png) ](media/partner-application-authentication-workflow.png#lightbox)

### Acquire an access token

Use the OAuth2 client credentials flow to acquire a token for the GeoCatalog scope. For Python based application, it's recommended to use the MSAL libraries to retrieve the access tokens:

**Python example using MSAL:**

```python
import msal

def get_access_token_msal(tenant_id, client_id, client_secret):
    """Acquire access token using MSAL."""
    app = msal.ConfidentialClientApplication(
        client_id=client_id,
        client_credential=client_secret,
        authority=f"https://login.microsoftonline.com/{tenant_id}"
    )
    
    result = app.acquire_token_for_client(
        scopes=["https://geocatalog.spatio.azure.com/.default"]
    )
    
    if "access_token" in result:
        return result["access_token"]
    else:
        raise Exception(f"Token acquisition failed: {result.get('error_description')}")
```

### Make API requests

With the access token, make requests to the customer's GeoCatalog API:

```python
import requests

def list_collections(geocatalog_url, access_token, collection_id):
    """Get a specific collection from the GeoCatalog."""
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(
        f"{geocatalog_url}/stac/collections/{collection_id}",
        headers=headers
    )
    
    response.raise_for_status()
    return response.json()
```

## Test your configuration

You can use the test scripts in the `client-app/` directory to validate your configuration:

1. Navigate to the client-app directory:

    ```bash
    cd client-app
    pip install -r requirements.txt
    ```

1. Create a `.env` file with the customer's configuration:

    ```bash
    AZURE_CLIENT_ID=<your-app-id>
    AZURE_TENANT_ID=<customer-tenant-id>
    AZURE_CLIENT_SECRET=<your-client-secret>
    GEOCATALOG_URL=<customer-geocatalog-url>
    ```

1. Test token acquisition:

    ```bash
    python test_oauth2_token.py
    ```

1. Test GeoCatalog access:

    ```bash
    python test_geocatalog.py
    ```

## Clean up resources

To remove the application registration when it's no longer needed:

```azurecli
# Delete the application registration
az ad app delete --id <your-app-id>
```

> [!WARNING]
> Deleting the application registration removes access to all customer tenants where the application was authorized.

## Related content

- [Working with partner applications](./working-with-partner-applications.md)
- [Authorize cross-tenant partner applications](./authorize-cross-tenant-partner-applications.md)
- [Configure application authentication for Microsoft Planetary Computer Pro](./application-authentication.md)
