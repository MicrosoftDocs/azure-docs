---
title: Remote-write in Azure Monitor Managed Service for Prometheus using Azure Active Directory
description: Describes how to configure remote-write to send data from self-managed Prometheus running in your Kubernetes cluster running on-premises or in another cloud using Azure Active Directory authentication. 
author: EdB-MSFT
ms.topic: conceptual
ms.date: 11/01/2022
---

# Configure remote write for Azure Monitor managed service for Prometheus using Azure Active Directory authentication
This article describes how to configure [remote-write](prometheus-remote-write.md) to send data from self-managed Prometheus running in your AKS cluster or Azure Arc-enabled Kubernetes cluster using Azure Active Directory authentication.

## Cluster configurations
This article applies to the following cluster configurations:

- Azure Kubernetes service (AKS)
- Azure Arc-enabled Kubernetes cluster
- Kubernetes cluster running in another cloud or on-premises

> [!NOTE]
> For Azure Kubernetes service (AKS) or Azure Arc-enabled Kubernetes cluster, managed identify authentication is recommended. See [Azure Monitor managed service for Prometheus remote write - managed identity](prometheus-remote-write-managed-identity.md).

## Prerequisites
See prerequisites at [Azure Monitor managed service for Prometheus remote write](prometheus-remote-write.md#prerequisites).

## Create Azure Active Directory application
Follow the procedure at [Register an application with Azure AD and create a service principal](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) to register an application for Prometheus remote-write and create a service principal.


## Get the client ID of the Azure Active Directory application.

1. From the **Azure Active Directory** menu in Azure Portal, select **App registrations**.
2. Locate your application and note the client ID.

    :::image type="content" source="media/prometheus-remote-write-active-directory/application-client-id.png" alt-text="Screenshot showing client ID of Azure Active Directory application." lightbox="media/prometheus-remote-write-active-directory/application-client-id.png":::

## Assign Monitoring Metrics Publisher role on the data collection rule to the application
The application requires the *Monitoring Metrics Publisher* role on the data collection rule associated with your Azure Monitor workspace.

1. From the menu of your Azure Monitor Workspace account, click the **Data collection rule** to open the **Overview** page for the data collection rule.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/azure-monitor-account-data-collection-rule.png" alt-text="Screenshot showing data collection rule used by Azure Monitor workspace." lightbox="media/prometheus-remote-write-managed-identity/azure-monitor-account-data-collection-rule.png":::

2. Click on **Access control (IAM)** in the **Overview** page for the data collection rule.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/azure-monitor-account-access-control.png" alt-text="Screenshot showing Access control (IAM) menu item on the data collection rule Overview page." lightbox="media/prometheus-remote-write-managed-identity/azure-monitor-account-access-control.png":::

3. Click **Add** and then **Add role assignment**.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/data-collection-rule-add-role-assignment.png" alt-text="Screenshot showing adding a role assignment on Access control pages." lightbox="media/prometheus-remote-write-managed-identity/data-collection-rule-add-role-assignment.png":::

4. Select **Monitoring Metrics Publisher** role and click **Next**.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/add-role-assignment.png" alt-text="Screenshot showing list of role assignments." lightbox="media/prometheus-remote-write-managed-identity/add-role-assignment.png":::

5. Select **User, group, or service principal** and then click **Select members**. Select the application that you created and click **Select**.

    :::image type="content" source="media/prometheus-remote-write-active-directory/select-application.png" alt-text="Screenshot showing selection of application." lightbox="media/prometheus-remote-write-active-directory/select-application.png":::

6. Click **Review + assign** to complete the role assignment.


## Create an Azure key vault and generate certificate

1. If you don't already have an Azure key vault, then create a new one using the guidance at [Create a vault](../../key-vault/general/quick-create-portal.md#create-a-vault).
2. Create a certificate using the guidance at [Add a certificate to Key Vault](../../key-vault/certificates/quick-create-portal.md#add-a-certificate-to-key-vault).
3. Download the newly generated certificate in CER format using the guidance at [Export certificate from Key Vault](../../key-vault/certificates/quick-create-portal.md#export-certificate-from-key-vault).

## Add certificate to the Azure Active Directory application

1. From the menu for your Azure Active Directory application, select **Certificates & secrets**.
2. Click **Upload certificate** and select the certificate that you downloaded.

    :::image type="content" source="media/prometheus-remote-write-active-directory/upload-certificate.png" alt-text="Screenshot showing upload of certificate for Azure Active Directory application." lightbox="media/prometheus-remote-write-active-directory/upload-certificate.png":::

> [!WARNING]
> Certificates have an expiration date, and it's the responsibility of the user to keep these certificates valid.

## Add CSI driver and storage for cluster

> [!NOTE]
> Azure Key Vault CSI driver configuration is just one of the ways to get certificate mounted on the pod. The remote write container only needs a local path to a certificate in the pod for the setting `AZURE_CLIENT_CERTIFICATE_PATH` value in the [Deploy Side car and configure remote write on the Prometheus server](#deploy-side-car-and-configure-remote-write-on-the-prometheus-server) step below.

This step is only required if you didn't enable Azure Key Vault Provider for Secrets Store CSI Driver when you created your cluster.

1. Run the following Azure CLI command to enable Azure Key Vault Provider for Secrets Store CSI Driver for your cluster.

    ```azurecli
    az aks enable-addons --addons azure-keyvault-secrets-provider --name <aks-cluster-name> --resource-group <resource-group-name>
    ```

2. Run the following commands to give the identity access to the key vault.

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

3. Create a *SecretProviderClass* by saving the following YAML to a file named *secretproviderclass.yml*. Replace the values for `userAssignedIdentityID`, `keyvaultName`, `tenantId` and the objects to retrieve from your key vault. See [Provide an identity to access the Azure Key Vault Provider for Secrets Store CSI Driver](../../aks/csi-secrets-store-identity-access.md) for details on values to use.

    ```yml
    # This is a SecretProviderClass example using user-assigned identity to access your key vault
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
    name: azure-kvname-user-msi
    spec:
    provider: azure
    parameters:
        usePodIdentity: "false"
        useVMManagedIdentity: "true"          # Set to true for using managed identity
        userAssignedIdentityID:  <client-id> # Set the clientID of the user-assigned managed identity to use
        keyvaultName: <key-vault-name> # Set to the name of your key vault
        cloudName: ""                         # [OPTIONAL for Azure] if not provided, the Azure environment defaults to AzurePublicCloud
        objects:  |
        array:
            - |
            objectName: <name-of-cert>
            objectType: secret        # object types: secret, key, or cert
            objectFormat: pfx
            objectEncoding: base64
            objectVersion: ""
        tenantId: <tenant-id> # The tenant ID of the key vault
    ```

4. Apply the *SecretProviderClass* by running the following command on your cluster.

    ```
    kubectl apply -f secretproviderclass.yml
    ```

## Deploy Side car and configure remote write on the Prometheus server

1. Copy the YAML below and save to a file. This YAML assumes you're using 8081 as your listening port. Modify that value if you use a different port.


    ```yml
    prometheus:
      prometheusSpec:
        externalLabels:
          cluster: <CLUSTER-NAME>  
  
        ##	Azure Managed Prometheus currently exports some default mixins in Grafana.  
        ##  These mixins are compatible with data scraped by Azure Monitor agent on your 
        ##  Azure Kubernetes Service cluster. These mixins aren't compatible with Prometheus 
        ##  metrics scraped by the Kube Prometheus stack. 
        ##  To make these mixins compatible, uncomment the remote write relabel configuration below:

	      ##	writeRelabelConfigs:
	      ##	  - sourceLabels: [metrics_path]
	      ##	    regex: /metrics/cadvisor
	      ##	    targetLabel: job
	      ##	    replacement: cadvisor
	      ##	    action: replace
	      ##	  - sourceLabels: [job]
	      ##	    regex: 'node-exporter'
	      ##	    targetLabel: job
	      ##	    replacement: node
	      ##	    action: replace  

        ## https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write
        remoteWrite:
          - url: 'http://localhost:8081/api/v1/write'
        
        # Additional volumes on the output StatefulSet definition.
        # Required only for AAD based auth
        volumes:
          - name: secrets-store-inline
        csi:
          driver: secrets-store.csi.k8s.io
          readOnly: true
          volumeAttributes:
            secretProviderClass: azure-kvname-user-msi
        containers:
          - name: prom-remotewrite
            image: <CONTAINER-IMAGE-VERSION>
            imagePullPolicy: Always

            # Required only for AAD based auth
            volumeMounts:
              - name: secrets-store-inline
                mountPath: /mnt/secrets-store
                readOnly: true
            ports:
              - name: rw-port
                containerPort: 8081
            livenessProbe:
              httpGet:
                path: /health
                port: rw-port
                initialDelaySeconds: 10
                timeoutSeconds: 10
            readinessProbe:
              httpGet:
                path: /ready
                port: rw-port
                initialDelaySeconds: 10
                timeoutSeconds: 10
            env:
              - name: INGESTION_URL
                value: '<INGESTION_URL>'
              - name: LISTENING_PORT
                value: '8081'
              - name: IDENTITY_TYPE
                value: aadApplication
              - name: AZURE_CLIENT_ID
                value: '<APP-REGISTRATION-CLIENT-ID>'
              - name: AZURE_TENANT_ID
                value: '<TENANT-ID>'
              - name: AZURE_CLIENT_CERTIFICATE_PATH
                value: /mnt/secrets-store/<CERT-NAME>
              - name: CLUSTER
                value: '<CLUSTER-NAME>'
    ```


2. Replace the following values in the YAML.

    | Value | Description |
    |:---|:---|
    | `<CLUSTER-NAME>` | Name of your AKS cluster |
    | `<CONTAINER-IMAGE-VERSION>` | `mcr.microsoft.com/azuremonitor/prometheus/promdev/prom-remotewrite:prom-remotewrite-20230505.1`<br>This is the remote write container image version.   |
    | `<INGESTION-URL>` | **Metrics ingestion endpoint** from the **Overview** page for the Azure Monitor workspace |
    | `<APP-REGISTRATION -CLIENT-ID> ` | Client ID of your application |
    | `<TENANT-ID> ` | Tenant ID of the Azure Active Directory application |
    | `<CERT-NAME>` | Name of the certificate  |
    | `<CLUSTER-NAME>` | Name of the cluster Prometheus is running on |

    



3. Open Azure Cloud Shell and upload the YAML file.
4. Use helm to apply the YAML file to update your Prometheus configuration with the following CLI commands. 

    ```azurecli
    # set context to your cluster 
    az aks get-credentials -g <aks-rg-name> -n <aks-cluster-name> 
 
    # use helm to update your remote write config 
    helm upgrade -f <YAML-FILENAME>.yml prometheus prometheus-community/kube-prometheus-stack -namespace <namespace where Prometheus pod resides> 
    ```

## Verification and troubleshooting
See [Azure Monitor managed service for Prometheus remote write](prometheus-remote-write.md#verify-remote-write-is-working-correctly).

## Next steps

= [Setup Grafana to use Managed Prometheus as a data source](../essentials/prometheus-grafana.md).
- [Learn more about Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md).
