---
title: Customize the application routing add-on for Azure Kubernetes Service (AKS)
description: Understand what advanced configuration options are supported with the application routing add-on for Azure Kubernetes Service. 
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 11/03/2023
---

#  Advanced Ingress configurations with the application routing add-on

An Ingress is an API object that defines rules, which allow external access to services in an Azure Kubernetes Service (AKS) cluster. When you create an Ingress object that uses the application routing add-on nginx Ingress classes, the add-on creates, configures, and manages one or more Ingress controllers in your AKS cluster.

This article shows you how to set up an advanced Ingress configuration to encrypt the traffic and use Azure DNS to manage DNS zones.

## Application routing add-on with nginx features

The application routing add-on with nginx delivers the following:

* Easy configuration of managed nginx Ingress controllers based on [Kubernetes nginx Ingress controller][kubernetes-nginx-ingress].
* Integration with an external DNS such as [Azure DNS][azure-dns-overview] for public and private zone management
* SSL termination with certificates stored in a key vault, such as [Azure Key Vault][azure-key-vault-overview].

## Prerequisites

- An AKS cluster with the [application routing add-on][app-routing-add-on-basic-configuration].
- Azure Key Vault if you want to configure SSL termination and store certificates in the vault hosted in Azure.
- Azure DNS if you want to configure public and private zone management and host them in Azure.

## Connect to your AKS cluster

To connect to the Kubernetes cluster from your local computer, you use `kubectl`, the Kubernetes command-line client. You can install it locally using the [az aks install-cli][az-aks-install-cli] command. If you use the Azure Cloud Shell, `kubectl` is already installed.

Configure kubectl to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

```bash
az aks get-credentials -g <ResourceGroupName> -n <ClusterName>
```

## Terminate HTTPS traffic

To enable support for HTTPS traffic, see the following prerequisites:
  
* **azure-keyvault-secrets-provider**: The [Secret Store CSI provider][secret-store-csi-provider] for Azure Key Vault is required to retrieve the certificates from Azure Key Vault.

    > [!IMPORTANT]
    > To enable the add-on to reload certificates from Azure Key Vault when they change, you should to enable the [secret autorotation feature][csi-secrets-store-autorotation] of the Secret Store CSI driver with the `--enable-secret-rotation` argument. When autorotation is enabled, the driver updates the pod mount and the Kubernetes secret by polling for changes periodically, based on the rotation poll interval you define. The default rotation poll interval is two minutes.

* An SSL certificate. If you don't have one, you can [create a certificate][create-and-export-a-self-signed-ssl-certificate].

### Enable key vault secrets provider

To enable application routing on your cluster, use the [`az aks enable-addons`][az-aks-enable-addons] command specifying `azure-keyvault-secrets-provider` with the `--addons` argument and the `--enable-secret-rotation` argument.

```azurecli-interactive
az aks enable-addons -g <ResourceGroupName> -n <ClusterName> --addons azure-keyvault-secrets-provider --enable-secret-rotation
```

### Create an Azure Key Vault to store the certificate

> [!NOTE]
> If you already have an Azure Key Vault, you can skip this step.

Create an Azure Key Vault using the [`az keyvault create`][az-keyvault-create] command.

```azurecli-interactive
az keyvault create -g <ResourceGroupName> -l <Location> -n <KeyVaultName>
```

### Create and export a self-signed SSL certificate

1. Create a self-signed SSL certificate to use with the Ingress using the `openssl req` command. Make sure you replace *`<Hostname>`* with the DNS name you're using.

    ```bash
    openssl req -new -x509 -nodes -out aks-ingress-tls.crt -keyout aks-ingress-tls.key -subj "/CN=<Hostname>" -addext "subjectAltName=DNS:<Hostname>"
    ```

2. Export the SSL certificate and skip the password prompt using the `openssl pkcs12 -export` command.

    ```bash
    openssl pkcs12 -export -in aks-ingress-tls.crt -inkey aks-ingress-tls.key -out aks-ingress-tls.pfx
    ```

### Import certificate into Azure Key Vault

Import the SSL certificate into Azure Key Vault using the [`az keyvault certificate import`][az-keyvault-certificate-import] command. If your certificate is password protected, you can pass the password through the `--password` flag.

