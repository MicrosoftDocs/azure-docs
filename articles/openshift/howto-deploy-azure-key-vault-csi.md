---
title: Deploy Azure Key Vault CSI on Azure Red Hat OpenShift 
description: This article explains how to deploy Azure Key Vault CSI on Azure Red Hat OpenShift.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.date: 11/07/2022
keywords: azure, openshift, red hat, key vault
#Customer intent: I need to understand how to deploy Azure Key Vault CSI on Azure Red Hat OpenShift.
---
# Deploy Azure Key Vault CSI on Azure Red Hat OpenShift

This article explains how to deploy Azure Key Vault CSI on Azure Red Hat OpenShift.

## Prerequisites 

The following prerequisites are required:

- An Azure Red Hat OpenShift cluster (Follow this guide to [create a private Azure Red Hat OpenShift cluster.](howto-create-private-cluster-4x.md)
- Azure CLI (logged in)
- Helm 3.x CLI

### Set environment variables

Run the following command to set some environment variables that will be used through this procedure:

```azurecli
export KEYVAULT_RESOURCE_GROUP=${AZR_RESOURCE_GROUP:-"openshift"}
export KEYVAULT_LOCATION=${AZR_RESOURCE_LOCATION:-"eastus"}
export KEYVAULT_NAME=secret-store-$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 10 | head -n 1)
export AZ_TENANT_ID=$(az account show -o tsv --query tenantId)
```

## Install the Kubernetes Secret Store CSI

1. Create an ARO project; you'll deploy the CSI into this project:

    ```azurecli
    oc new-project k8s-secrets-store-csi
    ```

1. Set SecurityContextConstraints to allow the CSI driver to run (otherwise, the DaemonSet will not be able to create Pods):

    ```azurecli
    oc adm policy add-scc-to-user privileged \
      system:serviceaccount:k8s-secrets-store-csi:secrets-store-csi-driver
    ```

1. Add the Secrets Store CSI driver to your Helm repositories:

    ```azurecli
    helm repo add secrets-store-csi-driver \
      https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
    ```

1. Update your Helm repositories:

    ```azurecli
    helm repo update
    ```

1. Install the Secrets Store CSI driver:

    ```azurecli
    helm install -n k8s-secrets-store-csi csi-secrets-store \
       secrets-store-csi-driver/secrets-store-csi-driver \
       --version v1.0.1 \
       --set "linux.providersDir=/var/run/secrets-store-csi-providers"
    ```

1. Verify that the DaemonSets are running:

    ```azurecli
    kubectl --namespace=k8s-secrets-store-csi get pods -l "app=secrets-store-csi-driver"
    ```

    After running the command above, you should see the following:

    ```azurecli
    NAME                                               READY   STATUS    RESTARTS   AGE
     csi-secrets-store-secrets-store-csi-driver-cl7dv   3/3     Running   0          57s
     csi-secrets-store-secrets-store-csi-driver-gbz27   3/3     Running   0          57s
    ```

## Deploy Azure Key Store CSI

1. Add the Azure Helm repository:

    ```azurecli
    helm repo add csi-secrets-store-provider-azure \
       https://azure.github.io/secrets-store-csi-driver-provider-azure/charts
    ```

1. Update your local Help repositories:

    ```azurecli
    helm repo update
    ```

1. Install the Azure Key Vault CSI provider:

    ```azurecli
    helm install -n k8s-secrets-store-csi azure-csi-provider \
       csi-secrets-store-provider-azure/csi-secrets-store-provider-azure \
       --set linux.privileged=true --set secrets-store-csi-driver.install=false \
       --set "linux.providersDir=/var/run/secrets-store-csi-providers" \
       --version=v1.0.1
    ```

1. Set SecurityContextConstraints to allow the CSI driver to run:

    ```azurecli
    oc adm policy add-scc-to-user privileged \
       system:serviceaccount:k8s-secrets-store-csi:csi-secrets-store-provider-azure
    ```

## Create key vault and a secret

1. Create a namespace for your application.

    ```azurecli
    oc new-project my-application
    ```

1. Create an Azure key vault in your resource group that contains ARO.

    ```azurecli
    az keyvault create -n ${KEYVAULT_NAME} \
       -g ${KEYVAULT_RESOURCE_GROUP} \
       --location ${KEYVAULT_LOCATION}
    ```

1. Create a secret in the key vault.

    ```azurecli
    az keyvault secret set \
       --vault-name ${KEYVAULT_NAME} \
       --name secret1 --value "Hello"
    ```

1. Create a service principal for the key vault.

    > [!NOTE]
    > If you receive an error when creating the service principal, you may need to upgrade your Azure CLI to the latest version.
    
    ```azurecli
    export SERVICE_PRINCIPAL_CLIENT_SECRET="$(az ad sp create-for-rbac --skip-assignment --name http://$KEYVAULT_NAME --query 'password' -otsv)"
    export SERVICE_PRINCIPAL_CLIENT_ID="$(az ad sp list --display-name http://$KEYVAULT_NAME --query '[0].appId' -otsv)"
    ```

1. Set an access policy for the service principal.

    ```azurecli
    az keyvault set-policy -n ${KEYVAULT_NAME} \
   --secret-permissions get \
   --spn ${SERVICE_PRINCIPAL_CLIENT_ID}
    ```

1. Create and label a secret for Kubernetes to use to access the key vault.

    ```azurecli
    kubectl create secret generic secrets-store-creds \
       -n my-application \
       --from-literal clientid=${SERVICE_PRINCIPAL_CLIENT_ID} \
       --from-literal clientsecret=${SERVICE_PRINCIPAL_CLIENT_SECRET}
     kubectl -n my-application label secret \
       secrets-store-creds secrets-store.csi.k8s.io/used=true
    ```


## Deploy an application that uses the CSI

1. Create a Secret Provider Class to give access to this secret:

    ```azurecli
    cat <<EOF | kubectl apply -f -
     apiVersion: secrets-store.csi.x-k8s.io/v1alpha1
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

1. Create a Pod that uses the Secret Provider Class created in the previous step:

```azurecli
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

    ```azurecli
    kubectl exec busybox-secrets-store-inline -- ls /mnt/secrets-store/
    ```

    The output should match the following:

    ```azurecli
    secret1
    ```

1. Print the secret:

    ```azurecli
    kubectl exec busybox-secrets-store-inline \
       -- cat /mnt/secrets-store/secret1
    ```

    The output should match the following:

    ```azurecli
    Hello
    ```

## Cleanup

1. Uninstall Helm:

    ```azurecli
    helm uninstall -n k8s-secrets-store-csi azure-csi-provider
    ```

1. Delete the app:

    ```azurecli
    oc delete project my-application
    ```

1. Delete the Azure Key Vault:

    ```azurecli
    az keyvault delete -n ${KEYVAULT_NAME}
    ```

1. Delete the service principal:

    ```azurecli
    az ad sp delete --id ${SERVICE_PRINCIPAL_CLIENT_ID}
    ```

## Uninstall the Kubernetes Secret Store CSI

1. Delete the Secrets Store CSI driver:

    ```azurecli
    helm delete -n k8s-secrets-store-csi csi-secrets-store
    ```

1. Delete the SecurityContextConstraints:

    ```azurecli
    oc adm policy remove-scc-from-user privileged \
      system:serviceaccount:k8s-secrets-store-csi:secrets-store-csi-driver
    ```




