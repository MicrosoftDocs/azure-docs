---
title: Configure built-in container registry for Azure Red Hat OpenShift 4
description: Configure built-in container registry for Azure Red Hat OpenShift 4
author: jiangma
ms.author: jiangma
ms.service: azure-redhat-openshift
ms.topic: conceptual
ms.date: 10/15/2020
---
# Configure built-in container registry for Azure Red Hat OpenShift 4

Azure Red Hat OpenShift provides an integrated container image registry called [OpenShift Container Registry (OCR)](https://docs.openshift.com/container-platform/4.6/registry/architecture-component-imageregistry.html) that adds the ability to automatically provision new image repositories on demand. This provides users with a built-in location for their application builds to push the resulting images.

In this article, you'll configure the built-in container image registry for an Azure Red Hat OpenShift (ARO) 4 cluster. You'll learn how to:

> [!div class="checklist"]
> * Set up Azure AD
> * Set up OpenID Connect
> * Access the built-in container image registry

## Before you begin

This article assumed you have an existing ARO cluster. If you need an ARO cluster, see the ARO tutorial, [Create an Azure Red Hat OpenShift 4 cluster](./tutorial-create-cluster.md). Make sure to create the cluster with the `--pull-secret` argument to `az aro create`.  This is necessary to configure Azure Active Directory authentication and the built-in container registry.

Once you have your cluster, connect to the cluster by following the steps in [Connect to an Azure Red Hat OpenShift 4 cluster](./tutorial-connect-cluster.md).
   * Be sure to follow the steps in "Install the OpenShift CLI" because we'll use the `oc` command later in this article.
   * Make note of the cluster console URL, which looks like `https://console-openshift-console.apps.<random>.<region>.aroapp.io/`. The values for `<random>` and `<region>` will be used later in this article.
   * Note the `kubeadmin` credentials. They will also be used later in this article.

### Configure Azure Active Directory authentication 

Azure Active Directory (Azure AD) implements OpenID Connect (OIDC). OIDC lets you use Azure AD to sign in to the ARO cluster. Follow the steps in [Configure Azure Active Directory authentication](configure-azure-ad-cli.md) to set up your cluster.

## Access the built-in container image registry

Now that you've set up the authentication methods to the ARO cluster, let's enable access to the built-in registry.

#### Define the Azure AD user to be an administrator

1. Sign in to the OpenShift web console from your browser using the credentials of an Azure AD user. We'll leverage the OpenShift OpenID authentication against Azure Active Directory to use OpenID to define the administrator.

   1. Use an InPrivate, Incognito or other equivalent browser window feature to sign in to the console. The window will look different after having enabled OIDC.
   
   :::image type="content" source="media/built-in-container-registry/oidc-enabled-login-window.png" alt-text="OpenID Connect enabled sign in window.":::
   1. Select **openid**

   > [!NOTE]
   > Take note of the username and password you use to sign in here. This username and password will function as an administrator for other actions in this and other articles.
2. Sign in with the OpenShift CLI by using the following steps.  For discussion, this process is known as `oc login`.
   1. At the right-top of the web console, expand the context menu of the signed-in user, then select **Copy Login Command**.
   2. Sign in to a new tab window with the same user if necessary.
   3. Select **Display Token**.
   4. Copy the value listed below **Login with this token** to the clipboard and run it in a shell, as shown here.

       ```bash
       oc login --token=XOdASlzeT7BHT0JZW6Fd4dl5EwHpeBlN27TAdWHseob --server=https://api.aqlm62xm.rnfghf.aroapp.io:6443
       Logged into "https://api.aqlm62xm.rnfghf.aroapp.io:6443" as "kube:admin" using the token provided.

       You have access to 57 projects, the list has been suppressed. You can list all projects with 'oc projects'

       Using project "default".
       ```

3. Run `oc whoami` in the console and note the output as **\<aad-user>**.  We'll use this value later in the article.
4. Sign out of the OpenShift web console. Select the button in the top right of the browser window labeled as the **\<aad-user>** and choose **Log Out**.


#### Grant the Azure AD user the necessary roles for registry interaction

1. Sign in to the OpenShift web console from your browser using the `kubeadmin` credentials.
1. Sign in to the OpenShift CLI with the token for `kubeadmin` by following the steps for `oc login` above, but do them after signing in to the web console with `kubeadmin`.
1. Execute the following commands to enable the access to the built-in registry for the **aad-user**.

   ```bash
   # Switch to project "openshift-image-registry"
   oc project openshift-image-registry
   
   # Output should look similar to the following.
   # Now using project "openshift-image-registry" on server "https://api.x8xl3f4y.eastus.aroapp.io:6443".
   ```

   ```bash
   # Expose the registry using "DefaultRoute"
   oc patch configs.imageregistry.operator.openshift.io/cluster --patch '{"spec":{"defaultRoute":true}}' --type=merge

   # Output should look similar to the following.
   # config.imageregistry.operator.openshift.io/cluster patched
   ```

   ```bash
   # Add roles to "aad-user" for pulling and pushing images
   # Note: replace "<aad-user>" with the one you wrote down before
   oc policy add-role-to-user registry-viewer <aad-user>

   # Output should look similar to the following.
   # clusterrole.rbac.authorization.k8s.io/registry-viewer added: "kaaIjx75vFWovvKF7c02M0ya5qzwcSJ074RZBfXUc34"
   ```

   ```bash
   oc policy add-role-to-user registry-editor <aad-user>
   # Output should look similar to the following.
   # clusterrole.rbac.authorization.k8s.io/registry-editor added: "kaaIjx75vFWovvKF7c02M0ya5qzwcSJ074RZBfXUc34"
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

Now that you've set up the built-in container image registry, you can get started by deploying an application on OpenShift. For Java applications, check out [Deploy a Java application with Open Liberty/WebSphere Liberty on an Azure Red Hat OpenShift 4 cluster](howto-deploy-java-liberty-app.md).