```azurecli-interactive
az keyvault certificate import --vault-name <KeyVaultName> -n <KeyVaultCertificateName> -f aks-ingress-tls.pfx [--password <certificate password if specified>]
```

### Retrieve the add-on's managed identity object ID

You use the managed identity in the next steps to grant permissions to manage the Azure DNS zone and retrieve secrets and certificates from the Azure Key Vault.

Get the add-on's managed identity object ID using the [`az aks show`][az-aks-show] command and setting the output to a variable named `MANAGEDIDENTITY_OBJECTID`.

```bash
# Provide values for your environment
RGNAME=<ResourceGroupName>
CLUSTERNAME=<ClusterName>
MANAGEDIDENTITY_OBJECTID=$(az aks show -g ${RGNAME} -n ${CLUSTERNAME} --query ingressProfile.webAppRouting.identity.objectId -o tsv)
```

### Grant the add-on permissions to retrieve certificates from Azure Key Vault

The application routing add-on creates a user-created managed identity in the cluster resource group. You need to grant permissions to the managed identity so it can retrieve SSL certificates from the Azure Key Vault.

Azure Key Vault offers [two authorization systems][authorization-systems]: **Azure role-based access control (Azure RBAC)**, which operates on the management plane, and the **access policy model**, which operates on both the management plane and the data plane. To find out which system your key vault is using, you can query the `enableRbacAuthorization` property.

```azurecli-interactive
az keyvault show --name <KeyVaultName> --query properties.enableRbacAuthorization
```

If Azure RBAC authorization is enabled for your key vault, you should configure permissions using Azure RBAC. Add the `Key Vault Secrets User` role assignment to the key vault by running the following commands.

```azurecli-interactive
KEYVAULTID=$(az keyvault show --name <KeyVaultName> --query "id" --output tsv)
az role assignment create --role "Key Vault Secrets User" --assignee $MANAGEDIDENTITY_OBJECTID --scope $KEYVAULTID
```

If Azure RBAC authorization isn't enabled for your key vault, you should configure permissions using the access policy model. Grant `GET` permissions for the application routing add-on to retrieve certificates from Azure Key Vault using the [`az keyvault set-policy`][az-keyvault-set-policy] command.

```azurecli-interactive
az keyvault set-policy --name <KeyVaultName> --object-id $MANAGEDIDENTITY_OBJECTID --secret-permissions get --certificate-permissions get
```

## Configure the add-on to use Azure DNS to manage DNS zones

To enable support for DNS zones, see the following prerequisites:

* The app routing add-on can be configured to automatically create records on one or more Azure public and private DNS zones for hosts defined on Ingress resources. All global Azure DNS zones need to be in the same resource group, and all private Azure DNS zones need to be in the same resource group. If you don't have an Azure DNS zone, you can [create one][create-an-azure-dns-zone].

   > [!NOTE]
   > If you plan to use Azure DNS, you need to update the add-on to include the `--dns-zone-resource-ids` argument. You can pass a comma separated list of multiple public or private Azure DNS zone resource IDs.

### Create a global Azure DNS zone

1. Create an Azure DNS zone using the [`az network dns zone create`][az-network-dns-zone-create] command.

    ```azurecli-interactive
    az network dns zone create -g <ResourceGroupName> -n <ZoneName>
    ```

1. Retrieve the resource ID for the DNS zone using the [`az network dns zone show`][az-network-dns-zone-show] command and set the output to a variable named *ZONEID*.

    ```azurecli-interactive
    ZONEID=$(az network dns zone show -g <ResourceGroupName> -n <ZoneName> --query "id" --output tsv)
    ```

