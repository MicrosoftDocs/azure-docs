---
title: Enable Azure Active Directory (Azure AD) for local monitoring tools
titleSuffix: Azure Private 5G Core
description: Complete the prerequisite tasks for enabling Azure Active Directory to access Azure Private 5G Core's local monitoring tools.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 12/29/2022
ms.custom: template-how-to
---

# Enable Azure Active Directory (Azure AD) for local monitoring tools

Azure Private 5G Core provides the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md) tools for monitoring your deployment at the edge. You can access these tools using [Azure Active Directory (Azure AD)](../active-directory/authentication/overview-authentication.md) or a local username and password. We recommend setting up Azure AD authentication to improve security in your deployment.

In this how-to guide, you'll carry out the steps you need to complete after deploying or configuring a site that uses Azure AD to authenticate access to your local monitoring tools. You don't need to follow this if you decided to use local usernames and passwords to access the distributed tracing and packet core dashboards.

> [!CAUTION]
> Azure AD for local monitoring tools is not supported when a web proxy is enabled on the Azure Stack Edge device on which Azure Private 5G Core is running. If you have configured a firewall that blocks traffic not transmitted via the web proxy, then enabling Azure AD will cause the Azure Private 5G Core installation to fail.

## Prerequisites

- You must have completed the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md) and [Collect the required information for a site](collect-required-information-for-a-site.md).
- You must have deployed a site with Azure Active Directory set as the authentication type.
- Identify the IP address for accessing the local monitoring tools that you set up in [Management network](complete-private-mobile-network-prerequisites.md#management-network).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have permission to manage applications in Azure AD. [Azure AD built-in roles](../active-directory/roles/permissions-reference.md) that have the required permissions include, for example, Application administrator, Application developer, and Cloud application administrator. If you do not have this access, contact your tenant Azure AD administrator so they can confirm your user has been assigned the correct role by following [Assign user roles with Azure Active Directory](/azure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).
- Ensure your local machine has core kubectl access to the Azure Arc-enabled Kubernetes cluster. This requires a core kubeconfig file, which you can obtain by following [Core namespace access](set-up-kubectl-access.md#core-namespace-access).

## Configure domain system name (DNS) for local monitoring IP

When registering your application and configuring redirect URIs, you'll need your redirect URIs to contain a domain name rather than an IP address for accessing the local monitoring tools.

In the authoritative DNS server for the DNS zone you want to create the DNS record in, configure a DNS record to resolve the domain name to the IP address used for accessing local monitoring tools, which you set up in [Management network](complete-private-mobile-network-prerequisites.md#management-network).

## Register application

You'll now register a new local monitoring application with Azure AD to establish a trust relationship with the Microsoft identity platform.

If your deployment contains multiple sites, you can use the same two redirect URIs for all sites, or create different URI pairs for each site. You can configure a maximum of two redirect URIs per site. If you've already registered an application for your deployment and you want to use the same URIs across your sites, you can skip this step.

1. Follow [Quickstart: Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md) to register a new application for your local monitoring tools with the Microsoft identity platform.
    1. In *Add a redirect URI*, select the **Web** platform and add the following two redirect URIs, where *\<local monitoring domain\>* is the domain name for your local monitoring tools that you set up in [Configure domain system name (DNS) for local monitoring IP](#configure-domain-system-name-dns-for-local-monitoring-ip):

        - https://*\<local monitoring domain\>*/sas/auth/aad/callback
        - https://*\<local monitoring domain\>*/grafana/login/azuread

    1. In *Add credentials*, follow the steps to add a client secret. Make sure to record the secret under the **Value** column, as this field is only available immediately after secret creation. This is the **Client secret** value that you'll need later in this procedure.

1. Follow [App roles UI](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui) to create three roles for your application (Admin, Viewer, and Editor) with the following configuration:

    - In **Allowed member types**, select **Users/Groups**.
    - In **Value**, enter one of **Admin**, **Viewer**, and **Editor** for each role you're creating.
    - In **Do you want to enable this app role?**, ensure the checkbox is selected.

    You'll be able to use these roles when managing access to the packet core dashboards.

1. Follow [Assign users and groups to roles](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md#assign-users-and-groups-to-roles) to assign users and groups to the roles you created.

## Collect the information for Kubernetes Secret Objects

1. Collect the values in the following table.

    |Value  | How to collect  |  Kubernetes secret parameter name
    |---------|---------|---------|
    | **Tenant ID** | In the Azure portal, search for Azure Active Directory. You can find the **Tenant ID** field in the Overview page. | `tenant_id` |
    | **Application (client) ID** | Navigate to the new local monitoring app registration you just created. You can find the **Application (client) ID** field in the Overview page, under the **Essentials** heading. | `client_id` |
    | **Authorization URL** | In the local monitoring app registration Overview page, select **Endpoints**. Copy the contents of the **OAuth 2.0 authorization endpoint (v2)** field. <br /><br /> **Note:** <br />If the string contains `organizations`, replace `organizations` with the Tenant ID value. For example, <br />`https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize`<br /> becomes <br />`https://login.microsoftonline.com/72f998bf-86f1-31af-91ab-2d7cd001db56/oauth2/v2.0/authorize`. | `auth_url` |
    | **Token URL** |  In the local monitoring app registration Overview page, select **Endpoints**. Copy the contents of the **OAuth 2.0 token endpoint (v2)** field.  <br /><br /> **Note:** <br />If the string contains `organizations`, replace `organizations` with the Tenant ID value. For example, <br />`https://login.microsoftonline.com/organizations/oauth2/v2.0/token`<br /> becomes <br />`https://login.microsoftonline.com/72f998bf-86f1-31af-91ab-2d7cd001db56/oauth2/v2.0/token`. | `token_url` |
    | **Client secret** | You collected this when creating the client secret in the previous step. | `client_secret` |
    | **Distributed tracing redirect URI root** | Make a note of the following part of the redirect URI: **https://*\<local monitoring domain\>***. | `redirect_uri_root` |
    | **Packet core dashboards redirect URI root** | Make a note of the following part of the packet core dashboards redirect URI: **https://*\<local monitoring domain\>*/grafana**. | `root_url` |

## Create Kubernetes Secret Objects

To support Azure AD on Azure Private 5G Core applications, you'll need a YAML file containing Kubernetes secrets.

1. Convert each of the values you collected in [Collect the information for Kubernetes Secret Objects](#collect-the-information-for-kubernetes-secret-objects) into Base64 format. For example, you can run the following command in an Azure Cloud Shell **Bash** window:

    ```bash
    echo -n <Value> | base64
    ```

1. Create a *secret-azure-ad-local-monitoring.yaml* file containing the Base64-encoded values to configure distributed tracing and the packet core dashboards. The secret for distributed tracing must be named **sas-auth-secrets**, and the secret for the packet core dashboards must be named **grafana-auth-secrets**.

    ```yml
    apiVersion: v1
    kind: Secret
    metadata:
        name: sas-auth-secrets
        namespace: core
    type: Opaque
    data:
        client_id: <Base64-encoded client ID>
        client_secret: <Base64-encoded client secret>
        redirect_uri_root: <Base64-encoded distributed tracing redirect URI root>
        tenant_id: <Base64-encoded tenant ID>

    ---

    apiVersion: v1
    kind: Secret
    metadata:
        name: grafana-auth-secrets
        namespace: core
    type: Opaque
    data:
        client_id: <Base64-encoded client ID>
        client_secret: <Base64-encoded client secret>
        auth_url: <Base64-encoded authorization URL>
        token_url: <Base64-encoded token URL>
        root_url: <Base64-encoded packet core dashboards redirect URI root>
    ```

## Apply Kubernetes Secret Objects

You'll need to apply your Kubernetes Secret Objects if you're enabling Azure AD for a site, after a packet core outage, or after updating the Kubernetes Secret Object YAML file.

1. Sign in to [Azure Cloud Shell](../cloud-shell/overview.md) and select **PowerShell**. If this is your first time accessing your cluster via Azure Cloud Shell, follow [Access your cluster](../azure-arc/kubernetes/cluster-connect.md?tabs=azure-cli) to configure kubectl access.
1. Apply the Secret Object for both distributed tracing and the packet core dashboards, specifying the core kubeconfig filename.

    `kubectl apply -f  /home/centos/secret-azure-ad-local-monitoring.yaml --kubeconfig=<core kubeconfig>`

1. Use the following commands to verify if the Secret Objects were applied correctly, specifying the core kubeconfig filename. You should see the correct **Name**, **Namespace**, and **Type** values, along with the size of the encoded values.

    `kubectl describe secrets -n core sas-auth-secrets --kubeconfig=<core kubeconfig>`

    `kubectl describe secrets -n core grafana-auth-secrets --kubeconfig=<core kubeconfig>`

1. Restart the distributed tracing and packet core dashboards pods.

    1. Obtain the name of your packet core dashboards pod:

        `kubectl get pods -n core --kubeconfig=<core kubeconfig>" | grep "grafana"`

    1. Copy the output of the previous step and replace it into the following command to restart your pods.

        `kubectl delete pod sas-core-search-0 <packet core dashboards pod> -n core --kubeconfig=<core kubeconfig>`

## Verify access

Follow [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui) and [Access the packet core dashboards](packet-core-dashboards.md#access-the-packet-core-dashboards) to check if you can access your local monitoring tools using Azure AD.

## Update Kubernetes Secret Objects

Follow this step if you need to update your existing Kubernetes Secret Objects; for example, after updating your redirect URIs or renewing an expired client secret.

1. Make the required changes to the Kubernetes Secret Object YAML file you created in [Create Kubernetes Secret Objects](#create-kubernetes-secret-objects).
1. [Apply Kubernetes Secret Objects](#apply-kubernetes-secret-objects).
1. [Verify access](#verify-access).

## Next steps

If you haven't already done so, you should now design the policy control configuration for your private mobile network. This allows you to customize how your packet core instances apply quality of service (QoS) characteristics to traffic. You can also block or limit certain flows.

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md)