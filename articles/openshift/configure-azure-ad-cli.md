---
title: Azure Red Hat OpenShift running OpenShift 4  - Configure Azure Active Directory authentication using the command line
description: Learn how to configure Azure Active Directory authentication for an Azure Red Hat OpenShift cluster running OpenShift 4 using the command line
ms.service: container-service
ms.topic: article
ms.date: 03/12/2020
author: sabbour
ms.author: asabbour
keywords: aro, openshift, az aro, red hat, cli
ms.custom: mvc
#Customer intent: As an operator, I need to configure Azure Active Directory authentication for an Azure Red Hat OpenShift cluster running OpenShift 4
---

# Configure Azure Active Directory authentication for an Azure Red Hat OpenShift 4 cluster (CLI)

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.75 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

Retrieve your cluster-specific URLs that are going to be used to configure the Azure Active Directory application.

Construct the cluster's OAuth callback URL and store it in a variable **oauthCallbackURL**. Make sure to replace **aro-rg** with your resource group's name and **aro-cluster** with your cluster's name.

> [!NOTE]
> The `AAD` section in the OAuth callback URL should match the OAuth identity provider name you'll setup later.

```azurecli-interactive
domain=$(az aro show -g aro-rg -n aro-cluster --query clusterProfile.domain -o tsv)
location=$(az aro show -g aro-rg -n aro-cluster --query location -o tsv)
apiServer=$(az aro show -g aro-rg -n aro-cluster --query apiserverProfile.url -o tsv)
webConsole=$(az aro show -g aro-rg -n aro-cluster --query consoleProfile.url -o tsv)
oauthCallbackURL=https://oauth-openshift.apps.$domain.$location.aroapp.io/oauth2callback/AAD
```

## Create an Azure Active Directory application for authentication

Create an Azure Active Directory application and retrieve the created application identifier. Replace **\<ClientSecret>** with a secure password.

```azurecli-interactive
az ad app create \
  --query appId -o tsv \
  --display-name aro-auth \
  --reply-urls $oauthCallbackURL \
  --password '<ClientSecret>'
```

You should get back something like this. Make note of it as this is the **AppId** you'll need in later steps.

```output
6a4cb4b2-f102-4125-b5f5-9ad6689f7224
```

Retrieve the tenant ID of the subscription that owns the application.

```azure
az account show --query tenantId -o tsv
```

You should get back something like this. Make note of it as this is the **TenantId** you'll need in later steps.

```output
72f999sx-8sk1-8snc-js82-2d7cj902db47
```

## Create a manifest file to define the optional claims to include in the ID Token

Application developers can use [optional claims](https://docs.microsoft.com/azure/active-directory/develop/active-directory-optional-claims) in their Azure AD applications to specify which claims they want in tokens sent to their application.

You can use optional claims to:

- Select additional claims to include in tokens for your application.
- Change the behavior of certain claims that Azure AD returns in tokens.
- Add and access custom claims for your application.

We'll configure OpenShift to use the `email` claim and fall back to `upn` to set the Preferred Username by adding the `upn` as part of the ID token returned by Azure Active Directory.

Create a **manifest.json** file to configure the Azure Active Directory application.

```bash
cat > manifest.json<< EOF
[{
  "name": "upn",
  "source": null,
  "essential": false,
  "additionalProperties": []
},
{
"name": "email",
  "source": null,
  "essential": false,
  "additionalProperties": []
}]
EOF
```

## Update the Azure Active Directory application's optionalClaims with a manifest

Replace **\<AppID>** with the ID you got earlier.

```azurecli-interactive
az ad app update \
  --set optionalClaims.idToken=@manifest.json \
  --id <AppId>
```

## Update the Azure Active Directory application scope permissions

To be able to read the user information from Azure Active Directory, we need to define the proper scopes.

Replace **\<AppID>** with the ID you got earlier.

Add permission for the **Azure Active Directory Graph.User.Read** scope to enable sign in and read user profile.

```azurecli-interactive
az ad app permission add \
 --api 00000002-0000-0000-c000-000000000000 \
 --api-permissions 311a71cc-e848-46a1-bdf8-97ff7156d8e6=Scope \
 --id <AppId>
```

> [!NOTE]
> Unless you are authenticated as a Global Administrator for this Azure Active Directory, you can ignore the message to grant the consent, since you'll be asked to do this once you login on your own account.

## Assign users and groups to the cluster (optional)

Applications registered in an Azure Active Directory (Azure AD) tenant are, by default, available to all users of the tenant who authenticate successfully. Azure AD allows tenant administrators and developers to restrict an app to a specific set of users or security groups in the tenant.

Follow the instructions on the Azure Active Directory documentation to [assign users and groups to the app](https://docs.microsoft.com/azure/active-directory/develop/howto-restrict-your-app-to-a-set-of-users#app-registration).

## Configure OpenShift OpenID authentication

Retrieve the `kubeadmin` credentials. Run the following command to find the password for the `kubeadmin` user.

```azurecli-interactive
az aro list-credentials \
  --name aro-cluster \
  --resource-group aro-rg
```

The following example output shows the password will be in `kubeadminPassword`.

```json
{
  "kubeadminPassword": "<generated password>",
  "kubeadminUsername": "kubeadmin"
}
```

Log in to the OpenShift cluster's API server using the following command. The `$apiServer` variable was set [earlier](). Replace **\<kubeadmin password>** with the password you retrieved.

```azurecli-interactive
oc login $apiServer -u kubeadmin -p <kubeadmin password>
```

Create an OpenShift secret to store the Azure Active Directory application secret, replacing **\<ClientSecret>** with the secret you retrieved earlier.

```azurecli-interactive
oc create secret generic openid-client-secret-azuread \
  --namespace openshift-config \
  --from-literal=clientSecret=<ClientSecret>
```    

Create a **oidc.yaml** file to configure OpenShift OpenID authentication against Azure Active Directory. Replace **\<AppID>** and **\<TenantId>** with the values you retrieved earlier.

```bash
cat > oidc.yaml<< EOF
apiVersion: config.openshift.io/v1
kind: OAuth
metadata:
  name: cluster
spec:
  identityProviders:
  - name: AAD
    mappingMethod: claim
    type: OpenID
    openID:
      clientID: <AppId>
      clientSecret: 
        name: openid-client-secret-azuread
      extraScopes: 
      - email
      - profile
      extraAuthorizeParameters: 
        include_granted_scopes: "true"
      claims:
        preferredUsername: 
        - email
        - upn
        name: 
        - name
        email: 
        - email
      issuer: https://login.microsoftonline.com/<TenantId>
EOF
```

Apply the configuration to the cluster.

```azurecli-interactive
oc apply -f oidc.yaml
```

You will get back a response similar to the following.

```output
oauth.config.openshift.io/cluster configured
```

## Verify login through Azure Active Directory

If you now logout of the OpenShift Web Console and try to log in again, you'll be presented with a new option to log in with **AAD**. You may need to wait for a few minutes.

![Log in screen with Azure Active Directory option](media/aro4-login-2.png)