1. Grant **DNS Zone Contributor** permissions on the DNS zone using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment create --role "DNS Zone Contributor" --assignee $MANAGEDIDENTITY_OBJECTID --scope $ZONEID
    ```

1. Update the add-on to enable the integration with Azure DNS and install the **external-dns** controller using the [`az aks addon update`][az-aks-addon-update] command.

    ```azurecli-interactive
    az aks addon update -g <ResourceGroupName> -n <ClusterName> --addon web_application_routing --dns-zone-resource-ids=$ZONEID
    ```

## Create the Ingress

The application routing add-on creates an Ingress class on the cluster named *webapprouting.kubernetes.azure.com*. When you create an Ingress object with this class, it activates the add-on.

1. Get the certificate URI to use in the Ingress from Azure Key Vault using the [`az keyvault certificate show`][az-keyvault-certificate-show] command.

    ```azurecli-interactive
    az keyvault certificate show --vault-name <KeyVaultName> -n <KeyVaultCertificateName> --query "id" --output tsv
    ```

2. Copy the following YAML manifest into a new file named **ingress.yaml** and save the file to your local computer.

    > [!NOTE]
    > Update *`<Hostname>`* with your DNS host name and *`<KeyVaultCertificateUri>`* with the ID returned from Azure Key Vault.
    > The *`secretName`* key in the `tls` section defines the name of the secret that contains the certificate for this Ingress resource. This certificate will be presented in the browser when a client browses to the URL defined in the `<Hostname>` key. Make sure that the value of `secretName` is equal to `keyvault-` followed by the value of the Ingress resource name (from `metadata.name`). In the example YAML, secretName will need to be equal to `keyvault-<your Ingress name>`.

    ```yml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      annotations:
        kubernetes.azure.com/tls-cert-keyvault-uri: <KeyVaultCertificateUri>
      name: aks-helloworld
      namespace: hello-web-app-routing
    spec:
      ingressClassName: webapprouting.kubernetes.azure.com
      rules:
     - host: <Hostname>
        http:
          paths:
          - backend:
              service:
                name: aks-helloworld
                port:
                  number: 80
            path: /
            pathType: Prefix
      tls:
     - hosts:
        - <Hostname>
        secretName: keyvault-<your ingress name>
    ```

3. Create the cluster resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f ingress.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resource:

    ```output
    Ingress.networking.k8s.io/aks-helloworld created
    ```

## Verify the managed Ingress was created

You can verify the managed Ingress was created using the [`kubectl get ingress`][kubectl-get] command.

```bash
kubectl get ingress -n hello-web-app-routing
```

The following example output shows the created managed Ingress:

```output
NAME             CLASS                                HOSTS               ADDRESS       PORTS     AGE
aks-helloworld   webapprouting.kubernetes.azure.com   myapp.contoso.com   20.51.92.19   80, 443   4m
```

## Next steps

Learn about monitoring the Ingress-nginx controller metrics included with the application routing add-on with [with Prometheus in Grafana][prometheus-in-grafana] (preview) as part of analyzing the performance and usage of your application.

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[app-routing-add-on-basic-configuration]: app-routing.md
[secret-store-csi-provider]: csi-secrets-store-driver.md
[csi-secrets-store-autorotation]: csi-secrets-store-configuration-options.md#enable-and-disable-auto-rotation
[az-keyvault-set-policy]: /cli/azure/keyvault#az-keyvault-set-policy
[azure-key-vault-overview]: ../key-vault/general/overview.md
[az-aks-addon-update]: /cli/azure/aks/addon#az-aks-addon-update
[az-network-dns-zone-show]: /cli/azure/network/dns/zone#az-network-dns-zone-show
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-network-dns-zone-create]: /cli/azure/network/dns/zone#az-network-dns-zone-create
[az-keyvault-certificate-import]: /cli/azure/keyvault/certificate#az-keyvault-certificate-import
[az-keyvault-create]: /cli/azure/keyvault#az-keyvault-create
[authorization-systems]: ../key-vault/general/rbac-access-policy.md
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[create-and-export-a-self-signed-ssl-certificate]: #create-and-export-a-self-signed-ssl-certificate
[create-an-azure-dns-zone]: #create-a-global-azure-dns-zone
[azure-dns-overview]: ../dns/dns-overview.md
[az-keyvault-certificate-show]: /cli/azure/keyvault/certificate#az-keyvault-certificate-show
[az-aks-enable-addons]: /cli/azure/aks/addon#az-aks-enable-addon
[az-aks-show]: /cli/azure/aks/addon#az-aks-show
[prometheus-in-grafana]: app-routing-nginx-prometheus.md