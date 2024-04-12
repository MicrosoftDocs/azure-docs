---
title: Use Azure Key Vault Provider for Secrets Store CSI Driver on Azure Red Hat OpenShift
description: This article explains how to use Azure Key Vault Provider for Secrets Store CSI Driver on Azure Red Hat OpenShift.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.date: 05/01/2023
keywords: azure, openshift, red hat, key vault
#Customer intent: I need to understand how to use Azure Key Vault Provider for Secrets Store CSI Driver on Azure Red Hat OpenShift.
---
# Use Azure Key Vault Provider for Secrets Store CSI Driver on Azure Red Hat OpenShift

Azure Key Vault Provider for Secrets Store CSI Driver allows you to get secret contents stored in an [Azure Key Vault instance](../key-vault/general/basic-concepts.md) and use the [Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/introduction.html) to mount them into Kubernetes pods. This article explains how to use Azure Key Vault Provider for Secrets Store CSI Driver on Azure Red Hat OpenShift.

> [!NOTE]
> As an alternative to the open source solution presented in this article, you can use [Azure Arc](../azure-arc/overview.md) to manage your ARO clusters along with its [Azure Key Vault Provider for Secrets Store CSI Driver extension](../azure-arc/kubernetes/tutorial-akv-secrets-provider.md). This method is fully supported by Microsoft and is recommended instead of the open source solution below.

## Prerequisites 

The following prerequisites are required:

- An Azure Red Hat OpenShift cluster (See [Create an Azure Red Hat OpenShift cluster](howto-create-private-cluster-4x.md) to learn more.)
- Azure CLI (logged in)
- Helm 3.x CLI

### Set environment variables

Set the following variables that will be used throughout this procedure:

```
export KEYVAULT_RESOURCE_GROUP=${AZR_RESOURCE_GROUP:-"openshift"}
export KEYVAULT_LOCATION=${AZR_RESOURCE_LOCATION:-"eastus"}
export KEYVAULT_NAME=secret-store-$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 10 | head -n 1)
export AZ_TENANT_ID=$(az account show -o tsv --query tenantId)
```

## Install the Kubernetes Secrets Store CSI Driver

1. Create an ARO project; you'll deploy the CSI Driver into this project:

    ```
    oc new-project k8s-secrets-store-csi
    ```

1. Set SecurityContextConstraints to allow the CSI Driver to run (otherwise, the CSI Driver will not be able to create pods):

    ```
    oc adm policy add-scc-to-user privileged \
      system:serviceaccount:k8s-secrets-store-csi:secrets-store-csi-driver
    ```

1. Add the Secrets Store CSI Driver to your Helm repositories:

    ```
    helm repo add secrets-store-csi-driver \
      https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
    ```

1. Update your Helm repositories:

    ```
    helm repo update
    ```

1. Install the Secrets Store CSI Driver:

    ```
    helm install -n k8s-secrets-store-csi csi-secrets-store \
       secrets-store-csi-driver/secrets-store-csi-driver \
       --version v1.3.1 \
       --set "linux.providersDir=/var/run/secrets-store-csi-providers"
    ```
    Optionally, you can enable autorotation of secrets by adding the following parameters to the command above:

    `--set "syncSecret.enabled=true" --set "enableSecretRotation=true"`

1. Verify that the CSI Driver DaemonSets are running:

    ```
    kubectl --namespace=k8s-secrets-store-csi get pods -l "app=secrets-store-csi-driver"
    ```

    After running the command above, you should see the following:

    ```
    NAME                                               READY   STATUS    RESTARTS   AGE
     csi-secrets-store-secrets-store-csi-driver-cl7dv   3/3     Running   0          57s
     csi-secrets-store-secrets-store-csi-driver-gbz27   3/3     Running   0          57s
    ```

## Deploy Azure Key Vault Provider for Secrets Store CSI Driver

1. Add the Azure Helm repository:

    ```
    helm repo add csi-secrets-store-provider-azure \
       https://azure.github.io/secrets-store-csi-driver-provider-azure/charts
    ```

1. Update your local Helm repositories:

    ```
    helm repo update
    ```

1. Install the Azure Key Vault CSI provider:

    ```
    helm install -n k8s-secrets-store-csi azure-csi-provider \
       csi-secrets-store-provider-azure/csi-secrets-store-provider-azure \
       --set linux.privileged=true --set secrets-store-csi-driver.install=false \
       --set "linux.providersDir=/var/run/secrets-store-csi-providers" \
       --version=v1.4.1
    ```

1. Set SecurityContextConstraints to allow the CSI driver to run:

    ```
    oc adm policy add-scc-to-user privileged \
       system:serviceaccount:k8s-secrets-store-csi:csi-secrets-store-provider-azure
    ```

## Create key vault and a secret

