---
title: Configure built-in container registry for Azure Red Hat OpenShift 4
description: Configure built-in container registry for Azure Red Hat OpenShift 4
author: jiangma
ms.author: jiangma
ms.service: container-service
ms.topic: conceptual
ms.date: 10/15/2020
---
# Configure built-in container registry for Azure Red Hat OpenShift 4

In this article, you'll configure the built-in container image registry for an Azure Red Hat OpenShift (ARO) 4 cluster. You'll learn how to:

> [!div class="checklist"]
> * Set up Azure AD
> * Set up OpenID Connect
> * Access the built-in container image registry

## Prerequisites

* Create a cluster by following the steps in [Create an Azure Red Hat OpenShift 4 cluster](/azure/openshift/tutorial-create-cluster). Make sure to create the cluster with the `--pull-secret` argument to `az aro create`.  This is required if you want to set up Azure AD for sign in, as required by this article.
* Connect to the cluster by following the steps in [Connect to an Azure Red Hat OpenShift 4 cluster](/azure/openshift/tutorial-connect-cluster).
   * Be sure to follow the steps in "Install the OpenShift CLI" because we'll use the `oc` command later in this article.
   * Make note of the cluster console URL, which looks like `https://console-openshift-console.apps.<random>.<region>.aroapp.io/`. The values for `<random>` and `<region>` will be used later in this article.
   * Note the `kubeadmin` credentials. They will be used later in this article.

## Set up Azure Active Directory

Azure Active Directory (Azure AD) implements OpenID Connect (OIDC). OIDC lets you use Azure AD to sign in to the ARO cluster. Follow the steps below to set up Azure AD.

1. Set up an Azure AD tenant by following the steps in [Quickstart: Set up a tenant](/azure/active-directory/develop/quickstart-create-new-tenant). Your Azure account may already have a tenant. If so, you can skip creating one if you have sufficient privileges in the tenant to follow the steps. Note your **tenant ID**. This value will be used later.
2. Create at least one Azure AD user by following the steps in [Add or delete users using Azure Active Directory](/azure/active-directory/fundamentals/add-users-azure-active-directory). You can use these accounts or your own to test the application. Take note of the email addresses and passwords of these accounts for sign in.
3. Create a new application registration in your Azure AD tenant by following the steps in [Quickstart: Register an application with the Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app). 
   1. Recall the note in the prerequisites about the values for `<random>` and `<region>`. Use these values to create a URI according to the following formula:

      `https://oauth-openshift.apps.<random>.<region>.aroapp.io/oauth2callback/openid`
   1. When you reach the step dealing with the **Redirect URI** field, enter the URI from the preceding step.
   1. Select **Register**.
   1. On the **Overview** page for the app, note the value shown for **Application (client) ID**, as shown here.
      :::image type="content" source="media/built-in-container-registry/azure-ad-app-overview-client-id.png" alt-text="Overview page of Azure AD Application.":::

4. Create a new client secret. 
   1. In the newly created application registration, select **Certificates & secrets** in the left navigation pane.
   1. Select **New client secret**.
   1. Provide **a description** and select **Add**.
   1. Save aside the generated **client secret** value. This value will be used later in the article.

### Add OpenID Connect identity provider

ARO provides a built-in container registry.  To access it, configure an identity provider (IDP) using Azure AD OIDC by following these steps.

1. Sign in to the OpenShift web console from your browser as `kubeadmin`.  This is the same procedure used when executing the steps in [Tutorial: Connect to an Azure Red Hat OpenShift 4 cluster](/azure/openshift/tutorial-connect-cluster).
1. In the left navigation pane, select **Administration** > **Cluster Settings**.
1. In the middle of the page, select **Global Configuration**.
1. Find **OAuth** in the **Configuration Resource** column of the table and select it.
1. Under **Identity Providers**, select **Add** and choose **OpenID Connect**.
1. Set **Name** as **openid**.  This value may already be filled in.
1. Set **Client ID** and **Client Secret** as the values from the preceding step.
1. Follow this step to find the value for **Issuer URL**.
   1. Replace **\<tenant-id>** with the one saved during the section **Set up Azure Active Directory** in the URL `https://login.microsoftonline.com/<tenant-id>/v2.0/.well-known/openid-configuration`.
   1. Open the URL in the same browser you had been using to interact with the Azure portal.
   1. Copy the value of property **issuer** in the returned JSON body and paste it into the textbox labeled **Issuer URL**.  The **issuer** value will look something like `https://login.microsoftonline.com/44p4o433-2q55-474q-on88-4on94469o74n/v2.0`.
