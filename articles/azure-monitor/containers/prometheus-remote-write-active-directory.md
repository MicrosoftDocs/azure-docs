---
title: Set up Prometheus remote write by using Microsoft Entra authentication
description: Learn how to set up remote write in Azure Monitor managed service for Prometheus. Use Microsoft Entra authentication to send data from a self-managed Prometheus server running in your Azure Kubernetes Server (AKS) cluster or Azure Arc-enabled Kubernetes cluster on-premises or in a different cloud. 
author: EdB-MSFT
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 4/18/2024
---

# Send Prometheus data to Azure Monitor by using Microsoft Entra authentication

This article describes how to set up [remote write](prometheus-remote-write.md) to send data from a self-managed Prometheus server running in your Azure Kubernetes Service (AKS) cluster or Azure Arc-enabled Kubernetes cluster by using Microsoft Entra authentication.

## Cluster configurations

This article applies to the following cluster configurations:

- Azure Kubernetes Service cluster
- Azure Arc-enabled Kubernetes cluster
- Kubernetes cluster running in a different cloud or on-premises

> [!NOTE]
> For an AKS cluster or an Azure Arc-enabled Kubernetes cluster, we recommend that you use managed identity authentication. For more information, see [Azure Monitor managed service for Prometheus remote write for managed identity](prometheus-remote-write-managed-identity.md).

## Prerequisites

### Supported versions

- Prometheus versions greater than v2.48 are required for Microsoft Entra ID application authentication. 

### Azure Monitor workspace