1. Create a namespace for your application.

    ```
    oc new-project my-application
    ```

1. Create an Azure key vault in your resource group that contains ARO.

    ```
    az keyvault create -n ${KEYVAULT_NAME} \
       -g ${KEYVAULT_RESOURCE_GROUP} \
       --location ${KEYVAULT_LOCATION}
    ```

1. Create a secret in the key vault.

    ```
    az keyvault secret set \
       --vault-name ${KEYVAULT_NAME} \
       --name secret1 --value "Hello"
    ```

1. Create a service principal for the key vault.

    > [!NOTE]
    > If you receive an error when creating the service principal, you may need to upgrade your Azure CLI to the latest version.
    
    ```
    export SERVICE_PRINCIPAL_CLIENT_SECRET="$(az ad sp create-for-rbac --skip-assignment --name http://$KEYVAULT_NAME --query 'password' -otsv)"
    export SERVICE_PRINCIPAL_CLIENT_ID="$(az ad sp list --display-name http://$KEYVAULT_NAME --query '[0].appId' -otsv)"
    ```

1. Set an access policy for the service principal.

    ```
    az keyvault set-policy -n ${KEYVAULT_NAME} \
       --secret-permissions get \
       --spn ${SERVICE_PRINCIPAL_CLIENT_ID}
    ```

1. Create and label a secret for Kubernetes to use to access the key vault.

    ```
    kubectl create secret generic secrets-store-creds \
       -n my-application \
       --from-literal clientid=${SERVICE_PRINCIPAL_CLIENT_ID} \
       --from-literal clientsecret=${SERVICE_PRINCIPAL_CLIENT_SECRET}
    kubectl -n my-application label secret \
       secrets-store-creds secrets-store.csi.k8s.io/used=true
    ```

## Deploy an application that uses the CSI Driver

1. Create a `SecretProviderClass` to give access to this secret:

    ```
    cat <<EOF | kubectl apply -f -
     apiVersion: secrets-store.csi.x-k8s.io/v1
     kind: SecretProviderClass
     metadata:
       name: azure-kvname
       namespace: my-application
     spec:
       provider: azure
       parameters:
         usePodIdentity: "false"
         useVMManagedIdentity: "false"
         userAssignedIdentityID: ""
         keyvaultName: "${KEYVAULT_NAME}"
         objects: |
           array:
             - |
               objectName: secret1
               objectType: secret
               objectVersion: ""
         tenantId: "${AZ_TENANT_ID}"
    EOF
    ```

1. Create a pod that uses the `SecretProviderClass` created in the previous step:

    ```
    cat <<EOF | kubectl apply -f -
     kind: Pod
     apiVersion: v1
     metadata:
       name: busybox-secrets-store-inline
       namespace: my-application
     spec:
       containers:
       - name: busybox
         image: k8s.gcr.io/e2e-test-images/busybox:1.29
         command:
           - "/bin/sleep"
           - "10000"
         volumeMounts:
         - name: secrets-store-inline
           mountPath: "/mnt/secrets-store"
           readOnly: true
       volumes:
         - name: secrets-store-inline
           csi:
             driver: secrets-store.csi.k8s.io
             readOnly: true
             volumeAttributes:
               secretProviderClass: "azure-kvname"
             nodePublishSecretRef:
               name: secrets-store-creds
    EOF
    ```

1. Check that the secret is mounted:

    ```
    kubectl exec busybox-secrets-store-inline -- ls /mnt/secrets-store/
    ```

    The output should match the following:

    ```
    secret1
    ```

1. Print the secret:

    ```
    kubectl exec busybox-secrets-store-inline \
       -- cat /mnt/secrets-store/secret1
    ```

    The output should match the following:

    ```azurecli
    Hello
    ```

## Cleanup

Uninstall the Key Vault Provider and the CSI Driver.

### Uninstall the Key Vault Provider

1. Uninstall Helm chart:

    ```azurecli
    helm uninstall -n k8s-secrets-store-csi azure-csi-provider
    ```

1. Delete the app:

    ```
    oc delete project my-application
    ```

1. Delete the Azure key vault:

    ```
    az keyvault delete -n ${KEYVAULT_NAME}
    ```

1. Delete the service principal:

    ```
    az ad sp delete --id ${SERVICE_PRINCIPAL_CLIENT_ID}
    ```

## Uninstall the Kubernetes Secret Store CSI Driver

1. Delete the Secrets Store CSI Driver:

    ```
    helm uninstall -n k8s-secrets-store-csi csi-secrets-store
    oc delete project k8s-secrets-store-csi
    ```

1. Delete the SecurityContextConstraints:

    ```
    oc adm policy remove-scc-from-user privileged \
      system:serviceaccount:k8s-secrets-store-csi:secrets-store-csi-driver
    ```
