---
title: Complete the prerequisites for enabling Azure Active Directory (Azure AD) for local monitoring tools
titleSuffix: Azure Private 5G Core Preview
description: Complete the prerequisite tasks for enabling Azure Active Directory to access Azure Private 5G Core's local monitoring tools. 
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 12/29/2022
ms.custom: template-how-to
---

# Complete the prerequisites for enabling Azure Active Directory (Azure AD) for local monitoring tools

In this how-to guide, you'll carry out the steps you need to complete before you can deploy a site that uses Azure Active Directory (Azure AD) to authenticate access to distributed tracing and the packet core dashboards.

## Prerequisites

- You must have completed the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Identify the IP address for accessing the local monitoring tools that you set up in [Management network](complete-private-mobile-network-prerequisites.md#management-network).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have permission to manage applications in Azure AD. Roles that include the required permissions are, for example, [Application administrator](../articles/active-directory/roles/permissions-reference.md#application-administrator), [Application developer](../articles/active-directory/roles/permissions-reference.md#application-developer), and [Cloud application administrator](../articles/active-directory/roles/permissions-reference.md#cloud-application-administrator).

## Configure DNS for local monitoring IP

## Register application

1. Follow [Quickstart: Register an application with the Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app) to register a new application for your local monitoring tools with the Microsoft identity platform. 
    1. In [Add a redirect URI](/azure/active-directory/develop/quickstart-register-app#add-a-redirect-uri), select the **Web** platform and add the following two redirect URIs, where *\<LocalMonitoringIP\>* is the IP address for accessing the local monitoring tools that you set up in [Management network](complete-private-mobile-network-prerequisites.md#management-network):
    
        - https://*\<LocalMonitoringIP\>*/sas/auth/aad/callback
        - https://*\<LocalMonitoringIP\>*/grafana/login/azuread

    1. In [Add credentials](/azure/active-directory/develop/quickstart-register-app#add-credentials), add a client secret with the following values:

        - In **Description**, type **Grafana OAuth**.
        - In **Expires**, choose the option that best suits your deployment.

1. Navigate to your new application. You can find it in the Azure portal's **Azure Active Directory** service, in **App registrations** and under **Owned applications**.
1. Collect the values in the following table.

    |Value  |Field name in Azure portal  |
    |---------|---------|
    | Tenant ID | In AAD. |
    | Application (client) ID | In app. |
    | OAuth 2.0 authorization endpoint (v2) | In app Endpoints. |
    | OAuth 2.0 token endpoint (v2) | In app Endpoints. |
    | OAuth client secret | Key value in client secret |

1. Follow [App roles UI](/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps#app-roles-ui) to create three roles for your application (Admin, Viewer and Editor) with the following configuration:

    - Display name:
    - Allowed member types: Users/Groups
    - Value: Admin, Viewer, Editor
    - Description:
    - Do you want to enable this app role? Select.

1. Follow [Assign users and groups to roles](/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps#assign-users-and-groups-to-roles) to assign users and groups to the roles you created.

## Create Kubernetes Secret Objects for distributed tracing and Grafana

To support Azure AD on Azure Private 5G Core applications, we need secrets which we read from Kubernetes Secret Objects.

1. Convert each of the values you collected in [Register application](#register-application) into Base64 format.
    
    `$ echo -n  <Value> | base64`

1. Create a *secret-azure-ad-sas.yaml* file containing the Base64-encoded values for distributed tracing.

    ```yml
    apiVersion: v1
    kind: Secret
    metadata:
        name: sas-auth-secrets
        namespace: <DeploymentNamespace>
    type: Opaque
    data:
        client_id: <ClientIDBase64>
        client_secret: <ClientSecretBase64>
        redirect_url_root: <RedirectURLRoot64>
        tenant_id: <TenantIDBase64>
    ```
1. Create a *secret-azure-ad-grafana.yaml* file containing the Base64-encoded values for distributed tracing.

    ```yml
    apiVersion: v1
    kind: Secret
    metadata:
        name: grafana-auth-secrets
        namespace: <DeploymentNamespace>
    type: Opaque
    data:
        client_id: <ClientIDBase64>
        client_secret: <ClientSecretBase64>
        redirect_url_root: <RedirectURLRoot64>
        tenant_id: <TenantIDBase64>
    ```

1. In a command line with kubectl access to the Azure Arc-enabled Kubernetes cluster, apply the Secret Object for both distributed tracing and Grafana. 
    
    `kubectl apply -f  /home/centos/secret-azure-ad-sas.yaml`

    `kubectl apply -f  /home/centos/secret-azure-ad-grafana.yaml`

1. Use the following commands to verify if the Secret Objects were applied correctly. You should see the correct Name, Namespace and Type values, along with the size of the encoded values.

    `kubectl describe secret sas-auth-secrets`

    `kubectl describe secret grafana-auth-secrets`

## Next steps

Ensure you have completed all the steps in [Collect the required information for a site](collect-required-information-for-a-site.md) and deploy the site by following [Create a site using the Azure portal](create-a-site.md).