This article covers sending Prometheus metrics to an Azure Monitor workspace. To create an Azure monitor workspace, see [Manage an Azure Monitor workspace](/azure/azure-monitor/essentials/azure-monitor-workspace-manage#create-an-azure-monitor-workspace).

## Permissions
Administrator permissions for the cluster or resource are required to complete the steps in this article.

## Set up an application for Microsoft Entra ID

The process to set up Prometheus remote write for an application by using Microsoft Entra authentication involves completing the following tasks:

1. Register an application with Microsoft Entra ID.
1. Get the client ID of the Microsoft Entra application.
1. Assign the Monitoring Metrics Publisher role on the workspace data collection rule to the application.
1. Create an Azure key vault and generate a certificate.
1. Add a certificate to the Microsoft Entra application.
1. Add a CSI driver and storage for the cluster.
1. Deploy a sidecar container to set up remote write.

The tasks are described in the following sections.

<a name='create-azure-active-directory-application'></a>

### Register an application with Microsoft Entra ID

Complete the steps to [register an application with Microsoft Entra ID](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) and create a service principal.

<a name='get-the-client-id-of-the-azure-active-directory-application'></a>

### Get the client ID of the Microsoft Entra application

1. In the Azure portal, go to the **Microsoft Entra ID** menu and select **App registrations**.
1. In the list of applications, copy the value for **Application (client) ID** for the registered application.

:::image type="content" source="media/prometheus-remote-write-active-directory/application-client-id.png" alt-text="Screenshot that shows the application or client ID of a Microsoft Entra application." lightbox="media/prometheus-remote-write-active-directory/application-client-id.png":::

### Assign the Monitoring Metrics Publisher role on the workspace data collection rule to the application

The application must be assigned the Monitoring Metrics Publisher role on the data collection rule that is associated with your Azure Monitor workspace.

1. On the resource menu for your Azure Monitor workspace, select **Overview**. For **Data collection rule**, select the link.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/azure-monitor-account-data-collection-rule.png" alt-text="Screenshot that shows the data collection rule that's used by Azure Monitor workspace." lightbox="media/prometheus-remote-write-managed-identity/azure-monitor-account-data-collection-rule.png":::

1. On the resource menu for the data collection rule, select **Access control (IAM)**.

1. Select **Add**, and then select **Add role assignment**.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/data-collection-rule-add-role-assignment.png" alt-text="Screenshot that shows adding a role assignment on Access control pages." lightbox="media/prometheus-remote-write-managed-identity/data-collection-rule-add-role-assignment.png":::

1. Select the **Monitoring Metrics Publisher** role, and then select **Next**.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/add-role-assignment.png" alt-text="Screenshot that shows a list of role assignments." lightbox="media/prometheus-remote-write-managed-identity/add-role-assignment.png":::

1. Select **User, group, or service principal**, and then choose **Select members**. Select the application that you created, and then choose **Select**.

    :::image type="content" source="media/prometheus-remote-write-active-directory/select-application.png" alt-text="Screenshot that shows selecting the application." lightbox="media/prometheus-remote-write-active-directory/select-application.png":::

1. To complete the role assignment, select **Review + assign**.

### Create an Azure key vault and generate a certificate

1. If you don't already have an Azure key vault, [create a vault](../../key-vault/general/quick-create-portal.md#create-a-vault).
1. Create a certificate by using the guidance in [Add a certificate to Key Vault](../../key-vault/certificates/quick-create-portal.md#add-a-certificate-to-key-vault).
1. Download the certificate in CER format by using the guidance in [Export a certificate from Key Vault](../../key-vault/certificates/quick-create-portal.md#export-certificate-from-key-vault).

<a name='add-certificate-to-the-azure-active-directory-application'></a>

### Add a certificate to the Microsoft Entra application

1. On the resource menu for your Microsoft Entra application, select **Certificates & secrets**.
1. On the **Certificates** tab, select **Upload certificate** and select the certificate that you downloaded.

    :::image type="content" source="media/prometheus-remote-write-active-directory/upload-certificate.png" alt-text="Screenshot that shows uploading a certificate for a Microsoft Entra application." lightbox="media/prometheus-remote-write-active-directory/upload-certificate.png":::

> [!WARNING]
> Certificates have an expiration date. It's the responsibility of the user to keep certificates valid.

### Add a CSI driver and storage for the cluster

> [!NOTE]
> Azure Key Vault CSI driver configuration is only one of the ways to get a certificate mounted on a pod. The remote write container needs a local path to a certificate in the pod only for the `<AZURE_CLIENT_CERTIFICATE_PATH>` value in the step [Deploy a sidecar container to set up remote write](#deploy-a-sidecar-container-to-set-up-remote-write).

This step is required only if you didn't turn on Azure Key Vault Provider for Secrets Store CSI Driver when you created your cluster.

1. To turn on Azure Key Vault Provider for Secrets Store CSI Driver for your cluster, run the following Azure CLI command:

    ```azurecli
    az aks enable-addons --addons azure-keyvault-secrets-provider --name <aks-cluster-name> --resource-group <resource-group-name>
    ```

1. To give the identity access to the key vault, run these commands:

    ```azurecli
    # show client id of the managed identity of the cluster
    az aks show -g <resource-group> -n <cluster-name> --query addonProfiles.azureKeyvaultSecretsProvider.identity.clientId -o tsv

    # set policy to access keys in your key vault
    az keyvault set-policy -n <keyvault-name> --key-permissions get --spn <identity-client-id>

    # set policy to access secrets in your key vault
    az keyvault set-policy -n <keyvault-name> --secret-permissions get --spn <identity-client-id>
    
    # set policy to access certs in your key vault
    az keyvault set-policy -n <keyvault-name> --certificate-permissions get --spn <identity-client-id>
    ```

1. Create `SecretProviderClass` by saving the following YAML to a file named *secretproviderclass.yml*. Replace the values for `userAssignedIdentityID`, `keyvaultName`, `tenantId`, and the objects to retrieve from your key vault. For information about what values to use, see [Provide an identity to access the Azure Key Vault Provider for Secrets Store CSI Driver](../../aks/csi-secrets-store-identity-access.md).

    [!INCLUDE [secret-provider-class-yaml](../includes/secret-procider-class-yaml.md)]

1. Apply `SecretProviderClass` by running the following command on your cluster:

    ```bash
    kubectl apply -f secretproviderclass.yml
    ```

### Deploy a sidecar container to set up remote write

1. Copy the following YAML and save it to a file. The YAML uses port 8081 as the listening port. If you use a different port, modify that value in the YAML.

    [!INCLUDE [prometheus-sidecar-remote-write-entra-yaml](../includes/prometheus-sidecar-remote-write-entra-yaml.md)]

1. Replace the following values in the YAML file:

    | Value | Description |
    |:---|:---|
    | `<CLUSTER-NAME>` | The name of your AKS cluster. |
    | `<CONTAINER-IMAGE-VERSION>` | [!INCLUDE [version](../includes/prometheus-remotewrite-image-version.md)]<br>The remote write container image version.   |
    | `<INGESTION-URL>` | The value for **Metrics ingestion endpoint** from the **Overview** page for the Azure Monitor workspace. |
    | `<APP-REGISTRATION -CLIENT-ID>` | The client ID of your application. |
    | `<TENANT-ID>` | The tenant ID of the Microsoft Entra application. |
    | `<CERT-NAME>` | The name of the certificate.  |
    | `<CLUSTER-NAME>` | The name of the cluster that Prometheus is running on. |

1. Open Azure Cloud Shell and upload the YAML file.
1. Use Helm to apply the YAML file and update your Prometheus configuration:

    ```azurecli
    # set the context to your cluster 
    az aks get-credentials -g <aks-rg-name> -n <aks-cluster-name> 
 
    # use Helm to update your remote write config 
    helm upgrade -f <YAML-FILENAME>.yml prometheus prometheus-community/kube-prometheus-stack -namespace <namespace where Prometheus pod resides> 
    ```

## Verification and troubleshooting

For verification and troubleshooting information, see [Troubleshooting remote write](/azure/azure-monitor/containers/prometheus-remote-write-troubleshooting)  and [Azure Monitor managed service for Prometheus remote write](prometheus-remote-write.md#verify-remote-write-is-working-correctly).

## Next steps

- [Collect Prometheus metrics from an AKS cluster](../containers/kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)
- [Learn more about Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md)
- [Remote write in Azure Monitor managed service for Prometheus](prometheus-remote-write.md)
- [Send Prometheus data to Azure Monitor by using managed identity authentication](./prometheus-remote-write-managed-identity.md)
- [Send Prometheus data to Azure Monitor by using Microsoft Entra Workload ID (preview) authentication](./prometheus-remote-write-azure-workload-identity.md)
- [Send Prometheus data to Azure Monitor by using Microsoft Entra pod-managed identity (preview) authentication](./prometheus-remote-write-azure-ad-pod-identity.md)
