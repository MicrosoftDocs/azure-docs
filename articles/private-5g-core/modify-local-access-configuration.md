---
title: Modify a packet core instance's local access configuration
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to modify a packet core instance's local access configuration using the Azure portal. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 11/24/2022
ms.custom: template-how-to
---

# Modify the local access configuration in a site

You can use [Azure Active Directory (Azure AD)](../active-directory/authentication/overview-authentication.md) or a local username and password to authenticate access to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md). Additionally, you can use a self-signed certificate or provide your own to attest access to your local diagnostics tools.

To improve security in your deployment, we recommend setting up Azure AD authentication over local usernames and passwords, as well as providing a certificate signed by a globally known and trusted certificate authority (CA).

In this how-to guide, you'll learn how to use the Azure portal to change the authentication method and the certificate used for securing access to a site's local monitoring tools.

> [!TIP]
> Instead, if you want to modify the user-assigned identity configured for HTTPS certificates, [create a new or edit an existing user-assigned identity](../active-directory/managed-identities-azure-resources/overview.md) using the information collected in [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values).

## Prerequisites

- Refer to [Choose the authentication method for local monitoring tools](collect-required-information-for-a-site.md#choose-the-authentication-method-for-local-monitoring-tools) and [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values) to collect the required values and make sure they're in the correct format.
- If you want to add or update a custom HTTPS certificate for accessing your local monitoring tools, you'll need a certificate signed by a globally known and trusted CA and stored in an Azure Key Vault. Your certificate must use a private key of type RSA or EC to ensure it's exportable (see [Exportable or non-exportable key](../key-vault/certificates/about-certificates.md) for more information).
- If you want to update your local monitoring authentication method, ensure your local machine has core kubectl access to the Azure Arc-enabled Kubernetes cluster. This requires a core kubeconfig file, which you can obtain by following [Core namespace access](set-up-kubectl-access.md#core-namespace-access).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## View the local access configuration

In this step, you'll navigate to the **Packet Core Control Plane** resource representing your packet core instance.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the resource menu, select **Sites**.
1. Select the site containing the packet core instance you want to modify.
1. Under the **Network function** heading, select the name of the **Packet Core Control Plane** resource shown next to **Packet Core**.

    :::image type="content" source="media/packet-core-field.png" alt-text="Screenshot of the Azure portal showing the Packet Core field.":::

1. Check the fields under the **Local access** heading to view the current local access configuration and status.

## Modify the local access configuration

1. Select **Modify local access**.

    :::image type="content" source="media//modify-local-access-configuration/modify-local-access.png" alt-text="Screenshot of the Azure portal showing the Modify local access option.":::

1. Under **Authentication type**, select the authentication method you want to use.
1. Under **HTTPS certificate**, choose whether you want to provide a custom HTTPS certificate for accessing your local monitoring tools.
1. If you selected **Yes** for **Provide custom HTTPS certificate?**, use the information you collected in [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values) to select a certificate.

    :::image type="content" source="media//modify-local-access-configuration/local-access-tab.png" alt-text="Screenshot of the Azure portal showing the Local access configuration tab.":::

1. Select **Next**.
1. Azure will now validate the configuration values you entered. You should see a message indicating that your values have passed validation.

    :::image type="content" source="media//modify-local-access-configuration/modify-local-access-validation.png" alt-text="Screenshot of the Azure portal showing successful validation for a local access configuration change.":::

1. Select **Create**.
1. Azure will now redeploy the packet core instance with the new configuration. The Azure portal will display a confirmation screen when this deployment is complete.
1. Select **Go to resource**. Check that the fields under **Local access** contain the updated authentication and certificate information.
1. If you added or updated a custom HTTPS certificate, follow [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui) and [Access the packet core dashboards](packet-core-dashboards.md#access-the-packet-core-dashboards) to check if your browser trusts the connection to your local monitoring tools. Note that:

    - It may take up to four hours for the changes in the Key Vault to synchronize with the edge location.
    - You may need to clear your browser cache to observe the changes.

## Configure local monitoring access authentication

Follow this step if you changed the authentication type for local monitoring access.

If you switched from local usernames and passwords to Azure AD, follow the steps in [Enable Azure Active Directory (Azure AD) for local monitoring tools](enable-azure-active-directory.md).

If you switched from Azure AD to local usernames and passwords:

1. Sign in to [Azure Cloud Shell](../cloud-shell/overview.md) and select **PowerShell**. If this is your first time accessing your cluster via Azure Cloud Shell, follow [Access your cluster](../azure-arc/kubernetes/cluster-connect.md?tabs=azure-cli) to configure kubectl access.
1. Delete the Kubernetes Secret Objects:

    `kubectl delete secrets sas-auth-secrets grafana-auth-secrets --kubeconfig=<core kubeconfig> -n core`

1. Restart the distributed tracing and packet core dashboards pods.

    1. Obtain the name of your packet core dashboards pod:
        
        `kubectl get pods -n core --kubeconfig=<core kubeconfig> | grep "grafana"`

    1. Copy the output of the previous step and replace it into the following command to restart your pods.

        `kubectl delete pod sas-core-search-0 <packet core dashboards pod> -n core --kubeconfig=<core kubeconfig>`

1. Follow [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui) and [Access the packet core dashboards](packet-core-dashboards.md#access-the-packet-core-dashboards) to check if you can access your local monitoring tools using local usernames and passwords.

## Next steps

- [Learn more about the distributed tracing web GUI](distributed-tracing.md)
- [Learn more about the packet core dashboards](packet-core-dashboards.md)