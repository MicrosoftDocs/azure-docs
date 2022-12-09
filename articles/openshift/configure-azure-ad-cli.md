---
title: Azure Red Hat OpenShift running OpenShift 4  - Configure Azure Active Directory authentication using the command line
description: Learn how to configure Azure Active Directory authentication for an Azure Red Hat OpenShift cluster running OpenShift 4 using the command line
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 03/12/2020
author: sabbour
ms.author: asabbour
keywords: aro, openshift, az aro, red hat, cli
ms.custom: mvc, devx-track-azurecli
#Customer intent: As an operator, I need to configure Azure Active Directory authentication for an Azure Red Hat OpenShift cluster running OpenShift 4
---

# Configure Azure Active Directory authentication for an Azure Red Hat OpenShift 4 cluster (CLI)

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.30.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

Retrieve your cluster-specific URLs that are going to be used to configure the Azure Active Directory application.

Set the variables for resource group and cluster name.

Replace **\<resource_group>** with your resource group's name and **\<aro_cluster>** with your cluster's name.

```azurecli-interactive
resource_group=<resource_group>
aro_cluster=<aro_cluster>
```

Construct the cluster's OAuth callback URL and store it in a variable **oauthCallbackURL**. 

> [!NOTE]
> The `AAD` section in the OAuth callback URL should match the OAuth identity provider name you'll setup later.


```azurecli-interactive
domain=$(az aro show -g $resource_group -n $aro_cluster --query clusterProfile.domain -o tsv)
location=$(az aro show -g $resource_group -n $aro_cluster --query location -o tsv)
apiServer=$(az aro show -g $resource_group -n $aro_cluster --query apiserverProfile.url -o tsv)
webConsole=$(az aro show -g $resource_group -n $aro_cluster --query consoleProfile.url -o tsv)
```

The format of the oauthCallbackURL is slightly different with custom domains:

* Run the following command if you are using a custom domain, e.g. `contoso.com`. 

    ```azurecli-interactive
    oauthCallbackURL=https://oauth-openshift.apps.$domain/oauth2callback/AAD
    ```

* If you are not using a custom domain then the `$domain` will be an eight character alnum string and is extended by `$location.aroapp.io`.

    ```azurecli-interactive
    oauthCallbackURL=https://oauth-openshift.apps.$domain.$location.aroapp.io/oauth2callback/AAD
    ```

> [!NOTE]
> The `AAD` section in the OAuth callback URL should match the OAuth identity provider name you'll setup later.

## Create an Azure Active Directory application for authentication

Replace **\<client_secret>** with a secure password for the application.

```azurecli-interactive
client_secret=<client_secret>
```

Create an Azure Active Directory application and retrieve the created application identifier.

```azurecli-interactive
app_id=$(az ad app create \
  --query appId -o tsv \
  --display-name aro-auth \
  --reply-urls $oauthCallbackURL \
  --password $client_secret)
```

Retrieve the tenant ID of the subscription that owns the application.

```azurecli-interactive
tenant_id=$(az account show --query tenantId -o tsv)
```

## Create a manifest file to define the optional claims to include in the ID Token

Application developers can use [optional claims](../active-directory/develop/active-directory-optional-claims.md) in their Azure AD applications to specify which claims they want in tokens sent to their application.

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

```azurecli-interactive
az ad app update \
  --set optionalClaims.idToken=@manifest.json \
  --id $app_id
```

## Update the Azure Active Directory application scope permissions

To be able to read the user information from Azure Active Directory, we need to define the proper scopes.

Add permission for the **Azure Active Directory Graph.User.Read** scope to enable sign in and read user profile.

```azurecli-interactive
az ad app permission add \
 --api 00000002-0000-0000-c000-000000000000 \
 --api-permissions 311a71cc-e848-46a1-bdf8-97ff7156d8e6=Scope \
 --id $app_id
```

> [!NOTE]
> You can safely ignore the message to grant the consent unless you are authenticated as a Global Administrator for this Azure Active Directory. Standard domain users will be asked to grant consent when they first login to the cluster using their AAD credentials.

## Assign users and groups to the cluster (optional)

Applications registered in an Azure Active Directory (Azure AD) tenant are, by default, available to all users of the tenant who authenticate successfully. Azure AD allows tenant administrators and developers to restrict an app to a specific set of users or security groups in the tenant.

Follow the instructions on the Azure Active Directory documentation to [assign users and groups to the app](../active-directory/develop/howto-restrict-your-app-to-a-set-of-users.md).

## Configure OpenShift OpenID authentication

Retrieve the `kubeadmin` credentials. Run the following command to find the password for the `kubeadmin` user.

```azurecli-interactive
kubeadmin_password=$(az aro list-credentials \
  --name $aro_cluster \
  --resource-group $resource_group \
  --query kubeadminPassword --output tsv)
```

Log in to the OpenShift cluster's API server using the following command. 

```azurecli-interactive
oc login $apiServer -u kubeadmin -p $kubeadmin_password
```

Create an OpenShift secret to store the Azure Active Directory application secret.

```azurecli-interactive
oc create secret generic openid-client-secret-azuread \
  --namespace openshift-config \
  --from-literal=clientSecret=$client_secret
```

Create a **oidc.yaml** file to configure OpenShift OpenID authentication against Azure Active Directory. 

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
      clientID: $app_id
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
      issuer: https://login.microsoftonline.com/$tenant_id
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