1. Move to the bottom of the page and select **Add**.
   :::image type="content" source="media/built-in-container-registry/openid-connect-identity-provider.png" alt-text="OpenID Connect in OpenShift.":::
1. Sign out of the OpenShift web console by selecting the **kube:admin** button in the top right of the browser window and choosing **Log Out**.

### Access the built-in container image registry

The following instructions enable access to the built-in registry.

#### Define the Azure AD user to be an administrator

1. Sign in to the OpenShift web console from your browser using the credentials of an Azure AD user.

   1. Use an InPrivate, Incognito or other equivalent browser window feature to sign in to the console.
   1. The window will look different after having enabled OIDC.
   :::image type="content" source="media/built-in-container-registry/oidc-enabled-login-window.png" alt-text="OpenID Connect enabled sign in window.":::
   1. Select **openid**

   > [!NOTE]
   > Take note of the username and password you use to sign in here. This username and password will function as an administrator for other actions in this and other articles.
1. Sign in with the OpenShift CLI by using the following steps.  For discussion, this process is known as `oc login`.
   1. At the right-top of the web console, expand the context menu of the signed-in user, then select **Copy Login Command**.
   1. Sign in to a new tab window with the same user if necessary.
   1. Select **Display Token**.
   1. Copy the value listed below **Login with this token** to the clipboard and run it in a shell, as shown here.

       ```bash
       oc login --token=XOdASlzeT7BHT0JZW6Fd4dl5EwHpeBlN27TAdWHseob --server=https://api.aqlm62xm.rnfghf.aroapp.io:6443
       Logged into "https://api.aqlm62xm.rnfghf.aroapp.io:6443" as "kube:admin" using the token provided.

       You have access to 57 projects, the list has been suppressed. You can list all projects with 'oc projects'

       Using project "default".
       ```

1. Run `oc whoami` in the console and note the output as **\<aad-user>**.  We'll use this value later in the article.
1. Sign out of the OpenShift web console. Select the button in the top right of the browser window labeled as the **\<aad-user>** and choose **Log Out**.


#### Grant the Azure AD user the necessary roles for registry interaction

1. Sign in to the OpenShift web console from your browser using the `kubeadmin` credentials.
1. Sign in to the OpenShift CLI with the token for `kubeadmin` by following the steps for `oc login` above, but do them after signing in to the web console with `kubeadmin`.
1. Execute the following commands to enable the access to the built-in registry for the **aad-user**.

   ```bash
   # Switch to project "openshift-image-registry"
   oc project openshift-image-registry
   ```

   Output should look similar to the following.

   ```bash
   Now using project "openshift-image-registry" on server "https://api.x8xl3f4y.eastus.aroapp.io:6443".
   ```

   ```bash
   # Expose the registry using "DefaultRoute"
   oc patch configs.imageregistry.operator.openshift.io/cluster --patch '{"spec":{"defaultRoute":true}}' --type=merge
   ```

   Output should look similar to the following.

   ```bash
   config.imageregistry.operator.openshift.io/cluster patched
   ```

   ```bash
   # Add roles to "aad-user" for pulling and pushing images
   # Note: replace "<aad-user>" with the one you wrote down before
   oc policy add-role-to-user registry-viewer <aad-user>
   ```

   Output should look similar to the following.

   ```bash
   clusterrole.rbac.authorization.k8s.io/registry-viewer added: "kaaIjx75vFWovvKF7c02M0ya5qzwcSJ074RZBfXUc34"
   ```

   ```bash
   oc policy add-role-to-user registry-editor <aad-user>
   ```

   Output should look similar to the following.

   ```bash
   clusterrole.rbac.authorization.k8s.io/registry-editor added: "kaaIjx75vFWovvKF7c02M0ya5qzwcSJ074RZBfXUc34"
   ```

#### Obtain the container registry URL

Use the `oc get route` command as shown next to get the container registry URL.

```bash
# Note: the value of "Container Registry URL" in the output is the fully qualified registry name.
HOST=$(oc get route default-route --template='{{ .spec.host }}')
echo "Container Registry URL: $HOST"
```

   > [!NOTE]
   > Note the console output of **Container Registry URL**. It will be used as the fully qualified registry name for this guide and subsequent ones.

## Next steps

Use the built-in container image registry by deploying an application on OpenShift.  For Java applications, follow the how-to guide, [Deploy a Java application with Open Liberty/WebSphere Liberty on an Azure Red Hat OpenShift 4 cluster](howto-deploy-java-liberty-app.md).
